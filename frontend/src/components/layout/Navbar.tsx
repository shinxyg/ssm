import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Bell, User, LogOut } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onNavigateToProfile?: () => void;
  onNavigateToLogin?: () => void;
  userRole?: 'user' | 'admin';
  userName?: string;
  userSubtitle?: string;
  userInitials?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeSection,
  darkMode,
  setDarkMode,
  onNavigateToProfile,
  onNavigateToLogin,
  userRole = 'user',
  userName,
  userSubtitle,
  userInitials,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const displayName = userName || (userRole === 'admin' ? 'System Admin' : 'Jefferson Lee');
  const displaySubtitle = userSubtitle || (userRole === 'admin' ? 'Administrator' : 'Citizen Resident');
  const displayInitials = userInitials || (userRole === 'admin' ? 'AD' : 'JL');

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

      {/* Right Controls & User Profile Matching Reference Screenshot */}
      <div className="flex items-center gap-4 pr-1">
        {/* Real-time Clock */}
        <div className="text-right hidden sm:flex flex-col justify-center">
          <div className={`text-xs sm:text-[13px] font-extrabold font-mono tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {timeStr || '04:18:49 PM'}
          </div>
          <div className={`text-[10px] font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {dateStr || 'Fri, Oct 2'}
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
            darkMode 
              ? 'text-slate-300 hover:text-white hover:bg-slate-800/80' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Profile Pill Badge matching exact compact request */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`flex items-center gap-2.5 px-2.5 py-1 rounded-xl outline-none transition-all cursor-pointer select-none group border ${
              showProfileMenu 
                ? 'bg-[#0f1b33] border-blue-500/40' 
                : 'bg-transparent hover:bg-[#0f1b33]/60 border-transparent'
            }`}
          >
            {/* Title & Subtitle text on the left */}
            <div className="text-right hidden sm:flex flex-col justify-center">
              <span className={`text-xs font-bold leading-tight transition-colors ${
                darkMode ? 'text-white group-hover:text-blue-300' : 'text-slate-900 group-hover:text-blue-600'
              }`}>
                {displayName}
              </span>
              <span className={`text-[10px] font-medium leading-tight mt-0.5 ${
                darkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {displaySubtitle}
              </span>
            </div>

            {/* Avatar Squircle Badge on the right (AD / JL) */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-sky-400 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
              {displayInitials}
            </div>
          </button>

          {/* Profile Dropdown Menu (Compact, No Shadow, No Line) */}
          {showProfileMenu && (
            <div className={`absolute right-0 mt-1.5 w-44 rounded-xl p-1.5 z-50 border animate-in fade-in slide-in-from-top-2 ${
              darkMode ? 'bg-[#091122] border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onNavigateToProfile) onNavigateToProfile();
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  darkMode 
                    ? 'text-slate-100 hover:bg-slate-800/60' 
                    : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Profile</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onNavigateToLogin) onNavigateToLogin();
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-500 rounded-lg transition-colors cursor-pointer mt-0.5 ${
                  darkMode 
                    ? 'hover:bg-red-950/30' 
                    : 'hover:bg-red-50'
                }`}
              >
                <LogOut className="w-3.5 h-3.5 text-red-500" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
