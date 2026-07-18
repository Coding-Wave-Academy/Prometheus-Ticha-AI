"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";

interface Flashcard {
  front: string;
  back: string;
}

export default function FlashcardsPage() {
  const navItems = useNavItems();

  const [subject, setSubject] = useState("");
  const [struggles, setStruggles] = useState<string[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Customizer state
  const [count, setCount] = useState(4);
  const [difficulty, setDifficulty] = useState("Medium");
  const [vector, setVector] = useState<any>(null);

  // Read struggles from onboarding vector
  useEffect(() => {
    const vectorStr = localStorage.getItem("ticha_user_profile_vector");
    if (vectorStr) {
      const data = JSON.parse(vectorStr);
      setVector(data);
      if (data.struggles && data.struggles.length > 0) {
        setStruggles(data.struggles);
        setSubject(data.struggles[0]);
      }
    } else {
      setStruggles(["Physics", "Pure Mathematics", "Chemistry"]);
      setSubject("Physics");
    }
  }, []);

  const fetchFlashcards = async () => {
    setIsLoading(true);
    setCurrentIdx(0);
    setIsFlipped(false);
    setHasLoaded(true);

    try {
      const res = await fetch("/api/ai/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          count,
          difficulty,
          goal: vector?.goal || "gce",
          education: vector?.education || "al",
        }),
      });
      if (!res.ok) throw new Error("Failed to load flashcards");
      const data = await res.json();
      setCards(data.cards || []);
    } catch (err) {
      console.error("Flashcards load error:", err);
      // fallback
      setCards([
        {
          front: `What is a core concept of ${subject}?`,
          back: `This represents a fundamental building block of learning within the study fields of ${subject}.`,
        },
        {
          front: `How can you master ${subject} for examinations?`,
          back: "Through daily active recall training, summary bite reviews, and GCE past papers drills.",
        },
      ].slice(0, count));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#FAF7EC] pb-24 antialiased font-sans selection:bg-[#B6FF00]">
      {/* Page Content Container */}
      <main className="w-full max-w-md mx-auto p-4 flex flex-col min-h-[90vh] justify-between animate-page-in">
        
        {/* Header */}
        <header className="flex items-center justify-between w-full mb-6 py-2">
          <Link
            href="/explore"
            className="w-11 h-11 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all"
            aria-label="Back to explore"
          >
            <svg className="w-6 h-6 stroke-[3.5px] text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          
          <div className="text-right">
            <span className="text-[10px] font-black uppercase text-[#965A18] tracking-widest block">
              Active Recall Tool
            </span>
            <h1 className="text-sm font-black text-black">
              AI Flash Cards
            </h1>
          </div>
        </header>

        {/* Customizer Panel or Cards Viewer */}
        <div className="flex-1 flex flex-col justify-center w-full">
          {!hasLoaded ? (
            /* Card Subject Configuration Form */
            <div className="bg-white border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-5">
              <div className="text-left space-y-1">
                <h2 className="text-xl font-black uppercase text-black">
                  Select Study Subject
                </h2>
                <p className="text-xs font-bold text-stone-500">
                  Ticha AI will generate active recall cards tailored to this topic.
                </p>
              </div>

              <div className="space-y-4">
                {/* Subject Selector */}
                <div className="flex flex-col space-y-1.5 text-left">
                  <label className="text-xs font-extrabold uppercase tracking-widest text-stone-850">
                    Target Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-white border-[2.5px] border-black rounded-xl p-3.5 font-bold text-sm outline-none transition-all focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    {struggles.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    <option value="Physics">Physics</option>
                    <option value="Pure Mathematics">Pure Mathematics</option>
                    <option value="Advanced Chemistry">Advanced Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                {/* Card Count select button group */}
                <div className="flex flex-col space-y-1.5 text-left">
                  <label className="text-xs font-extrabold uppercase tracking-widest text-stone-850">
                    Number of Cards
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setCount(num)}
                        className={`py-2 font-black rounded-xl border-[2.5px] border-black text-xs transition-all ${
                          count === num
                            ? "bg-[#B6FF00] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-0.5"
                            : "bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 hover:bg-stone-50"
                        }`}
                      >
                        {num} Cards
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty selector button group */}
                <div className="flex flex-col space-y-1.5 text-left">
                  <label className="text-xs font-extrabold uppercase tracking-widest text-stone-850">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Easy", "Medium", "Hard"].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setDifficulty(lvl)}
                        className={`py-2.5 font-black rounded-xl border-[2.5px] border-black text-xs transition-all ${
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

              <button
                onClick={fetchFlashcards}
                className="w-full bg-[#B6FF00] hover:bg-[#a3e600] border-[3.5px] border-black rounded-xl py-4 font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-center text-black"
              >
                🧠 Generate Flashcards
              </button>
            </div>
          ) : isLoading ? (
            /* Loading Spinner */
            <div className="bg-white border-[3.5px] border-black rounded-2xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-4">
              <div className="w-12 h-12 border-[5px] border-black border-t-[#B6FF00] rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-black uppercase tracking-wider text-black">
                Tailoring Flashcards for {subject}...
              </p>
            </div>
          ) : (
            /* Cards interactive screen */
            <div className="space-y-6">
              
              {/* Tracker Header */}
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-black uppercase tracking-wider text-stone-700">
                  Card {currentIdx + 1} of {cards.length}
                </span>
                <span className="text-[10px] font-black uppercase text-stone-500">
                  {subject}
                </span>
              </div>

              {/* 3D-Like Flipping Flashcard Wrapper */}
              <div 
                onClick={handleFlip}
                className="w-full h-64 cursor-pointer relative"
                style={{ perspective: "1000px" }}
              >
                <div 
                  className={`w-full h-full relative transition-transform duration-500 transform-style-3d ${
                    isFlipped ? "rotate-y-180" : ""
                  }`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Card Front Face */}
                  <div 
                    className="absolute inset-0 bg-white border-[3.5px] border-black rounded-2xl p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] backface-hidden flex flex-col justify-between items-center text-center"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <span className="text-xs font-black uppercase text-stone-400 tracking-wider">
                      Question / Term
                    </span>
                    <p className="text-lg font-black text-black leading-snug px-2">
                      {cards[currentIdx]?.front}
                    </p>
                    <span className="text-[9px] font-black uppercase text-stone-500 bg-stone-100 border-[1.5px] border-black rounded px-2.5 py-1">
                      Tap to reveal answer 🔄
                    </span>
                  </div>

                  {/* Card Back Face */}
                  <div 
                    className="absolute inset-0 bg-[#FFE5C4] border-[3.5px] border-black rounded-2xl p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] backface-hidden rotate-y-180 flex flex-col justify-between items-center text-center"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  >
                    <span className="text-xs font-black uppercase text-[#965A18] tracking-wider">
                      AI Explanation
                    </span>
                    <p className="text-base font-bold text-black leading-snug px-2">
                      {cards[currentIdx]?.back}
                    </p>
                    <span className="text-[9px] font-black uppercase text-stone-850 bg-white border-[1.5px] border-black rounded px-2.5 py-1">
                      Tap to view question 🔄
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handlePrev}
                  className="bg-white hover:bg-stone-50 border-[2.5px] border-black rounded-xl py-3 font-black text-sm uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none"
                >
                  ◀ Previous
                </button>
                <button
                  onClick={handleNext}
                  className="bg-white hover:bg-stone-50 border-[2.5px] border-black rounded-xl py-3 font-black text-sm uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none"
                >
                  Next ▶
                </button>
              </div>

              {/* Reset / Go back btn */}
              <button
                onClick={() => setHasLoaded(false)}
                className="w-full bg-[#FFD9E0] hover:bg-[#ffbacc] border-[3px] border-black rounded-xl py-3.5 font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none"
              >
                📁 Choose Different Subject
              </button>

            </div>
          )}
        </div>

      </main>

      {/* Bottom Navigation */}
      <BottomNav items={navItems} />
    </div>
  );
}
