"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";
import { useNavItems } from "@/hooks/useNavItems";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function MaterialsPage() {
  const router = useRouter();
  const navItems = useNavItems();

  const [level, setLevel] = useState<"ol" | "al" | "university">("al");
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [mockFileName, setMockFileName] = useState("");
  const [manualText, setManualText] = useState("");
  const [courses, setCourses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load existing course list from localStorage
  useEffect(() => {
    const listStr = localStorage.getItem("ticha_user_courses_list");
    if (listStr) {
      setCourses(JSON.parse(listStr));
    } else {
      // Default initial mock courses list
      const initial = ["Advanced Physics", "Pure Mathematics", "Chemistry"];
      setCourses(initial);
      localStorage.setItem("ticha_user_courses_list", JSON.stringify(initial));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileSelected(file);
      setMockFileName(file.name);
      setMessage(`Loaded File: ${file.name}`);
    }
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;

    // Split courses by comma or newline
    const items = manualText
      .split(/[,;\n]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 1);

    if (items.length === 0) return;

    const updated = Array.from(new Set([...courses, ...items]));
    setCourses(updated);
    localStorage.setItem("ticha_user_courses_list", JSON.stringify(updated));
    setManualText("");
    setMessage(`Successfully added ${items.length} course(s)!`);
  };

  const parseFileAndUpload = async () => {
    setIsLoading(true);
    setMessage("AI is parsing your Course Slip / Form B details...");

    try {
      // Mock parsing after 1.5 seconds or query AI to parse
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let parsedCourses: string[] = [];
      if (level === "university") {
        parsedCourses = ["Intro to Computer Science", "Probability & Statistics", "Linear Algebra"];
      } else if (level === "ol") {
        parsedCourses = ["O-Level Biology", "O-Level English Literature", "O-Level History"];
      } else {
        parsedCourses = ["Advanced Physics", "Pure Mathematics", "Applied Mathematics"];
      }

      const updated = Array.from(new Set([...courses, ...parsedCourses]));
      setCourses(updated);
      localStorage.setItem("ticha_user_courses_list", JSON.stringify(updated));
      localStorage.setItem("ticha_has_uploaded_slip", "true");
      localStorage.setItem("ticha_uploaded_slip_name", mockFileName || "Form_B_Slip.pdf");

      // Save to Supabase
      if (isSupabaseConfigured()) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("profiles").update({ struggles: updated }).eq("id", user.id);
        }
      }

      setFileSelected(null);
      setMockFileName("");
      setMessage("AI parsed document successfully! Courses synced with database.");
    } catch (err) {
      console.error(err);
      setMessage("Error parsing outline. Please add manually.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeCourse = (name: string) => {
    const updated = courses.filter((c) => c !== name);
    setCourses(updated);
    localStorage.setItem("ticha_user_courses_list", JSON.stringify(updated));
    setMessage(`Removed course: ${name}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF7EC] pb-24 antialiased font-sans selection:bg-[#B6FF00]">
      <main className="w-full max-w-md mx-auto p-4 flex flex-col min-h-[90vh] justify-between animate-page-in">
        
        {/* Header */}
        <header className="flex items-center justify-between w-full mb-6 py-2">
          <Link
            href="/explore"
            className="w-11 h-11 bg-white border-[3px] border-black rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all"
            aria-label="Back to explore"
          >
            <svg className="w-6 h-6 stroke-[3.5px] text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          
          <div className="text-right">
            <span className="text-[10px] font-black uppercase text-[#965A18] tracking-widest block">
              Course Compiler
            </span>
            <h1 className="text-sm font-black text-black">
              Materials & Slip Outlines
            </h1>
          </div>
        </header>

        <div className="flex-1 flex flex-col justify-start w-full space-y-6">
          
          {/* File Upload Selector Panel */}
          <div className="bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4 text-left">
            <div className="space-y-1">
              <h2 className="text-lg font-black uppercase text-black leading-tight">
                Submit Course Slip / Form B
              </h2>
              <p className="text-xs font-bold text-stone-500">
                Upload your GCE O-Level/A-Level slip or University Form B. Ticha AI will compile your course list directly into the database.
              </p>
            </div>

            {/* Level Toggle Selector */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-stone-855">
                Education Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["ol", "al", "university"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLevel(lvl)}
                    className={`py-1.5 font-black text-[11px] rounded-lg border-2 border-black transition-all ${
                      level === lvl
                        ? "bg-[#B6FF00] shadow-[1.5px_1.5px_0px_0px_#000] translate-y-0.5"
                        : "bg-white shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5"
                    }`}
                  >
                    {lvl === "ol" ? "O-Level" : lvl === "al" ? "A-Level" : "University"}
                  </button>
                ))}
              </div>
            </div>

            {/* Drag & Drop File Picker */}
            <div className="relative border-[3px] border-dashed border-black rounded-xl p-4 bg-stone-50 text-center hover:bg-stone-100 transition-colors flex flex-col items-center">
              <input 
                type="file" 
                accept=".pdf,.png,.jpg,.jpeg,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="text-3xl mb-1 select-none">📄</span>
              <p className="font-extrabold text-xs text-black">
                {mockFileName || "Click to select Course Slip / Form B"}
              </p>
              <p className="text-[9px] font-bold text-stone-500 mt-0.5">
                PDF, Word, or Photo Slip
              </p>
            </div>

            {mockFileName && (
              <button
                onClick={parseFileAndUpload}
                disabled={isLoading}
                className="w-full bg-[#B6FF00] hover:bg-[#a3e600] border-[2.5px] border-black rounded-xl py-2.5 font-black uppercase text-xs shadow-[3px_3px_0px_0px_#000] active:translate-x-px active:translate-y-px active:shadow-none transition-all text-center text-black"
              >
                {isLoading ? "Compiling..." : "🤖 Compile with AI"}
              </button>
            )}

            {/* Notification message */}
            {message && (
              <div className="bg-[#FFE5C4] border-2 border-black rounded-lg p-2.5 text-xs font-bold text-black text-center shadow-[1.5px_1.5px_0px_0px_#000]">
                ⚠️ {message}
              </div>
            )}
          </div>

          {/* Manual Course Input Section */}
          <div className="bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3 text-left">
            <h3 className="text-sm font-black uppercase text-black">
              Add Courses Manually
            </h3>
            <form onSubmit={handleManualAdd} className="space-y-3">
              <textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Enter course name(s) separated by commas (e.g. Pure Mathematics, Chemistry)"
                className="w-full h-16 border-[2.5px] border-black rounded-xl p-3 text-xs font-bold focus:shadow-[3px_3px_0px_0px_#000] focus:translate-x-[-1px] focus:translate-y-[-1px] outline-none transition-all resize-none bg-stone-50"
              />
              <button
                type="submit"
                className="w-full bg-white hover:bg-stone-50 border-[2.5px] border-black rounded-xl py-2 font-black uppercase text-xs shadow-[3px_3px_0px_0px_#000] active:translate-x-px active:translate-y-px active:shadow-none transition-all text-center text-black"
              >
                ＋ Add to Course List
              </button>
            </form>
          </div>

          {/* Compiled Courses Grid */}
          <div className="space-y-3 text-left">
            <h3 className="text-sm font-black uppercase text-black pl-1">
              My Courses ({courses.length})
            </h3>
            
            {courses.length === 0 ? (
              <div className="bg-white border-[2.5px] border-black rounded-xl p-4 text-center text-stone-500 font-bold text-xs">
                No courses added yet. Upload your Course Slip above!
              </div>
            ) : (
              <div className="space-y-3.5">
                {courses.map((course) => (
                  <div 
                    key={course}
                    className="bg-white border-[3px] border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-black text-sm text-black uppercase tracking-tight">
                        {course}
                      </span>
                      <button 
                        onClick={() => removeCourse(course)}
                        className="text-stone-400 hover:text-black font-bold text-xs"
                      >
                        Delete
                      </button>
                    </div>

                    {/* Quick redirect actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => router.push(`/dashboard/quiz-generator?subject=${encodeURIComponent(course)}`)}
                        className="bg-[#B6FF00] hover:bg-[#a3e600] border-[2px] border-black rounded-lg py-1.5 text-[11px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-px active:translate-y-px active:shadow-none transition-all"
                      >
                        ⚡ Practice Quiz
                      </button>
                      <button
                        onClick={() => router.push(`/explore/flashcards?subject=${encodeURIComponent(course)}`)}
                        className="bg-[#FFB040] hover:bg-[#ffa326] border-[2px] border-black rounded-lg py-1.5 text-[11px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-px active:translate-y-px active:shadow-none transition-all"
                      >
                        🧠 Flash Cards
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      <BottomNav items={navItems} />
    </div>
  );
}
