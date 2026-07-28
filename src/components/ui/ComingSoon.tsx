"use client";

import React, { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ToastContainer from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { hapticSuccess } from "@/lib/haptics";

export interface ComingSoonProps {
  title?: string;
  featureName?: string;
  description?: string;
  showBackHome?: boolean;
}

export default function ComingSoon({
  title = "Screen Coming Soon",
  featureName = "This Feature",
  description = "Our engineering team is actively building this module. Sign up below to get early access as soon as it launches!",
  showBackHome = true,
}: ComingSoonProps) {
  const { toasts, addToast, removeToast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      addToast("Please enter a valid email address.", "warning", "Invalid Email");
      return;
    }

    hapticSuccess();
    setIsSubmitted(true);
    addToast("You're on the early access list!", "success", "Subscribed");
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between items-center px-4 py-8 text-black antialiased font-sans max-w-md mx-auto w-full">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Hero Badge & Vector Illustration */}
      <div className="w-full text-center space-y-6 my-auto">
        <div className="relative w-28 h-28 bg-[#B6FF00] border-[3.5px] border-black rounded-3xl flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mx-auto rotate-[-3deg] animate-spring-pop">
          <svg className="w-14 h-14 text-black fill-current" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
          </svg>
          <span className="absolute -top-3 -right-3 bg-[#FFB040] border-[2.5px] border-black rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            In Dev
          </span>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#965A18]">
            Upcoming Module
          </span>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#1A1A1A]">
            {title}
          </h1>
          <p className="text-sm font-medium text-stone-600 max-w-xs mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Interactive Subscription Form */}
        <Card variant="default" className="text-left space-y-4">
          {!isSubmitted ? (
            <form onSubmit={handleNotify} className="space-y-3">
              <Input
                type="email"
                label="Get notified at launch"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onClear={() => setEmail("")}
              />
              <Button type="submit" variant="primary" size="md" className="w-full flex items-center justify-center gap-2">
                <span>Notify Me</span>
                <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
                  <path d="M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 9.15l-1.92.64 1.34 2.01L7.7 17.5c1.86 2.08 4.6 3.5 7.7 3.5.54 0 1.07-.05 1.6-.14l-2.07-2.07c-2.54-.25-4.73-1.63-6.02-3.66.1-2.92 1.25-5.6 3.12-7.53L9.19 6.35zM19.07 4.93C17.03 2.89 14.17 1.66 11 1.66v2c2.61 0 4.98 1.02 6.66 2.7l1.41-1.43z" />
                </svg>
              </Button>
            </form>
          ) : (
            <div className="bg-[#B6FF00] border-[2.5px] border-black rounded-xl p-4 text-center space-y-1 animate-spring-slide-up">
              <div className="flex items-center justify-center gap-1.5 font-black text-sm uppercase">
                <svg className="w-5 h-5 fill-current text-black" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>Spot Reserved!</span>
              </div>
              <p className="text-xs font-bold text-stone-800">
                We will email {email} the moment {featureName} is ready.
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Action Footer */}
      {showBackHome && (
        <footer className="w-full pt-4">
          <Link href="/dashboard" className="block w-full">
            <Button variant="secondary" size="lg" className="w-full">
              ← Return to Dashboard
            </Button>
          </Link>
        </footer>
      )}
    </div>
  );
}
