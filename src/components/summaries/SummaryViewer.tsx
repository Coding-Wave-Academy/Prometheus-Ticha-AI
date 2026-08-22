"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import VerifiedBadge from "./VerifiedBadge";

interface SummaryData {
  title: string;
  overview: string;
  keyConceptsIntro?: string;
  keyConcepts: {
    term: string;
    definition: string;
    example?: string;
  }[];
  formulas: {
    name: string;
    formula: string;
    meaning: string;
  }[];
  examTips: string[];
  commonMistakes: string[];
  practicePrompt: string;
}

interface SummaryViewerProps {
  summary: SummaryData;
  isGrounded: boolean;
  chunksUsed: number;
  isLoading: boolean;
}

/**
 * Renders a structured topic summary with neobrutalist styling.
 * Shows keyConcepts, formulas, exam tips, common mistakes, and practice prompt.
 */
export default function SummaryViewer({
  summary,
  isGrounded,
  chunksUsed,
  isLoading,
}: SummaryViewerProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="mt-6 space-y-4">
        {/* Skeleton loader */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-2xl border-[3.5px] border-black bg-white animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  return (
    <section className="mt-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-black uppercase tracking-tight text-black">
          {summary.title}
        </h2>
        <VerifiedBadge isGrounded={isGrounded} chunksUsed={chunksUsed} />
      </div>

      {/* Overview */}
      <div className="p-5 rounded-2xl border-[3.5px] border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-stone-800 mb-2">
          {t("summaries.overview", "Overview")}
        </h3>
        <p className="text-[15px] font-medium text-stone-700 leading-relaxed">
          {summary.overview}
        </p>
      </div>

      {/* Key Concepts */}
      {summary.keyConcepts && summary.keyConcepts.length > 0 && (
        <div className="p-5 rounded-2xl border-[3.5px] border-black bg-[#B6FF00] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-black mb-3">
            {t("summaries.keyConcepts", "Key Concepts")}
          </h3>
          {summary.keyConceptsIntro && (
            <p className="text-sm font-medium text-stone-800 mb-3">
              {summary.keyConceptsIntro}
            </p>
          )}
          <div className="space-y-3">
            {summary.keyConcepts.map((concept, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border-[2.5px] border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <span className="block text-sm font-black uppercase tracking-tight text-black">
                  {concept.term}
                </span>
                <span className="block text-[13px] font-medium text-stone-700 mt-1">
                  {concept.definition}
                </span>
                {concept.example && (
                  <span className="block text-[12px] font-medium text-stone-500 mt-1 italic">
                    {t("summaries.example", "Example")}: {concept.example}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulas */}
      {summary.formulas && summary.formulas.length > 0 && (
        <div className="p-5 rounded-2xl border-[3.5px] border-black bg-[#FFDF9E] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-black mb-3">
            {t("summaries.formulas", "Essential Formulas")}
          </h3>
          <div className="space-y-3">
            {summary.formulas.map((formula, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border-[2.5px] border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <span className="block text-xs font-extrabold uppercase tracking-widest text-stone-800">
                  {formula.name}
                </span>
                <span className="block text-lg font-black text-black mt-1 font-mono">
                  {formula.formula}
                </span>
                <span className="block text-[13px] font-medium text-stone-600 mt-1">
                  {formula.meaning}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exam Tips */}
      {summary.examTips && summary.examTips.length > 0 && (
        <div className="p-5 rounded-2xl border-[3.5px] border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-stone-800 mb-3">
            🎯 {t("summaries.examTips", "Exam Tips")}
          </h3>
          <ul className="space-y-2">
            {summary.examTips.map((tip, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-[14px] font-medium text-stone-700"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border-[2px] border-black bg-[#B6FF00] text-[10px] font-black flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Common Mistakes */}
      {summary.commonMistakes && summary.commonMistakes.length > 0 && (
        <div className="p-5 rounded-2xl border-[3.5px] border-black bg-[#FF9494] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-black mb-3">
            ⚠️ {t("summaries.commonMistakes", "Common Mistakes")}
          </h3>
          <ul className="space-y-2">
            {summary.commonMistakes.map((mistake, idx) => (
              <li
                key={idx}
                className="text-[14px] font-medium text-black flex items-start gap-2"
              >
                <span className="text-black font-black flex-shrink-0">✗</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Practice Prompt */}
      {summary.practicePrompt && (
        <div className="p-5 rounded-2xl border-[3.5px] border-black bg-[#D3E2FF] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-black mb-2">
            💡 {t("summaries.tryThis", "Try This")}
          </h3>
          <p className="text-[15px] font-bold text-black leading-relaxed">
            {summary.practicePrompt}
          </p>
        </div>
      )}
    </section>
  );
}
