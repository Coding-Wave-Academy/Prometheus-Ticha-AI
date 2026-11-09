"use client";

import React from "react";
import Link from "next/link";
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
import TichaLogo from "@/components/layout/TichaLogo";
import { sectionForPath, type NavSectionId } from "@/components/layout/navSections";
import "@/lib/i18n";

interface SidebarItem {
  id: NavSectionId;
  label: string;
  icon: React.ReactNode;
  href: string;
}

/** Bottom card from the Explore design: 249×339, pinned 55px above the viewport bottom. */
function SidebarMotivationalCard() {
  return (
    <div className="hidden xl:flex flex-col bg-card-promo border-[1.5px] border-primary-line rounded-2xl px-[22px] pt-[26px] pb-4 mx-[30px] mb-[55px] mt-6 h-[339px] shrink-0">
      <p className="text-[17px] leading-[24px] font-bold text-ink">
        Better Every Day,
        <br />
        <span className="border-b-[3px] border-primary pb-[1px]">Stronger Tomorrow.</span>
      </p>
      <p className="mt-[14px] text-[14px] leading-[21px] font-medium text-ink/80">
        Your AI study companion
        <br />
        for GCE success.
      </p>
      <div className="mt-auto flex items-end justify-between">
        <div className="w-[118px] h-[104px]">
          <svg viewBox="0 0 64 56" fill="none" className="w-full h-full" aria-hidden="true">
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
        <div className="w-[64px] h-[64px] bg-white border-[2.5px] border-ink rounded-lg flex flex-col overflow-hidden shadow-brutal-sm mb-1">
          <div className="h-[14px] bg-ink flex items-center justify-around px-1.5" aria-hidden="true">
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          <span className="flex-1 flex items-center justify-center text-[22px] font-extrabold text-ink leading-none">1%</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Desktop sidebar (≥ 768px). Geometry follows design/Ticha AI Web View - Explore.png
 * at xl (≥ 1280px): 305px wide, 1px divider, 52px items on a 56px pitch.
 * Narrower at md/lg so tablets keep room for content.
 */
export default function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname() || "";
  const { signOut } = useAuth();
  const { t } = useTranslation();

  const sidebarItems: SidebarItem[] = [
    { id: "dashboard", label: t("dashboard.nav.dashboard", "Dashboard"), icon: <Home01Icon size={22} />, href: "/dashboard" },
    { id: "explore", label: t("dashboard.nav.explore", "Explore"), icon: <Compass01Icon size={22} />, href: "/explore" },
    { id: "tutor", label: "AI Tutor", icon: <AiChat02Icon size={22} />, href: "/dashboard/tutor" },
    { id: "videos", label: t("dashboard.nav.videoLibrary", "Video Library"), icon: <PlayCircleIcon size={22} />, href: "/dashboard/videos" },
    { id: "papers", label: t("dashboard.pastPapers", "Past Papers"), icon: <File01Icon size={22} />, href: "/past-papers" },
    { id: "progress", label: "Progress", icon: <Analytics01Icon size={22} />, href: "/dashboard/progress" },
    { id: "settings", label: "Settings", icon: <Settings01Icon size={22} />, href: "/dashboard/profile" },
  ];

  const activeId = sectionForPath(pathname);

  const handleLogout = async () => {
    hapticTap();
    try {
      await signOut();
    } finally {
      router.push("/");
    }
  };

  const itemClass =
    "flex items-center gap-[12px] h-[52px] px-[9px] rounded-[10px] border-2 text-[16px] leading-none transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar";

  return (
    <aside
      className="hidden md:flex flex-col w-[240px] xl:w-[305px] h-screen sticky top-0 shrink-0 bg-sidebar border-r border-divider z-40 overflow-y-auto"
      aria-label="Main navigation"
    >
      <div className="pt-[42px] pl-[22px] xl:pl-[36px] origin-left scale-[0.8] xl:scale-100 -mb-2 xl:mb-0">
        <Link href="/dashboard" aria-label="Ticha AI home" className="inline-block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ink">
          <TichaLogo />
        </Link>
      </div>

      <nav className="mt-[35px] px-[16px] xl:px-[33px]" aria-label="Sections">
        <ul className="flex flex-col gap-[4px]">
          {sidebarItems.map((item) => {
            const isActive = item.id === activeId;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  id={`sidebar-${item.id}`}
                  onClick={() => hapticTap()}
                  aria-current={isActive ? "page" : undefined}
                  className={`${itemClass} ${
                    isActive
                      ? "bg-primary border-ink font-semibold text-ink"
                      : "border-transparent font-medium text-ink hover:bg-ink/[0.05]"
                  }`}
                >
                  <span className="shrink-0 text-ink" aria-hidden="true">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mx-[7px] my-[10px] w-[122px] h-px bg-divider" aria-hidden="true" />

        <button
          type="button"
          id="sidebar-logout"
          onClick={handleLogout}
          className={`${itemClass} w-full border-transparent font-medium text-ink hover:bg-error/10 hover:text-error`}
        >
          <Logout01Icon size={22} className="shrink-0" aria-hidden="true" />
          <span>Logout</span>
        </button>
      </nav>

      <div className="mt-auto" />
      <SidebarMotivationalCard />
    </aside>
  );
}
