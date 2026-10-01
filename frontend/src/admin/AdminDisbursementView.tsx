import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, Users, Shield, FileText } from 'lucide-react';

export const AdminDisbursementView: React.FC<{ darkMode?: boolean }> = ({ darkMode = true }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tabFilter, setTabFilter] = useState<'ALL' | 'PENDING' | 'RELEASED'>('ALL');

  return (
    <div className={`space-y-6 select-none font-['Plus_Jakarta_Sans',sans-serif] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Financial Aid Disbursement
          </h1>
        </div>
        <div>
          <button type="button" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            Reset / Clear Test Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">TOTAL RELEASED</span>
            <div className="text-2xl font-extrabold text-white tracking-tight mt-2">₱0</div>
            <span className="text-[11px] font-semibold text-emerald-400 mt-1 block">✓ 0 beneficiaries paid</span>
          </div>
          <div className="p-2 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">PENDING RELEASE</span>
            <div className="text-2xl font-extrabold text-white tracking-tight mt-2">₱0</div>
            <span className="text-[11px] font-semibold text-amber-400 mt-1 block">0 pending payouts</span>
          </div>
          <div className="p-2 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">TOTAL RECORDS</span>
            <div className="text-2xl font-extrabold text-white tracking-tight mt-2">0</div>
            <span className="text-[11px] font-semibold text-blue-400 mt-1 block">Disbursement entries</span>
          </div>
          <div className="p-2 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">STATUS FLOW</span>
            <div className="text-sm font-extrabold text-blue-400 tracking-tight mt-2">PENDING → RELEASED</div>
            <span className="text-[10px] font-medium text-slate-400 mt-1 block">Auto-synced with Appointment Schedule</span>
          </div>
          <div className="p-2 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-400">
            <Shield className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Financial Aid Disbursement Records
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Connected to Appointments. Disbursements become RELEASED upon Social Worker appointment approval or manual disbursement.
            </p>
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search ID / Beneficiary name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0b1220] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setTabFilter('ALL')} className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${tabFilter === 'ALL' ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40' : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'}`}>ALL (0)</button>
          <button type="button" onClick={() => setTabFilter('PENDING')} className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${tabFilter === 'PENDING' ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40' : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'}`}>PENDING (0)</button>
          <button type="button" onClick={() => setTabFilter('RELEASED')} className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${tabFilter === 'RELEASED' ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40' : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'}`}>RELEASED (0)</button>
        </div>

        <div className="overflow-x-auto border border-slate-800/80 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-[#121c2e] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">DISBURSEMENT ID</th>
                <th className="py-3 px-4">APPLICANT NAME</th>
                <th className="py-3 px-4">ASSISTANCE TYPE</th>
                <th className="py-3 px-4">BASE AMOUNT</th>
                <th className="py-3 px-4">APPOINTMENT SCHEDULE</th>
                <th className="py-3 px-4">PAYOUT LOCATION</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileText className="w-8 h-8 text-slate-500 stroke-[1.5]" />
                    <p className="text-sm font-bold text-slate-300">No disbursement records found</p>
                    <p className="text-xs text-slate-500">There are currently no financial aid disbursements registered.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
