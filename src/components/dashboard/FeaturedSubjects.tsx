"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import { SubjectData } from "@/types";

interface FeaturedSubjectsProps {
  subjects: SubjectData[];
  currentLevel: string;
  onSubjectClick: (id: string) => void;
  onSeeMore: () => void;
}

/**
 * FeaturedSubjects — list of subject progress cards pulled from the student's
 * struggles selections during onboarding. Each card shows a coloured icon,
 * category, title, subtitle, progress badge, and a quick-navigate arrow.
 */
export default function FeaturedSubjects({
  subjects,
  currentLevel,
  onSubjectClick,
  onSeeMore,
}: FeaturedSubjectsProps) {
  const { t } = useTranslation();

  return (
    <section className="w-full mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 pl-1">
        <h3 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A]">
          {t("dashboard.featured")}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-700 bg-white px-2 py-1 border-[1.5px] border-black rounded shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
            {currentLevel}
          </span>
          <button
            id="featured-see-more"
            onClick={onSeeMore}
            className="text-sm font-bold text-[#1A1A1A] underline decoration-2 underline-offset-2 hover:text-[#965A18] transition-colors"
          >
            {t("dashboard.seeMore")}
          </button>
        </div>
      </div>

      {/* Subject Cards */}
      <div className="space-y-4">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            onClick={() => onSubjectClick(subject.id)}
            className={`${subject.bgColor} border-[3.5px] border-black rounded-xl p-4 flex items-center gap-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] relative cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all`}
          >
            {/* Icon Circle */}
            <div className="w-14 h-14 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
              {subject.icon}
            </div>

            {/* Subject Info */}
            <div className="flex-1 space-y-0.5 min-w-0">
              <span className="text-[11px] font-black uppercase tracking-widest text-stone-800 opacity-90 block">
                {subject.category}
              </span>
              <h4 className="text-lg font-black text-black leading-tight truncate">
                {subject.title}
              </h4>
              <p className="text-xs font-medium text-stone-900 leading-tight truncate">
                {subject.subtitle}
              </p>
            </div>

            {/* Progress + Navigate */}
            <div className="flex flex-col items-end gap-3 flex-shrink-0">
              <div className="bg-[#1A1A1A] text-[#B6FF00] rounded-full py-1 px-3.5 font-bold text-xs tracking-tight shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                {subject.progress}%
              </div>
              <div
                className="w-8 h-8 bg-white border-[2px] border-black rounded-full flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                <svg className="w-4 h-4 stroke-[3px] text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
