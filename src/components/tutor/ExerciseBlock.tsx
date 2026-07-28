"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ExerciseBlockProps {
  question: string;
  onSubmit: (answer: string) => void;
}

export default function ExerciseBlock({ question, onSubmit }: ExerciseBlockProps) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || submitted) return;
    setSubmitted(true);
    onSubmit(answer);
  };

  return (
    <div className="bg-[#FAF7EC] p-3 rounded-xl border-[2.5px] border-black">
      <p className="font-bold text-sm mb-3 text-black">{question}</p>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={submitted}
          placeholder="Your answer..."
          className="flex-1 bg-white border-[2.5px] border-black rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!answer.trim() || submitted}
          className="bg-[#B6FF00] border-[2.5px] border-black rounded-lg px-4 py-2 font-bold text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
