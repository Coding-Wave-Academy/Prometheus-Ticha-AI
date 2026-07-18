"use client";

import { useRouter, usePathname } from "next/navigation";
import { NavItem } from "@/types";

/** The five global PWA navigation destinations. */
const NAV_DEFINITIONS: Omit<NavItem, "active">[] = [
  { id: "home",    labelKey: "home",    icon: "⊞",   href: "/dashboard" },
  { id: "explore", labelKey: "explore", icon: "🧑‍🎓", href: "/explore" },
  { id: "chat",    labelKey: "chat",    icon: "✉️",   href: "/dashboard/chat" },
  { id: "video",   labelKey: "video",   icon: "▶",   href: "/video" },
  { id: "profile", labelKey: "profile", icon: "👤",   href: "/dashboard/profile" },
];

export interface NavItemWithHandlers extends NavItem {
  active: boolean;
  onClick: () => void;
}

/**
 * useNavItems — returns nav item definitions enriched with an `active` flag
 * (based on the current pathname) and an `onClick` handler that navigates via
 * Next.js router. Import into any page that renders <BottomNav />.
 */
export function useNavItems(): NavItemWithHandlers[] {
  const router = useRouter();
  const pathname = usePathname();

  return NAV_DEFINITIONS.map((item) => ({
    ...item,
    active: pathname === item.href || pathname.startsWith(item.href + "/"),
    onClick: () => router.push(item.href),
  }));
}
