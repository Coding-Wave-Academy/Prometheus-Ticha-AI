// ─── Next.js Middleware ─────────────────────────────────────────────────────────
// Centralized security layer: rate limiting, CSRF protection, route protection,
// and Supabase session refresh. Runs on every matched request.
//
// This file MUST be at `src/middleware.ts` for Next.js to pick it up.
// See: https://nextjs.org/docs/app/building-your-application/routing/middleware

import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// ─── Rate Limiter (In-memory sliding window) ────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_API_REQUESTS_PER_WINDOW = 60; // 60 requests/min per IP

// Clean up expired buckets periodically
if (typeof globalThis !== "undefined") {
  const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
  let cleanupScheduled = false;
  if (!cleanupScheduled) {
    setInterval(() => {
      const now = Date.now();
      for (const [key, record] of rateLimitMap.entries()) {
        if (record.expiresAt < now) {
          rateLimitMap.delete(key);
        }
      }
    }, CLEANUP_INTERVAL);
    cleanupScheduled = true;
  }
}

// ─── Route Protection Lists ─────────────────────────────────────────────────────

/** Routes that require authentication — redirect unauthenticated users to /login. */
const PROTECTED_PAGE_PREFIXES = [
  "/dashboard",
  "/practice",
  "/past-papers",
  "/courses",
  "/daily-quiz",
  "/leaderboard",
  "/summaries",
  "/explore",
];

/** API routes that require authentication — return 401 for unauthenticated callers. */
const PROTECTED_API_PREFIXES = [
  "/api/ai/daily-lesson",
  "/api/ai/quiz",
  "/api/ai/flashcards",
  "/api/ai/video",
  "/api/tutor/",
  "/api/rag/query",
  "/api/rag/summaries",
  "/api/elevenlabs/",
];

/** API routes that are intentionally public (onboarding, catalog reads). */
const PUBLIC_API_PREFIXES = [
  "/api/ai/onboarding-tips",
  "/api/ai/struggles",
  "/api/ai/intel",
  "/api/papers",
  "/api/courses",
  "/api/progress",
  "/api/youtube",
];

/** Pages that should be accessible without auth. */
const PUBLIC_PAGE_PATHS = [
  "/",
  "/login",
  "/register",
  "/getting-started",
  "/coming-soon",
  "/auth/callback",
  "/oauth",
  "/sitemap",
];

// ─── CSRF Allowed Origins ───────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  "localhost:3000",
  "127.0.0.1:3000",
  // Production domain — add your exact Vercel URL or custom domain here
  "prometheus-ticha-ai.vercel.app",
];

// ─── Middleware Handler ─────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. API Security: Rate Limiting & CSRF for /api/* ──────────────────────
  if (pathname.startsWith("/api/")) {
    // Rate limiting by IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const now = Date.now();
    const clientRecord = rateLimitMap.get(ip);

    if (clientRecord && clientRecord.expiresAt > now) {
      if (clientRecord.count >= MAX_API_REQUESTS_PER_WINDOW) {
        return new NextResponse(
          JSON.stringify({ error: "Too many requests. Please slow down." }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": "60",
            },
          }
        );
      }
      clientRecord.count += 1;
    } else {
      rateLimitMap.set(ip, {
        count: 1,
        expiresAt: now + RATE_LIMIT_WINDOW_MS,
      });
    }

    // CSRF origin check for mutative requests
    const method = request.method.toUpperCase();
    if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
      const origin = request.headers.get("origin");
      const host = request.headers.get("host");

      if (origin && host) {
        try {
          const originHost = new URL(origin).host;
          const isAllowed =
            originHost === host ||
            ALLOWED_ORIGINS.includes(originHost);

          if (!isAllowed) {
            return new NextResponse(
              JSON.stringify({ error: "Unauthorized cross-origin request." }),
              { status: 403, headers: { "Content-Type": "application/json" } }
            );
          }
        } catch {
          return new NextResponse(
            JSON.stringify({ error: "Invalid origin header." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }

    // Skip further checks for explicitly public API routes
    const isPublicApi = PUBLIC_API_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix)
    );
    if (isPublicApi) {
      return await updateSession(request);
    }

    // Protected API routes: verify Supabase session exists
    const isProtectedApi = PROTECTED_API_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix)
    );
    if (isProtectedApi) {
      // We check for the presence of Supabase auth cookies as a fast gate.
      // The actual getUser() verification happens inside each route handler
      // via requireAuth() — this middleware gate prevents obviously
      // unauthenticated requests from reaching handlers at all.
      const hasAuthCookie = request.cookies.getAll().some(
        (c) => c.name.startsWith("sb-") && /auth-token(\.\d+)?$/.test(c.name)
      );
      if (!hasAuthCookie) {
        return new NextResponse(
          JSON.stringify({ error: "Authentication required." }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // RAG ingest uses its own Bearer token auth — let it through
    return await updateSession(request);
  }

  // ── 2. Page Route Protection & Supabase Session Refresh ───────────────────
  // Handled authoritatively by updateSession using supabase.auth.getUser().
  // This verifies real session validity (including chunked cookies) and
  // eliminates conflicting redirects between middleware and SSR session helpers.
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)",
  ],
};
