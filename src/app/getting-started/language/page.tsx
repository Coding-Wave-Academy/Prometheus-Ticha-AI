"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import "@/lib/i18n"; // Import initialization

export default function LanguageSelectionPage() {
  const { t, i18n: i18nInstance } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "fr">("en");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Load language preference after mounting on the client to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    const savedLang = localStorage.getItem("ticha_lang") as "en" | "fr";
    if (savedLang === "en" || savedLang === "fr") {
      setSelectedLanguage(savedLang);
    }
  }, []);

  const handleLanguageChange = (lang: "en" | "fr") => {
    setSelectedLanguage(lang);
    i18nInstance.changeLanguage(lang);
    localStorage.setItem("ticha_lang", lang);
  };

  const handleBack = () => {
    router.push("/getting-started");
  };

  const handleContinue = () => {
    console.log(`Proceeding with language: ${selectedLanguage}`);
    router.push("/getting-started/goal");
  };

  return (
    <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center p-4 antialiased font-sans">
      {/* PWA Mobile-First Wrapper Container */}
      <main className="w-full max-w-md min-h-[85vh] flex flex-col justify-between py-6 px-6 text-black animate-page-in">
        {/* Top Header: Back Button + Segmented Progress Bar */}
        <header className="flex items-center gap-4 w-full">
          {/* Back Circular Button */}
          <button
            onClick={handleBack}
            className="w-11 h-11 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex-shrink-0"
            aria-label="Go back"
          >
            <svg
              className="w-6.5 h-6.5 stroke-[3.5px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </button>

          {/* Progress Tracker (5 Segments) */}
          <div className="flex gap-1.5 w-full items-center">
            {/* Step 1: Active Progress */}
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1"></div>
            {/* Step 2 to 5: Inactive Progress */}
            <div className="h-2 bg-transparent border-[1.5px] border-black rounded-full flex-1"></div>
            <div className="h-2 bg-transparent border-[1.5px] border-black rounded-full flex-1"></div>
            <div className="h-2 bg-transparent border-[1.5px] border-black rounded-full flex-1"></div>
            <div className="h-2 bg-transparent border-[1.5px] border-black rounded-full flex-1"></div>
          </div>
        </header>

        {/* Central Illustration Area */}
        <div className="w-full flex justify-center my-4 relative">
          <div className="w-full max-w-[280px] aspect-square relative flex items-center justify-center">
            <Image
              src="/images/Language illustration 1.svg"
              alt="Bilingual students greeting in English and French"
              width={320}
              height={320}
              priority
              className="object-contain fallback-hidden"
              // Temporary visual outline container just while your file is missing:
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            {/* Visual fallback container placeholder for local development */}
            <div className="absolute inset-0 border-2 border-dashed border-stone-300 rounded-2xl flex flex-col items-center justify-center bg-stone-100/40 text-center p-4 text-xs font-semibold text-stone-400 select-none pointer-events-none [body:has(img[style*='display:\ none']):_&]:flex hidden">
              <span className="text-xl mb-1">🖼️</span>
              Place single asset here as: <br />
              <code className="bg-white px-1 py-0.5 rounded border mt-1">
                public/images/Language illustration 1.svg
              </code>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Choice Content */}
        <div className="w-full text-center space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">
              {isMounted ? t("language.title") : "What language do you prefer?"}
            </h2>
            <div className="w-12 h-[3px] bg-black mx-auto rounded-full"></div>
          </div>

          {/* Toggle Choice Row */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {/* English Card Button */}
            <button
              onClick={() => handleLanguageChange("en")}
              className={`w-full py-4 px-4 rounded-xl font-black text-lg tracking-wide uppercase flex items-center justify-center gap-2 border-[3.5px] border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                selectedLanguage === "en"
                  ? "bg-[#B6FF00]"
                  : "bg-white hover:bg-stone-50"
              }`}
            >
              <span>English</span>
              <svg
                className="w-5 h-5 stroke-[2.5px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM2.25 12h19.5M4.5 12a15.75 15.75 0 0 0 15 0M12 2.25v19.5"
                />
              </svg>
            </button>

            {/* Français Card Button */}
            <button
              onClick={() => handleLanguageChange("fr")}
              className={`w-full py-4 px-4 rounded-xl font-black text-lg tracking-wide uppercase flex items-center justify-center gap-2 border-[3.5px] border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                selectedLanguage === "fr"
                  ? "bg-[#B6FF00]"
                  : "bg-white hover:bg-stone-50"
              }`}
            >
              <span>Français</span>
              <svg
                className="w-5 h-5 stroke-[2.5px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM2.25 12h19.5M4.5 12a15.75 15.75 0 0 0 15 0M12 2.25v19.5"
                />
              </svg>
            </button>
          </div>

          <p className="text-xs text-stone-500 font-bold tracking-tight">
            {isMounted
              ? t("language.footer")
              : "You can change this in settings anytime"}
          </p>
        </div>

        {/* Global System Action Button */}
        <footer className="w-full mt-6">
          <button
            onClick={handleContinue}
            className="w-full bg-[#B6FF00] border-[3.5px] border-black rounded-xl py-4 px-4 font-black text-lg uppercase tracking-wider transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-[#a3e600]"
          >
            {isMounted ? t("language.continue") : "Continue"}
          </button>
        </footer>
      </main>
    </div>
  );
}
