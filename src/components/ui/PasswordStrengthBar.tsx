"use client";

import React from "react";
import { PasswordStrength } from "@/hooks/usePasswordStrength";

interface PasswordStrengthBarProps {
  strength: PasswordStrength;
  showChecks?: boolean;
}

export default function PasswordStrengthBar({
  strength,
  showChecks = true,
}: PasswordStrengthBarProps) {
  // 5 segments
  const totalSegments = 5;

  return (
    <div className="space-y-2 mt-2 w-full">
      {/* 5-segment strength bar + label */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex gap-1.5 h-2">
          {Array.from({ length: totalSegments }).map((_, index) => {
            const isFilled = index < strength.score;
            return (
              <div
                key={index}
                className={`flex-1 h-full rounded-full transition-all duration-300 ${
                  isFilled ? "bg-[#C8FF2A] border-[1px] border-black" : "bg-stone-200"
                }`}
              />
            );
          })}
        </div>
        <span className="text-xs font-bold text-stone-700 min-w-[70px] text-right">
          {strength.label}
        </span>
      </div>

      {/* Individual checks in 2 columns */}
      {showChecks && (
        <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-1">
          {strength.checks.map((check) => (
            <li
              key={check.label}
              className={`text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                check.passed ? "text-[#0A0A0F]" : "text-stone-400"
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                  check.passed
                    ? "bg-[#C8FF2A] border-[1px] border-black text-black font-black"
                    : "border-[1.5px] border-stone-300"
                }`}
              >
                {check.passed ? "✓" : ""}
              </span>
              <span className="truncate">{check.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

