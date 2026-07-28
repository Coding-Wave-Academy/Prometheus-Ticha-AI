/**
 * Security & Sanitization Utilities
 * Protects against XSS attacks and provides safe client storage access.
 */

/**
 * Sanitizes user input string by escaping HTML characters to prevent XSS.
 */
export function sanitizeString(str: string): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Strips HTML tags completely from string.
 */
export function stripHtmlTags(str: string): string {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>?/gm, "");
}

/**
 * Safe local storage wrapper with SSR and exception handling fallback.
 */
export const safeStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Storage unavailable or full
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore
    }
  },
};
