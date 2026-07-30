"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft01Icon,
  PlayIcon,
  SparklesIcon,
  FlashIcon,
  SquareIcon,
  ComputerIcon,
  CheckmarkCircle02Icon,
  Search01Icon,
  Wifi01Icon,
  Book01Icon,
  Award01Icon,
} from "hugeicons-react";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";

interface WatchedVideoItem {
  id: string;
  subject: string;
  topic: string;
  youtubeId: string;
  channelTitle: string;
  thumbnail?: string;
  duration?: string;
  bgColor?: string;
  summary: string;
  watchedAt?: string;
}

// Fallback initial sample watched videos if student has not watched any yet
const sampleWatchedVideos: WatchedVideoItem[] = [
  {
    id: "sample-1",
    subject: "Physics",
    topic: "Faraday's Law of Induction Explained",
    youtubeId: "vw2A50Q15rM",
    channelTitle: "Khan Academy",
    duration: "4:15",
    bgColor: "bg-[#FFB040]",
    summary: "Visual explanation of magnetic flux and induced electromotive force.",
  },
  {
    id: "sample-2",
    subject: "Pure Mathematics",
    topic: "Introduction to Limits & Calculus",
    youtubeId: "riXcZT2ICjA",
    channelTitle: "Khan Academy",
    duration: "5:30",
    bgColor: "bg-[#B6FF00]",
    summary: "Tutorial on limits, slopes, and instantaneous rates of change.",
  },
  {
    id: "sample-3",
    subject: "ICT & Computing",
    topic: "Database Normalization (1NF, 2NF, 3NF)",
    youtubeId: "UrYLYV7WSHM",
    channelTitle: "Decomplexify",
    duration: "6:10",
    bgColor: "bg-[#FFDF9E]",
    summary: "Step-by-step breakdown of eliminating duplicate records and defining primary keys.",
  },
];

