# Implementation Plan - Ticha AI Commitment Screen & GCE Subjects Expansion

## Overview
This plan details the implementation of the new **Commitment Screen** (`/getting-started/commitment`) as depicted in `design/Ticha AI Commitment screen.png` and the expansion of the **Subject/Struggle Selection Screen** (`/getting-started/struggles`) to include all respective current Cameroon GCE Ordinary Level (O-Level) and Advanced Level (A-Level) subjects.

---

## 1. Feature Scope & Non-Goals

### In Scope
- **Commitment Screen (`/getting-started/commitment/page.tsx`)**:
  - Direct translation of `design/Ticha AI Commitment screen.png`.
  - 5-segment neobrutalist progress bar (Step 4 completed, 5th segment active).
  - Header: "Make a Commitment" with brand pink hand-drawn underline curve beneath "Commitment".
  - Neobrutalist "My Commitment" card with solid offset shadow (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`), border-2, and 3 bullet pledges with pink dots + italicized motivational quote.
  - Interactive Fingerprint Hold-to-Commit mechanism:
    - 4 viewfinder corner brackets.
    - Concentric halo rings with custom pink fingerprint SVG.
    - Press & hold gesture handling (touch, mouse, keyboard) with fluid circular SVG progress stroke and scale dynamics.
    - Gradual haptic pulse feedback (`navigator.vibrate`) during hold.
    - Releasing early smoothly springs back progress to 0.
    - Holding to 100% triggers success state + Apple-like bottom-to-top screen fill in Ticha brand color (`#C8FF2A`), seamlessly transitioning to `/register`.
- **Navigation Flow Synchronization**:
  - Update `/getting-started/struggles` CONTINUE button to route to `/getting-started/commitment`.
  - Standardize `totalSteps={5}` on `OnboardingProgressBar` across `language`, `goal`, `education`, `struggles`, and `commitment`.
- **Cameroon GCE Subjects Expansion (`/getting-started/struggles/page.tsx` & `/api/ai/struggles/route.ts`)**:
  - Include all official Cameroon GCE subjects across Sciences & Mathematics, Commercial & Social Sciences, and Arts & Humanities for both O-Level and A-Level.
  - Add convenient filter tabs ("All", "Sciences & Math", "Commercial & Social", "Arts & Languages") and a search input for instant filtering.
  - Maintain the ability to add custom subjects.
  - Persist selected subjects in `localStorage` (`ticha_onboarding_struggles`).

### Non-Goals
- Modifying backend user table schema (the existing `profiles.struggles` JSONB column already supports array of strings).
- Altering the core registration API endpoint (`/api/auth/register`).

---

## 2. Technical Design & Architecture

### A. Commitment Screen State Machine & Animation
- **Hold Mechanics**:
  - `requestAnimationFrame` loop incrementing `progress` from `0` to `1` over 1.8 seconds.
  - Circular SVG track: dynamic `strokeDashoffset` animating the perimeter stroke.
  - Scale micro-interaction: subtle compression `scale: 0.97` with pulsing glow.
- **Apple-like Bottom-to-Top Brand Color Transition**:
  - Full-screen `motion.div` fixed overlay with `y: '100%'` -> `y: '0%'` using cubic bezier easing `[0.32, 0.72, 0, 1]`.
  - Brand color: Primary Ticha green `#C8FF2A` (matches the milestone banner on Create Account).

### B. Cameroon GCE Subjects Catalog
The full catalog of official Cameroon GCE Board subjects:

1. **Sciences & Mathematics**:
   - Pure Mathematics with Statistics (A/L)
   - Pure Mathematics with Mechanics (A/L)
   - Further Mathematics (O/L & A/L)
   - Mathematics (O/L)
   - Additional Mathematics (O/L)
   - Physics (O/L & A/L)
   - Chemistry (O/L & A/L)
   - Biology (O/L & A/L)
   - Human Biology (O/L)
   - Computer Science & ICT (O/L & A/L)
   - Geology (A/L)

2. **Commercial, Economics & Social Sciences**:
   - Economics (O/L & A/L)
   - Principles of Accounts / Accounting (O/L & A/L)
   - Commerce / Business Management (O/L & A/L)
   - Geography (O/L & A/L)
   - History (O/L & A/L)
   - Citizenship Education (O/L)

3. **Arts, Languages & Humanities**:
   - English Language (O/L & A/L)
   - Literature in English (O/L & A/L)
   - French Language (O/L & A/L)
   - Philosophy / Logic (O/L & A/L)
   - Religious Studies (O/L & A/L)
   - Food Science & Nutrition (O/L & A/L)

---

## 3. Files to Modify and Create

| Action | File Path | Description |
|---|---|---|
| **[NEW]** | `src/app/getting-started/commitment/page.tsx` | New commitment screen matching design image with tap-and-hold fingerprint animation and bottom-to-top brand transition. |
| **[MODIFY]** | `src/app/getting-started/struggles/page.tsx` | Add all Cameroon GCE subjects, category pills, search bar, and redirect CONTINUE button to `/getting-started/commitment`. |
| **[MODIFY]** | `src/app/api/ai/struggles/route.ts` | Enrich fallback subjects and level-specific default suggestions for Cameroon GCE. |
| **[MODIFY]** | `src/components/onboarding/OnboardingProgressBar.tsx` | Ensure smooth handling of 5 total steps and active state. |
| **[MODIFY]** | `src/app/getting-started/language/page.tsx` | Update progress bar to `totalSteps={5}`. |
| **[MODIFY]** | `src/app/getting-started/goal/page.tsx` | Update progress bar to `totalSteps={5}`. |
| **[MODIFY]** | `src/app/getting-started/education/page.tsx` | Update progress bar to `totalSteps={5}`. |

---

## 4. Offline-First & Service Worker Considerations
- All subject lists and commitment screen assets are bundled client-side (no blocking network calls required).
- Selections are stored locally in `localStorage` immediately.
- Works 100% offline under low-connectivity conditions in Cameroon.

---

## 5. Verification Plan

### Automated Checks
- Run TypeScript compiler check: `npx tsc --noEmit`
- Run Next.js lint: `npm run lint`

### Manual Verification Flow
1. Navigate to `/getting-started/struggles`.
2. Verify all Cameroon GCE subjects appear, category filters work, and search works.
3. Select subjects and click "CONTINUE".
4. Verify navigation to `/getting-started/commitment`.
5. Check visual alignment with `design/Ticha AI Commitment screen.png` (5-bar progress indicator, card layout, typography, viewfinder brackets, fingerprint graphic).
6. Tap and hold: verify circle fills smoothly, haptic pulses fire.
7. Release halfway: verify smooth spring reset.
8. Hold to 100%: verify bottom-to-top brand color fill wave and transition to `/register`.
