// ─── Embedding Generator ───────────────────────────────────────────────────────
// Wraps Google's text-embedding-004 model for generating 768-dimensional vectors.
// Used for both document ingestion (embed chunks) and query time (embed user query).

const EMBEDDING_MODEL = 'text-embedding-004';
const EMBEDDING_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}`;
const EMBEDDING_DIMENSION = 768;

/** Maximum texts per batch call (Google API limit). */
const MAX_BATCH_SIZE = 100;

function getApiKey(): string {
  const key = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('[RAG/embeddings] Missing GOOGLE_GEMINI_API_KEY environment variable');
  }
  return key;
}

/**
 * Embed a single text string into a 768-dimensional vector.
 * Uses the embedContent endpoint (single document).
 */
export async function embedText(text: string): Promise<number[]> {
  const apiKey = getApiKey();

  const response = await fetch(`${EMBEDDING_API_URL}:embedContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: `models/${EMBEDDING_MODEL}`,
      content: { parts: [{ text }] },
      taskType: 'RETRIEVAL_QUERY',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`[RAG/embeddings] embedText failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const values: number[] = data?.embedding?.values;

  if (!values || values.length !== EMBEDDING_DIMENSION) {
    throw new Error(
      `[RAG/embeddings] Unexpected embedding dimension: expected ${EMBEDDING_DIMENSION}, got ${values?.length ?? 0}`
    );
  }

  return values;
}

/**
 * Embed multiple texts in a single batch call.
 * Uses the batchEmbedContents endpoint for efficiency.
 * Automatically splits into sub-batches if > MAX_BATCH_SIZE.
 */
export async function embedBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  if (texts.length === 1) return [await embedText(texts[0])];

  const apiKey = getApiKey();
  const allEmbeddings: number[][] = [];

  // Split into sub-batches if needed
  for (let i = 0; i < texts.length; i += MAX_BATCH_SIZE) {
    const batch = texts.slice(i, i + MAX_BATCH_SIZE);

    const requests = batch.map((text) => ({
      model: `models/${EMBEDDING_MODEL}`,
      content: { parts: [{ text }] },
      taskType: 'RETRIEVAL_DOCUMENT',
    }));

    const response = await fetch(`${EMBEDDING_API_URL}:batchEmbedContents?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`[RAG/embeddings] embedBatch failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const embeddings: { values: number[] }[] = data?.embeddings;

    if (!embeddings || embeddings.length !== batch.length) {
      throw new Error(
        `[RAG/embeddings] Batch mismatch: sent ${batch.length}, got ${embeddings?.length ?? 0}`
      );
    }

    for (const emb of embeddings) {
      if (!emb.values || emb.values.length !== EMBEDDING_DIMENSION) {
        throw new Error(`[RAG/embeddings] Invalid embedding dimension in batch result`);
      }
      allEmbeddings.push(emb.values);
    }
  }

  return allEmbeddings;
}

/**
 * Embed a user query with RETRIEVAL_QUERY task type.
 * This produces an embedding optimized for searching against RETRIEVAL_DOCUMENT embeddings.
 */
export async function embedQuery(query: string): Promise<number[]> {
  return embedText(query);
}
