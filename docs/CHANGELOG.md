# Changelog

All notable changes to the Ticha AI platform will be documented in this file.

## [2026-09-19] - Production Redirect Loop & Chunked Auth Cookie Synchronization Fix

### Fixed
- **Resolved `net::ERR_TOO_MANY_REDIRECTS` on `/dashboard`**:
  - Eliminated dual-source-of-truth conflict between `src/middleware.ts` and `src/utils/supabase/middleware.ts`.
  - Fixed false unauthenticated classification caused by `c.name.endsWith("-auth-token")` failing on `@supabase/ssr` chunked session cookies (`sb-<project-ref>-auth-token.0`, `.1`).
  - Updated cookie regex matching to `/auth-token(\.\d+)?$/` for protected API routes and delegated page-level route protection to `updateSession()`.
- **Preserved Refreshed Session Cookies on Redirects**:
  - Updated `createRedirectWithCookies()` in `src/utils/supabase/middleware.ts` to clone all refreshed session cookies and headers from `supabaseResponse` into any `NextResponse.redirect()` response, preventing session drops.
- **Sanitized Redirect Query Parameters**:
  - Stripped recursive `?redirect=...` query parameters upon redirecting authenticated users from `/login` to `/dashboard`.
  - Added safe destination parsing in `src/app/(auth)/login/page.tsx` with `<React.Suspense>` boundary to preserve client navigation while preventing open redirects.
- **Fixed Content Security Policy for Web Workers & Analytics**:
  - Added `worker-src 'self' blob:` and `child-src 'self' blob:` directives to `src/lib/securityHeaders.ts` to allow audio workers (ElevenLabs), confetti, and canvas workers generated from `blob:` URLs.
  - Whitelisted `https://va.vercel-scripts.com` in `script-src` and `https://vitals.vercel-insights.com` in `connect-src` for Vercel analytics.
- **Fixed Next.js RSC Payload Fetching Failure**:
  - Resolved `Failed to fetch RSC payload for /dashboard` caused by client router falling back after receiving infinite 307 redirects.

## [2026-09-16] - OWASP Top 10 (2025) Security Hardening & API Protection

### Added
- **Unified API Authentication & Validation Guard (`src/lib/apiAuth.ts`)**:
  - `requireAuth()` server utility that verifies Supabase user authentication before processing requests.
  - Safe payload parsing (`safeJson()`) with 400 Bad Request error handling.
  - `validateFieldLength()` and `validateArrayLength()` with central `INPUT_LIMITS` definitions.
- **Root Middleware Activation (`src/middleware.ts`)**:
  - Activated rate limiting (`@/lib/rateLimit`) per IP/user across API endpoints.
  - Activated CSRF origin/referer validation (`@/lib/csrfProtection`) on mutation requests (`POST`, `PUT`, `DELETE`, `PATCH`).
  - Activated Supabase session refreshing and auth redirection for protected dashboard routes.
  - Activated dynamic Content Security Policy (CSP) with per-request nonces.

### Security & Hardening (OWASP Top 10: 2025)
- **A01: Broken Access Control**:
  - Gated all 9 previously unauthenticated public AI, tutor, RAG, and voice API routes behind `requireAuth()` (`/api/ai/daily-lesson`, `/api/ai/quiz`, `/api/ai/flashcards`, `/api/ai/video`, `/api/tutor/chat`, `/api/tutor/tts`, `/api/rag/query`, `/api/rag/summaries`, `/api/elevenlabs/signed-url`).
  - Fixed Open Redirect vulnerability in `src/app/auth/callback/route.ts` by strictly enforcing relative destination paths or matching application origin.
  - Removed deprecated unreferenced `src/proxy.ts` file that previously bypassed Next.js middleware execution.
- **A02: Cryptographic Failures**:
  - Implemented `crypto.timingSafeEqual` in `src/app/api/rag/ingest/route.ts` to prevent side-channel timing attacks on the `ADMIN_SECRET_KEY` check.
