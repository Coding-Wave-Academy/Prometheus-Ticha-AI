"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/ui/PasswordInput";
import PasswordStrengthBar from "@/components/ui/PasswordStrengthBar";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";
import ConfettiOverlay from "@/components/auth/ConfettiOverlay";
import { usePasswordStrength } from "@/hooks/usePasswordStrength";
import "@/lib/i18n";

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const strength = usePasswordStrength(password);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (strength.score < 3) {
      setError("Please choose a stronger password.");
      return;
    }
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log("Registered:", { name, email });
      localStorage.setItem("ticha_user_fullname", name);
      router.push("/dashboard?showSetup=true");
    }, 1500);
  };

  const handleGoogleLogin = () => {
    console.log("Google authentication triggered");
  };

  const handleAppleLogin = () => {
    console.log("Apple authentication triggered");
  };

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <main className="w-full flex flex-col justify-between px-2 text-black space-y-6 animate-page-in">
      {/* Header Section */}
      <header className="text-center space-y-2 mt-4">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none text-[#1A1A1A]">
          {isMounted ? t("register.title") : "Create Account"}
        </h1>
        <p className="text-base text-stone-600 font-medium">
          {isMounted ? t("register.subtitle") : "Now, let's save your progress."}
        </p>
      </header>

      {/* Milestone Achievement Card */}
      <section className="bg-[#B6FF00] border-[3.5px] border-black rounded-2xl p-6 flex flex-col items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center relative overflow-hidden">
        <ConfettiOverlay />

        {/* Inner Star Circle Badge */}
        <div className="w-16 h-16 bg-white border-[3.5px] border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4 relative z-40">
          <svg
            className="w-8 h-8 text-[#A05E1B] fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>

        <span className="text-xs font-extrabold uppercase tracking-widest text-stone-850 opacity-90 relative z-40">
          Milestone Reached
        </span>
        <h2 className="text-2xl font-black text-black mt-1 mb-4 relative z-40">
          Level 1: Novice
        </h2>

        {/* Streak Badge */}
        <div className="bg-white border-[2.5px] border-black rounded-full py-1.5 px-5 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold text-sm relative z-40">
          <span
            role="img"
            aria-label="streak fire"
            className="text-base leading-none"
          >
            🔥
          </span>
          <span>1 Day Streak!</span>
        </div>
      </section>

      {/* Main Register Form Card */}
      <section className="bg-white border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-[#FF9494] border-[2.5px] border-black rounded-xl p-3 font-bold text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              ⚠️ {error}
            </div>
          )}

          {/* Full Name field */}
          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="register-name"
              className="text-xs font-extrabold uppercase tracking-widest text-stone-800"
            >
              {isMounted ? t("register.nameLabel") : "Full Name"}
            </label>
            <input
              id="register-name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border-[3.5px] border-black rounded-xl p-3.5 text-[15px] font-medium outline-none placeholder-stone-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all"
            />
          </div>

          {/* Email field */}
          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="register-email"
              className="text-xs font-extrabold uppercase tracking-widest text-stone-800"
            >
              {isMounted ? t("register.emailLabel") : "Email Address"}
            </label>
            <input
              id="register-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border-[3.5px] border-black rounded-xl p-3.5 text-[15px] font-medium outline-none placeholder-stone-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
            />
          </div>

          {/* Password field with show/hide */}
          <div>
            <PasswordInput
              id="register-password"
              label={isMounted ? t("register.passwordLabel") : "Password"}
              value={password}
              onChange={setPassword}
            />
            {/* Dynamic password strength checker */}
            <PasswordStrengthBar strength={strength} showChecks />
          </div>

          {/* Confirm Password field */}
          <div>
            <PasswordInput
              id="register-confirm-password"
              label={isMounted ? t("register.confirmPasswordLabel") : "Confirm Password"}
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
            {/* Match indicator */}
            {passwordsMatch && (
              <p className="text-xs font-bold text-green-700 mt-1.5 flex items-center gap-1">
                <span>✓</span> Passwords match
              </p>
            )}
            {passwordsMismatch && (
              <p className="text-xs font-bold text-red-600 mt-1.5 flex items-center gap-1">
                <span>✗</span> Passwords do not match
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#B6FF00] border-[3.5px] border-black rounded-xl py-4 px-4 font-black uppercase text-[17px] tracking-wider transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#a3e600] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? "Creating..." : (isMounted ? t("register.submit") : "Sign Up →")}
          </button>
        </form>
      </section>

      {/* Social Authentication */}
      <SocialAuthButtons
        onGoogle={handleGoogleLogin}
        onApple={handleAppleLogin}
      />

      {/* Footer Navigation */}
      <footer className="w-full text-center py-2">
        <p className="text-stone-700 font-medium text-[15px]">
          {isMounted ? t("register.hasAccount") : "Already have an account?"}{" "}
          <Link
            href="/login"
            className="text-[#965A18] font-bold underline decoration-2 underline-offset-2 hover:text-[#7A4711] transition-colors"
          >
            {isMounted ? t("register.login") : "Log in"}
          </Link>
        </p>
      </footer>
    </main>
  );
}
