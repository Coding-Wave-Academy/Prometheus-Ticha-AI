# Changelog

All notable changes to the Ticha AI platform will be documented in this file.

## [2026-08-28] - Onboarding & Authentication UI Redesign

### Added
- **Typography System (Baloo 2 + Plus Jakarta Sans)**:
  - Configured Google fonts via `next/font/google` in `src/app/layout.tsx`.
  - **Main Headings (`h1`)**: Baloo 2 ExtraBold / Bold (`800` / `700`).
  - **Section Headings (`h2`, `h3`, `h4`, `h5`, `h6`)**: Baloo 2 Bold (`700`).
  - **Buttons (`button`, `[role="button"]`, `.font-button`)**: Baloo 2 Bold (`700`).
  - **Body text (`p`, `span`, inputs, etc.)**: Plus Jakarta Sans Regular / Medium (`400` / `500`).
  - **Small labels (`label`, `.font-label`)**: Plus Jakarta Sans SemiBold / Bold (`600` / `700`).
- **Interactive Startup Carousel (`src/app/getting-started/page.tsx`)**:
  - Replaced text logo header with native high-resolution logo image (`/images/ticha-logo.png`).
  - Updated Character 3 (Slide 03) CTA button background to `#9333EA` (Purple) with hover `#7E22CE` and white text.
  - Enlarged Character 1 (`max-w-[440px]`) and all hero illustrations to eliminate whitespace and fill the canvas.
  - Unified 3-step pill progress bar design across `Language`, `Goal`, and `Education` screens.
- **Browser Header & Metadata (`src/app/layout.tsx`)**:
  - Updated application title to `"Ticha AI - 1% Better Everyday"`.
  - Added rounded PNG logo icons to metadata configuration.

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
