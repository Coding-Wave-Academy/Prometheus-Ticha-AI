import { NextRequest, NextResponse } from "next/server";
import { formatAIText } from "@/lib/formatAIText";
import { retrieveContext } from "@/lib/rag/retriever";
import { injectContextIntoPrompt } from "@/lib/rag/promptBuilder";

export const dynamic = "force-dynamic";

export interface FlashCardItem {
  id: string;
  front: string;
  back: string;
  hint?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { subject, topic } = await req.json();
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    const targetSubject = subject || "Physics";
    const targetTopic = topic || "Newton's Laws of Motion";

    if (!apiKey) {
      return NextResponse.json({
        flashcards: buildFallbackFlashcards(targetSubject, targetTopic),
      });
    }

    // RAG: Retrieve curriculum context for flashcard grounding
    const chunks = await retrieveContext({
      query: `${targetSubject} ${targetTopic} definitions key terms formulas`,
      subject: targetSubject,
      topK: 5,
      threshold: 0.4,
    });

    const basePrompt = `
You are Madame Ticha, a Cameroonian GCE revision specialist.
Create 8 high-yield exam flashcards for:
Subject: "${targetSubject}"
Topic: "${targetTopic}"

CRITICAL FORMAT RULES:
- Do NOT use markdown or LaTeX.
- Keep front concise (question, formula, or key term definition prompt).
- Keep back clear and direct (essential exam answer / explanation).
- Include a short 1-sentence hint for the front.

Return ONLY raw JSON matching this structure:
{
  "flashcards": [
    {
      "front": "State Newton's First Law of Motion.",
      "back": "An object remains at rest or continues at constant velocity unless acted upon by a net external force.",
      "hint": "Think about inertia."
    }
  ]
}`;

    // Inject RAG context into the prompt
    const prompt = injectContextIntoPrompt(basePrompt, chunks, 3000);

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
      return NextResponse.json({
        flashcards: buildFallbackFlashcards(targetSubject, targetTopic),
      });
    }

    const json = await response.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return NextResponse.json({
        flashcards: buildFallbackFlashcards(targetSubject, targetTopic),
      });
    }

    const parsed = JSON.parse(rawText.trim());

    if (!Array.isArray(parsed.flashcards) || parsed.flashcards.length === 0) {
      return NextResponse.json({
        flashcards: buildFallbackFlashcards(targetSubject, targetTopic),
      });
    }

    const flashcards: FlashCardItem[] = parsed.flashcards.map((item: any, idx: number) => ({
      id: `fc-${Date.now()}-${idx}`,
      front: formatAIText(item.front || `Question on ${targetTopic}`),
      back: formatAIText(item.back || `Answer on ${targetTopic}`),
      hint: item.hint ? formatAIText(item.hint) : undefined,
    }));

    return NextResponse.json({ flashcards });
  } catch (err) {
    console.error("Flashcards API error:", err);
    return NextResponse.json({
      flashcards: buildFallbackFlashcards("Physics", "Newton's Laws of Motion"),
    });
  }
}

function buildFallbackFlashcards(subject: string, topic: string): FlashCardItem[] {
  return [
    {
      id: "fc-fallback-1",
      front: `What is the core principle behind ${topic}?`,
      back: `${topic} explains key relationships in ${subject} essential for solving GCE Paper 1 & 2 exam problems.`,
      hint: "Recall fundamental definitions from your daily lesson.",
    },
    {
      id: "fc-fallback-2",
      front: `What units or variables are commonly tested in ${topic}?`,
      back: "Always verify standard SI units and dimensional formula before calculating final values.",
      hint: "Check units on both sides of the equation.",
    },
    {
      id: "fc-fallback-3",
      front: `What common trap do GCE examiners set for ${topic}?`,
      back: "Confusing vector directions and sign conventions. Always draw a clear diagram first!",
      hint: "Pay attention to direction and signs.",
    },
    {
      id: "fc-fallback-4",
      front: `How do you maximize marks when answering ${topic} questions?`,
      back: "Write clear steps: Formula -> Substitution -> Calculation -> Answer with Units.",
      hint: "Follow the standard 4-step exam method.",
    },
  ];
}
