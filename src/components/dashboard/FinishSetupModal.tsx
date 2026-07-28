"use client";

import React, { useEffect, useState } from "react";
import { UserIcon, SchoolIcon, Location01Icon, Award01Icon } from "hugeicons-react";
import { fireConfettiBurst } from "@/lib/confetti";
import { hapticSuccess, hapticTap } from "@/lib/haptics";
import { useProfile } from "@/hooks/useProfile";

interface FinishSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FinishSetupModal({ isOpen, onClose }: FinishSetupModalProps) {
  const { profile, updateProfile } = useProfile();
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [region, setRegion] = useState("littoral");
  const [educationLevel, setEducationLevel] = useState("al");

  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFullName(profile?.full_name || "");
      setSchoolName(profile?.school_name || "");
      setRegion(profile?.region || "littoral");
      setEducationLevel(profile?.education_level || "al");
      setIsSaved(profile?.profile_completed || false);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    hapticSuccess();
    setIsSubmitting(true);

    await updateProfile({
      full_name: fullName,
      school_name: schoolName,
      region,
      education_level: educationLevel,
      profile_completed: true,
    });

    setIsSubmitting(false);
    setIsSaved(true);
    fireConfettiBurst();

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const totalSteps = 4;
  const completedCount = isSaved ? 4 : 1;
  const percentage = (completedCount / totalSteps) * 100;
  const strokeDasharray = 2 * Math.PI * 20;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 md:pt-24 bg-black/60 backdrop-blur-sm animate-page-in">
      <div 
        id="finish-setup-modal"
        className="w-full max-w-sm bg-[#FAF7EC] border-[4px] border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative flex flex-col text-left space-y-5"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-white border-[3px] border-black rounded-full flex items-center justify-center font-black text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none hover:bg-stone-50 z-10"
          aria-label="Close setup modal"
        >
          ✕
        </button>

        <div className="flex items-center justify-between border-b-[3px] border-black pb-4 pr-10">
          <div>
            <h2 className="text-xl font-black uppercase text-black leading-tight">
              Complete Profile
            </h2>
            <p className="text-xs font-bold text-stone-600">
              Unlock personalized learning tools
            </p>
          </div>

          <div className="w-12 h-12 flex items-center justify-center relative flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="black" strokeWidth="4" fill="transparent" className="text-stone-200" />
              <circle 
                cx="24" 
                cy="24" 
                r="20" 
                stroke="#FFB040" 
                strokeWidth="4" 
                fill="transparent" 
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <span className="absolute font-black text-[9px] text-black">
              {completedCount}/{totalSteps}
            </span>
          </div>
        </div>

        {isSaved ? (
          <div className="py-6 flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 bg-[#B6FF00] border-[3.5px] border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-2xl">🎉</span>
            </div>
            <h3 className="text-xl font-black uppercase text-black">
              All Set!
            </h3>
            <p className="text-sm font-bold text-stone-700">
              Profile completed successfully. Let&apos;s get learning!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label htmlFor="setup-name" className="text-xs font-extrabold uppercase tracking-widest text-stone-800 flex items-center gap-1">
                <UserIcon size={14} className="text-black" />
                <span>Full Name</span>
              </label>
              <input
                id="setup-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Amadou"
                className="w-full bg-white border-[3px] border-black rounded-xl p-3 text-sm font-medium outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label htmlFor="setup-school" className="text-xs font-extrabold uppercase tracking-widest text-stone-800 flex items-center gap-1">
                <SchoolIcon size={14} className="text-black" />
                <span>School Name</span>
              </label>
              <input
                id="setup-school"
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g. GBHS Molyko"
                className="w-full bg-white border-[3px] border-black rounded-xl p-3 text-sm font-medium outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label htmlFor="setup-region" className="text-xs font-extrabold uppercase tracking-widest text-stone-800 flex items-center gap-1">
                <Location01Icon size={14} className="text-black" />
                <span>Study Region</span>
              </label>
              <div className="relative rounded-xl border-[3px] border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <select
                  id="setup-region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-transparent p-3 pr-10 text-sm font-medium outline-none text-black appearance-none"
                >
                  <option value="littoral">Littoral Region</option>
                  <option value="centre">Centre Region</option>
                  <option value="southwest">Southwest Region</option>
                  <option value="northwest">Northwest Region</option>
                  <option value="west">West Region</option>
                  <option value="other">Other Region</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-700 text-xs">
                  ▼
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <label htmlFor="setup-level" className="text-xs font-extrabold uppercase tracking-widest text-stone-800 flex items-center gap-1">
                <Award01Icon size={14} className="text-black" />
                <span>Education Target</span>
              </label>
              <div className="relative rounded-xl border-[3px] border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <select
                  id="setup-level"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full bg-transparent p-3 pr-10 text-sm font-medium outline-none text-black appearance-none"
                >
                  <option value="ol">GCE Ordinary Level (O/L)</option>
                  <option value="al">GCE Advanced Level (A/L)</option>
                  <option value="university">University Prep</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-700 text-xs">
                  ▼
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              onClick={() => hapticTap()}
              className="w-full bg-[#B6FF00] hover:bg-[#a3e600] border-[3.5px] border-black rounded-xl py-3.5 px-4 font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-center text-black mt-2 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Complete Setup"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
