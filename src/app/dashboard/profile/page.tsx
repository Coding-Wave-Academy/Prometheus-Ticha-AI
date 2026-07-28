"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useNavItems } from "@/hooks/useNavItems";
import BottomNav from "@/components/layout/BottomNav";
import "@/lib/i18n";

interface BadgeItem {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  bgColor: string;
}

export function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const navItems = useNavItems();

  // Form input states
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [region, setRegion] = useState("");
  const [educationLevel, setEducationLevel] = useState("al");
  
  // Notification banner state
  const [toastMessage, setToastMessage] = useState("");

  // Refs for focusing inputs from query parameters
  const nameRef = useRef<HTMLInputElement>(null);
  const schoolRef = useRef<HTMLInputElement>(null);
  const regionRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    // Initial load from localStorage
    const savedName = localStorage.getItem("ticha_user_fullname") || "Amadou";
    const savedSchool = localStorage.getItem("ticha_school_name") || "GBHS Molyko";
    const savedRegion = localStorage.getItem("ticha_region") || "littoral";
    const savedLevel = localStorage.getItem("ticha_education_level") || "al";

    setFullName(savedName);
    setSchoolName(savedSchool);
    setRegion(savedRegion);
    setEducationLevel(savedLevel);

    // Optional query parameter focus handling
    const focus = searchParams.get("focus");
    setTimeout(() => {
      if (focus === "name") {
        nameRef.current?.focus();
        nameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (focus === "school") {
        schoolRef.current?.focus();
        schoolRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (focus === "region") {
        regionRef.current?.focus();
        regionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 300);
  }, [searchParams]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    localStorage.setItem("ticha_user_fullname", fullName);
    localStorage.setItem("ticha_school_name", schoolName);
    localStorage.setItem("ticha_region", region);
    localStorage.setItem("ticha_education_level", educationLevel);
    localStorage.setItem("ticha_profile_completed", "true");

    showToast("Profile updated successfully!");
  };

  // Badges catalog including Novice badge for 1st time users
  const badges: BadgeItem[] = [
    {
      id: "novice",
      name: "Level 1: Novice",
      category: "Starter",
      description: "Unlocked upon joining Ticha AI",
      unlocked: true,
      bgColor: "bg-[#B6FF00]",
      icon: (
        <svg className="w-6 h-6 text-black fill-current" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ),
    },
    {
      id: "streak",
      name: "Streak Master",
      category: "Consistency",
      description: "Maintained a 7-day study streak",
      unlocked: true,
      bgColor: "bg-[#FFB040]",
      icon: (
        <svg className="w-6 h-6 text-orange-600 fill-current" viewBox="0 0 24 24">
          <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.6 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-5.52-4.5-9.33-6.5-13.33z" />
        </svg>
      ),
    },
    {
      id: "gce-pioneer",
      name: "GCE Pioneer",
      category: "Academic",
      description: "Completed 5 GCE Past Paper practice sets",
      unlocked: true,
      bgColor: "bg-[#D3E2FF]",
      icon: (
        <svg className="w-6 h-6 text-blue-700 fill-current" viewBox="0 0 24 24">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
        </svg>
      ),
    },
    {
      id: "quiz-ace",
      name: "Quiz Ace",
      category: "Mastery",
      description: "Scored 100% on AI Generated MCQ Quiz",
      unlocked: false,
      bgColor: "bg-stone-200",
      icon: (
        <svg className="w-6 h-6 text-stone-500 fill-current" viewBox="0 0 24 24">
          <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V18H8v2h8v-2h-3v-2.1c2.16-.4 3.84-2.11 4.39-4.36C19.85 11.23 21 9.25 21 7V6c0-1.1-.9-1-2-1z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7EC] text-black antialiased font-sans pb-28 selection:bg-[#B6FF00]">
      <main className="w-full max-w-md mx-auto p-4 pt-6 flex flex-col items-center">
        
        {/* Header */}
        <header className="flex items-center justify-between w-full mb-6 border-b-[3.5px] border-black pb-3">
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">
            Student Profile
          </h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-10 h-10 bg-white border-[3px] border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all"
            aria-label="Back to dashboard"
          >
            ✕
          </button>
        </header>

        {/* Profile Card Header */}
        <section className="w-full bg-white border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6 text-center flex flex-col items-center relative">
          <div className="relative w-24 h-24 rounded-full border-[3.5px] border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-3 bg-[#B6FF00]">
            <Image
              src="/images/amadou-avatar.png"
              alt={`${fullName}'s profile photo`}
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          </div>
          <h2 className="text-2xl font-black text-[#1A1A1A] tracking-tight">
            {fullName || "Amadou"}
          </h2>
          <p className="text-xs font-bold text-stone-600 mt-0.5">
            {schoolName || "GBHS Molyko"} • <span className="uppercase">{region || "Littoral"}</span>
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span className="bg-[#B6FF00] border-[2px] border-black rounded-full px-3 py-1 font-black text-xs uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
              Level 1: Novice
            </span>
            <span className="bg-[#FFB040] border-[2px] border-black rounded-full px-3 py-1 font-black text-xs uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
              <svg className="w-3.5 h-3.5 fill-current text-orange-600" viewBox="0 0 24 24">
                <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.6 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-5.52-4.5-9.33-6.5-13.33z" />
              </svg>
              <span>12 Day Streak</span>
            </span>
          </div>
        </section>

        {/* Badges Showcase Section */}
        <section className="w-full bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6 text-left">
          <div className="flex items-center justify-between border-b-[2.5px] border-black pb-2 mb-4">
            <h3 className="text-base font-black uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <svg className="w-5 h-5 fill-current text-black" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span>Earned Badges</span>
            </h3>
            <span className="text-xs font-extrabold uppercase bg-stone-100 border-[1.5px] border-black rounded-full px-2.5 py-0.5">
              3 / 4 Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3 border-[2.5px] border-black rounded-xl flex flex-col items-center text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${badge.bgColor}`}
              >
                <div className="w-10 h-10 bg-white border-[2px] border-black rounded-full flex items-center justify-center mb-1.5 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  {badge.icon}
                </div>
                <h4 className="font-black text-xs uppercase text-black leading-tight">
                  {badge.name}
                </h4>
                <p className="text-[10px] font-bold text-stone-700 leading-tight mt-1">
                  {badge.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Profile Info Form */}
        <section className="w-full bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6 text-left">
          <h3 className="text-base font-black uppercase tracking-wider text-stone-900 border-b-[2.5px] border-black pb-2 mb-4">
            Edit Information
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Full Name */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="profile-name" className="text-xs font-extrabold uppercase tracking-widest text-stone-850">
                Full Name
              </label>
              <input
                id="profile-name"
                ref={nameRef}
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white border-[3.5px] border-black rounded-xl p-3 text-[15px] font-medium outline-none placeholder-stone-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all"
              />
            </div>

            {/* Target Education Level */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="profile-level" className="text-xs font-extrabold uppercase tracking-widest text-stone-850">
                Education Target
              </label>
              <div className="relative rounded-xl border-[3.5px] border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <select
                  id="profile-level"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full bg-transparent p-3 pr-10 text-[15px] font-medium outline-none text-black appearance-none"
                >
                  <option value="ol">GCE Ordinary Level (O/L)</option>
                  <option value="al">GCE Advanced Level (A/L)</option>
                  <option value="university">University Prep</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-700">
                  ▼
                </div>
              </div>
            </div>

            {/* School Name */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="profile-school" className="text-xs font-extrabold uppercase tracking-widest text-stone-850">
                School / Community Name
              </label>
              <input
                id="profile-school"
                ref={schoolRef}
                type="text"
                placeholder="GBHS Molyko, Lycée Joss..."
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full bg-white border-[3.5px] border-black rounded-xl p-3 text-[15px] font-medium outline-none placeholder-stone-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all"
              />
            </div>

            {/* Region Selection */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="profile-region" className="text-xs font-extrabold uppercase tracking-widest text-stone-850">
                Study Region
              </label>
              <div className="relative rounded-xl border-[3.5px] border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <select
                  id="profile-region"
                  ref={regionRef}
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-transparent p-3 pr-10 text-[15px] font-medium outline-none text-black appearance-none"
                >
                  <option value="" disabled>Select your region...</option>
                  <option value="littoral">Littoral Region</option>
                  <option value="centre">Centre Region</option>
                  <option value="southwest">Southwest Region</option>
                  <option value="northwest">Northwest Region</option>
                  <option value="west">West Region</option>
                  <option value="other">Other Region</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-700">
                  ▼
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#B6FF00] hover:bg-[#a3e600] border-[3.5px] border-black rounded-xl py-3.5 px-4 font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-center text-black"
            >
              Save Changes
            </button>
          </form>
        </section>

        {/* Save Notification Toast */}
        {toastMessage && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#B6FF00] border-[2.5px] border-black rounded-xl py-3.5 px-6 font-black text-sm text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 animate-bounce">
            <span>✨</span> {toastMessage}
          </div>
        )}

      </main>

      <BottomNav items={navItems} />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FAF7EC]" />}>
      <ProfilePageContent />
    </React.Suspense>
  );
}
