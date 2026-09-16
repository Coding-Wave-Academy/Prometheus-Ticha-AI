// ─── API Route Authentication Helper ────────────────────────────────────────────
// Reusable server-side auth guard for API route handlers.
// Usage: const { user, errorResponse } = await requireAuth();
//        if (errorResponse) return errorResponse;

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";

/** Maximum allowed lengths for common AI route input fields. */
export const INPUT_LIMITS = {
  /** Max length for user message / query text (~1000 tokens). */
  MESSAGE: 4000,
  /** Max length for TTS text payload (ElevenLabs billing guard). */
  TTS_TEXT: 2000,
  /** Max number of chat history messages to accept. */
  HISTORY_ITEMS: 50,
  /** Max length for subject / topic / goal fields. */
  FIELD: 200,
} as const;

interface AuthResult {
  user: User;
  errorResponse: null;
}

interface AuthError {
  user: null;
  errorResponse: NextResponse;
}

/**
 * Server-side authentication check for API routes.
 * Validates the Supabase session from cookies via `getUser()` (server-verified, not JWT-only).
 *
 * @returns `{ user, errorResponse: null }` if authenticated,
 *          `{ user: null, errorResponse }` with a 401 JSON response if not.
 *
 * @example
 * export async function POST(req: NextRequest) {
 *   const { user, errorResponse } = await requireAuth();
 *   if (errorResponse) return errorResponse;
 *   // user is guaranteed to be non-null here
 * }
 */
export async function requireAuth(): Promise<AuthResult | AuthError> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        user: null,
        errorResponse: NextResponse.json(
          { error: "Authentication required. Please sign in." },
          { status: 401 }
        ),
      };
    }

    return { user, errorResponse: null };
  } catch {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { error: "Authentication service unavailable." },
        { status: 503 }
      ),
    };
  }
}

/**
 * Validates that a string field does not exceed the given max length.
 * Returns a 400 error response if validation fails, null otherwise.
 */
export function validateFieldLength(
  value: unknown,
  fieldName: string,
  maxLength: number
): NextResponse | null {
  if (typeof value === "string" && value.length > maxLength) {
    return NextResponse.json(
      {
        error: `${fieldName} exceeds maximum length of ${maxLength} characters.`,
      },
      { status: 400 }
    );
  }
  return null;
}

/**
 * Validates that an array does not exceed the given max length.
 * Returns a 400 error response if validation fails, null otherwise.
 */
export function validateArrayLength(
  value: unknown,
  fieldName: string,
  maxItems: number
): NextResponse | null {
  if (Array.isArray(value) && value.length > maxItems) {
    return NextResponse.json(
      { error: `${fieldName} exceeds maximum of ${maxItems} items.` },
      { status: 400 }
    );
  }
  return null;
}
