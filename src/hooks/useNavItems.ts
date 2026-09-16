"use client";

import { useRouter, usePathname } from "next/navigation";
import { NavItem } from "@/types";

const NAV_DEFINITIONS: Omit<NavItem, "active">[] = [
  { id: "home", labelKey: "HOME", icon: "home", href: "/dashboard" },
  { id: "explore", labelKey: "EXPLORE", icon: "explore", href: "/explore" },
  { id: "chat", labelKey: "CHAT", icon: "chat", href: "/dashboard/tutor" },
  { id: "video", labelKey: "VIDEO", icon: "video", href: "/dashboard/videos" },
  { id: "profile", labelKey: "PROFILE", icon: "profile", href: "/dashboard/profile" },
];

export interface NavItemWithHandlers extends NavItem {
  active: boolean;
  onClick: () => void;
}

export function useNavItems(): NavItemWithHandlers[] {
  const router = useRouter();
  const pathname = usePathname() || "";

  // Route domain classification helper
  const getActiveTab = (path: string): string => {
    if (path.startsWith("/dashboard/profile")) return "profile";
    if (path.startsWith("/dashboard/tutor")) return "chat";
    if (path.startsWith("/dashboard/videos")) return "video";

    // Explore hub domain items (daily quiz, flashcards, past papers, summaries, practice, leaderboard, courses)
    if (
      path.startsWith("/explore") ||
      path.startsWith("/dashboard/daily-quiz") ||
      path.startsWith("/daily-quiz") ||
      path.startsWith("/dashboard/flashcards") ||
      path.startsWith("/summaries") ||
      path.startsWith("/past-papers") ||
      path.startsWith("/practice") ||
      path.startsWith("/leaderboard") ||
      path.startsWith("/courses") ||
      path.startsWith("/dashboard/quiz-generator")
    ) {
      return "explore";
    }

    // Home domain items (dashboard, daily lessons, subjects, notifications, progress, root)
    if (
      path === "/dashboard" ||
      path === "/" ||
      path.startsWith("/dashboard/daily-lessons") ||
      path.startsWith("/dashboard/subjects") ||
      path.startsWith("/dashboard/notifications") ||
      path.startsWith("/dashboard/progress")
    ) {
      return "home";
    }

    return "home";
  };

  const activeTabId = getActiveTab(pathname);

  return NAV_DEFINITIONS.map((item) => ({
    ...item,
    active: item.id === activeTabId,
    onClick: () => router.push(item.href),
  }));
}
