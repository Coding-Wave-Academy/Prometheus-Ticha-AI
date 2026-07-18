"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

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
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Customizer state
  const [subject, setSubject] = useState("");
  const [count, setCount] = useState(3);
  const [difficulty, setDifficulty] = useState("Medium");
  const [struggles, setStruggles] = useState<string[]>([]);
  const [vector, setVector] = useState<any>(null);

  // Load vector details on mount
  useEffect(() => {
    const vectorStr = localStorage.getItem("ticha_user_profile_vector");
    if (vectorStr) {
      const vectorData = JSON.parse(vectorStr);
      setVector(vectorData);
      if (vectorData.struggles && vectorData.struggles.length > 0) {
        setStruggles(vectorData.struggles);
        setSubject(vectorData.struggles[0]); // Default to first struggle subject
      }
    } else {
      setStruggles(["Physics", "Pure Mathematics", "Chemistry"]);
      setSubject("Physics");
    }
  }, []);

  // Fetch quiz based on customized parameters
  const generateQuiz = async () => {
    setIsLoading(true);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setHasStarted(true);

    try {
      const requestPayload = {
        goal: vector?.goal || "gce",
        education: vector?.education || "al",
        struggles: struggles,
        subject: subject,
        count: count,
        difficulty: difficulty,
      };

      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      if (!res.ok) throw new Error("Quiz generation failed");
      const data = await res.json();
      setQuiz(data.quiz || []);
    } catch (err) {
      console.error("Failed to fetch customized quiz", err);
      // Premium fallback
      setQuiz([
        {
          questionText: `[Fallback] Which of the following is a key concept in ${subject}?`,
          options: [
            "Exponential potential wave barrier tunneling",
            "Linear drag coefficient integration",
            "Hydrostatic pressure equilibrium",
            "First law of thermodynamics entropy",
          ],
          answerIdx: 0,
          explanation: `This is a premium fallback question on ${subject} at ${difficulty} level since connection timed out.`,
        },
        {
          questionText: `[Fallback] What is a primary challenge when optimizing ${subject} calculations?`,
          options: [
            "Boundary conditions parsing limits",
            "Thermal radiation emission parameters",
            "Chemical redox reaction balancing",
            "Angular momentum conservation laws",
          ],
          answerIdx: 0,
          explanation: `Boundary parameters dictate classic limits on ${subject}.`,
        },
      ].slice(0, count));
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleNext = async () => {
    setSelectedOpt(null);
    setIsAnswered(false);
    
    const nextIndex = currentIdx + 1;
    setCurrentIdx(nextIndex);

    // If quiz is finished, save attempt history to Supabase
    if (nextIndex >= quiz.length) {
      const finalScore = selectedOpt === quiz[currentIdx].answerIdx ? score + 1 : score;
      if (isSupabaseConfigured()) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from("quiz_attempts").insert({
              user_id: user.id,
              score: finalScore,
              total_questions: quiz.length,
            });
            console.log("Successfully saved quiz attempt to Supabase.");
          }
        } catch (err) {
          console.error("Failed to insert attempt to Supabase", err);
        }
      }
    }
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
                  Querying AI Model
                </h3>
                <p className="text-xs font-bold text-stone-600">
                  Customizing {count} questions on {subject} at {difficulty} difficulty...
                </p>
              </div>
            </div>
          ) : !hasStarted ? (
            /* Customizer Entry Dashboard */
            <div className="bg-white border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-5">
              <div className="text-left space-y-1">
                <h2 className="text-xl font-black uppercase text-black">
                  Configure Custom Quiz
                </h2>
                <p className="text-xs font-bold text-stone-500">
                  Choose your target parameters to generate tailored quiz questions with Gemini AI.
                </p>
              </div>

              {/* Form Input fields */}
              <div className="space-y-4">
                
                {/* 1. Subject selector */}
                <div className="flex flex-col space-y-1.5 text-left">
                  <label className="text-xs font-extrabold uppercase tracking-widest text-stone-800">
                    Target Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-white border-[2.5px] border-black rounded-xl p-3 font-bold text-sm focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none transition-all"
                  >
                    {struggles.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    <option value="General Mathematics">General Mathematics</option>
                    <option value="Advanced Chemistry">Advanced Chemistry</option>
                    <option value="Advanced Biology">Advanced Biology</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                {/* 2. Question count button group */}
                <div className="flex flex-col space-y-1.5 text-left">
                  <label className="text-xs font-extrabold uppercase tracking-widest text-stone-800">
                    Number of Questions
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setCount(num)}
                        className={`py-2.5 font-black rounded-xl border-[2.5px] border-black transition-all ${
                          count === num
                            ? "bg-[#B6FF00] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-0.5"
                            : "bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 hover:bg-stone-50"
                        }`}
                      >
                        {num} Qs
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Difficulty Level */}
                <div className="flex flex-col space-y-1.5 text-left">
                  <label className="text-xs font-extrabold uppercase tracking-widest text-stone-800">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Easy", "Medium", "Hard"].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setDifficulty(lvl)}
                        className={`py-2.5 font-black rounded-xl border-[2.5px] border-black transition-all ${
                          difficulty === lvl
                            ? "bg-[#FFB040] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-0.5"
                            : "bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 hover:bg-stone-50"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action trigger button */}
              <button
                onClick={generateQuiz}
                className="w-full bg-[#B6FF00] hover:bg-[#a3e600] border-[3.5px] border-black rounded-xl py-3.5 px-4 font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-center text-black"
              >
                🧠 Generate Quiz with AI
              </button>
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
                  onClick={() => setHasStarted(false)}
                  className="w-full bg-white hover:bg-stone-50 border-[3px] border-black rounded-xl py-3 px-4 font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-black"
                >
                  🔄 Customize New Quiz
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
                  {quiz[currentIdx]?.questionText}
                </p>
              </div>

              {/* Options Stack */}
              <div className="space-y-3">
                {quiz[currentIdx]?.options.map((opt, oIdx) => {
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
                    {quiz[currentIdx]?.explanation}
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