export default function VideosPage() {
  const router = useRouter();
  const navItems = useNavItems();

  const [watchedVideos, setWatchedVideos] = useState<WatchedVideoItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<WatchedVideoItem | null>(null);
  const [searchResults, setSearchResults] = useState<WatchedVideoItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<"watched" | "search">("watched");

  // Load watched videos from localStorage (Daily Lessons watch history)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("ticha_watched_videos");
        if (stored) {
          const list: WatchedVideoItem[] = JSON.parse(stored);
          if (Array.isArray(list) && list.length > 0) {
            setWatchedVideos(list);
            setActiveVideo(list[0]);
            return;
          }
        }
      } catch {
        // ignore
      }
      // If no watched videos exist yet, set sample watched videos
      setWatchedVideos(sampleWatchedVideos);
      setActiveVideo(sampleWatchedVideos[0]);
    }
  }, []);

  // Save video to watched history
  const saveToWatchedHistory = (video: WatchedVideoItem) => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("ticha_watched_videos");
        const list: WatchedVideoItem[] = stored ? JSON.parse(stored) : [];
        const updated = [video, ...list.filter((v) => v.youtubeId !== video.youtubeId)];
        localStorage.setItem("ticha_watched_videos", JSON.stringify(updated));
        setWatchedVideos(updated);
      } catch {
        // ignore
      }
    }
  };

  const handleSelectVideo = (video: WatchedVideoItem) => {
    setActiveVideo(video);
    saveToWatchedHistory(video);
  };

  // Search real YouTube videos using YouTube Data API v3
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setActiveTab("search");

    try {
      const res = await fetch("/api/youtube/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.videos) && data.videos.length > 0) {
          const mapped: WatchedVideoItem[] = data.videos.map((v: any, idx: number) => ({
            id: v.id || `yt-${idx}`,
            subject: searchQuery.split(" ")[0] || "GCE Concept",
            topic: v.title,
            youtubeId: v.id,
            channelTitle: v.channelTitle || "YouTube",
            thumbnail: v.thumbnail,
            duration: "HD",
            bgColor: idx % 2 === 0 ? "bg-[#B6FF00]" : "bg-[#FFB040]",
            summary: v.description || "GCE concept explainer video.",
          }));
          setSearchResults(mapped);
          setActiveVideo(mapped[0]);
          saveToWatchedHistory(mapped[0]);
        }
      }
    } catch (err) {
      console.error("YouTube search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const currentDisplayList = activeTab === "watched" ? watchedVideos : searchResults;

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
                Watched Concept Videos
              </h1>
              <p className="text-xs font-bold text-stone-600">
                Daily Lessons Watch History • Offline Ready
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

        {/* Tab Toggle: Watched History vs Search Results */}
        <div className="flex border-[2.5px] border-black rounded-xl p-1 bg-white shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
          <button
            onClick={() => setActiveTab("watched")}
            className={`flex-1 py-2 text-xs font-black uppercase rounded-lg transition-all ${
              activeTab === "watched"
                ? "bg-[#B6FF00] text-black border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                : "text-stone-600 hover:text-black"
            }`}
          >
            Daily Lessons Watched ({watchedVideos.length})
          </button>

          {searchResults.length > 0 && (
            <button
              onClick={() => setActiveTab("search")}
              className={`flex-1 py-2 text-xs font-black uppercase rounded-lg transition-all ${
                activeTab === "search"
                  ? "bg-[#FFB040] text-black border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                  : "text-stone-600 hover:text-black"
              }`}
            >
              Search Results ({searchResults.length})
            </button>
          )}
        </div>

        {/* Active Embedded YouTube Video Player */}
        {activeVideo && (
          <div className="bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3 animate-page-in">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 bg-[#B6FF00] text-black border-[2px] border-black rounded-full px-3 py-0.5 text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                <SparklesIcon size={12} />
                <span>{activeVideo.subject}</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-[#FAF7EC] text-black border-[1.5px] border-black rounded-md px-2 py-0.5 text-[10px] font-black shrink-0">
                <Wifi01Icon size={12} className="text-green-600" />
                Offline Ready
              </span>
            </div>

            <h3 className="text-base font-black uppercase text-black leading-snug">
              {activeVideo.topic}
            </h3>

            <p className="text-[11px] font-bold text-stone-600">
              Channel: {activeVideo.channelTitle}
            </p>

            {/* In-App YouTube Player (No external redirect) */}
            <div className="aspect-video w-full bg-black border-[2.5px] border-black rounded-xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.topic}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            <p className="text-xs font-bold text-stone-800 leading-snug pt-1">
              {activeVideo.summary}
            </p>
          </div>
        )}

        {/* Video Feed */}
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black uppercase tracking-wider text-stone-700">
              {activeTab === "watched" ? "Videos Watched from Daily Lessons" : "Search Results"}
            </h3>
            <span className="text-[10px] font-black uppercase text-green-700 flex items-center gap-1">
              <Wifi01Icon size={12} className="text-green-600" />
              Cached Offline
            </span>
          </div>

          <div className="space-y-3">
            {currentDisplayList.map((vid) => (
              <div
                key={vid.id}
                onClick={() => handleSelectVideo(vid)}
                className={`bg-white hover:bg-[#FAF7EC] border-[3.5px] border-black rounded-2xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:translate-x-px active:translate-y-px active:shadow-none transition-all flex items-center gap-4 ${
                  activeVideo?.youtubeId === vid.youtubeId ? "ring-2 ring-black bg-[#FAF7EC]" : ""
                }`}
              >
                <div className="w-12 h-12 bg-[#FFB040] border-[2.5px] border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                  {vid.subject.toLowerCase().includes("physic") ? (
                    <FlashIcon size={22} className="text-black" />
                  ) : vid.subject.toLowerCase().includes("math") ? (
                    <SquareIcon size={22} className="text-black" />
                  ) : vid.subject.toLowerCase().includes("ict") ? (
                    <ComputerIcon size={22} className="text-black" />
                  ) : (
                    <Book01Icon size={22} className="text-black" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-black uppercase text-stone-800 tracking-widest truncate">
                      {vid.subject}
                    </span>
                    <span className="text-[9px] font-extrabold bg-[#B6FF00] px-1.5 py-0.5 border border-black rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] shrink-0">
                      Watched
                    </span>
                  </div>
                  <h4 className="font-black text-sm text-black leading-tight truncate">
                    {vid.topic}
                  </h4>
                  <p className="text-[11px] font-bold text-stone-600 truncate">
                    {vid.summary}
                  </p>
                </div>

                <div className="w-10 h-10 bg-[#B6FF00] border-[2px] border-black rounded-full flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] shrink-0">
                  <PlayIcon size={18} className="text-black fill-current ml-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Callout */}
        <div className="bg-[#B6FF00] border-[3.5px] border-black rounded-2xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-800">
              1% Daily Habit
            </span>
            <h3 className="text-sm font-black text-black">
              Complete today&apos;s lesson to add new concept videos!
            </h3>
          </div>
          <button
            onClick={() => router.push("/dashboard/daily-lessons")}
            className="bg-white border-[2px] border-black rounded-xl px-3 py-2 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all text-black shrink-0"
          >
            Start Lesson ➔
          </button>
        </div>
      </main>

      <BottomNav items={navItems} />
    </div>
  );
}
