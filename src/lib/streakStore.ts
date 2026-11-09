/**
 * Client-side streak store.
 *
 * The server owns streak rules (see supabase/migrations/20261109_01_streak_functions.sql):
 * this module only calls `sync_streak` / `claim_daily_streak`, shares the
 * result across every component, keeps the last known state for offline use,
 * and queues claims made offline so they are sent when the phone reconnects.
 *
 * Offline claims are sent with the Cameroon (Africa/Douala) date they happened
 * on. The server accepts today or yesterday, so a student who studies offline
 * and only gets signal the next day keeps their streak.
 */

import { createClient } from "@/utils/supabase/client";

export type StreakDayKind = "active" | "frozen";

export interface StreakState {
  streakCount: number;
  freezesRemaining: number;
  claimedToday: boolean;
  /** Douala date (YYYY-MM-DD) the server considers "today". */
  today: string;
  /** Active/frozen days in the current Sunday–Saturday week. */
  week: { day: string; kind: StreakDayKind }[];
  /** True when the last sync reset the streak to 0. */
  wasReset: boolean;
}

export type StreakStatus = "loading" | "ready" | "offline" | "error";

interface StoreSnapshot {
  state: StreakState | null;
  status: StreakStatus;
  /** Claims waiting to be sent (offline). */
  pending: number;
}

interface ServerStreakState {
  streak_count: number;
  freezes_remaining: number;
  claimed_today: boolean;
  today: string;
  week: { day: string; kind: StreakDayKind }[] | null;
  was_reset: boolean;
}

// ─── Douala calendar date ────────────────────────────────────────────────

const doualaFormatter =
  typeof Intl !== "undefined"
    ? new Intl.DateTimeFormat("en-CA", {
        timeZone: "Africa/Douala",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : null;

/** Today's date in Cameroon as YYYY-MM-DD, independent of the phone's time zone. */
export function doualaToday(now: Date = new Date()): string {
  if (doualaFormatter) return doualaFormatter.format(now);
  // Fallback: Douala is UTC+1 all year (no daylight saving).
  return new Date(now.getTime() + 60 * 60 * 1000).toISOString().slice(0, 10);
}

// ─── Per-user local persistence ──────────────────────────────────────────

const stateKey = (userId: string) => `ticha_streak_state:${userId}`;
const pendingKey = (userId: string) => `ticha_streak_pending:${userId}`;

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked: the in-memory state still works.
  }
}

function readPending(userId: string): string[] {
  const days = readJson<string[]>(pendingKey(userId));
  return Array.isArray(days) ? days.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)) : [];
}

// ─── Store ───────────────────────────────────────────────────────────────

let snapshot: StoreSnapshot = { state: null, status: "loading", pending: 0 };
let currentUserId: string | null = null;
let inflightSync: Promise<void> | null = null;
/** Every component using the streak asks for a sync on mount; one per window is enough. */
const SYNC_MIN_INTERVAL_MS = 30_000;
let lastSyncAt = 0;
let lastSyncUserId: string | null = null;
let onlineListenerAttached = false;
const listeners = new Set<() => void>();

function setSnapshot(next: Partial<StoreSnapshot>): void {
  snapshot = { ...snapshot, ...next };
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): StoreSnapshot {
  return snapshot;
}

const SERVER_SNAPSHOT: StoreSnapshot = { state: null, status: "loading", pending: 0 };
export function getServerSnapshot(): StoreSnapshot {
  return SERVER_SNAPSHOT;
}

function fromServer(raw: ServerStreakState): StreakState {
  return {
    streakCount: Number(raw.streak_count) || 0,
    freezesRemaining: Number(raw.freezes_remaining) || 0,
    claimedToday: Boolean(raw.claimed_today),
    today: String(raw.today),
    week: Array.isArray(raw.week) ? raw.week : [],
    wasReset: Boolean(raw.was_reset),
  };
}

function isNetworkError(err: unknown): boolean {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return true;
  const message = err instanceof Error ? err.message : String((err as { message?: string })?.message ?? err);
  return /failed to fetch|network|load failed|fetch failed/i.test(message);
}

function applyServerState(userId: string, state: StreakState): void {
  writeJson(stateKey(userId), state);
  setSnapshot({ state, status: "ready", pending: readPending(userId).length });
}

async function resolveUserId(): Promise<string | null> {
  // getSession() reads the stored session without a network call, so this
  // also works offline.
  const { data } = await createClient().auth.getSession();
  return data.session?.user.id ?? null;
}

