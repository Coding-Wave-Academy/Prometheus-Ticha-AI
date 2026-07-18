"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";

interface Message {
  id: string;
  sender: "user" | "ticha";
  content: string;
  timestamp: string;
}

export default function ChatPage() {
  const navItems = useNavItems();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Student profile metadata vectors
  const [vector, setVector] = useState<any>(null);
  const [studentName, setStudentName] = useState("Student");

  useEffect(() => {
    // Initial welcome message
    const savedName = localStorage.getItem("ticha_user_fullname") || "Student";
    setStudentName(savedName);

    const vectorStr = localStorage.getItem("ticha_user_profile_vector");
    let initialWelcome = `Hello ${savedName}! I am Ticha AI, your personalized study assistant. Ask me anything about your course outlines, schedule, or study questions!`;
    
    if (vectorStr) {
      const data = JSON.parse(vectorStr);
      setVector(data);
      if (data.struggles && data.struggles.length > 0) {
        initialWelcome = `Hello ${savedName}! I am Ticha AI, your personalized study assistant. I see you want to work on ${data.struggles.join(", ")} to achieve "${data.goal}". How can I help you today?`;
      }
    }

    setMessages([
      {
        id: "welcome",
        sender: "ticha",
        content: initialWelcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: "user",
      content: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const payload = {
        messages: [...messages, userMessage].map((m) => ({ sender: m.sender, content: m.content })),
        goal: vector?.goal || "excellence",
        education: vector?.education || "al",
        struggles: vector?.struggles || ["Physics"],
        name: studentName,
      };

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Tutor chat failed");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "ticha",
          content: data.reply || "I am here to support your exam preparation. Solve exercises daily!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "ticha",
          content: "Sorry, I had trouble parsing that. Please solve course exercises in the meantime!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7EC] pb-24 antialiased font-sans selection:bg-[#B6FF00]">
      {/* Outer Wrapper Container */}
      <main className="w-full max-w-md mx-auto p-4 flex flex-col h-[90vh] justify-between animate-page-in">
        
        {/* Header */}
        <header className="flex items-center justify-between w-full mb-4 py-2 flex-shrink-0">
          <Link
            href="/dashboard"
            className="w-11 h-11 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all"
            aria-label="Back to dashboard"
          >
            <svg className="w-6 h-6 stroke-[3.5px] text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          
          <div className="text-right">
            <span className="text-[10px] font-black uppercase text-[#965A18] tracking-widest block">
              AI Tutor Client
            </span>
            <h1 className="text-sm font-black text-black">
              Ticha Study Chat
            </h1>
          </div>
        </header>

        {/* Message Log Thread Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 mb-4 scrollbar-hidden">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div 
                key={msg.id}
                className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[80%] p-3.5 border-[2.5px] border-black rounded-2xl shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] text-left flex flex-col space-y-1 ${
                    isUser ? "bg-[#D3E2FF]" : "bg-white"
                  }`}
                >
                  <p className="text-xs font-bold text-black leading-snug break-words">
                    {msg.content}
                  </p>
                  <span className="text-[8px] font-extrabold uppercase text-stone-500 text-right self-end select-none">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* AI Typing Loading Indicator */}
          {isLoading && (
            <div className="flex w-full justify-start">
              <div className="bg-white p-3 border-[2.5px] border-black rounded-2xl shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Messaging Input Footer Bar */}
        <form 
          onSubmit={handleSend}
          className="flex gap-2 w-full flex-shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Ticha AI about limits, formulas..."
            className="flex-1 bg-white border-[2.5px] border-black rounded-xl p-3.5 text-xs font-bold focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[3px_3px_0px_0px_#000] outline-none transition-all placeholder-stone-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`w-12 h-12 border-[2.5px] border-black rounded-xl flex items-center justify-center transition-all ${
              inputText.trim() && !isLoading
                ? "bg-[#B6FF00] shadow-[2.5px_2.5px_0px_0px_#000] active:translate-x-px active:translate-y-px active:shadow-none"
                : "bg-[#E8E6DA] text-stone-400 border-stone-300"
            }`}
            aria-label="Send message"
          >
            <svg className="w-5 h-5 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>

      </main>

      {/* Bottom Navigation */}
      <BottomNav items={navItems} />
    </div>
  );
}
