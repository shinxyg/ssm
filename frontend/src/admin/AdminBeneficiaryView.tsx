import React, { useState } from 'react';
import { Search, FileText, ChevronDown, UserCheck } from 'lucide-react';

export const AdminBeneficiaryView: React.FC<{ darkMode?: boolean }> = ({ darkMode = true }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'list' | 'queue' | 'history'>('list');
  const [programFilter, setProgramFilter] = useState<string>('All Programs');
  const [verificationFilter, setVerificationFilter] = useState<string>('All Statuses');

  return (
    <div className={`space-y-6 select-none font-['Plus_Jakarta_Sans',sans-serif] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          Beneficiary Management
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">TOTAL BENEFICIARIES</span>
          <div className="text-3xl font-extrabold text-white tracking-tight mt-2">0</div>
        </div>
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">VERIFIED</span>
          <div className="text-3xl font-extrabold text-emerald-500 tracking-tight mt-2">0</div>
        </div>
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">PENDING</span>
          <div className="text-3xl font-extrabold text-amber-500 tracking-tight mt-2">0</div>
        </div>
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">UNVERIFIED</span>
          <div className="text-3xl font-extrabold text-rose-500 tracking-tight mt-2">0</div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-[#0e1726] border border-slate-800/90 rounded-2xl p-2 w-fit shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab('list')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'list' ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40' : 'text-slate-400 hover:text-slate-200 hover:bg-[#121c2e]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Beneficiary List</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'queue' ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40' : 'text-slate-400 hover:text-slate-200 hover:bg-[#121c2e]'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Verification Queue (0)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'history' ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40' : 'text-slate-400 hover:text-slate-200 hover:bg-[#121c2e]'
          }`}
        >
          <span>History Log</span>
        </button>
      </div>

      <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, QCID, or beneficiary number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0b1220] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block mb-1.5">Program</label>
            <div className="relative">
              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                className="w-full appearance-none bg-[#0b1220] border border-slate-700/80 rounded-xl px-4 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
              >
                <option value="All Programs">All Programs</option>
                <option value="AICS">AICS</option>
                <option value="PWD">PWD Services</option>
                <option value="Senior">Senior Citizen</option>
                <option value="Solo Parent">Solo Parent</option>
                <option value="Child Welfare">Child Welfare</option>
                <option value="Livelihood Program">Livelihood Program</option>
                <option value="Training Program">Training Program</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block mb-1.5">Verification</label>
            <div className="relative">
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                className="w-full appearance-none bg-[#0b1220] border border-slate-700/80 rounded-xl px-4 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Verified">Verified</option>
                <option value="Pending">Pending Verification</option>
                <option value="Unverified">Unverified</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white tracking-wide">
          Beneficiaries <span className="text-slate-400 font-mono text-xs">(0)</span>
        </h3>
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-16 text-center shadow-xl flex flex-col items-center justify-center">
          <div className="p-3.5 rounded-2xl bg-[#121c2e] border border-slate-800 text-slate-400 mb-3">
            <FileText className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h4 className="text-base font-extrabold text-white">No beneficiaries found</h4>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or verification filter.</p>
        </div>
      </div>
    </div>
  );
};
