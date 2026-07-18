import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * /api/ai/quiz — Generates a customized 3-question quiz using Gemini AI
 * based on the student's saved onboarding profile vector.
 */
export async function POST(req: NextRequest) {
  try {
    const { goal, education, struggles, subject, count, difficulty } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    const finalSubject = subject || (struggles && struggles.length > 0 ? struggles.join(", ") : "General Science");
    const finalCount = count ? parseInt(count, 10) : 3;
    const finalDifficulty = difficulty || "Medium";

    // Premium default fallback questions
    const fallbackQuiz = [
      {
        questionText: "Which of the following phenomena is a direct manifestation of quantum tunneling?",
        options: [
          "Alpha decay of radioactive nuclei",
          "Blackbody radiation intensity",
          "Photoelectric work function threshold",
          "Bohr radius orbital electron levels",
        ],
        answerIdx: 0,
        explanation: "Alpha decay occurs because alpha particles tunnel through the strong nuclear force potential barrier of the nucleus, even though they classically lack the kinetic energy to escape!",
      },
      {
        questionText: "If the wavefunction of a particle incident on a barrier has an energy E less than the barrier height V, what happens to the wavefunction inside the barrier?",
        options: [
          "It becomes a constant zero",
          "It decays exponentially",
          "It oscillates with twice the frequency",
          "It remains a constant amplitude sine wave",
        ],
        answerIdx: 1,
        explanation: "Inside the potential barrier where E < V, the wavefunction undergoes exponential decay. If the barrier is thin enough, the wavefunction value is non-zero at the far boundary, allowing the particle to emerge!",
      },
      {
        questionText: "How does increasing the thickness of a potential barrier affect the transmission probability of a tunneling particle?",
        options: [
          "It increases the probability linearly",
          "It does not change the probability",
          "It decreases the probability exponentially",
          "It increases the probability exponentially",
        ],
        answerIdx: 2,
        explanation: "Transmission probability decreases exponentially with the width of the barrier, making thin barriers highly critical for quantum tunneling electronics (like flash memory memory cells)!",
      },
    ].slice(0, finalCount);

    if (!apiKey) {
      console.log("No GEMINI_API_KEY found for quiz, returning fallback questions.");
      return NextResponse.json({ quiz: fallbackQuiz });
    }

    const prompt = `
      You are an expert curriculum counselor at Ticha AI in Cameroon.
      Create a personalized ${finalCount}-question multiple choice quiz for a student at education level: "${education}"
      with the goal: "${goal}" on the subject: "${finalSubject}" at difficulty: "${finalDifficulty}".

      Formulate questions testing concepts inside this subject. Make sure questions have a neobrutalist vibe—practical, educational, and high-yield.

      Return the result strictly as a JSON object of this structure:
      {
        "quiz": [
          {
            "questionText": "Question statement here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answerIdx": 0,
            "explanation": "High-yield concept explanation card text here."
          }
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
            maxOutputTokens: finalCount * 220,
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
    return NextResponse.json({ quiz: parsed.quiz || fallbackQuiz });

  } catch (error) {
    console.error("Gemini quiz generation failed, returning fallback quiz:", error);
    // Bails out safely
    return NextResponse.json({
      quiz: [
        {
          questionText: "Which of the following phenomena is a direct manifestation of quantum tunneling?",
          options: [
            "Alpha decay of radioactive nuclei",
            "Blackbody radiation intensity",
            "Photoelectric work function threshold",
            "Bohr radius orbital electron levels",
          ],
          answerIdx: 0,
          explanation: "Alpha decay occurs because alpha particles tunnel through the strong nuclear force potential barrier of the nucleus, even though they classically lack the kinetic energy to escape!",
        },
        {
          questionText: "If the wavefunction of a particle incident on a barrier has an energy E less than the barrier height V, what happens to the wavefunction inside the barrier?",
          options: [
            "It becomes a constant zero",
            "It decays exponentially",
            "It oscillates with twice the frequency",
            "It remains a constant amplitude sine wave",
          ],
          answerIdx: 1,
          explanation: "Inside the potential barrier where E < V, the wavefunction undergoes exponential decay. If the barrier is thin enough, the wavefunction value is non-zero at the far boundary, allowing the particle to emerge!",
        },
      ]
    });
  }
}
