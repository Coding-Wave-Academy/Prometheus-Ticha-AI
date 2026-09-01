"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { FireIcon } from "hugeicons-react";
import "@/lib/i18n";

interface DashboardHeaderWebProps {
  userName: string;
  avatarUrl?: string | null;
  streakCount: number;
}

/**
 * DashboardHeaderWeb — Top header bar for the web/tablet dashboard view.
 * Shows greeting text on the left, streak pill + avatar initial circle on the right.
 */
export default function DashboardHeaderWeb({
  userName,
  avatarUrl,
  streakCount,
}: DashboardHeaderWebProps) {
  const { t } = useTranslation();
  const initial = userName.charAt(0).toUpperCase();

  return (
    <header className="flex items-start justify-between w-full mb-8">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-black text-[#1A1A1A] leading-tight tracking-tight">
          {t("dashboard.hello")} {userName} 👋
        </h1>
        <p className="text-sm font-semibold text-stone-500 mt-1">
          1% Daily Improvements!
        </p>
      </div>

      {/* Right: Streak Pill + Avatar */}
      <div className="flex items-center gap-3">
        {/* Streak Pill */}
        <div className="bg-[#C8FF2A] border-[2.5px] border-black rounded-full py-1.5 px-4 flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-black text-sm select-none">
          <FireIcon size={18} className="text-black" />
          <span className="text-black">{streakCount}</span>
        </div>

        {/* Avatar Circle */}
        <div className="w-11 h-11 rounded-full border-[3px] border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white flex items-center justify-center flex-shrink-0">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={`${userName}'s profile`}
              width={44}
              height={44}
              className="object-cover w-full h-full"
              unoptimized
            />
          ) : (
            <span className="text-lg font-black text-black leading-none">
              {initial}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
