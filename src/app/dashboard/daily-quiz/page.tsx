"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  SparklesIcon,
  Book01Icon,
  Award01Icon,
  Timer01Icon,
  RotateRight01Icon,
  ArrowRight01Icon,
} from "hugeicons-react";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";
import { formatAIText } from "@/lib/formatAIText";
import { hapticTap, hapticSuccess } from "@/lib/haptics";
import { fireSideCannons } from "@/lib/confetti";
import { normalizeSubjectName } from "@/lib/videoCatalog";
import "@/lib/i18n";

interface QuizQuestion {
  questionText: string;
  options: string[];
  answerIdx: number;
  explanation: string;
  wrongExplanations?: string[];
  examTrap?: string;
}

const QUESTION_TIME_LIMIT = 108; // 108 seconds per question (15 Qs in 27 mins = 1620s)



export default function DailyQuizPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center">
          <div className="w-10 h-10 border-[3.5px] border-black border-t-[#B6FF00] rounded-full animate-spin" />
        </div>
      }
    >
      <DailyQuizContent />
    </React.Suspense>
  );
}

function DailyQuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const navItems = useNavItems();

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [subjectTopic, setSubjectTopic] = useState({ subject: "Physics", topic: "Electromagnetism & Faraday's Law" });

  // Slide review state for post-quiz review
  const [reviewIdx, setReviewIdx] = useState(0);

  // Timers
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [totalExamTime, setTotalExamTime] = useState(1620); // 27 minutes (15 * 108s)

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimerRef = useRef<NodeJS.Timeout | null>(null);

  const loadQuiz = useCallback(async (targetSub?: string, targetTop?: string) => {
    setIsLoading(true);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setUserAnswers([]);
    setIsFinished(false);
    setReviewIdx(0);

    let subject = targetSub || "Physics";
    let topic = targetTop || "";

    if (!targetSub && typeof window !== "undefined") {
      const storedTopic = localStorage.getItem("ticha_today_lesson_topic");
      if (storedTopic) {
        try {
          const parsed = JSON.parse(storedTopic);
          if (parsed.subject) subject = parsed.subject;
          if (parsed.topic) topic = parsed.topic;
        } catch { /* ignore */ }
      }
    }

    if (!topic) {
      if (subject === "Pure Mathematics") topic = "Binomial Theorem";
      else if (subject === "ICT") topic = "Database Normalization";
      else if (subject === "Chemistry") topic = "Atomic Structure";
      else if (subject === "Biology") topic = "Cell Structure";
      else topic = "Electromagnetism & Faraday's Law";
    }

    setSubjectTopic({ subject, topic });

    try {
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topic, education: "al" }),
      });

      if (!res.ok) throw new Error("Quiz fetch failed");
      const data = await res.json();
      const loadedQuiz: QuizQuestion[] = data.quiz || [];
      setQuiz(loadedQuiz);

      // Correct total timer based on exact question count (108s per question)
      const exactExamSeconds = (loadedQuiz.length || 15) * QUESTION_TIME_LIMIT;
      setTimeLeft(QUESTION_TIME_LIMIT);
      setTotalExamTime(exactExamSeconds);
    } catch (err) {
      console.error("Failed to load GCE Daily Quiz:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle initial load and query params
  useEffect(() => {
    const urlSubject = searchParams.get("subject");
    const urlTopic = searchParams.get("topic");
    if (urlSubject) {
      loadQuiz(normalizeSubjectName(urlSubject), urlTopic || undefined);
    } else {
      loadQuiz();
    }
  }, [searchParams, loadQuiz]);

  // Per-question timer interval (strictly during exam)
  useEffect(() => {
    if (isLoading || isFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, isLoading, isFinished]);

  // Overall exam timer interval
  useEffect(() => {
    if (isLoading || isFinished) {
      if (totalTimerRef.current) clearInterval(totalTimerRef.current);
      return;
    }

    totalTimerRef.current = setInterval(() => {
      setTotalExamTime((prev) => {
        if (prev <= 1) {
          if (totalTimerRef.current) clearInterval(totalTimerRef.current);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (totalTimerRef.current) clearInterval(totalTimerRef.current);
    };
  }, [isLoading, isFinished]);

  // Handle per-question timer expiration: records -1 and moves to next question silently
  const handleTimeExpired = () => {
    hapticTap();
    setUserAnswers((prev) => [...prev, -1]);
    setSelectedOpt(null);

    if (currentIdx + 1 < quiz.length) {
      setCurrentIdx((prev) => prev + 1);
      setTimeLeft(QUESTION_TIME_LIMIT);
    } else {
      finishExam();
    }
  };

  const handleSelectOption = (idx: number) => {
    hapticTap();
    setSelectedOpt(idx);
  };

  const handleNext = () => {
    if (selectedOpt === null) return;
    hapticTap();

    const currentQ = quiz[currentIdx];
    const isCorrect = selectedOpt === currentQ.answerIdx;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setUserAnswers((prev) => [...prev, selectedOpt]);
    setSelectedOpt(null);

    if (currentIdx + 1 < quiz.length) {
      setCurrentIdx((prev) => prev + 1);
      setTimeLeft(QUESTION_TIME_LIMIT);
    } else {
      finishExam(isCorrect ? score + 1 : score);
    }
  };

  const finishExam = (finalScore?: number) => {
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (totalTimerRef.current) clearInterval(totalTimerRef.current);

    const computedScore = typeof finalScore === "number" ? finalScore : score;
    const passThreshold = Math.ceil(quiz.length * 0.6);

    if (computedScore >= passThreshold) {
      fireSideCannons();
      hapticSuccess();
    }

    // Save quiz result to localStorage
    if (typeof window !== "undefined") {
      try {
        const historyKey = "ticha_quiz_history";
        const history = JSON.parse(localStorage.getItem(historyKey) || "[]");
        history.unshift({
          date: new Date().toISOString(),
          subject: subjectTopic.subject,
          topic: subjectTopic.topic,
          score: computedScore,
          total: quiz.length,
        });
        localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 30)));
      } catch { /* ignore */ }
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const currentQ = quiz[currentIdx];
  const progressPercent = quiz.length > 0 ? Math.round(((currentIdx + 1) / quiz.length) * 100) : 0;

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
                GCE Paper 1 Drill
              </h1>
              <p className="text-xs font-bold text-stone-600">
                15 Multiple Choice Questions
              </p>
            </div>
          </div>

          {!isFinished && !isLoading && (
            <div className="flex items-center gap-1.5 bg-[#FFDF9E] border-[2.5px] border-black rounded-full px-3 py-1 text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Timer01Icon size={14} className="text-stone-800" />
              <span>{formatTimer(totalExamTime)}</span>
            </div>
          )}
        </header>



        {/* Loading State */}
        {isLoading && (
          <div className="bg-white border-[3.5px] border-black rounded-2xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-4">
            <div className="w-12 h-12 border-[4px] border-black border-t-[#B6FF00] rounded-full animate-spin mx-auto" />
            <h3 className="font-black text-base uppercase text-black">
              Generating GCE Paper 1 Questions...
            </h3>
            <p className="text-xs font-bold text-stone-600">
              Curating 15 exam-standard MCQ questions for {subjectTopic.subject} ({subjectTopic.topic}).
            </p>
          </div>
        )}

        {/* Quiz In-Progress View */}
        {!isLoading && !isFinished && currentQ && (
          <div className="space-y-4">
            {/* Progress & Topic Banner */}
            <div className="bg-white border-[3px] border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-600">
                  Question {currentIdx + 1} of {quiz.length}
                </span>
                <span className="text-[10px] font-black text-stone-600">
                  ⏱️ {timeLeft}s Left
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2.5 w-full bg-stone-100 border-[2px] border-black rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#B6FF00] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-black text-stone-800 pt-1">
                <span>{subjectTopic.subject}</span>
                <span className="text-stone-500 font-bold truncate max-w-[180px]">
                  {subjectTopic.topic}
                </span>
              </div>
            </div>

            {/* Question Card */}
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-5"
            >
              <h3 className="text-sm md:text-base font-black text-black leading-snug">
                {formatAIText(currentQ.questionText)}
              </h3>

              {/* Options List */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = selectedOpt === oIdx;
                  const optionLetters = ["A", "B", "C", "D"];

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full p-3.5 rounded-xl border-[2.5px] border-black text-left font-bold text-xs flex items-center gap-3 shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all ${
                        isSelected ? "bg-[#B6FF00] text-black" : "bg-white text-black hover:bg-stone-50"
                      }`}
                    >
                      <span className="w-6 h-6 rounded-lg border-[2px] border-black bg-white flex items-center justify-center font-black text-xs shrink-0">
                        {optionLetters[oIdx]}
                      </span>
                      <span className="flex-1">{formatAIText(opt)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Submit & Next Button */}
              <button
                onClick={handleNext}
                disabled={selectedOpt === null}
                className={`w-full border-[3.5px] border-black rounded-xl py-3.5 font-black uppercase text-xs tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                  selectedOpt !== null
                    ? "bg-[#B6FF00] text-black active:translate-x-px active:translate-y-px active:shadow-none"
                    : "bg-[#E8E6DA] text-stone-400 cursor-not-allowed shadow-none border-stone-400"
                }`}
              >
                {currentIdx + 1 === quiz.length ? "Submit Exam" : "Confirm & Next"}
              </button>
            </motion.div>
          </div>
        )}

        {/* ============ EXAM RESULTS & SLIDE REVIEW ============ */}
        {!isLoading && isFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-5"
          >
            {/* Score Summary Card */}
            <div className="bg-[#B6FF00] border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-3">
              <div className="w-16 h-16 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mx-auto">
                <Award01Icon size={36} className="text-black" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                Exam Finished!
              </h2>
              <p className="text-3xl font-black text-black">
                {score} / {quiz.length}
              </p>
              <p className="text-xs font-bold text-stone-800">
                {score >= Math.ceil(quiz.length * 0.7)
                  ? "🌟 Outstanding! You have solid mastery of this GCE topic."
                  : "💪 Good effort! Review the detailed explanations below."}
              </p>
            </div>

            {/* Slide Question Review Carousel */}
            {quiz.length > 0 && (
              <div className="bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-600">
                    Reviewing Question {reviewIdx + 1} of {quiz.length}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 border border-black rounded ${
                    userAnswers[reviewIdx] === quiz[reviewIdx].answerIdx
                      ? "bg-[#B6FF00] text-black"
                      : "bg-[#FF9494] text-black"
                  }`}>
                    {userAnswers[reviewIdx] === quiz[reviewIdx].answerIdx ? "CORRECT ✓" : "INCORRECT ✗"}
                  </span>
                </div>

                <p className="text-sm font-black text-black">
                  {formatAIText(quiz[reviewIdx].questionText)}
                </p>

                {/* Options Review */}
                <div className="space-y-2">
                  {quiz[reviewIdx].options.map((opt, oIdx) => {
                    const isCorrect = oIdx === quiz[reviewIdx].answerIdx;
                    const wasChosen = userAnswers[reviewIdx] === oIdx;

                    let bg = "bg-white border-stone-200 text-stone-500";
                    if (isCorrect) bg = "bg-[#B6FF00] border-black text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
                    else if (wasChosen) bg = "bg-[#FF9494] border-black text-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";

                    return (
                      <div
                        key={oIdx}
                        className={`p-3 rounded-xl border-[2px] text-xs flex items-center justify-between ${bg}`}
                      >
                        <span>{formatAIText(opt)}</span>
                        {isCorrect && <CheckmarkCircle02Icon size={16} className="text-black" />}
                        {wasChosen && !isCorrect && <Cancel01Icon size={16} className="text-black" />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="bg-[#FAF7EC] border-[2px] border-black rounded-xl p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-700 block">
                    📖 Examiner Explanation
                  </span>
                  <p className="text-xs font-medium text-black leading-relaxed">
                    {formatAIText(quiz[reviewIdx].explanation)}
                  </p>
                </div>

                {/* Exam Trap Warning */}
                {quiz[reviewIdx].examTrap && (
                  <div className="bg-[#FFD9E0] border-[2px] border-black rounded-xl p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-900 block mb-0.5">
                      GCE Exam Trap
                    </span>
                    <p className="text-xs font-bold text-red-950 leading-relaxed">
                      {formatAIText(quiz[reviewIdx].examTrap)}
                    </p>
                  </div>
                )}

                {/* Carousel Navigation */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setReviewIdx((prev) => Math.max(0, prev - 1))}
                    disabled={reviewIdx === 0}
                    className="px-3 py-2 border-[2px] border-black rounded-xl text-xs font-black uppercase bg-white disabled:opacity-40 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-black text-stone-600">
                    {reviewIdx + 1} / {quiz.length}
                  </span>
                  <button
                    onClick={() => setReviewIdx((prev) => Math.min(quiz.length - 1, prev + 1))}
                    disabled={reviewIdx === quiz.length - 1}
                    className="px-3 py-2 border-[2px] border-black rounded-xl text-xs font-black uppercase bg-[#B6FF00] disabled:opacity-40 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => loadQuiz(subjectTopic.subject)}
                className="w-full bg-[#B6FF00] border-[3px] border-black rounded-xl py-3.5 px-4 font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-black flex items-center justify-center gap-2"
              >
                <RotateRight01Icon size={18} className="text-black" />
                <span>Retry Quiz Drill</span>
              </button>

              <button
                onClick={() => router.push(`/dashboard/daily-lessons?subject=${encodeURIComponent(subjectTopic.subject)}&topic=${encodeURIComponent(subjectTopic.topic)}`)}
                className="w-full bg-white border-[3px] border-black rounded-xl py-3.5 px-4 font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-black flex items-center justify-center gap-2"
              >
                <Book01Icon size={18} className="text-black" />
                <span>Study Concept Lesson & Video</span>
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
      </main>

      <BottomNav items={navItems} />
    </div>
  );
}
