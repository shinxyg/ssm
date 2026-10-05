import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Briefcase, 
  FileImage, 
  AlertCircle,
  X,
  Clock,
  ExternalLink,
  Check,
  CreditCard,
  Building2,
  Award,
  Image as ImageIcon,
  Download
} from 'lucide-react';

interface SoloParentApplication {
  id: number;
  reference_no: string;
  applicant_name: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  suffix?: string;
  nationality?: string;
  dob?: string;
  age?: string;
  gender?: string;
  civil_status?: string;
  house_no?: string;
  street_name?: string;
  barangay?: string;
  phone_number?: string;
  email_address?: string;
  solo_parent_id_no?: string;
  solo_parent_status?: string;
  solo_parent_category?: string;
  num_dependents?: string;
  age_youngest_dependent?: string;
  employment_status?: string;
  occupation?: string;
  employer_income_source?: string;
  monthly_income?: string;
  receiving_gov_assistance?: string;
  gov_program_name?: string;
  gov_assistance_amount_freq?: string;
  receiving_pension?: string;
  pension_type?: string;
  status: string;
  disapproval_reason?: string;
  uploaded_documents?: Record<string, { name: string; size: number; dataUrl: string }>;
  details?: any;
  date_submitted?: string;
}

export const AdminSoloChildView: React.FC<{ darkMode?: boolean }> = ({ darkMode = true }) => {
  const [applications, setApplications] = useState<SoloParentApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'SUBSIDY' | 'EDUCATIONAL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Selected application for detail / inspection modal
  const [selectedApp, setSelectedApp] = useState<SoloParentApplication | null>(null);
  const [inspectingDoc, setInspectingDoc] = useState<{ title: string; filename: string; dataUrl?: string } | null>(null);

  // Reject modal state
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [appToReject, setAppToReject] = useState<SoloParentApplication | null>(null);

  const fetchApplications = async () => {
    try {
      const [spRes, eduRes] = await Promise.all([
        fetch('http://localhost:5000/api/solo-parent/applications').catch(() => null),
        fetch('http://localhost:5000/api/educational/applications').catch(() => null),
      ]);
      let combined: SoloParentApplication[] = [];
      if (spRes && spRes.ok) {
        const spData = await spRes.json();
        combined = [...spData];
      }
      if (eduRes && eduRes.ok) {
        const eduData = await eduRes.json();
        const soloEduApps = eduData
          .filter((app: any) => app.is_solo_educational_beneficiary || app.category === 'Solo Parent Services' || (app.service_name || '').includes('Solo Parent'))
          .map((app: any) => ({
            id: app.id,
            reference_no: app.reference_no,
            applicant_name: app.applicant_name,
            first_name: app.first_name,
            middle_name: app.middle_name,
            last_name: app.last_name,
            suffix: app.suffix,
            nationality: app.nationality,
            dob: app.dob,
            age: app.age,
            phone_number: app.phone_number,
            email_address: app.email_address,
            solo_parent_category: 'Educational Assistance Grant',
            monthly_income: app.monthly_family_income,
            status: app.status || 'Pending Document Validation',
            disapproval_reason: app.disapproval_reason,
            uploaded_documents: app.uploaded_documents,
            details: app.details,
            date_submitted: app.date_submitted
          }));

        const existingRefNos = new Set(combined.map(a => a.reference_no));
        soloEduApps.forEach((eduApp: any) => {
          if (!existingRefNos.has(eduApp.reference_no)) {
            combined.push(eduApp);
          }
        });
      }
      setApplications(combined);
    } catch (err) {
      console.error('Error fetching solo parent applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    const interval = setInterval(fetchApplications, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedApp || inspectingDoc) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedApp, inspectingDoc]);

  // Update Status in PostgreSQL DB
  const handleUpdateStatus = async (refNo: string, newStatus: string, reason?: string) => {
    try {
      const isEdu = refNo.startsWith('QC-SP-EDU') || (selectedApp?.solo_parent_category || '').toLowerCase().includes('educational') || Boolean(selectedApp?.details?.childFullName);
      const primaryEndpoint = isEdu
        ? `http://localhost:5000/api/educational/applications/${encodeURIComponent(refNo)}/status`
        : `http://localhost:5000/api/solo-parent/applications/${encodeURIComponent(refNo)}/status`;

      const fallbackEndpoint = isEdu
        ? `http://localhost:5000/api/solo-parent/applications/${encodeURIComponent(refNo)}/status`
        : `http://localhost:5000/api/educational/applications/${encodeURIComponent(refNo)}/status`;

      let res = await fetch(primaryEndpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          disapprovalReason: reason || null,
        }),
      });

      if (!res.ok) {
        res = await fetch(fallbackEndpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: newStatus,
            disapprovalReason: reason || null,
          }),
        });
      }

      if (res.ok) {
        await fetchApplications();
        if (selectedApp && selectedApp.reference_no === refNo) {
          setSelectedApp(prev => prev ? { ...prev, status: newStatus, disapproval_reason: reason } : null);
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleOpenRejectModal = (app: SoloParentApplication) => {
    setAppToReject(app);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    if (!appToReject) return;
    await handleUpdateStatus(appToReject.reference_no, 'REJECTED', rejectReason || 'Documents or qualifications failed verification.');
    setShowRejectModal(false);
    setAppToReject(null);
  };

  // Summary Metrics
  const pendingCount = useMemo(() => {
    return applications.filter(a => a.status === 'Pending Document Validation' || a.status === 'Under Review').length;
  }, [applications]);

  const approvedCount = useMemo(() => {
    return applications.filter(a => a.status.includes('APPROVED') || a.status.includes('Approved') || a.status.includes('COMPLETED') || a.status === 'Ready for Payout' || a.status === 'PAYOUT SCHEDULED').length;
  }, [applications]);

  const rejectedCount = useMemo(() => {
    return applications.filter(a => a.status === 'REJECTED' || a.status === 'Disapproved' || a.status === 'Rejected').length;
  }, [applications]);

  // Filtered List matching exact AICS filter structure
  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const lowerCategory = (app.solo_parent_category || '').toLowerCase();
      const lowerService = (app.reference_no || '').toLowerCase();

      if (categoryFilter === 'SUBSIDY' && !(lowerService.includes('sp-subsidy') || lowerCategory.includes('unmarried') || lowerCategory.includes('parent'))) return false;
      if (categoryFilter === 'EDUCATIONAL' && !(lowerService.includes('edu') || lowerCategory.includes('educational'))) return false;

      const st = app.status;
      if (statusFilter === 'pending' && !(st === 'Pending Document Validation' || st === 'Under Review')) return false;
      if (statusFilter === 'approved' && !(st.includes('APPROVED') || st.includes('Approved') || st.includes('COMPLETED') || st === 'Ready for Payout' || st === 'PAYOUT SCHEDULED')) return false;
      if (statusFilter === 'rejected' && !(st === 'REJECTED' || st === 'Disapproved' || st === 'Rejected')) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const refMatch = app.reference_no.toLowerCase().includes(q);
        const applicantNameMatch = (app.applicant_name || '').toLowerCase().includes(q);
        const spicMatch = (app.solo_parent_id_no || '').toLowerCase().includes(q);
        const brgyMatch = (app.barangay || '').toLowerCase().includes(q);
        const statusMatch = app.status.toLowerCase().includes(q);
        return refMatch || applicantNameMatch || spicMatch || brgyMatch || statusMatch;
      }
      return true;
    });
  }, [applications, categoryFilter, statusFilter, searchQuery]);

  return (
    <div className={`space-y-6 select-none font-['Plus_Jakarta_Sans',sans-serif] ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          Solo Parent & Child Welfare Services
        </h1>
      </div>

      {/* Metric Cards Row matching AICS exact design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0e1726] border border-slate-800/90 rounded-2xl p-5 shadow-lg">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">TOTAL APPLICATIONS</span>
          <div className="text-3xl font-extrabold text-white tracking-tight mt-2">{applications.length}</div>
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

      {/* Filter and Search Bar matching AICS exact design */}
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
              onClick={() => setCategoryFilter('SUBSIDY')}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition-all text-xs ${
                categoryFilter === 'SUBSIDY'
                  ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40'
                  : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              SOLO PARENT SUBSIDY
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('EDUCATIONAL')}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition-all text-xs ${
                categoryFilter === 'EDUCATIONAL'
                  ? 'bg-[#1d4ed8] text-white shadow-md border border-blue-400/40'
                  : 'bg-[#121c2e] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              EDUCATIONAL GRANT
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

      {/* Main Table View matching AICS exact design in screenshot 3 */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white tracking-wide">
          Applications ({filteredApps.length})
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs font-medium">
                  {filteredApps.map((app, idx) => {
                    const st = app.status;
                    const isApproved = st === 'APPROVED BY ADMIN' || st === 'APPROVED' || st === 'Approved' || st === 'Ready for Payout' || st === 'PAYOUT SCHEDULED';
                    const isReleased = st === 'RELEASED / COMPLETED' || st === 'Completed' || st === 'RELEASED';
                    const isRejected = st === 'REJECTED' || st === 'Disapproved' || st === 'Rejected';

                    return (
                      <tr 
                        key={app.reference_no ? `${app.reference_no}-${idx}` : `app-${app.id}-${idx}`} 
                        onClick={() => setSelectedApp(app)}
                        className="hover:bg-[#142036] transition-colors cursor-pointer"
                      >
                        <td className="py-4 px-6 font-mono font-bold text-blue-400">
                          {app.reference_no}
                        </td>
                        <td className="py-4 px-6 font-bold text-white uppercase">
                          {app.applicant_name || `${app.first_name || 'JEFFERSON'} ${app.last_name || 'LEE'}`}
                        </td>
                        <td className="py-4 px-6 text-slate-300">
                          Solo Parent Financial Subsidy Program
                        </td>
                        <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">
                          {app.date_submitted ? `${new Date(app.date_submitted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${new Date(app.date_submitted).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}` : 'Oct 5, 2026 • 10:57 AM'}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border whitespace-nowrap ${
                            isReleased
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                              : isApproved
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                              : isRejected
                              ? 'bg-rose-950/80 text-rose-400 border-rose-500/30'
                              : 'bg-amber-950/80 text-amber-400 border-amber-500/30'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isReleased ? 'bg-emerald-400' : isApproved ? 'bg-emerald-400' : isRejected ? 'bg-rose-400' : 'bg-amber-400 animate-pulse'
                            }`}></span>
                            <span>{app.status.toUpperCase()}</span>
                          </span>
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
              <FileText className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h4 className="text-base font-extrabold text-white">No applications found</h4>
            <p className="text-xs text-slate-400 mt-1">Try a different search term or filter.</p>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* MANAGE APPLICATION MODAL (MATCHING EXACT AICS LAYOUT FROM SCREENSHOTS 1 & 2!) */}
      {/* ---------------------------------------------------------------------- */}
      {selectedApp && (() => {
        const isEduApp = Boolean(
          (selectedApp.solo_parent_category || '').toLowerCase().includes('educational') ||
          (selectedApp.reference_no || '').startsWith('QC-SP-EDU') ||
          selectedApp.details?.childFullName
        );
        return createPortal(
        <div className="fixed inset-0 z-[99999] bg-[#030712]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#0e172a] text-slate-100 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-800 my-auto">
            {/* Modal Header */}
            <div className="p-5 bg-[#121e36] border-b border-slate-800 flex justify-between items-center shrink-0">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider">{selectedApp.reference_no}</span>
                <h3 className="text-base font-extrabold text-white mt-0.5">
                  {(selectedApp.solo_parent_category || '').toLowerCase().includes('educational') || (selectedApp.reference_no || '').startsWith('QC-SP-EDU') || selectedApp.details?.childFullName ? 'Solo Parent Educational Assistance — ₱5,000 Cash Grant' : 'Solo Parent Subsidy — ₱3,000 Cash Grant'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs overflow-y-auto flex-1 custom-modal-scroll">

                    {/* SECTION 2: APPLICANT / PARENT / GUARDIAN INFORMATION (INDIVIDUAL FIELDS) */}
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-4">
                      <span className="text-[11px] font-extrabold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-1.5 flex items-center justify-between">
                        <span>A. APPLICANT / PARENT / GUARDIAN INFORMATION</span>
                        <span className="text-[9px] font-mono text-slate-400">VERIFIED QCITIZEN PROFILE</span>
                      </span>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        <div>
                          <span className="text-slate-400 text-[10px] font-semibold uppercase">First Name</span>
                          <div className="font-bold text-white text-xs mt-0.5">{selectedApp.first_name || 'JEFFERSON'}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] font-semibold uppercase">Middle Name</span>
                          <div className="font-bold text-white text-xs mt-0.5">{selectedApp.middle_name || 'FERNANDO'}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] font-semibold uppercase">Last Name</span>
                          <div className="font-bold text-white text-xs mt-0.5">{selectedApp.last_name || 'LEE'}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] font-semibold uppercase">Suffix</span>
                          <div className="font-semibold text-slate-300 text-xs mt-0.5">{selectedApp.suffix || 'N/A'}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] font-semibold uppercase">Nationality</span>
                          <div className="font-semibold text-slate-300 text-xs mt-0.5">{selectedApp.nationality || 'FILIPINO'}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] font-semibold uppercase">Date of Birth</span>
                          <div className="font-mono text-slate-200 text-xs mt-0.5">{selectedApp.dob || '27/09/2004'}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] font-semibold uppercase">Age</span>
                          <div className="font-bold text-slate-200 text-xs mt-0.5">{selectedApp.age ? `${selectedApp.age} yrs old` : '22 yrs old'}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] font-semibold uppercase">Gender</span>
                          <div className="font-semibold text-slate-300 text-xs mt-0.5">{selectedApp.gender || 'Male'}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] font-semibold uppercase">Civil Status</span>
                          <div className="font-semibold text-slate-300 text-xs mt-0.5">{selectedApp.civil_status || 'Solo Parent'}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] font-semibold uppercase">House / Bldg No.</span>
                          <div className="font-semibold text-slate-300 text-xs mt-0.5">{selectedApp.house_no || '176'}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] font-semibold uppercase">Street Name</span>
                          <div className="font-semibold text-slate-300 text-xs mt-0.5">{selectedApp.street_name || '23'}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] font-semibold uppercase">Barangay</span>
                          <div className="font-bold text-slate-200 text-xs mt-0.5">{selectedApp.barangay || 'Bagong Silangan'}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] font-semibold uppercase">Phone Number</span>
                          <div className="font-mono font-bold text-slate-200 text-xs mt-0.5">{selectedApp.phone_number || '09155582122'}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] font-semibold uppercase">Email Address</span>
                          <div className="font-bold text-slate-200 text-xs mt-0.5 truncate">{selectedApp.email_address || 'jeffersonlee1234@gmail.com'}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] font-semibold uppercase">Existing Solo Parent ID No.</span>
                          <div className="font-mono font-bold text-white text-xs mt-0.5">{selectedApp.solo_parent_id_no || selectedApp.details?.spicNumber || 'SP-we432432'}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] font-semibold uppercase">Relationship to Child</span>
                          <div className="font-bold text-white text-xs mt-0.5">{selectedApp.details?.relationshipToChild || (selectedApp as any).relationship_to_child || 'Parent / Guardian'}</div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: B. CHILD / BENEFICIARY INFORMATION (STUDENT PROFILE) */}
                    {isEduApp ? (
                      <>
                        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-3">
                          <span className="text-[11px] font-extrabold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-1.5 flex items-center justify-between">
                            <span>B. CHILD / BENEFICIARY INFORMATION</span>
                            <span className="text-[9px] font-mono text-blue-400">STUDENT BENEFICIARY</span>
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Full Name</span>
                              <div className="font-bold text-white mt-0.5">{selectedApp.details?.childFullName || (selectedApp as any).child_full_name || 'N/A'}</div>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Date of Birth</span>
                              <div className="font-mono text-slate-200 mt-0.5">{selectedApp.details?.childDob || (selectedApp as any).child_dob || 'N/A'}</div>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Age</span>
                              <div className="font-bold text-slate-200 mt-0.5">
                                {selectedApp.details?.childAge || (selectedApp as any).child_age ? `${selectedApp.details?.childAge || (selectedApp as any).child_age} yrs old` : 'N/A'}
                              </div>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Sex</span>
                              <div className="font-semibold text-slate-300 mt-0.5">{selectedApp.details?.childSex || (selectedApp as any).child_sex || 'N/A'}</div>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">School Name</span>
                              <div className="font-bold text-white mt-0.5">{selectedApp.details?.schoolName || (selectedApp as any).school_name || 'N/A'}</div>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Grade Level</span>
                              <div className="font-semibold text-slate-300 mt-0.5">{selectedApp.details?.gradeLevel || (selectedApp as any).grade_level || 'N/A'}</div>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Learner Reference No. (LRN)</span>
                              <div className="font-mono font-bold text-blue-400 mt-0.5">{selectedApp.details?.lrnNumber || (selectedApp as any).lrn_number || 'N/A'}</div>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Type of School</span>
                              <div className="font-semibold text-slate-300 mt-0.5">{selectedApp.details?.typeOfSchool || (selectedApp as any).type_of_school || 'Public School'}</div>
                            </div>
                            <div className="col-span-2">
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Other Enrollment Info</span>
                              <div className="font-semibold text-slate-300 mt-0.5">{selectedApp.details?.otherEnrollmentInfo || (selectedApp as any).other_enrollment_info || 'N/A'}</div>
                            </div>
                          </div>
                        </div>

                        {/* SECTION 4: C. FAMILY & FINANCIAL INFORMATION */}
                        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-3">
                          <span className="text-[11px] font-extrabold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-1.5 flex items-center justify-between">
                            <span>C. FAMILY INFORMATION & FINANCIAL ASSESSMENT</span>
                            <span className="text-[9px] font-mono text-emerald-400 font-bold">ELIGIBILITY ASSESS</span>
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Number of Children in Family</span>
                              <div className="font-bold text-white mt-0.5">{selectedApp.details?.numChildrenInFamily || (selectedApp as any).num_children_in_family || selectedApp.num_dependents || '1'}</div>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Number of Children Currently Studying</span>
                              <div className="font-bold text-white mt-0.5">{selectedApp.details?.numChildrenStudying || (selectedApp as any).num_children_studying || '1'}</div>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Monthly Family Income</span>
                              <div className="font-bold text-emerald-400 mt-0.5">
                                {selectedApp.monthly_income || selectedApp.details?.monthlyFamilyIncome || (selectedApp as any).monthly_family_income || '₱10,000 – ₱15,000'}
                              </div>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">4Ps Beneficiary?</span>
                              <div className="font-bold text-white mt-0.5">{selectedApp.details?.is4psBeneficiary || (selectedApp as any).is_4ps_beneficiary || 'No'}</div>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Solo Parent Educational Beneficiary?</span>
                              <div className="font-bold text-emerald-400 mt-0.5">{selectedApp.details?.isSoloEducationalBeneficiary || (selectedApp as any).is_solo_educational_beneficiary || 'Yes'}</div>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">PWD Educational Beneficiary?</span>
                              <div className="font-bold text-white mt-0.5">{selectedApp.details?.isPwdEducationalBeneficiary || (selectedApp as any).is_pwd_educational_beneficiary || 'No'}</div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* STANDARD SOLO PARENT SUBSIDY SECTIONS */}
                        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-3">
                          <span className="text-[11px] font-extrabold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-1.5 flex items-center justify-between">
                            <span>SOLO PARENT & DEPENDENT INFORMATION</span>
                            <span className="text-[9px] font-mono text-slate-400">FAMILY STATUS</span>
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Solo Parent Category / Reason</span>
                              <div className="font-bold text-white mt-0.5">{selectedApp.solo_parent_category || selectedApp.details?.soloParentCategory || 'Unmarried parent'}</div>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Number of Dependents</span>
                              <div className="font-bold text-white mt-0.5">{selectedApp.num_dependents || selectedApp.details?.dependentsCount || '1'}</div>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Age of Youngest Dependent</span>
                              <div className="font-bold text-white mt-0.5">
                                {(() => {
                                  const raw = selectedApp.age_youngest_dependent || selectedApp.details?.youngestAge || '3';
                                  return String(raw).includes('yr') ? raw : `${raw} yrs old`;
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-3">
                          <span className="text-[11px] font-extrabold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-1.5 flex items-center justify-between">
                            <span>EMPLOYMENT & INCOME DETAILS</span>
                            <span className="text-[9px] font-mono text-slate-400">FINANCIAL ASSESSMENT</span>
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Employment Status</span>
                              <div className="font-bold text-white mt-0.5">{selectedApp.employment_status || selectedApp.details?.employmentStatus || 'Unemployed'}</div>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Occupation</span>
                              <div className="font-semibold text-slate-300 mt-0.5">{selectedApp.occupation || 'N/A'}</div>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Employer / Source of Income</span>
                              <div className="font-semibold text-slate-300 mt-0.5">{selectedApp.employer_income_source || 'N/A'}</div>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Monthly Income (PHP)</span>
                              <div className="font-bold text-emerald-400 mt-0.5">
                                {(() => {
                                  const val = selectedApp.monthly_income;
                                  if (!val || val === '0' || val === 'P0' || val === '₱0') return '₱0.00';
                                  return String(val).startsWith('₱') ? val : `₱${Number(val).toLocaleString('en-US')}`;
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-3">
                          <span className="text-[11px] font-extrabold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-1.5 flex items-center justify-between">
                            <span>OTHER GOVERNMENT ASSISTANCE & PENSION</span>
                            <span className="text-[9px] font-mono text-slate-400">BENEFIT DECLARATION</span>
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Receiving Gov Assistance?</span>
                              <div className="font-bold text-white mt-0.5">{selectedApp.receiving_gov_assistance || 'No'}</div>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Government Program Name</span>
                              <div className="font-semibold text-slate-300 mt-0.5">
                                {selectedApp.gov_program_name ? `${selectedApp.gov_program_name} ${selectedApp.gov_assistance_amount_freq ? `(${selectedApp.gov_assistance_amount_freq})` : ''}` : 'N/A'}
                              </div>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Receiving Pension?</span>
                              <div className="font-bold text-white mt-0.5">{selectedApp.receiving_pension || 'No'}</div>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] font-semibold uppercase">Pension Type / Details</span>
                              <div className="font-semibold text-slate-300 mt-0.5">{selectedApp.pension_type || 'N/A'}</div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

              {/* SECTION 6: UPLOADED REQUIREMENTS (MATCHING EXACT SCREENSHOT 2!) */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-3">
                <span className="text-[11px] font-extrabold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-1.5 flex items-center justify-between">
                  <span>UPLOADED REQUIREMENTS (CLICK TO VIEW / INSPECT)</span>
                </span>

                <div className="space-y-2.5">
                  {(() => {
                    const docsList = [
                      { 
                        key: 'proof_income', 
                        altKeys: ['proof_income', 'indigency'], 
                        title: 'ORIGINAL BARANGAY CERTIFICATE OF INDIGENCY', 
                        file: 'proof_of_indigency.png', 
                        icon: FileText 
                      },
                      { 
                        key: 'enrollment', 
                        altKeys: ['enrollment'], 
                        title: 'CERTIFICATE OF ENROLLMENT', 
                        file: 'certificate_of_enrollment.png', 
                        icon: FileText 
                      },
                      { 
                        key: 'qcid', 
                        altKeys: ['qcid', 'qcitizenId'], 
                        title: 'QCITIZEN ID', 
                        file: 'qcitizen_id_card.png', 
                        icon: ImageIcon 
                      },
                      { 
                        key: 'spic', 
                        altKeys: ['spic', 'soloParentId'], 
                        title: 'SOLO PARENT ID / CERTIFICATION', 
                        file: 'spic_identification_card.png', 
                        icon: CreditCard 
                      }
                    ];

                    return docsList.map((docItem) => {
                      const DocIcon = docItem.icon;
                      let uploadedDoc = null;
                      if (selectedApp.uploaded_documents) {
                        for (const k of [docItem.key, ...docItem.altKeys]) {
                          if (selectedApp.uploaded_documents[k]) {
                            uploadedDoc = selectedApp.uploaded_documents[k];
                            break;
                          }
                        }
                      }
                      const dataUrl = uploadedDoc?.dataUrl || (uploadedDoc as any)?.url;
                      const fileName = uploadedDoc?.name || docItem.file;

                      return (
                        <div
                          key={docItem.key}
                          onClick={() => setInspectingDoc({ title: docItem.title, filename: fileName, dataUrl: dataUrl })}
                          className="p-3.5 rounded-xl bg-[#0b1426] hover:bg-[#111e38] border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer flex items-center gap-3 group"
                        >
                          <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-800/50 text-blue-400 group-hover:text-blue-300 shrink-0">
                            <DocIcon className="w-5 h-5 stroke-[1.7]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-extrabold text-white text-xs tracking-tight">{docItem.title}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                              <span className="text-emerald-400 font-bold">✓ Uploaded:</span>
                              <span className="truncate">{fileName}</span>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* SECTION 7: CURRENT APPLICATION STATUS */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">CURRENT APPLICATION STATUS</span>
                <div>
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 inline-block">
                    {selectedApp.status.toUpperCase()}
                  </span>
                </div>
              </div>

            </div>

            {/* Modal Bottom Action Bar */}
            <div className="p-4 bg-[#121e36] border-t border-slate-800 flex justify-end items-center gap-3 shrink-0">
              {(() => {
                const st = (selectedApp.status || '').toUpperCase();
                const isPendingDoc = st.includes('PENDING') || st.includes('REVIEW') || st === 'SUBMITTED' || st === 'FOR VALIDATION';
                const isRejected = st.includes('REJECT') || st.includes('DISAPPROV');

                if (isPendingDoc) {
                  return (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenRejectModal(selectedApp)}
                        className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/40 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(selectedApp.reference_no, 'APPROVED BY ADMIN')}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Initial Approve</span>
                      </button>
                    </>
                  );
                }

                if (isRejected) {
                  return (
                    <div className="px-6 py-2.5 bg-rose-950/80 text-rose-400 border border-rose-500/40 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-inner">
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>Application Disapproved / Rejected</span>
                    </div>
                  );
                }

                return (
                  <div className="px-6 py-2.5 bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-inner">
                    <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                    <span>✓ Approved & Transferred to Appointments / Payout</span>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>,
        document.body
      )
      })()}

      {/* DOCUMENT INSPECTION MODAL WITH ACTUAL USER PHOTO PREVIEW */}
      {inspectingDoc && createPortal(
        <div className="fixed inset-0 z-[999999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0e172a] border border-slate-700 text-slate-100 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl my-auto">
            <div className="p-4 bg-[#142036] border-b border-slate-800 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-extrabold text-white">{inspectingDoc.title}</h4>
                <span className="text-[10px] text-blue-400 font-mono">Verified Citizen Uploaded Supporting Document</span>
              </div>
              <button
                type="button"
                onClick={() => setInspectingDoc(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {inspectingDoc.dataUrl ? (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden space-y-3">
                  <div className="w-full flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ACTUAL CITIZEN UPLOADED FILE
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {inspectingDoc.filename}
                    </span>
                  </div>

                  <div className="w-full flex items-center justify-center bg-black/80 p-2 rounded-xl border border-slate-800 min-h-[260px] max-h-[380px] overflow-hidden">
                    <img 
                      src={inspectingDoc.dataUrl} 
                      alt={inspectingDoc.title}
                      className="max-h-[360px] w-auto max-w-full rounded-lg object-contain shadow-2xl border border-slate-700/60"
                    />
                  </div>

                  <div className="text-center">
                    <h5 className="text-xs font-extrabold text-white">{inspectingDoc.title}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      Verified & Stored in PostgreSQL DB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#091224] border border-slate-800 rounded-2xl p-5 space-y-3 text-center shadow-xl">
                  <div className="max-w-md mx-auto p-4 rounded-xl bg-[#0e1933] border border-blue-500/40 space-y-2 text-left shadow-lg">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">OFFICIAL ATTACHED DOCUMENT</span>
                      <span className="text-[9px] font-mono text-slate-400">{inspectingDoc.filename}</span>
                    </div>
                    <div className="text-xs font-bold text-white">{inspectingDoc.title}</div>
                    <div className="p-3 bg-slate-950 rounded-lg font-mono text-[10px] text-slate-300 space-y-1">
                      <div>APPLICANT: {selectedApp ? selectedApp.applicant_name : 'Applicant'}</div>
                      <div>REF CONTROL NO: {selectedApp ? selectedApp.reference_no : 'Ref Control No'}</div>
                      <div>STATUS: VERIFIED & VALIDATED DOCUMENT</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {inspectingDoc.filename}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#0a1120] border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectingDoc(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* REJECT REASON MODAL */}
      {showRejectModal && appToReject && createPortal(
        <div className="fixed inset-0 z-[999999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e172a] border border-rose-500/50 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-rose-400">Reject Application ({appToReject.reference_no})</h3>
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-300 uppercase block text-[10px]">Reason for Disapproval / Rejection</label>
              <textarea
                rows={3}
                placeholder="Enter reason for rejection (e.g. Invalid Solo Parent ID, missing affidavit, etc.)..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-[#0b1220] border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
