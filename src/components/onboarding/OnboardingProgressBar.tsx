"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

/**
 * Shared onboarding progress bar component.
 * Renders a back button + N horizontal progress segments that fill based on currentStep.
 * Used across Language, Goal, Education, and Struggles screens.
 * Matches the Language Selector design reference (horizontal bars with border).
 */
export default function OnboardingProgressBar({
  currentStep,
  totalSteps,
}: OnboardingProgressBarProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 mb-5">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        aria-label="Back"
        className="w-10 h-10 rounded-full bg-white border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer shrink-0"
      >
        <svg
          className="w-5 h-5 stroke-[2.5px]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
      </button>

      {/* Progress Segments */}
      <div className="flex-1 flex items-center gap-1.5">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepIndex = i + 1;
          const isFilled = stepIndex <= currentStep;
          return (
            <div
              key={stepIndex}
              className={`flex-1 h-2 rounded-full border-[1.5px] transition-colors ${
                isFilled
                  ? "border-black bg-[#C8FF2A]"
                  : "border-black bg-transparent"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
