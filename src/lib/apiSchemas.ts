import { z } from "zod";
import { CAMEROON_GCE_SUBJECTS } from "@/data/gceSubjects";
import { ALL_AVAILABLE_SUBJECTS } from "@/lib/gceSyllabusData";

/**
 * Server-side request schemas and normalisers for API routes.
 * Client form schemas live in `@/lib/validation`.
 */

// ─── Education level ───────────────────────────────────────────────────────

export type EducationLevel = "ol" | "al" | "university";

/**
 * Maps the many spellings the client uses ("ol", "GCE O Level", "o-level", …)
 * to a canonical level. Returns null for anything unrecognised.
 */
export function normalizeEducationLevel(value: unknown): EducationLevel | null {
  if (typeof value !== "string") return null;
  const v = value.trim().toLowerCase();
  if (!v || v.length > 40) return null;
  if (v === "ol" || v.includes("o level") || v.includes("o-level") || v.includes("ordinary")) return "ol";
  if (v === "al" || v.includes("a level") || v.includes("a-level") || v.includes("advanced")) return "al";
  if (v === "university" || v.includes("univ")) return "university";
  return null;
}

// ─── GCE subjects ──────────────────────────────────────────────────────────

const SUBJECT_ALIASES: Record<string, string> = {
  ict: "ICT & Computing",
  maths: "Pure Mathematics",
  math: "Pure Mathematics",
};

/** Canonical display name keyed by lower-cased name and id. */
const KNOWN_SUBJECTS: ReadonlyMap<string, string> = (() => {
  const map = new Map<string, string>();
  for (const s of CAMEROON_GCE_SUBJECTS) {
    map.set(s.name.toLowerCase(), s.name);
    map.set(s.id.toLowerCase(), s.name);
  }
  for (const s of ALL_AVAILABLE_SUBJECTS) {
    map.set(s.name.toLowerCase(), s.name);
    map.set(s.id.toLowerCase(), s.name);
  }
  for (const [alias, name] of Object.entries(SUBJECT_ALIASES)) {
    map.set(alias, name);
  }
  return map;
})();

/** Returns the canonical subject name, or null if it is not a known GCE subject. */
export function normalizeSubject(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const key = value.trim().toLowerCase();
  if (!key || key.length > 80) return null;
  return KNOWN_SUBJECTS.get(key) ?? null;
}

// ─── Tutor chat ────────────────────────────────────────────────────────────

export const TUTOR_LIMITS = {
  messageMaxChars: 2000,
  /** Older turns are dropped, not rejected, so long sessions keep working. */
  historyKeepTurns: 20,
  /** Hard ceiling on what we will even parse. */
  historyMaxTurns: 200,
  turnMaxChars: 4000,
  ttsMaxChars: 1500,
} as const;

const historyTurnSchema = z.object({
  role: z.enum(["user", "model"]),
  parts: z
    .array(z.object({ text: z.string() }))
    .min(1)
    .max(10),
});

export const tutorChatSchema = z.object({
  message: z.string().trim().min(1).max(TUTOR_LIMITS.messageMaxChars),
  subject: z.string().max(80),
  educationLevel: z.string().max(40).optional(),
  performanceScore: z.number().finite().optional(),
  history: z.array(historyTurnSchema).max(TUTOR_LIMITS.historyMaxTurns).optional(),
  sessionId: z.string().max(64).optional(),
});

export type TutorChatInput = z.infer<typeof tutorChatSchema>;

/** Keeps the most recent turns and clips each turn's text. */
export function trimHistory(
  history: TutorChatInput["history"]
): { role: "user" | "model"; parts: { text: string }[] }[] {
  if (!history) return [];
  return history.slice(-TUTOR_LIMITS.historyKeepTurns).map((turn) => ({
    role: turn.role,
    parts: [
      {
        text: turn.parts
          .map((p) => p.text)
          .join("\n")
          .slice(0, TUTOR_LIMITS.turnMaxChars),
      },
    ],
  }));
}

export const ttsSchema = z.object({
  text: z.string().trim().min(1).max(TUTOR_LIMITS.ttsMaxChars),
});
