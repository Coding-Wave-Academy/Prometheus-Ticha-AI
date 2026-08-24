"use client";

import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";
import { useStreak } from "@/hooks/useStreak";
import { useIsMounted } from "@/hooks/useIsMounted";
import SubjectSelector from "@/components/summaries/SubjectSelector";
import TopicList from "@/components/summaries/TopicList";
import SummaryViewer from "@/components/summaries/SummaryViewer";
import { GCE_SYLLABUS_DATA } from "@/lib/gceSyllabusData";
import type { TopicItem } from "@/lib/gceSyllabusData";

interface SummaryResponse {
  summary: {
    title: string;
    overview: string;
    keyConceptsIntro?: string;
    keyConcepts: { term: string; definition: string; example?: string }[];
    formulas: { name: string; formula: string; meaning: string }[];
    examTips: string[];
    commonMistakes: string[];
    practicePrompt: string;
  };
  isGrounded: boolean;
  chunksUsed: number;
}

export default function SummariesPage() {
  const navItems = useNavItems();
  const isMounted = useIsMounted();
  const { claimDailyStreak } = useStreak();
  const { t } = useTranslation();

  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
  const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubjectSelect = useCallback((subjectId: string) => {
    setSelectedSubject(subjectId);
    setSelectedTopic(null);
    setSummaryData(null);
    setError(null);
  }, []);

  const handleTopicSelect = useCallback(
    async (topic: TopicItem) => {
      if (!selectedSubject) return;

      setSelectedTopic(topic);
      setError(null);
      setIsLoading(true);
      setSummaryData(null);

      try {
        const syllabus = GCE_SYLLABUS_DATA[selectedSubject];
        const subjectName = syllabus?.name || selectedSubject;

        const res = await fetch("/api/rag/summaries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: subjectName,
            topic: topic.title,
            educationLevel: syllabus?.level || "al",
          }),
        });

        if (!res.ok) {
          throw new Error(`Failed to generate summary (${res.status})`);
        }

        const data: SummaryResponse = await res.json();
        setSummaryData(data);
        // Auto-claim streak for engaging with study material
        claimDailyStreak().catch(() => {});
      } catch (err) {
        console.error("Summary fetch error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to generate summary. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [selectedSubject]
  );

  const handleBack = useCallback(() => {
    if (summaryData || selectedTopic) {
      setSelectedTopic(null);
      setSummaryData(null);
      setError(null);
    } else if (selectedSubject) {
      setSelectedSubject(null);
    }
  }, [summaryData, selectedTopic, selectedSubject]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#FAF7EC] flex flex-col pb-28">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-[3px] border-black border-t-[#B6FF00] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7EC] flex flex-col pb-28">
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-6 md:max-w-2xl lg:max-w-4xl">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            {(selectedSubject || selectedTopic) && (
              <button
                onClick={handleBack}
                className="w-10 h-10 flex items-center justify-center rounded-xl border-[3px] border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-transform"
                aria-label="Go back"
              >
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M12 5L7 10L12 15"
                    stroke="black"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black">
                {t("summaries.title", "Study Summaries")}
              </h1>
              <p className="text-sm font-medium text-stone-600 mt-0.5">
                {selectedSubject && selectedTopic
                  ? `${GCE_SYLLABUS_DATA[selectedSubject]?.name} — ${selectedTopic.title}`
                  : selectedSubject
                  ? GCE_SYLLABUS_DATA[selectedSubject]?.name
                  : t(
                      "summaries.subtitle",
                      "High-yield revision notes from verified curriculum materials"
                    )}
              </p>
            </div>
          </div>

          {/* Breadcrumb pills */}
          {selectedSubject && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="inline-flex items-center px-3 py-1 rounded-full border-[2.5px] border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-bold">
                📚 {GCE_SYLLABUS_DATA[selectedSubject]?.name}
              </span>
              {selectedTopic && (
                <>
                  <svg className="w-3 h-3 text-stone-400" viewBox="0 0 12 12" fill="none">
                    <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span className="inline-flex items-center px-3 py-1 rounded-full border-[2.5px] border-black bg-[#B6FF00] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-bold">
                    📝 {selectedTopic.title}
                  </span>
                </>
              )}
            </div>
          )}
        </header>

        {/* Error message */}
        {error && (
          <div className="p-3 mb-4 rounded-xl border-[2.5px] border-black bg-[#FF9494] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-sm font-bold text-black">⚠️ {error}</p>
          </div>
        )}

        {/* Step 1: Subject selection */}
        {!selectedSubject && (
          <SubjectSelector
            selectedSubject={selectedSubject}
            onSelect={handleSubjectSelect}
          />
        )}

        {/* Step 2: Topic selection */}
        {selectedSubject && !selectedTopic && !summaryData && (
          <TopicList
            subjectId={selectedSubject}
            selectedTopic={selectedTopic}
            onSelect={handleTopicSelect}
          />
        )}

        {/* Step 3: Summary viewer */}
        {selectedTopic && (isLoading || summaryData) && (
          <SummaryViewer
            summary={summaryData?.summary || ({} as never)}
            isGrounded={summaryData?.isGrounded || false}
            chunksUsed={summaryData?.chunksUsed || 0}
            isLoading={isLoading}
          />
        )}
      </main>

      <BottomNav items={navItems} />
    </div>
  );
}
