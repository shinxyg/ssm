import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Bell, User, LogOut } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onNavigateToProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeSection,
  darkMode,
  setDarkMode,
  onNavigateToProfile
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
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
        ? 'bg-[#0d172a] border-slate-800/80 text-white' 
        : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Left Area: Active Page / Section Title */}
      <div className="flex items-center h-full">
        <h2 className={`text-base font-extrabold tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          {activeSection}
        </h2>
      </div>

      {/* Right Controls & User Profile */}
      <div className="flex items-center gap-3.5 pr-1">
        {/* Real-time Clock */}
        <div className="text-right hidden sm:block">
          <div className={`text-xs font-bold tracking-wider font-mono ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
            {timeStr || '11:17:23 PM'}
          </div>
          <div className={`text-[10px] font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {dateStr || 'Mon, Sep 28'}
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

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className={`relative p-1.5 rounded-lg transition-colors ${
              darkMode 
                ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-2xl p-3 z-50 border animate-in fade-in slide-in-from-top-2 ${
              darkMode ? 'bg-[#111c35] border-slate-700/80 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <div className={`flex justify-between items-center pb-2 border-b mb-2 ${darkMode ? 'border-slate-700/50' : 'border-slate-200'}`}>
                <span className="text-xs font-bold">Notifications (2)</span>
                <button 
                  type="button"
                  onClick={() => setShowNotifications(false)} 
                  className="text-[10px] text-blue-500 hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div className={`p-2 rounded-lg border ${darkMode ? 'bg-blue-950/40 border-blue-800/40' : 'bg-blue-50 border-blue-200'}`}>
                  <div className={`font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>AICS Voucher Ready</div>
                  <div className={`text-[11px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Your Medical Assistance claim voucher #AICS-8841 is ready for payout.</div>
                  <div className={`text-[9px] mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>10 mins ago</div>
                </div>
                <div className={`p-2 rounded-lg border ${darkMode ? 'bg-slate-800/40 border-slate-700/40' : 'bg-slate-100 border-slate-200'}`}>
                  <div className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Senior Booklet Verified</div>
                  <div className={`text-[11px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Documents for Senior Citizen medicine booklet request approved.</div>
                  <div className={`text-[9px] mt-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>2 hours ago</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Capsule (No Border) with Interactive Dropdown & Click Outside */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-0 border-none outline-none transition-all cursor-pointer select-none hover:opacity-80"
          >
            <span className={`text-xs font-bold hidden lg:inline tracking-wide ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              Hi, JEFFERSON
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md border border-blue-400/40">
              JL
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-2xl p-2 z-50 border animate-in fade-in slide-in-from-top-2 ${
              darkMode ? 'bg-[#0f172a] border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}>
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
                <span>Profile</span>
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
