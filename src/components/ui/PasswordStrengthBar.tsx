"use client";

import React from "react";
import { PasswordStrength } from "@/hooks/usePasswordStrength";

interface PasswordStrengthBarProps {
  strength: PasswordStrength;
  /** Show the individual check items below the bar */
  showChecks?: boolean;
}

/**
 * PasswordStrengthBar — visual password strength indicator.
 *
 * Renders a segmented progress bar with a label + optional per-check breakdown.
 * Follows the neobrutalist design system.
 */
export default function PasswordStrengthBar({
  strength,
  showChecks = false,
}: PasswordStrengthBarProps) {
  // Render checks even when empty if showChecks is true
  const isVisible = showChecks || strength.score > 0;
  if (!isVisible) return null;

  return (
    <div className="space-y-2 mt-2">
      {/* Strength bar + label */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-[6px] bg-stone-200 rounded-full overflow-hidden border-[1.5px] border-black">
          <div
            className={`h-full ${strength.color} transition-all duration-300 ease-out rounded-full`}
            style={{ width: `${strength.percent}%` }}
          />
        </div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-stone-700 min-w-[80px] text-right">
          {strength.label}
        </span>
      </div>

      {/* Individual checks */}
      {showChecks && (
        <ul className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1">
          {strength.checks.map((check) => (
            <li
              key={check.label}
              className={`text-xs font-bold flex items-center gap-1.5 ${
                check.passed ? "text-stone-800" : "text-stone-400"
              }`}
            >
              <span className="text-sm leading-none">
                {check.passed ? "✓" : "○"}
              </span>
              {check.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
