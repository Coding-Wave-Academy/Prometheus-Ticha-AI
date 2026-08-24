"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft01Icon,
  PlayIcon,
  CheckmarkCircle02Icon,
  SparklesIcon,
  Book01Icon,
  FireIcon,
  Award01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  Target02Icon,
  File01Icon,
  AlertCircleIcon,
  StarIcon,
} from "hugeicons-react";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";
import { useStreak } from "@/hooks/useStreak";
import { hapticSuccess, hapticTap } from "@/lib/haptics";
import { fireSideCannons } from "@/lib/confetti";
import { formatAIText } from "@/lib/formatAIText";
import { normalizeSubjectName } from "@/lib/videoCatalog";

/* ── Types ────────────────────────────────────────────────────────────── */
interface QuizQuestion {
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

interface DailyLessonV2 {
  id: string;
  subject: string;
  topic: string;
  youtubeId: string;
  youtubeTitle: string;
  youtubeChannel: string;
  youtubeSearchUrl?: string;
  tips: string[];
  keyTakeaway: string;
  quizQuestions: QuizQuestion[];
  pastPaperHint: string;
}

type LessonStep = "video" | "tips" | "quiz" | "complete";

/* ── Affirmation messages (icons only, no emoji) ──────────────────────── */
const affirmations = [
  { icon: "star", title: "You Are Amazing!", message: "Every concept you learn makes you stronger. Champions are built one lesson at a time." },
  { icon: "fire", title: "Unstoppable!", message: "You showed up today when others didn't. That's what separates winners from the rest." },
  { icon: "award", title: "Keep Pushing!", message: "Your brain just grew a little bigger. Knowledge compounds like interest." },
  { icon: "target", title: "Future Graduate!", message: "Every GCE question you master today is one less to fear on exam day." },
  { icon: "sparkle", title: "Rising Star!", message: "You're building momentum. Small daily wins create massive results." },
  { icon: "check", title: "Locked In!", message: "Focus like this is rare. You're on the path to excellence." },
  { icon: "book", title: "Brain Power!", message: "That concept you just learned? It connects to so many exam questions. You're ready." },
  { icon: "star", title: "Brilliant Work!", message: "Consistency beats talent every single time. And you're being consistent." },
];

function AffirmationIcon({ name, size = 40 }: { name: string; size?: number }) {
  const cls = `text-black`;
  switch (name) {
    case "fire": return <FireIcon size={size} className={cls} />;
    case "award": return <Award01Icon size={size} className={cls} />;
    case "target": return <Target02Icon size={size} className={cls} />;
    case "sparkle": return <SparklesIcon size={size} className={cls} />;
    case "check": return <CheckmarkCircle02Icon size={size} className={cls} />;
    case "book": return <Book01Icon size={size} className={cls} />;
    default: return <StarIcon size={size} className={cls} />;
  }
}

/* ── Subject color map ────────────────────────────────────────────────── */
const subjectColors: Record<string, string> = {
  Physics: "#FFB040",
  "Pure Mathematics": "#B6FF00",
  "Further Mathematics": "#D3E2FF",
  ICT: "#FFDF9E",
  Chemistry: "#FFD9E0",
  Biology: "#C8F7C5",
  "English Language": "#E2D3FF",
  "French Language": "#A8FFD3",
};

export default function DailyLessonsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center">
          <div className="w-10 h-10 border-[3.5px] border-black border-t-[#B6FF00] rounded-full animate-spin" />
        </div>
      }
    >
      <DailyLessonsContent />
    </React.Suspense>
  );
}

function DailyLessonsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const navItems = useNavItems();
  const { streakCount, claimDailyStreak } = useStreak();

  const [lesson, setLesson] = useState<DailyLessonV2 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState<LessonStep>("video");
  const [videoError, setVideoError] = useState(false);

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  // Affirmation popup
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [affirmation, setAffirmation] = useState(affirmations[0]);

  const fetchLesson = useCallback(async (targetSub?: string, targetTop?: string) => {
    setIsLoading(true);
    setStep("video");
    setVideoError(false);
    setQuizIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setCorrectCount(0);

    try {
      let struggles = ["Physics", "Pure Mathematics", "ICT"];
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("ticha_onboarding_struggles");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) struggles = parsed;
          } catch { /* ignore */ }
        }
      }

      const payload: Record<string, unknown> = { struggles, education: "al" };
      if (targetSub) payload.subject = targetSub;
      if (targetTop) payload.topic = targetTop;

      const res = await fetch("/api/ai/daily-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Lesson fetch failed");
      const data = await res.json();
      const loadedLesson: DailyLessonV2 = data.lesson || null;
      setLesson(loadedLesson);

      if (loadedLesson && typeof window !== "undefined") {
        localStorage.setItem(
          "ticha_today_lesson_topic",
          JSON.stringify({ subject: loadedLesson.subject, topic: loadedLesson.topic })
        );
      }
    } catch (err) {
      console.error("Failed to load daily lesson:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle initial load or search param changes
  useEffect(() => {
    const urlSubject = searchParams.get("subject");
    const urlTopic = searchParams.get("topic");

    if (urlSubject) {
      const norm = normalizeSubjectName(urlSubject);
      fetchLesson(norm, urlTopic || undefined);
    } else {
      fetchLesson();
    }
  }, [searchParams, fetchLesson]);

  const handleVideoWatched = () => {
    hapticTap();
    setStep("tips");

    if (typeof window !== "undefined" && lesson) {
      try {
        const stored = localStorage.getItem("ticha_watched_videos");
        const list: Record<string, unknown>[] = stored ? JSON.parse(stored) : [];
        const videoEntry = {
          id: lesson.id,
          subject: lesson.subject,
          topic: lesson.topic,
          youtubeId: lesson.youtubeId,
          channelTitle: lesson.youtubeChannel || "YouTube GCE",
          watchedAt: new Date().toISOString(),
          summary: lesson.keyTakeaway || `Concept video for ${lesson.topic}`,
        };
        const updated = [videoEntry, ...list.filter((v) => v.youtubeId !== lesson.youtubeId)];
        localStorage.setItem("ticha_watched_videos", JSON.stringify(updated));
      } catch { /* ignore */ }
    }
  };

  const handleTipsComplete = () => {
    hapticTap();
    setStep("quiz");
  };

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    hapticTap();
    setSelectedOpt(idx);
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedOpt === null || isAnswered || !lesson) return;
    setIsAnswered(true);

    const currentQ = lesson.quizQuestions[quizIdx];
    if (selectedOpt === currentQ.correctIdx) {
      hapticSuccess();
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNextQuizQuestion = async () => {
    if (!lesson) return;

    if (quizIdx + 1 < lesson.quizQuestions.length) {
      setQuizIdx((i) => i + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      await claimDailyStreak();

      if (typeof window !== "undefined" && lesson.subject) {
        const subjectKey = `ticha_progress_${lesson.subject.toLowerCase()}`;
        const currentProgress = Number(localStorage.getItem(subjectKey) || 0);
        const newProgress = Math.min(100, currentProgress + 25);
        localStorage.setItem(subjectKey, String(newProgress));
      }

      const randomAff = affirmations[Math.floor(Math.random() * affirmations.length)];
      setAffirmation(randomAff);
      setShowAffirmation(true);

      fireSideCannons();
      hapticSuccess();
    }
  };

  const handleAffirmationClose = () => {
    setShowAffirmation(false);
    setStep("complete");
  };

  const accentColor = lesson ? (subjectColors[lesson.subject] || "#FFB040") : "#FFB040";

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
                Today&apos;s Lesson
              </h1>
              <p className="text-xs font-bold text-stone-600">
                {lesson ? `${lesson.subject}` : "Loading..."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#B6FF00] border-[2.5px] border-black rounded-full px-3 py-1 text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <FireIcon size={16} className="text-orange-600 animate-pulse" />
            <span>{streakCount} STREAK</span>
          </div>
        </header>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white border-[3.5px] border-black rounded-2xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-4">
            <div className="w-12 h-12 border-[4px] border-black border-t-[#B6FF00] rounded-full animate-spin mx-auto" />
            <h3 className="font-black text-base uppercase text-black">
              Preparing Your Lesson...
            </h3>
            <p className="text-xs font-bold text-stone-600">
              Selecting the best video, exam tips, and practice questions.
            </p>
          </div>
        )}

        {/* Error / Empty State */}
        {!isLoading && !lesson && (
          <div className="bg-white border-[3.5px] border-black rounded-2xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-4">
            <AlertCircleIcon size={36} className="text-black mx-auto" />
            <h3 className="font-black text-base uppercase">No Lesson Available</h3>
            <button
              onClick={() => fetchLesson()}
              className="bg-[#B6FF00] border-[3px] border-black rounded-xl px-6 py-3 font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* Lesson Content */}
        {!isLoading && lesson && (
          <>
            {/* Step Progress Indicator */}
            <div className="flex items-center gap-2 px-1">
              {(["video", "tips", "quiz"] as LessonStep[]).map((s, i) => {
                const labels = ["Watch Video", "Key Insights", "Test Knowledge"];
                const stepOrder = ["video", "tips", "quiz"];
                const currentStepIdx = stepOrder.indexOf(step);
                const isDone = i < currentStepIdx || step === "complete";
                const isActive = s === step;

                return (
                  <div key={s} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`h-2 w-full rounded-full border border-black ${isDone ? "bg-[#B6FF00]" : isActive ? "bg-[#FFB040]" : "bg-stone-200"}`} />
                    <span className={`text-[9px] font-black uppercase tracking-wider ${isActive ? "text-black" : "text-stone-400"}`}>
                      {labels[i]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Subject & Topic Title Card */}
            <div className="flex items-center gap-2 bg-white border-[3px] border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 text-black border-[2px] border-black rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Book01Icon size={12} />
                    <span>{lesson.subject}</span>
                  </span>
                  <span className="text-[10px] font-extrabold uppercase text-stone-500">
                    Syllabus Topic
                  </span>
                </div>
                <h2 className="text-base font-black text-black leading-tight">
                  {lesson.topic}
                </h2>
              </div>
            </div>

            {/* ──── STEP 1: VIDEO ──── */}
            {step === "video" && (
              <AnimatePresence mode="wait">
                <motion.div
                  key="video-step"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-4"
                >
                  <div className="bg-white border-[3.5px] border-black rounded-2xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-stone-700 flex items-center gap-1">
                        <SparklesIcon size={14} className="text-amber-600" />
                        Concept Video
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-black leading-snug">
                      {lesson.youtubeTitle}
                    </h3>
                    <p className="text-[10px] font-bold text-stone-500">
                      Channel: {lesson.youtubeChannel}
                    </p>

                    {/* Embedded YouTube Player */}
                    {!videoError ? (
                      <div className="aspect-video w-full bg-black border-[2.5px] border-black rounded-xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${lesson.youtubeId}?rel=0`}
                          title={lesson.youtubeTitle}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                          onError={() => setVideoError(true)}
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-stone-100 border-[2.5px] border-black rounded-xl flex flex-col items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-4 space-y-3">
                        <AlertCircleIcon size={32} className="text-stone-400" />
                        <p className="text-xs font-bold text-stone-600 text-center">
                          Video unavailable. Watch it directly on YouTube instead.
                        </p>
                        {lesson.youtubeSearchUrl && (
                          <a
                            href={lesson.youtubeSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#FF0000] text-white border-[2.5px] border-black rounded-xl px-4 py-2 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none flex items-center gap-2"
                          >
                            <PlayIcon size={14} className="fill-current" />
                            <span>Search on YouTube</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Mark as Watched CTA */}
                  <button
                    onClick={handleVideoWatched}
                    className="w-full bg-[#B6FF00] border-[3.5px] border-black rounded-xl py-3.5 font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-black flex items-center justify-center gap-2"
                  >
                    <CheckmarkCircle02Icon size={18} />
                    <span>I&apos;ve Watched This</span>
                  </button>
                </motion.div>
              </AnimatePresence>
            )}

            {/* ──── STEP 2: TIPS & TAKEAWAYS ──── */}
            {step === "tips" && (
              <AnimatePresence mode="wait">
                <motion.div
                  key="tips-step"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-4"
                >
                  <div className="bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-600 flex items-center gap-1">
                      <SparklesIcon size={14} className="text-amber-500" />
                      Study Tips from Madame Ticha
                    </span>

                    <div className="space-y-3">
                      {lesson.tips.map((tip, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.15 }}
                          className="flex items-start gap-3 bg-[#FAF7EC] border-[2px] border-black rounded-xl p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <span
                            className="w-7 h-7 flex items-center justify-center border-[2px] border-black rounded-lg font-black text-xs text-black shrink-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                            style={{ backgroundColor: accentColor }}
                          >
                            {i + 1}
                          </span>
                          <p className="text-xs font-bold text-black leading-relaxed flex-1">
                            {formatAIText(tip)}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Key Takeaway */}
                  <div
                    className="border-[3px] border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-1"
                    style={{ backgroundColor: accentColor }}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-800 flex items-center gap-1">
                      <SparklesIcon size={12} className="text-stone-800" />
                      Core Exam Takeaway
                    </span>
                    <p className="text-sm font-black text-black leading-snug">
                      {formatAIText(lesson.keyTakeaway)}
                    </p>
                  </div>

                  {/* Continue to Quiz CTA */}
                  <button
                    onClick={handleTipsComplete}
                    className="w-full bg-[#FFB040] border-[3.5px] border-black rounded-xl py-3.5 font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-black flex items-center justify-center gap-2"
                  >
                    <Target02Icon size={18} />
                    <span>Test My Knowledge (3 Questions)</span>
                  </button>
                </motion.div>
              </AnimatePresence>
            )}

            {/* ──── STEP 3: QUIZ ──── */}
            {step === "quiz" && lesson.quizQuestions.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`quiz-${quizIdx}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-4"
                >
                  <div className="bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-stone-600">
                        Question {quizIdx + 1} of {lesson.quizQuestions.length}
                      </span>
                      <span className="text-[10px] font-black text-green-700">
                        {correctCount} correct
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {lesson.quizQuestions.map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full border border-black ${i < quizIdx ? "bg-[#B6FF00]" : i === quizIdx ? "bg-[#FFB040]" : "bg-stone-200"}`}
                        />
                      ))}
                    </div>

                    <p className="text-sm font-black text-black leading-snug">
                      {formatAIText(lesson.quizQuestions[quizIdx].question)}
                    </p>

                    <div className="space-y-2.5">
                      {lesson.quizQuestions[quizIdx].options.map((opt, oIdx) => {
                        const currentQ = lesson.quizQuestions[quizIdx];
                        const isSelected = selectedOpt === oIdx;
                        const isCorrect = oIdx === currentQ.correctIdx;

                        let style = "bg-white border-black hover:bg-stone-50";
                        if (isSelected && !isAnswered) style = "bg-[#D3E2FF] border-black";
                        if (isAnswered) {
                          if (isCorrect) style = "bg-[#B6FF00] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
                          else if (isSelected) style = "bg-[#FF9494] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
                          else style = "bg-white border-stone-300 text-stone-400";
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleOptionSelect(oIdx)}
                            disabled={isAnswered}
                            className={`w-full p-3.5 rounded-xl border-[2.5px] text-left font-bold text-xs flex items-center justify-between shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all ${style}`}
                          >
                            <span>{formatAIText(opt)}</span>
                            {isAnswered && isCorrect && <CheckmarkCircle02Icon size={18} className="text-black shrink-0" />}
                            {isAnswered && isSelected && !isCorrect && <Cancel01Icon size={18} className="text-red-800 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-[#FAF7EC] border-[2px] border-black rounded-xl p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-700 flex items-center gap-1 mb-1">
                          <Book01Icon size={12} className="text-stone-700" />
                          Explanation
                        </span>
                        <p className="text-xs font-bold text-black leading-relaxed">
                          {formatAIText(lesson.quizQuestions[quizIdx].explanation)}
                        </p>
                      </motion.div>
                    )}

                    <div className="pt-1">
                      {!isAnswered ? (
                        <button
                          onClick={handleSubmitQuizAnswer}
                          disabled={selectedOpt === null}
                          className={`w-full border-[3.5px] border-black rounded-xl py-3.5 font-black uppercase text-xs tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                            selectedOpt !== null
                              ? "bg-[#B6FF00] text-black active:translate-x-px active:translate-y-px active:shadow-none"
                              : "bg-[#E8E6DA] text-stone-400 cursor-not-allowed shadow-none border-stone-400"
                          }`}
                        >
                          Check Answer
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuizQuestion}
                          className="w-full bg-[#FFB040] border-[3.5px] border-black rounded-xl py-3.5 font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none text-black flex items-center justify-center gap-2"
                        >
                          <span>
                            {quizIdx + 1 < lesson.quizQuestions.length
                              ? `Next Question (${quizIdx + 2}/${lesson.quizQuestions.length})`
                              : "Complete Lesson"}
                          </span>
                          <ArrowRight01Icon size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* ──── STEP 4: COMPLETE ──── */}
            {step === "complete" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div
                  className="border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-4"
                  style={{ backgroundColor: accentColor }}
                >
                  <div className="w-16 h-16 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mx-auto">
                    <Award01Icon size={36} className="text-black" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-black uppercase tracking-widest text-stone-800">
                      1% Better Every Day
                    </span>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                      Lesson Complete
                    </h2>
                    <p className="text-xs font-extrabold text-stone-900 max-w-xs mx-auto pt-1">
                      You scored {correctCount}/{lesson.quizQuestions.length} on {lesson.topic}. Your streak is now {streakCount}.
                    </p>
                  </div>
                </div>

                {/* Past Paper Encouragement */}
                <div className="bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-3">
                  <div className="flex items-center gap-2">
                    <File01Icon size={18} className="text-[#965A18]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-700">
                      Past Paper Challenge
                    </span>
                  </div>
                  <p className="text-xs font-bold text-black leading-relaxed">
                    {formatAIText(lesson.pastPaperHint)}
                  </p>
                  <p className="text-[11px] font-bold text-stone-600 leading-relaxed">
                    Tackling real exam questions on <strong>{lesson.topic}</strong> will cement what you just learned. Open your past papers and find questions on this topic.
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => router.push(`/dashboard/daily-quiz?subject=${encodeURIComponent(lesson.subject)}&topic=${encodeURIComponent(lesson.topic)}`)}
                    className="w-full bg-[#B6FF00] border-[3px] border-black rounded-xl py-3.5 px-4 font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-black flex items-center justify-center gap-2"
                  >
                    <Target02Icon size={18} className="text-black" />
                    <span>Take 15-Question Exam Quiz</span>
                  </button>

                  <button
                    onClick={() => router.push("/dashboard/flashcards")}
                    className="w-full bg-white border-[3px] border-black rounded-xl py-3.5 px-4 font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-black flex items-center justify-center gap-2"
                  >
                    <SparklesIcon size={18} className="text-black" />
                    <span>Practice Topic Flashcards</span>
                  </button>

                  <button
                    onClick={() => router.push("/dashboard/videos")}
                    className="w-full bg-white border-[3px] border-black rounded-xl py-3.5 px-4 font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-black flex items-center justify-center gap-2"
                  >
                    <PlayIcon size={16} className="text-black fill-current" />
                    <span>Watch More Concept Videos</span>
                  </button>

                  <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full bg-[#FFB040] border-[3px] border-black rounded-xl py-3.5 px-4 font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-black"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>

      {/* ──── AFFIRMATION POPUP MODAL ──── */}
      <AnimatePresence>
        {showAffirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6"
            onClick={handleAffirmationClose}
          >
            <motion.div
              initial={{ scale: 0.7, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.7, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white border-[3.5px] border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center space-y-4"
            >
              <div className="w-20 h-20 bg-[#B6FF00] border-[3px] border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mx-auto">
                <AffirmationIcon name={affirmation.icon} size={40} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-black">
                {affirmation.title}
              </h3>
              <p className="text-sm font-bold text-stone-700 leading-relaxed max-w-xs mx-auto">
                {affirmation.message}
              </p>

              <div className="flex items-center justify-center gap-2 pt-2">
                <div className="flex items-center gap-1 bg-[#B6FF00] border-[2px] border-black rounded-full px-3 py-1 text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <FireIcon size={14} className="text-orange-600" />
                  <span>{streakCount} Day Streak</span>
                </div>
                <div className="flex items-center gap-1 bg-[#FFB040] border-[2px] border-black rounded-full px-3 py-1 text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <CheckmarkCircle02Icon size={14} />
                  <span>{correctCount}/{lesson?.quizQuestions.length || 3}</span>
                </div>
              </div>

              <button
                onClick={handleAffirmationClose}
                className="w-full bg-[#B6FF00] border-[3px] border-black rounded-xl py-3 font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-black mt-2"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav items={navItems} />
    </div>
  );
}
