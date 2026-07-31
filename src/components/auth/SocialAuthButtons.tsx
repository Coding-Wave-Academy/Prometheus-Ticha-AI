"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useIsMounted } from "@/hooks/useIsMounted";
import "@/lib/i18n";

interface SocialAuthButtonsProps {
  onGoogle: () => void;
  onApple?: () => void;
}

/**
 * SocialAuthButtons — Google social auth button.
 *
 * Extracted as a shared component used by both Login and Register pages.
 * Includes the "OR" divider separator above the button.
 */
export default function SocialAuthButtons({
  onGoogle,
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
    </section>
  );
}
