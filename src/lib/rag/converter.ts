// ─── File-to-Markdown Converter ────────────────────────────────────────────────
// Converts PDF, images, DOCX, and text files into clean, structured Markdown.
// Uses Gemini Vision (multimodal) for PDF/image conversion.
// Uses mammoth for DOCX → HTML → Markdown conversion.
// This is the ingestion front door — every file enters the system through here.

import type { ConversionResult, DocumentMetadata, SupportedMimeType } from './types';
import { SUPPORTED_MIME_TYPES } from './types';

/** Check if a MIME type is supported. */
export function isSupportedMimeType(mimeType: string): mimeType is SupportedMimeType {
  return (SUPPORTED_MIME_TYPES as readonly string[]).includes(mimeType);
}

/**
 * Convert a file to clean Markdown.
 *
 * Strategy by MIME type:
 * - PDF       → Gemini Vision API (handles text, diagrams, equations, tables)
 * - Image     → Gemini Vision API (OCR + structural understanding)
 * - DOCX      → mammoth.js (text extraction → Markdown formatting)
 * - TXT/MD    → Pass-through with normalization
 *
 * @param file - The raw file bytes
 * @param filename - Original filename for metadata
 * @param mimeType - MIME type of the file
 * @returns Converted Markdown content and extraction metadata
 */
export async function convertToMarkdown(
  file: Buffer | ArrayBuffer,
  filename: string,
  mimeType: string
): Promise<ConversionResult> {
  if (!isSupportedMimeType(mimeType)) {
    throw new Error(`[RAG/converter] Unsupported file type: ${mimeType}`);
  }

  const startTime = Date.now();

  let result: ConversionResult;

  if (mimeType === 'application/pdf') {
    result = await convertPdfWithGemini(file, filename);
  } else if (mimeType.startsWith('image/')) {
    result = await convertImageWithGemini(file, filename, mimeType);
  } else if (
    mimeType ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    result = await convertDocx(file, filename);
  } else {
    // text/plain or text/markdown — pass through
    result = convertPlainText(file, filename, mimeType);
  }

  result.metadata.processingTimeMs = Date.now() - startTime;
  return result;
}

/**
 * Convert PDF to Markdown using Gemini Vision.
 * Sends the entire PDF as base64 inline data to Gemini's multimodal endpoint.
 */
async function convertPdfWithGemini(
  file: Buffer | ArrayBuffer,
  filename: string
): Promise<ConversionResult> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('[RAG/converter] Missing GOOGLE_GEMINI_API_KEY for PDF conversion');
  }

  const base64 = bufferToBase64(file);

  const prompt = `You are an expert document converter for Cameroonian GCE educational materials.
Convert this PDF document into clean, well-structured Markdown.

CONVERSION RULES:
1. Preserve ALL text content — do not skip or summarize anything.
2. Use proper Markdown headers (# for main title, ## for sections, ### for subsections).
3. Convert tables to Markdown table syntax.
4. Convert equations to plain-text notation (e.g., "F = ma", "E = mc^2", "v = u + at").
   Do NOT use LaTeX (no \\frac, no $...$, no \\mathbb). Use Unicode symbols where helpful (×, ÷, √, π, θ).
5. Preserve numbered lists and bullet points as Markdown lists.
6. If the document contains diagrams, describe them in [DIAGRAM: description] tags.
7. If the document has page numbers, add <!-- page N --> comments between pages.
8. Do NOT add any commentary, explanations, or annotations of your own.

Return ONLY the converted Markdown content.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: 'application/pdf',
                  data: base64,
                },
              },
              { text: prompt },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 65536,
          temperature: 0.1,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`[RAG/converter] Gemini PDF conversion failed (${response.status}): ${errorText}`);
  }

  const json = await response.json();
  const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('[RAG/converter] Empty response from Gemini for PDF conversion');
  }

  const markdown = normalizeMarkdown(rawText);

  // Estimate page count from page markers
  const pageMarkers = (markdown.match(/<!-- page \d+ -->/g) || []).length;

  return {
    markdown,
    metadata: {
      pageCount: pageMarkers > 0 ? pageMarkers : undefined,
      conversionModel: 'gemini-2.5-flash',
      sourceUrl: undefined,
    },
  };
}

/**
 * Convert an image (PNG, JPG, WEBP, GIF) to Markdown using Gemini Vision.
 * Extracts text content from the image and structures it as Markdown.
 */
async function convertImageWithGemini(
  file: Buffer | ArrayBuffer,
  filename: string,
  mimeType: string
): Promise<ConversionResult> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('[RAG/converter] Missing GOOGLE_GEMINI_API_KEY for image conversion');
  }

  const base64 = bufferToBase64(file);

  const prompt = `You are an expert OCR and document converter for Cameroonian GCE educational materials.
