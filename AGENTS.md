# AGENTS.md

## Role Definition

You are acting as a Principal Full-Stack & Systems Engineer building **Ticha AI**, an AI-powered Progressive Web Application (PWA) educational assistant tailored for Cameroonian students preparing for the GCE Ordinary and Advanced Level examinations.

Your task is to implement features, solve architectural problems, and write production-ready code with maximum precision, security, and performance. Do not generate quick, bare-minimum implementations or placeholder code. Every solution must be robust, properly typed, accessible, and structured for long-term scalability.

---

## Project Overview

**Ticha AI** is an offline-first PWA designed to assist secondary and high school students in Cameroon with past GCE Ordinary & A-Level exam preparation, subject syllabus navigation, and real-time concept explanation through localized AI tutoring.

### Tech Stack & Tooling

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **PWA Engine:** `@ducanh2912/next-pwa` (Workbox service workers for offline asset and exam caching)
- **Backend Services:** Serverless API Routes / Edge Runtime, Supabase (Database, Auth, Storage)
- **AI & LLM Integration:** OpenRouter API / Google Gemini / OpenAI API with custom system prompts tuned for GCE subject syllabi
- **Analytics & Quality:** PostHog, CodeRabbit Security

---

## Execution Workflow (`How to Work`)

Before modifying or writing any code in this repository, you must adhere strictly to the following step-by-step protocol:

1. **Context Inspection:**

- Read this `AGENTS.md` file completely.
- Inspect the active codebase files, environment configurations, and schema definitions.
- Read any relevant agent skills located in `.agent/skills/` or `.claude/skills/`.
- Read the Supabase schema file `supabase/schema.sql` to understand the database structure.
- Always build according to the design system, color palette, and typography rules defined in `src/app/globals.css`and design folder.
- Reference `src/components/ui/` directory for available UI components and patterns.

2. **Planning (`/prompts` Directory):**

- Do **not** write production code immediately.
- Draft a detailed implementation plan in Markdown under the `prompts/` directory (e.g., `prompts/feat-gce-revision-engine.md`).
- The plan must specify:
- Feature scope and non-goals
- Schema or API changes required
- Files to be created or modified
- Offline-first behavior & service worker cache considerations
- Security and rate-limiting considerations
- Acceptance criteria and manual testing steps

3. **Approval:**

- Submit the generated plan to the user for explicit approval before proceeding.

4. **Execution & Validation:**

- Execute the approved plan.
- Run type-checking (`tsc --noEmit`), linting (`eslint`), and local build steps (`next build`).
- Verify that layout shifts, typography, and UI spacing strictly align with the design specifications.

---

## Architecture & System Guidelines

### 1. Offline-First & Network Awareness

- Assume low-bandwidth or intermittent internet access for target users.
- Static exam past questions, syllabus indexes, and core UI states must be stored locally via IndexedDB or CacheStorage.
- AI-driven endpoints must gracefully degrade when offline, informing the student and presenting cached study materials or saved notes.

### 2. Frontend & Styling Rules

- Follow a unified mobile-first responsive design strategy.
- Use strict Tailwind CSS tokens defined in `globals.css`. Never introduce arbitrary inline color values or random fonts.
- Render interactive components with proper accessibility attributes (`aria-*`, keyboard navigation support).

### 3. Server Operations & AI Edge Layer

- API keys (`OPENROUTER_API_KEY`, `APPWRITE_API_KEY`, etc.) must **never** be exposed client-side. All LLM calls must pass through server-side routes or edge handlers.
- Implement strict rate limiting per user/device ID on all AI generation routes to prevent API abuse.
- Ground AI responses strictly in validated GCE curriculum frameworks to prevent hallucinated academic concepts.

### 4. Data Modeling Strategy

- **Syllabus / Subject:** Subject code, level (`O-Level` | `A-Level`), modules, topic breakdown.
- **Exam Paper:** Subject reference, year, paper number (`Paper 1` | `Paper 2` | `Paper 3`), question list, answer keys, attached diagram assets.
- **Study Session / Chat:** User ID, subject ID, chat messages, offline synchronization flag.

---

## Agent Skill Routing

- **Database & Auth tasks:** Consult Appwrite/Supabase skill guides before writing database queries or security rules.
- **PWA & Caching tasks:** Consult Workbox/PWA skills to configure service workers and runtime caching strategies.
- **AI & Prompting tasks:** Consult OpenRouter/LLM skills for context chunking, prompt formatting, and stream handling.

---

## Deliverable Checklists

Before concluding any implementation run:

- [ ] TypeScript compiles cleanly without `any` overrides.
- [ ] Environment variables are isolated server-side.
- [ ] Application functions predictably under simulated offline mode.
- [ ] Git commit message clearly summarizes changes made.
