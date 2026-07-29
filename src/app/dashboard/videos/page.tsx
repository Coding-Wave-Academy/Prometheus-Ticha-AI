"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft01Icon,
  PlayIcon,
  SparklesIcon,
  FlashIcon,
  SquareIcon,
  ComputerIcon,
  CheckmarkCircle02Icon,
  Award01Icon,
} from "hugeicons-react";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";

interface VideoItem {
  id: string;
  subject: string;
  topic: string;
  duration: string;
  bgColor: string;
  icon: React.ReactNode;
  summary: string;
}

const explainerVideos: VideoItem[] = [
  {
    id: "vid-1",
    subject: "Physics",
    topic: "Electromagnetism & Faraday's Law",
    duration: "0:15",
    bgColor: "bg-[#FFB040]",
    icon: <FlashIcon size={24} className="text-black" />,
    summary: "2D animated visualization of magnetic flux inducing electrical EMF across conductor loops.",
  },
  {
    id: "vid-2",
    subject: "Pure Mathematics",
    topic: "Calculus Limits & Tangent Lines",
    duration: "0:15",
    bgColor: "bg-[#B6FF00]",
    icon: <SquareIcon size={24} className="text-black" />,
    summary: "2D vector animation demonstrating local linearity as curves zoom into straight lines.",
  },
  {
    id: "vid-3",
    subject: "ICT & Computing",
    topic: "Database Normalization (1NF - 3NF)",
    duration: "0:15",
    bgColor: "bg-[#FFDF9E]",
    icon: <ComputerIcon size={24} className="text-black" />,
    summary: "Animated breakdown of atomic columns, primary keys, and eliminating data redundancy.",
  },
  {
    id: "vid-4",
    subject: "Chemistry",
    topic: "Organic Reaction Mechanisms",
    duration: "0:15",
    bgColor: "bg-[#D3E2FF]",
    icon: <CheckmarkCircle02Icon size={24} className="text-black" />,
    summary: "Visualizing nucleophilic substitution and curly arrows in organic synthesis.",
  },
];

export default function VideosPage() {
  const navItems = useNavItems();
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF7EC] pb-28 text-black antialiased font-sans selection:bg-[#B6FF00]">
      <main className="w-full max-w-md mx-auto p-4 pt-6 flex flex-col space-y-5 animate-page-in text-left">
        {/* Header */}
        <header className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="w-10 h-10 bg-white border-[2.5px] border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center transition-transform"
              aria-label="Back to dashboard"
            >
              <ArrowLeft01Icon className="w-5 h-5 text-black" />
            </Link>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A]">
                2D AI Explainer Videos
              </h1>
              <p className="text-xs font-bold text-stone-600">
                Powered by Gemini Veo Visualizer
              </p>
            </div>
          </div>
        </header>

        {/* Video Player Modal / Active Viewer */}
        {activeVideo && (
          <div className="bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 bg-[#B6FF00] text-black border-[2px] border-black rounded-full px-3 py-0.5 text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                <SparklesIcon size={12} />
                <span>{activeVideo.subject}</span>
              </span>
              <button
                onClick={() => {
                  setActiveVideo(null);
                  setIsPlaying(false);
                }}
                className="text-xs font-black uppercase underline text-stone-700"
              >
                Close Player
              </button>
            </div>

            <h3 className="text-lg font-black uppercase text-black">
              {activeVideo.topic}
            </h3>

            <div className="aspect-video w-full bg-stone-900 border-[2.5px] border-black rounded-xl relative flex flex-col items-center justify-center text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              {isPlaying ? (
                <div className="flex flex-col items-center justify-center space-y-2 animate-pulse">
                  <div className="w-10 h-10 border-[3px] border-[#B6FF00] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-black uppercase text-[#B6FF00]">
                    Playing 2D Explainer Video...
                  </span>
                </div>
              ) : (
                <div
                  onClick={() => setIsPlaying(true)}
                  className="w-14 h-14 bg-[#B6FF00] border-[2.5px] border-black rounded-full flex items-center justify-center text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transition-transform cursor-pointer"
                >
                  <PlayIcon size={28} className="fill-current ml-1" />
                </div>
              )}
            </div>

            <p className="text-xs font-bold text-stone-800 leading-snug">
              {activeVideo.summary}
            </p>
          </div>
        )}

        {/* Video Library Feed */}
        <div className="space-y-4 pt-1">
          <h3 className="text-sm font-black uppercase tracking-wider text-stone-700 pl-1">
            GCE Concept Library ({explainerVideos.length} Videos)
          </h3>

          <div className="space-y-3">
            {explainerVideos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => {
                  setActiveVideo(vid);
                  setIsPlaying(true);
                }}
                className={`${vid.bgColor} border-[3.5px] border-black rounded-2xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:translate-x-px active:translate-y-px active:shadow-none transition-all flex items-center gap-4`}
              >
                <div className="w-12 h-12 bg-white border-[2.5px] border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                  {vid.icon}
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <span className="text-[10px] font-black uppercase text-stone-800 tracking-widest block">
                    {vid.subject}
                  </span>
                  <h4 className="font-black text-sm text-black leading-tight truncate">
                    {vid.topic}
                  </h4>
                  <p className="text-[11px] font-bold text-stone-900 truncate">
                    {vid.summary}
                  </p>
                </div>

                <div className="w-10 h-10 bg-white border-[2px] border-black rounded-full flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] shrink-0">
                  <PlayIcon size={18} className="text-black fill-current ml-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav items={navItems} />
    </div>
  );
}
