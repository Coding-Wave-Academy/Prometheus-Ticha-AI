"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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

  // Load daily topic & fetch GCE Paper 1 quiz
  useEffect(() => {
    loadQuiz();
  }, []);

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

  const loadQuiz = async () => {
    setIsLoading(true);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setUserAnswers([]);
    setIsFinished(false);
    setReviewIdx(0);

    let subject = "Physics";
    let topic = "Electromagnetism & Faraday's Law";

    if (typeof window !== "undefined") {
      const storedTopic = localStorage.getItem("ticha_today_lesson_topic");
      if (storedTopic) {
        try {
          const parsed = JSON.parse(storedTopic);
          if (parsed.subject) subject = parsed.subject;
          if (parsed.topic) topic = parsed.topic;
        } catch { /* ignore */ }
      }
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
  };

  // Handle per-question timer expiration: records -1 and moves to next question silently
  const handleTimeExpired = () => {
    hapticTap();
    recordAnswerAndAdvance(-1);
  };

  const handleOptionSelect = (idx: number) => {
    hapticTap();
    setSelectedOpt(idx);
  };

  const handleNextQuestionSubmit = () => {
    if (selectedOpt === null) return;
    recordAnswerAndAdvance(selectedOpt);
  };

  const recordAnswerAndAdvance = (chosenIdx: number) => {
    const currentQ = quiz[currentIdx];
    const isCorrect = chosenIdx === currentQ.answerIdx;

    if (isCorrect) {
      setScore((s) => s + 1);
    }

    const updatedAnswers = [...userAnswers, chosenIdx];
    setUserAnswers(updatedAnswers);

    if (currentIdx + 1 < quiz.length) {
      setCurrentIdx((i) => i + 1);
      setSelectedOpt(null);
      setTimeLeft(QUESTION_TIME_LIMIT);
    } else {
      finishExam();
    }
  };

  const finishExam = () => {
    setIsFinished(true);
    fireSideCannons();
    hapticSuccess();
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const currentQ = quiz[currentIdx];
  const percentScore = quiz.length > 0 ? Math.round((score / quiz.length) * 100) : 0;

  let gceGrade = "Grade C";
  if (percentScore >= 80) gceGrade = "Grade A (Distinction)";
  else if (percentScore >= 70) gceGrade = "Grade B (Excellence)";
  else if (percentScore >= 50) gceGrade = "Grade C (Credit)";
  else gceGrade = "Needs Revision";

  return (
    <div className="min-h-screen bg-[#FAF7EC] pb-28 text-black antialiased font-sans selection:bg-[#B6FF00]">
      <main className="w-full max-w-md mx-auto p-4 pt-6 flex flex-col space-y-5 animate-page-in text-left">
        {/* Header */}
        <header className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Link
              href="/explore"
              className="w-10 h-10 bg-white border-[2.5px] border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center transition-transform"
              aria-label="Back to explore hub"
            >
              <ArrowLeft01Icon className="w-5 h-5 text-black" />
            </Link>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A]">
                Daily Quiz
              </h1>
              <p className="text-xs font-bold text-stone-600">
                {subjectTopic.subject} • {subjectTopic.topic}
              </p>
            </div>
          </div>

          {/* Total Exam Time */}
          <div className="flex items-center gap-1.5 bg-[#FFB040] border-[2px] border-black rounded-full px-3 py-1 text-xs font-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
            <Timer01Icon size={14} />
            <span>{formatTime(totalExamTime)}</span>
          </div>
        </header>

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white border-[3.5px] border-black rounded-2xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-4">
            <div className="w-12 h-12 border-[4px] border-black border-t-[#B6FF00] rounded-full animate-spin mx-auto" />
            <h3 className="font-black text-base uppercase text-black">
              Preparing Exam Questions...
            </h3>
            <p className="text-xs font-bold text-stone-600">
              Formulating 15 GCE Paper 1 questions strictly for {subjectTopic.topic}.
            </p>
          </div>
        ) : isFinished ? (
          /* ============ POST-EXAM RESULTS & SLIDE REVIEW SCREEN ============ */
          <div className="space-y-5">
            {/* Grade Result Card */}
            <div className="bg-[#B6FF00] border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-4">
              <div className="w-16 h-16 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mx-auto">
                <Award01Icon size={36} className="text-black" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-widest text-stone-800">
                  GCE Paper 1 Exam Result
                </span>
                <h2 className="text-3xl font-black uppercase tracking-tight text-black">
                  {gceGrade}
                </h2>
                <p className="text-sm font-extrabold text-stone-900 pt-1">
                  You scored {score} / {quiz.length} ({percentScore}%) on {subjectTopic.topic}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={loadQuiz}
                  className="flex-1 bg-white hover:bg-stone-50 border-[2.5px] border-black rounded-xl py-3 font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all text-black flex items-center justify-center gap-1.5"
                >
                  <RotateRight01Icon size={16} />
                  <span>Retake Exam</span>
                </button>
                <button
                  onClick={() => router.push("/explore")}
                  className="flex-1 bg-[#FFB040] hover:bg-[#ffa326] border-[2.5px] border-black rounded-xl py-3 font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all text-black"
                >
                  Explore Hub
                </button>
              </div>
            </div>

            {/* Post-Quiz Review Slide Navigation */}
            <div className="bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <div className="flex items-center justify-between border-b-[2.5px] border-black pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 block">
                    Exam Correction Slide
                  </span>
                  <h3 className="text-sm font-black text-black">
                    Question {reviewIdx + 1} of {quiz.length}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setReviewIdx((i) => Math.max(0, i - 1))}
                    disabled={reviewIdx === 0}
                    className={`px-3 py-1 border-[2px] border-black rounded-lg font-black text-xs shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] ${
                      reviewIdx === 0 ? "bg-stone-100 text-stone-400 border-stone-300 shadow-none" : "bg-[#FFB040] text-black"
                    }`}
                  >
                    ◀ Prev
                  </button>
                  <button
                    onClick={() => setReviewIdx((i) => Math.min(quiz.length - 1, i + 1))}
                    disabled={reviewIdx === quiz.length - 1}
                    className={`px-3 py-1 border-[2px] border-black rounded-lg font-black text-xs shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] ${
                      reviewIdx === quiz.length - 1 ? "bg-stone-100 text-stone-400 border-stone-300 shadow-none" : "bg-[#B6FF00] text-black"
                    }`}
                  >
                    Next ▶
                  </button>
                </div>
              </div>

              {/* Slide Buttons Quick Selector Grid */}
              <div className="flex flex-wrap gap-1.5">
                {quiz.map((q, idx) => {
                  const uAns = userAnswers[idx];
                  const isRight = uAns === q.answerIdx;
                  const isCur = idx === reviewIdx;

                  let badgeColor = isRight ? "bg-[#B6FF00] border-black text-black" : "bg-[#FF9494] border-black text-black";
                  if (uAns === -1) badgeColor = "bg-amber-200 border-black text-black";

                  return (
                    <button
                      key={idx}
                      onClick={() => setReviewIdx(idx)}
                      className={`w-7 h-7 rounded-lg border-[2px] font-black text-xs flex items-center justify-center transition-all ${badgeColor} ${
                        isCur ? "ring-2 ring-black scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "opacity-80"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Active Review Slide Content */}
              {quiz[reviewIdx] && (() => {
                const reqQ = quiz[reviewIdx];
                const uAns = userAnswers[reviewIdx];
                const isRight = uAns === reqQ.answerIdx;
                const isTimeExpired = uAns === -1;
                const wrongExplanation =
                  uAns >= 0 && reqQ.wrongExplanations && reqQ.wrongExplanations[uAns]
                    ? reqQ.wrongExplanations[uAns]
                    : null;

                return (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`review-slide-${reviewIdx}`}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-3 pt-2"
                    >
                      {/* Question Text */}
                      <div className="bg-[#FAF7EC] border-[2px] border-black rounded-xl p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-600 block">
                          Question {reviewIdx + 1}
                        </span>
                        <p className="text-xs font-black text-black leading-snug">
                          {formatAIText(reqQ.questionText)}
                        </p>
                      </div>

                      {/* User's Wrong Response vs Correct Response Slide Details */}
                      {!isRight ? (
                        <div className="bg-[#FFD9E0] border-[2.5px] border-black rounded-xl p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-red-950 flex items-center gap-1">
                              <Cancel01Icon size={14} className="text-red-800" />
                              Wrong Response
                            </span>
                            <span className="text-[10px] font-black bg-white px-2 py-0.5 border border-black rounded">
                              {isTimeExpired ? "Time Expired" : `Selected Option ${String.fromCharCode(65 + uAns)}`}
                            </span>
                          </div>

                          <p className="text-xs font-extrabold text-red-950">
                            {uAns >= 0 ? `${String.fromCharCode(65 + uAns)}: ${formatAIText(reqQ.options[uAns] || "")}` : "No option selected (Timer ran out)"}
                          </p>

                          {wrongExplanation && (
                            <p className="text-xs font-bold text-red-900 border-t border-red-300 pt-1.5 leading-relaxed">
                              ❌ Why your choice was incorrect: {formatAIText(wrongExplanation)}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="bg-[#C8F7C5] border-[2.5px] border-black rounded-xl p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1">
                          <span className="text-[10px] font-black uppercase text-green-950 flex items-center gap-1">
                            <CheckmarkCircle02Icon size={14} className="text-green-800" />
                            Correct Response
                          </span>
                          <p className="text-xs font-extrabold text-green-950">
                            {String.fromCharCode(65 + reqQ.answerIdx)}: {formatAIText(reqQ.options[reqQ.answerIdx])}
                          </p>
                        </div>
                      )}

                      {/* Correct Response Box */}
                      {!isRight && (
                        <div className="bg-[#C8F7C5] border-[2.5px] border-black rounded-xl p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1">
                          <span className="text-[10px] font-black uppercase text-green-950 block">
                            ✓ Official Correct Answer
                          </span>
                          <p className="text-xs font-extrabold text-black">
                            {String.fromCharCode(65 + reqQ.answerIdx)}: {formatAIText(reqQ.options[reqQ.answerIdx])}
                          </p>
                        </div>
                      )}

                      {/* Madame Ticha Explanation */}
                      <div className="bg-white border-[2.5px] border-black rounded-xl p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#965A18] block">
                          📖 Madame Ticha Explanation
                        </span>
                        <p className="text-xs font-bold text-black leading-relaxed">
                          {formatAIText(reqQ.explanation)}
                        </p>
                      </div>

                      {/* Exam Trap & Tips Box */}
                      {reqQ.examTrap && (
                        <div className="bg-[#FFE5C4] border-[2.5px] border-black rounded-xl p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#965A18] block">
                            ⚠️ Exam Trap & Tips
                          </span>
                          <p className="text-xs font-extrabold text-black leading-relaxed">
                            {formatAIText(reqQ.examTrap)}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                );
              })()}
            </div>
          </div>
        ) : (
          /* ============ ACTIVE EXAM QUESTION (STRICT ENVIRONMENT) ============ */
          <div className="space-y-5">
            {/* Question Progress & Per-Question Countdown Timer Bar */}
            <div className="bg-white border-[3.5px] border-black rounded-2xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-stone-700">
                  Question {currentIdx + 1} of {quiz.length}
                </span>

                {/* Per-Question Timer (108s countdown) */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 border-[2px] border-black rounded-full font-black text-xs shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] ${
                    timeLeft <= 25 ? "bg-[#FF9494] animate-bounce text-black" : "bg-[#B6FF00] text-black"
                  }`}
                >
                  <Timer01Icon size={14} />
                  <span>{timeLeft}s timer</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-3 w-full bg-stone-100 border-[2px] border-black rounded-full overflow-hidden shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                <div
                  className="h-full bg-[#B6FF00] transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / quiz.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            {currentQ && (
              <div className="bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 bg-[#FFB040] text-black border-[2px] border-black rounded-full px-3 py-0.5 text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                    <Book01Icon size={12} />
                    <span>GCE Paper 1 MCQ</span>
                  </span>
                  <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest">
                    108s PER QUESTION
                  </span>
                </div>

                <h2 className="text-base font-black text-black leading-snug">
                  {formatAIText(currentQ.questionText)}
                </h2>

                {/* Options A, B, C, D (No right/wrong reveal during exam) */}
                <div className="space-y-2.5 pt-1">
                  {currentQ.options.map((opt, oIdx) => {
                    const letter = String.fromCharCode(65 + oIdx);
                    const isSelected = selectedOpt === oIdx;

                    const style = isSelected
                      ? "bg-[#D3E2FF] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white border-black hover:bg-stone-50 shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]";

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleOptionSelect(oIdx)}
                        className={`w-full p-3.5 rounded-xl border-[2.5px] text-left font-bold text-xs flex items-center gap-3 active:translate-x-px active:translate-y-px active:shadow-none transition-all ${style}`}
                      >
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${isSelected ? "bg-[#965A18] text-white" : "bg-black text-white"}`}>
                          {letter}
                        </span>
                        <span className="flex-1 text-black">{formatAIText(opt)}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Action Button: Moves immediately to next question */}
                <div className="pt-2">
                  <button
                    onClick={handleNextQuestionSubmit}
                    disabled={selectedOpt === null}
                    className={`w-full border-[3.5px] border-black rounded-xl py-3.5 font-black uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                      selectedOpt !== null
                        ? "bg-[#B6FF00] hover:bg-[#a3e600] text-black active:translate-x-px active:translate-y-px active:shadow-none"
                        : "bg-[#E8E6DA] text-stone-400 cursor-not-allowed shadow-none border-stone-400"
                    }`}
                  >
                    <span>{currentIdx + 1 < quiz.length ? "Submit & Next Question" : "Submit Exam 🎉"}</span>
                    <ArrowRight01Icon size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav items={navItems} />
    </div>
  );
}
