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
        <h1 className={`text-2xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Beneficiary Management
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`border rounded-2xl p-5 shadow-lg ${darkMode ? 'bg-[#0e1726] border-slate-800/90' : 'bg-white border-slate-200/90'}`}>
          <span className={`text-[11px] font-bold tracking-wider uppercase ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>TOTAL BENEFICIARIES</span>
          <div className={`text-3xl font-extrabold tracking-tight mt-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>0</div>
        </div>
        <div className={`border rounded-2xl p-5 shadow-lg ${darkMode ? 'bg-[#0e1726] border-slate-800/90' : 'bg-white border-slate-200/90'}`}>
          <span className={`text-[11px] font-bold tracking-wider uppercase ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>VERIFIED</span>
          <div className="text-3xl font-extrabold text-emerald-500 tracking-tight mt-2">0</div>
        </div>
        <div className={`border rounded-2xl p-5 shadow-lg ${darkMode ? 'bg-[#0e1726] border-slate-800/90' : 'bg-white border-slate-200/90'}`}>
          <span className={`text-[11px] font-bold tracking-wider uppercase ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>PENDING</span>
          <div className="text-3xl font-extrabold text-amber-500 tracking-tight mt-2">0</div>
        </div>
        <div className={`border rounded-2xl p-5 shadow-lg ${darkMode ? 'bg-[#0e1726] border-slate-800/90' : 'bg-white border-slate-200/90'}`}>
          <span className={`text-[11px] font-bold tracking-wider uppercase ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>UNVERIFIED</span>
          <div className="text-3xl font-extrabold text-rose-500 tracking-tight mt-2">0</div>
        </div>
      </div>

      <div className={`flex items-center gap-2 border rounded-2xl p-2 w-fit shadow-lg ${darkMode ? 'bg-[#0e1726] border-slate-800/90' : 'bg-white border-slate-200/90'}`}>
        <button
          type="button"
          onClick={() => setActiveTab('list')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'list' 
              ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40' 
              : darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-[#121c2e]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Beneficiary List</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'queue' 
              ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40' 
              : darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-[#121c2e]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Verification Queue (0)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'history' 
              ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40' 
              : darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-[#121c2e]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>History Log</span>
        </button>
      </div>

      <div className={`border rounded-2xl p-5 space-y-4 shadow-xl ${
        darkMode ? 'bg-[#0e1726] border-slate-800/90' : 'bg-white border-slate-200/90 shadow-sm'
      }`}>
        <div className="relative w-full">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            placeholder="Search by name, QCID, or beneficiary number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
              darkMode ? 'bg-[#0b1220] border-slate-700/80 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
            }`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className={`text-[10px] font-extrabold tracking-wider uppercase block mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Program</label>
            <div className="relative">
              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                className={`w-full appearance-none border rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer ${
                  darkMode ? 'bg-[#0b1220] border-slate-700/80 text-slate-200' : 'bg-white border-slate-300 text-slate-900 shadow-sm'
                }`}
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
              <ChevronDown className={`w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            </div>
          </div>

          <div>
            <label className={`text-[10px] font-extrabold tracking-wider uppercase block mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Verification</label>
            <div className="relative">
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                className={`w-full appearance-none border rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer ${
                  darkMode ? 'bg-[#0b1220] border-slate-700/80 text-slate-200' : 'bg-white border-slate-300 text-slate-900 shadow-sm'
                }`}
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Verified">Verified</option>
                <option value="Pending">Pending Verification</option>
                <option value="Unverified">Unverified</option>
              </select>
              <ChevronDown className={`w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className={`text-sm font-bold tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Beneficiaries <span className={`font-mono text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>(0)</span>
        </h3>
        <div className={`border rounded-2xl p-16 text-center shadow-xl flex flex-col items-center justify-center ${
          darkMode ? 'bg-[#0e1726] border-slate-800/90' : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
          <div className={`p-3.5 rounded-2xl mb-3 border ${
            darkMode ? 'bg-[#121c2e] border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
          }`}>
            <FileText className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h4 className={`text-base font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>No beneficiaries found</h4>
          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Try adjusting your search query or verification filter.</p>
        </div>
      </div>
    </div>
  );
};
