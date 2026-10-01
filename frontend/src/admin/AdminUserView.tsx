import React, { useState } from 'react';
import { Search, Users, CheckCircle2, Ban, Shield, ChevronDown, UserCog } from 'lucide-react';

export const AdminUserView: React.FC<{ darkMode?: boolean }> = ({ darkMode = true }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('All Roles');
  const [statusFilter, setStatusFilter] = useState<string>('All Statuses');

  return (
    <div className={`space-y-6 select-none font-['Plus_Jakarta_Sans',sans-serif] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600 text-white">
            <UserCog className="w-5 h-5" />
          </div>
          <span>User Management</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">TOTAL USERS</span>
            <div className="text-3xl font-extrabold text-white tracking-tight mt-2">0</div>
            <span className="text-[10px] font-medium text-slate-400 mt-1 block">Registered citizen accounts</span>
          </div>
          <div className="p-2 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-400">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">ACTIVE USERS</span>
            <div className="text-3xl font-extrabold text-white tracking-tight mt-2">0</div>
            <span className="text-[10px] font-medium text-slate-400 mt-1 block">Authorized to login & apply</span>
          </div>
          <div className="p-2 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">INACTIVE USERS</span>
            <div className="text-3xl font-extrabold text-white tracking-tight mt-2">0</div>
            <span className="text-[10px] font-medium text-slate-400 mt-1 block">Deactivated / Login restricted</span>
          </div>
          <div className="p-2 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-400">
            <Ban className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">ADMINISTRATORS</span>
            <div className="text-3xl font-extrabold text-white tracking-tight mt-2">0</div>
            <span className="text-[10px] font-medium text-slate-400 mt-1 block">System administration roles</span>
          </div>
          <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400">
            <Shield className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by full name, email, contact number, QCID, or User ID (USR-...)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0b1220] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">Account Role:</span>
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="appearance-none bg-[#0b1220] border border-slate-700/80 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                >
                  <option value="All Roles">All Roles</option>
                  <option value="Administrator">Administrator</option>
                  <option value="User / Beneficiary">User / Beneficiary</option>
                  <option value="Social Worker">Social Worker</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">Account Status:</span>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-[#0b1220] border border-slate-700/80 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                >
                  <option value="All Statuses">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="text-[11px] font-medium text-slate-400">
            Showing <strong className="text-slate-200">0</strong> of <strong className="text-slate-200">0</strong> registered accounts
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white tracking-wide">
          Registered Accounts <span className="text-slate-400 font-mono text-xs">(0)</span>
        </h3>
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-16 text-center shadow-xl flex flex-col items-center justify-center">
          <div className="p-3.5 rounded-2xl bg-[#121c2e] border border-slate-800 text-slate-400 mb-3">
            <UserCog className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h4 className="text-base font-extrabold text-white">No registered accounts found</h4>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or role filters.</p>
        </div>
      </div>
    </div>
  );
};
