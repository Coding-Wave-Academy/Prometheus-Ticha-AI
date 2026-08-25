"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft01Icon,
  PlayIcon,
  SparklesIcon,
  Clock01Icon,
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

export default function VideosPage() {
  const navItems = useNavItems();

  const [watchedVideos, setWatchedVideos] = useState<WatchedVideoItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<WatchedVideoItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load only real watched videos from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("ticha_watched_videos");
        if (stored) {
          const list: WatchedVideoItem[] = JSON.parse(stored);
          if (Array.isArray(list) && list.length > 0) {
            setWatchedVideos(list);
            setActiveVideo(list[0]);
          }
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

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
                Watched Lessons
              </h1>
              <p className="text-xs font-bold text-stone-600">
                {watchedVideos.length > 0
                  ? `${watchedVideos.length} lesson${watchedVideos.length > 1 ? "s" : ""} saved in history`
                  : "Your video lesson archive"}
              </p>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="py-20 flex items-center justify-center">
            <div className="w-10 h-10 border-[3.5px] border-black border-t-[#B6FF00] rounded-full animate-spin" />
          </div>
        ) : watchedVideos.length === 0 ? (
          /* Empty State */
          <div className="bg-white border-[3.5px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-4 my-auto py-12">
            <div className="w-16 h-16 bg-[#FFB040] border-[3px] border-black rounded-2xl flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <PlayIcon size={32} className="text-black" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black uppercase text-black tracking-tight">
                No Watched Lessons Yet
              </h2>
              <p className="text-xs font-medium text-stone-600 max-w-xs mx-auto">
                Complete your daily recommended video lesson to review the concepts and explanations here anytime.
              </p>
            </div>

            <Link
              href="/dashboard/daily-lessons"
              className="inline-flex items-center justify-center gap-2 w-full bg-[#B6FF00] hover:bg-[#a3e600] border-[3.5px] border-black rounded-xl py-3.5 px-4 font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-black"
            >
              <SparklesIcon size={18} />
              <span>Start Today&apos;s Lesson →</span>
            </Link>
          </div>
        ) : (
          /* Watched Videos Player + History List */
          <div className="space-y-5">
            {/* Active Video Player */}
            {activeVideo && (
              <section className="bg-white border-[3.5px] border-black rounded-2xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
                <div className="relative w-full aspect-video rounded-xl border-[2.5px] border-black overflow-hidden bg-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=0&rel=0`}
                    title={activeVideo.topic}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-[#B6FF00] border-[1px] border-black px-2 py-0.5 rounded-full inline-block">
                    {activeVideo.subject}
                  </span>
                  <h2 className="text-base font-black text-black leading-tight">
                    {activeVideo.topic}
                  </h2>
                  <p className="text-xs font-bold text-stone-600">
                    Channel: {activeVideo.channelTitle}
                  </p>
                  {activeVideo.summary && (
                    <p className="text-xs font-medium text-stone-800 pt-1 leading-snug">
                      {activeVideo.summary}
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* List of Other Watched Lessons */}
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-black pl-1 flex items-center gap-1.5">
                <Clock01Icon size={16} />
                <span>Watch History</span>
              </h3>

              <div className="space-y-3">
                {watchedVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => setActiveVideo(video)}
                    className={`${
                      activeVideo?.id === video.id
                        ? "bg-[#B6FF00] border-[3px] border-black"
                        : "bg-white border-[2.5px] border-black"
                    } rounded-xl p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:translate-x-px active:translate-y-px active:shadow-none transition-all flex items-center gap-3`}
                  >
                    <div className="w-10 h-10 bg-black text-[#B6FF00] border-[2px] border-black rounded-lg flex items-center justify-center shrink-0">
                      <PlayIcon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-black uppercase tracking-widest text-stone-700 block">
                        {video.subject}
                      </span>
                      <h4 className="text-xs font-black text-black truncate leading-tight">
                        {video.topic}
                      </h4>
                      <p className="text-[11px] font-medium text-stone-600 truncate">
                        {video.channelTitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav items={navItems} />
    </div>
  );
}
