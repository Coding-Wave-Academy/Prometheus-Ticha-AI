"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Paper } from "@/types/paper";

interface PaperCardProps {
  paper: Paper;
  isDownloading: boolean;
  onDownload: (paperId: string) => void;
  onOpenDetails: (paper: Paper) => void;
}

export default function PaperCard({ paper, isDownloading, onDownload, onOpenDetails }: PaperCardProps) {
  const { t } = useTranslation();

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "PDF";
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <article className="w-full bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between gap-4 transition-all hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      {/* Header Badges */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#B6FF00] border-[2.5px] border-black rounded-full font-extrabold text-xs uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <span>📖</span>
          <span>{paper.subject.name}</span>
        </span>

        <div className="flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 bg-stone-100 border-[2px] border-black rounded-full font-black text-xs text-black">
            {paper.year}
          </span>
          {paper.exam_session && (
            <span className="px-2.5 py-0.5 bg-amber-100 border-[2px] border-black rounded-full font-bold text-xs text-stone-800">
              {paper.exam_session}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1.5 cursor-pointer" onClick={() => onOpenDetails(paper)}>
        <h3 className="font-black text-lg md:text-xl text-stone-900 leading-snug hover:text-[#965A18] transition-colors line-clamp-2">
          {paper.title}
        </h3>
        {paper.description && (
          <p className="font-medium text-xs md:text-sm text-stone-600 line-clamp-2 leading-relaxed">
            {paper.description}
          </p>
        )}
      </div>

      {/* Metadata Stats */}
      <div className="flex items-center justify-between text-xs font-bold text-stone-700 pt-2 border-t-[2.5px] border-stone-200">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4 fill-current text-stone-600" viewBox="0 0 24 24">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
          </svg>
          {paper.downloads_count} {t("pastPapersVault.downloads")}
        </span>

        <span className="font-extrabold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-400">
          📄 {formatFileSize(paper.file_size)}
        </span>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={() => onDownload(paper.id)}
        disabled={isDownloading}
        className={`w-full min-h-[44px] px-4 py-2.5 bg-white border-[3.5px] border-black rounded-xl font-bold text-sm md:text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer ${
          isDownloading ? "opacity-75 cursor-not-allowed bg-stone-100" : "hover:bg-[#B6FF00]"
        }`}
      >
        {isDownloading ? (
          <>
            <svg className="w-5 h-5 animate-spin text-black" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>{t("pastPapersVault.downloading")}</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
            <span>{t("pastPapersVault.downloadPdf")}</span>
          </>
        )}
      </button>
    </article>
  );
}
