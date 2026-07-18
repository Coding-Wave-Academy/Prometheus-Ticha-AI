import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * /api/ai/flashcards — Generates 4 customized flashcards using Gemini AI
 * based on selected subject.
 */
export async function POST(req: NextRequest) {
  let fallbackCards: Array<{ front: string; back: string }> = [];
  try {
    const { subject, count, difficulty, goal, education } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    const finalSubject = subject || "General Studies";
    const finalCount = count ? parseInt(count, 10) : 4;
    const finalDifficulty = difficulty || "Medium";
    const finalGoal = goal || "excellence";
    const finalEducation = education || "al";

    // Subject-aware dynamic fallback cards
    fallbackCards = Array.from({ length: finalCount }, (_, i) => ({
      front: i === 0
        ? `What is a key concept in ${finalSubject}?`
        : i === 1
        ? `Define an important term in ${finalSubject}.`
        : i === 2
        ? `What is a common exam question topic in ${finalSubject}?`
        : `Give a real-world application of ${finalSubject}.`,
      back: i === 0
        ? `${finalSubject} builds upon fundamental principles that form the basis of examination questions. Master the core definitions first.`
        : i === 1
        ? `Key terms in ${finalSubject} are essential for answering structured questions correctly in GCE examinations.`
        : i === 2
        ? `Examiners frequently test problem-solving and analytical reasoning in ${finalSubject}. Practice past papers regularly.`
        : `${finalSubject} has direct applications in everyday life and professional careers in Cameroon and beyond.`,
    })).slice(0, finalCount);

    if (!apiKey) {
      console.log("No GEMINI_API_KEY found for flashcards, returning subject-aware fallbacks.");
      return NextResponse.json({ cards: fallbackCards });
    }

    const prompt = `
      You are an expert Cameroonian curriculum tutor.
      Generate exactly ${finalCount} high-yield flashcards for students at education level: "${finalEducation}"
      preparing for examinations with the primary goal: "${finalGoal}", on the subject: "${subject}" at difficulty: "${finalDifficulty}".

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
            maxOutputTokens: finalCount * 120,
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
    console.error("Gemini flashcards query failed, returning subject-aware fallback:", error);
    return NextResponse.json({
      cards: fallbackCards.length > 0 ? fallbackCards : [
        { front: "What is a key concept in this subject?", back: "Master the core definitions and past paper patterns to excel in GCE examinations." },
        { front: "How do you approach examination preparation?", back: "Active recall, timed practice, and concept mapping are the most effective techniques." },
      ]
    });
  }
}
