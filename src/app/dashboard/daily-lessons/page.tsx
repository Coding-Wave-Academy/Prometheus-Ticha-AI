"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft01Icon,
  PlayIcon,
  PauseIcon,
  CheckmarkCircle02Icon,
  SparklesIcon,
  Book01Icon,
  FireIcon,
  Award01Icon,
} from "hugeicons-react";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";
import { useStreak } from "@/hooks/useStreak";
import { hapticSuccess, hapticTap } from "@/lib/haptics";
import { fireSideCannons } from "@/lib/confetti";
import { formatAIText } from "@/lib/formatAIText";

interface DailyLesson {
  id: string;
  subject: string;
  topic: string;
  explanation: string;
  keyTakeaway: string;
  checkQuestion: string;
  options: string[];
  correctIdx: number;
}

export default function DailyLessonsPage() {
  const router = useRouter();
  const navItems = useNavItems();
  const { streakCount, claimDailyStreak } = useStreak();

  const [lessons, setLessons] = useState<DailyLesson[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    setIsLoading(true);
    setCurrentIdx(0);
    setCompletedCount(0);
    setIsFinished(false);
    setSelectedOpt(null);
    setIsAnswered(false);

    try {
      let struggles = ["Physics", "Pure Mathematics", "ICT"];
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("ticha_onboarding_struggles");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) struggles = parsed;
          } catch {
            // ignore
          }
        }
      }

      const res = await fetch("/api/ai/daily-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ struggles, education: "al" }),
      });

      if (!res.ok) throw new Error("Lesson fetch failed");
      const data = await res.json();
      setLessons(data.lessons || []);
    } catch (err) {
      console.error("Failed to load daily lessons:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    hapticTap();
    setSelectedOpt(idx);
  };

  const handleSubmitAnswer = async () => {
    if (selectedOpt === null || isAnswered) return;
    setIsAnswered(true);

    const currentLesson = lessons[currentIdx];
    const isCorrect = selectedOpt === currentLesson.correctIdx;

    if (isCorrect) {
      hapticSuccess();
      fireSideCannons();

      // Increment progress for this subject in localStorage
      if (typeof window !== "undefined" && currentLesson?.subject) {
        const subjectKey = `ticha_progress_${currentLesson.subject.toLowerCase()}`;
        const currentProgress = Number(localStorage.getItem(subjectKey) || 0);
        const newProgress = Math.min(100, currentProgress + 25);
        localStorage.setItem(subjectKey, String(newProgress));
      }

      // Auto claim daily streak on first lesson complete
      await claimDailyStreak();
      setCompletedCount((c) => c + 1);
    }
  };

  const handleNextLesson = () => {
    setSelectedOpt(null);
    setIsAnswered(false);
    setIsPlayingVideo(false);

    if (currentIdx + 1 < lessons.length) {
      setCurrentIdx((i) => i + 1);
    } else {
      setIsFinished(true);
      fireSideCannons();
    }
  };

  const currentLesson = lessons[currentIdx];

  return (
    <div className="min-h-screen bg-[#FAF7EC] pb-28 text-black antialiased font-sans selection:bg-[#B6FF00]">
      <main className="w-full max-w-md mx-auto p-4 pt-6 flex flex-col space-y-5 animate-page-in text-left">
        {/* Header */}
        <header className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="w-10 h-10 bg-white border-[2.5px] border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center transition-transform"
              aria-label="Back to dashboard"
            >
              <ArrowLeft01Icon className="w-5 h-5 text-black" />
            </Link>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A]">
                1% Daily Habit
              </h1>
              <p className="text-xs font-bold text-stone-600">
                Turn Weaknesses into Strengths
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#B6FF00] border-[2.5px] border-black rounded-full px-3 py-1 text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <FireIcon size={16} className="text-orange-600 animate-pulse" />
            <span>{streakCount} STREAK</span>
          </div>
        </header>

        {/* Main Content Area */}
        {isLoading ? (
          <div className="bg-white border-[3.5px] border-black rounded-2xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-4">
            <div className="w-12 h-12 border-[4px] border-black border-t-[#B6FF00] rounded-full animate-spin mx-auto" />
            <h3 className="font-black text-base uppercase text-black">
              Generating Your 1% Daily Lessons...
            </h3>
            <p className="text-xs font-bold text-stone-600">
              Madame Ticha is preparing micro-concepts targeting your weak subjects.
            </p>
          </div>
        ) : isFinished ? (
          <div className="bg-[#B6FF00] border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-5">
            <div className="w-16 h-16 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mx-auto">
              <Award01Icon size={36} className="text-black" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-stone-800">
                1% Better Today!
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tight text-black">
                Daily Lessons Complete!
              </h2>
              <p className="text-xs font-extrabold text-stone-900 max-w-xs mx-auto pt-1">
                You completed {completedCount} micro-lesson{completedCount > 1 ? "s" : ""} today. Your streak has climbed to {streakCount}!
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => router.push("/dashboard/videos")}
                className="w-full bg-white hover:bg-stone-50 border-[3px] border-black rounded-xl py-3.5 px-4 font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-black flex items-center justify-center gap-2"
              >
                <PlayIcon size={16} className="text-black fill-current" />
                <span>Watch Explainer Videos</span>
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="w-full bg-[#FFB040] hover:bg-[#ffa326] border-[3px] border-black rounded-xl py-3.5 px-4 font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-black"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Progress Bar */}
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black uppercase tracking-wider text-stone-700">
                Lesson {currentIdx + 1} of {lessons.length}
              </span>
              <div className="h-3 w-32 bg-stone-200 border-[2px] border-black rounded-full overflow-hidden shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                <div
                  className="h-full bg-[#B6FF00] transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / lessons.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Lesson Subject & Topic Card */}
            <div className="bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 bg-[#FFB040] text-black border-[2px] border-black rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  <Book01Icon size={12} />
                  <span>{currentLesson.subject}</span>
                </span>
                <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest">
                  1% DAILY MICRO-LESSON
                </span>
              </div>

              <h2 className="text-xl font-black uppercase text-black leading-snug">
                {currentLesson.topic}
              </h2>

              {/* Clean Plain-Text Explanation */}
              <p className="text-xs md:text-sm font-bold text-stone-800 leading-relaxed pt-1">
                {formatAIText(currentLesson.explanation)}
              </p>

              {/* 2D Explainer Video Player Box */}
              <div className="mt-3 bg-[#FAF7EC] border-[2.5px] border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-700 flex items-center gap-1">
                    <SparklesIcon size={14} className="text-amber-600" />
                    Gemini 2D Animated Concept Video
                  </span>
                  <span className="text-[9px] font-bold bg-white px-2 py-0.5 border border-black rounded">
                    0:15 HD
                  </span>
                </div>

                <div className="relative aspect-video w-full bg-stone-900 border-[2px] border-black rounded-lg flex flex-col items-center justify-center text-white p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group">
                  {isPlayingVideo ? (
                    <div className="w-full h-full flex flex-col items-center justify-center space-y-2 animate-pulse">
                      <div className="w-10 h-10 border-[3px] border-[#B6FF00] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-black uppercase tracking-wider text-[#B6FF00]">
                        Playing 2D Explainer...
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-[#B6FF00] border-[2.5px] border-black rounded-full flex items-center justify-center text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:scale-105 transition-transform cursor-pointer"
                        onClick={() => setIsPlayingVideo(true)}
                      >
                        <PlayIcon size={28} className="fill-current ml-1" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-stone-200 mt-2">
                        Tap to Watch 2D Visualizer
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Key Takeaway Box */}
              <div className="bg-[#B6FF00] border-[2px] border-black rounded-xl p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-800 block">
                  💡 Key Exam Takeaway
                </span>
                <p className="text-xs font-black text-black leading-snug">
                  {formatAIText(currentLesson.keyTakeaway)}
                </p>
              </div>
            </div>

            {/* Quick Check Question Card */}
            <div className="bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-600 block">
                ⚡ Quick Concept Check
              </span>
              <p className="text-sm font-black text-black leading-snug">
                {currentLesson.checkQuestion}
              </p>

              <div className="space-y-2.5 pt-1">
                {currentLesson.options.map((opt, oIdx) => {
                  const isSelected = selectedOpt === oIdx;
                  const isCorrect = oIdx === currentLesson.correctIdx;

                  let style = "bg-white border-black hover:bg-stone-50";
                  if (isSelected) style = "bg-[#D3E2FF] border-black";
                  if (isAnswered) {
                    if (isCorrect) {
                      style = "bg-[#B6FF00] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
                    } else if (isSelected) {
                      style = "bg-[#FF9494] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
                    } else {
                      style = "bg-white border-stone-300 text-stone-400";
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleOptionSelect(oIdx)}
                      disabled={isAnswered}
                      className={`w-full p-3.5 rounded-xl border-[2.5px] text-left font-bold text-xs flex items-center justify-between shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all ${style}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && isCorrect && (
                        <CheckmarkCircle02Icon size={18} className="text-black shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                {!isAnswered ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOpt === null}
                    className={`w-full border-[3.5px] border-black rounded-xl py-3.5 font-black uppercase text-xs tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                      selectedOpt !== null
                        ? "bg-[#B6FF00] hover:bg-[#a3e600] text-black active:translate-x-px active:translate-y-px active:shadow-none"
                        : "bg-[#E8E6DA] text-stone-400 cursor-not-allowed shadow-none border-stone-400"
                    }`}
                  >
                    Check Answer & Complete Lesson
                  </button>
                ) : (
                  <button
                    onClick={handleNextLesson}
                    className="w-full bg-[#FFB040] hover:bg-[#ffa326] border-[3.5px] border-black rounded-xl py-3.5 font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none text-black"
                  >
                    {currentIdx + 1 < lessons.length ? "Next Daily Lesson ➔" : "Complete 1% Habit 🎉"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav items={navItems} />
    </div>
  );
}
