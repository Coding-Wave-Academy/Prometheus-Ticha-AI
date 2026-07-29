"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import {
  Settings01Icon,
  Globe02Icon,
  LockPasswordIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Mail01Icon,
  Logout01Icon,
  AlertCircleIcon,
} from "hugeicons-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { hapticTap } from "@/lib/haptics";

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export default function AccountSettingsModal({
  isOpen,
  onClose,
  onShowToast,
}: AccountSettingsModalProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { i18n } = useTranslation();
  const { updateProfile } = useProfile();

  const [currentLang, setCurrentLang] = useState("en");
  const [passwordSent, setPasswordSent] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("ticha_lang") || i18n.language || "en";
      setCurrentLang(savedLang);
    }
  }, [i18n.language, isOpen]);

  if (!isOpen) return null;

  const handleLanguageChange = async (lang: string) => {
    hapticTap();
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("ticha_lang", lang);
    }
    await updateProfile({ preferred_language: lang });
    onShowToast(`Language set to ${lang === "fr" ? "Français" : "English"}`);
  };

  const handlePasswordReset = () => {
    hapticTap();
    setPasswordSent(true);
    onShowToast("Password reset link sent to your email!");
    setTimeout(() => setPasswordSent(false), 4000);
  };

  const handleClearCache = () => {
    hapticTap();
    if (typeof window !== "undefined") {
      const keysToKeep = ["ticha_lang"];
      Object.keys(localStorage).forEach((key) => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });
      onShowToast("Local cache cleared!");
    }
  };

  const handleConfirmLogout = async () => {
    hapticTap();
    await signOut();
    onClose();
    router.push("/login");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 md:pt-20 bg-black/60 backdrop-blur-sm animate-page-in">
        <div className="w-full max-w-md bg-[#FAF7EC] border-[4px] border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative flex flex-col space-y-5 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b-[3px] border-black pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#FFB040] border-[3px] border-black rounded-2xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Settings01Icon size={24} className="text-black" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-black uppercase text-black leading-tight">
                  Account Settings
                </h2>
                <p className="text-xs font-bold text-stone-600">
                  Preferences & Security
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 bg-white border-[3px] border-black rounded-full flex items-center justify-center font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none hover:bg-stone-50"
              aria-label="Close Settings"
            >
              <Cancel01Icon size={18} className="text-black" />
            </button>
          </div>

          {/* User Account Info */}
          <div className="bg-white border-[3px] border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2 text-left">
            <h3 className="text-xs font-black uppercase tracking-widest text-stone-800 flex items-center gap-1.5">
              <Mail01Icon size={16} className="text-black" />
              <span>Account Email</span>
            </h3>
            <input
              type="text"
              readOnly
              value={user?.email || "student@ticha.ai"}
              className="w-full bg-stone-100 border-[2.5px] border-black rounded-xl p-3 text-xs font-bold text-stone-800 outline-none"
            />
          </div>

          {/* Language Selection */}
          <div className="bg-white border-[3px] border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3 text-left">
            <h3 className="text-xs font-black uppercase tracking-widest text-stone-800 flex items-center gap-1.5">
              <Globe02Icon size={16} className="text-black" />
              <span>Language Preference (i18n)</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleLanguageChange("en")}
                className={`p-3 border-[2.5px] border-black rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  currentLang === "en" ? "bg-[#B6FF00]" : "bg-white hover:bg-stone-50"
                }`}
              >
                🇬🇧 English {currentLang === "en" && "✓"}
              </button>

              <button
                onClick={() => handleLanguageChange("fr")}
                className={`p-3 border-[2.5px] border-black rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  currentLang === "fr" ? "bg-[#B6FF00]" : "bg-white hover:bg-stone-50"
                }`}
              >
                🇫🇷 Français {currentLang === "fr" && "✓"}
              </button>
            </div>
          </div>

          {/* Security & Password */}
          <div className="bg-white border-[3px] border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3 text-left">
            <h3 className="text-xs font-black uppercase tracking-widest text-stone-800 flex items-center gap-1.5">
              <LockPasswordIcon size={16} className="text-black" />
              <span>Security</span>
            </h3>
            <button
              onClick={handlePasswordReset}
              disabled={passwordSent}
              className="w-full bg-[#D3E2FF] border-[2.5px] border-black rounded-xl p-3 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              {passwordSent ? (
                <>
                  <CheckmarkCircle02Icon size={16} className="text-black" />
                  <span>Reset Email Sent</span>
                </>
              ) : (
                <span>Send Password Reset Link</span>
              )}
            </button>
          </div>

          {/* Data & Storage */}
          <div className="bg-white border-[3px] border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2 text-left">
            <h3 className="text-xs font-black uppercase tracking-widest text-stone-800">
              Storage & Performance
            </h3>
            <button
              onClick={handleClearCache}
              className="w-full bg-stone-100 hover:bg-stone-200 border-[2.5px] border-black rounded-xl p-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all"
            >
              Clear Local Cache
            </button>
          </div>

          {/* Log Out Button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full bg-[#FF9494] hover:bg-[#ff7b7b] border-[3.5px] border-black rounded-xl py-3 px-4 font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all text-black flex items-center justify-center gap-2"
          >
            <Logout01Icon size={18} className="text-black" />
            <span>Log Out Account</span>
          </button>

          <button
            onClick={onClose}
            className="w-full bg-[#B6FF00] hover:bg-[#a3e600] border-[3.5px] border-black rounded-xl py-3 px-4 font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all text-black"
          >
            Save & Close
          </button>
        </div>
      </div>

      {/* Log Out Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-spring-pop">
          <div className="w-full max-w-sm bg-[#FAF7EC] border-[4px] border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center space-y-4">
            <div className="w-14 h-14 bg-[#FF9494] border-[3px] border-black rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mx-auto rotate-[-3deg]">
              <AlertCircleIcon size={32} className="text-black" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black uppercase tracking-tight text-black">
                Log Out of Ticha AI?
              </h3>
              <p className="text-xs font-medium text-stone-700 leading-relaxed">
                Are you sure you want to sign out? Your learning progress is saved automatically.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="bg-white hover:bg-stone-50 border-[3px] border-black rounded-xl py-2.5 px-4 font-black text-xs uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmLogout}
                className="bg-[#FF9494] hover:bg-[#ff7b7b] border-[3px] border-black rounded-xl py-2.5 px-4 font-black text-xs uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
