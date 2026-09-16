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

## 4. Rate Limiting & Abuse Prevention

To ensure equitable access on mobile connections:
1. **Per-Device & Per-User Throttling**: Limits requests per minute to prevent runaway consumption.
2. **Input Sanitization**: User inputs are trimmed and validated before processing, preventing injection attacks.
3. **Structured Fallback Data**: In offline or degraded network conditions, endpoints fall back gracefully to pre-cached curriculum summaries and study drills.
