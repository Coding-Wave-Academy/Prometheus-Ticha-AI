"use client";

import React, { useEffect, useState } from "react";
import {
  UserIcon,
  SchoolIcon,
  Location01Icon,
  Award01Icon,
  Globe02Icon,
  AiBrain01Icon,
} from "hugeicons-react";
import { fireConfettiBurst } from "@/lib/confetti";
import { hapticSuccess, hapticTap } from "@/lib/haptics";
import { useProfile } from "@/hooks/useProfile";
import i18n from "i18next";

interface FinishSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AiTip {
  id: string;
  icon: string;
  title: string;
  description: string;
  tag: string;
}

export default function FinishSetupModal({ isOpen, onClose }: FinishSetupModalProps) {
  const { profile, updateProfile } = useProfile();
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [region, setRegion] = useState("littoral");
  const [educationLevel, setEducationLevel] = useState("al");
  const [preferredLanguage, setPreferredLanguage] = useState("en");

  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [aiTips, setAiTips] = useState<AiTip[]>([]);
  const [isLoadingTips, setIsLoadingTips] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFullName(profile?.full_name || "");
      setSchoolName(profile?.school_name || "");
      setRegion(profile?.region || "littoral");
      setEducationLevel(profile?.education_level || "al");
      setPreferredLanguage(profile?.preferred_language || i18n.language || "en");
      setIsSaved(profile?.profile_completed || false);
    }
  }, [isOpen, profile]);

  const fetchAiTips = async (level: string, reg: string, name: string, lang: string) => {
    setIsLoadingTips(true);
    try {
      const res = await fetch("/api/ai/onboarding-tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          educationLevel: level,
          region: reg,
          name,
          preferredLanguage: lang,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.tips && Array.isArray(data.tips)) {
          setAiTips(data.tips);
        }
      }
    } catch (err) {
      console.error("Failed to fetch AI onboarding tips:", err);
    } finally {
      setIsLoadingTips(false);
    }
  };

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    hapticSuccess();
    setIsSubmitting(true);

    const result = await updateProfile({
      full_name: fullName,
      school_name: schoolName,
      region,
      education_level: educationLevel,
      preferred_language: preferredLanguage,
      profile_completed: true,
    });

    setIsSubmitting(false);

    if (result.error) {
      setErrorMessage(`⚠️ Could not save: ${result.error}`);
      return;
    }

    setIsSaved(true);
    fireConfettiBurst();

    // Fetch AI-generated exam tips
    await fetchAiTips(educationLevel, region, fullName, preferredLanguage);
  };

  const totalSteps = 4;
  const completedCount = isSaved ? 4 : 1;
  const percentage = (completedCount / totalSteps) * 100;
  const strokeDasharray = 2 * Math.PI * 20;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 md:pt-20 bg-black/60 backdrop-blur-sm animate-page-in">
      <div
        id="finish-setup-modal"
        className="w-full max-w-sm bg-[#FAF7EC] border-[4px] border-black rounded-2xl p-5 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative flex flex-col text-left space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-white border-[3px] border-black rounded-full flex items-center justify-center font-black text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none hover:bg-stone-50 z-10"
          aria-label="Close setup modal"
        >
          ✕
        </button>

        <div className="flex items-center justify-between border-b-[3px] border-black pb-3 pr-10">
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
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="black"
                strokeWidth="4"
                fill="transparent"
                className="text-stone-200"
              />
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

        {errorMessage && (
          <div className="bg-[#FF9494] border-[2.5px] border-black rounded-xl p-3 font-bold text-xs text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {errorMessage}
          </div>
        )}

        {isSaved ? (
          <div className="py-2 flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 bg-[#B6FF00] border-[3.5px] border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-2xl">🎉</span>
            </div>
            <div>
              <h3 className="text-xl font-black uppercase text-black">
                Profile Verified!
              </h3>
              <p className="text-xs font-bold text-stone-700 mt-0.5">
                AI Exam Strategy tailored for {fullName}
              </p>
            </div>

            {/* AI Generated Exam Tips Section */}
            <div className="w-full text-left space-y-2.5">
              <div className="flex items-center gap-1.5 border-b-[2px] border-black pb-1">
                <AiBrain01Icon size={18} className="text-black" />
                <h4 className="text-xs font-black uppercase tracking-wider text-black">
                  Live AI Exam Strategy Tips
                </h4>
              </div>

              {isLoadingTips ? (
                <div className="p-4 bg-white border-[2.5px] border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-black uppercase">Generating tips...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {aiTips.map((tip) => (
                    <div
                      key={tip.id}
                      className="bg-white border-[2.5px] border-black rounded-xl p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-black flex items-center gap-1">
                          <span>{tip.icon}</span> {tip.title}
                        </span>
                        <span className="text-[9px] font-black uppercase bg-[#B6FF00] border-[1px] border-black px-1.5 py-0.5 rounded-full">
                          {tip.tag}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-stone-700 leading-snug">
                        {tip.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full bg-[#B6FF00] hover:bg-[#a3e600] border-[3.5px] border-black rounded-xl py-3 px-4 font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all text-black"
            >
              Start Learning Now →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-3.5">
            {/* Full Name */}
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="setup-name"
                className="text-xs font-extrabold uppercase tracking-widest text-stone-800 flex items-center gap-1"
              >
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
                className="w-full bg-white border-[3px] border-black rounded-xl p-2.5 text-sm font-medium outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              />
            </div>

            {/* School Name */}
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="setup-school"
                className="text-xs font-extrabold uppercase tracking-widest text-stone-800 flex items-center gap-1"
              >
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
                className="w-full bg-white border-[3px] border-black rounded-xl p-2.5 text-sm font-medium outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              />
            </div>

            {/* Region */}
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="setup-region"
                className="text-xs font-extrabold uppercase tracking-widest text-stone-800 flex items-center gap-1"
              >
                <Location01Icon size={14} className="text-black" />
                <span>Study Region</span>
              </label>
              <div className="relative rounded-xl border-[3px] border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <select
                  id="setup-region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-transparent p-2.5 pr-10 text-sm font-medium outline-none text-black appearance-none"
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

            {/* Education Target */}
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="setup-level"
                className="text-xs font-extrabold uppercase tracking-widest text-stone-800 flex items-center gap-1"
              >
                <Award01Icon size={14} className="text-black" />
                <span>Education Target</span>
              </label>
              <div className="relative rounded-xl border-[3px] border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <select
                  id="setup-level"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full bg-transparent p-2.5 pr-10 text-sm font-medium outline-none text-black appearance-none"
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

            {/* Preferred Language */}
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="setup-lang"
                className="text-xs font-extrabold uppercase tracking-widest text-stone-800 flex items-center gap-1"
              >
                <Globe02Icon size={14} className="text-black" />
                <span>Interface Language (i18n)</span>
              </label>
              <div className="relative rounded-xl border-[3px] border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <select
                  id="setup-lang"
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full bg-transparent p-2.5 pr-10 text-sm font-medium outline-none text-black appearance-none"
                >
                  <option value="en">English (🇬🇧)</option>
                  <option value="fr">Français (🇫🇷)</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-700 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={() => hapticTap()}
              className="w-full bg-[#B6FF00] hover:bg-[#a3e600] border-[3.5px] border-black rounded-xl py-3 px-4 font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-center text-black mt-2 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Profile & Generate Strategy"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
