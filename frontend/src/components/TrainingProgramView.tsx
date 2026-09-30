import React, { useState } from 'react';
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
  ArrowRight 
} from 'lucide-react';

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
  onApplyCourse: (courseTitle: string) => void;
  darkMode?: boolean;
}

export const TrainingProgramView: React.FC<TrainingProgramViewProps> = ({ onApplyCourse, darkMode = true }) => {
  const [activeTab, setActiveTab] = useState<number>(1);

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

  return (
    <div className="space-y-6">
      {/* Top Stepper Tabs Bar */}
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
          <BookOpen className="w-3.5 h-3.5" />
          <span>1. AVAILABLE TRAINING</span>
        </button>

        <button
          onClick={() => setActiveTab(2)}
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

        <button
          onClick={() => setActiveTab(4)}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 4
              ? 'bg-blue-600 text-white shadow-md'
              : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>4. TRAINING HISTORY</span>
        </button>
      </div>

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

                {/* Metadata List (Matching Pic 1 icons) */}
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
                  onClick={() => onApplyCourse(course.title)}
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
                  onClick={() => onApplyCourse(course.title)}
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
  );
};
