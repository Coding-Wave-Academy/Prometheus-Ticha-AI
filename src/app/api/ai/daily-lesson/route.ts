import { NextRequest, NextResponse } from "next/server";
import { formatAIText } from "@/lib/formatAIText";

export const dynamic = "force-dynamic";

interface DailyLesson {
  id: string;
  subject: string;
  topic: string;
  explanation: string;
  keyTakeaway: string;
  checkQuestion: string;
  options: string[];
  correctIdx: number;
}

const fallbackLessons: DailyLesson[] = [
  {
    id: "lesson-1",
    subject: "Physics",
    topic: "Electromagnetism & Faraday's Law",
    explanation:
      "Faraday's Law states that a changing magnetic field inside a loop of wire induces an electric current. Think of magnetic fields like wind: when the wind moves across the windmill blades, it generates electrical energy!",
    keyTakeaway: "Changing magnetic flux = Induced Electromotive Force (EMF).",
    checkQuestion: "What must happen to a magnetic field to induce an electric current in a closed loop?",
    options: ["It must stay completely static", "It must change over time", "It must be turned off", "It must be shielded"],
    correctIdx: 1,
  },
  {
    id: "lesson-2",
    subject: "Pure Mathematics",
    topic: "Calculus Limits & Local Linearity",
    explanation:
      "Limits allow us to analyze mathematical functions at exact points where division by zero would normally break. When you zoom in infinitely on a smooth curve, it looks straight. That straight line is the tangent!",
    keyTakeaway: "Limits calculate slope at an exact instant.",
    checkQuestion: "What shape does any smooth continuous curve take when zoomed in infinitely?",
    options: ["A circle", "A straight line", "A parabola", "A wave"],
    correctIdx: 1,
  },
  {
    id: "lesson-3",
    subject: "ICT & Computing",
    topic: "Database Normalization (1NF to 3NF)",
    explanation:
      "Database normalization is the process of organizing data to eliminate redundancy. First Normal Form (1NF) ensures every table column contains atomic, non-repeatable values.",
    keyTakeaway: "Normalization prevents data duplication and keeps databases fast.",
    checkQuestion: "What does 1st Normal Form (1NF) require for all values in a table column?",
    options: ["All values must be arrays", "All values must be atomic (indivisible)", "All values must be encrypted", "All values must be integers"],
    correctIdx: 1,
  },
];

export async function POST(req: NextRequest) {
  try {
    const { struggles, education } = await req.json();
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ lessons: fallbackLessons });
    }

    const targetStruggles = Array.isArray(struggles) && struggles.length > 0 ? struggles : ["Physics", "Pure Mathematics", "ICT"];

    const prompt = `
      You are Madame Ticha, a top Cameroonian GCE curriculum specialist.
      Generate 3 short, high-yield 1% Daily Lessons for a student at level: "${education || "ol"}"
      targeting their weak subjects: ${targetStruggles.join(", ")}.

      INSTRUCTIONS:
      1. Produce exactly 3 bite-sized lessons.
      2. Keep explanations simple, engaging, and clear (max 3 short sentences per lesson).
      3. CRITICAL: Do NOT use markdown symbols (no ###, no ***, no **). Return clean plain text inside strings!
      4. Include a simple 1-question check for each lesson with 4 options and the correct 0-based option index.

      Return ONLY raw JSON matching this array structure:
      [
        {
          "id": "lesson-1",
          "subject": "Subject Name",
          "topic": "Topic Title",
          "explanation": "Simple clear explanation without markdown.",
          "keyTakeaway": "1-sentence key takeaway.",
          "checkQuestion": "Clear multiple choice question text?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctIdx": 1
        }
      ]
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
      throw new Error(`Gemini status ${response.status}`);
    }

    const json = await response.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) throw new Error("Empty Gemini response");

    const parsed: DailyLesson[] = JSON.parse(rawText.trim());

    // Format all AI strings using formatAIText
    const cleanedLessons = parsed.map((l, i) => ({
      ...l,
      id: `lesson-${Date.now()}-${i}`,
      explanation: formatAIText(l.explanation),
      keyTakeaway: formatAIText(l.keyTakeaway),
      checkQuestion: formatAIText(l.checkQuestion),
    }));

    return NextResponse.json({ lessons: cleanedLessons });
  } catch (err) {
    console.error("Daily lesson generation exception:", err);
    return NextResponse.json({ lessons: fallbackLessons });
  }
}
