"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home01Icon,
  Compass01Icon,
  AiChat02Icon,
  File01Icon,
  Book01Icon,
  ArrowLeft01Icon,
} from "hugeicons-react";
import { hapticTap } from "@/lib/haptics";
import Button from "@/components/ui/Button";

export default function NotFound() {
  const router = useRouter();

  const handleBack = () => {
    hapticTap();
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  const quickLinks = [
    {
      name: "Dashboard",
      icon: <Home01Icon size={20} className="text-black" />,
      href: "/dashboard",
      bg: "bg-[#C8FF2A]",
      desc: "Your daily study hub",
    },
    {
      name: "AI Tutor",
      icon: <AiChat02Icon size={20} className="text-black" />,
      href: "/dashboard/tutor",
      bg: "bg-[#FFD6E7]",
      desc: "Ask any GCE question",
    },
    {
      name: "Past Papers",
      icon: <File01Icon size={20} className="text-black" />,
      href: "/past-papers",
      bg: "bg-[#D3E2FF]",
      desc: "GCE O/L & A/L archive",
    },
    {
      name: "Summaries",
      icon: <Book01Icon size={20} className="text-black" />,
      href: "/summaries",
      bg: "bg-[#FFDF9E]",
      desc: "High-yield revision notes",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FFF8F1] text-[#0A0A0F] antialiased flex flex-col justify-center px-4 py-8 select-none">
      {/* ═══════════════════════════════════════════════════════════════════
          MOBILE 404 VIEW (<768px)
          Compact mobile-first Neobrutalist card
       ═══════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden max-w-md w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="bg-white border-[3.5px] border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-5 relative overflow-hidden"
        >
          {/* 1% Logo Badge + 404 Chip */}
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 bg-[#FAF7EC] border-[2px] border-black rounded-xl flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-xs font-black">1%</span>
            </div>
            <span className="bg-[#FF882E] text-white border-[2px] border-black rounded-full px-3 py-0.5 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Error 404
            </span>
          </div>

          {/* Illustrated Icon Badge */}
          <div className="w-20 h-20 bg-[#C8FF2A] border-[3.5px] border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto rotate-[-3deg] relative">
            <Compass01Icon size={40} className="text-black" />
            <span className="absolute -top-2 -right-2 bg-black text-[#C8FF2A] border-[2px] border-black rounded-full w-7 h-7 flex items-center justify-center text-xs font-black">
              ?
            </span>
          </div>

          {/* Heading & Subtitle */}
          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase tracking-tight text-[#0A0A0F] leading-tight">
              Topic Not Found
            </h1>
            <p className="text-sm font-semibold text-stone-600 leading-relaxed">
              Looks like this lesson or page took a detour from the syllabus. Let&apos;s get you back on track for your 1% daily improvement!
            </p>
          </div>

          {/* Quick Return Buttons */}
          <div className="space-y-2.5 pt-2">
            <Link href="/dashboard" className="block w-full">
              <Button
                variant="primary"
                size="lg"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => hapticTap()}
              >
                <Home01Icon size={20} className="text-black" />
                <span>Back to Dashboard</span>
              </Button>
            </Link>

            <button
              onClick={handleBack}
              className="w-full bg-[#FAF7EC] hover:bg-stone-100 border-[2.5px] border-black rounded-xl py-2.5 px-4 font-black uppercase tracking-wider text-xs shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft01Icon size={16} className="text-black" />
              <span>Go Back</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          WEB & TABLET 404 VIEW (>=768px)
          Expansive 2-column widescreen Neobrutalist canvas
       ═══════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block max-w-4xl w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white border-[3.5px] border-black rounded-3xl p-8 lg:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: 404 Block Graphic */}
            <div className="md:col-span-5 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-full bg-[#C8FF2A] border-[3.5px] border-black rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                {/* 1% Badge */}
                <div className="inline-flex items-center gap-1.5 bg-black text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
                  <span>1% TICHA AI</span>
                </div>

                <div className="text-6xl lg:text-7xl font-black text-black tracking-tighter leading-none py-2 font-mono">
                  404
                </div>

                <div className="text-xs font-black uppercase tracking-widest text-black/80">
                  Page Not in Curriculum
                </div>

                {/* Decorative Sparkle */}
                <div className="absolute top-2 right-2 text-black/20 text-3xl font-black pointer-events-none">
                  ✦
                </div>
              </div>

              <p className="text-xs font-bold text-stone-500">
                Exam Preparation Assistant for GCE O/L & A/L
              </p>
            </div>

            {/* Right Column: Information & Navigation */}
            <div className="md:col-span-7 space-y-6 text-left">
              <div>
                <span className="inline-block bg-[#FF882E] text-white border-[2px] border-black rounded-full px-3 py-0.5 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-3">
                  Detour Encountered
                </span>
                <h1 className="text-3xl lg:text-4xl font-black text-[#0A0A0F] leading-tight tracking-tight">
                  Lost in the Syllabus?
                </h1>
                <p className="text-sm lg:text-base font-medium text-stone-600 mt-2 leading-relaxed">
                  The page or resource you requested doesn&apos;t exist or might have moved. Jump directly to one of your core study hubs below:
                </p>
              </div>

              {/* Quick Jump Grid */}
              <div className="grid grid-cols-2 gap-3">
                {quickLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => hapticTap()}
                    className={`${item.bg} border-[2.5px] border-black rounded-2xl p-3.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.02] active:scale-[0.98] transition-all group flex items-start gap-2.5`}
                  >
                    <div className="w-8 h-8 bg-white border-[2px] border-black rounded-xl flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] shrink-0 group-hover:rotate-6 transition-transform">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-black leading-tight truncate">
                        {item.name}
                      </h4>
                      <p className="text-[10px] font-bold text-stone-700 leading-tight truncate mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Primary Actions */}
              <div className="flex items-center gap-3 pt-2">
                <Link href="/dashboard" className="flex-1">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => hapticTap()}
                  >
                    <Home01Icon size={18} className="text-black" />
                    <span>Go to Dashboard</span>
                  </Button>
                </Link>

                <button
                  onClick={handleBack}
                  className="bg-[#FAF7EC] hover:bg-stone-100 border-[2.5px] border-black rounded-xl py-3 px-5 font-black uppercase tracking-wider text-xs shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft01Icon size={16} className="text-black" />
                  <span>Go Back</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
