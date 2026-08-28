# Onboarding & Authentication Architecture

## Overview

The onboarding experience for **Ticha AI** is designed to guide Cameroonian secondary, high school, and university students smoothly into personalized AI-assisted study for GCE Ordinary & Advanced Levels.

```
/getting-started (Startup Carousel)
       │
       ▼
/getting-started/language (English / Français)
       │
       ▼
/getting-started/goal (Pass O/L, A/L, University CAs, etc.)
       │
       ▼
/getting-started/education (O-Level, A-Level, Technical, University)
       │
       ▼
/register (Milestone Reached + Account Creation)
       │
       ▼
/dashboard (Tailored AI Study Hub)
```

---

## Screen Architecture

### 1. Startup Screen (`/getting-started`)
- **Component:** `WelcomePage` in `src/app/getting-started/page.tsx`
- **Features:**
  - Auto-advancing 3-card character carousel with pause-on-hover / pause-on-touch.
  - Quick feature highlight pills (Learn daily, AI Tutor, Practice).
  - One-click Google OAuth and standard email registration entrypoints.

### 2. Language Selection (`/getting-started/language`)
- **State Management:** Stored in `localStorage` as `ticha_lang` and synchronized with `react-i18next`.
- **Options:** `en` (English) and `fr` (Français).

### 3. Goal Selection (`/getting-started/goal`)
- **State Management:** Stored in `localStorage` under `ticha_onboarding_goals` (JSON array) and `ticha_onboarding_goal` (CSV).
- **Selection Mode:** Multi-select enabled across 5 examination & confidence targets.

### 4. Education Level (`/getting-started/education`)
- **State Management:** Stored in `localStorage` under `ticha_onboarding_education`.
- **Options:** `ol` (GCE O Level), `al` (GCE A Level), `technical` (Technical), `university` (University Student).

### 5. Create Account (`/register`)
- **Milestone Reached:** Level 1: Novice celebration card with streak indicator.
- **Form Validation:** Client-side Zod validation with 5-segment password strength analyzer.
- **Profile Synchronization:** On successful signup, metadata and onboarding choices are saved to `auth.users` metadata and upserted into the `profiles` table in Supabase.

### 6. Login (`/login`)
- **Authentication:** Email & Password via Supabase Auth + Google OAuth with redirect callback.
- **Error Handling:** Unconfirmed email detection with one-click resend confirmation.
