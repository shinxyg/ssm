import React from 'react';
import { X, Search, CheckCircle2, Clock, FileCheck, QrCode, Download, ShieldCheck } from 'lucide-react';
import type { ApplicationRecord } from '../types';

interface TrackApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: ApplicationRecord[];
}

export const TrackApplicationsModal: React.FC<TrackApplicationsModalProps> = ({
  isOpen,
  onClose,
  applications,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#0e172a] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#111d38] border-b border-slate-700/80 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Track My Applications</h3>
              <p className="text-[11px] text-slate-400">Jefferson Lee • Citizen ID: 4402-9812-7634</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Ref No */}
        <div className="p-4 bg-[#0d162a] border-b border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by Reference Number or Service Name..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Application List */}
        <div className="p-6 overflow-y-auto space-y-4">
          {applications.map((app) => (
            <div
              key={app.referenceNo}
              className="bg-[#121e38] border border-slate-800 rounded-xl p-4 shadow-md space-y-3"
            >
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950/60 border border-blue-800 px-2 py-0.5 rounded">
                    Ref: {app.referenceNo}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">{app.serviceName}</h4>
                  <span className="text-[11px] text-slate-400">Category: {app.category}</span>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      app.status === 'Ready for Payout'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50'
                        : app.status === 'Approved'
                        ? 'bg-blue-950/80 text-blue-300 border-blue-600/50'
                        : 'bg-amber-950/80 text-amber-300 border-amber-600/50'
                    }`}
                  >
                    {app.status === 'Ready for Payout' || app.status === 'Approved' ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Clock className="w-3 h-3 text-amber-400" />
                    )}
                    {app.status}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">Submitted: {app.dateSubmitted}</div>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Assigned Worker: <strong className="text-slate-200">{app.assignedSocialWorker}</strong></span>
                  <span>Amount / Type: <strong className="text-amber-300">{app.amountOrType}</strong></span>
                </div>

                {app.status === 'Ready for Payout' && (
                  <div className="mt-3 p-3 bg-blue-950/50 border border-blue-600/30 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-white p-1 rounded">
                        <QrCode className="w-full h-full text-slate-900" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                          Official Payout Claim Voucher
                        </div>
                        <div className="text-[10px] text-slate-300">Present this QR voucher at City Treasury / Partner Bank</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert(`Downloading Claim Voucher ${app.referenceNo}.pdf`)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg shadow"
                    >
                      <Download className="w-3 h-3" />
                      Voucher
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#111d38] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
