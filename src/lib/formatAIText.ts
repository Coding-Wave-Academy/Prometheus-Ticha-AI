/**
 * Helper to sanitize and format AI generated text for clean display.
 * Strips markdown headers (###, ##, #), bold/italic syntax (***, **, *),
 * code blocks, and excessive line breaks.
 */
export function formatAIText(text: string): string {
  if (!text) return "";

  return text
    // Remove markdown code blocks ``` ... ```
    .replace(/```[\s\S]*?```/g, (match) => match.replace(/```/g, "").trim())
    // Remove inline code ticks
    .replace(/`([^`]+)`/g, "$1")
    // Remove headers ###, ##, #
    .replace(/#{1,6}\s?/g, "")
    // Remove bold and italic markers ***text***, **text**, *text*
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
    // Remove bullet point symbols that look ugly when rendered directly
    .replace(/^\s*[-*+]\s+/gm, "• ")
    // Collapse 3+ newlines into 2
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
