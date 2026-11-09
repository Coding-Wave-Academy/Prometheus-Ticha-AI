"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FireIcon, Notification01Icon } from "hugeicons-react";

interface AppHeaderProps {
  userName: string;
  avatarUrl?: string | null;
  streakCount: number;
  unreadCount?: number;
  /**
   * "inline": avatar + greeting on the left, streak pill + bell on the right
   *           (design/Ticha AI Web View - Explore.png).
   * "large":  streak tile + large avatar on the right only; the page renders the
   *           big greeting itself (design/Ticha AI Web View - Dashboard.png).
   */
  variant?: "inline" | "large";
}

function Avatar({ userName, avatarUrl, size }: { userName: string; avatarUrl?: string | null; size: number }) {
  return (
    <span
      className="rounded-full border-[2.5px] border-ink bg-white overflow-hidden flex items-center justify-center shrink-0 shadow-brutal-sm"
      style={{ width: size, height: size }}
    >
      {avatarUrl ? (
        <Image src={avatarUrl} alt="" width={size} height={size} className="object-cover w-full h-full" unoptimized />
      ) : (
        <span className="font-extrabold text-ink leading-none" style={{ fontSize: Math.round(size * 0.42) }} aria-hidden="true">
          {userName.charAt(0).toUpperCase()}
        </span>
      )}
    </span>
  );
}

export default function AppHeader({ userName, avatarUrl, streakCount, unreadCount = 0, variant = "inline" }: AppHeaderProps) {
  const streakLabel = `${streakCount} day streak`;

  if (variant === "large") {
    return (
      <header className="flex items-start justify-end gap-[30px] pt-[33px] h-[113px]">
        <Link
          href="/dashboard"
          aria-label={streakLabel}
          className="mt-[8px] w-[106px] h-[62px] rounded-[12px] border-[3px] border-ink bg-white shadow-brutal-sm flex items-center justify-center gap-[10px] outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          <FireIcon size={30} className="text-secondary" aria-hidden="true" />
          <span className="text-[26px] font-bold text-ink leading-none">{streakCount}</span>
        </Link>
        <Link href="/dashboard/profile" aria-label={`${userName}'s profile`} className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2">
          <Avatar userName={userName} avatarUrl={avatarUrl} size={80} />
        </Link>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between pt-[26px] h-[83px] -ml-1">
      <div className="flex items-center gap-5 min-w-0">
        <Link href="/dashboard/profile" aria-label={`${userName}'s profile`} className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2">
          <Avatar userName={userName} avatarUrl={avatarUrl} size={57} />
        </Link>
        <p className="text-[20px] font-bold text-ink truncate">
          Hello, {userName} <span aria-hidden="true">👋</span>
        </p>
      </div>
      <div className="flex items-start gap-[15px] self-start">
        <span
          className="mt-[5px] w-[90px] h-[51px] rounded-[14px] border-[2.5px] border-ink bg-white shadow-brutal-sm flex items-center justify-center gap-2"
          aria-label={streakLabel}
          role="status"
        >
          <FireIcon size={22} className="text-secondary" aria-hidden="true" />
          <span className="text-[20px] font-bold text-ink leading-none">{streakCount}</span>
        </span>
        <Link
          href="/dashboard/notifications"
          aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}
          className="relative mt-[2px] w-[58px] h-[58px] rounded-full border-[2.5px] border-ink bg-white shadow-brutal-sm flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          <Notification01Icon size={26} className="text-ink" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full border-2 border-ink bg-card-orange text-[10px] font-extrabold flex items-center justify-center" aria-hidden="true">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
