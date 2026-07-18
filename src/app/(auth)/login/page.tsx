"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/ui/PasswordInput";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";
import "@/lib/i18n";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log("Logged in with:", email);

      // Derive a name from email prefix as fallback
      const derivedName = email.split("@")[0];
      const displayName =
        derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
      localStorage.setItem("ticha_user_fullname", displayName);

      router.push("/dashboard");
    }, 1500);
  };

  const handleGoogleLogin = () => {
    console.log("Google authentication triggered");
  };

  const handleAppleLogin = () => {
    console.log("Apple authentication triggered");
  };

  return (
    <main className="w-full flex flex-col justify-between px-2 text-black space-y-4 md:space-y-6">
      {/* Header Section */}
      <header className="text-center space-y-2 mt-4">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none text-[#1A1A1A]">
          {isMounted ? (
            <>
              Welcome back, <span className="text-[#B6FF00]">scholar!</span>
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
        <form onSubmit={handleSubmit} className="space-y-3.5 md:space-y-4">
          {error && (
            <div className="bg-[#FF9494] border-[2.5px] border-black rounded-xl p-3 font-bold text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              ⚠️ {error}
            </div>
          )}

          {/* Email field */}
          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="login-email"
              className="text-xs font-extrabold uppercase tracking-widest text-stone-800"
            >
              {isMounted ? t("login.emailLabel") : "Email Address"}
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border-[3.5px] border-black rounded-xl p-3.5 text-[15px] font-medium outline-none placeholder-stone-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
            />
          </div>

          {/* Password field with show/hide */}
          <PasswordInput
            id="login-password"
            label={isMounted ? t("login.passwordLabel") : "Password"}
            value={password}
            onChange={setPassword}
            labelRight={
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-[#965A18] hover:text-[#7A4711] underline decoration-2 underline-offset-2"
              >
                {isMounted ? t("login.forgotPassword") : "Forgot?"}
              </Link>
            }
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#B6FF00] border-[3.5px] border-black rounded-xl py-4 px-4 font-black uppercase text-[17px] tracking-wider transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#a3e600] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {isLoading
              ? "Signing In..."
              : isMounted
                ? t("login.submit")
                : "Log In →"}
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
