"use client";

import React, { useState, useEffect } from "react";
import {
  PencilEdit01Icon,
  LockKeyIcon,
  Location01Icon,
  SchoolIcon,
  UserIcon,
} from "hugeicons-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { fullName: string; schoolName: string; region: string }) => void;
  initialData: {
    fullName: string;
    schoolName: string;
    region: string;
    educationLevel: string;
  };
}

export default function EditProfileModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: EditProfileModalProps) {
  const [fullName, setFullName] = useState(initialData.fullName);
  const [schoolName, setSchoolName] = useState(initialData.schoolName);
  const [region, setRegion] = useState(initialData.region);

  useEffect(() => {
    setFullName(initialData.fullName);
    setSchoolName(initialData.schoolName);
    setRegion(initialData.region);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ fullName, schoolName, region });
    onClose();
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "ol":
        return "GCE Ordinary Level (O/L)";
      case "al":
        return "GCE Advanced Level (A/L)";
      case "university":
        return "University Prep";
      default:
        return "GCE Advanced Level (A/L)";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-page-in">
      <div 
        id="edit-profile-modal"
        className="w-full max-w-sm bg-[#FAF7EC] border-[4px] border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative flex flex-col text-left space-y-5"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-white border-[3px] border-black rounded-full flex items-center justify-center font-black text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px active:shadow-none hover:bg-stone-50"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 border-b-[3px] border-black pb-3">
          <div className="w-10 h-10 bg-[#FFB040] border-[2.5px] border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <PencilEdit01Icon size={20} className="text-black" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase text-black leading-tight">
              Edit Profile
            </h2>
            <p className="text-xs font-bold text-stone-600">
              Update your personal study preferences
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="edit-name" className="text-xs font-extrabold uppercase tracking-widest text-stone-800 flex items-center gap-1">
              <UserIcon size={14} className="text-black" />
              <span>Full Name</span>
            </label>
            <input
              id="edit-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white border-[3px] border-black rounded-xl p-3 text-sm font-medium outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            />
          </div>

          {/* Locked Education Target */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-extrabold uppercase tracking-widest text-stone-800 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <SchoolIcon size={14} className="text-black" />
                <span>Education Target</span>
              </span>
              <span className="text-[10px] font-black uppercase bg-[#FF9494] text-black border-[1.5px] border-black rounded-full px-2 py-0.5 flex items-center gap-1 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                <LockKeyIcon size={11} className="text-black" />
                <span>Locked</span>
              </span>
            </label>
            <div className="w-full bg-stone-200 border-[3px] border-black rounded-xl p-3 text-sm font-bold text-stone-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-not-allowed opacity-90">
              {getLevelLabel(initialData.educationLevel)}
            </div>
            <p className="text-[10px] font-bold text-stone-500 italic pl-0.5">
              * Education target cannot be changed once selected during onboarding.
            </p>
          </div>

          {/* School Name */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="edit-school" className="text-xs font-extrabold uppercase tracking-widest text-stone-800 flex items-center gap-1">
              <SchoolIcon size={14} className="text-black" />
              <span>School / Community</span>
            </label>
            <input
              id="edit-school"
              type="text"
              required
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full bg-white border-[3px] border-black rounded-xl p-3 text-sm font-medium outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            />
          </div>

          {/* Study Region */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="edit-region" className="text-xs font-extrabold uppercase tracking-widest text-stone-800 flex items-center gap-1">
              <Location01Icon size={14} className="text-black" />
              <span>Study Region</span>
            </label>
            <div className="relative rounded-xl border-[3px] border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <select
                id="edit-region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-transparent p-3 pr-10 text-sm font-medium outline-none text-black appearance-none"
              >
                <option value="littoral">Littoral Region</option>
                <option value="centre">Centre Region</option>
                <option value="southwest">Southwest Region</option>
                <option value="northwest">Northwest Region</option>
                <option value="west">West Region</option>
                <option value="other">Other Region</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-700 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#B6FF00] hover:bg-[#a3e600] border-[3.5px] border-black rounded-xl py-3.5 px-4 font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-center text-black mt-2"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
