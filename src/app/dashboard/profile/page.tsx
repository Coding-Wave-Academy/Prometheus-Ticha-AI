"use client";

export const dynamic = "force-dynamic";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PencilEdit01Icon,
  StarIcon,
  FireIcon,
  Mortarboard01Icon,
  Camera01Icon,
  Settings01Icon,
  QuestionIcon,
  Logout01Icon,
  ArrowRight01Icon,
} from "hugeicons-react";
import { useNavItems } from "@/hooks/useNavItems";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import BottomNav from "@/components/layout/BottomNav";
import EditProfileModal from "@/components/profile/EditProfileModal";
import HelpCenterModal from "@/components/profile/HelpCenterModal";
import AccountSettingsModal from "@/components/profile/AccountSettingsModal";
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
  const { signOut } = useAuth();
  const { profile, isLoading, isUploading, updateProfile, uploadAvatar } = useProfile();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("⚠️ Image too large. Max 5MB.");
      return;
    }

    const result = await uploadAvatar(file);
    if (result.error) {
      showToast(`⚠️ ${result.error}`);
    } else {
      showToast("Profile photo updated! ✨");
    }
  };

  const handleSaveModal = async (data: {
    fullName: string;
    schoolName: string;
    region: string;
  }) => {
    const result = await updateProfile({
      full_name: data.fullName,
      school_name: data.schoolName,
      region: data.region,
    });

    if (result.error) {
      showToast(`⚠️ ${result.error}`);
    } else {
      showToast("Profile changes saved successfully!");
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      showToast("Logging out...");
      await signOut();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      showToast("Failed to log out");
      setIsLoggingOut(false);
    }
  };

  const fullName = profile?.full_name || "Student";
  const schoolName = profile?.school_name || "Not set";
  const region = profile?.region || "Not set";
  const educationLevel = profile?.education_level || "ol";
  const avatarUrl = profile?.avatar_url || null;
  const streakCount = profile?.streak_count || 1;

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
      unlocked: streakCount >= 7,
      bgColor: "bg-[#FFB040]",
      icon: <FireIcon size={24} className="text-orange-600" />,
    },
    {
      id: "gce-pioneer",
      name: "GCE Pioneer",
      category: "Academic",
      description: "Completed 5 GCE Past Paper practice sets",
      unlocked: false,
      bgColor: "bg-[#D3E2FF]",
      icon: <Mortarboard01Icon size={24} className="text-blue-700" />,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center">
        <div className="w-10 h-10 border-[3.5px] border-black border-t-[#B6FF00] rounded-full animate-spin" />
      </div>
    );
  }

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
          {/* Avatar Photo with Camera Overlay */}
          <div className="relative group">
            <div className="relative w-24 h-24 rounded-full border-[3.5px] border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-3 bg-[#B6FF00]">
              {isUploading ? (
                <div className="w-full h-full flex items-center justify-center bg-[#B6FF00]">
                  <div className="w-8 h-8 border-[3px] border-black border-t-transparent rounded-full animate-spin" />
                </div>
              ) : avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={`${fullName}'s profile photo`}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-black text-black">
                  {fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Camera overlay button */}
            <button
              onClick={handleAvatarClick}
              className="absolute -bottom-0.5 -right-0.5 w-9 h-9 bg-[#B6FF00] border-[2.5px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all z-10"
              aria-label="Change profile photo"
            >
              <Camera01Icon size={16} className="text-black" />
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
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
              <span>{streakCount} Day Streak</span>
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
              {badges.filter((b) => b.unlocked).length} / {badges.length}{" "}
              Unlocked
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3 border-[2.5px] border-black rounded-xl flex flex-col items-center text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                  badge.unlocked ? badge.bgColor : "bg-stone-200 opacity-60"
                }`}
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

        {/* Account & Support Settings Section */}
        <section className="w-full bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6 text-left space-y-3">
          <h3 className="text-base font-black uppercase tracking-wider text-stone-900 border-b-[2.5px] border-black pb-2">
            Account & Support
          </h3>

          <div className="space-y-2.5 pt-1">
            {/* Account Settings Button */}
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="w-full bg-[#FAF7EC] hover:bg-[#F2ECD8] border-[2.5px] border-black rounded-xl p-3.5 flex items-center justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#FFB040] border-[2px] border-black rounded-lg flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  <Settings01Icon size={20} className="text-black" />
                </div>
                <div className="text-left">
                  <p className="font-black text-xs uppercase text-black">Account Settings</p>
                  <p className="text-[11px] font-medium text-stone-600">Language, preferences & security</p>
                </div>
              </div>
              <ArrowRight01Icon size={18} className="text-black group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Help Center Button */}
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="w-full bg-[#FAF7EC] hover:bg-[#F2ECD8] border-[2.5px] border-black rounded-xl p-3.5 flex items-center justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#D3E2FF] border-[2px] border-black rounded-lg flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  <QuestionIcon size={20} className="text-black" />
                </div>
                <div className="text-left">
                  <p className="font-black text-xs uppercase text-black">Help Center & FAQ</p>
                  <p className="text-[11px] font-medium text-stone-600">GCE guide & support channels</p>
                </div>
              </div>
              <ArrowRight01Icon size={18} className="text-black group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Log Out Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full bg-[#FF9494] hover:bg-[#ff7b7b] border-[2.5px] border-black rounded-xl p-3.5 flex items-center justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all disabled:opacity-50 mt-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white border-[2px] border-black rounded-lg flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  <Logout01Icon size={20} className="text-black" />
                </div>
                <p className="font-black text-xs uppercase text-black">Log Out</p>
              </div>
              {isLoggingOut ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowRight01Icon size={18} className="text-black" />
              )}
            </button>
          </div>
        </section>

        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#B6FF00] border-[2.5px] border-black rounded-xl py-3.5 px-6 font-black text-sm text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2"
            >
              <span>✨</span> {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
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

      <HelpCenterModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      <AccountSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onShowToast={showToast}
      />

      <BottomNav items={navItems} />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <React.Suspense
      fallback={<div className="min-h-screen bg-[#FAF7EC]" />}
    >
      <ProfilePageContent />
    </React.Suspense>
  );
}
