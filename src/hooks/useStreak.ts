"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { fireStreakCelebration } from "@/lib/confetti";
import { hapticSuccess } from "@/lib/haptics";
import {
  claimStreak,
  doualaToday,
  getServerSnapshot,
  getSnapshot,
  subscribe,
  syncStreak,
  type ClaimResult,
  type StreakStatus,
} from "@/lib/streakStore";

export interface StreakDayItem {
  day: string;
  status: "active" | "frozen" | "upcoming";
  label: string;
}

const baseDays = [
  { day: "S", label: "Sunday" },
  { day: "M", label: "Monday" },
  { day: "T", label: "Tuesday" },
  { day: "W", label: "Wednesday" },
  { day: "TH", label: "Thursday" },
  { day: "F", label: "Friday" },
  { day: "S", label: "Saturday" },
];

/** Adds `n` days to a YYYY-MM-DD date (pure date maths, no time zone). */
function addDays(isoDate: string, n: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/**
 * Streak state shared by every component on the page.
 *
 * Rules are enforced by the server (`claim_daily_streak` / `sync_streak`):
 * one claim per Cameroon day, a missed day uses a freeze, no freeze left
 * resets the streak to 0, and freezes refill to 2 every Monday.
 */
export function useStreak() {
  const { state, status, pending } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    void syncStreak();
  }, []);

  const weeklyDays = useMemo<StreakDayItem[]>(() => {
    const today = state?.today ?? doualaToday();
    const dow = new Date(`${today}T00:00:00Z`).getUTCDay(); // 0 = Sunday
    const sunday = addDays(today, -dow);
    const kinds = new Map((state?.week ?? []).map((d) => [d.day, d.kind]));
    return baseDays.map((d, idx) => {
      const kind = kinds.get(addDays(sunday, idx));
      return { ...d, status: kind ?? "upcoming" };
    });
  }, [state]);

  const claimDailyStreak = useCallback(async (): Promise<ClaimResult> => {
    const result = await claimStreak();
    if (result.success) {
      hapticSuccess();
      fireStreakCelebration();
    }
    return result;
  }, []);

  const isTodayClaimed = Boolean(state?.claimedToday && state.today === doualaToday());

  return {
    streakCount: state?.streakCount ?? 0,
    freezesRemaining: state?.freezesRemaining ?? 2,
    isTodayClaimed,
    /** True when today is covered by a freeze rather than activity. */
    isFrozen:
      weeklyDays[new Date(`${state?.today ?? doualaToday()}T00:00:00Z`).getUTCDay()]?.status === "frozen",
    weeklyDays,
    claimDailyStreak,
    /** "offline" while showing cached state; `pending` claims are waiting to sync. */
    status: status as StreakStatus,
    pendingClaims: pending,
    wasReset: Boolean(state?.wasReset),
  };
}
