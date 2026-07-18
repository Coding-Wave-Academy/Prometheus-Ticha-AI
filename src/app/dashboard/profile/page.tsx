"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useNavItems } from "@/hooks/useNavItems";
import BottomNav from "@/components/layout/BottomNav";
import FinishSetupModal from "@/components/dashboard/FinishSetupModal";
import "@/lib/i18n";

function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const navItems = useNavItems();

  // State values saved in localStorage for the setup steps checklist
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [tfaEnabled, setTfaEnabled] = useState(false);
  const [regionSelected, setRegionSelected] = useState(false);
  const [schoolAdded, setSchoolAdded] = useState(false);

  // Form input states
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [region, setRegion] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);
  
  // Notification banner state
  const [toastMessage, setToastMessage] = useState("");
  const [avatar, setAvatar] = useState("");

  // Refs for focusing inputs from query parameters
  const nameRef = useRef<HTMLInputElement>(null);
  const schoolRef = useRef<HTMLInputElement>(null);
  const regionRef = useRef<HTMLSelectElement>(null);
  const tfaRef = useRef<HTMLButtonElement>(null);

  // Modal open control
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Initial load from localStorage
    const savedName = localStorage.getItem("ticha_user_fullname") || "Amadou";
    const savedSchool = localStorage.getItem("ticha_school_name") || "";
    const savedRegion = localStorage.getItem("ticha_region") || "";
    const savedTfa = localStorage.getItem("ticha_2fa_enabled") === "true";
    const savedAvatar = localStorage.getItem("ticha_user_avatar") || "";

    setFullName(savedName);
    setSchoolName(savedSchool);
    setRegion(savedRegion);
    setTwoFactor(savedTfa);
    setAvatar(savedAvatar);

    // Initial setup steps verification
    setProfileCompleted(localStorage.getItem("ticha_profile_completed") === "true");
    setTfaEnabled(savedTfa);
    setRegionSelected(localStorage.getItem("ticha_region_selected") === "true");
    setSchoolAdded(localStorage.getItem("ticha_school_added") === "true");

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
      } else if (focus === "2fa") {
        tfaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 300);
  }, [searchParams]);

  // Calculate percentage of checklist completed
  const checklist = [
    { label: "Account Created", done: true },
    { label: "Complete Profile", done: profileCompleted },
    { label: "Enable 2FA", done: tfaEnabled },
    { label: "Select Region", done: regionSelected },
    { label: "Add School Name", done: schoolAdded },
  ];
  const doneCount = checklist.filter((x) => x.done).length;
  const progressPercent = (doneCount / 5) * 100;

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Helper — get current Supabase user ID
  const getUserId = async (): Promise<string | null> => {
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await sb.auth.getUser();
    return data.user?.id || null;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
        localStorage.setItem("ticha_user_avatar", base64String);

        // Sync avatar flag to Supabase (store a flag, not the base64 blob)
        const uid = await getUserId();
        if (uid) {
          fetch("/api/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: uid, avatar_url: "local_base64_set" }),
          }).catch(console.error);
        }

        showToast("Profile photo updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    // Persist profile inputs to localStorage
    localStorage.setItem("ticha_user_fullname", fullName);
    localStorage.setItem("ticha_school_name", schoolName);
    localStorage.setItem("ticha_region", region);

    // Dynamic completion checks
    const nameDone = fullName.trim().length > 3;
    const regionDone = region !== "";
    const schoolDone = schoolName.trim().length > 2;

    localStorage.setItem("ticha_profile_completed", nameDone ? "true" : "false");
    localStorage.setItem("ticha_region_selected", regionDone ? "true" : "false");
    localStorage.setItem("ticha_school_added", schoolDone ? "true" : "false");

    setProfileCompleted(nameDone);
    setRegionSelected(regionDone);
    setSchoolAdded(schoolDone);

    // Sync to Supabase
    try {
      const uid = await getUserId();
      if (uid) {
        const education = localStorage.getItem("ticha_onboarding_education") || undefined;
        const goal = localStorage.getItem("ticha_onboarding_goal") || undefined;
        const strugglesRaw = localStorage.getItem("ticha_onboarding_struggles");
        const struggles = strugglesRaw ? JSON.parse(strugglesRaw) : undefined;

        await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: uid,
            full_name: fullName,
            school_name: schoolName,
            region,
            education_level: education,
            primary_goal: goal,
            struggles,
            profile_completed: nameDone,
          }),
        });
      }
    } catch (err) {
      console.error("Failed to sync profile to Supabase:", err);
    }

    showToast("Profile settings saved successfully!");
  };

  const handleToggleTfa = () => {
    const nextTfa = !twoFactor;
    setTwoFactor(nextTfa);
    localStorage.setItem("ticha_2fa_enabled", nextTfa ? "true" : "false");
    setTfaEnabled(nextTfa);
    showToast(nextTfa ? "2FA Enabled successfully!" : "2FA Disabled successfully!");
  };

  return (
    <div className="min-h-screen bg-[#FAF7EC] text-black antialiased font-sans pb-28 selection:bg-[#B6FF00]">
      <main className="w-full max-w-md mx-auto p-4 pt-6 flex flex-col items-center">
        
        {/* Header */}
        <header className="flex items-center justify-between w-full mb-6 border-b-[3.5px] border-black pb-3">
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">
            Profile Settings
          </h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-10 h-10 bg-white border-[3px] border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all"
            aria-label="Back to dashboard"
          >
            ✕
          </button>
        </header>

        {/* Avatar Photo Upload Block */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full border-[3.5px] border-black bg-white overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative flex items-center justify-center group">
            {avatar ? (
              <img src={avatar} alt="Profile Photo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl text-stone-600 font-bold select-none">
                {fullName.slice(0, 1).toUpperCase()}
              </span>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleAvatarChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-20"
              aria-label="Upload profile photo"
            />
            {/* Edit overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none">
              <span className="text-[10px] font-black text-white uppercase tracking-wider">
                Edit 📷
              </span>
            </div>
          </div>
          <span className="text-[10px] font-extrabold uppercase text-stone-500 tracking-wider mt-2">
            Tap image to change photo
          </span>
        </div>

        {/* Setup Progress Checklist Card */}
        <section className="w-full bg-[#B6FF00] border-[3.5px] border-black rounded-xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8 relative overflow-hidden">
          <div className="relative z-10 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest bg-black text-[#B6FF00] px-2.5 py-0.5 rounded-full border-[1.5px] border-black">
                Setup Progress
              </span>
              <span className="text-sm font-black text-black">
                {doneCount} of 5 Completed
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-black text-black tracking-tight">
                Complete Setup Checklist
              </h2>
              <p className="text-xs font-bold text-black/80 leading-snug">
                {progressPercent === 100 
                  ? "Congratulations! Your account is fully verified." 
                  : "Complete all verification steps to unlock the full platform."
                }
              </p>
            </div>

            {/* Custom Neobrutalist Progress Bar */}
            <div className="w-full h-3.5 bg-white rounded-full border-[2.5px] border-black overflow-hidden shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
              <div 
                className="h-full bg-[#FFB040] border-r-[2px] border-black transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Open Checklist Dialog Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-white hover:bg-stone-50 text-black py-2.5 rounded-lg font-black text-xs uppercase tracking-wider border-[2.5px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all text-center"
            >
              Complete Setup Checklist
            </button>
          </div>
        </section>

        {/* Profile Info Form */}
        <section className="w-full bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8 text-left">
          <h3 className="text-base font-black uppercase tracking-wider text-stone-900 border-b-[2.5px] border-black pb-2 mb-4">
            Personal Information
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
              <div className="relative rounded-xl border-[3.5px] border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus-within:translate-x-[-2px] focus-within:translate-y-[-2px] focus-within:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all">
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

        {/* Security Settings Section */}
        <section className="w-full bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left mb-8">
          <h3 className="text-base font-black uppercase tracking-wider text-stone-900 border-b-[2.5px] border-black pb-2 mb-4">
            Security settings
          </h3>

          <div className="flex items-center justify-between p-3.5 bg-stone-50 border-[2.5px] border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="min-w-0 pr-4">
              <h4 className="text-sm font-black text-black leading-tight">
                Two-Factor Authentication (2FA)
              </h4>
              <p className="text-[11px] font-bold text-stone-600 leading-snug mt-0.5">
                Protect your educational score with one-time verification.
              </p>
            </div>

            {/* Custom Neobrutalist Switch Toggle */}
            <button
              id="tfa-toggle-button"
              ref={tfaRef}
              onClick={handleToggleTfa}
              className={`w-14 h-8 rounded-full border-[3px] border-black flex items-center p-0.5 transition-colors relative shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] ${
                twoFactor ? "bg-[#B6FF00]" : "bg-stone-300"
              }`}
              aria-label="Toggle two-factor authentication"
            >
              <div 
                className={`w-5.5 h-5.5 bg-white border-[2.5px] border-black rounded-full transition-transform transform ${
                  twoFactor ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </section>

        {/* Save Notification Toast */}
        {toastMessage && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#B6FF00] border-[2.5px] border-black rounded-xl py-3.5 px-6 font-black text-sm text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 animate-bounce">
            <span>✨</span> {toastMessage}
          </div>
        )}

      </main>

      <FinishSetupModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
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
