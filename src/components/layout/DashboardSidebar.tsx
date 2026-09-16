"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  Home01Icon,
  Compass01Icon,
  AiChat02Icon,
  PlayCircleIcon,
  File01Icon,
  Analytics01Icon,
  Settings01Icon,
  Logout01Icon,
} from "hugeicons-react";
import { useAuth } from "@/hooks/useAuth";
import { hapticTap } from "@/lib/haptics";
import "@/lib/i18n";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

function TichaLogo() {
  return (
    <div className="flex items-center gap-2.5 px-2 mb-6">
      {/* 1% Badge */}
      <div className="w-10 h-10 bg-[#FAF7EC] border-[2.5px] border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative">
        <span className="text-sm font-black text-black leading-none">1%</span>
        {/* Star decoration */}
        <svg
          className="absolute -top-1 -right-1 w-3.5 h-3.5 text-[#FFB040]"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l2.09 6.26L20.18 9l-5.09 4.09L16.18 20 12 16.27 7.82 20l1.09-6.91L3.82 9l6.09-.74z" />
        </svg>
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-black tracking-tight leading-none">
            Ticha
          </span>
          <span className="text-xl font-black text-[#C8FF2A] tracking-tight leading-none">
            AI
          </span>
        </div>
        <p className="text-[10px] font-bold text-stone-500 tracking-tight leading-none mt-1">
          Small Steps. Big Mastery.
        </p>
      </div>
    </div>
  );
}

function SidebarMotivationalCard() {
  return (
    <div className="bg-[#FFF8F1] border-[2px] border-black rounded-2xl p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mt-4 mb-2 text-left relative overflow-hidden">
      <h4 className="text-xs font-black text-black leading-tight">
        Better Every Day,<br />Stronger Tomorrow.
      </h4>
      <p className="text-[10px] font-semibold text-stone-600 leading-tight mt-1 mb-2.5">
        Your AI study companion for GCE success.
      </p>

      {/* Illustrated Student & 1% Desk SVG Graphic */}
      <div className="flex items-end justify-between pt-1">
        <div className="w-16 h-14 relative">
          <svg viewBox="0 0 64 56" fill="none" className="w-full h-full">
            {/* Student head */}
            <circle cx="28" cy="18" r="10" fill="#FFE5C4" stroke="#0A0A0F" strokeWidth="2" />
            {/* Hair */}
            <path d="M18 16C18 10 24 6 34 8C38 9 38 14 38 16C36 14 30 14 26 15C22 16 20 18 18 16Z" fill="#0A0A0F" />
            {/* Smile & Eyes */}
            <circle cx="26" cy="18" r="1.5" fill="#0A0A0F" />
            <circle cx="32" cy="18" r="1.5" fill="#0A0A0F" />
            <path d="M28 22C29 23 31 23 32 22" stroke="#0A0A0F" strokeWidth="1.5" strokeLinecap="round" />
            {/* Green Hoodie */}
            <path d="M16 36C16 28 22 26 28 26C34 26 40 28 40 36V46H16V36Z" fill="#C8FF2A" stroke="#0A0A0F" strokeWidth="2" />
            {/* Desk Surface */}
            <path d="M4 46H60" stroke="#0A0A0F" strokeWidth="2.5" strokeLinecap="round" />
            {/* Pen in hand */}
            <path d="M38 38L44 44" stroke="#0A0A0F" strokeWidth="2" strokeLinecap="round" />
            {/* Notebook */}
            <rect x="22" y="42" width="22" height="10" rx="2" fill="#FFFFFF" stroke="#0A0A0F" strokeWidth="1.5" />
            <path d="M26 46H38" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* 1% Calendar Widget */}
        <div className="w-12 h-12 bg-white border-[2px] border-black rounded-lg flex flex-col items-center justify-center shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] relative">
          <div className="w-full bg-[#0A0A0F] h-3 flex items-center justify-around px-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          <span className="text-xs font-black text-black leading-none pt-1">1%</span>
        </div>
      </div>

      {/* Sparkle */}
      <div className="absolute top-2 right-2 text-[#FFB040] text-xs font-bold pointer-events-none">
        ✦
      </div>
    </div>
  );
}

