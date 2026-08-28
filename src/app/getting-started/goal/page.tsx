"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import OnboardingProgressBar from "@/components/onboarding/OnboardingProgressBar";

interface GoalOption {
  id: string;
  title: string;
  subtitle: string;
  iconEmoji: string;
  iconBg: string;
  iconBorder: string;
  isFullWidth?: boolean;
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    id: "gce_ol",
    title: "Pass GCE O/L",
    subtitle: "Form 5 focus",
    iconEmoji: "📚",
    iconBg: "bg-[#FFE8EC]",
    iconBorder: "border-[#FFCCD5]",
  },
  {
    id: "gce_al",
    title: "Pass GCE A/L",
    subtitle: "Upper Sixth",
    iconEmoji: "🎓",
    iconBg: "bg-[#FFF4D9]",
    iconBorder: "border-[#FFE5A3]",
  },
  {
    id: "university_cas",
    title: "Excel in University CAs",
    subtitle: "Continuous Assessment prep",
    iconEmoji: "🏛️",
    iconBg: "bg-[#E0F7FA]",
    iconBorder: "border-[#B2EBF2]",
    isFullWidth: true,
  },
  {
    id: "deep_understanding",
    title: "Deep Understanding",
    subtitle: "Master concepts",
    iconEmoji: "🧠",
    iconBg: "bg-[#F3E8FF]",
    iconBorder: "border-[#E9D5FF]",
  },
  {
    id: "build_confidence",
    title: "Build Confidence",
    subtitle: "Exam readiness",
    iconEmoji: "💪",
    iconBg: "bg-[#FEF9C3]",
    iconBorder: "border-[#FEF08A]",
  },
];

export default function GoalSelectionPage() {
  const router = useRouter();
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["gce_al", "build_confidence"]);

  useEffect(() => {
    const saved = localStorage.getItem("ticha_onboarding_goals");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedGoals(parsed);
        }
      } catch {
        // use default
      }
    }
  }, []);

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // keep at least 1
        return prev.filter((g) => g !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleNext = () => {
    localStorage.setItem("ticha_onboarding_goals", JSON.stringify(selectedGoals));
    localStorage.setItem("ticha_onboarding_goal", selectedGoals.join(","));
    router.push("/getting-started/education");
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

      {/* Decorative Star Sparkle (Top Right) */}
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
          {/* Shared Progress Bar (Step 2 of 4) */}
          <OnboardingProgressBar currentStep={2} totalSteps={4} />

          {/* Heading */}
          <div className="mt-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0A0A0F] leading-[1.15] tracking-tight">
              What&apos;s Your{" "}
              <span className="relative inline-block text-[#84CC16]">
                Main Goal?
                <span className="absolute -bottom-2.5 left-0 w-full pointer-events-none">
                  <Image
                    src="/images/onboarding-icons/Lime Line.svg"
                    alt=""
                    width={140}
                    height={25}
                    className="w-full h-auto"
                  />
                </span>
              </span>
            </h1>
            <p className="text-sm text-stone-600 font-medium mt-2.5 leading-snug">
              Select one or more — we&apos;ll tailor your experience to help you succeed.
            </p>
          </div>

          {/* Goal Cards Grid */}
          <div className="mt-5 space-y-3">
            {/* Top 2 columns */}
            <div className="grid grid-cols-2 gap-3">
              {GOAL_OPTIONS.slice(0, 2).map((goal) => {
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-3.5 rounded-3xl flex flex-col justify-between text-left transition-all cursor-pointer relative min-h-[120px] ${
                      isSelected
                        ? "bg-[#EBFFA8] border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                        : "bg-white border-[2px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className={`w-10 h-10 rounded-2xl ${goal.iconBg} border ${goal.iconBorder} flex items-center justify-center text-xl shadow-inner`}>
                        {goal.iconEmoji}
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
                    <div className="mt-3">
                      <div className="font-bold text-sm text-[#0A0A0F] leading-tight font-heading">
                        {goal.title}
                      </div>
                      <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                        {goal.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Middle Full-Width Card (University CAs) */}
            {GOAL_OPTIONS.slice(2, 3).map((goal) => {
              const isSelected = selectedGoals.includes(goal.id);
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => toggleGoal(goal.id)}
                  className={`w-full p-3.5 rounded-3xl flex items-center justify-between text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#EBFFA8] border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                      : "bg-white border-[2px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl ${goal.iconBg} border ${goal.iconBorder} flex items-center justify-center text-xl shadow-inner`}>
                      {goal.iconEmoji}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#0A0A0F] leading-tight font-heading">
                        {goal.title}
                      </div>
                      <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                        {goal.subtitle}
                      </div>
                    </div>
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
                </button>
              );
            })}

            {/* Bottom 2 columns */}
            <div className="grid grid-cols-2 gap-3">
              {GOAL_OPTIONS.slice(3, 5).map((goal) => {
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-3.5 rounded-3xl flex flex-col justify-between text-left transition-all cursor-pointer relative min-h-[120px] ${
                      isSelected
                        ? "bg-[#EBFFA8] border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                        : "bg-white border-[2px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className={`w-10 h-10 rounded-2xl ${goal.iconBg} border ${goal.iconBorder} flex items-center justify-center text-xl shadow-inner`}>
                        {goal.iconEmoji}
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
                    <div className="mt-3">
                      <div className="font-bold text-sm text-[#0A0A0F] leading-tight font-heading">
                        {goal.title}
                      </div>
                      <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                        {goal.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button & Bottom Doodle */}
        <div className="mt-6">
          {/* Action Button */}
          <button
            onClick={handleNext}
            className="w-full py-3.5 px-6 rounded-2xl border-[2.5px] border-black bg-[#C8FF2A] hover:bg-[#b8f01c] text-[#0A0A0F] font-bold text-base md:text-lg flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer font-heading uppercase tracking-wider"
          >
            <span>NEXT</span>
            <svg className="w-5 h-5 stroke-[2.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}
