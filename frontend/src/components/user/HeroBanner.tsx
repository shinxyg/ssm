import React from 'react';
import { Search, FileText, Sparkles, HeartHandshake } from 'lucide-react';

interface HeroBannerProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  onOpenTrackModal: () => void;
  onOpenEligibilityModal: () => void;
  darkMode?: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  onOpenTrackModal,
  onOpenEligibilityModal,
  darkMode = true,
}) => {
  const filterPills = [
    { id: 'all', label: 'All Services' },
    { id: 'aics', label: 'AICS Crisis Aid (6 Types)' },
    { id: 'pwd_senior', label: 'PWD & Senior Citizens' },
    { id: 'solo_child', label: 'Solo Parent & Child Welfare' },
    { id: 'livelihood_payout', label: 'Livelihood & Training' },
  ];

  return (
    <div className={`relative overflow-hidden rounded-2xl border shadow-2xl p-6 lg:p-8 transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-r from-[#101b3b] via-[#14234b] to-[#0d162d] border-blue-500/20' 
        : 'bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-blue-400/30'
    }`}>
      {/* Background Seal Graphic Overlay */}
      <div className="absolute -right-8 -top-8 opacity-25 pointer-events-none select-none hidden md:block">
        <img
          src="/Government Service Integrity Seal.png"
          alt="Government Service Integrity Seal"
          className="w-96 h-96 object-contain filter drop-shadow-2xl"
        />
      </div>

      {/* Top Flex Row: Badge & Track Applications Button */}
      <div className="relative z-10 flex flex-wrap justify-between items-center gap-4 mb-4">
        {/* Badge Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/80 border border-blue-400/30 text-blue-200 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Gov Serves Social Services Portal • Help & Service Guide</span>
        </div>

        {/* Track My Applications Button */}
        <button
          onClick={onOpenTrackModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-medium text-xs border border-slate-600/60 shadow-lg transition-colors cursor-pointer"
        >
          <FileText className="w-4 h-4 text-blue-400" />
          <span>Track My Applications</span>
        </button>
      </div>

      {/* Headline & Subtitle */}
      <div className="relative z-10 max-w-3xl mb-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
          Welcome, JEFFERSON LEE!
        </h2>
        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-normal">
          Explore available financial aid programs (AICS Medical, Funeral, Educational), special sector benefits (PWD,
          Senior Citizen, Solo Parent), child welfare support, and livelihood training grants before filing your digital application.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative z-10 mb-5">
        <div className="relative max-w-3xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services, requirements, or benefits (e.g. Medical, Senior Booklet, PWD ID, Funeral, Livelihood)..."
            className="w-full pl-10 pr-4 py-3 bg-[#0d162a] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500 shadow-inner transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Category Pills */}
      <div className="relative z-10 flex flex-wrap items-center gap-2">
        {filterPills.map((pill) => {
          const isActive = activeFilter === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => setActiveFilter(pill.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white border border-blue-400 shadow-md'
                  : 'bg-slate-900/80 hover:bg-slate-900 text-slate-200 border border-slate-700/60'
              }`}
            >
              {pill.label}
            </button>
          );
        })}

        {/* Special Blue Glow Pill: Assistance & Eligibility Finder */}
        <button
          onClick={onOpenEligibilityModal}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/40 border border-blue-400/50 transition-all"
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Assistance & Eligibility Finder</span>
        </button>
      </div>
    </div>
  );
};
