"use client";

import React from 'react';
import { motion } from 'framer-motion';

const SUBJECTS = [
  { id: 'maths', name: 'Mathematics', icon: '📐', color: 'bg-[#B6FF00]' },
  { id: 'physics', name: 'Physics', icon: '⚛️', color: 'bg-[#FFB040]' },
  { id: 'chemistry', name: 'Chemistry', icon: '🧪', color: 'bg-[#B6FF00]' },
  { id: 'biology', name: 'Biology', icon: '🧬', color: 'bg-[#FFB040]' },
  { id: 'english', name: 'English', icon: '📚', color: 'bg-white' },
  { id: 'french', name: 'French', icon: '🌍', color: 'bg-white' },
  { id: 'ict', name: 'ICT', icon: '💻', color: 'bg-[#B6FF00]' },
  { id: 'geography', name: 'Geography', icon: '🗺️', color: 'bg-[#FFB040]' },
  { id: 'history', name: 'History', icon: '🏛️', color: 'bg-white' },
  { id: 'economics', name: 'Economics', icon: '📈', color: 'bg-[#B6FF00]' },
];

interface SubjectPickerProps {
  onSelect: (subject: string, topic: string) => void;
}

export default function SubjectPicker({ onSelect }: SubjectPickerProps) {
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-black uppercase tracking-tight text-black mb-2">Choose Subject</h2>
        <p className="text-stone-600 font-medium">What do you want to learn today?</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {SUBJECTS.map((subject, idx) => (
          <motion.button
            key={subject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onSelect(subject.name, 'Introduction')}
            className={`
              ${subject.color} p-4 rounded-2xl
              border-[3.5px] border-black
              shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
              active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
              flex flex-col items-center justify-center gap-2
              transition-transform
            `}
          >
            <span className="text-4xl">{subject.icon}</span>
            <span className="font-bold text-[15px] uppercase tracking-wide text-black">
              {subject.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
