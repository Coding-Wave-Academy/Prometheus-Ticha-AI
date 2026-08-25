// ─── RAG System Types ──────────────────────────────────────────────────────────
// Shared TypeScript types for the Corrected RAG pipeline.
// Used by: embeddings, chunker, retriever, promptBuilder, converter, API routes.

/** Metadata attached to a source document after ingestion. */
export interface DocumentMetadata {
  pageCount?: number;
  author?: string;
  year?: number;
  examSession?: string;
  sourceUrl?: string;
  conversionModel?: string;
  processingTimeMs?: number;
  [key: string]: unknown;
}

/** A full knowledge document stored as the source-of-truth Markdown. */
export interface KnowledgeDocument {
  id: string;
  title: string;
  subject: string;
  topic: string | null;
  educationLevel: string;
  sourceType: 'pdf' | 'image' | 'docx' | 'txt' | 'manual';
  sourceFilename: string | null;
  markdownContent: string;
  metadata: DocumentMetadata;
  chunkCount: number;
  status: 'processing' | 'ready' | 'error';
  createdAt: string;
  updatedAt: string;
}

/** A single semantic chunk ready for embedding and storage. */
export interface ChunkOutput {
  content: string;
  chunkIndex: number;
  tokenCount: number;
  metadata: ChunkMetadata;
}

/** Metadata about where a chunk came from within its document. */
export interface ChunkMetadata {
  sectionTitle?: string;
  pageNumber?: number;
  headingLevel?: number;
  [key: string]: unknown;
}

/** A chunk retrieved from vector search with its similarity score. */
export interface RetrievedChunk {
  id: string;
  documentId: string;
  content: string;
  subject: string;
  topic: string | null;
  similarity: number;
  metadata: ChunkMetadata;
}

/** Parameters for the vector retrieval function. */
export interface RetrievalParams {
  query: string;
  subject?: string;
  educationLevel?: string;
  topK?: number;
  threshold?: number;
}

/** The shape of content sent to the Gemini API. */
export interface GeminiContentPart {
  text: string;
}

export interface GeminiContent {
  role: 'user' | 'model';
  parts: GeminiContentPart[];
}

/** Parameters for building a grounded prompt. */
export interface GroundedPromptParams {
  systemPrompt: string;
  retrievedChunks: RetrievedChunk[];
  userQuery: string;
  history?: GeminiContent[];
  maxContextTokens?: number;
}

/** Result of converting a file to Markdown. */
export interface ConversionResult {
  markdown: string;
  metadata: DocumentMetadata;
}

/** Supported MIME types for file conversion. */
export const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'text/plain',
  'text/markdown',
] as const;

export type SupportedMimeType = typeof SUPPORTED_MIME_TYPES[number];
