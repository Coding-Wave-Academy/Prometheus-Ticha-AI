"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft01Icon,
  Add01Icon,
  Book01Icon,
  FlashIcon,
  SquareIcon,
  ComputerIcon,
  Globe02Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  SparklesIcon,
} from "hugeicons-react";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";
import { useProfile } from "@/hooks/useProfile";
import { ALL_AVAILABLE_SUBJECTS, GCE_SYLLABUS_DATA } from "@/lib/gceSyllabusData";
import { hapticTap, hapticSuccess } from "@/lib/haptics";

export default function AllSubjectsPage() {
  const router = useRouter();
  const navItems = useNavItems();
  const { profile, updateProfile } = useProfile();

  const [studentStruggles, setStudentStruggles] = useState<string[]>(["Physics", "Pure Mathematics", "ICT"]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load student's selected subjects (strictly deduplicated)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ticha_onboarding_struggles");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const seen = new Set<string>();
            const unique: string[] = [];
            for (const s of parsed) {
              const clean = String(s).trim();
              const lower = clean.toLowerCase();
              if (clean && !seen.has(lower)) {
                seen.add(lower);
                unique.push(clean);
              }
            }
            if (unique.length > 0) {
              setStudentStruggles(unique);
            }
          }
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const getSubjectProgress = (subjectName: string) => {
    if (typeof window !== "undefined") {
      const key = `ticha_progress_${subjectName.toLowerCase()}`;
      return Number(localStorage.getItem(key) || 0);
    }
    return 0;
  };

  // Add a new subject to student's subjects list
  const handleAddSubject = async (subjectName: string) => {
    hapticSuccess();
    if (studentStruggles.includes(subjectName)) return;

    const updated = [...studentStruggles, subjectName];
    setStudentStruggles(updated);

    if (typeof window !== "undefined") {
      localStorage.setItem("ticha_onboarding_struggles", JSON.stringify(updated));
    }

    setIsAddModalOpen(false);

    // Save to user profile if authenticated
    if (profile) {
      await updateProfile({});
    }
  };

  const currentLevel = profile?.education_level === "ol" ? "GCE O-Level" : "GCE A-Level";

  // Filter available subjects for adding modal (exclude already selected ones)
  const availableToAdd = ALL_AVAILABLE_SUBJECTS.filter(
    (s) => !studentStruggles.some((st) => st.toLowerCase() === s.name.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF7EC] pb-28 text-black antialiased font-sans selection:bg-[#B6FF00]">
      <main className="w-full max-w-md mx-auto p-4 pt-6 flex flex-col space-y-5 animate-page-in text-left">
        {/* Header */}
        <header className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="w-10 h-10 bg-white border-[2.5px] border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center transition-transform"
              aria-label="Back to dashboard"
            >
              <ArrowLeft01Icon className="w-5 h-5 text-black" />
            </Link>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A]">
                All My Subjects
              </h1>
              <p className="text-xs font-bold text-stone-600">
                {studentStruggles.length} Subjects Enrolled • {currentLevel}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-10 h-10 bg-[#B6FF00] border-[2.5px] border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center transition-transform shrink-0"
            aria-label="Add new subject"
          >
            <Add01Icon size={22} className="text-black" />
          </button>
        </header>

        {/* Action Callout */}
        <div className="bg-[#B6FF00] border-[3.5px] border-black rounded-2xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-800">
              GCE Syllabus Progress
            </span>
            <h3 className="text-sm font-black text-black">
              Tap any subject card to view its topic checklist
            </h3>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-white border-[2px] border-black rounded-xl px-3 py-2 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all text-black shrink-0 flex items-center gap-1"
          >
            <Add01Icon size={14} />
            <span>Add Subject</span>
          </button>
        </div>

        {/* Subjects List */}
        <div className="space-y-4">
          {studentStruggles.map((subName) => {
            const progress = getSubjectProgress(subName);
            const key = subName.toLowerCase().replace(/[^a-z]/g, "");
            const syllabus = GCE_SYLLABUS_DATA[key];
            const bgColor = syllabus?.bgColor || "bg-[#FFB040]";

            return (
              <div
                key={subName}
                onClick={() => {
                  hapticTap();
                  router.push(`/dashboard/subjects/${key || "physics"}`);
                }}
                className={`${bgColor} border-[3.5px] border-black rounded-2xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:translate-x-px active:translate-y-px active:shadow-none transition-all relative space-y-3`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                    {subName.toLowerCase().includes("physic") ? (
                      <FlashIcon size={24} className="text-black" />
                    ) : subName.toLowerCase().includes("math") ? (
                      <SquareIcon size={24} className="text-black" />
                    ) : subName.toLowerCase().includes("ict") ? (
                      <ComputerIcon size={24} className="text-black" />
                    ) : (
                      <Book01Icon size={24} className="text-black" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-800 block">
                      {syllabus?.category || "GCE Subject"}
                    </span>
                    <h3 className="text-lg font-black text-black leading-tight truncate">
                      {subName}
                    </h3>
                    <p className="text-xs font-bold text-stone-900 leading-tight">
                      {syllabus ? `${syllabus.categories.flatMap((c) => c.topics).length} GCE Topics` : "Exam Syllabus"}
                    </p>
                  </div>

                  <div className="bg-[#1A1A1A] text-white border border-black rounded-full px-3 py-1 text-xs font-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                    {progress}%
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] font-black uppercase text-stone-900">
                    <span>Syllabus Completion</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-white border-[1.5px] border-black rounded-full overflow-hidden shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <div
                      className="h-full bg-black transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Add Subject Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#FAF7EC] border-[3.5px] border-black rounded-2xl p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left space-y-4 max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SparklesIcon size={18} className="text-amber-600" />
                  <h3 className="text-lg font-black uppercase tracking-tight text-black">
                    Add Subject ({currentLevel})
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 bg-white border-[2px] border-black rounded-lg flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Cancel01Icon size={16} className="text-black" />
                </button>
              </div>

              <p className="text-xs font-bold text-stone-600">
                Select a subject related to your {currentLevel} curriculum to track syllabus topics and practice daily lessons.
              </p>

              {/* List of Available Subjects */}
              <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                {availableToAdd.length === 0 ? (
                  <div className="bg-white border-[2px] border-black rounded-xl p-4 text-center text-xs font-black">
                    🎉 You have added all available subjects for {currentLevel}!
                  </div>
                ) : (
                  availableToAdd.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => handleAddSubject(sub.name)}
                      className={`${sub.bgColor} border-[2.5px] border-black rounded-xl p-3 shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:translate-x-px active:translate-y-px active:shadow-none transition-all flex items-center justify-between`}
                    >
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-stone-800 block">
                          {sub.category}
                        </span>
                        <h4 className="font-black text-sm text-black">
                          {sub.name}
                        </h4>
                      </div>

                      <button
                        className="bg-white border-[2px] border-black rounded-lg px-2.5 py-1 text-[10px] font-black uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                      >
                        + Add
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav items={navItems} />
    </div>
  );
}
