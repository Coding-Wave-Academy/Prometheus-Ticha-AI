import { NextRequest, NextResponse } from "next/server";
import { formatAIText } from "@/lib/formatAIText";

export const dynamic = "force-dynamic";

export interface QuizQuestion {
  questionText: string;
  options: string[];
  answerIdx: number;
  explanation: string;
  wrongExplanations?: string[];
  examTrap?: string;
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
    wrongExplanations: [
      "Static magnetic fields do not induce EMF; flux MUST be changing over time.",
      "Correct! Rate of change of flux linkage (dΦ/dt) determines induced EMF.",
      "Resistance affects the magnitude of induced current (I = E/R), NOT the induced EMF itself.",
      "Ambient temperature has no direct role in Faraday's law formula.",
    ],
    examTrap: "Common Trap: Confusing induced EMF with induced current. Resistance changes the current, but NOT the induced voltage (EMF)!",
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
    wrongExplanations: [
      "Charge conservation relates to Kirchhoff's Current Law, not Lenz's Law.",
      "Linear momentum involves forces in collision mechanics.",
      "Correct! If induced current aided the motion instead of opposing it, perpetual energy would be created.",
      "Angular momentum relates to rotational motion.",
    ],
    examTrap: "Common Trap: Thinking Lenz's law opposes the magnetic field itself. It opposes the CHANGE in magnetic flux, not the field!",
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
    wrongExplanations: [
      "Division by L * v is mathematically incorrect.",
      "Correct! E = B * L * v derived from dΦ/dt where dΦ = B * L * dx.",
      "L is not squared in motional EMF.",
      "EMF is only zero if moving parallel to the magnetic field lines.",
    ],
    examTrap: "Common Trap: Forgetting the angle! If the conductor moves parallel to B (sin 0° = 0), EMF is zero. Always check the angle of motion relative to B lines.",
  },
  {
    questionText: "What unit is used to measure magnetic flux in the SI system?",
    options: ["Tesla (T)", "Weber (Wb)", "Henry (H)", "Farad (F)"],
    answerIdx: 1,
    explanation: "Magnetic flux is measured in Webers (Wb), where 1 Weber equals 1 Tesla square meter (T·m²).",
    wrongExplanations: [
      "Tesla (T) measures Magnetic Flux Density (B), not total Magnetic Flux (Φ).",
      "Correct! Weber (Wb) is the SI unit for magnetic flux.",
      "Henry (H) measures inductance.",
      "Farad (F) measures capacitance.",
    ],
    examTrap: "Common Trap: Confusing Magnetic Flux Density (Tesla, T) with Magnetic Flux (Weber, Wb). Remember: Φ (Wb) = B (T) × Area (m²).",
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
    wrongExplanations: [
      "Air buoyancy in a pipe is negligible.",
      "Correct! Eddy currents produce an opposing upward magnetic force by Lenz's law.",
      "Copper is diamagnetic, NOT ferromagnetic (unlike iron or nickel).",
      "Gravity remains constant regardless of metallic surroundings.",
    ],
    examTrap: "Common Trap: Thinking copper is magnetic. Copper is NOT attracted to magnets; the slowing down is 100% caused by induced eddy currents!",
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
      Create a 15-question GCE Paper 1 Multiple Choice Exam.

      CRITICAL TOPIC RELEVANCY MANDATE (VERY IMPORTANT):
      All 15 questions MUST be 100% strictly relevant to and derived ONLY from the specified daily lesson topic: "${targetTopic}" within subject: "${targetSubject}".
      Do NOT ask questions about unrelated topics or outside the scope of "${targetTopic}".
      Education level: "${education || "al"}".

      CRITICAL GCE PAPER 1 RULES:
      1. Formulate 15 high-yield multiple choice questions focused strictly on "${targetTopic}".
      2. Each question MUST have exactly 4 plausible options [A, B, C, D].
      3. Provide the 0-based index of the correct answer (0 for A, 1 for B, 2 for C, 3 for D).
      4. Include a concise, high-yield exam explanation for the correct answer.
      5. Include "wrongExplanations": an array of 4 short sentences explaining why each option (A, B, C, D) is either correct or incorrect/a distractor trap.
      6. Include "examTrap": a specific GCE Exam Trap to watch out for in this exact topic (e.g. common miscalculation, formula mix-up, or trick option).
      7. CRITICAL: Do NOT use markdown symbols (no ###, no ***, no **, no LaTeX like \\mathbb{N} or \\mathb{N}). Use plain text!

      Return ONLY raw JSON matching this structure:
      {
        "quiz": [
          {
            "questionText": "GCE Paper 1 question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answerIdx": 1,
            "explanation": "Clear exam explanation text for correct answer.",
            "wrongExplanations": [
              "Why option A is incorrect distractor.",
              "Why option B is correct.",
              "Why option C is incorrect.",
              "Why option D is incorrect."
            ],
            "examTrap": "Madame Ticha Exam Trap: Common pitfall to watch out for in this topic."
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
      wrongExplanations: Array.isArray(q.wrongExplanations)
        ? q.wrongExplanations.map((w) => formatAIText(w))
        : undefined,
      examTrap: q.examTrap ? formatAIText(q.examTrap) : undefined,
    }));

    return NextResponse.json({ quiz: cleanedQuiz });
  } catch (err) {
    console.error("Quiz API exception:", err);
    return NextResponse.json({ quiz: fallbackPaper1Questions });
  }
}