export default function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname() || "";
  const { signOut } = useAuth();
  const { t } = useTranslation();

  const sidebarItems: SidebarItem[] = [
    {
      id: "dashboard",
      label: t("dashboard.nav.home", "Dashboard"),
      icon: <Home01Icon size={20} />,
      href: "/dashboard",
    },
    {
      id: "explore",
      label: t("dashboard.nav.explore", "Explore"),
      icon: <Compass01Icon size={20} />,
      href: "/explore",
    },
    {
      id: "tutor",
      label: "AI Tutor",
      icon: <AiChat02Icon size={20} />,
      href: "/dashboard/tutor",
    },
    {
      id: "videos",
      label: t("dashboard.nav.video", "Video Library"),
      icon: <PlayCircleIcon size={20} />,
      href: "/dashboard/videos",
    },
    {
      id: "papers",
      label: t("dashboard.pastPapers", "Past Papers"),
      icon: <File01Icon size={20} />,
      href: "/past-papers",
    },
    {
      id: "progress",
      label: "Progress",
      icon: <Analytics01Icon size={20} />,
      href: "/dashboard/progress",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings01Icon size={20} />,
      href: "/dashboard/profile",
    },
  ];

  const getActiveId = (path: string): string => {
    if (path === "/dashboard" || path === "/") return "dashboard";
    if (
      path.startsWith("/explore") ||
      path.startsWith("/dashboard/daily-quiz") ||
      path.startsWith("/summaries") ||
      path.startsWith("/practice") ||
      path.startsWith("/leaderboard") ||
      path.startsWith("/courses")
    )
      return "explore";
    if (path.startsWith("/dashboard/tutor")) return "tutor";
    if (path.startsWith("/dashboard/videos")) return "videos";
    if (path.startsWith("/past-papers")) return "papers";
    if (path.startsWith("/dashboard/progress")) return "progress";
    if (path.startsWith("/dashboard/profile")) return "settings";
    return "dashboard";
  };

  const activeId = getActiveId(pathname);

  const handleLogout = async () => {
    hapticTap();
    try {
      await signOut();
      router.push("/");
    } catch {
      // Redirect even on error
      router.push("/");
    }
  };

  return (
    <aside
      className="hidden md:flex flex-col w-[220px] lg:w-[240px] min-h-screen h-full sticky top-0 bg-[#FAF7EC] border-r-[3px] border-black px-3.5 py-5 shrink-0 z-40 select-none justify-between"
      aria-label="Sidebar navigation"
    >
      <div>
        <TichaLogo />

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {sidebarItems.map((item) => {
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                id={`sidebar-${item.id}`}
                onClick={() => {
                  hapticTap();
                  router.push(item.href);
                }}
                className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-left transition-all duration-150 group ${
                  isActive
                    ? "bg-[#C8FF2A] border-[2.5px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-black"
                    : "border-[2.5px] border-transparent hover:bg-stone-100 font-bold"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={`transition-transform ${
                    isActive
                      ? "text-black scale-110"
                      : "text-stone-600 group-hover:text-black"
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`text-sm tracking-tight ${
                    isActive ? "text-black" : "text-stone-700 group-hover:text-black"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          id="sidebar-logout"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3.5 py-2 rounded-xl text-left font-bold border-[2.5px] border-transparent hover:bg-red-50 hover:border-red-200 transition-all duration-150 mt-1.5 group"
        >
          <Logout01Icon
            size={20}
            className="text-stone-500 group-hover:text-red-600 transition-colors"
          />
          <span className="text-sm tracking-tight text-stone-600 group-hover:text-red-600 transition-colors">
            Logout
          </span>
        </button>
      </div>

      {/* Motivational Bottom Card */}
      <SidebarMotivationalCard />
    </aside>
  );
}
