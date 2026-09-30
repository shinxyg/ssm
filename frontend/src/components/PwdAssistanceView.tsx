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
  ChevronRight
} from 'lucide-react';
import type { ApplicationRecord } from '../types';

interface PwdAssistanceViewProps {
  onBack: () => void;
  onAddApplication: (app: ApplicationRecord) => void;
  darkMode?: boolean;
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

export const PwdAssistanceView: React.FC<PwdAssistanceViewProps> = ({
  onBack,
  onAddApplication,
  darkMode = true,
}) => {
  // Stepper state (1: COMPLETE CHECKLIST, 2: PERSONAL INFORMATION, 3: UPLOAD DOCUMENTS, 4: REVIEW & SUBMIT)
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

  // Step 1 Form States (Matching exact PWD screenshots 1, 2, 3)
  const [pwdIdNumber, setPwdIdNumber] = useState<string>('');
  const [isPwdIdVerified, setIsPwdIdVerified] = useState<boolean>(false);
  const [typeOfDisability, setTypeOfDisability] = useState<string>('Auto-filled upon PWD ID verification');
  const [swaCategory, setSwaCategory] = useState<string>('');
  const [showReqModal, setShowReqModal] = useState<boolean>(false);

  const handleVerifyPwdId = () => {
    if (pwdIdNumber.trim() !== '') {
      setIsPwdIdVerified(true);
      setTypeOfDisability('Physical / Mobility Disability (QC PWD Verified)');
    }
  };

  // Step 2 Form States - Section 1: Personal Information
  const [qcId, setQcId] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [suffix, setSuffix] = useState<string>('');
  const [nationality, setNationality] = useState<string>('FILIPINO');
  const [dob, setDob] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('Male');
  const [civilStatus, setCivilStatus] = useState<string>('Single');
  const [houseNo, setHouseNo] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [barangay, setBarangay] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // Section 2: OCCUPATION / EMPLOYMENT
  const [employmentStatus, setEmploymentStatus] = useState<string>('Unemployed / Jobless');
  const [occupation, setOccupation] = useState<string>('');
  const [sourceOfIncome, setSourceOfIncome] = useState<string>('');
  const [approxMonthlyIncome, setApproxMonthlyIncome] = useState<string>('No Regular Income');

  // Section 3: EDUCATIONAL BACKGROUND
  const [highestEducation, setHighestEducation] = useState<string>('');
  const [otherEducationInfo, setOtherEducationInfo] = useState<string>('');

  // Section 4: FAMILY COMPOSITION
  const [familyMembers, setFamilyMembers] = useState<{ id: string; name: string; rel: string; age: string; occ: string }[]>([]);
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [memName, setMemName] = useState<string>('');
  const [memRel, setMemRel] = useState<string>('');
  const [memAge, setMemAge] = useState<string>('');
  const [memOcc, setMemOcc] = useState<string>('');

  // Section 5: ESTIMATE MONTHLY EXPENSES
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>('');

  // Section 6: ADDITIONAL INFORMATION & SWA CATEGORY
  const [reasonForAssistance, setReasonForAssistance] = useState<string>('');

  const handleAddFamilyMember = () => {
    if (memName.trim()) {
      setFamilyMembers((prev) => [
        ...prev,
        {
          id: `mem-${Date.now()}`,
          name: memName,
          rel: memRel || 'Relative',
          age: memAge || 'N/A',
          occ: memOcc || 'N/A',
        },
      ]);
      setMemName('');
      setMemRel('');
      setMemAge('');
      setMemOcc('');
      setShowAddMemberModal(false);
    }
  };

  const handleRemoveFamilyMember = (id: string) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Auto-calculate applicant age from DOB
  useEffect(() => {
    if (dob) {
      const calcAge = calculateAgeFromDob(dob);
      if (calcAge) setAge(calcAge);
    }
  }, [dob]);

  // Step 3 Document Upload States
  const [docPwdId, setDocPwdId] = useState<{ name: string; url?: string } | null>(null);
  const [docIndigency, setDocIndigency] = useState<{ name: string; url?: string } | null>(null);
  const [docMedical, setDocMedical] = useState<{ name: string; url?: string } | null>(null);
  const [docResidency, setDocResidency] = useState<{ name: string; url?: string } | null>(null);

  // Image Preview Lightbox State
  const [previewImageModal, setPreviewImageModal] = useState<{ title: string; url: string } | null>(null);

  // Camera Capture Modal State
  const [activeCameraDocKey, setActiveCameraDocKey] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Step 4 Review & Certification State
  const [certifiedTrue, setCertifiedTrue] = useState<boolean>(false);

  // Success Confirmation Modal State
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [generatedRefNo, setGeneratedRefNo] = useState<string>('');

  // Camera functions
  const openCameraModal = async (docKey: string) => {
    setActiveCameraDocKey(docKey);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera access failed or unavailable, using simulation mode", err);
    }
  };

