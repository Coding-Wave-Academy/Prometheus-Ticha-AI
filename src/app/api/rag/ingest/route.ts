// ─── RAG Ingestion API ─────────────────────────────────────────────────────────
// POST /api/rag/ingest
// Admin-only endpoint for uploading and processing documents into the knowledge base.
// Pipeline: File → Convert to Markdown → Chunk → Embed → Store in Supabase.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { convertToMarkdown, isSupportedMimeType } from '@/lib/rag/converter';
import { chunkMarkdown } from '@/lib/rag/chunker';
import { embedBatch } from '@/lib/rag/embeddings';

export const dynamic = 'force-dynamic';

// Maximum file size: 20MB
const MAX_FILE_SIZE = 20 * 1024 * 1024;

/** Create a Supabase service client (bypasses RLS). */
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Validate the admin authorization header. */
function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return false;

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  return !!secretKey && token === secretKey;
}

export async function POST(req: NextRequest) {
  // 1. Auth check — admin only
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { error: 'Unauthorized. This endpoint requires admin access.' },
      { status: 401 }
    );
  }

  try {
    // 2. Parse FormData
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const subject = formData.get('subject') as string | null;
    const topic = (formData.get('topic') as string) || null;
    const educationLevel = (formData.get('educationLevel') as string) || 'al';
    const title = (formData.get('title') as string) || null;

    // 3. Validate inputs
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!subject) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }
    if (!isSupportedMimeType(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Supported: PDF, PNG, JPG, WEBP, DOCX, TXT, MD` },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();
    const documentTitle = title || file.name.replace(/\.[^/.]+$/, '');

    // 4. Create document record (status: processing)
    const { data: docData, error: docError } = await supabase
      .from('knowledge_documents')
      .insert({
        title: documentTitle,
        subject,
        topic,
        education_level: educationLevel,
        source_type: getSourceType(file.type),
        source_filename: file.name,
        markdown_content: '', // Will be updated after conversion
        metadata: {},
        chunk_count: 0,
        status: 'processing',
      })
      .select('id')
      .single();

    if (docError || !docData) {
      console.error('[RAG/ingest] Failed to create document record:', docError);
      return NextResponse.json(
        { error: 'Failed to create document record' },
        { status: 500 }
      );
    }

    const documentId = docData.id;

    try {
      // 5. Convert file to Markdown
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const { markdown, metadata } = await convertToMarkdown(
        fileBuffer,
        file.name,
        file.type
      );

      if (!markdown || markdown.trim().length === 0) {
        throw new Error('Conversion produced empty Markdown');
      }

      // 6. Chunk the Markdown
      const chunks = chunkMarkdown(markdown);

      if (chunks.length === 0) {
        throw new Error('Chunking produced zero chunks');
      }

      // 7. Generate embeddings for all chunks (batched)
      const chunkTexts = chunks.map((c) => c.content);
      const embeddings = await embedBatch(chunkTexts);

      // 8. Store chunks with embeddings
      const chunkRows = chunks.map((chunk, idx) => ({
        document_id: documentId,
        chunk_index: chunk.chunkIndex,
        content: chunk.content,
        subject,
        topic,
        education_level: educationLevel,
        embedding: embeddings[idx],
        token_count: chunk.tokenCount,
        metadata: chunk.metadata,
      }));

      // Insert in batches of 50 to avoid payload limits
      for (let i = 0; i < chunkRows.length; i += 50) {
        const batch = chunkRows.slice(i, i + 50);
        const { error: chunkError } = await supabase
          .from('knowledge_chunks')
          .insert(batch);

        if (chunkError) {
          console.error(`[RAG/ingest] Failed to insert chunk batch ${i}:`, chunkError);
          throw new Error(`Failed to store chunk batch: ${chunkError.message}`);
        }
      }

      // 9. Update document with Markdown content and status
      const { error: updateError } = await supabase
        .from('knowledge_documents')
        .update({
          markdown_content: markdown,
          metadata: { ...metadata, originalSize: file.size },
          chunk_count: chunks.length,
          status: 'ready',
          updated_at: new Date().toISOString(),
        })
        .eq('id', documentId);

      if (updateError) {
        console.error('[RAG/ingest] Failed to update document:', updateError);
      }

      // 10. Return success
      return NextResponse.json({
        success: true,
        documentId,
        title: documentTitle,
        subject,
        topic,
        chunkCount: chunks.length,
        markdownLength: markdown.length,
        processingTimeMs: metadata.processingTimeMs,
        status: 'ready',
      });
    } catch (processingError) {
      // Mark document as errored
      await supabase
        .from('knowledge_documents')
        .update({
          status: 'error',
          metadata: {
            error: processingError instanceof Error
              ? processingError.message
              : 'Unknown processing error',
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', documentId);

      throw processingError;
    }
  } catch (error) {
    console.error('[RAG/ingest] Ingestion failed:', error);
    return NextResponse.json(
      {
        error: 'Ingestion failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/** Map MIME type to source_type enum value. */
function getSourceType(mimeType: string): string {
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.includes('wordprocessingml')) return 'docx';
  return 'txt';
}
