import { NextRequest, NextResponse } from "next/server";
import { formatAIText } from "@/lib/formatAIText";

export const dynamic = "force-dynamic";

export interface QuizQuestion {
  questionText: string;
  options: string[];
  answerIdx: number;
  explanation: string;
}

const fallbackPaper1Questions: QuizQuestion[] = [
  {
    questionText: "According to Faraday's law of electromagnetic induction, what determines the magnitude of the induced electromotive force (EMF)?",
    options: [
      "The static magnetic field strength",
      "The rate of change of magnetic flux linkage",
      "The resistance of the copper wire",
      "The ambient temperature of the room",
    ],
    answerIdx: 1,
    explanation: "Faraday's law states that the magnitude of induced EMF is directly proportional to the rate of change of magnetic flux linkage through the circuit.",
  },
  {
    questionText: "Lenz's law is a direct consequence of which fundamental physical conservation law?",
    options: [
      "Conservation of Electric Charge",
      "Conservation of Linear Momentum",
      "Conservation of Energy",
      "Conservation of Angular Momentum",
    ],
    answerIdx: 2,
    explanation: "Lenz's law enforces conservation of energy: the direction of induced current creates a magnetic field that opposes the change, preventing free energy creation.",
  },
  {
    questionText: "In a uniform magnetic field B, a straight conductor of length L moves with constant velocity v perpendicular to the field. What is the induced EMF across the conductor?",
    options: [
      "E = B / (L * v)",
      "E = B * L * v",
      "E = B * L^2 * v",
      "E = zero",
    ],
    answerIdx: 1,
    explanation: "The motional EMF across a straight conductor moving perpendicular to a uniform magnetic field is given by E = B * L * v.",
  },
  {
    questionText: "What unit is used to measure magnetic flux in the SI system?",
    options: ["Tesla (T)", "Weber (Wb)", "Henry (H)", "Farad (F)"],
    answerIdx: 1,
    explanation: "Magnetic flux is measured in Webers (Wb), where 1 Weber equals 1 Tesla square meter (T·m²).",
  },
  {
    questionText: "When a bar magnet is dropped vertically through a long copper pipe, why does it fall more slowly than when dropped in air?",
    options: [
      "Due to air buoyancy inside the pipe",
      "Eddy currents induced in the pipe oppose the magnet's falling motion",
      "Copper is ferromagnetic and attracts the magnet",
      "Gravity is weaker inside metallic cylinders",
    ],
    answerIdx: 1,
    explanation: "As the magnet falls, changing magnetic flux induces circular eddy currents in the copper pipe walls. By Lenz's law, these currents create an upward magnetic force that opposes gravity.",
  },
];

export async function POST(req: NextRequest) {
  try {
    const { subject, topic, education, struggles } = await req.json();
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    const targetSubject = subject || struggles?.[0] || "Physics";
    const targetTopic = topic || "Electromagnetism & Faraday's Law";

    if (!apiKey) {
      return NextResponse.json({ quiz: fallbackPaper1Questions });
    }

    const prompt = `
      You are a senior examiner for the Cameroon GCE Board (Ordinary & Advanced Level).
      Create a 15-question GCE Paper 1 Multiple Choice Exam for subject: "${targetSubject}" and topic: "${targetTopic}".
      Education level: "${education || "al"}".

      CRITICAL GCE PAPER 1 RULES:
      1. Formulate 15 high-yield multiple choice questions in standard GCE Paper 1 style.
      2. Each question MUST have exactly 4 plausible options [A, B, C, D].
      3. Provide the 0-based index of the correct answer (0 for A, 1 for B, 2 for C, 3 for D).
      4. Include a concise, high-yield exam explanation for the correct answer.
      5. CRITICAL: Do NOT use markdown symbols (no ###, no ***, no **, no LaTeX like \\mathbb{N} or \\mathb{N}). Use plain text!

      Return ONLY raw JSON matching this structure:
      {
        "quiz": [
          {
            "questionText": "GCE Paper 1 question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answerIdx": 1,
            "explanation": "Clear exam explanation text."
          }
        ]
      }
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
      }
    );

    if (!response.ok) {
      return NextResponse.json({ quiz: fallbackPaper1Questions });
    }

    const json = await response.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return NextResponse.json({ quiz: fallbackPaper1Questions });

    const parsed = JSON.parse(rawText.trim());
    const rawQuiz: QuizQuestion[] = parsed.quiz || fallbackPaper1Questions;

    // Format all quiz strings using formatAIText
    const cleanedQuiz = rawQuiz.map((q) => ({
      questionText: formatAIText(q.questionText),
      options: q.options.map((opt) => formatAIText(opt)),
      answerIdx: typeof q.answerIdx === "number" ? q.answerIdx : 0,
      explanation: formatAIText(q.explanation),
    }));

    return NextResponse.json({ quiz: cleanedQuiz });
  } catch (err) {
    console.error("Quiz API exception:", err);
    return NextResponse.json({ quiz: fallbackPaper1Questions });
  }
}
