import React from 'react';
import { useLmsData } from '../../context/LmsDataContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Video,
  FileCheck2,
  Briefcase,
  FolderGit2,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  UserPlus,
  PlusCircle,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';

export function SuperAdminDashboard() {
  const { users, courses, liveSessions, assessments, jobs, recordings, activities } = useLmsData();
  const { currentRole, isSuperAdmin } = useAuth();

  const metrics = [
    {
      title: 'Total Users (Staff)',
      value: users.length,
      change: '+12% this month',
      trend: 'up',
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
      badgeColor: 'emerald',
      link: '/users'
    },
    {
      title: 'Published Courses',
      value: courses.length,
      change: '3 Active Modules',
      trend: 'up',
      icon: BookOpen,
      color: 'from-blue-800 to-slate-900',
      badgeColor: 'blue',
      link: '/courses'
    },
    {
      title: 'Live Class Links',
      value: liveSessions.length,
      change: '1 Live Soon',
      trend: 'up',
      icon: Video,
      color: 'from-sky-500 to-blue-600',
      badgeColor: 'amber',
      link: '/live-sessions'
    },
    {
      title: 'Assessments Published',
      value: assessments.length,
      change: '2 Published',
      trend: 'up',
      icon: FileCheck2,
      color: 'from-indigo-600 to-blue-800',
      badgeColor: 'purple',
      link: '/assessments'
    },
    {
      title: 'Job Openings Live',
      value: jobs.length,
      change: 'Active Recruitment',
      trend: 'up',
      icon: Briefcase,
      color: 'from-blue-500 to-cyan-600',
      badgeColor: 'sky',
      link: '/jobs'
    },
    {
      title: 'Recorded Lectures',
      value: recordings.length,
      change: 'Video Archives',
      trend: 'up',
      icon: FolderGit2,
      color: 'from-slate-800 to-blue-950',
      badgeColor: 'slate',
      link: '/library'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Executive Hero Banner with Glowing Orbs */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-blue-900/50">
        {/* Animated Glow Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            {isSuperAdmin && (
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="blue" className="bg-white/10 text-white border-white/20 backdrop-blur-md px-3 py-1">
                  Active Role: {currentRole}
                </Badge>
              </div>
            )}
            <h1 className="text-xl md:text-2xl font-bold tracking-normal text-white flex items-center gap-3">
              Admin Command Center Overview
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" /> Add New Course
            </Link>
            <Link
              to="/live-sessions"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl text-xs font-bold transition-all backdrop-blur-md hover:scale-[1.02]"
            >
              <Video className="w-4 h-4" /> Schedule Live Class
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid with Smooth Hover Lift & Glass Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((m) => (
          <Link
            key={m.title}
            to={m.link}
            className="group bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className={`p-3.5 rounded-2xl bg-gradient-to-tr ${m.color} text-white shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300`}>
                  <m.icon className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-1">
                  <Badge variant={m.badgeColor} className="text-[10px]">
                    <TrendingUp className="w-3 h-3 mr-1" /> {m.change}
                  </Badge>
                  <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-normal group-hover:text-blue-600 transition-colors">{m.value}</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{m.title}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>System Track</span>
              <span className="font-bold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Manage Module →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Two Column Section: Live Activities Log & Staff Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Platform Activities Feed */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-7 shadow-2xs">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" /> Platform Audit & Content Log
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time log of administrative updates</p>
            </div>
            <Badge variant="blue" className="px-3 py-1">Live Feed Log</Badge>
          </div>

          <div className="mt-5 space-y-4">
            {activities.map((act) => (
              <div key={act.id} className="p-3.5 flex items-start gap-4 hover:bg-blue-50/50 rounded-2xl transition-all border border-transparent hover:border-blue-100">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 mt-0.5 border border-blue-100/80 shadow-2xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-800 leading-snug">{act.text}</p>
                  <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Security & Shortcuts */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-7 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">Staff Role Permissions</h3>
            <p className="text-xs text-slate-500 font-medium mb-5 leading-relaxed">
              Configure fine-grained access policies for Super Admin, Admin, Manager, and Instructor roles.
            </p>

            <Link
              to="/permissions"
              className="w-full flex items-center justify-center gap-2 p-3.5 bg-blue-50/80 hover:bg-blue-100 text-blue-700 font-bold rounded-2xl text-xs border border-blue-200 transition-all shadow-2xs hover:shadow-md"
            >
              <ShieldAlert className="w-4 h-4" /> Staff Permission Matrix
            </Link>
          </div>

          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-7 text-white shadow-2xl border border-slate-800">
            <h4 className="text-sm font-bold text-blue-300">Quick User Directory</h4>
            <p className="text-xs text-slate-300 mt-1 mb-5 font-medium leading-relaxed">
              Add new staff members, update roles, or manage team credentials.
            </p>
            <Link
              to="/users"
              className="inline-flex items-center justify-center w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-blue-500/25 hover:scale-[1.02] gap-2"
            >
              <UserPlus className="w-4 h-4" /> Go to User Directory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
