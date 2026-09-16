"use client";

import React from "react";
import { EducationalLevel } from "@/types/paper";

interface PaperLevelTabsProps {
  levels: EducationalLevel[];
  activeLevel: string;
  onSelectLevel: (levelCode: string) => void;
}

export default function PaperLevelTabs({ levels, activeLevel, onSelectLevel }: PaperLevelTabsProps) {
  // Fallback defaults if levels not yet loaded
  const displayLevels = levels.length > 0 ? levels : [
    { id: "1", code: "O/L", name: "GCE O-Level", sort_order: 1 },
    { id: "2", code: "A/L", name: "GCE A-Level", sort_order: 2 },
    { id: "3", code: "UNIVERSITY", name: "University", sort_order: 3 },
  ];

  return (
    <div className="w-full flex items-center justify-between gap-2 p-1.5 bg-white border-[3.5px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-x-auto no-scrollbar">
      {displayLevels.map((lvl) => {
        const isActive = activeLevel === lvl.code;
        return (
          <button
            key={lvl.id || lvl.code}
            onClick={() => onSelectLevel(lvl.code)}
            type="button"
            className={`flex-1 min-h-[44px] px-3 py-2 text-xs md:text-sm font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 border-[2.5px] whitespace-nowrap cursor-pointer ${
              isActive
                ? "bg-[#B6FF00] text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "bg-stone-50 text-stone-700 border-transparent hover:bg-stone-100 hover:border-black"
            } active:translate-x-[1px] active:translate-y-[1px] active:shadow-none`}
          >
            {lvl.code === "O/L" && <span>📚</span>}
            {lvl.code === "A/L" && <span>🎓</span>}
            {lvl.code === "UNIVERSITY" && <span>🏛️</span>}
            <span>{lvl.name || lvl.code}</span>
          </button>
        );
      })}
    </div>
  );
}
