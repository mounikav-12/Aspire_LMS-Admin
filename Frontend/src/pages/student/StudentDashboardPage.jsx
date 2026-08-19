import React, { useState } from 'react';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  Radio,
  RefreshCw,
  CheckCircle2,
  BookOpen,
  Video,
  Briefcase,
  FolderGit2,
  Code2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Zap,
  Activity,
  Calendar,
  Clock,
  Lock,
  Unlock,
  Layers,
  Brain
} from 'lucide-react';
import { getScheduleInfo } from '../../utils/milestoneUtils';

export function StudentDashboardPage() {
  const { courses, liveSessions, jobs, recordings, projects, milestones } = useLmsData();
  const { addToast } = useToast();

  const [isSyncing, setIsSyncing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('courses');

  const handleForceSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      addToast('Successfully synced data feed & milestone schedules with Student LMS Portal!', 'success');
    }, 1000);
  };

  const rawApiPayload = {
    api_version: 'v1.5.0',
    timestamp: new Date().toISOString(),
    status: 'ACTIVE_BROADCAST',
    endpoint: 'https://api.aspirelms.io/v1/student-feed',
    sync_frequency: 'REALTIME_WEBHOOK',
    data: {
      milestones_curriculum: (milestones?.stages || []).map((stg) => {
        const stageSched = getScheduleInfo(stg);
        return {
          id: stg.id,
          stage_number: stg.stageNumber,
          phase_tag: stg.phaseTag,
          title: stg.title,
          is_locked: stageSched.isLocked,
          is_unlocked: stageSched.isUnlocked,
          unlock_schedule: {
            has_schedule: stageSched.hasSchedule,
            unlock_date: stg.unlockDate || null,
            unlock_time: stg.unlockTime || null,
            unlock_datetime: stg.unlockDateTime || null,
            is_locked: stageSched.isLocked,
            is_unlocked: stageSched.isUnlocked,
            formatted_schedule: stageSched.hasSchedule ? stageSched.fullFormatted : null
          },
          subtopics: (stg.subtopics || []).map((sub) => {
            const subSched = getScheduleInfo(sub, stageSched);
            return {
              id: sub.id,
              title: sub.title,
              duration: sub.duration,
              is_locked: subSched.isLocked,
              is_unlocked: subSched.isUnlocked,
              unlock_schedule: {
                has_schedule: subSched.hasSchedule,
                unlock_date: sub.unlockDate || null,
                unlock_time: sub.unlockTime || null,
                unlock_datetime: sub.unlockDateTime || null,
                is_locked: subSched.isLocked,
                is_unlocked: subSched.isUnlocked,
                formatted_schedule: subSched.hasSchedule ? subSched.fullFormatted : null
              },
              modules_count: sub.modules?.length || 0,
              modules: (sub.modules || []).map((mod) => {
                const modSched = getScheduleInfo(mod, subSched);
                return {
                  id: mod.id,
                  title: mod.title,
                  is_locked: modSched.isLocked,
                  is_unlocked: modSched.isUnlocked,
                  unlock_schedule: {
                    has_schedule: modSched.hasSchedule,
                    unlock_date: mod.unlockDate || null,
                    unlock_time: mod.unlockTime || null,
                    unlock_datetime: mod.unlockDateTime || null,
                    is_locked: modSched.isLocked,
                    is_unlocked: modSched.isUnlocked,
                    formatted_schedule: modSched.hasSchedule ? modSched.fullFormatted : null
                  },
                  items_count: mod.items?.length || 0
                };
              })
            };
          })
        };
      }),
      courses: courses.map((c) => ({ id: c.id, title: c.title, category: c.category, topics_count: c.topics?.length || 0 })),
      projects: (projects || []).map((p) => ({ id: p.id, title: p.title, type: p.type || 'Mini', category: p.category, difficulty: p.difficulty, due_date: p.dueDate, tech_stack: p.techStack })),
      live_sessions: liveSessions.map((s) => ({ id: s.id, title: s.sessionTitle, meeting_link: s.meetingLink, schedule: s.date })),
      job_openings: jobs.map((j) => ({ id: j.id, company: j.company, title: j.jobTitle, location: j.location })),
      recordings: recordings.map((r) => ({ id: r.id, title: r.title, video_url: r.videoUrl }))
    }
  };

  const jsonString = JSON.stringify(rawApiPayload, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    addToast('API JSON payload copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-blue-900/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="emerald" className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30 backdrop-blur-md px-3 py-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1.5 inline-block" /> Live Pipeline Broadcast
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Radio className="w-8 h-8 text-blue-400" /> Student LMS API Feed & Milestones Scheduler
            </h1>
            <p className="text-blue-100/80 text-xs md:text-sm mt-2 max-w-xl leading-relaxed font-medium">
              Inspect real-time data payloads and scheduled stage & module release timestamps broadcast from this Admin Portal to the Student LMS.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="gradient"
              size="md"
              icon={RefreshCw}
              onClick={handleForceSync}
              disabled={isSyncing}
              className={`${isSyncing ? 'animate-spin' : ''}`}
            >
              {isSyncing ? 'Syncing Pipeline...' : 'Trigger Manual Sync'}
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Pipeline Connection</span>
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-xl font-black text-emerald-600 mt-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Live & Syncing
          </p>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">HTTP 200 OK • Webhook Active</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Milestone Stages</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{milestones?.stages?.length || 0} Stages</p>
          <span className="text-[10px] text-purple-600 font-bold mt-1 block">Date & Time Timers Active</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Live Class Links</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{liveSessions.length} Meeting Links</p>
          <span className="text-[10px] text-sky-600 font-bold mt-1 block">Google Meet / Zoom Active</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Job Feed Openings</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{jobs.length} Positions</p>
          <span className="text-[10px] text-indigo-600 font-bold mt-1 block">Corporate Placement Sync</span>
        </div>
      </div>

      {/* Milestones Scheduled Release Feed Section */}
      <div className="bg-white rounded-3xl border border-purple-200/80 p-6 shadow-md shadow-purple-600/5 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Milestones Curriculum & Scheduled Release Broadcast Feed
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Exact date and time schedules configured by Admin, synchronized to Main Student LMS.
              </p>
            </div>
          </div>
          <Badge variant="purple">GET /v1/student-feed#milestones</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(milestones?.stages || []).map((stage, idx) => {
            const sSched = getScheduleInfo(stage);
            const isStageLocked = sSched.isLocked;

            return (
              <div
                key={stage.id}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 space-y-3 hover:bg-white hover:border-purple-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                        {stage.stageNumber || `STAGE 0${idx + 1}`}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{stage.phaseTag}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 mt-1">{stage.title}</h4>
                  </div>

                  <div>
                    {sSched.hasSchedule ? (
                      sSched.isLocked ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Unlocks: {sSched.shortFormatted}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full">
                          <Calendar className="w-3 h-3 text-emerald-600" />
                          <span>Released: {sSched.dateFormatted}</span>
                        </span>
                      )
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border bg-slate-100 text-slate-600 border-slate-300">
                        🔒 Locked (No date)
                      </span>
                    )}
                  </div>
                </div>

                {/* Subtopic / Modules inside this Stage */}
                <div className="space-y-1.5 pt-1 border-t border-slate-200/60 text-xs">
                  {(stage.subtopics || []).map((sub, sIdx) => {
                    const subSched = getScheduleInfo(sub, sSched);
                    const isSubLocked = subSched.isLocked;

                    return (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100 text-slate-800"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-purple-600 w-4">{sIdx + 1}.</span>
                          <span className="font-semibold text-xs text-slate-800">{sub.title}</span>
                        </div>

                        <div>
                          {subSched.hasSchedule ? (
                            subSched.isTimeLocked ? (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5 text-amber-600" />
                                <span>{subSched.shortFormatted}</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Calendar className="w-2.5 h-2.5 text-emerald-600" />
                                <span>Released</span>
                              </span>
                            )
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">
                              {isSubLocked ? '🔒 Locked' : '🔓 Ready'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Feed Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Courseware Feed */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" /> Courseware Data Feed
            </h3>
            <Badge variant="blue">GET /v1/courses</Badge>
          </div>

          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/60 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{course.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Category: {course.category} • Instructor: {course.instructor}
                    </p>
                    <span className="text-[11px] font-bold text-blue-600 mt-1 inline-block">
                      {course.topics?.length ? course.topics.length : 0} Topic Modules Included
                    </span>
                  </div>
                  <Badge variant="emerald">Published</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Sessions & Meeting Links */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-sky-600" /> Live Class Links Feed
            </h3>
            <Badge variant="sky">GET /v1/live-sessions</Badge>
          </div>

          <div className="space-y-3">
            {liveSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/60 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{session.sessionTitle}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Schedule: {session.date} ({session.time})
                    </p>
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono font-bold text-blue-600 hover:underline mt-1.5 inline-flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100"
                    >
                      {session.meetingLink} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <Badge variant={session.status === 'Completed' ? 'slate' : 'rose'}>{session.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Raw JSON API Payload Inspector */}
      <div className="bg-slate-950 rounded-3xl p-7 text-white shadow-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-black text-blue-400 flex items-center gap-2">
              <Code2 className="w-5 h-5" /> Live JSON API Feed Output (Broadcast to Student LMS)
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-1">GET https://api.aspirelms.io/v1/student-feed</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={copied ? Check : Copy}
            onClick={handleCopyJson}
            className="bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800 hover:text-white"
          >
            {copied ? 'Copied JSON' : 'Copy API Payload'}
          </Button>
        </div>

        <div className="max-h-96 overflow-y-auto rounded-2xl bg-slate-900/90 p-5 border border-slate-800/80">
          <pre className="font-mono text-xs text-blue-300 leading-relaxed whitespace-pre-wrap">
            {jsonString}
          </pre>
        </div>
      </div>
    </div>
  );
}
