import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  UserCheck, 
  FileText, 
  Download, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Pill,
  ShieldCheck,
  ChevronRight,
  Filter
} from 'lucide-react';
import type { ApplicationRecord } from '../../types';

interface DisbursementViewProps {
  darkMode?: boolean;
  onNavigateToModule?: (tab: string) => void;
  applications?: ApplicationRecord[];
}

export const DisbursementView: React.FC<DisbursementViewProps> = ({
  darkMode = true,
  onNavigateToModule,
  applications = [],
}) => {
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('ALL');
  const [viewingSlipApp, setViewingSlipApp] = useState<ApplicationRecord | null>(null);

  // Filter Applications to show all user applications so records NEVER vanish
  const activeApplications = useMemo(() => {
    return applications;
  }, [applications]);

  // Filtered by Category / Module Pill
  const filteredActiveApps = useMemo(() => {
    return activeApplications.filter((app) => {
      if (selectedModuleFilter === 'ALL') return true;
      const cat = (app.category || '').toLowerCase();
      const serv = (app.serviceName || '').toLowerCase();
      const filter = selectedModuleFilter.toLowerCase();

      if (filter === 'aics') return cat.includes('aics') || serv.includes('aics') || serv.includes('medical') || serv.includes('funeral');
      if (filter === 'pwd') return cat.includes('pwd') || serv.includes('pwd');
      if (filter === 'senior') return cat.includes('senior') || serv.includes('senior');
      if (filter === 'soloparent') return cat.includes('solo') || serv.includes('solo');
      if (filter === 'livelihood') return cat.includes('livelihood') || serv.includes('livelihood');
      return true;
    });
  }, [activeApplications, selectedModuleFilter]);

  return (
    <div className={`space-y-8 select-none font-['Plus_Jakarta_Sans',sans-serif] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* HEADER BANNER */}
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all ${
        darkMode 
          ? 'bg-gradient-to-r from-[#0d1d3a] via-[#0f2752] to-[#141d33] border-blue-900/50' 
          : 'bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white border-blue-800'
      }`}>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Active Financial Aid & Payout Tracking</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Financial Aid Disbursement & Active Tracking
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            Track the real-time status of your active assistance requests, view assigned appointment schedules, and manage your financial release details.
          </p>
        </div>
      </div>

      {/* MODULE FILTER PILLS */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          Filter Module:
        </span>
        <button
          type="button"
          onClick={() => setSelectedModuleFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            selectedModuleFilter === 'ALL'
              ? 'bg-blue-600 text-white shadow-lg border border-blue-400/40'
              : 'bg-[#0e1726] text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          ALL APPLICATIONS ({activeApplications.length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedModuleFilter('aics')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            selectedModuleFilter === 'aics'
              ? 'bg-blue-600 text-white shadow-lg border border-blue-400/40'
              : 'bg-[#0e1726] text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          AICS ASSISTANCE
        </button>
        <button
          type="button"
          onClick={() => setSelectedModuleFilter('pwd')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            selectedModuleFilter === 'pwd'
              ? 'bg-blue-600 text-white shadow-lg border border-blue-400/40'
              : 'bg-[#0e1726] text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          PWD SERVICES
        </button>
        <button
          type="button"
          onClick={() => setSelectedModuleFilter('senior')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            selectedModuleFilter === 'senior'
              ? 'bg-blue-600 text-white shadow-lg border border-blue-400/40'
              : 'bg-[#0e1726] text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          SENIOR CITIZEN
        </button>
        <button
          type="button"
          onClick={() => setSelectedModuleFilter('soloparent')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            selectedModuleFilter === 'soloparent'
              ? 'bg-blue-600 text-white shadow-lg border border-blue-400/40'
              : 'bg-[#0e1726] text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          SOLO PARENT
        </button>
        <button
          type="button"
          onClick={() => setSelectedModuleFilter('livelihood')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
            selectedModuleFilter === 'livelihood'
              ? 'bg-blue-600 text-white shadow-lg border border-blue-400/40'
              : 'bg-[#0e1726] text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          LIVELIHOOD
        </button>
      </div>

      {/* ACTIVE APPLICATIONS TRACKING LIST */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-white tracking-wide uppercase flex items-center justify-between">
          <span>Active Requests ({filteredActiveApps.length})</span>
          <span className="text-[10px] text-slate-400 font-mono normal-case">Real-time status updates</span>
        </h3>

        {filteredActiveApps.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredActiveApps.map((app) => {
              const statusText = (app.status as string) || 'Pending';
              const isScheduled = statusText === 'Approved' || statusText === 'Ready for Payout' || statusText === 'Interview Scheduled' || statusText === 'Approved by Admin';
              const isReferred = statusText === 'Referred to Partner Agency' || statusText === 'Referred';
              const isRejected = statusText === 'Rejected' || statusText === 'Disapproved';
              const isReleased = statusText === 'RELEASED / COMPLETED' || statusText === 'Completed';

              const name = (app as any).applicantName || app.details?.applicantName || 'Juan Dela Cruz';

              let statusBadgeStyle = 'bg-amber-950/80 text-amber-400 border-amber-500/40';
              let statusDotStyle = 'bg-amber-400';
              let statusLabel = statusText;

              if (isReleased) {
                statusBadgeStyle = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
                statusDotStyle = 'bg-emerald-400';
                statusLabel = 'RELEASED / COMPLETED';
              } else if (isReferred) {
                statusBadgeStyle = 'bg-purple-950/80 text-purple-300 border-purple-500/40';
                statusDotStyle = 'bg-purple-400';
                statusLabel = 'REFERRED TO DSWD/PCSO';
              } else if (isRejected) {
                statusBadgeStyle = 'bg-rose-950/80 text-rose-300 border-rose-500/40';
                statusDotStyle = 'bg-rose-400';
                statusLabel = 'REJECTED';
              } else if (isScheduled) {
                statusBadgeStyle = 'bg-blue-950/80 text-blue-300 border-blue-500/40';
                statusDotStyle = 'bg-blue-400';
                statusLabel = 'INTERVIEW SCHEDULED';
              }

              let processExplanation = 'Admin is currently reviewing your uploaded documents (SOA / Doctor Prescription). Please await further updates.';
              if (isScheduled) {
                processExplanation = 'Your physical interview has been scheduled at the Quezon City Hall SSDD Assessment Area.';
              } else if (isReferred) {
                processExplanation = 'Your case has been officially referred to DSWD / PCSO for additional financial aid evaluation.';
              } else if (isRejected) {
                processExplanation = 'Your application has been disapproved. This record will remain preserved in your Application History.';
              } else if (isReleased) {
                processExplanation = 'Your Medical Financial Assistance has been successfully released and processed. Thank you!';
              }

              return (
                <div
                  key={app.referenceNo}
                  className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-400 tracking-wider uppercase block">
                        REF NO: {app.referenceNo}
                      </span>
                      <h4 className="text-base font-extrabold text-white mt-0.5">{app.serviceName}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${statusBadgeStyle}`}>
                        <span className={`w-2 h-2 rounded-full animate-pulse ${statusDotStyle}`}></span>
                        {statusLabel}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-[#080f1e] border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px] font-semibold uppercase block">Applicant Info</span>
                      <div className="font-bold text-white">{name}</div>
                      <div className="text-slate-400 text-[11px] font-mono">Date Filed: {app.dateSubmitted}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#080f1e] border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px] font-semibold uppercase block">Assigned Worker</span>
                      <div className="font-bold text-slate-200">{app.assignedSocialWorker || 'Maria Santos, RSW'}</div>
                      <div className="text-slate-400 text-[11px]">SSDD Assessment Team</div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#080f1e] border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px] font-semibold uppercase block">Assistance Benefit Type</span>
                      <div className="font-bold text-amber-400">
                        {app.serviceName.toLowerCase().includes('medicine')
                          ? 'Pharmacy Voucher / Reseta'
                          : app.serviceName.toLowerCase().includes('funeral')
                          ? 'Funeral Guarantee Certificate'
                          : 'Hospital Guarantee Letter (GL)'}
                      </div>
                      <div className="text-slate-400 text-[11px]">Quezon City SSDD Program</div>
                    </div>
                  </div>

                  {/* STATUS EXPLANATION BOX */}
                  <div className="p-4 rounded-xl bg-[#091326] border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 text-xs">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        CURRENT PROCESS STAGE:
                      </span>
                      <p className="text-slate-200 font-medium">
                        {processExplanation}
                      </p>
                    </div>

                    {isScheduled && (
                      <button
                        type="button"
                        onClick={() => setViewingSlipApp(app)}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center gap-2 shrink-0"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Appointment Slip</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-16 text-center shadow-xl flex flex-col items-center justify-center space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#121c2e] border border-slate-800 text-slate-400">
              <FileText className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h4 className="text-base font-extrabold text-white">No active financial requests</h4>
            <p className="text-xs text-slate-400 max-w-sm">
              All your submitted applications have either been completed and archived in <span className="text-blue-400 font-bold">Application History</span> or no applications have been filed yet.
            </p>
          </div>
        )}
      </div>

      {/* APPOINTMENT SLIP MODAL (NO QR CODE) */}
      {viewingSlipApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl p-8 font-sans border border-slate-300">
            {/* Header */}
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
                  OFFICIAL APPOINTMENT ASSESSMENT SLIP
                </span>
              </div>
            </div>

            {/* Reference info */}
            <div className="flex justify-between items-center py-3 border-b border-slate-200 text-xs font-mono">
              <div>
                <span className="text-slate-500 font-bold block text-[10px]">APPOINTMENT CONTROL NO:</span>
                <span className="font-black text-blue-900 text-sm">APT-2026-8819</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 font-bold block text-[10px]">APPLICATION REF NO:</span>
                <span className="font-bold text-slate-800">{viewingSlipApp.referenceNo}</span>
              </div>
            </div>

            {/* Schedule Box */}
            <div className="py-4 space-y-4 text-xs">
              <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-200 space-y-2">
                <h4 className="text-[11px] font-black uppercase text-blue-900 tracking-wider">📅 INTERVIEW SCHEDULE DETAILS:</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">SCHEDULED DATE:</span>
                    <span className="font-extrabold text-slate-900 text-sm">NOVEMBER 12, 2026 (Thursday)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">TIME SLOT:</span>
                    <span className="font-extrabold text-blue-900">09:00 AM - 10:00 AM</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">OFFICE VENUE:</span>
                    <span className="font-bold text-slate-800">QC Hall SSDD Desk 3, Ground Flr High-Rise Bldg</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">ASSIGNED SOCIAL WORKER:</span>
                    <span className="font-extrabold text-slate-900">{viewingSlipApp.assignedSocialWorker || 'Maria Santos, RSW'}</span>
                  </div>
                </div>
              </div>

              {/* Requirements Checklist */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h4 className="text-[11px] font-black uppercase text-slate-700 tracking-wider">📋 REQUIRED ORIGINAL DOCUMENTS TO BRING:</h4>
                <ul className="space-y-1 text-xs text-slate-800 font-medium">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Original Hospital Statement of Account (SOA) / Doctor's Prescription</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Original Medical Certificate / Clinical Summary</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Barangay Certificate of Indigency</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Valid Government Issued Photo ID (PhilSys / Comelec / UMID)</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-semibold">
                NOTICE: Please arrive 15 minutes prior to your scheduled time and report to the SSDD Reception Desk for verification of your name and Appointment Control No.
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="text-[10px] text-slate-500 font-mono">CONFIRMED BY SSDD SYSTEM</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setViewingSlipApp(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>PRINT / DOWNLOAD SLIP</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