- **A05: Security Misconfiguration**:
  - Hardened `src/lib/securityHeaders.ts` by removing `'unsafe-eval'` from the Content-Security-Policy header.
- **A07: Identification & Authentication Failures**:
  - Protected API routes against unauthenticated LLM token depletion and billing abuse.
- **A10: Server-Side Request Forgery (SSRF) & Denial of Service**:
  - Enforced strict payload size limits (`INPUT_LIMITS`) across message queries, context arrays, and TTS strings to prevent memory exhaustion and DoS.

## [2026-09-14] - Subject Catalog Separation, Fingerprint Polish & System Hardening

### Added
- **Separated GCE O/L and A/L Subject Catalogs (`src/data/gceSubjects.ts`)**:
  - Distinct typed exports `GCE_OL_SUBJECTS` and `GCE_AL_SUBJECTS` with full official Cameroon GCE Board subject lists and subject codes.
  - Added selector utility `getGceSubjectsForLevel(level)`.
  - Added active exam track indicator pill in `struggles/page.tsx` showing exact subject count and current exam tier.
- **Architecture Documentation**:
  - `docs/AI_ARCHITECTURE.md`: Technical documentation of curriculum grounding, LLM provider routing, rate limiting, and prompt strategies.
  - `docs/PWA_ARCHITECTURE.md`: Documentation of offline-first service worker, caching policies, and mobile viewport controls.
- **SEO & Social Metadata**:
  - Enriched root layout metadata with keywords, openGraph tags, and title template.
  - Added metadata to `src/app/getting-started/layout.tsx` and `src/app/(auth)/layout.tsx`.

### Changed
- **Fingerprint Commitment Screen Polish (`src/app/getting-started/commitment/page.tsx`)**:
  - Integrated authentic biometric fingerprint vector graphic.
  - Removed progress percentage text in favor of Apple-like contextual prompts ("Touch and hold to commit" -> "Keep holding to seal...").
  - Streamlined pointer capture handlers with `setPointerCapture` and eliminated duplicate mouse/touch listener conflicts.
  - Enabled instant 0-latency rAF progress ring drawing without transition lag during active press.
- **Form Validation & Authentication Hardening (`src/app/(auth)/register/page.tsx` & `src/lib/validation.ts`)**:
  - Fixed Zod schema field key mismatch (`fullName` in `registerSchema`).
  - Corrected email handling in register and login forms to use `email.trim().toLowerCase()` without HTML entity corruption.
  - Fixed literal `&amp;` display bug in registration skip button.
- **CSS & Mobile Overflow Protection (`src/app/globals.css`)**:
  - Added `overflow-x: hidden` and `max-width: 100vw` to `html` and `body`.
  - Added `.no-scrollbar` utility definition.
- **Hydration & Device Routing (`src/app/layout.tsx`, `DeviceGate.tsx`)**:
  - Added `suppressHydrationWarning` to `<html>` and `<body>`.
  - Added `/login`, `/register`, and `/getting-started` to authorized desktop routes in `DeviceGate.tsx`.
- **Branding Navigation (`src/app/getting-started/page.tsx`)**:
  - Wrapped header logo in Next.js `<Link href="/">` for easy navigation back home.
- **Database & Security Hardening (`supabase/schema.sql`)**:
  - Restricted `profiles` table SELECT policy to `auth.uid() = id` for student privacy.
  - Added profile DELETE policy.
  - Added `SET search_path = public` to `handle_new_user()` `SECURITY DEFINER` function.
- **Cleaned Up Placeholders**:
  - Replaced dummy WhatsApp number in `HelpCenterModal.tsx` with direct academic help channel.
  - Removed TODO comment in `getting-started/layout.tsx`.

## [2026-09-14] - Ticha AI Commitment Screen & Cameroon GCE Subjects Catalog

