import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  Calendar, 
  ChevronDown, 
  Clock, 
  MapPin, 
  UserCheck, 
  Check, 
  X, 
  Printer, 
  Eye, 
  FileText, 
  Building2, 
  Pill,
  Send,
  Plus,
  ExternalLink
} from 'lucide-react';
import type { ApplicationRecord } from '../types';

interface AppointmentEntry {
  id?: number;
  referenceNo: string;
  moduleName: string;
  applicantName: string;
  appointmentDate: string;
  appointmentTime: string;
  venue: string;
  purpose: string;
  status: 'Pending Schedule' | 'Interview Scheduled' | 'Approved' | 'Completed' | 'Rejected' | 'Referred';
  socialWorkerNotes?: string;
  serviceName?: string;
}

interface AdminAppointmentViewProps {
  darkMode?: boolean;
  applications?: ApplicationRecord[];
  onUpdateStatus?: (refNo: string, newStatus: ApplicationRecord['status'], extraFields?: Record<string, any>) => void;
}

export const AdminAppointmentView: React.FC<AdminAppointmentViewProps> = ({ 
  darkMode = true,
  applications = [],
  onUpdateStatus
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [moduleFilter, setModuleFilter] = useState<string>('All Modules');
  const [statusFilter, setStatusFilter] = useState<string>('All Statuses');

  // Appointments DB & State
  const [dbAppointments, setDbAppointments] = useState<AppointmentEntry[]>([]);
  const [schedulingApp, setSchedulingApp] = useState<ApplicationRecord | null>(null);
  const [assessmentApp, setAssessmentApp] = useState<ApplicationRecord | null>(null);
  const [printingGL, setPrintingGL] = useState<ApplicationRecord | null>(null);
  const [nowTick, setNowTick] = useState<number>(Date.now());

  // Timer tick to re-evaluate real-time schedule arrival every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => setNowTick(Date.now()), 3000);
    return () => clearInterval(timer);
  }, []);

  // Helper to check if current date & time has reached or passed the appointment schedule
  const isScheduleTimeReached = (apptDate?: string, apptTime?: string) => {
    if (!apptDate) return false;
    try {
      const targetStr = apptTime ? `${apptDate}T${apptTime}:00` : `${apptDate}T00:00:00`;
      const targetTime = new Date(targetStr).getTime();
      return nowTick >= targetTime;
    } catch (e) {
      return true;
    }
  };

  // Helper to format 24-hour time string into 12-hour AM/PM format
  const formatTo12Hour = (timeStr?: string): string => {
    if (!timeStr) return '';
    if (timeStr.toUpperCase().includes('AM') || timeStr.toUpperCase().includes('PM')) {
      return timeStr;
    }
    try {
      const parts = timeStr.split(':');
      if (parts.length >= 2) {
        let hours = parseInt(parts[0], 10);
        const minutes = parts[1].padStart(2, '0');
        if (isNaN(hours)) return timeStr;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours}:${minutes} ${ampm}`;
      }
    } catch (e) {
      return timeStr;
    }
    return timeStr;
  };

  const getCurrentTimeString = (): string => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getCurrentDateString = (): string => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // Form state for scheduling modal
  const [schedDate, setSchedDate] = useState<string>(getCurrentDateString());
  const [schedTime, setSchedTime] = useState<string>(getCurrentTimeString());
  const [schedVenue] = useState<string>('SSDD Medical Assistance Desk, QC Hall');
  const [schedNotes] = useState<string>('Please bring original Statement of Account (SOA) and valid ID.');

  useEffect(() => {
    if (schedulingApp) {
      setSchedDate(getCurrentDateString());
      setSchedTime(getCurrentTimeString());
    }
  }, [schedulingApp]);

  // Fetch appointments from PostgreSQL Backend API on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/appointments')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped: AppointmentEntry[] = data.map((item: any) => ({
            id: item.id,
            referenceNo: item.reference_no,
            moduleName: item.module_name,
            applicantName: item.applicant_name,
            appointmentDate: item.appointment_date,
            appointmentTime: item.appointment_time,
            venue: item.venue,
            purpose: item.purpose,
            status: item.status || 'Interview Scheduled',
            socialWorkerNotes: item.social_worker_notes
          }));
          setDbAppointments(mapped);
        }
      })
      .catch((err) => console.log('Notice: Backend API offline or fetching from local state', err));
  }, []);

  // Merge Applications from prop with DB appointments
  const combinedList = useMemo(() => {
    // Include all active applications that reached Appointments (Pending Appointment, Interview Scheduled, Approved, Ready for Payout, Referred, Rejected)
    const approvedApps = applications.filter((app) => 
      app.status !== 'Under Review' && 
      app.status !== 'Pending Documents'
    );

    const merged: (ApplicationRecord & { appointmentDetails?: AppointmentEntry })[] = approvedApps.map((app) => {
      const dbAppt = dbAppointments.find((a) => a.referenceNo === app.referenceNo);
      return {
        ...app,
        appointmentDetails: dbAppt
      };
    });
    return merged;
  }, [applications, dbAppointments]);

  // Helper to check if application is approved, payout-ready, or released/completed
  const isAppApproved = (status?: string) => {
    if (!status) return false;
    const s = status.toUpperCase();
    return s.includes('APPROVED') || s.includes('PAYOUT') || s.includes('RELEASED') || s.includes('COMPLETED');
  };

  // Metrics Counters
  const totalCount = combinedList.length;
  const pendingSchedCount = combinedList.filter((a) => !a.appointmentDetails || a.appointmentDetails.status === 'Pending Schedule').length;
  const scheduledCount = combinedList.filter((a) => a.appointmentDetails?.status === 'Interview Scheduled' && !isAppApproved(a.status)).length;
  const approvedCount = combinedList.filter((a) => isAppApproved(a.status) || isAppApproved(a.appointmentDetails?.status)).length;
  const rejectedCount = combinedList.filter((a) => (a.status as string) === 'Rejected' || (a.status as string) === 'Disqualified' || a.appointmentDetails?.status === 'Rejected').length;

  // Filtered List
  const filteredList = useMemo(() => {
    return combinedList.filter((app) => {
      // Module Filter
      if (moduleFilter !== 'All Modules') {
        const cat = (app.category || '').toLowerCase();
        const serv = (app.serviceName || '').toLowerCase();
        const mod = moduleFilter.toLowerCase();

        if (mod.includes('aics') && !(cat.includes('aics') || serv.includes('aics') || serv.includes('medical') || serv.includes('funeral'))) return false;
        if (mod.includes('pwd') && !(cat.includes('pwd') || serv.includes('pwd'))) return false;
        if (mod.includes('senior') && !(cat.includes('senior') || serv.includes('senior'))) return false;
        if (mod.includes('solo parent') && !(cat.includes('solo') || serv.includes('solo'))) return false;
        if (mod.includes('livelihood') && !(cat.includes('livelihood') || serv.includes('livelihood'))) return false;
      }

      // Status Filter
      if (statusFilter !== 'All Statuses') {
        const st = statusFilter.toLowerCase();
        if (st.includes('pending') && !(app.status === 'Under Review' || app.status === 'Pending Documents')) return false;
        if (st.includes('scheduled') && (!app.appointmentDetails || isAppApproved(app.status))) return false;
        if (st.includes('approved') && !(isAppApproved(app.status) || isAppApproved(app.appointmentDetails?.status))) return false;
      }

      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const refMatch = app.referenceNo.toLowerCase().includes(q);
        const nameMatch = ((app as any).applicantName || app.details?.applicantName || '').toLowerCase().includes(q);
        const servMatch = app.serviceName.toLowerCase().includes(q);
        return refMatch || nameMatch || servMatch;
      }

      return true;
    });
  }, [combinedList, moduleFilter, statusFilter, searchQuery]);

  // Open Schedule Modal with default prefilled exact real time and date
  const handleOpenScheduleModal = (app: ApplicationRecord) => {
    setSchedulingApp(app);
    const now = new Date();
    setSchedDate(now.toISOString().split('T')[0]);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setSchedTime(`${hours}:${minutes}`);
  };

  // Save Schedule to PostgreSQL DB & Update Application Status to 'Interview Scheduled'
  const handleSaveSchedule = async () => {
    if (!schedulingApp) return;

    const newAppt: AppointmentEntry = {
      referenceNo: schedulingApp.referenceNo,
      moduleName: schedulingApp.category || 'AICS',
      applicantName: (schedulingApp as any).applicantName || schedulingApp.details?.applicantName || 'Applicant Name',
      appointmentDate: schedDate,
      appointmentTime: schedTime,
      venue: schedVenue,
      purpose: 'Verification & Social Worker Intake',
      status: 'Interview Scheduled',
      socialWorkerNotes: schedNotes
    };

    try {
      await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceNo: newAppt.referenceNo,
          moduleName: newAppt.moduleName,
          applicantName: newAppt.applicantName,
          appointmentDate: newAppt.appointmentDate,
          appointmentTime: newAppt.appointmentTime,
          venue: newAppt.venue,
          purpose: newAppt.purpose,
          socialWorkerNotes: newAppt.socialWorkerNotes
        })
      });
    } catch (e) {
      console.log('Saved to state (offline backend)');
    }

    setDbAppointments((prev) => [newAppt, ...prev.filter((a) => a.referenceNo !== newAppt.referenceNo)]);
    if (onUpdateStatus) {
      onUpdateStatus(schedulingApp.referenceNo, 'Interview Scheduled', {
        appointmentDate: schedDate,
        appointmentTime: schedTime,
        appointmentDetails: {
          appointmentDate: schedDate,
          appointmentTime: schedTime,
          venue: schedVenue,
          notes: schedNotes
        }
      });
    }
    setSchedulingApp(null);
  };

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

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-4 shadow-lg">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">TOTAL REQUESTS</span>
          <div className="text-2xl font-extrabold text-white tracking-tight mt-1.5">{totalCount}</div>
        </div>
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-4 shadow-lg">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">PENDING SCHEDULE</span>
          <div className="text-2xl font-extrabold text-amber-400 tracking-tight mt-1.5">{pendingSchedCount}</div>
        </div>
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-4 shadow-lg">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">SCHEDULED</span>
          <div className="text-2xl font-extrabold text-blue-400 tracking-tight mt-1.5">{scheduledCount}</div>
        </div>
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-4 shadow-lg">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">APPROVED / ISSUED</span>
          <div className="text-2xl font-extrabold text-emerald-400 tracking-tight mt-1.5">{approvedCount}</div>
        </div>
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-4 shadow-lg">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">REJECTED</span>
          <div className="text-2xl font-extrabold text-rose-400 tracking-tight mt-1.5">{rejectedCount}</div>
        </div>
      </div>

      {/* FILTERS */}
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
                <option value="AICS">AICS (Medical / Funeral)</option>
                <option value="PWD">PWD Welfare</option>
                <option value="Senior Citizen">Senior Citizen</option>
                <option value="Solo Parent">Solo Parent</option>
                <option value="Livelihood Program">Livelihood Program</option>
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
                <option value="Pending">Pending Schedule</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Approved">Approved & GL Issued</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* APPOINTMENTS TABLE */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white tracking-wide">
          Appointments Registry <span className="text-slate-400 font-mono text-xs">({filteredList.length})</span>
        </h3>

        {filteredList.length > 0 ? (
          <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-[#121c2e] text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">REFERENCE NO.</th>
                    <th className="py-4 px-6">APPLICANT NAME</th>
                    <th className="py-4 px-6">MODULE / SERVICE</th>
                    <th className="py-4 px-6">SCHEDULE DATE & TIME</th>
                    <th className="py-4 px-6">STATUS</th>
                    <th className="py-4 px-6 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs font-medium">
                  {filteredList.map((app) => {
                    const name = (app as any).applicantName || app.details?.applicantName || 'Juan Dela Cruz';
                    const appt = app.appointmentDetails;
                    const isGLPrintable = (app.serviceName.toLowerCase().includes('medical bill') || app.serviceName.toLowerCase().includes('hospital') || app.assistanceType?.toLowerCase().includes('medical bill') || app.serviceName.toLowerCase().includes('funeral') || app.serviceName.toLowerCase().includes('burial') || app.referenceNo.includes('FUN')) && !app.serviceName.toLowerCase().includes('medicine') && !(app.assistanceType || '').toLowerCase().includes('medicine');

                    return (
                      <tr key={app.referenceNo} className="hover:bg-[#142036] transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-blue-400">{app.referenceNo}</td>
                        <td className="py-4 px-6 font-bold text-white">{name}</td>
                        <td className="py-4 px-6 text-slate-300">
                          <span className="font-semibold">{app.serviceName}</span>
                        </td>
                        <td className="py-4 px-6 text-slate-300 font-mono text-[11px]">
                          {appt ? (
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1 text-slate-200 font-bold">
                                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                <span>{appt.appointmentDate}</span>
                              </div>
                              <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                                <Clock className="w-3 h-3 text-amber-400" />
                                <span>{formatTo12Hour(appt.appointmentTime)}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-amber-400/80 italic text-[11px]">Pending Schedule</span>
                          )}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold border whitespace-nowrap ${
                            app.status === 'Rejected'
                              ? 'bg-rose-950/60 text-rose-300 border-rose-800/40'
                              : app.status === 'Referred to Partner Agency' || app.status === 'Referred'
                              ? 'bg-amber-950/60 text-amber-300 border-amber-800/40'
                              : isAppApproved(app.status) || isAppApproved(appt?.status)
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                              : appt
                              ? 'bg-blue-950/60 text-blue-400 border-blue-500/30'
                              : 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              app.status === 'Rejected'
                                ? 'bg-rose-400'
                                : app.status === 'Referred to Partner Agency' || app.status === 'Referred'
                                ? 'bg-amber-400'
                                : isAppApproved(app.status) || isAppApproved(appt?.status)
                                ? 'bg-emerald-400'
                                : appt
                                ? 'bg-blue-400'
                                : 'bg-amber-400'
                            }`}></span>
                            <span>
                              {app.status === 'Rejected'
                                ? 'Rejected'
                                : app.status === 'Referred to Partner Agency' || app.status === 'Referred'
                                ? 'Referred to Partner Agency'
                                : isAppApproved(app.status) || isAppApproved(appt?.status)
                                ? (app.status === 'RELEASED / COMPLETED' || (app.status as string) === 'Completed' ? 'Released & Archived' : 'Approved & Ready for Payout')
                                : appt
                                ? 'Interview Scheduled'
                                : 'Pending Schedule'}
                            </span>
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          {app.status === 'Rejected' ? (
                            <span className="text-rose-300 font-extrabold text-xs inline-flex items-center gap-1 bg-rose-950/60 border border-rose-800/50 px-3 py-1.5 rounded-xl whitespace-nowrap">
                              <X className="w-3.5 h-3.5 text-rose-400" />
                              <span>Rejected</span>
                            </span>
                          ) : app.status === 'Referred to Partner Agency' || app.status === 'Referred' ? (
                            <span className="text-amber-300 font-extrabold text-xs inline-flex items-center gap-1 bg-amber-950/60 border border-amber-800/50 px-3 py-1.5 rounded-xl whitespace-nowrap">
                              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                              <span>Referred to Partner Agency</span>
                            </span>
                          ) : isAppApproved(app.status) || isAppApproved(appt?.status) ? (
                            <div className="inline-flex items-center justify-end gap-2 whitespace-nowrap">
                              <span className="text-emerald-400 font-extrabold text-xs inline-flex items-center gap-1 bg-emerald-950/60 border border-emerald-700/40 px-3 py-1.5 rounded-xl whitespace-nowrap">
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Approved</span>
                              </span>
                              {isGLPrintable && (
                                <button
                                  type="button"
                                  onClick={() => setPrintingGL(app)}
                                  className="px-3 py-1.5 bg-blue-950/80 hover:bg-blue-900 text-blue-300 rounded-xl text-xs font-bold border border-blue-800 transition-colors inline-flex items-center gap-1 shadow-md whitespace-nowrap"
                                  title="Print Official Guarantee Letter"
                                >
                                  <Printer className="w-3.5 h-3.5 text-blue-400" />
                                  <span>Print GL</span>
                                </button>
                              )}
                            </div>
                          ) : !appt ? (
                            <button
                              type="button"
                              onClick={() => handleOpenScheduleModal(app)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-all whitespace-nowrap"
                            >
                              Set Schedule
                            </button>
                          ) : (
                            <>
                              {isScheduleTimeReached(appt.appointmentDate, appt.appointmentTime) ? (
                                <button
                                  type="button"
                                  onClick={() => setAssessmentApp(app)}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all animate-pulse whitespace-nowrap"
                                >
                                  <span>Conduct Assessment</span>
                                </button>
                              ) : (
                                <span className="text-[10px] text-amber-300/90 font-mono font-semibold px-2.5 py-1 bg-amber-950/40 rounded-lg border border-amber-800/40 inline-flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-amber-400" />
                                  <span>Awaiting Schedule Time</span>
                                </span>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-16 text-center shadow-xl flex flex-col items-center justify-center">
            <div className="p-3.5 rounded-2xl bg-[#121c2e] border border-slate-800 text-slate-400 mb-3">
              <Calendar className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h4 className="text-base font-extrabold text-white">No appointments found</h4>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search terms or module filters.</p>
          </div>
        )}
      </div>

      {/* SCHEDULING MODAL */}
      {schedulingApp && createPortal(
        <div className="fixed inset-0 z-[99999] bg-[#030712]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 font-sans">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-[#131f37]">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider">{schedulingApp.referenceNo}</span>
                <h3 className="text-base font-extrabold text-white mt-0.5">Set Appointment Schedule</h3>
              </div>
              <button
                type="button"
                onClick={() => setSchedulingApp(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">APPLICANT</span>
                  <span className="font-extrabold text-white text-sm">{(schedulingApp as any).applicantName || schedulingApp.details?.applicantName || 'Juan Dela Cruz'}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">MODULE</span>
                  <span className="font-bold text-blue-400">{schedulingApp.serviceName}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider block mb-1">Appointment Date</label>
                  <input
                    type="date"
                    value={schedDate}
                    onChange={(e) => setSchedDate(e.target.value)}
                    className="w-full bg-[#0b1220] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider block mb-1">Time Slot (Real Clock)</label>
                  <input
                    type="time"
                    value={schedTime}
                    onChange={(e) => setSchedTime(e.target.value)}
                    className="w-full bg-[#0b1220] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider block mb-1">Venue / Office Desk</label>
                <input
                  type="text"
                  value="SSDD Medical Assistance Desk, QC Hall"
                  disabled
                  readOnly
                  className="w-full bg-[#0b1220]/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed select-none opacity-80"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider block mb-1">Instructions for Applicant</label>
                <textarea
                  rows={2}
                  value="Please bring original Statement of Account (SOA) and valid ID."
                  disabled
                  readOnly
                  className="w-full bg-[#0b1220]/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 cursor-not-allowed select-none opacity-80 resize-none"
                />
              </div>
            </div>

            <div className="p-4 bg-[#0a1120] border-t border-slate-800 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setSchedulingApp(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSchedule}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-colors"
              >
                Save Schedule & Send SMS
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* SOCIAL WORKER PHYSICAL ASSESSMENT & DECISION MODAL */}
      {assessmentApp && createPortal(
        <div className="fixed inset-0 z-[99999] bg-[#030712]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 font-sans">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-[#131f37]">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">{assessmentApp.referenceNo}</span>
                <h3 className="text-base font-extrabold text-white mt-0.5">Social Worker Physical Assessment & Decision</h3>
              </div>
              <button
                type="button"
                onClick={() => setAssessmentApp(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">APPLICANT NAME</span>
                  <span className="font-extrabold text-white text-sm">{(assessmentApp as any).applicantName || assessmentApp.details?.applicantName || 'Juan Dela Cruz'}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">SERVICE PROGRAM</span>
                  <span className="font-bold text-blue-400">{assessmentApp.serviceName}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 block">PHYSICAL INTAKE VERIFICATION</span>
                <p className="text-[11px]">Social worker verified original documents (Statement of Account / Medical Certificate). Choose final case assessment decision below:</p>
              </div>
            </div>

            <div className="p-4 bg-[#0a1120] border-t border-slate-800 flex justify-between items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setAssessmentApp(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateStatus) onUpdateStatus(assessmentApp.referenceNo, 'Rejected');
                    setAssessmentApp(null);
                  }}
                  className="px-4 py-2 bg-rose-950/70 hover:bg-rose-900 border border-rose-700/60 text-rose-300 font-bold text-xs rounded-xl transition-colors"
                >
                  Reject
                </button>

                {!(
                  (assessmentApp.serviceName || '').toLowerCase().includes('funeral') ||
                  (assessmentApp.serviceName || '').toLowerCase().includes('burial') ||
                  (assessmentApp.referenceNo || '').includes('FUN') ||
                  ((assessmentApp as any).category || '').toLowerCase().includes('funeral') ||
                  ((assessmentApp as any).assistanceType || '').toLowerCase().includes('funeral')
                ) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onUpdateStatus) onUpdateStatus(assessmentApp.referenceNo, 'Referred to Partner Agency');
                      setAssessmentApp(null);
                    }}
                    className="px-4 py-2 bg-amber-950/70 hover:bg-amber-900 border border-amber-700/60 text-amber-300 font-bold text-xs rounded-xl transition-colors"
                  >
                    Refer to Agency
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateStatus) onUpdateStatus(assessmentApp.referenceNo, 'Ready for Payout');
                    setAssessmentApp(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-colors"
                >
                  Approve Aid
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* PRINTABLE OFFICIAL GUARANTEE LETTER (GL) MODAL PORTAL */}
      {printingGL && createPortal(
        <div id="printable-gl-portal" className="fixed inset-0 z-[99999] bg-[#030712]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <style>{`
            @media print {
              #root, nav, sidebar, header, .no-print {
                display: none !important;
              }
              html, body {
                background: #ffffff !important;
                color: #000000 !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                height: auto !important;
                overflow: visible !important;
              }
              #printable-gl-portal {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                height: auto !important;
                background: #ffffff !important;
                padding: 0 !important;
                margin: 0 !important;
                display: block !important;
                overflow: visible !important;
              }
              #printable-gl-card {
                position: static !important;
                width: 100% !important;
                max-width: 100% !important;
                background: #ffffff !important;
                color: #000000 !important;
                padding: 20px !important;
                margin: 0 !important;
                box-shadow: none !important;
                border: none !important;
                border-radius: 0 !important;
                display: block !important;
              }
            }
          `}</style>

          <div id="printable-gl-card" className="bg-white text-slate-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl p-8 font-sans border border-slate-300">
            {[
              printingGL.serviceName,
              printingGL.assistanceType,
              printingGL.category,
              (printingGL.details as any)?.category,
              (printingGL.details as any)?.assistanceType,
              (printingGL.details as any)?.serviceName
            ].some(str => typeof str === 'string' && (str.toLowerCase().includes('funeral') || str.toLowerCase().includes('burial'))) ? (
              /* OFFICIAL CERTIFICATE OF GUARANTEE FOR FUNERAL ASSISTANCE */
              <div>
                {/* HEADER */}
                <div className="text-center space-y-1 border-b pb-4 border-slate-300">
                  <div className="relative flex items-center justify-center min-h-[56px] py-1">
                    <img src="/Government Service Integrity Seal.png" alt="QC Seal" className="w-14 h-14 object-contain absolute left-0 top-0" />
                    <div className="text-center w-full px-16">
                      <h2 className="text-base font-black tracking-tight uppercase text-slate-900">REPUBLIC OF THE PHILIPPINES</h2>
                      <h3 className="text-xs font-bold text-slate-700">QUEZON CITY GOVERNMENT</h3>
                      <h4 className="text-[11px] font-extrabold text-blue-900 uppercase">SOCIAL SERVICES AND DEVELOPMENT DEPARTMENT (SSDD)</h4>
                      <p className="text-[10px] text-slate-500 font-medium">City Hall Compound, Elliptical Road, Quezon City</p>
                    </div>
                  </div>
                  <div className="pt-3">
                    <h1 className="text-base font-black text-slate-900 tracking-wider uppercase">CERTIFICATE OF GUARANTEE</h1>
                    <h2 className="text-xs font-extrabold text-blue-900 uppercase">(GUARANTEE LETTER)</h2>
                  </div>
                </div>

                {/* CONTROL NO & DATE */}
                <div className="flex justify-between items-center py-3 border-b border-slate-200 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 font-bold block text-[10px]">CONTROL NO. :</span>
                    <span className="font-black text-blue-900 text-sm">
                      {printingGL.referenceNo?.replace('REF-', 'QC-GL-2026-FUN-') || 'QC-GL-2026-FUN-8842'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 font-bold block text-[10px]">DATE:</span>
                    <span className="font-bold text-slate-800">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* PROGRAM & ORDINANCE */}
                <div className="py-2.5 px-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1 my-3">
                  <p><span className="font-bold text-slate-600 uppercase text-[10px]">PROGRAM     :</span> <span className="font-extrabold text-slate-900">QC AICS - Burial & Funeral Assistance Program</span></p>
                  <p><span className="font-bold text-slate-600 uppercase text-[10px]">ORDINANCE   :</span> <span className="font-semibold text-slate-800">QC Ordinance No. SP-2865, S-2019</span></p>
                </div>

                {/* TO THE MANAGEMENT OF */}
                <div className="py-2 text-xs space-y-1">
                  <p className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">TO THE MANAGEMENT OF:</p>
                  <div className="pl-4 border-l-2 border-blue-600 space-y-0.5">
                    <p><span className="font-bold text-slate-600">Partner Funeral Home :</span> <span className="font-extrabold text-slate-900 uppercase">{(printingGL.details as any)?.funeralHomeName || (printingGL.details as any)?.hospital || printingGL.hospitalFacility || 'NIETO FUNERAL SERVICES'}</span></p>
                    <p><span className="font-bold text-slate-600">Address              :</span> <span className="font-medium text-slate-800">{(printingGL.details as any)?.funeralDistrict ? `${(printingGL.details as any)?.funeralDistrict}, Quezon City` : 'Novaliches, Quezon City, Metro Manila'}</span></p>
                  </div>
                </div>

                <div className="py-2 text-xs leading-relaxed">
                  <p className="font-bold text-slate-900 mb-2">GREETINGS:</p>
                  <p className="text-slate-700 text-justify">
                    This is to certify that the Quezon City Government, through the Social Services and Development Department (SSDD), guarantees financial assistance for the funeral and burial services rendered to:
                  </p>
                </div>

                {/* BENEFICIARY DETAILS */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 my-2 text-xs font-mono">
                  <p><span className="font-bold text-slate-600 uppercase">• NAME OF DECEASED     :</span> <span className="font-black text-slate-900">{(printingGL.details as any)?.patientFirstName ? `${(printingGL.details as any)?.patientFirstName} ${(printingGL.details as any)?.patientMiddleName || ''} ${(printingGL.details as any)?.patientLastName}`.toUpperCase() : 'MARIO FERNANDO LEE'}</span></p>
                  <p><span className="font-bold text-slate-600 uppercase">• NAME OF APPLICANT    :</span> <span className="font-extrabold text-slate-900">{(printingGL.applicantName || 'JEFFERSON FERNANDO LEE').toUpperCase()} ({(printingGL.details as any)?.patientRelationship || 'Son / Nearest Kin'})</span></p>
                  <p><span className="font-bold text-slate-600 uppercase">• ADDRESS              :</span> <span className="font-medium text-slate-900">{(printingGL.details as any)?.houseNo || '176'} {(printingGL.details as any)?.streetName || '23'}, Brgy. {(printingGL.details as any)?.barangay || 'Bagong Silangan'}, Quezon City</span></p>
                </div>

                {/* APPROVED FINANCIAL ASSISTANCE */}
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1.5 my-3">
                  <h4 className="text-[11px] font-black uppercase text-blue-900 tracking-wider text-center border-b border-blue-200 pb-1">APPROVED FINANCIAL ASSISTANCE</h4>
                  <div className="space-y-1 text-xs">
                    <p><span className="font-bold text-slate-700">• APPROVED AMOUNT      :</span> <span className="font-black text-sm text-blue-950">₱ _____________________________</span> <span className="text-[10px] text-slate-500 block italic pl-4">(Amount to be assigned after SSDD Social Worker Classification & Assessment)</span></p>
                    <p><span className="font-bold text-slate-700">• ASSISTANCE COVERAGE  :</span> <span className="font-medium text-slate-800">Standard Funeral Casket, Body Preparation, Embalming, Chapel Viewing, Hearse Transport & Burial Service Package (Up to ₱25,000 maximum)</span></p>
                  </div>
                </div>

                {/* TERMS AND CONDITIONS */}
                <div className="text-[10px] space-y-1 my-3 text-slate-700">
                  <p className="font-bold uppercase text-slate-900 text-[11px]">TERMS AND CONDITIONS:</p>
                  <ol className="list-decimal pl-4 space-y-0.5 leading-tight">
                    <li>This Certificate of Guarantee (GL) is non-transferable and shall be honored ONLY by accredited partner funeral service providers of Quezon City.</li>
                    <li>The accredited funeral service provider shall deduct the approved guarantee amount specified above from the total billing invoice of the beneficiary.</li>
                    <li>For billing reimbursement, the service provider must submit the following to the SSDD Main Office:
                      <ul className="list-alpha pl-4 font-mono text-[9px] text-slate-600">
                        <li>a. Original Copy of this Certificate of Guarantee (GL)</li>
                        <li>b. Statement of Account / Official Funeral Contract</li>
                        <li>c. Certified True Copy of Registered Death Certificate</li>
                        <li>d. Photocopy of Valid QC ID of the Applicant / Informant</li>
                      </ul>
                    </li>
                  </ol>
                </div>

                {/* SIGNATORIES */}
                <div className="grid grid-cols-2 gap-8 pt-12 text-xs">
                  <div>
                    <div className="border-b border-slate-800 w-full mb-1"></div>
                    <span className="text-[9px] text-slate-500 block font-bold text-center">Quezon City SSDD</span>
                  </div>
                  <div>
                    <div className="border-b border-slate-800 w-full mb-1"></div>
                    <span className="text-[9px] text-slate-500 block font-bold text-center">Social Services and Development Department</span>
                  </div>
                </div>

                <div className="text-center pt-4 border-t border-slate-200 mt-4">
                  <p className="text-[10px] font-bold italic text-slate-600">"Faithful Service for the Citizens of Quezon City"</p>
                </div>
              </div>
            ) : (
              /* STANDARD MEDICAL GUARANTEE LETTER */
              <div>
                {/* HEADER */}
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

                {/* CONTROL NO & DATE */}
                <div className="flex justify-between items-center py-3 border-b border-slate-200 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 font-bold block text-[10px]">GL CONTROL NO.:</span>
                    <span className="font-black text-blue-900 text-sm">GL-2026-99210</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 font-bold block text-[10px]">DATE ISSUED:</span>
                    <span className="font-bold text-slate-800">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* DETAILS CONTENT */}
                <div className="py-4 space-y-3.5 text-xs">
                  {/* PATIENT INFORMATION */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1 print:bg-white print:border-slate-300">
                    <h4 className="text-[11px] font-black uppercase text-slate-700 tracking-wider">PATIENT INFORMATION (BENEFICIARY):</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500 text-[10px] block uppercase font-bold">• Patient / Applicant Name:</span>
                        <span className="font-extrabold text-slate-900 text-sm">{(printingGL as any).applicantName || printingGL.details?.applicantName || 'Jefferson Fernando Lee'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block uppercase font-bold">• Control / Reference No:</span>
                        <span className="font-bold font-mono text-blue-900">{printingGL.referenceNo}</span>
                      </div>
                    </div>
                  </div>

                  {/* ASSISTANCE DETAILS */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 print:bg-white print:border-slate-300">
                    <h4 className="text-[11px] font-black uppercase text-slate-700 tracking-wider">ASSISTANCE DETAILS:</h4>
                    <p className="text-[11px] text-slate-600 italic">This patient is hereby approved to receive assistance for:</p>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 text-[10px] block uppercase font-bold">• TYPE OF ASSISTANCE:</span>
                        <span className="font-extrabold text-blue-900">{printingGL.serviceName || 'Medical Bill Assistance'}</span>
                      </div>
                      {!(printingGL.serviceName || '').toLowerCase().includes('medicine') && (
                        <div>
                          <span className="text-slate-500 text-[10px] block uppercase font-bold">• MEDICAL CONDITION / DIAGNOSIS:</span>
                          <span className="font-extrabold text-slate-900">
                            {(printingGL.details as any)?.medicalCondition || 
                             (printingGL.details as any)?.condition || 
                             (printingGL.details as any)?.reason || 
                             (printingGL.details as any)?.diagnosis || 
                             (printingGL.details as any)?.medicalDetails || 
                             'Medical Condition / Confinement'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AMOUNT OF ASSISTANCE */}
                  <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1.5 print:bg-white print:border-slate-300">
                    <h4 className="text-[11px] font-black uppercase text-amber-900 tracking-wider">AMOUNT OF ASSISTANCE:</h4>
                    <div className="space-y-1 font-mono text-xs">
                      <p><span className="font-bold">• Amount in Words:</span> _______________________________________________________</p>
                      <p><span className="font-bold">• Amount in Figures:</span> <span className="font-black text-sm text-slate-900">₱ __________________</span></p>
                    </div>
                  </div>

                  {/* SERVICE PROVIDER DETAILS */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1 print:bg-white print:border-slate-300">
                    <h4 className="text-[11px] font-black uppercase text-slate-700 tracking-wider">SERVICE PROVIDER DETAILS:</h4>
                    <div>
                      <span className="text-slate-500 text-[10px] block uppercase font-bold">• ACCREDITED PARTNER HOSPITAL / FACILITY:</span>
                      <span className="font-extrabold text-slate-900">
                        {(printingGL.details as any)?.hospital || 
                         (printingGL.details as any)?.healthFacility || 
                         (printingGL.details as any)?.facility || 
                         (printingGL.details as any)?.hospitalName || 
                         'East Avenue Medical Center'}
                      </span>
                    </div>
                  </div>

                  {/* SIGNATORIES */}
                  <div className="grid grid-cols-2 gap-8 pt-10 text-center text-xs">
                    <div>
                      <div className="border-b border-slate-800 w-full mb-1.5"></div>
                      <div className="font-medium text-slate-800 text-xs">Maria Santos, RSW</div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Prepared and Certified by (Social Worker)</span>
                    </div>
                    <div>
                      <div className="border-b border-slate-800 w-full mb-1.5"></div>
                      <div className="font-medium text-slate-800 text-xs">SSDD Department Head</div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Approved by (Authorized Signatory)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FOOTER BAR (HIDDEN IN PRINT) */}
            <div className="pt-4 border-t border-slate-200 flex justify-end items-center gap-2 no-print">
              <button
                type="button"
                onClick={() => setPrintingGL(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>PRINT OFFICIAL GL</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
