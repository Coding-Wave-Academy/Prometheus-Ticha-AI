"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { GCE_SYLLABUS_DATA, ALL_AVAILABLE_SUBJECTS } from "@/lib/gceSyllabusData";

interface SubjectSelectorProps {
  selectedSubject: string | null;
  onSelect: (subjectId: string) => void;
}

/**
 * Subject card grid for the summaries page.
 * Uses the existing GCE_SYLLABUS_DATA for subjects that have syllabus content.
 */
export default function SubjectSelector({ selectedSubject, onSelect }: SubjectSelectorProps) {
  const { t } = useTranslation();

  // Use subjects from ALL_AVAILABLE_SUBJECTS that have syllabus data
  const subjects = ALL_AVAILABLE_SUBJECTS.filter(
    (s) => GCE_SYLLABUS_DATA[s.id]
  );

  return (
    <section>
      <h2 className="text-lg font-black uppercase tracking-tight text-stone-800 mb-4">
        {t("summaries.chooseSubject", "Choose Your Subject")}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {subjects.map((subject) => {
          const isSelected = selectedSubject === subject.id;

          return (
            <button
              key={subject.id}
              onClick={() => onSelect(subject.id)}
              className={`
                relative p-4 rounded-2xl border-[3.5px] border-black
                text-left transition-transform
                active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                ${
                  isSelected
                    ? "bg-[#B6FF00] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    : `${subject.bgColor} shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-50`
                }
              `}
            >
              <span className="block text-sm font-black uppercase tracking-tight text-black">
                {subject.name}
              </span>
              <span className="block text-[11px] font-bold uppercase tracking-widest text-stone-700 mt-1">
                {subject.level === "al" ? "A-Level" : "O-Level"}
              </span>

              {isSelected && (
                <span className="absolute top-2 right-2">
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" fill="black" />
                    <path d="M6 10L9 13L14 7" stroke="#B6FF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
