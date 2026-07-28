"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PencilEdit01Icon, StarIcon, FireIcon, Mortarboard01Icon } from "hugeicons-react";
import { useNavItems } from "@/hooks/useNavItems";
import BottomNav from "@/components/layout/BottomNav";
import EditProfileModal from "@/components/profile/EditProfileModal";
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
  const navItems = useNavItems();

  const [fullName, setFullName] = useState("Amadou");
  const [schoolName, setSchoolName] = useState("GBHS Molyko");
  const [region, setRegion] = useState("littoral");
  const [educationLevel, setEducationLevel] = useState("al");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("ticha_user_fullname") || "Amadou";
    const savedSchool = localStorage.getItem("ticha_school_name") || "GBHS Molyko";
    const savedRegion = localStorage.getItem("ticha_region") || "littoral";
    const savedLevel = localStorage.getItem("ticha_education_level") || "al";

    setFullName(savedName);
    setSchoolName(savedSchool);
    setRegion(savedRegion);
    setEducationLevel(savedLevel);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleSaveModal = (data: { fullName: string; schoolName: string; region: string }) => {
    setFullName(data.fullName);
    setSchoolName(data.schoolName);
    setRegion(data.region);

    localStorage.setItem("ticha_user_fullname", data.fullName);
    localStorage.setItem("ticha_school_name", data.schoolName);
    localStorage.setItem("ticha_region", data.region);

    showToast("Profile changes saved successfully!");
  };

  const badges: BadgeItem[] = [
    {
      id: "novice",
      name: "Level 1: Novice",
      category: "Starter",
      description: "Unlocked upon joining Ticha AI",
      unlocked: true,
      bgColor: "bg-[#B6FF00]",
      icon: <StarIcon size={24} className="text-black" />,
    },
    {
      id: "streak",
      name: "Streak Master",
      category: "Consistency",
      description: "Maintained a 7-day study streak",
      unlocked: true,
      bgColor: "bg-[#FFB040]",
      icon: <FireIcon size={24} className="text-orange-600" />,
    },
    {
      id: "gce-pioneer",
      name: "GCE Pioneer",
      category: "Academic",
      description: "Completed 5 GCE Past Paper practice sets",
      unlocked: true,
      bgColor: "bg-[#D3E2FF]",
      icon: <Mortarboard01Icon size={24} className="text-blue-700" />,
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

        {/* Main Profile Header Card */}
        <section className="w-full bg-white border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6 text-center flex flex-col items-center relative">
          
          {/* Avatar Photo */}
          <div className="relative w-24 h-24 rounded-full border-[3.5px] border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-3 bg-[#B6FF00]">
            <Image
              src="/images/amadou-avatar.png"
              alt={`${fullName}'s profile photo`}
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          </div>

          {/* User Bio */}
          <h2 className="text-2xl font-black text-[#1A1A1A] tracking-tight">
            {fullName}
          </h2>
          <p className="text-xs font-bold text-stone-600 mt-0.5">
            {schoolName} • <span className="uppercase">{region}</span>
          </p>

          {/* Badges pills */}
          <div className="mt-3 flex items-center gap-2">
            <span className="bg-[#B6FF00] border-[2px] border-black rounded-full px-3 py-1 font-black text-xs uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
              Level 1: Novice
            </span>
            <span className="bg-[#FFB040] border-[2px] border-black rounded-full px-3 py-1 font-black text-xs uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
              <FireIcon size={14} className="text-orange-600" />
              <span>12 Day Streak</span>
            </span>
          </div>

          {/* Edit Profile Action Button */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="mt-5 w-full bg-[#B6FF00] hover:bg-[#a3e600] border-[3px] border-black rounded-xl py-3 px-4 font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all flex items-center justify-center gap-2 text-black"
          >
            <PencilEdit01Icon size={16} className="text-black" />
            <span>Edit Profile</span>
          </button>
        </section>

        {/* Badges Showcase Section */}
        <section className="w-full bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6 text-left">
          <div className="flex items-center justify-between border-b-[2.5px] border-black pb-2 mb-4">
            <h3 className="text-base font-black uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <StarIcon size={20} className="text-black" />
              <span>Earned Badges</span>
            </h3>
            <span className="text-xs font-extrabold uppercase bg-stone-100 border-[1.5px] border-black rounded-full px-2.5 py-0.5">
              3 / 3 Unlocked
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3 border-[2.5px] border-black rounded-xl flex flex-col items-center text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${badge.bgColor}`}
              >
                <div className="w-10 h-10 bg-white border-[2px] border-black rounded-full flex items-center justify-center mb-1.5 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  {badge.icon}
                </div>
                <h4 className="font-black text-[11px] uppercase text-black leading-tight">
                  {badge.name}
                </h4>
              </div>
            ))}
          </div>
        </section>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#B6FF00] border-[2.5px] border-black rounded-xl py-3.5 px-6 font-black text-sm text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 animate-bounce">
            <span>✨</span> {toastMessage}
          </div>
        )}

      </main>

      {/* Edit Profile Modal Dialog */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveModal}
        initialData={{
          fullName,
          schoolName,
          region,
          educationLevel,
        }}
      />

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
