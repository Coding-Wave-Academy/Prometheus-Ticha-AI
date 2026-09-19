# Implementation Plan: Fix Production Redirect Loop (`net::ERR_TOO_MANY_REDIRECTS`)

## Problem Statement

When accessing the production application at `https://prometheus-ticha-ai.vercel.app/dashboard`, the browser encounters an infinite redirect loop:
```
GET https://prometheus-ticha-ai.vercel.app/dashboard?redirect=%2Fdashboard net::ERR_TOO_MANY_REDIRECTS
installHook.js:1 Failed to fetch RSC payload for https://prometheus-ticha-ai.vercel.app/dashboard. Falling back to browser navigation.
```

## Root Cause Analysis

There are two conflicting "sources of truth" regarding user authentication between `src/middleware.ts` and `src/utils/supabase/middleware.ts`:

1. **Brittle Cookie Check in `src/middleware.ts`**:
   - `src/middleware.ts` attempts an ad-hoc cookie check:
     ```ts
     const hasAuthCookie = request.cookies.getAll().some(
       (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
     );
     ```
   - In `@supabase/ssr`, sessions exceeding cookie size limits (~3KB) are automatically chunked into `sb-<project-ref>-auth-token.0`, `sb-<project-ref>-auth-token.1`, etc.
   - For chunked sessions, `c.name.endsWith("-auth-token")` evaluates to `false` (because the cookie names end in `.0`, `.1`).
   - Consequently, `src/middleware.ts` treats the user on `/dashboard` as unauthenticated and redirects them to:
     `/login?redirect=%2Fdashboard`

2. **Opposing Check in `src/utils/supabase/middleware.ts`**:
   - The `/login` page is public, so `src/middleware.ts` passes the request to `updateSession(request)`.
   - Inside `updateSession`, `@supabase/ssr` reconstructs the session across chunked cookies and calls `supabase.auth.getUser()`, successfully validating the user.
   - Because `user` is non-null and the pathname is `/login`, `updateSession` triggers a redirect:
     ```ts
     const url = request.nextUrl.clone();
     if (user && authPaths.includes(url.pathname)) {
       url.pathname = "/dashboard";
       return NextResponse.redirect(url);
     }
     ```
   - Because `url` is cloned from `request.nextUrl`, it retains `searchParams: ?redirect=%2Fdashboard`.
   - It redirects the browser to `https://prometheus-ticha-ai.vercel.app/dashboard?redirect=%2Fdashboard`.

3. **The Infinite Ping-Pong Loop**:
   - Step 1: `/dashboard` -> `src/middleware.ts` rejects chunked cookie -> redirects to `/login?redirect=%2Fdashboard`.
   - Step 2: `/login?redirect=%2Fdashboard` -> `updateSession` verifies user -> redirects to `/dashboard?redirect=%2Fdashboard`.
   - Step 3: `/dashboard?redirect=%2Fdashboard` -> `src/middleware.ts` rejects chunked cookie -> loop repeats until `ERR_TOO_MANY_REDIRECTS`.
   - Next.js RSC router fails to fetch payload due to redirect loop, falls back to full browser navigation, which hits the same loop.

4. **API Route False 401s**:
   - The same flawed check `c.name.endsWith("-auth-token")` in `src/middleware.ts` for `PROTECTED_API_PREFIXES` incorrectly rejects valid API requests with chunked cookies.

5. **Cookie Dropping on Redirects**:
   - Returning `NextResponse.redirect(url)` without copying refreshed cookies from `supabaseResponse` drops any newly refreshed token from Supabase.

---

## Feature Scope & Non-Goals

- **Scope:**
  - Eliminate the dual-authority conflict between `src/middleware.ts` and `src/utils/supabase/middleware.ts`.
  - Fix cookie name matching for Supabase chunked tokens (`sb-*-auth-token*`).
  - Unify route protection inside the session update flow so `supabase.auth.getUser()` is the single source of truth.
  - Ensure any redirect preserves refreshed Supabase auth cookies.
  - Sanitize redirect URLs to remove recursive `?redirect=...` query params.
  - Enhance `src/app/(auth)/login/page.tsx` to handle post-login redirect safely.
- **Non-Goals:**
  - Redesigning auth flow UI or changing OAuth provider logic.
  - Modifying database schemas or RLS policies.

---

## Schema or API Changes Required

- None. This is a routing and middleware session synchronization fix.

---

## Files to be Created or Modified

1. **`src/utils/supabase/middleware.ts` [MODIFY]**:
   - Incorporate route protection logic directly where `supabase.auth.getUser()` executes.
   - If user is unauthenticated and requests a protected page (`/dashboard`, `/practice`, `/past-papers`, etc.), redirect to `/login?redirect=${encodeURIComponent(pathname)}`.
   - If user is authenticated and requests an auth page (`/login`, `/register`), redirect cleanly to the target in `redirect` query param (if safe) or `/dashboard` with search params cleared.
   - Ensure all `NextResponse.redirect(...)` responses copy `supabaseResponse.cookies` to avoid dropping refreshed sessions.

2. **`src/middleware.ts` [MODIFY]**:
   - Update `hasAuthCookie` logic to match chunked cookies (`c.name.startsWith("sb-") && c.name.includes("-auth-token")`).
   - Remove redundant, conflicting pre-redirect from `src/middleware.ts` for page routes, delegating session verification to `updateSession`.
   - Fix protected API pre-check to support chunked cookies.

3. **`src/app/(auth)/login/page.tsx` [MODIFY]**:
   - Safely read `redirect` query parameter on login success and redirect the student to their intended destination (defaulting to `/dashboard` if missing, invalid, or pointing back to `/login`).

---

## Offline-First & Service Worker Cache Considerations

- Next-PWA and service workers must not cache 307/308 redirect responses for `/dashboard`.
- Service worker bypasses `/api/*` and dynamic auth checks.
- Unauthenticated offline access is handled by client-side local cache fallback when network is unavailable.

---

## Security and Rate-Limiting Considerations

- Validate any `redirect` search param against open redirect attacks: only relative paths starting with `/` (and not `//` or containing `:\`) are permitted.
- Preserve IP rate limiting and CSRF origin protection in `src/middleware.ts`.
- Retain server-side verification with `supabase.auth.getUser()` (not forged cookie parsing).

---

## Acceptance Criteria & Manual Testing Steps

1. **Typecheck & Build**:
   - `npx tsc --noEmit` compiles cleanly with 0 errors.
   - `npm run build` completes successfully.

2. **Unauthenticated Access**:
   - Visiting `/dashboard` while unauthenticated cleanly redirects to `/login?redirect=%2Fdashboard` (exactly once, no loop).

3. **Authenticated Access**:
   - Visiting `/dashboard` while authenticated (with either standard or chunked `sb-*-auth-token.0` cookies) renders the dashboard with status 200, without any redirect.
   - Visiting `/login?redirect=%2Fdashboard` while authenticated redirects to `/dashboard` cleanly (stripping recursive `?redirect=%2Fdashboard`).

4. **API Protection**:
   - Calling protected APIs with chunked cookies succeeds without false 401s.
