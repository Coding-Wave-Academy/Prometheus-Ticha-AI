"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft01Icon,
  PlayIcon,
  CheckmarkCircle02Icon,
  SparklesIcon,
  Book01Icon,
  FireIcon,
  Award01Icon,
  Wifi01Icon,
  ArrowRight01Icon,
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
  bits: string[];
  keyTakeaway: string;
  checkQuestion: string;
  options: string[];
  correctIdx: number;
  youtubeId: string;
}

export default function DailyLessonsPage() {
  const router = useRouter();
  const navItems = useNavItems();
  const { streakCount, claimDailyStreak } = useStreak();

  const [lessons, setLessons] = useState<DailyLesson[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [activeBitIdx, setActiveBitIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    setIsLoading(true);
    setCurrentIdx(0);
    setActiveBitIdx(0);
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
    setActiveBitIdx(0);
    setShowVideo(false);

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
                Bite-Sized Incremental Knowledge
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
              Generating Bite-Sized Lessons...
            </h3>
            <p className="text-xs font-bold text-stone-600">
              Madame Ticha is crafting 1-sentence knowledge bits targeting your weak subjects.
            </p>
          </div>
        ) : isFinished ? (
          <div className="bg-[#B6FF00] border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-5">
            <div className="w-16 h-16 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mx-auto">
              <Award01Icon size={36} className="text-black" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-stone-800">
                1% Better Every Day!
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tight text-black">
                Daily Habit Completed!
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
                <span>Rewatch Concept Videos (Offline)</span>
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
            {/* Progress Header */}
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
            <div className="bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 bg-[#FFB040] text-black border-[2px] border-black rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  <Book01Icon size={12} />
                  <span>{currentLesson.subject}</span>
                </span>
                <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest">
                  1% BITE-SIZED KNOWLEDGE
                </span>
              </div>

              <h2 className="text-xl font-black uppercase text-black leading-snug">
                {currentLesson.topic}
              </h2>

              {/* Incremental Step-by-Step Bite Cards */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-stone-600">
                  <span>Knowledge Bit {activeBitIdx + 1} of {currentLesson.bits.length}</span>
                  <div className="flex gap-1">
                    {currentLesson.bits.map((_, bIdx) => (
                      <span
                        key={bIdx}
                        onClick={() => setActiveBitIdx(bIdx)}
                        className={`w-2.5 h-2.5 rounded-full cursor-pointer border border-black ${
                          bIdx === activeBitIdx ? "bg-[#B6FF00]" : "bg-stone-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeBitIdx}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="bg-[#FAF7EC] border-[2.5px] border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-2 min-h-[80px] flex flex-col justify-center"
                  >
                    <p className="text-xs md:text-sm font-black text-black leading-relaxed">
                      {formatAIText(currentLesson.bits[activeBitIdx] || currentLesson.bits[0])}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setActiveBitIdx((prev) => Math.max(0, prev - 1))}
                    disabled={activeBitIdx === 0}
                    className="text-xs font-black uppercase underline text-stone-600 disabled:opacity-30"
                  >
                    ← Previous Bit
                  </button>
                  <button
                    onClick={() =>
                      setActiveBitIdx((prev) => Math.min(currentLesson.bits.length - 1, prev + 1))
                    }
                    disabled={activeBitIdx === currentLesson.bits.length - 1}
                    className="text-xs font-black uppercase underline text-black disabled:opacity-30 flex items-center gap-1"
                  >
                    <span>Next Bit</span>
                    <ArrowRight01Icon size={14} />
                  </button>
                </div>
              </div>

              {/* YouTube Concept Video Box */}
              <div className="mt-2 bg-[#FAF7EC] border-[2.5px] border-black rounded-xl p-3.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-800 flex items-center gap-1">
                    <SparklesIcon size={14} className="text-amber-600" />
                    Concept Explainer Video
                  </span>
                  <span className="text-[9px] font-black bg-white px-2 py-0.5 border border-black rounded flex items-center gap-1">
                    <Wifi01Icon size={10} className="text-green-600" />
                    Offline Ready
                  </span>
                </div>

                {!showVideo ? (
                  <button
                    onClick={() => setShowVideo(true)}
                    className="w-full py-3 bg-white hover:bg-stone-50 border-[2px] border-black rounded-lg font-black text-xs uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    <PlayIcon size={16} className="text-black fill-current" />
                    <span>Watch 2D YouTube Explainer</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="aspect-video w-full bg-black border-[2px] border-black rounded-lg overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${currentLesson.youtubeId}?autoplay=1&rel=0`}
                        title={currentLesson.topic}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                    <a
                      href={`https://www.youtube.com/watch?v=${currentLesson.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#FFB040] hover:bg-[#ffa326] border-[2px] border-black rounded-lg py-1.5 px-3 text-[10px] font-black uppercase text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none flex items-center justify-center gap-1 transition-all"
                    >
                      <span>Watch directly on YouTube ↗</span>
                    </a>
                  </div>
                )}
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
                {formatAIText(currentLesson.checkQuestion)}
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
                      <span>{formatAIText(opt)}</span>
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