  const closeCameraModal = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setCameraStream(null);
    setActiveCameraDocKey(null);
  };

  const handleCapturePhoto = () => {
    const fakePhotoUrl = `https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=500&auto=format&fit=crop&q=80`;
    const photoDoc = { name: `camera_capture_${Date.now()}.jpg`, url: fakePhotoUrl };

    if (activeCameraDocKey === 'pwd') setDocPwdId(photoDoc);
    if (activeCameraDocKey === 'indigency') setDocIndigency(photoDoc);
    if (activeCameraDocKey === 'medical') setDocMedical(photoDoc);
    if (activeCameraDocKey === 'residency') setDocResidency(photoDoc);

    closeCameraModal();
  };

  // Submit Application Handler
  const handleSubmitApplication = () => {
    const newRef = `QC-PWD-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedRefNo(newRef);

    const newAppRecord: ApplicationRecord = {
      referenceNo: newRef,
      serviceName: 'PWD Social Assistance Program',
      category: 'PWD Services',
      dateSubmitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Ready for Payout',
      assignedSocialWorker: 'Maria Santos, RSW (QC Social Services)',
      amountOrType: '₱5,000 Social Aid / Assistive Device',
      qrCodeData: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${newRef}`
    };

    onAddApplication(newAppRecord);
    setIsSuccessModalOpen(true);
  };

  // Shared Theme Styling Tokens for High-Contrast Readability
  const cardClass = darkMode 
    ? 'bg-[#0f1b35] border-slate-800 text-white' 
    : 'bg-white border-slate-200 text-slate-900';

  const labelClass = darkMode 
    ? 'text-slate-300 font-semibold text-xs mb-1 block' 
    : 'text-slate-700 font-bold text-xs mb-1 block';

  const inputClass = darkMode 
    ? 'w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold border bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none' 
    : 'w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold border bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none';

  const bannerClass = darkMode 
    ? 'p-4 rounded-xl bg-blue-950/50 border border-blue-800/60 flex items-start gap-3' 
    : 'p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3';

  const bannerTitleClass = darkMode 
    ? 'text-xs font-extrabold text-blue-300 uppercase tracking-wider' 
    : 'text-xs font-extrabold text-blue-900 uppercase tracking-wider';

  const bannerTextClass = darkMode 
    ? 'text-xs text-slate-300 mt-0.5 leading-relaxed' 
    : 'text-xs text-slate-700 mt-0.5 leading-relaxed font-medium';

  const subHeaderClass = darkMode 
    ? 'text-xs font-extrabold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2' 
    : 'text-xs font-extrabold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2';

  const backBtnClass = darkMode 
    ? 'px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-extrabold tracking-wider uppercase border border-slate-700 transition-all' 
    : 'px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-extrabold tracking-wider uppercase border border-slate-300 transition-all';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header & Navigation */}
      <div className="space-y-4">
        <h1 className={`text-xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          PWD Services
        </h1>

        <div className="flex items-center">
          <button
            type="button"
            onClick={onBack}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all border ${
              darkMode
                ? 'bg-slate-900 border-slate-800 text-blue-400 hover:text-white hover:bg-slate-800'
                : 'bg-white border-slate-200 text-blue-600 hover:bg-slate-50'
            }`}
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>BACK TO PWD SERVICES</span>
          </button>
        </div>
      </div>

      {/* SINGLE UNIFIED MAIN CONTAINER CARD FOR ALL PWD CONTENT */}
      <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${cardClass}`}>
        {/* Stepper Progress Bar (4 Steps) */}
        <div className="pb-6 border-b border-slate-800/80 space-y-4">
          {/* Step Numbers Line */}
          <div className="relative flex justify-between items-center max-w-3xl mx-auto mb-2 px-4">
            <div className={`absolute top-1/2 left-8 right-8 h-0.5 -translate-y-1/2 z-0 ${
              darkMode ? 'bg-slate-800' : 'bg-slate-200'
            }`} />

            {[1, 2, 3, 4].map((stepNum) => {
              const isPassed = currentStep > stepNum;
              const isCurrent = currentStep === stepNum;
              return (
                <div key={stepNum} className="relative z-10 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (stepNum < currentStep || isEditingFromStep4) {
                        setCurrentStep(stepNum);
                      }
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-500/20 scale-110'
                        : isPassed
                        ? 'bg-blue-600 text-white'
                        : darkMode
                        ? 'bg-slate-900 text-slate-500 border border-slate-800'
                        : 'bg-slate-100 text-slate-500 border border-slate-300'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-5 h-5 text-white" /> : stepNum}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Tab Buttons matching reference screenshot */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { step: 1, label: 'COMPLETE CHECKLIST' },
              { step: 2, label: 'PERSONAL INFORMATION' },
              { step: 3, label: 'UPLOAD DOCUMENTS' },
              { step: 4, label: 'REVIEW & SUBMIT' },
            ].map((tab) => {
              const isActive = currentStep === tab.step;
              return (
                <button
                  key={tab.step}
                  type="button"
                  onClick={() => {
                    if (tab.step < currentStep || isEditingFromStep4) {
                      setCurrentStep(tab.step);
                    }
                  }}
                  className={`py-2.5 px-2 text-[11px] font-extrabold tracking-wider rounded-xl transition-all uppercase text-center border ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md font-black'
                      : darkMode
                      ? 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 1: SERVICE AND PRIMARY REQUIREMENTS (Matching Screenshots 1, 2, 3) */}
        {currentStep === 1 && (
          <div className="space-y-6 pt-2">
          <div>
            <h2 className={`text-xs font-extrabold tracking-wider uppercase mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>
              SERVICE AND PRIMARY REQUIREMENTS
            </h2>

            {/* Alert Banner */}
            <div className={bannerClass}>
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h3 className={bannerTitleClass}>
                  PWD Sector: Qualified beneficiaries may receive the assistance provided.
                </h3>
                <p className={bannerTextClass}>
                  Exclusively for indigent Persons with Disabilities (PWD) who qualify under specific vulnerability categories (e.g., bedridden, severe medical condition, solo parent, jobless with 2+ minor dependents, living alone, or living with a Senior Citizen parent). Subject to official assessment and Social Case Study before approval.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {/* PWD ID NUMBER with Prefix Box & Verify Button (Matching Screenshot 1 & 2) */}
            <div>
              <label className={labelClass}>
                PWD ID NUMBER <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className={`flex flex-1 items-center rounded-xl border overflow-hidden shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-600 ${
                  darkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-300 bg-white'
                }`}>
                  <span className={`px-3.5 py-2.5 text-xs font-extrabold border-r select-none shrink-0 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-blue-400' : 'bg-slate-100 border-slate-300 text-blue-700'
                  }`}>
                    PWD-
                  </span>
                  <input
                    type="text"
                    value={pwdIdNumber}
                    onChange={(e) => setPwdIdNumber(e.target.value)}
                    placeholder="137404-2026-847708"
                    className={`w-full px-3.5 py-2.5 text-xs font-semibold outline-none border-none ${
                      darkMode ? 'bg-slate-900 text-white placeholder-slate-500' : 'bg-white text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyPwdId}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold tracking-wider uppercase border border-blue-500/40 shadow-sm transition-all shrink-0"
                >
                  VERIFY PWD ID
                </button>
              </div>
            </div>

            {/* TYPE OF DISABILITY (Auto-filled upon PWD ID verification) */}
            <div>
              <label className={labelClass}>
                TYPE OF DISABILITY <span className="text-red-500">**</span>
              </label>
              <input
                type="text"
                value={typeOfDisability}
                readOnly
                placeholder="Auto-filled upon PWD ID verification"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold border ${
                  darkMode ? 'bg-slate-900/60 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-800 shadow-sm'
                }`}
              />
            </div>

            {/* TYPE OF ASSISTANCE REQUESTED (SWA CATEGORY) (Matching Screenshot 3) */}
            <div>
              <label className={labelClass}>
                TYPE OF ASSISTANCE REQUESTED (SWA CATEGORY) <span className="text-red-500">**</span>
              </label>
              <select
                value={swaCategory}
                onChange={(e) => setSwaCategory(e.target.value)}
                className={inputClass}
              >
                <option value="">Select...</option>
                <option value="Bedridden">Bedridden</option>
                <option value="Severe Health Condition">Severe Health Condition</option>
                <option value="Solo Parent">Solo Parent</option>
                <option value="Jobless with 2+ Minor Dependents">Jobless with 2+ Minor Dependents</option>
                <option value="Living Alone">Living Alone</option>
                <option value="Living with Senior Citizen Parent">Living with Senior Citizen Parent</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="button"
              disabled={!pwdIdNumber || !swaCategory}
              onClick={() => handleNextStep(2)}
              className={`px-8 py-2.5 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all shadow-md ${
                pwdIdNumber && swaCategory
                  ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
                  : darkMode
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
            >
              NEXT
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PERSONAL INFORMATION & SECTIONS 1-6 (MATCHING SCREENSHOTS 1, 2, 3, 4) */}
      {currentStep === 2 && (
        <div className="space-y-6 pt-2">
          {/* Reminder Banner */}
          <div className={bannerClass}>
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <h3 className={bannerTitleClass}>
                IMPORTANT REMINDER
              </h3>
              <p className={bannerTextClass}>
                Please make sure the information on your QCID is correct and complete. If any detail is missing or incorrect, contact the QCID Team to update your QCID records before continuing your application. Accurate information is important for fast and smooth processing of your service.
              </p>
            </div>
          </div>

          {/* 1. PERSONAL INFORMATION */}
          <div className="space-y-4">
            <div>
              <h3 className={subHeaderClass}>
                1. PERSONAL INFORMATION
              </h3>
              <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Primary applicant information retrieved from QCID / Profile
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Full Name *</label>
                <input
                  type="text"
                  value={`${firstName} ${middleName} ${lastName}`.trim() || 'JEFFERSON FERNANDO LEE'}
                  onChange={(e) => {
                    const parts = e.target.value.split(' ');
                    setFirstName(parts[0] || '');
                    setMiddleName(parts.slice(1, -1).join(' ') || '');
                    setLastName(parts.length > 1 ? parts[parts.length - 1] : '');
                  }}
                  placeholder="JEFFERSON FERNANDO LEE"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Contact Number *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09155582122"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jeffersonlee1234@gmail.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Complete Address *</label>
                <input
                  type="text"
                  value={`${houseNo} ${street}`.trim() || '176 23'}
                  onChange={(e) => {
                    setHouseNo(e.target.value);
                    setStreet('');
                  }}
                  placeholder="176 23"
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
            </div>
          </div>

          {/* 2. OCCUPATION / EMPLOYMENT */}
          <div className="space-y-4 pt-4 border-t border-slate-700/40">
            <div>
              <h3 className={subHeaderClass}>
                2. OCCUPATION / EMPLOYMENT
              </h3>
              <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Information regarding current employment status and household income
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Employment Status *</label>
                <select
                  value={employmentStatus}
                  onChange={(e) => setEmploymentStatus(e.target.value)}
                  className={inputClass}
                >
                  <option value="Unemployed / Jobless">Unemployed / Jobless</option>
                  <option value="Employed (Private)">Employed (Private)</option>
                  <option value="Employed (Government)">Employed (Government)</option>
                  <option value="Self-Employed / Freelance">Self-Employed / Freelance</option>
                  <option value="Student">Student</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Occupation</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Helper, Vendor, N/A"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Source of Income</label>
                <input
                  type="text"
                  value={sourceOfIncome}
                  onChange={(e) => setSourceOfIncome(e.target.value)}
                  placeholder="e.g. Family Support, Remittance, Allowance, None"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Approximate Monthly Income *</label>
                <select
                  value={approxMonthlyIncome}
                  onChange={(e) => setApproxMonthlyIncome(e.target.value)}
                  className={inputClass}
                >
                  <option value="No Regular Income">No Regular Income</option>
                  <option value="Below ₱10,000">Below ₱10,000</option>
                  <option value="₱10,000 - ₱15,000">₱10,000 - ₱15,000</option>
                  <option value="₱15,000 - ₱20,000">₱15,000 - ₱20,000</option>
                  <option value="Above ₱20,000">Above ₱20,000</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. EDUCATIONAL BACKGROUND */}
          <div className="space-y-4 pt-4 border-t border-slate-700/40">
            <div>
              <h3 className={subHeaderClass}>
                3. EDUCATIONAL BACKGROUND
              </h3>
              <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Educational attainment of the applicant
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Highest Educational Attainment *</label>
                <select
                  value={highestEducation}
                  onChange={(e) => setHighestEducation(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select...</option>
                  <option value="Elementary Level">Elementary Level</option>
                  <option value="Elementary Graduate">Elementary Graduate</option>
                  <option value="High School Level">High School Level</option>
                  <option value="High School Graduate">High School Graduate</option>
                  <option value="Vocational / SPED">Vocational / SPED</option>
                  <option value="College Level">College Level</option>
                  <option value="College Graduate">College Graduate</option>
                  <option value="Post Graduate">Post Graduate</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Other Relevant Education Information</label>
                <input
                  type="text"
                  value={otherEducationInfo}
                  onChange={(e) => setOtherEducationInfo(e.target.value)}
                  placeholder="e.g. SPED, Vocational Training, or None"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* 4. FAMILY COMPOSITION */}
          <div className="space-y-4 pt-4 border-t border-slate-700/40">
            <div className="flex justify-between items-center">
              <div>
                <h3 className={subHeaderClass}>
                  4. FAMILY COMPOSITION
                </h3>
                <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  To identify family members living with and dependent on the applicant
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddMemberModal(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <span>+ Add Family Member</span>
              </button>
            </div>

            {familyMembers.length === 0 ? (
              <div className={`p-6 border-2 border-dashed rounded-2xl text-center space-y-3 ${
                darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  No family members listed. If living alone, you may leave this blank or click the button below to add family members.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(true)}
                  className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold border border-blue-500/30 transition-all inline-flex items-center gap-1.5"
                >
                  <span>+ Add Family Member</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {familyMembers.map((m) => (
                  <div key={m.id} className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="text-xs">
                      <strong className="text-blue-500 font-extrabold">{m.name}</strong> ({m.rel}, {m.age} yrs) — <span className="text-slate-400">{m.occ}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFamilyMember(m.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. ESTIMATE MONTHLY EXPENSES */}
          <div className="space-y-4 pt-4 border-t border-slate-700/40">
            <div>
              <h3 className={subHeaderClass}>
                5. ESTIMATE MONTHLY EXPENSES
              </h3>
              <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Estimated total monthly household expenses
              </p>
            </div>

            <div className="max-w-md">
              <label className={labelClass}>Estimated Monthly Expenses (P) *</label>
              <div className={`flex items-center rounded-xl border overflow-hidden shadow-sm ${
                darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'
              }`}>
                <span className={`px-3.5 py-2.5 text-xs font-extrabold select-none border-r ${
                  darkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}>
                  ₱
                </span>
                <input
                  type="text"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(e.target.value)}
                  placeholder="5000"
                  className={`w-full px-3.5 py-2.5 text-xs font-semibold outline-none border-none ${
                    darkMode ? 'bg-slate-900 text-white placeholder-slate-500' : 'bg-white text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
              <p className={`text-[11px] mt-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Total monthly expenses for utilities, food, medicine, etc. (Number only, up to 5 digits only)
              </p>
            </div>
          </div>

          {/* 6. ADDITIONAL INFORMATION & SWA CATEGORY (AUTO-FILLED FROM STEP 1) */}
          <div className="space-y-4 pt-4 border-t border-slate-700/40">
            <div>
              <h3 className={subHeaderClass}>
                6. ADDITIONAL INFORMATION & SWA CATEGORY
              </h3>
              <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Information needed to assess the applicant and reason for requesting assistance
              </p>
            </div>

            {/* QUALIFYING CATEGORY (PWD SWA) - AUTO-FILLED INPUT FROM STEP 1 */}
            <div className="space-y-2">
              <label className={labelClass}>
                QUALIFYING CATEGORY (PWD SWA) *
              </label>

              <input
                type="text"
                value={swaCategory || ''}
                readOnly
                placeholder="Auto-filled upon selecting SWA Category in Step 1"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border select-none ${
                  darkMode 
                    ? 'bg-slate-900/90 border-slate-700 text-blue-400 cursor-not-allowed' 
                    : 'bg-slate-100 border-slate-300 text-blue-700 cursor-not-allowed shadow-sm'
                }`}
              />
            </div>

            {/* Reason for Assistance / Assessment Details */}
            <div className="space-y-2 pt-2">
              <label className={labelClass}>
                Reason for Assistance / Assessment Details *
              </label>
              <textarea
                rows={3}
                value={reasonForAssistance}
                onChange={(e) => setReasonForAssistance(e.target.value)}
                placeholder="e.g. In need of monthly assistance for medicine and basic living expenses due to lack of steady income..."
                className={`w-full p-3.5 rounded-xl text-xs font-medium border outline-none transition-all ${
                  darkMode
                    ? 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white shadow-sm'
                }`}
              />
              <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Explain why the applicant needs assistance and any other relevant case details for the Social Worker's assessment.
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={backBtnClass}
            >
              BACK
            </button>

            <button
              type="button"
              onClick={() => handleNextStep(3)}
              className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold tracking-wider uppercase shadow-lg transition-all"
            >
              NEXT
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: UPLOAD DOCUMENTS */}
      {currentStep === 3 && (
        <div className="space-y-6 pt-2">
          <div className="space-y-6">
            {[
              {
                key: 'indigency',
                title: 'BARANGAY CERTIFICATE OF INDIGENCY *',
                desc: 'Issued within 6 months, with purpose: "For Social Welfare Assistance."',
                doc: docIndigency,
                setDoc: setDocIndigency,
              },
              {
                key: 'medical',
                title: 'MEDICAL CERTIFICATE *',
                desc: 'Medical Certificate / Clinical Abstract from a licensed physician or hospital certifying the medical condition or disability.',
                doc: docMedical,
                setDoc: setDocMedical,
              },
              {
                key: 'pwd',
                title: 'QC PWD ID / APPLICABLE IDENTIFICATION *',
                desc: 'Clear photo of your QCitizen PWD ID or any applicable identification card (front and back).',
                doc: docPwdId,
                setDoc: setDocPwdId,
              },
              {
                key: 'residency',
                title: 'REQUIRED PHOTO / DOCUMENTATION DEPENDING ON DISABILITY *',
                desc: 'Litrato/Dokumento depende sa disability (e.g., whole-body photo with calendar for bedridden beneficiaries, Solo Parent ID/Cert, or proof of vulnerability).',
                alert: 'If bedridden: Whole-body photo with a calendar showing the current date.',
                doc: docResidency,
                setDoc: setDocResidency,
              },
            ].map((item) => (
              <div
                key={item.key}
                className={`p-5 rounded-2xl border transition-all ${
                  darkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-slate-50/80 border-slate-200'
                }`}
              >
                <div>
                  <h4 className="text-xs font-extrabold tracking-wide uppercase text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>

                  {item.alert && (
                    <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs font-semibold text-amber-800 dark:text-amber-300">
                      {item.alert}
                    </div>
                  )}

                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-3">
                    Allowed file types: JPG, JPEG, PNG, WEBP (or capture using Camera)
                  </p>

                  {item.doc && (
                    <div className="mt-3">
                      <div 
                        onClick={() => {
                          if (item.doc) {
                            setPreviewImageModal({
                              title: item.title,
                              url: item.doc.url || 'https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=500&auto=format&fit=crop&q=80'
                            });
                          }
                        }}
                        className={`relative w-36 border rounded-2xl p-2.5 flex flex-col items-center shadow-xl group cursor-pointer hover:border-blue-500/80 transition-all ${
                          darkMode ? 'bg-[#091124] border-slate-700/90' : 'bg-white border-slate-200'
                        }`}
                        title="Click to view photo"
                      >
                        {/* Floating X Delete Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            item.setDoc(null);
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-slate-700 hover:bg-red-600 text-white rounded-full flex items-center justify-center border border-slate-600 shadow-md transition-all cursor-pointer z-10"
                          title="Remove photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        {/* Square Thumbnail Image */}
                        <div className={`w-20 h-20 rounded-xl overflow-hidden border shrink-0 relative ${
                          darkMode ? 'border-slate-700 bg-slate-950' : 'border-slate-200 bg-slate-100'
                        }`}>
                          <img
                            src={item.doc.url || 'https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=500&auto=format&fit=crop&q=80'}
                            alt={item.doc.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>

                        {/* Truncated Filename */}
                        <span className={`text-[10px] font-bold text-center truncate max-w-full mt-2 block px-1 group-hover:text-blue-400 ${
                          darkMode ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          {item.doc.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <label className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all shadow-sm uppercase tracking-wider">
                    <Upload className="w-4 h-4" />
                    <span>UPLOAD PHOTO</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const url = URL.createObjectURL(file);
                          item.setDoc({ name: file.name, url });
                        }
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => openCameraModal(item.key)}
                    className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-extrabold flex items-center gap-2 transition-all shadow-sm uppercase tracking-wider"
                  >
                    <Camera className="w-4 h-4" />
                    <span>TAKE PHOTO (CAMERA)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={backBtnClass}
            >
              BACK
            </button>

            <button
              type="button"
              onClick={() => handleNextStep(4)}
              className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold tracking-wider uppercase shadow-lg transition-all"
            >
              NEXT
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & SUBMIT */}
      {currentStep === 4 && (
        <div className="space-y-6 pt-2">
          <div className="space-y-1 mb-4">
            <h3 className={`text-base sm:text-lg font-extrabold tracking-wide uppercase ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              REVIEW YOUR APPLICATION
            </h3>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Please review all information carefully before submitting your application. You can edit any section by clicking the edit button.
            </p>
          </div>

          <div className="space-y-4">
            {/* 1. PWD & Assistance Category Section Card */}
            <div className={`border rounded-2xl overflow-hidden ${darkMode ? 'bg-[#0e1933]/60 border-slate-800' : 'bg-slate-50/80 border-slate-200 shadow-sm'}`}>
              <div className={`p-4 flex items-center justify-between border-b ${darkMode ? 'bg-[#101c38] border-slate-800/80' : 'bg-slate-100 border-slate-200'}`}>
                <div className="flex items-center gap-2">
                  <ChevronUp className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  <h4 className={`text-sm font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>PWD & Assistance Category</h4>
                </div>
                <button
                  type="button"
                  onClick={() => handleEditStepFromReview(1)}
                  className="text-xs font-extrabold text-blue-500 hover:text-blue-400 flex items-center gap-1.5 transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>EDIT</span>
                </button>
              </div>
              <div className="p-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-6">
                  <div>
                    <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>PWD ID NUMBER</span>
                    <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{pwdIdNumber ? `PWD-${pwdIdNumber}` : 'N/A'}</span>
                  </div>
                  <div>
                    <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>TYPE OF DISABILITY</span>
                    <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{typeOfDisability || 'Auto-filled upon PWD ID verification'}</span>
                  </div>
                  <div>
                    <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>CATEGORY REQUESTED</span>
                    <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{swaCategory || 'Bedridden'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Personal Information Section Card */}
            <div className={`border rounded-2xl overflow-hidden ${darkMode ? 'bg-[#0e1933]/60 border-slate-800' : 'bg-slate-50/80 border-slate-200 shadow-sm'}`}>
              <div className={`p-4 flex items-center justify-between border-b ${darkMode ? 'bg-[#101c38] border-slate-800/80' : 'bg-slate-100 border-slate-200'}`}>
                <div className="flex items-center gap-2">
                  <ChevronUp className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  <h4 className={`text-sm font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Personal information</h4>
                </div>
                <button
                  type="button"
                  onClick={() => handleEditStepFromReview(2)}
                  className="text-xs font-extrabold text-blue-500 hover:text-blue-400 flex items-center gap-1.5 transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>EDIT</span>
                </button>
              </div>
              <div className="p-5 space-y-6">
                {/* Section 1: Primary Personal Information */}
                <div>
                  <h5 className={`text-xs font-extrabold uppercase tracking-wider mb-3 pb-1 border-b ${darkMode ? 'text-blue-400 border-slate-800' : 'text-blue-600 border-slate-200'}`}>
                    PERSONAL INFORMATION
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>FIRST NAME</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{firstName || 'N/A'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>MIDDLE NAME</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{middleName || 'N/A'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>LAST NAME</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{lastName || 'N/A'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>SUFFIX</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{suffix || 'None'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>NATIONALITY</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{nationality || 'FILIPINO'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>DATE OF BIRTH / AGE</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{dob || 'N/A'} ({age ? `${age} yrs` : 'N/A'})</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>GENDER / SEX</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{gender || 'Male'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>CIVIL STATUS</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{civilStatus || 'Single'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>HOUSE / BUILDING NO. & STREET</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{houseNo || 'N/A'} {street}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>BARANGAY</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{barangay || 'N/A'}, Quezon City</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>CONTACT / PHONE NUMBER</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>REGISTERED EMAIL ADDRESS</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{email || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Occupation / Employment */}
                <div>
                  <h5 className={`text-xs font-extrabold uppercase tracking-wider mb-3 pb-1 border-b ${darkMode ? 'text-blue-400 border-slate-800' : 'text-blue-600 border-slate-200'}`}>
                    OCCUPATION / EMPLOYMENT
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>EMPLOYMENT STATUS</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{employmentStatus || 'Unemployed / Jobless'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>OCCUPATION</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{occupation || 'N/A'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>SOURCE OF INCOME</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{sourceOfIncome || 'N/A'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>APPROXIMATE MONTHLY INCOME</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{approxMonthlyIncome || 'No Regular Income'}</span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Educational Background */}
                <div>
                  <h5 className={`text-xs font-extrabold uppercase tracking-wider mb-3 pb-1 border-b ${darkMode ? 'text-blue-400 border-slate-800' : 'text-blue-600 border-slate-200'}`}>
                    EDUCATIONAL BACKGROUND
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>HIGHEST EDUCATIONAL ATTAINMENT</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{highestEducation || 'N/A'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>OTHER EDUCATION INFO</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{otherEducationInfo || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Section 4: Family Composition */}
                <div>
                  <h5 className={`text-xs font-extrabold uppercase tracking-wider mb-3 pb-1 border-b ${darkMode ? 'text-blue-400 border-slate-800' : 'text-blue-600 border-slate-200'}`}>
                    FAMILY COMPOSITION
                  </h5>
                  {familyMembers.length > 0 ? (
                    <div className="space-y-2">
                      {familyMembers.map((m, idx) => (
                        <div key={m.id || idx} className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                          darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
                        }`}>
                          <div>
                            <span className={`font-bold block ${darkMode ? 'text-white' : 'text-slate-900'}`}>{m.name}</span>
                            <span className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              Rel: {m.rel} | Age: {m.age} yrs | Occ: {m.occ}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-xs italic ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>No family members listed.</p>
                  )}
                </div>

                {/* Section 5: Monthly Expenses */}
                <div>
                  <h5 className={`text-xs font-extrabold uppercase tracking-wider mb-3 pb-1 border-b ${darkMode ? 'text-blue-400 border-slate-800' : 'text-blue-600 border-slate-200'}`}>
                    MONTHLY EXPENSES
                  </h5>
                  <div className="text-xs">
                    <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>ESTIMATED MONTHLY EXPENSES</span>
                    <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>₱{monthlyExpenses || '5,000'}</span>
                  </div>
                </div>

                {/* Section 6: Additional Information & SWA Category */}
                <div>
                  <h5 className={`text-xs font-extrabold uppercase tracking-wider mb-3 pb-1 border-b ${darkMode ? 'text-blue-400 border-slate-800' : 'text-blue-600 border-slate-200'}`}>
                    ADDITIONAL INFORMATION & SWA CATEGORY
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>QUALIFYING CATEGORY (PWD SWA)</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{swaCategory || 'N/A'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>REASON FOR ASSISTANCE / ASSESSMENT</span>
                      <span className={`font-bold leading-relaxed ${darkMode ? 'text-white' : 'text-slate-900'}`}>{reasonForAssistance || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Required Documents Section Card */}
            <div className={`border rounded-2xl overflow-hidden ${darkMode ? 'bg-[#0e1933]/60 border-slate-800' : 'bg-slate-50/80 border-slate-200 shadow-sm'}`}>
              <div className={`p-4 flex items-center justify-between border-b ${darkMode ? 'bg-[#101c38] border-slate-800/80' : 'bg-slate-100 border-slate-200'}`}>
                <div className="flex items-center gap-2">
                  <ChevronUp className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  <h4 className={`text-sm font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Required documents</h4>
                </div>
                <button
                  type="button"
                  onClick={() => handleEditStepFromReview(3)}
                  className="text-xs font-extrabold text-blue-500 hover:text-blue-400 flex items-center gap-1.5 transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>EDIT</span>
                </button>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { key: 'indigency', title: 'BARANGAY CERTIFICATE OF INDIGENCY *', doc: docIndigency },
                  { key: 'medical', title: 'MEDICAL CERTIFICATE *', doc: docMedical },
                  { key: 'pwd', title: 'QC PWD ID / APPLICABLE IDENTIFICATION *', doc: docPwdId },
                  { key: 'residency', title: 'REQUIRED PHOTO / DOCUMENTATION DEPENDING ON DISABILITY *', doc: docResidency },
                ].map((item) => {
                  return (
                    <div key={item.key} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-extrabold uppercase tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {item.title}
                        </span>
                        {item.doc && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                      {item.doc ? (
                        <div className="pt-1">
                          <div 
                            onClick={() => {
                              if (item.doc) {
                                setPreviewImageModal({
                                  title: item.title,
                                  url: item.doc.url || 'https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=500&auto=format&fit=crop&q=80'
                                });
                              }
                            }}
                            className={`w-36 border rounded-2xl p-2.5 flex flex-col items-center shadow-lg group cursor-pointer hover:border-blue-500/80 transition-all ${
                              darkMode ? 'bg-[#091124] border-slate-700/90' : 'bg-white border-slate-200'
                            }`}
                            title="Click to view full photo"
                          >
                            <div className={`w-20 h-20 rounded-xl overflow-hidden border shrink-0 ${
                              darkMode ? 'border-slate-700 bg-slate-950' : 'border-slate-200 bg-slate-100'
                            }`}>
                              <img
                                src={item.doc.url || 'https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=500&auto=format&fit=crop&q=80'}
                                alt={item.doc.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <span className={`text-[10px] font-bold text-center truncate max-w-full mt-2 block px-1 group-hover:text-blue-400 ${
                              darkMode ? 'text-slate-200' : 'text-slate-800'
                            }`}>
                              {item.doc.name}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-0.5">
                          <span className={`text-xs italic ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>No photo uploaded</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className={`pt-6 border-t flex justify-between ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className={backBtnClass}
            >
              BACK
            </button>

            <button
              type="button"
              onClick={handleSubmitApplication}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all shadow-lg shadow-blue-600/30"
            >
              SUBMIT APPLICATION
            </button>
          </div>
        </div>
      )}
      </div>

      {/* Full Image Preview Modal */}
      {previewImageModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImageModal(null)}
        >
          <div 
            className={`max-w-3xl w-full rounded-2xl border p-4 sm:p-6 space-y-4 shadow-2xl relative ${
              darkMode ? 'bg-[#0b1329] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-3 border-slate-700/60">
              <h3 className="text-sm font-extrabold uppercase tracking-wide truncate max-w-md">
                {previewImageModal.title}
              </h3>
              <button 
                type="button" 
                onClick={() => setPreviewImageModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative max-h-[75vh] flex items-center justify-center overflow-hidden rounded-xl bg-black/40 border border-slate-800 p-2">
              <img 
                src={previewImageModal.url} 
                alt={previewImageModal.title} 
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-lg"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setPreviewImageModal(null)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera Capture Modal */}
      {activeCameraDocKey && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-2xl border p-6 space-y-4 shadow-2xl ${
            darkMode ? 'bg-[#0f1b35] border-blue-900/60 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-500" />
                Capture Document Photo
              </h3>
              <button type="button" onClick={closeCameraModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-4 border-2 border-dashed border-cyan-400/60 rounded-lg pointer-events-none" />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeCameraModal}
                className="flex-1 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCapturePhoto}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Take Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`max-w-lg w-full rounded-2xl border p-6 space-y-6 text-center shadow-2xl animate-in zoom-in-95 duration-200 ${
            darkMode ? 'bg-[#0f1b35] border-blue-900/60 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">Application Submitted Successfully!</h3>
              <p className={`text-xs mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Your PWD Social Assistance claim application has been filed and verified by QC Social Services.
              </p>
            </div>

            <div className={`p-4 rounded-xl border text-center ${
              darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">REFERENCE NUMBER</span>
              <span className="text-lg font-mono font-extrabold text-blue-600 dark:text-blue-400">{generatedRefNo}</span>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${generatedRefNo}`}
                alt="Claim QR Voucher"
                className="w-32 h-32 mx-auto mt-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white p-2"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  onBack();
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-lg"
              >
                Go to Application History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requirements Modal Overlay */}
      {showReqModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`max-w-xl w-full rounded-2xl border p-6 space-y-4 shadow-2xl ${
            darkMode ? 'bg-[#0f1b35] border-blue-900/60 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex justify-between items-center border-b pb-3 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className="text-sm font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                PWD Social Assistance Requirements
              </h3>
              <button type="button" onClick={() => setShowReqModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`space-y-3 text-xs max-h-96 overflow-y-auto pr-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              <p><strong>Primary Qualification:</strong> Duly registered Person with Disability (PWD) residing in Quezon City qualifying under specific vulnerability categories.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Valid Quezon City PWD ID Card</li>
                <li>Barangay Certificate of Indigency (issued within last 6 months)</li>
                <li>Medical Certificate or Social Case Study Report</li>
                <li>Valid Government Photo ID or Proof of Residency</li>
              </ul>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowReqModal(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Family Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`max-w-md w-full rounded-2xl border p-6 space-y-4 shadow-2xl ${
            darkMode ? 'bg-[#0f1b35] border-blue-900/60 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex justify-between items-center border-b pb-3 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className="text-sm font-extrabold text-blue-500 flex items-center gap-2">
                Add Family Member
              </h3>
              <button type="button" onClick={() => setShowAddMemberModal(false)} className="text-slate-400 hover:text-white">
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
                  placeholder="e.g. Maria Lee"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Relationship</label>
                  <input
                    type="text"
                    value={memRel}
                    onChange={(e) => setMemRel(e.target.value)}
                    placeholder="e.g. Child / Spouse"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Age</label>
                  <input
                    type="number"
                    value={memAge}
                    onChange={(e) => setMemAge(e.target.value)}
                    placeholder="e.g. 18"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Occupation / Status</label>
                <input
                  type="text"
                  value={memOcc}
                  onChange={(e) => setMemOcc(e.target.value)}
                  placeholder="e.g. Student / N/A"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className={backBtnClass}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddFamilyMember}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold shadow-md"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
