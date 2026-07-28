"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";
import ToastContainer from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { useIsMounted } from "@/hooks/useIsMounted";
import { loginSchema, extractZodErrors } from "@/lib/validation";
import { sanitizeString } from "@/lib/security";
import { createClient } from "@/utils/supabase/client";
import "@/lib/i18n";

export default function LoginPage() {
  const { t } = useTranslation();
  const { toasts, addToast, removeToast } = useToast();
  const isMounted = useIsMounted();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

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

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        addToast(error.message || "Invalid login credentials.", "error", "Sign In Failed");
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

  const handleGoogleLogin = async () => {
    try {
      addToast("Connecting to Google Auth...", "info");
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/dashboard?showSetup=true`,
        },
      });

      if (error) {
        addToast(error.message, "error", "Google Sign In Failed");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google auth service error";
      addToast(msg, "error");
    }
  };

  const handleAppleLogin = () => {
    addToast("Connecting to Apple Auth...", "info");
  };

  return (
    <main className="w-full flex flex-col justify-between px-2 text-black space-y-4 md:space-y-6">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Header Section */}
      <header className="text-center space-y-2 mt-4 animate-spring-slide-up">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none text-[#1A1A1A]">
          {isMounted ? (
            <>
              Welcome back, <span className="text-[#965A18] underline decoration-[3.5px]">scholar!</span>
            </>
          ) : (
            "Welcome back, scholar!"
          )}
        </h1>
        <p className="text-base text-stone-600 font-medium">
          {isMounted
            ? t("login.subtitle")
            : "Ready to pick up where you left off?"}
        </p>
      </header>

      {/* Login Form Card */}
      <section className="bg-white border-[3.5px] border-black rounded-2xl p-5 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email Field */}
          <Input
            id="login-email"
            type="email"
            label={isMounted ? t("login.emailLabel") : "Email Address"}
            placeholder="you@example.com"
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
            value={password}
            onChange={(val) => {
              setPassword(val);
              if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
            }}
            labelRight={
              <Link
                href="/coming-soon"
                className="text-xs font-bold text-[#965A18] hover:text-[#7A4711] underline decoration-2 underline-offset-2"
              >
                {isMounted ? t("login.forgotPassword") : "Forgot?"}
              </Link>
            }
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
          >
            {isMounted ? t("login.submit") : "Log In →"}
          </Button>
        </form>
      </section>

      {/* Social Auth */}
      <SocialAuthButtons
        onGoogle={handleGoogleLogin}
        onApple={handleAppleLogin}
      />

      {/* Footer Navigation */}
      <footer className="w-full text-center py-2">
        <p className="text-stone-700 font-medium text-[15px]">
          {isMounted ? t("login.noAccount") : "New here?"}{" "}
          <Link
            href="/register"
            className="text-[#965A18] font-bold underline decoration-2 underline-offset-2 hover:text-[#7A4711] transition-colors"
          >
            {isMounted ? t("login.createAccount") : "Create an account"}
          </Link>
        </p>
      </footer>
    </main>
  );
}
