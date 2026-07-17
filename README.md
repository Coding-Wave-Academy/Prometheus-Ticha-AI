# Prometheus-Ticha-AI
# PART 1: BUSINESS PLAN
## 1. EXECUTIVE SUMMARY
- Objectives of Ticha-AI: Encourage students to learn actively, and develop good studying habits.
- Problem statement: Most students become anxious and overwhelmed prior to exams because the compound classwork, Ticha-Ai is aimed at encouraging and helping students to prepare for their exams better by developing good studying habits.
- Solution: 1% daily improvement, instead of compounding classwork
  
## 2. MARKET ANALYSIS
- Target audience: Primary users: GCE-O Level students, GCE-A Level students
                    Secondary users: students preparing for competitive state exams and university students

## 3.SALES AND MARKETING STRATEGY
- Value proposition: Ticha-ai  provides a unique personalised learning experience to its users and helps them build good studying habits that will help them achieve their long-term academic goals unlike other applications Tich-ai focuses on helping students progress and understanding rather than just answering homework or cramming past answers or solutions for the sole purpose of passing the exams
- Market Channels: showcase our app to students through school visits, posters and
- Pricing model: all users have access to a freemium plan, that gives the limited access to the application features, users may choose to uprgrade to a pro plan through a monthly or yearly paid subscription

## 4. FINANCIAL PLAN
- Startup costs: cost of API key for the AI model used in the application, subscription for AI assistants for the app development and hosting cost to deploy the application on popular platforms
- Break-even analysis: 
- Future projection:

  # PART 2: PRODUCT REQUIREMENT  DOCUMENT
  Here is a comprehensive Product Requirements Document (PRD) based on your project overview and the market realities of the Cameroonian education sector.
  
## 1.Product Overview
-	Mission: TICHA AI is a compassionate, AI-powered Progressive Web App (PWA) designed to act as the "perfect teacher" for Cameroonian students. It helps students prepare for the GCE Ordinary Level (O/L), Advanced Level (A/L), competitive state exams (concours), and university continuous assessments (CAs).
-	Core Philosophy: Shifting from last-minute cramming to a "1% daily improvement" habit through personalized, Socratic micro-learning.

## 2. Target Audience & Market Size

-Primary Users: GCE O-Level and A-Level students. (The Cameroon GCE Board registered over 213,000 candidates in 2025).
-Secondary Users: University students (an estimated 500,000+ nationally) and candidates preparing for competitive state exams, which can attract upwards of 250,000 applicants annually. Focus is placed on students in rural, resource-constrained, and underserved areas.

## 3. The Problem: "Syllabus Paralysis" & Infrastructure Gaps:

-	Cognitive Overload: Students are overwhelmed by monolithic syllabi and compound coursework. In universities, Continuous Assessments (CAs) account for 30% of final grades, leading to massive stress and cramming during "Blocked Weeks".


-	Systemic Deficits: Severe teacher shortages and overcrowded lecture halls make individualized feedback impossible.


-	Resource & Energy Constraints: High mobile data costs (averaging $1.63/GB) and chronic Eneo power grid load-shedding make traditional, high-bandwidth online learning platforms unviable for the average Cameroonian student.

## 4. Solution & Core Features
To combat these challenges, TICHA AI delivers the following features:

- Offline-First PWA: Built to survive power outages and minimize expensive data consumption. Students can download daily modules and interact with cached materials completely offline.
- RAG-Powered Socratic Tutor: AI is restricted to querying uploaded course outlines, past papers, and university PDFs to prevent hallucinations. It guides students to answers via critical thinking rather than just giving them the solution.
- 1% Daily Habit Loop: The app breaks down dense uploaded syllabi into AI-generated summaries, flashcards, and daily bite-sized practice quizzes.
- Gamification: Incorporation of streaks, badges, and national/regional leaderboards to build a healthy, competitive community and combat study isolation.
- Bilingual Accessibility: Full native support for English and French to cater to both the Anglophone (GCE) and Francophone (Baccalaureate) educational subsystems.

##  5.Technical Architecture:
The technology stack is specifically chosen for high performance, low cost, and offline resilience:

- Frontend: React + Vite + React Router.
-Styling: Pure native CSS utilizing a "Neo-Brutalism" design language (thick borders, hard shadows, high-contrast Cameroon national colors) to ensure cognitive focus and readability on mobile devices.
-Backend & Database: Supabase (handling Postgres database, Auth, and Storage for document uploads).
- AI Engine: Gemini connected via Supabase Edge Functions for secure, serverless execution.
- Deployment: Vercel (Frontend) and Supabase Hosting (Backend/DB).

##  6. Business Model (Freemium
The pricing strategy is localized to accommodate the purchasing power of Cameroonian youth while ensuring platform sustainability:

- Free Tier: Grants access to basic features with a strict limitation on document uploads (2 to 5 uploads per month).
- Premium Tier (University): 1,000 XAF per semester for unlimited or expanded access tailored to university course loads.
- Premium Tier (GCE/Concours): 2,000 XAF per year for secondary students preparing for government examinations.
##  7. Implementation Phasing

-  Phase 1 (Infrastructure & Auth):  Set up Supabase Postgres, authentication routing, and the React + Vite frontend skeleton using the Neo-Brutalist CSS framework.
-  Phase 2 (RAG & Upload Engine): Implement Supabase Storage for PDF uploads, configure Edge Functions to parse/chunk documents, and connect the vector database to the chosen LLM (Gemini/OpenAI/Grok).
-  Phase 3 (Core Experience): Build the "1% daily improvement" logic—generating flashcards, summaries, and daily quizzes from the processed documents.
- Phase 4 (Gamification & Offline Sync): Implement PWA service workers for offline caching, and launch the leaderboard and streak mechanics.

