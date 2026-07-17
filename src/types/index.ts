// Shared TypeScript types/interfaces for the app

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
