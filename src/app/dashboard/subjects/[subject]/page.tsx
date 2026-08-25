"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  PlayIcon,
  Award01Icon,
} from "hugeicons-react";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";
import { GCE_SYLLABUS_DATA, SubjectSyllabus } from "@/lib/gceSyllabusData";
import { hapticTap, hapticSuccess } from "@/lib/haptics";
import { fireSideCannons } from "@/lib/confetti";

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const navItems = useNavItems();

  const rawSubjectParam = (params.subject as string) || "physics";
  const subjectKey = rawSubjectParam.toLowerCase().replace(/[^a-z]/g, "");

  // Find syllabus data or fallback to physics
  const syllabus: SubjectSyllabus = GCE_SYLLABUS_DATA[subjectKey] || GCE_SYLLABUS_DATA.physics;

  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>([]);

  // Load saved checked topic IDs from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`ticha_topics_${syllabus.id}`);
        if (stored) {
          setCompletedTopicIds(JSON.parse(stored));
        }
      } catch {
        // ignore
      }
    }
  }, [syllabus.id]);

  // Total topics count
  const allTopics = syllabus.categories.flatMap((c) => c.topics);
  const totalTopicsCount = allTopics.length;
  const completedCount = completedTopicIds.length;
  const progressPercent = totalTopicsCount > 0 ? Math.round((completedCount / totalTopicsCount) * 100) : 0;

  // Toggle topic completion state
  const handleToggleTopic = (topicId: string) => {
    hapticTap();
    let updated: string[];

    if (completedTopicIds.includes(topicId)) {
      updated = completedTopicIds.filter((id) => id !== topicId);
    } else {
      updated = [...completedTopicIds, topicId];
      hapticSuccess();
      if (updated.length === totalTopicsCount) {
        fireSideCannons();
      }
    }

    setCompletedTopicIds(updated);

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(`ticha_topics_${syllabus.id}`, JSON.stringify(updated));
      const newProgress = totalTopicsCount > 0 ? Math.round((updated.length / totalTopicsCount) * 100) : 0;
      localStorage.setItem(`ticha_progress_${syllabus.id}`, String(newProgress));
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7EC] pb-28 text-black antialiased font-sans selection:bg-[#B6FF00]">
      <main className="w-full max-w-md mx-auto p-4 pt-6 flex flex-col space-y-5 animate-page-in text-left">
        {/* Header */}
        <header className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/subjects"
              className="w-10 h-10 bg-white border-[2.5px] border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center transition-transform"
              aria-label="Back to subjects"
            >
              <ArrowLeft01Icon className="w-5 h-5 text-black" />
            </Link>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A]">
                {syllabus.name}
              </h1>
              <p className="text-xs font-bold text-stone-600">
                {syllabus.code} • GCE A-Level Syllabus
              </p>
            </div>
          </div>
        </header>

        {/* Progress Overview Card */}
        <div className={`${syllabus.bgColor} border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-800 flex items-center gap-1.5">
              <Award01Icon size={14} />
              <span>Syllabus Mastery</span>
            </span>
            <span className="bg-white border-[2px] border-black rounded-full px-3 py-0.5 text-xs font-black text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
              {progressPercent}% Complete
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-extrabold text-black">
              <span>{completedCount} of {totalTopicsCount} Topics Mastered</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-3.5 w-full bg-white border-[2.5px] border-black rounded-full overflow-hidden shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
              <div
                className="h-full bg-black transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => router.push(`/dashboard/daily-lessons?subject=${encodeURIComponent(syllabus.name)}`)}
            className="w-full bg-white hover:bg-stone-50 border-[2.5px] border-black rounded-xl py-2.5 px-3 font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all flex items-center justify-center gap-2 text-black"
          >
            <PlayIcon size={16} className="fill-current text-black" />
            <span>Practice Today&apos;s 1% Lesson</span>
          </button>
        </div>

        {/* Chronological Checklist of Topics (Grouped by Category) */}
        <div className="space-y-5 pt-1">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black uppercase tracking-wider text-stone-800">
              Chronological Topic Checklist
            </h3>
            <span className="text-[10px] font-black uppercase text-stone-600">
              Tap to mark as done
            </span>
          </div>

          {syllabus.categories.map((cat, cIdx) => (
            <div key={cIdx} className="space-y-3">
              <div className="bg-[#1A1A1A] text-white border-[2.5px] border-black rounded-xl px-3.5 py-2 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
                <span>{cat.categoryName}</span>
                <span className="text-[10px] text-[#B6FF00]">
                  {cat.topics.filter((t) => completedTopicIds.includes(t.id)).length}/{cat.topics.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {cat.topics.map((topic) => {
                  const isChecked = completedTopicIds.includes(topic.id);

                  return (
                    <div
                      key={topic.id}
                      onClick={() => handleToggleTopic(topic.id)}
                      className={`border-[3px] border-black rounded-xl p-3.5 shadow-[3.5px_3.5px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:translate-x-px active:translate-y-px active:shadow-none transition-all flex flex-col gap-2.5 ${
                        isChecked ? "bg-[#C8F7C5]" : "bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3.5 w-full">
                        {/* Checkbox */}
                        <div
                          className={`w-6 h-6 rounded-lg border-[2.5px] border-black flex items-center justify-center shrink-0 mt-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-colors ${
                            isChecked ? "bg-black text-[#B6FF00]" : "bg-white"
                          }`}
                        >
                          {isChecked && <CheckmarkCircle02Icon size={16} className="text-[#B6FF00]" />}
                        </div>

                        {/* Topic Title & Subtitle */}
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-stone-600">
                              Topic {topic.order}
                            </span>
                            {isChecked && (
                              <span className="text-[9px] font-black bg-black text-[#B6FF00] px-1.5 py-0.5 rounded uppercase">
                                Mastered ✓
                              </span>
                            )}
                          </div>
                          <h4 className={`text-sm font-black text-black leading-snug ${isChecked ? "line-through opacity-80" : ""}`}>
                            {topic.title}
                          </h4>
                          <p className="text-xs font-medium text-stone-700 leading-tight">
                            {topic.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Direct Topic Practice Button */}
                      <div className="flex items-center justify-end pt-1 border-t border-black/10">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/dashboard/daily-lessons?subject=${encodeURIComponent(syllabus.name)}&topic=${encodeURIComponent(topic.title)}`
                            );
                          }}
                          className="bg-[#B6FF00] hover:bg-[#a6ec00] border-[2px] border-black rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none flex items-center gap-1.5 text-black"
                        >
                          <PlayIcon size={12} className="fill-current text-black" />
                          <span>Study This Topic</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav items={navItems} />
    </div>
  );
}
