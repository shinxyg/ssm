import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldAlert,
  UserCheck, 
  Users, 
  Heart,
  GraduationCap, 
  Wallet, 
  FileText,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
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
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const [livelihoodOpen, setLivelihoodOpen] = useState<boolean>(true);

  const mainNavItems = [
    { id: 'help-guide', label: 'Help & Service Guide', icon: BookOpen },
    { id: 'aics', label: 'AICS Assistance', icon: ShieldAlert },
    { id: 'pwd', label: 'PWD Services', icon: WheelchairIcon },
    { id: 'senior', label: 'Senior Citizen Services', icon: UserCheck },
    { id: 'soloparent', label: 'Solo Parent Services', icon: Users },
    { id: 'childwelfare', label: 'Child Welfare Services', icon: Heart },
  ];

  const subLivelihoodItems = [
    { id: 'livelihood-grants', label: 'Livelihood Program' },
    { id: 'skills-training', label: 'Training Program' },
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
              <span className="text-[10px] font-medium tracking-wide text-slate-400">Citizen Portal</span>
            </div>
          )}
        </div>
        {setIsOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-white transition-colors shrink-0 ml-1 cursor-pointer"
            title={isOpen ? undefined : "Expand Sidebar"}
          >
            {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
      </div>

      <div className="p-3 space-y-4 overflow-y-auto flex-1">
        {/* Main Navigation Items */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = 
              activeTab === item.id ||
              (item.id === 'childwelfare' && activeTab === 'aics-educational') ||
              (item.id === 'pwd' && activeTab === 'pwd-form') ||
              (item.id === 'senior' && activeTab === 'senior-form') ||
              (item.id === 'soloparent' && (activeTab === 'soloparent-form' || activeTab === 'soloparent-financial-form' || activeTab === 'soloparent-edu-form')) ||
              (item.id === 'aics' && (activeTab === 'aics-medical' || activeTab === 'aics-funeral'));
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center ${
                  isOpen ? 'gap-3.5 px-4 py-3 justify-start' : 'justify-center p-3'
                } rounded-2xl text-[13px] font-semibold transition-all duration-150 border group ${
                  isActive
                    ? 'bg-[#152747] text-white border-blue-500/30'
                    : 'bg-transparent text-[#94a3b8] hover:text-white hover:bg-[#101e38] border-transparent'
                }`}
                title={isOpen ? undefined : item.label}
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

          {/* Livelihood & Training */}
          <div>
            <button
              type="button"
              onClick={() => {
                setLivelihoodOpen(!livelihoodOpen);
                setActiveTab('livelihood');
              }}
              className={`w-full flex items-center ${
                isOpen ? 'justify-between px-4 py-3' : 'justify-center p-3'
              } rounded-2xl text-[13px] font-semibold transition-all duration-150 border group ${
                activeTab.startsWith('livelihood')
                  ? 'bg-[#152747] text-white border-blue-500/30'
                  : 'bg-transparent text-[#94a3b8] hover:text-white hover:bg-[#101e38] border-transparent'
              }`}
              title={isOpen ? undefined : "Livelihood & Training"}
            >
              <div className="flex items-center gap-3.5">
                <GraduationCap className={`w-4 h-4 shrink-0 transition-colors ${
                  activeTab.startsWith('livelihood')
                    ? 'text-blue-400'
                    : 'text-[#94a3b8] group-hover:text-white'
                }`} />
                {isOpen && <span className="truncate">Livelihood & Training</span>}
              </div>
              {isOpen && (
                livelihoodOpen 
                  ? <ChevronUp className="w-3.5 h-3.5 text-blue-400" /> 
                  : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>

            {/* Sub-menu */}
            {isOpen && livelihoodOpen && (
              <div className="ml-10 mt-1 space-y-1">
                {subLivelihoodItems.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setActiveTab(sub.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      activeTab === sub.id
                        ? 'text-blue-400 bg-[#132342]'
                        : 'text-[#94a3b8] hover:text-slate-200 hover:bg-[#101c33]'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Financial Aid Disbursement */}
          <button
            type="button"
            onClick={() => setActiveTab('payout')}
            className={`w-full flex items-center ${
              isOpen ? 'gap-3.5 px-4 py-3 justify-start' : 'justify-center p-3'
            } rounded-2xl text-[13px] font-semibold transition-all duration-150 border group ${
              activeTab === 'payout'
                ? 'bg-[#152747] text-white border-blue-500/30'
                : 'bg-transparent text-[#94a3b8] hover:text-white hover:bg-[#101e38] border-transparent'
            }`}
            title={isOpen ? undefined : "Financial Aid Disbursement"}
          >
            <Wallet className={`w-4 h-4 shrink-0 transition-colors ${
              activeTab === 'payout'
                ? 'text-blue-400'
                : 'text-[#94a3b8] group-hover:text-white'
            }`} />
            {isOpen && <span className="truncate">Financial Aid Disbursement</span>}
          </button>
        </nav>

        {/* Section Divider & Histories */}
        <div className="pt-2 border-t border-slate-800/60">
          {isOpen && (
            <div className="px-4 text-[10px] font-bold tracking-wider uppercase mb-2 text-slate-500">
              HISTORIES
            </div>
          )}
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center ${
              isOpen ? 'gap-3.5 px-4 py-3 justify-start' : 'justify-center p-3'
            } rounded-2xl text-[13px] font-semibold transition-all duration-150 border group ${
              activeTab === 'history'
                ? 'bg-[#152747] text-white border-blue-500/30'
                : 'bg-transparent text-[#94a3b8] hover:text-white hover:bg-[#101e38] border-transparent'
            }`}
            title={isOpen ? undefined : "Application History"}
          >
            <FileText className={`w-4 h-4 shrink-0 transition-colors ${
              activeTab === 'history'
                ? 'text-blue-400'
                : 'text-[#94a3b8] group-hover:text-white'
            }`} />
            {isOpen && <span className="truncate">Application History</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
