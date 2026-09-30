import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Bell, User, LogOut, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onNavigateToProfile?: () => void;
  isAdminMode?: boolean;
  setIsAdminMode?: (isAdmin: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeSection,
  darkMode,
  setDarkMode,
  onNavigateToProfile,
  isAdminMode = true,
  setIsAdminMode
}) => {
  const [timeStr, setTimeStr] = useState<string>('09:52:39 AM');
  const [dateStr, setDateStr] = useState<string>('Wed, Sep 30');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={`sticky top-0 z-40 h-16 shrink-0 border-b px-6 flex items-center justify-between shadow-sm transition-colors duration-200 ${
      darkMode 
        ? 'bg-[#070e1b] border-slate-800/80 text-white' 
        : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Left Area: Active Page / Section Title */}
      <div className="flex items-center h-full">
        <h2 className={`text-base font-extrabold tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          {activeSection}
        </h2>
      </div>

      {/* Right Controls & User Profile */}
      <div className="flex items-center gap-4 pr-1">
        
        {/* Real-time Clock matching reference screenshot format */}
        <div className="text-right hidden sm:block">
          <div className={`text-xs font-bold tracking-wider font-mono ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
            {timeStr}
          </div>
          <div className={`text-[10px] font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {dateStr}
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className={`p-1.5 rounded-lg transition-colors ${
            darkMode 
              ? 'text-slate-400 hover:text-amber-300 hover:bg-slate-800' 
              : 'text-slate-600 hover:text-amber-600 hover:bg-slate-100'
          }`}
          title={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Profile matching reference screenshot: System Admin / Administrator / AD avatar */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 p-0 border-none outline-none transition-all cursor-pointer select-none hover:opacity-90"
          >
            <div className="text-right hidden sm:block leading-tight">
              <div className={`text-xs font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {isAdminMode ? 'System Admin' : 'Jefferson Lee'}
              </div>
              <div className={`text-[10px] font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {isAdminMode ? 'Administrator' : 'Citizen Account'}
              </div>
            </div>

            {/* Avatar Circle with AD / SA matching screenshot */}
            <div className="w-8 h-8 rounded-full bg-[#1d4ed8] text-white font-extrabold text-xs flex items-center justify-center shadow-md border border-blue-400/40">
              {isAdminMode ? 'AD' : 'JL'}
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className={`absolute right-0 mt-2 w-52 rounded-2xl shadow-2xl p-2 z-50 border animate-in fade-in slide-in-from-top-2 ${
              darkMode ? 'bg-[#0f172a] border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              {setIsAdminMode && (
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminMode(!isAdminMode);
                    setShowProfileMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-colors mb-1 ${
                    darkMode 
                      ? 'text-blue-400 hover:bg-blue-950/40' 
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isAdminMode ? 'Switch to Citizen Side' : 'Switch to Admin Side'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onNavigateToProfile) onNavigateToProfile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-colors ${
                  darkMode 
                    ? 'text-slate-200 hover:text-white hover:bg-slate-800/80' 
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Account Profile</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-red-500 rounded-xl transition-colors ${
                  darkMode 
                    ? 'hover:text-red-400 hover:bg-red-950/30' 
                    : 'hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