### Added
- **Commitment Screen (`src/app/getting-started/commitment/page.tsx`)**:
  - Implemented the Commitment screen directly from `design/Ticha AI Commitment screen.png`.
  - 5-segment neobrutalist progress bar at top (Segments 1–4 filled in `#C8FF2A`, Segment 5 outline dynamically filling during hold).
  - Circular back button navigating to `/getting-started/struggles`.
  - "Make a Commitment" header with hand-drawn organic pink accent underline beneath "Commitment".
  - Neobrutalist "My Commitment" card (`bg-[#FFF0F3]`, `border-[2.5px] border-black`, `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`) with 3 pink bullet pledges and motivational quote.
  - Interactive Fingerprint Hold-to-Commit mechanism:
    - 4 viewfinder corner framing brackets.
    - Concentric halo rings with custom pink fingerprint SVG vector.
    - Cross-platform hold gesture handling (mouse, touch, pointer, and spacebar/enter keyboard keys) with race-condition prevention.
    - Fluid circular SVG progress stroke and dynamic haptic vibration pulses (`navigator.vibrate`) at intervals.
    - Smooth spring decay back to 0 on early release.
    - 100% completion celebration: `fireConfettiBurst`, success haptic pattern, Apple-like bottom-to-top brand color fill overlay (`#C8FF2A` with `cubic-bezier(0.32, 0.72, 0, 1)` easing), and transition to `/register`.
- **Cameroon GCE Subjects Catalog (`src/data/gceSubjects.ts`)**:
  - Created shared comprehensive catalog covering all official Cameroon GCE Board subjects across Ordinary Level (O-Level) and Advanced Level (A-Level) in Sciences & Mathematics, Commercial & Social Sciences, and Arts & Humanities.

### Changed
- **Subject/Struggle Selection Screen (`src/app/getting-started/struggles/page.tsx`)**:
  - Expanded default subjects to include all current Cameroon GCE subjects.
  - Added category filter pills ("All Subjects", "🔬 Sciences & Math", "📊 Commercial & Social", "📚 Arts & Languages").
  - Added instant search input with clear button.
  - Sticky bottom action bar ensuring "CONTINUE" CTA is always accessible during scrolling.
  - Updated "CONTINUE" button to route directly to `/getting-started/commitment`.
- **Onboarding Progress Synchronization (`OnboardingProgressBar.tsx`)**:
  - Standardized `totalSteps={5}` across `language`, `goal`, `education`, `struggles`, and `commitment`.
- **AI Struggles Fallback (`src/app/api/ai/struggles/route.ts`)**:
  - Enriched fallback mocks with level-specific Cameroon GCE subjects for `ol`, `al`, and `university`.
- **Sitemap (`src/app/sitemap/page.tsx`)**:
  - Added `/getting-started/commitment` to the Onboarding & Auth flow index.


### Added
- **Web/Tablet Explore Hub Layout (`src/app/explore/page.tsx`)**:
  - Implemented responsive dual-layout for the Explore Hub matching `design/Ticha AI Web View - Explore.png` on `md+` viewports (`>=768px`).
  - **Top Header**: User avatar + "Hello, {Name} 👋" greeting + live streak counter pill + notification bell with unread badge count.
  - **Neobrutalist Search Bar**: Search input with `#965A18` "SEARCH" CTA and real-time card filtering across all modules.
  - **Core Learning Hub**: 3 large cards with icons and circular arrow buttons: Summaries (`#D3E2FF`), Past Papers (`#FFE7D6`), and Daily Quiz (`#C8FF2A`).
  - **Flashcards & Study Tools**: 4 action cards: Flashcards (`#FFB040`), Upload Materials (`#C8FF2A`), Practice Drills (`#FFD6E7`), and AI Practice Bot (`#D3E2FF`).
  - **Social & Competition**: Full-width Leaderboard banner (`#FFB040`) with trophy icon, rankings subtitle, watermark graphic, and action arrow.
- **Sidebar Motivational Card (`src/components/layout/DashboardSidebar.tsx`)**:
  - Added bottom motivation widget ("Better Every Day, Stronger Tomorrow." with studying student & 1% calendar desk graphic) and active state indicator for `/explore`.
- **DeviceGate (`src/components/layout/DeviceGate.tsx`)**:
  - Enabled `/explore` on desktop/tablet viewports so users can explore study hubs on larger screens without 404 gating.

