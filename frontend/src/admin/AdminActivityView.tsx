import React, { useState, useEffect } from 'react';
import { Search, History, CheckCircle2, XCircle, Calendar, ChevronDown, Trash2, Activity, RotateCcw, UserCheck, ShieldAlert, FileText, Info } from 'lucide-react';

interface ActivityLog {
  id: number;
  timestamp: string;
  staff_name: string;
  action: string;
  module: string;
  details: string;
  reference_no?: string;
  is_deleted?: boolean;
  deleted_at?: string;
}

export const AdminActivityView: React.FC<{ darkMode?: boolean }> = ({ darkMode = true }) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [deletedLogs, setDeletedLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [moduleFilter, setModuleFilter] = useState<string>('All Modules');
  const [actionFilter, setActionFilter] = useState<string>('All Actions');
  const [isRecentlyDeletedView, setIsRecentlyDeletedView] = useState<boolean>(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/activity-logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/activity-logs?deleted=true');
      if (res.ok) {
        const data = await res.json();
        setDeletedLogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch deleted activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isRecentlyDeletedView) {
      fetchDeletedLogs();
    } else {
      fetchLogs();
    }
  }, [isRecentlyDeletedView]);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/activity-logs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLogs(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to soft delete activity log:', err);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/activity-logs/${id}/restore`, { method: 'POST' });
      if (res.ok) {
        setDeletedLogs(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to restore activity log:', err);
    }
  };

  // Stats
  const totalEntries = logs.length;
  const approvedCount = logs.filter(l => l.action.toLowerCase().includes('approve') || l.action === 'Approved').length;
  const rejectedCount = logs.filter(l => l.action.toLowerCase().includes('reject') || l.action === 'Rejected').length;
  const todayCount = logs.filter(l => {
    if (!l.timestamp) return false;
    const d = new Date(l.timestamp);
    const today = new Date();
    return d.getDate() === today.getDate() &&
           d.getMonth() === today.getMonth() &&
           d.getFullYear() === today.getFullYear();
  }).length;

  // Filtering
  const activeList = isRecentlyDeletedView ? deletedLogs : logs;
  const filteredLogs = activeList.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      (item.staff_name && item.staff_name.toLowerCase().includes(q)) ||
      (item.reference_no && item.reference_no.toLowerCase().includes(q)) ||
      (item.details && item.details.toLowerCase().includes(q)) ||
      (item.module && item.module.toLowerCase().includes(q)) ||
      (item.action && item.action.toLowerCase().includes(q));

    const matchesModule = moduleFilter === 'All Modules' || item.module.toLowerCase() === moduleFilter.toLowerCase();
    const matchesAction = actionFilter === 'All Actions' || item.action.toLowerCase().includes(actionFilter.toLowerCase());

    return matchesSearch && matchesModule && matchesAction;
  });

  const formatDate = (isoStr: string) => {
    if (!isoStr) return 'N/A';
    try {
      const d = new Date(isoStr);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return isoStr;
    }
  };

  const getActionBadge = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('approve')) {
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 className="w-3.5 h-3.5" /> Approved</span>;
    }
    if (act.includes('reject') || act.includes('declin')) {
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-500/10 text-rose-400 border border-rose-500/20"><XCircle className="w-3.5 h-3.5" /> Rejected</span>;
    }
    if (act.includes('create') || act.includes('add') || act.includes('register')) {
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-blue-500/10 text-blue-400 border border-blue-500/20"><FileText className="w-3.5 h-3.5" /> Created</span>;
    }
    if (act.includes('update') || act.includes('edit') || act.includes('status')) {
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20"><Info className="w-3.5 h-3.5" /> Updated</span>;
    }
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-slate-500/10 text-slate-300 border border-slate-500/20">{action}</span>;
  };

  if (isRecentlyDeletedView) {
    return (
      <div className={`space-y-6 select-none font-['Plus_Jakarta_Sans',sans-serif] animate-in fade-in duration-300 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
        <div className="flex items-center justify-between pt-2">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Recently Deleted</h1>
            <p className="text-xs text-slate-400 mt-1">Archived audit logs that have been soft-deleted from the main activity record.</p>
          </div>
          <button 
            type="button" 
            onClick={() => setIsRecentlyDeletedView(false)}
            className="flex items-center gap-2 bg-[#0e1726] hover:bg-[#142036] text-slate-200 hover:text-white border border-slate-700/80 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-300" />
            <span>Back to Activity Log</span>
          </button>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-16 text-center shadow-xl flex flex-col items-center justify-center">
            <div className="p-3.5 rounded-2xl bg-[#121c2e] border border-slate-800 text-slate-400 mb-3">
              <Trash2 className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h4 className="text-base font-extrabold text-white">No recently deleted logs found</h4>
            <p className="text-xs text-slate-400 mt-1">Deleted records and logs will appear here for audit tracking before permanent cleanup.</p>
          </div>
        ) : (
          <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b1220] border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-extrabold">
                  <tr>
                    <th className="px-5 py-3.5">Date & Time</th>
                    <th className="px-5 py-3.5">Staff Name</th>
                    <th className="px-5 py-3.5">Module</th>
                    <th className="px-5 py-3.5">Action</th>
                    <th className="px-5 py-3.5">Details</th>
                    <th className="px-5 py-3.5 text-right">Restore</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-[#121d30]/60 transition-colors">
                      <td className="px-5 py-3.5 whitespace-nowrap text-slate-400 font-mono text-[11px]">{formatDate(log.timestamp)}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-200">{log.staff_name}</td>
                      <td className="px-5 py-3.5"><span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60 font-semibold text-[11px]">{log.module}</span></td>
                      <td className="px-5 py-3.5">{getActionBadge(log.action)}</td>
                      <td className="px-5 py-3.5 max-w-xs text-slate-300">
                        {log.details}
                        {log.reference_no && <span className="ml-2 font-mono text-[11px] text-blue-400 font-bold">({log.reference_no})</span>}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleRestore(log.id)}
                          className="inline-flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-xl font-bold transition-all text-[11px] cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restore</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-6 select-none font-['Plus_Jakarta_Sans',sans-serif] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">System Security & Activity Log</h1>
          <p className="text-xs text-slate-400 mt-0.5">Track system actions, staff audits, and status logs in real-time.</p>
        </div>
        <button 
          type="button" 
          onClick={() => setIsRecentlyDeletedView(true)}
          className="flex items-center gap-2 bg-[#0e1726] hover:bg-[#142036] text-slate-300 hover:text-white border border-slate-700/80 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Recently Deleted</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">TOTAL ENTRIES</span>
            <div className="text-3xl font-extrabold text-white tracking-tight mt-2">{totalEntries}</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/80 text-slate-300">
            <History className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">APPROVED</span>
            <div className="text-3xl font-extrabold text-emerald-500 tracking-tight mt-2">{approvedCount}</div>
          </div>
          <div className="p-2 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">REJECTED</span>
            <div className="text-3xl font-extrabold text-rose-500 tracking-tight mt-2">{rejectedCount}</div>
          </div>
          <div className="p-2 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-400">
            <XCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">TODAY</span>
            <div className="text-3xl font-extrabold text-white tracking-tight mt-2">{todayCount}</div>
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
                <option value="Senior Citizen">Senior Citizen</option>
                <option value="Solo Parent">Solo Parent</option>
                <option value="Child Welfare">Child Welfare</option>
                <option value="Livelihood Program">Livelihood Program</option>
                <option value="Training Program">Training Program</option>
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
                <option value="Updated">Updated</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-16 text-center shadow-xl flex flex-col items-center justify-center">
          <div className="p-3.5 rounded-2xl bg-[#121c2e] border border-slate-800 text-slate-400 mb-3">
            <Activity className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h4 className="text-base font-extrabold text-white">No activity logs found</h4>
          <p className="text-xs text-slate-400 mt-1">System audit logs will appear here when actions are recorded.</p>
        </div>
      ) : (
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b1220] border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-extrabold">
                <tr>
                  <th className="px-5 py-3.5">Date & Time</th>
                  <th className="px-5 py-3.5">Staff Name</th>
                  <th className="px-5 py-3.5">Module</th>
                  <th className="px-5 py-3.5">Action</th>
                  <th className="px-5 py-3.5">Details / Reference</th>
                  <th className="px-5 py-3.5 text-right">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[#121d30]/60 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-400 font-mono text-[11px]">{formatDate(log.timestamp)}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-200">{log.staff_name}</td>
                    <td className="px-5 py-3.5"><span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60 font-semibold text-[11px]">{log.module}</span></td>
                    <td className="px-5 py-3.5">{getActionBadge(log.action)}</td>
                    <td className="px-5 py-3.5 max-w-xs text-slate-300">
                      {log.details}
                      {log.reference_no && <span className="ml-2 font-mono text-[11px] text-blue-400 font-bold">({log.reference_no})</span>}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(log.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
