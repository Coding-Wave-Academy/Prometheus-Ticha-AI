"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import OnboardingProgressBar from "@/components/onboarding/OnboardingProgressBar";

interface SubjectStruggle {
  id: string;
  name: string;
  iconEmoji: string;
  iconBg: string;
  iconBorder: string;
}

interface ApiSubject {
  id: string;
  name: string;
  iconBg?: string;
  iconEmoji?: string;
}

function getDefaultEmoji(slug: string): string {
  const s = slug.toLowerCase();
  if (s.includes("math") || s.includes("calculus")) return "➗";
  if (s.includes("phys")) return "⚡";
  if (s.includes("chem")) return "🧪";
  if (s.includes("bio")) return "🧬";
  if (s.includes("eng") || s.includes("lit")) return "📖";
  if (s.includes("cs") || s.includes("ict") || s.includes("comp")) return "💻";
  if (s.includes("french") || s.includes("fran")) return "🇫🇷";
  if (s.includes("hist")) return "📜";
  if (s.includes("geo")) return "🌍";
  if (s.includes("econ")) return "📊";
  if (s.includes("account")) return "🧮";
  return "📚";
}

function getDefaultIconBg(slug: string): { bg: string; border: string } {
  const s = slug.toLowerCase();
  if (s.includes("math") || s.includes("calculus"))
    return { bg: "bg-[#DBEAFE]", border: "border-[#93C5FD]" };
  if (s.includes("phys"))
    return { bg: "bg-[#FEF9C3]", border: "border-[#FDE68A]" };
  if (s.includes("chem"))
    return { bg: "bg-[#CCFBF1]", border: "border-[#99F6E4]" };
  if (s.includes("bio"))
    return { bg: "bg-[#D1FAE5]", border: "border-[#A7F3D0]" };
  if (s.includes("eng") || s.includes("lit"))
    return { bg: "bg-[#FFE4E6]", border: "border-[#FECDD3]" };
  if (s.includes("cs") || s.includes("ict") || s.includes("comp"))
    return { bg: "bg-[#F3E8FF]", border: "border-[#E9D5FF]" };
  return { bg: "bg-[#FFF7ED]", border: "border-[#FED7AA]" };
}

const FALLBACK_SUBJECTS: SubjectStruggle[] = [
  {
    id: "math",
    name: "Pure Mathematics",
    iconEmoji: "➗",
    iconBg: "bg-[#DBEAFE]",
    iconBorder: "border-[#93C5FD]",
  },
  {
    id: "physics",
    name: "Advanced Physics",
    iconEmoji: "⚡",
    iconBg: "bg-[#FEF9C3]",
    iconBorder: "border-[#FDE68A]",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    iconEmoji: "🧪",
    iconBg: "bg-[#CCFBF1]",
    iconBorder: "border-[#99F6E4]",
  },
  {
    id: "biology",
    name: "Biology",
    iconEmoji: "🧬",
    iconBg: "bg-[#D1FAE5]",
    iconBorder: "border-[#A7F3D0]",
  },
  {
    id: "english",
    name: "English Language",
    iconEmoji: "📖",
    iconBg: "bg-[#FFE4E6]",
    iconBorder: "border-[#FECDD3]",
  },
  {
    id: "further_math",
    name: "Further Mathematics",
    iconEmoji: "🔢",
    iconBg: "bg-[#F3E8FF]",
    iconBorder: "border-[#E9D5FF]",
  },
];

