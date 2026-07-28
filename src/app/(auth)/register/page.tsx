"use client";

import React, { useState } from "react";
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
import { registerSchema, extractZodErrors } from "@/lib/validation";
import { sanitizeString } from "@/lib/security";
import "@/lib/i18n";

export default function RegisterPage() {
  const { t } = useTranslation();
  const { toasts, addToast, removeToast } = useToast();
  const isMounted = useIsMounted();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const strength = usePasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
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

    setTimeout(() => {
      setIsLoading(false);
      addToast("Account created successfully! Welcome to Ticha AI.", "success", "Welcome");
      localStorage.setItem("ticha_user_fullname", cleanName);
      router.push("/dashboard?showSetup=true");
    }, 1200);
  };

  const handleGoogleLogin = () => {
    addToast("Connecting to Google Auth...", "info");
  };

  const handleAppleLogin = () => {
    addToast("Connecting to Apple Auth...", "info");
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
          🔥 1 Day Streak!
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
              <p className="text-xs font-bold text-red-600 mt-1">⚠️ {errors.password}</p>
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
              <p className="text-xs font-bold text-red-600 mt-1">⚠️ {errors.confirmPassword}</p>
            )}
            {passwordsMatch && !errors.confirmPassword && (
              <p className="text-xs font-bold text-green-700 mt-1.5 flex items-center gap-1">
                <span>✓</span> Passwords match
              </p>
            )}
            {passwordsMismatch && !errors.confirmPassword && (
              <p className="text-xs font-bold text-red-600 mt-1.5 flex items-center gap-1">
                <span>✗</span> Passwords do not match
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
