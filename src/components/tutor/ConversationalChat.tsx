"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Mic01Icon,
  ArrowRight01Icon,
  VolumeHighIcon,
  SparklesIcon,
  Chat01Icon,
} from "hugeicons-react";
import { useProfile } from "@/hooks/useProfile";
import { hapticTap } from "@/lib/haptics";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const promptPills = [
  { label: "📝 GCE Study Timetable", prompt: "Help me create a high-yield 4-week GCE study timetable." },
  { label: "⚡ Physics Memory Trick", prompt: "Give me a quick memorable trick to remember Electromagnetism formulas." },
  { label: "🎯 Paper 2 Exam Strategy", prompt: "What is the best way to tackle section B questions in GCE Paper 2?" },
  { label: "🧠 Fast Math Formula Tip", prompt: "Explain how to solve quadratic equations using the completing the square method simply." },
];

export default function ConversationalChat() {
  const { profile } = useProfile();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: `Hello ${profile?.full_name?.split(" ")[0] || "Scholar"}! 👋 I am Madame Ticha, your personal AI Chat Assistant. Ask me anything about your GCE subjects, study strategies, homework questions, or exam tips!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleSendText = async (textToSend: string) => {
    if (!textToSend.trim() || isStreaming) return;
    hapticTap();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    const assistantMsgId = `assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    try {
      const history = messages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const res = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "conv-session",
          message: textToSend,
          subject: "Conversational GCE Assistant",
          educationLevel: profile?.education_level || "al",
          performanceScore: 0.5,
          history,
        }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullResponse = "";
      let buffer = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.replace("data: ", "").trim();
              if (dataStr === "[DONE]") continue;
              try {
                const data = JSON.parse(dataStr);
                if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                  const chunk = data.candidates[0].content.parts[0].text;
                  // Clean markers if present
                  const cleanChunk = chunk.replace(/\[LESSON\]|\[EXERCISE\]|\[FEEDBACK\]/g, "");
                  fullResponse += cleanChunk;
                  setMessages((prev) =>
                    prev.map((m) => (m.id === assistantMsgId ? { ...m, content: fullResponse } : m))
                  );
                }
              } catch {
                // Ignore chunk parse errors
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("Conversational chat error:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? { ...m, content: "Sorry, I had trouble answering that. Please try asking again!" }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const playAudio = async (msgId: string, text: string) => {
    try {
      setPlayingAudioId(msgId);
      const res = await fetch("/api/tutor/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed to fetch audio");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play();
      audio.onended = () => setPlayingAudioId(null);
    } catch (err) {
      console.error("Audio error:", err);
      setPlayingAudioId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between w-full max-w-md mx-auto relative pb-28">
      
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[85%] p-4 border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative space-y-2 ${
                msg.role === "user"
                  ? "bg-[#B6FF00] rounded-tr-sm text-black"
                  : "bg-white rounded-tl-sm text-black"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex items-center justify-between border-b-[2px] border-black pb-1.5 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border-[1.5px] border-black overflow-hidden bg-[#B6FF00] shrink-0">
                      <Image
                        src="/images/madame-ticha.png"
                        alt="Madame Ticha"
                        width={24}
                        height={24}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-black">
                      Madame Ticha
                    </span>
                  </div>
                  {msg.content && (
                    <button
                      onClick={() => playAudio(msg.id, msg.content)}
                      className="p-1 hover:bg-stone-100 rounded-md transition-colors"
                      aria-label="Listen to message audio"
                    >
                      <VolumeHighIcon
                        size={16}
                        className={playingAudioId === msg.id ? "text-amber-600 animate-bounce" : "text-black"}
                      />
                    </button>
                  )}
                </div>
              )}

              <p className="text-xs md:text-sm font-medium leading-relaxed whitespace-pre-wrap">
                {msg.content || (
                  <span className="inline-flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce delay-75" />
                    <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce delay-150" />
                  </span>
                )}
              </p>

              <span className="block text-[9px] font-bold text-stone-500 text-right pt-0.5">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Starter Quick Prompt Pills */}
      {messages.length < 3 && (
        <div className="px-4 pb-2">
          <p className="text-[10px] font-black uppercase tracking-wider text-stone-600 mb-2 flex items-center gap-1">
            <SparklesIcon size={12} className="text-amber-600" />
            <span>Quick Conversation Starters</span>
          </p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1">
            {promptPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleSendText(pill.prompt)}
                className="bg-white border-[2px] border-black rounded-full py-1.5 px-3 font-bold text-[11px] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none whitespace-nowrap shrink-0 hover:bg-[#FAF7EC] transition-all"
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Bottom Input */}
      <div className="fixed bottom-16 left-0 right-0 w-full max-w-md mx-auto bg-white border-t-[3.5px] border-black p-3 z-30 shadow-[0_-4px_0px_0px_rgba(0,0,0,1)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendText(input);
          }}
          className="flex items-center gap-2"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Madame Ticha anything..."
              className="w-full bg-[#FAF7EC] border-[3px] border-black rounded-xl p-3 pr-10 text-xs md:text-sm font-medium outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-black"
            >
              <Mic01Icon size={18} />
            </button>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="w-11 h-11 bg-[#B6FF00] border-[3px] border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center transition-transform disabled:opacity-50 shrink-0"
          >
            <ArrowRight01Icon size={20} className="text-black" />
          </button>
        </form>
      </div>

    </div>
  );
}
