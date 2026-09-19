import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Protected page route prefixes that require an authenticated user. */
export const PROTECTED_PAGE_PREFIXES = [
  "/dashboard",
  "/practice",
  "/past-papers",
  "/courses",
  "/daily-quiz",
  "/leaderboard",
  "/summaries",
  "/explore",
];

const AUTH_PATHS = ["/login", "/register"];

/** Helper to construct a redirect response that preserves refreshed Supabase cookies. */
function createRedirectWithCookies(
  destinationUrl: URL | string,
  sourceResponse: NextResponse
): NextResponse {
  const redirectResponse = NextResponse.redirect(destinationUrl);

  // Copy refreshed cookies
  sourceResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
  });

  // Preserve cache-control and proxy headers
  for (const header of ["cache-control", "expires", "pragma"]) {
    const val = sourceResponse.headers.get(header);
    if (val) redirectResponse.headers.set(header, val);
  }

  return redirectResponse;
}

export const updateSession = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Ensure Supabase environment variables are present
  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do NOT use getSession() in middleware!
  // getUser() validates the token server-side and automatically refreshes expired tokens.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // 1. If user is authenticated and attempts to access auth pages (/login, /register):
  if (user && AUTH_PATHS.includes(pathname)) {
    const rawRedirect = request.nextUrl.searchParams.get("redirect");
    let target = "/dashboard";

    // Validate redirect parameter to avoid open redirects and redirect loops
    if (
      rawRedirect &&
      rawRedirect.startsWith("/") &&
      !rawRedirect.startsWith("//") &&
      !rawRedirect.includes("://") &&
      !rawRedirect.includes("\\")
    ) {
      const targetPath = rawRedirect.split("?")[0];
      if (!AUTH_PATHS.includes(targetPath)) {
        target = rawRedirect;
      }
    }

    const redirectUrl = new URL(target, request.url);
    // Remove recursive redirect param
    redirectUrl.searchParams.delete("redirect");
    return createRedirectWithCookies(redirectUrl, supabaseResponse);
  }

  // 2. If user is NOT authenticated and attempts to access a protected page:
  const isProtectedPage = PROTECTED_PAGE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!user && isProtectedPage) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return createRedirectWithCookies(loginUrl, supabaseResponse);
  }

  return supabaseResponse;
};