## [2026-09-01] - Web & Tablet Dashboard Implementation

### Added
- **Web/Tablet Dashboard Layout (`src/app/dashboard/page.tsx`)**:
  - Implemented responsive dual-layout switching at `md` breakpoint (`>=768px`) for Web/Tablet view while keeping mobile view (`<768px`) intact.
  - Two-column dashboard grid layout matching design mockup (`design/Ticha AI Web View - Dashboard.png`).
- **Dashboard Sidebar Navigation (`src/components/layout/DashboardSidebar.tsx`)**:
  - Left navigation sidebar with Ticha AI 1% logo, routing items (Dashboard, Explore, AI Tutor, Video Library, Past Papers, Progress, Settings), and interactive Logout button wired to Supabase `signOut`.
- **Web Dashboard Header (`src/components/dashboard/DashboardHeaderWeb.tsx`)**:
  - Greeting header ("Hello, {Name} 👋") with live user name from `useProfile()`, streak counter pill (`#C8FF2A`), and user avatar/initial.
- **Daily Lesson Card (`src/components/dashboard/DailyLessonCardWeb.tsx`)**:
  - Lime-green feature card rendering today's subject and topic based on user struggles and daily curriculum rotation engine (`@/lib/dailyTopic`). Includes custom book SVG illustration and "Start Lesson →" action.
- **Web Streak Widget (`src/components/dashboard/StreakCardWeb.tsx`)**:
  - Streak summary card displaying fire icon, motivational message, 7-day weekly tracker (S/M/T/W/TH/F/S), and integration with interactive `StreakModal`.
- **Web Quick Actions (`src/components/dashboard/QuickActionsWeb.tsx`)**:
  - 4 circular action buttons: Daily Quiz (`#FFB040` with notification badge), Summaries (`#C8FF2A`), Past Papers (white/bordered), and Practice (`#FFD6E7`).
- **Custom 404 & Web/Desktop Route Gating (`src/components/layout/DeviceGate.tsx`, `src/app/not-found.tsx`)**:
  - Configured intelligent device gating: on desktop/laptop screens (`>=768px`), any route that does not yet have a dedicated web design displays the custom 404 screen instead of stretching or exposing the mobile interface.
  - **Web/Tablet 404**: 2-column layout with 3D 404 badge, contextual syllabus copy, quick-jump hub cards (Dashboard, AI Tutor, Past Papers, Summaries), and action buttons.
  - **Mobile 404**: Centered mobile-first card with 1% badge, error chip, animated compass illustration, and direct return actions.
  - Mobile viewports (`<768px`) continue rendering all mobile-first screens and routes seamlessly.
- **Bottom Navbar Web/Tablet Visibility Fix (`src/components/layout/BottomNav.tsx`)**:
  - Added strict `md:hidden` rule to ensure `BottomNav` is never rendered on web or tablet screen sizes across any route.

### Changed
- **DeviceGate (`src/components/layout/DeviceGate.tsx`)**:
  - Removed desktop-only overlay blocker to enable seamless native rendering on web and tablet screen sizes.
- **Dashboard Layout (`src/app/dashboard/layout.tsx`)**:
  - Integrated `DashboardSidebar` for `md+` viewports alongside main content area.


### Added
- **Typography System (Baloo 2 + Plus Jakarta Sans)**:
  - Configured Google fonts via `next/font/google` in `src/app/layout.tsx`.
  - **Main Headings (`h1`)**: Baloo 2 ExtraBold / Bold (`800` / `700`).
  - **Section Headings (`h2`, `h3`, `h4`, `h5`, `h6`)**: Baloo 2 Bold (`700`).
  - **Buttons (`button`, `[role="button"]`, `.font-button`)**: Baloo 2 Bold (`700`).
  - **Body text (`p`, `span`, inputs, etc.)**: Plus Jakarta Sans Regular / Medium (`400` / `500`).
  - **Small labels (`label`, `.font-label`)**: Plus Jakarta Sans SemiBold / Bold (`600` / `700`).
