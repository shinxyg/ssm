import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sun, Moon, Bell, User, LogOut, CheckCircle2, Clock, Info, AlertTriangle, XCircle, Trash2 } from 'lucide-react';
import type { ApplicationRecord } from '../../types';

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
  applications?: ApplicationRecord[];
}

// Isolated ClockDisplay component so 1-second ticks DO NOT re-render Navbar or Main Page
const ClockDisplay: React.FC<{ darkMode: boolean }> = React.memo(({ darkMode }) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

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

  return (
    <div className="text-right hidden sm:flex flex-col justify-center">
      <div className={`text-xs sm:text-[13px] font-extrabold font-mono tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
        {timeStr || '04:18:49 PM'}
      </div>
      <div className={`text-[10px] font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        {dateStr || 'Fri, Oct 2'}
      </div>
    </div>
  );
});

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
  applications = [],
}) => {
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  // Persistent dismissed notification IDs from localStorage
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('govserve_dismissed_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Persistent opened bell status from localStorage
  const [hasOpenedBell, setHasOpenedBell] = useState<boolean>(() => {
    try {
      return localStorage.getItem('govserve_bell_opened') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Save dismissedIds to localStorage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem('govserve_dismissed_notifications', JSON.stringify(dismissedIds));
    } catch (e) {
      console.error('Failed to persist dismissed notifications', e);
    }
  }, [dismissedIds]);

  // Save hasOpenedBell state to localStorage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem('govserve_bell_opened', hasOpenedBell ? 'true' : 'false');
    } catch (e) {
      console.error('Failed to persist bell opened status', e);
    }
  }, [hasOpenedBell]);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const displayName = userName || (userRole === 'admin' ? 'System Admin' : 'Jefferson Lee');
  const displaySubtitle = userSubtitle || (userRole === 'admin' ? 'Administrator' : 'Citizen Resident');
  const displayInitials = userInitials || (userRole === 'admin' ? 'AD' : 'JL');

  // Generate Notifications derived from the 5-step application lifecycle
  const rawNotifications = useMemo(() => {
    const list: { id: string; title: string; message: string; time: string; type: 'info' | 'success' | 'warning' | 'error' }[] = [];

    applications.forEach((app) => {
      const ref = app.referenceNo;
      const serv = app.serviceName;

      // Step 1: Form Submitted
      list.unshift({
        id: `${ref}-step1`,
        title: 'Step 1: Application Received',
        message: `Application received for ${serv} (Ref: ${ref}). Admin is currently evaluating your submitted requirements.`,
        time: app.dateSubmitted || 'Submitted',
        type: 'info'
      });

      // Step 2: Admin Initial Verification
      if (app.status === 'Pending Appointment' || app.status === 'Interview Scheduled' || app.status === 'Ready for Payout' || app.status === 'Approved' || app.status === 'RELEASED / COMPLETED' || (app.status as string) === 'Completed') {
        list.unshift({
          id: `${ref}-step2`,
          title: 'Step 2: Initial Verification Approved',
          message: `Initial Approval: Your ${serv} (Ref: ${ref}) has been verified and queued for interview scheduling.`,
          time: 'Verified',
          type: 'success'
        });
      } else if ((app.status as string) === 'Rejected' || (app.status as string) === 'Disqualified') {
        list.unshift({
          id: `${ref}-step2-rejected`,
          title: 'Step 2: Disapproved',
          message: `Your ${serv} application (Ref: ${ref}) was disapproved due to requirement discrepancies.`,
          time: 'Rejected',
          type: 'error'
        });
      }

      // Step 3: Interview Scheduled
      if (app.status === 'Interview Scheduled' || app.status === 'Ready for Payout' || app.status === 'Approved' || app.status === 'RELEASED / COMPLETED' || (app.status as string) === 'Completed') {
        list.unshift({
          id: `${ref}-step3`,
          title: 'Step 3: Interview Scheduled',
          message: `Interview Scheduled: Your appointment for ${serv} (Ref: ${ref}) is set at Quezon City Hall SSDD Assessment Area.`,
          time: 'Scheduled',
          type: 'info'
        });
      }

      // Step 4: Physical Interview & Decision
      if (app.status === 'Ready for Payout' || app.status === 'Approved' || app.status === 'RELEASED / COMPLETED' || (app.status as string) === 'Completed') {
        list.unshift({
          id: `${ref}-step4-approved`,
          title: 'Step 4: Aid Approved',
          message: `Your ${serv} (Ref: ${ref}) has been officially approved! Financial assistance benefit is ready for release.`,
          time: 'Approved',
          type: 'success'
        });
      } else if (app.status === 'Referred to Partner Agency' || app.status === 'Referred') {
        list.unshift({
          id: `${ref}-step4-referred`,
          title: 'Step 4: Case Referred',
          message: `Your ${serv} case (Ref: ${ref}) has been referred to partner government agency (PCSO / DSWD).`,
          time: 'Referred',
          type: 'warning'
        });
      }

      // Step 5: Financial Release Completed
      if (app.status === 'RELEASED / COMPLETED' || (app.status as string) === 'Completed') {
        list.unshift({
          id: `${ref}-step5`,
          title: 'Step 5: Release Completed',
          message: `Completed: Financial assistance benefit for ${serv} (Ref: ${ref}) has been successfully released and claimed. Thank you!`,
          time: 'Completed',
          type: 'success'
        });
      }
    });

    return list;
  }, [applications]);

  // Active (non-dismissed) notifications
  const notificationsList = useMemo(() => {
    return rawNotifications.filter(n => !dismissedIds.includes(n.id));
  }, [rawNotifications, dismissedIds]);

  // Unread badge count on Bell icon (disappears when bell icon is clicked/opened)
  const unreadCount = hasOpenedBell ? 0 : notificationsList.length;

  const handleToggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setHasOpenedBell(true); // When clicked, badge counter disappears!
  };

  const handleDismissSingle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedIds((prev) => [...prev, id]);
  };

  const handleClearAll = () => {
    const allIds = rawNotifications.map(n => n.id);
    setDismissedIds(allIds);
  };

  useEffect(() => {}, []);

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
        <ClockDisplay darkMode={darkMode} />

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

        {/* NOTIFICATION BELL ICON (ONLY FOR CITIZEN USER, NOT ADMIN) */}
        {userRole !== 'admin' && (
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={handleToggleNotifications}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer relative ${
                darkMode 
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/80' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Notifications Bell"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-rose-500 text-white font-black text-[9px] rounded-full flex items-center justify-center leading-none shadow-md border border-[#070e1b] animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* NOTIFICATION DROPDOWN MENU */}
            {showNotifications && (
              <div className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl p-4 z-50 border shadow-2xl animate-in fade-in zoom-in-95 ${
                darkMode ? 'bg-[#0e172a] border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-400" />
                    <h4 className="text-xs font-extrabold uppercase tracking-wider">Notifications</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    {notificationsList.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAll}
                        className="text-[10px] font-extrabold text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 transition-colors px-2 py-0.5 rounded bg-rose-950/40 border border-rose-800/40 cursor-pointer"
                        title="Delete all notifications"
                      >
                        <Trash2 className="w-3 h-3 text-rose-400" />
                        <span>Clear All</span>
                      </button>
                    )}
                    <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800/50">
                      {notificationsList.length} Updates
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 custom-modal-scroll">
                  {notificationsList.length > 0 ? (
                    notificationsList.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-3 rounded-xl border text-xs space-y-1 transition-all relative group ${
                          notif.type === 'success' 
                            ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-200' 
                            : notif.type === 'info'
                            ? 'bg-blue-950/40 border-blue-800/50 text-blue-200'
                            : notif.type === 'warning'
                            ? 'bg-amber-950/40 border-amber-800/50 text-amber-200'
                            : 'bg-rose-950/40 border-rose-800/50 text-rose-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                            {notif.type === 'success' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                            {notif.type === 'info' && <Info className="w-3 h-3 text-blue-400" />}
                            {notif.type === 'warning' && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                            {notif.type === 'error' && <XCircle className="w-3 h-3 text-rose-400" />}
                            <span>{notif.title}</span>
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-mono text-slate-400">{notif.time}</span>
                            <button
                              type="button"
                              onClick={(e) => handleDismissSingle(notif.id, e)}
                              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/60 transition-colors cursor-pointer"
                              title="Delete notification"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-[11px] leading-snug font-medium text-slate-100 pr-4">{notif.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      No new notifications.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

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
