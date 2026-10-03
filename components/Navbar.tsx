'use client';

import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Search,
  Sparkles,
  Bell,
  Home,
  Compass,
  MessageSquare,
  User,
  Zap,
  ChevronRight,
  LogOut,
  Edit3,
} from 'lucide-react';
import { StudentProfile } from '@/lib/types';

interface NavbarProps {
  student: StudentProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiModal: (initialPrompt?: string) => void;
  onOpenRegisterModal: () => void;
  onSwitchToLanding: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  unreadCount: number;
}

export default function Navbar({
  student,
  activeTab,
  setActiveTab,
  onOpenAiModal,
  onOpenRegisterModal,
  onSwitchToLanding,
  searchQuery,
  setSearchQuery,
  unreadCount,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setShowNotifications(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'Workshop Confirmed',
      text: 'Your registration for Full-Stack Cloud with GDSC is active!',
      time: '10m ago',
    },
    {
      id: 2,
      title: 'New Study Guide Uploaded',
      text: 'C Programming Lab Manual (12-week verified) is now available in Study Materials.',
      time: '1h ago',
    },
    {
      id: 3,
      title: 'Alumni Mentorship Open',
      text: 'Vikramaditya Rao (Google, Class of 2022) is reviewing freshmen projects.',
      time: 'Yesterday',
    },
  ];

  const studentName = student?.name || 'Aaryan Shaikh';
  const firstName = studentName.split(' ')[0] || 'Junior';
  const initials = studentName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const classYear = student?.classYear || 'FE (First Year Junior)';
  const shortYear = classYear.split(' ')[0] || 'FE';

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Zone 1: Minimal Branding + Mobile Menu Trigger */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-2 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Minimalist text-based web logo */}
              <div
                onClick={() => setActiveTab('home')}
                className="flex items-center gap-2 cursor-pointer group select-none"
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold shadow-xs">
                  <Zap className="w-4 h-4 text-white fill-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base tracking-tight text-zinc-950 group-hover:text-zinc-700 transition-colors">
                    Campus Pulse
                  </span>
                  <span className="hidden sm:block text-[10px] text-zinc-400 font-mono -mt-1">
                    Student & Senior Hub
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'home'
                    ? 'bg-zinc-900 text-white shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('explore')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'explore'
                    ? 'bg-zinc-900 text-white shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                Explore & Alumni
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'messages'
                    ? 'bg-zinc-900 text-white shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                <span>Messages</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-zinc-900 text-white shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                Profile & Saved
              </button>
            </nav>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-sm mx-4">
              <div className="relative w-full flex items-center">
                <Search className="w-4 h-4 absolute left-3 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search clubs, notes, seniors, jobs..."
                  className="w-full pl-9 pr-20 py-1.5 text-xs bg-zinc-100 hover:bg-zinc-100/80 focus:bg-white text-zinc-900 placeholder-zinc-400 border border-zinc-200 focus:border-zinc-400 rounded-lg transition-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => onOpenAiModal()}
                  className="absolute right-1 px-2 py-0.5 text-[11px] font-semibold text-zinc-700 bg-white border border-zinc-200 rounded hover:bg-zinc-50 flex items-center gap-1 shadow-2xs cursor-pointer"
                  title="Ask Campus AI Assistant"
                >
                  <Sparkles className="w-3 h-3 text-zinc-900" />
                  <span>Ask AI</span>
                </button>
              </div>
            </div>

            {/* Zone 3: Actions (AI, Notifications, Profile) */}
            <div className="flex items-center gap-2">
              {/* Mobile Search Icon Toggle */}
              <button
                type="button"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden p-2 text-zinc-600 hover:text-zinc-950 rounded-lg hover:bg-zinc-100 transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Instant AI Button (visible on mobile / tablet) */}
              <button
                type="button"
                onClick={() => onOpenAiModal()}
                className="inline-flex md:hidden items-center gap-1 px-2.5 py-1 text-xs font-semibold text-zinc-950 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-zinc-900" />
                <span>AI</span>
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                  aria-label="Alerts"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-zinc-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between px-2 pb-2 border-b border-zinc-100">
                      <span className="text-xs font-bold text-zinc-900">Campus Alerts</span>
                      <span className="text-[10px] text-zinc-400 font-mono">3 unread</span>
                    </div>
                    <div className="divide-y divide-zinc-100 max-h-72 overflow-y-auto mt-1">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-2.5 hover:bg-zinc-50 rounded-xl transition-colors">
                          <p className="text-xs font-semibold text-zinc-900">{n.title}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{n.text}</p>
                          <span className="text-[10px] font-mono text-zinc-400 block mt-1">
                            {n.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar & Menu Button */}
              <button
                type="button"
                onClick={onOpenRegisterModal}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-all cursor-pointer"
                title="Edit Academic Profile & Preferences"
              >
                <div className="w-7 h-7 rounded-lg bg-zinc-950 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white shadow-2xs">
                  {initials}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-semibold text-zinc-900 block leading-tight">
                    {firstName}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono block leading-none">
                    {shortYear} · {student.branch.split(' ')[0]}
                  </span>
                </div>
              </button>

              {/* Landing / Logout Quick Switch */}
              <button
                type="button"
                onClick={onSwitchToLanding}
                className="hidden xl:flex p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                title="View Onboarding Landing Page"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Search Drawer */}
          {mobileSearchOpen && (
            <div className="md:hidden pb-3 pt-1 border-t border-zinc-100 animate-in fade-in duration-150">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search clubs, study notes, seniors..."
                  className="w-full pl-9 pr-16 py-2 text-xs bg-zinc-100 text-zinc-900 placeholder-zinc-400 border border-zinc-200 rounded-lg focus:outline-none focus:bg-white"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setMobileSearchOpen(false);
                    onOpenAiModal(searchQuery);
                  }}
                  className="absolute right-1 top-1 px-2.5 py-1 text-xs font-semibold text-white bg-zinc-900 rounded shadow-xs"
                >
                  AI
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Slide-in Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 border-r border-zinc-200">
            {/* Header User Card */}
            <div className="p-5 bg-zinc-950 text-white relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-zinc-800 flex items-center justify-center font-bold text-white ring-2 ring-white">
                  {initials}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{studentName}</h3>
                  <p className="text-xs text-zinc-400">{student.branch}</p>
                  <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
                    {student.classYear.split(' ')[0]} · {student.division} · {student.rollNo}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenRegisterModal();
                }}
                className="mt-3.5 w-full py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Academic Profile</span>
              </button>
            </div>

            {/* Navigation Options */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-3 py-1">
                Navigation
              </p>
              <button
                onClick={() => {
                  setActiveTab('home');
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  activeTab === 'home'
                    ? 'bg-zinc-950 text-white'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button
                onClick={() => {
                  setActiveTab('explore');
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  activeTab === 'explore'
                    ? 'bg-zinc-950 text-white'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  <span>Explore & Alumni</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button
                onClick={() => {
                  setActiveTab('messages');
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  activeTab === 'messages'
                    ? 'bg-zinc-950 text-white'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Messages & Mentors</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </button>

              <button
                onClick={() => {
                  setActiveTab('profile');
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  activeTab === 'profile'
                    ? 'bg-zinc-950 text-white'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Profile & Saved</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <div className="pt-4 border-t border-zinc-100">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onSwitchToLanding();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Back to Landing Page</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
