// ─── Grounded Prompt Builder ───────────────────────────────────────────────────
// Assembles Gemini API-compatible content arrays with retrieved knowledge context.
// This is the "AG" in RAG — where retrieved context gets injected into prompts.

import type {
  RetrievedChunk,
  GeminiContent,
  GroundedPromptParams,
} from './types';

/**
 * The grounding instruction appended to every system prompt when context is available.
 * Forces the model to stay within the provided context and cite sources.
 */
const GROUNDING_INSTRUCTION = `
GROUNDING RULES (MANDATORY):
1. Your answers MUST be based on the REFERENCE CONTEXT provided below.
2. If the context contains the answer, use it. Cite references using [Ref 1], [Ref 2], etc.
3. If the context does NOT contain enough information, say: "Based on the available curriculum materials, I don't have specific information on this. Here's what I know from my general training:" — then provide your best answer with a clear disclaimer.
4. NEVER fabricate formulas, dates, names, statistics, or exam rules. If unsure, say so.
5. Prioritize accuracy over completeness. A correct partial answer beats a hallucinated full one.
6. When the context includes GCE marking schemes or syllabus points, quote them exactly.
`;

/**
 * Format retrieved chunks into a numbered reference block for the prompt.
 * Includes source metadata (subject, topic) for transparency.
 */
function formatContextBlock(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return '';

  const references = chunks.map((chunk, idx) => {
    const source = [
      chunk.subject,
      chunk.topic,
      chunk.metadata?.sectionTitle,
    ]
      .filter(Boolean)
      .join(' > ');

    const similarity = (chunk.similarity * 100).toFixed(0);

    return `[Ref ${idx + 1}] (${source} | relevance: ${similarity}%)
${chunk.content}`;
  });

  return `
───────── REFERENCE CONTEXT (from verified curriculum materials) ─────────
${references.join('\n\n')}
───────── END REFERENCE CONTEXT ──────────────────────────────────────────
`;
}

/**
 * Estimate token count for context budget management.
 * 1 token ≈ 4 characters for English text.
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Trim chunks to fit within a token budget.
 * Keeps the highest-similarity chunks first (they're already sorted).
 */
function trimChunksToFit(
  chunks: RetrievedChunk[],
  maxTokens: number
): RetrievedChunk[] {
  const result: RetrievedChunk[] = [];
  let tokenCount = 0;

  for (const chunk of chunks) {
    const chunkTokens = estimateTokens(chunk.content);
    if (tokenCount + chunkTokens > maxTokens) break;
    result.push(chunk);
    tokenCount += chunkTokens;
  }

  return result;
}

/**
 * Build a grounded prompt for the Gemini API.
 *
 * Output structure:
 * 1. USER message: System prompt + grounding rules + reference context
 * 2. MODEL message: Acknowledgment (primes the model to follow instructions)
 * 3. ...conversation history (if any)
 * 4. USER message: The actual student question
 *
 * @param params - System prompt, retrieved chunks, user query, optional history
 * @returns Gemini-compatible content array ready for the API call
 */
export function buildGroundedPrompt(params: GroundedPromptParams): GeminiContent[] {
  const {
    systemPrompt,
    retrievedChunks,
    userQuery,
    history = [],
    maxContextTokens = 4000,
  } = params;

  // Trim chunks to fit context budget
  const fittedChunks = trimChunksToFit(retrievedChunks, maxContextTokens);
  const contextBlock = formatContextBlock(fittedChunks);
  const hasContext = fittedChunks.length > 0;

  // Build the system instruction with optional grounding
  const fullSystemPrompt = hasContext
    ? `${systemPrompt}\n\n${GROUNDING_INSTRUCTION}\n\n${contextBlock}`
    : systemPrompt;

  const acknowledgment = hasContext
    ? `Understood. I will answer based on the ${fittedChunks.length} reference(s) from verified curriculum materials, citing [Ref N] where applicable. I will not fabricate information.`
    : `Understood. I am ready to help. Note: No specific curriculum references were found for this query, so I will use my general training knowledge and clearly indicate this.`;

  const contents: GeminiContent[] = [
    {
      role: 'user',
      parts: [{ text: fullSystemPrompt }],
    },
    {
      role: 'model',
      parts: [{ text: acknowledgment }],
    },
    ...history,
    {
      role: 'user',
      parts: [{ text: userQuery }],
    },
  ];

  return contents;
}

/**
 * Build a grounded prompt specifically for JSON-output routes
 * (quiz, flashcards, daily-lesson) where we need structured output.
 * Injects context into the existing prompt string rather than as separate messages.
 */
export function injectContextIntoPrompt(
  prompt: string,
  chunks: RetrievedChunk[],
  maxContextTokens: number = 3000
): string {
  if (chunks.length === 0) return prompt;

  const fittedChunks = trimChunksToFit(chunks, maxContextTokens);
  const contextBlock = formatContextBlock(fittedChunks);

  return `${prompt}

IMPORTANT: Use the following verified curriculum reference material to ensure accuracy.
If the reference material covers the topic, base your response on it. Cite the reference numbers where applicable.
${contextBlock}`;
}