- **Interactive Startup Carousel (`src/app/getting-started/page.tsx`)**:
  - Integrated new 1% app icon badge (`/images/Ticha AI - App Icon White.png`) with `mix-blend-multiply` to blend with the cream background.
  - Formatted the header logo typography with `Ticha` + dynamic slide-accented `AI` and `Small Steps. Big Mastery.` tagline.
  - Updated Character 3 (Slide 03) CTA button background to `#9333EA` (Purple) with hover `#7E22CE` and white text.
  - Enlarged Character 1 (`max-w-[440px]`) and all hero illustrations to eliminate whitespace and fill the canvas.
- **Browser Header & Metadata (`src/app/layout.tsx`)**:
  - Updated application title to `"Ticha AI - 1% Better Everyday"`.
  - Added new app icon to metadata configuration.


### Onboarding Flow Fix
- **Corrected Onboarding Flow**: `Get Started → Language → Goal → Level → Struggles → Sign Up`
- **Shared Progress Bar Component (`src/components/onboarding/OnboardingProgressBar.tsx`)**:
  - Reusable 4-segment horizontal progress bar with back button, matching Language Selector design.
  - Used across Language (1/4), Goal (2/4), Education (3/4), and Struggles (4/4) screens.
  - Not shown on Sign Up screen.
- **Rebuilt Struggles Screen (`src/app/getting-started/struggles/page.tsx`)**:
  - Matches onboarding design system (`bg-[#FFF8F1]`, consistent card styles, emoji icons).
  - 2-column grid of subject cards with multi-select, custom subject input.
  - AI-powered subject suggestions with fallback defaults.
  - Routes to `/register` on continue.
- **Confetti Burst on Sign Up (`src/components/onboarding/ConfettiBurst.tsx`)**:
  - Lightweight Framer Motion confetti animation that fires on register page mount.
  - 50 particles in brand colors, auto-hides after 4 seconds.
- **Route Fix**: Education level page now routes to `/getting-started/struggles` instead of `/register`.

- **Redesigned Language Selection (`src/app/getting-started/language/page.tsx`)**:
  - Rendered `Language Character.svg` vector illustration with 5-segment top progress bar.
  - Added `Lime Line.svg` accent underline, `Lime Star.svg` sparkles, side-by-side English/Français cards, and settings banner.
- **Redesigned Goal Selection (`src/app/getting-started/goal/page.tsx`)**:
  - 3-step progress dots with top-right polka dots and orange sparkle star.
  - 5-goal card grid with 3D emojis, multi-select state, and `NEXT →` button.
- **Redesigned Education Level Selection (`src/app/getting-started/education/page.tsx`)**:
  - 3-step progress dots, 4 education tier cards with 3D emojis, single-selection state, and `CONTINUE →` button.
- **Redesigned Create Account / Register (`src/app/(auth)/register/page.tsx`)**:
  - Milestone Reached banner with 1-day streak badge, left icon box inputs, 5-segment strength meter, and 2-column validation checklist.
- **Redesigned Login (`src/app/(auth)/login/page.tsx`)**:
  - "Welcome back, Scholar! 👋" header with sparkles and polka dots, left icon box inputs, password visibility toggle, and Google OAuth.

- **Asset Directory (`public/images/onboarding/`)**:
  - High-resolution design mockups and illustrations copied for asset preservation and rendering.

### Changed
- **Design System Tokens (`src/app/globals.css`)**:
  - Primary color updated to `#C8FF2A` (Lime Green).
  - Secondary color updated to `#FF882E` (Ticha Orange).
  - Background set to `#FFF8F1` (Warm Cream).
  - Foreground and borders set to `#0A0A0F` (Deep Black).
- **UI Components (`src/components/ui/Input.tsx`, `PasswordInput.tsx`, `PasswordStrengthBar.tsx`)**:
  - Added `leftIcon` support to `Input` and `PasswordInput` components.
  - Updated `PasswordStrengthBar` to 5-segment pill display with criteria checklist.
