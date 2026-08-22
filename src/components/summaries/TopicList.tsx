"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { GCE_SYLLABUS_DATA } from "@/lib/gceSyllabusData";
import type { TopicItem } from "@/lib/gceSyllabusData";

interface TopicListProps {
  subjectId: string;
  selectedTopic: TopicItem | null;
  onSelect: (topic: TopicItem) => void;
}

/**
 * Displays the topic categories and topic items for a selected subject.
 * Topics come from the GCE syllabus data — organized by modules/categories.
 */
export default function TopicList({ subjectId, selectedTopic, onSelect }: TopicListProps) {
  const { t } = useTranslation();
  const syllabus = GCE_SYLLABUS_DATA[subjectId];

  if (!syllabus) return null;

  return (
    <section className="mt-6">
      <h2 className="text-lg font-black uppercase tracking-tight text-stone-800 mb-4">
        {t("summaries.selectTopic", "Select a Topic")}
      </h2>

      <div className="space-y-5">
        {syllabus.categories.map((category) => (
          <div key={category.categoryName}>
            {/* Category divider */}
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[3px] bg-black flex-1" />
              <span className="text-xs font-black uppercase tracking-widest text-stone-800 whitespace-nowrap">
                {category.categoryName}
              </span>
              <div className="h-[3px] bg-black flex-1" />
            </div>

            {/* Topic cards */}
            <div className="space-y-2.5">
              {category.topics.map((topic) => {
                const isSelected = selectedTopic?.id === topic.id;

                return (
                  <button
                    key={topic.id}
                    onClick={() => onSelect(topic)}
                    className={`
                      w-full text-left p-4 rounded-xl border-[3px] border-black
                      transition-transform
                      active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                      ${
                        isSelected
                          ? "bg-[#B6FF00] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                          : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-50"
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="block text-[15px] font-bold text-black leading-tight">
                          {topic.title}
                        </span>
                        <span className="block text-xs font-medium text-stone-600 mt-1 leading-relaxed">
                          {topic.subtitle}
                        </span>
                      </div>

                      {/* Arrow / check icon */}
                      <div className="flex-shrink-0 mt-1">
                        {isSelected ? (
                          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="8" fill="black" />
                            <path d="M6 10L9 13L14 7" stroke="#B6FF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-stone-400" viewBox="0 0 20 20" fill="none">
                            <path d="M7 5L13 10L7 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
