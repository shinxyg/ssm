import React, { useState } from 'react';
import { Search, Calendar, ChevronDown } from 'lucide-react';

export const AdminAppointmentView: React.FC<{ darkMode?: boolean }> = ({ darkMode = true }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [moduleFilter, setModuleFilter] = useState<string>('All Modules');
  const [statusFilter, setStatusFilter] = useState<string>('All Statuses');

  return (
    <div className={`space-y-6 select-none font-['Plus_Jakarta_Sans',sans-serif] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          Appointments & Case Scheduling
        </h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Set schedules, conduct assessments, approve aid vouchers, and issue partner agency referrals.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-4 shadow-lg">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">TOTAL REQUESTS</span>
          <div className="text-2xl font-extrabold text-white tracking-tight mt-1.5">0</div>
        </div>
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-4 shadow-lg">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">PENDING SCHEDULE</span>
          <div className="text-2xl font-extrabold text-white tracking-tight mt-1.5">0</div>
        </div>
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-4 shadow-lg">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">SCHEDULED (UPCOMING)</span>
          <div className="text-2xl font-extrabold text-white tracking-tight mt-1.5">0</div>
        </div>
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-4 shadow-lg">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">UNDER REVIEW (DUC)</span>
          <div className="text-2xl font-extrabold text-white tracking-tight mt-1.5">0</div>
        </div>
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-4 shadow-lg">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">APPROVED / DONE</span>
          <div className="text-2xl font-extrabold text-white tracking-tight mt-1.5">0</div>
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
                <option value="Senior Citizen">Senior Citizen</option>
                <option value="Solo Parent">Solo Parent</option>
                <option value="Child Welfare">Child Welfare</option>
                <option value="Livelihood Program">Livelihood Program</option>
                <option value="Training Program">Training Program</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block mb-1.5">Status</label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none bg-[#0b1220] border border-slate-700/80 rounded-xl px-4 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Scheduled">Scheduled</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white tracking-wide">
          Appointments <span className="text-slate-400 font-mono text-xs">(0)</span>
        </h3>
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-16 text-center shadow-xl flex flex-col items-center justify-center">
          <div className="p-3.5 rounded-2xl bg-[#121c2e] border border-slate-800 text-slate-400 mb-3">
            <Calendar className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h4 className="text-base font-extrabold text-white">No appointments found</h4>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or module filters.</p>
        </div>
      </div>
    </div>
  );
};
