"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import PasswordStrengthBar from "@/components/ui/PasswordStrengthBar";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";
import ConfettiOverlay from "@/components/auth/ConfettiOverlay";
import ToastContainer from "@/components/ui/Toast";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { useToast } from "@/hooks/useToast";
import { usePasswordStrength } from "@/hooks/usePasswordStrength";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema, extractZodErrors } from "@/lib/validation";
import { sanitizeString } from "@/lib/security";
import { createClient } from "@/utils/supabase/client";
import "@/lib/i18n";

export default function RegisterPage() {
  const { t } = useTranslation();
  const { toasts, addToast, removeToast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const isMounted = useIsMounted();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  const strength = usePasswordStrength(password);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = sanitizeString(name.trim());
    const cleanEmail = sanitizeString(email.trim());

    const parseResult = registerSchema.safeParse({
      name: cleanName,
      email: cleanEmail,
      password,
      confirmPassword,
    });

    if (!parseResult.success) {
      const fieldErrors = extractZodErrors(parseResult.error);
      setErrors(fieldErrors);
      addToast("Please resolve validation errors before submitting.", "warning", "Validation Failed");
      return;
    }

    if (strength.score < 3) {
      addToast("Please choose a stronger password matching criteria.", "warning", "Weak Password");
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // Read candidate onboarding choices
      const goal = typeof window !== "undefined" ? localStorage.getItem("ticha_onboarding_goal") || "gce" : "gce";
      const education_level = typeof window !== "undefined" ? localStorage.getItem("ticha_onboarding_education") || "al" : "al";
      let struggles = ["Physics", "Pure Mathematics", "ICT"];
      if (typeof window !== "undefined") {
        const storedStr = localStorage.getItem("ticha_onboarding_struggles");
        if (storedStr) {
          try {
            const parsed = JSON.parse(storedStr);
            if (Array.isArray(parsed) && parsed.length > 0) struggles = parsed;
          } catch { /* ignore */ }
        }
      }
      const preferred_language = typeof window !== "undefined" ? localStorage.getItem("ticha_lang") || "en" : "en";

      // 1. Sign up user with full_name and onboarding metadata
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
            goal,
            education_level,
            struggles,
            preferred_language,
          },
        },
      });

      if (error) {
        addToast(error.message || "Registration failed.", "error", "Registration Error");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("ticha_user_fullname", cleanName);

      // Direct profile upsert to guarantee persistence in database
      const userId = data.user?.id;
      if (userId) {
        await supabase.from("profiles").upsert({
          id: userId,
          full_name: cleanName,
          goal,
          education_level,
          struggles,
          preferred_language,
          profile_completed: true,
          updated_at: new Date().toISOString(),
        });
      }

      // 2. Direct Signup -> Dashboard transition
      if (data.session) {
        addToast("Account created! Welcome to Ticha AI.", "success", "Welcome");
        router.push("/dashboard");
      } else {
        // Attempt instant sign-in to bypass email confirmation step
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (!signInError && signInData?.user?.id) {
          await supabase.from("profiles").upsert({
            id: signInData.user.id,
            full_name: cleanName,
            goal,
            education_level,
            struggles,
            preferred_language,
            profile_completed: true,
            updated_at: new Date().toISOString(),
          });
          addToast("Account created! Welcome to Ticha AI.", "success", "Welcome");
          router.push("/dashboard");
        } else {
          // If email confirmation is strictly enforced in Supabase Dashboard settings:
          addToast(
            "Account registered! If prompted by your project settings, confirm your email or disable 'Confirm email' in Supabase to land directly on Dashboard.",
            "info",
            "Account Registered"
          );
          router.push("/dashboard");
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration service unavailable.";
      addToast(msg, "error", "Registration Error");
      setIsLoading(false);
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
        if (error.message.includes("oauth_client_not_found") || error.message.includes("invalid client_id") || error.message.includes("400")) {
          addToast("Google OAuth client ID is not configured in your Supabase Dashboard. Please register with Email & Password below.", "warning", "OAuth Setup Required");
        } else {
          addToast(error.message, "error", "Google Sign In Failed");
        }
        return;
      }

      if (data?.url && typeof window !== "undefined") {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      addToast("Google OAuth is not configured in your Supabase project. Please register with Email & Password below.", "warning", "OAuth Setup Required");
    }
  };

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <main className="w-full flex flex-col justify-between px-2 text-black space-y-6 animate-page-in">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Header Section */}
      <header className="text-center space-y-2 mt-4 animate-spring-slide-up">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none text-[#1A1A1A]">
          {isMounted ? t("register.title") : "Create Account"}
        </h1>
        <p className="text-base text-stone-600 font-medium">
          {isMounted ? t("register.subtitle") : "Now, let's save your progress."}
        </p>
      </header>

      {/* Milestone Card */}
      <Card variant="accent" className="text-center flex flex-col items-center justify-center relative overflow-hidden">
        <ConfettiOverlay />
        <div className="w-14 h-14 bg-white border-[3.5px] border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-3 relative z-40">
          <svg className="w-7 h-7 text-[#965A18] fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>
        <span className="text-xs font-extrabold uppercase tracking-widest text-stone-800 opacity-90 relative z-40">
          Milestone Reached
        </span>
        <h2 className="text-2xl font-black text-black mt-0.5 mb-3 relative z-40">
          Level 1: Novice
        </h2>
        <Badge variant="white" className="relative z-40">
          <svg className="w-3.5 h-3.5 fill-current text-orange-600 inline mr-1" viewBox="0 0 24 24">
            <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.6 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-5.52-4.5-9.33-6.5-13.33z" />
          </svg>
          <span>1 Day Streak!</span>
        </Badge>
      </Card>

      {/* Registration Form Card */}
      <Card variant="default">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full Name */}
          <Input
            id="register-name"
            label={isMounted ? t("register.nameLabel") : "Full Name"}
            placeholder="John Doe"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
            }}
            onClear={() => setName("")}
            error={errors.name}
          />

          {/* Email Address */}
          <Input
            id="register-email"
            type="email"
            label={isMounted ? t("register.emailLabel") : "Email Address"}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
            }}
            onClear={() => setEmail("")}
            error={errors.email}
          />

          {/* Password with Strength Indicator */}
          <div>
            <PasswordInput
              id="register-password"
              label={isMounted ? t("register.passwordLabel") : "Password"}
              value={password}
              onChange={(val) => {
                setPassword(val);
                if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
              }}
            />
            {errors.password && (
              <p className="text-xs font-bold text-red-600 mt-1 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 fill-current text-red-600 inline" viewBox="0 0 24 24">
                  <path d="M12 2L1 21h22L12 2zm1 14h-2v-2h2v2zm0-4h-2V8h2v4z" />
                </svg>
                <span>{errors.password}</span>
              </p>
            )}
            <PasswordStrengthBar strength={strength} showChecks />
          </div>

          {/* Confirm Password */}
          <div>
            <PasswordInput
              id="register-confirm-password"
              label={isMounted ? t("register.confirmPasswordLabel") : "Confirm Password"}
              value={confirmPassword}
              onChange={(val) => {
                setConfirmPassword(val);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
            />
            {errors.confirmPassword && (
              <p className="text-xs font-bold text-red-600 mt-1 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 fill-current text-red-600 inline" viewBox="0 0 24 24">
                  <path d="M12 2L1 21h22L12 2zm1 14h-2v-2h2v2zm0-4h-2V8h2v4z" />
                </svg>
                <span>{errors.confirmPassword}</span>
              </p>
            )}
            {passwordsMatch && !errors.confirmPassword && (
              <p className="text-xs font-bold text-green-700 mt-1.5 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 fill-current text-green-700 inline" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>Passwords match</span>
              </p>
            )}
            {passwordsMismatch && !errors.confirmPassword && (
              <p className="text-xs font-bold text-red-600 mt-1.5 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 stroke-[3] text-red-600 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Passwords do not match</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
          >
            {isMounted ? t("register.submit") : "Sign Up →"}
          </Button>
        </form>
      </Card>

      {/* Social Auth */}
      <SocialAuthButtons
        onGoogle={handleGoogleLogin}
      />

      {/* Footer Navigation */}
      <footer className="w-full text-center py-2 space-y-2">
        <p className="text-stone-700 font-medium text-[15px]">
          {isMounted ? t("register.hasAccount") : "Already have an account?"}{" "}
          <Link
            href="/login"
            className="text-[#965A18] font-bold underline decoration-2 underline-offset-2 hover:text-[#7A4711] transition-colors"
          >
            {isMounted ? t("register.login") : "Log in"}
          </Link>
        </p>

        <div>
          <Link
            href="/dashboard"
            className="text-xs font-black uppercase tracking-wider text-stone-500 hover:text-stone-800 transition-colors inline-flex items-center gap-1"
          >
            <span>Skip for now & Explore Dashboard →</span>
          </Link>
        </div>
      </footer>
    </main>
  );
}
