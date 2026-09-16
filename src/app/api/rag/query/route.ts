// ─── RAG Query API ─────────────────────────────────────────────────────────────
// POST /api/rag/query
// Public-facing RAG query endpoint for authenticated users.
// Pipeline: Query → Embed → Vector Search → Grounded Gemini Generation → Stream

import { NextRequest, NextResponse } from 'next/server';
import { retrieveContext } from '@/lib/rag/retriever';
import { buildGroundedPrompt } from '@/lib/rag/promptBuilder';

export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `You are the Ticha AI Knowledge Assistant, an expert on the Cameroonian GCE curriculum (Ordinary and Advanced Level).
Your role is to answer student questions with verified, curriculum-aligned information.
Be clear, concise, and student-friendly. Use plain language a young Cameroonian student would understand.
When presenting formulas, use plain-text notation (F = ma, not LaTeX).
Always be encouraging — education is a journey, not a race.`;

export async function POST(req: NextRequest) {
  try {
    const { query, subject, educationLevel, topK } = await req.json();

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required' },
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

    // 1. Retrieve relevant knowledge chunks
    const chunks = await retrieveContext({
      query: query.trim(),
      subject: subject || undefined,
      educationLevel: educationLevel || undefined,
      topK: topK || 5,
      threshold: 0.45,
    });

    // 2. Build grounded prompt
    const contents = buildGroundedPrompt({
      systemPrompt: SYSTEM_PROMPT,
      retrievedChunks: chunks,
      userQuery: query.trim(),
    });

    // 3. Call Gemini with streaming
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[RAG/query] Gemini API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate response' },
        { status: response.status }
      );
    }

    // 4. Stream the response back with metadata header
    const headers = new Headers({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-RAG-Chunks-Used': String(chunks.length),
      'X-RAG-Grounded': chunks.length > 0 ? 'true' : 'false',
    });

    return new NextResponse(response.body, { headers });
  } catch (error) {
    console.error('[RAG/query] Query failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
