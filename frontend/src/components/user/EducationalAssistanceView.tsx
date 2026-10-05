import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  Upload, 
  ChevronRight, 
  ShieldCheck, 
  AlertCircle,
  GraduationCap,
  QrCode,
  Download,
  Info,
  X,
  Camera,
  Pencil,
  User,
  Users,
  ChevronUp,
  Eye
} from 'lucide-react';
import type { ApplicationRecord } from '../../types';

interface EducationalAssistanceViewProps {
  onBack: () => void;
  onAddApplication: (app: ApplicationRecord) => void;
  darkMode?: boolean;
  mode?: 'educational' | 'childwelfare' | 'soloparent';
}

// Utility to calculate age from Date of Birth string (YYYY-MM-DD or MM/DD/YYYY)
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

export const EducationalAssistanceView: React.FC<EducationalAssistanceViewProps> = ({
  onBack,
  onAddApplication,
  darkMode = true,
  mode = 'childwelfare',
}) => {
  // Stepper state (1: COMPLETE CHECKLIST, 2: APPLICATION FORM, 3: UPLOAD DOCUMENTS, 4: REVIEW & SUBMIT)
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

  // Step 1 Form States (Child Welfare, Educational & Solo Parent Assistance Checklist)
  const [reqResidentQC, setReqResidentQC] = useState<boolean>(false);
  const [reqEducational, setReqEducational] = useState<boolean>(false);
  const [reqEnrolled, setReqEnrolled] = useState<boolean>(false);
  const [selectedSector, setSelectedSector] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showReqModal, setShowReqModal] = useState<boolean>(false);

  // Solo Parent Specific Step 1 States
  const [soloParentIdNumber, setSoloParentIdNumber] = useState<string>('');
  const [isSoloParentIdVerified, setIsSoloParentIdVerified] = useState<boolean>(false);
  const [soloParentIdDetails, setSoloParentIdDetails] = useState<string>('');

  const isStep1Complete = mode === 'childwelfare'
    ? reqResidentQC && reqEducational && reqEnrolled && selectedSector.length > 0 && selectedServices.length > 0
    : mode === 'soloparent'
    ? reqResidentQC && reqEducational && reqEnrolled && isSoloParentIdVerified
    : reqResidentQC && reqEducational && reqEnrolled && selectedSector.length > 0;

  // Step 2 Form States - Applicant / Parent / Guardian Information (Prefilled & Disabled Verified Profile)
  const [applicantFirstName, setApplicantFirstName] = useState<string>('JEFFERSON');
  const [applicantMiddleName, setApplicantMiddleName] = useState<string>('FERNANDO');
  const [applicantLastName, setApplicantLastName] = useState<string>('LEE');
  const [applicantSuffix, setApplicantSuffix] = useState<string>('');
  const [applicantNationality, setApplicantNationality] = useState<string>('FILIPINO');
  const [applicantDob, setApplicantDob] = useState<string>('2004-09-27');
  const [applicantAge, setApplicantAge] = useState<string>('22');
  const [applicantGender, setApplicantGender] = useState<string>('Male');
  const [applicantCivilStatus, setApplicantCivilStatus] = useState<string>(mode === 'soloparent' ? 'Solo Parent' : 'Single');
  const [applicantHouseNo, setApplicantHouseNo] = useState<string>('176');
  const [applicantStreet, setApplicantStreet] = useState<string>('23');
  const [applicantBarangay, setApplicantBarangay] = useState<string>('Bagong Silangan');
  const [contactNumber, setContactNumber] = useState<string>('09155582122');
  const [emailAddress, setEmailAddress] = useState<string>('jeffersonlee1234@gmail.com');
  const [relationToChild, setRelationToChild] = useState<string>('Select Relationship');

  const applicantFullName = `${applicantFirstName} ${applicantMiddleName} ${applicantLastName}`.trim();
  const completeAddress = `${applicantHouseNo} ${applicantStreet}`.trim();

  // Step 2 Form States - Child / Beneficiary Information
  const [childFullName, setChildFullName] = useState<string>('');
  const [childDob, setChildDob] = useState<string>('');
  const [childAge, setChildAge] = useState<string>('');
  const [childSex, setChildSex] = useState<string>('Select Sex');
  const [schoolName, setSchoolName] = useState<string>('');
  const [gradeLevel, setGradeLevel] = useState<string>('');
  const [typeOfSchool, setTypeOfSchool] = useState<string>('Select Type of School');
  const [lrnNumber, setLrnNumber] = useState<string>('');
  const [otherEnrollmentInfo, setOtherEnrollmentInfo] = useState<string>('');

  // Step 2 Form States - Family Information
  const [numChildrenInFamily, setNumChildrenInFamily] = useState<string>('');
  const [numChildrenStudying, setNumChildrenStudying] = useState<string>('');
  const [monthlyIncome, setMonthlyIncome] = useState<string>('Select Monthly Income');
  const [is4psBeneficiary, setIs4psBeneficiary] = useState<string>('Select Option');
  const [isSoloParentBeneficiary, setIsSoloParentBeneficiary] = useState<string>(mode === 'soloparent' ? 'Yes' : 'Select Option');
  const [isPwdBeneficiary, setIsPwdBeneficiary] = useState<string>('Select Option');

  // Child Welfare Specific States (mode === 'childwelfare')
  const [qcitizenId, setQcitizenId] = useState<string>('110008262304143');
  const [childAddress, setChildAddress] = useState<string>('176 23, Bagong Silangan');
  const [concernDescription, setConcernDescription] = useState<string>('');
  const [incidentDate, setIncidentDate] = useState<string>('');
  const [incidentLocation, setIncidentLocation] = useState<string>('');

  // Auto-calculate applicant age from DOB
  useEffect(() => {
    if (applicantDob) {
      const calcAge = calculateAgeFromDob(applicantDob);
      if (calcAge) setApplicantAge(calcAge);
    }
  }, [applicantDob]);

  // Auto-calculate child age from DOB
  useEffect(() => {
    if (childDob) {
      const calcAge = calculateAgeFromDob(childDob);
      if (calcAge) setChildAge(calcAge);
    }
  }, [childDob]);

  const isStep2Complete =
    childFullName.trim() !== '' &&
    schoolName.trim() !== '';

  // Step 3 Document Upload States
  const [docIndigency, setDocIndigency] = useState<{ name: string; url?: string } | null>(null);
  const [docEnrollment, setDocEnrollment] = useState<{ name: string; url?: string } | null>(null);
  const [docSchoolId, setDocSchoolId] = useState<{ name: string; url?: string } | null>(null);
  const [docGovId, setDocGovId] = useState<{ name: string; url?: string } | null>(null);

  // Solo Parent Specific Document States (mode === 'soloparent')
  const [docQcitizenId, setDocQcitizenId] = useState<{ name: string; url?: string } | null>(null);
  const [docSoloParentId, setDocSoloParentId] = useState<{ name: string; url?: string } | null>(null);

  // Child Welfare Specific Documents (mode === 'childwelfare')
  const [docAvailable, setDocAvailable] = useState<{ name: string; url?: string } | null>(null);
  const [docReferral, setDocReferral] = useState<{ name: string; url?: string } | null>(null);
  const [docBirthCert, setDocBirthCert] = useState<{ name: string; url?: string } | null>(null);
  const [docMedicalPoliceBarangay, setDocMedicalPoliceBarangay] = useState<{ name: string; url?: string } | null>(null);

  const isStep3Complete = true;


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

    if (activeCameraDocKey === 'indigency') setDocIndigency(photoDoc);
    if (activeCameraDocKey === 'enrollment') setDocEnrollment(photoDoc);
    if (activeCameraDocKey === 'schoolId') setDocSchoolId(photoDoc);
    if (activeCameraDocKey === 'govId') setDocGovId(photoDoc);
    if (activeCameraDocKey === 'qcitizenId') setDocQcitizenId(photoDoc);
    if (activeCameraDocKey === 'soloParentId') setDocSoloParentId(photoDoc);

    if (activeCameraDocKey === 'available') setDocAvailable(photoDoc);
    if (activeCameraDocKey === 'referral') setDocReferral(photoDoc);
    if (activeCameraDocKey === 'birthCert') setDocBirthCert(photoDoc);
    if (activeCameraDocKey === 'medicalPoliceBarangay') setDocMedicalPoliceBarangay(photoDoc);

    closeCameraModal();
  };

  // Submit Application Handler
  const handleSubmitApplication = async () => {
    const newRef = mode === 'soloparent'
      ? `QC-SP-EDU-${Math.floor(100000 + Math.random() * 900000)}`
      : `QC-EDU-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedRefNo(newRef);

    const uploadedDocsObj: Record<string, { name: string; url?: string }> = {};
    if (docIndigency) uploadedDocsObj['indigency'] = docIndigency;
    if (docEnrollment) uploadedDocsObj['enrollment'] = docEnrollment;
    if (docQcitizenId) uploadedDocsObj['qcitizenId'] = docQcitizenId;
    if (docSoloParentId) uploadedDocsObj['soloParentId'] = docSoloParentId;
    if (docSchoolId) uploadedDocsObj['schoolId'] = docSchoolId;
    if (docGovId) uploadedDocsObj['govId'] = docGovId;

    const payload = {
      referenceNo: newRef,
      applicantName: `${applicantFirstName} ${applicantMiddleName} ${applicantLastName} ${applicantSuffix}`.trim(),
      firstName: applicantFirstName,
      middleName: applicantMiddleName,
      lastName: applicantLastName,
      suffix: applicantSuffix,
      nationality: applicantNationality,
      dob: applicantDob,
      age: applicantAge,
      gender: applicantGender,
      civilStatus: applicantCivilStatus,
      houseNo: applicantHouseNo,
      streetName: applicantStreet,
      barangay: applicantBarangay,
      phoneNumber: contactNumber,
      emailAddress,
      soloParentIdNo: soloParentIdNumber || 'SP-23123',
      relationshipToChild: relationToChild,
      childFullName,
      childDob,
      childAge,
      childSex,
      schoolName,
      gradeLevel,
      lrnNumber,
      typeOfSchool,
      otherEnrollmentInfo,
      numChildrenInFamily,
      numChildrenStudying,
      monthlyFamilyIncome: monthlyIncome,
      is4psBeneficiary,
      isSoloEducationalBeneficiary: isSoloParentBeneficiary,
      isPwdEducationalBeneficiary: isPwdBeneficiary,
      uploadedDocuments: uploadedDocsObj,
      status: 'Pending Document Validation',
      details: {
        applicantName: `${applicantFirstName} ${applicantMiddleName} ${applicantLastName}`.trim(),
        childFullName,
        schoolName,
        gradeLevel,
        monthlyIncome,
      }
    };

    try {
      await fetch('http://localhost:5000/api/educational/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn("Educational Assistance API post warning:", err);
    }

    const newAppRecord: ApplicationRecord = {
      referenceNo: newRef,
      serviceName: mode === 'soloparent'
        ? 'Solo Parent Educational Assistance Program'
        : mode === 'childwelfare'
        ? 'Child Welfare Services Aid'
        : 'AICS Educational Financial Aid - Children with Disability',
      category: mode === 'soloparent' ? 'Solo Parent Services' : 'AICS Assistance',
      dateSubmitted: `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`,
      status: 'Pending Document Validation',
      assignedSocialWorker: 'Maria Santos, RSW (QC Social Services)',
      amountOrType: mode === 'soloparent' ? '₱5,000 Solo Parent Educational Grant' : '₱5,000 Educational Grant',
      details: {
        applicantName: `${applicantFirstName} ${applicantMiddleName} ${applicantLastName}`.trim(),
        childFullName,
        schoolName,
        gradeLevel
      }
    };

    onAddApplication(newAppRecord);
    onBack();
  };


  // Shared Theme Styling Tokens for Crisp Contrast
  const cardClass = darkMode 
    ? 'bg-[#0f1b35] border-blue-900/40 text-white shadow-xl' 
    : 'bg-white border-slate-200 text-slate-900 shadow-md';

  const labelClass = darkMode 
    ? 'text-slate-300 font-semibold text-xs mb-1 block' 
    : 'text-slate-700 font-bold text-xs mb-1 block';

  const inputClass = darkMode 
    ? 'w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold border bg-slate-900/80 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none' 
    : 'w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold border bg-slate-50/80 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none shadow-sm';

  const bannerClass = darkMode 
    ? 'p-4 rounded-xl bg-blue-950/50 border border-blue-800/60 flex items-start gap-3' 
    : 'p-4 rounded-xl bg-blue-50/90 border border-blue-200 flex items-start gap-3 shadow-sm';

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
    : 'px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-extrabold tracking-wider uppercase border border-slate-300 transition-all shadow-sm';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header & Navigation */}
      <div className="space-y-4">
        <h1 className={`text-xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          {mode === 'soloparent'
            ? 'Solo Parent Educational Assistance Program'
            : mode === 'educational'
            ? 'Educational Assistance for Indigent Children & Youth'
            : 'Child Welfare Services'}
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
            <span>{mode === 'soloparent' ? 'BACK TO SOLO PARENT SERVICES' : 'BACK TO CHILD WELFARE SERVICES'}</span>
          </button>
        </div>
      </div>

      {/* SINGLE UNIFIED MAIN CONTAINER CARD FOR ALL CONTENT */}
      <div className={`rounded-2xl border overflow-hidden ${
        darkMode ? 'bg-[#0b1426] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
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
                <h2 className={`text-base sm:text-lg font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {mode === 'soloparent'
                    ? 'Solo Parent Educational Assistance — Primary Requirements'
                    : mode === 'educational'
                    ? 'Educational Assistance — Primary Requirements'
                    : 'Child Welfare Services — Primary Requirements'}
                </h2>
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Complete the primary qualification questions below and prepare the required documents to proceed with your application.
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
          {/* Step Numbers Line */}
          <div className="relative flex justify-between items-center max-w-3xl mx-auto mb-6">
            <div className={`absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 z-0 ${
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
                        ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-500/20'
                        : isPassed
                        ? 'bg-blue-600 text-white'
                        : darkMode
                        ? 'bg-slate-800 text-slate-500 border border-slate-700'
                        : 'bg-slate-100 text-slate-500 border border-slate-300'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-5 h-5 text-white" /> : stepNum}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Tab Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-4xl mx-auto">
            {[
              { step: 1, label: 'COMPLETE CHECKLIST' },
              { step: 2, label: 'APPLICATION FORM' },
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
                  className={`py-3 px-2 text-[11px] font-extrabold tracking-wider rounded-xl transition-all uppercase text-center border ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-500'
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

        {/* Step Body */}
        <div className="p-6 sm:p-8">

          {/* STEP 1: COMPLETE CHECKLIST */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {mode === 'soloparent' ? (
                <>
                  {/* SOLO PARENT SECTOR Banner */}
                  <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                    darkMode ? 'bg-blue-950/60 border-blue-800/80 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-900'
                  }`}>
                    <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-400 dark:text-blue-300">
                        SOLO PARENT SECTOR: Qualified beneficiaries may receive educational assistance.
                      </h3>
                      <p className="text-xs leading-relaxed font-medium">
                        For qualified children/beneficiaries of Solo Parents. Subject to eligibility verification, document validation, and assessment before approval.
                      </p>
                    </div>
                  </div>

                  {/* Qualification Checklist (FIRST) */}
                  <div>
                    <h2 className={`text-xs font-extrabold tracking-wider uppercase mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                      PRIMARY ELIGIBILITY CHECKLIST
                    </h2>
                    <div className={`p-4 rounded-xl border space-y-3 ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50/80 border-slate-200'}`}>
                      {[
                        {
                          id: 'resident',
                          state: reqResidentQC,
                          setState: setReqResidentQC,
                          text: 'Are you a legitimate resident of Quezon City holding a valid Solo Parent ID / Certification? *',
                        },
                        {
                          id: 'educational',
                          state: reqEducational,
                          setState: setReqEducational,
                          text: 'Are you applying for educational financial assistance for a qualified child / dependent beneficiary? *',
                        },
                        {
                          id: 'enrolled',
                          state: reqEnrolled,
                          setState: setReqEnrolled,
                          text: 'Is the child / beneficiary currently enrolled in school? *',
                        },
                      ].map((item) => (
                        <label key={item.id} className="flex items-center gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={item.state}
                            onChange={(e) => item.setState(e.target.checked)}
                            className="w-4 h-4 accent-blue-600 rounded cursor-pointer shrink-0"
                          />
                          <span className={`text-xs font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                            {item.text}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* FINANCIAL SUBSIDY & SOLO PARENT ID VERIFICATION (SECOND) */}
                  <div className={`p-5 rounded-2xl border space-y-4 ${
                    darkMode ? 'bg-[#0f1b35] border-blue-900/40' : 'bg-slate-50 border-slate-200 shadow-sm'
                  }`}>
                    <div className="flex items-center justify-between border-b pb-3 border-slate-800 dark:border-slate-800 border-slate-200">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-500 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-400" />
                        ITO SA FINANCIAL SUBSIDY
                      </h3>
                      {isSoloParentIdVerified && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> VERIFIED
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* SOLO PARENT ID NUMBER */}
                      <div>
                        <label className={labelClass}>SOLO PARENT ID NUMBER *</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3.5 top-2.5 text-xs font-bold text-blue-400 select-none">
                              SP-
                            </span>
                            <input
                              type="text"
                              value={soloParentIdNumber ? soloParentIdNumber.replace(/^SP-?\s*/i, '') : ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val) {
                                  setSoloParentIdNumber(`SP-${val}`);
                                } else {
                                  setSoloParentIdNumber('');
                                  setIsSoloParentIdVerified(false);
                                }
                                if (val.trim().length < 4) setIsSoloParentIdVerified(false);
                              }}
                              placeholder="2026-88192"
                              className={`${inputClass} pl-10`}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (soloParentIdNumber.trim().length > 3) {
                                setIsSoloParentIdVerified(true);
                                setSoloParentIdDetails(`${soloParentIdNumber} (QC Social Services Dept Registered Solo Parent)`);
                              }
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all border border-blue-400/30"
                          >
                            [VERIFY SOLO PARENT ID]
                          </button>
                        </div>
                      </div>

                      {/* SOLO PARENT STATUS */}
                      <div>
                        <label className={labelClass}>SOLO PARENT STATUS *</label>
                        <input
                          type="text"
                          readOnly
                          disabled
                          value={isSoloParentIdVerified ? 'VERIFIED - ACTIVE SOLO PARENT ID' : 'Auto-filled upon Solo Parent ID verification'}
                          className={`${inputClass} select-none cursor-not-allowed ${
                            isSoloParentIdVerified 
                              ? 'text-emerald-400 font-bold bg-emerald-950/30 border-emerald-800/60' 
                              : 'text-amber-400 font-bold bg-amber-950/30 border-amber-800/60'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h2 className={`text-xs font-extrabold tracking-wider uppercase mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                      SERVICE AND PRIMARY REQUIREMENTS
                    </h2>

                    <div className="space-y-4 py-1">
                      {[
                        {
                          id: 'resident',
                          state: reqResidentQC,
                          setState: setReqResidentQC,
                          text: 'Are you a legitimate resident of Quezon City? *',
                        },
                        {
                          id: 'educational',
                          state: reqEducational,
                          setState: setReqEducational,
                          text: mode === 'educational'
                            ? 'Are you applying for educational assistance for an indigent child or youth? *'
                            : 'Are you applying for welfare assistance for a child or youth? *',
                        },
                        {
                          id: 'enrolled',
                          state: reqEnrolled,
                          setState: setReqEnrolled,
                          text: mode === 'educational'
                            ? 'Is the beneficiary currently enrolled or in need of educational assistance? *'
                            : 'Is the beneficiary in need of child welfare support and social services? *',
                        },
                      ].map((item) => (
                        <label
                          key={item.id}
                          className="flex items-center gap-3 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={item.state}
                            onChange={(e) => item.setState(e.target.checked)}
                            className="w-4 h-4 accent-blue-600 rounded cursor-pointer shrink-0"
                          />
                          <span className={`text-xs font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                            {item.text}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* SECTOR */}
                  <div>
                    <h3 className={`text-xs font-extrabold tracking-wider uppercase mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                      SECTOR *
                    </h3>
                    <div className={`p-4 rounded-xl border space-y-3 ${
                      darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50/80 border-slate-200'
                    }`}>
                      {['Children & Youth', "Solo Parent's Child/Beneficiary", 'Child with Disability (CWD)'].map((sec) => (
                        <label
                          key={sec}
                          className="flex items-center gap-3 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSector.includes(sec)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSector((prev) => [...prev, sec]);
                              } else {
                                setSelectedSector((prev) => prev.filter((s) => s !== sec));
                              }
                            }}
                            className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                          />
                          <span className={`text-xs font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                            {sec}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* SERVICE REQUESTED (Child Welfare Only) */}
                  {mode === 'childwelfare' && (
                    <div>
                      <h3 className={`text-xs font-extrabold tracking-wider uppercase mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                        SERVICE REQUESTED <span className="text-[11px] font-normal text-slate-400">(Select all that apply)</span> *
                      </h3>
                      <div className={`p-4 rounded-xl border space-y-3 ${
                        darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50/80 border-slate-200'
                      }`}>
                        {['Child Protection', 'Alternative Child Care', 'Rehabilitative Counseling', 'Educational Financial Aid'].map((srv) => (
                          <label
                            key={srv}
                            className="flex items-center gap-3 cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              checked={selectedServices.includes(srv)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedServices((prev) => [...prev, srv]);
                                } else {
                                  setSelectedServices((prev) => prev.filter((s) => s !== srv));
                                }
                              }}
                              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                            />
                            <span className={`text-xs font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                              {srv}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  disabled={!isStep1Complete}
                  onClick={() => handleNextStep(2)}
                  className={`px-8 py-3 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all ${
                    isStep1Complete
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
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

      {/* STEP 2: APPLICATION FORM */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className={bannerClass}>
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <h3 className={bannerTitleClass}>
                {mode === 'educational' ? 'EDUCATIONAL ASSISTANCE FOR INDIGENT CHILDREN & YOUTH — APPLICATION FORM' : 'CHILD WELFARE SERVICES — APPLICATION FORM'}
              </h3>
              <p className={bannerTextClass}>
                Please complete the information for Applicant/Parent, Child Beneficiary, and Family. Fields marked with (*) are required.
              </p>
            </div>
          </div>

          {/* SECTION A: APPLICANT / PARENT / GUARDIAN INFORMATION */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              <h3 className={`text-xs font-extrabold tracking-wider uppercase ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                A. APPLICANT / PARENT / GUARDIAN INFORMATION (VERIFIED CITIZEN PROFILE - READ ONLY)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>First name *</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={applicantFirstName || 'JEFFERSON'}
                  className={`${inputClass} select-none cursor-not-allowed border-slate-700/50 opacity-90`}
                />
              </div>

              <div>
                <label className={labelClass}>Middle name</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={applicantMiddleName || 'FERNANDO'}
                  className={`${inputClass} select-none cursor-not-allowed border-slate-700/50 opacity-90`}
                />
              </div>

              <div>
                <label className={labelClass}>Last name *</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={applicantLastName || 'LEE'}
                  className={`${inputClass} select-none cursor-not-allowed border-slate-700/50 opacity-90`}
                />
              </div>

              <div>
                <label className={labelClass}>Suffix (Jr., Sr., III, etc.)</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  placeholder="Suffix (Jr., Sr., III, etc.)"
                  value={applicantSuffix}
                  className={`${inputClass} select-none cursor-not-allowed border-slate-700/50 opacity-90`}
                />
              </div>

              <div>
                <label className={labelClass}>Nationality *</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={applicantNationality || 'FILIPINO'}
                  className={`${inputClass} select-none cursor-not-allowed border-slate-700/50 opacity-90`}
                />
              </div>

              <div>
                <label className={labelClass}>Date of birth *</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value="27/09/2004"
                  className={`${inputClass} select-none cursor-not-allowed border-slate-700/50 opacity-90`}
                />
              </div>

              <div>
                <label className={labelClass}>Age *</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={applicantAge || '22'}
                  className={`${inputClass} select-none cursor-not-allowed border-slate-700/50 font-bold text-blue-400`}
                />
              </div>

              <div>
                <label className={labelClass}>Gender *</label>
                <select
                  disabled
                  value={applicantGender || 'Male'}
                  className={`${inputClass} select-none cursor-not-allowed border-slate-700/50 opacity-90`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Civil status *</label>
                <select
                  disabled
                  value={applicantCivilStatus || (mode === 'soloparent' ? 'Solo Parent' : 'Single')}
                  className={`${inputClass} select-none cursor-not-allowed border-slate-700/50 opacity-90`}
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                  <option value="Solo Parent">Solo Parent</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>House/Building number *</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={applicantHouseNo || '176'}
                  className={`${inputClass} select-none cursor-not-allowed border-slate-700/50 opacity-90`}
                />
              </div>

              <div>
                <label className={labelClass}>Street name *</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={applicantStreet || '23'}
                  className={`${inputClass} select-none cursor-not-allowed border-slate-700/50 opacity-90`}
                />
              </div>

              <div>
                <label className={labelClass}>Barangay *</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={applicantBarangay || 'Bagong Silangan'}
                  className={`${inputClass} select-none cursor-not-allowed border-slate-700/50 opacity-90`}
                />
              </div>

              <div>
                <label className={labelClass}>Phone number *</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={contactNumber || '09155582122'}
                  className={`${inputClass} select-none cursor-not-allowed border-slate-700/50 opacity-90`}
                />
              </div>

              <div>
                <label className={labelClass}>Email Address *</label>
                <input
                  type="email"
                  readOnly
                  disabled
                  value={emailAddress || 'jeffersonlee1234@gmail.com'}
                  className={`${inputClass} select-none cursor-not-allowed border-slate-700/50 opacity-90`}
                />
              </div>

              {mode === 'soloparent' && (
                <div>
                  <label className={labelClass}>Existing Solo Parent ID Number *</label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={soloParentIdNumber ? (soloParentIdNumber.startsWith('SP-') ? soloParentIdNumber : `SP-2026-${soloParentIdNumber}`) : 'SP-2026-88492'}
                    className={`${inputClass} select-none cursor-not-allowed border-slate-700/50 opacity-90 font-mono`}
                  />
                </div>
              )}

              {mode === 'childwelfare' && (
                <div>
                  <label className={labelClass}>QCitizen ID / Valid Government ID *</label>
                  <input
                    type="text"
                    value={qcitizenId}
                    onChange={(e) => setQcitizenId(e.target.value)}
                    placeholder="110008262304143"
                    className={inputClass}
                  />
                </div>
              )}
            </div>
          </div>

          {/* RELATIONSHIP TO CHILD / BENEFICIARY */}
          <div className={`pt-4 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <label className={labelClass}>Relationship to Child *</label>
            <select
              value={relationToChild}
              onChange={(e) => setRelationToChild(e.target.value)}
              className={`${inputClass} max-w-md`}
            >
              <option value="Select Relationship">Select Relationship</option>
              <option value="Parent">Parent</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Guardian">Guardian</option>
              <option value="Grandparent">Grandparent</option>
              <option value="Relative">Relative</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* SECTION B: CHILD INFORMATION */}
          <div className={`space-y-4 pt-6 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              <h3 className={`text-xs font-extrabold tracking-wider uppercase ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                {mode === 'childwelfare' ? 'B. CHILD INFORMATION' : 'B. CHILD / BENEFICIARY INFORMATION'}
              </h3>
            </div>

            {mode === 'childwelfare' ? (
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Child's Full Name *</label>
                  <input
                    type="text"
                    value={childFullName}
                    onChange={(e) => setChildFullName(e.target.value)}
                    placeholder="Enter Child's Full Name"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Date of Birth *</label>
                    <input
                      type="date"
                      value={childDob}
                      onChange={(e) => setChildDob(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Age *</label>
                    <input
                      type="text"
                      value={childAge}
                      readOnly
                      disabled
                      placeholder="Auto-computed"
                      className={`${inputClass} select-none cursor-not-allowed opacity-85`}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Sex *</label>
                    <select
                      value={childSex}
                      onChange={(e) => setChildSex(e.target.value)}
                      className={inputClass}
                    >
                      <option value="Select Sex">Select Sex</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Address *</label>
                    <input
                      type="text"
                      value={childAddress}
                      onChange={(e) => setChildAddress(e.target.value)}
                      placeholder="176 23"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>School, if applicable</label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="e.g. Quezon City Elementary School (Optional)"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input
                    type="text"
                    value={childFullName}
                    onChange={(e) => setChildFullName(e.target.value)}
                    placeholder="Enter Child's Full Name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Date of Birth *</label>
                  <input
                    type="date"
                    value={childDob}
                    onChange={(e) => setChildDob(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Age *</label>
                  <input
                    type="text"
                    value={childAge}
                    readOnly
                    disabled
                    placeholder="Auto-computed"
                    className={`${inputClass} select-none cursor-not-allowed opacity-85`}
                  />
                </div>

                <div>
                  <label className={labelClass}>Sex *</label>
                  <select
                    value={childSex}
                    onChange={(e) => setChildSex(e.target.value)}
                    className={inputClass}
                  >
                    <option value="Select Sex">Select Sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>School Name *</label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="Enter School Name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Grade Level *</label>
                  <input
                    type="text"
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    placeholder="e.g. Grade 5 / Grade 11"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Learner Reference Number (LRN)</label>
                  <input
                    type="text"
                    value={lrnNumber}
                    onChange={(e) => setLrnNumber(e.target.value)}
                    placeholder="12-digit LRN (Optional)"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Type of School *</label>
                  <select
                    value={typeOfSchool}
                    onChange={(e) => setTypeOfSchool(e.target.value)}
                    className={inputClass}
                  >
                    <option value="Select Type of School">Select Type of School</option>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                    <option value="ALS">ALS (Alternative Learning System)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Other Enrollment Information</label>
                  <input
                    type="text"
                    value={otherEnrollmentInfo}
                    onChange={(e) => setOtherEnrollmentInfo(e.target.value)}
                    placeholder="e.g. S.Y. 2026-2027 / Section / Track"
                    className={inputClass}
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION C: REASON FOR REQUEST OR FAMILY INFORMATION */}
          <div className={`space-y-4 pt-6 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              {mode === 'childwelfare' ? (
                <FileText className="w-4 h-4 text-blue-500" />
              ) : (
                <Users className="w-4 h-4 text-blue-500" />
              )}
              <h3 className={`text-xs font-extrabold tracking-wider uppercase ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                {mode === 'childwelfare' ? 'C. REASON FOR REQUEST' : 'C. FAMILY INFORMATION'}
              </h3>
            </div>

            {mode === 'childwelfare' ? (
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Description of concern/problem *</label>
                  <textarea
                    rows={4}
                    value={concernDescription}
                    onChange={(e) => setConcernDescription(e.target.value)}
                    placeholder="Please provide details regarding the child's situation, concern, or reason for requesting assistance / protection..."
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Date / approximate date of incident, if applicable</label>
                    <input
                      type="date"
                      value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Location of incident, if applicable</label>
                    <input
                      type="text"
                      value={incidentLocation}
                      onChange={(e) => setIncidentLocation(e.target.value)}
                      placeholder="e.g. Barangay / Street / Specific location (Optional)"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Number of Children in the Family *</label>
                    <input
                      type="number"
                      value={numChildrenInFamily}
                      onChange={(e) => setNumChildrenInFamily(e.target.value)}
                      placeholder="Enter number"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Number of Children Currently Studying *</label>
                    <input
                      type="number"
                      value={numChildrenStudying}
                      onChange={(e) => setNumChildrenStudying(e.target.value)}
                      placeholder="Enter number"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Monthly Family Income *</label>
                    <select
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      className={inputClass}
                    >
                      <option value="Select Monthly Income">Select Monthly Income</option>
                      <option value="Below ₱10,000">Below ₱10,000</option>
                      <option value="₱10,000 - ₱15,000">₱10,000 - ₱15,000</option>
                      <option value="₱15,001 - ₱25,000">₱15,001 - ₱25,000</option>
                      <option value="₱25,001 and above">₱25,001 and above</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className={labelClass}>4Ps Beneficiary? *</label>
                    <select
                      value={is4psBeneficiary}
                      onChange={(e) => setIs4psBeneficiary(e.target.value)}
                      className={inputClass}
                    >
                      <option value="Select Option">Select Option</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Solo Parent Educational Assistance Beneficiary? *</label>
                    <select
                      value={isSoloParentBeneficiary}
                      onChange={(e) => setIsSoloParentBeneficiary(e.target.value)}
                      className={inputClass}
                    >
                      <option value="Select Option">Select Option</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>PWD Educational Assistance Beneficiary? *</label>
                    <select
                      value={isPwdBeneficiary}
                      onChange={(e) => setIsPwdBeneficiary(e.target.value)}
                      className={inputClass}
                    >
                      <option value="Select Option">Select Option</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={backBtnClass}
            >
              BACK
            </button>

            <button
              type="button"
              disabled={!isStep2Complete}
              onClick={() => handleNextStep(3)}
              className={`px-8 py-2.5 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all ${
                isStep2Complete
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
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

      {/* STEP 3: UPLOAD DOCUMENTS */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className={`text-xl font-black tracking-tight mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              File upload
            </h2>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Make sure to upload the appropriate documents for each category and verify that all details—such as your full name (first, middle, and last name) and address—match the information on your QC ID.<br />
              Upload clear and legible copies of the required documents (JPG, JPEG, PNG, WEBP, or PDF).
            </p>
          </div>

          <div className="space-y-4">
            {(mode === 'childwelfare'
              ? [
                  { key: 'available', title: 'UPLOAD AVAILABLE DOCUMENTS *', doc: docAvailable, setDoc: setDocAvailable },
                  { key: 'referral', title: 'REFERRAL LETTER, IF APPLICABLE (OPTIONAL)', doc: docReferral, setDoc: setDocReferral },
                  { key: 'birthCert', title: 'BIRTH CERTIFICATE, IF AVAILABLE (OPTIONAL)', doc: docBirthCert, setDoc: setDocBirthCert },
                  { key: 'medicalPoliceBarangay', title: 'MEDICAL/POLICE/BARANGAY DOCUMENTS, IF APPLICABLE (OPTIONAL)', doc: docMedicalPoliceBarangay, setDoc: setDocMedicalPoliceBarangay },
                ]
              : mode === 'soloparent'
              ? [
                  { key: 'indigency', title: 'ORIGINAL BARANGAY CERTIFICATE OF INDIGENCY *', doc: docIndigency, setDoc: setDocIndigency },
                  { key: 'enrollment', title: 'CERTIFICATE OF ENROLLMENT *', doc: docEnrollment, setDoc: setDocEnrollment },
                  { key: 'qcitizenId', title: 'QCITIZEN ID *', doc: docQcitizenId, setDoc: setDocQcitizenId },
                  { key: 'soloParentId', title: 'SOLO PARENT ID / CERTIFICATION *', doc: docSoloParentId, setDoc: setDocSoloParentId },
                ]
              : [
                  { key: 'indigency', title: 'BARANGAY CERTIFICATE OF INDIGENCY – ORIGINAL (PURPOSE: EDUCATIONAL ASSISTANCE) *', doc: docIndigency, setDoc: setDocIndigency },
                  { key: 'enrollment', title: 'CERTIFICATE OF ENROLLMENT – ORIGINAL *', doc: docEnrollment, setDoc: setDocEnrollment },
                  { key: 'schoolId', title: 'RECENT SCHOOL ID – IF AVAILABLE (OPTIONAL)', doc: docSchoolId, setDoc: setDocSchoolId },
                  { key: 'govId', title: 'VALID GOVERNMENT ID / PREFERABLY QCITIZEN ID *', doc: docGovId, setDoc: setDocGovId },
                ]
            ).map((item) => {
              const uploaded = item.doc;
              return (
                <div
                  key={item.key}
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
                        {item.title}
                      </span>
                      {uploaded && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20 shrink-0" />
                      )}
                    </div>
                    <span className={`text-[11px] block mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Allowed file types: JPG, JPEG, PNG, WEBP (or capture using Camera)
                    </span>
                  </div>

                  {/* Always-visible action buttons matching Medical Assistance */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <label className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold cursor-pointer inline-flex items-center gap-2 transition-all shadow-md">
                      <Upload className="w-4 h-4" />
                      <span>UPLOAD PHOTO</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            item.setDoc({ name: file.name, url: URL.createObjectURL(file) });
                          }
                        }}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => openCameraModal(item.key)}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold cursor-pointer inline-flex items-center gap-2 transition-all shadow-md"
                    >
                      <Camera className="w-4 h-4" />
                      <span>TAKE PHOTO (CAMERA)</span>
                    </button>
                  </div>

                  {/* Uploaded Card Thumbnail Preview */}
                  {uploaded && (
                    <div className="pt-2">
                      <div 
                        className={`relative w-36 border rounded-2xl p-2.5 flex flex-col items-center shadow-xl group transition-all ${
                          darkMode ? 'bg-[#091124] border-slate-700/90' : 'bg-white border-slate-200'
                        }`}
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
                        <div className={`w-20 h-20 rounded-xl overflow-hidden border shrink-0 ${
                          darkMode ? 'border-slate-700 bg-slate-950' : 'border-slate-200 bg-slate-100'
                        }`}>
                          <img
                            src={uploaded.url || 'https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=500&auto=format&fit=crop&q=80'}
                            alt={uploaded.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>

                        {/* Truncated Filename */}
                        <span className={`text-[10px] font-bold text-center truncate max-w-full mt-2 block px-1 group-hover:text-blue-400 ${
                          darkMode ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          {uploaded.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={backBtnClass}
            >
              BACK
            </button>

            <button
              type="button"
              disabled={!isStep3Complete}
              onClick={() => handleNextStep(4)}
              className={`px-8 py-2.5 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all ${
                isStep3Complete
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
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

      {/* STEP 4: REVIEW & SUBMIT */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div>
            <h3 className={`text-xs font-extrabold tracking-wider uppercase mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              REVIEW YOUR APPLICATION
            </h3>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Please double check all submitted details before final submission.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="space-y-4">
            {/* Single Combined Card for Section A, B, and C */}
            <div className={`border rounded-2xl overflow-hidden transition-all ${
              darkMode ? 'bg-[#0e1933]/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'border-slate-800 bg-[#091124]' : 'border-slate-200 bg-slate-50'}`}>
                <h4 className="text-xs font-extrabold tracking-wide uppercase text-blue-500 dark:text-blue-400 flex items-center gap-2">
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                  Application & Beneficiary Details
                </h4>
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
                {/* Section A: Applicant Information */}
                <div>
                  <h5 className={`text-xs font-extrabold uppercase tracking-wider mb-3 pb-1 border-b ${darkMode ? 'text-blue-400 border-slate-800' : 'text-blue-600 border-slate-200'}`}>
                    A. APPLICANT INFORMATION
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-6 text-xs">
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>FIRST NAME</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{applicantFirstName || 'JEFFERSON'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>MIDDLE NAME</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{applicantMiddleName || 'FERNANDO'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>LAST NAME</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{applicantLastName || 'LEE'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>SUFFIX</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{applicantSuffix || 'N/A'}</span>
                    </div>
                    {mode === 'soloparent' && (
                      <div>
                        <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>SOLO PARENT ID DETAILS</span>
                        <span className={`font-bold text-emerald-400`}>{soloParentIdDetails || soloParentIdNumber}</span>
                      </div>
                    )}
                    {mode === 'childwelfare' && (
                      <div>
                        <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>QCITIZEN ID / VALID GOVT ID</span>
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{qcitizenId || 'N/A'}</span>
                      </div>
                    )}
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>NATIONALITY</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{applicantNationality || 'FILIPINO'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>DATE OF BIRTH</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{applicantDob || 'N/A'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>AGE / GENDER</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{applicantAge || '22'} yrs / {applicantGender || 'Male'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>CIVIL STATUS</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{applicantCivilStatus || 'Single'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>HOUSE / BUILDING NUMBER</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{applicantHouseNo || '176'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>STREET NAME</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{applicantStreet || '23'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>BARANGAY</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{applicantBarangay || 'Bagong Silangan'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>PHONE NUMBER</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{contactNumber || 'N/A'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>REGISTERED EMAIL ADDRESS</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{emailAddress || 'N/A'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>RELATION TO CHILD</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{relationToChild || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Section B: Child Information */}
                <div>
                  <h5 className={`text-xs font-extrabold uppercase tracking-wider mb-3 pb-1 border-b ${darkMode ? 'text-blue-400 border-slate-800' : 'text-blue-600 border-slate-200'}`}>
                    {mode === 'childwelfare' ? 'B. CHILD INFORMATION' : 'B. CHILD / BENEFICIARY INFORMATION'}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>CHILD FULL NAME</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{childFullName || 'N/A'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>DATE OF BIRTH</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{childDob || 'N/A'}</span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>AGE / SEX</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{childAge ? `${childAge} yrs` : 'N/A'} ({childSex})</span>
                    </div>
                    {mode === 'childwelfare' ? (
                      <>
                        <div>
                          <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>CHILD ADDRESS</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{childAddress || 'N/A'}</span>
                        </div>
                        <div>
                          <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>SCHOOL (IF APPLICABLE)</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{schoolName || 'N/A'}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>SCHOOL NAME</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{schoolName || 'N/A'} ({typeOfSchool})</span>
                        </div>
                        <div>
                          <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>GRADE LEVEL</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{gradeLevel || 'N/A'}</span>
                        </div>
                        <div>
                          <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>LEARNER REFERENCE NUMBER (LRN)</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{lrnNumber || 'N/A'}</span>
                        </div>
                        {otherEnrollmentInfo && (
                          <div>
                            <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>OTHER ENROLLMENT INFO</span>
                            <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{otherEnrollmentInfo}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Section C: Reason for Request / Family Information */}
                <div>
                  <h5 className={`text-xs font-extrabold uppercase tracking-wider mb-3 pb-1 border-b ${darkMode ? 'text-blue-400 border-slate-800' : 'text-blue-600 border-slate-200'}`}>
                    {mode === 'childwelfare' ? 'C. REASON FOR REQUEST' : 'C. FAMILY INFORMATION'}
                  </h5>
                  {mode === 'childwelfare' ? (
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>DESCRIPTION OF CONCERN / PROBLEM</span>
                        <p className={`font-medium leading-relaxed mt-0.5 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{concernDescription || 'N/A'}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                        <div>
                          <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>DATE OF INCIDENT</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{incidentDate || 'N/A'}</span>
                        </div>
                        <div>
                          <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>LOCATION OF INCIDENT</span>
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{incidentLocation || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
                      <div>
                        <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>CHILDREN IN FAMILY</span>
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{numChildrenInFamily || 'N/A'}</span>
                      </div>
                      <div>
                        <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>CHILDREN STUDYING</span>
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{numChildrenStudying || 'N/A'}</span>
                      </div>
                      <div>
                        <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>MONTHLY FAMILY INCOME</span>
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{monthlyIncome}</span>
                      </div>
                      <div>
                        <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>4PS / SOLO PARENT</span>
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{is4psBeneficiary} / {isSoloParentBeneficiary}</span>
                      </div>
                      <div>
                        <span className={`text-[10px] font-extrabold block uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>PWD BENEFICIARY</span>
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{isPwdBeneficiary}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section D: Required Documents Card */}
            <div className={`border rounded-2xl overflow-hidden transition-all ${
              darkMode ? 'bg-[#0e1933]/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'border-slate-800 bg-[#091124]' : 'border-slate-200 bg-slate-50'}`}>
                <h4 className="text-xs font-extrabold tracking-wide uppercase text-blue-500 dark:text-blue-400 flex items-center gap-2">
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                  Required documents
                </h4>
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
                {(mode === 'childwelfare'
                  ? [
                      { key: 'available', title: 'UPLOAD AVAILABLE DOCUMENTS *', doc: docAvailable },
                      { key: 'referral', title: 'REFERRAL LETTER, IF APPLICABLE (OPTIONAL)', doc: docReferral },
                      { key: 'birthCert', title: 'BIRTH CERTIFICATE, IF AVAILABLE (OPTIONAL)', doc: docBirthCert },
                      { key: 'medicalPoliceBarangay', title: 'MEDICAL/POLICE/BARANGAY DOCUMENTS, IF APPLICABLE (OPTIONAL)', doc: docMedicalPoliceBarangay },
                    ]
                  : mode === 'soloparent'
                  ? [
                      { key: 'indigency', title: 'ORIGINAL BARANGAY CERTIFICATE OF INDIGENCY *', doc: docIndigency },
                      { key: 'enrollment', title: 'CERTIFICATE OF ENROLLMENT *', doc: docEnrollment },
                      { key: 'qcitizenId', title: 'QCITIZEN ID *', doc: docQcitizenId },
                      { key: 'soloParentId', title: 'SOLO PARENT ID / CERTIFICATION *', doc: docSoloParentId },
                    ]
                  : [
                      { key: 'indigency', title: 'BARANGAY CERTIFICATE OF INDIGENCY – ORIGINAL (PURPOSE: EDUCATIONAL ASSISTANCE) *', doc: docIndigency },
                      { key: 'enrollment', title: 'CERTIFICATE OF ENROLLMENT – ORIGINAL *', doc: docEnrollment },
                      { key: 'schoolId', title: 'RECENT SCHOOL ID – IF AVAILABLE (OPTIONAL)', doc: docSchoolId },
                      { key: 'govId', title: 'VALID GOVERNMENT ID / PREFERABLY QCITIZEN ID *', doc: docGovId },
                    ]
                ).map((item) => (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-extrabold uppercase tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {item.title}
                      </span>
                      {item.doc && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </div>
                    {item.doc ? (
                      <div className="pt-1">
                        <div 
                          className={`w-36 border rounded-2xl p-2.5 flex flex-col items-center shadow-lg group transition-all ${
                            darkMode ? 'bg-[#091124] border-slate-700/90' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className={`w-20 h-20 rounded-xl overflow-hidden border shrink-0 ${
                            darkMode ? 'border-slate-700 bg-slate-950' : 'border-slate-200 bg-slate-100'
                          }`}>
                            <img src={item.doc.url || 'https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=500&auto=format&fit=crop&q=80'} alt={item.doc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
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
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
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
              className="px-8 py-3 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all bg-blue-600 hover:bg-blue-500 text-white"
            >
              SUBMIT
            </button>
          </div>
        </div>
      )}
        </div>
      </div>

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



      {/* Requirements Modal Overlay */}
      {showReqModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`max-w-xl w-full rounded-2xl border p-6 space-y-4 shadow-2xl ${
            darkMode ? 'bg-[#0f1b35] border-blue-900/60 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex justify-between items-center border-b pb-3 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className="text-sm font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                QC Educational Assistance Requirements
              </h3>
              <button type="button" onClick={() => setShowReqModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`space-y-3 text-xs max-h-96 overflow-y-auto pr-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              <p><strong>Primary Qualification:</strong> Indigent resident of Quezon City, registered Child with Disability (CWD) or student enrolled in SPED / Public School.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Barangay Certificate of Indigency (issued within last 6 months)</li>
                <li>Valid QC ID or PhilSys ID of Applicant</li>
                <li>Certificate of Enrollment / School Registration (SPED / Grade 10 & below)</li>
                <li>PWD ID or Medical Certificate of Disability</li>
                <li>Monthly Family Income Certificate of Php13,873 or below</li>
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


    </div>
  );
};
