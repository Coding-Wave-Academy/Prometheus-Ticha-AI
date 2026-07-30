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
  Target02Icon,
  Timer01Icon,
  RotateRight01Icon,
} from "hugeicons-react";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";
import { formatAIText } from "@/lib/formatAIText";
import { hapticTap, hapticSuccess } from "@/lib/haptics";
import { fireSideCannons } from "@/lib/confetti";

interface QuizQuestion {
  questionText: string;
  options: string[];
  answerIdx: number;
  explanation: string;
}

const QUESTION_TIME_LIMIT = 108; // 108 seconds per question (50 questions in 90 mins)

export default function QuizGeneratorPage() {
  const router = useRouter();
  const navItems = useNavItems();

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [subjectTopic, setSubjectTopic] = useState({ subject: "Physics", topic: "Faraday's Law" });

  // Timers
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [totalExamTime, setTotalExamTime] = useState(5400); // 90 minutes in seconds

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load daily topic & fetch GCE Paper 1 quiz
  useEffect(() => {
    loadQuiz();
  }, []);

  // Per-question timer interval
  useEffect(() => {
    if (isLoading || isFinished || isAnswered) {
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
  }, [currentIdx, isLoading, isFinished, isAnswered]);

  // Overall exam timer interval
  useEffect(() => {
    if (isLoading || isFinished) {
      if (totalTimerRef.current) clearInterval(totalTimerRef.current);
      return;
    }

    totalTimerRef.current = setInterval(() => {
      setTotalExamTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      if (totalTimerRef.current) clearInterval(totalTimerRef.current);
    };
  }, [isLoading, isFinished]);

  const loadQuiz = async () => {
    setIsLoading(true);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setUserAnswers([]);
    setIsFinished(false);
    setTimeLeft(QUESTION_TIME_LIMIT);
    setTotalExamTime(5400);

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
      setQuiz(data.quiz || []);
    } catch (err) {
      console.error("Failed to load GCE quiz:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeExpired = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOpt(-1); // -1 indicates time expired
    setUserAnswers((prev) => [...prev, -1]);
  };

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    hapticTap();
    setSelectedOpt(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null || isAnswered) return;
    setIsAnswered(true);

    const currentQ = quiz[currentIdx];
    const isCorrect = selectedOpt === currentQ.answerIdx;

    if (isCorrect) {
      hapticSuccess();
      setScore((s) => s + 1);
    }

    setUserAnswers((prev) => [...prev, selectedOpt]);
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < quiz.length) {
      setCurrentIdx((i) => i + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
      setTimeLeft(QUESTION_TIME_LIMIT);
    } else {
      setIsFinished(true);
      fireSideCannons();
      hapticSuccess();
    }
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
              href="/dashboard"
              className="w-10 h-10 bg-white border-[2.5px] border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center transition-transform"
              aria-label="Back to dashboard"
            >
              <ArrowLeft01Icon className="w-5 h-5 text-black" />
            </Link>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A]">
                GCE Paper 1 Exam
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
              Generating GCE Paper 1 Questions...
            </h3>
            <p className="text-xs font-bold text-stone-600">
              Madame Ticha is formulating exam-style questions for {subjectTopic.topic}.
            </p>
          </div>
        ) : isFinished ? (
          /* ============ RESULTS SCREEN ============ */
          <div className="space-y-5">
            <div className="bg-[#B6FF00] border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-4">
              <div className="w-16 h-16 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mx-auto">
                <Award01Icon size={36} className="text-black" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-widest text-stone-800">
                  GCE Paper 1 Result
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
                  onClick={() => router.push("/dashboard")}
                  className="flex-1 bg-[#FFB040] hover:bg-[#ffa326] border-[2.5px] border-black rounded-xl py-3 font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all text-black"
                >
                  Dashboard
                </button>
              </div>
            </div>

            {/* Full Question Review */}
            <div className="bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-stone-800">
                Full Question Breakdown & Explanations
              </h3>

              <div className="space-y-4">
                {quiz.map((q, idx) => {
                  const userAns = userAnswers[idx];
                  const isCorrect = userAns === q.answerIdx;

                  return (
                    <div
                      key={idx}
                      className={`border-[2.5px] border-black rounded-xl p-4 space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                        isCorrect ? "bg-[#C8F7C5]" : "bg-[#FFD9E0]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-stone-800">
                          Q{idx + 1} • {isCorrect ? "Correct ✓" : "Incorrect ✗"}
                        </span>
                        <span className="text-[10px] font-black bg-white px-2 py-0.5 border border-black rounded">
                          Answer: {String.fromCharCode(65 + q.answerIdx)}
                        </span>
                      </div>

                      <p className="text-xs font-black text-black leading-snug">
                        {q.questionText}
                      </p>

                      <div className="bg-white border border-black rounded-lg p-2.5 text-[11px] font-bold text-stone-800 space-y-1">
                        <span className="text-[9px] font-black uppercase text-stone-500 block">
                          Madame Ticha Exam Explanation:
                        </span>
                        <p>{q.explanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ============ ACTIVE EXAM QUESTION ============ */
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
                  <span>{timeLeft}s per question</span>
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
            <div className="bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 bg-[#FFB040] text-black border-[2px] border-black rounded-full px-3 py-0.5 text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  <Book01Icon size={12} />
                  <span>GCE Paper 1 MCQ</span>
                </span>
                <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest">
                  108s TIMER
                </span>
              </div>

              <h2 className="text-base font-black text-black leading-snug">
                {currentQ.questionText}
              </h2>

              {/* Options A, B, C, D */}
              <div className="space-y-2.5 pt-1">
                {currentQ.options.map((opt, oIdx) => {
                  const letter = String.fromCharCode(65 + oIdx);
                  const isSelected = selectedOpt === oIdx;
                  const isCorrect = oIdx === currentQ.answerIdx;

                  let style = "bg-white border-black hover:bg-stone-50";
                  if (isSelected && !isAnswered) style = "bg-[#D3E2FF] border-black";
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
                      className={`w-full p-3.5 rounded-xl border-[2.5px] text-left font-bold text-xs flex items-center gap-3 shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all ${style}`}
                    >
                      <span className="w-6 h-6 bg-black text-white rounded-lg flex items-center justify-center font-black text-xs shrink-0">
                        {letter}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {isAnswered && isCorrect && (
                        <CheckmarkCircle02Icon size={18} className="text-black shrink-0" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <Cancel01Icon size={18} className="text-red-800 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation Box */}
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#FAF7EC] border-[2px] border-black rounded-xl p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#965A18] block">
                    📖 Madame Ticha Exam Explanation
                  </span>
                  <p className="text-xs font-bold text-black leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </motion.div>
              )}

              {/* Action Button */}
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
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full bg-[#FFB040] hover:bg-[#ffa326] border-[3.5px] border-black rounded-xl py-3.5 font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none text-black"
                  >
                    {currentIdx + 1 < quiz.length ? "Next GCE Question ➔" : "Finish Paper 1 Exam 🎉"}
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
