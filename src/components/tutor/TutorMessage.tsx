"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TutorMessage as ITutorMessage } from '@/hooks/useTutor';
import ExerciseBlock from './ExerciseBlock';
import { PlayIcon } from 'hugeicons-react';

import { formatAIText } from '@/lib/formatAIText';

interface TutorMessageProps {
  message: ITutorMessage;
  onPlayAudio?: (text: string) => void;
  onSubmitAnswer?: (answer: string) => void;
}

export default function TutorMessage({ message, onPlayAudio, onSubmitAnswer }: TutorMessageProps) {
  const isUser = message.role === 'user';
  
  // Clean up markers and format AI text
  const rawText = message.content
    .replace(/\[LESSON\]/g, '')
    .replace(/\[EXERCISE\]/g, '')
    .replace(/\[FEEDBACK\]/g, '')
    .trim();

  const displayText = isUser ? rawText : formatAIText(rawText);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`
        max-w-[85%] relative
        ${isUser 
          ? 'bg-black text-white rounded-2xl rounded-tr-sm border-[3.5px] border-black shadow-[4px_4px_0px_0px_rgba(182,255,0,1)]' 
          : `bg-white text-black rounded-2xl rounded-tl-sm border-[3.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
              message.contentType === 'feedback' ? 'border-[#FFB040]' : ''
            }`
        }
        p-4
      `}>
        {!isUser && message.contentType === 'micro_lesson' && (
          <div className="text-xs font-black uppercase tracking-widest text-stone-500 mb-2">
            Mini Lesson 📚
          </div>
        )}
        {!isUser && message.contentType === 'feedback' && (
          <div className="text-xs font-black uppercase tracking-widest text-[#FFB040] mb-2">
            Feedback 💡
          </div>
        )}

        <div className="whitespace-pre-wrap font-medium text-[15px] leading-relaxed">
          {displayText}
        </div>

        {!isUser && message.contentType === 'exercise' && onSubmitAnswer && (
          <div className="mt-4">
            <ExerciseBlock 
              question="Type your answer below:" 
              onSubmit={onSubmitAnswer} 
            />
          </div>
        )}

        {!isUser && onPlayAudio && (
          <button
            onClick={() => onPlayAudio(displayText)}
            className="absolute -right-2 -bottom-2 bg-[#B6FF00] p-2 rounded-full border-[2.5px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            aria-label="Play audio"
          >
            <PlayIcon className="w-4 h-4 text-black" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
