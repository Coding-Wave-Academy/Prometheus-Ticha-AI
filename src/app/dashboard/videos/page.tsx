"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
} from "hugeicons-react";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";
import ConceptVideoPlayer, { ConceptVideo } from "@/components/videos/ConceptVideoPlayer";

const defaultConceptVideos: ConceptVideo[] = [
  {
    id: "vid-phys-1",
    subject: "Physics",
    topic: "Electromagnetism & Faraday's Law",
    duration: 20,
    scenes: [
      {
        timestamp: "0:05",
        headline: "Magnetic Field Lines in Motion",
        subtext: "When a magnet moves relative to a copper loop, magnetic field lines cross the conductor.",
        visualType: "particles",
        color: "#FFB040",
      },
      {
        timestamp: "0:10",
        headline: "Induced Electromotive Force (EMF)",
        subtext: "The changing magnetic flux pushes free electrons inside the wire to create a voltage difference.",
        visualType: "wave",
        color: "#B6FF00",
      },
      {
        timestamp: "0:15",
        headline: "Lenz's Law Opposing Current",
        subtext: "The direction of induced current creates a magnetic field opposing the initial change.",
        visualType: "graph",
        color: "#FFD9E0",
      },
      {
        timestamp: "0:20",
        headline: "Exam Formula Rule",
        subtext: "EMF is directly proportional to rate of change of magnetic flux linkage.",
        visualType: "particles",
        color: "#B6FF00",
      },
    ],
    keyTakeaway: "Changing magnetic flux linkages induce an EMF proportional to rate of change.",
  },
  {
    id: "vid-math-1",
    subject: "Pure Mathematics",
    topic: "Calculus Limits & Local Linearity",
    duration: 20,
    scenes: [
      {
        timestamp: "0:05",
        headline: "Curved Functions at Macro Scale",
        subtext: "A smooth continuous curve looks non-linear when viewed across a wide domain.",
        visualType: "graph",
        color: "#B6FF00",
      },
      {
        timestamp: "0:10",
        headline: "Infinite Zoom Effect",
        subtext: "As we zoom in closer to any single point on the curve, curvature disappears.",
        visualType: "wave",
        color: "#D3E2FF",
      },
      {
        timestamp: "0:15",
        headline: "Local Linearity & Tangents",
        subtext: "At an infinitely small delta x, any differentiable curve becomes a straight tangent line.",
        visualType: "graph",
        color: "#FFB040",
      },
      {
        timestamp: "0:20",
        headline: "Derivative Definition",
        subtext: "The derivative dy/dx measures instantaneous slope via limit processes.",
        visualType: "particles",
        color: "#B6FF00",
      },
    ],
    keyTakeaway: "Limits calculate instantaneous slope by examining local linearity at a single point.",
  },
  {
    id: "vid-ict-1",
    subject: "ICT & Computing",
    topic: "Database Normalization (1NF to 3NF)",
    duration: 20,
    scenes: [
      {
        timestamp: "0:05",
        headline: "Unnormalized Data Chaos",
        subtext: "Raw tables contain repeating groups, duplicate fields, and update anomalies.",
        visualType: "table",
        color: "#FFDF9E",
      },
      {
        timestamp: "0:10",
        headline: "First Normal Form (1NF)",
        subtext: "Ensures every table column contains atomic, indivisible values with unique primary keys.",
        visualType: "table",
        color: "#B6FF00",
      },
      {
        timestamp: "0:15",
        headline: "Second Normal Form (2NF)",
        subtext: "Removes partial dependencies: non-key attributes must depend on full primary key.",
        visualType: "table",
        color: "#D3E2FF",
      },
      {
        timestamp: "0:20",
        headline: "Third Normal Form (3NF)",
        subtext: "Eliminates transitive dependencies so attributes depend solely on key.",
        visualType: "table",
        color: "#FFB040",
      },
    ],
    keyTakeaway: "3NF ensures every attribute depends on the key, the whole key, and nothing but the key.",
  },
];

export default function VideosPage() {
  const navItems = useNavItems();
  const [videoList, setVideoList] = useState<ConceptVideo[]>(defaultConceptVideos);
  const [activeVideo, setActiveVideo] = useState<ConceptVideo | null>(defaultConceptVideos[0]);
  const [searchTopic, setSearchTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCustomVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTopic.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: "GCE Revision", topic: searchTopic }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.video) {
          setVideoList((prev) => [data.video, ...prev]);
          setActiveVideo(data.video);
        }
      }
    } catch (err) {
      console.error("Failed to generate video:", err);
    } finally {
      setIsGenerating(false);
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
                2D Concept Videos
              </h1>
              <p className="text-xs font-bold text-stone-600">
                Gemini 2D Animation • 100% Offline Ready
              </p>
            </div>
          </div>
        </header>

        {/* Generate Custom Concept Video Form */}
        <form onSubmit={handleGenerateCustomVideo} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTopic}
              onChange={(e) => setSearchTopic(e.target.value)}
              placeholder="Topic e.g. Quantum Tunneling..."
              className="w-full bg-white border-[3px] border-black rounded-xl p-3 pr-10 text-xs font-bold outline-none shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            />
            <Search01Icon size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500" />
          </div>
          <button
            type="submit"
            disabled={isGenerating || !searchTopic.trim()}
            className="bg-[#B6FF00] border-[3px] border-black rounded-xl px-4 py-2.5 font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all disabled:opacity-50 text-black shrink-0 flex items-center gap-1.5"
          >
            <SparklesIcon size={14} />
            <span>{isGenerating ? "Creating..." : "Generate"}</span>
          </button>
        </form>

        {/* Interactive 2D Concept Video Player */}
        {activeVideo && (
          <ConceptVideoPlayer
            video={activeVideo}
            onClose={() => setActiveVideo(null)}
          />
        )}

        {/* Video Library List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black uppercase tracking-wider text-stone-700">
              GCE Concept Library ({videoList.length})
            </h3>
            <span className="text-[10px] font-black uppercase text-green-700 flex items-center gap-1">
              <Wifi01Icon size={12} className="text-green-600" />
              100% Offline
            </span>
          </div>

          <div className="space-y-3">
            {videoList.map((vid) => (
              <div
                key={vid.id}
                onClick={() => setActiveVideo(vid)}
                className={`bg-white hover:bg-[#FAF7EC] border-[3.5px] border-black rounded-2xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:translate-x-px active:translate-y-px active:shadow-none transition-all flex items-center gap-4 ${
                  activeVideo?.id === vid.id ? "ring-2 ring-black bg-[#FAF7EC]" : ""
                }`}
              >
                <div className="w-12 h-12 bg-[#FFB040] border-[2.5px] border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                  {vid.subject === "Physics" ? (
                    <FlashIcon size={22} className="text-black" />
                  ) : vid.subject === "Pure Mathematics" ? (
                    <SquareIcon size={22} className="text-black" />
                  ) : (
                    <ComputerIcon size={22} className="text-black" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-stone-700 tracking-widest block">
                      {vid.subject}
                    </span>
                    <span className="text-[9px] font-extrabold bg-[#B6FF00] px-2 py-0.5 border border-black rounded text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      {vid.duration}s 2D
                    </span>
                  </div>
                  <h4 className="font-black text-sm text-black leading-tight truncate">
                    {vid.topic}
                  </h4>
                  <p className="text-[11px] font-bold text-stone-600 truncate">
                    {vid.keyTakeaway}
                  </p>
                </div>

                <div className="w-10 h-10 bg-[#B6FF00] border-[2px] border-black rounded-full flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] shrink-0">
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
