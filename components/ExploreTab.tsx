'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Users,
  Calendar,
  MapPin,
  Check,
  Plus,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Bookmark,
  Briefcase,
  GraduationCap,
  Building2,
  ExternalLink,
  Award,
} from 'lucide-react';
import {
  Community,
  WorkshopOrEvent,
  MentorPeer,
  StudentProfile,
  AlumniProfile,
  CareerOpportunity,
} from '@/lib/types';

interface ExploreTabProps {
  communities: Community[];
  workshops: WorkshopOrEvent[];
  mentorsPeers: MentorPeer[];
  alumni: AlumniProfile[];
  opportunities: CareerOpportunity[];
  student: StudentProfile;
  onOpenWorkshop: (ws: WorkshopOrEvent) => void;
  onOpenCommunity: (c: Community) => void;
  onOpenOpportunity: (opp: CareerOpportunity) => void;
  onToggleJoinCommunity: (id: string) => void;
  onToggleRegisterWorkshop: (id: string) => void;
  onToggleBookmarkWorkshop: (id: string) => void;
  onToggleConnectUser: (id: string) => void;
  onToggleConnectAlumni: (id: string) => void;
  onStartChatWithUser: (user: MentorPeer) => void;
  onStartChatWithAlumni: (alumni: AlumniProfile) => void;
  searchFilter: string;
}

