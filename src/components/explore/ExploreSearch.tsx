"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

interface ExploreSearchProps {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
}

/**
 * ExploreSearch — neobrutalist search bar with inline Search button.
 * Focus lifts the container; the Search CTA uses the warm accent colour.
 */
export default function ExploreSearch({ value, onChange, onSearch }: ExploreSearchProps) {
  const { t } = useTranslation();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="flex w-full items-center bg-white border-[3.5px] border-black rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] overflow-hidden focus-within:translate-x-[-2px] focus-within:translate-y-[-2px] focus-within:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] transition-all">
      {/* Search Icon */}
      <div className="pl-4 text-stone-500 flex-shrink-0">
        <svg className="w-5 h-5 stroke-[2.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>

      <input
        id="explore-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("explore.searchPlaceholder")}
        className="flex-1 py-3 px-3 text-base font-medium placeholder-stone-500 text-black outline-none bg-transparent"
        aria-label={t("explore.searchPlaceholder")}
      />

      <button
        id="explore-search-btn"
        onClick={onSearch}
        className="bg-[#965A18] text-white font-black text-sm uppercase px-6 py-3.5 border-l-[3.5px] border-black active:bg-[#7A4711] transition-colors flex-shrink-0"
      >
        {t("explore.searchBtn")}
      </button>
    </div>
  );
}
