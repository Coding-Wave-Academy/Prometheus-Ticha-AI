import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// In-memory sliding window rate limiter
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_API_REQUESTS_PER_WINDOW = 60; // 60 requests/min

// Clean up expired buckets every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (record.expiresAt < now) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. API Security: Rate Limiting & Origin Verification for /api/*
  if (pathname.startsWith("/api/")) {
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

    // CSRF Check for mutative API requests
    const method = request.method.toUpperCase();
    if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
      const origin = request.headers.get("origin");
      const host = request.headers.get("host");

      // If origin is present, ensure it matches the current host or allowed domains
      if (origin && host) {
        try {
          const originHost = new URL(origin).host;
          const isAllowed =
            originHost === host ||
            originHost.endsWith(".vercel.app") ||
            originHost === "localhost:3000" ||
            originHost === "127.0.0.1:3000";

          if (!isAllowed) {
            return new NextResponse(
              JSON.stringify({ error: "Unauthorized cross-origin request" }),
              { status: 403, headers: { "Content-Type": "application/json" } }
            );
          }
        } catch {
          // Invalid origin URL
          return new NextResponse(
            JSON.stringify({ error: "Invalid origin header" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }
  }

  // 2. Supabase Session Refresh
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
