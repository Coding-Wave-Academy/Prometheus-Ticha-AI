"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Paper } from "@/types/paper";

interface PaperDetailModalProps {
  paper: Paper | null;
  isOpen: boolean;
  isDownloading: boolean;
  onClose: () => void;
  onDownload: (paperId: string) => void;
}

export default function PaperDetailModal({
  paper,
  isOpen,
  isDownloading,
  onClose,
  onDownload,
}: PaperDetailModalProps) {
  const { t } = useTranslation();

  if (!isOpen || !paper) return null;

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "PDF";
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border-[3.5px] border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 min-w-[40px] min-h-[40px] flex items-center justify-center bg-stone-100 border-[2.5px] border-black rounded-xl font-black text-stone-900 hover:bg-[#FF9494] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
          aria-label="Close details modal"
        >
          ✕
        </button>

        {/* Title & Subject Header */}
        <div className="pr-10 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-[#B6FF00] border-[2.5px] border-black rounded-full font-extrabold text-xs uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {paper.subject.name}
            </span>
            <span className="px-2.5 py-0.5 bg-stone-100 border-[2px] border-black rounded-full font-black text-xs text-black">
              {paper.year}
            </span>
            {paper.exam_session && (
              <span className="px-2.5 py-0.5 bg-amber-100 border-[2px] border-black rounded-full font-bold text-xs text-stone-800">
                {paper.exam_session}
              </span>
            )}
          </div>
          <h2 className="font-black text-xl md:text-2xl text-stone-900 leading-tight">
            {paper.title}
          </h2>
        </div>

        {/* Divider */}
        <div className="h-[3px] bg-black w-full" />

        {/* Description & Details */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-stone-800">
            {t("pastPapersVault.details")}
          </h4>
          <p className="font-medium text-sm text-stone-700 leading-relaxed bg-[#FAF7EC] p-3.5 border-[2.5px] border-black rounded-xl">
            {paper.description || "Official examination past paper with question sets and mark distribution guide."}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-stone-50 border-[2px] border-black rounded-xl">
              <span className="text-[11px] font-extrabold uppercase text-stone-500 block">
                {t("pastPapersVault.fileSize")}
              </span>
              <span className="font-black text-sm text-stone-900">
                {formatFileSize(paper.file_size)}
              </span>
            </div>

            <div className="p-3 bg-stone-50 border-[2px] border-black rounded-xl">
              <span className="text-[11px] font-extrabold uppercase text-stone-500 block">
                {t("pastPapersVault.downloads")}
              </span>
              <span className="font-black text-sm text-stone-900">
                {paper.downloads_count}
              </span>
            </div>
          </div>
        </div>

        {/* Download Action */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onDownload(paper.id)}
            disabled={isDownloading}
            className={`w-full min-h-[48px] px-5 py-3 bg-[#B6FF00] text-black border-[3.5px] border-black rounded-xl font-extrabold text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer ${
              isDownloading ? "opacity-75 cursor-not-allowed" : "hover:bg-[#a6ee00]"
            }`}
          >
            {isDownloading ? (
              <span>{t("pastPapersVault.downloading")}</span>
            ) : (
              <>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                </svg>
                <span>{t("pastPapersVault.downloadPdf")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