/** Sends queued offline claims, oldest first. Stops at the first network failure. */
async function flushPending(userId: string): Promise<void> {
  const supabase = createClient();
  const today = doualaToday();
  const yesterday = doualaToday(new Date(Date.now() - 24 * 60 * 60 * 1000));

  for (const day of readPending(userId).sort()) {
    // Claims older than yesterday can no longer count; drop them.
    if (day !== today && day !== yesterday) {
      writeJson(pendingKey(userId), readPending(userId).filter((d) => d !== day));
      continue;
    }
    const { data, error } = await supabase.rpc("claim_daily_streak", { p_day: day });
    if (error) {
      if (isNetworkError(error)) throw error;
      // Rejected by the server (e.g. the day became too old): drop it.
      console.warn("[streak] dropping queued claim", day, error.message);
    } else if (data) {
      writeJson(stateKey(userId), fromServer(data as ServerStreakState));
    }
    writeJson(pendingKey(userId), readPending(userId).filter((d) => d !== day));
  }
}

/**
 * Loads streak state: shows the cached copy immediately, then sends any
 * queued claims and asks the server for the current state.
 * Concurrent calls share one request.
 */
export function syncStreak(options: { force?: boolean } = {}): Promise<void> {
  if (inflightSync) return inflightSync;
  // Throttle by last *attempt*, so offline mounts don't retry in a burst either.
  // Reconnecting (the "online" event) and a different signed-in student bypass it.
  if (
    !options.force &&
    lastSyncUserId !== null &&
    lastSyncUserId === currentUserId &&
    Date.now() - lastSyncAt < SYNC_MIN_INTERVAL_MS
  ) {
    return Promise.resolve();
  }

  inflightSync = (async () => {
    const userId = await resolveUserId();
    if (!userId) {
      setSnapshot({ state: null, status: "ready", pending: 0 });
      return;
    }

    if (userId !== currentUserId) {
      currentUserId = userId;
      // Another student's state must never show on a shared phone.
      setSnapshot({
        state: readJson<StreakState>(stateKey(userId)),
        status: "loading",
        pending: readPending(userId).length,
      });
    }

    lastSyncAt = Date.now();
    lastSyncUserId = userId;

    try {
      await flushPending(userId);
      const { data, error } = await createClient().rpc("sync_streak");
      if (error) throw error;
      applyServerState(userId, fromServer(data as ServerStreakState));
    } catch (err) {
      if (isNetworkError(err)) {
        setSnapshot({ status: "offline", pending: readPending(userId).length });
      } else {
        console.error("[streak] sync failed:", err);
        setSnapshot({ status: "error" });
      }
    }
  })().finally(() => {
    inflightSync = null;
  });

  attachOnlineListener();
  return inflightSync;
}

function attachOnlineListener(): void {
  if (onlineListenerAttached || typeof window === "undefined") return;
  onlineListenerAttached = true;
  window.addEventListener("online", () => {
    void syncStreak({ force: true });
  });
}

export interface ClaimResult {
  success: boolean;
  /** True when the claim was saved on the phone and will be sent later. */
  queued?: boolean;
  newStreak?: number;
  message?: string;
}

/** Records today's study activity. Works offline (queued). */
export async function claimStreak(): Promise<ClaimResult> {
  const userId = currentUserId ?? (await resolveUserId());
  if (!userId) return { success: false, message: "Sign in to keep your streak." };
  currentUserId = userId;

  const current = snapshot.state;
  if (current?.claimedToday && current.today === doualaToday()) {
    return { success: false, message: "Daily streak already claimed for today!" };
  }

  try {
    const { data, error } = await createClient().rpc("claim_daily_streak");
    if (error) throw error;
    const state = fromServer(data as ServerStreakState);
    applyServerState(userId, state);
    return { success: true, newStreak: state.streakCount };
  } catch (err) {
    if (!isNetworkError(err)) {
      console.error("[streak] claim failed:", err);
      return { success: false, message: "Couldn't save your streak. Please try again." };
    }

    // Offline: queue the claim with today's Douala date and show it optimistically.
    const today = doualaToday();
    const pending = readPending(userId);
    if (!pending.includes(today)) writeJson(pendingKey(userId), [...pending, today]);

    const base: StreakState = current ?? {
      streakCount: 0,
      freezesRemaining: 2,
      claimedToday: false,
      today,
      week: [],
      wasReset: false,
    };
    const optimistic: StreakState = {
      ...base,
      today,
      claimedToday: true,
      streakCount: base.claimedToday && base.today === today ? base.streakCount : base.streakCount + 1,
      week: base.week.some((d) => d.day === today) ? base.week : [...base.week, { day: today, kind: "active" }],
    };
    writeJson(stateKey(userId), optimistic);
    setSnapshot({ state: optimistic, status: "offline", pending: readPending(userId).length });
    return { success: true, queued: true, newStreak: optimistic.streakCount };
  }
}

/** Clears in-memory state on sign-out so the next student starts clean. */
export function resetStreakStore(): void {
  currentUserId = null;
  lastSyncAt = 0;
  lastSyncUserId = null;
  setSnapshot({ state: null, status: "loading", pending: 0 });
}
