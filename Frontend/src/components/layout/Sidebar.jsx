import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  FileCheck2,
  Video,
  Briefcase,
  FolderGit2,
  Code2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Radio,
  Settings,
  X,
  Flag,
  Layers,
  Film,
  Award,
  Gift,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLmsData } from '../../context/LmsDataContext';
import { ROLES, INITIAL_ROLE_PERMISSIONS } from '../../utils/mockData';
import { ProfileSettingsModal } from '../common/ProfileSettingsModal';

const ALL_NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, permissionId: 'view_dashboard' },
  { label: 'Batches', path: '/batches', icon: Layers, permissionId: 'manage_batches' },
  { label: 'Milestones', path: '/milestones', icon: Flag, permissionId: 'manage_milestones' },
  { label: 'Students', path: '/students', icon: GraduationCap, permissionId: 'manage_students' },
  { label: 'User Directory', path: '/users', icon: Users, permissionId: 'manage_users' },
  { label: 'Permission Matrix', path: '/permissions', icon: ShieldCheck, permissionId: 'manage_roles' },
  { label: 'Course Management', path: '/courses', icon: BookOpen, permissionId: 'create_course' },
  { label: 'Assessments', path: '/assessments', icon: FileCheck2, permissionId: 'create_assessment' },
  { label: 'Coding Questions', path: '/coding-questions', icon: Code2, permissionId: 'manage_coding' },
  { label: 'Projects Portal', path: '/projects', icon: FolderGit2, permissionId: 'manage_projects' },
  { label: 'Live Sessions', path: '/live-sessions', icon: Video, permissionId: 'manage_live_sessions' },
  { label: 'Job Portal', path: '/jobs', icon: Briefcase, permissionId: 'manage_jobs' },
  { label: 'Recording Library', path: '/library', icon: Film, permissionId: 'manage_recordings' },
  { label: 'Placement Prep', path: '/placement', icon: FileText, permissionId: 'manage_placement' },
  { label: 'Badges', path: '/badges', icon: Sparkles, permissionId: 'manage_badges' },
  { label: 'Rewards', path: '/rewards', icon: Gift, permissionId: 'manage_rewards' },
  { label: 'LMS Feed Sync', path: '/student-dashboard', icon: Radio, permissionId: 'inspect_api_feed' }
];

export function Sidebar({ isCollapsed, onToggle, isMobileOpen, onCloseMobile }) {
  const { currentRole, currentUser, logout, isSuperAdmin } = useAuth();
  const { rolePermissions = {} } = useLmsData() || {};
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Navigation Items dynamically filtered by Role Permissions Matrix
  const getNavItems = () => {
    if (isSuperAdmin || currentRole === ROLES.SUPER_ADMIN) {
      return ALL_NAV_ITEMS;
    }

    const assignedPerms = rolePermissions[currentRole] || INITIAL_ROLE_PERMISSIONS[currentRole] || [];
    return ALL_NAV_ITEMS.filter((item) => assignedPerms.includes(item.permissionId));
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
        />
      )}

      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 bg-white text-slate-700 flex flex-col border-r border-slate-200/80 shadow-lg md:shadow-2xs transition-all duration-300 ${
          // Desktop sizing
          isCollapsed ? 'md:w-16' : 'md:w-[230px]'
        } ${
          // Mobile slide-over drawer behavior
          isMobileOpen ? 'translate-x-0 w-[240px]' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Logo Header */}
        <div
          className={`h-14 flex items-center border-b border-slate-100 bg-slate-50/60 ${
            isCollapsed ? 'md:justify-center px-2' : 'justify-between px-3.5'
          }`}
        >
          <div
            onClick={isCollapsed ? onToggle : undefined}
            className={`flex items-center gap-2.5 ${
              isCollapsed ? 'md:cursor-pointer md:justify-center group' : 'overflow-hidden'
            }`}
            title={isCollapsed ? 'Expand Sidebar' : undefined}
          >
            {/* Logo with Thin Blue Border */}
            <img
              src="/logo.jpg"
              alt="Aspire LMS Logo"
              className="w-8 h-8 object-contain flex-shrink-0 rounded-lg border border-blue-500/60 p-0.5 shadow-2xs group-hover:border-blue-600 transition-all duration-300"
            />

            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col">
                <span className="font-black text-sm text-slate-900 tracking-tight leading-none">
                  ASPIRE <span className="text-blue-600 font-black">LMS</span>
                </span>
              </div>
            )}
          </div>

          {/* Desktop Toggle Button */}
          {!isCollapsed ? (
            <button
              onClick={onToggle}
              className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all hidden md:block cursor-pointer"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onToggle}
              className="p-1 text-slate-400 hover:text-blue-600 rounded-lg transition-colors hidden md:block cursor-pointer"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Mobile Close Button */}
          <button
            onClick={onCloseMobile}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>



        {/* Navigation List with Logo Blue Hover Colors */}
        <nav className="flex-1 py-3 px-2.5 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-xl text-sm transition-all duration-200 group border ${
                  isCollapsed ? 'md:justify-center p-2.5' : 'px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-md shadow-blue-500/25'
                    : 'text-slate-700 border-transparent hover:bg-blue-50/90 hover:text-blue-600 hover:border-blue-200/70 font-semibold'
                }`
              }
            >
              <item.icon className="w-4.5 h-4.5 flex-shrink-0 group-hover:scale-105 transition-transform" />
              {(!isCollapsed || isMobileOpen) && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Footer: Only Logout */}
        <div className="p-2.5 border-t border-slate-100 bg-slate-50/60">
          <button
            onClick={logout}
            title="Logout"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-extrabold text-rose-600 hover:text-rose-700 bg-rose-50/80 hover:bg-rose-100 border border-rose-200/80 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-4 h-4" />
            {(!isCollapsed || isMobileOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Profile & Security Settings Modal */}
      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
