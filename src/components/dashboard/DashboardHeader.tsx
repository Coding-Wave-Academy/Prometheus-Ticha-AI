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
  avatar?: string;
}

/**
 * DashboardHeader — top bar with avatar, greeting, streak pill, and notification bell.
 */
export default function DashboardHeader({
  userName,
  streakCount,
  notificationCount,
  onNotificationClick,
  avatar,
}: DashboardHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between w-full mb-6 relative">
      <div className="flex items-center gap-3">
        {/* User Avatar */}
        <div className="w-12 h-12 rounded-full border-[3px] border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 bg-white flex items-center justify-center">
          {avatar ? (
            <img
              src={avatar}
              alt={`${userName}'s profile`}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src="/images/amadou-avatar.png"
              alt={`${userName}'s profile`}
              width={48}
              height={48}
              className="object-cover"
            />
          )}
        </div>
        <h1 className="text-xl md:text-2xl font-black text-[#1A1A1A] leading-tight">
          {t("dashboard.hello")} {userName}{" "}
          <span role="img" aria-label="waving hand">👋</span>
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Streak Pill */}
        <div className="bg-[#FAF7EC] border-[2.5px] border-black rounded-full py-1.5 px-3 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold text-sm">
          <span role="img" aria-label="streak fire" className="text-base leading-none">🔥</span>
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
