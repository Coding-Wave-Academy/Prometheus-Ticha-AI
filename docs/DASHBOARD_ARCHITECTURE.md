# Dashboard Architecture (Web, Tablet & Mobile)

## Overview

The Ticha AI Dashboard provides a responsive, offline-resilient experience tailored for Cameroonian students preparing for GCE Ordinary and Advanced Level exams.

## Responsive Strategy

The dashboard implements a dual-layout strategy:
- **Web & Tablet (`>=768px` / `md` breakpoint)**: Renders a two-column layout with a persistent left navigation sidebar (`DashboardSidebar.tsx`), top header (`DashboardHeaderWeb.tsx`), large Daily Lesson banner (`DailyLessonCardWeb.tsx`), Streak tracker (`StreakCardWeb.tsx`), Quick Actions (`QuickActionsWeb.tsx`), and Progress card (`ProgressCardWeb.tsx`).
- **Mobile (`<768px`)**: Renders the mobile-first single-column layout with top avatar header, streak calendar, 4-action grid, featured subjects list, upgrade CTA, and bottom navigation bar (`BottomNav.tsx`).

## Real-Time & Live Data Flow

1. **User Profile & Struggles (`useProfile`, `useAuth`)**:
   - Queries the Supabase `profiles` table for `full_name`, `avatar_url`, `education_level`, `streak_count`, and `struggles`.
   - Synchronizes bidirectionally with `localStorage` for instant offline render and optimistic updates.
2. **Daily Lesson Generation (`@/lib/dailyTopic`)**:
   - Rotates daily curriculum topics dynamically based on the student's selected struggle subjects and the current day of the year.
3. **Streak Tracking (`useStreak`)**:
   - Manages streak count and the 7-day weekly status (Active, Frozen, Upcoming).
   - Allows students to claim their daily streak once per calendar date, triggering confetti and updating Supabase and local cache.
4. **Quick Actions & Notifications (`useNotifications`)**:
   - Tracks unread alerts and badges for daily quiz prompts, study habits, and system achievements.
5. **Subject Progress (`localStorage` & `user_progress`)**:
   - Computes subject mastery percentage across lessons and quizzes.