export default function ExploreTab({
  communities,
  workshops,
  mentorsPeers,
  alumni,
  opportunities,
  student,
  onOpenWorkshop,
  onOpenCommunity,
  onOpenOpportunity,
  onToggleJoinCommunity,
  onToggleRegisterWorkshop,
  onToggleBookmarkWorkshop,
  onToggleConnectUser,
  onToggleConnectAlumni,
  onStartChatWithUser,
  onStartChatWithAlumni,
  searchFilter,
}: ExploreTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    'all' | 'communities' | 'alumni' | 'opportunities' | 'people'
  >('all');

  const [communityCategory, setCommunityCategory] = useState<string>('All');
  const [opportunityType, setOpportunityType] = useState<string>('All');

  const filteredCommunities = communities.filter((c) => {
    const matchesCategory =
      communityCategory === 'All' || c.category === communityCategory;
    const matchesSearch =
      !searchFilter ||
      c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase())) ||
      c.leadName.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredAlumni = alumni.filter((a) => {
    const matchesSearch =
      !searchFilter ||
      a.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      a.company.toLowerCase().includes(searchFilter.toLowerCase()) ||
      a.currentRole.toLowerCase().includes(searchFilter.toLowerCase()) ||
      a.domain.some((d) => d.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesSearch;
  });

  const filteredOpportunities = opportunities.filter((o) => {
    const matchesType = opportunityType === 'All' || o.type === opportunityType;
    const matchesSearch =
      !searchFilter ||
      o.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      o.organization.toLowerCase().includes(searchFilter.toLowerCase()) ||
      o.skillsRequired.some((s) => s.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const filteredPeople = mentorsPeers.filter((p) => {
    const matchesSearch =
      !searchFilter ||
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.branch.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.specialties.some((s) => s.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Section Header & Primary Sub-Tabs */}
      <div className="space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
            Explore Campus Network
          </h1>
          <p className="text-xs text-zinc-500">
            Discover student chapters, connect with alumni at Google & Tesla, and browse freshmen internships
          </p>
        </div>

        {/* Sub-tab navigation bar */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === 'all'
                ? 'bg-zinc-950 text-white shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            All Discovery
          </button>
          <button
            onClick={() => setActiveSubTab('communities')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === 'communities'
                ? 'bg-zinc-950 text-white shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            Communities & Chapters ({communities.length})
          </button>
          <button
            onClick={() => setActiveSubTab('alumni')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === 'alumni'
                ? 'bg-zinc-950 text-white shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            Alumni Network ({alumni.length})
          </button>
          <button
            onClick={() => setActiveSubTab('opportunities')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === 'opportunities'
                ? 'bg-zinc-950 text-white shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            Internships & Hackathons ({opportunities.length})
          </button>
          <button
            onClick={() => setActiveSubTab('people')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === 'people'
                ? 'bg-zinc-950 text-white shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            People You May Know ({mentorsPeers.length})
          </button>
        </div>
      </div>

      {/* 1. COMMUNITIES & CHAPTERS SECTION */}
      {(activeSubTab === 'all' || activeSubTab === 'communities') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-zinc-900" />
                <span>Communities & Student Chapters</span>
              </h2>
              <p className="text-xs text-zinc-500">
                Official student clubs welcoming juniors for workshops and project teams
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              {filteredCommunities.length} Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCommunities.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-zinc-400 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white font-bold text-xs flex items-center justify-center">
                      {c.shortCode.slice(0, 4)}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                      {c.category}
                    </span>
                  </div>

                  <div>
                    <h3
                      onClick={() => onOpenCommunity(c)}
                      className="text-base font-bold text-zinc-950 hover:text-zinc-600 transition-colors cursor-pointer leading-snug"
                    >
                      {c.name}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                      {c.shortDesc}
                    </p>
                  </div>

                  <div className="space-y-1 text-[11px] text-zinc-600 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                    <p>
                      <span className="font-semibold text-zinc-900">Lead:</span> {c.leadName} ({c.leadRole})
                    </p>
                    <p>
                      <span className="font-semibold text-zinc-900">Sessions:</span> {c.upcomingEventCount} sessions planned
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-zinc-100">
                  <button
                    onClick={() => onOpenCommunity(c)}
                    className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer"
                  >
                    View Info
                  </button>

                  <button
                    onClick={() => onToggleJoinCommunity(c.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      c.joined
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-zinc-950 hover:bg-zinc-800 text-white shadow-2xs'
                    }`}
                  >
                    {c.joined ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Joined</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Join Club</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. ALUMNI NETWORK SECTION (NEW) */}
      {(activeSubTab === 'all' || activeSubTab === 'alumni') && (
        <section className="space-y-4 pt-4 border-t border-zinc-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-zinc-900" />
                <span>Alumni Network Directory</span>
              </h2>
              <p className="text-xs text-zinc-500">
                Connect with graduates now working at Google, Microsoft, Tesla, and Razorpay for career guidance
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              {filteredAlumni.length} Mentors Online
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAlumni.map((alumnus) => (
              <div
                key={alumnus.id}
                className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-zinc-400 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={alumnus.avatar}
                      alt={alumnus.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-zinc-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-sm font-bold text-zinc-950 truncate">
                          {alumnus.name}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-zinc-100 text-zinc-700">
                          {alumnus.gradYear}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-zinc-800 mt-0.5 truncate">
                        {alumnus.currentRole}
                      </p>
                      <p className="text-xs text-zinc-500 font-medium">
                        @{alumnus.company} · {alumnus.branch.split(' ')[0]}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                    {alumnus.bio}
                  </p>

                  {/* Domains */}
                  <div className="flex flex-wrap gap-1">
                    {alumnus.domain.slice(0, 3).map((d) => (
                      <span
                        key={d}
                        className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-medium"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onToggleConnectAlumni(alumnus.id)}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      alumnus.connected
                        ? 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                        : 'bg-zinc-950 hover:bg-zinc-800 text-white'
                    }`}
                  >
                    {alumnus.connected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Request Mentorship</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onStartChatWithAlumni(alumnus)}
                    className="p-2 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 rounded-xl border border-zinc-200 transition-colors cursor-pointer"
                    title="Send Direct Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. INTERNSHIPS & OPPORTUNITIES BOARD (NEW) */}
      {(activeSubTab === 'all' || activeSubTab === 'opportunities') && (
        <section className="space-y-4 pt-4 border-t border-zinc-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-zinc-900" />
                <span>Internships, Fellowships & Hackathons</span>
              </h2>
              <p className="text-xs text-zinc-500">
                Freshmen-friendly research programs, paid internships, and campus hackathons
              </p>
            </div>

            {/* Opportunity filter pills */}
            <div className="hidden sm:flex items-center gap-1">
              {(['All', 'Internship', 'Hackathon', 'Fellowship', 'Freelance Gig'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setOpportunityType(t)}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                    opportunityType === t
                      ? 'bg-zinc-900 text-white font-semibold'
                      : 'text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-white rounded-2xl border border-zinc-200 p-5 hover:border-zinc-400 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-semibold">
                      {opp.type}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      {opp.stipendOrPrize}
                    </span>
                  </div>

                  <h3
                    onClick={() => onOpenOpportunity(opp)}
                    className="text-sm sm:text-base font-bold text-zinc-950 hover:text-zinc-600 transition-colors cursor-pointer leading-snug"
                  >
                    {opp.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{opp.organization}</span>
                    <span>·</span>
                    <span>{opp.location}</span>
                  </div>

                  <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {opp.skillsRequired.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-600"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2 text-xs">
                  <span className="text-zinc-400 font-mono text-[11px]">
                    Deadline: {opp.deadline}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenOpportunity(opp)}
                      className="px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-950 cursor-pointer"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => onOpenOpportunity(opp)}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      {opp.applied ? 'Applied' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. PEOPLE YOU MAY KNOW SECTION */}
      {(activeSubTab === 'all' || activeSubTab === 'people') && (
        <section className="space-y-4 pt-4 border-t border-zinc-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-zinc-900" />
                <span>People You May Know</span>
              </h2>
              <p className="text-xs text-zinc-500">
                Senior club mentors and peer freshmen in {student.branch.split(' ')[0]}
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              {filteredPeople.length} Profiles
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPeople.map((person) => (
              <div
                key={person.id}
                className="bg-white rounded-2xl border border-zinc-200 p-4 hover:border-zinc-400 hover:shadow-2xs transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-zinc-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-sm font-bold text-zinc-950 truncate">
                        {person.name}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-zinc-100 text-zinc-700">
                        {person.role.split(' ')[0]}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5 truncate">{person.branch}</p>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                  {person.bio}
                </p>

                <div className="flex flex-wrap gap-1">
                  {person.specialties.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onToggleConnectUser(person.id)}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      person.connected
                        ? 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                        : 'bg-zinc-950 hover:bg-zinc-800 text-white'
                    }`}
                  >
                    {person.connected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Connect</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onStartChatWithUser(person)}
                    className="p-2 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 rounded-xl border border-zinc-200 transition-colors cursor-pointer"
                    title="Direct Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
