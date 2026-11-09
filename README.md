<div align="center">

<img src="public/images/icon-192.png" alt="Ticha AI" width="96" />

# Ticha AI

### 1% better, every day.

**An AI study companion for Cameroonian students preparing for the GCE O-Level and A-Level, built to replace exam-season cramming with a small daily habit.**

[**🚀 Live app**](https://prometheus-ticha-ai.vercel.app) · [Architecture docs](docs/) · [Business plan](docs/BUSINESS_PLAN.md)

![Next.js](https://img.shields.io/badge/Next.js_16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?logo=googlegemini&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_v4-06B6D4?logo=tailwindcss&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8?logo=pwa&logoColor=white)
<img width="1774" height="887" alt="ticha banner" src="https://github.com/user-attachments/assets/4e82f6d5-8414-4820-a3f6-66f55ea6d2e0" />



</div>

---

## The problem

Every year, more than 200,000 students sit the Cameroon GCE. Most of them meet the full syllabus for the first time in the weeks before the exam, and they meet it all at once. The result is what we call **syllabus paralysis**: too much material, too little time, and no one to explain it one-on-one.

On top of that, the usual fixes don't fit the reality on the ground. Classes are overcrowded, private tutoring is expensive, mobile data is costly, and power cuts are common. A heavy, video-first learning platform doesn't survive those conditions.

## The idea

Ticha (Cameroonian Pidgin for *teacher*) takes the opposite approach: **one small, focused lesson a day, every day**, tied to the actual GCE syllabus and delivered through a light, installable web app that works on the phones students already have.

Instead of answering homework for students, Ticha teaches. It walks through problems step by step, asks questions back, and tracks the habit so that by exam day the syllabus is already familiar.

## Features

| | |
|---|---|
| 📅 **Daily lesson** | A bite-sized lesson each day, picked from the student's subjects and weak spots |
| 🧑🏾‍🏫 **AI tutor chat** | A Socratic tutor that scaffolds problems instead of handing over answers, grounded in GCE syllabus content |
| 🎙️ **Voice tutor** | Talk to Ticha out loud, with an African-accented voice (ElevenLabs) |
| 📝 **Past papers** | Browse GCE past papers by level and subject |
| ❓ **Quizzes & daily quiz** | AI-generated quizzes on any topic, plus a daily challenge |
| 🃏 **Flashcards** | Auto-generated flashcards for quick revision |
| 🎬 **Concept videos** | Short explainer videos matched to the topic being studied |
| 🔥 **Streaks & progress** | Streak calendar, progress tracking and a leaderboard to keep the habit alive |
| 🧭 **Personalised onboarding** | Language, education level, goal, struggle subjects and a daily commitment, used to tailor everything |
| 🌍 **English & French** | Bilingual interface for both halves of the country |
| 📲 **Installable PWA** | Add to home screen, app-like experience, built mobile-first |

## Screens

| Onboarding | Education level | Commitment | Explore |
|---|---|---|---|
| <img src="design/Startup Carousal 1.png" width="190" /> | <img src="design/Ticha Ed-Level.png" width="190" /> | <img src="design/Ticha AI Commitment screen.png" width="190" /> | <img src="design/Ticha AI Web View - Explore.png" width="190" /> |

## How the AI works

```
student question
      │
      ▼
 embed query (Gemini text-embedding, 768-d)
      │
      ▼
 pgvector similarity search in Supabase  ──▶  relevant syllabus / past-paper chunks
      │
      ▼
 prompt builder: tutor persona + GCE subject code & level + retrieved context
      │
      ▼
 Gemini 2.5 Flash (streamed over SSE)  ──▶  step-by-step answer in the chat
```

- **Retrieval-augmented generation (RAG).** Syllabus documents and notes are chunked, embedded and stored in Postgres with `pgvector`. Each tutor reply is grounded in the closest chunks, which keeps answers on the GCE syllabus instead of a generic one.
- **Ingestion pipeline.** Upload `.docx` material, convert it (Mammoth), chunk it, embed it, store it: [`src/lib/rag/`](src/lib/rag/).
- **Keys stay server-side.** Every model call goes through a Next.js API route; no API keys reach the browser.

More detail: [`docs/AI_ARCHITECTURE.md`](docs/AI_ARCHITECTURE.md).

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion |
| Backend | Next.js API routes, Supabase (Postgres, Auth, Row Level Security), `pgvector` |
| AI | Google Gemini (chat + embeddings), ElevenLabs (voice), YouTube Data API (videos) |
|Translation| i18next / react-i18next |
| Validation | Zod |
| Hosting | Vercel |


> **Tip:** Ticha is designed mobile-first. Open it with your browser's device toolbar or on a phone. On wide screens, only the dashboard has a desktop layout so far; other pages show a "not yet on desktop" screen.

## Project structure

```
src/
├── app/
│   ├── (auth)/              Login & register
│   ├── getting-started/     Onboarding flow (language → level → goal → struggles → commitment)
│   ├── dashboard/           Home, subjects, quizzes, flashcards, videos, progress, profile
│   ├── past-papers/         GCE past paper browser
│   ├── explore/, leaderboard/, practice/, summaries/
│   └── api/
│       ├── ai/              Daily lesson, quiz, flashcards, video, onboarding tips
│       ├── tutor/           Chat (streaming) + text-to-speech
│       ├── rag/             Ingest, query, summaries
│       └── papers/, progress/, courses/, youtube/, elevenlabs/
├── components/              UI, layout, tutor, dashboard, courses, onboarding…
├── hooks/                   useAuth, useStreak, useTutor, usePapers…
├── lib/
│   ├── rag/                 Chunker, converter, embeddings, retriever, prompt builder
│   ├── gceSyllabusData.ts   GCE syllabus structure
│   └── i18n.ts              English & French strings
└── data/                    GCE subject catalogue, past-paper seed data
supabase/schema.sql          Full database schema
docs/                        Architecture docs (AI, dashboard, onboarding, PWA)
design/                      UI designs
```

## Roadmap

- [ ] Desktop layouts for every page, not just the dashboard
- [ ] Offline mode: cached lessons, flashcards and downloaded past papers
- [ ] Freemium plan with a paid Pro tier
- [ ] Coverage for competitive state exams (*concours*) and university CAs

## Team(iTek)

Built at [Coding Wave Academy](https://github.com/Coding-Wave-Academy) by:

- **Ribert Kandi Junior**
- [**RyanDante**](https://github.com/RyanDante)
- [**Jemi-bigdata**](https://github.com/Jemi-bigdata)


## Contributing(ONLY FOR INTERNAL MEMBERS)

Work happens on feature branches (`dev-*/name`) → `develop` → `staging` → `main`. Open a pull request against `develop`.
