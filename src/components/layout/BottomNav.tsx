"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  Home01Icon,
  Compass01Icon,
  Comment01Icon,
  PlayCircleIcon,
  UserIcon,
} from "hugeicons-react";
import { NavItemWithHandlers } from "@/hooks/useNavItems";
import { hapticTap } from "@/lib/haptics";
import "@/lib/i18n";

interface BottomNavProps {
  items: NavItemWithHandlers[];
}

const getHugeicon = (id: string, className: string) => {
  switch (id) {
    case "home":
      return <Home01Icon className={className} size={22} />;
    case "explore":
      return <Compass01Icon className={className} size={22} />;
    case "chat":
      return <Comment01Icon className={className} size={22} />;
    case "video":
      return <PlayCircleIcon className={className} size={22} />;
    case "profile":
      return <UserIcon className={className} size={22} />;
    default:
      return null;
  }
};

export default function BottomNav({ items }: BottomNavProps) {
  const { t } = useTranslation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-[#FAF7EC] border-t-[3.5px] border-black px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-[0_-4px_0px_0px_rgba(0,0,0,1)] z-50">
      {items.map((item) => (
        <button
          key={item.id}
          id={`bottom-nav-${item.id}`}
          onClick={() => {
            hapticTap();
            item.onClick();
          }}
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl transition-all duration-150 active:scale-95 touch-manipulation ${
            item.active
              ? "bg-[#FFB040] border-[2.5px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              : "border-transparent hover:bg-stone-100"
          }`}
          aria-current={item.active ? "page" : undefined}
          aria-label={item.labelKey || t(`dashboard.nav.${item.id}`)}
        >
          <span
            className={`leading-none transition-transform ${
              item.active ? "text-black scale-105" : "text-stone-700"
            }`}
          >
            {getHugeicon(item.id, item.active ? "text-black" : "text-stone-700")}
          </span>
          <span
            className={`text-[9px] font-black uppercase tracking-wider ${
              item.active ? "text-[#1A1A1A]" : "text-stone-600"
            }`}
          >
            {item.labelKey || t(`dashboard.nav.${item.id}`)}
          </span>
        </button>
      ))}
    </nav>
  );
}
