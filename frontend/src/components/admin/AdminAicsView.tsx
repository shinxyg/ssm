import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  ShieldAlert,
  X,
  Check
} from 'lucide-react';
import type { ApplicationRecord } from '../../types';

interface AdminAicsViewProps {
  darkMode?: boolean;
  applications?: ApplicationRecord[];
  onUpdateStatus?: (refNo: string, newStatus: 'Approved' | 'Under Review' | 'Pending Documents' | 'Ready for Payout' | 'Rejected') => void;
}

export const AdminAicsView: React.FC<AdminAicsViewProps> = ({ 
  darkMode = true, 
  applications = [],
  onUpdateStatus
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);

  const allApps: ApplicationRecord[] = useMemo(() => {
    if (applications.length > 0) return applications;
    return [
      {
        referenceNo: 'AICS-2026-8841',
        serviceName: 'AICS Medical & Hospitalization Guarantee Letter',
        category: 'AICS',
        dateSubmitted: 'Sep 24, 2026',
        status: 'Ready for Payout',
        amountOrType: '₱25,000 Guarantee Letter',
        assignedSocialWorker: 'Social Worker Maria Santos, RSW',
      },
      {
        referenceNo: 'AICS-2026-9012',
        serviceName: 'AICS Funeral & Burial Financial Assistance',
        category: 'AICS',
        dateSubmitted: 'Sep 27, 2026',
        status: 'Under Review',
        amountOrType: '₱15,000 Funeral Aid',
        assignedSocialWorker: 'Social Worker Elena Reyes, RSW',
      },
      {
        referenceNo: 'AICS-2026-7734',
        serviceName: 'Emergency Food & Calamity Aid',
        category: 'AICS',
        dateSubmitted: 'Sep 28, 2026',
        status: 'Approved',
        amountOrType: 'Food Pack & ₱5,000 Cash',
        assignedSocialWorker: 'Officer Arnaldo Cruz, OSCA',
      }
    ];
  }, [applications]);

  const aicsApps = useMemo(() => {
    return allApps.filter(app => 
      app.category.toUpperCase() === 'AICS' || 
      app.serviceName.toLowerCase().includes('aics') || 
      app.serviceName.toLowerCase().includes('medical') ||
      app.serviceName.toLowerCase().includes('funeral') ||
      app.serviceName.toLowerCase().includes('emergency')
    );
  }, [allApps]);

  const pendingCount = useMemo(() => {
    return aicsApps.filter(a => a.status === 'Under Review' || a.status === 'Pending Documents').length;
  }, [aicsApps]);

  const approvedCount = useMemo(() => {
    return aicsApps.filter(a => a.status === 'Approved' || a.status === 'Ready for Payout').length;
  }, [aicsApps]);

  const rejectedCount = useMemo(() => {
    return aicsApps.filter(a => (a.status as string) === 'Rejected' || (a.status as string) === 'Disqualified').length;
  }, [aicsApps]);

  const filteredApps = useMemo(() => {
    return aicsApps.filter(app => {
      if (statusFilter === 'pending' && !(app.status === 'Under Review' || app.status === 'Pending Documents')) return false;
      if (statusFilter === 'approved' && !(app.status === 'Approved' || app.status === 'Ready for Payout')) return false;
      if (statusFilter === 'rejected' && !((app.status as string) === 'Rejected' || (app.status as string) === 'Disqualified')) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const refMatch = app.referenceNo.toLowerCase().includes(q);
        const nameMatch = app.serviceName.toLowerCase().includes(q);
        const workerMatch = app.assignedSocialWorker.toLowerCase().includes(q);
        const statusMatch = app.status.toLowerCase().includes(q);
        return refMatch || nameMatch || workerMatch || statusMatch;
      }
      return true;
    });
  }, [aicsApps, statusFilter, searchQuery]);

  return (
    <div className={`space-y-6 select-none font-['Plus_Jakarta_Sans',sans-serif] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Assistance to Individuals in Crisis Situation (AICS)
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            7-Stage Social Case Lifecycle Management • Real-time Processing & Inter-Agency Referrals
          </p>
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search applicant, QCID, ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0e1726] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">INTAKE / PENDING</div>
            <div className="text-2xl font-extrabold text-white tracking-tight mt-0.5">{pendingCount}</div>
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">APPROVED AID</div>
            <div className="text-2xl font-extrabold text-white tracking-tight mt-0.5">{approvedCount}</div>
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-400 shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">DISQUALIFIED / REJECTED</div>
            <div className="text-2xl font-extrabold text-white tracking-tight mt-0.5">{rejectedCount}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            statusFilter === 'all'
              ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40'
              : 'bg-[#0e1726] text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <span>All Applications</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
            statusFilter === 'all' ? 'bg-blue-900/80 text-blue-200' : 'bg-slate-800 text-slate-400'
          }`}>{aicsApps.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            statusFilter === 'pending'
              ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40'
              : 'bg-[#0e1726] text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <span>Pending</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
            statusFilter === 'pending' ? 'bg-blue-900/80 text-blue-200' : 'bg-slate-800 text-slate-400'
          }`}>{pendingCount}</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('approved')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            statusFilter === 'approved'
              ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40'
              : 'bg-[#0e1726] text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <span>Approved</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
            statusFilter === 'approved' ? 'bg-blue-900/80 text-blue-200' : 'bg-slate-800 text-slate-400'
          }`}>{approvedCount}</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('rejected')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            statusFilter === 'rejected'
              ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40'
              : 'bg-[#0e1726] text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <span>Rejected</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
            statusFilter === 'rejected' ? 'bg-blue-900/80 text-blue-200' : 'bg-slate-800 text-slate-400'
          }`}>{rejectedCount}</span>
        </button>
      </div>

      <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-[#121c2e] text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">REFERENCE NO.</th>
                <th className="py-4 px-6">APPLICANT NAME</th>
                <th className="py-4 px-6">ASSISTANCE TYPE</th>
                <th className="py-4 px-6">DATE FILED</th>
                <th className="py-4 px-6">CURRENT STATUS</th>
                <th className="py-4 px-6 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-medium">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <tr 
                    key={app.referenceNo}
                    className="hover:bg-[#142036] transition-colors group cursor-pointer"
                    onClick={() => setSelectedApp(app)}
                  >
                    <td className="py-4 px-6 font-mono font-bold text-blue-400">{app.referenceNo}</td>
                    <td className="py-4 px-6 font-bold text-white">Jefferson Lee</td>
                    <td className="py-4 px-6 text-slate-300">{app.serviceName}</td>
                    <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">{app.dateSubmitted}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold border ${
                        app.status === 'Ready for Payout' || app.status === 'Approved'
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                          : app.status === 'Under Review' || app.status === 'Pending Documents'
                          ? 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                          : 'bg-rose-950/60 text-rose-400 border-rose-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          app.status === 'Ready for Payout' || app.status === 'Approved'
                            ? 'bg-emerald-400'
                            : app.status === 'Under Review' || app.status === 'Pending Documents'
                            ? 'bg-amber-400'
                            : 'bg-rose-400'
                        }`}></span>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApp(app);
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold border border-slate-700 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <ShieldAlert className="w-8 h-8 text-slate-500 stroke-[1.5]" />
                      <p className="text-sm font-bold text-slate-300">No AICS Applications Found</p>
                      <p className="text-xs text-slate-500">
                        {searchQuery ? `No records match "${searchQuery}"` : 'There are currently no applications matching this filter.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider">{selectedApp.referenceNo}</span>
                <h3 className="text-lg font-extrabold text-white mt-0.5">{selectedApp.serviceName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold uppercase">Applicant Name</span>
                  <div className="font-bold text-white text-sm mt-0.5">Jefferson Lee</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold uppercase">Date Filed</span>
                  <div className="font-mono text-slate-200 mt-0.5">{selectedApp.dateSubmitted}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold uppercase">Assigned Case Worker</span>
                  <div className="font-semibold text-slate-300 mt-0.5">{selectedApp.assignedSocialWorker}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-semibold uppercase">Benefit Amount / Aid</span>
                  <div className="font-bold text-amber-400 mt-0.5">{selectedApp.amountOrType}</div>
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] font-semibold uppercase block mb-1.5">Current Status</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  {selectedApp.status}
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#0a1120] border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onUpdateStatus) onUpdateStatus(selectedApp.referenceNo, 'Rejected');
                  setSelectedApp(null);
                }}
                className="px-4 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-700/50 text-rose-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Reject / Disqualify</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onUpdateStatus) onUpdateStatus(selectedApp.referenceNo, 'Ready for Payout');
                  setSelectedApp(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Approve Aid</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
