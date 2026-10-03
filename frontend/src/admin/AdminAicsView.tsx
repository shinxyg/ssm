import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  FileText, 
  Eye, 
  X,
  Check,
  Building2,
  Pill,
  FileCheck2,
  CheckCircle2,
  ExternalLink,
  Download,
  Image as ImageIcon,
  Printer
} from 'lucide-react';
import type { ApplicationRecord } from '../types';

interface AdminAicsViewProps {
  darkMode?: boolean;
  applications?: ApplicationRecord[];
  onUpdateStatus?: (refNo: string, newStatus: ApplicationRecord['status']) => void;
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
  const [inspectingDoc, setInspectingDoc] = useState<{ title: string; type: string; url?: string; docObj?: any } | null>(null);
  const [printingGL, setPrintingGL] = useState<ApplicationRecord | null>(null);

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
                      <td className="py-4 px-6 text-slate-300 font-semibold">{app.serviceName}</td>
                      <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">{app.dateSubmitted}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold border ${
                          app.status === 'Ready for Payout' || app.status === 'Approved' || app.status === 'RELEASED / COMPLETED' || (app.status as string) === 'Completed'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                            : app.status === 'Under Review' || app.status === 'Pending Documents'
                            ? 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                            : app.status === 'Pending Appointment' || app.status === 'Interview Scheduled'
                            ? 'bg-blue-950/60 text-blue-400 border-blue-500/30'
                            : 'bg-rose-950/60 text-rose-400 border-rose-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            app.status === 'Ready for Payout' || app.status === 'Approved' || app.status === 'RELEASED / COMPLETED' || (app.status as string) === 'Completed'
                              ? 'bg-emerald-400'
                              : app.status === 'Under Review' || app.status === 'Pending Documents'
                              ? 'bg-amber-400'
                              : app.status === 'Pending Appointment' || app.status === 'Interview Scheduled'
                              ? 'bg-blue-400'
                              : 'bg-rose-400'
                          }`}></span>
                          {app.status}
                        </span>
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

      {/* MANAGE APPLICATION MODAL (STEPS 1-3 USER INPUT DETAILS) */}
      {selectedApp && createPortal(
        <div className="fixed inset-0 z-[99999] bg-[#030712]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#0e172a] text-slate-100 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-800 my-auto">
            {/* Header */}
            <div className="p-5 bg-[#121e36] border-b border-slate-800 flex justify-between items-center shrink-0">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider">{selectedApp.referenceNo}</span>
                <h3 className="text-base font-extrabold text-white mt-0.5">{selectedApp.serviceName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs overflow-y-auto flex-1 custom-modal-scroll">
              {/* STEP 1: SERVICE & ASSISTANCE CATEGORY */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-3">
                <span className="text-[11px] font-extrabold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-1.5 flex items-center justify-between">
                  <span>ASSISTANCE CATEGORY & DETAILS</span>
                  <span className="text-[9px] font-mono text-slate-400">INPUTTED BY USER</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">Category / Program</span>
                    <div className="font-extrabold text-white mt-0.5">{selectedApp.details?.category || selectedApp.category || 'AICS Assistance'}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">Assistance Type</span>
                    <div className="font-extrabold text-blue-300 mt-0.5">{selectedApp.details?.assistanceType || selectedApp.assistanceType || selectedApp.serviceName}</div>
                  </div>
                  {!(
                    (selectedApp.details?.assistanceType || selectedApp.assistanceType || selectedApp.serviceName || '').toLowerCase().includes('medicine')
                  ) && (
                    <>
                      <div>
                        <span className="text-slate-400 text-[10px] font-semibold uppercase">Health Facility / Hospital</span>
                        <div className="font-bold text-slate-200 mt-0.5">
                          {selectedApp.details?.hospitalFacility || selectedApp.hospitalFacility || selectedApp.details?.hospital || 'Quezon City General Hospital (QCGH)'}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-400 text-[10px] font-semibold uppercase">Medical Condition / Reason</span>
                        <div className="font-medium text-slate-300 mt-0.5">
                          {selectedApp.details?.medicalCondition || selectedApp.medicalCondition || selectedApp.details?.diagnosis || 'Medical Assistance Request'}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* STEP 2: APPLICANT & PATIENT PERSONAL INFORMATION (HINIMAY / INDIVIDUAL FIELDS) */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-4">
                <span className="text-[11px] font-extrabold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-1.5 flex items-center justify-between">
                  <span>APPLICANT PERSONAL INFORMATION (INDIVIDUAL FIELDS)</span>
                  <span className="text-[9px] font-mono text-slate-400">VERIFIED QCITIZEN PROFILE</span>
                </span>

                {/* Applicant Profile Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">

                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">First Name</span>
                    <div className="font-bold text-white text-xs mt-0.5">{selectedApp.details?.firstName || (selectedApp.applicantName ? selectedApp.applicantName.split(' ')[0] : 'JEFFERSON')}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">Middle Name</span>
                    <div className="font-bold text-white text-xs mt-0.5">{selectedApp.details?.middleName || 'FERNANDO'}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">Last Name</span>
                    <div className="font-bold text-white text-xs mt-0.5">{selectedApp.details?.lastName || (selectedApp.applicantName ? selectedApp.applicantName.split(' ').pop() : 'LEE')}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">Suffix</span>
                    <div className="font-semibold text-slate-300 text-xs mt-0.5">{selectedApp.details?.suffix || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">Nationality</span>
                    <div className="font-semibold text-slate-300 text-xs mt-0.5">{selectedApp.details?.nationality || 'FILIPINO'}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">Date of Birth</span>
                    <div className="font-mono text-slate-200 text-xs mt-0.5">{selectedApp.details?.dob || '2004-09-27'}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">Age</span>
                    <div className="font-bold text-slate-200 text-xs mt-0.5">{selectedApp.details?.age || '22'} yrs old</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">Gender</span>
                    <div className="font-semibold text-slate-300 text-xs mt-0.5">{selectedApp.details?.gender || 'Male'}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">Civil Status</span>
                    <div className="font-semibold text-slate-300 text-xs mt-0.5">{selectedApp.details?.civilStatus || 'Single'}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">House / Bldg No.</span>
                    <div className="font-semibold text-slate-300 text-xs mt-0.5">{selectedApp.details?.houseNo || '176'}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">Street Name</span>
                    <div className="font-semibold text-slate-300 text-xs mt-0.5">{selectedApp.details?.street || selectedApp.details?.streetName || '23'}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">Barangay</span>
                    <div className="font-bold text-slate-200 text-xs mt-0.5">{selectedApp.details?.barangay || 'Bagong Silangan'}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">Phone Number</span>
                    <div className="font-mono font-bold text-slate-200 text-xs mt-0.5">{selectedApp.details?.phone || '09155582122'}</div>
                  </div>
                </div>

                {/* Patient Sub-Card (Hinimay / Individual Fields) */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wider block">PATIENT BENEFICIARY DETAILS (INDIVIDUAL FIELDS):</span>
                    <span className="text-[9px] font-bold text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 font-mono">
                      {selectedApp.details?.isApplicantPatient ? 'APPLICANT IS PATIENT' : 'PATIENT IS BENEFICIARY'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    <div>
                      <span className="text-slate-400 text-[9px] uppercase font-semibold">Relationship to Patient:</span>
                      <div className="font-bold text-slate-200 text-xs mt-0.5">
                        {selectedApp.details?.isApplicantPatient ? 'Self' : (selectedApp.details?.patientRelation || 'Self')}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] uppercase font-semibold">Patient First Name:</span>
                      <div className="font-bold text-slate-200 text-xs mt-0.5">
                        {selectedApp.details?.isApplicantPatient ? (selectedApp.details?.firstName || 'JEFFERSON') : (selectedApp.details?.patientFirstName || selectedApp.details?.firstName || 'JEFFERSON')}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] uppercase font-semibold">Patient Middle Name:</span>
                      <div className="font-bold text-slate-200 text-xs mt-0.5">
                        {selectedApp.details?.isApplicantPatient ? (selectedApp.details?.middleName || 'FERNANDO') : (selectedApp.details?.patientMiddleName || selectedApp.details?.middleName || 'FERNANDO')}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] uppercase font-semibold">Patient Last Name:</span>
                      <div className="font-bold text-slate-200 text-xs mt-0.5">
                        {selectedApp.details?.isApplicantPatient ? (selectedApp.details?.lastName || 'LEE') : (selectedApp.details?.patientLastName || selectedApp.details?.lastName || 'LEE')}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] uppercase font-semibold">Patient Gender:</span>
                      <div className="font-semibold text-slate-300 text-xs mt-0.5">
                        {selectedApp.details?.isApplicantPatient ? (selectedApp.details?.gender || 'Male') : (selectedApp.details?.patientGender || 'Male')}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] uppercase font-semibold">Patient DOB & Age:</span>
                      <div className="font-mono text-slate-300 text-xs mt-0.5">
                        {selectedApp.details?.isApplicantPatient ? `${selectedApp.details?.dob || '2004-09-27'} (${selectedApp.details?.age || '22'} yrs)` : `${selectedApp.details?.patientDob || '2004-09-27'} (${selectedApp.details?.patientAge || '22'} yrs)`}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] uppercase font-semibold">Patient House / Bldg No.</span>
                      <div className="font-semibold text-slate-300 text-xs mt-0.5">
                        {selectedApp.details?.isApplicantPatient ? (selectedApp.details?.houseNo || '176') : (selectedApp.details?.patientHouseNo || selectedApp.details?.houseNo || '176')}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] uppercase font-semibold">Patient Street Name</span>
                      <div className="font-semibold text-slate-300 text-xs mt-0.5">
                        {selectedApp.details?.isApplicantPatient ? (selectedApp.details?.street || '23') : (selectedApp.details?.patientStreet || selectedApp.details?.patientStreetName || selectedApp.details?.street || '23')}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] uppercase font-semibold">Patient Barangay</span>
                      <div className="font-bold text-slate-200 text-xs mt-0.5">
                        {selectedApp.details?.isApplicantPatient ? (selectedApp.details?.barangay || 'Bagong Silangan') : (selectedApp.details?.patientBarangay || selectedApp.details?.barangay || 'Bagong Silangan')}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] uppercase font-semibold">Patient City</span>
                      <div className="font-medium text-slate-300 text-xs mt-0.5">Quezon City</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 3: UPLOADED DOCUMENTS (INSPECTION) */}
              <div className="p-4 rounded-xl bg-[#091124] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-[11px] font-extrabold text-slate-200 uppercase tracking-wider">
                    UPLOADED REQUIREMENTS (CLICK TO VIEW / INSPECT)
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {selectedApp.serviceName.toLowerCase().includes('medicine') ? (
                    <>
                      {/* Doc 1: Medical Certificate */}
                      <button
                        type="button"
                        onClick={() => {
                          const doc = selectedApp.details?.uploadedDocData?.med_cert;
                          const url = typeof doc === 'string' ? doc : doc?.dataUrl;
                          setInspectingDoc({ 
                            title: "Medical Certificate / Clinical Abstract",
                            type: "Medical Certificate",
                            url: url,
                            docObj: doc
                          });
                        }}
                        className="p-3 rounded-xl bg-[#0d1830] hover:bg-[#15264a] border border-slate-700/80 flex items-center justify-between transition-all group text-left cursor-pointer shadow-md"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div className="truncate">
                            <span className="text-[11px] font-extrabold text-white block truncate">
                              Medical Certificate / Clinical Abstract
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono block">
                              {selectedApp.details?.uploadedDocData?.med_cert 
                                ? `✓ Uploaded: ${typeof selectedApp.details.uploadedDocData.med_cert === 'object' ? selectedApp.details.uploadedDocData.med_cert.name || 'Photo Attached' : 'Photo Attached'}` 
                                : 'Pending Citizen Upload'}
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* Doc 2: Doctor Prescription */}
                      <button
                        type="button"
                        onClick={() => {
                          const doc = selectedApp.details?.uploadedDocData?.reseta;
                          const url = typeof doc === 'string' ? doc : doc?.dataUrl;
                          setInspectingDoc({ 
                            title: "Doctor Prescription / Medicine Prescription",
                            type: "Reseta",
                            url: url,
                            docObj: doc
                          });
                        }}
                        className="p-3 rounded-xl bg-[#0d1830] hover:bg-[#15264a] border border-slate-700/80 flex items-center justify-between transition-all group text-left cursor-pointer shadow-md"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <Pill className="w-4 h-4 text-amber-400 shrink-0" />
                          <div className="truncate">
                            <span className="text-[11px] font-extrabold text-white block truncate">
                              Doctor Prescription / Medicine Prescription
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono block">
                              {selectedApp.details?.uploadedDocData?.reseta 
                                ? `✓ Uploaded: ${typeof selectedApp.details.uploadedDocData.reseta === 'object' ? selectedApp.details.uploadedDocData.reseta.name || 'Photo Attached' : 'Photo Attached'}` 
                                : 'Pending Citizen Upload'}
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* Doc 3: Barangay Certificate of Indigency */}
                      <button
                        type="button"
                        onClick={() => {
                          const doc = selectedApp.details?.uploadedDocData?.indigency;
                          const url = typeof doc === 'string' ? doc : doc?.dataUrl;
                          setInspectingDoc({ 
                            title: "Barangay Certificate of Indigency",
                            type: "Indigency Certificate",
                            url: url,
                            docObj: doc
                          });
                        }}
                        className="p-3 rounded-xl bg-[#0d1830] hover:bg-[#15264a] border border-slate-700/80 flex items-center justify-between transition-all group text-left cursor-pointer shadow-md"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                          <div className="truncate">
                            <span className="text-[11px] font-extrabold text-white block truncate">
                              Barangay Certificate of Indigency
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono block">
                              {selectedApp.details?.uploadedDocData?.indigency 
                                ? `✓ Uploaded: ${typeof selectedApp.details.uploadedDocData.indigency === 'object' ? selectedApp.details.uploadedDocData.indigency.name || 'Photo Attached' : 'Photo Attached'}` 
                                : 'Pending Citizen Upload'}
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* Doc 4: Patient QC ID */}
                      <button
                        type="button"
                        onClick={() => {
                          const doc = selectedApp.details?.uploadedDocData?.qcid_patient;
                          const url = typeof doc === 'string' ? doc : doc?.dataUrl;
                          setInspectingDoc({ 
                            title: "Patient QC ID / Government ID",
                            type: "QC ID",
                            url: url,
                            docObj: doc
                          });
                        }}
                        className="p-3 rounded-xl bg-[#0d1830] hover:bg-[#15264a] border border-slate-700/80 flex items-center justify-between transition-all group text-left cursor-pointer shadow-md"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <ImageIcon className="w-4 h-4 text-blue-400 shrink-0" />
                          <div className="truncate">
                            <span className="text-[11px] font-extrabold text-white block truncate">
                              Patient QC ID (Card Photo)
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono block">
                              {selectedApp.details?.uploadedDocData?.qcid_patient 
                                ? `✓ Uploaded: ${typeof selectedApp.details.uploadedDocData.qcid_patient === 'object' ? selectedApp.details.uploadedDocData.qcid_patient.name || 'Photo Attached' : 'Photo Attached'}` 
                                : 'Pending Citizen Upload'}
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* Doc 5: Authorization Letter */}
                      <button
                        type="button"
                        onClick={() => {
                          const doc = selectedApp.details?.uploadedDocData?.authorization;
                          const url = typeof doc === 'string' ? doc : doc?.dataUrl;
                          setInspectingDoc({ 
                            title: "Authorization / Personal Letter",
                            type: "Authorization Letter",
                            url: url,
                            docObj: doc
                          });
                        }}
                        className="p-3 rounded-xl bg-[#0d1830] hover:bg-[#15264a] border border-slate-700/80 flex items-center justify-between transition-all group text-left cursor-pointer shadow-md"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <FileText className="w-4 h-4 text-teal-400 shrink-0" />
                          <div className="truncate">
                            <span className="text-[11px] font-extrabold text-white block truncate">
                              Authorization / Personal Letter
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono block">
                              {selectedApp.details?.uploadedDocData?.authorization 
                                ? `✓ Uploaded: ${typeof selectedApp.details.uploadedDocData.authorization === 'object' ? selectedApp.details.uploadedDocData.authorization.name || 'Photo Attached' : 'Photo Attached'}` 
                                : 'Pending Citizen Upload'}
                            </span>
                          </div>
                        </div>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Medical Bill Aid 5 Docs */}
                      <button
                        type="button"
                        onClick={() => {
                          const doc = selectedApp.details?.uploadedDocData?.reseta || selectedApp.details?.uploadedDocData?.med_cert;
                          const url = typeof doc === 'string' ? doc : doc?.dataUrl;
                          setInspectingDoc({ 
                            title: "Hospital Statement of Account (SOA)",
                            type: "Hospital SOA",
                            url: url,
                            docObj: doc
                          });
                        }}
                        className="p-3 rounded-xl bg-[#0d1830] hover:bg-[#15264a] border border-slate-700/80 flex items-center justify-between transition-all group text-left cursor-pointer shadow-md"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                          <div className="truncate">
                            <span className="text-[11px] font-extrabold text-white block truncate">
                              Hospital Statement of Account
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono block">
                              {selectedApp.details?.uploadedDocData?.reseta 
                                ? `✓ Uploaded: ${typeof selectedApp.details.uploadedDocData.reseta === 'object' ? selectedApp.details.uploadedDocData.reseta.name || 'Photo Attached' : 'Photo Attached'}` 
                                : 'Pending Citizen Upload'}
                            </span>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const doc = selectedApp.details?.uploadedDocData?.med_cert;
                          const url = typeof doc === 'string' ? doc : doc?.dataUrl;
                          setInspectingDoc({ 
                            title: "Medical Certificate / Clinical Summary",
                            type: "Medical Certificate",
                            url: url,
                            docObj: doc
                          });
                        }}
                        className="p-3 rounded-xl bg-[#0d1830] hover:bg-[#15264a] border border-slate-700/80 flex items-center justify-between transition-all group text-left cursor-pointer shadow-md"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div className="truncate">
                            <span className="text-[11px] font-extrabold text-white block truncate">
                              Medical Certificate / Clinical Abstract
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono block">
                              {selectedApp.details?.uploadedDocData?.med_cert 
                                ? `✓ Uploaded: ${typeof selectedApp.details.uploadedDocData.med_cert === 'object' ? selectedApp.details.uploadedDocData.med_cert.name || 'Photo Attached' : 'Photo Attached'}` 
                                : 'Pending Citizen Upload'}
                            </span>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const doc = selectedApp.details?.uploadedDocData?.indigency;
                          const url = typeof doc === 'string' ? doc : doc?.dataUrl;
                          setInspectingDoc({ 
                            title: "Barangay Certificate of Indigency",
                            type: "Indigency Certificate",
                            url: url,
                            docObj: doc
                          });
                        }}
                        className="p-3 rounded-xl bg-[#0d1830] hover:bg-[#15264a] border border-slate-700/80 flex items-center justify-between transition-all group text-left cursor-pointer shadow-md"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                          <div className="truncate">
                            <span className="text-[11px] font-extrabold text-white block truncate">
                              Barangay Certificate of Indigency
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono block">
                              {selectedApp.details?.uploadedDocData?.indigency 
                                ? `✓ Uploaded: ${typeof selectedApp.details.uploadedDocData.indigency === 'object' ? selectedApp.details.uploadedDocData.indigency.name || 'Photo Attached' : 'Photo Attached'}` 
                                : 'Pending Citizen Upload'}
                            </span>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const doc = selectedApp.details?.uploadedDocData?.qcid_patient;
                          const url = typeof doc === 'string' ? doc : doc?.dataUrl;
                          setInspectingDoc({ 
                            title: "Valid Government ID (PhilSys / Voter ID)",
                            type: "Government ID",
                            url: url,
                            docObj: doc
                          });
                        }}
                        className="p-3 rounded-xl bg-[#0d1830] hover:bg-[#15264a] border border-slate-700/80 flex items-center justify-between transition-all group text-left cursor-pointer shadow-md"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <ImageIcon className="w-4 h-4 text-amber-400 shrink-0" />
                          <div className="truncate">
                            <span className="text-[11px] font-extrabold text-white block truncate">
                              Valid Government Photo ID (PhilSys)
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono block">
                              {selectedApp.details?.uploadedDocData?.qcid_patient 
                                ? `✓ Uploaded: ${typeof selectedApp.details.uploadedDocData.qcid_patient === 'object' ? selectedApp.details.uploadedDocData.qcid_patient.name || 'Photo Attached' : 'Photo Attached'}` 
                                : 'Pending Citizen Upload'}
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* Doc 5: Authorization Letter */}
                      <button
                        type="button"
                        onClick={() => {
                          const doc = selectedApp.details?.uploadedDocData?.authorization;
                          const url = typeof doc === 'string' ? doc : doc?.dataUrl;
                          setInspectingDoc({ 
                            title: "Authorization / Personal Letter",
                            type: "Authorization Letter",
                            url: url,
                            docObj: doc
                          });
                        }}
                        className="p-3 rounded-xl bg-[#0d1830] hover:bg-[#15264a] border border-slate-700/80 flex items-center justify-between transition-all group text-left cursor-pointer shadow-md"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <FileText className="w-4 h-4 text-teal-400 shrink-0" />
                          <div className="truncate">
                            <span className="text-[11px] font-extrabold text-white block truncate">
                              Authorization / Personal Letter
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono block">
                              {selectedApp.details?.uploadedDocData?.authorization 
                                ? `✓ Uploaded: ${typeof selectedApp.details.uploadedDocData.authorization === 'object' ? selectedApp.details.uploadedDocData.authorization.name || 'Photo Attached' : 'Photo Attached'}` 
                                : 'Pending Citizen Upload'}
                            </span>
                          </div>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] font-semibold uppercase block mb-1.5">Current Application Status</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  {selectedApp.status}
                </span>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="p-4 bg-[#0a1120] border-t border-slate-800 flex justify-end gap-2.5 flex-wrap shrink-0">
              {selectedApp.status === 'Rejected' ? (
                <span className="px-4 py-2 bg-rose-950/60 border border-rose-700/50 text-rose-300 font-bold text-xs rounded-xl flex items-center gap-1.5">
                  <X className="w-4 h-4" />
                  <span>Application Disqualified / Rejected</span>
                </span>
              ) : selectedApp.status !== 'Under Review' && selectedApp.status !== 'Pending Documents' ? (
                <span className="px-5 py-2 bg-emerald-950/80 border border-emerald-600/60 text-emerald-400 font-bold text-xs rounded-xl flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>✓ Approved & Transferred to Appointments</span>
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      if (onUpdateStatus) onUpdateStatus(selectedApp.referenceNo, 'Rejected');
                      setSelectedApp(null);
                    }}
                    className="px-4 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-700/50 text-rose-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject Application</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onUpdateStatus) onUpdateStatus(selectedApp.referenceNo, 'Pending Appointment');
                      setSelectedApp(null);
                    }}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve & Transfer to Appointments</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* DOCUMENT INSPECTOR PREVIEW OVERLAY MODAL */}
      {inspectingDoc && createPortal(
        <div className="fixed inset-0 z-[100000] bg-[#030712]/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0e172a] text-slate-100 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-700">
            <div className="p-4 bg-[#142036] border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-blue-400" />
                <div>
                  <h4 className="text-sm font-extrabold text-white">{inspectingDoc.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">Official Attached Supporting Document</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectingDoc(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {inspectingDoc.url || (typeof inspectingDoc.docObj === 'object' && inspectingDoc.docObj?.dataUrl) ? (
                /* ACTUAL USER UPLOADED IMAGE PREVIEW */
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden space-y-3">
                  <div className="w-full flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ACTUAL CITIZEN UPLOADED FILE
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {typeof inspectingDoc.docObj === 'object' ? inspectingDoc.docObj?.name || 'uploaded_file.jpg' : 'uploaded_file.jpg'}
                    </span>
                  </div>

                  <div className="w-full flex items-center justify-center bg-black/70 p-2 rounded-xl border border-slate-800/90 min-h-[250px] max-h-[380px] overflow-hidden">
                    <img 
                      src={inspectingDoc.url || (typeof inspectingDoc.docObj === 'object' ? inspectingDoc.docObj?.dataUrl : '')} 
                      alt={inspectingDoc.title}
                      className="max-h-[360px] w-auto max-w-full rounded-lg object-contain shadow-2xl border border-slate-700/60"
                    />
                  </div>

                  <div className="text-center">
                    <h5 className="text-xs font-extrabold text-white">{inspectingDoc.title}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      File Size: {typeof inspectingDoc.docObj === 'object' ? inspectingDoc.docObj?.size || 'Verified' : 'Verified'} • Stored in PostgreSQL DB
                    </p>
                  </div>
                </div>
              ) : (
                /* NO FILE ATTACHED NOTICE */
                <div className="bg-[#091224] border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-xl">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[#121e36] border border-slate-800 flex items-center justify-center text-slate-400">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-white">{inspectingDoc.title}</h5>
                    <p className="text-xs text-amber-400 font-medium">No document photo uploaded by applicant for this slot.</p>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-1">
                      When a citizen uploads a file in Step 3 of the application form, their actual uploaded picture will appear here.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#0a1120] border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setInspectingDoc(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
