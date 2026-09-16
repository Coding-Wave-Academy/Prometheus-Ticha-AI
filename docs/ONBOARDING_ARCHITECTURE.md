# Onboarding & Authentication Architecture

## Overview

The onboarding experience for **Ticha AI** is designed to guide Cameroonian secondary, high school, and university students smoothly into personalized AI-assisted study for GCE Ordinary & Advanced Levels.

```
/getting-started (Startup Carousel)
       │
       ▼
/getting-started/language (Step 1/5: English / Français)
       │
       ▼
/getting-started/goal (Step 2/5: Pass O/L, A/L, University CAs, etc.)
       │
       ▼
/getting-started/education (Step 3/5: O-Level, A-Level, Technical, University)
       │
       ▼
/getting-started/struggles (Step 4/5: Cameroon GCE Subjects Challenge Selection)
       │
       ▼
/getting-started/commitment (Step 5/5: Make a Commitment & Hold-to-Commit Biometric)
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

### 5. Subject Struggles Identification (`/getting-started/struggles`)
- **State Management:** Stored in `localStorage` under `ticha_onboarding_struggles`.
- **Comprehensive Cameroon GCE Catalog:** Full list of official Cameroon GCE Board subjects across Ordinary Level (O-Level) and Advanced Level (A-Level).
- **Features:** Category filtering pills ("All", "Sciences & Math", "Commercial & Social", "Arts & Languages"), real-time search lookup, custom subject addition, and sticky bottom action bar.

### 6. Make a Commitment (`/getting-started/commitment`)
- **Visual Design:** Faithfully translated from `design/Ticha AI Commitment screen.png`.
- **5-Segment Progress Bar:** Shows 4 steps completed with active 5th segment outline filling up in real-time as the user holds the fingerprint.
- **Pledge Card:** Neobrutalist "My Commitment" card with 3 core pledges and motivational quote.
- **Hold-to-Commit Interaction:** 1.8s deliberate biometric fingerprint hold gesture with dynamic haptic pulses (`navigator.vibrate`), circular SVG progress ring, spring decay on early release, and upon 100% completion an Apple-like bottom-to-top brand color fill overlay (`#C8FF2A`) transitioning into `/register`.

### 7. Create Account (`/register`)
- **Milestone Reached:** Level 1: Novice celebration card with streak indicator.
- **Form Validation:** Client-side Zod validation with 5-segment password strength analyzer.
- **Profile Synchronization:** On successful signup, metadata and onboarding choices are saved to `auth.users` metadata and upserted into the `profiles` table in Supabase.

### 8. Login (`/login`)
- **Authentication:** Email & Password via Supabase Auth + Google OAuth with redirect callback.
- **Error Handling:** Unconfirmed email detection with one-click resend confirmation.
