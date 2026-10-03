'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  Compass,
  ShieldCheck,
  BookOpen,
  Download,
  AlertCircle,
  FileText,
  Filter,
} from 'lucide-react';
import {
  StudentProfile,
  Community,
  WorkshopOrEvent,
  StudyMaterial,
  CampusCalendarItem,
} from '@/lib/types';

interface HomeTabProps {
  student: StudentProfile;
  communities: Community[];
  workshops: WorkshopOrEvent[];
  studyMaterials: StudyMaterial[];
  calendarItems: CampusCalendarItem[];
  onOpenWorkshop: (ws: WorkshopOrEvent) => void;
  onOpenCommunity: (c: Community) => void;
  onOpenStudyMaterial: (mat: StudyMaterial) => void;
  onOpenAiModal: (initialPrompt?: string) => void;
  onToggleRegister: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onToggleBookmarkMaterial: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function HomeTab({
  student,
  communities,
  workshops,
  studyMaterials,
  calendarItems,
  onOpenWorkshop,
  onOpenCommunity,
  onOpenStudyMaterial,
  onOpenAiModal,
  onToggleRegister,
  onToggleBookmark,
  onToggleBookmarkMaterial,
  setActiveTab,
}: HomeTabProps) {
  // Calendar Filter
  const [calendarFilter, setCalendarFilter] = useState<'All' | 'Exam' | 'Assignment' | 'Workshop' | 'Registered'>('All');
  // Study Materials Subject Filter
  const [subjectFilter, setSubjectFilter] = useState<string>('All');

  // Filter recommendations based on student's interested areas and subjects
  const recommendedWorkshops = workshops.filter((w) => {
    const matchesInterest = student.interestedAreas?.some((interest) =>
      w.tags.some(
        (t) =>
          interest.toLowerCase().includes(t.toLowerCase()) ||
          t.toLowerCase().includes(interest.toLowerCase())
      )
    );
    return w.isRecommended || matchesInterest;
  });

  const recommendedCommunities = communities.filter((c) => {
    const matchesTag = student.interestedAreas?.some((interest) =>
      c.tags.some((t) => t.toLowerCase().includes(interest.toLowerCase()))
    );
    return c.joined || matchesTag;
  });

  // Filter study materials
  const uniqueSubjects = ['All', ...Array.from(new Set(studyMaterials.map((m) => m.subject)))];
  const filteredMaterials = studyMaterials.filter((mat) => {
    if (subjectFilter === 'All') return true;
    return mat.subject === subjectFilter;
  });

  // Filter calendar items
  const filteredCalendar = calendarItems.filter((item) => {
    if (calendarFilter === 'All') return true;
    if (calendarFilter === 'Registered') {
      // Check if workshop with same title is registered
      return workshops.some((w) => w.registered && w.title.toLowerCase().includes(item.title.slice(0, 15).toLowerCase()));
    }
    return item.category === calendarFilter;
  });

  const firstName = student.name.split(' ')[0] || 'Junior';
  const shortYear = student.classYear.split(' ')[0] || 'FE';

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Personalized Welcome Greeting Banner */}
      <div className="bg-zinc-950 text-white rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-xl relative overflow-hidden">
        {/* Subtle geometric background texture */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-zinc-900/60 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-200 font-sans font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Induction Cohort 2026-27</span>
              </span>
              <span>·</span>
              <span>{shortYear}</span>
              <span>·</span>
              <span>{student.branch}</span>
              <span>·</span>
              <span>{student.division}</span>
              <span>·</span>
              <span>Roll {student.rollNo}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, {firstName}.
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
              Here are your tailored workshops, department syllabus notes, upcoming exam schedules,
              and senior mentor hours aligned with your path in{' '}
              <span className="text-white font-semibold underline decoration-zinc-600 underline-offset-4">
                {student.futurePath || 'Applied AI & Software Engineering'}
              </span>.
            </p>

            {/* Quick Metrics Strip */}
            <div className="flex items-center gap-4 sm:gap-6 pt-2 text-xs text-zinc-400">
              <div>
                <span className="text-lg font-bold text-white tabular-nums">
                  {student.stats.activityScore}
                </span>
                <span className="ml-1.5 text-zinc-400">Activity Score</span>
              </div>
              <div className="w-px h-4 bg-zinc-800" />
              <div>
                <span className="text-lg font-bold text-white tabular-nums">
                  {student.stats.communitiesJoined}
                </span>
                <span className="ml-1.5 text-zinc-400">Clubs Joined</span>
              </div>
              <div className="w-px h-4 bg-zinc-800" />
              <div>
                <span className="text-lg font-bold text-white tabular-nums">
                  {student.bookmarkedMaterials?.length || 0}
                </span>
                <span className="ml-1.5 text-zinc-400">Saved Notes</span>
              </div>
              <div className="w-px h-4 bg-zinc-800" />
              <div>
                <span className="text-lg font-bold text-white tabular-nums">
                  {student.stats.networkCount}+
                </span>
                <span className="ml-1.5 text-zinc-400">Campus Network</span>
              </div>
            </div>
          </div>

          {/* Quick AI Trigger Box */}
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col gap-3 lg:w-72 shrink-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Campus AI Query Advisor</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Ask about club interview dates, eligibility for hackathons, or study materials for {student.branch.split(' ')[0]}.
            </p>
            <button
              onClick={() => onOpenAiModal(`What should a ${shortYear} ${student.branch} junior focus on this week?`)}
              className="w-full py-2 px-3 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Ask AI Campus Advisor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Best Recommendations: Horizontally Scrollable Workshops & Seminars */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
              Best Recommendations: Workshops & Seminars
            </h2>
            <p className="text-xs text-zinc-500">
              Curated hands-on masterclasses based on your interest in{' '}
              {student.interestedAreas?.slice(0, 3).join(', ') || 'Engineering'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('explore')}
            className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Explore All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontally scrollable container with snappy cards */}
        <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin">
          {recommendedWorkshops.map((ws) => {
            const isBookmarked = student.favourites.includes(ws.id);
            return (
              <div
                key={ws.id}
                className="w-72 sm:w-80 shrink-0 bg-white rounded-2xl border border-zinc-200 hover:border-zinc-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Image Header */}
                <div
                  className="relative h-40 w-full overflow-hidden bg-zinc-900 cursor-pointer"
                  onClick={() => onOpenWorkshop(ws)}
                >
                  <img
                    src={ws.image}
                    alt={ws.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

                  {/* Seats badge */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-white border border-white/20">
                    <span className="text-emerald-400 font-bold">{ws.seatsLeft}</span> spots left
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(ws.id);
                    }}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/40 hover:bg-black/70 backdrop-blur-md text-white transition-colors cursor-pointer"
                    title={isBookmarked ? 'Saved' : 'Bookmark'}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${
                        isBookmarked ? 'fill-amber-400 text-amber-400' : 'text-white'
                      }`}
                    />
                  </button>

                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-300">
                      {ws.communityName.split(' ')[0]}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                      {ws.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                      <span className="text-zinc-800 font-semibold">
                        {ws.date.split(',')[1] || ws.date}
                      </span>
                      <span>·</span>
                      <span>{ws.time.split('-')[0]}</span>
                    </div>

                    <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                      {ws.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenWorkshop(ws)}
                      className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer"
                    >
                      Syllabus
                    </button>

                    <button
                      onClick={() => onToggleRegister(ws.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        ws.registered
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-zinc-950 hover:bg-zinc-800 text-white shadow-2xs'
                      }`}
                    >
                      {ws.registered ? 'Registered' : 'Quick RSVP'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Study Materials (NEW SECTION) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-zinc-900" />
              <span>Study Materials & Academic Notes</span>
            </h2>
            <p className="text-xs text-zinc-500">
              Department notes, lab manuals, and solved question banks for {student.branch} ({shortYear})
            </p>
          </div>

          {/* Subject Pills Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {uniqueSubjects.slice(0, 4).map((sub) => (
              <button
                key={sub}
                onClick={() => setSubjectFilter(sub)}
                className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  subjectFilter === sub
                    ? 'bg-zinc-900 text-white font-semibold shadow-2xs'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((mat) => {
            const isBookmarked = student.bookmarkedMaterials?.includes(mat.id);
            return (
              <div
                key={mat.id}
                className="bg-white rounded-2xl border border-zinc-200 p-4 hover:border-zinc-400 hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                      {mat.fileType}
                    </span>
                    <button
                      onClick={() => onToggleBookmarkMaterial(mat.id)}
                      className="text-zinc-400 hover:text-amber-500 transition-colors p-1"
                      title={isBookmarked ? 'Bookmarked' : 'Save'}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          isBookmarked ? 'fill-amber-500 text-amber-500' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <h3
                    onClick={() => onOpenStudyMaterial(mat)}
                    className="text-sm font-bold text-zinc-900 hover:text-zinc-600 transition-colors cursor-pointer leading-snug"
                  >
                    {mat.title}
                  </h3>

                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {mat.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-100 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                    <span>{mat.fileSize}</span>
                    <span>·</span>
                    <span>{mat.downloadsCount} downloads</span>
                    <span>·</span>
                    <span>{mat.updatedAt.split(' ')[0]}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => onOpenStudyMaterial(mat)}
                      className="text-xs font-semibold text-zinc-700 hover:underline cursor-pointer"
                    >
                      View Syllabus
                    </button>
                    <button
                      onClick={() => onOpenStudyMaterial(mat)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Event & Academic Calendar (NEW WIDGET) */}
      <section className="bg-white rounded-3xl border border-zinc-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-zinc-950 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-zinc-900" />
              <span>Campus Timeline & Academic Calendar</span>
            </h2>
            <p className="text-xs text-zinc-500">
              Upcoming Exams, Lab Submissions, Tech Workshops, and Ideathons
            </p>
          </div>

          {/* Calendar Category Filter */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl overflow-x-auto">
            {(['All', 'Exam', 'Assignment', 'Workshop', 'Registered'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCalendarFilter(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  calendarFilter === cat
                    ? 'bg-white text-zinc-950 font-bold shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Rows */}
        <div className="divide-y divide-zinc-100">
          {filteredCalendar.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              No calendar events found for this filter.
            </div>
          ) : (
            filteredCalendar.map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  {/* Date badge */}
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex flex-col items-center justify-center text-zinc-900 shrink-0 font-mono">
                    <span className="text-[10px] uppercase font-semibold leading-none">
                      {item.date.split(' ')[1] || 'OCT'}
                    </span>
                    <span className="text-base font-extrabold leading-tight tabular-nums">
                      {item.date.split(' ')[2]?.replace(',', '') || '14'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded ${
                          item.category === 'Exam'
                            ? 'bg-rose-100 text-rose-800'
                            : item.category === 'Assignment'
                            ? 'bg-amber-100 text-amber-800'
                            : item.category === 'Hackathon'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-zinc-100 text-zinc-800'
                        }`}
                      >
                        {item.category}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500">{item.time}</span>
                    </div>

                    <h3 className="text-sm font-bold text-zinc-950 mt-0.5">
                      {item.title}
                    </h3>

                    <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-zinc-400" />
                      <span>{item.venueOrLink}</span>
                      <span>·</span>
                      <span>{item.description}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span className="text-[11px] font-mono text-zinc-400">
                    {item.priority === 'High' ? '🔴 High Priority' : '🟢 Scheduled'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 5. Recommended Communities & Student Chapters */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-950 tracking-tight">
              Recommended Campus Communities & Chapters
            </h2>
            <p className="text-xs text-zinc-500">
              Join technical committees to access core team recruitments and senior hackathon partners
            </p>
          </div>
          <button
            onClick={() => setActiveTab('explore')}
            className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Chapters</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedCommunities.slice(0, 3).map((comm) => (
            <div
              key={comm.id}
              onClick={() => onOpenCommunity(comm)}
              className="group bg-white rounded-2xl border border-zinc-200 p-5 hover:border-zinc-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {comm.shortCode.slice(0, 4)}
                  </div>
                  {comm.joined ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Member
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                      Open to Juniors
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-zinc-950 group-hover:text-zinc-600 transition-colors">
                    {comm.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                    {comm.shortDesc}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono text-[11px]">
                  {comm.membersCount} members
                </span>
                <span className="text-zinc-900 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  View Chapter <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
