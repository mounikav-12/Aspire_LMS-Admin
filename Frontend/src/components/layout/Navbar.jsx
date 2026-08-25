import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  UserCheck,
  ChevronDown,
  Menu,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Users,
  Video,
  FileCheck2,
  Briefcase,
  Code2,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import { ROLES } from '../../utils/mockData';
import { ProfileSettingsModal } from '../common/ProfileSettingsModal';

export function Navbar({ isCollapsed, onToggleSidebar }) {
  const { currentRole, switchRole, currentUser, isSuperAdmin } = useAuth();
  const { users = [], courses = [], liveSessions = [], assessments = [], jobs = [], codingQuestions = [] } = useLmsData() || {};
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);
  const roleDropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);

  // Close overlays (search, role dropdown, notifications) on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target)) {
        setIsRoleDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (role) => {
    switchRole(role);
    setIsRoleDropdownOpen(false);
    addToast(`Switched view mode to ${role}`, 'info');
  };

  // Compute live search results across entities
  const getSearchResults = () => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { courses: [], users: [], liveSessions: [], assessments: [], jobs: [], codingQuestions: [], total: 0 };

    const matchedCourses = (courses || []).filter(c =>
      c.title?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q) ||
      c.instructor?.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedUsers = (users || []).filter(u =>
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q) ||
      u.department?.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedSessions = (liveSessions || []).filter(s =>
      s.sessionTitle?.toLowerCase().includes(q) ||
      s.programName?.toLowerCase().includes(q) ||
      s.technology?.toLowerCase().includes(q) ||
      s.instructor?.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedAssessments = (assessments || []).filter(a =>
      a.title?.toLowerCase().includes(q) ||
      a.courseName?.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedJobs = (jobs || []).filter(j =>
      j.company?.toLowerCase().includes(q) ||
      j.jobTitle?.toLowerCase().includes(q) ||
      j.location?.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedCoding = (codingQuestions || []).filter(cq =>
      cq.title?.toLowerCase().includes(q) ||
      cq.category?.toLowerCase().includes(q)
    ).slice(0, 3);

    const total = matchedCourses.length + matchedUsers.length + matchedSessions.length + matchedAssessments.length + matchedJobs.length + matchedCoding.length;

    return {
      courses: matchedCourses,
      users: matchedUsers,
      liveSessions: matchedSessions,
      assessments: matchedAssessments,
      jobs: matchedJobs,
      codingQuestions: matchedCoding,
      total
    };
  };

  const searchResults = getSearchResults();

  const handleSelectResult = (path) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    navigate(path);
  };

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-30 h-14 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300 flex items-center justify-between px-4 sm:px-6 ${
          isCollapsed ? 'md:left-16' : 'md:left-[230px]'
        }`}
      >
        {/* Left side: Mobile Toggle & Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md" ref={searchContainerRef}>
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
              placeholder="Search courses, users, sessions, jobs..."
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsSearchFocused(false);
                }
              }}
              className="w-full pl-9 pr-8 py-1.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-blue-500 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/60 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Global Search Results Overlay */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-3 z-50 max-h-96 overflow-y-auto space-y-3 animate-in fade-in duration-150">
                {searchResults.total > 0 ? (
                  <>
                    {/* Courses */}
                    {searchResults.courses.length > 0 && (
                      <div>
                        <p className="text-[10px] font-black uppercase text-blue-600 tracking-wider mb-1 px-2">Courses</p>
                        <div className="space-y-0.5">
                          {searchResults.courses.map(c => (
                            <div
                              key={c.id}
                              onClick={() => handleSelectResult(`/courses/${c.id}`)}
                              className="p-2 hover:bg-blue-50/80 rounded-xl cursor-pointer transition-colors flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                                <span className="font-bold text-slate-800">{c.title}</span>
                              </div>
                              <span className="text-[10px] font-medium text-slate-400">{c.category}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Staff & Users */}
                    {searchResults.users.length > 0 && (
                      <div>
                        <p className="text-[10px] font-black uppercase text-purple-600 tracking-wider mb-1 px-2">Staff & Users</p>
                        <div className="space-y-0.5">
                          {searchResults.users.map(u => (
                            <div
                              key={u.id}
                              onClick={() => handleSelectResult('/users')}
                              className="p-2 hover:bg-purple-50/80 rounded-xl cursor-pointer transition-colors flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <Users className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                                <span className="font-bold text-slate-800">{u.name}</span>
                                <span className="text-[10px] text-slate-400">({u.email})</span>
                              </div>
                              <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">{u.role}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Live Sessions */}
                    {searchResults.liveSessions.length > 0 && (
                      <div>
                        <p className="text-[10px] font-black uppercase text-emerald-600 tracking-wider mb-1 px-2">Live Sessions</p>
                        <div className="space-y-0.5">
                          {searchResults.liveSessions.map(s => (
                            <div
                              key={s.id}
                              onClick={() => handleSelectResult('/live-sessions')}
                              className="p-2 hover:bg-emerald-50/80 rounded-xl cursor-pointer transition-colors flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <Video className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                <span className="font-bold text-slate-800">{s.sessionTitle || s.title}</span>
                              </div>
                              <span className="text-[10px] font-semibold text-emerald-700">{s.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Assessments */}
                    {searchResults.assessments.length > 0 && (
                      <div>
                        <p className="text-[10px] font-black uppercase text-amber-600 tracking-wider mb-1 px-2">Assessments</p>
                        <div className="space-y-0.5">
                          {searchResults.assessments.map(a => (
                            <div
                              key={a.id}
                              onClick={() => handleSelectResult('/assessments')}
                              className="p-2 hover:bg-amber-50/80 rounded-xl cursor-pointer transition-colors flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <FileCheck2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                <span className="font-bold text-slate-800">{a.title}</span>
                              </div>
                              <span className="text-[10px] font-medium text-slate-400">{a.courseName}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Job Openings */}
                    {searchResults.jobs.length > 0 && (
                      <div>
                        <p className="text-[10px] font-black uppercase text-indigo-600 tracking-wider mb-1 px-2">Job Openings</p>
                        <div className="space-y-0.5">
                          {searchResults.jobs.map(j => (
                            <div
                              key={j.id}
                              onClick={() => handleSelectResult('/jobs')}
                              className="p-2 hover:bg-indigo-50/80 rounded-xl cursor-pointer transition-colors flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <Briefcase className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                                <span className="font-bold text-slate-800">{j.jobTitle}</span>
                                <span className="text-[10px] text-slate-500">at {j.company}</span>
                              </div>
                              <span className="text-[10px] font-medium text-slate-400">{j.location}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Coding Questions */}
                    {searchResults.codingQuestions.length > 0 && (
                      <div>
                        <p className="text-[10px] font-black uppercase text-rose-600 tracking-wider mb-1 px-2">Coding Questions</p>
                        <div className="space-y-0.5">
                          {searchResults.codingQuestions.map(cq => (
                            <div
                              key={cq.id}
                              onClick={() => handleSelectResult('/coding-questions')}
                              className="p-2 hover:bg-rose-50/80 rounded-xl cursor-pointer transition-colors flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <Code2 className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                                <span className="font-bold text-slate-800">{cq.title}</span>
                              </div>
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">{cq.difficulty}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No matching results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right side: Notifications, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-4">

          {/* Notifications Icon */}
          <div className="relative" ref={notifDropdownRef}>
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
