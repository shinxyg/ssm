import React, { useState } from 'react';
import type { ServiceItem, ApplicationRecord } from '../types';
import { X, CheckCircle2, Upload, FileText, Send, ShieldCheck } from 'lucide-react';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onAddApplication: (app: ApplicationRecord) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onAddApplication,
}) => {
  const [tab, setTab] = useState<'info' | 'apply'>('info');
  const [fullName, setFullName] = useState<string>('JEFFERSON LEE');
  const [contactNo, setContactNo] = useState<string>('0917-889-4321');
  const [barangay, setBarangay] = useState<string>('Barangay San Lorenzo, District 2');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  if (!service) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      setUploadedFiles((prev) => [...prev, fileName]);
    }
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const newRefNo = `AICS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: ApplicationRecord = {
      referenceNo: newRefNo,
      serviceName: service.title,
      category: service.category.toUpperCase(),
      dateSubmitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Under Review',
      amountOrType: service.benefitAmount || 'Financial Grant',
      assignedSocialWorker: 'Social Worker Maria Santos, RSW',
    };

    onAddApplication(newApp);
    setSubmittedRef(newRefNo);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#0e172a] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#111d38] border-b border-slate-700/80 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">{service.title}</h3>
              <p className="text-[11px] text-slate-400">Processing Time: {service.processingTime}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        {!submittedRef && (
          <div className="flex border-b border-slate-800 bg-[#0d162a]">
            <button
              type="button"
              onClick={() => setTab('info')}
              className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-colors ${
                tab === 'info'
                  ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Guidelines & Requirements
            </button>
            <button
              type="button"
              onClick={() => setTab('apply')}
              className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-colors ${
                tab === 'apply'
                  ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              2. Online Application Form
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {submittedRef ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-white">Application Successfully Submitted!</h4>
                <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                  Your application for <strong className="text-blue-300">{service.title}</strong> has been transmitted to City Social Welfare and Development Office.
                </p>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-700/80 rounded-xl max-w-sm mx-auto font-mono">
                <span className="text-[10px] text-slate-400 block uppercase">Reference Control Number</span>
                <span className="text-lg font-bold text-amber-400">{submittedRef}</span>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 border border-blue-400/40"
              >
                Close & Track Application
              </button>
            </div>
          ) : tab === 'info' ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
                <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                  Program Overview
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {service.description}
                </p>
                {service.benefitAmount && (
                  <div className="mt-3 text-xs font-semibold text-amber-400 flex items-center gap-2">
                    <span>Est. Benefit Grant:</span>
                    <span className="bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/30">
                      {service.benefitAmount}
                    </span>
                  </div>
                )}
              </div>

              {/* Mandatory Checklist */}
              <div>
                <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                  Mandatory Requirements Checklist
                </h5>
                <div className="space-y-2">
                  {service.requirements.map((req, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center gap-3 text-xs text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setTab('apply')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md border border-blue-400/40 flex items-center gap-2"
                >
                  <span>Proceed to Application Form</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl flex items-center gap-2 text-xs text-blue-300">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Verified Citizen details pulled automatically from PhilSys Data System.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Full Citizen Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Mobile Contact No.</label>
                  <input
                    type="text"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Barangay & District Address</label>
                <input
                  type="text"
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              {/* Upload Document Section */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-300 block">
                  Upload Scanned Requirements (IDs, Certificate of Indigency, Medical Abstract)
                </label>
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs text-slate-300 font-semibold">Click to select files to upload</span>
                  <span className="text-[10px] text-slate-500">Supports JPG, PNG, PDF (Max 10MB)</span>
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-1 mt-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Attached Files:</span>
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-emerald-400 flex items-center justify-between">
                        <span className="truncate">{file}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setTab('info')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700"
                >
                  Back to Info
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 border border-blue-400/40 flex items-center gap-1.5"
                >
                  <span>Submit Digital Application</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
