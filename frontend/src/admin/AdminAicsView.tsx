import React, { useState, useMemo } from 'react';
import { 
  Search, 
  FileText, 
  Eye, 
  X,
  Check,
  Building2,
  Pill,
  FileCheck2,
  ExternalLink,
  Download,
  Image as ImageIcon,
  Printer
} from 'lucide-react';
import type { ApplicationRecord } from '../types';

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
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'MEDICAL_BILL' | 'MEDICINE' | 'BURIAL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);
  const [inspectingDoc, setInspectingDoc] = useState<{ title: string; type: string } | null>(null);
  const [printingGL, setPrintingGL] = useState<ApplicationRecord | null>(null);

  const allApps: ApplicationRecord[] = useMemo(() => {
    return applications;
  }, [applications]);

  const aicsApps = useMemo(() => {
    return allApps.filter(app => 
      app.category.toUpperCase() === 'AICS' || 
      app.serviceName.toLowerCase().includes('aics') || 
      app.serviceName.toLowerCase().includes('medical') ||
      app.serviceName.toLowerCase().includes('medicine') ||
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
      const lowerName = app.serviceName.toLowerCase();
      if (categoryFilter === 'MEDICAL_BILL' && !(lowerName.includes('bill') || lowerName.includes('hospital'))) return false;
      if (categoryFilter === 'MEDICINE' && !(lowerName.includes('medicine') || lowerName.includes('prescription') || lowerName.includes('supplies'))) return false;
      if (categoryFilter === 'BURIAL' && !(lowerName.includes('funeral') || lowerName.includes('burial'))) return false;

      if (statusFilter === 'pending' && !(app.status === 'Under Review' || app.status === 'Pending Documents')) return false;
      if (statusFilter === 'approved' && !(app.status === 'Approved' || app.status === 'Ready for Payout')) return false;
      if (statusFilter === 'rejected' && !((app.status as string) === 'Rejected' || (app.status as string) === 'Disqualified')) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const refMatch = app.referenceNo.toLowerCase().includes(q);
        const nameMatch = app.serviceName.toLowerCase().includes(q);
        const applicantNameMatch = ((app as any).applicantName || app.details?.applicantName || '').toLowerCase().includes(q);
        const workerMatch = (app.assignedSocialWorker || '').toLowerCase().includes(q);
        const statusMatch = app.status.toLowerCase().includes(q);
        return refMatch || nameMatch || applicantNameMatch || workerMatch || statusMatch;
      }
      return true;
    });
  }, [aicsApps, categoryFilter, statusFilter, searchQuery]);

  return (
    <div className={`space-y-6 select-none font-['Plus_Jakarta_Sans',sans-serif] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          AICS Assistance Services
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">TOTAL APPLICATIONS</span>
          <div className="text-3xl font-extrabold text-white tracking-tight mt-2">{aicsApps.length}</div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">PENDING REVIEW</span>
          <div className="text-3xl font-extrabold text-white tracking-tight mt-2">{pendingCount}</div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">APPROVED</span>
          <div className="text-3xl font-extrabold text-white tracking-tight mt-2">{approvedCount}</div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">REJECTED</span>
          <div className="text-3xl font-extrabold text-white tracking-tight mt-2">{rejectedCount}</div>
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
            <button
              type="button"
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition-all text-xs ${
                categoryFilter === 'ALL'
                  ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40'
                  : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              ALL CATEGORIES
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('MEDICAL_BILL')}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition-all text-xs ${
                categoryFilter === 'MEDICAL_BILL'
                  ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40'
                  : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              MEDICAL BILL AID
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('MEDICINE')}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition-all text-xs ${
                categoryFilter === 'MEDICINE'
                  ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40'
                  : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              MEDICINE AID
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('BURIAL')}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition-all text-xs ${
                categoryFilter === 'BURIAL'
                  ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40'
                  : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              BURIAL / FUNERAL
            </button>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-800/80 pl-6">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mr-1">STATUS</span>
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition-all text-xs ${
                statusFilter === 'all'
                  ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40'
                  : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              ALL STATUSES
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition-all text-xs ${
                statusFilter === 'pending'
                  ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40'
                  : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              PENDING
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('approved')}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition-all text-xs ${
                statusFilter === 'approved'
                  ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40'
                  : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              APPROVED
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('rejected')}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition-all text-xs ${
                statusFilter === 'rejected'
                  ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40'
                  : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              REJECTED
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white tracking-wide">
          Applications <span className="text-slate-400 font-mono text-xs">({filteredApps.length})</span>
        </h3>

        {filteredApps.length > 0 ? (
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
                  {filteredApps.map((app) => (
                    <tr 
                      key={app.referenceNo}
                      className="hover:bg-[#142036] transition-colors group cursor-pointer"
                      onClick={() => setSelectedApp(app)}
                    >
                      <td className="py-4 px-6 font-mono font-bold text-blue-400">{app.referenceNo}</td>
                      <td className="py-4 px-6 font-bold text-white">{(app as any).applicantName || app.details?.applicantName || 'Applicant'}</td>
                      <td className="py-4 px-6 text-slate-300">
                        <span className="flex items-center gap-1.5">
                          {app.serviceName.toLowerCase().includes('medicine') ? (
                            <Pill className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          ) : (
                            <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          )}
                          <span>{app.serviceName}</span>
                        </span>
                      </td>
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
                      <td className="py-4 px-6 text-right flex items-center justify-end gap-2">
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

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPrintingGL(app);
                          }}
                          className="px-3 py-1.5 bg-blue-950/80 hover:bg-blue-900 text-blue-300 rounded-lg text-xs font-bold border border-blue-800 transition-colors inline-flex items-center gap-1"
                          title="Print Official Guarantee Letter / Voucher"
                        >
                          <Printer className="w-3.5 h-3.5 text-blue-400" />
                          <span>Print GL</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-16 text-center shadow-xl flex flex-col items-center justify-center">
            <div className="p-3.5 rounded-2xl bg-[#121c2e] border border-slate-800 text-slate-400 mb-3">
              <FileText className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h4 className="text-base font-extrabold text-white">No applications found</h4>
            <p className="text-xs text-slate-400 mt-1">Try a different search term or filter.</p>
          </div>
        )}
      </div>

      {/* MANAGE APPLICATION MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700/80 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
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
                  <div className="font-bold text-white text-sm mt-0.5">{(selectedApp as any).applicantName || selectedApp.details?.applicantName || 'Applicant'}</div>
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
                  <span className="text-slate-400 text-[10px] font-semibold uppercase">Issuance Type</span>
                  <div className="font-bold text-amber-400 mt-0.5">
                    {selectedApp.serviceName.toLowerCase().includes('medicine')
                      ? '💊 Medicine Voucher / Gift Cert'
                      : '🏥 Hospital Guarantee Letter (GL)'}
                  </div>
                </div>
              </div>

              {/* STEP 3 UPLOADED DOCUMENTS INSPECTION PANEL */}
              <div className="p-4 rounded-xl bg-[#091124] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider block">
                    STEP 3 UPLOADED DOCUMENTS (INSPECTION):
                  </span>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                    VERIFIED IN DATABASE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInspectingDoc({ 
                      title: selectedApp.serviceName.toLowerCase().includes('medicine') ? "Doctor's Prescription (Reseta)" : "Hospital Bill / Statement of Account (SOA)",
                      type: selectedApp.serviceName.toLowerCase().includes('medicine') ? "Reseta" : "Hospital SOA" 
                    })}
                    className="p-2.5 rounded-xl bg-[#0d1830] hover:bg-[#15264a] border border-slate-700/80 flex items-center justify-between transition-all group text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {selectedApp.serviceName.toLowerCase().includes('medicine') ? (
                        <Pill className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                      )}
                      <div className="truncate">
                        <span className="text-[11px] font-extrabold text-white block truncate">
                          {selectedApp.serviceName.toLowerCase().includes('medicine') ? "Doctor's Prescription" : "Hospital Statement of Account"}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono block">Attached PDF / Image</span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300 shrink-0 ml-1" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setInspectingDoc({ 
                      title: "Medical Certificate / Clinical Summary",
                      type: "Medical Certificate" 
                    })}
                    className="p-2.5 rounded-xl bg-[#0d1830] hover:bg-[#15264a] border border-slate-700/80 flex items-center justify-between transition-all group text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="truncate">
                        <span className="text-[11px] font-extrabold text-white block truncate">
                          Medical Certificate
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono block">Attached PDF / Image</span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300 shrink-0 ml-1" />
                  </button>
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] font-semibold uppercase block mb-1.5">Current Status</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  {selectedApp.status}
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#0a1120] border-t border-slate-800 flex justify-end gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => setPrintingGL(selectedApp)}
                className="px-4 py-2 bg-blue-950/80 hover:bg-blue-900 border border-blue-800 text-blue-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official GL / Voucher</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onUpdateStatus) onUpdateStatus(selectedApp.referenceNo, 'Rejected');
                  setSelectedApp(null);
                }}
                className="px-4 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-700/50 text-rose-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Reject</span>
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
                <span>Approve & Issue GL</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE OFFICIAL GUARANTEE LETTER (GL) / VOUCHER MODAL */}
      {printingGL && (
        <div className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl p-8 font-sans border border-slate-300">
            {/* Header with QC Seal */}
            <div className="text-center space-y-1 border-b pb-4 border-slate-300">
              <div className="flex items-center justify-center gap-3">
                <img src="/Government Service Integrity Seal.png" alt="QC Seal" className="w-12 h-12 object-contain" />
                <div>
                  <h2 className="text-base font-black tracking-tight uppercase text-slate-900">REPUBLIC OF THE PHILIPPINES</h2>
                  <h3 className="text-xs font-bold text-slate-700">QUEZON CITY GOVERNMENT</h3>
                  <h4 className="text-[11px] font-extrabold text-blue-900 uppercase">SOCIAL SERVICES & DEVELOPMENT DEPARTMENT (SSDD)</h4>
                </div>
              </div>
              <div className="pt-2">
                <span className="inline-block px-4 py-1 bg-blue-50 border border-blue-300 text-blue-950 text-xs font-black rounded-lg tracking-widest uppercase">
                  OFFICIAL GUARANTEE LETTER (GL)
                </span>
              </div>
            </div>

            {/* Document Control Details */}
            <div className="flex justify-between items-center py-4 border-b border-slate-200 text-xs font-mono">
              <div>
                <span className="text-slate-500 font-bold block text-[10px]">GL CONTROL NO:</span>
                <span className="font-black text-blue-900 text-sm">GL-2026-99210</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 font-bold block text-[10px]">DATE ISSUED:</span>
                <span className="font-bold text-slate-800">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Body Recommendation Details */}
            <div className="py-4 space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-[11px] font-black uppercase text-slate-700 tracking-wider">RECOMMENDATION DETAILS:</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">APPLICANT NAME:</span>
                    <span className="font-extrabold text-slate-900 text-sm">{(printingGL as any).applicantName || printingGL.details?.applicantName || 'Juan Dela Cruz'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">TYPE OF ASSISTANCE:</span>
                    <span className="font-extrabold text-blue-900">{printingGL.serviceName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">MEDICAL DIAGNOSIS / CONDITION:</span>
                    <span className="font-bold text-slate-800">Confinement / Dialysis / Chemotherapy</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">ACCREDITED PARTNER HOSPITAL / FACILITY:</span>
                    <span className="font-extrabold text-slate-900">Quezon City General Hospital (QCGH)</span>
                  </div>
                </div>
              </div>

              {/* Amount Details */}
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                <h4 className="text-[11px] font-black uppercase text-amber-900 tracking-wider">AMOUNT OF ASSISTANCE:</h4>
                <div className="space-y-1 font-mono text-xs">
                  <p><span className="font-bold">• Amount in Words:</span> _______________________________________________________</p>
                  <p><span className="font-bold">• Amount in Figures:</span> <span className="font-black text-sm text-slate-900">₱ __________________</span></p>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
                <div>
                  <div className="border-b border-slate-800 pb-1 font-bold text-slate-900">Maria Santos, RSW</div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Prepared and Certified by (Social Worker)</span>
                </div>
                <div>
                  <div className="border-b border-slate-800 pb-1 font-bold text-slate-900">SSDD Department Head</div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Approved by (Authorized Signatory)</span>
                </div>
              </div>
            </div>

            {/* Print Action Footer */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-mono">STATUS: ISSUED & READY FOR PRINTING</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPrintingGL(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>PRINT OFFICIAL GL</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
