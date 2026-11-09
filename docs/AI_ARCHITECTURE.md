# Ticha AI — AI Architecture & Tutoring Engine

## 1. Overview

**Ticha AI** provides localized, curriculum-grounded AI tutoring specifically tailored for students preparing for the Cameroon General Certificate of Education (GCE) Ordinary and Advanced Level examinations.

The AI system is designed to provide:
1. **Curriculum Grounding**: Explanations align strictly with the Cameroon GCE Board syllabus (covering both South West and North West regional examination conventions).
2. **Pedagogical Scaffolding**: Step-by-step problem-solving rather than direct answers, fostering independent student comprehension.
3. **Bilingual Sensitivity**: Support for English and French (including Cameroon educational bilingual terminology).
4. **Low-Latency Streaming**: Fast token generation with edge handlers and serverless routes.

---

## 2. Model & Provider Integration

The application routes LLM inference through server-side handlers:
- **Primary Inference Providers**: OpenRouter API / Google Gemini / OpenAI.
- **Client Security**: API keys (`OPENROUTER_API_KEY`, `GEMINI_API_KEY`, etc.) are isolated strictly to server routes (`src/app/api/ai/*`) and Edge functions. No keys are ever exposed in client bundles.

---

## 3. System Prompts & Curriculum Context

AI prompts inject subject syllabus context:
- **Subject Code & Level**: Distinguishes between GCE Ordinary Level (e.g., MATH-570, PHY-580) and Advanced Level (e.g., PMS-770, PMM-765, PHY-780).
- **Tone & Persona**: Encouraging, structured African high-school tutor persona ("Ticha"). Uses localized analogies and diagrams in ASCII or Markdown math syntax (KaTeX/LaTeX).
- **Exam Framework**: Refers to Paper 1 (MCQ), Paper 2 (Structured Theory), and Paper 3 (Practicals).

---

## 4. Authentication, Limits & Abuse Prevention

### Every AI route requires a signed-in user
AI calls cost money per request, so every route that calls Gemini, ElevenLabs or YouTube starts with:

```ts
import { requireUser } from "@/lib/auth/requireUser";

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if (auth.response) return auth.response; // 401 { error: "unauthenticated" }
  // auth.user / auth.supabase are available from here
}
```

`requireUser()` uses `supabase.auth.getUser()`, which validates the token with Supabase Auth. Don't use `getSession()` for authorisation: it only decodes the cookie.

**When adding a new AI route, add `requireUser()` first.** The only intentional exception is `/api/ai/intel`, which runs during onboarding before the student has an account. It accepts only allow-listed values and caches results per combination (see the route's header comment), so it can't be used as a general-purpose Gemini proxy.

On the client, call our API with `apiFetch()` from `@/lib/api` instead of `fetch()`. It redirects to login on 401 and reports network failures as `ApiError` with `kind: "offline"`.

### Input validation
Request bodies for the tutor routes are validated with zod schemas in `src/lib/apiSchemas.ts`:
- Tutor message: up to 2,000 characters. TTS text: up to 1,500 characters.
- Subjects must be a known GCE subject (`normalizeSubject`), and education levels are normalised to `ol | al | university`.
- Conversation history is trimmed to the last 20 turns (4,000 characters each) rather than rejected.

New routes that accept free text should add a schema there.

### Rate limiting (current state)
`src/proxy.ts` applies a coarse limit of 60 requests a minute per IP to `/api/*`. It is held in memory, so on serverless hosting it is per instance and resets on cold start. It is a backstop, not a quota. Per-user daily limits for AI routes (which will also enforce the free plan) are planned.

### Fallbacks
When Gemini is unavailable, several routes return built-in fallback content instead of an error (for example the onboarding intel card).
