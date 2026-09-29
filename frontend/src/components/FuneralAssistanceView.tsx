import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  Upload, 
  ShieldCheck, 
  QrCode,
  Info,
  X,
  Cross,
  Camera,
  Pencil,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import type { ApplicationRecord } from '../types';

interface FuneralAssistanceViewProps {
  onBack: () => void;
  onAddApplication: (app: ApplicationRecord) => void;
  darkMode?: boolean;
}

// Utility to calculate age from Date of Birth and optional Date of Death string
const calculateDeceasedAge = (dobString: string, dodString?: string): string => {
  if (!dobString) return '';
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return '';

  const endDate = (dodString && dodString.trim() !== '') ? new Date(dodString) : new Date();
  if (isNaN(endDate.getTime())) return '';

  let calculatedAge = endDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = endDate.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birthDate.getDate())) {
    calculatedAge--;
  }
  return calculatedAge >= 0 ? String(calculatedAge) : '';
};

export const FuneralAssistanceView: React.FC<FuneralAssistanceViewProps> = ({
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

  // Step 1 Form States (Eligibility Questions)
  const [isDeceasedQCResident, setIsDeceasedQCResident] = useState<string>('Yes');
  const [relationToDeceased, setRelationToDeceased] = useState<string>(''); // 'Child' | 'Parent' | 'Sibling' | 'Spouse' | 'Others'
  const [selectedFuneralHome, setSelectedFuneralHome] = useState<string>('');
  const [showReqModal, setShowReqModal] = useState<boolean>(false);

  // Step 2 Form States - Applicant Information
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

  // Step 2 Form States - Deceased Information
  const [deceasedFirstName, setDeceasedFirstName] = useState<string>('');
  const [deceasedMiddleName, setDeceasedMiddleName] = useState<string>('');
  const [deceasedLastName, setDeceasedLastName] = useState<string>('');
  const [deceasedSuffix, setDeceasedSuffix] = useState<string>('');
  const [deceasedGender, setDeceasedGender] = useState<string>('');
  const [deceasedDob, setDeceasedDob] = useState<string>('');
  const [deceasedDateOfDeath, setDeceasedDateOfDeath] = useState<string>('');
  const [deceasedAge, setDeceasedAge] = useState<string>('');
  const [deceasedCremationOrBurial, setDeceasedCremationOrBurial] = useState<string>('');
  const [burialLocationSite, setBurialLocationSite] = useState<string>('');
  const [otherBurialLocation, setOtherBurialLocation] = useState<string>('');
  const [cremationLocationSite, setCremationLocationSite] = useState<string>('');
  const [otherCremationLocation, setOtherCremationLocation] = useState<string>('');
  const [deceasedPlaceOfDeath, setDeceasedPlaceOfDeath] = useState<string>('');
  const [deceasedDateOfBurial, setDeceasedDateOfBurial] = useState<string>('');

  const [sameAsApplicantAddress, setSameAsApplicantAddress] = useState<boolean>(false);
  const [deceasedHouseNo, setDeceasedHouseNo] = useState<string>('');
  const [deceasedStreet, setDeceasedStreet] = useState<string>('');
  const [deceasedBarangay, setDeceasedBarangay] = useState<string>('');

  // Auto-calculate applicant age from DOB
  React.useEffect(() => {
    if (dob) {
      const calcAge = calculateDeceasedAge(dob);
      if (calcAge) setAge(calcAge);
    }
  }, [dob]);

  // Auto-calculate deceased age from Date of Birth and Date of Death
  React.useEffect(() => {
    if (!deceasedDob && !deceasedDateOfDeath) {
      setDeceasedAge('');
      return;
    }
    const calcAge = calculateDeceasedAge(deceasedDob, deceasedDateOfDeath);
    setDeceasedAge(calcAge);
  }, [deceasedDob, deceasedDateOfDeath]);

  // Auto sync address when "Same as applicant's address" is checked
  React.useEffect(() => {
    if (sameAsApplicantAddress) {
      setDeceasedHouseNo(houseNo);
      setDeceasedStreet(street);
      setDeceasedBarangay(barangay);
    }
  }, [sameAsApplicantAddress, houseNo, street, barangay]);

  // Step 3 Form States
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File }>({});

  // Step 4 Form States
  const [isCertified, setIsCertified] = useState<boolean>(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Accredited Partner Funeral Homes List (matching screenshot 3)
  const funeralHomesList = [
    'Nieto Funeral Services',
    'St. Fiacre Funeral Service',
    'Vivs Funeral Homes',
    'Rizalde Funeral Services',
    'Kaagapay Mo Karamay Funeral Homes Co.',
    'Bonita Memorial Homes',
    'St. James Memorial Chapel',
    'Amber Green Funeral Services',
    'Dayao Funeral Home Incorporated',
    'La Funeraria Paz, Inc.',
    'Wyn Funeral Services',
    'St. Ignatius Funeral Homes Inc.',
    'Aijel Funeral Services',
    'A & J Biglang-awa Funeral Homes',
    'Precious JP Funeral Services',
    'D. Imperial Funeral Services',
    'Ka Andres Memorial Chapel',
    'Memory Funeral Service',
    'Cinco Estrellas Memorial Chapels Inc.',
    'Others'
  ];

  // Validation: Next button in Step 1 MUST only enable when relation and funeral home are selected!
  const isStep1Complete = Boolean(
    relationToDeceased !== '' && 
    selectedFuneralHome !== ''
  );

  // Camera Modal State & Handlers
  const [activeCameraKey, setActiveCameraKey] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const handleOpenCamera = async (key: string) => {
    setActiveCameraKey(key);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error", err);
      setCameraError("Camera access unavailable. Please use UPLOAD PHOTO to select an image.");
    }
  };

  const handleCloseCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setActiveCameraKey(null);
    setCameraError(null);
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current || !activeCameraKey) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `${activeCameraKey}_camera_photo.jpg`, { type: 'image/jpeg' });
          setUploadedFiles(prev => ({ ...prev, [activeCameraKey]: file }));
        }
        handleCloseCamera();
      }, 'image/jpeg', 0.9);
    }
  };

  const handleFileUpload = (reqKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFiles(prev => ({ ...prev, [reqKey]: file }));
    }
  };

  const handleRemoveFile = (reqKey: string) => {
    setUploadedFiles(prev => {
      const copy = { ...prev };
      delete copy[reqKey];
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRefNo = `QC-AICS-2026-FUN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: ApplicationRecord = {
      referenceNo: newRefNo,
      serviceName: `QC Funeral Assistance — Guarantee Letter (${selectedFuneralHome})`,
      category: 'AICS',
      dateSubmitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Under Review',
      amountOrType: 'P25,000 Guarantee Voucher / Funeral Aid',
      assignedSocialWorker: 'Social Worker Maria Santos, RSW (QC CSWDO)',
    };

    onAddApplication(newApp);
    setSubmittedRef(newRefNo);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Sub-Header Back Button */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all ${
            darkMode
              ? 'bg-[#182642] text-blue-400 border border-blue-500/30 hover:bg-[#203359] hover:text-blue-300'
              : 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to AICS Programs</span>
        </button>
      </div>

      {/* Main Container Card */}
      <div className={`rounded-2xl border shadow-2xl overflow-hidden ${
        darkMode ? 'bg-[#0b1426] border-slate-800' : 'bg-white border-slate-200 shadow-slate-200/50'
      }`}>
        
        {/* Banner Header - only show on Step 1 */}
        {currentStep === 1 && (
          <div className={`p-6 border-b flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
            darkMode ? 'bg-[#0f1b33] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className={`text-base sm:text-lg font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Requirements for Application of QC Funeral Assistance
                  </h2>
                  <span className="px-2.5 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono rounded-full font-semibold">
                    newApplication
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Official service for QC AICS Crisis Assistance.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowReqModal(true)}
              className="px-4 py-2 border border-blue-500/40 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5" />
              <span>View Requirements</span>
            </button>
          </div>
        )}

        {/* 4-Step Stepper Progress Header */}
        <div className={`p-6 border-b ${darkMode ? 'bg-[#0c162b] border-slate-800' : 'bg-slate-100/70 border-slate-200'}`}>
          {/* Step circles & progress line */}
          <div className="max-w-3xl mx-auto mb-6 relative">
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-700 -z-0">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />
            </div>

            <div className="flex justify-between items-center relative z-10">
              {[1, 2, 3, 4].map((stepNum) => {
                const isActive = currentStep === stepNum;
                const isPassed = currentStep > stepNum;
                return (
                  <button
                    key={stepNum}
                    type="button"
                    onClick={() => {
                      if (stepNum < currentStep || (stepNum === 2 && isStep1Complete)) {
                        setCurrentStep(stepNum);
                      }
                    }}
                    className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isPassed
                        ? 'bg-blue-900 text-blue-300 border border-blue-500/60'
                        : darkMode ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-slate-200 text-slate-600 border border-slate-300'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-4 h-4 text-blue-400" /> : stepNum}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stepper Tabs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center max-w-4xl mx-auto">
            {[
              { num: 1, label: 'COMPLETE CHECKLIST' },
              { num: 2, label: 'PERSONAL INFORMATION' },
              { num: 3, label: 'UPLOAD DOCUMENTS' },
              { num: 4, label: 'REVIEW & SUBMIT' },
            ].map((step) => {
              const isActive = currentStep === step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => {
                    if (step.num < currentStep || (step.num === 2 && isStep1Complete)) {
                      setCurrentStep(step.num);
                    }
                  }}
                  className={`py-3 px-2 rounded-xl text-[11px] font-extrabold tracking-wider transition-all border ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-400'
                      : darkMode
                      ? 'bg-[#101b33] text-slate-400 border-slate-800 hover:text-slate-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                  }`}
                >
                  {step.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6 sm:p-8">

          {/* SUCCESS SUBMITTED VIEW */}
          {submittedRef ? (
            <div className="text-center py-10 space-y-6 max-w-lg mx-auto">
              <div className="w-20 h-20 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white">Funeral Assistance Application Submitted!</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Your funeral assistance request for <strong className="text-blue-400">{`${deceasedFirstName} ${deceasedLastName}`.trim() || 'the deceased resident'}</strong> under partner funeral home <strong className="text-white">{selectedFuneralHome}</strong> has been transmitted to QC CSWDO.
                </p>
              </div>

              <div className="p-5 bg-slate-900/90 border border-slate-700/90 rounded-2xl space-y-2">
                <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">Official Guarantee Reference Control Number</span>
                <span className="text-2xl font-black font-mono text-amber-400 tracking-widest">{submittedRef}</span>
              </div>

              <div className="p-4 bg-blue-950/40 border border-blue-800/60 rounded-xl flex items-center gap-3 text-left">
                <QrCode className="w-10 h-10 text-blue-400 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-white block">Certificate of Guarantee Issued</span>
                  <span className="text-slate-300">Present this reference control voucher to {selectedFuneralHome} to cover service package up to Php 25,000.</span>
                </div>
              </div>

              <div className="flex gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl border border-blue-400/40"
                >
                  Return to Programs
                </button>
              </div>
            </div>
          ) : currentStep === 1 ? (
            /* STEP 1: COMPLETE CHECKLIST (MATCHING USER SCREENSHOTS 1, 2, 3) */
            <div className="space-y-6 max-w-3xl mx-auto">
              
              {/* Top Primary Requirements Notice Box */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                darkMode ? 'bg-[#0e1e3b] border-blue-900/60 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}>
                <Info className={`w-5 h-5 shrink-0 mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                    FUNERAL ASSISTANCE — PRIMARY REQUIREMENTS
                  </h4>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Complete the primary qualification questions below and prepare the required documents to proceed with your application.
                  </p>
                </div>
              </div>

              {/* ELIGIBILITY SECTION */}
              <div className="space-y-6 pt-2">
                <h3 className={`text-sm font-extrabold uppercase tracking-wider ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  ELIGIBILITY
                </h3>

                {/* Question 1: What is your relation to the deceased? */}
                <div className="space-y-2.5">
                  <label className={`text-xs font-bold block ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    What is your relation to the deceased? *
                  </label>
                  <div className="space-y-2">
                    {['Child', 'Parent', 'Sibling', 'Spouse', 'Others'].map((rel) => (
                      <label key={rel} className={`flex items-center gap-2 text-xs cursor-pointer ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        <input
                          type="radio"
                          name="relationDeceased"
                          value={rel}
                          checked={relationToDeceased === rel}
                          onChange={(e) => setRelationToDeceased(e.target.value)}
                          className={`w-4 h-4 text-blue-600 focus:ring-blue-500 ${
                            darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'
                          }`}
                        />
                        <span>{rel}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Question 2: Choose a Funeral Home Dropdown */}
                <div className="space-y-2">
                  <label className={`text-xs font-bold block ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    If you already have a funeral home, select which funeral home provided the service *
                  </label>
                  <select
                    value={selectedFuneralHome}
                    onChange={(e) => setSelectedFuneralHome(e.target.value)}
                    className={`w-full px-4 py-3.5 rounded-xl border text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      darkMode
                        ? 'bg-[#0f1c38] border-slate-700 text-white focus:border-blue-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500 shadow-sm'
                    }`}
                  >
                    <option value="">Choose a funeral home</option>
                    {funeralHomesList.map((home) => (
                      <option key={home} value={home}>
                        {home}
                      </option>
                    ))}
                  </select>
                  <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Please choose an accredited partner funeral home. If your chosen funeral home is not listed, select 'Others'.
                  </p>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className={`pt-6 border-t flex justify-end ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  type="button"
                  disabled={!isStep1Complete}
                  onClick={() => handleNextStep(2)}
                  className={`px-8 py-3 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all ${
                    isStep1Complete
                      ? 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-[1.02]'
                      : darkMode
                      ? 'bg-[#18243c] text-slate-500 cursor-not-allowed border border-slate-800'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  }`}
                >
                  NEXT
                </button>
              </div>
            </div>
          ) : currentStep === 2 ? (
            /* STEP 2: PERSONAL INFORMATION (Matching exact QCID Screenshots 1, 2 & 3) */
            <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
              
              {/* IMPORTANT REMINDER Box */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                darkMode ? 'bg-[#0e1d3d] border-blue-800/60 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}>
                <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300">
                    IMPORTANT REMINDER
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Please make sure the information on your QCID is correct and complete. If any detail is missing or incorrect, contact the QCID Team to update your QCID records before continuing your application. Accurate information is important for fast and smooth processing of your service.
                  </p>
                </div>
              </div>

              {/* APPLICANT INFORMATION GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div>
                  <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>First name *</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                      darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white placeholder-slate-500' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Middle name</label>
                  <input
                    type="text"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    placeholder="Middle name"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                      darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white placeholder-slate-500' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                    }`}
                  />
                </div>

                <div>
                  <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Last name *</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                      darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white placeholder-slate-500' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Suffix (Jr., Sr., III, etc.)</label>
                  <input
                    type="text"
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                    placeholder="Suffix (Jr., Sr., III, etc.)"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                      darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white placeholder-slate-500' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Nationality *</label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="FILIPINO"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                      darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white placeholder-slate-500' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                    }`}
                  />
                </div>

                <div>
                  <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Date of birth *</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                      darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-sm'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Age *</label>
                  <input
                    type="text"
                    value={age}
                    readOnly
                    placeholder="Auto-computed"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                      darkMode ? 'bg-[#0f1c38]/60 border border-slate-700 text-cyan-400 placeholder-slate-500' : 'bg-slate-100 border border-slate-300 text-blue-700 placeholder-slate-400 shadow-sm'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs ${
                      darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-sm'
                    }`}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Civil status *</label>
                  <select
                    value={civilStatus}
                    onChange={(e) => setCivilStatus(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs ${
                      darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-sm'
                    }`}
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>House/Building number *</label>
                  <input
                    type="text"
                    value={houseNo}
                    onChange={(e) => setHouseNo(e.target.value)}
                    placeholder="176"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                      darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white placeholder-slate-500' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Street name *</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="23"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                      darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white placeholder-slate-500' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                    }`}
                  />
                </div>

                <div>
                  <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Barangay *</label>
                  <input
                    type="text"
                    value={barangay}
                    onChange={(e) => setBarangay(e.target.value)}
                    placeholder="Bagong Silangan"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                      darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white placeholder-slate-500' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Phone number *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09155582122"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                      darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white placeholder-slate-500' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                    }`}
                  />
                </div>
              </div>

              {/* DECEASED INFORMATION SECTION (Matching Screenshot 3) */}
              <div className={`pt-6 border-t space-y-4 ${darkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
                <h3 className={`text-sm font-extrabold tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Deceased Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div>
                    <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>First name *</label>
                    <input
                      type="text"
                      value={deceasedFirstName}
                      onChange={(e) => setDeceasedFirstName(e.target.value)}
                      placeholder="First name"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                        darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white placeholder-slate-500' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Middle name</label>
                    <input
                      type="text"
                      value={deceasedMiddleName}
                      onChange={(e) => setDeceasedMiddleName(e.target.value)}
                      placeholder="Middle name"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                        darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white placeholder-slate-500' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Last name *</label>
                    <input
                      type="text"
                      value={deceasedLastName}
                      onChange={(e) => setDeceasedLastName(e.target.value)}
                      placeholder="Last name"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                        darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white placeholder-slate-500' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Suffix (Jr., Sr., III, etc.)</label>
                    <input
                      type="text"
                      value={deceasedSuffix}
                      onChange={(e) => setDeceasedSuffix(e.target.value)}
                      placeholder="Suffix (Jr., Sr., III, etc.)"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                        darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white placeholder-slate-500' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Gender *</label>
                    <select
                      value={deceasedGender}
                      onChange={(e) => setDeceasedGender(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl text-xs ${
                        darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-sm'
                      }`}
                    >
                      <option value="">Please choose</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Date of birth *</label>
                    <input
                      type="date"
                      value={deceasedDob}
                      onChange={(e) => setDeceasedDob(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                        darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-sm'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Date of death *</label>
                    <input
                      type="date"
                      value={deceasedDateOfDeath}
                      onChange={(e) => setDeceasedDateOfDeath(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                        darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-sm'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Age *</label>
                    <input
                      type="text"
                      value={deceasedAge}
                      readOnly
                      placeholder="Auto-computed from DOB & Death"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold select-none ${
                        darkMode 
                          ? 'bg-slate-900/60 border border-slate-700 text-cyan-400 placeholder-slate-500' 
                          : 'bg-slate-100 border border-slate-300 text-blue-700 placeholder-slate-400 shadow-sm'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Cremation or burial *</label>
                    <select
                      value={deceasedCremationOrBurial}
                      onChange={(e) => {
                        setDeceasedCremationOrBurial(e.target.value);
                        setBurialLocationSite('');
                        setOtherBurialLocation('');
                        setCremationLocationSite('');
                        setOtherCremationLocation('');
                      }}
                      className={`w-full px-3 py-2.5 rounded-xl text-xs ${
                        darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-sm'
                      }`}
                    >
                      <option value="">Please choose</option>
                      <option value="Burial">Burial</option>
                      <option value="Cremation">Cremation</option>
                    </select>
                  </div>

                  {/* Conditional Burial Site Fields */}
                  {deceasedCremationOrBurial === 'Burial' && (
                    <>
                      <div>
                        <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Where will it be buried *</label>
                        <select
                          value={burialLocationSite}
                          onChange={(e) => setBurialLocationSite(e.target.value)}
                          className={`w-full px-3 py-2.5 rounded-xl text-xs ${
                            darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-sm'
                          }`}
                        >
                          <option value="">Select burial site...</option>
                          <option value="Bagbag Public Cemetery">Bagbag Public Cemetery</option>
                          <option value="Novaliches Public Cemetery">Novaliches Public Cemetery</option>
                          <option value="Others (Specify)">Others (Specify)</option>
                        </select>
                      </div>

                      {burialLocationSite === 'Others (Specify)' && (
                        <div>
                          <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Specify the burial location *</label>
                          <input
                            type="text"
                            value={otherBurialLocation}
                            onChange={(e) => setOtherBurialLocation(e.target.value)}
                            placeholder="Name of cemetery/place"
                            className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                              darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white placeholder-slate-500' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                            }`}
                          />
                        </div>
                      )}
                    </>
                  )}

                  {/* Conditional Cremation Site Fields */}
                  {deceasedCremationOrBurial === 'Cremation' && (
                    <>
                      <div>
                        <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Where will it be cremated *</label>
                        <select
                          value={cremationLocationSite}
                          onChange={(e) => setCremationLocationSite(e.target.value)}
                          className={`w-full px-3 py-2.5 rounded-xl text-xs ${
                            darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-sm'
                          }`}
                        >
                          <option value="">Select cremation site...</option>
                          <option value="Baesa Crematorium">Baesa Crematorium</option>
                          <option value="Others (Specify)">Others (Specify)</option>
                        </select>
                      </div>

                      {cremationLocationSite === 'Others (Specify)' && (
                        <div>
                          <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Specify the cremation location *</label>
                          <input
                            type="text"
                            value={otherCremationLocation}
                            onChange={(e) => setOtherCremationLocation(e.target.value)}
                            placeholder="Name of crematorium/place"
                            className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                              darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white placeholder-slate-500' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                            }`}
                          />
                        </div>
                      )}
                    </>
                  )}

                  <div className="md:col-span-2">
                    <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Place of death *</label>
                    <input
                      type="text"
                      value={deceasedPlaceOfDeath}
                      onChange={(e) => setDeceasedPlaceOfDeath(e.target.value)}
                      placeholder="Place of death"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                        darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white placeholder-slate-500' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Date of burial</label>
                    <input
                      type="date"
                      value={deceasedDateOfBurial}
                      onChange={(e) => setDeceasedDateOfBurial(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                        darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white' : 'bg-white border border-slate-300 text-slate-900 shadow-sm'
                      }`}
                    />
                  </div>
                </div>

                {/* Same as Applicant Address Checkbox */}
                <div className="pt-2">
                  <label className={`flex items-center gap-2 cursor-pointer text-xs font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <input
                      type="checkbox"
                      checked={sameAsApplicantAddress}
                      onChange={(e) => setSameAsApplicantAddress(e.target.checked)}
                      className={`w-4 h-4 text-blue-600 rounded ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}
                    />
                    <span>Same as applicant's address</span>
                  </label>
                </div>

                {/* Deceased Address Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div>
                    <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>House/Building number *</label>
                    <input
                      type="text"
                      value={deceasedHouseNo}
                      onChange={(e) => setDeceasedHouseNo(e.target.value)}
                      placeholder="House/Building number"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                        darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white placeholder-slate-500' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Street name *</label>
                    <input
                      type="text"
                      value={deceasedStreet}
                      onChange={(e) => setDeceasedStreet(e.target.value)}
                      placeholder="Street name"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                        darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white placeholder-slate-500' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-bold block mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Barangay *</label>
                    <input
                      type="text"
                      value={deceasedBarangay}
                      onChange={(e) => setDeceasedBarangay(e.target.value)}
                      placeholder="Barangay"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs ${
                        darkMode ? 'bg-[#0f1c38] border border-slate-700 text-white placeholder-slate-500' : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Navigation Buttons */}
              <div className={`pt-6 border-t flex justify-between ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className={`px-6 py-3 rounded-xl font-extrabold text-xs uppercase border transition-all ${
                    darkMode ? 'bg-[#18243c] hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  BACK
                </button>
                <button
                  type="button"
                  onClick={() => handleNextStep(3)}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs tracking-wider rounded-xl uppercase transition-all"
                >
                  NEXT
                </button>
              </div>
            </div>
          ) : currentStep === 3 ? (
            /* STEP 3: UPLOAD DOCUMENTS */
            <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
              <div className="space-y-1 mb-6">
                <h3 className={`text-base sm:text-lg font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>File upload</h3>
                <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Make sure to upload the appropriate documents for each category and verify that all details—such as your full name (first, middle, and last name) and address—match the information on your QC ID.
                </p>
                <p className={`text-xs leading-relaxed mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Upload clear and legible copies of the required documents (JPG, JPEG, PNG, WEBP, or PDF).
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'referral_form', title: 'REFERRAL FORM MULA SA BARANGAY, HOSPITAL O FUNERAL *' },
                  { key: 'death_cert', title: 'CERTIFIED TRUE COPY NG DEATH CERTIFICATE *' },
                  { key: 'funeral_contract', title: 'NOTARIZED FUNERAL CONTRACT (ORIHINAL NA KOPYA; NAKATALA ANG MGA SERBISYO AT HALAGA) *' },
                  { key: 'indigency', title: 'CERTIFICATE OF INDIGENCY (ORIHINAL NA KOPYA; PARA SA FUNERAL/BURIAL ASSISTANCE) *' },
                  { key: 'government_id', title: 'ANUMANG BALIDONG GOVERNMENT ID (MAS MAINAM KUNG QC ID) *' },
                  { key: 'deceased_id', title: 'PHOTOCOPY NG BALIDONG ID NG NAMATAY, MAS MAINAM KUNG QCID *' },
                ].map((doc) => {
                  const uploaded = uploadedFiles[doc.key];
                  const previewUrl = uploaded ? URL.createObjectURL(uploaded) : null;
                  return (
                    <div
                      key={doc.key}
                      className={`p-5 rounded-2xl flex flex-col space-y-3 transition-all ${
                        uploaded
                          ? darkMode
                            ? 'bg-[#0d1c3a]/70 border-2 border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                            : 'bg-emerald-50/80 border-2 border-emerald-500/60 shadow-md shadow-emerald-100'
                          : darkMode
                          ? 'bg-[#0e1933]/50 border border-slate-800/80 hover:bg-[#0e1933]/70'
                          : 'bg-slate-50/70 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-extrabold tracking-wide block uppercase ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            {doc.title}
                          </span>
                          {uploaded && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20 shrink-0" />
                          )}
                        </div>
                        <span className={`text-[11px] block mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          Allowed file types: JPG, JPEG, PNG, WEBP (or capture using Camera)
                        </span>
                      </div>

                      {/* Always-visible action buttons */}
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <label className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold cursor-pointer inline-flex items-center gap-2 transition-all shadow-md">
                          <Upload className="w-4 h-4" />
                          <span>UPLOAD PHOTO</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(doc.key, e)}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => handleOpenCamera(doc.key)}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold cursor-pointer inline-flex items-center gap-2 transition-all shadow-md"
                        >
                          <Camera className="w-4 h-4" />
                          <span>TAKE PHOTO (CAMERA)</span>
                        </button>
                      </div>

                      {/* Uploaded Card Thumbnail Preview */}
                      {uploaded && previewUrl && (
                        <div className="pt-2">
                          <div className={`relative w-36 border rounded-2xl p-2.5 flex flex-col items-center shadow-xl group ${
                            darkMode ? 'bg-[#091124] border-slate-700/90' : 'bg-white border-slate-200'
                          }`}>
                            {/* Floating X Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(doc.key)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-slate-700 hover:bg-red-600 text-white rounded-full flex items-center justify-center border border-slate-600 shadow-md transition-all cursor-pointer z-10"
                              title="Remove photo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>

                            {/* Square Thumbnail Image */}
                            <div className={`w-20 h-20 rounded-xl overflow-hidden border shrink-0 ${
                              darkMode ? 'border-slate-700 bg-slate-950' : 'border-slate-200 bg-slate-100'
                            }`}>
                              <img
                                src={previewUrl}
                                alt={uploaded.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Truncated Filename */}
                            <span className={`text-[10px] font-bold text-center truncate max-w-full mt-2 block px-1 ${
                              darkMode ? 'text-slate-200' : 'text-slate-800'
                            }`}>
                              {uploaded.name}
                            </span>

                            {/* File Size */}
                            <span className={`text-[9px] font-mono block text-center mt-0.5 ${
                              darkMode ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              {(uploaded.size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Navigation Action Buttons */}
              <div className={`pt-6 border-t flex justify-between ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className={`px-6 py-3 rounded-xl font-extrabold text-xs uppercase border transition-all ${
                    darkMode ? 'bg-[#18243c] hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  BACK
                </button>
                <button
                  type="button"
                  onClick={() => handleNextStep(4)}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl uppercase"
                >
                  NEXT
                </button>
              </div>
            </div>
          ) : (
            /* STEP 4: REVIEW & SUBMIT */
            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
              <div className="space-y-1 mb-4">
                <h3 className={`text-base sm:text-lg font-extrabold tracking-wide uppercase ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  REVIEW YOUR APPLICATION
                </h3>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Please review all information carefully before submitting your application. You can edit any section by clicking the edit button.
                </p>
              </div>

              <div className="space-y-4">
                {/* 1. Requirements Section Card */}
                <div className={`border rounded-2xl overflow-hidden ${darkMode ? 'bg-[#0e1933]/60 border-slate-800' : 'bg-slate-50/80 border-slate-200 shadow-sm'}`}>
                  <div className={`p-4 flex items-center justify-between border-b ${darkMode ? 'bg-[#101c38] border-slate-800/80' : 'bg-slate-100 border-slate-200'}`}>
                    <div className="flex items-center gap-2">
                      <ChevronUp className={`w-4 h-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                      <h4 className={`text-sm font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Requirements</h4>
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
                  <div className="p-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className={`text-xs font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        Relation to Deceased: <span className={`font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{relationToDeceased || 'N/A'}</span>
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className={`text-xs font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        Chosen Funeral Home: <span className="text-amber-500 font-extrabold">{selectedFuneralHome || 'La Funeraria Paz, Inc.'}</span>
                      </span>
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
                    {/* Applicant Information Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
                      <div>
                        <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>FULL NAME</span>
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{firstName} {middleName} {lastName} {suffix}</span>
                      </div>
                      <div>
                        <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>NATIONALITY</span>
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{nationality || 'FILIPINO'}</span>
                      </div>
                      <div>
                        <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>DATE OF BIRTH</span>
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{dob || '2004-09-27'}</span>
                      </div>
                      <div>
                        <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>AGE</span>
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{age || '22'}</span>
                      </div>
                      <div>
                        <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>GENDER</span>
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{gender || 'Male'}</span>
                      </div>
                      <div>
                        <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>CIVIL STATUS</span>
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{civilStatus || 'Single'}</span>
                      </div>
                      <div>
                        <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>COMPLETE ADDRESS</span>
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{houseNo} {street} Brgy. {barangay} Quezon City</span>
                      </div>
                      <div>
                        <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>PHONE NUMBER</span>
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{phone || '09155582122'}</span>
                      </div>
                    </div>

                    {/* Deceased Information Sub-section */}
                    <div className={`pt-4 border-t space-y-4 ${darkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
                      <h5 className={`text-xs font-extrabold tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        Impormasyon ng Sumakabilang-Buhay (Deceased Details)
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
                        <div>
                          <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>RELASYON SA SUMAKABILANG-BUHAY</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{relationToDeceased || 'Child'}</span>
                        </div>
                        <div>
                          <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>FULL NAME</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{deceasedFirstName} {deceasedMiddleName} {deceasedLastName} {deceasedSuffix}</span>
                        </div>
                        <div>
                          <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>GENDER</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{deceasedGender || 'N/A'}</span>
                        </div>
                        <div>
                          <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>DATE OF BIRTH</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{deceasedDob || 'N/A'}</span>
                        </div>
                        <div>
                          <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>DATE OF DEATH</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{deceasedDateOfDeath || 'N/A'}</span>
                        </div>
                        <div>
                          <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>AGE</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{deceasedAge || 'N/A'}</span>
                        </div>
                        <div>
                          <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>CREMATION OR BURIAL</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{deceasedCremationOrBurial || 'N/A'}</span>
                        </div>
                        {deceasedCremationOrBurial === 'Burial' && (
                          <div>
                            <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>BURIAL LOCATION</span>
                            <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                              {burialLocationSite === 'Others (Specify)' ? otherBurialLocation : burialLocationSite || 'N/A'}
                            </span>
                          </div>
                        )}
                        {deceasedCremationOrBurial === 'Cremation' && (
                          <div>
                            <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>CREMATION LOCATION</span>
                            <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                              {cremationLocationSite === 'Others (Specify)' ? otherCremationLocation : cremationLocationSite || 'N/A'}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>PLACE OF DEATH</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{deceasedPlaceOfDeath || 'N/A'}</span>
                        </div>
                        <div>
                          <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>DATE OF BURIAL</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{deceasedDateOfBurial || 'N/A'}</span>
                        </div>
                        <div>
                          <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>COMPLETE ADDRESS</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{deceasedHouseNo} {deceasedStreet} Brgy. {deceasedBarangay} Quezon City</span>
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
                      onClick={() => setCurrentStep(3)}
                      className="text-xs font-extrabold text-blue-500 hover:text-blue-400 flex items-center gap-1.5 transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>EDIT</span>
                    </button>
                  </div>
                  <div className="p-5 space-y-4">
                    {[
                      { key: 'referral_form', title: 'REFERRAL FORM MULA SA BARANGAY, HOSPITAL O FUNERAL *' },
                      { key: 'death_cert', title: 'CERTIFIED TRUE COPY NG DEATH CERTIFICATE *' },
                      { key: 'funeral_contract', title: 'NOTARIZED FUNERAL CONTRACT (ORIHINAL NA KOPYA; NAKATALA ANG MGA SERBISYO AT HALAGA) *' },
                      { key: 'indigency', title: 'CERTIFICATE OF INDIGENCY (ORIHINAL NA KOPYA; PARA SA FUNERAL/BURIAL ASSISTANCE) *' },
                      { key: 'government_id', title: 'ANUMANG BALIDONG GOVERNMENT ID (MAS MAINAM KUNG QC ID) *' },
                      { key: 'deceased_id', title: 'PHOTOCOPY NG BALIDONG ID NG NAMATAY, MAS MAINAM KUNG QCID *' },
                    ].map((doc) => {
                      const file = uploadedFiles[doc.key];
                      const previewUrl = file ? URL.createObjectURL(file) : null;
                      return (
                        <div key={doc.key} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-extrabold uppercase tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                              {doc.title}
                            </span>
                            {file && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          </div>
                          {previewUrl ? (
                            <div className="pt-1">
                              <div className={`w-36 border rounded-2xl p-2.5 flex flex-col items-center shadow-lg ${
                                darkMode ? 'bg-[#091124] border-slate-700/90' : 'bg-white border-slate-200'
                              }`}>
                                <div className={`w-20 h-20 rounded-xl overflow-hidden border shrink-0 ${
                                  darkMode ? 'border-slate-700 bg-slate-950' : 'border-slate-200 bg-slate-100'
                                }`}>
                                  <img src={previewUrl} alt={file.name} className="w-full h-full object-cover" />
                                </div>
                                <span className={`text-[10px] font-bold text-center truncate max-w-full mt-2 block px-1 ${
                                  darkMode ? 'text-slate-200' : 'text-slate-800'
                                }`}>
                                  {file.name}
                                </span>
                                <span className={`text-[9px] font-mono block text-center mt-0.5 ${
                                  darkMode ? 'text-slate-400' : 'text-slate-500'
                                }`}>
                                  {(file.size / 1024).toFixed(1)} KB
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

              {/* Step Navigation Action Buttons */}
              <div className={`pt-6 border-t flex justify-between ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className={`px-6 py-3 rounded-xl font-extrabold text-xs uppercase border transition-all ${
                    darkMode ? 'bg-[#18243c] hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  BACK
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl hover:scale-[1.02] transition-all"
                >
                  SUBMIT APPLICATION
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* View Requirements Modal */}
      {showReqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className={`relative w-full max-w-lg border rounded-2xl p-6 shadow-2xl space-y-4 ${
            darkMode ? 'bg-[#0e172a] border-slate-700' : 'bg-white border-slate-200 shadow-xl'
          }`}>
            <div className={`flex justify-between items-center border-b pb-3 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <h3 className={`text-sm font-extrabold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                <FileText className="w-4 h-4 text-blue-500" />
                QC Funeral Assistance Guidelines & Requirements
              </h3>
              <button onClick={() => setShowReqModal(false)} className={`${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className={`space-y-3 text-xs max-h-[60vh] overflow-y-auto pr-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <p className="leading-relaxed">
                The Funeral and Burial Assistance Program under Ordinance 2865 S-2019 provides financial aid through a Certificate of Guarantee to accredited partner funeral homes, covering service packages up to Php 25,000.
              </p>
              <div className="space-y-2 pt-2">
                <span className={`font-bold uppercase tracking-wider block ${darkMode ? 'text-white' : 'text-slate-900'}`}>Standard Requirements:</span>
                <ul className={`list-disc list-inside space-y-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <li>Registered Death Certificate (Signed by City Civil Registrar or Physician)</li>
                  <li>Official Funeral Contract / Statement of Account from Funeral Home</li>
                  <li>Barangay Certificate of Indigency of Applicant</li>
                  <li>Valid Government Photo ID of Applicant</li>
                  <li>Proof of relationship to deceased (Birth/Marriage Certificate)</li>
                </ul>
              </div>
            </div>

            <div className={`pt-3 border-t flex justify-end ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <button
                type="button"
                onClick={() => setShowReqModal(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl"
              >
                Close Guidelines
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Camera Capture Modal */}
      {activeCameraKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#0e172a] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 text-center">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                Capture Document Photo
              </h3>
              <button type="button" onClick={handleCloseCamera} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {cameraError ? (
              <div className="p-6 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs space-y-3">
                <p>{cameraError}</p>
                <label className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-2 transition-all">
                  <Upload className="w-4 h-4" />
                  <span>Choose File from Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (activeCameraKey) {
                        handleFileUpload(activeCameraKey, e);
                        handleCloseCamera();
                      }
                    }}
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-xl bg-black border border-slate-800 aspect-video flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleCloseCamera}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold uppercase border border-slate-700"
                  >
                    CANCEL
                  </button>
                  <button
                    type="button"
                    onClick={handleCapturePhoto}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold uppercase inline-flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>CAPTURE PHOTO</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
