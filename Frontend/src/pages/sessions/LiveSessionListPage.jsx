import React, { useState, useMemo } from 'react';
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
  Square,
  Sparkles,
  Code,
  FileCheck,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react';

export const getSubtopicsForStage = (stage) => {
  if (!stage) return [];
  if (Array.isArray(stage.subtopics) && stage.subtopics.length > 0) return stage.subtopics;
  if (Array.isArray(stage.modules) && stage.modules.length > 0) return stage.modules;
  return [];
};

export const getInnerModulesForSubtopic = (subtopic) => {
  if (!subtopic) return [];
  if (Array.isArray(subtopic.lessons) && subtopic.lessons.length > 0) return subtopic.lessons;
  if (Array.isArray(subtopic.modules) && subtopic.modules.length > 0) return subtopic.modules;
  if (Array.isArray(subtopic.items) && subtopic.items.length > 0) return subtopic.items;
  return [{ id: subtopic.id || 'mod-1', title: subtopic.title || 'General Module' }];
};

export const getModuleTopicsForSession = (sess, stagesList) => {
  if (!sess) return [];
  const cleanId = (id) => String(id || '').replace(/-(w|s)$/i, '').toLowerCase().trim();
  const cleanStr = (str) => String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();

  const sessModId = cleanId(sess.moduleId || sess.module_id);
  const sessTitle = cleanStr(sess.sessionTitle || sess.session_title || sess.title);
  const sessModName = cleanStr(sess.moduleName || sess.module_name);

  if (Array.isArray(stagesList)) {
    for (const stg of stagesList) {
      for (const sub of (stg.subtopics || [])) {
        for (const mod of (sub.modules || [])) {
          const modIdClean = cleanId(mod.id);
          const modTitleClean = cleanStr(mod.title);

          const isModIdMatch = sessModId && modIdClean && (sessModId === modIdClean || cleanId(sess.id) === modIdClean);
          const isModTitleMatch = sessModName && modTitleClean && (sessModName === modTitleClean || (sessModName.length > 5 && (sessModName.includes(modTitleClean) || modTitleClean.includes(sessModName))));
          const isSessTitleMatch = sessTitle && modTitleClean && (sessTitle === modTitleClean || (sessTitle.length > 5 && (sessTitle.includes(modTitleClean) || modTitleClean.includes(sessTitle))));

          if (isModIdMatch || isModTitleMatch || isSessTitleMatch) {
            if (Array.isArray(mod.topics) && mod.topics.length > 0) {
              return mod.topics;
            }
            if (Array.isArray(mod.items) && mod.items.length > 0) {
              return mod.items;
            }
            return [];
          }
        }
      }
    }
  }

  return Array.isArray(sess.topics) ? sess.topics : [];
};

