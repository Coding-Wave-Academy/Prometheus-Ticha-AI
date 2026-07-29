"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface AdaptivePacingBarProps {
  score: number; // 0.0 to 1.0
}

export default function AdaptivePacingBar({ score }: AdaptivePacingBarProps) {
  let level = 'Standard';
  let color = 'bg-[#B6FF00]';
  
  if (score < 0.4) {
    level = 'Supportive';
    color = 'bg-[#FF9494]';
  } else if (score > 0.7) {
    level = 'Accelerated';
    color = 'bg-[#FFB040]';
  }

  return (
    <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-full border-[2.5px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
      <span className="text-[10px] font-black uppercase tracking-widest text-stone-600">
        Pacing
      </span>
      <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden border border-black">
        <motion.div 
          className={`h-full ${color} border-r border-black`}
          initial={{ width: 0 }}
          animate={{ width: `${score * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-black w-24 text-right">
        {level}
      </span>
    </div>
  );
}
