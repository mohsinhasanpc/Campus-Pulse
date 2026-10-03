'use client';

import React from 'react';
import { Home, Compass, MessageSquare, User, Sparkles } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiModal: () => void;
  unreadCount?: number;
}

export default function BottomNav({
  activeTab,
  setActiveTab,
  onOpenAiModal,
  unreadCount = 2,
}: BottomNavProps) {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: Compass,
    },
    {
      id: 'ai-fab',
      label: 'Ask AI',
      icon: Sparkles,
      isSpecial: true,
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      badge: unreadCount,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-zinc-200 pb-safe lg:hidden shadow-lg"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isSpecial) {
            return (
              <button
                key={tab.id}
                onClick={onOpenAiModal}
                className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] relative -top-2 group focus:outline-none cursor-pointer"
                aria-label="Ask AI Campus Advisor"
              >
                <div className="w-11 h-11 rounded-full bg-zinc-950 flex items-center justify-center text-white shadow-md group-active:scale-95 transition-transform ring-2 ring-white">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] font-semibold text-zinc-950 mt-0.5">
                  Ask AI
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors relative cursor-pointer ${
                isActive
                  ? 'text-zinc-950 font-bold'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-emerald-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 bg-zinc-950 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
