import { NextRequest, NextResponse } from "next/server";
import { formatAIText } from "@/lib/formatAIText";

export const dynamic = "force-dynamic";

export interface DailyLesson {
  id: string;
  subject: string;
  topic: string;
  bits: string[];
  keyTakeaway: string;
  checkQuestion: string;
  options: string[];
  correctIdx: number;
  youtubeId: string;
}

const fallbackLessons: DailyLesson[] = [
  {
    id: "lesson-1",
    subject: "Physics",
    topic: "Electromagnetism & Faraday's Law",
    bits: [
      "A changing magnetic field inside a wire loop pushes electrons.",
      "This pushing force generates an electrical current called EMF.",
      "If the magnetic field stays static, zero current is generated."
    ],
    keyTakeaway: "Changing magnetic flux = Induced Electromotive Force (EMF).",
    checkQuestion: "What must happen to a magnetic field to induce an electric current in a closed loop?",
    options: ["It must stay completely static", "It must change over time", "It must be turned off", "It must be shielded"],
    correctIdx: 1,
    youtubeId: "pQp6bmjPU_0",
  },
  {
    id: "lesson-2",
    subject: "Pure Mathematics",
    topic: "Calculus Limits & Local Linearity",
    bits: [
      "Limits let us analyze functions at exact points without dividing by zero.",
      "When you zoom in infinitely on any smooth curve, it becomes a straight line.",
      "That straight line slope at a single point is called the derivative."
    ],
    keyTakeaway: "Limits calculate the slope of a curve at an exact instant.",
    checkQuestion: "What shape does any smooth continuous curve take when zoomed in infinitely?",
    options: ["A circle", "A straight line", "A parabola", "A wave"],
    correctIdx: 1,
    youtubeId: "rAof9Ld5sOg",
  },
  {
    id: "lesson-3",
    subject: "ICT & Computing",
    topic: "Database Normalization (1NF to 3NF)",
    bits: [
      "Normalization organizes database tables to stop data duplication.",
      "First Normal Form (1NF) mandates that every table cell contains a single atomic value.",
      "Atomic values prevent multi-item lists inside a single database row."
    ],
    keyTakeaway: "1NF removes repeating groups and keeps tables fast.",
    checkQuestion: "What does 1st Normal Form (1NF) require for all values in a table column?",
    options: ["All values must be arrays", "All values must be atomic (indivisible)", "All values must be encrypted", "All values must be integers"],
    correctIdx: 1,
    youtubeId: "GFQaEYEc8_8",
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
      You are Madame Ticha, a Cameroonian GCE curriculum specialist.
      Generate 3 bite-sized 1% Daily Lessons for a student at level: "${education || "ol"}"
      targeting their weak subjects: ${targetStruggles.join(", ")}.

      CRITICAL INSTRUCTIONS FOR BITE-SIZED KNOWLEDGE:
      1. Produce exactly 3 lessons.
      2. For each lesson, provide an array "bits" containing EXACTLY 3 short, 1-sentence micro-bits (max 12-15 words per bit).
      3. CRITICAL: Do NOT use markdown symbols (no ###, no ***, no **, no LaTeX like \\mathbb{N} or \\mathb{N}). Use plain text!
      4. Include a simple 1-question check for each lesson with 4 options and the correct 0-based option index.

      Return ONLY raw JSON matching this array structure:
      [
        {
          "id": "lesson-1",
          "subject": "Subject Name",
          "topic": "Topic Title",
          "bits": [
            "Bite-sized sentence 1.",
            "Bite-sized sentence 2.",
            "Bite-sized sentence 3."
          ],
          "keyTakeaway": "1-sentence key takeaway.",
          "checkQuestion": "Clear multiple choice question text?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctIdx": 1,
          "youtubeId": "pQp6bmjPU_0"
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
      bits: Array.isArray(l.bits) ? l.bits.map((b) => formatAIText(b)) : [formatAIText(l.topic)],
      keyTakeaway: formatAIText(l.keyTakeaway),
      checkQuestion: formatAIText(l.checkQuestion),
      youtubeId: l.youtubeId || "pQp6bmjPU_0",
    }));

    return NextResponse.json({ lessons: cleanedLessons });
  } catch (err) {
    console.error("Daily lesson generation exception:", err);
    return NextResponse.json({ lessons: fallbackLessons });
  }
}
