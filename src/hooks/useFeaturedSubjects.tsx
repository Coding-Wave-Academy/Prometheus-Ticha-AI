"use client";

import React, { useState, useEffect } from "react";
import { SubjectData } from "@/types";

// Subject icon/color lookup by keyword matching
const SUBJECT_STYLES: Array<{
  keywords: string[];
  icon: React.ReactNode;
  bgColor: string;
  category: string;
}> = [
  {
    keywords: ["physics", "physic"],
    bgColor: "bg-[#B6FF00]",
    category: "Sciences",
    icon: (
      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx={12} cy={12} r={4} />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M2 12h2m16 0h2m-3.636-6.364-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05 4.636 4.636" />
      </svg>
    ),
  },
  {
    keywords: ["math", "maths", "calculus", "algebra", "statistics"],
    bgColor: "bg-[#D3E2FF]",
    category: "Mathematics",
    icon: (
      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15M19.5 19.5l-15-15m0 15 15-15" />
      </svg>
    ),
  },
  {
    keywords: ["chemistry", "chem"],
    bgColor: "bg-[#FFD9E0]",
    category: "Sciences",
    icon: (
      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6m-3 0v6.5m0 0L5.5 18A2 2 0 007.4 21h9.2a2 2 0 001.9-2.5L15 9.5" />
      </svg>
    ),
  },
  {
    keywords: ["biology", "bio", "life science"],
    bgColor: "bg-[#C1F0C1]",
    category: "Sciences",
    icon: (
      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    keywords: ["computer", "ict", "technology", "programming", "coding"],
    bgColor: "bg-[#FFE5C4]",
    category: "Technology",
    icon: (
      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
      </svg>
    ),
  },
  {
    keywords: ["literature", "english", "french", "language"],
    bgColor: "bg-[#EDD9FF]",
    category: "Languages",
    icon: (
      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    keywords: ["history", "geography", "geo", "economics", "social"],
    bgColor: "bg-[#FFF0B3]",
    category: "Humanities",
    icon: (
      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3 12c0 .778.099 1.533.284 2.253" />
      </svg>
    ),
  },
];

const BG_COLORS = ["bg-[#B6FF00]", "bg-[#D3E2FF]", "bg-[#FFD9E0]", "bg-[#FFE5C4]", "bg-[#C1F0C1]", "bg-[#EDD9FF]"];

function getStyleForSubject(name: string, index: number) {
  const lower = name.toLowerCase();
  const match = SUBJECT_STYLES.find((s) => s.keywords.some((kw) => lower.includes(kw)));
  if (match) return match;
  // Generic fallback with rotating colors
  return {
    bgColor: BG_COLORS[index % BG_COLORS.length],
    category: "Subjects",
    icon: (
      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
  };
}

/**
 * useFeaturedSubjects — reads onboarding struggle selections and fetches
 * per-subject progress percentages from the Supabase-backed progress API.
 */
export function useFeaturedSubjects(userId?: string | null) {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        // 1. Read selected struggles from localStorage (set during onboarding)
        const raw = localStorage.getItem("ticha_onboarding_struggles");
        const names: string[] = raw ? JSON.parse(raw) : [];

        if (names.length === 0) {
          setSubjects([]);
          return;
        }

        // 2. Fetch progress data from backend
        let progressMap: Record<string, number> = {};
        if (userId) {
          try {
            const res = await fetch(`/api/progress?userId=${userId}`);
            if (res.ok) {
              const json = await res.json();
              progressMap = json.progress || {};
            }
          } catch {
            // progress API unavailable — use 0% for all
          }
        }

        // 3. Map to SubjectData with icons, colors, and real progress
        const mapped: SubjectData[] = names.map((name, i) => {
          const style = getStyleForSubject(name, i);
          // Try to find progress by exact name or case-insensitive partial match
          const progressKey = Object.keys(progressMap).find(
            (k) => k.toLowerCase() === name.toLowerCase() || name.toLowerCase().includes(k.toLowerCase())
          );
          const progress = progressKey ? progressMap[progressKey] : 0;

          return {
            id: `subject-${i}-${name.toLowerCase().replace(/\s+/g, "-")}`,
            title: name,
            subtitle: `${style.category} — Personalized`,
            category: style.category,
            progress,
            bgColor: style.bgColor,
            icon: style.icon,
          };
        });

        if (!cancelled) setSubjects(mapped);
      } catch (err) {
        console.error("useFeaturedSubjects error:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [userId]);

  return { subjects, isLoading };
}
