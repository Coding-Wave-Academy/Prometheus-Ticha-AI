"use client";

import { useRouter, usePathname } from "next/navigation";
import { NavItem } from "@/types";

const NAV_DEFINITIONS: Omit<NavItem, "active">[] = [
  { id: "home", labelKey: "HOME", icon: "home", href: "/dashboard" },
  { id: "explore", labelKey: "EXPLORE", icon: "explore", href: "/explore" },
  { id: "chat", labelKey: "CHAT", icon: "chat", href: "/coming-soon" },
  { id: "video", labelKey: "VIDEO", icon: "video", href: "/coming-soon" },
  { id: "profile", labelKey: "PROFILE", icon: "profile", href: "/dashboard/profile" },
];

export interface NavItemWithHandlers extends NavItem {
  active: boolean;
  onClick: () => void;
}

export function useNavItems(): NavItemWithHandlers[] {
  const router = useRouter();
  const pathname = usePathname() || "";

  const isProfilePage = pathname.startsWith("/dashboard/profile");

  return NAV_DEFINITIONS.map((item) => {
    let isActive = false;

    if (item.id === "profile") {
      isActive = isProfilePage;
    } else if (item.id === "home") {
      isActive = (pathname === "/dashboard" || pathname === "/") && !isProfilePage;
    } else if (item.id === "explore") {
      isActive =
        !isProfilePage &&
        (pathname.startsWith("/explore") ||
          pathname.startsWith("/leaderboard") ||
          pathname.startsWith("/courses") ||
          pathname.includes("/quiz"));
    } else {
      isActive = !isProfilePage && pathname === item.href;
    }

    return {
      ...item,
      active: isActive,
      onClick: () => router.push(item.href),
    };
  });
}
