"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight01Icon, GridIcon } from "hugeicons-react";
import { hapticTap } from "@/lib/haptics";
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
    <section aria-labelledby="progress-title">
      <h2 id="progress-title" className="text-[28px] leading-none font-bold text-ink">Progress</h2>
      <Link
        href={featured.href}
        onClick={() => hapticTap()}
        aria-label={`${featured.title}: ${featured.progress}% complete`}
        className="group relative mt-[18px] flex items-center h-[160px] bg-card-sky-soft border-2 border-ink rounded-[18px] shadow-[4px_5px_0_0_var(--color-ink)] pl-[19px] pr-[22px] transition-transform duration-150 hover:-translate-y-0.5 outline-none focus-visible:ring-[3px] focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
      >
        <span className="w-[69px] h-[69px] shrink-0 rounded-full bg-white border-[3px] border-ink flex items-center justify-center shadow-[2px_3px_0_0_var(--color-ink)]" aria-hidden="true">
          <GridIcon size={30} className="text-ink" />
        </span>
        <span className="ml-[24px] flex-1 min-w-0 self-stretch pt-[32px]">
          <span className="block text-[14px] leading-none font-semibold uppercase tracking-[0.02em] text-progress-label">{featured.category}</span>
          <span className="mt-[16px] block text-[19px] leading-none font-semibold text-ink truncate pr-[110px]">{featured.title}</span>
          <span className="mt-[30px] block h-[12px] w-[calc(100%-92px)] rounded-full bg-progress-track overflow-hidden" aria-hidden="true">
            <span className="block h-full rounded-full bg-progress" style={{ width: `${Math.max(featured.progress, 2)}%` }} />
          </span>
        </span>
        <span className="absolute top-[28px] right-[20px] min-w-[71px] h-[34px] px-3 rounded-full bg-ink text-white text-[15px] font-bold flex items-center justify-center">
          {featured.progress}%
        </span>
        <span className="absolute bottom-[20px] right-[23px] w-[32px] h-[32px] rounded-full bg-ink flex items-center justify-center transition-transform group-hover:translate-x-0.5" aria-hidden="true">
          <ArrowRight01Icon size={18} className="text-white" />
        </span>
      </Link>
    </section>
  );
}
