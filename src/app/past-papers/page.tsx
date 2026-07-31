"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";
import { usePapers } from "@/hooks/usePapers";
import { Paper } from "@/types/paper";

import PaperLevelTabs from "@/components/papers/PaperLevelTabs";
import PaperFilterBar from "@/components/papers/PaperFilterBar";
import PaperCard from "@/components/papers/PaperCard";
import PaperDetailModal from "@/components/papers/PaperDetailModal";
import PaperSkeleton from "@/components/papers/PaperSkeleton";

export default function PastPapersPage() {
  const { t } = useTranslation();
  const navItems = useNavItems();

  const [isMounted, setIsMounted] = useState(false);
  const [selectedPaperForModal, setSelectedPaperForModal] = useState<Paper | null>(null);

  const {
    levels,
    subjects,
    papers,
    loading,
    downloadingId,
    error,
    activeLevel,
    activeSubject,
    activeYear,
    searchQuery,
    page,
    totalPages,
    totalPapers,
    setPage,
    handleLevelChange,
    handleSubjectChange,
    handleYearChange,
    handleSearchChange,
    clearFilters,
    handleDownload,
  } = usePapers();

  // Prevent SSR hydration mismatch for client storage i18n
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center p-4">
        <div className="w-12 h-12 border-[4px] border-black border-t-[#B6FF00] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7EC] flex flex-col justify-between pb-28 text-stone-900 font-sans">
      <main className="flex-1 w-full max-w-md md:max-w-4xl xl:max-w-6xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-6">
        {/* Page Header */}
        <header className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#B6FF00] border-[2.5px] border-black rounded-full font-black text-xs uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              📁 OFFICIAL EXAM ARCHIVES
            </span>
          </div>

          <h1 className="font-black text-2xl md:text-4xl uppercase tracking-tight text-stone-900">
            {t("pastPapersVault.title")}
          </h1>
          <p className="font-medium text-sm md:text-base text-stone-600 max-w-2xl leading-relaxed">
            {t("pastPapersVault.subtitle")}
          </p>
        </header>

        {/* Level Selector Tabs */}
        <section aria-label="Educational Levels">
          <PaperLevelTabs
            levels={levels}
            activeLevel={activeLevel}
            onSelectLevel={handleLevelChange}
          />
        </section>

        {/* Search & Subject / Year Filters */}
        <section aria-label="Search and Filters">
          <PaperFilterBar
            subjects={subjects}
            activeSubject={activeSubject}
            activeYear={activeYear}
            searchQuery={searchQuery}
            onSubjectChange={handleSubjectChange}
            onYearChange={handleYearChange}
            onSearchChange={handleSearchChange}
            onClearFilters={clearFilters}
          />
        </section>

        {/* Results Counter Banner */}
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-stone-700 pt-2 border-b-[2.5px] border-black pb-2">
          <span>
            {loading ? "Searching..." : `${totalPapers} ${totalPapers === 1 ? "Paper" : "Papers"} Available`}
          </span>
          {activeLevel && (
            <span className="px-2.5 py-0.5 bg-white border-[2px] border-black rounded-md shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
              LEVEL: {activeLevel}
            </span>
          )}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-[#FF9494] border-[3px] border-black rounded-xl p-4 font-bold text-sm text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Papers Grid */}
        <section aria-label="Past Papers Grid">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <PaperSkeleton />
              <PaperSkeleton />
              <PaperSkeleton />
              <PaperSkeleton />
            </div>
          ) : papers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {papers.map((paper) => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  isDownloading={downloadingId === paper.id}
                  onDownload={handleDownload}
                  onOpenDetails={(p) => setSelectedPaperForModal(p)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="w-full bg-white border-[3.5px] border-black rounded-2xl p-8 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4 my-6">
              <div className="w-16 h-16 bg-[#FAF7EC] border-[3px] border-black rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                📂
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-xl text-stone-900 uppercase">
                  {t("pastPapersVault.noResultsTitle")}
                </h3>
                <p className="font-medium text-sm text-stone-600 max-w-md mx-auto">
                  {t("pastPapersVault.noResultsDesc")}
                </p>
              </div>
              <button
                type="button"
                onClick={clearFilters}
                className="px-5 py-2.5 bg-[#B6FF00] text-black border-[3px] border-black rounded-xl font-extrabold text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
              >
                {t("pastPapersVault.clearFilters")}
              </button>
            </div>
          )}
        </section>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <nav aria-label="Pagination" className="flex items-center justify-between gap-3 pt-4 border-t-[3px] border-black">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className={`min-h-[44px] px-4 py-2 bg-white border-[3px] border-black rounded-xl font-bold text-xs md:text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer ${
                page <= 1 ? "opacity-50 cursor-not-allowed bg-stone-100" : "hover:bg-stone-100"
              }`}
            >
              ← {t("pastPapersVault.prev")}
            </button>

            <span className="font-black text-xs md:text-sm uppercase tracking-widest text-stone-800 bg-white px-3 py-1.5 border-[2.5px] border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {t("pastPapersVault.page")} {page} {t("pastPapersVault.of")} {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className={`min-h-[44px] px-4 py-2 bg-white border-[3px] border-black rounded-xl font-bold text-xs md:text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer ${
                page >= totalPages ? "opacity-50 cursor-not-allowed bg-stone-100" : "hover:bg-stone-100"
              }`}
            >
              {t("pastPapersVault.next")} →
            </button>
          </nav>
        )}
      </main>

      {/* Paper Detail Modal */}
      <PaperDetailModal
        paper={selectedPaperForModal}
        isOpen={Boolean(selectedPaperForModal)}
        isDownloading={downloadingId === selectedPaperForModal?.id}
        onClose={() => setSelectedPaperForModal(null)}
        onDownload={handleDownload}
      />

      {/* Fixed PWA Bottom Navigation */}
      <BottomNav items={navItems} />
    </div>
  );
}
