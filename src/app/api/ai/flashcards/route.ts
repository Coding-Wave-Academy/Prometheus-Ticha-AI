import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * /api/ai/flashcards — Generates 4 customized flashcards using Gemini AI
 * based on selected subject.
 */
export async function POST(req: NextRequest) {
  try {
    const { subject } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    // High quality dynamic fallback flashcards
    const fallbackCards = [
      {
        front: "What is Quantum Tunneling?",
        back: "A quantum phenomenon where particles pass through a potential barrier that they classically shouldn't be able to cross.",
      },
      {
        front: "What dictates the probability of a particle tunneling?",
        back: "The width of the potential barrier, its energy height relative to the particle's energy, and the particle's mass.",
      },
      {
        front: "Give a real-world application of tunneling.",
        back: "Flash memory chips (USB drives, SSDs) write and erase data by tunneling electrons through insulating oxide barriers.",
      },
      {
        front: "What happens to a wavefunction inside a barrier?",
        back: "It undergoes exponential decay, reducing the wave amplitude but retaining a non-zero value at the exit boundary.",
      },
    ];

    if (!apiKey) {
      console.log("No GEMINI_API_KEY found for flashcards, returning fallbacks.");
      return NextResponse.json({ cards: fallbackCards });
    }

    const prompt = `
      You are an expert Cameroonian curriculum tutor.
      Generate exactly 4 high-yield flashcards for students preparing for examinations on the subject: "${subject}".

      Each card must have:
      - front: A concise question or key term.
      - back: A brief, clear, easily-memorized definition or answer.

      Return the result strictly as a JSON object of this structure:
      {
        "cards": [
          { "front": "Question...", "back": "Answer..." }
        ]
      }

      Strictly return valid JSON. Do not wrap in markdown block code tags.
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
            maxOutputTokens: 350,
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
    return NextResponse.json({ cards: parsed.cards || fallbackCards });

  } catch (error) {
    console.error("Gemini flashcards query failed, returning fallback:", error);
    return NextResponse.json({
      cards: [
        {
          front: "What is Quantum Tunneling?",
          back: "A quantum phenomenon where particles pass through a potential barrier that they classically shouldn't be able to cross.",
        },
        {
          front: "What dictates the probability of a particle tunneling?",
          back: "The width of the potential barrier, its energy height relative to the particle's energy, and the particle's mass.",
        },
      ]
    });
  }
}