export default function StrugglesPage() {
  const router = useRouter();
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(
    new Set()
  );
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [customSubjects, setCustomSubjects] = useState<SubjectStruggle[]>([]);
  const [aiSubjects, setAiSubjects] = useState<SubjectStruggle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStruggles = async () => {
      try {
        const goal =
          typeof window !== "undefined"
            ? localStorage.getItem("ticha_onboarding_goal") || "gce"
            : "gce";
        const education =
          typeof window !== "undefined"
            ? localStorage.getItem("ticha_onboarding_education") || "al"
            : "al";

        const res = await fetch("/api/ai/struggles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ goal, education }),
        });
        if (!res.ok) throw new Error("API call failed");

        const data = await res.json();
        const mapped: SubjectStruggle[] = (data.subjects || [])
          .slice(0, 6)
          .map((sub: ApiSubject) => {
            const colors = getDefaultIconBg(sub.id);
            return {
              id: sub.id,
              name: sub.name,
              iconEmoji: sub.iconEmoji || getDefaultEmoji(sub.id),
              iconBg: colors.bg,
              iconBorder: colors.border,
            };
          });
        setAiSubjects(mapped.length > 0 ? mapped : FALLBACK_SUBJECTS);
      } catch {
        setAiSubjects(FALLBACK_SUBJECTS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStruggles();
  }, []);

  const subjects = [...aiSubjects, ...customSubjects];

  const toggleSubject = (id: string) => {
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

    const existing = subjects.find(
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
    const colors = getDefaultIconBg(trimmed);
    const newSubject: SubjectStruggle = {
      id: newId,
      name: trimmed,
      iconEmoji: getDefaultEmoji(trimmed),
      iconBg: colors.bg,
      iconBorder: colors.border,
    };

    setCustomSubjects((prev) => [...prev, newSubject]);
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
          const sub = subjects.find((s) => s.id === id);
          return sub ? sub.name : id;
        })
      )
    );

    localStorage.setItem(
      "ticha_onboarding_struggles",
      JSON.stringify(chosenNames)
    );
    router.push("/register");
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
      <main className="w-full max-w-md mx-auto px-5 pt-6 pb-4 flex-1 flex flex-col justify-between relative z-10">
        <div>
          {/* Shared Progress Bar (Step 4 of 4) */}
          <OnboardingProgressBar currentStep={4} totalSteps={4} />

          {/* Heading */}
          <div className="mt-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0A0A0F] leading-[1.15] tracking-tight">
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
              Select subjects that are tough — Ticha AI will build a
              personalized daily learning plan for you.
            </p>
          </div>

          {/* Subject Struggle Cards */}
          <div className="mt-5 space-y-3">
            {isLoading ? (
              <div className="w-full bg-white border-[2px] border-black rounded-3xl p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-8 h-8 border-[3px] border-black border-t-[#C8FF2A] rounded-full animate-spin" />
                <p className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Finding your challenge areas...
                </p>
              </div>
            ) : (
              <>
                {/* Subject Cards — 2-column grid */}
                <div className="grid grid-cols-2 gap-3">
                  {subjects.map((subject, idx) => {
                    const isSelected = selectedSubjects.has(subject.id);
                    return (
                      <motion.button
                        key={subject.id}
                        type="button"
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          delay: 0.05 + idx * 0.05,
                          duration: 0.25,
                        }}
                        onClick={() => toggleSubject(subject.id)}
                        className={`p-3.5 rounded-3xl flex flex-col justify-between text-left transition-all cursor-pointer relative min-h-[100px] ${
                          isSelected
                            ? "bg-[#EBFFA8] border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                            : "bg-white border-[2px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-50"
                        }`}
                      >
                        <div className="flex items-start justify-between w-full">
                          <div
                            className={`w-10 h-10 rounded-2xl ${subject.iconBg} border ${subject.iconBorder} flex items-center justify-center text-xl shadow-inner`}
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
                          <div className="font-bold text-sm text-[#0A0A0F] leading-tight font-heading">
                            {subject.name}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Add Custom Subject */}
                <AnimatePresence>
                  {isAddingCustom ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="w-full p-3.5 rounded-3xl border-[2px] border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3 overflow-hidden"
                    >
                      <input
                        type="text"
                        placeholder="Subject name..."
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        className="w-full bg-white border-[2px] border-black rounded-xl p-2.5 text-sm font-bold outline-none focus:border-[#FF882E]"
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
                          className="bg-stone-200 border-[2px] border-black rounded-xl px-4 py-2 font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveCustom}
                          className="bg-[#C8FF2A] border-[2px] border-black rounded-xl px-4 py-2 font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.button
                      type="button"
                      onClick={() => setIsAddingCustom(true)}
                      className="w-full p-3 rounded-3xl border-[2px] border-dashed border-black/40 flex items-center justify-center gap-2 text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
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
                      <span className="font-bold text-sm">
                        Add another subject
                      </span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5">
          <button
            onClick={handleContinue}
            disabled={selectedSubjects.size === 0 || isLoading}
            className={`w-full py-3.5 px-6 rounded-2xl border-[2.5px] border-black font-bold text-base md:text-lg flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all font-heading uppercase tracking-wider ${
              selectedSubjects.size > 0 && !isLoading
                ? "bg-[#C8FF2A] hover:bg-[#b8f01c] text-[#0A0A0F] cursor-pointer"
                : "bg-stone-200 text-stone-400 cursor-not-allowed opacity-70"
            }`}
          >
            <span>CONTINUE</span>
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
