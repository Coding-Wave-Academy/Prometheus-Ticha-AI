"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Subject } from "@/types/paper";

interface PaperFilterBarProps {
  subjects: Subject[];
  activeSubject: string;
  activeYear?: number;
  searchQuery: string;
  onSubjectChange: (subjectCode: string) => void;
  onYearChange: (year?: number) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
}

const AVAILABLE_YEARS = [2024, 2023, 2022, 2021, 2020, 2019, 2018];

export default function PaperFilterBar({
  subjects,
  activeSubject,
  activeYear,
  searchQuery,
  onSubjectChange,
  onYearChange,
  onSearchChange,
  onClearFilters,
}: PaperFilterBarProps) {
  const { t } = useTranslation();

  const hasActiveFilters = activeSubject || activeYear !== undefined || searchQuery.length > 0;

  return (
    <div className="w-full flex flex-col gap-3.5">
      {/* 1. Search Bar */}
      <div className="relative w-full">
        <label htmlFor="past-paper-search" className="sr-only">
          {t("pastPapersVault.searchPlaceholder")}
        </label>
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-black font-bold">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </div>
        <input
          id="past-paper-search"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("pastPapersVault.searchPlaceholder")}
          className="w-full min-h-[48px] pl-11 pr-10 py-3 bg-white border-[3.5px] border-black rounded-xl font-medium text-stone-900 placeholder-stone-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-black font-bold"
            aria-label="Clear search query"
          >
            ✕
          </button>
        )}
      </div>

      {/* 2. Subject Pills & Year Selector */}
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Subject Pills Scrollable Container */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => onSubjectChange("")}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-full border-[2.5px] border-black font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              !activeSubject
                ? "bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white text-stone-800 hover:bg-stone-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            } active:translate-x-[1px] active:translate-y-[1px] active:shadow-none`}
          >
            {t("pastPapersVault.allSubjects")}
          </button>

          {subjects.map((sub) => {
            const isSelected = activeSubject === sub.code;
            return (
              <button
                key={sub.id || sub.code}
                type="button"
                onClick={() => onSubjectChange(sub.code)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-full border-[2.5px] border-black font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#B6FF00] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-extrabold"
                    : "bg-white text-stone-800 hover:bg-stone-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                } active:translate-x-[1px] active:translate-y-[1px] active:shadow-none`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>

        {/* Year Dropdown & Clear Filters */}
        <div className="flex items-center gap-2">
          <select
            id="past-paper-year-select"
            value={activeYear || ""}
            onChange={(e) => onYearChange(e.target.value ? Number(e.target.value) : undefined)}
            aria-label="Filter by Year"
            className="min-h-[40px] px-3 py-1.5 bg-white border-[2.5px] border-black rounded-xl text-xs font-bold text-stone-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer outline-none"
          >
            <option value="">📅 {t("pastPapersVault.allYears")}</option>
            {AVAILABLE_YEARS.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="min-h-[40px] px-3 py-1.5 bg-[#FF9494] text-black border-[2.5px] border-black rounded-xl font-bold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              ✕ {t("pastPapersVault.clearFilters")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
