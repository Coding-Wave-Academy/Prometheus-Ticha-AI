import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface StruggleSubject {
  id: string;
  name: string;
  iconBg: string;
  emoji: string;
}

/**
 * /api/ai/struggles — Returns dynamic struggles subjects customized by Gemini AI
 * based on selected onboarding goal and education level, falling back to clean neobrutalist
 * static data if the key is missing or query fails.
 */
export async function POST(req: NextRequest) {
  try {
    const { goal, education } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    // Standard high-quality fallback subject options mapped by education level
    const defaultMocks: Record<string, StruggleSubject[]> = {
      ol: [
        { id: "math", name: "O-Level Mathematics", iconBg: "bg-[#A6B7CE]", emoji: "📐" },
        { id: "physics", name: "O-Level Physics", iconBg: "bg-[#B6FF00]", emoji: "⚡" },
        { id: "chemistry", name: "O-Level Chemistry", iconBg: "bg-[#FFD9E0]", emoji: "🧪" },
      ],
      al: [
        { id: "math", name: "Pure Mathematics", iconBg: "bg-[#A6B7CE]", emoji: "📐" },
        { id: "physics", name: "Advanced Physics", iconBg: "bg-[#B6FF00]", emoji: "⚡" },
        { id: "chemistry", name: "Advanced Chemistry", iconBg: "bg-[#FFD9E0]", emoji: "🧪" },
      ],
      university: [
        { id: "calculus", name: "Advanced Calculus", iconBg: "bg-[#A6B7CE]", emoji: "📈" },
        { id: "cs", name: "Computer Programming", iconBg: "bg-[#B6FF00]", emoji: "💻" },
        { id: "physics", name: "Quantum Mechanics", iconBg: "bg-[#FFD9E0]", emoji: "⚛️" },
      ],
    };

    const levelMocks = defaultMocks[education] || defaultMocks["al"];

    if (!apiKey) {
      console.log("No GEMINI_API_KEY found, returning premium fallback mocks.");
      return NextResponse.json({ subjects: levelMocks });
    }

    const prompt = `
      You are a Cameroonian curriculum expert counselor at Ticha AI.
      Given the student's education level: "${education}" (where 'ol' represents O-Level / GCE Ordinary Level / Probatoire, 'al' represents A-Level / GCE Advanced Level / Baccalauréat, and 'university' represents University studies)
      and their primary goal: "${goal}" (e.g. exam excellence, building habits, ranking, or satisfying curiosity).

      Generate exactly 3 specific, highly relevant subjects where Cameroonian students at this level facing those goals typically experience difficulties (struggles).

      Return the result strictly as a JSON object of this structure:
      {
        "subjects": [
          { "id": "subject_slug", "name": "Subject Name", "iconBg": "bg_tailwind_color_class", "emoji": "single_emoji_representing_subject" }
        ]
      }
      
      Valid iconBg tailwind classes you can use are:
      "bg-[#A6B7CE]", "bg-[#B6FF00]", "bg-[#FFD9E0]", "bg-[#D3E2FF]", "bg-[#FFE5C4]"

      Do not wrap it in markdown block tags. Return only raw, valid JSON.
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
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const json = await response.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("Empty response from Gemini");

    const parsed = JSON.parse(rawText.trim());
    return NextResponse.json({ subjects: parsed.subjects || levelMocks });

  } catch (error) {
    console.error("Gemini query failed, bailing out to mock data:", error);
    // Fallback safe return
    return NextResponse.json({
      subjects: [
        { id: "math", name: "Pure Mathematics", iconBg: "bg-[#A6B7CE]", emoji: "📐" },
        { id: "physics", name: "Advanced Physics", iconBg: "bg-[#B6FF00]", emoji: "⚡" },
        { id: "chemistry", name: "Advanced Chemistry", iconBg: "bg-[#FFD9E0]", emoji: "🧪" },
      ]
    });
  }
}
