"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

interface DashboardHeaderProps {
  userName: string;
  streakCount: number;
  notificationCount: number;
  onNotificationClick: () => void;
}

/**
 * DashboardHeader — top bar with avatar, greeting, streak pill, and notification bell.
 */
export default function DashboardHeader({
  userName,
  streakCount,
  notificationCount,
  onNotificationClick,
}: DashboardHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between w-full mb-6 relative">
      <div className="flex items-center gap-3">
        {/* User Avatar */}
        <div className="w-12 h-12 rounded-full border-[3px] border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
          <Image
            src="/images/amadou-avatar.png"
            alt={`${userName}'s profile`}
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <h1 className="text-xl md:text-2xl font-black text-[#1A1A1A] leading-tight flex items-center gap-1.5">
          <span>{t("dashboard.hello")} {userName}</span>
          <svg className="w-5 h-5 fill-current text-amber-600 inline shrink-0" viewBox="0 0 24 24">
            <path d="M22 14c0 1.1-.9 2-2 2h-1v-4h1c1.1 0 2 .9 2 2zm-4-7c0-1.1-.9-2-2-2h-3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2V7zm-8 4c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-6z" />
          </svg>
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Streak Pill */}
        <div className="bg-[#FAF7EC] border-[2.5px] border-black rounded-full py-1.5 px-3 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold text-sm">
          <svg className="w-4 h-4 fill-current text-orange-600 shrink-0" viewBox="0 0 24 24">
            <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.6 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-5.52-4.5-9.33-6.5-13.33z" />
          </svg>
          <span>{streakCount}</span>
        </div>

        {/* Notification Bell */}
        <button
          id="dashboard-notifications"
          onClick={onNotificationClick}
          aria-label={`${notificationCount} notifications`}
          className="relative w-11 h-11 bg-[#FAF7EC] border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
        >
          <svg className="w-6 h-6 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1.5 bg-[#FFB040] border-[2px] border-black rounded-full w-6 h-6 flex items-center justify-center font-black text-xs shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
              {notificationCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
