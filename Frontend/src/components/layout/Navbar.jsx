import React, { useState } from 'react';
import {
  Search,
  Bell,
  UserCheck,
  ChevronDown,
  Menu,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROLES } from '../../utils/mockData';
import { ProfileSettingsModal } from '../common/ProfileSettingsModal';

export function Navbar({ isCollapsed, onToggleSidebar }) {
  const { currentRole, switchRole, currentUser, isSuperAdmin } = useAuth();
  const { addToast } = useToast();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleRoleChange = (role) => {
    switchRole(role);
    setIsRoleDropdownOpen(false);
    addToast(`Switched view mode to ${role}`, 'info');
  };

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-30 h-14 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300 flex items-center justify-between px-4 sm:px-6 ${
          isCollapsed ? 'md:left-16' : 'md:left-[230px]'
        }`}
      >
        {/* Left side: Mobile Toggle & Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 md:hidden cursor-pointer flex-shrink-0"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses, users, sessions..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-blue-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        {/* Right side: Role Indicator / Switcher, Notifications, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Conditional Role Switcher: Interactive for Super Admin ONLY */}
          {isSuperAdmin ? (
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-blue-700 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                title="Super Admin View Mode Switcher"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Role:</span>
                <span className="font-extrabold text-blue-900">{currentRole}</span>
                <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 sm:w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Super Admin Switcher</p>
                  </div>
                  {Object.values(ROLES).map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleChange(role)}
                      className={`w-full flex items-center justify-between px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                        currentRole === role
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{role}</span>
                      {currentRole === role && <Sparkles className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Static Non-Clickable Badge for Standard Staff (Admin, Manager, Instructor) */
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Role:</span>
              <span className="font-extrabold text-slate-900">{currentRole}</span>
            </div>
          )}

          {/* Notifications Icon */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-1.5 text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-100 relative transition-colors cursor-pointer"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h5 className="font-bold text-sm text-slate-800">Notifications</h5>
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                    3 New
                  </span>
                </div>
                <div className="py-2 space-y-3">
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800">New Live Session Scheduled</p>
                    <p className="text-slate-500 text-[11px]">React Server Components by David Chen</p>
                    <span className="text-[10px] text-slate-400">10m ago</span>
                  </div>
                  <div className="text-xs border-t border-slate-50 pt-2">
                    <p className="font-semibold text-slate-800">Assessment Submitted</p>
                    <p className="text-slate-500 text-[11px]">Elena Rostova completed Docker Quiz</p>
                    <span className="text-[10px] text-slate-400">1h ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Current User Profile Badge */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:opacity-80 transition-opacity cursor-pointer group"
            title="Click to edit profile & settings"
          >
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/20 group-hover:ring-blue-500"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                {currentUser?.name}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">{currentUser?.department}</span>
            </div>
          </button>
        </div>
      </header>

      {/* Profile & Security Settings Modal */}
      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
