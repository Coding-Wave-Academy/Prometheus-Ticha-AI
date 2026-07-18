import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * /api/ai/intel — Generates bespoke subject insights based on goal, education level,
 * and chosen struggles. Integrates Gemini AI, bailing out gracefully to quantum tunneling mocks
 * if offline or the API key is not configured.
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

export async function POST(req: NextRequest) {
  let activeFallback = fallbackIntel;
  try {
    const { goal, education, struggles } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    const finalStruggles = Array.isArray(struggles) ? struggles : ["Physics"];

    // Build context-aware fallback data based on struggles list
    const hasMath = finalStruggles.some((s: string) => s.toLowerCase().includes("math") || s.toLowerCase().includes("calculus"));
    const hasChem = finalStruggles.some((s: string) => s.toLowerCase().includes("chem"));

    if (hasMath) {
      activeFallback = {
        bigIdea: {
          text: "Limits allow us to evaluate functions at infinity without ever arriving there. Not magic. Just calculus.",
          label: "Mind = blown!",
        },
        story: {
          text: "Imagine zooming in infinitely on a curved line. Classically, it always keeps its curve.",
        },
        reality: {
          text: "In calculus, any smooth curve is locally linear, meaning it looks completely straight if you zoom in infinitely. This lets us calculate rates of change directly.",
        },
        whyItMatters: {
          bullets: [
            "Powers architectural stress load calculations.",
            "Vital for machine learning gradient descents.",
            "Enables orbital dynamics calculations for satellite routes.",
          ],
          ahaMoment: "So, limits aren't just equations—they're windows defining the calculus wave.",
        },
        proTip: {
          text: "85% of students fail to evaluate the indeterminate limits correctly. Practice factoring first!",
        },
      };
    } else if (hasChem) {
      activeFallback = {
        bigIdea: {
          text: "Atoms share valence electrons to create stable molecular bounds. Not magic. Just chemistry orbital overlaps.",
          label: "Mind = blown!",
        },
        story: {
          text: "Imagine two people trying to hold onto the same pair of ropes at the same time to remain balanced.",
        },
        reality: {
          text: "In chemistry, covalent bounds share electron densities, balancing electrostatic pull between adjacent nuclei.",
        },
        whyItMatters: {
          bullets: [
            "Dictates pharmaceutical drug binding behaviors.",
            "The foundation of organic plastics synthesis.",
            "Creates the structures sustaining biological life.",
          ],
          ahaMoment: "So, covalent bounds aren't just lines—they're electrostatic waves balancing atoms.",
        },
        proTip: {
          text: "75% of students fail to balance redox half-reactions accurately on exams. Watch your charges!",
        },
      };
    }

    if (!apiKey) {
      console.log("No GEMINI_API_KEY configured for intel, returning premium fallback mocks.");
      return NextResponse.json({ intel: activeFallback });
    }

    const prompt = `
      You are a Cameroonian curriculum expert counselor at Ticha AI.
      Create a personalized educational breakdown (intel) for a student at level: "${education}" (e.g. ol/al/university)
      with the goal: "${goal}" and struggling with: "${finalStruggles.join(", ")}".

      Based on these struggles, generate an "Aha!" concept guide. Focus on one core conceptual challenge in those subjects (e.g. quantum tunneling if Physics is chosen, calculus limits, computer recursion, etc.).
      
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
          generationConfig: {
            responseMimeType: "application/json",
            maxOutputTokens: 600,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const json = await response.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("Empty response from Gemini");

    const parsed = JSON.parse(rawText.trim());
    return NextResponse.json({ intel: parsed });

  } catch (error) {
    console.error("Gemini query failed, bailing out to fallback intel:", error);
    return NextResponse.json({ intel: activeFallback });
  }
}
