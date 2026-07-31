"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTutor } from "@/hooks/useTutor";
import SubjectPicker from "@/components/tutor/SubjectPicker";
import TutorMessage from "@/components/tutor/TutorMessage";
import AdaptivePacingBar from "@/components/tutor/AdaptivePacingBar";
import ConversationalChat from "@/components/tutor/ConversationalChat";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";
import {
  ArrowLeft01Icon,
  Mic01Icon,
  ArrowRight01Icon,
  Book01Icon,
  Comment01Icon,
} from "hugeicons-react";

export default function TutorPage() {
  const router = useRouter();
  const navItems = useNavItems();
  const [activeTab, setActiveTab] = useState<"study" | "conversational">("study");

  const {
    messages,
    isStreaming,
    performanceScore,
    sessionId,
    currentSubject,
    startSession,
    sendMessage,
    submitAnswer,
    playAudio,
  } = useTutor();

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-[#FAF7EC] flex flex-col text-black font-sans selection:bg-[#B6FF00]">
      {/* Top Header & 2-Tab Navigation */}
      <header className="bg-white border-b-[3.5px] border-black p-4 sticky top-0 z-40 flex flex-col gap-3 shadow-[0_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-10 h-10 bg-white border-[2.5px] border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center transition-transform"
              aria-label="Back to dashboard"
            >
              <ArrowLeft01Icon className="w-5 h-5 text-black" />
            </button>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A]">
                AI Learning Hub
              </h1>
              <p className="text-[11px] font-bold text-stone-600">
                {activeTab === "study"
                  ? currentSubject || "Select a subject to begin"
                  : "Conversational Madame Ticha"}
              </p>
            </div>
          </div>
        </div>

        {/* Neobrutalist 2-Tab Selector */}
        <div className="grid grid-cols-2 gap-2 bg-[#FAF7EC] p-1.5 border-[2.5px] border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <button
            onClick={() => setActiveTab("study")}
            className={`py-2 px-3 rounded-lg font-black text-xs uppercase flex items-center justify-center gap-2 transition-all ${
              activeTab === "study"
                ? "bg-[#B6FF00] border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black"
                : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <Book01Icon size={16} />
            <span>Subject AI Study</span>
          </button>

          <button
            onClick={() => setActiveTab("conversational")}
            className={`py-2 px-3 rounded-lg font-black text-xs uppercase flex items-center justify-center gap-2 transition-all ${
              activeTab === "conversational"
                ? "bg-[#FFB040] border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black"
                : "border-transparent text-stone-600 hover:text-black"
            }`}
          >
            <Comment01Icon size={16} />
            <span>Conversational AI</span>
          </button>
        </div>

        {activeTab === "study" && sessionId && (
          <AdaptivePacingBar score={performanceScore} />
        )}
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 w-full max-w-md mx-auto">
        {activeTab === "conversational" ? (
          <ConversationalChat />
        ) : !sessionId ? (
          <div className="p-4 pt-6 pb-28">
            <SubjectPicker onSelect={startSession} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 pb-32">
            <div className="max-w-md mx-auto space-y-4">
              {messages.map((msg) => (
                <TutorMessage
                  key={msg.id}
                  message={msg}
                  onPlayAudio={playAudio}
                  onSubmitAnswer={submitAnswer}
                />
              ))}

              {isStreaming && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white border-[3.5px] border-black rounded-2xl rounded-tl-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex gap-2 items-center">
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-75" />
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Floating Input bar for Subject Study */}
            <div className="fixed bottom-16 left-0 right-0 w-full max-w-md mx-auto bg-white border-t-[3.5px] border-black p-3 z-30 shadow-[0_-4px_0px_0px_rgba(0,0,0,1)]">
              <form onSubmit={handleSend} className="flex items-center gap-2.5 w-full">
                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask about ${currentSubject || "subject"}...`}
                    className="w-full min-h-[44px] bg-[#FAF7EC] border-[3px] border-black rounded-xl px-3.5 py-2.5 pr-11 text-xs md:text-sm font-bold text-black outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                  <button
                    type="button"
                    aria-label="Voice prompt"
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-stone-500 hover:text-black w-10 h-10 flex items-center justify-center rounded-lg active:scale-95"
                  >
                    <Mic01Icon size={18} />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || isStreaming}
                  aria-label="Send message"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] bg-[#B6FF00] border-[3px] border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center transition-transform disabled:opacity-50 shrink-0"
                >
                  <ArrowRight01Icon size={20} className="text-black" />
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <BottomNav items={navItems} />
    </div>
  );
}
