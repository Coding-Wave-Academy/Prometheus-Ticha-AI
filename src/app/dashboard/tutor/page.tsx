"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTutor } from '@/hooks/useTutor';
import SubjectPicker from '@/components/tutor/SubjectPicker';
import TutorMessage from '@/components/tutor/TutorMessage';
import AdaptivePacingBar from '@/components/tutor/AdaptivePacingBar';
import { ArrowLeft01Icon, Mic01Icon, ArrowRight01Icon } from 'hugeicons-react';

export default function TutorPage() {
  const router = useRouter();
  const {
    messages,
    isStreaming,
    performanceScore,
    sessionId,
    currentSubject,
    startSession,
    sendMessage,
    submitAnswer,
    playAudio
  } = useTutor();

  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput('');
  };

  if (!sessionId) {
    return (
      <main className="min-h-screen bg-[#FAF7EC] pt-6 pb-20">
        <header className="px-4 mb-8 flex items-center">
          <button 
            onClick={() => router.back()}
            className="w-11 h-11 bg-white border-[3.5px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center transition-transform"
          >
            <ArrowLeft01Icon className="w-6 h-6 text-black" />
          </button>
          <h1 className="ml-4 text-xl font-black uppercase tracking-tight">AI Tutor</h1>
        </header>
        <SubjectPicker onSelect={startSession} />
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] flex flex-col bg-[#FAF7EC]">
      <header className="bg-white border-b-[3.5px] border-black p-4 sticky top-0 z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.location.reload()} // Quick way to exit session
              className="w-10 h-10 bg-white border-[2.5px] border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center transition-transform"
            >
              <ArrowLeft01Icon className="w-5 h-5 text-black" />
            </button>
            <h1 className="text-lg font-black uppercase tracking-tight">{currentSubject}</h1>
          </div>
        </div>
        <AdaptivePacingBar score={performanceScore} />
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="max-w-md mx-auto">
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
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-[3.5px] border-black p-4 z-20 pb-safe">
        <form onSubmit={handleSend} className="max-w-md mx-auto flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="w-full bg-[#FAF7EC] border-[3.5px] border-black rounded-xl p-3 pr-12 min-h-[52px] max-h-32 resize-none font-medium focus:outline-none focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
            <button
              type="button"
              className="absolute right-3 bottom-3 text-stone-500 hover:text-black transition-colors"
            >
              <Mic01Icon className="w-6 h-6" />
            </button>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="w-[52px] h-[52px] bg-[#B6FF00] border-[3.5px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center transition-transform disabled:opacity-50 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0"
          >
            <ArrowRight01Icon className="w-6 h-6 text-black" />
          </button>
        </form>
      </div>
    </main>
  );
}
