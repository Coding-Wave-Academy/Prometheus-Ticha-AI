"use client";

import React from "react";
import MentorCard from "./MentorCard";
import VideoCard from "./VideoCard";

interface SectionHeaderProps {
  title: string;
  linkText?: string;
  onLinkClick?: () => void;
}

const SectionHeader = ({ title, linkText, onLinkClick }: SectionHeaderProps) => (
  <div className="flex items-center justify-between mt-8 mb-4 w-full">
    <h3 className="text-xl font-black text-stone-950 uppercase tracking-tight pl-1">
      {title}
    </h3>
    {linkText && (
      <button
        onClick={onLinkClick}
        className="text-xs font-black uppercase tracking-wider text-[#965A18] hover:text-[#7A4711] flex items-center gap-1 group transition-colors"
      >
        <span>{linkText}</span>
        <svg
          className="w-3.5 h-3.5 stroke-[3px] group-hover:translate-x-0.5 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    )}
  </div>
);

/**
 * TertiaryTab — View displayed below the level tabs when education level is "tertiary".
 * Contains Degree Finder, Mentor Match, Video Guidance, and Progress components.
 */
export default function TertiaryTab() {
  const handleStartQuiz = () => {
    console.log("Starting career matchmaker quiz...");
  };

  const handleRequestChat = (name: string) => {
    console.log(`Requesting chat with mentor: ${name}`);
  };

  const handlePlayVideo = (title: string) => {
    console.log(`Playing video: ${title}`);
  };

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <section className="bg-[#B6FF00] p-6 rounded-2xl border-[3.5px] border-black mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <span className="bg-black text-[#B6FF00] text-[10px] font-black tracking-widest px-3 py-1 rounded-full border-[2px] border-black mb-3.5 inline-block shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] uppercase">
          Mission: The Bridge
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-stone-950 uppercase tracking-tight leading-none mb-3">
          Cross the Gap to Tertiary
        </h2>
        <p className="text-stone-900 text-sm font-medium leading-tight max-w-[240px] md:max-w-sm">
          Your path from O-Level/Probatoire to A-Level/Bac and University excellence starts here.
        </p>
        <svg
          className="w-32 h-32 absolute bottom-[-30px] right-[-30px] text-black/10 stroke-[2px] pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      </section>

      {/* Degree Finder */}
      <section className="w-full">
        <SectionHeader title="Degree Finder" linkText="View All" />

        {/* Career Matchmaker */}
        <div className="bg-[#FFE5C4] p-6 rounded-2xl border-[3.5px] border-black mb-5 flex items-center gap-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-black text-amber-950 mb-1">
              Career Matchmaker
            </h4>
            <p className="text-xs font-bold text-amber-800 leading-snug mb-4">
              AI-driven course selection based on your GCE performance.
            </p>
            <button
              onClick={handleStartQuiz}
              className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white px-4 py-2.5 rounded-lg font-black text-xs uppercase tracking-wider border-[2.5px] border-black shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none transition-all"
            >
              Start Quiz
            </button>
          </div>
          <div className="bg-white w-16 h-16 rounded-full border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
            <svg className="w-9 h-9 text-amber-955 stroke-[2.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3" />
            </svg>
          </div>
        </div>

        {/* Small Cards */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="bg-[#D3E2FF] p-5 rounded-xl border-[3px] border-black flex flex-col items-start gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="bg-white w-11 h-11 border-[2.5px] border-black rounded-full flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
              <svg className="w-6 h-6 text-black stroke-[2.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 019.232 5.847c-.895.23-1.78.502-2.657.813m-15.482 0L12 14.072l6.232-3.925m-1.208 8.213V16.5" />
              </svg>
            </div>
            <h4 className="text-base font-black text-indigo-950 leading-tight">
              A-Level Streams
            </h4>
          </div>
          <div className="bg-[#FFD9E0] p-5 rounded-xl border-[3px] border-black flex flex-col items-start gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="bg-white w-11 h-11 border-[2.5px] border-black rounded-full flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
              <svg className="w-6 h-6 text-black stroke-[2.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v1.242M14.25 3.104v1.242M3 19.5h18M18.75 19.5l-4.5-9.75v-3.75h-4.5v3.75l-4.5 9.75m13.5 0H5.25m13.5 0a2.25 2.25 0 00-2.25-2.25H7.5A2.25 2.25 0 005.25 19.5" />
              </svg>
            </div>
            <h4 className="text-base font-black text-lime-950 leading-tight">
              STEM Paths
            </h4>
          </div>
        </div>
      </section>

      {/* Mentor Match */}
      <section className="w-full">
        <SectionHeader title="Mentor Match" linkText="Find More" />
        <div className="flex gap-4 overflow-x-auto pb-3 w-full scrollbar-hidden">
          <MentorCard
            name="Amira N."
            university="University of Yaoundé I"
            levels="5 GCE A Levels"
            field="Engineering"
            image="/images/amira-n.png"
            onRequestChat={() => handleRequestChat("Amira N.")}
          />
          {/* Second card partially visible */}
          <div className="bg-stone-100 p-4 rounded-xl border-[3px] border-black opacity-50 flex-shrink-0 w-72 flex flex-col justify-between h-[166px]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-stone-300 border-[2.5px] border-black"></div>
              <div className="space-y-1.5 flex-1">
                <div className="h-3 bg-stone-300 rounded w-2/3"></div>
                <div className="h-2.5 bg-stone-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Guidance */}
      <section className="w-full">
        <SectionHeader title="Video Guidance" />
        <div className="space-y-5">
          <VideoCard
            title="How to transition from A-Level to University Life in Douala"
            channel="EDUCAMEROON TV"
            views="4.2K VIEWS"
            time="2 DAYS AGO"
            image=""
            duration="12:46"
            onPlay={() =>
              handlePlayVideo(
                "How to transition from A-Level to University Life in Douala"
              )
            }
          />
          <VideoCard
            title="The Ultimate GCE vs Bac guide: Which path for you?"
            channel="ACADEMIC HUB"
            views="12K VIEWS"
            time="1 WEEK AGO"
            image=""
            duration="08:20"
            onPlay={() =>
              handlePlayVideo("The Ultimate GCE vs Bac guide: Which path for you?")
            }
          />
        </div>
      </section>

      {/* Keep Building */}
      <section className="bg-white p-6 rounded-2xl border-[3.5px] border-black my-8 flex flex-col items-center text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="bg-white border-[3px] border-black p-3.5 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-4 flex items-center justify-center text-amber-500">
          <svg className="w-8 h-8 stroke-[2.5px] fill-current text-[#FFB040]" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>

        <h3 className="text-xl font-black text-stone-950 uppercase tracking-tight mb-2">
          Keep Building!
        </h3>
        <p className="text-stone-700 text-xs font-bold leading-snug mb-5 max-w-[240px]">
          You&apos;ve explored 3/5 bridge modules this week. Great progress!
        </p>

        {/* Progress Bar */}
        <div className="w-full h-3.5 bg-stone-100 rounded-full border-[2.5px] border-black overflow-hidden shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
          <div className="h-full bg-[#965A18] w-3/5 rounded-full border-r-[2px] border-black"></div>
        </div>

        <svg
          className="w-24 h-24 absolute bottom-[-20px] left-[-20px] text-stone-100 opacity-40 pointer-events-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 019.232 5.847c-.895.23-1.78.502-2.657.813m-15.482 0L12 14.072l6.232-3.925m-1.208 8.213V16.5" />
        </svg>
      </section>
    </div>
  );
}
