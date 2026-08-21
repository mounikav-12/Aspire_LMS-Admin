import React, { useState } from 'react';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { BatchFilterSelector } from '../../components/common/BatchFilterSelector';
import {
  Video,
  Plus,
  Search,
  Calendar,
  Clock,
  ExternalLink,
  UserCheck,
  Edit2,
  Trash2,
  Tv2,
  Lock,
  Unlock,
  Layers,
  Bookmark,
  CheckSquare,
  Square
} from 'lucide-react';

const DEFAULT_STAGES = [
  {
    id: 'stage-1',
    title: 'Stage 1: Front End + Repository',
    subtopics: [
      { id: 'git-github', title: 'Git & GitHub Version Control', modules: [{ id: 'mod-1', title: 'Git Staging & Remotes' }] },
      { id: 'html5', title: 'HTML5 & Semantic Structure', modules: [{ id: 'mod-2', title: 'Semantic Tags & Accessibility' }] },
      { id: 'css3-basics', title: 'CSS3 Fundamentals & Layouts', modules: [{ id: 'mod-3', title: 'Flexbox & Grid Systems' }] },
      { id: 'js-essentials', title: 'JavaScript Essentials', modules: [{ id: 'mod-4', title: 'ES6+ Syntax & DOM Manipulation' }] }
    ]
  },
  {
    id: 'stage-2',
    title: 'Stage 2: Backend + DSA',
    subtopics: [
      { id: 'nodejs', title: 'Node.js & Express API', modules: [{ id: 'mod-5', title: 'REST Endpoints & Middleware' }] },
      { id: 'postgres', title: 'PostgreSQL & Database Design', modules: [{ id: 'mod-6', title: 'SQL Queries & Indexing' }] },
      { id: 'dsa-arrays', title: 'DSA: Arrays & Strings', modules: [{ id: 'mod-7', title: 'Two Pointers & Sliding Window' }] },
      { id: 'dsa-trees', title: 'DSA: Trees & Graphs', modules: [{ id: 'mod-8', title: 'BFS & DFS Traversals' }] }
    ]
  },
  {
    id: 'stage-3',
    title: 'Stage 3: AI',
    subtopics: [
      { id: 'ml-foundations', title: 'Machine Learning Foundations', modules: [{ id: 'mod-9', title: 'Supervised Learning & Regression' }] },
      { id: 'deep-learning', title: 'Deep Learning & Neural Networks', modules: [{ id: 'mod-10', title: 'PyTorch Model Architecture' }] },
      { id: 'generative-ai', title: 'Generative AI & LLMs', modules: [{ id: 'mod-11', title: 'RAG Systems & Prompting' }] }
    ]
  },
  {
    id: 'stage-4',
    title: 'Stage 4: Career Launchpad',
    subtopics: [
      { id: 'resume-building', title: 'Resume Building & Portfolio', modules: [{ id: 'mod-12', title: 'GitHub Portfolio Setup' }] },
      { id: 'mock-interviews', title: 'Mock Interviews & Grooming', modules: [{ id: 'mod-13', title: 'Technical Interview Practice' }] }
    ]
  }
];

