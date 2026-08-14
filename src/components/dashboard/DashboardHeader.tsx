"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Notification01Icon, FireIcon } from "hugeicons-react";
import "@/lib/i18n";

interface DashboardHeaderProps {
  userName: string;
  avatarUrl?: string | null;
  streakCount: number;
  notificationCount: number;
  onNotificationClick: () => void;
}

export default function DashboardHeader({
  userName,
  avatarUrl,
  streakCount,
  notificationCount,
  onNotificationClick,
}: DashboardHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between w-full mb-6 relative">
      <div className="flex items-center gap-3">
        {/* User Avatar */}
        <div className="w-12 h-12 rounded-full border-[3px] border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 bg-[#B6FF00]">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={`${userName}'s profile`}
              width={48}
              height={48}
              className="object-cover w-full h-full"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl font-black text-black">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl md:text-2xl font-black text-[#1A1A1A] leading-tight">
              {t("dashboard.hello")} {userName} 👋
            </h1>
            <div className="w-7 h-7 rounded-lg border-[2px] border-black overflow-hidden shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] bg-white shrink-0">
              <Image
                src="/images/ticha-logo.png"
                alt="1% Ticha AI Logo"
                width={28}
                height={28}
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Streak Pill */}
        <div className="bg-[#FAF7EC] border-[2.5px] border-black rounded-full py-1.5 px-3 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold text-sm">
          <FireIcon size={18} className="text-orange-600 fill-current" />
          <span>{streakCount}</span>
        </div>

        {/* Notification Bell */}
        <button
          id="dashboard-notifications"
          onClick={onNotificationClick}
          aria-label={`${notificationCount} notifications`}
          className="relative w-11 h-11 bg-[#FAF7EC] border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
        >
          <Notification01Icon size={22} className="text-black" />
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
