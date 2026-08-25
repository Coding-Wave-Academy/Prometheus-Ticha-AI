"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useIsMounted } from "@/hooks/useIsMounted";
import "@/lib/i18n";

export default function LanguageSelectionPage() {
  const { t, i18n: i18nInstance } = useTranslation();
  const isMounted = useIsMounted();
  const router = useRouter();

  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "fr">(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("ticha_lang") as "en" | "fr";
      if (savedLang === "en" || savedLang === "fr") return savedLang;
    }
    return "en";
  });

  const handleLanguageChange = (lang: "en" | "fr") => {
    setSelectedLanguage(lang);
    i18nInstance.changeLanguage(lang);
    localStorage.setItem("ticha_lang", lang);
  };

  const handleBack = () => {
    router.push("/getting-started");
  };

  const handleContinue = () => {
    router.push("/getting-started/goal");
  };

  return (
    <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center p-4 antialiased font-sans selection:bg-[#B6FF00]">
      <main className="w-full max-w-md min-h-[85vh] flex flex-col justify-between py-6 px-6 text-black">
        {/* Animated Header & Progress */}
        <motion.header
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-4 w-full"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="w-11 h-11 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all shrink-0"
            aria-label="Go back"
          >
            <svg
              className="w-6 h-6 stroke-[3.5px]"
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
          </motion.button>

          <div className="flex gap-1.5 w-full items-center">
            <motion.div
              layout
              className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1"
            />
            <div className="h-2 bg-transparent border-[1.5px] border-black rounded-full flex-1" />
            <div className="h-2 bg-transparent border-[1.5px] border-black rounded-full flex-1" />
            <div className="h-2 bg-transparent border-[1.5px] border-black rounded-full flex-1" />
            <div className="h-2 bg-transparent border-[1.5px] border-black rounded-full flex-1" />
          </div>
        </motion.header>

        {/* Animated Illustration */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.1 }}
          className="w-full flex justify-center my-4 relative"
        >
          <div className="w-full max-w-[260px] aspect-square relative flex items-center justify-center">
            <Image
              src="/images/Language illustration 1.svg"
              alt="Bilingual students greeting in English and French"
              width={300}
              height={300}
              priority
              className="object-contain fallback-hidden"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </motion.div>

        {/* Selection Area */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="w-full text-center space-y-6"
        >
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">
              {isMounted ? t("language.title") : "What language do you prefer?"}
            </h2>
            <div className="w-12 h-[3px] bg-black mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleLanguageChange("en")}
              className={`w-full py-4 px-4 rounded-xl font-black text-lg tracking-wide uppercase flex items-center justify-center gap-2 border-[3.5px] border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                selectedLanguage === "en"
                  ? "bg-[#B6FF00]"
                  : "bg-white hover:bg-stone-50"
              }`}
            >
              <span>{isMounted ? t("language.english") : "English"}</span>
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
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleLanguageChange("fr")}
              className={`w-full py-4 px-4 rounded-xl font-black text-lg tracking-wide uppercase flex items-center justify-center gap-2 border-[3.5px] border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                selectedLanguage === "fr"
                  ? "bg-[#B6FF00]"
                  : "bg-white hover:bg-stone-50"
              }`}
            >
              <span>{isMounted ? t("language.french") : "Français"}</span>
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
            </motion.button>
          </div>

          <p className="text-xs text-stone-500 font-bold tracking-tight">
            {isMounted
              ? t("language.footer")
              : "You can change this in settings anytime"}
          </p>
        </motion.div>

        <motion.footer
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.35 }}
          className="w-full mt-6"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleContinue}
            className="w-full bg-[#B6FF00] border-[3.5px] border-black rounded-xl py-4 px-4 font-black text-lg uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#a3e600] transition-colors"
          >
            {isMounted ? t("language.continue") : "Continue"}
          </motion.button>
        </motion.footer>
      </main>
    </div>
  );
}
