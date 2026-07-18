import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * /api/ai/quiz — Generates a customized 3-question quiz using Gemini AI
 * based on the student's saved onboarding profile vector.
 */
export async function POST(req: NextRequest) {
  let fallbackQuiz: Array<{
    questionText: string;
    options: string[];
    answerIdx: number;
    explanation: string;
  }> = [];

  try {
    const { goal, education, struggles, subject, count, difficulty } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    const finalSubject = subject || (struggles && struggles.length > 0 ? struggles[0] : "General Science");
    const finalCount = count ? parseInt(count, 10) : 3;
    const finalDifficulty = difficulty || "Medium";

    // Dynamic subject-aware fallback — uses the actual subject name
    fallbackQuiz = [
      {
        questionText: `Which of the following best describes a core principle of ${finalSubject}?`,
        options: [
          `The systematic study of ${finalSubject} concepts and their applications`,
          "A discipline unrelated to scientific reasoning",
          "Purely memorization-based without analytical thinking",
          "A field with no practical applications",
        ],
        answerIdx: 0,
        explanation: `${finalSubject} is a structured discipline that involves both theoretical understanding and practical application. Mastering core principles is key to excelling in GCE examinations.`,
      },
      {
        questionText: `What is the most effective approach to preparing for a ${finalSubject} examination?`,
        options: [
          "Reading the textbook once without practice",
          "Active recall, past paper practice, and concept mapping",
          "Memorizing isolated facts without understanding",
          "Skipping difficult topics entirely",
        ],
        answerIdx: 1,
        explanation: `Active recall and past paper practice are the most evidence-backed strategies for ${finalSubject} exam preparation. They strengthen long-term retention and expose gaps in understanding.`,
      },
      {
        questionText: `In the context of ${finalSubject}, what does analytical thinking involve?`,
        options: [
          "Applying given formulas without understanding them",
          "Breaking down complex problems into manageable components",
          "Avoiding unfamiliar question types",
          "Relying only on worked examples",
        ],
        answerIdx: 1,
        explanation: `Analytical thinking in ${finalSubject} means dissecting problems systematically, identifying relevant principles, and constructing logical solutions — a skill examiners actively reward.`,
      },
    ].slice(0, finalCount);

    if (!apiKey) {
      console.log("No GEMINI_API_KEY found for quiz, returning subject-aware fallback questions.");
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
    console.error("Gemini quiz generation failed, returning subject-aware fallback:", error);
    return NextResponse.json({
      quiz: fallbackQuiz.length > 0 ? fallbackQuiz : [
        {
          questionText: "What is the best approach to exam preparation?",
          options: [
            "Active recall and past paper practice",
            "Reading notes passively once",
            "Memorizing without understanding",
            "Skipping difficult topics",
          ],
          answerIdx: 0,
          explanation: "Active recall and past paper practice are the most evidence-backed strategies for any GCE examination subject.",
        },
      ]
    });
  }
}
