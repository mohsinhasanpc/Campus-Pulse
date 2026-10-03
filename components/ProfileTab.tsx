'use client';

import React, { useState } from 'react';
import {
  Edit3,
  Share2,
  Award,
  Users,
  Bookmark,
  History,
  Calendar,
  CheckCircle,
  ExternalLink,
  Mail,
  Phone,
  Github,
  Linkedin,
  Sparkles,
  BookOpen,
  Download,
  FileText,
} from 'lucide-react';
import {
  StudentProfile,
  WorkshopOrEvent,
  Community,
  StudyMaterial,
} from '@/lib/types';

interface ProfileTabProps {
  student: StudentProfile;
  workshops: WorkshopOrEvent[];
  communities: Community[];
  studyMaterials: StudyMaterial[];
  onOpenEditModal: () => void;
  onOpenWorkshop: (ws: WorkshopOrEvent) => void;
  onOpenCommunity: (c: Community) => void;
  onOpenStudyMaterial: (mat: StudyMaterial) => void;
  onToggleBookmark: (id: string) => void;
  onToggleBookmarkMaterial: (id: string) => void;
}

export default function ProfileTab({
  student,
  workshops,
  communities,
  studyMaterials,
  onOpenEditModal,
  onOpenWorkshop,
  onOpenCommunity,
  onOpenStudyMaterial,
  onToggleBookmark,
  onToggleBookmarkMaterial,
}: ProfileTabProps) {
  const [copied, setCopied] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<{
    title: string;
    date: string;
    communityName: string;
  } | null>(null);

  const favouriteWorkshops = workshops.filter((w) =>
    student.favourites.includes(w.id)
  );

  const bookmarkedNotes = studyMaterials.filter((m) =>
    student.bookmarkedMaterials?.includes(m.id)
  );

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(
        `Check out ${student.name}'s campus student profile (${student.branch}, Roll ${student.rollNo}) on CampusPulse!`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const initials = student.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* 1. Profile Header Card */}
      <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-xs">
        {/* Cover top monochrome dark banner */}
        <div className="h-32 sm:h-36 bg-zinc-950 relative flex items-end justify-end p-4">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
            Campus Pulse Academic ID · {student.rollNo}
          </span>
        </div>

        <div className="p-5 sm:p-8 -mt-12 sm:-mt-14 relative space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-3.5 sm:gap-4">
              {/* DESIGN TWEAK: Avatar has a distinct, prominent white border/stroke to make it pop against the background */}
              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl bg-zinc-950 text-white font-extrabold text-xl sm:text-2xl flex items-center justify-center ring-4 ring-white shadow-xl shrink-0 select-none border-2 border-zinc-800">
                {initials}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
                    {student.name}
                  </h1>
                  <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                    {student.classYear.split(' ')[0]}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 font-medium">
                  {student.branch} · {student.division}
                </p>
                <p className="text-xs text-zinc-400 font-mono">
                  Roll No: <span className="font-semibold text-zinc-800">{student.rollNo}</span>
                </p>
              </div>
            </div>

            {/* Edit & Share buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onOpenEditModal}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={handleShare}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-950 hover:bg-zinc-800 text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Link Copied!' : 'Share Profile'}</span>
              </button>
            </div>
          </div>

          {/* 3 Key Stats Boxes */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3.5 sm:p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-center">
            <div className="space-y-0.5">
              <p className="text-zinc-400 text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider">
                Activity Score
              </p>
              <p className="text-xl sm:text-2xl font-black text-zinc-950 tabular-nums">
                {student.stats.activityScore}
              </p>
              <p className="text-[10px] text-zinc-500 font-mono">Verified Points</p>
            </div>

            <div className="space-y-0.5 border-x border-zinc-200">
              <p className="text-zinc-400 text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider">
                Joined Clubs
              </p>
              <p className="text-xl sm:text-2xl font-black text-zinc-950 tabular-nums">
                {student.stats.communitiesJoined}
              </p>
              <p className="text-[10px] text-zinc-500 font-mono">Active Chapters</p>
            </div>

            <div className="space-y-0.5">
              <p className="text-zinc-400 text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider">
                Network Size
              </p>
              <p className="text-xl sm:text-2xl font-black text-zinc-950 tabular-nums">
                {student.stats.networkCount}+
              </p>
              <p className="text-[10px] text-zinc-500 font-mono">Peers & Seniors</p>
            </div>
          </div>

          {/* Career Path & Selected Pill Tags */}
          <div className="space-y-3 pt-1 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-zinc-800 bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-lg font-medium">
                <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
                <span className="font-semibold text-zinc-900">Target Track:</span>
                <span className="font-bold text-zinc-950">{student.futurePath || 'Engineering'}</span>
              </div>
              {student.semester && (
                <div className="px-2.5 py-1 bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-lg font-mono">
                  {student.semester}
                </div>
              )}
            </div>

            {/* Tech & Study Interests */}
            <div className="space-y-2 pt-2 border-t border-zinc-100">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                Selected Domain Interests & Subjects
              </span>
              <div className="flex flex-wrap gap-1.5">
                {student.interestedAreas?.map((area) => (
                  <span
                    key={area}
                    className="px-2.5 py-1 rounded-full text-xs bg-zinc-950 text-white font-medium"
                  >
                    {area}
                  </span>
                ))}
                {student.interestedSubjects?.map((sub) => (
                  <span
                    key={sub}
                    className="px-2.5 py-1 rounded-full text-xs bg-zinc-100 text-zinc-800 border border-zinc-200 font-medium"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bookmarked Study Materials Section (NEW) */}
      <section className="bg-white rounded-3xl border border-zinc-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-zinc-900" />
              <span>Saved Academic Study Materials ({bookmarkedNotes.length})</span>
            </h2>
            <p className="text-xs text-zinc-500">
              Handy reference notes, formula sheets, and lab question banks bookmarked for exams
            </p>
          </div>
        </div>

        {bookmarkedNotes.length === 0 ? (
          <div className="py-6 text-center text-xs text-zinc-400">
            No study materials saved yet. Browse the Dashboard to bookmark lecture notes and lab guides.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bookmarkedNotes.map((mat) => (
              <div
                key={mat.id}
                className="p-3.5 rounded-2xl border border-zinc-200 hover:border-zinc-400 bg-zinc-50/50 flex flex-col justify-between space-y-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                    <span className="px-1.5 py-0.2 rounded bg-zinc-200 text-zinc-800 font-semibold">
                      {mat.fileType}
                    </span>
                    <span>{mat.fileSize}</span>
                  </div>
                  <h4
                    onClick={() => onOpenStudyMaterial(mat)}
                    className="text-xs sm:text-sm font-bold text-zinc-950 hover:underline cursor-pointer line-clamp-1"
                  >
                    {mat.title}
                  </h4>
                  <p className="text-xs text-zinc-500">{mat.subject}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60 text-xs">
                  <button
                    onClick={() => onOpenStudyMaterial(mat)}
                    className="font-semibold text-zinc-900 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => onToggleBookmarkMaterial(mat.id)}
                    className="text-zinc-400 hover:text-rose-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Favorites: Saved Workshops & Events */}
      <section className="bg-white rounded-3xl border border-zinc-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-zinc-900" />
              <span>Saved Workshops & Bootcamps ({favouriteWorkshops.length})</span>
            </h2>
            <p className="text-xs text-zinc-500">
              Workshops you pinned to review speaker profiles and syllabus details
            </p>
          </div>
        </div>

        {favouriteWorkshops.length === 0 ? (
          <div className="py-6 text-center text-xs text-zinc-400">
            No workshops bookmarked. Click the bookmark icon on any workshop card to save it here.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {favouriteWorkshops.map((ws) => (
              <div
                key={ws.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-zinc-50 px-2 rounded-xl transition-colors cursor-pointer"
                onClick={() => onOpenWorkshop(ws)}
              >
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                    {ws.communityName}
                  </span>
                  <h4 className="text-sm font-bold text-zinc-950 hover:underline">
                    {ws.title}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {ws.date.split(',')[1] || ws.date} · {ws.time.split('-')[0]}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(ws.id);
                  }}
                  className="p-2 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                  title="Remove from favorites"
                >
                  <Bookmark className="w-4 h-4 fill-zinc-950 text-zinc-950" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Past Event History & Certificates */}
      <section className="bg-white rounded-3xl border border-zinc-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight flex items-center gap-2">
            <History className="w-4 h-4 text-zinc-900" />
            <span>Past Events & Induction History</span>
          </h2>
          <p className="text-xs text-zinc-500">
            Verified participation certificates stamped by campus chapters and academic council
          </p>
        </div>

        <div className="divide-y divide-zinc-100">
          {student.history.map((item) => (
            <div
              key={item.id}
              className="py-3 flex items-center justify-between gap-3 hover:bg-zinc-50 px-2 rounded-xl transition-colors"
            >
              <div>
                <span className="text-[10px] font-mono text-zinc-400 block">
                  {item.communityName} · {item.type}
                </span>
                <h4 className="text-sm font-bold text-zinc-950">{item.title}</h4>
                <span className="text-xs text-zinc-400 font-mono">{item.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    item.status === 'Certificate Earned'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.status === 'Registered'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-zinc-100 text-zinc-700'
                  }`}
                >
                  {item.status}
                </span>

                {item.status === 'Certificate Earned' && (
                  <button
                    onClick={() =>
                      setSelectedCertificate({
                        title: item.title,
                        date: item.date,
                        communityName: item.communityName,
                      })
                    }
                    className="p-1 text-zinc-500 hover:text-zinc-950 cursor-pointer"
                    title="View Certificate"
                  >
                    <Award className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certificate Preview Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-zinc-200 shadow-2xl space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center mx-auto shadow-md">
              <Award className="w-6 h-6 text-amber-400" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                Certificate of Completion
              </span>
              <h3 className="text-lg font-bold text-zinc-950">
                {selectedCertificate.title}
              </h3>
              <p className="text-xs text-zinc-500">
                Presented to <span className="font-bold text-zinc-900">{student.name}</span> ({student.rollNo})
              </p>
              <p className="text-[11px] font-mono text-zinc-400 pt-1">
                Issued by {selectedCertificate.communityName} · {selectedCertificate.date}
              </p>
            </div>

            <button
              onClick={() => setSelectedCertificate(null)}
              className="px-6 py-2 rounded-xl bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
