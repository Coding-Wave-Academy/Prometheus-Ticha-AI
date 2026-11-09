/**
 * Client API helpers.
 *
 * `apiFetch` has the same signature as `fetch`, so call sites stay unchanged.
 * It adds two behaviours:
 *   - 401 from our API: the session has expired, so send the student to
 *     login and bring them back to the current page afterwards.
 *   - Network failure: re-thrown as `ApiError` with `kind: "offline"`, so the
 *     UI can say "you're offline" instead of logging the student out.
 */

export type ApiErrorKind = "unauthenticated" | "offline";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;

  constructor(kind: ApiErrorKind, message: string) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
  }
}

let redirectingToLogin = false;

function redirectToLogin(): void {
  if (typeof window === "undefined" || redirectingToLogin) return;
  redirectingToLogin = true;
  const here = window.location.pathname + window.location.search;
  // A full page load is intended: it drops all in-memory state from the
  // expired session. There is no router available in a plain module.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign(`/login?next=${encodeURIComponent(here)}`);
}

export async function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(input, { credentials: "same-origin", ...init });
  } catch (err) {
    // Aborts are the caller's own doing; pass them through untouched.
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ApiError("offline", "Network request failed. You may be offline.");
  }

  if (response.status === 401) {
    redirectToLogin();
    throw new ApiError("unauthenticated", "Your session has expired. Please sign in again.");
  }

  return response;
}

export function isOfflineError(err: unknown): boolean {
  return err instanceof ApiError && err.kind === "offline";
}
