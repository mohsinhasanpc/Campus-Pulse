'use client';

import React, { useState } from 'react';
import {
  X,
  Check,
  GraduationCap,
  Sparkles,
  Layers,
  Compass,
  BookOpen,
  ChevronDown,
} from 'lucide-react';
import { StudentProfile, BranchType } from '@/lib/types';
import { TECH_INTEREST_TAGS, STUDY_INTEREST_TAGS } from '@/lib/data';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  onSave: (updated: StudentProfile) => void;
}

const ALL_BRANCHES: BranchType[] = [
  'Computer Engineering',
  'Artificial Intelligence & Data Science',
  'Information Technology',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
];

const ALL_YEARS = [
  'FE (First Year Junior)',
  'SE (Second Year)',
  'TE (Third Year)',
  'BE (Final Year)',
];

const ALL_DIVISIONS = [
  'Division A',
  'Division B',
  'Division C',
  'Division D',
  'Division E',
];

export default function RegisterModal({
  isOpen,
  onClose,
  student,
  onSave,
}: RegisterModalProps) {
  const [formData, setFormData] = useState<StudentProfile>({
    ...student,
    interestedAreas: student.interestedAreas || ['Artificial Intelligence', 'Web Development'],
    interestedSubjects: student.interestedSubjects || ['C Programming', 'Engineering Mathematics I & II'],
  });

  if (!isOpen) return null;

  const toggleTechTag = (tag: string) => {
    setFormData((prev) => {
      const exists = prev.interestedAreas.includes(tag);
      return {
        ...prev,
        interestedAreas: exists
          ? prev.interestedAreas.filter((t) => t !== tag)
          : [...prev.interestedAreas, tag],
      };
    });
  };

  const toggleStudyTag = (sub: string) => {
    setFormData((prev) => {
      const exists = prev.interestedSubjects?.includes(sub);
      return {
        ...prev,
        interestedSubjects: exists
          ? prev.interestedSubjects.filter((s) => s !== sub)
          : [...(prev.interestedSubjects || []), sub],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white text-zinc-900 w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-zinc-200 flex flex-col max-h-[92dvh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-950">
                Edit Academic Profile & Preferences
              </h2>
              <p className="text-xs text-zinc-500">
                Update branch details, roll number, and interactive interest pills
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-zinc-700">
          {/* Section 1: Basic Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-2">
              <Layers className="w-4 h-4 text-zinc-900" />
              <span className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
                01. Basic Student Info
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-zinc-800 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-800 mb-1">Engineering Branch</label>
                <select
                  value={formData.branch}
                  onChange={(e) =>
                    setFormData({ ...formData, branch: e.target.value as BranchType })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500 cursor-pointer"
                >
                  {ALL_BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block font-semibold text-zinc-800 mb-1">Class Year</label>
                <select
                  value={formData.classYear}
                  onChange={(e) => setFormData({ ...formData, classYear: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500 cursor-pointer"
                >
                  {ALL_YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-800 mb-1">Division</label>
                <select
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500 cursor-pointer"
                >
                  {ALL_DIVISIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-800 mb-1">Roll Number</label>
                <input
                  type="text"
                  required
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-mono text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-zinc-800 mb-1">College Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-800 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Interactive Interest Q&A Pills */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-2">
              <Compass className="w-4 h-4 text-zinc-900" />
              <span className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
                02. Tech Interests & Clubs (Selectable Pills)
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {TECH_INTEREST_TAGS.map((tag) => {
                const isSelected = formData.interestedAreas.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTechTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-950 text-white font-semibold shadow-2xs'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Engineering Studies Subjects Pills */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-2">
              <BookOpen className="w-4 h-4 text-zinc-900" />
              <span className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
                03. Engineering Studies & Academic Subjects
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {STUDY_INTEREST_TAGS.map((sub) => {
                const isSelected = formData.interestedSubjects?.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleStudyTag(sub)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-950 text-white font-semibold shadow-2xs'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Target Career Path */}
          <div className="space-y-2 pt-2">
            <label className="block font-semibold text-zinc-800">
              Target Future Career Path
            </label>
            <input
              type="text"
              value={formData.futurePath}
              onChange={(e) => setFormData({ ...formData, futurePath: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
              placeholder="e.g. Full-Stack & Applied AI Engineer"
            />
          </div>

          {/* Footer Save */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
