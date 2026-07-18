"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";

interface QuizQuestion {
  questionText: string;
  options: string[];
  answerIdx: number;
  explanation: string;
}

export default function QuizGeneratorPage() {
  const router = useRouter();
  const navItems = useNavItems();

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [vector, setVector] = useState<any>(null);

  // Load vector and fetch quiz
  const loadQuiz = async () => {
    setIsLoading(true);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);

    try {
      const vectorStr = localStorage.getItem("ticha_user_profile_vector");
      let vectorData = { goal: "gce", education: "al", struggles: ["Physics", "Pure Mathematics"] };
      if (vectorStr) {
        vectorData = JSON.parse(vectorStr);
      }
      setVector(vectorData);

      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vectorData),
      });

      if (!res.ok) throw new Error("Quiz generation failed");
      const data = await res.json();
      setQuiz(data.quiz || []);
    } catch (err) {
      console.error("Failed to fetch generated quiz", err);
      // Hard fallback
      setQuiz([
        {
          questionText: "Which of the following phenomena is a direct manifestation of quantum tunneling?",
          options: [
            "Alpha decay of radioactive nuclei",
            "Blackbody radiation intensity",
            "Photoelectric work function threshold",
            "Bohr radius orbital electron levels",
          ],
          answerIdx: 0,
          explanation: "Alpha decay occurs because alpha particles tunnel through the strong nuclear force potential barrier of the nucleus, even though they classically lack the kinetic energy to escape!",
        },
        {
          questionText: "If the wavefunction of a particle incident on a barrier has an energy E less than the barrier height V, what happens to the wavefunction inside the barrier?",
          options: [
            "It becomes a constant zero",
            "It decays exponentially",
            "It oscillates with twice the frequency",
            "It remains a constant amplitude sine wave",
          ],
          answerIdx: 1,
          explanation: "Inside the potential barrier where E < V, the wavefunction undergoes exponential decay. If the barrier is thin enough, the wavefunction value is non-zero at the far boundary, allowing the particle to emerge!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuiz();
  }, []);

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null || isAnswered) return;
    setIsAnswered(true);
    if (selectedOpt === quiz[currentIdx].answerIdx) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setIsAnswered(false);
    setCurrentIdx((idx) => idx + 1);
  };

  const isQuizFinished = quiz.length > 0 && currentIdx >= quiz.length;

  return (
    <div className="min-h-screen bg-[#FAF7EC] pb-24 antialiased font-sans selection:bg-[#B6FF00]">
      {/* Outer Wrapper Container */}
      <main className="w-full max-w-md mx-auto p-4 flex flex-col min-h-[90vh] justify-between animate-page-in">
        
        {/* Top Header */}
        <header className="flex items-center justify-between w-full mb-6 py-2">
          <Link
            href="/dashboard"
            className="w-11 h-11 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all"
            aria-label="Back to dashboard"
          >
            <svg className="w-6 h-6 stroke-[3.5px] text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          
          <div className="text-right">
            <span className="text-[10px] font-black uppercase text-[#965A18] tracking-widest block">
              AI Study Assistant
            </span>
            <h1 className="text-sm font-black text-black">
              Dynamic Quiz Generator
            </h1>
          </div>
        </header>

        {/* Content Box */}
        <div className="flex-1 flex flex-col justify-center w-full">
          {isLoading ? (
            /* Neobrutalist Loading Box */
            <div className="bg-white border-[3.5px] border-black rounded-2xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-4">
              <div className="w-12 h-12 border-[5px] border-black border-t-[#B6FF00] rounded-full animate-spin mx-auto"></div>
              <div className="space-y-1">
                <h3 className="font-black text-lg uppercase tracking-tight text-black">
                  Querying Profile Vector
                </h3>
                <p className="text-xs font-bold text-stone-600">
                  Tailoring concepts for {vector?.struggles?.join(" & ") || "your challenges"}...
                </p>
              </div>
            </div>
          ) : isQuizFinished ? (
            /* Quiz Results Card */
            <div className="bg-[#B6FF00] border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-6">
              <div className="w-16 h-16 bg-white border-[3.5px] border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mx-auto">
                <span className="text-3xl select-none">🏆</span>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-extrabold uppercase tracking-widest text-stone-800">
                  Quiz Completed
                </span>
                <h2 className="text-3xl font-black text-black uppercase tracking-tight">
                  {score} / {quiz.length} Correct
                </h2>
                <p className="text-sm font-bold text-stone-700 max-w-xs mx-auto">
                  {score === quiz.length 
                    ? "Absolute genius! You mastered every custom AI question."
                    : "Great effort! Review the explanations to lock in the concepts."}
                </p>
              </div>

              {/* Action Buttons Stack */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={loadQuiz}
                  className="w-full bg-white hover:bg-stone-50 border-[3px] border-black rounded-xl py-3 px-4 font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-black"
                >
                  🔄 Generate New Quiz
                </button>
                <Link
                  href="/dashboard"
                  className="w-full bg-[#FFB040] hover:bg-[#ffa326] border-[3px] border-black rounded-xl py-3 px-4 font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all block text-center text-black"
                >
                  🏠 Back to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            /* Active Question Form */
            <div className="space-y-5">
              {/* Progress Ring / Tracker Header */}
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-black uppercase tracking-wider text-stone-700">
                  Question {currentIdx + 1} of {quiz.length}
                </span>
                <div className="h-2.5 w-28 bg-stone-200 border-[2px] border-black rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#FFB040] transition-all duration-300" 
                    style={{ width: `${((currentIdx + 1) / quiz.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text Box */}
              <div className="bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-left">
                <p className="text-base font-black text-black leading-snug">
                  {quiz[currentIdx].questionText}
                </p>
              </div>

              {/* Options Stack */}
              <div className="space-y-3">
                {quiz[currentIdx].options.map((opt, oIdx) => {
                  const isSelected = selectedOpt === oIdx;
                  const isCorrect = oIdx === quiz[currentIdx].answerIdx;

                  let optionStyle = "bg-white hover:bg-stone-50 border-black";
                  if (isSelected) {
                    optionStyle = "bg-[#D3E2FF] border-black";
                  }
                  if (isAnswered) {
                    if (isCorrect) {
                      optionStyle = "bg-[#B6FF00] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-0.5";
                    } else if (isSelected) {
                      optionStyle = "bg-[#FF9494] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-0.5";
                    } else {
                      optionStyle = "bg-white border-black/40 text-stone-400";
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleOptionClick(oIdx)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-xl border-[2.5px] text-left transition-all font-bold text-sm flex items-center justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none ${optionStyle}`}
                    >
                      <span className="leading-snug pr-4">{opt}</span>
                      
                      {/* Checkmark Status indicator */}
                      {isAnswered && isCorrect && (
                        <span className="text-black font-black text-lg select-none">✓</span>
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <span className="text-black font-black text-lg select-none">✗</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Explanation Block */}
              {isAnswered && (
                <div className="bg-[#FFE5C4] border-[2.5px] border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-left animate-page-in">
                  <span className="text-[10px] font-black uppercase text-[#965A18] tracking-widest block mb-1">
                    💡 Study Explanation
                  </span>
                  <p className="text-xs font-bold text-[#1A1A1A] leading-snug">
                    {quiz[currentIdx].explanation}
                  </p>
                </div>
              )}

              {/* Action Button Footer */}
              <div className="pt-2">
                {!isAnswered ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOpt === null}
                    className={`w-full border-[3.5px] border-black rounded-xl py-4 font-black uppercase text-base tracking-wider transition-all shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] ${
                      selectedOpt !== null
                        ? "bg-[#B6FF00] hover:bg-[#a3e600] text-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                        : "bg-[#E8E6DA] text-stone-400 cursor-not-allowed opacity-80 shadow-none border-stone-400"
                    }`}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="w-full bg-[#FFB040] hover:bg-[#ffa326] border-[3.5px] border-black rounded-xl py-4 font-black uppercase text-base tracking-wider transition-all shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-black"
                  >
                    {currentIdx + 1 < quiz.length ? "Next Question" : "View Results"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Bottom Nav Bar */}
      <BottomNav items={navItems} />
    </div>
  );
}
