import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

/**
 * Validates the redirect target to prevent open redirect attacks.
 * Only allows relative paths that start with "/" and don't use protocol-relative tricks.
 */
function getSafeRedirectPath(next: string | null): string {
  const fallback = "/dashboard";
  if (!next) return fallback;

  // Must start with a single forward slash
  if (!next.startsWith("/")) return fallback;

  // Must NOT be a protocol-relative URL (e.g., "//evil.com")
  if (next.startsWith("//")) return fallback;

  // Must NOT contain a protocol separator (e.g., "https://evil.com" embedded after origin)
  if (next.includes("://")) return fallback;

  // Must NOT contain backslashes (IE/Edge treat "\/evil.com" as "//evil.com")
  if (next.includes("\\")) return fallback;

  return next;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeRedirectPath(searchParams.get("next"));

  if (code) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
      const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
      const isLocalEnv = process.env.NODE_ENV === "development";
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`${forwardedProto}://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}
