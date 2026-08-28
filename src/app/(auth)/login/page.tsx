"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";
import ToastContainer from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, extractZodErrors } from "@/lib/validation";
import { sanitizeString } from "@/lib/security";
import { createClient } from "@/utils/supabase/client";
import "@/lib/i18n";

export default function LoginPage() {
  const { t } = useTranslation();
  const { toasts, addToast, removeToast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const isMounted = useIsMounted();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = sanitizeString(email.trim());
    const parseResult = loginSchema.safeParse({ email: cleanEmail, password });

    if (!parseResult.success) {
      const fieldErrors = extractZodErrors(parseResult.error);
      setErrors(fieldErrors);
      addToast("Please check the form for errors.", "warning", "Validation Failed");
      return;
    }

    setErrors({});
    setIsLoading(true);
    setUnconfirmedEmail(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        if (error.code === "email_not_confirmed" || error.message.includes("Email not confirmed")) {
          setUnconfirmedEmail(cleanEmail);
          addToast(
            "Please check your email inbox to confirm your account before logging in.",
            "warning",
            "Email Not Confirmed"
          );
        } else {
          addToast(error.message || "Invalid login credentials.", "error", "Sign In Failed");
        }
        setIsLoading(false);
        return;
      }

      addToast("Welcome back, scholar!", "success", "Signed In");
      if (data.user?.user_metadata?.full_name) {
        localStorage.setItem("ticha_user_fullname", data.user.user_metadata.full_name);
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication service unavailable.";
      addToast(msg, "error", "Login Error");
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!unconfirmedEmail) return;
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: unconfirmedEmail,
      });
      if (error) {
        addToast(error.message, "error", "Resend Failed");
      } else {
        addToast(`Confirmation email sent to ${unconfirmedEmail}.`, "success", "Sent!");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resend confirmation email.";
      addToast(msg, "error");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      addToast("Connecting to Google Auth...", "info");
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=/dashboard`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        if (
          error.message.includes("oauth_client_not_found") ||
          error.message.includes("invalid client_id") ||
          error.message.includes("400")
        ) {
          addToast(
            "Google OAuth is not configured in your Supabase Dashboard. Please use Email/Password sign-in below.",
            "warning",
            "OAuth Setup Required"
          );
        } else {
          addToast(error.message, "error", "Google Sign In Failed");
        }
        return;
      }

      if (data?.url && typeof window !== "undefined") {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      console.warn("Google auth service error:", err);
      addToast(
        "Google OAuth is not configured in your Supabase project. Please sign in with Email & Password below.",
        "warning",
        "OAuth Setup Required"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F1] flex flex-col justify-between p-4 md:p-6 text-[#0A0A0F] relative overflow-hidden font-sans selection:bg-[#C8FF2A]">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Decorative Polka Dots (Top Right) */}
      <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-80 z-0">
        <Image
          src="/images/onboarding-icons/Orange Top Pokka Dots.svg"
          alt=""
          width={120}
          height={120}
          className="w-full h-full object-contain object-top-right"
        />
      </div>

      {/* Decorative Star Sparkle (Top Left) */}
      <div className="absolute top-12 left-6 pointer-events-none z-0">
        <Image
          src="/images/onboarding-icons/Lime Star.svg"
          alt=""
          width={26}
          height={26}
          className="animate-pulse"
        />
      </div>

      {/* Decorative Star Sparkle (Top Right) */}
      <div className="absolute top-20 right-8 pointer-events-none z-0">
        <Image
          src="/images/onboarding-icons/Lime Star.svg"
          alt=""
          width={22}
          height={22}
          className="animate-pulse"
        />
      </div>

      <main className="w-full max-w-md mx-auto flex flex-col justify-between py-4 space-y-5 relative z-10">
        {/* Header Section */}
        <header className="text-center space-y-1.5 mt-2 relative">
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0A0A0F] font-heading">
              Welcome back, <span className="text-[#FF882E]">Scholar!</span> 👋
            </h1>
          </div>
          <p className="text-xs md:text-sm text-stone-600 font-medium">
            {isMounted ? t("login.subtitle") : "Ready to pick up where you left off?"}
          </p>
        </header>

        {/* Unconfirmed Email Warning Banner */}
        {unconfirmedEmail && (
          <div className="bg-[#FF882E]/10 border-[2.5px] border-[#FF882E] rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-left space-y-2">
            <div className="flex items-center gap-2 font-black text-sm uppercase text-[#0A0A0F]">
              <span>⚠️ Email Confirmation Required</span>
            </div>
            <p className="text-xs font-bold text-[#0A0A0F]">
              Supabase requires verifying <span className="underline">{unconfirmedEmail}</span> before logging in.
            </p>
            <div className="pt-1 flex gap-2">
              <button
                onClick={handleResendConfirmation}
                className="bg-white border-[2px] border-black rounded-xl px-3 py-1.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none cursor-pointer font-heading"
              >
                Resend Confirmation Email
              </button>
            </div>
          </div>
        )}

        {/* Login Form Card */}
        <section className="bg-white border-[2.5px] border-black rounded-3xl p-5 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email Field */}
            <Input
              id="login-email"
              type="email"
              label={isMounted ? t("login.emailLabel") : "Email Address"}
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
              onClear={() => setEmail("")}
              error={errors.email}
            />

            {/* Password Field with Show/Hide toggle */}
            <PasswordInput
              id="login-password"
              label={isMounted ? t("login.passwordLabel") : "Password"}
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
              labelRight={
                <Link
                  href="/coming-soon"
                  className="text-xs font-bold text-[#FF882E] hover:text-[#e07520] underline decoration-2 underline-offset-2"
                >
                  {isMounted ? t("login.forgotPassword") : "Forgot?"}
                </Link>
              }
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#C8FF2A] hover:bg-[#b8f01c] text-[#0A0A0F] font-bold text-base md:text-lg py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider font-heading mt-2"
            >
              {isLoading ? (
                <span>LOGGING IN...</span>
              ) : (
                <>
                  <span>LOG IN</span>
                  <svg className="w-5 h-5 stroke-[2.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Social Auth */}
        <SocialAuthButtons onGoogle={handleGoogleLogin} />

        {/* Footer Navigation */}
        <footer className="w-full text-center py-2">
          <p className="text-stone-600 font-medium text-xs md:text-sm">
            {isMounted ? t("login.noAccount") : "New here?"}{" "}
            <Link
              href="/getting-started"
              className="text-[#FF882E] font-extrabold underline decoration-2 underline-offset-2 hover:text-[#e07520] transition-colors"
            >
              {isMounted ? t("login.createAccount") : "Create an account"}
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
