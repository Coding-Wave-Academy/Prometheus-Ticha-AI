"use client";

import React, { useState } from "react";
import {
  QuestionIcon,
  CustomerSupportIcon,
  Book01Icon,
  AiBrain01Icon,
  FireIcon,
  Cancel01Icon,
} from "hugeicons-react";

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const faqs = [
  {
    question: "How does the AI Tutor work for GCE preparation?",
    answer:
      "Ticha AI Tutor uses adaptive pacing to match your performance score. It breaks down complex GCE Ordinary and Advanced Level subjects (Physics, Pure Maths, ICT, Chemistry, etc.) into 3-5 minute micro-lessons, followed by interactive practice exercises with step-by-step feedback.",
    icon: <AiBrain01Icon size={18} className="text-black" />,
  },
  {
    question: "What happens if I miss a day? How do Streak Freezes work?",
    answer:
      "We use a healthy streak system. You get 2 Streak Freezes by default. If you miss a study day, a freeze automatically preserves your streak without resetting it to 0 so you never feel discouraged!",
    icon: <FireIcon size={18} className="text-orange-600" />,
  },
  {
    question: "Where can I find regional mock past papers?",
    answer:
      "Go to the Explore Hub $\rightarrow$ Past Papers to access official GCE Board papers and regional mock exams (Littoral, Centre, Southwest, Northwest, West).",
    icon: <Book01Icon size={18} className="text-black" />,
  },
];

export default function HelpCenterModal({ isOpen, onClose }: HelpCenterModalProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 md:pt-20 bg-black/60 backdrop-blur-sm animate-page-in">
      <div className="w-full max-w-md bg-[#FAF7EC] border-[4px] border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative flex flex-col space-y-5 max-h-[85vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-[3px] border-black pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#B6FF00] border-[3px] border-black rounded-2xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <QuestionIcon size={24} className="text-black" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase text-black leading-tight">
                Help Center
              </h2>
              <p className="text-xs font-bold text-stone-600">
                Support & Frequently Asked Questions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-white border-[3px] border-black rounded-full flex items-center justify-center font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none hover:bg-stone-50"
            aria-label="Close Help Center"
          >
            <Cancel01Icon size={18} className="text-black" />
          </button>
        </div>

        {/* Support Channels */}
        <div className="bg-white border-[3px] border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3 text-left">
          <h3 className="text-xs font-black uppercase tracking-widest text-stone-800 flex items-center gap-2">
            <CustomerSupportIcon size={18} className="text-black" />
            <span>Need Direct Assistance?</span>
          </h3>
          <p className="text-xs font-medium text-stone-600">
            Our educational support team is available to help with account issues, GCE syllabus questions, or bug reports.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href="mailto:support@ticha.ai"
              className="bg-[#D3E2FF] border-[2.5px] border-black rounded-xl p-2.5 text-center font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none block"
            >
              ✉️ Email Support
            </a>
            <a
              href="https://wa.me/237600000000"
              target="_blank"
              rel="noreferrer"
              className="bg-[#B6FF00] border-[2.5px] border-black rounded-xl p-2.5 text-center font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none block"
            >
              💬 WhatsApp Line
            </a>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-3 text-left">
          <h3 className="text-xs font-black uppercase tracking-widest text-stone-800">
            Frequently Asked Questions
          </h3>

          <div className="space-y-2.5">
            {faqs.map((faq, index) => {
              const isOpenItem = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white border-[3px] border-black rounded-xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  <button
                    onClick={() => setOpenFaq(isOpenItem ? null : index)}
                    className="w-full p-3.5 text-left font-black text-xs uppercase flex items-center justify-between gap-2 hover:bg-stone-50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      {faq.icon}
                      <span>{faq.question}</span>
                    </span>
                    <span className="text-base font-black shrink-0">
                      {isOpenItem ? "−" : "+"}
                    </span>
                  </button>

                  {isOpenItem && (
                    <div className="p-3.5 pt-0 text-xs font-medium text-stone-700 border-t-[2px] border-black bg-[#FAF7EC]/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#B6FF00] hover:bg-[#a3e600] border-[3.5px] border-black rounded-xl py-3 px-4 font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none transition-all text-black"
        >
          Got it
        </button>

      </div>
    </div>
  );
}
