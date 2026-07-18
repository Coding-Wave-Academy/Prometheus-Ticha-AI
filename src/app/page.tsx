"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);

  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Check localStorage fallback
    const profileCompleted = localStorage.getItem("ticha_profile_completed") === "true";
    if (profileCompleted) {
      setHasAccount(true);
    }

    // Check live Supabase Auth session
    import("@/lib/supabase").then(({ supabase }) => {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session?.user) {
          setHasAccount(true);
        }
        setSessionChecked(true);
      });
    });
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen bg-[#FAF7EC]" />;
  }

  return (
    <div className="min-h-screen bg-[#FAF7EC] text-black font-sans selection:bg-[#B6FF00] antialiased">
      {/* Navbar header */}
      <header className="border-b-[4px] border-black bg-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl select-none">🏫</span>
            <span className="font-black text-xl uppercase tracking-tight">
              Ticha AI
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 border-[2.5px] border-black rounded-xl font-bold text-sm bg-white hover:bg-stone-50 transition-all active:translate-x-[1px] active:translate-y-[1px]"
            >
              Log In
            </Link>
            <Link
              href={hasAccount ? "/dashboard" : "/getting-started"}
              className="px-4 py-2 border-[2.5px] border-black rounded-xl font-black text-sm bg-[#B6FF00] hover:bg-[#a3e600] shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2.5px] active:translate-y-[2.5px] active:shadow-none transition-all"
            >
              {hasAccount ? "Dashboard" : "Get Started"}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center space-y-8">
        {/* Glow Badge */}
        <div className="inline-flex items-center gap-2 bg-white border-[2.5px] border-black px-4 py-1.5 rounded-full shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-xs font-black uppercase tracking-widest text-[#965A18]">
            🇨🇲 Cameroon Curriculum Tutor
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight max-w-4xl mx-auto leading-[1.05]">
          Your Study Outline, <span className="bg-[#B6FF00] border-b-[4px] border-black px-2">Mastered</span> with AI
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg text-stone-600 font-bold max-w-2xl mx-auto leading-relaxed">
          Ticha AI personalizes your preparation for GCE Ordinary Levels, Advanced Levels, and University courses. Upload your slip, generate mock quiz attempts, and practice active recall daily.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link
            href={hasAccount ? "/dashboard" : "/register?redirect=/dashboard"}
            className="w-full sm:w-auto bg-[#FFB040] hover:bg-[#ffa326] border-[3.5px] border-black rounded-xl py-4 px-8 font-black uppercase text-base tracking-wider shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-center"
          >
            🚀 Launch Study Portal
          </Link>
          <Link
            href="/explore"
            className="w-full sm:w-auto bg-white hover:bg-stone-50 border-[3px] border-black rounded-xl py-4 px-8 font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-center"
          >
            🔍 Explore Public Tools
          </Link>
        </div>
      </section>

      {/* Curriculum Grid / Features */}
      <section className="bg-white border-t-[4px] border-b-[4px] border-black py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-black uppercase text-[#965A18] tracking-widest">
              Core Capabilities
            </span>
            <h2 className="text-3xl font-black uppercase text-black">
              Designed For High-Yield Study
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Link
              href={hasAccount ? "/explore/flashcards" : "/register?redirect=/explore/flashcards"}
              className="bg-[#FAF7EC] border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all text-left"
            >
              <div className="w-12 h-12 bg-[#B6FF00] border-[2.5px] border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-xl select-none">🧠</span>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-black">
                Active Recall Flashcards
              </h3>
              <p className="text-sm font-semibold text-stone-600 leading-snug">
                Select your target struggles, and our tutor generates custom questions that test actual Cameroonian exam guidelines.
              </p>
            </Link>

            {/* Feature 2 */}
            <Link
              href={hasAccount ? "/dashboard/progress" : "/register?redirect=/dashboard/progress"}
              className="bg-[#D3E2FF] border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all text-left"
            >
              <div className="w-12 h-12 bg-white border-[2.5px] border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-xl select-none">📊</span>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-black">
                Featured Progress Loops
              </h3>
              <p className="text-sm font-semibold text-stone-900 leading-snug">
                Track exact coverage metrics dynamically synced to Supabase database profiles. Practice quizzes to level up percentages!
              </p>
            </Link>

            {/* Feature 3 */}
            <Link
              href={hasAccount ? "/explore/materials" : "/register?redirect=/explore/materials"}
              className="bg-[#FFD9E0] border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all text-left"
            >
              <div className="w-12 h-12 bg-white border-[2.5px] border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-xl select-none">📁</span>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-black">
                Form B / Course Slip Compiler
              </h3>
              <p className="text-sm font-semibold text-stone-800 leading-snug">
                Upload your official school registration slip. Ticha AI compiles the list, writes it to Supabase, and configures course generator shortcuts instantly.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Curriculum Levels & Footer */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center space-y-6">
        <h3 className="text-xs font-black uppercase text-stone-500 tracking-widest">
          Supported Examinations
        </h3>

        <div className="flex flex-wrap gap-3 justify-center">
          {["Ordinary Level (O-Level)", "Advanced Level (A-Level)", "University Semesters", "Cameroonian Mock Exams"].map((tag) => (
            <span
              key={tag}
              className="bg-white border-[2.5px] border-black rounded-full py-1.5 px-4 font-bold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              🏷️ {tag}
            </span>
          ))}
        </div>

        <div className="h-[3px] bg-black my-8" />

        <footer className="text-xs font-bold text-stone-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Ticha AI. Build for educational excellence in Cameroon.</p>
          <div className="flex gap-4">
            <Link href="/getting-started/language" className="hover:underline">
              Language Select
            </Link>
            <Link href="/explore" className="hover:underline">
              Resources
            </Link>
          </div>
        </footer>
      </section>
    </div>
  );
}
