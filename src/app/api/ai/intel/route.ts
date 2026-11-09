import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { normalizeEducationLevel, normalizeSubject, type EducationLevel } from "@/lib/apiSchemas";

export const dynamic = "force-dynamic";

/**
 * /api/ai/intel — Generates bespoke subject insights based on goal, education level,
 * and chosen struggles. Public (called during onboarding, before registration), so
 * inputs are allow-listed and results are cached per combination. Falls back to the
 * quantum tunneling card when no known subject is given or Gemini is unavailable.
 */
// Premium default mock data matching the reference layout
const fallbackIntel = {
  bigIdea: {
    text: "Particles can pass through barriers that should be impossible to cross. Not magic. Just quantum physics.",
    label: "Mind = blown!",
  },
  story: {
    text: "Imagine a tiny ball rolling toward a hill. It doesn't have enough energy to climb over it. Classically, it stops.",
  },
  reality: {
    text: "In quantum physics, the ball has a small chance of popping through the hill instead of stopping. It tunnels through.",
  },
  whyItMatters: {
    bullets: [
      "Powers electronics (like your phone)",
      "Helps stars shine and cells function",
      "The basis of quantum computers",
    ],
    ahaMoment: "So, particles aren't just following the rules—they're rewriting them.",
  },
  proTip: {
    text: "90% of students miss this mark on the wavefunction. Don't be that student!",
  },
};

const ONBOARDING_GOALS = new Set([
  "gce_ol",
  "gce_al",
  "university_cas",
  "deep_understanding",
  "build_confidence",
]);

const GOAL_LABELS: Record<string, string> = {
  gce_ol: "pass the GCE Ordinary Level",
  gce_al: "pass the GCE Advanced Level",
  university_cas: "succeed in university continuous assessments",
  deep_understanding: "understand concepts deeply",
  build_confidence: "build exam confidence",
};

type IntelData = typeof fallbackIntel;

/**
 * Generates intel for one (level, goal, subject) combination.
 *
 * This route is public because onboarding runs before registration. To keep
 * it from being an open Gemini proxy, every input is reduced to allow-listed
 * values and the result is cached across instances per combination
 * (3 levels × 5 goals × ~40 subjects), so repeat calls never reach Gemini.
 * Failures throw, so a fallback is never cached.
 */
const getCachedIntel = unstable_cache(
  async (education: EducationLevel, goal: string, subject: string): Promise<IntelData> => {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

    const prompt = `
      You are a Cameroonian curriculum expert counselor at Ticha AI.
      Create a personalized educational breakdown (intel) for a student at level: "${education}" (ol = GCE O Level, al = GCE A Level, university)
      whose goal is to ${GOAL_LABELS[goal] ?? "pass the GCE"} and who is struggling with: "${subject}".

      Based on this subject, generate an "Aha!" concept guide. Focus on one core conceptual challenge in that subject (e.g. quantum tunneling for Physics, calculus limits, computer recursion, etc.).

      Generate exactly the following sections in a simple, punchy, neobrutalist tone:
      1. bigIdea: A white-box summary statement. E.g. "Limits let us inspect infinity without arriving there. Not magic. Just calculus." and a bubble text like "Mind = blown!".
      2. story: A classical analogy (the "Story"). E.g. "Imagine zooming in on a curved line forever. Classically, it remains curved."
      3. reality: The mathematical/scientific reality. E.g. "In calculus, if you zoom in infinitely, any smooth curve becomes a straight line. We call it local linearity."
      4. whyItMatters: Exactly 3 specific real-world bullets showing why this concept is critical, and a single-sentence "ahaMoment" summary containing a blank line for fill-in-the-blank (e.g. "So, limits aren't just details—they're __________ defining calculus.").
      5. proTip: A high-value exam warning tip. E.g. "85% of students fail to evaluate the indeterminate forms correctly. Don't be that student!".

      Return the result strictly as a JSON object of this structure:
      {
        "bigIdea": { "text": "...", "label": "..." },
        "story": { "text": "..." },
        "reality": { "text": "..." },
        "whyItMatters": {
          "bullets": ["bullet 1", "bullet 2", "bullet 3"],
          "ahaMoment": "..."
        },
        "proTip": { "text": "..." }
      }

      Do not wrap the response in markdown code blocks. Return only raw, valid JSON.
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const json = await response.json();
    const rawText: unknown = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof rawText !== "string" || !rawText) throw new Error("Empty response from Gemini");

    const parsed = JSON.parse(rawText.trim()) as IntelData;
    if (!parsed?.bigIdea?.text || !Array.isArray(parsed?.whyItMatters?.bullets)) {
      throw new Error("Gemini returned an unexpected intel shape");
    }
    return parsed;
  },
  ["onboarding-intel-v1"],
  { revalidate: 60 * 60 * 24 * 7 }
);

export async function POST(req: NextRequest) {
  const body: unknown = await req.json().catch(() => null);
  const { goal: rawGoal, education: rawEducation, struggles: rawStruggles } =
    (body && typeof body === "object" ? body : {}) as Record<string, unknown>;

  const education = normalizeEducationLevel(rawEducation) ?? "al";

  // The client sends selected goals comma-joined; only the first known one is used.
  const goal =
    (typeof rawGoal === "string" ? rawGoal.slice(0, 200).split(",") : [])
      .map((g) => g.trim())
      .find((g) => ONBOARDING_GOALS.has(g)) ?? "gce_al";

  // Students can type custom struggles; only a recognised GCE subject reaches Gemini.
  const subject = Array.isArray(rawStruggles)
    ? rawStruggles.slice(0, 10).map(normalizeSubject).find((s): s is string => s !== null) ?? null
    : null;

  if (!subject) {
    return NextResponse.json({ intel: fallbackIntel });
  }

  try {
    const intel = await getCachedIntel(education, goal, subject);
    return NextResponse.json({ intel });
  } catch (error) {
    console.error("[ai/intel] generation failed, serving fallback:", error);
    return NextResponse.json({ intel: fallbackIntel });
  }
}