export const DEFAULT_STAGES = [];

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
    availableBatches,
    addLearningItem,
    updateLearningItem,
    deleteLearningItem,
    toggleModuleLock
  } = useLmsData();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    programName: '',
    technology: '',
    sessionTitle: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    meetingLink: '',
    instructor: '',
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
    milestones?.stages && milestones.stages.length > 0
      ? milestones.stages
      : selectedCourseObj?.topics && selectedCourseObj.topics.length > 0
      ? selectedCourseObj.topics
      : DEFAULT_STAGES;

  const allWeekdayBatchesList = (
    availableBatches && availableBatches.length > 0
      ? availableBatches.filter(
          (b) => b.startsWith('A26W') && !b.startsWith('A26S') && !b.startsWith('A26WE')
        )
      : []
  );
  const allWeekendBatchesList = (
    availableBatches && availableBatches.length > 0
      ? availableBatches
          .filter((b) => b.startsWith('A26S') || b.startsWith('A26WE'))
          .map((b) => b.replace(/^A26WE/, 'A26S'))
          .filter((b, i, arr) => arr.indexOf(b) === i)
      : []
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

  const handleAddTopicRow = () => {
    setFormData((prev) => ({
      ...prev,
      topics: [
        ...(prev.topics || []),
        { id: `top-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, title: '', description: '' }
      ]
    }));
  };

  const handleRemoveTopicRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      topics: (prev.topics || []).filter((_, i) => i !== index)
    }));
  };

  const handleTopicChange = (index, field, value) => {
    setFormData((prev) => {
      const nextTopics = [...(prev.topics || [])];
      nextTopics[index] = { ...nextTopics[index], [field]: value };
      return { ...prev, topics: nextTopics };
    });
  };

  const handleOpenAddModal = () => {
    const firstStage = stagesList[0];
    const stageSubs = getSubtopicsForStage(firstStage);
    const firstSub = stageSubs[0];
    const subLessons = getInnerModulesForSubtopic(firstSub);
    const firstMod = subLessons[0];
    const existingTopics = (firstMod?.topics || []).filter((t) => t && t.title && t.title.trim());

    const defaultTopics =
      existingTopics.length > 0
        ? existingTopics.map((t) => ({
            id: t.id || `top-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            title: t.title,
            description: t.description || t.agenda || t.overview || ''
          }))
        : [
            {
              id: `top-${Date.now()}-1`,
              title: '',
              description: ''
            }
          ];

    setBatchActiveTab('Weekdays');
    setSelectedWeekdayBatches(allWeekdayBatchesList);
    setSelectedWeekendBatches(allWeekendBatchesList);

    setFormData({
      programName: '',
      technology: '',
      sessionTitle: firstMod?.title || '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      meetingLink: '',
      instructor: '',
      description: '',
      courseId: courses[0]?.id || '',
      courseName: courses[0]?.title || '',
      stageId: firstStage?.id || '',
      stageName: firstStage?.title || '',
      subtopicId: firstSub?.id || '',
      subtopicName: firstSub?.title || '',
      moduleId: firstMod?.id || '',
      moduleName: firstMod?.title || '',
      topics: defaultTopics
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

    const stripSuffix = (str) => String(str || '').replace(/-(w|s)$/i, '').trim();
    const cleanNorm = (str) => String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();

    const targetStage = stagesList.find((s) => s.id === sess.stageId || stripSuffix(s.id) === stripSuffix(sess.stageId) || cleanNorm(s.title) === cleanNorm(sess.stageName)) || stagesList[0];
    const stageSubs = getSubtopicsForStage(targetStage);
    const targetSub = stageSubs.find((st) => st.id === sess.subtopicId || stripSuffix(st.id) === stripSuffix(sess.subtopicId) || cleanNorm(st.title) === cleanNorm(sess.subtopicName)) || stageSubs[0];
    const subLessons = getInnerModulesForSubtopic(targetSub);
    const targetMod = subLessons.find((m) => m.id === sess.moduleId || stripSuffix(m.id) === stripSuffix(sess.moduleId) || cleanNorm(m.title) === cleanNorm(sess.moduleName || sess.sessionTitle)) || subLessons[0];

    // Preload topics from targetMod.topics (authoritative dynamic topics from Milestones), sess.topics, or targetMod.items
    let loadedTopics = [];
    if (Array.isArray(targetMod?.topics) && targetMod.topics.length > 0) {
      loadedTopics = targetMod.topics.map((t, idx) => ({
        id: t.id || `top-${Date.now()}-${idx}`,
        title: t.title || '',
        description: t.description || t.agenda || t.overview || ''
      }));
    } else if (Array.isArray(sess.topics) && sess.topics.length > 0) {
      loadedTopics = sess.topics.map((t, idx) => ({
        id: t.id || `top-${Date.now()}-${idx}`,
        title: t.title || '',
        description: t.description || t.agenda || t.overview || ''
      }));
    } else if (Array.isArray(targetMod?.items) && targetMod.items.length > 0) {
      loadedTopics = targetMod.items
        .filter((it) => it.type === 'LIVE CLASS' || !it.type)
        .map((it, idx) => ({
          id: it.id || `top-${Date.now()}-${idx}`,
          title: it.title || '',
          description: it.description || it.agenda || it.overview || ''
        }));
    } else {
      loadedTopics = [
        { id: `top-${Date.now()}-1`, title: sess.sessionTitle || '', description: sess.description || '' }
      ];
    }

    setFormData({
      programName: sess.programName || '',
      technology: sess.technology || '',
      sessionTitle: sess.sessionTitle || sess.title || '',
      date: sess.date || '',
      time: sess.time || '',
      meetingLink: sess.meetingLink || '',
      instructor: sess.instructor || '',
      description: sess.description || '',
      courseId: sess.courseId || courses[0]?.id || '',
      courseName: sess.courseName || courses.find((c) => c.id === sess.courseId)?.title || '',
      stageId: targetStage?.id || '',
      stageName: targetStage?.title || '',
      subtopicId: targetSub?.id || '',
      subtopicName: targetSub?.title || '',
      moduleId: targetMod?.id || '',
      moduleName: targetMod?.title || '',
      topics: loadedTopics
    });
  };

  const handleSaveSession = (e) => {
    e.preventDefault();
    if (!formData.sessionTitle || !formData.meetingLink) {
      addToast('Please fill in session title and meeting link', 'error');
      return;
    }

    const selectedCourse = courses.find((c) => c.id === formData.courseId) || courses[0];
    const currentStageObj = stagesList.find((s) => s.id === formData.stageId || s.title === formData.stageName) || stagesList[0];
    const stageSubs = getSubtopicsForStage(currentStageObj);
    const currentSubObj = stageSubs.find((st) => st.id === formData.subtopicId || st.title === formData.subtopicName) || stageSubs[0];
    const subLessons = getInnerModulesForSubtopic(currentSubObj);
    const currentModObj = subLessons.find((m) => m.id === formData.moduleId || m.title === formData.moduleName) || subLessons[0];

    const allBatches = [...selectedWeekdayBatches, ...selectedWeekendBatches];
    const targetBatchStr = allBatches.length > 0 ? allBatches.join(', ') : 'All Batches';

    const cleanedTopics = (formData.topics || [])
      .filter((t) => t && t.title && t.title.trim())
      .map((t, idx) => ({
        id: t.id || `top-${Date.now()}-${idx + 1}`,
        title: t.title.trim(),
        description: (t.description || t.agenda || t.overview || '').trim(),
        agenda: (t.description || t.agenda || t.overview || '').trim(),
        overview: (t.description || t.agenda || t.overview || '').trim()
      }));

    const sessionPayload = {
      ...formData,
      courseId: selectedCourse?.id || formData.courseId,
      courseName: selectedCourse?.title || formData.courseName,
      stageId: currentStageObj?.id || formData.stageId,
      stageName: currentStageObj?.title || formData.stageName,
      subtopicId: currentSubObj?.id || formData.subtopicId,
      subtopicName: currentSubObj?.title || formData.subtopicName,
      moduleId: currentModObj?.id || formData.moduleId,
      moduleName: currentModObj?.title || formData.moduleName,
      topics: cleanedTopics,
      targetBatches: allBatches,
      targetBatch: targetBatchStr
    };

    if (editingSession) {
      updateLiveSession(editingSession.id, sessionPayload);
      addToast(`Updated live session: "${formData.sessionTitle}" & synced to Milestones!`, 'success');
      setEditingSession(null);
    } else {
      addLiveSession(sessionPayload);
      addToast(`Scheduled live session: "${formData.sessionTitle}" & synced topics to Milestones!`, 'success');
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

  const filteredSessions = [...liveSessions]
    .filter((s) => {
      const matchesSearch =
        s.sessionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.technology.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.subtopicName && s.subtopicName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.moduleName && s.moduleName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (a.created_at ? new Date(a.created_at).getTime() : 0);
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (b.created_at ? new Date(b.created_at).getTime() : 0);
      if (timeA && timeB) return timeA - timeB;
      return 0;
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Video className="w-7 h-7 text-purple-600" /> Live Sessions & Meeting Rooms
          </h1>
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
            placeholder="Search live sessions by title, tech stack, instructor, milestone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSessions.map((sess) => (
            <div
              key={sess.id}
              className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-300 transition-all duration-200 hover:-translate-y-1 p-5 flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                {/* 1. Header Badges & Actions */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200/80 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0 truncate max-w-[180px]">
                    <Layers className="w-3 h-3 text-purple-600 shrink-0" />
                    <span className="truncate">{sess.subtopicName || sess.moduleName || sess.technology || 'Live Class'}</span>
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {sess.isLocked ? (
                      <Badge variant="amber" className="px-2 py-0.5 bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold">
                        <Lock className="w-3 h-3 mr-1 inline" /> Locked
                      </Badge>
                    ) : (
                      <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full border bg-sky-50 text-sky-700 border-sky-200 flex items-center gap-1">
                        {sess.status === 'Live Soon' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block" />
                        )}
                        {sess.status || 'Upcoming'}
                      </span>
                    )}

                    <div className="flex items-center gap-0.5 bg-slate-100/70 p-1 rounded-xl border border-slate-200/60">
                      <button
                        onClick={() => {
                          toggleLiveSessionLock(sess.id);
                          addToast(
                            sess.isLocked
                              ? `Unlocked session: "${sess.sessionTitle}"`
                              : `Locked session: "${sess.sessionTitle}"`,
                            'info'
                          );
                        }}
                        className={`p-1 rounded-lg transition-colors cursor-pointer ${
                          sess.isLocked
                            ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                            : 'text-slate-400 hover:text-amber-600 hover:bg-white'
                        }`}
                        title={sess.isLocked ? 'Unlock Session' : 'Lock Session'}
                      >
                        {sess.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(sess)}
                        className="p-1 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                        title="Edit Session & Topics"
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

                {/* 2. Program Tag & Session Title */}
                <div>
                  <span className="text-[10px] font-black text-purple-600 uppercase tracking-wider block mb-1">
                    {sess.programName || ''}
                  </span>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base group-hover:text-purple-600 transition-colors leading-snug">
                    {sess.sessionTitle}
                  </h3>
                </div>

                {/* 3. Structured Details Info Box */}
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 space-y-2">
                  {/* Date & Time Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/80 shadow-2xs">
                      <Calendar className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span className="truncate">{sess.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/80 shadow-2xs">
                      <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="truncate">{sess.time}</span>
                    </div>
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/80 shadow-2xs">
                    <UserCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span className="truncate">
                      Instructor: <strong className="text-purple-700 font-extrabold">{sess.instructor}</strong>
                    </span>
                  </div>

                  {/* Curriculum Linkages */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-200/60">
                    {sess.courseName && (
                      <div className="flex items-center gap-1.5 text-[11px] text-purple-800 bg-purple-50/80 px-2.5 py-1 rounded-lg border border-purple-200/70 font-bold">
                        <Bookmark className="w-3 h-3 text-purple-600 shrink-0" />
                        <span className="truncate">Course: {sess.courseName}</span>
                      </div>
                    )}
                    {(sess.subtopicName || sess.moduleName) && (
                      <div className="flex items-center gap-1.5 text-[11px] text-indigo-800 bg-indigo-50/80 px-2.5 py-1 rounded-lg border border-indigo-200/70 font-bold">
                        <Layers className="w-3 h-3 text-indigo-600 shrink-0" />
                        <span className="truncate">Milestone: {sess.subtopicName || sess.moduleName}</span>
                      </div>
                    )}
                    {sess.targetBatch && (
                      <div className="flex items-center gap-1.5 text-[11px] text-blue-800 bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-200/70 font-bold">
                        <Calendar className="w-3 h-3 text-blue-600 shrink-0" />
                        <span className="truncate">Batches: {sess.targetBatch}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Syllabus Topics Included Preview (Dynamically synced from Milestones Roadmap) */}
                {(() => {
                  const cardTopics = getModuleTopicsForSession(sess, stagesList);
                  if (!Array.isArray(cardTopics) || cardTopics.length === 0) return null;

                  return (
                    <div className="p-2.5 bg-purple-50/40 rounded-xl border border-purple-100/80 space-y-1">
                      <span className="text-[10px] font-black text-purple-800 uppercase tracking-wider flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-purple-600" />
                        <span>{cardTopics.length} SYLLABUS TOPICS INCLUDED</span>
                      </span>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {cardTopics.slice(0, 3).map((top, tIdx) => (
                          <span
                            key={top.id || tIdx}
                            className="text-[10px] font-semibold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-purple-100 shadow-2xs truncate max-w-full"
                          >
                            {tIdx + 1}. {top.title}
                          </span>
                        ))}
                        {cardTopics.length > 3 && (
                          <span className="text-[10px] font-bold text-purple-600 px-1.5 py-0.5">
                            +{cardTopics.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 5. Open Meeting Room Action Button */}
              <div className="mt-4 pt-3.5 border-t border-slate-100">
                {sess.isLocked ? (
                  <button
                    disabled
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-400 font-bold rounded-xl text-xs border border-slate-200 cursor-not-allowed"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-500" /> Meeting Room Locked
                  </button>
                ) : (
                  <a
                    href={sess.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm shadow-purple-500/20 hover:shadow-md active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <Tv2 className="w-3.5 h-3.5" /> Open Meeting Room <ExternalLink className="w-3 h-3 opacity-80" />
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

      {/* Add / Edit Session Modal with in-modal Topic & Session Agenda Editor (Matching Image 1) */}
      <Modal
        isOpen={isAddModalOpen || !!editingSession}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingSession(null);
        }}
        title={editingSession ? 'Edit Live Session & Syllabus Topics' : 'Schedule Live Class Session'}
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
            const currentStageObj =
              stagesList.find((s) => s.id === formData.stageId || s.title === formData.stageName) || stagesList[0];
            const currentSubtopicsArr = getSubtopicsForStage(currentStageObj);
            const currentSubtopicObj =
              currentSubtopicsArr.find((st) => st.id === formData.subtopicId || st.title === formData.subtopicName) ||
              currentSubtopicsArr[0];
            const currentInnerModules = getInnerModulesForSubtopic(currentSubtopicObj);
            const currentModObj =
              currentInnerModules.find(
                (m) => (m.id || m.title) === (formData.moduleId || formData.moduleName)
              ) || currentInnerModules[0];

            return (
              <div className="bg-gradient-to-br from-slate-50 via-purple-50/20 to-blue-50/40 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                {/* Header */}
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-purple-100/80">
                  <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Curriculum Location & Milestone Topic Mapping
                    </h4>
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
                        const newStages =
                          milestones?.stages && milestones.stages.length > 0
                            ? milestones.stages
                            : selectedC?.topics && selectedC.topics.length > 0
                            ? selectedC.topics
                            : DEFAULT_STAGES;
                        const firstStage = newStages[0];
                        const firstSubs = getSubtopicsForStage(firstStage);
                        const firstSub = firstSubs[0];
                        const firstLessons = getInnerModulesForSubtopic(firstSub);
                        const firstMod = firstLessons[0];
                        setFormData({
                          ...formData,
                          courseId: newCourseId,
                          courseName: selectedC?.title || '',
                          stageId: firstStage?.id || '',
                          stageName: firstStage?.title || '',
                          subtopicId: firstSub?.id || '',
                          subtopicName: firstSub?.title || '',
                          moduleId: firstMod?.id || '',
                          moduleName: firstMod?.title || '',
                          sessionTitle: firstMod?.title || formData.sessionTitle
                        });
                      }}
                      options={courses.map((c) => ({ value: c.id, label: c.title }))}
                    />
                  </div>

                  {/* Step 2: Course Module / Stage */}
                  <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-purple-100/90 shadow-2xs">
                    {stagesList.length > 0 ? (
                      <Select
                        label="2. Milestone Stage"
                        value={formData.stageId || currentStageObj?.id || ''}
                        onChange={(e) => {
                          const newStageId = e.target.value;
                          if (newStageId === '__NEW__') {
                            setFormData({
                              ...formData,
                              stageId: '__NEW__',
                              stageName: '',
                              subtopicId: '__NEW__',
                              subtopicName: '',
                              moduleId: '__NEW__',
                              moduleName: ''
                            });
                            return;
                          }
                          const newStage = stagesList.find((s) => s.id === newStageId) || stagesList[0];
                          const newSubs = getSubtopicsForStage(newStage);
                          const firstSub = newSubs[0];
                          const firstLessons = getInnerModulesForSubtopic(firstSub);
                          const firstMod = firstLessons[0];
                          setFormData({
                            ...formData,
                            stageId: newStageId,
                            stageName: newStage?.title || '',
                            subtopicId: firstSub?.id || '',
                            subtopicName: firstSub?.title || '',
                            moduleId: firstMod?.id || '',
                            moduleName: firstMod?.title || '',
                            sessionTitle: firstMod?.title || formData.sessionTitle
                          });
                        }}
                        options={[
                          ...stagesList.map((stg) => ({
                            value: stg.id,
                            label: stg.title
                          })),
                          { value: '__NEW__', label: '+ Create New Stage...' }
                        ]}
                      />
                    ) : (
                      <Input
                        label="2. Milestone Stage"
                        placeholder="e.g. Stage 1: Frontend Foundations"
                        value={formData.stageName}
                        onChange={(e) => setFormData({ ...formData, stageName: e.target.value, stageId: e.target.value })}
                        required
                      />
                    )}
                    {formData.stageId === '__NEW__' && (
                      <div className="mt-2">
                        <Input
                          label="New Stage Name"
                          placeholder="e.g. Stage 2: Backend + DSA"
                          value={formData.stageName}
                          onChange={(e) => setFormData({ ...formData, stageName: e.target.value })}
                          required
                        />
                      </div>
                    )}
                  </div>

                  {/* Step 3: Milestone Subtopic / Module Track */}
                  <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-purple-100/90 shadow-2xs">
                    {currentSubtopicsArr.length > 0 && formData.stageId !== '__NEW__' ? (
                      <Select
                        label="3. Milestone Subtopic / Module Track"
                        value={formData.subtopicId || currentSubtopicObj?.id || ''}
                        onChange={(e) => {
                          const newSubId = e.target.value;
                          if (newSubId === '__NEW__') {
                            setFormData({
                              ...formData,
                              subtopicId: '__NEW__',
                              subtopicName: '',
                              moduleId: '__NEW__',
                              moduleName: ''
                            });
                            return;
                          }
                          const targetSub =
                            currentSubtopicsArr.find((st) => st.id === newSubId) || currentSubtopicsArr[0];
                          const targetLessons = getInnerModulesForSubtopic(targetSub);
                          const firstMod = targetLessons[0];
                          setFormData({
                            ...formData,
                            subtopicId: newSubId,
                            subtopicName: targetSub?.title || '',
                            moduleId: firstMod?.id || '',
                            moduleName: firstMod?.title || '',
                            sessionTitle: firstMod?.title || formData.sessionTitle
                          });
                        }}
                        options={[
                          ...currentSubtopicsArr.map((sub, idx) => ({
                            value: sub.id,
                            label: `${idx + 1}. ${sub.title}`
                          })),
                          { value: '__NEW__', label: '+ Create New Subtopic...' }
                        ]}
                      />
                    ) : (
                      <Input
                        label="3. Milestone Subtopic / Track"
                        placeholder="e.g. Git & GitHub Version Control"
                        value={formData.subtopicName}
                        onChange={(e) => setFormData({ ...formData, subtopicName: e.target.value, subtopicId: e.target.value })}
                        required
                      />
                    )}
                    {formData.subtopicId === '__NEW__' && currentSubtopicsArr.length > 0 && formData.stageId !== '__NEW__' && (
                      <div className="mt-2">
                        <Input
                          label="New Subtopic Name"
                          placeholder="e.g. Docker & Containerization"
                          value={formData.subtopicName}
                          onChange={(e) => setFormData({ ...formData, subtopicName: e.target.value })}
                          required
                        />
                      </div>
                    )}
                  </div>

                  {/* Step 4: Specific Topic Module */}
                  <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-purple-100/90 shadow-2xs">
                    {currentInnerModules.length > 0 && formData.subtopicId !== '__NEW__' && formData.stageId !== '__NEW__' ? (
                      <Select
                        label="4. Specific Topic Module"
                        value={formData.moduleId || currentModObj?.id || ''}
                        onChange={(e) => {
                          const newModId = e.target.value;
                          if (newModId === '__NEW__') {
                            setFormData({
                              ...formData,
                              moduleId: '__NEW__',
                              moduleName: '',
                              sessionTitle: formData.sessionTitle || ''
                            });
                            return;
                          }
                          const targetMod =
                            currentInnerModules.find((m) => (m.id || m.title) === newModId) || currentInnerModules[0];
                          
                          const validModTopics = (targetMod?.topics || []).filter((t) => t && t.title && t.title.trim());
                          const validModItems = (targetMod?.items || []).filter((it) => (it.type === 'LIVE CLASS' || !it.type) && it.title && it.title.trim());
                          
                          let updatedTopics = [{ id: `top-${Date.now()}-1`, title: '', description: '' }];
                          if (validModTopics.length > 0) {
                            updatedTopics = validModTopics.map((t, idx) => ({
                              id: t.id || `top-${Date.now()}-${idx + 1}`,
                              title: t.title,
                              description: t.description || t.agenda || t.overview || ''
                            }));
                          } else if (validModItems.length > 0) {
                            updatedTopics = validModItems.map((it, idx) => ({
                              id: it.id || `top-${Date.now()}-${idx + 1}`,
                              title: it.title,
                              description: it.description || it.agenda || it.overview || ''
                            }));
                          }

                          setFormData({
                            ...formData,
                            moduleId: newModId,
                            moduleName: targetMod?.title || '',
                            sessionTitle: targetMod?.title || formData.sessionTitle,
                            topics: updatedTopics
                          });
                        }}
                        options={[
                          ...currentInnerModules.map((mod) => ({
                            value: mod.id || mod.title,
                            label: mod.title
                          })),
                          { value: '__NEW__', label: '+ Create New Module...' }
                        ]}
                      />
                    ) : (
                      <Input
                        label="4. Module / Session Title"
                        placeholder="e.g. Git Architecture & Version Control Concepts"
                        value={formData.moduleName || formData.sessionTitle}
                        onChange={(e) => setFormData({ ...formData, moduleName: e.target.value, moduleId: e.target.value, sessionTitle: e.target.value })}
                        required
                      />
                    )}
                    {formData.moduleId === '__NEW__' && currentInnerModules.length > 0 && formData.subtopicId !== '__NEW__' && (
                      <div className="mt-2">
                        <Input
                          label="New Module Title"
                          placeholder="e.g. Microservices with Docker"
                          value={formData.moduleName}
                          onChange={(e) => setFormData({ ...formData, moduleName: e.target.value, sessionTitle: e.target.value })}
                          required
                        />
                      </div>
                    )}
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
                  ...(selectedWeekdayBatches.length > 1 &&
                  selectedWeekdayBatches.length < allWeekdayBatchesList.length
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
                  ...(selectedWeekendBatches.length > 1 &&
                  selectedWeekendBatches.length < allWeekendBatchesList.length
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
              placeholder="e.g. Siva V"
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
              placeholder="e.g. 10:00 - 10:15 AM"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>

          {/* 5. Meeting Room URL (Google Meet, Zoom, MS Teams) */}
          <div>
            <Input
              label="Meeting Room URL (Google Meet, Zoom, MS Teams)"
              placeholder="https://meet.google.com/aspire-lms-live"
              value={formData.meetingLink}
              onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              required
            />
          </div>

          {/* 6. DYNAMIC CLASS TOPICS & SESSION AGENDA / OVERVIEW MANAGER */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/50 via-indigo-50/30 to-purple-50/20 border border-purple-200/90 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Class Topics & Syllabus Covered
                  </h4>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddTopicRow}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Topic</span>
              </button>
            </div>

            <div className="space-y-3 pt-1">
              {(formData.topics || []).map((topic, idx) => (
                <div
                  key={topic.id || idx}
                  className="p-3.5 bg-white rounded-xl border border-purple-100 shadow-2xs space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 flex-1">
                      <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 font-black text-xs flex items-center justify-center shrink-0 border border-purple-200">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        placeholder={`Topic ${idx + 1} Title (e.g. Overview & Core Concepts)`}
                        value={topic.title}
                        onChange={(e) => handleTopicChange(idx, 'title', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                        required
                      />
                    </div>
                    {(formData.topics || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTopicRow(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove Topic"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                      Session Agenda / Overview for Topic {idx + 1}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={`Enter detailed session agenda for Topic ${idx + 1}...`}
                      value={topic.description || topic.agenda || topic.overview || ''}
                      onChange={(e) => handleTopicChange(idx, 'description', e.target.value)}
                      className="w-full px-3 py-2 text-xs font-normal text-slate-700 bg-slate-50/50 border border-slate-200/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white resize-none transition-all leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
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
              {editingSession ? 'Save Session & Sync Topics' : 'Schedule Session & Sync Topics'}
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
