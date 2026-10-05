import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  UserCheck, 
  FileText, 
  Download, 
  Eye,
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

const formatTo12Hour = (timeStr: string) => {
  if (!timeStr) return '';
  const [hoursStr, minutesStr] = timeStr.split(':');
  let hours = parseInt(hoursStr, 10);
  if (isNaN(hours)) return timeStr;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutes = minutesStr ? minutesStr.padStart(2, '0') : '00';
  return `${hours}:${minutes} ${ampm}`;
};

export const DisbursementView: React.FC<DisbursementViewProps> = ({
  darkMode = true,
  onNavigateToModule,
  applications = [],
}) => {
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('ALL');
  const [expandedRef, setExpandedRef] = useState<string | null>(null);
  const [dbAppointments, setDbAppointments] = useState<any[]>([]);

  // Fetch appointments registry from PostgreSQL DB with fast state comparison
  React.useEffect(() => {
    const fetchAppts = () => {
      fetch('http://localhost:5000/api/appointments')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setDbAppointments(prev => {
              if (prev.length === data.length) {
                let isMatch = true;
                for (let i = 0; i < prev.length; i++) {
                  if (
                    prev[i].referenceNo !== data[i].referenceNo &&
                    prev[i].reference_no !== data[i].reference_no
                  ) {
                    isMatch = false;
                    break;
                  }
                }
                if (isMatch) return prev;
              }
              return data;
            });
          }
        })
        .catch(() => {});
    };
    fetchAppts();
    const interval = setInterval(fetchAppts, 3000);
    return () => clearInterval(interval);
  }, []);

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
              const name = (app as any).applicantName || app.details?.applicantName || 'Juan Dela Cruz';

              const appt = (app as any).appointmentDetails;
              const dbAppt = dbAppointments.find((a) => (a.reference_no || a.referenceNo) === app.referenceNo);

              // 1. Payout Schedule (Set exclusively in Financial Aid Disbursement)
              const rawPayoutDate = (app as any).scheduledPayoutDate || (app as any).scheduled_payout_date;
              const rawPayoutTime = (app as any).scheduledPayoutTime || (app as any).scheduled_payout_time;

              // 2. Interview Schedule (Set exclusively in Appointments Registry)
              const rawInterviewDate = (app as any).appointmentDate || (app as any).appointment_date || appt?.appointmentDate || dbAppt?.appointment_date || dbAppt?.appointmentDate || dbAppt?.date;
              const rawInterviewTime = (app as any).appointmentTime || (app as any).appointment_time || appt?.appointmentTime || dbAppt?.appointment_time || dbAppt?.appointmentTime || dbAppt?.time;

              const hasExplicitPayoutSched = !!(rawPayoutDate || rawPayoutTime) || statusText === 'Payout Scheduled';

              const isPayoutScheduled = (statusText === 'Ready for Payout' || statusText === 'Approved by Admin' || statusText === 'Payout Scheduled') && hasExplicitPayoutSched;
              const isInterviewScheduled = (statusText === 'Approved' || statusText === 'Interview Scheduled' || statusText === 'Pending Appointment') && !hasExplicitPayoutSched;
              const isScheduled = hasExplicitPayoutSched || isInterviewScheduled;
              const isReferred = statusText === 'Referred to Partner Agency' || statusText === 'Referred';
              const isRejected = 
                statusText === 'Rejected' || 
                statusText === 'Disapproved' || 
                statusText === 'REJECTED' || 
                statusText === 'DISAPPROVED' || 
                statusText.toLowerCase().includes('reject') || 
                statusText.toLowerCase().includes('disapprov') ||
                statusText.toLowerCase().includes('disqualif');
              const isReleased = statusText === 'RELEASED / COMPLETED' || statusText === 'Completed';

              const formatScheduleDate = (dStr?: string) => {
                if (!dStr) return '';
                if (dStr.includes('•')) return dStr;
                try {
                  const parts = dStr.split('-');
                  if (parts.length === 3) {
                    const y = parseInt(parts[0], 10);
                    const m = parseInt(parts[1], 10) - 1;
                    const d = parseInt(parts[2], 10);
                    const dt = new Date(y, m, d);
                    if (!isNaN(dt.getTime())) {
                      return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    }
                  }
                } catch (e) {
                  // ignore
                }
                return dStr;
              };

              const payoutDateFormatted = formatScheduleDate(rawPayoutDate);
              const payoutTimeFormatted = rawPayoutTime ? formatTo12Hour(rawPayoutTime) : '';

              const interviewDateFormatted = formatScheduleDate(rawInterviewDate) || 'Oct 4, 2026';
              const interviewTimeFormatted = rawInterviewTime ? formatTo12Hour(rawInterviewTime) : '';

              let statusBadgeStyle = 'bg-amber-950/80 text-amber-400 border-amber-500/40';
              let statusDotStyle = 'bg-amber-400';
              let statusLabel = statusText;

              if (isReleased) {
                statusBadgeStyle = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
                statusDotStyle = 'bg-emerald-400';
                statusLabel = 'RELEASED / COMPLETED';
              } else if (isPayoutScheduled) {
                statusBadgeStyle = 'bg-amber-950/80 text-amber-300 border-amber-500/40';
                statusDotStyle = 'bg-amber-400';
                statusLabel = payoutDateFormatted
                  ? `PAYOUT SCHEDULED (${payoutDateFormatted.toUpperCase()}${payoutTimeFormatted ? ` • ${payoutTimeFormatted}` : ''})`
                  : 'PAYOUT SCHEDULED';
              } else if (statusText === 'Ready for Payout' || statusText === 'Approved by Admin') {
                statusBadgeStyle = 'bg-blue-950/80 text-blue-300 border-blue-500/40';
                statusDotStyle = 'bg-blue-400';
                statusLabel = 'READY FOR PAYOUT SCHEDULE';
              } else if (isReferred) {
                statusBadgeStyle = 'bg-purple-950/80 text-purple-300 border-purple-500/40';
                statusDotStyle = 'bg-purple-400';
                statusLabel = 'REFERRED TO DSWD/PCSO';
              } else if (isRejected) {
                statusBadgeStyle = 'bg-red-950/90 text-red-400 border-red-600/60 shadow-sm shadow-red-900/30';
                statusDotStyle = 'bg-red-500';
                statusLabel = statusText.toUpperCase().includes('DISAPPROVED') ? 'DISAPPROVED' : 'REJECTED';
              } else if (isInterviewScheduled) {
                statusBadgeStyle = 'bg-blue-950/80 text-blue-300 border-blue-500/40';
                statusDotStyle = 'bg-blue-400';
                statusLabel = 'INTERVIEW SCHEDULED';
              }

              let processExplanation = 'Admin is currently reviewing your uploaded documents (SOA / Doctor Prescription). Please await further updates.';
              if (isReleased) {
                processExplanation = `Your ${app.serviceName} has been successfully released and processed. Thank you!`;
              } else if (isPayoutScheduled) {
                processExplanation = `Your Financial Aid Payout has been scheduled for release on ${payoutDateFormatted || 'assigned date'}${payoutTimeFormatted ? ` at ${payoutTimeFormatted}` : ''}. Please present your ID at the SSDD releasing desk upon claiming.`;
              } else if (statusText === 'Ready for Payout' || statusText === 'Approved by Admin') {
                processExplanation = 'Your financial aid request is approved and ready for disbursement. The SSDD Treasury is currently setting your official payout date & time schedule.';
              } else if (isInterviewScheduled) {
                processExplanation = `Your physical interview has been scheduled for ${interviewDateFormatted}${interviewTimeFormatted ? ` at ${interviewTimeFormatted}` : ''} at Quezon City Hall SSDD Assessment Area.`;
              } else if (isReferred) {
                processExplanation = 'Your case has been officially referred to DSWD / PCSO for additional financial aid evaluation.';
              } else if (isRejected) {
                processExplanation = 'Your application has been disapproved. This record will remain preserved in your Application History.';
              }

              const isExpanded = expandedRef === app.referenceNo;

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
                      <div className="text-slate-400 text-[11px] font-mono space-y-0.5">
                        <div>Date Filed: {app.dateSubmitted}</div>
                        {hasExplicitPayoutSched && (
                          <div className={`font-bold text-[11px] mt-0.5 ${isReleased ? 'text-emerald-400' : 'text-amber-400'}`}>
                            Payout Sched: {payoutDateFormatted || 'Date Pending'}{payoutTimeFormatted ? ` • ${payoutTimeFormatted}` : ''}
                          </div>
                        )}
                        {isInterviewScheduled && !hasExplicitPayoutSched && (
                          <div className="text-blue-400 font-bold text-[11px] mt-0.5">
                            Interview Sched: {interviewDateFormatted}{interviewTimeFormatted ? ` • ${interviewTimeFormatted}` : ''}
                          </div>
                        )}
                      </div>
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
                        onClick={() => setExpandedRef(isExpanded ? null : app.referenceNo)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center gap-2 shrink-0 ${
                          isExpanded
                            ? 'bg-slate-700 hover:bg-slate-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                        <span>{isExpanded ? 'Hide Schedule Slip' : isPayoutScheduled ? 'View Payout Schedule Slip' : 'View Appointment Slip'}</span>
                      </button>
                    )}
                  </div>

                  {/* INLINE EXPANDABLE APPOINTMENT SLIP */}
                  {isExpanded && (() => {
                    const isFuneral = app.serviceName.toLowerCase().includes('funeral') || app.serviceName.toLowerCase().includes('burial');

                    return (
                      <div className="mt-4 p-5 rounded-2xl bg-[#09152b] border border-blue-500/40 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-2">
                          <div className="flex items-center gap-2.5">
                            <img src="/Government Service Integrity Seal.png" alt="QC Seal" className="w-7 h-7 object-contain" />
                            <div>
                              <h5 className="text-xs font-black text-white tracking-wider uppercase">
                                {isPayoutScheduled ? 'OFFICIAL PAYOUT SCHEDULE SLIP' : 'OFFICIAL APPOINTMENT ASSESSMENT SLIP'}
                              </h5>
                              <span className="text-[10px] text-blue-400 font-mono">APT CONTROL NO: {app.referenceNo.replace('QC-AICS-2026-', 'APT-2026-')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          {/* SCHEDULE BOX */}
                          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/50 space-y-2.5">
                            <h6 className="text-[11px] font-black uppercase text-blue-300 tracking-wider flex items-center gap-1.5">
                              <span>{isPayoutScheduled ? '💵 PAYOUT RELEASE SCHEDULE DETAILS' : '📅 INTERVIEW SCHEDULE DETAILS'}</span>
                            </h6>
                            <div className="space-y-1.5 text-xs">
                              <div>
                                <span className="text-slate-400 text-[10px] block uppercase font-bold">SCHEDULED DATE:</span>
                                <span className="font-extrabold text-white text-sm">
                                  {(isPayoutScheduled ? (payoutDateFormatted || 'Date Pending') : interviewDateFormatted).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-400 text-[10px] block uppercase font-bold">TIME SLOT:</span>
                                <span className="font-extrabold text-blue-400">
                                  {isPayoutScheduled ? (payoutTimeFormatted || 'Time Pending') : interviewTimeFormatted}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-400 text-[10px] block uppercase font-bold">OFFICE VENUE:</span>
                                <span className="font-bold text-slate-200">QC Hall SSDD Desk 3, Ground Flr High-Rise Bldg</span>
                              </div>
                              <div>
                                <span className="text-slate-400 text-[10px] block uppercase font-bold">ASSIGNED SOCIAL WORKER:</span>
                                <span className="font-extrabold text-white">{app.assignedSocialWorker || 'Maria Santos, RSW'}</span>
                              </div>
                            </div>
                          </div>

                          {/* REQUIREMENTS CHECKLIST */}
                          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                            <h6 className="text-[11px] font-black uppercase text-slate-300 tracking-wider">📋 REQUIRED ORIGINAL DOCUMENTS TO BRING</h6>
                            <ul className="space-y-1.5 text-xs text-slate-200 font-medium">
                              {isFuneral ? (
                                <>
                                  <li className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Death Certificate - Original Certified True Copy</span>
                                  </li>
                                  <li className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Statement of Account / Official Funeral Contract</span>
                                  </li>
                                  <li className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Barangay Certificate of Indigency</span>
                                  </li>
                                  <li className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Valid Photo ID of Informant / Nearest Kin (PhilSys / QC ID / UMID)</span>
                                  </li>
                                </>
                              ) : (
                                <>
                                  <li className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Original Hospital Statement of Account (SOA) / Doctor&apos;s Prescription</span>
                                  </li>
                                  <li className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Original Medical Certificate / Clinical Summary</span>
                                  </li>
                                  <li className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Barangay Certificate of Indigency</span>
                                  </li>
                                  <li className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Valid Government Issued Photo ID (PhilSys / Comelec / UMID)</span>
                                  </li>
                                </>
                              )}
                            </ul>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300 font-medium">
                          NOTICE: Please arrive 15 minutes prior to your scheduled time and report to the SSDD Reception Desk for verification of your name and Appointment Control No.
                        </div>
                      </div>
                    );
                  })()}
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
    </div>
  );
};
