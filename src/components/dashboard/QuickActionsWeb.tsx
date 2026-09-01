"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
  borderColor: string;
  href: string;
  badge?: number;
}

/**
 * QuickActionsWeb — Four circular action buttons for the web/tablet dashboard.
 * Matches the design with distinct colors per action.
 * Connected to useNotifications() for the Daily Quiz badge count.
 */
export default function QuickActionsWeb() {
  const router = useRouter();
  const { unreadCount } = useNotifications();

  const actions: QuickActionItem[] = [
    {
      name: "Daily Quiz",
      icon: <FireIcon size={24} className="text-black" />,
      bgColor: "bg-[#FFB040]",
      borderColor: "border-[#FFB040]",
      href: "/dashboard/daily-quiz",
      badge: unreadCount > 0 ? 1 : undefined,
    },
    {
      name: "Summaries",
      icon: <GridIcon size={24} className="text-black" />,
      bgColor: "bg-[#C8FF2A]",
      borderColor: "border-[#C8FF2A]",
      href: "/summaries",
    },
    {
      name: "Past Papers",
      icon: <File01Icon size={24} className="text-black" />,
      bgColor: "bg-white",
      borderColor: "border-black",
      href: "/past-papers",
    },
    {
      name: "Practice",
      icon: <PencilEdit01Icon size={24} className="text-black" />,
      bgColor: "bg-[#FFD6E7]",
      borderColor: "border-[#FFD6E7]",
      href: "/practice",
    },
  ];

  return (
    <section className="w-full">
      <h3 className="text-xl font-black tracking-tight text-[#1A1A1A] mb-4">
        Quick Actions
      </h3>
      <div className="flex items-start gap-6">
        {actions.map((action) => (
          <button
            key={action.name}
            id={`web-quick-action-${action.name.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={() => {
              hapticTap();
              router.push(action.href);
            }}
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className={`${action.bgColor} w-16 h-16 rounded-full border-[3px] ${action.borderColor} flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-active:translate-x-[2px] group-active:translate-y-[2px] group-active:shadow-none transition-all relative group-hover:scale-105`}
            >
              {action.icon}
              {action.badge != null && (
                <span className="absolute -top-1 -right-1 bg-[#FF6B6B] border-[2px] border-black rounded-full w-5 h-5 flex items-center justify-center font-black text-[10px] text-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  {action.badge}
                </span>
              )}
            </div>
            <span className="text-xs font-bold tracking-tight text-center text-stone-700">
              {action.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
