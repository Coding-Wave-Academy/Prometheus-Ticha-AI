# Plan: Fix Daily Topic Flashcards & Repository-wide Linting / Type Integrity

## 1. Feature Scope & Problem Overview

### Problem 1: Flashcards Do Not Reflect Topic of the Day
- When navigating to `/dashboard/flashcards` directly (or without specific URL query parameters), the flashcards page was defaulting to "Physics" and "Newton's Laws of Motion" or reading un-dated localStorage keys from previous sessions.
- In `src/app/api/ai/daily-lesson/route.ts`, a deterministic topic rotation exists based on user struggles and day-of-year (`getTodaySubject` and `pickTodayTopic`), but this logic was isolated and not shared across the frontend and other endpoints (`/api/ai/flashcards`, `/dashboard/flashcards`, `/dashboard/daily-quiz`).
- Flashcard decks stored in cache/localStorage lacked date-based validation, causing previous days' topics or fallbacks to persist indefinitely.

### Problem 2: Repository-Wide ESLint, TypeScript & React Compiler Errors
Linting fails with 61 issues (25 errors, 36 warnings) across several categories:
1. **Unused Imports & Variables**: Unused icons, hooks, and variables across 14+ files.
2. **`any` Type Usage**: Explicit `any` in API routes (`papers`, `flashcards`, `daily-lesson`) and components (`ConversationalChat`, `usePapers`, `api/papers.ts`).
3. **Variable Declaration Issues**: `let` used instead of `const` for variables that are never reassigned.
4. **React Compiler & Purity Issues**:
   - Calling impure functions like `Date.now()` directly in render path.
   - Memoization mismatch (`preserve-manual-memoization`) with nested profile properties in `ConversationalChat.tsx`.
   - Unescaped HTML entities in `videos/page.tsx`.
   - Missing hook dependencies in `usePapers.ts` and `daily-quiz/page.tsx`.
5. **Variable Access Before Declaration**: Functions (`handleTimeExpired`, `finishExam`) in `daily-quiz/page.tsx` accessed inside `useEffect` before their declaration.

---

## 2. Proposed Changes

### Component 1: Daily Topic Engine & Flashcard Alignment
1. **`src/lib/dailyTopic.ts` (NEW)**
   - Extract and centralize the subject & topic pool dictionary and rotation algorithms: `getTodaySubject(struggles, date)`, `getTodayTopic(subject, date)`, and `getTodayLessonTopic(struggles, date)`.
   - Add helpers to store and retrieve date-stamped today's lesson/topic metadata in `localStorage` (`ticha_today_lesson_topic_v2` with `date: "YYYY-MM-DD"`).

2. **`src/app/dashboard/flashcards/page.tsx` (MODIFY)**
   - Update `loadTopicAndCards` to resolve today's subject and topic using the shared `getTodayLessonTopic` logic whenever URL parameters are omitted or when stored cache is dated from a previous day.
   - Remove unused imports (`AnimatePresence`).

3. **`src/app/api/ai/flashcards/route.ts` (MODIFY)**
   - Integrate `getTodayLessonTopic` so fallback generation defaults to today's topic instead of hardcoded Newton's laws.
   - Replace `(item: any)` with typed interfaces (`FlashCardItem`).

4. **`src/app/api/ai/daily-lesson/route.ts` (MODIFY)**
   - Refactor to consume `src/lib/dailyTopic.ts`.
   - Fix `let targetSubject`, `let targetTopic` to `const`.
   - Fix `(q: any)` to typed quiz question schema.

---

### Component 2: Linting, TypeScript & React Compiler Fixes
1. **`src/app/dashboard/daily-quiz/page.tsx` (MODIFY)**
   - Move `handleTimeExpired` and `finishExam` (with `useCallback`) before the `useEffect` hooks to eliminate variable access before declaration.
   - Fix missing hook dependencies.
   - Remove unused imports (`AnimatePresence`, `SparklesIcon`, `ArrowRight01Icon`).

2. **`src/components/tutor/ConversationalChat.tsx` (MODIFY)**
   - Fix `any` types by typing SpeechRecognition events / interfaces.
   - Fix React Compiler memoization by extracting primitive dependencies (`educationLevel`, `preferredLanguage`).
   - Remove unused icons (`VolumeHighIcon`, `WifiDisconnected01Icon`, `CheckmarkCircle02Icon`).

3. **`src/app/getting-started/struggles/page.tsx` (MODIFY)**
   - Fix impure `Date.now()` call by deriving unique IDs deterministically from normalized slug or sanitized name.

4. **`src/components/tutor/TutorMessage.tsx` (MODIFY)**
   - Replace `let rawText` and `let displayText` with `const`.

5. **`src/app/dashboard/videos/page.tsx` (MODIFY)**
   - Replace unescaped quotes with `&apos;`.
   - Remove unused imports/variables (`Book01Icon`, `router`).

6. **`src/hooks/usePapers.ts` & `src/lib/api/papers.ts` (MODIFY)**
   - Add missing `activeLevel` dependency in `useEffect`.
   - Replace `any` types with typed `Paper` and API response interfaces.

7. **Other API routes & components cleanup (MODIFY)**:
   - `src/app/(auth)/login/page.tsx`: Clean up unused `msg`.
   - `src/app/api/papers/[id]/download/route.ts`: Replace `any` type with proper Supabase storage/error types.
   - `src/app/api/papers/[id]/route.ts`: Clean up unused `err` / replace `any`.
   - `src/app/api/papers/route.ts`: Replace `any` with typed database row interface.
   - `src/app/api/papers/subjects/route.ts`: Fix `let` to `const query`, replace `any`.
   - `src/app/api/rag/summaries/route.ts`: Remove unused `getServiceClient`.
   - `src/app/api/tutor/chat/route.ts`: Remove unused `sessionId`.
   - `src/app/dashboard/subjects/[subject]/page.tsx`: Remove unused imports and `isLoaded`.
   - `src/app/dashboard/subjects/page.tsx`: Remove unused icons.
   - `src/app/getting-started/education/page.tsx`: Remove unused `useEffect`.
   - `src/components/tutor/ExerciseBlock.tsx`: Remove unused `motion`.
   - `src/components/videos/ConceptVideoPlayer.tsx`: Remove unused `VolumeHighIcon`, `VolumeOffIcon`, `isMuted`, `setIsMuted`.
   - `src/hooks/useTutor.ts`: Remove unused `useCallback`, `e`.
   - `src/lib/rag/converter.ts`: Remove unused `DocumentMetadata`, `filename`, `mimeType`.

---

## 3. Verification Plan
1. **Automated Verification**:
   - Run `npm run lint` -> Must pass with 0 errors and 0 warnings.
   - Run `npx tsc --noEmit` -> Must pass with 0 TypeScript compilation errors.
   - Run `npm run build` -> Verify Next.js production build succeeds cleanly.
2. **Manual & Flow Verification**:
   - Verify Flashcards page directly at `/dashboard/flashcards` without query params displays today's rotating topic based on calendar date and student struggles.
   - Verify navigation from Daily Lesson to Flashcards passes the correct topic.
