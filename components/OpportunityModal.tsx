'use client';

import React, { useState } from 'react';
import { X, Briefcase, MapPin, Calendar, Award, ExternalLink, Check, Sparkles, Building2 } from 'lucide-react';
import { CareerOpportunity } from '@/lib/types';

interface OpportunityModalProps {
  opportunity: CareerOpportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (id: string) => void;
}

export default function OpportunityModal({
  opportunity,
  isOpen,
  onClose,
  onApply,
}: OpportunityModalProps) {
  const [appliedLocal, setAppliedLocal] = useState(false);

  if (!isOpen || !opportunity) return null;

  const handleApply = () => {
    setAppliedLocal(true);
    onApply(opportunity.id);
  };

  const isApplied = opportunity.applied || appliedLocal;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white text-zinc-900 w-full max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-zinc-200 flex flex-col max-h-[90dvh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 flex items-start justify-between bg-zinc-50/70">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
              <span className="px-2 py-0.5 rounded bg-zinc-200 text-zinc-800 font-mono text-[10px]">
                {opportunity.type}
              </span>
              <span>·</span>
              <span className="text-emerald-700 font-semibold">{opportunity.stipendOrPrize}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-950 leading-snug">
              {opportunity.title}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-zinc-600 font-medium">
              <Building2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>{opportunity.organization}</span>
              <span>·</span>
              <span>{opportunity.location}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-zinc-600">
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-zinc-100/70 rounded-xl border border-zinc-200/70">
            <div>
              <span className="text-zinc-500 block text-[11px]">Application Deadline:</span>
              <span className="font-bold text-zinc-900">{opportunity.deadline}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[11px]">Eligibility:</span>
              <span className="font-bold text-zinc-900">{opportunity.eligibility}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
              Role Description & Scope
            </h4>
            <p className="leading-relaxed text-zinc-600">
              {opportunity.description}
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
              Skills & Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {opportunity.skillsRequired.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-800 border border-zinc-200 font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-[11px] text-zinc-500 space-y-1">
            <p className="font-semibold text-zinc-800">Junior Mentorship Tip:</p>
            <p>
              Applying as a 1st year junior? Highlight classroom mini-projects, Git repositories, and active membership in campus chapters like GDSC or ACM to stand out.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between gap-3">
          <span className="text-[11px] text-zinc-400">
            Deadline: {opportunity.deadline}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"
            >
              Close
            </button>

            <button
              onClick={handleApply}
              disabled={isApplied}
              className={`px-5 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                isApplied
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-zinc-950 hover:bg-zinc-800 text-white'
              }`}
            >
              {isApplied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Application Submitted</span>
                </>
              ) : (
                <>
                  <span>Apply Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
