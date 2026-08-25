import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface StruggleSubject {
  id: string;
  name: string;
  iconBg: string;
  iconSlug: string;
}

/**
 * /api/ai/struggles — Returns the top 3 most challenging/disturbing subjects suggested by AI
 * based on selected onboarding goal and education level, falling back to top 3 level-specific subjects.
 */
export async function POST(req: NextRequest) {
  try {
    const { goal, education } = await req.json();

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    // Top 3 most challenging/disturbing subjects per education level in the Cameroonian curriculum
    const defaultMocks: Record<string, StruggleSubject[]> = {
      ol: [
        { id: "math", name: "O-Level Mathematics", iconBg: "bg-[#A6B7CE]", iconSlug: "math" },
        { id: "physics", name: "O-Level Physics", iconBg: "bg-[#B6FF00]", iconSlug: "physics" },
        { id: "chemistry", name: "O-Level Chemistry", iconBg: "bg-[#FFD9E0]", iconSlug: "chemistry" },
      ],
      al: [
        { id: "math", name: "Pure Mathematics", iconBg: "bg-[#A6B7CE]", iconSlug: "math" },
        { id: "physics", name: "Advanced Physics", iconBg: "bg-[#B6FF00]", iconSlug: "physics" },
        { id: "furtherMath", name: "Further Mathematics", iconBg: "bg-[#FFD9E0]", iconSlug: "math" },
      ]
    };

    const levelMocks = defaultMocks[education] || defaultMocks["al"];

    if (!apiKey) {
      return NextResponse.json({ subjects: levelMocks });
    }

    const prompt = `
      You are a Cameroonian academic curriculum counselor at Ticha AI.
      Analyze the student's education level: "${education}" (ol = GCE Ordinary Level / Form 5, al = GCE Advanced Level / Upper Sixth, university = University studies)
      and their goal: "${goal}".

      Identify and suggest EXACTLY the top 3 most notoriously challenging and disturbing subjects that students at this specific level struggle with the most in Cameroon.

      Return the result strictly as a raw JSON object with this structure:
      {
        "subjects": [
          { "id": "slug", "name": "Subject Name", "iconBg": "bg-[#B6FF00]", "iconSlug": "math|physics|chemistry|cs|calculus" }
        ]
      }

      Valid iconBg classes to cycle through: "bg-[#A6B7CE]", "bg-[#B6FF00]", "bg-[#FFD9E0]", "bg-[#D3E2FF]", "bg-[#FFE5C4]"
      Do not include markdown backticks. Return exactly 3 items.
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
      return NextResponse.json({ subjects: levelMocks });
    }

    const json = await response.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return NextResponse.json({ subjects: levelMocks });

    const parsed = JSON.parse(rawText.trim());
    const validSubjects = Array.isArray(parsed.subjects) && parsed.subjects.length > 0
      ? parsed.subjects.slice(0, 3)
      : levelMocks;

    return NextResponse.json({ subjects: validSubjects });

  } catch (error) {
    console.error("Gemini struggles query exception:", error);
    return NextResponse.json({
      subjects: [
        { id: "math", name: "Pure Mathematics", iconBg: "bg-[#A6B7CE]", iconSlug: "math" },
        { id: "physics", name: "Advanced Physics", iconBg: "bg-[#B6FF00]", iconSlug: "physics" },
        { id: "furtherMath", name: "Further Mathematics", iconBg: "bg-[#FFD9E0]", iconSlug: "math" },
      ]
    });
  }
}
