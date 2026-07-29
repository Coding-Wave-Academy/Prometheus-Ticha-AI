"use client";

export const dynamic = "force-dynamic";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldKeyIcon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  UserIcon,
  Mail01Icon,
  Book01Icon,
  AiBrain01Icon,
  ArrowRight01Icon,
} from "hugeicons-react";
import { useAuth } from "@/hooks/useAuth";

function OAuthConsentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, isLoading } = useAuth();
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const clientId = searchParams.get("client_id") || "Ticha AI Web Application";
  const redirectUri = searchParams.get("redirect_uri") || "/dashboard";
  const state = searchParams.get("state") || "";

  const handleApprove = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      if (redirectUri.startsWith("http") || redirectUri.startsWith("/")) {
        const separator = redirectUri.includes("?") ? "&" : "?";
        const finalUrl = state ? `${redirectUri}${separator}state=${encodeURIComponent(state)}` : redirectUri;
        router.push(finalUrl);
      } else {
        router.push("/dashboard?showSetup=true");
      }
    }, 800);
  };

  const handleDecline = () => {
    router.push("/login?auth=cancelled");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center">
        <div className="w-10 h-10 border-[3.5px] border-black border-t-[#B6FF00] rounded-full animate-spin" />
      </div>
    );
  }

  const userDisplayName = profile?.full_name || user?.user_metadata?.full_name || user?.email || "Student";
  const userEmail = user?.email || "student@ticha.ai";
  const userAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url || null;

  return (
    <div className="min-h-screen bg-[#FAF7EC] text-black font-sans flex items-center justify-center p-4 selection:bg-[#B6FF00]">
      <main className="w-full max-w-md bg-white border-[4px] border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative flex flex-col space-y-6">
        
        {/* Top Header branding */}
        <div className="flex items-center justify-between border-b-[3px] border-black pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#B6FF00] border-[3px] border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center shrink-0">
              <Image
                src="/images/madame-ticha.png"
                alt="Ticha AI Logo"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase text-[#1A1A1A] leading-tight">
                Ticha AI
              </h1>
              <p className="text-xs font-bold text-stone-600">
                OAuth Authorization Request
              </p>
            </div>
          </div>
          <div className="bg-[#FFB040] border-[2px] border-black rounded-full p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <ShieldKeyIcon size={22} className="text-black" />
          </div>
        </div>

        {/* Logged in User Card */}
        <div className="bg-[#FAF7EC] border-[3px] border-black rounded-2xl p-3.5 flex items-center justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#B6FF00] border-[2px] border-black overflow-hidden flex items-center justify-center font-black text-sm text-black shrink-0">
              {userAvatar ? (
                <Image src={userAvatar} alt="User avatar" width={40} height={40} className="object-cover w-full h-full" unoptimized />
              ) : (
                userDisplayName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-black truncate">{userDisplayName}</p>
              <p className="text-[11px] font-bold text-stone-600 truncate">{userEmail}</p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase bg-[#B6FF00] border-[1.5px] border-black px-2 py-0.5 rounded-full shrink-0">
            Active User
          </span>
        </div>

        {/* Application details */}
        <div className="space-y-2">
          <h2 className="text-sm font-black uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
            <span>Application Requesting Access</span>
          </h2>
          <div className="bg-stone-50 border-[2.5px] border-black rounded-xl p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-left">
            <p className="text-sm font-black text-black">{clientId}</p>
            <p className="text-xs font-medium text-stone-600 mt-0.5 break-all">
              https://prometheus-ticha-ai.vercel.app
            </p>
          </div>
        </div>

        {/* Requested Scopes */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-black uppercase tracking-widest text-stone-700">
            This app will be able to:
          </h3>
          
          <ul className="space-y-2 text-left">
            <li className="flex items-start gap-2.5 bg-white border-[2px] border-black p-2.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <UserIcon size={18} className="text-black shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-black">Read your basic profile</p>
                <p className="text-[11px] font-medium text-stone-600">Full name, avatar, region, and GCE target level</p>
              </div>
            </li>

            <li className="flex items-start gap-2.5 bg-white border-[2px] border-black p-2.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Mail01Icon size={18} className="text-black shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-black">Access your account email</p>
                <p className="text-[11px] font-medium text-stone-600">Used for account identification and notifications</p>
              </div>
            </li>

            <li className="flex items-start gap-2.5 bg-white border-[2px] border-black p-2.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Book01Icon size={18} className="text-black shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-black">Sync study progress & streaks</p>
                <p className="text-[11px] font-medium text-stone-600">Track daily practice sets, quiz scores, and streak freezes</p>
              </div>
            </li>

            <li className="flex items-start gap-2.5 bg-white border-[2px] border-black p-2.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <AiBrain01Icon size={18} className="text-black shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-black">Interact with AI Tutor</p>
                <p className="text-[11px] font-medium text-stone-600">Generate personalized exercises & GCE past paper solutions</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col gap-2.5">
          <button
            onClick={handleApprove}
            disabled={isAuthorizing}
            className="w-full bg-[#B6FF00] hover:bg-[#a3e600] border-[3.5px] border-black rounded-xl py-3.5 px-4 font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 text-black disabled:opacity-50"
          >
            {isAuthorizing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Authorizing...
              </span>
            ) : (
              <>
                <CheckmarkCircle02Icon size={20} className="text-black" />
                <span>Authorize & Continue</span>
                <ArrowRight01Icon size={18} className="text-black" />
              </>
            )}
          </button>

          <button
            onClick={handleDecline}
            disabled={isAuthorizing}
            className="w-full bg-white hover:bg-stone-50 border-[3px] border-black rounded-xl py-3 px-4 font-black uppercase text-xs tracking-wider shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-1.5 text-stone-800"
          >
            <Cancel01Icon size={16} className="text-black" />
            <span>Cancel</span>
          </button>
        </div>

        <p className="text-[10px] font-extrabold text-stone-500 uppercase text-center pt-1">
          Protected by Supabase Auth & PKCE Security
        </p>

      </main>
    </div>
  );
}

export default function OAuthConsentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7EC]" />}>
      <OAuthConsentContent />
    </Suspense>
  );
}
