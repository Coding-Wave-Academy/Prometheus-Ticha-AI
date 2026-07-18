"use client";

import React from "react";
import { FilterContext } from "@/types/leaderboard";

interface ContextFilterProps {
  value: FilterContext;
  onChange: (ctx: FilterContext) => void;
}

const FILTERS: { id: FilterContext; label: string }[] = [
  { id: "national",  label: "National"  },
  { id: "community", label: "Community" },
  { id: "school",    label: "My School" },
];

/**
 * ContextFilter — National / Community / My School segmented pill control.
 */
export default function ContextFilter({ value, onChange }: ContextFilterProps) {
  return (
    <section className="w-full bg-white border-[2.5px] border-black rounded-lg p-1.5 flex gap-1 mb-8 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
      {FILTERS.map((f) => {
        const isActive = value === f.id;
        return (
          <button
            key={f.id}
            id={`filter-${f.id}`}
            onClick={() => onChange(f.id)}
            className={`flex-1 py-1 px-4 rounded-md font-extrabold uppercase text-[11px] tracking-wider transition-all text-center ${
              isActive
                ? "bg-[#965A18] text-white shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
                : "text-stone-700 hover:text-black"
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </section>
  );
}