Extract ALL text content from this image and convert it into clean, structured Markdown.

RULES:
1. Extract every piece of text visible in the image — headings, body text, labels, captions, equations, tables.
2. Use proper Markdown formatting (headers, lists, tables, bold for key terms).
3. Convert equations to plain-text notation (e.g., "F = ma"). No LaTeX.
4. If the image contains a diagram or figure, describe it in [DIAGRAM: description] tags.
5. Maintain the logical reading order of the content.
6. Do NOT add commentary or explanations — only extract what's in the image.

Return ONLY the extracted Markdown content.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inlineData: { mimeType, data: base64 },
              },
              { text: prompt },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 16384,
          temperature: 0.1,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`[RAG/converter] Gemini image conversion failed (${response.status}): ${errorText}`);
  }

  const json = await response.json();
  const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('[RAG/converter] Empty response from Gemini for image conversion');
  }

  return {
    markdown: normalizeMarkdown(rawText),
    metadata: {
      pageCount: 1,
      conversionModel: 'gemini-2.5-flash',
    },
  };
}

/**
 * Convert DOCX to Markdown using mammoth.js.
 * mammoth extracts text with semantic meaning (headings, lists, etc.)
 * and we convert the HTML output to Markdown.
 */
async function convertDocx(
  file: Buffer | ArrayBuffer,
  filename: string
): Promise<ConversionResult> {
  // Dynamic import — mammoth is only needed for DOCX
  const mammoth = await import('mammoth');

  const buffer = file instanceof ArrayBuffer ? Buffer.from(file) : file;
  const result = await mammoth.convertToHtml({ buffer });

  if (!result.value || result.value.trim().length === 0) {
    throw new Error('[RAG/converter] mammoth produced empty output for DOCX');
  }

  // Convert HTML to Markdown
  const markdown = htmlToMarkdown(result.value);

  return {
    markdown: normalizeMarkdown(markdown),
    metadata: {
      conversionModel: 'mammoth',
    },
  };
}

/**
 * Handle plain text and Markdown pass-through.
 */
function convertPlainText(
  file: Buffer | ArrayBuffer,
  filename: string,
  mimeType: string
): ConversionResult {
  const buffer = file instanceof ArrayBuffer ? Buffer.from(file) : file;
  const text = buffer.toString('utf-8');

  return {
    markdown: normalizeMarkdown(text),
    metadata: {
      conversionModel: 'passthrough',
    },
  };
}

// ─── Helper utilities ──────────────────────────────────────────────────────────

/** Convert Buffer/ArrayBuffer to base64 string. */
function bufferToBase64(file: Buffer | ArrayBuffer): string {
  const buffer = file instanceof ArrayBuffer ? Buffer.from(file) : file;
  return buffer.toString('base64');
}

/**
 * Normalize Markdown output:
 * - Strip code block wrappers (```markdown ... ```)
 * - Collapse excessive whitespace
 * - Trim leading/trailing whitespace
 */
function normalizeMarkdown(text: string): string {
  let md = text;

  // Remove wrapping code block if Gemini returns ```markdown ... ```
  md = md.replace(/^```(?:markdown|md)?\s*\n?/i, '');
  md = md.replace(/\n?```\s*$/i, '');

  // Collapse 3+ consecutive blank lines into 2
  md = md.replace(/\n{4,}/g, '\n\n\n');

  return md.trim();
}

/**
 * Basic HTML → Markdown converter for mammoth output.
 * Handles the common elements mammoth produces.
 */
function htmlToMarkdown(html: string): string {
  let md = html;

  // Headers
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
  md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
  md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');

  // Bold and italic
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

  // Lists
  md = md.replace(/<ul[^>]*>/gi, '\n');
  md = md.replace(/<\/ul>/gi, '\n');
  md = md.replace(/<ol[^>]*>/gi, '\n');
  md = md.replace(/<\/ol>/gi, '\n');
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');

  // Paragraphs and line breaks
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  md = md.replace(/<br\s*\/?>/gi, '\n');

  // Links
  md = md.replace(/<a[^>]+href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // Remove remaining HTML tags
  md = md.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  md = md.replace(/&amp;/g, '&');
  md = md.replace(/&lt;/g, '<');
  md = md.replace(/&gt;/g, '>');
  md = md.replace(/&quot;/g, '"');
  md = md.replace(/&#39;/g, "'");
  md = md.replace(/&nbsp;/g, ' ');

  return md;
}
