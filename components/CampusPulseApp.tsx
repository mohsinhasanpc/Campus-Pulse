'use client';

import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import HomeTab from '@/components/HomeTab';
import ExploreTab from '@/components/ExploreTab';
import MessagesTab from '@/components/MessagesTab';
import ProfileTab from '@/components/ProfileTab';
import AiAdvisorModal from '@/components/AiAdvisorModal';
import RegisterModal from '@/components/RegisterModal';
import WorkshopModal from '@/components/WorkshopModal';
import CommunityModal from '@/components/CommunityModal';
import StudyMaterialModal from '@/components/StudyMaterialModal';
import OpportunityModal from '@/components/OpportunityModal';
import LandingOnboardingView from '@/components/LandingOnboardingView';

import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_COMMUNITIES,
  INITIAL_WORKSHOPS,
  INITIAL_STUDY_MATERIALS,
  INITIAL_CAMPUS_CALENDAR,
  INITIAL_MENTORS_PEERS,
  INITIAL_ALUMNI,
  INITIAL_OPPORTUNITIES,
  INITIAL_COMMUNITY_CHATS,
  INITIAL_DIRECT_CHATS,
} from '@/lib/data';

import {
  StudentProfile,
  Community,
  WorkshopOrEvent,
  MentorPeer,
  ChatMessage,
  StudyMaterial,
  CampusCalendarItem,
  AlumniProfile,
  CareerOpportunity,
} from '@/lib/types';
import { getFastCampusAnswer } from '@/lib/aiFastResponses';
import {
  Home,
  Compass,
  MessageSquare,
  User,
  Zap,
  Sparkles,
  BookOpen,
  Calendar,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function CampusPulseApp() {
  // Application View Mode ('app' or 'landing')
  const [currentView, setCurrentView] = useState<'app' | 'landing'>('app');

  // Application Data State
  const [student, setStudent] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [communities, setCommunities] = useState<Community[]>(INITIAL_COMMUNITIES);
  const [workshops, setWorkshops] = useState<WorkshopOrEvent[]>(INITIAL_WORKSHOPS);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(INITIAL_STUDY_MATERIALS);
  const [calendarItems, setCalendarItems] = useState<CampusCalendarItem[]>(INITIAL_CAMPUS_CALENDAR);
  const [mentorsPeers, setMentorsPeers] = useState<MentorPeer[]>(INITIAL_MENTORS_PEERS);
  const [alumni, setAlumni] = useState<AlumniProfile[]>(INITIAL_ALUMNI);
  const [opportunities, setOpportunities] = useState<CareerOpportunity[]>(INITIAL_OPPORTUNITIES);
  const [communityChats, setCommunityChats] = useState<Record<string, ChatMessage[]>>(INITIAL_COMMUNITY_CHATS);
  const [directChats, setDirectChats] = useState<Record<string, ChatMessage[]>>(INITIAL_DIRECT_CHATS);

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Chat Selection State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>(undefined);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const [selectedWorkshop, setSelectedWorkshop] = useState<WorkshopOrEvent | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [selectedStudyMaterial, setSelectedStudyMaterial] = useState<StudyMaterial | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<CareerOpportunity | null>(null);

  const [selectedChatType, setSelectedChatType] = useState<'community' | 'direct'>('community');
  const [selectedChatId, setSelectedChatId] = useState<string>('comm-1');
  const [mobileShowChat, setMobileShowChat] = useState<boolean>(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Workshop Registration Toggle
  const handleToggleRegister = (workshopId: string) => {
    setWorkshops((prev) =>
      prev.map((w) => {
        if (w.id === workshopId) {
          const nextRegistered = !w.registered;
          const nextSeats = nextRegistered ? Math.max(0, w.seatsLeft - 1) : w.seatsLeft + 1;

          setStudent((s) => {
            const historyExists = s.history.some((h) => h.id === `h-${workshopId}`);
            let newHistory = [...s.history];

            if (nextRegistered) {
              if (!historyExists) {
                newHistory.unshift({
                  id: `h-${workshopId}`,
                  title: w.title,
                  type: w.type,
                  date: w.date.split(',')[1] || w.date,
                  status: 'Registered',
                  communityName: w.communityName,
                });
              }
            } else {
              newHistory = newHistory.filter((h) => h.id !== `h-${workshopId}`);
            }

            return {
              ...s,
              stats: {
                ...s.stats,
                activityScore: nextRegistered
                  ? s.stats.activityScore + 10
                  : Math.max(0, s.stats.activityScore - 10),
              },
              history: newHistory,
            };
          });

          showToast(nextRegistered ? `Registered for ${w.title}!` : `Cancelled registration for ${w.title}`);
          return { ...w, registered: nextRegistered, seatsLeft: nextSeats };
        }
        return w;
      })
    );
  };

  // Workshop Bookmark Toggle
  const handleToggleBookmark = (id: string) => {
    setStudent((s) => {
      const exists = s.favourites.includes(id);
      const updated = exists ? s.favourites.filter((favId) => favId !== id) : [...s.favourites, id];
      showToast(exists ? 'Removed from saved workshops' : 'Saved workshop to favorites');
      return { ...s, favourites: updated };
    });
  };

  // Study Material Bookmark Toggle
  const handleToggleBookmarkMaterial = (id: string) => {
    setStudent((s) => {
      const exists = s.bookmarkedMaterials?.includes(id);
      const currentList = s.bookmarkedMaterials || [];
      const updated = exists ? currentList.filter((mId) => mId !== id) : [...currentList, id];
      showToast(exists ? 'Removed from saved notes' : 'Bookmarked study material!');
      return { ...s, bookmarkedMaterials: updated };
    });
  };

  // Join Community Toggle
  const handleToggleJoinCommunity = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === communityId) {
          const nextJoined = !c.joined;
          const nextMembers = nextJoined ? c.membersCount + 1 : c.membersCount - 1;

          setStudent((s) => ({
            ...s,
            stats: {
              ...s.stats,
              communitiesJoined: nextJoined
                ? s.stats.communitiesJoined + 1
                : Math.max(0, s.stats.communitiesJoined - 1),
            },
          }));

          showToast(nextJoined ? `Joined ${c.shortCode} Chapter!` : `Left ${c.shortCode}`);
          return { ...c, joined: nextJoined, membersCount: nextMembers };
        }
        return c;
      })
    );
  };

  // Connect Mentor / Peer Toggle
  const handleToggleConnectUser = (userId: string) => {
    setMentorsPeers((prev) =>
      prev.map((p) => {
        if (p.id === userId) {
          const nextConnected = !p.connected;
          setStudent((s) => ({
            ...s,
            stats: {
              ...s.stats,
              networkCount: nextConnected ? s.stats.networkCount + 1 : s.stats.networkCount - 1,
            },
          }));
          showToast(nextConnected ? `Connected with ${p.name}!` : `Removed connection`);
          return { ...p, connected: nextConnected };
        }
        return p;
      })
    );
  };

  // Connect Alumni Mentor Toggle
  const handleToggleConnectAlumni = (alumniId: string) => {
    setAlumni((prev) =>
      prev.map((a) => {
        if (a.id === alumniId) {
          const nextConnected = !a.connected;
          setStudent((s) => ({
            ...s,
            stats: {
              ...s.stats,
              networkCount: nextConnected ? s.stats.networkCount + 1 : s.stats.networkCount - 1,
            },
          }));
          showToast(nextConnected ? `Mentorship request sent to ${a.name}!` : `Request withdrawn`);
          return { ...a, connected: nextConnected };
        }
        return a;
      })
    );
  };

  // Start direct chat with user or alumni
  const handleStartChatWithUser = (user: MentorPeer) => {
    setSelectedChatType('direct');
    setSelectedChatId(user.id);
    setMobileShowChat(true);
    setActiveTab('messages');
  };

  const handleStartChatWithAlumni = (alumnus: AlumniProfile) => {
    setSelectedChatType('direct');
    setSelectedChatId(alumnus.id);
    setMobileShowChat(true);
    setActiveTab('messages');
  };

  // Apply to opportunity
  const handleApplyOpportunity = (id: string) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, applied: true } : o))
    );
    showToast('Application submitted successfully!');
  };

  // Send message
  const handleSendMessage = (channelId: string, text: string, isDirect: boolean) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId,
      senderName: student.name,
      senderRole: 'FE Junior',
      avatar: student.avatar,
      timestamp: 'Just now',
      content: text,
      isMine: true,
    };

    if (channelId === 'ai-advisor') {
      const fastResult = getFastCampusAnswer(text, student);
      const replyMsg: ChatMessage = {
        id: `ai-reply-${Date.now()}`,
        channelId: 'ai-advisor',
        senderName: 'CampusPulse AI Guide',
        senderRole: 'AI Campus Guide · Online',
        avatar: '',
        timestamp: 'Just now',
        content:
          fastResult.matched
            ? fastResult.reply
            : `Based on your profile as a ${student.classYear.split(' ')[0]} ${student.branch} junior, I recommend checking the GDSC and ACM problem circles. Also make sure to review the C Programming lab handbook in the Study Materials section!`,
      };

      setDirectChats((prev) => ({
        ...prev,
        [channelId]: [...(prev[channelId] || []), newMsg, replyMsg],
      }));
      return;
    }

    if (isDirect) {
      setDirectChats((prev) => ({
        ...prev,
        [channelId]: [...(prev[channelId] || []), newMsg],
      }));
    } else {
      setCommunityChats((prev) => ({
        ...prev,
        [channelId]: [...(prev[channelId] || []), newMsg],
      }));
    }
  };

  // If user is viewing the landing / multi-step onboarding
  if (currentView === 'landing') {
    return (
      <LandingOnboardingView
        initialStudent={student}
        onComplete={(newStudent) => {
          setStudent(newStudent);
          setCurrentView('app');
          showToast(`Welcome aboard, ${newStudent.name}!`);
        }}
      />
    );
  }

  const registeredWorkshopsCount = workshops.filter((w) => w.registered).length;

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 flex flex-col antialiased selection:bg-zinc-800 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-zinc-950 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        student={student}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiModal={(prompt) => {
          setAiInitialPrompt(prompt);
          setIsAiModalOpen(true);
        }}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onSwitchToLanding={() => setCurrentView('landing')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        unreadCount={2}
      />

      {/* App Body with Desktop Left Sidebar + Main Content Viewport */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* DESKTOP SIDEBAR NAVIGATION (240px - 260px) */}
        <aside className="hidden lg:flex flex-col w-60 shrink-0 space-y-6 select-none">
          {/* Student Profile Card Snippet */}
          <div className="p-4 bg-white rounded-2xl border border-zinc-200/90 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white font-extrabold text-sm flex items-center justify-center ring-2 ring-white shadow-xs">
                {student.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-zinc-950 truncate">{student.name}</h4>
                <p className="text-[11px] text-zinc-500 truncate">{student.branch.split(' ')[0]}</p>
                <p className="text-[10px] font-mono text-zinc-400 mt-0.5">{student.rollNo}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 text-center text-xs">
              <div className="bg-zinc-50 py-1.5 rounded-lg border border-zinc-100">
                <span className="text-[10px] text-zinc-400 font-mono block">Score</span>
                <span className="font-bold text-zinc-950 tabular-nums">{student.stats.activityScore}</span>
              </div>
              <div className="bg-zinc-50 py-1.5 rounded-lg border border-zinc-100">
                <span className="text-[10px] text-zinc-400 font-mono block">Clubs</span>
                <span className="font-bold text-zinc-950 tabular-nums">{student.stats.communitiesJoined}</span>
              </div>
            </div>

            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="w-full py-1.5 rounded-lg text-xs font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors border border-zinc-200"
            >
              Edit Academic Info
            </button>
          </div>

          {/* Sidebar Nav Links */}
          <nav className="space-y-1">
            <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block mb-1">
              Workspace
            </span>

            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-zinc-950 text-white shadow-2xs'
                  : 'text-zinc-700 hover:bg-zinc-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
              {activeTab === 'home' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>

            <button
              onClick={() => setActiveTab('explore')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-zinc-950 text-white shadow-2xs'
                  : 'text-zinc-700 hover:bg-zinc-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4" />
                <span>Explore & Alumni</span>
              </div>
              {activeTab === 'explore' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-zinc-950 text-white shadow-2xs'
                  : 'text-zinc-700 hover:bg-zinc-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>Messages & Mentors</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-zinc-950 text-white shadow-2xs'
                  : 'text-zinc-700 hover:bg-zinc-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4" />
                <span>Profile & Saved</span>
              </div>
              {activeTab === 'profile' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          </nav>

          {/* Quick Academic Tools Links */}
          <div className="p-3.5 bg-white rounded-2xl border border-zinc-200/80 space-y-2 text-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
              Quick Shortcuts
            </span>
            <button
              onClick={() => {
                setActiveTab('home');
              }}
              className="w-full text-left text-zinc-600 hover:text-zinc-950 hover:underline flex items-center gap-1.5 py-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              <span>Study Notes & Repo</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('explore');
              }}
              className="w-full text-left text-zinc-600 hover:text-zinc-950 hover:underline flex items-center gap-1.5 py-1"
            >
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>SIH Hackathon & Jobs</span>
            </button>
            <button
              onClick={() => {
                setAiInitialPrompt('Can you suggest a weekly study plan for FE computer engineering?');
                setIsAiModalOpen(true);
              }}
              className="w-full text-left text-zinc-900 font-semibold flex items-center gap-1.5 py-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
              <span>AI Study Planner</span>
            </button>
          </div>

          {/* Bottom Switch to Landing */}
          <div className="pt-2 mt-auto">
            <button
              onClick={() => setCurrentView('landing')}
              className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Onboarding Landing Page</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT VIEWPORT */}
        <main className="flex-1 min-w-0">
          {activeTab === 'home' && (
            <HomeTab
              student={student}
              communities={communities}
              workshops={workshops}
              studyMaterials={studyMaterials}
              calendarItems={calendarItems}
              onOpenWorkshop={(ws) => setSelectedWorkshop(ws)}
              onOpenCommunity={(c) => setSelectedCommunity(c)}
              onOpenStudyMaterial={(mat) => setSelectedStudyMaterial(mat)}
              onOpenAiModal={(prompt) => {
                setAiInitialPrompt(prompt);
                setIsAiModalOpen(true);
              }}
              onToggleRegister={handleToggleRegister}
              onToggleBookmark={handleToggleBookmark}
              onToggleBookmarkMaterial={handleToggleBookmarkMaterial}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'explore' && (
            <ExploreTab
              communities={communities}
              workshops={workshops}
              mentorsPeers={mentorsPeers}
              alumni={alumni}
              opportunities={opportunities}
              student={student}
              onOpenWorkshop={(ws) => setSelectedWorkshop(ws)}
              onOpenCommunity={(c) => setSelectedCommunity(c)}
              onOpenOpportunity={(opp) => setSelectedOpportunity(opp)}
              onToggleJoinCommunity={handleToggleJoinCommunity}
              onToggleRegisterWorkshop={handleToggleRegister}
              onToggleBookmarkWorkshop={handleToggleBookmark}
              onToggleConnectUser={handleToggleConnectUser}
              onToggleConnectAlumni={handleToggleConnectAlumni}
              onStartChatWithUser={handleStartChatWithUser}
              onStartChatWithAlumni={handleStartChatWithAlumni}
              searchFilter={searchQuery}
            />
          )}

          {activeTab === 'messages' && (
            <MessagesTab
              student={student}
              communities={communities}
              mentorsPeers={mentorsPeers}
              alumni={alumni}
              communityChats={communityChats}
              directChats={directChats}
              onSendMessage={handleSendMessage}
              onOpenAiModal={() => setIsAiModalOpen(true)}
              selectedType={selectedChatType}
              selectedId={selectedChatId}
              onSelectConversation={(type, id) => {
                setSelectedChatType(type);
                setSelectedChatId(id);
                setMobileShowChat(true);
              }}
              mobileShowChat={mobileShowChat}
              setMobileShowChat={setMobileShowChat}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileTab
              student={student}
              workshops={workshops}
              communities={communities}
              studyMaterials={studyMaterials}
              onOpenEditModal={() => setIsRegisterModalOpen(true)}
              onOpenWorkshop={(ws) => setSelectedWorkshop(ws)}
              onOpenCommunity={(c) => setSelectedCommunity(c)}
              onOpenStudyMaterial={(mat) => setSelectedStudyMaterial(mat)}
              onToggleBookmark={handleToggleBookmark}
              onToggleBookmarkMaterial={handleToggleBookmarkMaterial}
            />
          )}
        </main>
      </div>

      {/* Floating "Ask AI" Assistant FAB (Desktop & Tablet) */}
      <button
        onClick={() => setIsAiModalOpen(true)}
        className="hidden md:flex fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full bg-zinc-950 text-white hover:bg-zinc-800 transition-all items-center gap-2 shadow-xl ring-2 ring-white cursor-pointer hover:scale-105 active:scale-95 text-xs font-bold"
        aria-label="Ask Campus AI Guide"
      >
        <Sparkles className="w-4 h-4 text-white" />
        <span>Ask Campus AI</span>
      </button>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        unreadCount={2}
      />

      {/* MODALS */}
      <AiAdvisorModal
        isOpen={isAiModalOpen}
        onClose={() => {
          setIsAiModalOpen(false);
          setAiInitialPrompt(undefined);
        }}
        student={student}
        initialPrompt={aiInitialPrompt}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        student={student}
        onSave={(updated) => {
          setStudent(updated);
          showToast('Updated academic registration profile!');
        }}
      />

      <WorkshopModal
        workshop={selectedWorkshop}
        isOpen={Boolean(selectedWorkshop)}
        onClose={() => setSelectedWorkshop(null)}
        onToggleRegister={handleToggleRegister}
        onToggleBookmark={handleToggleBookmark}
        isBookmarked={Boolean(selectedWorkshop && student.favourites.includes(selectedWorkshop.id))}
      />

      <CommunityModal
        community={selectedCommunity}
        isOpen={Boolean(selectedCommunity)}
        onClose={() => setSelectedCommunity(null)}
        onToggleJoin={handleToggleJoinCommunity}
        onAskAiAboutClub={(clubName) => {
          setSelectedCommunity(null);
          setAiInitialPrompt(`Tell me more about ${clubName} recruitment and junior opportunities`);
          setIsAiModalOpen(true);
        }}
      />

      <StudyMaterialModal
        material={selectedStudyMaterial}
        isOpen={Boolean(selectedStudyMaterial)}
        onClose={() => setSelectedStudyMaterial(null)}
        isBookmarked={Boolean(
          selectedStudyMaterial &&
            student.bookmarkedMaterials?.includes(selectedStudyMaterial.id)
        )}
        onToggleBookmark={handleToggleBookmarkMaterial}
      />

      <OpportunityModal
        opportunity={selectedOpportunity}
        isOpen={Boolean(selectedOpportunity)}
        onClose={() => setSelectedOpportunity(null)}
        onApply={handleApplyOpportunity}
      />
    </div>
  );
}
