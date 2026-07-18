"use client";

import React, { useState } from "react";
import Link from "next/link";

interface RouteItem {
  name: string;
  path: string;
  description: string;
  badge?: string;
  badgeBg?: string;
  isDynamic?: boolean;
}

interface RouteSection {
  title: string;
  icon: string;
  routes: RouteItem[];
}

export default function SitemapPage() {
  // States for testing dynamic routes
  const [testCourseId, setTestCourseId] = useState("calculus-101");
  const [testLessonId, setTestLessonId] = useState("limits-and-derivatives");
  const [testQuizId, setTestQuizId] = useState("midterm-quiz");

  const sections: RouteSection[] = [
    {
      title: "Onboarding & Auth Flow",
      icon: "🚪",
      routes: [
        {
          name: "Landing / Home",
          path: "/",
          description: "Main marketing and landing page.",
          badge: "Public",
          badgeBg: "bg-stone-200",
        },
        {
          name: "Getting Started (Welcome)",
          path: "/getting-started",
          description: "First step onboarding with achievement showcase.",
          badge: "New",
          badgeBg: "bg-[#B6FF00]",
        },
        {
          name: "Language Selection",
          path: "/getting-started/language",
          description: "Select between English and French with progress bar.",
          badge: "New",
          badgeBg: "bg-[#B6FF00]",
        },
        {
          name: "Goal Selection",
          path: "/getting-started/goal",
          description: "Choose primary educational motivation (e.g. GCE exams, study habits).",
          badge: "New",
          badgeBg: "bg-[#B6FF00]",
        },
        {
          name: "Education Level",
          path: "/getting-started/education",
          description: "Select between O/L, A/L, or University academic targets.",
          badge: "New",
          badgeBg: "bg-[#B6FF00]",
        },
        {
          name: "Struggles Identification",
          path: "/getting-started/struggles",
          description: "Select subjects where help is needed.",
          badge: "New",
          badgeBg: "bg-[#B6FF00]",
        },
        {
          name: "Personalized Exam Intel",
          path: "/getting-started/intel",
          description: "Bespoke subject insights preview (Quantum Tunneling showcase).",
          badge: "New",
          badgeBg: "bg-[#B6FF00]",
        },
        {
          name: "Log In",
          path: "/login",
          description: "Sign in with email/password and social login options.",
          badge: "Auth",
          badgeBg: "bg-[#FFB040]",
        },
        {
          name: "Register",
          path: "/register",
          description: "Sign up with password strength criteria verification.",
          badge: "Auth",
          badgeBg: "bg-[#FFB040]",
        },
      ],
    },
    {
      title: "Explore Hub",
      icon: "🧑‍🎓",
      routes: [
        {
          name: "Explore Hub",
          path: "/explore",
          description: "Core learning, practice tools, and social rankings.",
          badge: "New",
          badgeBg: "bg-[#B6FF00]",
        },
        {
          name: "AI Flashcards (Recall)",
          path: "/explore/flashcards",
          description: "Active-recall flipping flashcard study guides generated with AI.",
          badge: "AI",
          badgeBg: "bg-[#FFB040]",
        },
        {
          name: "AI Upload Document solver",
          path: "/explore/upload",
          description: "Upload outlines/papers and study, summarize, or solve.",
          badge: "AI",
          badgeBg: "bg-[#FFB040]",
        },
        {
          name: "National & School Leaderboards",
          path: "/leaderboard",
          description: "Podium, daily rankings, level toggle and context filters.",
          badge: "New",
          badgeBg: "bg-[#B6FF00]",
        },
      ],
    },
    {
      title: "Student Portal",
      icon: "🎓",
      routes: [
        {
          name: "Dashboard Home",
          path: "/dashboard",
          description: "Student overview: streak, quick actions, subjects & regional updates.",
          badge: "New",
          badgeBg: "bg-[#B6FF00]",
        },
        {
          name: "AI Quiz Generator",
          path: "/dashboard/quiz-generator",
          description: "Interactive dynamically generated MCQ quizzes using student profile vector data.",
          badge: "AI",
          badgeBg: "bg-[#FFB040]",
        },
        {
          name: "Progress Tracker",
          path: "/dashboard/progress",
          description: "Visual charts detailing lesson completions.",
          badge: "Portal",
          badgeBg: "bg-blue-300",
        },
        {
          name: "Profile Settings",
          path: "/dashboard/profile",
          description: "Personal settings (name, region, school, 2FA) with checklist indicator.",
          badge: "New",
          badgeBg: "bg-[#B6FF00]",
        },
      ],
    },
    {
      title: "API Endpoints (Testing)",
      icon: "⚡",
      routes: [
        {
          name: "Course API",
          path: "/api/courses",
          description: "Returns lists of courses in JSON structure.",
          badge: "API",
          badgeBg: "bg-purple-300",
        },
        {
          name: "Progress API",
          path: "/api/progress",
          description: "Retrieves student activity and lesson stats.",
          badge: "API",
          badgeBg: "bg-purple-300",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7EC] text-black antialiased font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Title */}
        <header className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🗺️</span>
            <span className="text-xs font-black uppercase tracking-widest bg-[#B6FF00] border-[2.5px] border-black rounded-full px-3.5 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Developer Directory
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none text-[#1A1A1A]">
            Ticha AI Sitemap
          </h1>
          <p className="text-base md:text-lg text-stone-600 font-medium max-w-2xl">
            Quickly navigate between static screens, preview authenticated flows, or test dynamic course rendering modules.
          </p>
        </header>

        {/* Dynamic Route Constructor Card */}
        <section className="bg-white border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚙️</span>
            <h2 className="text-lg font-black uppercase tracking-tight">
              Test Dynamic Segments
            </h2>
          </div>
          <p className="text-sm text-stone-600 font-medium">
            Customize values below to update the links in the course catalog directory below:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-extrabold uppercase tracking-widest text-stone-700">
                Course ID
              </label>
              <input
                type="text"
                value={testCourseId}
                onChange={(e) => setTestCourseId(e.target.value)}
                className="bg-white border-[2.5px] border-black rounded-lg p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#B6FF00]"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-extrabold uppercase tracking-widest text-stone-700">
                Lesson ID
              </label>
              <input
                type="text"
                value={testLessonId}
                onChange={(e) => setTestLessonId(e.target.value)}
                className="bg-white border-[2.5px] border-black rounded-lg p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#B6FF00]"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-extrabold uppercase tracking-widest text-stone-700">
                Quiz ID
              </label>
              <input
                type="text"
                value={testQuizId}
                onChange={(e) => setTestQuizId(e.target.value)}
                className="bg-white border-[2.5px] border-black rounded-lg p-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#B6FF00]"
              />
            </div>
          </div>
        </section>

        {/* Sitemap Content Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Static Route Sections */}
          {sections.map((section) => (
            <section
              key={section.title}
              className="bg-white border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b-[3px] border-black">
                  <span className="text-2xl">{section.icon}</span>
                  <h2 className="text-lg font-black uppercase tracking-tight">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  {section.routes.map((route) => (
                    <div
                      key={route.path}
                      className="group flex flex-col space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <Link
                          href={route.path}
                          className="font-extrabold text-[15px] hover:text-[#965A18] underline decoration-2 decoration-transparent hover:decoration-[#965A18] underline-offset-2 transition-colors flex items-center gap-1.5"
                        >
                          {route.name}
                        </Link>
                        {route.badge && (
                          <span
                            className={`text-[9px] font-black uppercase tracking-widest border-[1.5px] border-black rounded-full px-2 py-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${route.badgeBg}`}
                          >
                            {route.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 font-medium">
                        {route.description}
                      </p>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {route.path}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}

          {/* Dynamic Courses Category */}
          <section className="bg-white border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between md:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-[3px] border-black">
                <span className="text-2xl">📖</span>
                <h2 className="text-lg font-black uppercase tracking-tight">
                  Course & Assessment Directory (Dynamic Segment Paths)
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Courses Main & Detail Page */}
                <div className="space-y-4">
                  <div className="group flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <Link
                        href="/courses"
                        className="font-extrabold text-[15px] hover:text-[#965A18] underline decoration-2 decoration-transparent hover:decoration-[#965A18] underline-offset-2 transition-colors"
                      >
                        Course Catalog Browse
                      </Link>
                      <span className="text-[9px] font-black uppercase tracking-widest border-[1.5px] border-black rounded-full px-2 py-0.5 bg-stone-200 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        Static
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-medium">
                      Browse courses available in the curriculum database.
                    </p>
                    <span className="text-[10px] text-stone-400 font-mono">
                      /courses
                    </span>
                  </div>

                  <div className="group flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/courses/${testCourseId}`}
                        className="font-extrabold text-[15px] hover:text-[#965A18] underline decoration-2 decoration-transparent hover:decoration-[#965A18] underline-offset-2 transition-colors text-blue-700"
                      >
                        Course Overview
                      </Link>
                      <span className="text-[9px] font-black uppercase tracking-widest border-[1.5px] border-black rounded-full px-2 py-0.5 bg-[#B6FF00] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        Dynamic
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-medium">
                      Curriculum structures, description, and module breakdown.
                    </p>
                    <span className="text-[10px] text-stone-400 font-mono">
                      /courses/{testCourseId}
                    </span>
                  </div>
                </div>

                {/* Lesson & Quizzes Pages */}
                <div className="space-y-4">
                  <div className="group flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/courses/${testCourseId}/lessons/${testLessonId}`}
                        className="font-extrabold text-[15px] hover:text-[#965A18] underline decoration-2 decoration-transparent hover:decoration-[#965A18] underline-offset-2 transition-colors text-blue-700"
                      >
                        Lesson Player View
                      </Link>
                      <span className="text-[9px] font-black uppercase tracking-widest border-[1.5px] border-black rounded-full px-2 py-0.5 bg-[#B6FF00] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        Dynamic
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-medium">
                      Displays content module player window for reading/watching.
                    </p>
                    <span className="text-[10px] text-stone-400 font-mono">
                      /courses/{testCourseId}/lessons/{testLessonId}
                    </span>
                  </div>

                  <div className="group flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/courses/${testCourseId}/quizzes/${testQuizId}`}
                        className="font-extrabold text-[15px] hover:text-[#965A18] underline decoration-2 decoration-transparent hover:decoration-[#965A18] underline-offset-2 transition-colors text-blue-700"
                      >
                        Interactive Assessment Quiz
                      </Link>
                      <span className="text-[9px] font-black uppercase tracking-widest border-[1.5px] border-black rounded-full px-2 py-0.5 bg-[#B6FF00] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        Dynamic
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-medium">
                      Conduct interactive MCQ checks and submit results.
                    </p>
                    <span className="text-[10px] text-stone-400 font-mono">
                      /courses/{testCourseId}/quizzes/{testQuizId}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
