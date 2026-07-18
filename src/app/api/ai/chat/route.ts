import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * /api/ai/chat — Personalized AI Tutor chat handler powered by Gemini AI
 * that reads student's goals, education level, and struggles to deliver highly tailored responses.
 */
export async function POST(req: NextRequest) {
  try {
    const { messages, goal, education, struggles, name } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    const studentName = name || "Student";
    const finalGoal = goal || "excellence";
    const finalLevel = education || "al";
    const strugglesList = struggles && struggles.length > 0 ? struggles.join(", ") : "General studies";

    // Static tutoring fallbacks if API key is not configured or queries fail
    const lastMsg = messages?.[messages.length - 1]?.content || "Hello";
    const lowerMsg = lastMsg.toLowerCase();

    let fallbackText = "Hello! I am Ticha AI, your personalized study counselor. Ask me anything about your course outlines, schedules, or study subjects!";
    if (lowerMsg.includes("math") || lowerMsg.includes("limit") || lowerMsg.includes("calculus")) {
      fallbackText = `For ${studentName} struggling with Mathematics at ${finalLevel} level: remember that evaluating limits is all about seeing behavior as variables approach infinity. Practice factoring terms before evaluating limits!`;
    } else if (lowerMsg.includes("physics") || lowerMsg.includes("tunnel") || lowerMsg.includes("wave")) {
      fallbackText = `Regarding Physics at ${finalLevel} level: Quantum tunneling breaks classical rules because wavefunctions have a non-zero probability at potential barrier boundaries. Memorize the transmission coefficient equation!`;
    } else if (lowerMsg.includes("help") || lowerMsg.includes("study") || lowerMsg.includes("exam")) {
      fallbackText = `Ticha AI Exam Warning: Focus on solving GCE past papers. Since your primary goal is "${finalGoal}", build a consistent study schedule of at least 30 minutes daily!`;
    }

    if (!apiKey) {
      console.log("No GEMINI_API_KEY found for chat assistant, returning tutor mock replies.");
      return NextResponse.json({ reply: fallbackText });
    }

    // Build chat history into prompt context
    const historyText = messages
      ?.map((msg: any) => `${msg.sender === "user" ? "Student" : "Ticha AI"}: ${msg.content}`)
      .join("\n") || "";

    const systemPrompt = `
      You are Ticha AI, an expert, supportive Cameroonian curriculum counselor and tutor.
      
      Here is the student profile you are assisting:
      - Student Name: "${studentName}"
      - Education Level: "${finalLevel}" (e.g. ol = O-Level, al = A-Level, university = University)
      - Challenges / Weaknesses: "${strugglesList}"
      - Primary Study Goal: "${finalGoal}"

      Always address the student warmly, keeping your answers concise, practical, and highly educational (1-3 sentences). Focus on helping them overcome their specific struggles and prepare for examinations.

      Here is the conversation log so far:
      ${historyText}

      Respond directly with the next message from Ticha AI. Do not prefix your message with "Ticha AI:".
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            maxOutputTokens: 350,
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

    return NextResponse.json({ reply: rawText.trim() });

  } catch (error) {
    console.error("Gemini tutoring chat failed, returning mock:", error);
    return NextResponse.json({
      reply: "Ticha AI Study Tip: It seems the AI tutor is temporarily offline. Solve past papers while connection is re-established!"
    });
  }
}
