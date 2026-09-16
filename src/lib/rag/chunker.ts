// ─── Semantic Markdown Chunker ─────────────────────────────────────────────────
// Splits Markdown content into semantically coherent chunks for embedding.
// Strategy: header-aware splitting with overlap to preserve cross-boundary context.

import type { ChunkOutput, ChunkMetadata } from './types';

/** Configuration for the chunker. */
interface ChunkerConfig {
  /** Target tokens per chunk. Default: 400. */
  targetTokens?: number;
  /** Maximum tokens per chunk. Default: 600. */
  maxTokens?: number;
  /** Overlap tokens between adjacent chunks. Default: 50. */
  overlapTokens?: number;
}

const DEFAULT_CONFIG: Required<ChunkerConfig> = {
  targetTokens: 400,
  maxTokens: 600,
  overlapTokens: 50,
};

/**
 * Rough token count estimate. 1 token ≈ 4 characters for English text.
 * Good enough for chunking decisions — exact counts aren't needed here.
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/** Detect if a line is a Markdown header and return its level + title. */
function parseHeader(line: string): { level: number; title: string } | null {
  const match = line.match(/^(#{1,6})\s+(.+)$/);
  if (!match) return null;
  return { level: match[1].length, title: match[2].trim() };
}

/**
 * Split Markdown into semantic sections based on headers.
 * Each section keeps its header context for metadata.
 */
interface Section {
  content: string;
  metadata: ChunkMetadata;
}

function splitIntoSections(markdown: string): Section[] {
  const lines = markdown.split('\n');
  const sections: Section[] = [];
  let currentLines: string[] = [];
  let currentMeta: ChunkMetadata = {};

  for (const line of lines) {
    const header = parseHeader(line);

    if (header) {
      // Flush previous section if it has content
      if (currentLines.length > 0) {
        const content = currentLines.join('\n').trim();
        if (content.length > 0) {
          sections.push({ content, metadata: { ...currentMeta } });
        }
      }
      currentLines = [line];
      currentMeta = {
        sectionTitle: header.title,
        headingLevel: header.level,
      };
    } else {
      currentLines.push(line);
    }
  }

  // Flush remaining
  if (currentLines.length > 0) {
    const content = currentLines.join('\n').trim();
    if (content.length > 0) {
      sections.push({ content, metadata: { ...currentMeta } });
    }
  }

  return sections;
}

/**
 * Split a single section into smaller chunks if it exceeds maxTokens.
 * Splits on paragraph boundaries (double newline), then sentence boundaries.
 */
function splitLargeSection(
  section: Section,
  maxTokens: number,
  targetTokens: number
): Section[] {
  const tokens = estimateTokens(section.content);
  if (tokens <= maxTokens) return [section];

  // Try paragraph splitting first
  const paragraphs = section.content.split(/\n\n+/);
  const results: Section[] = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    const combined = currentChunk ? `${currentChunk}\n\n${para}` : para;

    if (estimateTokens(combined) > targetTokens && currentChunk.length > 0) {
      results.push({
        content: currentChunk.trim(),
        metadata: { ...section.metadata },
      });
      currentChunk = para;
    } else {
      currentChunk = combined;
    }
  }

  if (currentChunk.trim().length > 0) {
    results.push({
      content: currentChunk.trim(),
      metadata: { ...section.metadata },
    });
  }

  // If any result is still too large, split by sentences
  const finalResults: Section[] = [];
  for (const chunk of results) {
    if (estimateTokens(chunk.content) > maxTokens) {
      const sentences = chunk.content.split(/(?<=[.!?])\s+/);
      let sentenceChunk = '';

      for (const sentence of sentences) {
        const combined = sentenceChunk ? `${sentenceChunk} ${sentence}` : sentence;
        if (estimateTokens(combined) > targetTokens && sentenceChunk.length > 0) {
          finalResults.push({
            content: sentenceChunk.trim(),
            metadata: { ...chunk.metadata },
          });
          sentenceChunk = sentence;
        } else {
          sentenceChunk = combined;
        }
      }
      if (sentenceChunk.trim().length > 0) {
        finalResults.push({
          content: sentenceChunk.trim(),
          metadata: { ...chunk.metadata },
        });
      }
    } else {
      finalResults.push(chunk);
    }
  }

  return finalResults;
}

/**
 * Add overlap between adjacent chunks to prevent context loss at boundaries.
 * Takes the last N tokens from the previous chunk and prepends to the current chunk.
 */
function addOverlap(chunks: Section[], overlapTokens: number): Section[] {
  if (chunks.length <= 1 || overlapTokens <= 0) return chunks;

  const result: Section[] = [chunks[0]];

  for (let i = 1; i < chunks.length; i++) {
    const prevContent = chunks[i - 1].content;
    const prevWords = prevContent.split(/\s+/);
    // Approximate: 1 token ≈ 0.75 words
    const overlapWords = Math.ceil(overlapTokens * 0.75);
    const overlapText = prevWords.slice(-overlapWords).join(' ');

    result.push({
      content: `${overlapText}\n\n${chunks[i].content}`,
      metadata: { ...chunks[i].metadata },
    });
  }

  return result;
}

/**
 * Main chunking function. Takes raw Markdown and produces an array of
 * ChunkOutput objects ready for embedding and storage.
 *
 * @param markdown - The full Markdown document content.
 * @param config - Optional chunking configuration overrides.
 * @returns Array of chunks with content, index, token count, and metadata.
 */
export function chunkMarkdown(
  markdown: string,
  config?: ChunkerConfig
): ChunkOutput[] {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  if (!markdown || markdown.trim().length === 0) {
    return [];
  }

  // Step 1: Split into header-based sections
  const sections = splitIntoSections(markdown);

  // Step 2: Split oversized sections into smaller pieces
  const splitSections = sections.flatMap((s) =>
    splitLargeSection(s, cfg.maxTokens, cfg.targetTokens)
  );

  // Step 3: Merge tiny adjacent sections (< 100 tokens) into their neighbor
  const mergedSections: Section[] = [];
  for (const section of splitSections) {
    const tokens = estimateTokens(section.content);
    if (
      tokens < 100 &&
      mergedSections.length > 0 &&
      estimateTokens(mergedSections[mergedSections.length - 1].content) + tokens < cfg.maxTokens
    ) {
      // Merge into previous section
      const prev = mergedSections[mergedSections.length - 1];
      prev.content = `${prev.content}\n\n${section.content}`;
    } else {
      mergedSections.push(section);
    }
  }

  // Step 4: Add overlap between chunks
  const overlappedSections = addOverlap(mergedSections, cfg.overlapTokens);

  // Step 5: Convert to ChunkOutput with index and token count
  return overlappedSections.map((section, index) => ({
    content: section.content,
    chunkIndex: index,
    tokenCount: estimateTokens(section.content),
    metadata: section.metadata,
  }));
}
