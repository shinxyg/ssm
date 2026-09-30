import React, { useState } from 'react';
import { 
  BarChart3,
  ShieldAlert, 
  UserCheck, 
  Users, 
  Heart,
  GraduationCap, 
  Wallet, 
  FileText,
  Briefcase,
  Calendar,
  Activity,
  UserCog,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';

// Custom clean PWD Wheelchair Icon matching official accessibility symbol
const WheelchairIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="4" r="2" />
    <path d="M10 8.5v5h4.5l2 5h2.5" />
    <circle cx="9" cy="16.5" r="4" />
  </svg>
);

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen?: (open: boolean) => void;
  darkMode?: boolean;
  isAdminMode?: boolean;
  setIsAdminMode?: (isAdmin: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  setIsOpen,
  isAdminMode = true,
  setIsAdminMode 
}) => {
  const [livelihoodOpen, setLivelihoodOpen] = useState<boolean>(false);

  // Main Nav items matching screenshot
  const topNavItems = [
    { id: 'reports-analytics', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'aics', label: 'Assistance to Individual I...', icon: ShieldAlert, fullLabel: 'Assistance to Individual In Crisis (AICS)' },
    { id: 'pwd', label: 'PWD & Senior Citizen Se...', icon: WheelchairIcon, fullLabel: 'PWD & Senior Citizen Services' },
    { id: 'soloparent', label: 'Solo Parent & Child Welf...', icon: Users, fullLabel: 'Solo Parent & Child Welfare' },
    { id: 'livelihood', label: 'Livelihood & Training Pro...', icon: GraduationCap, fullLabel: 'Livelihood & Training Programs' },
    { id: 'payout', label: 'Financial Aid Disbursem...', icon: Wallet, fullLabel: 'Financial Aid Disbursement' },
  ];

  // Categorized Admin Sections matching reference screenshot
  const adminCategories = [
    {
      category: 'BENEFICIARY',
      items: [
        { id: 'beneficiary-management', label: 'Beneficiary Management', icon: Users }
      ]
    },
    {
      category: 'CASE MANAGER',
      items: [
        { id: 'case-management', label: 'Case Management', icon: Briefcase }
      ]
    },
    {
      category: 'SCHEDULING',
      items: [
        { id: 'appointments', label: 'Appointments', icon: Calendar }
      ]
    },
    {
      category: 'MONITORING',
      items: [
        { id: 'activity-log', label: 'Activity Log', icon: Activity }
      ]
    },
    {
      category: 'ADMINISTRATION',
      items: [
        { id: 'user-management', label: 'User Management', icon: UserCog }
      ]
    }
  ];

  return (
    <aside
      className={`shrink-0 border-r border-slate-800/80 transition-all duration-300 flex flex-col select-none bg-[#070e1b] text-slate-100 h-screen ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Top Header inside Sidebar matching reference screenshot */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/60 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src="/Government Service Integrity Seal.png"
            alt="Government Service Integrity Seal"
            className="w-9 h-9 object-contain shrink-0"
          />
          {isOpen && (
            <div className="flex flex-col justify-center truncate">
              <h1 className="font-extrabold text-base tracking-tight leading-none text-white">GovServe</h1>
              <span className="text-[10px] font-medium tracking-wide text-slate-400">
                {isAdminMode ? 'Admin Portal' : 'Citizen Portal'}
              </span>
            </div>
          )}
        </div>
        {setIsOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-white transition-colors shrink-0 ml-1"
            title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
      </div>

      <div className="p-3 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
        {/* Main Navigation Items */}
        <nav className="space-y-1">
          {topNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = 
              activeTab === item.id ||
              (item.id === 'reports-analytics' && (activeTab === 'reports-analytics' || activeTab === 'reports')) ||
              (item.id === 'soloparent' && activeTab === 'childwelfare') ||
              (item.id === 'pwd' && activeTab === 'senior') ||
              (item.id === 'aics' && (activeTab === 'aics-medical' || activeTab === 'aics-funeral'));

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center ${
                  isOpen ? 'gap-3.5 px-3.5 py-2.5 justify-start' : 'justify-center p-3'
                } rounded-xl text-[12.5px] font-semibold transition-all duration-150 border group ${
                  isActive
                    ? 'bg-[#152747] text-white border-blue-500/30 shadow-md'
                    : 'bg-transparent text-[#94a3b8] hover:text-white hover:bg-[#101e38] border-transparent'
                }`}
                title={item.fullLabel || item.label}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive 
                    ? 'text-blue-400' 
                    : 'text-[#94a3b8] group-hover:text-white'
                }`} />
                {isOpen && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Admin Categorized Menu Sections */}
        {adminCategories.map((cat) => (
          <div key={cat.category} className="pt-2 border-t border-slate-800/50 space-y-1">
            {isOpen && (
              <div className="px-3.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                {cat.category}
              </div>
            )}
            {cat.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center ${
                    isOpen ? 'gap-3.5 px-3.5 py-2.5 justify-start' : 'justify-center p-3'
                  } rounded-xl text-[12.5px] font-semibold transition-all duration-150 border group ${
                    isActive
                      ? 'bg-[#152747] text-white border-blue-500/30 shadow-md'
                      : 'bg-transparent text-[#94a3b8] hover:text-white hover:bg-[#101e38] border-transparent'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive 
                      ? 'text-blue-400' 
                      : 'text-[#94a3b8] group-hover:text-white'
                  }`} />
                  {isOpen && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}

        {/* Portal Switcher at Bottom of Sidebar */}
        {setIsAdminMode && isOpen && (
          <div className="pt-3 border-t border-slate-800/60 px-2">
            <button
              type="button"
              onClick={() => setIsAdminMode(!isAdminMode)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#111c33] hover:bg-[#162544] border border-blue-500/20 text-xs font-semibold text-slate-300 hover:text-white transition-all"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>{isAdminMode ? 'Switch to Citizen View' : 'Switch to Admin Side'}</span>
              </span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
