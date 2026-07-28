"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import { QuickAction } from "@/types";

interface QuickActionsProps {
  actions: QuickAction[];
  onAction: (name: string) => void;
}

/**
 * QuickActions — 4-column grid of circular action buttons (Daily Quiz, Summaries, etc.).
 */
export default function QuickActions({ actions, onAction }: QuickActionsProps) {
  const { t } = useTranslation();

  return (
    <section className="w-full mb-8">
      <h3 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A] mb-4 pl-1">
        {t("dashboard.quickActions")}
      </h3>

      <div className="grid grid-cols-4 gap-3">
        {actions.map((action) => (
          <button
            key={action.name}
            id={`quick-action-${action.name.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={() => onAction(action.name)}
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className={`${action.bgColor} w-16 h-16 rounded-full border-[3.5px] border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-active:translate-x-[2px] group-active:translate-y-[2px] group-active:shadow-none transition-all relative`}
            >
              <span className="text-2xl leading-none select-none filter drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                {action.icon}
              </span>
              {action.badge != null && (
                <span className="absolute -top-1 -right-1.5 bg-[#FAF7EC] border-[2px] border-black rounded-full w-6 h-6 flex items-center justify-center font-black text-xs shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  {action.badge}
                </span>
              )}
            </div>
            <span className="text-[13px] font-extrabold tracking-tight text-center text-[#1A1A1A]">
              {action.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
