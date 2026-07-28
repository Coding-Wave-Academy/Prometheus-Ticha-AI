"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/lib/i18n";

interface IntelData {
  bigIdea: { text: string; label: string };
  story: { text: string };
  reality: { text: string };
  whyItMatters: {
    bullets: string[];
    ahaMoment: string;
  };
  proTip: { text: string };
}

export default function ExamIntelPage() {
  const router = useRouter();
  const [intel, setIntel] = useState<IntelData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIntel = async () => {
      try {
        const goal = localStorage.getItem("ticha_onboarding_goal") || "gce";
        const education = localStorage.getItem("ticha_onboarding_education") || "al";
        const strugglesStr = localStorage.getItem("ticha_onboarding_struggles") || "[]";
        const struggles = JSON.parse(strugglesStr);

        const res = await fetch("/api/ai/intel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ goal, education, struggles }),
        });
        if (!res.ok) throw new Error("API call failed");

        const data = await res.json();
        setIntel(data.intel);
      } catch (err) {
        console.error("Failed to load exam intel from AI", err);
        setIntel({
          bigIdea: {
            text: "Particles can pass through barriers that should be impossible to cross. Not magic. Just quantum physics.",
            label: "Mind = blown!",
          },
          story: {
            text: "Imagine a tiny ball rolling toward a hill. It doesn't have enough energy to climb over it. Classically, it stops.",
          },
          reality: {
            text: "In quantum physics, the ball has a small chance of popping through the hill instead of stopping. It tunnels through.",
          },
          whyItMatters: {
            bullets: [
              "Powers electronics (like your phone)",
              "Helps stars shine and cells function",
              "The basis of quantum computers",
            ],
            ahaMoment: "So, particles aren't just following the rules—they're rewriting them.",
          },
          proTip: {
            text: "90% of students miss this mark on the wavefunction. Don't be that student!",
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchIntel();
  }, []);

  const handleBack = () => {
    router.push("/getting-started/struggles");
  };

  const handleContinue = () => {
    const goal = localStorage.getItem("ticha_onboarding_goal") || "gce";
    const education = localStorage.getItem("ticha_onboarding_education") || "al";
    const strugglesStr = localStorage.getItem("ticha_onboarding_struggles") || "[]";
    const struggles = JSON.parse(strugglesStr);

    const vectorData = {
      goal,
      education,
      struggles,
      intel,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("ticha_user_profile_vector", JSON.stringify(vectorData));
    localStorage.setItem("ticha_profile_completed", "true");

    router.push("/register");
  };

  return (
    <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center p-4 antialiased font-sans selection:bg-[#B6FF00]">
      <main className="w-full max-w-md min-h-[85vh] flex flex-col justify-between py-6 px-6 text-black items-center space-y-6 animate-page-in">
        
        <header className="flex items-center gap-4 w-full">
          <button
            onClick={handleBack}
            className="w-11 h-11 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all shrink-0"
            aria-label="Go back"
          >
            <svg className="w-6 h-6 stroke-[3.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>

          <div className="flex gap-1.5 w-full items-center">
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1"></div>
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1"></div>
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1"></div>
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1"></div>
            <div className="h-2 bg-[#4A6700] border-[1.5px] border-black rounded-full flex-1"></div>
          </div>
        </header>

        <div className="text-left w-full space-y-2 px-1">
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">
            Your Personalized Exam Intel
          </h1>
          <p className="text-[14px] text-stone-600 font-bold leading-tight">
            Based on your goals and challenges, here&apos;s what the data says.
          </p>
        </div>

        <div className="space-y-6 w-full">
          {isLoading || !intel ? (
            <div className="w-full bg-white border-[3.5px] border-black rounded-2xl p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 border-[4.5px] border-black border-t-[#FFB040] rounded-full animate-spin"></div>
              <p className="text-sm font-black uppercase tracking-wider text-black">
                Synthesizing Custom Intel...
              </p>
            </div>
          ) : (
            <>
              {/* Card 1: THE BIG IDEA */}
              <section className="bg-[#FFD9E0] border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col gap-4">
                <div className="flex items-center gap-1.5 font-black text-sm uppercase text-black">
                  <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span>The Big Idea</span>
                </div>

                <div className="bg-white border-[2.5px] border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-left">
                  <p className="text-sm font-bold text-[#1A1A1A] leading-snug">
                    {intel.bigIdea.text}
                  </p>
                </div>

                <div className="bg-white border-[2.5px] border-black rounded-xl p-4 relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="absolute top-2 right-2 bg-black text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-[1.5px_1.5px_0px_0px_#B6FF00]">
                    {intel.bigIdea.label}
                  </div>

                  <div className="w-full h-32 flex items-center justify-center bg-stone-50 rounded-lg border border-stone-200 mt-2">
                    <svg className="w-full h-full p-2" viewBox="0 0 200 80">
                      <line x1="10" y1="60" x2="190" y2="60" stroke="#bbb" strokeWidth="1" />
                      <line x1="90" y1="20" x2="90" y2="70" stroke="#bbb" strokeWidth="1" strokeDasharray="2,2" />
                      <line x1="110" y1="20" x2="110" y2="70" stroke="#bbb" strokeWidth="1" strokeDasharray="2,2" />
                      <rect x="90" y="20" width="20" height="40" fill="#D3E2FF" stroke="black" strokeWidth="1.5" />
                      <path d="M 15 60 Q 25 40 35 60 T 55 60 T 75 60 T 90 60" fill="none" stroke="blue" strokeWidth="1.5" />
                      <path d="M 50 60 Q 60 70 70 60 T 90 60" fill="none" stroke="red" strokeWidth="1" strokeDasharray="2,1" />
                      <path d="M 110 60 Q 120 50 130 60 T 150 60 T 170 60" fill="none" stroke="blue" strokeWidth="1.2" />
                      <text x="50" y="15" fontSize="6" fontWeight="bold" textAnchor="middle">1. Incident</text>
                      <text x="100" y="15" fontSize="6" fontWeight="bold" textAnchor="middle">2. Tunneling</text>
                      <text x="145" y="15" fontSize="6" fontWeight="bold" textAnchor="middle">3. Transmission</text>
                      <text x="100" y="45" fontSize="5" fontWeight="black" textAnchor="middle">Barrier</text>
                    </svg>
                  </div>
                </div>
              </section>

              {/* Card 2: THE STORY */}
              <section className="bg-[#D3E2FF] border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
                <div className="flex items-center gap-1.5 font-black text-sm uppercase text-black">
                  <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>The Story</span>
                </div>

                <div className="bg-white border-[2.5px] border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-left">
                  <p className="text-sm font-bold text-[#1A1A1A] leading-snug">
                    {intel.story.text}
                  </p>
                </div>

                <div className="bg-white border-[2.5px] border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center h-32 bg-stone-50 overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 200 80">
                    <line x1="10" y1="70" x2="190" y2="70" stroke="black" strokeWidth="2" />
                    <path d="M 10 70 Q 70 70 100 30 T 150 70 L 190 70" fill="none" stroke="black" strokeWidth="2" />
                    <circle cx="35" cy="65" r="5" fill="red" stroke="black" strokeWidth="1.5" />
                    <path d="M 45 65 L 60 65" stroke="black" strokeWidth="1" />
                    <path d="M 97 37 L 103 43 M 103 37 L 97 43" stroke="red" strokeWidth="2" />
                    <text x="35" y="55" fontSize="6" fontWeight="bold" textAnchor="middle">Initial Velocity</text>
                    <text x="100" y="22" fontSize="6" fontWeight="black" textAnchor="middle">Peak Height</text>
                    <text x="100" y="50" fontSize="5" fontWeight="bold" textAnchor="middle" fill="red">Classic Stop</text>
                  </svg>
                </div>
              </section>

              {/* Card 3: THE REALITY */}
              <section className="bg-[#E5E5FF] border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
                <div className="flex items-center gap-1.5 font-black text-sm uppercase text-black">
                  <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>The Reality (Quantum)</span>
                </div>

                <div className="bg-white border-[2.5px] border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] h-32 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 flex items-center justify-center relative overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 200 80">
                    <defs>
                      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#B6FF00" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#B6FF00" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <circle cx="100" cy="40" r="30" fill="url(#glow)" />
                    <rect x="95" y="10" width="10" height="60" fill="#FFB040" stroke="black" strokeWidth="1.5" />
                    <path d="M 20 40 Q 40 10 60 40 T 95 40" fill="none" stroke="#B6FF00" strokeWidth="2.5" />
                    <path d="M 105 40 Q 120 30 135 40 T 180 40" fill="none" stroke="#B6FF00" strokeWidth="1.5" opacity="0.6" />
                    <text x="100" y="55" fontSize="5" fontWeight="black" fill="white" textAnchor="middle">Barrier</text>
                  </svg>
                </div>

                <div className="bg-white border-[2.5px] border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-left">
                  <p className="text-sm font-bold text-[#1A1A1A] leading-snug">
                    {intel.reality.text}
                  </p>
                </div>
              </section>

              {/* Card 4: WHY IT MATTERS */}
              <section className="bg-[#9EEAD8] border-[3.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
                <div className="flex items-center gap-1.5 font-black text-sm uppercase text-black">
                  <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  <span>Why It Matters</span>
                </div>

                <div className="bg-white border-[2.5px] border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-left space-y-3">
                  {intel.whyItMatters.bullets.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm font-bold text-[#1A1A1A]">
                      <svg className="w-4 h-4 fill-current text-teal-700 shrink-0 mt-0.5" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-[#FFE5C4] border-[2.5px] border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-left">
                  <div className="flex items-center gap-1 text-[10px] font-black uppercase text-[#965A18] tracking-widest mb-1">
                    <svg className="w-3.5 h-3.5 fill-current text-[#965A18]" viewBox="0 0 24 24">
                      <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
                    </svg>
                    <span>Aha Moment</span>
                  </div>
                  <p className="text-sm font-black text-[#1A1A1A] leading-snug">
                    {intel.whyItMatters.ahaMoment}
                  </p>
                </div>
              </section>

              {/* Card 5: PRO TIP */}
              <section className="bg-white border-[3px] border-black rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3 text-left">
                <svg className="w-5 h-5 text-red-600 fill-current shrink-0 mt-0.5" viewBox="0 0 24 24">
                  <path d="M12 2L1 21h22L12 2zm1 14h-2v-2h2v2zm0-4h-2V8h2v4z" />
                </svg>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-red-600 tracking-wider block">
                    Pro Tip
                  </span>
                  <p className="text-xs font-bold text-stone-700 leading-snug">
                    {intel.proTip.text}
                  </p>
                </div>
              </section>
            </>
          )}
        </div>

        <footer className="w-full mt-8">
          <button
            onClick={handleContinue}
            disabled={isLoading || !intel}
            className={`w-full border-[3.5px] border-black rounded-xl py-4 px-4 font-black text-lg uppercase tracking-wider transition-all shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 ${
              isLoading || !intel
                ? "bg-[#E8E6DA] text-stone-400 cursor-not-allowed opacity-80 shadow-none border-stone-400"
                : "bg-[#B6FF00] hover:bg-[#a3e600] text-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            }`}
          >
            <span>Continue to Dashboard</span>
            <svg className="w-5 h-5 stroke-[3.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </footer>

      </main>
    </div>
  );
}
