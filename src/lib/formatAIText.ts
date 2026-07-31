/**
 * Helper to sanitize and format AI generated text for clean display.
 * Strips markdown headers (###, ##, #), bold/italic syntax (***, **, *),
 * LaTeX math syntax ($\mathb{N}$, \frac{a}{b}, \sqrt{x}, \mathbb{N}),
 * and excessive line breaks to render clean plain text.
 */
export function formatAIText(text: string): string {
  if (!text) return "";

  return text
    // Remove inline math wrappers $$...$$ or $...$
    .replace(/\$\$([\s\S]*?)\$\$/g, "$1")
    .replace(/\$([^$]+)\$/g, "$1")
    // Clean up LaTeX font/math commands: \mathb{N}, \mathbb{N}, \mathbf{x}, \text{...}
    .replace(/\\math[a-z]+\{([^}]+)\}/gi, "$1")
    .replace(/\\text\{([^}]+)\}/gi, "$1")
    .replace(/\\vec\{([^}]+)\}/gi, "$1⃗")
    // Replace \frac{a}{b} -> (a/b)
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/gi, "($1 / $2)")
    // Replace \sqrt{x} -> √(x)
    .replace(/\\sqrt\{([^}]+)\}/gi, "√($1)")
    // Replace common LaTeX symbols
    .replace(/\\times/g, "×")
    .replace(/\\div/g, "÷")
    .replace(/\\pm/g, "±")
    .replace(/\\infinity|\\infty/g, "∞")
    .replace(/\\theta/g, "θ")
    .replace(/\\alpha/g, "α")
    .replace(/\\beta/g, "β")
    .replace(/\\gamma/g, "γ")
    .replace(/\\pi/g, "π")
    .replace(/\\le|\\leq/g, "≤")
    .replace(/\\ge|\\geq/g, "≥")
    .replace(/\\neq/g, "≠")
    .replace(/\\approx/g, "≈")
    .replace(/\\in/g, "∈")
    .replace(/\\notin/g, "∉")
    .replace(/\\subset/g, "⊂")
    .replace(/\\cup/g, "∪")
    .replace(/\\cap/g, "∩")
    // Remove leftover backslashes before plain words
    .replace(/\\([a-zA-Z]+)/g, "$1")
    // Remove markdown code blocks ``` ... ```
    .replace(/```[\s\S]*?```/g, (match) => match.replace(/```/g, "").trim())
    // Remove inline code ticks
    .replace(/`([^`]+)`/g, "$1")
    // Remove headers ###, ##, #
    .replace(/#{1,6}\s?/g, "")
    // Remove bold and italic markers ***text***, **text**, *text*
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
    // Clean up bullet lists
    .replace(/^\s*[-*+]\s+/gm, "• ")
    // Collapse 3+ newlines into 2
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
