import React, { useState } from 'react';
import { FileText, Lock, Clock, FileCheck, CheckCircle2 } from 'lucide-react';

interface LivelihoodProgramViewProps {
  onApply: () => void;
  darkMode?: boolean;
}

export const LivelihoodProgramView: React.FC<LivelihoodProgramViewProps> = ({ onApply, darkMode = true }) => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [showRequirementsModal, setShowRequirementsModal] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      {/* Requirements Banner */}
      <div className={`rounded-2xl border p-5 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
        darkMode ? 'bg-[#0e1930] border-blue-900/40 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
      }`}>
        <div className="flex items-start gap-3.5">
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${
            darkMode ? 'bg-blue-600/20 border-blue-500/30 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'
          }`}>
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`text-base font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Requirements for Gov Service Livelihood Program
              </h3>
              <span className={`text-[10px] font-bold border px-2.5 py-0.5 rounded-full ${
                darkMode ? 'text-blue-300 bg-blue-950/80 border-blue-700/60' : 'text-blue-700 bg-blue-50 border-blue-200'
              }`}>
                Livelihood Assistance
              </span>
            </div>
            <p className={`text-xs mt-1 leading-relaxed max-w-2xl ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Official government service for Livelihood and Enterprise Assistance of Gov Service. Need to check requirements or re-apply for another livelihood grant?
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowRequirementsModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 border border-blue-400/40 shrink-0 transition-all"
        >
          <FileCheck className="w-4 h-4" />
          <span>View Requirements & Re-Apply</span>
        </button>
      </div>

      {/* Stepper Tabs Bar */}
      <div className={`flex flex-wrap gap-2 p-1.5 rounded-2xl border ${
        darkMode ? 'bg-[#0c1529] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <button
          onClick={() => setActiveTab(1)}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 1
              ? 'bg-blue-600 text-white shadow-md'
              : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>1. APPLY FOR LIVELIHOOD</span>
        </button>

        <button
          disabled
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 flex items-center gap-2 cursor-not-allowed opacity-60"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>2. CAPITAL / MATERIALS...</span>
        </button>

        <button
          disabled
          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 flex items-center gap-2 cursor-not-allowed opacity-60"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>3. LIVELIHOOD MONITO...</span>
        </button>

        <button
          onClick={() => setActiveTab(4)}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 4
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>4. LIVELIHOOD HISTORY</span>
        </button>
      </div>

      {/* Main Content Card Area */}
      {activeTab === 1 ? (
        <div className="rounded-2xl bg-[#0e1930] border border-slate-800/80 p-12 text-center shadow-2xl flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center shadow-inner">
            <FileText className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-lg font-extrabold text-white">No Livelihood Application Yet</h4>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-md">
              Get started by reading the guidelines and documentary requirements before submitting an application.
            </p>
          </div>

          <button
            onClick={onApply}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-full shadow-lg shadow-blue-600/30 border border-blue-400/40 transition-all transform hover:scale-105 uppercase tracking-wider"
          >
            APPLY FOR LIVELIHOOD
          </button>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#0e1930] border border-slate-800 p-6 text-center text-slate-400 text-xs">
          No past livelihood history logged.
        </div>
      )}

      {/* Requirements Modal */}
      {showRequirementsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#0e172a] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-white">Livelihood Assistance Guidelines</h3>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Certificate of Indigency</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Barangay Business Clearance & Proposal</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Valid Government Photo ID</div>
            </div>
            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setShowRequirementsModal(false)}
                className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
