"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import PasswordStrengthBar from "@/components/ui/PasswordStrengthBar";
import ToastContainer from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { useIsMounted } from "@/hooks/useIsMounted";
import { usePasswordStrength } from "@/hooks/usePasswordStrength";
import { registerSchema, extractZodErrors } from "@/lib/validation";
import { sanitizeString } from "@/lib/security";
import { createClient } from "@/utils/supabase/client";
import ConfettiBurst from "@/components/onboarding/ConfettiBurst";
import "@/lib/i18n";

export default function RegisterPage() {
  const { t } = useTranslation();
  const { toasts, addToast, removeToast } = useToast();
  const isMounted = useIsMounted();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = usePasswordStrength(password);

  const supabase = createClient();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanFullName = sanitizeString(fullName.trim());
    const cleanEmail = sanitizeString(email.trim());

    const parseResult = registerSchema.safeParse({
      fullName: cleanFullName,
      email: cleanEmail,
      password,
      confirmPassword,
    });

    if (!parseResult.success) {
      const fieldErrors = extractZodErrors(parseResult.error);
      setErrors(fieldErrors);
      addToast("Please fix the errors below before submitting.", "warning", "Validation Failed");
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const storedEducation = typeof window !== "undefined" ? localStorage.getItem("ticha_onboarding_education") : null;
      const storedGoal = typeof window !== "undefined" ? localStorage.getItem("ticha_onboarding_goal") : null;
      const storedLang = typeof window !== "undefined" ? localStorage.getItem("ticha_lang") || "en" : "en";

      const origin = typeof window !== "undefined" ? window.location.origin : "";

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanFullName,
            education_level: storedEducation || "ol",
            goal: storedGoal || "gce_ol",
            preferred_language: storedLang,
          },
          emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        addToast(error.message || "Failed to create account. Please try again.", "error", "Sign Up Error");
        setIsLoading(false);
        return;
      }

      if (data.session) {
        addToast("Account created successfully! Welcome to Ticha AI.", "success", "Welcome!");
        if (cleanFullName) {
          localStorage.setItem("ticha_user_fullname", cleanFullName);
        }
        router.push("/dashboard");
      } else {
        addToast(
          "Confirmation email sent! Please check your inbox and verify your email to log in.",
          "info",
          "Account Created"
        );
        router.push("/login");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication service unavailable.";
      addToast(msg, "error", "Registration Error");
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FFF8F1] flex flex-col justify-between p-4 md:p-6 text-[#0A0A0F] relative overflow-hidden font-sans selection:bg-[#C8FF2A]">
      <ConfettiBurst />
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Decorative Sparkle Star */}
      <div className="absolute top-10 left-6 pointer-events-none z-0">
        <Image
          src="/images/onboarding-icons/Lime Star.svg"
          alt=""
          width={24}
          height={24}
          className="animate-pulse"
        />
      </div>

      <main className="w-full max-w-md mx-auto flex flex-col justify-between py-2 space-y-4 relative z-10">
        {/* Header Title */}
        <header className="text-center space-y-1 mt-1">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0A0A0F] tracking-tight">
            Create <span className="text-[#84CC16]">Account</span>
          </h1>
          <p className="text-sm text-stone-600 font-medium">
            {isMounted ? t("register.subtitle") : "Now, let's save your progress."}
          </p>
        </header>

        {/* Milestone Reached Banner Card */}
        <section className="bg-[#C8FF2A] border-[2.5px] border-black rounded-3xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center relative overflow-hidden">
          <div className="space-y-1.5 relative z-10">
            {/* Top Star Circle */}
            <div className="w-11 h-11 rounded-full bg-white border-[2px] border-black flex items-center justify-center mx-auto shadow-sm">
              <span className="text-amber-700 text-lg">★</span>
            </div>

            <div className="text-[10px] font-black tracking-wider uppercase text-stone-800">
              MILESTONE REACHED
            </div>

            <div className="text-xl md:text-2xl font-black text-[#0A0A0F] font-heading">
              Level 1: Novice
            </div>

            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border-[1.5px] border-black text-xs font-black shadow-sm text-[#0A0A0F]">
                🔥 1 DAY STREAK!
              </span>
            </div>
          </div>
        </section>

        {/* Form Container Card */}
        <section className="bg-white border-[2.5px] border-black rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
            {/* Full Name */}
            <Input
              id="register-fullname"
              type="text"
              label={isMounted ? t("register.nameLabel") : "Full Name"}
              placeholder="John Doe"
              leftIcon={
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              }
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
              }}
              error={errors.fullName}
            />

            {/* Email Address */}
            <Input
              id="register-email"
              type="email"
              label={isMounted ? t("register.emailLabel") : "Email Address"}
              placeholder="you@example.com"
              leftIcon={
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              }
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              error={errors.email}
            />

            {/* Password */}
            <PasswordInput
              id="register-password"
              label={isMounted ? t("register.passwordLabel") : "Password"}
              placeholder="••••••••"
              leftIcon={
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              }
              value={password}
              onChange={(val) => {
                setPassword(val);
                if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
              }}
              error={errors.password}
            />

            {/* Granular 5-Segment Password Strength Meter */}
            <PasswordStrengthBar strength={passwordStrength} />

            {/* Confirm Password */}
            <PasswordInput
              id="register-confirm-password"
              label={isMounted ? t("register.confirmPasswordLabel") : "Confirm Password"}
              placeholder="••••••••"
              leftIcon={
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              }
              value={confirmPassword}
              onChange={(val) => {
                setConfirmPassword(val);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              error={errors.confirmPassword}
            />


            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#C8FF2A] hover:bg-[#b8f01c] text-[#0A0A0F] font-bold text-base md:text-lg py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider font-heading mt-2"
            >
              {isLoading ? (
                <span>CREATING ACCOUNT...</span>
              ) : (
                <>
                  <span>SIGN UP</span>
                  <svg className="w-5 h-5 stroke-[2.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Footer Navigation */}
        <footer className="w-full text-center space-y-2 py-1">
          <p className="text-stone-600 font-medium text-xs md:text-sm">
            {isMounted ? t("register.hasAccount") : "Already have an account?"}{" "}
            <Link
              href="/login"
              className="text-[#FF882E] font-extrabold underline decoration-2 underline-offset-2 hover:text-[#e07520] transition-colors"
            >
              {isMounted ? t("register.login") : "Log in"}
            </Link>
          </p>
          <div>
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs font-black text-stone-700 hover:text-black tracking-wider transition-colors uppercase font-heading cursor-pointer"
            >
              SKIP FOR NOW &amp; EXPLORE DASHBOARD →
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
