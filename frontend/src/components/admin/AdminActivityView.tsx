import React, { useState } from 'react';
import { Search, History, CheckCircle2, XCircle, Calendar, ChevronDown, Trash2, Activity } from 'lucide-react';

export const AdminActivityView: React.FC<{ darkMode?: boolean }> = ({ darkMode = true }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [moduleFilter, setModuleFilter] = useState<string>('All Modules');
  const [actionFilter, setActionFilter] = useState<string>('All Actions');

  return (
    <div className={`space-y-6 select-none font-['Plus_Jakarta_Sans',sans-serif] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Activity Log</h1>
        <button type="button" className="flex items-center gap-2 bg-[#0e1726] hover:bg-[#142036] text-slate-300 hover:text-white border border-slate-700/80 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm">
          <Trash2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Recently Deleted</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">TOTAL ENTRIES</span>
            <div className="text-3xl font-extrabold text-white tracking-tight mt-2">0</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/80 text-slate-300">
            <History className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">APPROVED</span>
            <div className="text-3xl font-extrabold text-emerald-500 tracking-tight mt-2">0</div>
          </div>
          <div className="p-2 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">REJECTED</span>
            <div className="text-3xl font-extrabold text-rose-500 tracking-tight mt-2">0</div>
          </div>
          <div className="p-2 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-400">
            <XCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">TODAY</span>
            <div className="text-3xl font-extrabold text-white tracking-tight mt-2">0</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/80 text-slate-300">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, reference no., or staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0b1220] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block mb-1.5">Module</label>
            <div className="relative">
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="w-full appearance-none bg-[#0b1220] border border-slate-700/80 rounded-xl px-4 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
              >
                <option value="All Modules">All Modules</option>
                <option value="AICS">AICS</option>
                <option value="PWD">PWD</option>
                <option value="User Management">User Management</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block mb-1.5">Action</label>
            <div className="relative">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full appearance-none bg-[#0b1220] border border-slate-700/80 rounded-xl px-4 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
              >
                <option value="All Actions">All Actions</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Created">Created</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-16 text-center shadow-xl flex flex-col items-center justify-center">
        <div className="p-3.5 rounded-2xl bg-[#121c2e] border border-slate-800 text-slate-400 mb-3">
          <Activity className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h4 className="text-base font-extrabold text-white">No activity logs found</h4>
        <p className="text-xs text-slate-400 mt-1">System audit logs will appear here when actions are recorded.</p>
      </div>
    </div>
  );
};
