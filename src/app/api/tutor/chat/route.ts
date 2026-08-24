import { NextRequest, NextResponse } from "next/server";
import { retrieveContext } from "@/lib/rag/retriever";
import { buildGroundedPrompt } from "@/lib/rag/promptBuilder";

const SYSTEM_PROMPT = `You are the Ticha AI Tutor, an expert teacher aligned with the Cameroonian GCE curriculum (Ordinary and Advanced Level).
You must use DataCamp-style adaptive pacing:
1. Micro-Instruction Segments: Alternate between short 3-to-5 minute lessons and interactive exercise blocks.
2. Context-Aware Examples: Explanations and exercises dynamically relate to real-world Cameroonian context, student's target exam (GCE O/L or A/L), and goals.
3. Intelligent Feedback: Explicitly explain WHY a student's answer is wrong or right instead of just marking it.
4. Adaptive Pacing: Modulate your depth and difficulty based on performance score (0.0 - 1.0).
   - Score < 0.4: Simplify concepts, provide worked examples, step-by-step guidance.
   - Score 0.4 - 0.7: Balanced standard curriculum speed.
   - Score > 0.7: Advanced challenging GCE Past Paper questions, fast-paced exercises.

Structure your responses using these exact markers (include the brackets):
[LESSON]
(Educational explanation with clear headers, key terms, or memorable examples)

[EXERCISE]
(Interactive single question for the student to solve)

[FEEDBACK]
(Detailed feedback explaining why an answer is correct or incorrect)`;

export async function POST(req: NextRequest) {
  try {
    const { sessionId, message, subject, educationLevel, performanceScore, history } = await req.json();

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing Gemini API key" }, { status: 500 });
    }

    // RAG: Retrieve relevant curriculum context for the student's message
    const chunks = await retrieveContext({
      query: message,
      subject: subject || undefined,
      educationLevel: educationLevel || undefined,
      topK: 5,
      threshold: 0.45,
    });

    // Build grounded prompt with retrieved context injected
    const fullSystemPrompt = SYSTEM_PROMPT + `\n\nCurrent subject: ${subject}\nEducation level: ${educationLevel}\nPerformance score: ${performanceScore}`;

    const contents = buildGroundedPrompt({
      systemPrompt: fullSystemPrompt,
      retrievedChunks: chunks,
      userQuery: message,
      history: history || [],
    });

    // Default model: gemini-2.5-flash
    let modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    let response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    // Fallback to gemini-2.5-pro or flash if error
    if (!response.ok && modelName.includes("pro")) {
      console.warn("Gemini Pro failed, falling back to Gemini 2.5 Flash");
      modelName = "gemini-2.5-flash";
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?alt=sse&key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents }),
        }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      return NextResponse.json({ error: "Failed to generate content from Gemini" }, { status: response.status });
    }

    return new NextResponse(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
