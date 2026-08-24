"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft01Icon,
  RotateRight01Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  SparklesIcon,
  Book01Icon,
  HelpCircleIcon,
  Award01Icon,
  RefreshIcon,
} from "hugeicons-react";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";
import { useStreak } from "@/hooks/useStreak";
import { formatAIText } from "@/lib/formatAIText";
import { hapticTap, hapticSuccess } from "@/lib/haptics";
import { fireSideCannons } from "@/lib/confetti";
import "@/lib/i18n";

interface FlashCard {
  id: string;
  front: string;
  back: string;
  hint?: string;
}

export default function FlashcardsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center">
          <div className="w-10 h-10 border-[3.5px] border-black border-t-[#B6FF00] rounded-full animate-spin" />
        </div>
      }
    >
      <FlashcardsContent />
    </Suspense>
  );
}

function FlashcardsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const navItems = useNavItems();
  const { claimDailyStreak } = useStreak();

  const [subject, setSubject] = useState("Physics");
  const [topic, setTopic] = useState("Newton's Laws of Motion");
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [masteredCount, setMasteredCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const loadTopicAndCards = useCallback(async (forcedSub?: string, forcedTop?: string) => {
    setIsLoading(true);
    setIsFinished(false);
    setCurrentIdx(0);
    setMasteredCount(0);
    setIsFlipped(false);
    setShowHint(false);

    let curSub = forcedSub || searchParams.get("subject") || "";
    let curTop = forcedTop || searchParams.get("topic") || "";
    let lessonData: Record<string, unknown> | null = null;

    if (typeof window !== "undefined") {
      // 1. Read today's lesson topic and lesson data
      const storedTopic = localStorage.getItem("ticha_today_lesson_topic");
      if (storedTopic && (!curSub || !curTop)) {
        try {
          const parsed = JSON.parse(storedTopic);
          if (!curSub && parsed.subject) curSub = parsed.subject;
          if (!curTop && parsed.topic) curTop = parsed.topic;
        } catch { /* ignore */ }
      }

      const storedLesson = localStorage.getItem("ticha_today_lesson_data");
      if (storedLesson) {
        try {
          lessonData = JSON.parse(storedLesson);
        } catch { /* ignore */ }
      }
    }

    if (!curSub) curSub = "Physics";
    if (!curTop) curTop = "Newton's Laws of Motion";

    setSubject(curSub);
    setTopic(curTop);

    // Build flashcards directly from today's daily lesson questions & tips if available
    const customLessonCards: FlashCard[] = [];
    if (lessonData && (lessonData.topic === curTop || !forcedTop)) {
      const quizQs = Array.isArray(lessonData.quizQuestions) ? lessonData.quizQuestions : [];
      quizQs.forEach((q: { question?: string; options?: string[]; correctIdx?: number; explanation?: string }, i: number) => {
        if (q && q.question) {
          const correctOption = q.options && typeof q.correctIdx === "number" ? q.options[q.correctIdx] : "";
          customLessonCards.push({
            id: `lesson-q-${i}`,
            front: q.question,
            back: correctOption ? `${correctOption}${q.explanation ? ` — ${q.explanation}` : ""}` : (q.explanation || "Correct Answer"),
            hint: `Today's Daily Lesson Question #${i + 1}`,
          });
        }
      });

      const tips = Array.isArray(lessonData.tips) ? lessonData.tips : [];
      tips.forEach((tip: string, i: number) => {
        if (tip) {
          customLessonCards.push({
            id: `lesson-tip-${i}`,
            front: `Exam Tip: How to master ${curTop}?`,
            back: tip,
            hint: `Madame Ticha Tip #${i + 1}`,
          });
        }
      });

      if (lessonData.keyTakeaway && typeof lessonData.keyTakeaway === "string") {
        customLessonCards.push({
          id: `lesson-takeaway`,
          front: `Core Exam Takeaway: ${curTop}`,
          back: lessonData.keyTakeaway,
          hint: "Key syllabus takeaway",
        });
      }
    }

    if (customLessonCards.length > 0) {
      setCards(customLessonCards);
      setIsLoading(false);
      return;
    }

    // Try loading saved deck from localStorage first for offline review
    const storageKey = `ticha_flashcards_${curSub}_${curTop}`.replace(/\s+/g, "_");
    if (typeof window !== "undefined") {
      const offlineDeck = localStorage.getItem(storageKey);
      if (offlineDeck) {
        try {
          const parsedDeck = JSON.parse(offlineDeck);
          if (Array.isArray(parsedDeck) && parsedDeck.length > 0) {
            setCards(parsedDeck);
            setIsLoading(false);
            return;
          }
        } catch { /* ignore */ }
      }
    }

    // Fetch from AI endpoint if no cached deck exists
    try {
      const res = await fetch("/api/ai/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: curSub, topic: curTop }),
      });

      if (!res.ok) throw new Error("Failed to fetch flashcards");
      const data = await res.json();
      const loaded: FlashCard[] = data.flashcards || [];
      setCards(loaded);

      if (typeof window !== "undefined" && loaded.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(loaded));
      }
    } catch (err) {
      console.error("Error loading flashcards:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    loadTopicAndCards();
  }, [loadTopicAndCards]);

  const handleFlip = () => {
    hapticTap();
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (gotIt: boolean) => {
    hapticTap();
    setIsFlipped(false);
    setShowHint(false);

    if (gotIt) {
      setMasteredCount((m) => m + 1);
    }

    if (currentIdx + 1 < cards.length) {
      setCurrentIdx((i) => i + 1);
    } else {
      setIsFinished(true);
      claimDailyStreak().catch(() => {});
      fireSideCannons();
      hapticSuccess();
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setMasteredCount(0);
    setIsFinished(false);
    setIsFlipped(false);
    setShowHint(false);
  };

  const currentCard = cards[currentIdx];

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
                Revision Flashcards
              </h1>
              <p className="text-xs font-bold text-stone-600 truncate max-w-[220px]">
                {subject} • {topic}
              </p>
            </div>
          </div>

          <button
            onClick={() => loadTopicAndCards(subject, topic)}
            aria-label="Reload cards"
            className="w-10 h-10 bg-[#B6FF00] border-[2.5px] border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center transition-transform"
          >
            <RefreshIcon size={18} className="text-black" />
          </button>
        </header>

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white border-[3.5px] border-black rounded-2xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-4">
            <div className="w-12 h-12 border-[4px] border-black border-t-[#B6FF00] rounded-full animate-spin mx-auto" />
            <h3 className="font-black text-base uppercase text-black">
              Loading Daily Topic Flashcards...
            </h3>
            <p className="text-xs font-bold text-stone-600">
              Formulating GCE revision cards for {topic}.
            </p>
          </div>
        ) : isFinished ? (
          /* ============ COMPLETION SCREEN ============ */
          <div className="bg-[#B6FF00] border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-4">
            <div className="w-16 h-16 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mx-auto">
              <Award01Icon size={36} className="text-black" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-stone-800">
                Deck Mastery Complete!
              </span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                {masteredCount} / {cards.length} Mastered!
              </h2>
              <p className="text-xs font-extrabold text-stone-900 max-w-xs mx-auto pt-1">
                You reviewed all key concepts and questions for {topic}. Spaced memory practice keeps information sharp for exam day!
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={handleRestart}
                className="w-full bg-white hover:bg-stone-50 border-[2.5px] border-black rounded-xl py-3.5 font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all text-black flex items-center justify-center gap-1.5"
              >
                <RotateRight01Icon size={16} />
                <span>Review Deck Again</span>
              </button>
              <button
                onClick={() => router.push("/dashboard/daily-lessons")}
                className="w-full bg-[#FFB040] hover:bg-[#ffa326] border-[2.5px] border-black rounded-xl py-3.5 font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all text-black"
              >
                Back to Daily Lesson
              </button>
            </div>
          </div>
        ) : (
          /* ============ FLASHCARD FLIP INTERACTION ============ */
          <div className="space-y-5">
            {/* Progress indicator */}
            <div className="bg-white border-[3.5px] border-black rounded-2xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-stone-700">
                Card {currentIdx + 1} of {cards.length}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black bg-[#B6FF00] border border-black rounded-full px-2.5 py-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  {masteredCount} Mastered
                </span>
              </div>
            </div>

            {/* Flip Card Container */}
            {currentCard && (
              <div className="perspective-1000 min-h-[280px]">
                <motion.div
                  key={`card-${currentIdx}-${isFlipped}`}
                  initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  onClick={handleFlip}
                  className={`w-full min-h-[280px] border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex flex-col justify-between transition-all ${
                    isFlipped ? "bg-[#D3E2FF]" : "bg-white"
                  }`}
                >
                  {/* Card Header Tag */}
                  <div className="flex items-center justify-between w-full">
                    <span className="inline-flex items-center gap-1.5 bg-[#FFB040] border-[2px] border-black rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                      <Book01Icon size={12} />
                      <span>{isFlipped ? "Answer / Key Concept" : "Question / Prompt"}</span>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHint(!showHint);
                      }}
                      className="text-[10px] font-black uppercase tracking-wider text-stone-700 bg-stone-100 hover:bg-stone-200 border border-black rounded-lg px-2 py-1 flex items-center gap-1"
                    >
                      <HelpCircleIcon size={12} />
                      <span>{showHint ? "Hide Hint" : "Hint"}</span>
                    </button>
                  </div>

                  {/* Card Main Body */}
                  <div className="my-auto py-4 text-center space-y-3">
                    <h2 className="text-base md:text-lg font-black text-black leading-relaxed">
                      {formatAIText(isFlipped ? currentCard.back : currentCard.front)}
                    </h2>

                    {/* Optional Hint display */}
                    {!isFlipped && showHint && currentCard.hint && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#FFE5C4] border-[2px] border-black rounded-xl p-2.5 text-xs font-extrabold text-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] max-w-xs mx-auto"
                      >
                        💡 Hint: {formatAIText(currentCard.hint)}
                      </motion.div>
                    )}
                  </div>

                  {/* Tap to Flip Prompt */}
                  <div className="flex items-center justify-center gap-1.5 text-stone-500 font-extrabold text-[10px] uppercase tracking-widest pt-2 border-t border-stone-200">
                    <SparklesIcon size={12} />
                    <span>Tap card to {isFlipped ? "see question" : "reveal answer"}</span>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Answer Control Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 bg-[#FF9494] hover:bg-[#ff7a7a] border-[3.5px] border-black rounded-xl py-3.5 font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all text-black flex items-center justify-center gap-1.5"
              >
                <Cancel01Icon size={16} />
                <span>Review Again</span>
              </button>

              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 bg-[#B6FF00] hover:bg-[#a3e600] border-[3.5px] border-black rounded-xl py-3.5 font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all text-black flex items-center justify-center gap-1.5"
              >
                <CheckmarkCircle02Icon size={16} />
                <span>Got It! ✓</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <BottomNav items={navItems} />
    </div>
  );
}
