"use client";

import React from "react";
import { EducationLevel } from "@/types/leaderboard";

interface LevelToggleProps {
  value: EducationLevel;
  onChange: (level: EducationLevel) => void;
}

const LEVELS: { id: EducationLevel; label: string; bgActive: string }[] = [
  { id: "secondary", label: "Secondary", bgActive: "bg-[#FFB040]" },
  { id: "tertiary",  label: "Tertiary",  bgActive: "bg-white" },
];

/**
 * LevelToggle — Secondary / Tertiary two-button toggle.
 */
export default function LevelToggle({ value, onChange }: LevelToggleProps) {
  return (
    <section className="grid grid-cols-2 gap-4 w-full mb-6">
      {LEVELS.map((item) => {
        const isActive = value === item.id;
        return (
          <button
            key={item.id}
            id={`level-toggle-${item.id}`}
            onClick={() => onChange(item.id)}
            className={`w-full py-4 px-4 rounded-xl border-[3.5px] border-black text-lg font-black uppercase tracking-wider transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] ${
              isActive ? item.bgActive : "bg-white hover:bg-stone-50"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </section>
  );
}
