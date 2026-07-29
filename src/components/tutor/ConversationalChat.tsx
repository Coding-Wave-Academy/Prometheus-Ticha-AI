"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic01Icon,
  VolumeHighIcon,
  SparklesIcon,
  ArrowRight01Icon,
  RefreshIcon,
  CheckmarkCircle02Icon,
} from "hugeicons-react";
import { useProfile } from "@/hooks/useProfile";
import { hapticTap, hapticSuccess } from "@/lib/haptics";

interface MicroChunk {
  id: string;
  step: number;
  text: string;
}

const starterPrompts = [
  "How do I study for Physics Paper 2?",
  "Give me a calculus limits trick!",
  "How to create a GCE study timetable?",
  "Explain quantum physics simply!",
];

export default function ConversationalChat() {
  const { profile } = useProfile();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chunks, setChunks] = useState<MicroChunk[]>([
    {
      id: "chunk-0",
      step: 1,
      text: `Hi ${profile?.full_name?.split(" ")[0] || "Scholar"}! 👋 Tap the microphone below to talk to Madame Ticha!`,
    },
  ]);
  const [textInput, setTextInput] = useState("");

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = profile?.preferred_language === "fr" ? "fr-FR" : "en-US";

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = (err: any) => {
          console.warn("Speech recognition error:", err);
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [profile?.preferred_language]);

  const toggleListening = () => {
    hapticTap();
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported on this browser. You can type below!");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (transcript.trim()) {
        processQuestion(transcript);
      }
    } else {
      setTranscript("");
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Recognition start error:", err);
      }
    }
  };

  const processQuestion = async (userPrompt: string) => {
    if (!userPrompt.trim()) return;
    setIsThinking(true);

    try {
      const prompt = `
        You are Madame Ticha, a loving Cameroonian GCE teacher explaining concepts to a 5-year-old student.
        Question: "${userPrompt}"

        CRITICAL INSTRUCTIONS:
        1. Break your answer into 3 to 4 very short, simple, bite-sized bullet chunks.
        2. Use extremely simple words like you are talking to a 5-year-old child.
        3. No long paragraphs! Each chunk must be only 1 or 2 short sentences max.
        4. Separate each chunk with "---" on a new line.
      `;

      const res = await fetch("/api/ai/intel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: "Explain simple micro chunks",
          education: profile?.education_level || "ol",
          struggles: [userPrompt],
        }),
      });

      let rawChunks: string[] = [];

      if (res.ok) {
        const data = await res.json();
        if (data.intel) {
          rawChunks = [
            `💡 ${data.intel.bigIdea?.text || userPrompt}`,
            `📖 ${data.intel.story?.text || "Let's learn together!"}`,
            `✨ ${data.intel.reality?.text || "Practice makes perfect!"}`,
            `⭐ ${data.intel.proTip?.text || "You can do this!"}`,
          ];
        }
      }

      if (rawChunks.length === 0) {
        rawChunks = [
          `💡 Great question! Let's break it down simply.`,
          `📖 Imagine you have 3 study blocks every day.`,
          `✨ Focus on 1 topic at a time without rushing!`,
          `⭐ Review past papers to get A grades!`,
        ];
      }

      const formattedChunks: MicroChunk[] = rawChunks.map((text, idx) => ({
        id: `chunk-${Date.now()}-${idx}`,
        step: idx + 1,
        text,
      }));

      setChunks(formattedChunks);
      hapticSuccess();

      // Speak the first chunk aloud
      speakText(formattedChunks.map((c) => c.text).join(" "));
    } catch (err) {
      console.error("Failed to fetch micro chunks:", err);
      setChunks([
        {
          id: `err-${Date.now()}`,
          step: 1,
          text: "💡 Don't worry! Practice a little bit every day and ask Ticha AI any question!",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const speakText = (text: string) => {
    setIsSpeaking(true);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower child-friendly pace
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between w-full max-w-md mx-auto p-4 pb-28 text-center space-y-6 animate-page-in">
      {/* Top Visualizer Status Header */}
      <div className="bg-white border-[3.5px] border-black rounded-2xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
        <div className="flex items-center gap-3 text-left">
          <div className="w-12 h-12 rounded-full border-[2.5px] border-black overflow-hidden bg-[#B6FF00] shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Image
              src="/images/madame-ticha.png"
              alt="Madame Ticha"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase text-black">Madame Ticha Voice AI</h3>
            <p className="text-[11px] font-bold text-stone-600">
              {isListening
                ? "🎙️ Listening to you..."
                : isThinking
                ? "🧠 Thinking simple answer..."
                : isSpeaking
                ? "🔊 Speaking micro chunks..."
                : "✨ Ready! Tap microphone below"}
            </p>
          </div>
        </div>

        {/* Dynamic Sound Wave Bars Visualizer */}
        <div className="flex items-center gap-1.5 h-8 px-2 bg-[#FAF7EC] border-[2px] border-black rounded-xl">
          {[0.4, 0.9, 0.6, 1, 0.5].map((scale, i) => (
            <motion.span
              key={i}
              animate={{
                scaleY: isListening || isSpeaking ? [0.3, scale * 1.5, 0.3] : 0.3,
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.1,
              }}
              className={`w-1.5 rounded-full ${
                isListening
                  ? "bg-red-500"
                  : isSpeaking
                  ? "bg-[#B6FF00]"
                  : "bg-stone-400"
              } h-6 origin-center`}
            />
          ))}
        </div>
      </div>

      {/* Live Speech Transcriber Box */}
      <div className="w-full bg-[#FAF7EC] border-[3px] border-black rounded-2xl p-3.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-left min-h-[56px] flex items-center gap-2">
        <SparklesIcon size={20} className="text-amber-600 shrink-0" />
        <p className="text-xs font-bold text-black flex-1 italic">
          {transcript || textInput || (isListening ? "Say your question out loud..." : "Your spoken question will appear here...")}
        </p>
        {(transcript || textInput) && (
          <button
            onClick={() => {
              const q = transcript || textInput;
              setTranscript("");
              setTextInput("");
              processQuestion(q);
            }}
            className="bg-[#B6FF00] border-[2px] border-black rounded-lg p-1.5 font-black text-xs text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all shrink-0"
          >
            Ask ➔
          </button>
        )}
      </div>

      {/* Micro-Chunked Bite-Sized Response Cards */}
      <div className="space-y-3 text-left">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-stone-700">
            Micro-Bite Explanations (5-Year-Old Level)
          </span>
          {chunks.length > 0 && (
            <button
              onClick={() => speakText(chunks.map((c) => c.text).join(" "))}
              className="text-[11px] font-extrabold uppercase text-black underline flex items-center gap-1"
            >
              <VolumeHighIcon size={14} className="text-amber-600" />
              Listen All
            </button>
          )}
        </div>

        <AnimatePresence mode="popLayout">
          {chunks.map((chunk) => (
            <motion.div
              key={chunk.id}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="bg-white border-[3.5px] border-black rounded-2xl p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3 relative"
            >
              <div className="w-8 h-8 rounded-xl bg-[#B6FF00] border-[2.5px] border-black flex items-center justify-center font-black text-xs shrink-0 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                #{chunk.step}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs md:text-sm font-bold text-black leading-relaxed">
                  {chunk.text}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Starter Prompts */}
      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-wider text-stone-600 text-left">
          Tap a Quick Voice Question:
        </p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1">
          {starterPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTranscript(p);
                processQuestion(p);
              }}
              className="bg-white border-[2.5px] border-black rounded-full py-1.5 px-3 font-bold text-[11px] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none whitespace-nowrap shrink-0 hover:bg-[#FAF7EC] transition-all"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* BIG Neobrutalist Tap-to-Speak Microphone Button */}
      <div className="pt-2 flex flex-col items-center justify-center">
        <motion.button
          whileTap={{ scale: 0.92 }}
          animate={
            isListening
              ? { scale: [1, 1.08, 1], boxShadow: "0px 0px 20px rgba(255, 0, 0, 0.6)" }
              : {}
          }
          transition={{ duration: 1, repeat: Infinity }}
          onClick={toggleListening}
          className={`w-24 h-24 rounded-full border-[4px] border-black flex flex-col items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all ${
            isListening
              ? "bg-red-500 text-white shadow-none translate-x-[2px] translate-y-[2px]"
              : "bg-[#B6FF00] text-black hover:bg-[#a3e600]"
          }`}
          aria-label={isListening ? "Stop listening" : "Tap to speak"}
        >
          <Mic01Icon size={36} className={isListening ? "animate-pulse text-white" : "text-black"} />
          <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">
            {isListening ? "Stop" : "Tap to Speak"}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
