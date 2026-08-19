import React, { useState } from 'react';
import {
  BookOpen,
  Trophy,
  Zap,
  Brain,
  Clock,
  ChevronRight,
  ChevronDown,
  Lock,
  Unlock,
  Video,
  Code,
  FileCheck,
  ExternalLink,
  Sparkles,
  X,
  Plus,
  Edit2,
  Trash2,
  Users,
  Eye,
  Settings,
  Book,
  FileText,
  Calendar,
  CalendarClock,
  Timer,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useLmsData } from '../../context/LmsDataContext';

// Pure Date & Time Release Determination Helper with Hierarchy Inheritance
export const getScheduleInfo = (item, parentSchedule = null) => {
  if (!item) {
    return {
      hasSchedule: false,
      isUnlocked: false,
      isLocked: true,
      unlockDate: '',
      unlockTime: '',
      unlockDateTime: null,
      dateFormatted: '',
      timeFormatted: '',
      fullFormatted: 'Release date not set',
      shortFormatted: 'No date set',
      relativeText: 'Locked',
      statusLabel: 'LOCKED',
      inherited: false
    };
  }

  // 1. If parent schedule is explicitly LOCKED (e.g. parent Stage is scheduled for future), child inherits lock
  if (parentSchedule && parentSchedule.isLocked) {
    return {
      hasSchedule: parentSchedule.hasSchedule,
      isUnlocked: false,
      isLocked: true,
      unlockDate: parentSchedule.unlockDate,
      unlockTime: parentSchedule.unlockTime,
      unlockDateTime: parentSchedule.unlockDateTime,
      dateFormatted: parentSchedule.dateFormatted,
      timeFormatted: parentSchedule.timeFormatted,
      fullFormatted: parentSchedule.fullFormatted,
      shortFormatted: parentSchedule.shortFormatted,
      relativeText: parentSchedule.relativeText,
      statusLabel: 'LOCKED',
      inherited: true
    };
  }

  const unlockDate = item.unlockDate || '';
  const unlockTime = item.unlockTime || '';
  const unlockDateTime = item.unlockDateTime || (unlockDate ? `${unlockDate}T${unlockTime || '00:00'}` : '');

  // 2. If child item does NOT have its own specific date/time set:
  if (!unlockDate && !unlockDateTime) {
    // If parent is UNLOCKED, child is automatically UNLOCKED and accessible
    if (parentSchedule && parentSchedule.isUnlocked) {
      return {
        hasSchedule: parentSchedule.hasSchedule,
        isUnlocked: true,
        isLocked: false,
        unlockDate: parentSchedule.unlockDate,
        unlockTime: parentSchedule.unlockTime,
        unlockDateTime: parentSchedule.unlockDateTime,
        dateFormatted: parentSchedule.dateFormatted,
        timeFormatted: parentSchedule.timeFormatted,
        fullFormatted: parentSchedule.fullFormatted,
        shortFormatted: parentSchedule.shortFormatted,
        relativeText: 'Released',
        statusLabel: 'UNLOCKED',
        inherited: true
      };
    }

    // If top-level item (e.g. Stage) has no explicit date set, default to UNLOCKED (available)
    return {
      hasSchedule: false,
      isUnlocked: true,
      isLocked: false,
      unlockDate: '',
      unlockTime: '',
      unlockDateTime: null,
      dateFormatted: '',
      timeFormatted: '',
      fullFormatted: 'Available',
      shortFormatted: 'Available',
      relativeText: 'Released',
      statusLabel: 'UNLOCKED',
      inherited: false
    };
  }

  // 3. Item has its OWN specific scheduled date & time
  let targetTime = 0;
  try {
    targetTime = new Date(unlockDateTime).getTime();
  } catch (e) {
    targetTime = NaN;
  }

  if (isNaN(targetTime)) {
    return {
      hasSchedule: false,
      isUnlocked: true,
      isLocked: false,
      unlockDate,
      unlockTime,
      unlockDateTime,
      dateFormatted: '',
      timeFormatted: '',
      fullFormatted: 'Available',
      shortFormatted: 'Available',
      relativeText: 'Released',
      statusLabel: 'UNLOCKED',
      inherited: false
    };
  }

  const now = Date.now();
  const isUnlocked = now >= targetTime;
  const isLocked = !isUnlocked;

  const d = new Date(targetTime);
  const dateFormatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeFormatted = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const diffMs = targetTime - now;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  let relativeText = '';
  if (isLocked) {
    if (diffDays > 0) {
      relativeText = `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      relativeText = `in ${diffHours} hr${diffHours > 1 ? 's' : ''}`;
    } else {
      const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
      relativeText = `in ${diffMins} min${diffMins > 1 ? 's' : ''}`;
    }
  } else {
    relativeText = 'Released';
  }

  return {
    hasSchedule: true,
    isUnlocked,
    isLocked,
    unlockDate,
    unlockTime,
    unlockDateTime,
    dateFormatted,
    timeFormatted,
    fullFormatted: `${dateFormatted} at ${timeFormatted}`,
    shortFormatted: `${dateFormatted}, ${timeFormatted}`,
    relativeText,
    statusLabel: isUnlocked ? 'UNLOCKED' : 'LOCKED',
    inherited: false
  };
};

export function MilestonesRoadmapPage() {
  const { addToast } = useToast();
  const {
    courses = [],
    students = [],
    milestonesByBatch,
    getMilestoneDataForBatch,
    milestones,
    addStage,
    updateStage,
    setStageSchedule,
    deleteStage,
    addSubtopic,
    updateSubtopic,
    setSubtopicSchedule,
    deleteSubtopic,
    addModule,
    updateModule,
    setModuleSchedule,
    deleteModule,
    addLearningItem,
    updateLearningItem,
    deleteLearningItem,
    updateMilestonesOverview,
    activeBatchFilter,
    setActiveBatchFilter,
    assessments = [],
    liveSessions = [],
    completedMilestoneItemIds = [],
    toggleItemCompletion = () => {},
    markItemCompleted = () => {}
  } = useLmsData();

  // Mode Toggle: 'admin' (CRUD & Schedule Setter) vs 'user' (Main LMS Student View)
  const [viewMode, setViewMode] = useState('admin');
  const [selectedBatch, setSelectedBatchState] = useState(
    activeBatchFilter && activeBatchFilter !== 'ALL' ? activeBatchFilter : 'Weekday Batch'
  );

  React.useEffect(() => {
    if (activeBatchFilter && activeBatchFilter !== 'ALL' && activeBatchFilter !== selectedBatch) {
      setSelectedBatchState(activeBatchFilter);
    }
  }, [activeBatchFilter]);

  const setSelectedBatch = (b) => {
    setSelectedBatchState(b);
    if (setActiveBatchFilter) {
      setActiveBatchFilter(b);
    }
  };

  // Obtain independent milestone dataset for selected batch
  const currentMilestones = getMilestoneDataForBatch ? getMilestoneDataForBatch(selectedBatch) : milestones;

  // Selected subtopic for slide-over drawer
  const [selectedSubtopicState, setSelectedSubtopicState] = useState(null); // { stageId, subtopicId }
  const [expandedModule, setExpandedModule] = useState(null);
  const [expandedStages, setExpandedStages] = useState({ 'stage-1': true, 'stage-1-w': true, 'stage-1-s': true });

  const [searchParams] = useSearchParams();
  const queryCourseId = searchParams.get('courseId') || 'ALL';

  const [selectedCourseId, setSelectedCourseId] = useState(queryCourseId);
  const [selectedStudentAccessId, setSelectedStudentAccessId] = useState('ALL');

  // Derive active milestones stages from Course Management or selected course
  const getActiveMilestoneStages = () => {
    let rawStages = currentMilestones?.stages || [];

    if (selectedStudentAccessId !== 'ALL') {
      const studentObj = students.find((s) => s.id === selectedStudentAccessId);
      if (studentObj && Array.isArray(studentObj.enrolledCourses) && studentObj.enrolledCourses.length > 0) {
        if (selectedCourseId === 'ALL') {
          const studentCourseObjs = courses.filter((c) => studentObj.enrolledCourses.includes(c.id));
          const derivedStages = [];
          studentCourseObjs.forEach((crs) => {
            if (Array.isArray(crs.topics) && crs.topics.length > 0) {
              crs.topics.forEach((t, tIdx) => {
                derivedStages.push({
                  id: t.id || `stg-std-${tIdx}`,
                  stageNumber: `STAGE 0${derivedStages.length + 1}`,
                  phaseTag: `${crs.title} • Stage ${tIdx + 1}`,
                  title: t.title,
                  unlockDate: t.unlockDate || (tIdx === 0 ? new Date().toISOString().split('T')[0] : null),
                  unlockTime: t.unlockTime || '09:00',
                  subtopics: t.subtopics || [
                    { id: `sub-${tIdx}-1`, title: 'Live Session & Concepts', isCompleted: true, modulesCount: t.liveClasses || 4 },
                    { id: `sub-${tIdx}-2`, title: 'Hands-on Practice & Assignments', isCompleted: false, modulesCount: t.practice || 6 },
                    { id: `sub-${tIdx}-3`, title: 'Skill Assessments & Projects', isCompleted: false, modulesCount: t.assessments || 2 }
                  ]
                });
              });
            }
          });
          if (derivedStages.length > 0) return derivedStages;
        }
      }
    }

    if (selectedCourseId !== 'ALL') {
      const targetCourse = courses.find((c) => c.id === selectedCourseId);
      if (targetCourse && Array.isArray(targetCourse.topics) && targetCourse.topics.length > 0) {
        return targetCourse.topics.map((t, idx) => ({
          id: t.id || `stg-crs-${idx + 1}`,
          stageNumber: `STAGE 0${idx + 1}`,
          phaseTag: `${targetCourse.title} • Stage ${idx + 1}`,
          title: t.title,
          unlockDate: t.unlockDate || (idx === 0 ? new Date().toISOString().split('T')[0] : null),
          unlockTime: t.unlockTime || '09:00',
          subtopics: t.subtopics || [
            { id: `sub-${idx}-1`, title: 'Live Session & Concepts', isCompleted: true, modulesCount: t.liveClasses || 4 },
            { id: `sub-${idx}-2`, title: 'Hands-on Practice & Assignments', isCompleted: false, modulesCount: t.practice || 6 },
            { id: `sub-${idx}-3`, title: 'Skill Assessments & Projects', isCompleted: false, modulesCount: t.assessments || 2 }
          ]
        }));
      }
    }

    return rawStages;
  };

  const filteredStages = getActiveMilestoneStages();

  // Helper to check if a stage is unlocked purely by date/time
  const isStageUnlocked = (stage) => {
    const stageSched = getScheduleInfo(stage);
    return stageSched.isUnlocked;
  };

  // Real-Time Banner Calculations based on actual Student Topic Completion
  let totalItemsCount = 0;
  let completedItemsCount = 0;
  let totalSubtopicsCount = 0;
  let completedSubtopicsCount = 0;

  filteredStages.forEach((stage) => {
    (stage.subtopics || []).forEach((sub) => {
      totalSubtopicsCount += 1;
      let subItems = [];
      (sub.modules || []).forEach((mod) => {
        (mod.items || []).forEach((item) => {
          subItems.push(item);
          totalItemsCount += 1;
          if (completedMilestoneItemIds.includes(item.id)) {
            completedItemsCount += 1;
          }
        });
      });

      const isSubDone =
        sub.isCompleted ||
        completedMilestoneItemIds.includes(sub.id) ||
        (subItems.length > 0 && subItems.every((it) => completedMilestoneItemIds.includes(it.id)));

      if (isSubDone) {
        completedSubtopicsCount += 1;
      }
    });
  });

  const totalTopicsCount = totalItemsCount > 0 ? totalItemsCount : (totalSubtopicsCount || 31);
  const completedTopicsCount = totalItemsCount > 0 ? completedItemsCount : completedSubtopicsCount;

  const completionPercentage = totalTopicsCount > 0
    ? Math.min(100, Math.round((completedTopicsCount / totalTopicsCount) * 100))
    : 0;

  const completedStagesCount = filteredStages.filter((stage) => {
    const subs = stage.subtopics || [];
    if (subs.length === 0) return false;
    return subs.every((sub) => {
      let subItems = [];
      (sub.modules || []).forEach((mod) => {
        (mod.items || []).forEach((item) => subItems.push(item));
      });
      return (
        sub.isCompleted ||
        completedMilestoneItemIds.includes(sub.id) ||
        (subItems.length > 0 && subItems.every((it) => completedMilestoneItemIds.includes(it.id)))
      );
    });
  }).length;

  const autoUnlockedStagesCount = filteredStages.filter((stg) => isStageUnlocked(stg)).length;

  // Handle clicking a subtopic row -> Opens the Drawer to view syllabus/modules
  const handleSubtopicClick = (stage, subtopic) => {
    setSelectedSubtopicState({ stageId: stage.id, subtopicId: subtopic.id });
  };

  // --- Modal States ---
  // Dedicated Date & Time Release Scheduler Modal
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleTarget, setScheduleTarget] = useState(null);
  const [scheduleFormData, setScheduleFormData] = useState({
    unlockDate: '',
    unlockTime: '09:00'
  });

  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState(null);
  const [stageFormData, setStageFormData] = useState({
    stageNumber: 'STAGE 01',
    phaseTag: 'Phase 1 • Core Mastery',
    title: '',
    targetBatch: 'All Batches',
    unlockDate: '',
    unlockTime: '09:00'
  });

  const [isSubtopicModalOpen, setIsSubtopicModalOpen] = useState(false);
  const [targetStageIdForSubtopic, setTargetStageIdForSubtopic] = useState(null);
  const [editingSubtopic, setEditingSubtopic] = useState(null);
  const [subtopicFormData, setSubtopicFormData] = useState({
    title: '',
    targetBatch: 'All Batches',
    description: 'Click to view subtopics',
    duration: '',
    unlockDate: '',
    unlockTime: '09:00'
  });

  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [moduleFormData, setModuleFormData] = useState({
    title: '',
    unlockDate: '',
    unlockTime: '09:00'
  });

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [targetModuleIdForItem, setTargetModuleIdForItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [itemFormData, setItemFormData] = useState({
    type: 'LIVE CLASS',
    title: '',
    actionText: 'JOIN',
    url: ''
  });

  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);
  const [overviewFormData, setOverviewFormData] = useState({
    headline: milestones?.overview?.headline || ''
  });

  // Derived current active subtopic object and parent stage
  const getActiveSubtopicAndStage = () => {
    if (!selectedSubtopicState) return { activeStage: null, activeSubtopic: null };
    const stage = currentMilestones?.stages?.find((s) => s.id === selectedSubtopicState.stageId);
    if (!stage) return { activeStage: null, activeSubtopic: null };
    const sub = stage.subtopics?.find((st) => st.id === selectedSubtopicState.subtopicId);
    return {
      activeStage: stage,
      activeSubtopic: sub ? { stageId: stage.id, ...sub } : null
    };
  };

  const { activeStage, activeSubtopic } = getActiveSubtopicAndStage();

  // Helper for rendering icons dynamically
  const renderItemIcon = (iconName, iconBg, isLocked = false) => {
    let IconComp = Video;
    if (iconName === 'Code') IconComp = Code;
    if (iconName === 'FileCheck') IconComp = FileCheck;
    if (iconName === 'BookText' || iconName === 'Book' || iconName === 'FileText') IconComp = Book;

    return (
      <div className={`p-2.5 rounded-xl ${iconBg || 'bg-purple-600 text-white'} flex-shrink-0 shadow-xs`}>
        <IconComp className="w-4 h-4" />
      </div>
    );
  };

  // --- Handlers: Date & Time Schedule Modal ---
  const handleOpenScheduleModal = (type, item, stageId = null, subtopicId = null) => {
    const sInfo = getScheduleInfo(item);
    setScheduleTarget({
      type,
      item,
      id: item.id,
      stageId: stageId || item.id,
      subtopicId: subtopicId || item.id,
      title: item.title || item.stageNumber || 'Item'
    });
    setScheduleFormData({
      unlockDate: sInfo.unlockDate || '',
      unlockTime: sInfo.unlockTime || '09:00'
    });
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    if (!scheduleTarget) return;

    const { unlockDate, unlockTime } = scheduleFormData;
    const uDateTime = unlockDate ? `${unlockDate}T${unlockTime || '00:00'}` : null;

    if (scheduleTarget.type === 'stage') {
      setStageSchedule(scheduleTarget.id, {
        unlockDate,
        unlockTime,
        unlockDateTime: uDateTime
      });
      addToast(
        unlockDate
          ? `📅 Stage release scheduled for ${unlockDate} at ${unlockTime}`
          : 'Stage schedule updated',
        'success'
      );
    } else if (scheduleTarget.type === 'subtopic') {
      setSubtopicSchedule(scheduleTarget.stageId, scheduleTarget.id, {
        unlockDate,
        unlockTime,
        unlockDateTime: uDateTime
      });
      addToast(
        unlockDate
          ? `📅 Subtopic release scheduled for ${unlockDate} at ${unlockTime}`
          : 'Subtopic schedule updated',
        'success'
      );
    } else if (scheduleTarget.type === 'module') {
      setModuleSchedule(scheduleTarget.stageId, scheduleTarget.subtopicId, scheduleTarget.id, {
        unlockDate,
        unlockTime,
        unlockDateTime: uDateTime
      });
      addToast(
        unlockDate
          ? `📅 Module release scheduled for ${unlockDate} at ${unlockTime}`
          : 'Module schedule updated',
        'success'
      );
    }

    setIsScheduleModalOpen(false);
  };

  const handleClearSchedule = () => {
    if (!scheduleTarget) return;

    if (scheduleTarget.type === 'stage') {
      setStageSchedule(scheduleTarget.id, {
        unlockDate: '',
        unlockTime: '',
        unlockDateTime: null
      });
      addToast('Stage schedule cleared (Available by default)', 'info');
    } else if (scheduleTarget.type === 'subtopic') {
      setSubtopicSchedule(scheduleTarget.stageId, scheduleTarget.id, {
        unlockDate: '',
        unlockTime: '',
        unlockDateTime: null
      });
      addToast('Subtopic schedule cleared (Inherits stage release)', 'info');
    } else if (scheduleTarget.type === 'module') {
      setModuleSchedule(scheduleTarget.stageId, scheduleTarget.subtopicId, scheduleTarget.id, {
        unlockDate: '',
        unlockTime: '',
        unlockDateTime: null
      });
      addToast('Module schedule cleared (Inherits subtopic release)', 'info');
    }

    setIsScheduleModalOpen(false);
  };

  // Quick Presets Helper
  const applyDatePreset = (daysFromNow, time = '09:00') => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    const dateStr = d.toISOString().split('T')[0];
    setScheduleFormData({
      unlockDate: dateStr,
      unlockTime: time
    });
  };

  const applyImmediateUnlock = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - 1);
    const dateStr = d.toISOString().split('T')[0];
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    setScheduleFormData({
      unlockDate: dateStr,
      unlockTime: `${hours}:${minutes}`
    });
  };

  // --- Handlers: Stage ---
  const handleOpenStageModal = (stage = null) => {
    if (stage) {
      setEditingStage(stage);
      setStageFormData({
        stageNumber: stage.stageNumber,
        phaseTag: stage.phaseTag,
        title: stage.title,
        targetBatch: stage.targetBatch || 'All Batches',
        unlockDate: stage.unlockDate || '',
        unlockTime: stage.unlockTime || '09:00'
      });
    } else {
      setEditingStage(null);
      const nextNum = (currentMilestones?.stages?.length || 0) + 1;
      setStageFormData({
        stageNumber: `STAGE 0${nextNum}`,
        phaseTag: `Phase ${nextNum} • Core Mastery`,
        title: '',
        targetBatch: selectedBatch !== 'ALL' ? selectedBatch : 'All Batches',
        unlockDate: '',
        unlockTime: '09:00'
      });
    }
    setIsStageModalOpen(true);
  };

  const handleSaveStage = (e) => {
    e.preventDefault();
    if (!stageFormData.title.trim()) {
      addToast('Please enter a stage title', 'error');
      return;
    }
    const uDateTime = stageFormData.unlockDate
      ? `${stageFormData.unlockDate}T${stageFormData.unlockTime || '00:00'}`
      : null;

    const payload = {
      ...stageFormData,
      unlockDateTime: uDateTime
    };

    if (editingStage) {
      updateStage(editingStage.id, payload);
      addToast('Milestone stage updated successfully', 'success');
    } else {
      addStage(payload);
      addToast('New milestone stage created', 'success');
    }
    setIsStageModalOpen(false);
  };

  const handleDeleteStage = (stageId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteStage(stageId);
      if (selectedSubtopicState?.stageId === stageId) {
        setSelectedSubtopicState(null);
      }
      addToast('Milestone stage deleted', 'info');
    }
  };

  // --- Handlers: Subtopic ---
  const handleOpenSubtopicModal = (stageId, subtopic = null) => {
    setTargetStageIdForSubtopic(stageId);
    if (subtopic) {
      setEditingSubtopic(subtopic);
      setSubtopicFormData({
        title: subtopic.title,
        targetBatch: subtopic.targetBatch || 'All Batches',
        description: subtopic.description,
        duration: subtopic.duration,
        unlockDate: subtopic.unlockDate || '',
        unlockTime: subtopic.unlockTime || '09:00'
      });
    } else {
      setEditingSubtopic(null);
      setSubtopicFormData({
        title: '',
        targetBatch: selectedBatch !== 'ALL' ? selectedBatch : 'All Batches',
        description: 'Click to view subtopics',
        duration: 'Master core concepts and practical workflows in this module.',
        unlockDate: '',
        unlockTime: '09:00'
      });
    }
    setIsSubtopicModalOpen(true);
  };

  const handleSaveSubtopic = (e) => {
    e.preventDefault();
    if (!subtopicFormData.title.trim()) {
      addToast('Please enter a subtopic title', 'error');
      return;
    }
    const uDateTime = subtopicFormData.unlockDate
      ? `${subtopicFormData.unlockDate}T${subtopicFormData.unlockTime || '00:00'}`
      : null;

    const payload = {
      ...subtopicFormData,
      unlockDateTime: uDateTime
    };

    if (editingSubtopic) {
      updateSubtopic(targetStageIdForSubtopic, editingSubtopic.id, payload);
      addToast('Subtopic updated', 'success');
    } else {
      addSubtopic(targetStageIdForSubtopic, payload);
      addToast('Subtopic added to stage', 'success');
    }
    setIsSubtopicModalOpen(false);
  };

  const handleDeleteSubtopic = (stageId, subtopicId, title) => {
    if (window.confirm(`Delete subtopic "${title}"?`)) {
      deleteSubtopic(stageId, subtopicId);
      if (selectedSubtopicState?.subtopicId === subtopicId) {
        setSelectedSubtopicState(null);
      }
      addToast('Subtopic removed', 'info');
    }
  };

  // --- Handlers: Module ---
  const handleOpenModuleModal = (module = null) => {
    if (module) {
      setEditingModule(module);
      setModuleFormData({
        title: module.title,
        unlockDate: module.unlockDate || '',
        unlockTime: module.unlockTime || '09:00'
      });
    } else {
      setEditingModule(null);
      setModuleFormData({
        title: '',
        unlockDate: '',
        unlockTime: '09:00'
      });
    }
    setIsModuleModalOpen(true);
  };

  const handleSaveModule = (e) => {
    e.preventDefault();
    if (!moduleFormData.title.trim()) {
      addToast('Please enter module title', 'error');
      return;
    }
    if (!activeSubtopic) return;

    const uDateTime = moduleFormData.unlockDate
      ? `${moduleFormData.unlockDate}T${moduleFormData.unlockTime || '00:00'}`
      : null;

    const payload = {
      ...moduleFormData,
      unlockDateTime: uDateTime
    };

    if (editingModule) {
      updateModule(activeSubtopic.stageId, activeSubtopic.id, editingModule.id, payload);
      addToast('Module updated', 'success');
    } else {
      addModule(activeSubtopic.stageId, activeSubtopic.id, payload);
      addToast('New module added to learning path', 'success');
    }
    setIsModuleModalOpen(false);
  };

  const handleDeleteModule = (moduleId, title) => {
    if (!activeSubtopic) return;
    if (window.confirm(`Delete module "${title}" and all its resources?`)) {
      deleteModule(activeSubtopic.stageId, activeSubtopic.id, moduleId);
      addToast('Module deleted', 'info');
    }
  };

  // --- Handlers: Item ---
  const handleOpenItemModal = (moduleId, item = null) => {
    setTargetModuleIdForItem(moduleId);
    if (item) {
      setEditingItem(item);
      setItemFormData({
        type: item.type,
        title: item.title,
        actionText: item.actionText,
        url: item.url || ''
      });
    } else {
      setEditingItem(null);
      setItemFormData({
        type: 'LIVE CLASS',
        title: '',
        actionText: 'JOIN',
        url: ''
      });
    }
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!itemFormData.title.trim()) {
      addToast('Please enter resource title', 'error');
      return;
    }
    if (!activeSubtopic || !targetModuleIdForItem) return;

    let typeColor = 'bg-purple-100 text-purple-700 border-purple-200';
    let iconName = 'Video';
    let iconBg = 'bg-purple-600 text-white';
    let btnStyle = 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30';

    if (itemFormData.type === 'PRACTICAL LAB') {
      typeColor = 'bg-amber-100 text-amber-700 border-amber-200';
      iconName = 'Code';
      iconBg = 'bg-amber-500 text-white';
      btnStyle = 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30';
    } else if (itemFormData.type === 'ASSESSMENT') {
      typeColor = 'bg-blue-100 text-blue-700 border-blue-200';
      iconName = 'FileCheck';
      iconBg = 'bg-blue-600 text-white';
      btnStyle = 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30';
    }

    const payload = {
      ...itemFormData,
      typeColor,
      iconName,
      iconBg,
      btnStyle
    };

    if (editingItem) {
      updateLearningItem(activeSubtopic.stageId, activeSubtopic.id, targetModuleIdForItem, editingItem.id, payload);
      addToast('Resource item updated', 'success');
    } else {
      addLearningItem(activeSubtopic.stageId, activeSubtopic.id, targetModuleIdForItem, payload);
      addToast('Resource item added to module', 'success');
    }
    setIsItemModalOpen(false);
  };

  const handleDeleteItem = (moduleId, itemId, title) => {
    if (!activeSubtopic) return;
    if (window.confirm(`Delete resource item "${title}"?`)) {
      deleteLearningItem(activeSubtopic.stageId, activeSubtopic.id, moduleId, itemId);
      addToast('Resource item deleted', 'info');
    }
  };

  // Save Banner Overview
  const handleSaveOverview = (e) => {
    e.preventDefault();
    updateMilestonesOverview(overviewFormData);
    addToast('Roadmap banner settings updated', 'success');
    setIsOverviewModalOpen(false);
  };

  // Action Click Handler for JOIN, VIEW, TAKE with Strict Date & Time Enforcement
  const handleActionClick = (actionText, title, url, isLocked, sInfo, itemId) => {
    if (isLocked) {
      if (viewMode === 'admin') {
        if (url && url.startsWith('http')) {
          if (window.confirm(`[Admin Preview] This item is scheduled for ${sInfo.fullFormatted} (${sInfo.relativeText}). Test open link now?`)) {
            window.open(url, '_blank');
          }
        } else {
          addToast(`🔒 [Admin Preview] Scheduled for ${sInfo.fullFormatted}`, 'info');
        }
        return;
      }

      // Student View: Strictly Locked - Shows Toast Message and Prevents Opening
      addToast(
        sInfo.hasSchedule
          ? `🔒 "${title}" is locked! Available on ${sInfo.fullFormatted} (${sInfo.relativeText}).`
          : `🔒 "${title}" is locked until release date and time!`,
        'warning'
      );
      return;
    }

    // Unlocked: Automatically mark item completed when opened (progress increases)
    if (itemId) {
      markItemCompleted(itemId);
    }

    // Unlocked: Open resource
    if (url && url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      addToast(`Opening ${actionText} for "${title}"`, 'success');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar with Title & Admin/User View Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Milestones Roadmap</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Batch Selector Pills */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setSelectedBatch('Weekday Batch')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedBatch === 'Weekday Batch'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-600'
              }`}
            >
              Weekday (A26W)
            </button>
            <button
              onClick={() => setSelectedBatch('Weekend Batch')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedBatch === 'Weekend Batch'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-600'
              }`}
            >
              Weekend (A26S)
            </button>
          </div>

          {/* Admin / Student View Toggle Pills */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setViewMode('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'admin'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin Mode</span>
            </button>

            <button
              onClick={() => setViewMode('user')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'user'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Student View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Mode Controls Banner */}
      {viewMode === 'admin' && (
        <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setOverviewFormData({
                  headline: milestones?.overview?.headline || ''
                });
                setIsOverviewModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-purple-300 text-purple-700 hover:bg-purple-100 font-extrabold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Banner Headline</span>
            </button>

            <button
              onClick={() => handleOpenStageModal(null)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold flex items-center gap-1.5 shadow-md shadow-purple-600/25 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Milestone Stage</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 p-6 sm:p-8 text-white shadow-xl shadow-purple-600/20">
        <div className="relative z-10 space-y-6">
          {/* Banner Header Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-purple-100 border border-white/20">
              <BookOpen className="w-4 h-4" />
              <span>{milestones?.overview?.trackTitle || 'PYTHON FULL STACK + DSA WITH AI'}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1 text-xs font-extrabold text-purple-100 border border-white/15">
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {completedTopicsCount} / {totalTopicsCount} Topics Completed
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1 text-xs font-extrabold text-purple-100 border border-white/15">
                <Zap className="w-3.5 h-3.5 text-cyan-300" />
                <span>{completedStagesCount} / {filteredStages.length} Stages Completed</span>
              </div>
            </div>
          </div>

          {/* Banner Main Headline */}
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white max-w-3xl leading-snug">
            {milestones?.overview?.headline ||
              'Master core engineering fundamentals, advanced AI models, full-stack frameworks, and real-world project deployments.'}
          </h2>

          {/* Banner Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-extrabold text-purple-100">
              <span>Overall Track Completion Progress</span>
              <span className="font-black text-white">{completionPercentage}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20 backdrop-blur-sm p-0.5">
              <div
                className="h-full rounded-full bg-white transition-all duration-500 shadow-sm"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stage Timeline (Pure Time-Based Lock/Unlock System) */}
      <div className="relative pt-4">
        {filteredStages.map((stage, stageIndex) => {
          const stageSched = getScheduleInfo(stage);
          const isStageCurrentUnlocked = stageSched.isUnlocked;

          const totalStages = filteredStages.length;
          const isFirstStage = stageIndex === 0;
          const isLastStage = stageIndex === totalStages - 1;
          const visibleSubtopics = stage.subtopics || [];

          return (
            <div key={stage.id} className={`relative flex items-start gap-4 sm:gap-6 group ${isLastStage ? '' : 'mb-8'}`}>
              {/* Timeline Node Icon Column & Unbroken Connecting Line */}
              <div className="relative flex flex-col items-center flex-shrink-0 w-9 self-stretch">
                {/* Continuous Vertical Line Segment */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 w-0.5 bg-purple-300 pointer-events-none z-0 ${
                    isFirstStage ? 'top-[18px]' : isLastStage ? 'top-0 h-[18px]' : 'top-0'
                  }`}
                  style={!isLastStage ? { bottom: '-2rem' } : {}}
                />

                <div
                  className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all shadow-sm ${
                    isStageCurrentUnlocked
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 bg-slate-100 text-slate-400'
                  }`}
                >
                  {isStageCurrentUnlocked ? <Brain className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </div>
              </div>

              {/* Stage Card */}
              <div className="flex-1 rounded-3xl border border-purple-200/80 shadow-md shadow-purple-600/10 overflow-hidden transition-all duration-300 bg-white">
                {/* Main Card Header (Clickable Dropdown Banner) */}
                <div
                  onClick={() =>
                    setExpandedStages((prev) => ({
                      ...prev,
                      [stage.id]: !prev[stage.id]
                    }))
                  }
                  className="group bg-white text-slate-900 hover:bg-gradient-to-r hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 hover:text-white p-5 sm:p-6 cursor-pointer select-none transition-all duration-300 relative overflow-hidden border-b border-slate-100 hover:border-transparent"
                >
                  {/* Decorative Glow */}
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner flex-shrink-0 transition-all duration-300 ${
                          isStageCurrentUnlocked
                            ? 'bg-purple-100 group-hover:bg-white/20 text-purple-600 group-hover:text-white'
                            : 'bg-slate-100 text-slate-400 group-hover:bg-white/20 group-hover:text-white'
                        }`}
                      >
                        {isStageCurrentUnlocked ? <Brain className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 group-hover:text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200 shadow-xs transition-colors duration-300">
                            {stage.stageNumber}
                          </span>
                          <span className="text-xs font-medium text-slate-400 group-hover:text-purple-200 transition-colors duration-300">
                            {stage.phaseTag}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-white mt-1 leading-snug transition-colors duration-300">
                          {stage.title}
                        </h3>
                        <p className="text-xs text-slate-400 group-hover:text-purple-200/90 font-medium mt-1 flex items-center gap-1.5 transition-colors duration-300">
                          <span>{visibleSubtopics.length} Modules Included</span>
                          <span>•</span>
                          <span>{expandedStages[stage.id] ? 'Click card to hide modules' : 'Click card to view modules'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Right Side: Admin Schedule Setter & Dropdown Chevron */}
                    <div className="flex flex-wrap items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                      {/* Scheduled Date & Time Release Badge (Admin Mode Only) */}
                      {viewMode === 'admin' && (
                        <>
                          {stageSched.hasSchedule ? (
                            stageSched.isLocked ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 group-hover:bg-amber-400/20 group-hover:backdrop-blur-md border border-amber-300 group-hover:border-amber-300/40 px-3.5 py-1.5 text-xs font-bold text-amber-800 group-hover:text-amber-100 transition-all duration-300 shadow-2xs">
                                <Clock className="w-3.5 h-3.5 text-amber-600 group-hover:text-amber-200 animate-pulse" />
                                <span>Unlocks: {stageSched.shortFormatted} ({stageSched.relativeText})</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 group-hover:bg-emerald-400/20 group-hover:backdrop-blur-md border border-emerald-300 group-hover:border-emerald-300/40 px-3.5 py-1.5 text-xs font-bold text-emerald-800 group-hover:text-emerald-100 transition-all duration-300 shadow-2xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 group-hover:text-emerald-200" />
                                <span>UNLOCKED • Released {stageSched.dateFormatted}</span>
                              </span>
                            )
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 group-hover:bg-emerald-400/20 group-hover:backdrop-blur-md border border-emerald-300 group-hover:border-emerald-300/40 px-3.5 py-1.5 text-xs font-bold text-emerald-800 group-hover:text-emerald-100 transition-all duration-300 shadow-2xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>UNLOCKED • Available</span>
                            </span>
                          )}

                          {/* Admin Mode Schedule Setter and CRUD Buttons */}
                          <div className="flex items-center gap-1.5 bg-slate-100 group-hover:bg-white/10 group-hover:backdrop-blur-md p-1.5 rounded-xl border border-slate-200 group-hover:border-white/20 transition-all duration-300">
                            <button
                              onClick={() => handleOpenScheduleModal('stage', stage)}
                              title={stageSched.hasSchedule ? `Scheduled: ${stageSched.fullFormatted}` : 'Set Release Date & Time'}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                                stageSched.hasSchedule
                                  ? 'bg-purple-600 text-white shadow-xs border border-purple-400/50 hover:bg-purple-700'
                                  : 'bg-white group-hover:bg-purple-950/80 text-purple-700 group-hover:text-purple-200 border border-slate-300 group-hover:border-purple-400/40 hover:bg-purple-50'
                              }`}
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <Clock className="w-3 h-3" />
                              <span>{stageSched.hasSchedule ? 'Date Set' : 'Set Date & Time'}</span>
                            </button>

                            <button
                              onClick={() => handleOpenSubtopicModal(stage.id, null)}
                              title="Add Subtopic to Stage"
                              className="p-1.5 text-slate-500 group-hover:text-white hover:bg-slate-200 group-hover:hover:bg-white/20 rounded-lg transition-all cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenStageModal(stage)}
                              title="Edit Stage Details"
                              className="p-1.5 text-slate-500 group-hover:text-white hover:bg-slate-200 group-hover:hover:bg-white/20 rounded-lg transition-all cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStage(stage.id, stage.title)}
                              title="Delete Stage"
                              className="p-1.5 text-rose-400 group-hover:text-rose-200 hover:bg-rose-50 group-hover:hover:bg-rose-500/30 rounded-lg transition-all cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}

                      {/* Interactive Chevron Toggle Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedStages((prev) => ({
                            ...prev,
                            [stage.id]: !prev[stage.id]
                          }));
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 group-hover:bg-white/20 group-hover:backdrop-blur-md text-purple-600 group-hover:text-white hover:bg-purple-200 group-hover:hover:bg-white group-hover:hover:text-purple-700 transition-all cursor-pointer shadow-sm ml-1"
                        title={expandedStages[stage.id] ? 'Collapse Modules' : 'Expand Modules'}
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${
                            expandedStages[stage.id] ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subtopic / Modules Dropdown Content */}
                {expandedStages[stage.id] && (
                  <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-200/80 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    {visibleSubtopics && visibleSubtopics.length > 0 ? (
                      visibleSubtopics.map((subtopic, subtopicIndex) => {
                        const subSched = getScheduleInfo(subtopic, stageSched);
                        const isSubtopicLocked = subSched.isLocked;

                        const subItems = [];
                        (subtopic.modules || []).forEach((m) => {
                          (m.items || []).forEach((it) => subItems.push(it));
                        });
                        const isSubDone =
                          subtopic.isCompleted ||
                          completedMilestoneItemIds.includes(subtopic.id) ||
                          (subItems.length > 0 && subItems.every((it) => completedMilestoneItemIds.includes(it.id)));

                        return (
                          <div key={subtopic.id} className="relative group/sub">
                            <div className="relative flex items-center gap-2">
                              <button
                                onClick={() => handleSubtopicClick(stage, subtopic)}
                                className={`w-full text-left rounded-2xl px-4 py-3.5 transition-all flex items-center justify-between group cursor-pointer border shadow-xs ${
                                  isSubDone
                                    ? 'bg-emerald-50/40 border-emerald-200 text-slate-900 hover:bg-emerald-50'
                                    : 'bg-white hover:bg-purple-50/80 hover:border-purple-300 border-slate-200/90 text-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`flex h-7 w-7 items-center justify-center rounded-xl font-bold text-xs flex-shrink-0 ${
                                      isSubDone
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : isSubtopicLocked
                                        ? 'bg-slate-100 text-slate-600'
                                        : 'bg-purple-100 text-purple-700'
                                    }`}
                                  >
                                    {isSubDone ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : subtopicIndex + 1}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-bold text-xs sm:text-sm block text-slate-900 group-hover:text-purple-700">
                                        {subtopic.title}
                                      </span>

                                      {isSubDone && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                          <span>Completed</span>
                                        </span>
                                      )}

                                      {/* Subtopic Scheduled Date Badge (Admin Mode Only) */}
                                      {viewMode === 'admin' && subSched.hasSchedule && !subSched.inherited && (
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                          subSched.isLocked
                                            ? 'text-amber-800 bg-amber-50 border-amber-200'
                                            : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                                        }`}>
                                          {subSched.isLocked ? <Clock className="w-3 h-3 text-amber-600" /> : <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                                          <span>{subSched.isLocked ? `Unlocks ${subSched.shortFormatted}` : `Released ${subSched.dateFormatted}`}</span>
                                        </span>
                                      )}
                                    </div>
                                    {subtopic.duration && (
                                      <span className="text-[11px] font-medium text-slate-500 block mt-0.5">
                                        {subtopic.duration}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {isSubtopicLocked ? (
                                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                                  )}
                                </div>
                              </button>

                              {viewMode === 'admin' && (
                                <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs flex-shrink-0">
                                  {/* Subtopic Schedule Date & Time Button */}
                                  <button
                                    onClick={() => handleOpenScheduleModal('subtopic', subtopic, stage.id)}
                                    title={subSched.hasSchedule && !subSched.inherited ? `Scheduled: ${subSched.fullFormatted}` : 'Set Release Schedule'}
                                    className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                                      subSched.hasSchedule && !subSched.inherited
                                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300'
                                        : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50'
                                    }`}
                                  >
                                    <Calendar className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => handleOpenSubtopicModal(stage.id, subtopic)}
                                    title="Edit Subtopic"
                                    className="p-1.5 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg cursor-pointer"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSubtopic(stage.id, subtopic.id, subtopic.title)}
                                    title="Delete Subtopic"
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-6 text-slate-500 text-xs font-medium">
                        No modules added to this stage yet.
                        {viewMode === 'admin' && (
                          <button
                            onClick={() => handleOpenSubtopicModal(stage.id, null)}
                            className="mt-3 block mx-auto border-2 border-dashed border-purple-200 hover:border-purple-400 px-4 py-2 rounded-xl text-xs font-bold text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                          >
                            Add First Module
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-Over Right Drawer (Picture 2 Content) */}
      {activeSubtopic && activeStage && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay with Blur */}
          <div
            onClick={() => setSelectedSubtopicState(null)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer Side Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300 border-l border-slate-200">
              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      {activeSubtopic.title}
                    </h2>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span className="inline-block bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-purple-200">
                        TOPIC CATALOG
                      </span>

                      {viewMode === 'admin' && (() => {
                        const stageSched = getScheduleInfo(activeStage);
                        const sInfo = getScheduleInfo(activeSubtopic, stageSched);
                        return (
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                              sInfo.isLocked
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            {sInfo.isLocked ? (
                              <>
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>Unlocks {sInfo.shortFormatted}</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>{sInfo.hasSchedule && !sInfo.inherited ? `Released ${sInfo.dateFormatted}` : 'Available'}</span>
                              </>
                            )}
                          </span>
                        );
                      })()}
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-3 leading-relaxed">
                      {activeSubtopic.duration || activeSubtopic.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedSubtopicState(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Section Header: LEARNING PATH & Add Module Button */}
                <div className="flex items-center justify-between text-xs font-bold tracking-wider uppercase text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>LEARNING PATH</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      ({activeSubtopic.modules?.length || 0} modules)
                    </span>
                  </div>

                  {viewMode === 'admin' && (
                    <button
                      onClick={() => handleOpenModuleModal(null)}
                      className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[11px] flex items-center gap-1 border border-purple-200 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Module</span>
                    </button>
                  )}
                </div>

                {/* Modules Accordion List */}
                <div className="space-y-4">
                  {activeSubtopic.modules && activeSubtopic.modules.length > 0 ? (
                    activeSubtopic.modules.map((module) => {
                      const isExpanded = expandedModule === module.id || activeSubtopic.modules.length === 1;
                      const stageSched = getScheduleInfo(activeStage);
                      const subSched = getScheduleInfo(activeSubtopic, stageSched);
                      const modSched = getScheduleInfo(module, subSched);
                      const isModLocked = modSched.isLocked;

                      return (
                        <div key={module.id} className="rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
                          {/* Module Header Bar */}
                          <div
                            className={`w-full p-4 flex items-center justify-between text-left font-bold text-sm transition-all ${
                              isExpanded
                                ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                            }`}
                          >
                            <div
                              onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                              className="flex items-center gap-2.5 flex-1 cursor-pointer flex-wrap"
                            >
                              <span
                                className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-black ${
                                  isExpanded ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {module.title.charAt(0).toUpperCase()}
                              </span>
                              <span>{module.title}</span>

                              {/* Module Schedule Badge (Admin Mode Only) */}
                              {viewMode === 'admin' && modSched.hasSchedule && !modSched.inherited && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                                  modSched.isLocked
                                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                                    : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                }`}>
                                  {modSched.isLocked ? <Clock className="w-3 h-3 text-amber-700" /> : <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
                                  <span>{modSched.isLocked ? `Unlocks ${modSched.shortFormatted}` : `Released ${modSched.dateFormatted}`}</span>
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {viewMode === 'admin' && (
                                <div className="flex items-center gap-1 border-r border-white/20 pr-2 mr-1">
                                  {/* Module Schedule Button */}
                                  <button
                                    onClick={() =>
                                      handleOpenScheduleModal('module', module, activeSubtopic.stageId, activeSubtopic.id)
                                    }
                                    title={modSched.hasSchedule && !modSched.inherited ? `Scheduled: ${modSched.fullFormatted}` : 'Set Release Schedule'}
                                    className={`p-1 rounded cursor-pointer ${
                                      modSched.hasSchedule && !modSched.inherited ? 'bg-white/30 text-amber-200' : 'hover:bg-white/20 text-white'
                                    }`}
                                  >
                                    <Calendar className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => handleOpenItemModal(module.id, null)}
                                    title="Add Resource Item"
                                    className="p-1 hover:bg-white/20 rounded cursor-pointer text-white"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenModuleModal(module)}
                                    title="Edit Module"
                                    className="p-1 hover:bg-white/20 rounded cursor-pointer text-white"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteModule(module.id, module.title)}
                                    title="Delete Module"
                                    className="p-1 hover:bg-white/20 rounded cursor-pointer text-rose-200"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}

                              <button onClick={() => setExpandedModule(isExpanded ? null : module.id)} className="cursor-pointer">
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-white" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-slate-400" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Module Expanded Content */}
                          {isExpanded && (
                            <div className="p-4 space-y-3 bg-white">
                              {/* Admin Mode Schedule Info if locked */}
                              {viewMode === 'admin' && isModLocked && (
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2.5">
                                  <Clock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0 animate-pulse" />
                                  <div>
                                    <span className="font-bold block">Content Scheduled Release</span>
                                    <span className="text-[11px] text-amber-700">
                                      This module and all resources (Live Classes, Labs, Assessments) are locked until{' '}
                                      <strong>{modSched.fullFormatted} ({modSched.relativeText})</strong>.
                                    </span>
                                  </div>
                                </div>
                              )}

                              {(() => {
                                  const rawItems = module.items || [];

                                  // 1. Injected Assessments
                                  const matchingAsmnts = (assessments || []).filter((a) => {
                                    const subMatch =
                                      (a.subtopicId && a.subtopicId === activeSubtopic.id) ||
                                      (a.subtopicName && a.subtopicName === activeSubtopic.title) ||
                                      (a.topicName && a.topicName === activeSubtopic.title);
                                    const topicMatch =
                                      (a.innerTopicId && a.innerTopicId === module.id) ||
                                      (a.topicName && a.topicName === module.title);
                                    return (subMatch && topicMatch) || a.topicName === module.title;
                                  });

                                  const injectedAsmnts = matchingAsmnts.map((a) => ({
                                    id: `item-asm-${a.id}`,
                                    assessmentId: a.id,
                                    type: 'ASSESSMENT',
                                    typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                                    iconName: 'FileCheck',
                                    iconBg: 'bg-purple-600 text-white',
                                    title: a.title,
                                    actionText: 'TAKE',
                                    url: '/assessments',
                                    btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                                  }));

                                  // 2. Injected Live Sessions
                                  const matchingLiveSessions = (liveSessions || []).filter((s) => {
                                    const subMatch =
                                      (s.subtopicId && s.subtopicId === activeSubtopic.id) ||
                                      (s.subtopicName && s.subtopicName === activeSubtopic.title) ||
                                      (s.topic_id && s.topic_id.includes(activeSubtopic.id)) ||
                                      (s.technology && activeSubtopic.title?.toLowerCase().includes(s.technology.toLowerCase())) ||
                                      (s.sessionTitle && activeSubtopic.title?.toLowerCase().includes(s.sessionTitle.toLowerCase().split(' ')[0]));
                                    const modMatch =
                                      (s.moduleId && s.moduleId === module.id) ||
                                      (s.moduleName && s.moduleName === module.title) ||
                                      (s.topic_id && s.topic_id.includes(module.id)) ||
                                      (s.sessionTitle && module.title?.toLowerCase().includes(s.sessionTitle.toLowerCase())) ||
                                      (s.technology && module.title?.toLowerCase().includes(s.technology.toLowerCase()));
                                    return (subMatch && modMatch) || (subMatch && !s.moduleId);
                                  });

                                  const injectedLive = matchingLiveSessions.map((s) => ({
                                    id: `item-live-${s.id}`,
                                    sessionId: s.id,
                                    type: 'LIVE CLASS',
                                    typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                                    iconName: 'Video',
                                    iconBg: 'bg-purple-600 text-white',
                                    title: s.sessionTitle || s.title || 'Live Class Masterclass',
                                    actionText: 'JOIN',
                                    url: s.meetingLink || s.meeting_link || 'https://meet.google.com/aspire-lms-live',
                                    btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                                  }));

                                  const existingIds = new Set(rawItems.map((i) => i.id || i.title?.toLowerCase()));
                                  const filteredInjectedAsmnts = injectedAsmnts.filter(
                                    (i) => !existingIds.has(i.id) && !existingIds.has(i.title?.toLowerCase())
                                  );
                                  const filteredInjectedLive = injectedLive.filter(
                                    (i) => !existingIds.has(i.id) && !existingIds.has(i.title?.toLowerCase())
                                  );

                                  // Ensure raw items with matching live session sync latest meeting link
                                  const syncedRawItems = rawItems.map((item) => {
                                    if (item.type === 'LIVE CLASS') {
                                      const matchedSess = (liveSessions || []).find(
                                        (s) =>
                                          s.id === item.sessionId ||
                                          `item-live-${s.id}` === item.id ||
                                          (item.title && s.sessionTitle && item.title.toLowerCase().includes(s.sessionTitle.toLowerCase())) ||
                                          (item.title && s.technology && item.title.toLowerCase().includes(s.technology.toLowerCase()))
                                      );
                                      if (matchedSess && (matchedSess.meetingLink || matchedSess.meeting_link)) {
                                        return {
                                          ...item,
                                          url: matchedSess.meetingLink || matchedSess.meeting_link
                                        };
                                      }
                                    }
                                    return item;
                                  });

                                  const moduleDisplayItems = [...syncedRawItems, ...filteredInjectedLive, ...filteredInjectedAsmnts];

                                return moduleDisplayItems.length > 0 ? (
                                  moduleDisplayItems.map((item) => {
                                    const isItemDone = completedMilestoneItemIds.includes(item.id);

                                    return (
                                      <div
                                        key={item.id}
                                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all group/item ${
                                          isItemDone
                                            ? 'bg-emerald-50/40 border-emerald-200'
                                            : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                                        }`}
                                      >
                                        <div className="flex items-center gap-3">
                                          {/* Interactive Completion Toggle Button */}
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              toggleItemCompletion(item.id);
                                              const nextDone = !isItemDone;
                                              addToast(
                                                nextDone
                                                  ? `✅ Completed "${item.title}"! Progress updated.`
                                                  : `Unmarked "${item.title}"`,
                                                'info'
                                              );
                                            }}
                                            title={isItemDone ? 'Topic Completed (Click to unmark)' : 'Click to mark as completed'}
                                            className={`flex-shrink-0 p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                                              isItemDone
                                                ? 'bg-emerald-100 text-emerald-700 border-emerald-300 shadow-2xs hover:bg-emerald-200'
                                                : 'bg-white text-slate-300 border-slate-200 hover:text-purple-600 hover:border-purple-300'
                                            }`}
                                          >
                                            <CheckCircle2 className={`w-4 h-4 ${isItemDone ? 'text-emerald-600' : 'text-slate-300'}`} />
                                          </button>

                                          {renderItemIcon(item.iconName, item.iconBg, false)}
                                          <div>
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                              <span
                                                className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded border inline-block ${
                                                  item.typeColor || 'bg-purple-100 text-purple-700 border-purple-200'
                                                }`}
                                              >
                                                {item.type}
                                              </span>
                                              {isItemDone && (
                                                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                  COMPLETED
                                                </span>
                                              )}
                                            </div>
                                            <h4 className="text-xs font-bold text-slate-800 leading-tight">{item.title}</h4>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                          {/* Action Button: JOIN, VIEW, TAKE - Visible & Interactive */}
                                          <button
                                            onClick={() =>
                                              handleActionClick(item.actionText, item.title, item.url, isModLocked, modSched, item.id)
                                            }
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                              item.btnStyle || 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                                            }`}
                                            title={`${item.actionText} ${item.title}`}
                                          >
                                            <span>{item.actionText}</span>
                                            <ExternalLink className="w-3 h-3" />
                                          </button>

                                          {viewMode === 'admin' && (
                                            <div className="flex items-center gap-0.5 border-l border-slate-200 pl-1">
                                              <button
                                                onClick={() => handleOpenItemModal(module.id, item)}
                                                title="Edit Item"
                                                className="p-1 text-slate-400 hover:text-purple-600 rounded cursor-pointer"
                                              >
                                                <Edit2 className="w-3 h-3" />
                                              </button>
                                              <button
                                                onClick={() => handleDeleteItem(module.id, item.id, item.title)}
                                                title="Delete Item"
                                                className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div className="text-center py-4 text-xs text-slate-400 space-y-2">
                                    <p>No learning items added yet to this module.</p>
                                    {viewMode === 'admin' && (
                                      <button
                                        onClick={() => handleOpenItemModal(module.id, null)}
                                        className="px-3 py-1.5 bg-purple-50 text-purple-700 font-bold rounded-lg hover:bg-purple-100 text-xs inline-flex items-center gap-1 cursor-pointer"
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add Learning Resource</span>
                                      </button>
                                    )}
                                  </div>
                                );
                              })()}

                              {viewMode === 'admin' && module.items && module.items.length > 0 && (
                                <button
                                  onClick={() => handleOpenItemModal(module.id, null)}
                                  className="w-full py-2 border border-dashed border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span> Add Resource to {module.title}</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                      <p>No modules created for this subtopic yet.</p>
                      {viewMode === 'admin' && (
                        <button
                          onClick={() => handleOpenModuleModal(null)}
                          className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Create First Module</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DEDICATED MODAL: Release Date & Time Scheduler --- */}
      {isScheduleModalOpen && scheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                  {scheduleTarget.type.toUpperCase()} RELEASE SCHEDULER
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  Schedule Unlock Date & Time
                </h3>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100 text-xs">
              <span className="font-medium text-slate-500 block">Target Item:</span>
              <span className="font-extrabold text-purple-900 text-sm mt-0.5 block">{scheduleTarget.title}</span>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-4 text-xs">
              {/* Quick Presets */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Quick Presets</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={applyImmediateUnlock}
                    className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-left transition-all cursor-pointer flex items-center justify-between"
                  >
                    <span>Release Now</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Unlock</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyDatePreset(1, '09:00')}
                    className="px-3 py-2 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 border border-slate-200 rounded-xl font-bold text-slate-700 text-left transition-all cursor-pointer flex items-center justify-between"
                  >
                    <span>Tomorrow</span>
                    <span className="text-[10px] text-slate-400">09:00 AM</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyDatePreset(3, '10:00')}
                    className="px-3 py-2 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 border border-slate-200 rounded-xl font-bold text-slate-700 text-left transition-all cursor-pointer flex items-center justify-between"
                  >
                    <span>In 3 Days</span>
                    <span className="text-[10px] text-slate-400">10:00 AM</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyDatePreset(7, '09:00')}
                    className="px-3 py-2 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 border border-slate-200 rounded-xl font-bold text-slate-700 text-left transition-all cursor-pointer flex items-center justify-between"
                  >
                    <span>In 1 Week</span>
                    <span className="text-[10px] text-slate-400">09:00 AM</span>
                  </button>
                </div>
              </div>

              {/* Exact Date and Time Pickers */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>Unlock Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={scheduleFormData.unlockDate}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, unlockDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold bg-white cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    <span>Unlock Time</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={scheduleFormData.unlockTime}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, unlockTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold bg-white cursor-pointer"
                  />
                </div>
              </div>

              {/* Automatic rule notice */}
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-[11px] text-purple-800 leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>
                  When the stage or module reaches its scheduled date & time, it automatically unlocks and makes all contents and live links (Join, View, Take) immediately accessible!
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClearSchedule}
                  className="px-3 py-2 rounded-xl text-rose-600 font-bold hover:bg-rose-50 border border-transparent hover:border-rose-200 cursor-pointer transition-colors"
                >
                  Clear Schedule
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Schedule</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 1: Create / Edit Stage Modal --- */}
      {isStageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingStage ? 'Edit Milestone Stage' : 'Create New Milestone Stage'}
              </h3>
              <button onClick={() => setIsStageModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStage} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stage Number Badge</label>
                  <input
                    type="text"
                    required
                    value={stageFormData.stageNumber}
                    onChange={(e) => setStageFormData({ ...stageFormData, stageNumber: e.target.value })}
                    placeholder="e.g. STAGE 04"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phase Sub-tag</label>
                  <input
                    type="text"
                    required
                    value={stageFormData.phaseTag}
                    onChange={(e) => setStageFormData({ ...stageFormData, phaseTag: e.target.value })}
                    placeholder="e.g. Phase 4 • Cloud & DevOps"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Stage Headline Title</label>
                <input
                  type="text"
                  required
                  value={stageFormData.title}
                  onChange={(e) => setStageFormData({ ...stageFormData, title: e.target.value })}
                  placeholder="e.g. Stage 4: Microservices & Distributed Architectures"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold text-sm"
                />
              </div>

              {/* Unlock Date and Time Inputs */}
              <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
                <label className="block font-extrabold text-purple-900 flex items-center gap-1">
                  <CalendarClock className="w-3.5 h-3.5 text-purple-600" />
                  <span>Scheduled Unlock Date & Time</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block mb-1">Date</span>
                    <input
                      type="date"
                      value={stageFormData.unlockDate || ''}
                      onChange={(e) => setStageFormData({ ...stageFormData, unlockDate: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold bg-white text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block mb-1">Time</span>
                    <input
                      type="time"
                      value={stageFormData.unlockTime || '09:00'}
                      onChange={(e) => setStageFormData({ ...stageFormData, unlockTime: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold bg-white text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Batch Access</label>
                <select
                  value={stageFormData.targetBatch || 'Weekday Batch'}
                  onChange={(e) => setStageFormData({ ...stageFormData, targetBatch: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold bg-white"
                >
                  <option value="Weekday Batch">Weekday Batch Only (A26W)</option>
                  <option value="Weekend Batch">Weekend Batch Only (A26S)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsStageModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md cursor-pointer"
                >
                  {editingStage ? 'Save Changes' : 'Create Stage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: Create / Edit Subtopic Modal --- */}
      {isSubtopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingSubtopic ? 'Edit Subtopic' : 'Add Subtopic Card'}
              </h3>
              <button onClick={() => setIsSubtopicModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubtopic} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subtopic Title</label>
                <input
                  type="text"
                  required
                  value={subtopicFormData.title}
                  onChange={(e) => setSubtopicFormData({ ...subtopicFormData, title: e.target.value })}
                  placeholder="e.g. Docker Containers & Multi-stage Builds"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold text-sm"
                />
              </div>

              {/* Scheduled Date & Time for Subtopic */}
              <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
                <label className="block font-extrabold text-purple-900 flex items-center gap-1">
                  <CalendarClock className="w-3.5 h-3.5 text-purple-600" />
                  <span>Scheduled Unlock Date & Time</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block mb-1">Date</span>
                    <input
                      type="date"
                      value={subtopicFormData.unlockDate || ''}
                      onChange={(e) => setSubtopicFormData({ ...subtopicFormData, unlockDate: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold bg-white text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block mb-1">Time</span>
                    <input
                      type="time"
                      value={subtopicFormData.unlockTime || '09:00'}
                      onChange={(e) => setSubtopicFormData({ ...subtopicFormData, unlockTime: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold bg-white text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Batch Access</label>
                <select
                  value={subtopicFormData.targetBatch || 'Weekday Batch'}
                  onChange={(e) => setSubtopicFormData({ ...subtopicFormData, targetBatch: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold bg-white"
                >
                  <option value="Weekday Batch">Weekday Batch Only (A26W)</option>
                  <option value="Weekend Batch">Weekend Batch Only (A26S)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Card Subtext Note</label>
                <input
                  type="text"
                  value={subtopicFormData.description}
                  onChange={(e) => setSubtopicFormData({ ...subtopicFormData, description: e.target.value })}
                  placeholder="e.g. Click to view subtopics"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Topic Overview Description (Drawer Header)</label>
                <textarea
                  rows={3}
                  value={subtopicFormData.duration}
                  onChange={(e) => setSubtopicFormData({ ...subtopicFormData, duration: e.target.value })}
                  placeholder="Master containerization fundamentals, Dockerfiles, docker-compose, and environment orchestration."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubtopicModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md cursor-pointer"
                >
                  {editingSubtopic ? 'Save Subtopic' : 'Add Subtopic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: Module Modal --- */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingModule ? 'Edit Module Name' : 'Create New Learning Path Module'}
              </h3>
              <button onClick={() => setIsModuleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModule} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Module Title</label>
                <input
                  type="text"
                  required
                  value={moduleFormData.title}
                  onChange={(e) => setModuleFormData({ ...moduleFormData, title: e.target.value })}
                  placeholder="e.g. Variables & Data Types or Docker Networking"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold"
                />
              </div>

              {/* Scheduled Date & Time for Inner Module */}
              <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
                <label className="block font-extrabold text-purple-900 flex items-center gap-1">
                  <CalendarClock className="w-3.5 h-3.5 text-purple-600" />
                  <span>Scheduled Unlock Date & Time</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block mb-1">Date</span>
                    <input
                      type="date"
                      value={moduleFormData.unlockDate || ''}
                      onChange={(e) => setModuleFormData({ ...moduleFormData, unlockDate: e.target.value })}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold bg-white text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block mb-1">Time</span>
                    <input
                      type="time"
                      value={moduleFormData.unlockTime || '09:00'}
                      onChange={(e) => setModuleFormData({ ...moduleFormData, unlockTime: e.target.value })}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold bg-white text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModuleModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md cursor-pointer"
                >
                  Save Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: Item Modal --- */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? 'Edit Resource Item' : 'Add Resource Item to Module'}
              </h3>
              <button onClick={() => setIsItemModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Resource Category</label>
                  <select
                    value={itemFormData.type}
                    onChange={(e) => {
                      const typeVal = e.target.value;
                      let act = 'JOIN';
                      if (typeVal === 'PRACTICAL LAB') act = 'VIEW';
                      if (typeVal === 'ASSESSMENT') act = 'TAKE';
                      setItemFormData({ ...itemFormData, type: typeVal, actionText: act });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold bg-white"
                  >
                    <option value="LIVE CLASS">LIVE CLASS</option>
                    <option value="PRACTICAL LAB">PRACTICAL LAB</option>
                    <option value="ASSESSMENT">ASSESSMENT</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Action Button Text</label>
                  <input
                    type="text"
                    required
                    value={itemFormData.actionText}
                    onChange={(e) => setItemFormData({ ...itemFormData, actionText: e.target.value })}
                    placeholder="JOIN, VIEW, TAKE, OPEN"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-bold uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Resource Item Name</label>
                <input
                  type="text"
                  required
                  value={itemFormData.title}
                  onChange={(e) => setItemFormData({ ...itemFormData, title: e.target.value })}
                  placeholder="e.g. Variables Live Workshop or Dockerfile Hands-on Lab"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Action Link / URL (Optional)</label>
                <input
                  type="url"
                  value={itemFormData.url}
                  onChange={(e) => setItemFormData({ ...itemFormData, url: e.target.value })}
                  placeholder="https://zoom.us/... or https://lab.aspirelms.io/..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md cursor-pointer"
                >
                  Save Resource Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 5: Overview Banner Modal --- */}
      {isOverviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Edit Banner Headline</h3>
              <button onClick={() => setIsOverviewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOverview} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Banner Headline</label>
                <textarea
                  rows={3}
                  required
                  value={overviewFormData.headline}
                  onChange={(e) => setOverviewFormData({ ...overviewFormData, headline: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOverviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md cursor-pointer"
                >
                  Update Banner Overview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
