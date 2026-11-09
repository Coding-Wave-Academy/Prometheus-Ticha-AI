import "server-only";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

export type RequireUserResult =
  | { user: User; supabase: SupabaseClient; response?: never }
  | { response: NextResponse; user?: never; supabase?: never };

/**
 * Resolves the authenticated Supabase user for an API route handler.
 *
 * Uses `auth.getUser()`, which validates the access token with Supabase Auth,
 * rather than `getSession()`, which only decodes the cookie and can be forged.
 *
 * Usage:
 *   const auth = await requireUser();
 *   if (auth.response) return auth.response;
 *   // auth.user and auth.supabase are now available
 */
export async function requireUser(): Promise<RequireUserResult> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { response: unauthenticated() };
    }

    return { user, supabase };
  } catch (err) {
    // Misconfiguration or Supabase outage: fail closed.
    console.error("[auth] requireUser failed:", err);
    return { response: unauthenticated() };
  }
}

function unauthenticated(): NextResponse {
  return NextResponse.json(
    { error: "unauthenticated" },
    { status: 401, headers: { "Cache-Control": "no-store" } }
  );
}
