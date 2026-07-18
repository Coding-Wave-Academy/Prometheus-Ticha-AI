"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

interface RegionalUpdate {
  id: string;
  title: string;
  date: string;
}

interface RegionalUpdatesProps {
  updates: RegionalUpdate[];
  onUpdateClick: (id: string) => void;
}

/**
 * RegionalUpdates — card listing exam date announcements and region news.
 */
export default function RegionalUpdates({ updates, onUpdateClick }: RegionalUpdatesProps) {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-4">
      <div className="flex items-center gap-2 mb-4">
        <span role="img" aria-label="megaphone" className="text-xl">📢</span>
        <h3 className="text-lg font-black uppercase tracking-tight text-[#1A1A1A]">
          {t("dashboard.regionalUpdates")}
        </h3>
      </div>

      <div className="space-y-3">
        {updates.map((update) => (
          <button
            key={update.id}
            id={`regional-update-${update.id}`}
            onClick={() => onUpdateClick(update.id)}
            className="w-full text-left bg-[#B6FF00] border-[2.5px] border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none transition-all"
          >
            <h4 className="font-bold text-[15px] text-[#1A1A1A] tracking-tight">{update.title}</h4>
            <p className="text-xs font-medium text-stone-700 mt-0.5">Starts: {update.date}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
