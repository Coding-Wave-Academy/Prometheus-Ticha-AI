"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useIsMounted } from "@/hooks/useIsMounted";
import "@/lib/i18n";

interface SubjectStruggle {
  id: string;
  nameKey?: string;
  name: string;
  iconBg: string;
  icon: React.ReactNode;
}

interface ApiSubject {
  id: string;
  name: string;
  iconBg?: string;
  iconSlug?: string;
}

function getSubjectSvgIcon(slug: string) {
  const s = slug.toLowerCase();
  if (s.includes("math") || s.includes("calculus")) {
    return (
      <svg className="w-6 h-6 text-black fill-current" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
      </svg>
    );
  }
  if (s.includes("phys")) {
    return (
      <svg className="w-6 h-6 text-black stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  }
  if (s.includes("chem")) {
    return (
      <svg className="w-6 h-6 text-black stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6" />
      </svg>
    );
  }
  if (s.includes("cs") || s.includes("dsa") || s.includes("ict")) {
    return (
      <svg className="w-6 h-6 text-black fill-current" viewBox="0 0 24 24">
        <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
      </svg>
    );
  }
  return (
    <svg className="w-6 h-6 text-black fill-current" viewBox="0 0 24 24">
      <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
    </svg>
  );
}

export default function StrugglesIdentificationPage() {
  const { t } = useTranslation();
  const isMounted = useIsMounted();
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set());
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [customSubjects, setCustomSubjects] = useState<SubjectStruggle[]>([]);
  const [aiSubjects, setAiSubjects] = useState<SubjectStruggle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStruggles = async () => {
      try {
        const goal = typeof window !== "undefined" ? localStorage.getItem("ticha_onboarding_goal") || "gce" : "gce";
        const education = typeof window !== "undefined" ? localStorage.getItem("ticha_onboarding_education") || "al" : "al";
        
        const res = await fetch("/api/ai/struggles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ goal, education }),
        });
        if (!res.ok) throw new Error("API call failed");
        
        const data = await res.json();
        const mapped: SubjectStruggle[] = (data.subjects || []).slice(0, 3).map((sub: ApiSubject) => ({
          id: sub.id,
          name: sub.name,
          iconBg: sub.iconBg || "bg-[#B6FF00]",
          icon: getSubjectSvgIcon(sub.iconSlug || sub.id),
        }));
        setAiSubjects(mapped);
      } catch (err) {
        console.error("Failed to load struggles subjects from AI", err);
        setAiSubjects([
          { id: "math", name: "Pure Mathematics", iconBg: "bg-[#A6B7CE]", icon: getSubjectSvgIcon("math") },
          { id: "physics", name: "Advanced Physics", iconBg: "bg-[#B6FF00]", icon: getSubjectSvgIcon("physics") },
          { id: "furtherMath", name: "Further Mathematics", iconBg: "bg-[#FFD9E0]", icon: getSubjectSvgIcon("math") },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStruggles();
  }, []);

  const subjects = [...aiSubjects, ...customSubjects];

  const handleToggleSubject = (id: string) => {
    setSelectedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBack = () => {
    router.push("/getting-started/education");
  };

  const handleSaveCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;

    const existing = subjects.find(
      (s) => s.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) {
      setSelectedSubjects((prev) => {
        const next = new Set(prev);
        next.add(existing.id);
        return next;
      });
      setCustomInput("");
      setIsAddingCustom(false);
      return;
    }

    const newId = `custom-${trimmed.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    const newSubject: SubjectStruggle = {
      id: newId,
      name: trimmed,
      iconBg: "bg-white",
      icon: getSubjectSvgIcon("custom"),
    };

    setCustomSubjects((prev) => [...prev, newSubject]);
    setSelectedSubjects((prev) => {
      const next = new Set(prev);
      next.add(newId);
      return next;
    });

    setCustomInput("");
    setIsAddingCustom(false);
  };

  const handleContinue = () => {
    if (selectedSubjects.size === 0) return;
    
    const chosenNames = Array.from(
      new Set(
        Array.from(selectedSubjects).map((id) => {
          const sub = subjects.find((s) => s.id === id);
          return sub ? sub.name : id;
        })
      )
    );

    localStorage.setItem("ticha_onboarding_struggles", JSON.stringify(chosenNames));
    router.push("/getting-started/intel");
  };

  return (
    <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center p-4 antialiased font-sans selection:bg-[#B6FF00]">
      <main className="w-full max-w-md min-h-[85vh] flex flex-col justify-between py-6 px-6 text-black items-center">
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
            className="w-11 h-11 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all shrink-0"
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
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1" />
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1" />
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1" />
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1" />
            <div className="h-2 bg-transparent border-[1.5px] border-black rounded-full flex-1" />
          </div>
        </motion.header>

        {/* Title Area */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-left w-full space-y-2.5 mt-8 mb-4 px-2"
        >
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">
            {isMounted ? t("struggles.title") : "Where do you need the most help?"}
          </h1>
          <p className="text-[15px] text-stone-600 font-medium leading-tight">
            {isMounted
              ? t("struggles.subtitle")
              : "Tell Ticha AI what's tough so we can tailor your insights."}
          </p>
        </motion.div>

        {/* Animated Struggle Cards Area */}
        <div className="space-y-4 my-auto w-full">
          {isLoading ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full bg-white border-[3.5px] border-black rounded-2xl p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center text-center space-y-3"
            >
              <div className="w-10 h-10 border-[4.5px] border-black border-t-[#B6FF00] rounded-full animate-spin" />
              <p className="text-sm font-black uppercase tracking-wider text-black">
                {isMounted ? t("struggles.loadingText") : "Consulting Ticha AI for top challenge areas..."}
              </p>
            </motion.div>
          ) : (
            subjects.map((subject, idx) => {
              const isSelected = selectedSubjects.has(subject.id);
              return (
                <motion.button
                  key={subject.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.1 + idx * 0.08,
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleToggleSubject(subject.id)}
                  className={`w-full p-4 rounded-xl border-[3.5px] border-black flex items-center transition-all bg-white group ${
                    isSelected
                      ? "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]"
                      : "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-stone-50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 ${subject.iconBg} border-[2.5px] border-black rounded-lg flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                  >
                    {subject.icon}
                  </div>

                  <h2 className="font-bold text-base md:text-lg text-[#1A1A1A] tracking-tight flex-1 ml-4 text-left">
                    {subject.name}
                  </h2>

                  <div
                    className={`w-6 h-6 rounded-full border-[2.5px] border-black flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-black"
                        : "bg-transparent group-hover:border-black/40"
                    }`}
                  >
                    <svg
                      className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-stone-300"} transition-colors`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                </motion.button>
              );
            })
          )}

          {!isLoading && (
            <AnimatePresence>
              {isAddingCustom ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full p-4 rounded-xl border-[3.5px] border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3 overflow-hidden"
                >
                  <input
                    type="text"
                    placeholder={isMounted ? t("struggles.customPlaceholder") : "Subject name..."}
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="w-full bg-white border-[2.5px] border-black rounded-lg p-2.5 text-sm font-bold outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveCustom();
                    }}
                  />
                  <div className="flex justify-end gap-2.5 w-full">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCustom(false);
                        setCustomInput("");
                      }}
                      className="bg-stone-200 border-[2.5px] border-black rounded-lg px-4 py-2 font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none"
                    >
                      {isMounted ? t("struggles.cancel") : "Cancel"}
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCustom}
                      className="bg-[#B6FF00] border-[2.5px] border-black rounded-lg px-4 py-2 font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none"
                    >
                      {isMounted ? t("struggles.save") : "Save"}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setIsAddingCustom(true)}
                  className="w-full p-4 rounded-xl border-[3px] border-black border-dashed flex items-center justify-center text-center group active:translate-x-px active:translate-y-px active:bg-stone-50 transition-transform"
                >
                  <svg className="w-5 h-5 fill-current text-black mr-2" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  <span className="font-bold text-base text-[#1A1A1A]">
                    {isMounted ? t("struggles.addAnother") : "Add another subject"}
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Footer Continue Button */}
        <motion.footer
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="w-full mt-6"
        >
          <motion.button
            whileHover={selectedSubjects.size > 0 && !isLoading ? { scale: 1.02 } : {}}
            whileTap={selectedSubjects.size > 0 && !isLoading ? { scale: 0.97 } : {}}
            onClick={handleContinue}
            disabled={selectedSubjects.size === 0 || isLoading}
            className={`w-full border-[3.5px] border-black rounded-xl py-4 px-4 font-black text-lg uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              selectedSubjects.size > 0 && !isLoading
                ? "bg-[#FFB040] hover:bg-[#ffa326] text-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                : "bg-[#E8E6DA] text-stone-400 cursor-not-allowed opacity-80 shadow-none border-stone-400"
            }`}
          >
            <span>{isMounted ? t("struggles.continue") : "Continue"}</span>
            <svg
              className="w-5 h-5 stroke-[3.5px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </motion.button>
        </motion.footer>
      </main>
    </div>
  );
}
