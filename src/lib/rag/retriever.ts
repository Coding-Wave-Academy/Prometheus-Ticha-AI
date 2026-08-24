// ─── RAG Retriever ─────────────────────────────────────────────────────────────
// Performs semantic vector search against the knowledge_chunks table.
// This is the core "R" in RAG — retrieves grounding context for any AI call.

import { createClient } from '@supabase/supabase-js';
import { embedQuery } from './embeddings';
import type { RetrievedChunk, RetrievalParams } from './types';

/** Default retrieval parameters. */
const DEFAULTS = {
  topK: 5,
  threshold: 0.5,
} as const;

/**
 * Create a Supabase service client for server-side operations.
 * Uses the secret key (service_role) so we bypass RLS for reads.
 * This should ONLY be called in server-side code (API routes).
 */
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      '[RAG/retriever] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY'
    );
  }

  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Retrieve the most relevant knowledge chunks for a given query.
 *
 * Pipeline:
 * 1. Embed the user's query using text-embedding-004 (RETRIEVAL_QUERY)
 * 2. Call the match_knowledge_chunks RPC function on Supabase
 * 3. Return ranked chunks with similarity scores and metadata
 *
 * @param params - Query string and optional filters (subject, level, topK, threshold)
 * @returns Array of retrieved chunks sorted by similarity (highest first)
 */
export async function retrieveContext(
  params: RetrievalParams
): Promise<RetrievedChunk[]> {
  const {
    query,
    subject,
    educationLevel,
    topK = DEFAULTS.topK,
    threshold = DEFAULTS.threshold,
  } = params;

  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    // Step 1: Embed the query
    const queryEmbedding = await embedQuery(query);

    // Step 2: Vector search via Supabase RPC
    const supabase = getServiceClient();

    const { data, error } = await supabase.rpc('match_knowledge_chunks', {
      query_embedding: queryEmbedding,
      match_count: topK,
      filter_subject: subject || null,
      filter_level: educationLevel || null,
      similarity_threshold: threshold,
    });

    if (error) {
      console.error('[RAG/retriever] Supabase RPC error:', error);
      return [];
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    // Step 3: Map to typed chunks
    const chunks: RetrievedChunk[] = data.map((row: Record<string, unknown>) => ({
      id: row.id as string,
      documentId: row.document_id as string,
      content: row.content as string,
      subject: row.subject as string,
      topic: (row.topic as string) || null,
      similarity: row.similarity as number,
      metadata: (row.metadata as Record<string, unknown>) || {},
    }));

    return chunks;
  } catch (err) {
    console.error('[RAG/retriever] Failed to retrieve context:', err);
    return [];
  }
}

/**
 * Check if the knowledge base has any content for a given subject/topic.
 * Useful for deciding whether to use RAG or fall back to pure generation.
 */
export async function hasKnowledgeFor(
  subject: string,
  topic?: string
): Promise<boolean> {
  try {
    const supabase = getServiceClient();

    let query = supabase
      .from('knowledge_chunks')
      .select('id', { count: 'exact', head: true })
      .eq('subject', subject);

    if (topic) {
      query = query.eq('topic', topic);
    }

    const { count, error } = await query;

    if (error) {
      console.error('[RAG/retriever] hasKnowledgeFor error:', error);
      return false;
    }

    return (count ?? 0) > 0;
  } catch {
    return false;
  }
}
