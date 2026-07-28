"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { NavItemWithHandlers } from "@/hooks/useNavItems";
import "@/lib/i18n";

interface BottomNavProps {
  items: NavItemWithHandlers[];
}

const getFontAwesomeIcon = (id: string) => {
  switch (id) {
    case "home":
      // FA table-cells-large / th-large (grid)
      return (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 512 512">
          <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm88 160H64V96h88v96zm240 0H208V96h136v96zm120 0H400V96h48v96zM152 352H64V256h88v96zm240 0H208V256h136v96zm120 0H400V256h48v96zM152 416v32H64V416h88zm240 0v32H208V416h136zm120 0v32H400V416h48z" />
        </svg>
      );
    case "explore":
      // FA graduation-cap
      return (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 640 512">
          <path d="M620.8 104.3L338.9 4.4a32.2 32.2 0 0 0-18.1 0L38.4 104.3A32 32 0 0 0 32 134.4v264a32 32 0 0 0 20.3 29.8l268.8 96a32.1 32.1 0 0 0 17.8 0l268.8-96A32 32 0 0 0 608 398.4V134.4a32 32 0 0 0-6.4-30.1zM320 443.4L96 363.4V224.2l203.4 72.6a32.3 32.3 0 0 0 20.6 0L544 224.2v139.2zM524.3 162L320 234.9L115.7 162L320 89.1z" />
        </svg>
      );
    case "chat":
      // FA comment-dots
      return (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 512 512">
          <path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C35.2 417.6 7.7 444 6.7 445c-4.8 4.7-6.2 11.9-3.7 18.1S10 473.3 16.7 473c50.7-2.9 98.4-23.7 134.7-48.4 32.8 10.2 68 15.4 104.6 15.4 141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2-21.1 11.7c-26.7 14.8-57.8 26.4-89.2 31.6 8.3-15.6 18.9-31.4 31.1-45.9l16-19.1-13-20.9c-27.8-44.6-30.7-93.6-30.7-116.1 0-88.2 93.3-160 208-160s208 71.8 208 160-93.3 160-208 160z" />
        </svg>
      );
    case "video":
      // FA play-circle
      return (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 512 512">
          <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm115.7 272l-176 101c-15.8 9-35.7-2.4-35.7-20.7V157.7c0-18.3 19.9-29.7 35.7-20.7l176 101c15.8 9.1 15.8 31.8 0 41z" />
        </svg>
      );
    case "profile":
      // FA user
      return (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 448 512">
          <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C75.8 288 32 331.8 32 385.6V464c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-78.4c0-53.8-43.8-97.6-97.6-97.6z" />
        </svg>
      );
    default:
      return null;
  }
};

/**
 * BottomNav — fixed PWA-style bottom navigation bar.
 * Active tab gets an orange neobrutalist highlight card.
 * Touch targets are 64×64px (44px+ WCAG).
 */
export default function BottomNav({ items }: BottomNavProps) {
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#FAF7EC] border-t-[4px] border-black px-6 py-3 flex items-center justify-between shadow-[0_-4px_0px_0px_rgba(0,0,0,1)] z-50">
      {items.map((item) => (
        <button
          key={item.id}
          id={`bottom-nav-${item.id}`}
          onClick={item.onClick}
          className={`flex flex-col items-center justify-center gap-1 group w-16 h-16 rounded-xl transition-all ${
            item.active
              ? "bg-[#FFB040] border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              : "border-0 shadow-none hover:bg-stone-50 active:bg-stone-100"
          }`}
          aria-current={item.active ? "page" : undefined}
        >
          <span
            className={`text-xl leading-none filter transition-transform group-active:scale-95 ${
              item.active ? "text-black drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]" : "text-stone-700"
            }`}
          >
            {getFontAwesomeIcon(item.id)}
          </span>
          <span
            className={`text-[10px] font-black uppercase tracking-wider ${
              item.active ? "text-[#1A1A1A]" : "text-stone-600 group-hover:text-[#1A1A1A]"
            }`}
          >
            {t(`dashboard.nav.${item.labelKey}`)}
          </span>
        </button>
      ))}
    </nav>
  );
}

