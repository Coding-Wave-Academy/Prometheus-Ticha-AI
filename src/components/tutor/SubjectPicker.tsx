"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  SquareIcon,
  FlashIcon,
  ComputerIcon,
  Book01Icon,
  Globe02Icon,
  Award01Icon,
  Compass01Icon,
  Mortarboard01Icon,
  File01Icon,
  CheckmarkCircle02Icon,
} from "hugeicons-react";

export interface SubjectItem {
  id: string;
  name: string;
  category: string;
  color: string;
  icon: React.ReactNode;
}

export const SUBJECTS: SubjectItem[] = [
  {
    id: "maths",
    name: "Pure Mathematics",
    category: "Maths",
    color: "bg-[#B6FF00]",
    icon: <SquareIcon size={28} className="text-black" />,
  },
  {
    id: "physics",
    name: "Physics",
    category: "Sciences",
    color: "bg-[#FFB040]",
    icon: <FlashIcon size={28} className="text-black" />,
  },
  {
    id: "chemistry",
    name: "Chemistry",
    category: "Sciences",
    color: "bg-[#D3E2FF]",
    icon: <CheckmarkCircle02Icon size={28} className="text-black" />,
  },
  {
    id: "biology",
    name: "Biology",
    category: "Sciences",
    color: "bg-[#FFD9E0]",
    icon: <Mortarboard01Icon size={28} className="text-black" />,
  },
  {
    id: "english",
    name: "English Language",
    category: "Arts",
    color: "bg-[#E2D3FF]",
    icon: <Book01Icon size={28} className="text-black" />,
  },
  {
    id: "french",
    name: "French Language",
    category: "Arts",
    color: "bg-[#A8FFD3]",
    icon: <Globe02Icon size={28} className="text-black" />,
  },
  {
    id: "ict",
    category: "Technology",
    name: "ICT & Computing",
    color: "bg-[#FFDF9E]",
    icon: <ComputerIcon size={28} className="text-black" />,
  },
  {
    id: "geography",
    category: "Humanities",
    name: "Geography",
    color: "bg-[#D3F2FF]",
    icon: <Compass01Icon size={28} className="text-black" />,
  },
  {
    id: "history",
    category: "Humanities",
    name: "History",
    color: "bg-[#FFD0D0]",
    icon: <File01Icon size={28} className="text-black" />,
  },
  {
    id: "economics",
    category: "Commercial",
    name: "Economics",
    color: "bg-[#E0FFD0]",
    icon: <Award01Icon size={28} className="text-black" />,
  },
];

interface SubjectPickerProps {
  onSelect: (subject: string, topic: string) => void;
}

export default function SubjectPicker({ onSelect }: SubjectPickerProps) {
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black uppercase tracking-tight text-black">
          Choose Subject
        </h2>
        <p className="text-xs font-bold uppercase tracking-wider text-stone-600">
          Select a subject for your personalized AI study session
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {SUBJECTS.map((subject, idx) => (
          <motion.button
            key={subject.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            onClick={() => onSelect(subject.name, "Core Fundamentals")}
            className={`
              ${subject.color} p-4 rounded-2xl
              border-[3.5px] border-black
              shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
              active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
              flex flex-col items-center justify-center gap-2.5 text-center
              transition-all hover:brightness-105
            `}
          >
            <div className="w-12 h-12 bg-white border-[2.5px] border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {subject.icon}
            </div>
            <span className="font-black text-xs uppercase tracking-wide text-black leading-tight">
              {subject.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
