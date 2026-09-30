import React, { useState } from 'react';
import { 
  Search, 
  FileText, 
  CheckCircle2, 
  Activity, 
  GraduationCap,
  ChevronDown
} from 'lucide-react';

export const AdminLivelihoodView: React.FC<{ darkMode?: boolean }> = ({ darkMode = true }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStage, setActiveStage] = useState<number>(1);
  const [clientCategory, setClientCategory] = useState<string>('All Categories');
  const [statusFilter, setStatusFilter] = useState<string>('All Statuses');

  return (
    <div className={`space-y-6 select-none font-['Plus_Jakarta_Sans',sans-serif] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          Livelihood & Training Program Administration
        </h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Intake evaluation, capital & materials disbursement, and post-release livelihood monitoring.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#0e1726] border border-slate-800/90 rounded-2xl p-2 shadow-xl">
        <button
          type="button"
          onClick={() => setActiveStage(1)}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-extrabold transition-all text-left ${
            activeStage === 1
              ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40'
              : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-[#121c2e]'
          }`}
        >
          <FileText className="w-4 h-4 shrink-0" />
          <span className="truncate">1. APPLICATIONS REVIEW (0 Pending)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStage(2)}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-extrabold transition-all text-left ${
            activeStage === 2
              ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40'
              : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-[#121c2e]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="truncate">2. CAPITAL / MATERIALS (0 Approved)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStage(3)}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-extrabold transition-all text-left ${
            activeStage === 3
              ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40'
              : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-[#121c2e]'
          }`}
        >
          <Activity className="w-4 h-4 shrink-0" />
          <span className="truncate">3. LIVELIHOOD MONITORING (0 Released)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStage(4)}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-extrabold transition-all text-left ${
            activeStage === 4
              ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40'
              : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-[#121c2e]'
          }`}
        >
          <GraduationCap className="w-4 h-4 shrink-0" />
          <span className="truncate">4. TRAINING PROGRAM</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">TOTAL APPLICATIONS</span>
          <div className="text-3xl font-extrabold text-white tracking-tight mt-2">0</div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">PENDING REVIEW</span>
          <div className="text-3xl font-extrabold text-amber-500 tracking-tight mt-2">0</div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">APPROVED</span>
          <div className="text-3xl font-extrabold text-emerald-500 tracking-tight mt-2">0</div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">REJECTED</span>
          <div className="text-3xl font-extrabold text-rose-500 tracking-tight mt-2">0</div>
        </div>
      </div>

      <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by applicant name or reference number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0b1220] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block mb-1.5">STATUS OF CLIENT</label>
            <div className="relative">
              <select
                value={clientCategory}
                onChange={(e) => setClientCategory(e.target.value)}
                className="w-full appearance-none bg-[#0b1220] border border-slate-700/80 rounded-xl px-4 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
              >
                <option value="All Categories">All Categories</option>
                <option value="Solo Parent">Solo Parent</option>
                <option value="PWD">PWD</option>
                <option value="Indigent">Indigent Household</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block mb-1.5">STATUS</label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none bg-[#0b1220] border border-slate-700/80 rounded-xl px-4 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white tracking-wide">
          Applications Registry <span className="text-slate-400 font-mono text-xs">(0)</span>
        </h3>
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-16 text-center shadow-xl flex flex-col items-center justify-center">
          <div className="p-3.5 rounded-2xl bg-[#121c2e] border border-slate-800 text-slate-400 mb-3">
            <FileText className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h4 className="text-base font-extrabold text-white">No applications found</h4>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your filters.</p>
        </div>
      </div>
    </div>
  );
};
