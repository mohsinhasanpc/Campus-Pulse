'use client';

import React, { useState } from 'react';
import { X, BookOpen, Download, Bookmark, FileText, Check, Share2, Eye, ShieldCheck } from 'lucide-react';
import { StudyMaterial } from '@/lib/types';

interface StudyMaterialModalProps {
  material: StudyMaterial | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export default function StudyMaterialModal({
  material,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
}: StudyMaterialModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !material) return null;

  const handleDownload = () => {
    setDownloading(true);
    // Simulate real file download blob
    setTimeout(() => {
      const element = document.createElement('a');
      const fileContent = `=== ${material.title} ===\nSubject: ${material.subject}\nBranch: ${material.branch}\nYear: ${material.year}\nAuthor: ${material.author}\nDate: ${material.updatedAt}\n\nSummary:\n${material.description}\n\nTopics Covered:\n${material.tags.map((t) => `- ${t}`).join('\n')}\n\n[Verified by Campus Pulse Academic Repository - Academic Year 2026-27]`;
      const file = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = `${material.title.slice(0, 30).replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white text-zinc-900 w-full max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-zinc-200 flex flex-col max-h-[90dvh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 flex items-start justify-between bg-zinc-50/70">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
              <span className="px-2 py-0.5 rounded bg-zinc-200/80 text-zinc-700 font-mono text-[10px]">
                {material.fileType}
              </span>
              <span>·</span>
              <span>{material.subject}</span>
              <span>·</span>
              <span className="font-mono">{material.fileSize}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 leading-snug">
              {material.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-zinc-600">
          <div className="p-3.5 bg-zinc-100/70 rounded-xl border border-zinc-200/70 space-y-1.5">
            <div className="flex items-center justify-between text-zinc-700 font-medium">
              <span>Author / Source:</span>
              <span className="font-semibold text-zinc-900">{material.author}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-700 font-medium">
              <span>Target Cohort:</span>
              <span className="text-zinc-900 font-semibold">{material.branch} ({material.year})</span>
            </div>
            <div className="flex items-center justify-between text-zinc-700 font-medium">
              <span>Downloads:</span>
              <span className="font-mono tabular-nums text-zinc-900 font-bold">{material.downloadsCount} students</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
              Document Overview
            </h4>
            <p className="leading-relaxed text-zinc-600">
              {material.description}
            </p>
          </div>

          {/* Key Topics Tag Cloud */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
              Syllabus Units Covered
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {material.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-800 border border-zinc-200 font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Verified Quality Notice */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] leading-tight">
              Verified by senior department toppers. Formatted strictly for end-semester university grading rubrics.
            </span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between gap-3">
          <button
            onClick={() => onToggleBookmark(material.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>{isBookmarked ? 'Bookmarked' : 'Save Material'}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Saved to Device</span>
              </>
            ) : downloading ? (
              <span>Preparing File...</span>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download Notes ({material.fileSize})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
