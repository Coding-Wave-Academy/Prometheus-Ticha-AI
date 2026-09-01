"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GridIcon } from "hugeicons-react";
import { useProfile } from "@/hooks/useProfile";
import { normalizeSubjectName } from "@/lib/videoCatalog";

interface ProgressSubject {
  id: string;
  category: string;
  title: string;
  progress: number;
  href: string;
}

/**
 * ProgressCardWeb — Right-column progress section for the web/tablet dashboard.
 * Shows a blue-tinted card with the student's top subject, progress bar, and
 * percentage badge. Connected to useProfile() for live struggle data and
 * localStorage for progress tracking.
 */
export default function ProgressCardWeb() {
  const router = useRouter();
  const { profile } = useProfile();

  // Helper to read progress from localStorage
  const getProgress = (subjectKey: string): number => {
    if (typeof window === "undefined") return 0;
    const s = subjectKey.toLowerCase().trim();
    const candidateKeys = [`ticha_progress_${s}`];
    if (s.includes("math")) {
      candidateKeys.push(
        "ticha_progress_math",
        "ticha_progress_pure math",
        "ticha_progress_pure maths",
        "ticha_progress_pure mathematics",
        "ticha_progress_mathematics"
      );
    } else if (s.includes("phys")) {
      candidateKeys.push("ticha_progress_physics", "ticha_progress_phys");
    } else if (s.includes("ict") || s.includes("comput")) {
      candidateKeys.push(
        "ticha_progress_ict",
        "ticha_progress_computing",
        "ticha_progress_computer science"
      );
    } else if (s.includes("chem")) {
      candidateKeys.push("ticha_progress_chemistry", "ticha_progress_chem");
    } else if (s.includes("bio")) {
      candidateKeys.push("ticha_progress_biology", "ticha_progress_bio");
    }
    let maxVal = 0;
    for (const key of candidateKeys) {
      const stored = localStorage.getItem(key);
      if (stored) {
        const num = Number(stored);
        if (num > maxVal) maxVal = num;
      }
    }
    return Math.min(100, maxVal);
  };

  // Map profile struggles to progress subjects
  const struggles = (profile?.struggles as string[] | undefined) ?? [
    "Pure Mathematics",
    "Physics",
    "ICT",
  ];

  const subjectMeta: Record<
    string,
    { category: string; title: string; slug: string }
  > = {
    Physics: {
      category: "SCIENCES",
      title: "Advanced Physics",
      slug: "physics",
    },
    "Pure Mathematics": {
      category: "MATHEMATICS",
      title: "Pure Maths With Mechanics",
      slug: "math",
    },
    ICT: {
      category: "TECHNOLOGY",
      title: "ICT & Computing",
      slug: "ict",
    },
    Chemistry: {
      category: "SCIENCES",
      title: "Chemistry",
      slug: "chemistry",
    },
    Biology: {
      category: "SCIENCES",
      title: "Biology",
      slug: "biology",
    },
    "English Language": {
      category: "ARTS",
      title: "English Language",
      slug: "english",
    },
    "French Language": {
      category: "ARTS",
      title: "French Language",
      slug: "french",
    },
    "Further Mathematics": {
      category: "MATHEMATICS",
      title: "Further Mathematics",
      slug: "math",
    },
  };

  // Build progress list from the first 3 struggles
  const progressSubjects: ProgressSubject[] = struggles
    .slice(0, 3)
    .map((s, idx) => {
      const normalized = normalizeSubjectName(s);
      const meta = subjectMeta[normalized] || {
        category: "GENERAL",
        title: s,
        slug: s.toLowerCase().replace(/\s+/g, "-"),
      };
      return {
        id: `progress-${idx}`,
        category: meta.category,
        title: meta.title,
        progress: getProgress(normalized),
        href: `/dashboard/subjects/${meta.slug}`,
      };
    });

  // Show the first subject as the featured progress card
  const featured = progressSubjects[0];
  if (!featured) return null;

  return (
    <section className="w-full">
      <h3 className="text-xl font-black tracking-tight text-[#1A1A1A] mb-4">
        Progress
      </h3>

      <motion.div
        whileHover={{ scale: 1.01 }}
        onClick={() => router.push(featured.href)}
        className="bg-[#D3E2FF] border-[3px] border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer relative overflow-hidden active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1">
            {/* Subject Icon */}
            <div className="w-10 h-10 bg-white border-[2.5px] border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
              <GridIcon size={18} className="text-black" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-600 block">
                {featured.category}
              </span>
              <h4 className="text-sm font-black text-black leading-tight truncate">
                {featured.title}
              </h4>
            </div>
          </div>

          {/* Percentage Badge */}
          <div className="bg-[#C8FF2A] border-[2px] border-black rounded-full py-1 px-3 font-black text-xs text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] shrink-0">
            {featured.progress}%
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-white/60 border-[1.5px] border-black/20 rounded-full overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${featured.progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="h-full bg-[#3B82F6] rounded-full"
          />
        </div>

        {/* Navigate Arrow */}
        <div className="flex justify-end">
          <div className="w-8 h-8 bg-black border-[2px] border-black rounded-full flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
            <svg
              className="w-4 h-4 stroke-[3px] text-white"
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
          </div>
        </div>
      </motion.div>

      {/* Additional subjects (compact list) */}
      {progressSubjects.length > 1 && (
        <div className="mt-3 space-y-2">
          {progressSubjects.slice(1).map((subj) => (
            <div
              key={subj.id}
              onClick={() => router.push(subj.href)}
              className="bg-white border-[2.5px] border-black rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all hover:bg-stone-50"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">
                  {subj.category}
                </span>
                <span className="text-sm font-bold text-black truncate">
                  {subj.title}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-16 h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#3B82F6] rounded-full transition-all"
                    style={{ width: `${subj.progress}%` }}
                  />
                </div>
                <span className="text-xs font-black text-stone-600">
                  {subj.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
