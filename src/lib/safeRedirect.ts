/**
 * Returns `value` only if it is a same-origin relative path, otherwise `fallback`.
 *
 * Rejects absolute URLs, protocol-relative URLs ("//host"), backslash tricks
 * ("/\\host", which browsers normalise to "//host"), userinfo tricks ("@host"),
 * and control characters. Safe to use on both client and server.
 */
export function safeNextPath(value: unknown, fallback = "/dashboard"): string {
  if (typeof value !== "string") return fallback;
  if (value.length === 0 || value.length > 512) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback;
  if (/[\u0000-\u001F\u007F\\]/.test(value)) return fallback;

  // Final check: resolving against a dummy origin must not change the origin.
  try {
    const base = "https://ticha.invalid";
    const resolved = new URL(value, base);
    if (resolved.origin !== base) return fallback;
    return resolved.pathname + resolved.search + resolved.hash;
  } catch {
    return fallback;
  }
}
