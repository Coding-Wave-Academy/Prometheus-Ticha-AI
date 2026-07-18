// Shared TypeScript types/interfaces for the app
import type React from "react";

// ── Dashboard ────────────────────────────────────────────────────────────────

export interface StreakDay {
  day: string;
  active: boolean;
}

export interface QuickAction {
  name: string;
  icon: string;
  bgColor: string;
  badge?: number;
}

export interface SubjectData {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  progress: number;
  /** Tailwind bg-[hex] class */
  bgColor: string;
  icon: React.ReactNode;
}

// ── Explore ───────────────────────────────────────────────────────────────────

export interface HubCard {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  /** Tailwind bg-[hex] class */
  bgColor: string;
  /** Renders as a full-width row instead of a square */
  large?: boolean;
  /** Optional decorative text/emoji shown as background graphic on large cards */
  bgGraphic?: string;
}

// ── Navigation ────────────────────────────────────────────────────────────────

export interface NavItem {
  id: string;
  /** i18n key under dashboard.nav.* */
  labelKey: string;
  icon: string;
  href: string;
}

// ── Auth / User ───────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "student" | "instructor" | "admin";
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  instructorId: string;
  modules: Module[];
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  type: "text" | "video" | "interactive";
  duration?: number; // in minutes
  order: number;
}

export interface Quiz {
  id: string;
  title: string;
  lessonId: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: "multiple-choice" | "true-false" | "fill-in-the-blank";
  options?: string[];
  correctAnswer: string;
}

export interface Progress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  quizScores: Record<string, number>;
  lastAccessedAt: string;
}
