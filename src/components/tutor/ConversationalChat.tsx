"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic01Icon,
  StopIcon,
  SparklesIcon,
  VolumeHighIcon,
  Wifi01Icon,
  WifiDisconnected01Icon,
} from "hugeicons-react";
import { useProfile } from "@/hooks/useProfile";
import { hapticTap, hapticSuccess } from "@/lib/haptics";
import { useStreak } from "@/hooks/useStreak";

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
  const [error, setError] = useState<string | null>(null);

  const conversationRef = useRef<any>(null);
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
          // already ended
        }
      }
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
      }
    };
  }, []);

  // Simulate dynamic audio visualizer bars
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

  const startConversation = useCallback(async () => {
    setError(null);
    setStatus("connecting");
    hapticTap();

    try {
      // Dynamically import the SDK to avoid SSR issues
      const { Conversation } = await import("@elevenlabs/client");

      // Get signed URL from our backend
      const res = await fetch("/api/elevenlabs/signed-url", {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to get signed URL");
      }

      const { signed_url } = await res.json();

      // Start ElevenLabs Conversational AI session
      const conversation = await Conversation.startSession({
        signedUrl: signed_url,
        onConnect: ({ conversationId }) => {
          console.log("ElevenLabs connected:", conversationId);
          setStatus("connected");
          setAgentMode("idle");
          hapticSuccess();
        },
        onDisconnect: () => {
          setStatus("disconnected");
          setAgentMode("idle");
          // Auto-claim daily streak after a completed conversation
          claimDailyStreak();
        },
        onError: (message: string) => {
          console.error("ElevenLabs Conversation error:", message);
          setError(message || "Connection error");
        },
        onModeChange: ({ mode }) => {
          // mode is "listening" | "speaking"
          if (mode === "listening") {
            setAgentMode("listening");
          } else if (mode === "speaking") {
            setAgentMode("speaking");
          } else {
            setAgentMode("idle");
          }
        },
        onMessage: ({ source, message: text }) => {
          const role = source === "user" ? "user" : "agent";
          if (text?.trim()) {
            setTranscripts((prev) => [
              ...prev,
              {
                role,
                text,
                id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              },
            ]);
          }
        },
      });

      conversationRef.current = conversation;
    } catch (err: any) {
      console.error("Failed to start conversation:", err);
      setError(err.message || "Failed to connect to AI voice agent");
      setStatus("disconnected");
    }
  }, [claimDailyStreak]);

  const endConversation = useCallback(async () => {
    hapticTap();
    if (conversationRef.current) {
      try {
        await conversationRef.current.endSession();
      } catch {
        // already ended
      }
      conversationRef.current = null;
    }
    setStatus("disconnected");
    setAgentMode("idle");
  }, []);

  const toggleMute = useCallback(() => {
    if (conversationRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      // The SDK mute API
      if (conversationRef.current.setVolume) {
        conversationRef.current.setVolume({ volume: newMuted ? 0 : 1 });
      }
    }
  }, [isMuted]);

  const statusLabel =
    status === "idle"
      ? "Tap below to talk with Joe"
      : status === "connecting"
      ? "Connecting to Joe..."
      : status === "connected"
      ? agentMode === "listening"
        ? "🎙️ Joe is listening..."
        : agentMode === "speaking"
        ? "🔊 Joe is speaking..."
        : "✨ Joe is ready — speak!"
      : "Disconnected — tap to reconnect";

  return (
    <div className="flex-1 flex flex-col w-full max-w-md mx-auto p-4 pb-28 space-y-5 animate-page-in">
      {/* Status Header Card */}
      <div className="bg-white border-[3.5px] border-black rounded-2xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
        <div className="flex items-center gap-3 text-left">
          <div className="w-12 h-12 rounded-full border-[2.5px] border-black overflow-hidden bg-[#FFB040] shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Image
              src="/images/madame-ticha.png"
              alt="Joe — AI Voice Tutor"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase text-black">
              Joe — Voice AI Tutor
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

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#FF9494] border-[2.5px] border-black rounded-xl p-3 font-bold text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Transcript Feed */}
      <div className="flex-1 space-y-3 min-h-[200px] max-h-[50vh] overflow-y-auto scrollbar-hidden">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-stone-700">
            Live Conversation Transcript
          </span>
          {status === "connected" && (
            <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-green-700">
              <Wifi01Icon size={12} className="text-green-600" />
              LIVE
            </span>
          )}
        </div>

        {transcripts.length === 0 && status !== "connected" ? (
          <div className="bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-[#FFB040] border-[3px] border-black rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-[4deg]">
              <SparklesIcon size={32} className="text-black" />
            </div>
            <h4 className="font-black text-base uppercase text-black">
              Meet Joe, Your AI Tutor
            </h4>
            <p className="text-xs font-bold text-stone-600 leading-relaxed max-w-[260px] mx-auto">
              Joe speaks with an African accent and explains GCE subjects in
              simple, child-friendly language. Tap the microphone below to start
              a live voice conversation!
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
                  className={`max-w-[85%] p-3.5 border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                    entry.role === "user"
                      ? "bg-[#B6FF00] rounded-br-sm"
                      : "bg-white rounded-bl-sm"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-700">
                      {entry.role === "user" ? `${firstName}` : "Joe 🎙️"}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm font-bold text-black leading-relaxed">
                    {entry.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Thinking indicator */}
        {agentMode === "speaking" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white border-[3px] border-black rounded-2xl rounded-bl-sm p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
              <VolumeHighIcon size={16} className="text-amber-600 animate-pulse" />
              <span className="text-[11px] font-black uppercase text-stone-600">
                Joe is speaking...
              </span>
            </div>
          </motion.div>
        )}

        <div ref={transcriptEndRef} />
      </div>

      {/* Controls: Mute + Connection Status */}
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
            {isMuted ? "🔇 Unmute Joe" : "🔊 Mute Joe"}
          </button>

          <button
            onClick={endConversation}
            className="py-2 px-4 bg-red-500 text-white border-[2.5px] border-black rounded-full font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all"
          >
            End Call
          </button>
        </div>
      )}

      {/* BIG Neobrutalist Tap-to-Speak / Stop Button */}
      <div className="flex flex-col items-center justify-center pt-2">
        {status === "connected" ? (
          <motion.div
            animate={{
              scale:
                agentMode === "listening"
                  ? [1, 1.06, 1]
                  : agentMode === "speaking"
                  ? [1, 1.03, 1]
                  : 1,
            }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className={`w-24 h-24 rounded-full border-[4px] border-black flex flex-col items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all ${
              agentMode === "listening"
                ? "bg-red-500 text-white shadow-none translate-x-[2px] translate-y-[2px]"
                : agentMode === "speaking"
                ? "bg-[#FFB040] text-black"
                : "bg-[#B6FF00] text-black"
            }`}
          >
            {agentMode === "listening" ? (
              <Mic01Icon size={36} className="animate-pulse text-white" />
            ) : agentMode === "speaking" ? (
              <VolumeHighIcon size={36} className="text-black" />
            ) : (
              <Mic01Icon size={36} className="text-black" />
            )}
            <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">
              {agentMode === "listening"
                ? "Listening"
                : agentMode === "speaking"
                ? "Speaking"
                : "Ready"}
            </span>
          </motion.div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={status === "connecting" ? undefined : startConversation}
            disabled={status === "connecting"}
            className={`w-24 h-24 rounded-full border-[4px] border-black flex flex-col items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all ${
              status === "connecting"
                ? "bg-stone-300 text-stone-600 cursor-wait"
                : "bg-[#B6FF00] text-black hover:bg-[#a3e600]"
            }`}
            aria-label="Start conversation with Joe"
          >
            {status === "connecting" ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Wifi01Icon size={32} className="text-stone-600" />
                </motion.div>
                <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">
                  Connecting
                </span>
              </>
            ) : status === "disconnected" ? (
              <>
                <WifiDisconnected01Icon size={32} className="text-black" />
                <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">
                  Reconnect
                </span>
              </>
            ) : (
              <>
                <Mic01Icon size={36} className="text-black" />
                <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">
                  Talk to Joe
                </span>
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
}
