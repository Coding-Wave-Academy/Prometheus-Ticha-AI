"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft01Icon,
  PlayIcon,
  SparklesIcon,
  FlashIcon,
  SquareIcon,
  ComputerIcon,
  CheckmarkCircle02Icon,
  Wifi01Icon,
  Search01Icon,
} from "hugeicons-react";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";

interface VideoItem {
  id: string;
  subject: string;
  topic: string;
  youtubeId: string;
  channelTitle: string;
  thumbnail?: string;
  duration: string;
  bgColor: string;
  icon: React.ReactNode;
  summary: string;
}

const defaultVideos: VideoItem[] = [
  {
    id: "pQp6bmjPU_0",
    subject: "Physics",
    topic: "Electromagnetism & Faraday's Law",
    youtubeId: "pQp6bmjPU_0",
    channelTitle: "Doc Physics",
    duration: "2:45",
    bgColor: "bg-[#FFB040]",
    icon: <FlashIcon size={22} className="text-black" />,
    summary: "Visual demonstration of magnetic flux inducing electromotive force in copper conductors.",
  },
  {
    id: "rAof9Ld5sOg",
    subject: "Pure Mathematics",
    topic: "Calculus Limits & Tangent Lines",
    youtubeId: "rAof9Ld5sOg",
    channelTitle: "3Blue1Brown",
    duration: "3:10",
    bgColor: "bg-[#B6FF00]",
    icon: <SquareIcon size={22} className="text-black" />,
    summary: "Intuitive animation showing how smooth curves zoom in to form straight tangent lines.",
  },
  {
    id: "GFQaEYEc8_8",
    subject: "ICT & Computing",
    topic: "Database Normalization (1NF to 3NF)",
    youtubeId: "GFQaEYEc8_8",
    channelTitle: "Caleb Curry",
    duration: "4:05",
    bgColor: "bg-[#FFDF9E]",
    icon: <ComputerIcon size={22} className="text-black" />,
    summary: "Step-by-step breakdown of eliminating duplicate records and defining primary keys.",
  },
  {
    id: "M8T63D9Z_70",
    subject: "Chemistry",
    topic: "Organic Reaction Mechanisms",
    youtubeId: "M8T63D9Z_70",
    channelTitle: "Professor Dave",
    duration: "3:30",
    bgColor: "bg-[#D3E2FF]",
    icon: <CheckmarkCircle02Icon size={22} className="text-black" />,
    summary: "Clear 2D curly arrow mechanisms for nucleophilic substitution and elimination.",
  },
];

export default function VideosPage() {
  const navItems = useNavItems();
  const [videos, setVideos] = useState<VideoItem[]>(defaultVideos);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Search YouTube Data API v3
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch("/api/youtube/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `${searchQuery} GCE explainer` }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.videos) && data.videos.length > 0) {
          const mapped: VideoItem[] = data.videos.map((v: any, idx: number) => ({
            id: v.id || `yt-${idx}`,
            subject: searchQuery.split(" ")[0] || "GCE Study",
            topic: v.title,
            youtubeId: v.id,
            channelTitle: v.channelTitle || "YouTube Creator",
            thumbnail: v.thumbnail,
            duration: "HD",
            bgColor: idx % 2 === 0 ? "bg-[#B6FF00]" : "bg-[#FFB040]",
            icon: <SparklesIcon size={22} className="text-black" />,
            summary: v.description || "GCE concept explainer video.",
          }));
          setVideos(mapped);
          setActiveVideo(mapped[0]);
        }
      }
    } catch (err) {
      console.error("YouTube search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

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
                YouTube GCE Videos
              </h1>
              <p className="text-xs font-bold text-stone-600">
                YouTube Data API v3 • Rewatch Offline
              </p>
            </div>
          </div>
        </header>

        {/* Live Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search YouTube GCE topics..."
              className="w-full bg-white border-[3px] border-black rounded-xl p-3 pr-10 text-xs font-bold outline-none shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            />
            <Search01Icon size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500" />
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="bg-[#B6FF00] border-[3px] border-black rounded-xl px-4 py-2.5 font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all disabled:opacity-50 text-black shrink-0"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Video Player Viewer */}
        {activeVideo && (
          <div className="bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3 animate-page-in">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 bg-[#B6FF00] text-black border-[2px] border-black rounded-full px-3 py-0.5 text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                <SparklesIcon size={12} />
                <span>{activeVideo.subject}</span>
              </span>
              <button
                onClick={() => setActiveVideo(null)}
                className="text-xs font-black uppercase underline text-stone-700 hover:text-black"
              >
                Close Player
              </button>
            </div>

            <h3 className="text-base font-black uppercase text-black leading-snug">
              {activeVideo.topic}
            </h3>

            <p className="text-[11px] font-bold text-stone-600">
              Channel: {activeVideo.channelTitle}
            </p>

            {/* Embedded YouTube Player */}
            <div className="aspect-video w-full bg-black border-[2.5px] border-black rounded-xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.topic}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-xs font-bold text-stone-800 leading-snug flex-1 pr-2">
                {activeVideo.summary}
              </p>
              <span className="inline-flex items-center gap-1 bg-[#FAF7EC] text-black border-[1.5px] border-black rounded-md px-2 py-0.5 text-[10px] font-black shrink-0">
                <Wifi01Icon size={12} className="text-green-600" />
                Offline Ready
              </span>
            </div>
          </div>
        )}

        {/* Video Library Feed */}
        <div className="space-y-4 pt-1">
          <h3 className="text-sm font-black uppercase tracking-wider text-stone-700 pl-1">
            GCE Explainer Results ({videos.length})
          </h3>

          <div className="space-y-3">
            {videos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => setActiveVideo(vid)}
                className={`${vid.bgColor} border-[3.5px] border-black rounded-2xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:translate-x-px active:translate-y-px active:shadow-none transition-all flex items-center gap-4`}
              >
                {vid.thumbnail ? (
                  <div className="w-14 h-12 border-[2px] border-black rounded-xl overflow-hidden shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] shrink-0 bg-black">
                    <img
                      src={vid.thumbnail}
                      alt={vid.topic}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-white border-[2.5px] border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                    {vid.icon}
                  </div>
                )}

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-black uppercase text-stone-800 tracking-widest truncate">
                      {vid.channelTitle || vid.subject}
                    </span>
                    <span className="text-[9px] font-extrabold bg-white px-1.5 py-0.5 border border-black rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] shrink-0">
                      {vid.duration}
                    </span>
                  </div>
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