export function LiveSessionListPage() {
  const {
    courses = [],
    liveSessions = [],
    addLiveSession,
    updateLiveSession,
    deleteLiveSession,
    toggleLiveSessionLock,
    activeBatchFilter,
    setActiveBatchFilter,
    milestones,
    availableBatches
  } = useLmsData();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    programName: 'Senior Engineering Cohort',
    technology: 'Git',
    sessionTitle: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 - 11:30 AM',
    meetingLink: 'https://meet.google.com/aspire-lms-live',
    instructor: 'Sara Devi',
    description: '',
    courseId: courses[0]?.id || '',
    courseName: courses[0]?.title || '',
    stageId: '',
    stageName: '',
    subtopicId: '',
    subtopicName: '',
    moduleId: '',
    moduleName: ''
  });

  const selectedCourseObj = courses.find((c) => c.id === formData.courseId) || courses[0];
  const stagesList =
    selectedCourseObj?.topics && selectedCourseObj.topics.length > 0
      ? selectedCourseObj.topics
      : milestones?.stages && milestones.stages.length > 0
      ? milestones.stages
      : DEFAULT_STAGES;

  const allWeekdayBatchesList = (
    availableBatches && availableBatches.length > 0
      ? availableBatches.filter(
          (b) => b.startsWith('A26W') && !b.startsWith('A26S') && !b.startsWith('A26WE')
        )
      : ['A26W1', 'A26W2', 'A26W3']
  );
  const allWeekendBatchesList = (
    availableBatches && availableBatches.length > 0
      ? availableBatches
          .filter((b) => b.startsWith('A26S') || b.startsWith('A26WE'))
          .map((b) => b.replace(/^A26WE/, 'A26S'))
          .filter((b, i, arr) => arr.indexOf(b) === i)
      : ['A26S1', 'A26S2']
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [deletingSession, setDeletingSession] = useState(null);

  // Batch Selection State for Modal
  const [batchActiveTab, setBatchActiveTab] = useState('Weekdays'); // 'Weekdays' | 'Weekends'
  const [selectedWeekdayBatches, setSelectedWeekdayBatches] = useState(allWeekdayBatchesList);
  const [selectedWeekendBatches, setSelectedWeekendBatches] = useState(allWeekendBatchesList);

  const handleOpenAddModal = () => {
    const firstStage = stagesList[0];
    const firstSub = firstStage?.subtopics?.[0];
    const firstMod = firstSub?.modules?.[0];

    setBatchActiveTab('Weekdays');
    setSelectedWeekdayBatches(allWeekdayBatchesList);
    setSelectedWeekendBatches(allWeekendBatchesList);

    setFormData({
      programName: 'Senior Engineering Cohort',
      technology: 'Git',
      sessionTitle: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 - 11:30 AM',
      meetingLink: 'https://meet.google.com/aspire-lms-live',
      instructor: 'Sara Devi',
      description: '',
      courseId: courses[0]?.id || '',
      courseName: courses[0]?.title || '',
      stageId: firstStage?.id || '',
      stageName: firstStage?.title || '',
      subtopicId: firstSub?.id || '',
      subtopicName: firstSub?.title || '',
      moduleId: firstMod?.id || '',
      moduleName: firstMod?.title || ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (sess) => {
    setEditingSession(sess);
    setBatchActiveTab('Weekdays');

    let initialWd = [];
    let initialWe = [];
    if (Array.isArray(sess.targetBatches) && sess.targetBatches.length > 0) {
      initialWd = sess.targetBatches.filter(
        (b) => b.startsWith('A26W') && !b.startsWith('A26S') && !b.startsWith('A26WE')
      );
      initialWe = sess.targetBatches.filter((b) => b.startsWith('A26S') || b.startsWith('A26WE'));
    } else if (typeof sess.targetBatch === 'string' && sess.targetBatch && sess.targetBatch !== 'All Batches') {
      const parsed = sess.targetBatch.split(',').map((s) => s.trim());
      initialWd = parsed.filter(
        (b) => b.startsWith('A26W') && !b.startsWith('A26S') && !b.startsWith('A26WE')
      );
      initialWe = parsed.filter((b) => b.startsWith('A26S') || b.startsWith('A26WE'));
    }
    if (initialWd.length === 0 && initialWe.length === 0) {
      initialWd = allWeekdayBatchesList;
      initialWe = allWeekendBatchesList;
    }
    setSelectedWeekdayBatches(initialWd);
    setSelectedWeekendBatches(initialWe);

    setFormData({
      programName: sess.programName || 'Senior Engineering Cohort',
      technology: sess.technology || 'Git',
      sessionTitle: sess.sessionTitle || sess.title || '',
      date: sess.date || '',
      time: sess.time || '',
      meetingLink: sess.meetingLink || 'https://meet.google.com/aspire-lms-live',
      instructor: sess.instructor || 'Sara Devi',
      description: sess.description || '',
      courseId: sess.courseId || courses[0]?.id || '',
      courseName: sess.courseName || courses.find((c) => c.id === sess.courseId)?.title || '',
      stageId: sess.stageId || stagesList[0]?.id || '',
      stageName: sess.stageName || stagesList[0]?.title || '',
      subtopicId: sess.subtopicId || stagesList[0]?.subtopics?.[0]?.id || '',
      subtopicName: sess.subtopicName || stagesList[0]?.subtopics?.[0]?.title || '',
      moduleId: sess.moduleId || stagesList[0]?.subtopics?.[0]?.modules?.[0]?.id || '',
      moduleName: sess.moduleName || stagesList[0]?.subtopics?.[0]?.modules?.[0]?.title || ''
    });
  };

  const handleSaveSession = (e) => {
    e.preventDefault();
    if (!formData.sessionTitle || !formData.meetingLink) {
      addToast('Please fill in session title and meeting link', 'error');
      return;
    }

    // Resolve stage and subtopic titles
    const selectedCourse = courses.find((c) => c.id === formData.courseId) || courses[0];
    const currentStageObj = stagesList.find((s) => s.id === formData.stageId) || stagesList[0];
    const currentSubObj = currentStageObj?.subtopics?.find((st) => st.id === formData.subtopicId) || currentStageObj?.subtopics?.[0];
    const currentModObj = currentSubObj?.modules?.find((m) => m.id === formData.moduleId) || currentSubObj?.modules?.[0];

    const allBatches = [...selectedWeekdayBatches, ...selectedWeekendBatches];
    const targetBatchStr = allBatches.length > 0 ? allBatches.join(', ') : 'All Batches';

    const sessionPayload = {
      ...formData,
      courseId: selectedCourse?.id || formData.courseId,
      courseName: selectedCourse?.title || formData.courseName,
      stageName: currentStageObj?.title || formData.stageName,
      subtopicName: currentSubObj?.title || formData.subtopicName,
      moduleName: currentModObj?.title || formData.moduleName,
      targetBatches: allBatches,
      targetBatch: targetBatchStr
    };

    if (editingSession) {
      updateLiveSession(editingSession.id, sessionPayload);
      addToast(`Updated live session: "${formData.sessionTitle}"`, 'success');
      setEditingSession(null);
    } else {
      addLiveSession(sessionPayload);
      addToast(`Scheduled live session: "${formData.sessionTitle}" & linked to Milestone!`, 'success');
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingSession) {
      deleteLiveSession(deletingSession.id);
      addToast(`Cancelled live session "${deletingSession.sessionTitle}"`, 'info');
      setDeletingSession(null);
    }
  };

  const filteredSessions = liveSessions.filter((s) => {
    const matchesSearch =
      s.sessionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.technology.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Video className="w-7 h-7 text-blue-600" /> Live Sessions & Meeting Rooms
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Schedule live webinars, broadcast Google Meet / Zoom links, and manage instructor class calendars.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">

          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAddModal}>
            Schedule New Session
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search live sessions by title, tech stack, instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="w-full md:w-56">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'Live Soon', label: 'Live Soon' },
              { value: 'Upcoming', label: 'Upcoming' },
              { value: 'Completed', label: 'Completed' }
            ]}
          />
        </div>
      </div>

      {/* Live Session Grid Cards */}
      {filteredSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((sess) => (
            <div
              key={sess.id}
              className="group bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1.5 p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Badges & Actions */}
                <div className="flex items-center justify-between">
                  <Badge variant="blue" className="px-3 py-1">
                    {sess.technology}
                  </Badge>

                  <div className="flex items-center gap-2">
                    {sess.isLocked ? (
                      <Badge variant="amber" className="px-3 py-1 bg-amber-50 text-amber-700 border-amber-200">
                        <Lock className="w-3 h-3 mr-1 inline" /> Locked
                      </Badge>
                    ) : (
                      <Badge variant={sess.status === 'Live Soon' ? 'rose' : sess.status === 'Completed' ? 'slate' : 'sky'}>
                        {sess.status === 'Live Soon' && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-1 inline-block" />}
                        {sess.status}
                      </Badge>
                    )}

                    <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl">
                      <button
                        onClick={() => {
                          toggleLiveSessionLock(sess.id);
                          addToast(sess.isLocked ? `Unlocked session: "${sess.sessionTitle}"` : `Locked session: "${sess.sessionTitle}"`, 'info');
                        }}
                        className={`p-1 rounded-lg transition-colors cursor-pointer ${
                          sess.isLocked
                            ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                            : 'text-slate-400 hover:text-amber-600 hover:bg-white'
                        }`}
                        title={sess.isLocked ? "Unlock Session" : "Lock Session"}
                      >
                        {sess.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(sess)}
                        className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                        title="Edit Session"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingSession(sess)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                        title="Cancel Session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Session Title */}
                <div>
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    {sess.programName}
                  </span>
                  <h3 className="font-black text-slate-900 text-base group-hover:text-blue-600 transition-colors leading-snug">
                    {sess.sessionTitle}
                  </h3>
                </div>

                {/* Date & Time */}
                <div className="space-y-2 pt-1 text-xs text-slate-600 font-semibold bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>{sess.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    <span>{sess.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 pt-1 border-t border-slate-200/60">
                    <UserCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Instructor: <strong className="text-slate-800 font-bold">{sess.instructor}</strong></span>
                  </div>
                  {sess.courseName && (
                    <div className="flex items-center gap-1.5 text-[11px] text-blue-700 bg-blue-50/90 px-2.5 py-1 rounded-xl border border-blue-200/70 font-bold">
                      <Bookmark className="w-3 h-3 text-blue-600 flex-shrink-0" />
                      <span className="truncate">Course: {sess.courseName}</span>
                    </div>
                  )}
                  {(sess.subtopicName || sess.moduleName) && (
                    <div className="flex items-center gap-1.5 text-[11px] text-purple-700 bg-purple-50/90 px-2.5 py-1 rounded-xl border border-purple-200/70 font-bold">
                      <Layers className="w-3 h-3 text-purple-600 flex-shrink-0" />
                      <span className="truncate">Milestone: {sess.subtopicName || sess.moduleName}</span>
                    </div>
                  )}
                  {sess.targetBatch && (
                    <div className="flex items-center gap-1.5 text-[11px] text-indigo-700 bg-indigo-50/90 px-2.5 py-1 rounded-xl border border-indigo-200/70 font-bold">
                      <Calendar className="w-3 h-3 text-indigo-600 flex-shrink-0" />
                      <span className="truncate">Batches: {sess.targetBatch}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                  {sess.description}
                </p>
              </div>

              {/* Meeting Room Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                {sess.isLocked ? (
                  <button
                    disabled
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-400 font-bold rounded-xl text-xs border border-slate-200 cursor-not-allowed"
                  >
                    <Lock className="w-4 h-4 text-amber-500" /> Meeting Room Locked
                  </button>
                ) : (
                  <a
                    href={sess.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
                  >
                    <Tv2 className="w-4 h-4" /> Open Meeting Room <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Live Sessions Found"
          description="Schedule live webinars or broadcast meeting room links."
          actionLabel="Schedule Live Class"
          onAction={handleOpenAddModal}
        />
      )}

      {/* Add / Edit Session Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingSession}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingSession(null);
        }}
        title={editingSession ? 'Edit Live Session' : 'Schedule Live Class Session'}
        subtitle="Configure session title, tech track, meeting room link, and date/time"
        maxWidth="max-w-6xl"
      >
        <form onSubmit={handleSaveSession} className="space-y-4">
          {/* 1. Session Title & Technology Track Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="md:col-span-2">
              <Input
                label="Session Title"
                placeholder="e.g. Advanced Git Commands: Staging, Committing & Remotes"
                value={formData.sessionTitle}
                onChange={(e) => setFormData({ ...formData, sessionTitle: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                label="Technology Track"
                placeholder="e.g. Git / Python / React"
                value={formData.technology}
                onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
              />
            </div>
          </div>

          {/* 2. CASCADING MILESTONE CURRICULUM LOCATION MAPPING (2x2 Grid) */}
          {(() => {
            const currentStageObj = stagesList.find((s) => s.id === formData.stageId) || stagesList[0];
            const currentSubtopicsArr = currentStageObj?.subtopics || [];
            const currentSubtopicObj = currentSubtopicsArr.find((st) => st.id === formData.subtopicId) || currentSubtopicsArr[0];
            const currentInnerModules = (currentSubtopicObj && Array.isArray(currentSubtopicObj.modules) && currentSubtopicObj.modules.length > 0)
              ? currentSubtopicObj.modules
              : [{ id: currentSubtopicObj?.id || 'mod-live-1', title: currentSubtopicObj?.title || 'Live Sessions Module' }];

            return (
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                {/* Header */}
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-purple-100/80">
                  <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Curriculum Location & Milestone Topic Mapping
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Map this live session to a specific course, milestone stage, subtopic, and topic module
                    </p>
                  </div>
                </div>

                {/* 2x2 Structured Step Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Step 1: Course Track */}
                  <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-purple-100/90 shadow-2xs">
                    <Select
                      label="1. Course Track"
                      value={formData.courseId}
                      onChange={(e) => {
                        const newCourseId = e.target.value;
                        const selectedC = courses.find((c) => c.id === newCourseId);
                        const newStages = selectedC?.topics && selectedC.topics.length > 0
                          ? selectedC.topics
                          : milestones?.stages && milestones.stages.length > 0
                          ? milestones.stages
                          : DEFAULT_STAGES;
                        const firstStage = newStages[0];
                        const firstSub = firstStage?.subtopics?.[0];
                        const firstMod = firstSub?.modules?.[0];
                        setFormData({
                          ...formData,
                          courseId: newCourseId,
                          courseName: selectedC?.title || '',
                          stageId: firstStage?.id || '',
                          stageName: firstStage?.title || '',
                          subtopicId: firstSub?.id || '',
                          subtopicName: firstSub?.title || '',
                          moduleId: firstMod?.id || '',
                          moduleName: firstMod?.title || ''
                        });
                      }}
                      options={courses.map((c) => ({ value: c.id, label: c.title }))}
                    />
                  </div>

                  {/* Step 2: Course Module / Stage */}
                  <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-purple-100/90 shadow-2xs">
                    <Select
                      label="2. Course Module / Stage"
                      value={formData.stageId || currentStageObj?.id || ''}
                      onChange={(e) => {
                        const newStageId = e.target.value;
                        const newStage = stagesList.find((s) => s.id === newStageId) || stagesList[0];
                        const firstSub = newStage?.subtopics?.[0];
                        const firstMod = firstSub?.modules?.[0];
                        setFormData({
                          ...formData,
                          stageId: newStageId,
                          stageName: newStage?.title || '',
                          subtopicId: firstSub?.id || '',
                          subtopicName: firstSub?.title || '',
                          moduleId: firstMod?.id || '',
                          moduleName: firstMod?.title || ''
                        });
                      }}
                      options={stagesList.map((stg) => ({
                        value: stg.id,
                        label: stg.title
                      }))}
                    />
                  </div>

                  {/* Step 3: Milestone Subtopic */}
                  <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-purple-100/90 shadow-2xs">
                    <Select
                      label="3. Milestone Subtopic"
                      value={formData.subtopicId || currentSubtopicObj?.id || ''}
                      onChange={(e) => {
                        const newSubId = e.target.value;
                        const targetStage = stagesList.find((s) => s.id === (formData.stageId || currentStageObj?.id)) || stagesList[0];
                        const targetSub = targetStage?.subtopics?.find((st) => st.id === newSubId) || targetStage?.subtopics?.[0];
                        const firstMod = targetSub?.modules?.[0];
                        setFormData({
                          ...formData,
                          subtopicId: newSubId,
                          subtopicName: targetSub?.title || '',
                          moduleId: firstMod?.id || '',
                          moduleName: firstMod?.title || ''
                        });
                      }}
                      options={currentSubtopicsArr.map((sub) => ({
                        value: sub.id,
                        label: sub.title
                      }))}
                    />
                  </div>

                  {/* Step 4: Specific Inner Topic */}
                  <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-purple-100/90 shadow-2xs">
                    <Select
                      label="4. Specific Inner Topic"
                      value={formData.moduleId}
                      onChange={(e) => {
                        const newModId = e.target.value;
                        const targetStage = stagesList.find((s) => s.id === formData.stageId) || stagesList[0];
                        const targetSub = targetStage?.subtopics?.find((st) => st.id === formData.subtopicId) || targetStage?.subtopics?.[0];
                        const targetMod = targetSub?.modules?.find((m) => m.id === newModId) || targetSub?.modules?.[0];
                        setFormData({
                          ...formData,
                          moduleId: newModId,
                          moduleName: targetMod?.title || ''
                        });
                      }}
                      options={currentInnerModules.map((mod) => ({
                        value: mod.id || mod.title,
                        label: mod.title
                      }))}
                    />
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 3. BATCH ALLOCATION DROPDOWNS: WEEKDAY & WEEKEND */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-purple-100/90 shadow-2xs">
              <Select
                label="Weekday Batches"
                value={
                  selectedWeekdayBatches.length === 0
                    ? 'NONE'
                    : selectedWeekdayBatches.length === allWeekdayBatchesList.length
                    ? 'ALL'
                    : selectedWeekdayBatches.length === 1
                    ? selectedWeekdayBatches[0]
                    : selectedWeekdayBatches.join(',')
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'ALL') {
                    setSelectedWeekdayBatches(allWeekdayBatchesList);
                  } else if (val === 'NONE') {
                    setSelectedWeekdayBatches([]);
                  } else {
                    setSelectedWeekdayBatches(val.split(',').filter(Boolean));
                  }
                }}
                options={[
                  { value: 'ALL', label: 'All Weekday Batches' },
                  ...allWeekdayBatchesList.map((b) => ({ value: b, label: `Weekday Batch ${b}` })),
                  ...(selectedWeekdayBatches.length > 1 && selectedWeekdayBatches.length < allWeekdayBatchesList.length
                    ? [{ value: selectedWeekdayBatches.join(','), label: `Selected: ${selectedWeekdayBatches.join(', ')}` }]
                    : []),
                  { value: 'NONE', label: 'None (Exclude Weekday Batches)' }
                ]}
              />
            </div>

            <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-purple-100/90 shadow-2xs">
              <Select
                label="Weekend Batches"
                value={
                  selectedWeekendBatches.length === 0
                    ? 'NONE'
                    : selectedWeekendBatches.length === allWeekendBatchesList.length
                    ? 'ALL'
                    : selectedWeekendBatches.length === 1
                    ? selectedWeekendBatches[0]
                    : selectedWeekendBatches.join(',')
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'ALL') {
                    setSelectedWeekendBatches(allWeekendBatchesList);
                  } else if (val === 'NONE') {
                    setSelectedWeekendBatches([]);
                  } else {
                    setSelectedWeekendBatches(val.split(',').filter(Boolean));
                  }
                }}
                options={[
                  { value: 'ALL', label: 'All Weekend Batches' },
                  ...allWeekendBatchesList.map((b) => ({ value: b, label: `Weekend Batch ${b}` })),
                  ...(selectedWeekendBatches.length > 1 && selectedWeekendBatches.length < allWeekendBatchesList.length
                    ? [{ value: selectedWeekendBatches.join(','), label: `Selected: ${selectedWeekendBatches.join(', ')}` }]
                    : []),
                  { value: 'NONE', label: 'None (Exclude Weekend Batches)' }
                ]}
              />
            </div>
          </div>

          {/* 4. Cohort, Date, Time & Instructor Grid (4 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <Input
              label="Cohort / Program"
              placeholder="e.g. Full Stack Cohort"
              value={formData.programName}
              onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
            />

            <Input
              label="Instructor Name"
              placeholder="e.g. Sara Devi"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            />

            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />

            <Input
              label="Time Slot"
              placeholder="e.g. 14:30 - 16:00"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>

          {/* 5. Meeting Room URL & Session Agenda (2 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <Input
              label="Meeting Room URL (Google Meet, Zoom, MS Teams)"
              placeholder="https://meet.google.com/aspire-lms-live"
              value={formData.meetingLink}
              onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold text-slate-700 tracking-wider uppercase">
                Session Agenda / Overview
              </label>
              <textarea
                rows={2}
                placeholder="Detail session objectives, lab prerequisites, key takeaways..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50/60 hover:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-2xs resize-none"
              />
            </div>
          </div>

          {/* 6. Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingSession(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingSession ? 'Save Session' : 'Schedule Session'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingSession}
        onClose={() => setDeletingSession(null)}
        onConfirm={handleDeleteConfirm}
        title="Cancel Live Session"
        message={`Are you sure you want to cancel "${deletingSession?.sessionTitle}"?`}
        confirmText="Cancel Session"
      />
    </div>
  );
}
