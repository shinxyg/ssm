import React, { useState } from 'react';
import { X, HeartHandshake, CheckCircle, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';

interface EligibilityFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCategoryFilter: (category: string) => void;
}

export const EligibilityFinderModal: React.FC<EligibilityFinderModalProps> = ({
  isOpen,
  onClose,
  onApplyCategoryFilter,
}) => {
  const [sector, setSector] = useState<string>('indigent');
  const [need, setNeed] = useState<string>('medical');
  const [income, setIncome] = useState<string>('below15k');
  const [results, setResults] = useState<string[] | null>(null);

  if (!isOpen) return null;

  const handleEvaluate = () => {
    const qualified: string[] = [];
    if (need === 'medical') qualified.push('AICS Medical & Hospitalization Guarantee Letter');
    if (need === 'medicine') qualified.push('PWD / Senior Free Medicine Booklet & Discount Card');
    if (need === 'educational') qualified.push('AICS Educational Financial Assistance');
    if (need === 'funeral') qualified.push('AICS Funeral & Burial Financial Assistance');
    if (need === 'livelihood') qualified.push('Sustainable Livelihood Program Micro-Grant');

    if (sector === 'pwd') qualified.push('PWD Quarterly Stipend & ID Card Reissuance');
    if (sector === 'senior') qualified.push('Senior Citizen Social Pension & Healthcare Booklet');
    if (sector === 'soloparent') qualified.push('Solo Parent Welfare Benefit & Discount ID');

    setResults(qualified);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#0e172a] border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900/60 to-[#111d38] border-b border-slate-700/80 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400 text-blue-300 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                Assistance & Eligibility Finder
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h3>
              <p className="text-[11px] text-slate-300">Answer 3 questions to discover programs you qualify for</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {!results ? (
            <>
              {/* Question 1: Sector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200">1. What is your primary sector / category?</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'indigent', label: 'Indigent Citizen' },
                    { id: 'pwd', label: 'Person with Disability (PWD)' },
                    { id: 'senior', label: 'Senior Citizen (60+)' },
                    { id: 'soloparent', label: 'Solo Parent' },
                    { id: 'student', label: 'Student / Child' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSector(item.id)}
                      className={`p-2.5 text-xs font-semibold rounded-xl border text-center transition-all ${
                        sector === item.id
                          ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Specific Need */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200">2. What type of assistance do you need urgently?</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'medical', label: '🏥 Hospital Bills & Surgery' },
                    { id: 'medicine', label: '💊 Prescribed Medicines / Booklet' },
                    { id: 'educational', label: '🎓 Tuition & School Expenses' },
                    { id: 'funeral', label: '⚰️ Funeral / Burial Aid' },
                    { id: 'livelihood', label: '💼 Micro-Business / Livelihood' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setNeed(item.id)}
                      className={`p-2.5 text-xs font-semibold rounded-xl border text-left transition-all ${
                        need === item.id
                          ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Household Income */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200">3. Monthly Household Income</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'below15k', label: 'Below ₱15,000' },
                    { id: '15k-30k', label: '₱15,000 - ₱30,000' },
                    { id: 'above30k', label: 'Above ₱30,000' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setIncome(item.id)}
                      className={`p-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                        income === item.id
                          ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleEvaluate}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 border border-blue-400/40 transition-all flex items-center justify-center gap-2"
              >
                <span>Find Eligible Social Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl flex items-center gap-3 text-emerald-300">
                <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold">Eligibility Check Passed!</h4>
                  <p className="text-[11px] text-slate-300">Based on your answers, you are eligible for the following assistance programs:</p>
                </div>
              </div>

              <div className="space-y-2">
                {results.map((prog, idx) => (
                  <div key={idx} className="p-3 bg-slate-900 border border-slate-700/80 rounded-xl flex justify-between items-center">
                    <span className="text-xs font-semibold text-white">{prog}</span>
                    <span className="text-[10px] bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded border border-blue-700">
                      100% Eligible
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResults(null)}
                  className="w-1/2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700"
                >
                  Recalculate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onApplyCategoryFilter('all');
                    onClose();
                  }}
                  className="w-1/2 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow border border-blue-400/40"
                >
                  View All Programs
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
