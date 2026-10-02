import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  FileEdit, 
  Calendar, 
  Clock, 
  AlertCircle,
  MapPin,
  Coffee, 
  Monitor, 
  Scissors, 
  Sparkles, 
  Shirt, 
  Home, 
  Heart, 
  Flame, 
  Utensils, 
  ArrowRight,
  UserCheck,
  Lock,
  Upload,
  Camera,
  CheckCircle2,
  X,
  FileCheck,
  FileText,
  Printer,
  Download,
  ChevronRight,
  GraduationCap,
  Target,
  History,
  Search,
  Filter,
  Users,
  Building,
  Award,
  Info,
  ExternalLink
} from 'lucide-react';
import type { ApplicationRecord } from '../../types';

interface TrainingCourse {
  id: string;
  title: string;
  slots: string;
  duration: string;
  description: string;
  batch: string;
  opens: string;
  deadline: string;
  starts: string;
  icon: any;
}

interface TrainingProgramViewProps {
  onApplyCourse?: (courseTitle: string) => void;
  onAddApplication?: (app: ApplicationRecord) => void;
  darkMode?: boolean;
}

export const TrainingProgramView: React.FC<TrainingProgramViewProps> = ({ 
  onApplyCourse, 
  onAddApplication,
  darkMode = true 
}) => {
  // Navigation Tabs State (1: Available Training, 2: Apply for Training, 3: Schedule, 4: History)
  const [activeTab, setActiveTab] = useState<number>(1);

  // Application Step inside Tab 2 (1: Select Course, 2: Applicant Info, 3: Requirements & Review)
  const [applyStep, setApplyStep] = useState<number>(1);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState<string>('Bread and Pastry Making');

  // Step 2 Form States — Educational Background, Purpose, Experience
  const [highestEdu, setHighestEdu] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('Batasan Hills National High School');
  const [trainingPurpose, setTrainingPurpose] = useState<string>('');
  const [purposeReason, setPurposeReason] = useState<string>('To acquire TESDA National Certificate (NC II) for employment or small business.');
  const [previousTraining, setPreviousTraining] = useState<string>('');

  // Step 3 Document Upload States
  const [docIndigency, setDocIndigency] = useState<{ name: string; url?: string } | null>(null);
  const [docQcId, setDocQcId] = useState<{ name: string; url?: string } | null>(null);
  const [docPhotoId, setDocPhotoId] = useState<{ name: string; url?: string } | null>(null);
  // Sample Letter Modal State
  const [showSampleLetterModal, setShowSampleLetterModal] = useState<boolean>(false);

  // Camera Capture Modal State
  const [activeCameraDocKey, setActiveCameraDocKey] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Submission Success State
  const [submittedRecord, setSubmittedRecord] = useState<ApplicationRecord | null>(null);

  // Tab 3 Schedule Filter & Syllabus Modal State
  const [scheduleSearch, setScheduleSearch] = useState<string>('');
  const [scheduleVenueFilter, setScheduleVenueFilter] = useState<string>('All');
  const [selectedScheduleModal, setSelectedScheduleModal] = useState<any | null>(null);

  // Lock background body scroll when any modal is open
  useEffect(() => {
    const isAnyModalOpen = Boolean(showSampleLetterModal || activeCameraDocKey || selectedScheduleModal);
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSampleLetterModal, activeCameraDocKey, selectedScheduleModal]);

  const trainingCourses: TrainingCourse[] = [
    {
      id: 'bread-pastry',
      title: 'Bread and Pastry Making',
      slots: '25 slots',
      duration: '18 working days',
      description: 'Learn commercial bread and pastry production, baking techniques, measuring and mixing, pastry decorating, oven management, and food safety standards.',
      batch: '3rd Batch 2026',
      opens: 'July 1, 2026',
      deadline: 'July 15, 2026',
      starts: 'August 1 - 18, 2026',
      icon: Utensils
    },
    {
      id: 'barista',
      title: 'Barista',
      slots: '25 slots',
      duration: '18 working days',
      description: 'Master espresso extraction, milk steaming, latte art, coffee brewing methods, equipment maintenance, and coffee shop customer service.',
      batch: '3rd Batch 2026',
      opens: 'July 1, 2026',
      deadline: 'July 15, 2026',
      starts: 'August 1 - 18, 2026',
      icon: Coffee
    },
    {
      id: 'call-center',
      title: 'Basic Computer Literacy & Call Center Service',
      slots: '25 slots',
      duration: '18 working days',
      description: 'Practical training in computer operations, Microsoft Office tools, typing speed, English communication skills, call handling techniques, and BPO job...',
      batch: '3rd Batch 2026',
      opens: 'July 1, 2026',
      deadline: 'July 15, 2026',
      starts: 'August 1 - 18, 2026',
      icon: Monitor
    },
    {
      id: 'hairdressing',
      title: 'Hairdressing',
      slots: '25 slots',
      duration: '30 working days',
      description: 'Hands-on training in hair cutting, hair styling, hair coloring, blowdrying, hair rebonding/perming, and salon sanitation management.',
      batch: '3rd Batch 2026',
      opens: 'July 1, 2026',
      deadline: 'July 15, 2026',
      starts: 'August 1 - 30, 2026',
      icon: Scissors
    },
    {
      id: 'beauty-care',
      title: 'Beauty Care',
      slots: '25 slots',
      duration: '30 working days',
      description: 'Learn manicure, pedicure, nail art application, basic facial treatments, day/evening makeup, and home-service/salon business management.',
      batch: '3rd Batch 2026',
      opens: 'July 1, 2026',
      deadline: 'July 15, 2026',
      starts: 'August 1 - 30, 2026',
      icon: Sparkles
    },
    {
      id: 'dressmaking',
      title: 'Dressmaking / Sewing Craft',
      slots: '25 slots',
      duration: '30 working days',
      description: 'Learn body measurement, pattern drafting, fabric cutting, high-speed sewing machine operation, garment assembly, and sewing craft creation.',
      batch: '3rd Batch 2026',
      opens: 'July 1, 2026',
      deadline: 'July 15, 2026',
      starts: 'August 1 - 30, 2026',
      icon: Shirt
    },
    {
      id: 'housekeeping',
      title: 'Basic Housekeeping',
      slots: '25 slots',
      duration: '30 working days',
      description: 'Professional training in room cleaning, bed making, linen and laundry management, cleaning chemicals and sanitization, and hospitality guest...',
      batch: '3rd Batch 2026',
      opens: 'July 1, 2026',
      deadline: 'July 15, 2026',
      starts: 'August 1 - 30, 2026',
      icon: Home
    },
    {
      id: 'healthcare',
      title: 'Health Care Provider',
      slots: '25 slots',
      duration: '30 working days',
      description: 'Foundational caregiving skills, patient vital signs measurement, elderly care, personal hygiene assistance, patient mobility, first aid, and emergency care...',
      batch: '3rd Batch 2026',
      opens: 'July 1, 2026',
      deadline: 'July 15, 2026',
      starts: 'August 1 - 30, 2026',
      icon: Heart
    },
    {
      id: 'welding',
      title: 'Basic Welding',
      slots: '25 slots',
      duration: '30 working days',
      description: 'Fundamental Shielded Metal Arc Welding (SMAW), welding safety standards, metal cutting, joint preparation, welding positions, and metal fabrication.',
      batch: '3rd Batch 2026',
      opens: 'July 1, 2026',
      deadline: 'July 15, 2026',
      starts: 'August 1 - 30, 2026',
      icon: Flame
    },
    {
      id: 'catering',
      title: 'Food, Beverage & Catering Services',
      slots: '25 slots',
      duration: '30 working days',
      description: 'Comprehensive training in food dining service, table setting, banquet catering operations, food safety standards, bar service, and catering event...',
      batch: '3rd Batch 2026',
      opens: 'July 1, 2026',
      deadline: 'July 15, 2026',
      starts: 'August 1 - 30, 2026',
      icon: Utensils
    }
  ];

  const handleStartApply = (courseTitle: string) => {
    setSelectedCourseTitle(courseTitle);
    setActiveTab(2);
    setApplyStep(2);
  };

  // Camera Functions
  const openCameraModal = async (docKey: string) => {
    setActiveCameraDocKey(docKey);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera unavailable, simulating capture mode", err);
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
    if (activeCameraDocKey === 'qcid') setDocQcId(photoDoc);
    if (activeCameraDocKey === 'photoId') setDocPhotoId(photoDoc);

    closeCameraModal();
  };

  const handleFinalSubmit = () => {
    const refNo = `TRN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newApp: ApplicationRecord = {
      referenceNo: refNo,
      serviceName: `Skills Training Program — ${selectedCourseTitle}`,
      category: 'Livelihood & Training',
      dateSubmitted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Under Review',
      assignedSocialWorker: 'QC Vocational Training Center (SSD Dept)',
      amountOrType: 'TESDA Accredited Training Grant',
      details: {
        applicantName: 'JEFFERSON FERNANDO LEE',
        courseTitle: selectedCourseTitle,
        highestEdu,
        trainingPurpose,
        barangay: 'Bagong Silangan',
      }
    };

    if (onAddApplication) {
      onAddApplication(newApp);
    }
    setSubmittedRecord(newApp);
    setActiveTab(3);
  };

  const labelClass = `text-[10px] font-extrabold uppercase tracking-wider block mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`;
  const readOnlyBoxClass = `w-full px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center justify-between ${
    darkMode 
      ? 'bg-slate-900/80 border-slate-800 text-slate-200' 
      : 'bg-slate-100 border-slate-300 text-slate-800'
  }`;

  return (
    <div className="space-y-6">
      {/* Top Stepper Tabs Bar */}
      <div className={`flex flex-wrap gap-2 p-1.5 rounded-2xl border ${
        darkMode ? 'bg-[#0c1529] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <button
          type="button"
          onClick={() => setActiveTab(1)}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 1
              ? 'bg-blue-600 text-white shadow-md'
              : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>1. AVAILABLE TRAINING</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab(2);
            if (applyStep === 1) setApplyStep(2);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 2
              ? 'bg-blue-600 text-white shadow-md'
              : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileEdit className="w-3.5 h-3.5" />
          <span>2. APPLY FOR TRAINING</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab(3)}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 3
              ? 'bg-blue-600 text-white shadow-md'
              : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>3. TRAINING SCHEDULE</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: AVAILABLE TRAINING PROGRAMS GRID                                    */}
      {/* ========================================================================= */}
      {activeTab === 1 && (
        <div className="space-y-6">
          {/* Sub-header Title Row */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className={`text-lg font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Available Training Programs</h3>
              <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Choose a training program suited to your interest and schedule before applying.
              </p>
            </div>

            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
              darkMode 
                ? 'text-blue-300 bg-blue-950/80 border-blue-800' 
                : 'text-blue-700 bg-blue-50 border-blue-200'
            }`}>
              10 Open Programs
            </span>
          </div>

          {/* Training Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {trainingCourses.map((course) => {
              const Icon = course.icon;
              return (
                <div
                  key={course.id}
                  className={`rounded-2xl border p-5 shadow-xl transition-all flex flex-col justify-between space-y-4 group ${
                    darkMode 
                      ? 'bg-[#0e1930] border-slate-800/80 hover:border-blue-500/40' 
                      : 'bg-white border-slate-200 hover:border-blue-400 shadow-slate-200/50'
                  }`}
                >
                  <div>
                    {/* Header Row */}
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                          darkMode ? 'bg-blue-600/10 border-blue-500/30 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-600'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className={`text-base font-extrabold transition-colors ${
                            darkMode ? 'text-white group-hover:text-blue-300' : 'text-slate-900 group-hover:text-blue-600'
                          }`}>
                            {course.title}
                          </h4>
                          <span className={`text-[11px] font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {course.duration}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold border px-2.5 py-0.5 rounded-full shrink-0 ${
                        darkMode 
                          ? 'text-emerald-400 bg-emerald-950/60 border-emerald-700/50' 
                          : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      }`}>
                        {course.slots}
                      </span>
                    </div>

                    {/* Description */}
                    <p className={`text-xs leading-relaxed line-clamp-3 mb-4 ${
                      darkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {course.description}
                    </p>

                    {/* Metadata List */}
                    <div className={`space-y-2 text-xs p-3 rounded-xl border ${
                      darkMode ? 'bg-slate-900/60 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>Training Batch:</span>
                        <span>{course.batch}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className={`font-semibold ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Application Opens:</span>
                        <span>{course.opens}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className={`font-semibold ${darkMode ? 'text-amber-400' : 'text-amber-700'}`}>Application Deadline:</span>
                        <span>{course.deadline}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                        <span className={`font-semibold ${darkMode ? 'text-rose-400' : 'text-rose-700'}`}>Training Starts:</span>
                        <span>{course.starts}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleStartApply(course.title)}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-colors ${
                        darkMode 
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartApply(course.title)}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 border border-blue-400/40 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: APPLY FOR TRAINING (3-STEP APPLICATION WORKFLOW)                    */}
      {/* ========================================================================= */}
      {activeTab === 2 && (
        <div className={`max-w-4xl mx-auto rounded-3xl border p-6 sm:p-7 space-y-6 ${
          darkMode ? 'bg-[#0d162a] border-slate-800' : 'bg-white border-slate-200 shadow-xl'
        }`}>
          {/* Header Title Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-800">
            <div>
              <h2 className={`text-xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Apply for Training Program
              </h2>
              <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Complete applicant details and requirements for skills training.
              </p>
            </div>

            <div className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 ${
              darkMode ? 'bg-blue-950/60 border-blue-800 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}>
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Course: <strong>{selectedCourseTitle}</strong></span>
            </div>
          </div>

          {/* Step Buttons Indicator (Course -> Applicant Info -> Requirements) */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab(1)}
              className="px-4 py-2 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-600/30 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Course ({selectedCourseTitle})</span>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-600" />

            <button
              type="button"
              onClick={() => setApplyStep(2)}
              className={`px-5 py-2 rounded-full text-xs font-extrabold flex items-center gap-2 transition-all ${
                applyStep === 2
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:text-white'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 text-white text-[10px] flex items-center justify-center font-bold">2</span>
              <span>Applicant Info</span>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-600" />

            <button
              type="button"
              onClick={() => setApplyStep(3)}
              className={`px-5 py-2 rounded-full text-xs font-extrabold flex items-center gap-2 transition-all ${
                applyStep === 3
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:text-white'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 text-white text-[10px] flex items-center justify-center font-bold">3</span>
              <span>Requirements</span>
            </button>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* APPLY STEP 2: APPLICANT INFO & BACKGROUND FORM                          */}
          {/* ----------------------------------------------------------------------- */}
          {applyStep === 2 && (
            <div className="space-y-6 pt-2">
              {/* SECTION 1: APPLICANT INFORMATION (DISABLED / READ-ONLY) */}
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-400" />
                    <h3 className={`text-xs font-black tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      APPLICANT INFORMATION
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className={`text-[11px] font-extrabold block mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Full Name
                    </label>
                    <div className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border truncate ${
                      darkMode ? 'bg-[#131f37] border-slate-800/90 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                    }`}>
                      JEFFERSON FERNANDO LEE
                    </div>
                  </div>

                  <div>
                    <label className={`text-[11px] font-extrabold block mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Date of Birth
                    </label>
                    <div className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border truncate ${
                      darkMode ? 'bg-[#131f37] border-slate-800/90 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                    }`}>
                      SEPTEMBER 27, 2004
                    </div>
                  </div>

                  <div>
                    <label className={`text-[11px] font-extrabold block mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Age
                    </label>
                    <div className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border truncate ${
                      darkMode ? 'bg-[#131f37] border-slate-800/90 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                    }`}>
                      22 y/o
                    </div>
                  </div>

                  <div>
                    <label className={`text-[11px] font-extrabold block mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Sex
                    </label>
                    <div className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border truncate ${
                      darkMode ? 'bg-[#131f37] border-slate-800/90 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                    }`}>
                      Male
                    </div>
                  </div>

                  <div>
                    <label className={`text-[11px] font-extrabold block mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Civil Status
                    </label>
                    <div className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border truncate ${
                      darkMode ? 'bg-[#131f37] border-slate-800/90 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                    }`}>
                      Single
                    </div>
                  </div>

                  <div>
                    <label className={`text-[11px] font-extrabold block mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Contact Number
                    </label>
                    <div className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border truncate ${
                      darkMode ? 'bg-[#131f37] border-slate-800/90 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                    }`}>
                      09155582122
                    </div>
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label className={`text-[11px] font-extrabold block mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Email Address
                    </label>
                    <div className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border truncate ${
                      darkMode ? 'bg-[#131f37] border-slate-800/90 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                    }`}>
                      jeffersonlee1234@gmail.com
                    </div>
                  </div>

                  <div>
                    <label className={`text-[11px] font-extrabold block mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Barangay
                    </label>
                    <div className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border truncate ${
                      darkMode ? 'bg-[#131f37] border-slate-800/90 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                    }`}>
                      Bagong Silangan
                    </div>
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label className={`text-[11px] font-extrabold block mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Complete Address
                    </label>
                    <div className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border truncate ${
                      darkMode ? 'bg-[#131f37] border-slate-800/90 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                    }`}>
                      176, 23, Brgy. Bagong Silangan, Quezon City
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: EDUCATIONAL BACKGROUND */}
              <div className="pt-4 border-t border-slate-800/80 space-y-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                  <h3 className={`text-xs font-black tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    EDUCATIONAL BACKGROUND
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-slate-400 block">HIGHEST EDUCATIONAL ATTAINMENT *</label>
                    <select
                      value={highestEdu}
                      onChange={(e) => setHighestEdu(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border focus:border-blue-500 focus:outline-none ${
                        darkMode ? 'bg-[#131f37] border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="">Select Option</option>
                      <option value="Elementary Level">Elementary Level</option>
                      <option value="Elementary Graduate">Elementary Graduate</option>
                      <option value="High School Level">High School Level</option>
                      <option value="High School Graduate">High School Graduate</option>
                      <option value="Senior High School">Senior High School</option>
                      <option value="College Level">College Level</option>
                      <option value="College Graduate">College Graduate</option>
                      <option value="Vocational / Technical">Vocational / Technical</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-slate-400 block">SCHOOL / INSTITUTION</label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="e.g. Batasan Hills National High School"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border focus:border-blue-500 focus:outline-none ${
                        darkMode ? 'bg-[#131f37] border-slate-800 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: TRAINING PURPOSE */}
              <div className="pt-4 border-t border-slate-800/80 space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  <h3 className={`text-xs font-black tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    TRAINING PURPOSE
                  </h3>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-slate-400 block">WHY ARE YOU APPLYING FOR THE TRAINING? *</label>
                    <select
                      value={trainingPurpose}
                      onChange={(e) => setTrainingPurpose(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border focus:border-blue-500 focus:outline-none ${
                        darkMode ? 'bg-[#131f37] border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="">Select Option</option>
                      <option value="Skills Development">Skills Development</option>
                      <option value="Employment / Job Application">Employment / Job Application</option>
                      <option value="Business / Livelihood Setup">Business / Livelihood Setup</option>
                      <option value="Career Shift / Promotion">Career Shift / Promotion</option>
                      <option value="Personal Interest / Hobby">Personal Interest / Hobby</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-slate-400 block">BRIEFLY STATE YOUR REASON FOR APPLYING:</label>
                    <textarea
                      rows={3}
                      value={purposeReason}
                      onChange={(e) => setPurposeReason(e.target.value)}
                      placeholder="Provide brief details about your motivation or livelihood plans..."
                      className={`w-full p-3.5 rounded-xl text-xs font-bold border focus:border-blue-500 focus:outline-none ${
                        darkMode ? 'bg-[#131f37] border-slate-800 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: PREVIOUS TRAINING / EXPERIENCE */}
              <div className="pt-4 border-t border-slate-800/80 space-y-4">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-400" />
                  <h3 className={`text-xs font-black tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    PREVIOUS TRAINING / EXPERIENCE
                  </h3>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="text-[11px] font-extrabold text-slate-400 block">HAVE YOU ATTENDED A SIMILAR SKILLS TRAINING BEFORE? *</label>
                  <select
                    value={previousTraining}
                    onChange={(e) => setPreviousTraining(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold border focus:border-blue-500 focus:outline-none ${
                      darkMode ? 'bg-[#131f37] border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="">Select Option</option>
                    <option value="No">No</option>
                    <option value="Yes - TESDA Accredited Course">Yes - TESDA Accredited Course</option>
                    <option value="Yes - LGU / Barangay Training">Yes - LGU / Barangay Training</option>
                    <option value="Yes - Private Seminar / Workshop">Yes - Private Seminar / Workshop</option>
                  </select>
                </div>
              </div>

              {/* Bottom Nav Action Bar */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setApplyStep(1)}
                  className={`px-6 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    darkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => setApplyStep(3)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* APPLY STEP 3: DOCUMENTARY REQUIREMENTS & FINAL SUBMIT                     */}
          {/* ----------------------------------------------------------------------- */}
          {applyStep === 3 && (
            <div className="space-y-6 pt-2">
              {/* Header Title Row */}
              <div className="pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-blue-400" />
                  <h3 className={`text-xs font-black tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    IV. REQUIREMENTS / SUPPORTING DOCUMENTS
                  </h3>
                </div>
              </div>

              {/* Upload Items List */}
              <div className="space-y-4">
                {[
                  {
                    key: 'requestLetter',
                    title: 'REQUEST LETTER *',
                    desc: 'Attached formal request letter addressed to SSDD / City Mayor.',
                    doc: docIndigency,
                    setDoc: setDocIndigency,
                  },
                  {
                    key: 'qcIdResidency',
                    title: 'QC ID / PROOF OF QC RESIDENCY *',
                    desc: 'Clear photo of your QCitizen ID, Barangay Certificate of Residency, or Valid ID (front and back).',
                    doc: docQcId,
                    setDoc: setDocQcId,
                  },
                  {
                    key: 'indigencyBarangay',
                    title: 'INDIGENCY OF BARANGAY (OPTIONAL)',
                    desc: 'Barangay Certificate of Indigency (optional supporting document).',
                    doc: docPhotoId,
                    setDoc: setDocPhotoId,
                  },
                ].map((item) => {
                  const uploaded = item.doc;
                  return (
                    <React.Fragment key={item.key}>
                      {item.key === 'requestLetter' && (
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <button
                            type="button"
                            onClick={() => setShowSampleLetterModal(true)}
                            className="px-3.5 py-1.5 bg-blue-950/80 hover:bg-blue-900 text-blue-400 border border-blue-800 text-[11px] font-bold rounded-xl inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                            title="Click to view Sample Letter of Intent"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>SAMPLE DOCUMENT</span>
                          </button>
                        </div>
                      )}

                      <div
                        className={`p-5 rounded-2xl border space-y-3 transition-all ${
                          uploaded
                            ? darkMode
                              ? 'bg-[#0d1c3a]/70 border-2 border-emerald-500/50 shadow-lg'
                              : 'bg-emerald-50/80 border-2 border-emerald-500/60 shadow-md'
                            : darkMode
                            ? 'bg-[#0b1326] border-slate-800/80'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-black tracking-wide uppercase ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                              {item.title}
                            </span>
                            {uploaded && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20 shrink-0" />
                            )}
                          </div>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {item.desc}
                          </p>
                          <span className={`text-[11px] block mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                            Allowed file types: JPG, JPEG, PNG, WEBP (or take photo using Camera)
                          </span>
                        </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <label className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition-all">
                          <Upload className="w-3.5 h-3.5" />
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
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition-all"
                        >
                          <Camera className="w-3.5 h-3.5" />
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

                            <div className={`w-20 h-20 rounded-xl overflow-hidden border shrink-0 ${
                              darkMode ? 'border-slate-700 bg-slate-950' : 'border-slate-200 bg-slate-100'
                            }`}>
                              <img
                                src={uploaded.url || 'https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=500&auto=format&fit=crop&q=80'}
                                alt={uploaded.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>

                            <span className={`text-[10px] font-bold text-center truncate max-w-full mt-2 block px-1 group-hover:text-blue-400 ${
                              darkMode ? 'text-slate-200' : 'text-slate-800'
                            }`}>
                              {uploaded.name}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                );
                })}
              </div>

              {/* REVIEW APPLICATION SUMMARY */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <h3 className={`text-xs font-black tracking-wide uppercase ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  REVIEW APPLICATION SUMMARY
                </h3>

                <div className={`p-5 rounded-2xl border space-y-2 text-xs ${
                  darkMode ? 'bg-[#091124] border-slate-800/90 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <div className="flex justify-between items-center pb-1 border-b border-slate-800/60">
                    <h4 className="text-sm font-extrabold text-white">{selectedCourseTitle}</h4>
                    <span className="text-xs font-bold text-blue-400">18 working days</span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div>
                      <span className="font-bold text-slate-400">Training Batch: </span>
                      <span className="text-white font-semibold">3rd Batch 2026</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400">Application Period: </span>
                      <span className="text-white font-semibold">July 1, 2026 - July 15, 2026</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400">Training Schedule: </span>
                      <span className="text-white font-semibold">August 1 - 18, 2026</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400">Applicant: </span>
                      <span className="text-white font-semibold">JEFFERSON LEE • Male, 22 • Single • Brgy. Bagong Silangan</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400">Education & Purpose: </span>
                      <span className="text-white font-semibold">
                        {highestEdu && trainingPurpose
                          ? `${highestEdu} • ${trainingPurpose}`
                          : (highestEdu || trainingPurpose)
                          ? `${highestEdu || 'Not specified'} ${trainingPurpose ? `• ${trainingPurpose}` : ''}`
                          : 'Senior High School • Skills Development'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certification Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 font-medium">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-0.5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span>I hereby certify that all information provided is true and correct, and I commit to faithfully attend all scheduled training sessions for this course.</span>
                </label>
              </div>

              {/* Bottom Nav Action Bar */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setApplyStep(2)}
                  className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    darkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  <span>Submit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TRAINING SCHEDULE                                                   */}
      {/* ========================================================================= */}
      {activeTab === 3 && (
        <div className={`rounded-3xl border p-12 text-center space-y-5 ${
          darkMode ? 'bg-[#0e172a] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className={`text-lg font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              No Approved Training Schedule Yet
            </h3>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              You currently have no active or confirmed training schedule. Once your application is reviewed and approved by the social worker, your assigned official schedule, venue pass, and timetable will appear here.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setActiveTab(1)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Available Training Courses</span>
            </button>
          </div>
        </div>
      )}





      {/* ========================================================================= */}
      {/* MODAL: SAMPLE LETTER OF INTENT PREVIEW                                    */}
      {/* ========================================================================= */}
      {showSampleLetterModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setShowSampleLetterModal(false)}
        >
          <div 
            className={`max-w-xl w-full flex flex-col rounded-2xl border p-5 space-y-4 shadow-2xl relative overflow-hidden ${
              darkMode ? 'bg-[#0d1627] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base sm:text-lg font-bold">
                  Sample Request Letter
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Sample Request Letter / Letter of Intent
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowSampleLetterModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Preview Box */}
            <div className="rounded-xl bg-[#070d19] border border-slate-800/80 p-3 flex items-center justify-center overflow-hidden min-h-[160px]">
              <img 
                src="/LETTER OF INTENT - Copy.png" 
                alt="Sample Request Letter" 
                className="max-h-[300px] sm:max-h-[340px] w-auto h-auto object-contain rounded-md shadow-md"
              />
            </div>

            {/* Description Info Box */}
            <div className={`p-3.5 rounded-xl border text-xs leading-relaxed font-medium ${
              darkMode 
                ? 'bg-[#12233f]/70 border-blue-900/50 text-blue-200' 
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}>
              Sample formal request letter addressed to SSDD indicating intent to participate in the skills training program.
            </div>

            {/* Modal Action Buttons */}
            <div className="flex justify-between items-center pt-2">
              <a
                href="/LETTER OF INTENT - Copy.png"
                download="LETTER_OF_INTENT_SAMPLE.png"
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border inline-flex items-center gap-2 cursor-pointer ${
                  darkMode
                    ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                }`}
              >
                <span>Download Sample</span>
              </a>

              <button
                type="button"
                onClick={() => setShowSampleLetterModal(false)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CAMERA CAPTURE SIMULATION                                          */}
      {/* ========================================================================= */}
      {activeCameraDocKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className={`relative w-full max-w-md border rounded-3xl p-6 space-y-4 ${
            darkMode ? 'bg-[#0e172a] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className={`text-sm font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Camera Document Capture</h3>
              <button
                type="button"
                onClick={closeCameraModal}
                className={`p-1 rounded-lg ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
              {cameraStream ? (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <Camera className="w-12 h-12 text-blue-500 mx-auto mb-2 animate-pulse" />
                  <span className="text-xs font-bold text-slate-300 block">Live Camera Stream Active</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Position document within camera view</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeCameraModal}
                className={`px-4 py-2 text-xs font-bold rounded-xl border ${
                  darkMode ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-700'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCapturePhoto}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-lg flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Capture & Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: APPLICATION SUBMITTED SUCCESS                                      */}
      {/* ========================================================================= */}


      {/* MODAL: SYLLABUS & VENUE DETAIL MODAL                                        */}
      {selectedScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className={`relative w-full max-w-2xl rounded-3xl border p-6 space-y-5 shadow-2xl ${
            darkMode ? 'bg-[#0f192e] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              type="button"
              onClick={() => setSelectedScheduleModal(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-700 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3">
              <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30 shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold">{selectedScheduleModal.course}</h3>
                <span className="text-xs font-bold text-blue-400">{selectedScheduleModal.category} • {selectedScheduleModal.batch}</span>
              </div>
            </div>

            {/* Venue & Time Overview */}
            <div className={`p-4 rounded-2xl border space-y-2.5 text-xs ${
              darkMode ? 'bg-slate-900/80 border-slate-800/90' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className={`font-bold block ${darkMode ? 'text-white' : 'text-slate-900'}`}>{selectedScheduleModal.venue}</span>
                  <span className="text-slate-400 block text-[11px]">{selectedScheduleModal.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{selectedScheduleModal.schedule} • ({selectedScheduleModal.duration})</span>
              </div>
            </div>

            {/* Syllabus Topics */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Course Syllabus & Training Breakdown</h4>
              <div className="space-y-2">
                {selectedScheduleModal.syllabus.map((topic: string, idx: number) => (
                  <div key={idx} className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                    darkMode ? 'bg-slate-900/50 border-slate-800/60' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex justify-end items-center gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedScheduleModal(null)}
                className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                  darkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCourseTitle(selectedScheduleModal.course);
                  setSelectedScheduleModal(null);
                  setApplyStep(2);
                  setActiveTab(2);
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <span>Apply for this Training</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
