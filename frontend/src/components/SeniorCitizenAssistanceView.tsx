import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  Upload, 
  ShieldCheck, 
  QrCode,
  Info,
  X,
  Camera,
  Pencil,
  UserCheck,
  ChevronUp,
  ChevronRight,
  Plus,
  Trash2,
  Printer,
  Download,
  Eye,
  AlertCircle
} from 'lucide-react';
import type { ApplicationRecord } from '../types';

interface SeniorCitizenAssistanceViewProps {
  onBack: () => void;
  onAddApplication: (app: ApplicationRecord) => void;
  darkMode?: boolean;
}

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: string;
  occupation: string;
  incomeSource: string;
  otherInfo: string;
}

// Utility to calculate age from Date of Birth string
const calculateAgeFromDob = (dobString: string): string => {
  if (!dobString) return '';
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return '';
  const today = new Date();
  let calculatedAge = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    calculatedAge--;
  }
  return calculatedAge >= 0 ? String(calculatedAge) : '';
};

export const SeniorCitizenAssistanceView: React.FC<SeniorCitizenAssistanceViewProps> = ({
  onBack,
  onAddApplication,
  darkMode = true,
}) => {
  // Dynamic light/dark mode helper classes for clean UX
  const labelClass = `text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`;
  const inputClass = `w-full px-3.5 py-2 rounded-xl text-xs font-semibold border focus:border-blue-500 focus:outline-none transition-colors ${
    darkMode 
      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' 
      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
  }`;
  const subCardClass = darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200';
  const dividerClass = darkMode ? 'border-slate-800' : 'border-slate-200';

  // Stepper state (1: COMPLETE CHECKLIST, 2: INFORMATION, 3: UPLOAD REQUIREMENTS, 4: REVIEW & SUBMIT)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isEditingFromStep4, setIsEditingFromStep4] = useState<boolean>(false);

  const handleNextStep = (nextDefaultStep: number) => {
    if (isEditingFromStep4) {
      setCurrentStep(4);
      setIsEditingFromStep4(false);
    } else {
      setCurrentStep(nextDefaultStep);
    }
  };

  const handleEditStepFromReview = (targetStep: number) => {
    setIsEditingFromStep4(true);
    setCurrentStep(targetStep);
  };

  // STEP 1 States
  const [seniorIdNumber, setSeniorIdNumber] = useState<string>('');
  const [isSeniorIdVerified, setIsSeniorIdVerified] = useState<boolean>(false);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [showReqModal, setShowReqModal] = useState<boolean>(false);

  const handleVerifySeniorId = () => {
    if (seniorIdNumber.trim() !== '') {
      setIsSeniorIdVerified(true);
    }
  };

  // STEP 2 States — 1. Personal Information
  const [qcId, setQcId] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [suffix, setSuffix] = useState<string>('');
  const [nationality, setNationality] = useState<string>('FILIPINO');
  const [dob, setDob] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [civilStatus, setCivilStatus] = useState<string>('');
  const [houseNo, setHouseNo] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [barangay, setBarangay] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [seniorIdDetails, setSeniorIdDetails] = useState<string>('');

  // STEP 2 States — 2. Occupation / Financial Information
  const [employmentStatus, setEmploymentStatus] = useState<string>('');
  const [occupation, setOccupation] = useState<string>('');
  const [sourceOfIncome, setSourceOfIncome] = useState<string>('');
  const [approxMonthlyIncome, setApproxMonthlyIncome] = useState<string>('');
  const [pensionsReceived, setPensionsReceived] = useState<string>('');
  const [otherPensionDetails, setOtherPensionDetails] = useState<string>('');

  // STEP 2 States — 3. Family Composition
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [memName, setMemName] = useState<string>('');
  const [memRel, setMemRel] = useState<string>('');
  const [memAge, setMemAge] = useState<string>('');
  const [memOcc, setMemOcc] = useState<string>('');
  const [memIncome, setMemIncome] = useState<string>('');
  const [memOtherInfo, setMemOtherInfo] = useState<string>('');

  // STEP 2 States — 4. Monthly Household Expenses
  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState<string>('');

  // STEP 2 States — 5. Living Situation / Additional Information (Selections)
  const [livingArrangement, setLivingArrangement] = useState<string>('');
  const [customLivingArrangement, setCustomLivingArrangement] = useState<string>('');
  
  const [financialSupportSource, setFinancialSupportSource] = useState<string>('');
  const [customFinancialSupport, setCustomFinancialSupport] = useState<string>('');

  const [reasonForAssistance, setReasonForAssistance] = useState<string>('');
  const [customReasonForAssistance, setCustomReasonForAssistance] = useState<string>('');

  // STEP 2 States — 6. Other Assistance / Benefits Received
  const [otherBenefitsReceived, setOtherBenefitsReceived] = useState<string>('');
  const [customOtherBenefit, setCustomOtherBenefit] = useState<string>('');

  // STEP 3 Upload States
  const [docSeniorId, setDocSeniorId] = useState<{ name: string; url?: string } | null>(null);
  const [docIndigency, setDocIndigency] = useState<{ name: string; url?: string } | null>(null);
  const [docOtherSupport, setDocOtherSupport] = useState<{ name: string; url?: string } | null>(null);

  // File preview modal
  const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null);
  const [previewFileName, setPreviewFileName] = useState<string>('');

  // Submission success state
  const [submittedAppRecord, setSubmittedAppRecord] = useState<ApplicationRecord | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // Auto-calculate applicant age from DOB
  useEffect(() => {
    if (dob) {
      const calcAge = calculateAgeFromDob(dob);
      if (calcAge) setAge(calcAge);
    }
  }, [dob]);

  const handleAddFamilyMember = () => {
    setFamilyMembers((prev) => [
      ...prev,
      {
        id: `mem-${Date.now()}`,
        name: '',
        relationship: '',
        age: '',
        occupation: '',
        incomeSource: '',
        otherInfo: '',
      },
    ]);
  };

  const updateFamilyMember = (id: string, field: keyof FamilyMember, value: string) => {
    setFamilyMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleRemoveFamilyMember = (id: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Mock File Upload Handler
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setDoc: React.Dispatch<React.SetStateAction<{ name: string; url?: string } | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setDoc({ name: file.name, url });
    }
  };

  const handleFinalSubmit = () => {
    const refNo = `SWA-SR-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullApplicantName = `${firstName || 'Senior'} ${middleName ? middleName + ' ' : ''}${lastName || 'Citizen'} ${suffix}`.trim();

    const newApp: ApplicationRecord = {
      referenceNo: refNo,
      serviceName: 'Senior Citizen Social Welfare Assistance (SWA)',
      category: 'Senior Citizen Sector',
      dateSubmitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Under Review',
      assignedSocialWorker: 'Maria Santos, RSW (Senior Sector Dept)',
      amountOrType: 'Financial Aid / Subsidy Grant',
      details: {
        applicantName: fullApplicantName,
        age: age || '65',
        seniorIdNo: seniorIdNumber || qcId || 'SR-2026-8891',
        barangay: barangay || 'Quezon City',
        livingArrangement: livingArrangement === 'Other' ? customLivingArrangement : livingArrangement,
        reasonForAssistance: reasonForAssistance === 'Other' ? customReasonForAssistance : reasonForAssistance,
      },
    };

    onAddApplication(newApp);
    setSubmittedAppRecord(newApp);
    setShowSuccessModal(true);
  };

  return (
    <div className={`space-y-5 max-w-4xl mx-auto pb-12 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Top Header & Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Services</span>
        </button>

        <div className="text-right">
          <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold block">
            OFFICIAL CITIZEN PORTAL
          </span>
          <h2 className="text-lg font-extrabold tracking-tight">Social Welfare Assistance (SWA)</h2>
        </div>
      </div>

      {/* SINGLE UNIFIED MAIN CONTAINER CARD FOR ALL CONTENT */}
      <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 transition-colors ${
        darkMode ? 'bg-[#0e172a] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {/* 1. HEADER & INFORMATION BOX SECTION */}
        <div className={`space-y-4 pb-6 border-b ${darkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl shrink-0 border ${
              darkMode ? 'bg-blue-600/20 border-blue-500/30 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'
            }`}>
              <UserCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                SOCIAL WELFARE ASSISTANCE (SWA) — SENIOR CITIZEN SECTOR
              </h1>
              <p className={`text-xs sm:text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Quezon City Social Services & Development Department • Senior Citizen Sector
              </p>
            </div>
          </div>

          {/* Information Box */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            darkMode ? 'bg-blue-950/60 border-blue-800/50 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}>
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed font-medium">
              <strong className={darkMode ? 'text-white' : 'text-slate-900'}>Senior Citizen Sector:</strong> Qualified indigent Senior Citizens aged 60 and above may receive the assistance, subject to validation and assessment.
            </div>
          </div>
        </div>

        {/* 2. STEP PROGRESS BAR SECTION */}
        <div className={`pb-6 border-b space-y-4 ${darkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
          {/* Connected Circle Numbers Row */}
          <div className="relative flex items-center justify-between max-w-xl mx-auto px-4">
            <div className={`absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 -z-0 ${
              darkMode ? 'bg-slate-800' : 'bg-slate-200'
            }`} />
            {[1, 2, 3, 4].map((num) => {
              const isActive = currentStep === num;
              const isCompleted = currentStep > num;
              return (
                <div
                  key={num}
                  className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? darkMode ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'bg-blue-100 text-blue-700 border border-blue-300'
                      : darkMode ? 'bg-slate-900 text-slate-500 border border-slate-800' : 'bg-slate-100 text-slate-500 border border-slate-300'
                  }`}
                >
                  {isCompleted ? '✓' : num}
                </div>
              );
            })}
          </div>

          {/* Text Labels Row */}
          <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-extrabold uppercase tracking-wider">
            {[
              { num: 1, label: 'COMPLETE CHECKLIST' },
              { num: 2, label: 'PERSONAL INFORMATION' },
              { num: 3, label: 'UPLOAD DOCUMENTS' },
              { num: 4, label: 'REVIEW & SUBMIT' },
            ].map((s) => {
              const isActive = currentStep === s.num;
              const isCompleted = currentStep > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    if (isCompleted) setCurrentStep(s.num);
                  }}
                  disabled={!isCompleted && currentStep !== s.num}
                  className={`py-2 px-2 rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-black'
                      : isCompleted
                      ? darkMode ? 'text-blue-400 hover:text-blue-300 cursor-pointer' : 'text-blue-600 hover:text-blue-700 cursor-pointer'
                      : darkMode ? 'text-slate-500 cursor-not-allowed' : 'text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span className="truncate block">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. STEP CONTENT AREA */}
        {currentStep === 1 && (
          <div className="space-y-6 pt-2">
            {/* 1. Required Documentary Requirements Section FIRST */}
            <div className="space-y-4">
              <div className={`flex items-center justify-between border-b pb-3 ${darkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
                <h3 className={`text-base font-extrabold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  <FileText className="w-5 h-5 text-blue-500" />
                  Required Documentary Requirements
                </h3>
                <button
                  type="button"
                  onClick={() => setShowReqModal(true)}
                  className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
                >
                  <Info className="w-4 h-4" />
                  <span>View Guidelines</span>
                </button>
              </div>

              <ul className="space-y-2 text-xs py-1">
                <li className={`flex items-start gap-2.5 py-1.5 ${
                  darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className={darkMode ? 'text-white' : 'text-slate-900'}>QCitizen ID / Senior Citizen ID:</strong> Valid ID card issued by Quezon City OSCA / LGU.
                  </div>
                </li>
                <li className={`flex items-start gap-2.5 py-1.5 ${
                  darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className={darkMode ? 'text-white' : 'text-slate-900'}>Certificate of Indigency:</strong> Issued by Barangay with purpose specified as <em>"For Social Welfare Assistance"</em>.
                  </div>
                </li>
                <li className={`flex items-start gap-2.5 py-1.5 ${
                  darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className={darkMode ? 'text-white' : 'text-slate-900'}>Other Supporting Documents:</strong> Any medical prescription, utility bill, or case summary if applicable based on circumstances.
                  </div>
                </li>
              </ul>
            </div>

            {/* 2. Senior Citizen / QCitizen ID Verification Section SECOND */}
            <div className={`pt-4 border-t space-y-4 ${darkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
              <h3 className={`text-base font-extrabold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                Senior Citizen / QCitizen ID Verification
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2 space-y-1.5">
                  <label className={`text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Senior Citizen ID No. / QCitizen ID Card Number *
                  </label>
                  <input
                    type="text"
                    value={seniorIdNumber}
                    onChange={(e) => setSeniorIdNumber(e.target.value)}
                    placeholder="e.g. QC-SR-2026-991823"
                    className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold border focus:outline-none focus:border-blue-500 ${
                      darkMode 
                        ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleVerifySeniorId}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Senior ID</span>
                </button>
              </div>

              {isSeniorIdVerified && (
                <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  darkMode ? 'bg-emerald-950/50 border-emerald-800/60 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>QC Senior Citizen ID Verified — Qualified Senior Citizen Sector Beneficiary</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    darkMode ? 'bg-emerald-900/60 text-emerald-200 border-emerald-700' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    Status: VERIFIED
                  </span>
                </div>
              )}
            </div>

            {/* 3. NEXT Button INSIDE the Card Box (bottom-right, turns blue when ID is inputted) */}
            <div className={`pt-4 border-t flex justify-end ${darkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
              <button
                type="button"
                onClick={() => handleNextStep(2)}
                disabled={!seniorIdNumber.trim()}
                className={`py-2.5 px-8 text-xs font-black rounded-xl uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  seniorIdNumber.trim()
                    ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
                    : darkMode
                    ? 'bg-slate-800 border border-slate-700/60 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-200 border border-slate-300 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>NEXT</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      {/* ========================================================================= */}
      {/* STEP 2: INFORMATION (SENIOR CITIZEN SWA APPLICATION FORM)                 */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="space-y-6 pt-2">
          <h2 className={`text-xl font-black tracking-tight border-b pb-4 mb-6 ${darkMode ? 'text-white border-slate-800' : 'text-slate-900 border-slate-200'}`}>
            Senior Citizen SWA Application Form
          </h2>

            {/* IMPORTANT REMINDER Box */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 mb-6 ${
              darkMode ? 'bg-[#0e1d3d] border-blue-800/60 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}>
              <Info className={`w-5 h-5 shrink-0 mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                  IMPORTANT REMINDER
                </h4>
                <p className={`text-xs mt-1 leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Please make sure the information on your QCID is correct and complete. If any detail is missing or incorrect, contact the QCID Team to update your QCID records before continuing your application.
                </p>
              </div>
            </div>

            {/* SECTION 1: PERSONAL INFORMATION */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-extrabold text-blue-500 uppercase tracking-wider">
                <span>Personal Information</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div>
                  <label className={labelClass}>First name *</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Middle name</label>
                  <input
                    type="text"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    placeholder="Middle name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Last name *</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Suffix (Jr., Sr., III, etc.)</label>
                  <input
                    type="text"
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                    placeholder="Suffix (Jr., Sr., III, etc.)"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Nationality *</label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="FILIPINO"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Date of birth *</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Age *</label>
                  <input
                    type="text"
                    value={age}
                    readOnly
                    placeholder="Auto-computed"
                    className={`w-full px-3.5 py-2 rounded-xl text-xs font-bold border focus:outline-none ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-blue-400' : 'bg-slate-100 border-slate-300 text-blue-700'
                    }`}
                  />
                </div>

                <div>
                  <label className={labelClass}>Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Civil status *</label>
                  <select
                    value={civilStatus}
                    onChange={(e) => setCivilStatus(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select Civil Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>House/Building number *</label>
                  <input
                    type="text"
                    value={houseNo}
                    onChange={(e) => setHouseNo(e.target.value)}
                    placeholder="176"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Street name *</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="23"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Barangay *</label>
                  <input
                    type="text"
                    value={barangay}
                    onChange={(e) => setBarangay(e.target.value)}
                    placeholder="Bagong Silangan"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Phone number *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09155582122"
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-3">
                  <label className={labelClass}>QCitizen ID / Senior Citizen ID Details *</label>
                  <input
                    type="text"
                    value={seniorIdDetails || qcId || seniorIdNumber}
                    onChange={(e) => setSeniorIdDetails(e.target.value)}
                    placeholder="Enter OSCA Senior ID No. or QCitizen ID details"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: OCCUPATION / FINANCIAL INFORMATION */}
            <div className="mt-8 pt-8 border-t border-slate-800 space-y-6">
              <div className="flex items-center gap-2 text-sm font-extrabold text-blue-400 uppercase tracking-wider">
                <span>Occupation / Financial Information</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelClass}>Employment Status *</label>
                  <select
                    value={employmentStatus}
                    onChange={(e) => setEmploymentStatus(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select Employment Status</option>
                    <option value="Retired / Unemployed">Retired / Unemployed</option>
                    <option value="Self-Employed / Informal Worker">Self-Employed / Informal Worker</option>
                    <option value="Employed (Part-Time)">Employed (Part-Time)</option>
                    <option value="Employed (Full-Time)">Employed (Full-Time)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>Current / Previous Occupation</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Laundry Worker, Driver, Vendor, N/A"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>Source of Income</label>
                  <input
                    type="text"
                    value={sourceOfIncome}
                    onChange={(e) => setSourceOfIncome(e.target.value)}
                    placeholder="e.g. Children support, Small vending, Pension"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>Approximate Monthly Income (₱)</label>
                  <select
                    value={approxMonthlyIncome}
                    onChange={(e) => setApproxMonthlyIncome(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select Monthly Income</option>
                    <option value="No Regular Income">No Regular Income (₱0)</option>
                    <option value="Below ₱3,000">Below ₱3,000</option>
                    <option value="₱3,000 - ₱5,000">₱3,000 - ₱5,000</option>
                    <option value="₱5,000 - ₱10,000">₱5,000 - ₱10,000</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>Pension / Benefits Received, if any:</label>
                  <select
                    value={pensionsReceived}
                    onChange={(e) => setPensionsReceived(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select Pension / Benefit</option>
                    <option value="None">None</option>
                    <option value="SSS Pension">SSS Pension</option>
                    <option value="GSIS Pension">GSIS Pension</option>
                    <option value="Other">Other</option>
                  </select>
                  {pensionsReceived === 'Other' && (
                    <input
                      type="text"
                      value={otherPensionDetails}
                      onChange={(e) => setOtherPensionDetails(e.target.value)}
                      placeholder="Specify pension/benefit details..."
                      className={`w-full mt-2 ${inputClass}`}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 3: FAMILY COMPOSITION */}
            <div className={`mt-8 pt-8 border-t ${dividerClass} space-y-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-extrabold text-blue-500 uppercase tracking-wider">
                    <span>Family Composition</span>
                  </div>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Para malaman kung sino ang kasama at sumusuporta sa senior
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddFamilyMember}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl border border-blue-400/40 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Family Member</span>
                </button>
              </div>

              {familyMembers.length === 0 ? (
                <div className={`p-4 rounded-xl border border-dashed text-center text-xs ${
                  darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-300 text-slate-500'
                }`}>
                  No family members added yet. Click "+ Add Family Member" to insert a blank row.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className={`border-b font-bold ${
                        darkMode ? 'border-slate-800 text-slate-400 bg-slate-900/80' : 'border-slate-200 text-slate-600 bg-slate-100'
                      }`}>
                        <th className="py-2.5 px-3 min-w-[150px]">Name *</th>
                        <th className="py-2.5 px-3 min-w-[120px]">Relationship</th>
                        <th className="py-2.5 px-3 w-[80px]">Age</th>
                        <th className="py-2.5 px-3 min-w-[130px]">Occupation</th>
                        <th className="py-2.5 px-3 min-w-[140px]">Income / Support</th>
                        <th className="py-2.5 px-3 text-right w-[60px]">Action</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${dividerClass}`}>
                      {familyMembers.map((mem) => (
                        <tr key={mem.id} className="font-medium">
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={mem.name}
                              onChange={(e) => updateFamilyMember(mem.id, 'name', e.target.value)}
                              placeholder="Full name"
                              className={inputClass}
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={mem.relationship}
                              onChange={(e) => updateFamilyMember(mem.id, 'relationship', e.target.value)}
                              placeholder="Son / Daughter"
                              className={inputClass}
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={mem.age}
                              onChange={(e) => updateFamilyMember(mem.id, 'age', e.target.value)}
                              placeholder="Age"
                              className={inputClass}
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={mem.occupation}
                              onChange={(e) => updateFamilyMember(mem.id, 'occupation', e.target.value)}
                              placeholder="Occupation"
                              className={inputClass}
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={mem.incomeSource}
                              onChange={(e) => updateFamilyMember(mem.id, 'incomeSource', e.target.value)}
                              placeholder="Income / Support"
                              className={inputClass}
                            />
                          </td>
                          <td className="py-2 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveFamilyMember(mem.id)}
                              className="text-rose-500 hover:text-rose-400 p-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 transition-colors"
                              title="Remove Member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* SECTION 4: MONTHLY HOUSEHOLD EXPENSES */}
            <div className={`mt-8 pt-8 border-t ${dividerClass} space-y-4`}>
              <div className="flex items-center gap-2 text-sm font-extrabold text-blue-500 uppercase tracking-wider">
                <span>Monthly Household Expenses</span>
              </div>

              <div className="max-w-md space-y-1">
                <label className={labelClass}>Total Monthly Household Expenses (₱) *</label>
                <input
                  type="text"
                  value={totalMonthlyExpenses}
                  onChange={(e) => setTotalMonthlyExpenses(e.target.value)}
                  placeholder="e.g. ₱3,500 (food, medicines, utilities)"
                  className={inputClass}
                />
              </div>
            </div>

            {/* SECTION 5: LIVING SITUATION & ADDITIONAL SELECTIONS */}
            <div className={`mt-8 pt-8 border-t ${dividerClass} space-y-4`}>
              <div className="flex items-center gap-2 text-sm font-extrabold text-blue-500 uppercase tracking-wider">
                <span>Living Situation & Additional Information</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Living Arrangement Selection */}
                <div className="space-y-1">
                  <label className={labelClass}>Living Arrangement *</label>
                  <select
                    value={livingArrangement}
                    onChange={(e) => setLivingArrangement(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select Living Arrangement</option>
                    <option value="Living Alone">Living Alone</option>
                    <option value="Living with Spouse">Living with Spouse</option>
                    <option value="Living with Children">Living with Children</option>
                    <option value="Living with Relatives">Living with Relatives</option>
                    <option value="Other">Other</option>
                  </select>
                  {livingArrangement === 'Other' && (
                    <input
                      type="text"
                      value={customLivingArrangement}
                      onChange={(e) => setCustomLivingArrangement(e.target.value)}
                      placeholder="Specify living arrangement..."
                      className={`w-full mt-2 ${inputClass}`}
                    />
                  )}
                </div>

                {/* Source of Financial Support Selection */}
                <div className="space-y-1">
                  <label className={labelClass}>Source of Financial Support *</label>
                  <select
                    value={financialSupportSource}
                    onChange={(e) => setFinancialSupportSource(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select Financial Support</option>
                    <option value="Own Income">Own Income</option>
                    <option value="Children/Family">Children / Family</option>
                    <option value="Pension">Pension</option>
                    <option value="Other">Other</option>
                  </select>
                  {financialSupportSource === 'Other' && (
                    <input
                      type="text"
                      value={customFinancialSupport}
                      onChange={(e) => setCustomFinancialSupport(e.target.value)}
                      placeholder="Specify support source..."
                      className={`w-full mt-2 ${inputClass}`}
                    />
                  )}
                </div>

                {/* Reason for Requesting Assistance Selection */}
                <div className="space-y-1">
                  <label className={labelClass}>Reason for Requesting Assistance *</label>
                  <select
                    value={reasonForAssistance}
                    onChange={(e) => setReasonForAssistance(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select Reason for Assistance</option>
                    <option value="Insufficient Income">Insufficient Income</option>
                    <option value="No Regular Income">No Regular Income</option>
                    <option value="High Household Expenses">High Household Expenses</option>
                    <option value="Medical/Medication Expenses">Medical / Medication Expenses</option>
                    <option value="Food/Basic Needs">Food / Basic Needs</option>
                    <option value="Other">Other</option>
                  </select>
                  {reasonForAssistance === 'Other' && (
                    <input
                      type="text"
                      value={customReasonForAssistance}
                      onChange={(e) => setCustomReasonForAssistance(e.target.value)}
                      placeholder="Specify reason..."
                      className={`w-full mt-2 ${inputClass}`}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 6: OTHER ASSISTANCE / BENEFITS RECEIVED */}
            <div className={`mt-8 pt-8 border-t ${dividerClass} space-y-4`}>
              <div className="flex items-center gap-2 text-sm font-extrabold text-blue-500 uppercase tracking-wider">
                <span>Other Assistance / Benefits Received</span>
              </div>

              <div className="space-y-3">
                <label className={labelClass}>Select benefit received (or select None):</label>
                <select
                  value={otherBenefitsReceived}
                  onChange={(e) => setOtherBenefitsReceived(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select Benefit Received</option>
                  <option value="None">None</option>
                  <option value="DSWD Social Pension">DSWD Social Pension</option>
                  <option value="SSS Pension">SSS Pension</option>
                  <option value="GSIS Pension">GSIS Pension</option>
                  <option value="Other">Other</option>
                </select>
                {otherBenefitsReceived === 'Other' && (
                  <input
                    type="text"
                    value={customOtherBenefit}
                    onChange={(e) => setCustomOtherBenefit(e.target.value)}
                    placeholder="Specify other benefit received..."
                    className={`w-full mt-2 ${inputClass}`}
                  />
                )}
              </div>
            </div>

            <div className={`flex justify-between pt-4 border-t ${dividerClass}`}>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`py-3 px-6 text-xs font-bold rounded-xl border transition-all ${
                  darkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                BACK
              </button>
              <button
                type="button"
                onClick={() => handleNextStep(3)}
                className="py-3 px-8 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <span>NEXT</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      {/* ========================================================================= */}
      {/* STEP 3: UPLOAD REQUIREMENTS                                               */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="space-y-6 pt-2">
          <h2 className={`text-xl font-black tracking-tight border-b ${dividerClass} pb-4 mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Step 3: Documentary Requirements / Uploads
          </h2>

            <p className={`text-xs mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Para sa Senior SWA: Pakiupload ang malinaw na larawan o PDF ng mga sumusunod na dokumento.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: QCitizen / Senior ID */}
              <div className={`p-5 rounded-2xl border space-y-4 flex flex-col justify-between ${subCardClass}`}>
                <div>
                  <div className={`flex items-center gap-2 text-sm font-extrabold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    <span>1. Senior Citizen / QCitizen ID *</span>
                  </div>
                  <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Front and back copy of Senior Citizen Card / QCitizen ID.
                  </p>
                </div>

                {docSeniorId ? (
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    darkMode ? 'bg-slate-950 border-blue-500/40' : 'bg-white border-blue-300'
                  }`}>
                    <div className="truncate text-xs font-bold text-blue-500">{docSeniorId.name}</div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {docSeniorId.url && (
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewFileUrl(docSeniorId.url || null);
                            setPreviewFileName(docSeniorId.name);
                          }}
                          className={`p-1 ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setDocSeniorId(null)}
                        className="p-1 text-rose-500 hover:text-rose-400"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    darkMode 
                      ? 'border-slate-700 hover:border-blue-500 bg-slate-950/40 hover:bg-slate-950' 
                      : 'border-slate-300 hover:border-blue-500 bg-white hover:bg-slate-50'
                  }`}>
                    <Upload className="w-6 h-6 text-blue-500" />
                    <span className={`text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Click to Upload ID</span>
                    <span className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>JPG, PNG, or PDF</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(e, setDocSeniorId)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Card 2: Certificate of Indigency */}
              <div className={`p-5 rounded-2xl border space-y-4 flex flex-col justify-between ${subCardClass}`}>
                <div>
                  <div className={`flex items-center gap-2 text-sm font-extrabold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>2. Certificate of Indigency *</span>
                  </div>
                  <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    With purpose specified: <em>"For Social Welfare Assistance"</em>.
                  </p>
                </div>

                {docIndigency ? (
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    darkMode ? 'bg-slate-950 border-blue-500/40' : 'bg-white border-blue-300'
                  }`}>
                    <div className="truncate text-xs font-bold text-blue-500">{docIndigency.name}</div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {docIndigency.url && (
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewFileUrl(docIndigency.url || null);
                            setPreviewFileName(docIndigency.name);
                          }}
                          className={`p-1 ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setDocIndigency(null)}
                        className="p-1 text-rose-500 hover:text-rose-400"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    darkMode 
                      ? 'border-slate-700 hover:border-blue-500 bg-slate-950/40 hover:bg-slate-950' 
                      : 'border-slate-300 hover:border-blue-500 bg-white hover:bg-slate-50'
                  }`}>
                    <Upload className="w-6 h-6 text-blue-500" />
                    <span className={`text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Click to Upload Certificate</span>
                    <span className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>JPG, PNG, or PDF</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(e, setDocIndigency)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Card 3: Other Supporting Documents */}
              <div className={`p-5 rounded-2xl border space-y-4 flex flex-col justify-between ${subCardClass}`}>
                <div>
                  <div className={`flex items-center gap-2 text-sm font-extrabold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>3. Other Supporting Documents</span>
                  </div>
                  <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Medical prescriptions, billings, or other relevant documents if applicable.
                  </p>
                </div>

                {docOtherSupport ? (
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    darkMode ? 'bg-slate-950 border-blue-500/40' : 'bg-white border-blue-300'
                  }`}>
                    <div className="truncate text-xs font-bold text-blue-500">{docOtherSupport.name}</div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {docOtherSupport.url && (
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewFileUrl(docOtherSupport.url || null);
                            setPreviewFileName(docOtherSupport.name);
                          }}
                          className={`p-1 ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setDocOtherSupport(null)}
                        className="p-1 text-rose-500 hover:text-rose-400"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    darkMode 
                      ? 'border-slate-700 hover:border-blue-500 bg-slate-950/40 hover:bg-slate-950' 
                      : 'border-slate-300 hover:border-blue-500 bg-white hover:bg-slate-50'
                  }`}>
                    <Upload className="w-6 h-6 text-blue-500" />
                    <span className={`text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Click to Upload Document</span>
                    <span className={`text-[10px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Optional</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(e, setDocOtherSupport)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className={`flex justify-between pt-4 border-t ${dividerClass}`}>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className={`py-3 px-6 text-xs font-bold rounded-xl border transition-all ${
                  darkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                BACK
              </button>
              <button
                type="button"
                onClick={() => handleNextStep(4)}
                className="py-3 px-8 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <span>NEXT</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      {/* ========================================================================= */}
      {/* STEP 4: REVIEW & SUBMIT APPLICATION SUMMARY                               */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <div className="space-y-6 pt-2">
          <h2 className={`text-xl font-black tracking-tight border-b ${dividerClass} pb-4 mb-6 flex items-center justify-between ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            <span>Step 4: Review & Finalize Application</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
              darkMode ? 'text-amber-400 bg-amber-950/60 border-amber-800' : 'text-amber-700 bg-amber-50 border-amber-300'
            }`}>
              Draft Mode — Please check carefully
            </span>
          </h2>

            {/* SUMMARY CARDS */}
            <div className="space-y-6">
              {/* Personal Info Summary */}
              <div className={`p-5 rounded-2xl border space-y-3 ${subCardClass}`}>
                <div className={`flex items-center justify-between border-b ${dividerClass} pb-2`}>
                  <h4 className="text-xs font-extrabold text-blue-500 uppercase tracking-wider">
                    1. Personal Information & Senior ID
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleEditStepFromReview(2)}
                    className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className={`block text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>FULL NAME</span>
                    <strong className={darkMode ? 'text-white' : 'text-slate-900'}>{firstName || 'Maria'} {middleName} {lastName || 'Dela Cruz'} {suffix}</strong>
                  </div>
                  <div>
                    <span className={`block text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>AGE / GENDER</span>
                    <strong className={darkMode ? 'text-white' : 'text-slate-900'}>{age || '65'} yrs old ({gender})</strong>
                  </div>
                  <div>
                    <span className={`block text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>CIVIL STATUS</span>
                    <strong className={darkMode ? 'text-white' : 'text-slate-900'}>{civilStatus}</strong>
                  </div>
                  <div>
                    <span className={`block text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>CONTACT NUMBER</span>
                    <strong className={darkMode ? 'text-white' : 'text-slate-900'}>{phone || '09171234567'}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className={`block text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>COMPLETE ADDRESS</span>
                    <strong className={darkMode ? 'text-white' : 'text-slate-900'}>{street || 'Sample Street'}, {barangay || 'Barangay Central'}, Quezon City</strong>
                  </div>
                  <div className="col-span-2">
                    <span className={`block text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>SENIOR ID / QCID DETAILS</span>
                    <strong className="text-emerald-500 font-mono">{seniorIdDetails || seniorIdNumber || 'QC-SR-2026-88192'}</strong>
                  </div>
                </div>
              </div>

              {/* Financial & Expenses Summary */}
              <div className={`p-5 rounded-2xl border space-y-3 ${subCardClass}`}>
                <div className={`flex items-center justify-between border-b ${dividerClass} pb-2`}>
                  <h4 className="text-xs font-extrabold text-blue-500 uppercase tracking-wider">
                    2. Occupation, Income & Household Expenses
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleEditStepFromReview(2)}
                    className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className={`block text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>EMPLOYMENT STATUS</span>
                    <strong className={darkMode ? 'text-white' : 'text-slate-900'}>{employmentStatus}</strong>
                  </div>
                  <div>
                    <span className={`block text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>OCCUPATION</span>
                    <strong className={darkMode ? 'text-white' : 'text-slate-900'}>{occupation || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className={`block text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>APPROX. MONTHLY INCOME</span>
                    <strong className={darkMode ? 'text-white' : 'text-slate-900'}>{approxMonthlyIncome}</strong>
                  </div>
                  <div>
                    <span className={`block text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>MONTHLY EXPENSES</span>
                    <strong className="text-amber-500">{totalMonthlyExpenses}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className={`block text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>PENSIONS / BENEFITS RECEIVED</span>
                    <strong className={darkMode ? 'text-white' : 'text-slate-900'}>
                      {pensionsReceived === 'Other' ? (otherPensionDetails || 'Other') : (pensionsReceived || 'None')}
                    </strong>
                  </div>
                  <div className="col-span-2">
                    <span className={`block text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>OTHER BENEFITS RECORDED</span>
                    <strong className={darkMode ? 'text-white' : 'text-slate-900'}>
                      {otherBenefitsReceived === 'Other' ? (customOtherBenefit || 'Other') : (otherBenefitsReceived || 'None')}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Living Situation Summary */}
              <div className={`p-5 rounded-2xl border space-y-3 ${subCardClass}`}>
                <div className={`flex items-center justify-between border-b ${dividerClass} pb-2`}>
                  <h4 className="text-xs font-extrabold text-blue-500 uppercase tracking-wider">
                    3. Living Situation & Financial Support
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleEditStepFromReview(2)}
                    className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className={`block text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>LIVING ARRANGEMENT</span>
                    <strong className={darkMode ? 'text-white' : 'text-slate-900'}>{livingArrangement === 'Other' ? customLivingArrangement : livingArrangement}</strong>
                  </div>
                  <div>
                    <span className={`block text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>FINANCIAL SUPPORT SOURCE</span>
                    <strong className={darkMode ? 'text-white' : 'text-slate-900'}>{financialSupportSource === 'Other' ? customFinancialSupport : financialSupportSource}</strong>
                  </div>
                  <div>
                    <span className={`block text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>REASON FOR REQUEST</span>
                    <strong className={darkMode ? 'text-white' : 'text-slate-900'}>{reasonForAssistance === 'Other' ? customReasonForAssistance : reasonForAssistance}</strong>
                  </div>
                </div>
              </div>

              {/* Uploads Summary */}
              <div className={`p-5 rounded-2xl border space-y-3 ${subCardClass}`}>
                <div className={`flex items-center justify-between border-b ${dividerClass} pb-2`}>
                  <h4 className="text-xs font-extrabold text-blue-500 uppercase tracking-wider">
                    4. Uploaded Requirements
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleEditStepFromReview(3)}
                    className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <CheckCircle2 className={`w-4 h-4 ${docSeniorId ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <div>
                      <span className={`text-[10px] block font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>SENIOR ID</span>
                      <span className={`font-bold text-[11px] truncate block ${darkMode ? 'text-white' : 'text-slate-900'}`}>{docSeniorId?.name || 'Attached / Verified'}</span>
                    </div>
                  </div>
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <CheckCircle2 className={`w-4 h-4 ${docIndigency ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <div>
                      <span className={`text-[10px] block font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>INDIGENCY CERT.</span>
                      <span className={`font-bold text-[11px] truncate block ${darkMode ? 'text-white' : 'text-slate-900'}`}>{docIndigency?.name || 'Attached / Verified'}</span>
                    </div>
                  </div>
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <CheckCircle2 className={`w-4 h-4 ${docOtherSupport ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <div>
                      <span className={`text-[10px] block font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>OTHER SUPPORTING DOC</span>
                      <span className={`font-bold text-[11px] truncate block ${darkMode ? 'text-white' : 'text-slate-900'}`}>{docOtherSupport?.name || 'None / Optional'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`flex justify-between pt-4 border-t ${dividerClass}`}>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className={`py-3 px-6 text-xs font-bold rounded-xl border transition-all ${
                  darkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                BACK
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="py-3.5 px-10 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Submit Application Now</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD FAMILY MEMBER                                                  */}
      {/* ========================================================================= */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className={`w-full max-w-md border rounded-2xl p-6 space-y-4 ${
            darkMode ? 'bg-[#0e172a] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex justify-between items-center border-b ${dividerClass} pb-3`}>
              <h3 className={`text-base font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Add Family Member</h3>
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className={`p-1 ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input
                  type="text"
                  value={memName}
                  onChange={(e) => setMemName(e.target.value)}
                  placeholder="e.g. Juan Dela Cruz Jr."
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Relationship *</label>
                  <input
                    type="text"
                    value={memRel}
                    onChange={(e) => setMemRel(e.target.value)}
                    placeholder="e.g. Son / Daughter"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Age *</label>
                  <input
                    type="text"
                    value={memAge}
                    onChange={(e) => setMemAge(e.target.value)}
                    placeholder="e.g. 35"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Occupation</label>
                <input
                  type="text"
                  value={memOcc}
                  onChange={(e) => setMemOcc(e.target.value)}
                  placeholder="e.g. Sales Associate / Unemployed"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Income / Source of Support</label>
                <input
                  type="text"
                  value={memIncome}
                  onChange={(e) => setMemIncome(e.target.value)}
                  placeholder="e.g. ₱8,000 monthly"
                  className={inputClass}
                />
              </div>
            </div>

            <div className={`flex justify-end gap-3 pt-2 border-t ${dividerClass}`}>
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className={`px-4 py-2 text-xs font-bold ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddFamilyMember}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl transition-all"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DOCUMENT PREVIEW                                                   */}
      {/* ========================================================================= */}
      {previewFileUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className={`w-full max-w-2xl border rounded-2xl p-6 space-y-4 ${
            darkMode ? 'bg-[#0e172a] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex justify-between items-center border-b ${dividerClass} pb-3`}>
              <h3 className={`text-base font-extrabold truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{previewFileName}</h3>
              <button
                type="button"
                onClick={() => setPreviewFileUrl(null)}
                className={`p-1 ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`max-h-[60vh] overflow-auto flex items-center justify-center p-4 rounded-xl border ${
              darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <img src={previewFileUrl} alt="Document Preview" className="max-w-full max-h-[50vh] object-contain rounded" />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewFileUrl(null)}
                className={`px-5 py-2 font-bold text-xs rounded-xl ${
                  darkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                }`}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: APPLICATION SUBMISSION SUCCESS & QR Payout Voucher                 */}
      {/* ========================================================================= */}
      {showSuccessModal && submittedAppRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className={`w-full max-w-xl border rounded-3xl p-6 sm:p-8 space-y-6 text-center ${
            darkMode ? 'bg-[#0e172a] border-blue-500/40' : 'bg-white border-blue-300'
          }`}>
            <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-500">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-500 font-bold">
                APPLICATION SUBMITTED SUCCESSFULLY
              </span>
              <h3 className={`text-xl sm:text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Social Welfare Assistance (Senior Sector)
              </h3>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Quezon City Social Services and Development Department (SSDD)
              </p>
            </div>

            <div className={`p-4 rounded-2xl border space-y-3 text-left ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`flex justify-between items-center border-b ${dividerClass} pb-2`}>
                <span className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Reference Number:</span>
                <strong className="text-sm font-mono text-blue-500 font-black">{submittedAppRecord.referenceNo}</strong>
              </div>
              <div className={`flex justify-between items-center border-b ${dividerClass} pb-2`}>
                <span className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Beneficiary Name:</span>
                <strong className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{submittedAppRecord.details?.applicantName || 'Senior Citizen Beneficiary'}</strong>
              </div>
              <div className={`flex justify-between items-center border-b ${dividerClass} pb-2`}>
                <span className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Status:</span>
                <strong className="text-xs text-emerald-500 font-extrabold">{submittedAppRecord.status}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Assigned Social Worker:</span>
                <strong className={`text-xs ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{submittedAppRecord.assignedSocialWorker}</strong>
              </div>
            </div>

            {/* QR Code Voucher */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-950 flex items-center justify-between gap-4">
              <div className="text-left space-y-0.5">
                <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider">OFFICIAL QC CITIZEN VOUCHER</span>
                <h4 className="text-xs font-extrabold">{submittedAppRecord.referenceNo}</h4>
                <p className="text-[10px] text-slate-600">Present this QR Code during verification or treasury payout.</p>
              </div>
              <div className="p-2 bg-slate-100 rounded-xl border border-slate-300 shrink-0">
                <QrCode className="w-14 h-14 text-slate-900" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className={`flex-1 py-3 font-extrabold text-xs rounded-xl border flex items-center justify-center gap-2 ${
                  darkMode ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
              >
                <Printer className="w-4 h-4" />
                <span>Print Application Voucher</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  onBack();
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl uppercase tracking-wider"
              >
                Done / Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DOCUMENTARY REQUIREMENTS GUIDELINES                                */}
      {/* ========================================================================= */}
      {showReqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className={`w-full max-w-lg border rounded-2xl p-6 space-y-4 ${
            darkMode ? 'bg-[#0e172a] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex justify-between items-center border-b ${dividerClass} pb-3`}>
              <h3 className={`text-base font-extrabold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                <Info className="w-5 h-5 text-blue-500" />
                Documentary Guidelines — Senior Sector SWA
              </h3>
              <button
                type="button"
                onClick={() => setShowReqModal(false)}
                className={`p-1 ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`space-y-3 text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                Ang Social Welfare Assistance (SWA) para sa Senior Citizen Sector ay naglalayong magbigay ng suportang pampinansyal at pangkalusugan sa mga indigent Senior Citizens (60 taong gulang pataas).
              </p>
              <div className={`p-3 rounded-xl border space-y-1.5 ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <strong className={`block ${darkMode ? 'text-white' : 'text-slate-900'}`}>Mga kinakailangang dokumento:</strong>
                <ul className={`list-disc list-inside space-y-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <li>Senior Citizen ID / QCitizen Card</li>
                  <li>Barangay Certificate of Indigency (Purpose: For Social Welfare Assistance)</li>
                  <li>Karagdagang resibo ng gamot o reseta (kung kinakailangan)</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowReqModal(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl"
              >
                Naintindihan Ko
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
