"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import OnboardingProgressBar from "@/components/onboarding/OnboardingProgressBar";
import {
  getGceSubjectsForLevel,
  CAMEROON_GCE_SUBJECTS,
  GceSubject,
} from "@/data/gceSubjects";
import { hapticTap } from "@/lib/haptics";

type CategoryFilter = "all" | "sciences" | "commercial" | "arts";

export default function StrugglesPage() {
  const router = useRouter();
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(
    new Set()
  );
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [customSubjects, setCustomSubjects] = useState<GceSubject[]>([]);
  const [educationLevel, setEducationLevel] = useState<string>("al");

  // Load saved preferences on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEducation =
        localStorage.getItem("ticha_onboarding_education") || "al";
      setEducationLevel(savedEducation);

      const savedStruggles = localStorage.getItem(
        "ticha_onboarding_struggles"
      );
      if (savedStruggles) {
        try {
          const parsed = JSON.parse(savedStruggles);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Find IDs corresponding to saved names or treat as custom
            const matchedIds = new Set<string>();
            const levelSubjects = getGceSubjectsForLevel(savedEducation);
            parsed.forEach((name: string) => {
              const match =
                levelSubjects.find(
                  (s) => s.name.toLowerCase() === name.toLowerCase()
                ) ||
                CAMEROON_GCE_SUBJECTS.find(
                  (s) => s.name.toLowerCase() === name.toLowerCase()
                );
              if (match) {
                matchedIds.add(match.id);
              } else {
                matchedIds.add(name);
              }
            });
            setSelectedSubjects(matchedIds);
          }
        } catch {
          // ignore parsing error
        }
      }
    }
  }, []);

  // Filter subjects strictly according to the student's chosen GCE level (O/L vs A/L)
  const allAvailableSubjects = useMemo(() => {
    const levelSubjects = getGceSubjectsForLevel(educationLevel);
    return [...customSubjects, ...levelSubjects];
  }, [customSubjects, educationLevel]);

  // Filter subjects based on search query and category
  const filteredSubjects = useMemo(() => {
    return allAvailableSubjects.filter((subj) => {
      // Category filter
      if (activeCategory !== "all" && subj.category !== activeCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = subj.name.toLowerCase().includes(query);
        const matchesCode = subj.code.toLowerCase().includes(query);
        return matchesName || matchesCode;
      }
      return true;
    });
  }, [allAvailableSubjects, activeCategory, searchQuery]);

  const toggleSubject = (id: string) => {
    hapticTap();
    setSelectedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSaveCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;

    const existing = allAvailableSubjects.find(
      (s) => s.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) {
      setSelectedSubjects((prev) => {
        const next = new Set(prev);
        next.add(existing.id);
        return next;
      });
      setCustomInput("");
      setIsAddingCustom(false);
      return;
    }

    const newId = `custom-${trimmed.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    const newSubject: GceSubject = {
      id: newId,
      name: trimmed,
      code: "CUSTOM",
      category: "sciences",
      level: "both",
      iconEmoji: "📚",
      iconBg: "bg-[#FFF7ED]",
      iconBorder: "border-[#FED7AA]",
    };

    setCustomSubjects((prev) => [newSubject, ...prev]);
    setSelectedSubjects((prev) => {
      const next = new Set(prev);
      next.add(newId);
      return next;
    });

    setCustomInput("");
    setIsAddingCustom(false);
  };

  const handleContinue = () => {
    if (selectedSubjects.size === 0) return;

    const chosenNames = Array.from(
      new Set(
        Array.from(selectedSubjects).map((id) => {
          const sub = allAvailableSubjects.find((s) => s.id === id);
          return sub ? sub.name : id;
        })
      )
    );

    localStorage.setItem(
      "ticha_onboarding_struggles",
      JSON.stringify(chosenNames)
    );

    // Navigate directly to the new commitment screen!
    router.push("/getting-started/commitment");
  };

  return (
    <div className="min-h-screen bg-[#FFF8F1] flex flex-col justify-between text-[#0A0A0F] relative overflow-hidden font-sans selection:bg-[#C8FF2A]">
      {/* Decorative Polka Dots (Top Right) */}
      <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-80 z-0">
        <Image
          src="/images/onboarding-icons/Orange Top Pokka Dots.svg"
          alt=""
          width={120}
          height={120}
          className="w-full h-full object-contain object-top-right"
        />
      </div>

      {/* Decorative Orange Star */}
      <div className="absolute top-16 right-8 pointer-events-none z-0">
        <Image
          src="/images/onboarding-icons/Orange Star.svg"
          alt=""
          width={28}
          height={28}
          className="animate-pulse"
        />
      </div>

      {/* Main Container */}
      <main className="w-full max-w-md mx-auto px-5 pt-6 pb-5 flex-1 flex flex-col justify-between relative z-10">
        <div>
          {/* Shared Progress Bar (Step 4 of 5) */}
          <OnboardingProgressBar currentStep={4} totalSteps={5} />

          {/* Heading */}
          <div className="mt-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0A0A0F] leading-[1.15] tracking-tight font-heading">
              What{" "}
              <span className="relative inline-block text-[#FF882E]">
                subjects
                <span className="absolute -bottom-2.5 left-0 w-full pointer-events-none">
                  <Image
                    src="/images/onboarding-icons/Orange line.svg"
                    alt=""
                    width={140}
                    height={25}
                    className="w-full h-auto"
                  />
                </span>
              </span>
              <br />
              challenge you?
            </h1>
            <p className="text-sm text-stone-600 font-medium mt-2 leading-snug">
              Select all GCE subjects where you need support — Ticha AI will build your daily mastery roadmap.
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border-[1.5px] border-black text-[11px] font-black uppercase tracking-wider text-stone-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                🎓 {educationLevel === "ol" ? "GCE Ordinary Level (O/L)" : "GCE Advanced Level (A/L)"}
              </span>
              <span className="text-xs font-bold text-stone-500">
                {allAvailableSubjects.length} subjects available
              </span>
            </div>
          </div>

          {/* Search Input */}
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search GCE subjects (e.g. Physics, Economics)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-[2px] border-black rounded-2xl py-2.5 pl-10 pr-9 text-xs md:text-sm font-semibold outline-none focus:border-[#FF882E] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-stone-400"
            />
            <svg
              className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-stone-400 hover:text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full bg-stone-100 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: "all", label: "All Subjects" },
              { id: "sciences", label: "🔬 Sciences & Math" },
              { id: "commercial", label: "📊 Commercial & Social" },
              { id: "arts", label: "📚 Arts & Languages" },
            ].map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    hapticTap();
                    setActiveCategory(tab.id as CategoryFilter);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    isActive
                      ? "bg-[#0A0A0F] text-white border-black shadow-[2px_2px_0px_0px_rgba(200,255,42,1)]"
                      : "bg-white text-stone-700 border-black/30 hover:border-black"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Subject Challenge Cards Grid */}
          <div className="mt-3 space-y-3 max-h-[42vh] overflow-y-auto pr-1">
            {filteredSubjects.length === 0 ? (
              <div className="w-full bg-white border-[2px] border-black rounded-3xl p-6 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-sm font-bold text-stone-700">
                  No subjects found for &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  You can add it below as a custom subject!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {filteredSubjects.map((subject, idx) => {
                  const isSelected = selectedSubjects.has(subject.id);
                  return (
                    <motion.button
                      key={subject.id}
                      type="button"
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: Math.min(0.2, idx * 0.02),
                        duration: 0.2,
                      }}
                      onClick={() => toggleSubject(subject.id)}
                      className={`p-3 rounded-2xl flex flex-col justify-between text-left transition-all cursor-pointer relative min-h-[92px] ${
                        isSelected
                          ? "bg-[#EBFFA8] border-[2.5px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                          : "bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-50"
                      }`}
                    >
                      <div className="flex items-start justify-between w-full">
                        <div
                          className={`w-9 h-9 rounded-xl ${subject.iconBg} border ${subject.iconBorder} flex items-center justify-center text-lg shadow-inner`}
                        >
                          {subject.iconEmoji}
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-[#0A0A0F] text-white text-[10px] font-black"
                              : "border-[1.5px] border-stone-300 bg-white"
                          }`}
                        >
                          {isSelected && "✓"}
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="font-bold text-xs md:text-sm text-[#0A0A0F] leading-snug font-heading line-clamp-2">
                          {subject.name}
                        </div>
                        {subject.level !== "both" && (
                          <span className="inline-block mt-0.5 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/5 text-stone-600">
                            {subject.level === "ol" ? "O-Level" : "A-Level"}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Add Custom Subject */}
            <AnimatePresence>
              {isAddingCustom ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full p-3.5 rounded-2xl border-[2px] border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-2.5 overflow-hidden"
                >
                  <input
                    type="text"
                    placeholder="Enter custom subject name..."
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="w-full bg-white border-[2px] border-black rounded-xl p-2.5 text-xs md:text-sm font-bold outline-none focus:border-[#FF882E]"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveCustom();
                    }}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCustom(false);
                        setCustomInput("");
                      }}
                      className="bg-stone-200 border-[2px] border-black rounded-xl px-3 py-1.5 font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCustom}
                      className="bg-[#C8FF2A] border-[2px] border-black rounded-xl px-4 py-1.5 font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none cursor-pointer"
                    >
                      Add Subject
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  type="button"
                  onClick={() => setIsAddingCustom(true)}
                  className="w-full p-2.5 rounded-2xl border-[2px] border-dashed border-black/40 flex items-center justify-center gap-2 text-stone-600 hover:bg-white/80 transition-colors cursor-pointer bg-white/40"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  <span className="font-bold text-xs md:text-sm">
                    Add another subject
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Bottom Bar (Sticky at bottom so it is always within reach) */}
        <div className="sticky bottom-0 bg-[#FFF8F1]/95 backdrop-blur-md pt-3 pb-3 -mx-5 px-5 border-t border-black/10 flex flex-col gap-2 z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          {selectedSubjects.size > 0 && (
            <div className="flex items-center justify-between text-xs font-bold text-stone-600 px-1">
              <span>{selectedSubjects.size} subject{selectedSubjects.size > 1 ? "s" : ""} selected</span>
              <button
                type="button"
                onClick={() => setSelectedSubjects(new Set())}
                className="text-stone-400 hover:text-black underline cursor-pointer text-[11px]"
              >
                Clear all
              </button>
            </div>
          )}

          <button
            onClick={handleContinue}
            disabled={selectedSubjects.size === 0}
            className={`w-full py-3.5 px-6 rounded-2xl border-[2.5px] border-black font-bold text-base flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all font-heading uppercase tracking-wider ${
              selectedSubjects.size > 0
                ? "bg-[#C8FF2A] hover:bg-[#b8f01c] text-[#0A0A0F] cursor-pointer"
                : "bg-stone-200 text-stone-400 cursor-not-allowed opacity-70"
            }`}
          >
            <span>CONTINUE {selectedSubjects.size > 0 ? `(${selectedSubjects.size})` : ""}</span>
            <svg
              className="w-5 h-5 stroke-[2.5px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}
