import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { educationLevel = "al", region = "Littoral", name = "Scholar", preferredLanguage = "en" } = await req.json();

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return smart dynamic structured tip if key missing
      return NextResponse.json({
        tips: [
          {
            id: "tip-1",
            icon: "💡",
            title: "Master the GCE Command Words",
            description: "'State', 'Explain', and 'Discuss' require different lengths. Always address the exact directive!",
            tag: "EXAM TECHNIQUE",
          },
          {
            id: "tip-2",
            icon: "🔥",
            title: "The 1% Daily Compound Rule",
            description: "20 minutes of active recall every day beats 6 hours of cramming before mock exams.",
            tag: "STUDY HABIT",
          },
          {
            id: "tip-3",
            icon: "🎯",
            title: "GCE Past Paper Blueprint",
            description: "Solve at least 5 years of paper 2 questions under timed conditions to double your speed.",
            tag: "GCE MASTERY",
          },
        ],
      });
    }

    const targetLevelName =
      educationLevel === "ol"
        ? "Cameroon GCE Ordinary Level (O/L)"
        : educationLevel === "al"
        ? "Cameroon GCE Advanced Level (A/L)"
        : "University Level";

    const prompt = `You are Ticha AI, an expert exam strategist for Cameroonian students.
Generate 3 concise, highly memorable, high-impact exam tutor tips for ${name}, who is studying for the ${targetLevelName} in the ${region} region.
Language: ${preferredLanguage === "fr" ? "French" : "English"}.

Return ONLY valid JSON in this format:
{
  "tips": [
    {
      "id": "tip-1",
      "icon": "emoji",
      "title": "Short Catchy Title (max 5 words)",
      "description": "One powerful, actionable advice sentence (max 20 words)",
      "tag": "EXAM TIP"
    }
  ]
}`;

    const modelName = "gemini-2.5-flash";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const parsed = JSON.parse(rawText);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Onboarding tips API error:", error);
    return NextResponse.json({
      tips: [
        {
          id: "tip-1",
          icon: "💡",
          title: "Master GCE Directives",
          description: "'Define' means exact textbook wording, while 'Explain' requires cause and effect reasons.",
          tag: "EXAM STRATEGY",
        },
        {
          id: "tip-2",
          icon: "⚡",
          title: "Active Memory Recall",
          description: "Test yourself after every 15 minutes of reading instead of passive re-reading.",
          tag: "RETENTION",
        },
        {
          id: "tip-[#]",
          icon: "🏆",
          title: "Timed Past Paper Drills",
          description: "Simulate real exam hall pressure by timing your solution for each question mark.",
          tag: "PRACTICE",
        },
      ],
    });
  }
}
