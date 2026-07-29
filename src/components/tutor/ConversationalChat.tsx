"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic01Icon,
  SparklesIcon,
  VolumeHighIcon,
  Wifi01Icon,
  WifiDisconnected01Icon,
  CheckmarkCircle02Icon,
} from "hugeicons-react";
import { useProfile } from "@/hooks/useProfile";
import { hapticTap, hapticSuccess } from "@/lib/haptics";
import { useStreak } from "@/hooks/useStreak";
import { formatAIText } from "@/lib/formatAIText";

type ConnectionStatus = "idle" | "connecting" | "connected" | "disconnected";
type AgentMode = "listening" | "speaking" | "thinking" | "idle";

interface TranscriptEntry {
  role: "user" | "agent";
  text: string;
  id: string;
}

export default function ConversationalChat() {
  const { profile } = useProfile();
  const { claimDailyStreak } = useStreak();
  const firstName = profile?.full_name?.split(" ")[0] || "Scholar";

  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [agentMode, setAgentMode] = useState<AgentMode>("idle");
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState<number[]>(Array(5).fill(0.3));

  const conversationRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const volumeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcripts
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcripts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (conversationRef.current) {
        try {
          conversationRef.current.endSession();
        } catch {
          // ignore
        }
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
      }
    };
  }, []);

  // Audio visualizer bars simulation
  useEffect(() => {
    if (agentMode === "listening" || agentMode === "speaking") {
      volumeIntervalRef.current = setInterval(() => {
        setVolume(
          Array(5)
            .fill(0)
            .map(() => 0.2 + Math.random() * 0.8)
        );
      }, 120);
    } else {
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
        volumeIntervalRef.current = null;
      }
      setVolume(Array(5).fill(0.3));
    }

    return () => {
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
      }
    };
  }, [agentMode]);

  // Dynamic voice fallback handler (Gemini + Web Speech)
  const speakText = useCallback((text: string) => {
    if (isMuted) return;
    setAgentMode("speaking");

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setAgentMode("idle");
      utterance.onerror = () => setAgentMode("idle");
      window.speechSynthesis.speak(utterance);
    } else {
      setAgentMode("idle");
    }
  }, [isMuted]);

  const processFallbackVoiceInput = useCallback(
    async (userQuestion: string) => {
      setAgentMode("thinking");
      hapticTap();

      setTranscripts((prev) => [
        ...prev,
        {
          role: "user",
          text: userQuestion,
          id: `user-${Date.now()}`,
        },
      ]);

      try {
        const res = await fetch("/api/ai/daily-lesson", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            struggles: [userQuestion],
            education: profile?.education_level || "ol",
          }),
        });

        let answer = "Remember: practice a small concept every day to get A grades!";

        if (res.ok) {
          const data = await res.json();
          if (data.lessons?.[0]?.bits?.[0]) {
            answer = data.lessons[0].bits.join(" ");
          } else if (data.lessons?.[0]?.keyTakeaway) {
            answer = data.lessons[0].keyTakeaway;
          }
        }

        const cleanAnswer = formatAIText(answer);

        setTranscripts((prev) => [
          ...prev,
          {
            role: "agent",
            text: cleanAnswer,
            id: `agent-${Date.now()}`,
          },
        ]);

        hapticSuccess();
        claimDailyStreak();
        speakText(cleanAnswer);
      } catch (err) {
        console.error("Voice response failed:", err);
        setAgentMode("idle");
      }
    },
    [claimDailyStreak, profile?.education_level, speakText]
  );

  const startListeningFallback = useCallback(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser mode. Tap starter prompts below!");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = profile?.preferred_language === "fr" ? "fr-FR" : "en-US";

      setAgentMode("listening");

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text?.trim()) {
          processFallbackVoiceInput(text);
        }
      };

      recognition.onend = () => {
        if (agentMode === "listening") setAgentMode("idle");
      };

      recognition.onerror = () => {
        setAgentMode("idle");
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch {
      setAgentMode("idle");
    }
  }, [agentMode, processFallbackVoiceInput, profile?.preferred_language]);

  const startConversation = useCallback(async () => {
    setStatus("connecting");
    hapticTap();

    try {
      // 1. Check signed URL backend API
      const res = await fetch("/api/elevenlabs/signed-url", {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.hasAgent && data.signed_url) {
          // Dynamic import ElevenLabs SDK
          const { Conversation } = await import("@elevenlabs/client");

          const conversation = await Conversation.startSession({
            signedUrl: data.signed_url,
            onConnect: ({ conversationId }) => {
              console.log("ElevenLabs connected:", conversationId);
              setStatus("connected");
              setAgentMode("idle");
              hapticSuccess();
            },
            onDisconnect: () => {
              setStatus("disconnected");
              setAgentMode("idle");
              claimDailyStreak();
            },
            onError: (msg: string) => {
              console.warn("ElevenLabs error, using voice fallback:", msg);
              setStatus("connected"); // seamless fallback
              setAgentMode("idle");
            },
            onModeChange: ({ mode }) => {
              setAgentMode(mode === "listening" ? "listening" : mode === "speaking" ? "speaking" : "idle");
            },
            onMessage: ({ source, message: text }) => {
              const role = source === "user" ? "user" : "agent";
              const formattedText = role === "agent" ? formatAIText(text) : text;
              if (text?.trim()) {
                setTranscripts((prev) => [
                  ...prev,
                  {
                    role,
                    text: formattedText,
                    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                  },
                ]);
              }
            },
          });

          conversationRef.current = conversation;
          return;
        }
      }

      // 2. Seamless Fallback to Gemini Voice Mode
      setStatus("connected");
      setAgentMode("idle");
      hapticSuccess();
    } catch {
      // Direct Fallback without displaying errors
      setStatus("connected");
      setAgentMode("idle");
    }
  }, [claimDailyStreak]);

  const endConversation = useCallback(async () => {
    hapticTap();
    if (conversationRef.current) {
      try {
        await conversationRef.current.endSession();
      } catch {
        // ignore
      }
      conversationRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setStatus("disconnected");
    setAgentMode("idle");
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
    if (conversationRef.current?.setVolume) {
      conversationRef.current.setVolume({ volume: isMuted ? 1 : 0 });
    }
  }, [isMuted]);

  const handleMicTap = () => {
    if (status !== "connected") {
      startConversation();
    } else {
      if (conversationRef.current) {
        // Connected to ElevenLabs SDK
      } else {
        // Fallback Voice Mode
        startListeningFallback();
      }
    }
  };

  const statusLabel =
    status === "idle"
      ? "Tap microphone to talk to Madame Ticha & Joe"
      : status === "connecting"
      ? "Connecting voice AI..."
      : status === "connected"
      ? agentMode === "listening"
        ? "🎙️ Listening to your question..."
        : agentMode === "speaking"
        ? "🔊 Speaking bite-sized answer..."
        : agentMode === "thinking"
        ? "🧠 Thinking bite-sized response..."
        : "✨ Ready — tap microphone & ask!"
      : "Disconnected — tap to reconnect";

  return (
    <div className="flex-1 flex flex-col w-full max-w-md mx-auto p-4 pb-28 space-y-5 animate-page-in">
      {/* Status Header Card */}
      <div className="bg-white border-[3.5px] border-black rounded-2xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
        <div className="flex items-center gap-3 text-left">
          <div className="w-12 h-12 rounded-full border-[2.5px] border-black overflow-hidden bg-[#FFB040] shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Image
              src="/images/madame-ticha.png"
              alt="Madame Ticha & Joe — AI Voice Tutor"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase text-black">
              Madame Ticha & Joe Voice AI
            </h3>
            <p className="text-[11px] font-bold text-stone-600">
              {statusLabel}
            </p>
          </div>
        </div>

        {/* Audio Visualizer Bars */}
        <div className="flex items-center gap-1.5 h-8 px-2 bg-[#FAF7EC] border-[2px] border-black rounded-xl">
          {volume.map((v, i) => (
            <motion.span
              key={i}
              animate={{ scaleY: v }}
              transition={{ duration: 0.1 }}
              className={`w-1.5 rounded-full h-6 origin-center ${
                agentMode === "listening"
                  ? "bg-red-500"
                  : agentMode === "speaking"
                  ? "bg-[#B6FF00]"
                  : "bg-stone-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Live Transcript Feed */}
      <div className="flex-1 space-y-3 min-h-[220px] max-h-[50vh] overflow-y-auto scrollbar-hidden">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-stone-700">
            Live Voice Transcript
          </span>
          {status === "connected" && (
            <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-green-700">
              <Wifi01Icon size={12} className="text-green-600" />
              LIVE
            </span>
          )}
        </div>

        {transcripts.length === 0 ? (
          <div className="bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-center space-y-3">
            <div className="w-14 h-14 mx-auto bg-[#FFB040] border-[3px] border-black rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-[4deg]">
              <SparklesIcon size={28} className="text-black" />
            </div>
            <h4 className="font-black text-base uppercase text-black">
              Interactive Voice AI Tutor
            </h4>
            <p className="text-xs font-bold text-stone-600 leading-relaxed max-w-[260px] mx-auto">
              Ask any GCE study question out loud! Madame Ticha and Joe explain concepts in simple, 1-sentence bite-sized bits.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {transcripts.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className={`flex ${
                  entry.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-3.5 border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left ${
                    entry.role === "user"
                      ? "bg-[#B6FF00] rounded-br-sm"
                      : "bg-white rounded-bl-sm"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-700">
                      {entry.role === "user" ? `${firstName}` : "Madame Ticha & Joe 🎙️"}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm font-bold text-black leading-relaxed">
                    {formatAIText(entry.text)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Thinking Indicator */}
        {agentMode === "thinking" && (
          <div className="flex justify-start">
            <div className="bg-white border-[3px] border-black rounded-2xl rounded-bl-sm p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
              <div className="w-2 h-2 bg-black rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-75" />
              <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-150" />
              <span className="text-xs font-black uppercase text-stone-700">
                Crafting bite-sized explanation...
              </span>
            </div>
          </div>
        )}

        <div ref={transcriptEndRef} />
      </div>

      {/* Starter Prompts */}
      <div className="space-y-2 text-left">
        <p className="text-[10px] font-black uppercase tracking-wider text-stone-600">
          Tap a Quick Voice Question:
        </p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1">
          {[
            "Explain Faraday's Law simply!",
            "Give me a calculus limits trick!",
            "How do I normalize a database?",
            "Tips for GCE Physics Paper 2?",
          ].map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (status !== "connected") setStatus("connected");
                processFallbackVoiceInput(p);
              }}
              className="bg-white border-[2.5px] border-black rounded-full py-1.5 px-3 font-bold text-[11px] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none whitespace-nowrap shrink-0 hover:bg-[#FAF7EC] transition-all"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      {status === "connected" && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={toggleMute}
            className={`py-2 px-4 border-[2.5px] border-black rounded-full font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all ${
              isMuted
                ? "bg-[#FF9494] text-black"
                : "bg-white text-black hover:bg-stone-50"
            }`}
          >
            {isMuted ? "🔇 Unmute Voice" : "🔊 Mute Voice"}
          </button>

          <button
            onClick={endConversation}
            className="py-2 px-4 bg-red-500 text-white border-[2.5px] border-black rounded-full font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all"
          >
            End Call
          </button>
        </div>
      )}

      {/* BIG Neobrutalist Tap-to-Speak Button */}
      <div className="flex flex-col items-center justify-center pt-1">
        <motion.button
          whileTap={{ scale: 0.92 }}
          animate={
            agentMode === "listening"
              ? { scale: [1, 1.08, 1] }
              : agentMode === "speaking"
              ? { scale: [1, 1.04, 1] }
              : {}
          }
          transition={{ duration: 1, repeat: Infinity }}
          onClick={handleMicTap}
          disabled={status === "connecting"}
          className={`w-24 h-24 rounded-full border-[4px] border-black flex flex-col items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all ${
            status === "connecting"
              ? "bg-stone-300 text-stone-600"
              : agentMode === "listening"
              ? "bg-red-500 text-white shadow-none translate-x-[2px] translate-y-[2px]"
              : agentMode === "speaking"
              ? "bg-[#FFB040] text-black"
              : "bg-[#B6FF00] text-black hover:bg-[#a3e600]"
          }`}
          aria-label="Tap to speak with Voice AI"
        >
          <Mic01Icon
            size={36}
            className={agentMode === "listening" ? "animate-pulse text-white" : "text-black"}
          />
          <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">
            {status === "connecting"
              ? "Connecting"
              : agentMode === "listening"
              ? "Listening"
              : agentMode === "speaking"
              ? "Speaking"
              : status === "connected"
              ? "Tap to Speak"
              : "Start Voice"}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
