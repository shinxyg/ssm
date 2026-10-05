import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  Users, 
  Shield, 
  FileText, 
  Check, 
  Printer, 
  Building2, 
  Pill, 
  Wallet 
} from 'lucide-react';
import type { ApplicationRecord } from '../types';

interface AdminDisbursementViewProps {
  darkMode?: boolean;
  applications?: ApplicationRecord[];
  onUpdateStatus?: (refNo: string, newStatus: ApplicationRecord['status'], extraFields?: Record<string, any>) => void;
}

export const AdminDisbursementView: React.FC<AdminDisbursementViewProps> = ({ 
  darkMode = true,
  applications = [],
  onUpdateStatus
}) => {
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

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tabFilter, setTabFilter] = useState<'ALL' | 'PENDING' | 'RELEASED'>('ALL');
  const [releasingRecord, setReleasingRecord] = useState<ApplicationRecord | null>(null);
  const [releaseDate, setReleaseDate] = useState<string>(getCurrentDateString());
  const [releaseTime, setReleaseTime] = useState<string>(getCurrentTimeString());
  const [scheduledPayoutTimes, setScheduledPayoutTimes] = useState<Record<string, { date: string; time: string }>>({});

  // Sync modal date & time to current real-time clock when modal is opened for a record
  React.useEffect(() => {
    if (releasingRecord) {
      const existing = scheduledPayoutTimes[releasingRecord.referenceNo] || ((releasingRecord as any).scheduledPayoutDate ? {
        date: (releasingRecord as any).scheduledPayoutDate,
        time: (releasingRecord as any).scheduledPayoutTime
      } : null);

      if (existing && existing.date && existing.time) {
        setReleaseDate(existing.date);
        setReleaseTime(existing.time);
      } else {
        setReleaseDate(getCurrentDateString());
        setReleaseTime(getCurrentTimeString());
      }
    }
  }, [releasingRecord]);

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

  // Filter approved/ready applications for financial disbursement (Step 5 Payout Masterlist)
  const disbursementRecords = useMemo(() => {
    return applications.filter((app) => {
      const st = (app.status || '').toUpperCase();
      // Exclude initial 'APPROVED BY ADMIN' step 2 applications until they complete Step 4 interview approval!
      return (
        st === 'APPROVED' ||
        st === 'READY FOR PAYOUT' || 
        st === 'PAYOUT SCHEDULED' ||
        st === 'RELEASED / COMPLETED' || 
        st === 'COMPLETED'
      );
    });
  }, [applications]);

  // Real-time interval check: Auto-release when set Date & Time is reached
  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentDateStr = now.toISOString().split('T')[0];
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMins = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMins}`;

      disbursementRecords.forEach((app) => {
        if (app.status !== 'RELEASED / COMPLETED' && (app.status as string) !== 'Completed') {
          const schedDate = (app as any).scheduledPayoutDate || scheduledPayoutTimes[app.referenceNo]?.date;
          const schedTime = (app as any).scheduledPayoutTime || scheduledPayoutTimes[app.referenceNo]?.time;
          if (schedDate && schedTime) {
            if (schedDate < currentDateStr || (schedDate === currentDateStr && schedTime <= currentTimeStr)) {
              if (onUpdateStatus) {
                onUpdateStatus(app.referenceNo, 'RELEASED / COMPLETED' as any);
              }
            }
          }
        }
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [disbursementRecords, scheduledPayoutTimes, onUpdateStatus]);

  // Filtered by Search & Tab Filter
  const filteredRecords = useMemo(() => {
    return disbursementRecords.filter((app) => {
      // Tab Filter
      if (tabFilter === 'PENDING' && (app.status === 'RELEASED / COMPLETED' || (app.status as string) === 'Completed')) return false;
      if (tabFilter === 'RELEASED' && !(app.status === 'RELEASED / COMPLETED' || (app.status as string) === 'Completed')) return false;

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
  }, [disbursementRecords, tabFilter, searchQuery]);

  // Summary Metrics
  const pendingCount = disbursementRecords.filter((a) => a.status === 'Ready for Payout' || a.status === 'Payout Scheduled' || a.status === 'Approved by Admin').length;
  const releasedCount = disbursementRecords.filter((a) => a.status === 'RELEASED / COMPLETED' || (a.status as string) === 'Completed').length;

  const handleConfirmRelease = (immediate = false) => {
    if (releasingRecord && onUpdateStatus) {
      if (immediate) {
        onUpdateStatus(releasingRecord.referenceNo, 'RELEASED / COMPLETED' as any);
      } else {
        setScheduledPayoutTimes((prev) => ({
          ...prev,
          [releasingRecord.referenceNo]: { date: releaseDate, time: releaseTime }
        }));
        // Update status to Payout Scheduled with date & time!
        onUpdateStatus(releasingRecord.referenceNo, 'Payout Scheduled' as any, {
          scheduledPayoutDate: releaseDate,
          scheduledPayoutTime: releaseTime
        });
      }
      setReleasingRecord(null);
    }
  };

  return (
    <div className={`space-y-6 select-none font-['Plus_Jakarta_Sans',sans-serif] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Financial Aid Disbursement & Releasing
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Masterlist of approved Guarantee Letters, Vouchers, and Cash Subsidies ready for release.
          </p>
        </div>
      </div>

      {/* SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">TOTAL RELEASED</span>
            <div className="text-2xl font-extrabold text-white tracking-tight mt-2">{releasedCount} Records</div>
            <span className="text-[11px] font-semibold text-emerald-400 mt-1 block">✓ Successfully Processed</span>
          </div>
          <div className="p-2 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">PENDING RELEASE</span>
            <div className="text-2xl font-extrabold text-amber-400 tracking-tight mt-2">{pendingCount} Payouts</div>
            <span className="text-[11px] font-semibold text-amber-400 mt-1 block">Ready for Disbursement</span>
          </div>
          <div className="p-2 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">TOTAL MASTERLIST</span>
            <div className="text-2xl font-extrabold text-white tracking-tight mt-2">{disbursementRecords.length}</div>
            <span className="text-[11px] font-semibold text-blue-400 mt-1 block">Disbursement Entries</span>
          </div>
          <div className="p-2 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg flex justify-between items-start">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">AUTOMATIC ARCHIVE</span>
            <div className="text-sm font-extrabold text-blue-400 tracking-tight mt-2">RELEASED ➔ HISTORY</div>
            <span className="text-[10px] font-medium text-slate-400 mt-1 block">Auto-moves to Application History</span>
          </div>
          <div className="p-2 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-400">
            <Shield className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Financial Aid Disbursement Records
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Connected to Appointments & DB. Once marked RELEASED, records automatically archive to Application History.
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
          <button 
            type="button" 
            onClick={() => setTabFilter('ALL')} 
            className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              tabFilter === 'ALL' ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40' : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            ALL ({disbursementRecords.length})
          </button>
          <button 
            type="button" 
            onClick={() => setTabFilter('PENDING')} 
            className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              tabFilter === 'PENDING' ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40' : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            PENDING ({pendingCount})
          </button>
          <button 
            type="button" 
            onClick={() => setTabFilter('RELEASED')} 
            className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              tabFilter === 'RELEASED' ? 'bg-emerald-600 text-white shadow-md border border-emerald-400/40' : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            RELEASED ({releasedCount})
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-800/80 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-[#121c2e] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">DISBURSEMENT ID</th>
                <th className="py-3 px-4">APPLICANT NAME</th>
                <th className="py-3 px-4">ASSISTANCE TYPE</th>
                <th className="py-3 px-4">RELEASE BENEFIT</th>
                <th className="py-3 px-4">PAYOUT LOCATION</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-medium">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((app) => {
                  const isReleased = app.status === 'RELEASED / COMPLETED' || (app.status as string) === 'Completed';
                  const name = (app as any).applicantName || app.details?.applicantName || 'Juan Dela Cruz';
                  const schedInfo = scheduledPayoutTimes[app.referenceNo];
                  const payoutDate = schedInfo?.date || (app as any).scheduledPayoutDate || (app as any).scheduled_payout_date;
                  const payoutTime = schedInfo?.time || (app as any).scheduledPayoutTime || (app as any).scheduled_payout_time;
                  const hasSchedule = !!(payoutDate && payoutTime);

                  let benefitText = 'Hospital Guarantee Letter (GL)';
                  let locationText = 'Quezon City General Hospital (QCGH)';

                  const s = app.serviceName.toLowerCase();
                  if (s.includes('medicine')) {
                    benefitText = 'Pharmacy Voucher / Reseta Authorization';
                    locationText = 'Accredited Partner Pharmacy';
                  } else if (s.includes('funeral') || s.includes('burial')) {
                    benefitText = 'Up to ₱25,000 Funeral Guarantee';
                    locationText = 'Partner Funeral Parlor';
                  } else if (s.includes('pwd')) {
                    benefitText = 'Assistive Device & Financial Aid';
                    locationText = 'PDAO Center, QC Hall';
                  } else if (s.includes('senior')) {
                    benefitText = '₱3,000 Quarterly Social Pension';
                    locationText = 'OSCA Distribution Desk';
                  } else if (s.includes('solo') || s.includes('parent')) {
                    benefitText = '₱3,000.00 Fixed Cash Subsidy';
                    locationText = 'Quezon City Hall Cashier / SSDD Office';
                  }

                  return (
                    <tr key={app.referenceNo} className="hover:bg-[#142036] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-400">DISB-{app.referenceNo}</td>
                      <td className="py-3 px-4 font-bold text-white">{name}</td>
                      <td className="py-3 px-4 text-slate-300 font-semibold">{app.serviceName}</td>
                      <td className="py-3 px-4 font-mono text-amber-400 text-[11px]">{benefitText}</td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">{locationText}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border whitespace-nowrap ${
                          isReleased
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                            : hasSchedule
                            ? 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                            : 'bg-blue-950/60 text-blue-300 border-blue-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isReleased ? 'bg-emerald-400' : hasSchedule ? 'bg-amber-400' : 'bg-blue-400'}`}></span>
                          <span>
                            {isReleased
                              ? 'RELEASED / COMPLETED'
                              : hasSchedule
                              ? `PAYOUT SCHEDULED (${payoutDate} ${formatTo12Hour(payoutTime)})`
                              : 'READY FOR PAYOUT SCHEDULE'}
                          </span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {!isReleased ? (
                          hasSchedule ? (
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-[11px] font-extrabold text-amber-400 italic whitespace-nowrap inline-flex items-center gap-1.5 bg-amber-950/40 border border-amber-500/30 px-3 py-1.5 rounded-xl">
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>Payout Scheduled</span>
                              </span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setReleasingRecord(app)}
                              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-all inline-flex items-center gap-1.5 whitespace-nowrap"
                            >
                              <Clock className="w-3.5 h-3.5 shrink-0" />
                              <span>Set Payout Date & Time</span>
                            </button>
                          )
                        ) : (
                          <span className="text-[11px] font-semibold text-emerald-400 italic whitespace-nowrap">✓ Released & Archived</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileText className="w-8 h-8 text-slate-500 stroke-[1.5]" />
                      <p className="text-sm font-bold text-slate-300">No disbursement records found</p>
                      <p className="text-xs text-slate-500">There are currently no financial aid disbursements registered under this filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIRMATION & PAYOUT DATE MODAL */}
      {releasingRecord && createPortal(
        <div className="fixed inset-0 z-[99999] bg-[#030712]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1726] border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 text-slate-100 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Set Financial Aid Payout Schedule
              </h3>
              <button
                type="button"
                onClick={() => setReleasingRecord(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#080f1e] border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block font-mono">BENEFICIARY:</span>
                <p className="font-bold text-white text-sm">
                  {(releasingRecord as any).applicantName || releasingRecord.details?.applicantName || 'Juan Dela Cruz'}
                </p>
                <p className="text-slate-400 text-[11px] font-mono">Ref: {releasingRecord.referenceNo}</p>
                <p className="text-amber-400 font-semibold">{releasingRecord.serviceName}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Scheduled Payout Date:
                  </label>
                  <input
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    className="w-full bg-[#080f1e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Scheduled Payout Time:
                  </label>
                  <input
                    type="time"
                    value={releaseTime}
                    onChange={(e) => setReleaseTime(e.target.value)}
                    className="w-full bg-[#080f1e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl text-[11px] text-blue-200 font-medium space-y-1">
                <p className="font-bold text-white flex items-center gap-1">
                  ⚡ Automatic Release Timer:
                </p>
                <p>
                  Status will stay <strong>PAYOUT SCHEDULED</strong>. When the real-time clock hits <strong>{releaseDate} at {releaseTime}</strong>, the system will automatically update the status to <strong>RELEASED / COMPLETED</strong> and move it to Application History!
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#0a1120] border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap rounded-b-2xl">
              <button
                type="button"
                onClick={() => setReleasingRecord(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
              >
                Cancel
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleConfirmRelease(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all whitespace-nowrap"
                  title="Force Release Immediately Now"
                >
                  Release Immediately
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmRelease(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all whitespace-nowrap"
                >
                  Save Payout Schedule
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};


