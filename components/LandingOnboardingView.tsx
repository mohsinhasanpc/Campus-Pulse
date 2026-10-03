'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  ArrowRight,
  Check,
  Sparkles,
  Users,
  Compass,
  BookOpen,
  Calendar,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Layers,
  Award,
  Zap,
} from 'lucide-react';
import { StudentProfile, BranchType } from '@/lib/types';
import { TECH_INTEREST_TAGS, STUDY_INTEREST_TAGS } from '@/lib/data';

interface LandingOnboardingViewProps {
  onComplete: (studentData: StudentProfile) => void;
  initialStudent: StudentProfile;
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

export default function LandingOnboardingView({
  onComplete,
  initialStudent,
}: LandingOnboardingViewProps) {
  const [viewMode, setViewMode] = useState<'landing' | 'signup' | 'login'>('landing');
  const [signupStep, setSignupStep] = useState<1 | 2>(1);

  // Form State
  const [formData, setFormData] = useState({
    name: initialStudent.name,
    email: initialStudent.email,
    phone: initialStudent.phone,
    branch: initialStudent.branch,
    division: initialStudent.division,
    rollNo: initialStudent.rollNo,
    classYear: initialStudent.classYear,
    interestedAreas: [...initialStudent.interestedAreas],
    interestedSubjects: [...(initialStudent.interestedSubjects || [])],
  });

  // Login simple inputs
  const [loginEmail, setLoginEmail] = useState(initialStudent.email);
  const [loginRoll, setLoginRoll] = useState(initialStudent.rollNo);

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

  const toggleStudyTag = (tag: string) => {
    setFormData((prev) => {
      const exists = prev.interestedSubjects.includes(tag);
      return {
        ...prev,
        interestedSubjects: exists
          ? prev.interestedSubjects.filter((s) => s !== tag)
          : [...prev.interestedSubjects, tag],
      };
    });
  };

  const handleFinishSignup = () => {
    const updatedProfile: StudentProfile = {
      ...initialStudent,
      name: formData.name || 'Junior Engineer',
      email: formData.email,
      phone: formData.phone,
      branch: formData.branch,
      division: formData.division,
      rollNo: formData.rollNo || 'CS-2026-001',
      classYear: formData.classYear,
      interestedAreas:
        formData.interestedAreas.length > 0
          ? formData.interestedAreas
          : ['Artificial Intelligence', 'Web Development'],
      interestedSubjects:
        formData.interestedSubjects.length > 0
          ? formData.interestedSubjects
          : ['C Programming', 'Engineering Mathematics I & II'],
    };
    onComplete(updatedProfile);
  };

  const handleQuickDemoLogin = () => {
    onComplete(initialStudent);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-zinc-800 selection:text-white">
      {/* Sleek Minimalist Top Bar */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Sleek text-based minimal icon logo */}
            <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-black tracking-tighter text-sm">
              <Zap className="w-4 h-4 fill-zinc-950 text-zinc-950" />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-white">
              Campus Pulse
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono text-zinc-500 border border-zinc-800 rounded px-1.5 py-0.5 ml-1">
              v2.4
            </span>
          </div>

          <div className="flex items-center gap-3">
            {viewMode === 'landing' ? (
              <>
                <button
                  onClick={() => setViewMode('login')}
                  className="text-xs sm:text-sm font-medium text-zinc-400 hover:text-white transition-colors px-3 py-1.5 cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setViewMode('signup');
                    setSignupStep(1);
                  }}
                  className="text-xs sm:text-sm font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setViewMode('landing')}
                className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Back to Overview
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full flex flex-col justify-center">
        {viewMode === 'landing' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Induction & Mentorship Hub 2026-27</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Bridge the gap between <br className="hidden sm:block" />
                <span className="text-zinc-400">juniors and seniors.</span>
              </h1>

              <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Connect directly with senior club leads and industry alumni in your field of
                interest. Explore real career roadmaps, download curated study materials, and
                navigate college with an AI academic advisor.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  onClick={() => {
                    setViewMode('signup');
                    setSignupStep(1);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5 cursor-pointer"
                >
                  <span>Student Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleQuickDemoLogin}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Enter as Demo Junior (1-Click)</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 pt-2 text-xs font-mono text-zinc-500">
                <span>Free for All Engineering Juniors</span>
                <span>·</span>
                <span>No Credit Card</span>
                <span>·</span>
                <span>Official Campus Network</span>
              </div>
            </div>

            {/* Core Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
              <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl space-y-3 hover:border-zinc-700 transition-all">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-white">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Direct Senior & Alumni Mentorship</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Bypass generic classroom advice. Chat 1-on-1 with seniors in GDSC, ACM, and
                  Robotics, plus alumni working at Google, Microsoft, and Tesla.
                </p>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl space-y-3 hover:border-zinc-700 transition-all">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Curated Academic Notes & Repos</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Branch-specific study guides for C Programming, Mathematics-I, Data Structures, and
                  Digital Logic. Solved question banks verified by toppers.
                </p>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl space-y-3 hover:border-zinc-700 transition-all">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-white">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Hackathons & Internships Board</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Find freshmen-friendly hackathon teams, summer research fellowships (SURF), and
                  campus freelance gigs to build an industry portfolio early.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Multi-step Signup Flow */}
        {viewMode === 'signup' && (
          <div className="max-w-xl mx-auto w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Step indicator */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <span className="text-[11px] font-mono uppercase text-zinc-500 font-semibold tracking-wider">
                  Step {signupStep} of 2
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {signupStep === 1 ? 'Basic Student Details' : 'Interactive Interests Q&A'}
                </h2>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-8 h-2 rounded-full transition-all ${
                    signupStep >= 1 ? 'bg-white' : 'bg-zinc-800'
                  }`}
                />
                <div
                  className={`w-8 h-2 rounded-full transition-all ${
                    signupStep >= 2 ? 'bg-white' : 'bg-zinc-800'
                  }`}
                />
              </div>
            </div>

            {/* STEP 1: Basic Details */}
            {signupStep === 1 && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-400">
                  Fill in your academic profile so we can tailor branch notes, mentors, and club recommendations:
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Aaryan Shaikh"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        College Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="student@campus.edu"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Branch & Year */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Engineering Branch
                      </label>
                      <select
                        value={formData.branch}
                        onChange={(e) =>
                          setFormData({ ...formData, branch: e.target.value as BranchType })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors cursor-pointer"
                      >
                        {ALL_BRANCHES.map((b) => (
                          <option key={b} value={b} className="bg-zinc-900">
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Class Year
                      </label>
                      <select
                        value={formData.classYear}
                        onChange={(e) => setFormData({ ...formData, classYear: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors cursor-pointer"
                      >
                        {ALL_YEARS.map((y) => (
                          <option key={y} value={y} className="bg-zinc-900">
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Division & Roll No */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Class Division
                      </label>
                      <select
                        value={formData.division}
                        onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors cursor-pointer"
                      >
                        {ALL_DIVISIONS.map((d) => (
                          <option key={d} value={d} className="bg-zinc-900">
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Roll Number
                      </label>
                      <input
                        type="text"
                        value={formData.rollNo}
                        onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                        placeholder="e.g. CS-2026-042"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm font-mono text-white focus:outline-none focus:border-zinc-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setViewMode('landing')}
                    className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next: Select Interests</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Interactive Interest Q&A */}
            {signupStep === 2 && (
              <div className="space-y-5">
                <p className="text-xs text-zinc-400">
                  Select pill tags below to personalize your recommendation feed for technical clubs,
                  seminars, and study materials:
                </p>

                {/* Tech Interests Category */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Tech Domains & Clubs</span>
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {formData.interestedAreas.length} selected
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
                              ? 'bg-white text-zinc-950 font-semibold ring-2 ring-white/50'
                              : 'bg-zinc-950 text-zinc-300 border border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                          <span>{tag}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Studies & Engineering Subjects Category */}
                <div className="space-y-2.5 pt-2 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Engineering Studies & Subjects</span>
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {formData.interestedSubjects.length} selected
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {STUDY_INTEREST_TAGS.map((sub) => {
                      const isSelected = formData.interestedSubjects.includes(sub);
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => toggleStudyTag(sub)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-zinc-200 text-zinc-950 font-semibold ring-2 ring-zinc-400'
                              : 'bg-zinc-950 text-zinc-300 border border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                          <span>{sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setSignupStep(1)}
                    className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Back to Details
                  </button>
                  <button
                    type="button"
                    onClick={handleFinishSignup}
                    className="px-6 py-2.5 rounded-xl bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-md shadow-white/10 cursor-pointer"
                  >
                    <span>Launch Campus Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Simple Login View */}
        {viewMode === 'login' && (
          <div className="max-w-md mx-auto w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Student Sign In</h2>
              <p className="text-xs text-zinc-400">
                Log in to access your registered workshops and senior messages.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  College Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Roll Number or Password
                </label>
                <input
                  type="text"
                  value={loginRoll}
                  onChange={(e) => setLoginRoll(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm font-mono text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2.5 rounded-xl bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition-all cursor-pointer"
              >
                Sign In to Campus Pulse
              </button>

              <div className="text-center">
                <span className="text-xs text-zinc-500">Don&apos;t have an account? </span>
                <button
                  onClick={() => {
                    setViewMode('signup');
                    setSignupStep(1);
                  }}
                  className="text-xs text-white underline font-semibold hover:text-zinc-300"
                >
                  Create one now
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-600">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Campus Pulse. Built for engineering juniors & seniors.</p>
          <div className="flex items-center gap-4 text-zinc-500">
            <span>Academic Guidelines</span>
            <span>·</span>
            <span>Club Charters</span>
            <span>·</span>
            <span>Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
