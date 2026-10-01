import React, { useState } from 'react';
import { Search, FileText } from 'lucide-react';

export const AdminSoloChildView: React.FC<{ darkMode?: boolean }> = ({ darkMode = true }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'SOLO' | 'CHILD'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  return (
    <div className={`space-y-6 select-none font-['Plus_Jakarta_Sans',sans-serif] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          Solo Parent & Child Welfare
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">TOTAL APPLICATIONS</span>
          <div className="text-3xl font-extrabold text-white tracking-tight mt-2">0</div>
        </div>
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">PENDING REVIEW</span>
          <div className="text-3xl font-extrabold text-white tracking-tight mt-2">0</div>
        </div>
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">APPROVED</span>
          <div className="text-3xl font-extrabold text-white tracking-tight mt-2">0</div>
        </div>
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">REJECTED</span>
          <div className="text-3xl font-extrabold text-white tracking-tight mt-2">0</div>
        </div>
      </div>

      <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or reference number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0b1220] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mr-1">CATEGORY</span>
            <button type="button" onClick={() => setCategoryFilter('ALL')} className={`px-3 py-1.5 rounded-xl font-extrabold transition-all text-xs ${categoryFilter === 'ALL' ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40' : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'}`}>ALL CATEGORIES</button>
            <button type="button" onClick={() => setCategoryFilter('SOLO')} className={`px-3 py-1.5 rounded-xl font-extrabold transition-all text-xs ${categoryFilter === 'SOLO' ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40' : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'}`}>SOLO PARENT</button>
            <button type="button" onClick={() => setCategoryFilter('CHILD')} className={`px-3 py-1.5 rounded-xl font-extrabold transition-all text-xs ${categoryFilter === 'CHILD' ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40' : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'}`}>CHILD WELFARE</button>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-800/80 pl-6">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mr-1">STATUS</span>
            <button type="button" onClick={() => setStatusFilter('ALL')} className={`px-3 py-1.5 rounded-xl font-extrabold transition-all text-xs ${statusFilter === 'ALL' ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40' : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'}`}>ALL STATUSES</button>
            <button type="button" onClick={() => setStatusFilter('PENDING')} className={`px-3 py-1.5 rounded-xl font-extrabold transition-all text-xs ${statusFilter === 'PENDING' ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40' : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'}`}>PENDING</button>
            <button type="button" onClick={() => setStatusFilter('APPROVED')} className={`px-3 py-1.5 rounded-xl font-extrabold transition-all text-xs ${statusFilter === 'APPROVED' ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40' : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'}`}>APPROVED</button>
            <button type="button" onClick={() => setStatusFilter('REJECTED')} className={`px-3 py-1.5 rounded-xl font-extrabold transition-all text-xs ${statusFilter === 'REJECTED' ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40' : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'}`}>REJECTED</button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white tracking-wide">
          Applications <span className="text-slate-400 font-mono text-xs">(0)</span>
        </h3>
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-16 text-center shadow-xl flex flex-col items-center justify-center">
          <div className="p-3.5 rounded-2xl bg-[#121c2e] border border-slate-800 text-slate-400 mb-3">
            <FileText className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h4 className="text-base font-extrabold text-white">No applications found</h4>
          <p className="text-xs text-slate-400 mt-1">Try a different search term or filter.</p>
        </div>
      </div>
    </div>
  );
};
