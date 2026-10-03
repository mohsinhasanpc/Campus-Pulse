'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Send,
  Search,
  Users,
  Sparkles,
  Pin,
  CheckCheck,
  ArrowLeft,
  Bot,
  Hash,
  User,
  Paperclip,
  Smile,
  ShieldAlert,
} from 'lucide-react';
import {
  Community,
  MentorPeer,
  ChatMessage,
  StudentProfile,
  AlumniProfile,
} from '@/lib/types';

interface MessagesTabProps {
  student: StudentProfile;
  communities: Community[];
  mentorsPeers: MentorPeer[];
  alumni: AlumniProfile[];
  communityChats: Record<string, ChatMessage[]>;
  directChats: Record<string, ChatMessage[]>;
  onSendMessage: (channelId: string, text: string, isDirect: boolean) => void;
  onOpenAiModal: () => void;
  selectedType: 'community' | 'direct';
  selectedId: string;
  onSelectConversation: (type: 'community' | 'direct', id: string) => void;
  mobileShowChat: boolean;
  setMobileShowChat: (show: boolean) => void;
}

export default function MessagesTab({
  student,
  communities,
  mentorsPeers,
  alumni,
  communityChats,
  directChats,
  onSendMessage,
  onOpenAiModal,
  selectedType,
  selectedId,
  onSelectConversation,
  mobileShowChat,
  setMobileShowChat,
}: MessagesTabProps) {
  const [inputMessage, setInputMessage] = useState<string>('');
  const [searchChannel, setSearchChannel] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const joinedCommunities = communities.filter((c) => c.joined);
  const currentCommunity = communities.find((c) => c.id === selectedId);
  const currentDirect =
    mentorsPeers.find((p) => p.id === selectedId) ||
    alumni.find((a) => a.id === selectedId);

  const currentMessages = useMemo(() => {
    return selectedType === 'community'
      ? communityChats[selectedId] || []
      : directChats[selectedId] || [];
  }, [selectedType, selectedId, communityChats, directChats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, selectedId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    onSendMessage(selectedId, inputMessage.trim(), selectedType === 'direct');
    setInputMessage('');
  };

  const getChatTitle = () => {
    if (selectedType === 'community') {
      return currentCommunity ? `# ${currentCommunity.name}` : '# General Chapter';
    }
    if (selectedId === 'ai-advisor') {
      return 'CampusPulse AI Academic Advisor';
    }
    return currentDirect ? currentDirect.name : 'Direct Message';
  };

  const getChatSubtitle = () => {
    if (selectedType === 'community') {
      return currentCommunity
        ? `${currentCommunity.membersCount} members · Lead: ${currentCommunity.leadName}`
        : 'Community Chat';
    }
    if (selectedId === 'ai-advisor') {
      return 'Instant Answers · Club Charters · Eligibility & Syllabus';
    }
    return currentDirect
      ? 'company' in currentDirect
        ? `${currentDirect.currentRole} @ ${(currentDirect as AlumniProfile).company}`
        : `${(currentDirect as MentorPeer).role} · ${(currentDirect as MentorPeer).branch}`
      : 'Active conversation';
  };

  return (
    <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-xs flex flex-col md:flex-row h-[calc(100dvh-150px)] sm:h-[78vh] sm:min-h-[580px]">
      {/* 1. SIDEBAR: Channels & Direct Messages (Collapsible on mobile) */}
      <div
        className={`w-full md:w-80 lg:w-88 border-r border-zinc-200 flex flex-col bg-zinc-50/70 shrink-0 ${
          mobileShowChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Sidebar Header & Search */}
        <div className="p-4 border-b border-zinc-200 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-950">Messages & Discussions</h2>
            <button
              onClick={onOpenAiModal}
              className="text-xs px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
              <span>Ask AI</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              value={searchChannel}
              onChange={(e) => setSearchChannel(e.target.value)}
              placeholder="Search chapters or mentors..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-100 border border-zinc-200 rounded-lg focus:bg-white focus:outline-none focus:border-zinc-400 transition-colors"
            />
          </div>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4 divide-y divide-zinc-200/60">
          {/* AI Advisor Channel (Pinned) */}
          <div className="pt-1">
            <div className="px-2 py-1 flex items-center justify-between text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
              <span>Campus Guide</span>
              <span className="text-emerald-600 font-sans text-[10px] font-semibold">Online 24/7</span>
            </div>

            <button
              onClick={() => onSelectConversation('direct', 'ai-advisor')}
              className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center gap-3 border mt-1 cursor-pointer ${
                selectedId === 'ai-advisor'
                  ? 'bg-zinc-950 text-white border-zinc-950 shadow-2xs'
                  : 'bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-900'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0 relative">
                <Bot className="w-4 h-4 text-white" />
                <span className="w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-white absolute -bottom-0.5 -right-0.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold truncate">CampusPulse AI Guide</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                    BOT
                  </span>
                </div>
                <p className={`text-[11px] truncate mt-0.5 ${selectedId === 'ai-advisor' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                  Ask about club dates, roadmaps & study guides
                </p>
              </div>
            </button>
          </div>

          {/* Communities Group Section */}
          <div className="pt-3">
            <div className="px-2 py-1 flex items-center justify-between text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
              <span>Joined Communities</span>
              <span className="text-zinc-400 font-sans text-[10px]">{joinedCommunities.length}</span>
            </div>

            <div className="space-y-1 mt-1">
              {joinedCommunities.map((comm) => (
                <button
                  key={comm.id}
                  onClick={() => onSelectConversation('community', comm.id)}
                  className={`w-full px-3 py-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${
                    selectedType === 'community' && selectedId === comm.id
                      ? 'bg-zinc-950 text-white shadow-2xs'
                      : 'hover:bg-zinc-100 text-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Hash className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span className="text-xs font-semibold truncate">{comm.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                    {comm.shortCode}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Messages Section */}
          <div className="pt-3">
            <div className="px-2 py-1 flex items-center justify-between text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
              <span>Direct Messages</span>
              <span className="text-zinc-400 font-sans text-[10px]">
                {mentorsPeers.filter((p) => p.connected).length} Mentors
              </span>
            </div>

            <div className="space-y-1 mt-1">
              {/* Mentors & Peers */}
              {mentorsPeers.map((person) => (
                <button
                  key={person.id}
                  onClick={() => onSelectConversation('direct', person.id)}
                  className={`w-full p-2 rounded-xl text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                    selectedType === 'direct' && selectedId === person.id
                      ? 'bg-zinc-950 text-white shadow-2xs'
                      : 'hover:bg-zinc-100 text-zinc-800'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-zinc-200"
                    />
                    <span className="w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white absolute -bottom-0.5 -right-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold truncate">{person.name}</span>
                      <span className="text-[9px] font-mono text-zinc-400">
                        {person.role.split(' ')[0]}
                      </span>
                    </div>
                    <p className={`text-[11px] truncate mt-0.5 ${selectedType === 'direct' && selectedId === person.id ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      {person.branch.split(' ')[0]}
                    </p>
                  </div>
                </button>
              ))}

              {/* Alumni Mentors */}
              {alumni.map((alum) => (
                <button
                  key={alum.id}
                  onClick={() => onSelectConversation('direct', alum.id)}
                  className={`w-full p-2 rounded-xl text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                    selectedType === 'direct' && selectedId === alum.id
                      ? 'bg-zinc-950 text-white shadow-2xs'
                      : 'hover:bg-zinc-100 text-zinc-800'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={alum.avatar}
                      alt={alum.name}
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-zinc-200"
                    />
                    <span className="w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white absolute -bottom-0.5 -right-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold truncate">{alum.name}</span>
                      <span className="text-[9px] font-mono text-zinc-400">Alumni</span>
                    </div>
                    <p className={`text-[11px] truncate mt-0.5 ${selectedType === 'direct' && selectedId === alum.id ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      @{alum.company}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CHAT AREA (Readability prioritized, Slack/Discord inspired) */}
      <div
        className={`flex-1 flex flex-col bg-white ${
          !mobileShowChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Chat Window Header */}
        <div className="h-16 px-4 sm:px-6 border-b border-zinc-200 flex items-center justify-between bg-white z-10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile back to sidebar button */}
            <button
              onClick={() => setMobileShowChat(false)}
              className="md:hidden p-1.5 rounded-lg text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
              aria-label="Back to channels"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="space-y-0.5 min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-zinc-950 truncate">
                {getChatTitle()}
              </h3>
              <p className="text-[11px] text-zinc-500 truncate">{getChatSubtitle()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {selectedId === 'ai-advisor' && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
                <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
                <span>AI Grounded</span>
              </span>
            )}
          </div>
        </div>

        {/* Message Log List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-zinc-50/40">
          {/* Welcome Intro Box per chat */}
          <div className="text-center py-4 px-6 max-w-md mx-auto text-xs text-zinc-500 bg-white rounded-2xl border border-zinc-200/80 shadow-2xs space-y-1">
            <p className="font-semibold text-zinc-900">
              {selectedType === 'community'
                ? `Welcome to #${getChatTitle().replace('# ', '')}`
                : `Conversation with ${getChatTitle()}`}
            </p>
            <p className="text-zinc-500 text-[11px]">
              This channel connects juniors directly with senior leads for workshop discussions, project reviews, and academic guidance.
            </p>
          </div>

          {currentMessages.map((msg) => {
            const isMe = msg.isMine;
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${
                  isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 select-none ring-1 ring-zinc-200">
                  {msg.senderName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>

                {/* Message Bubble & Metadata */}
                <div className={`space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`flex items-center gap-2 text-[11px] ${
                      isMe ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span className="font-bold text-zinc-900">{msg.senderName}</span>
                    <span className="text-zinc-400 font-mono">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.isAnnouncement
                        ? 'bg-amber-50 text-amber-950 border border-amber-200/80'
                        : isMe
                        ? 'bg-zinc-950 text-white rounded-tr-xs'
                        : 'bg-white text-zinc-900 border border-zinc-200 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Bar */}
        <div className="p-3 sm:p-4 border-t border-zinc-200 bg-white">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  selectedId === 'ai-advisor'
                    ? 'Ask AI: "Which club should I join for cloud and web development?"'
                    : `Message ${getChatTitle()}...`
                }
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-zinc-100 text-zinc-900 placeholder-zinc-400 rounded-xl border border-zinc-200 focus:bg-white focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-zinc-950 text-white font-semibold text-xs hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-zinc-950 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
