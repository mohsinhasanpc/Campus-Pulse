'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Bot, Loader2, HelpCircle, Zap } from 'lucide-react';
import { StudentProfile } from '@/lib/types';
import { getFastCampusAnswer } from '@/lib/aiFastResponses';

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  initialPrompt?: string;
}

interface MessageItem {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  speed?: string;
}

export default function AiAdvisorModal({
  isOpen,
  onClose,
  student,
  initialPrompt,
}: AiAdvisorModalProps) {
  const [input, setInput] = useState(initialPrompt || '');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello ${student.name.split(' ')[0]}! 👋 I'm your **CampusPulse Fast AI Advisor**.\n\nAll club leads and committee heads (GDSC, Robotics, ACM, IEEE, E-Cell) have submitted their official guidelines, workshop agendas, and recruitment roadmaps.\n\nAsk me anything about which clubs fit your **${student.branch}** degree, workshop prerequisites, or career paths!`,
      timestamp: 'Just now',
      speed: '⚡ 0.01s',
    },
  ]);

  const counterRef = useRef(1);
  const localCacheRef = useRef<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isOpen]);

  const quickPrompts = [
    `Which club is best for a 1st year ${student.branch.split(' ')[0]} student?`,
    'What are the prerequisites for the upcoming Autonomous Robotics workshop?',
    'How do I join the GDSC or ACM Core Team as a freshman?',
    'What programming languages should I learn first semester?',
    'How to balance college studies with club activities?',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const count = counterRef.current++;
    const userMsg: MessageItem = {
      id: `user-msg-${count}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    const normKey = textToSend.trim().toLowerCase();

    // 1. Instant Cache Check (0ms)
    const cached = localCacheRef.current[normKey];
    if (cached) {
      const aiCount = counterRef.current++;
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-msg-${aiCount}`,
          sender: 'ai',
          text: cached,
          timestamp: 'Just now',
          speed: '⚡ Instant (Cache)',
        },
      ]);
      return;
    }

    // 2. High-speed local campus intent match (sub-millisecond reply)
    const fastMatch = getFastCampusAnswer(textToSend, student);
    if (fastMatch.matched) {
      localCacheRef.current[normKey] = fastMatch.reply;
      const aiCount = counterRef.current++;
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-msg-${aiCount}`,
          sender: 'ai',
          text: fastMatch.reply,
          timestamp: 'Just now',
          speed: '⚡ Fast Reply',
        },
      ]);
      return;
    }

    // 3. Fast Server AI Query (Target < 2s)
    setLoading(true);
    const aiMsgId = `ai-msg-${counterRef.current++}`;

    try {
      const res = await fetch('/api/gemini/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          studentProfile: student,
        }),
      });

      const data = await res.json();
      const answer = data.reply || 'Campus leads recommend exploring the Explore tab for active workshops.';
      localCacheRef.current[normKey] = answer;

      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          sender: 'ai',
          text: answer,
          timestamp: 'Just now',
          speed: '⚡ Fast Reply',
        },
      ]);
    } catch (err) {
      console.error(err);
      const fallback = `**Campus Guidance:**\n\n• GDSC: Best for full-stack web and cloud apps.\n• Robotics (RAS): Best for microcontrollers and hardware.\n• ACM: Best for algorithms and competitive coding.\n\nExplore upcoming bootcamps on the **Explore** tab!`;
      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          sender: 'ai',
          text: fallback,
          timestamp: 'Just now',
          speed: '⚡ Fast Knowledge',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92dvh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Campus AI Advisor</h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <Zap className="w-2.5 h-2.5 text-emerald-300 fill-emerald-300" />
                  Fast Replies
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                Official FAQs & leadership guidance for freshmen & juniors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-indigo-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-50 border-b border-slate-200/80 overflow-x-auto scrollbar-none flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Popular:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs px-2.5 py-1 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 rounded-lg whitespace-nowrap transition-colors shadow-2xs shrink-0 cursor-pointer"
            >
              {prompt.length > 38 ? `${prompt.slice(0, 38)}...` : prompt}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200/80 text-slate-800 shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line prose-sm">{msg.text}</div>
                <div
                  className={`text-[10px] mt-2 flex items-center justify-between gap-2 ${
                    msg.sender === 'user' ? 'text-indigo-200 justify-end' : 'text-slate-400'
                  }`}
                >
                  {msg.speed && (
                    <span className="text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                      {msg.speed}
                    </span>
                  )}
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start items-center text-slate-500 text-xs">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-2xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Gathering lightning-fast response...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Query Input Box */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about clubs, eligibility, workshop dates..."
              className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-900 placeholder-slate-400 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
