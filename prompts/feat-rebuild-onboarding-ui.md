# Implementation Plan - Rebuilding Onboarding & Auth UI Based on New Designs

## Overview
We will rebuild the entire onboarding flow and authentication screens (Startup screen with 3 auto-sliding character carousel cards, Language selection, Goal selection, Education Level selection, Create Account / Register, and Login) matching the exact visual aesthetics, color palette (`#C8FF2A` Lime Green, `#FF882E` Ticha Orange, `#0A0A0F` Deep Black, `#FFF8F1` Warm Cream), card layouts, icons, typography, and interactive behaviors from the designs in the `design/` folder.

---

## User Review Required

> [!IMPORTANT]
> - **Startup Carousel**: The startup screen (`/getting-started` and `/`) will feature 3 distinct auto-sliding/swipeable character cards (Card 1: *Learn a Little Every Day*, Card 2: *Understand with AI Tutor*, Card 3: *Practice to Master*) with smooth transitions, progress indicators, quick feature pills, "Get Started" and "Continue with Google" buttons.
> - **Asset Delivery**: We will copy the high-resolution design illustration assets into `public/images/onboarding/` to ensure crisp rendering of character illustrations and badges on all devices.
> - **Consistent Token Palette**: We will standardize primary (`#C8FF2A`), secondary (`#FF882E`), background (`#FFF8F1`), and border/shadow styling across all onboarding and auth screens.

---

## Proposed Changes

### 1. Asset & Design Tokens Setup
- Copy necessary illustration assets from `design/` to `public/images/onboarding/`.
- Verify and tune Tailwind CSS variables and custom utility classes in `src/app/globals.css` for consistent `#C8FF2A`, `#FF882E`, `#0A0A0F`, `#FFF8F1` palette, shadows, and pill borders.

#### [NEW] Assets in `public/images/onboarding/`
- Carousel character illustrations (Slide 1: Learn Daily, Slide 2: AI Tutor, Slide 3: Practice & Master)
- Language characters illustration (English/French students)

---

### 2. Startup Carousel Screen (`src/app/getting-started/page.tsx`)
- **Header**: `1% Ticha AI` logo with tagline `Small Steps. Big Mastery.`, Sparkle badges, and `Welcome to Ticha AI ✨` pill.
- **Hero Title**: `Better Every Day, Stronger Tomorrow.` with `Your AI study companion for GCE success.`
- **Interactive Auto-slide Carousel**:
  - Auto-plays every 4 seconds with pause-on-hover / drag support.
  - Slide 1: Card with `01`, `Learn a Little Every Day`, green hoodie boy writing with 1% calendar.
  - Slide 2: Card with `02`, `Understand with AI Tutor`, orange sweater girl waving at AI bot on laptop.
  - Slide 3: Card with `03`, `Practice to Master`, purple hoodie boy with 85% progress score card.
  - Carousel pagination indicators (active black dot, inactive gray dots).
- **3 Highlight Features**:
  - 📖 `Learn a little every day` (Bite-sized lessons that build knowledge)
  - 🤖 `Get help from AI Tutor` (Clear explanations, anytime you need)
  - 🎯 `Practice and improve` (Quizzes, past questions and feedback)
- **Call-to-Action Buttons**:
  - `Get Started →` (Lime green button with shadow)
  - `Continue with Google` (White neobrutalist button with Google G icon)
  - `Already have an account? Sign in` link
- **Footer**: `Learn a little today. Achieve more tomorrow.` banner.

---

### 3. Language Selector Screen (`src/app/getting-started/language/page.tsx`)
- **Header**: Circular back button and 5-segment pill progress indicator (Step 1 active in lime green).
- **Title**: `What language do you prefer?` with `language` highlighted in lime green with organic underline.
- **Illustration**: Bilingual Cameroonian student characters illustration.
- **Language Grid**:
  - `English` card with Globe icon and checkmark badge (selected state: lime green background, black border, shadow).
  - `Français` card with Globe icon.
- **Info Callout**: `⚙️ You can change this in settings anytime` pill banner.
- **Bottom Button**: `CONTINUE →` (Lime green neobrutalist button).

---

### 4. Goal Selection Screen (`src/app/getting-started/goal/page.tsx`)
- **Header**: Circular back button and 3-step progress pills (Step 1 active).
- **Title**: `What's Your Main Goal?` with `Main Goal?` highlighted in lime green with curved underline.
- **Goal Cards**:
  - Top 2-column grid: `Pass GCE O/L` (Form 5 focus) & `Pass GCE A/L` (Upper Sixth).
  - Middle full-width card: `Excel in University CAs` (Continuous Assessment prep).
  - Bottom 2-column grid: `Deep Understanding` (Master concepts) & `Build Confidence` (Exam readiness).
- **Multi-select support**: Selection toggles lime green background, custom checkmark icon badge, and persists in `localStorage` + profile.
- **Bottom Button**: `NEXT →` (Lime green neobrutalist button).

---

### 5. Education Level Screen (`src/app/getting-started/education/page.tsx`)
- **Header**: Circular back button and 3-step progress pills (Step 2 active).
- **Title**: `Your Education Level 🎓` with `Education` highlighted in lime green.
- **Options List**:
  - `GCE O Level` (Secondary School, Blue Book icon)
  - `GCE A Level` (High School, Orange Book icon)
  - `Technical` (Vocational Studies, Tools icon)
  - `University Student` (Undergraduate, Graduation cap icon)
- **Single selection**: Updates selection state with lime green active highlight and checkmark.
- **Bottom Button**: `CONTINUE →` (Lime green button).

---

### 6. Create Account / Register Screen (`src/app/(auth)/register/page.tsx`)
- **Header**: `Create Account` with `Account` in lime green, subtitle `Now, let's save your progress.`
- **Milestone Reached Banner**:
  - Lime green card with dot pattern, star medal icon, `MILESTONE REACHED`, `Level 1: Novice`, and `🔥 1 DAY STREAK!` badge.
- **Form Card**:
  - `Full Name` with user icon badge prefix.
  - `Email Address` with mail icon badge prefix.
  - `Password` with lock icon badge prefix, eye toggle, 5-bar password strength meter, and criteria checklist.
  - `Confirm Password` with lock icon badge and matching indicator.
  - `SIGN UP →` lime green button.
- **Footer**: `Already have an account? Log in` & `SKIP FOR NOW & EXPLORE DASHBOARD →`.

---

### 7. Login Screen (`src/app/(auth)/login/page.tsx`)
- **Header**: `Welcome back, Scholar! 👋` (`Scholar!` in Ticha Orange `#FF882E`), subtitle `Ready to pick up where you left off?`
- **Form Card**:
  - `Email Address` input with mail icon box prefix.
  - `Password` input with lock icon box prefix, `Forgot?` link, and eye visibility toggle.
  - `LOG IN →` lime green button.
- **Divider & Social Login**:
  - `─── OR ───`
  - `Continue with Google` button with official Google icon.
- **Footer**: `New here? Create an account` link.

---

## Verification Plan

### Automated Build & Type Check
- Run `npx tsc --noEmit` to ensure zero TypeScript errors.
- Run `npm run build` or `next lint` to verify build integrity.

### Visual & Interactive Verification
- Verify responsive layout on mobile viewport (375px - 430px) and desktop wrapper.
- Verify auto-sliding carousel transitions smoothly and responds to manual touch swipe / dot clicks.
- Verify selection state persistence across steps (language, goals, education level) and successful account creation / login flow.
