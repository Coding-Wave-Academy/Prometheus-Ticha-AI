// ─── RAG Summaries API ─────────────────────────────────────────────────────────
// POST /api/rag/summaries
// Generates topic summaries from the knowledge base. If sufficient chunks exist,
// the summary is grounded in verified content. Otherwise falls back to Gemini.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { retrieveContext } from '@/lib/rag/retriever';
import { injectContextIntoPrompt } from '@/lib/rag/promptBuilder';

export const dynamic = 'force-dynamic';

/** Create a Supabase service client. */
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) throw new Error('Missing Supabase config');
  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { subject, topic, educationLevel } = await req.json();

    if (!subject || !topic) {
      return NextResponse.json(
        { error: 'Subject and topic are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service unavailable' },
        { status: 503 }
      );
    }

    // 1. Retrieve knowledge chunks for the topic
    const chunks = await retrieveContext({
      query: `${subject} ${topic} summary key concepts definitions formulas`,
      subject,
      educationLevel: educationLevel || 'al',
      topK: 10,
      threshold: 0.4,
    });

    const isGrounded = chunks.length >= 2;

    // 2. Build the summary prompt
    const basePrompt = `You are Madame Ticha, a Cameroonian GCE exam preparation specialist.
Generate a comprehensive study summary for:
Subject: "${subject}"
Topic: "${topic}"
Education level: "${educationLevel || 'al'}"

FORMAT RULES:
- Write in PLAIN TEXT only. No markdown symbols (no ###, no **, no ***, no backticks, no LaTeX).
- Use clear numbered sections and bullet points.
- Keep language simple — a young Cameroonian student must understand everything.

STRUCTURE (follow this exact structure):
{
  "title": "Topic title",
  "overview": "A 2-3 sentence overview of what this topic covers and why it matters for GCE exams.",
  "keyConceptsIntro": "A brief intro sentence for the key concepts section.",
  "keyConcepts": [
    {
      "term": "Concept name",
      "definition": "Clear, concise definition.",
      "example": "A practical example or application."
    }
  ],
  "formulas": [
    {
      "name": "Formula name",
      "formula": "The formula in plain text (e.g., F = ma)",
      "meaning": "What each symbol represents and when to use it."
    }
  ],
  "examTips": [
    "Specific, actionable exam tip 1",
    "Specific, actionable exam tip 2",
    "Specific, actionable exam tip 3"
  ],
  "commonMistakes": [
    "Common mistake 1 and how to avoid it",
    "Common mistake 2 and how to avoid it"
  ],
  "practicePrompt": "A thought-provoking question the student can try to test their understanding."
}

Return ONLY raw JSON. Do not wrap in code blocks.`;

    const prompt = injectContextIntoPrompt(basePrompt, chunks, 4000);

    // 3. Call Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    if (!response.ok) {
      console.error('[RAG/summaries] Gemini error:', await response.text());
      return NextResponse.json(
        { summary: buildFallbackSummary(subject, topic), isGrounded: false },
        { status: 200 }
      );
    }

    const json = await response.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return NextResponse.json(
        { summary: buildFallbackSummary(subject, topic), isGrounded: false },
        { status: 200 }
      );
    }

    const parsed = JSON.parse(rawText.trim());

    return NextResponse.json({
      summary: parsed,
      isGrounded,
      chunksUsed: chunks.length,
      sources: isGrounded
        ? chunks.slice(0, 3).map((c) => ({
            subject: c.subject,
            topic: c.topic,
            similarity: Math.round(c.similarity * 100),
          }))
        : [],
    });
  } catch (error) {
    console.error('[RAG/summaries] Summary generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}

/** Fallback summary when Gemini is unavailable. */
function buildFallbackSummary(subject: string, topic: string) {
  return {
    title: topic,
    overview: `${topic} is a core topic in ${subject} for the GCE curriculum. Understanding this topic is essential for exam success.`,
    keyConceptsIntro: 'Here are the fundamental concepts you need to master:',
    keyConcepts: [
      {
        term: 'Core Principle',
        definition: `The fundamental principle behind ${topic} that forms the basis of exam questions.`,
        example: 'Review your textbook for detailed worked examples.',
      },
    ],
    formulas: [],
    examTips: [
      'Always read the question twice before answering.',
      'Show your working clearly for maximum marks.',
      'Check units and significant figures in your final answer.',
    ],
    commonMistakes: [
      'Rushing through calculations without checking units.',
      'Not drawing diagrams when the question involves spatial concepts.',
    ],
    practicePrompt: `Try explaining ${topic} in your own words to a friend. If you can teach it, you understand it.`,
  };
}
