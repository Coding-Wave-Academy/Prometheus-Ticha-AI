"use client";

import React from "react";
import Link from "next/link";
import {
  FireIcon,
  GridIcon,
  File01Icon,
  PencilEdit01Icon,
} from "hugeicons-react";
import { hapticTap } from "@/lib/haptics";
import { useNotifications } from "@/hooks/useNotifications";

interface QuickActionItem {
  name: string;
  icon: React.ReactNode;
  bgColor: string;
  href: string;
  badge?: number;
}

/**
 * QuickActionsWeb — Four circular action buttons for the web/tablet dashboard.
 * Matches the design with distinct colors per action.
 * Connected to useNotifications() for the Daily Quiz badge count.
 */
export default function QuickActionsWeb() {
  const { unreadCount } = useNotifications();

  const actions: QuickActionItem[] = [
    {
      name: "Daily Quiz",
      icon: <FireIcon size={34} className="text-ink" />,
      bgColor: "bg-card-orange",
      href: "/dashboard/daily-quiz",
      badge: unreadCount > 0 ? 1 : undefined,
    },
    {
      name: "Summaries",
      icon: <GridIcon size={34} className="text-ink" />,
      bgColor: "bg-primary",
      href: "/summaries",
    },
    {
      name: "Past Papers",
      icon: <File01Icon size={34} className="text-ink" />,
      bgColor: "bg-card-sky-soft",
      href: "/past-papers",
    },
    {
      name: "Practice",
      icon: <PencilEdit01Icon size={34} className="text-ink" />,
      bgColor: "bg-card-lilac",
      href: "/practice",
    },
  ];

  return (
    <section aria-labelledby="quick-actions-title" className="@container">
      <h2 id="quick-actions-title" className="text-[28px] leading-none font-bold text-ink">Quick Actions</h2>
      <ul className="mt-[26px] grid grid-cols-4 gap-x-[min(38px,4cqw)] max-w-[494px]">
        {actions.map((action) => (
          <li key={action.name}>
            <Link
              href={action.href}
              id={`web-quick-action-${action.name.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => hapticTap()}
              className="group flex flex-col items-center outline-none"
            >
              <span
                className={`${action.bgColor} relative w-full max-w-[95px] aspect-square rounded-full border-2 border-ink flex items-center justify-center transition-transform duration-150 group-hover:-translate-y-0.5 group-focus-visible:ring-[3px] group-focus-visible:ring-ink group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-cream`}
              >
                {action.icon}
                {action.badge != null && (
                  <span className="absolute -top-[3px] -right-[7px] w-[28px] h-[28px] rounded-full bg-ink text-white text-[15px] font-bold flex items-center justify-center" aria-label={`${action.badge} new`}>
                    {action.badge}
                  </span>
                )}
              </span>
              <span className="mt-[22px] text-[clamp(13px,3.5cqw,17px)] leading-none font-medium text-ink text-center whitespace-nowrap">{action.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
