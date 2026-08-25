"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayIcon,
  PauseIcon,
  SparklesIcon,
  Download01Icon,
  CheckmarkCircle02Icon,
  RotateRight01Icon,
} from "hugeicons-react";
import { formatAIText } from "@/lib/formatAIText";

export interface VideoScene {
  timestamp: string; // e.g. "0:05"
  headline: string;
  subtext: string;
  visualType: "particles" | "wave" | "graph" | "table" | "molecule";
  color: string;
}

export interface ConceptVideo {
  id: string;
  subject: string;
  topic: string;
  duration: number; // in seconds, e.g. 20
  scenes: VideoScene[];
  keyTakeaway: string;
}

interface ConceptVideoPlayerProps {
  video: ConceptVideo;
  onClose?: () => void;
}

export default function ConceptVideoPlayer({ video, onClose }: ConceptVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isCached, setIsCached] = useState(false);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = null;
      return;
    }

    const animate = (time: number) => {
      if (lastTimeRef.current !== null) {
        const delta = (time - lastTimeRef.current) / 1000;
        setCurrentTime((prev) => {
          if (prev + delta >= video.duration) {
            setIsPlaying(false);
            return video.duration;
          }
          return prev + delta;
        });
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, video.duration]);

  // Determine current active scene based on time
  const currentSceneIndex = Math.min(
    video.scenes.length - 1,
    Math.floor((currentTime / video.duration) * video.scenes.length)
  );
  const activeScene = video.scenes[currentSceneIndex] || video.scenes[0];

  const handleReplay = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleSaveOffline = () => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("ticha_offline_videos");
        const list: string[] = stored ? JSON.parse(stored) : [];
        if (!list.includes(video.id)) {
          list.push(video.id);
          localStorage.setItem("ticha_offline_videos", JSON.stringify(list));
        }
        setIsCached(true);
      } catch {
        // ignore
      }
    }
  };

  const progressPercent = Math.min(100, (currentTime / video.duration) * 100);

  return (
    <div className="w-full bg-[#1A1A1A] border-[3.5px] border-black rounded-2xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white space-y-4 text-left relative overflow-hidden animate-page-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 bg-[#B6FF00] text-black border-[2px] border-black rounded-full px-3 py-0.5 text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
          <SparklesIcon size={12} />
          <span>{video.subject} • Gemini 2D Visualizer</span>
        </span>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs font-black uppercase underline text-stone-300 hover:text-white"
          >
            Close Video
          </button>
        )}
      </div>

      <h3 className="text-lg font-black uppercase text-white leading-tight">
        {video.topic}
      </h3>

      {/* 2D Canvas Motion Visualizer Screen */}
      <div className="relative aspect-video w-full bg-stone-950 border-[2.5px] border-black rounded-xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between p-4">
        {/* Dynamic Graphic Motion Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          {activeScene.visualType === "particles" && (
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="w-48 h-48 border-[6px] border-dashed border-[#B6FF00] rounded-full flex items-center justify-center"
            >
              <div className="w-24 h-24 bg-[#FFB040] rounded-full animate-ping opacity-50" />
            </motion.div>
          )}

          {activeScene.visualType === "wave" && (
            <div className="flex gap-2 items-center justify-center w-full">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: ["20px", "100px", "20px"] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                  className="w-4 bg-[#B6FF00] rounded-full"
                />
              ))}
            </div>
          )}

          {activeScene.visualType === "graph" && (
            <div className="w-full h-full p-6 flex items-end justify-between gap-3">
              {[40, 75, 50, 95, 60, 85].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                  className="flex-1 bg-[#FFB040] rounded-t-lg border-t-2 border-black"
                />
              ))}
            </div>
          )}

          {activeScene.visualType === "table" && (
            <div className="grid grid-cols-3 gap-2 w-full p-6 text-center font-mono text-xs">
              {["PK", "1NF", "2NF", "3NF", "FK", "DATA"].map((t, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="bg-white text-black font-black p-3 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  {t}
                </motion.div>
              ))}
            </div>
          )}

          {activeScene.visualType === "molecule" && (
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="relative w-40 h-40 flex items-center justify-center"
            >
              <div className="w-10 h-10 bg-[#FFD9E0] border-2 border-black rounded-full absolute top-0 left-1/2 -translate-x-1/2" />
              <div className="w-10 h-10 bg-[#D3E2FF] border-2 border-black rounded-full absolute bottom-0 left-1/2 -translate-x-1/2" />
              <div className="w-10 h-10 bg-[#B6FF00] border-2 border-black rounded-full absolute left-0 top-1/2 -translate-y-1/2" />
              <div className="w-10 h-10 bg-[#FFB040] border-2 border-black rounded-full absolute right-0 top-1/2 -translate-y-1/2" />
            </motion.div>
          )}
        </div>

        {/* Scene Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="bg-black/80 border border-white/20 rounded-md px-2.5 py-1 text-[10px] font-black uppercase text-[#B6FF00]">
            Scene {currentSceneIndex + 1} of {video.scenes.length}
          </span>

          <span className="bg-black/80 border border-white/20 rounded-md px-2.5 py-1 text-[10px] font-mono font-bold text-stone-300">
            {Math.floor(currentTime)}s / {video.duration}s
          </span>
        </div>

        {/* Scene Overlay Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSceneIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="relative z-10 space-y-1 bg-black/75 p-3 rounded-xl border border-white/20 backdrop-blur-sm"
          >
            <h4 className="font-black text-sm uppercase text-[#B6FF00] leading-snug">
              {formatAIText(activeScene.headline)}
            </h4>
            <p className="text-xs font-bold text-stone-200 leading-relaxed">
              {formatAIText(activeScene.subtext)}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Video Progress Bar Scrubber */}
      <div className="space-y-1">
        <div className="h-2.5 w-full bg-stone-800 rounded-full overflow-hidden border border-black relative">
          <div
            className="h-full bg-[#B6FF00] transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Video Controls Bar */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 bg-[#B6FF00] text-black border-[2px] border-black rounded-xl flex items-center justify-center font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} className="fill-current ml-0.5" />}
          </button>

          <button
            onClick={handleReplay}
            className="w-10 h-10 bg-white text-black border-[2px] border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all"
            aria-label="Replay video"
          >
            <RotateRight01Icon size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveOffline}
            className={`px-3 py-2 border-[2px] border-black rounded-xl text-[11px] font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all ${
              isCached ? "bg-green-500 text-white" : "bg-[#FFB040] text-black"
            }`}
          >
            {isCached ? (
              <>
                <CheckmarkCircle02Icon size={14} />
                <span>Saved Offline</span>
              </>
            ) : (
              <>
                <Download01Icon size={14} />
                <span>Save Offline</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Key Takeaway */}
      <div className="bg-[#FAF7EC] text-black border-[2px] border-black rounded-xl p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#965A18] block">
          💡 Core Exam Summary
        </span>
        <p className="text-xs font-black text-black leading-snug">
          {formatAIText(video.keyTakeaway)}
        </p>
      </div>
    </div>
  );
}
