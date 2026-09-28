import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldAlert, 
  Accessibility, 
  UserCheck, 
  Users, 
  Baby, 
  GraduationCap, 
  CreditCard, 
  History,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen?: (open: boolean) => void;
  darkMode?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, darkMode = true }) => {
  const [livelihoodOpen, setLivelihoodOpen] = useState<boolean>(true);

  const mainNavItems = [
    { id: 'help-guide', label: 'Help & Service Guide', icon: BookOpen },
    { id: 'aics', label: 'AICS Assistance', icon: ShieldAlert },
    { id: 'pwd', label: 'PWD Services', icon: Accessibility },
    { id: 'senior', label: 'Senior Citizen Services', icon: UserCheck },
    { id: 'soloparent', label: 'Solo Parent Services', icon: Users },
    { id: 'childwelfare', label: 'Child Welfare Services', icon: Baby },
  ];

  const subLivelihoodItems = [
    { id: 'livelihood-grants', label: 'Livelihood Program' },
    { id: 'skills-training', label: 'Training Program' },
  ];

  return (
    <aside
      className={`shrink-0 border-r transition-all duration-300 flex flex-col justify-between select-none ${
        isOpen ? 'w-64' : 'w-16'
      } ${
        darkMode 
          ? 'bg-[#0b1326] border-slate-800/80 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      <div className="p-3 space-y-4 overflow-y-auto">
        {/* Main Navigation Items */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center ${
                  isOpen ? 'gap-3.5 px-4 py-3 justify-start' : 'justify-center p-3'
                } rounded-2xl text-[13px] font-semibold transition-colors duration-150 border ${
                  isActive
                    ? darkMode
                      ? 'bg-[#182a4d] text-white border-blue-500/30 shadow-sm'
                      : 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm'
                    : darkMode
                      ? 'bg-transparent text-slate-300 hover:text-white hover:bg-[#13203b] border-transparent'
                      : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'
                }`}
                title={item.label}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-500' : darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
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
              } rounded-2xl text-[13px] font-semibold transition-colors duration-150 border ${
                activeTab.startsWith('livelihood')
                  ? darkMode
                    ? 'bg-[#182a4d] text-white border-blue-500/30 shadow-sm'
                    : 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm'
                  : darkMode
                    ? 'bg-transparent text-slate-300 hover:text-white hover:bg-[#13203b] border-transparent'
                    : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'
              }`}
              title="Livelihood & Training"
            >
              <div className="flex items-center gap-3.5">
                <GraduationCap className={`w-4 h-4 shrink-0 ${activeTab.startsWith('livelihood') ? 'text-blue-500' : darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                {isOpen && <span className="truncate">Livelihood & Training</span>}
              </div>
              {isOpen && (
                livelihoodOpen ? <ChevronUp className="w-3.5 h-3.5 text-blue-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
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
                        ? darkMode ? 'text-blue-400 bg-[#14223d]' : 'text-blue-600 bg-blue-100/60'
                        : darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-[#111c33]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
            } rounded-2xl text-[13px] font-semibold transition-colors duration-150 border ${
              activeTab === 'payout'
                ? darkMode
                  ? 'bg-[#182a4d] text-white border-blue-500/30 shadow-sm'
                  : 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm'
                : darkMode
                  ? 'bg-transparent text-slate-300 hover:text-white hover:bg-[#13203b] border-transparent'
                  : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'
            }`}
            title="Financial Aid Disbursement"
          >
            <CreditCard className={`w-4 h-4 shrink-0 ${activeTab === 'payout' ? 'text-blue-500' : darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            {isOpen && <span className="truncate">Financial Aid Disbursement</span>}
          </button>
        </nav>

        {/* Section Divider & Histories */}
        <div className={`pt-2 border-t ${darkMode ? 'border-slate-800/60' : 'border-slate-200'}`}>
          {isOpen && (
            <div className={`px-4 text-[10px] font-bold tracking-wider uppercase mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              HISTORIES
            </div>
          )}
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center ${
              isOpen ? 'gap-3.5 px-4 py-3 justify-start' : 'justify-center p-3'
            } rounded-2xl text-[13px] font-semibold transition-colors duration-150 border ${
              activeTab === 'history'
                ? darkMode
                  ? 'bg-[#182a4d] text-white border-blue-500/30 shadow-sm'
                  : 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm'
                : darkMode
                  ? 'bg-transparent text-slate-300 hover:text-white hover:bg-[#13203b] border-transparent'
                  : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'
            }`}
            title="Application History"
          >
            <History className={`w-4 h-4 shrink-0 ${activeTab === 'history' ? 'text-blue-500' : darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            {isOpen && <span className="truncate">Application History</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

