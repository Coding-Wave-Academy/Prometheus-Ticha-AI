"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useIsMounted } from "@/hooks/useIsMounted";
import "@/lib/i18n";

interface SocialAuthButtonsProps {
  onGoogle: () => void;
  onApple: () => void;
}

/**
 * SocialAuthButtons — Google and Apple social auth buttons.
 *
 * Extracted as a shared component used by both Login and Register pages.
 * Includes the "OR" divider separator above the buttons.
 */
export default function SocialAuthButtons({
  onGoogle,
  onApple,
}: SocialAuthButtonsProps) {
  const { t } = useTranslation();
  const isMounted = useIsMounted();

  return (
    <section className="space-y-3 w-full">
      {/* Divider line */}
      <div className="flex items-center justify-center gap-4 py-2">
        <div className="h-[3px] bg-black flex-1 max-w-[120px]"></div>
        <span className="text-xs font-black uppercase text-stone-800 tracking-wider">
          {isMounted ? t("login.or") : "OR"}
        </span>
        <div className="h-[3px] bg-black flex-1 max-w-[120px]"></div>
      </div>

      {/* Google Auth Button */}
      <button
        type="button"
        onClick={onGoogle}
        className="w-full bg-white border-[3.5px] border-black rounded-xl py-3.5 px-4 font-bold flex items-center justify-center gap-3 transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.052 14.945 0 12 0 7.354 0 3.373 2.736 1.536 6.734l3.73 3.031z"
          />
          <path
            fill="#4285F4"
            d="M23.49 12.273c0-.818-.073-1.609-.21-2.373H12v4.5h6.44c-.277 1.463-1.095 2.704-2.332 3.536l3.636 2.82c2.13-1.964 3.364-4.855 3.364-8.483z"
          />
          <path
            fill="#FBBC05"
            d="M5.266 14.235L1.536 17.266A11.958 11.958 0 010 12c0-1.91.445-3.718 1.536-5.266l3.73 3.031a7.06 7.06 0 000 4.47z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.955-1.077 7.94-2.918l-3.636-2.82c-1.005.673-2.29 1.073-4.304 1.073-3.282 0-6.064-2.218-7.055-5.2l-3.73 3.03A11.962 11.962 0 0012 24z"
          />
        </svg>
        <span className="text-[17px]">Continue with Google</span>
      </button>

      {/* Apple Auth Button */}
      <button
        type="button"
        onClick={onApple}
        className="w-full bg-white border-[3.5px] border-black rounded-xl py-3.5 px-4 font-bold flex items-center justify-center gap-3 transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-50"
      >
        <svg className="w-5 h-5 fill-current text-black" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z" />
        </svg>
        <span className="text-[17px]">Continue with Apple</span>
      </button>
    </section>
  );
}
