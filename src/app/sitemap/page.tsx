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
  icon: React.ReactNode;
  routes: RouteItem[];
}

export default function SitemapPage() {
  const [testCourseId, setTestCourseId] = useState("calculus-101");
  const [testLessonId, setTestLessonId] = useState("limits-and-derivatives");
  const [testQuizId, setTestQuizId] = useState("midterm-quiz");

  const sections: RouteSection[] = [
    {
      title: "Onboarding & Auth Flow",
      icon: (
        <svg className="w-5 h-5 fill-current text-black" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
        </svg>
      ),
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
          description: "Choose primary educational motivation.",
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
          description: "Bespoke subject insights preview.",
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
      icon: (
        <svg className="w-5 h-5 fill-current text-black" viewBox="0 0 24 24">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
        </svg>
      ),
      routes: [
        {
          name: "Explore Hub",
          path: "/explore",
          description: "Core learning, practice tools, and social rankings.",
          badge: "New",
          badgeBg: "bg-[#B6FF00]",
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
      icon: (
        <svg className="w-5 h-5 fill-current text-black" viewBox="0 0 24 24">
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
        </svg>
      ),
      routes: [
        {
          name: "Dashboard Home",
          path: "/dashboard",
          description: "Student overview: streak, quick actions, subjects & regional updates.",
          badge: "New",
          badgeBg: "bg-[#B6FF00]",
        },
        {
          name: "Daily Quiz (Paper 1 Exam)",
          path: "/dashboard/daily-quiz",
          description: "GCE Paper 1 Exam environment connected to daily lesson topics.",
          badge: "Exam",
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
          name: "Screen Coming Soon",
          path: "/coming-soon",
          description: "Screen for unreleased features with notification form.",
          badge: "New",
          badgeBg: "bg-[#B6FF00]",
        },
        {
          name: "Profile Settings",
          path: "/dashboard/profile",
          description: "Personal settings with checklist indicator.",
          badge: "New",
          badgeBg: "bg-[#B6FF00]",
        },
      ],
    },
    {
      title: "API Endpoints (Testing)",
      icon: (
        <svg className="w-5 h-5 fill-current text-black" viewBox="0 0 24 24">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
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
            <svg className="w-6 h-6 fill-current text-black" viewBox="0 0 24 24">
              <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
            </svg>
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
            <svg className="w-5 h-5 fill-current text-black" viewBox="0 0 24 24">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
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
          
          {sections.map((section) => (
            <section
              key={section.title}
              className="bg-white border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b-[3px] border-black">
                  {section.icon}
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
                <svg className="w-5 h-5 fill-current text-black" viewBox="0 0 24 24">
                  <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
                </svg>
                <h2 className="text-lg font-black uppercase tracking-tight">
                  Course & Assessment Directory (Dynamic Segment Paths)
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
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
