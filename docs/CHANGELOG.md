# Changelog

All notable changes to the Ticha AI platform will be documented in this file.

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
