import React, { useState } from 'react';
import {
  BookOpen,
  Award,
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
  Flag,
  Book,
  FileText,
  Layers,
  Calendar,
  CalendarClock,
  Timer,
  CheckCircle2,
  AlertCircle,
  Building2,
  FolderGit2,
  HelpCircle
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useLmsData } from '../../context/LmsDataContext';
import { BatchFilterSelector } from '../../components/common/BatchFilterSelector';

export const formatLocalDate = (d) => {
  if (!d || isNaN(new Date(d).getTime())) return '';
  const dateObj = new Date(d);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const SUBTOPIC_MODULE_MAP = {
  'm1_git': 'mod-git',
  'm1_html': 'mod-html',
  'm1_css_fund': 'mod-css',
  'm1_css_adv': 'mod-advcss',
  'm1_bootstrap': 'mod-bootstrap',
  'm1_js_ess': 'mod-jsess',
  'm1_js_func': 'mod-jsfunc',
  'm1_dom': 'mod-dom',
  'm1_es6': 'mod-es6async',
  'm2_py_fund': 'subtop-1787202208426',
  'm2_py_oop': 'subtop-1787203469178',
  'm2_postgres': 'subtop-1787203490227',
  'm2_django_api': 'subtop-1787203534393',
  'm2_dsa_arrays': 'subtop-1787203669226',
  'm2_dsa_linkedlist': 'subtop-1787203763954',
  'm2_dsa_trees': 'subtop-1787203763954',
  'm2_dsa_dp': 'subtop-1787203763954',
  'mod-stg3-m1': 'mod-stg3-m1',
  'mod-stg3-m2': 'mod-stg3-m2',
  'mod-stg3-m3': 'mod-stg3-m3',
  'mod-stg4-m1': 'mod-stg4-m1',
  'mod-stg4-m2': 'mod-stg4-m2',
  'mod-stg4-m3': 'mod-stg4-m3',
  'mod-stg4-m4': 'mod-stg4-m4',
  'mod-stg4-m5': 'mod-stg4-m5'
};

export const isMatchingStage = (stageA, stageB) => {
  if (!stageA || !stageB) return true;
  const cleanA = String(stageA || '').replace(/-(w|s)$/i, '').trim().toLowerCase();
  const cleanB = String(stageB || '').replace(/-(w|s)$/i, '').trim().toLowerCase();
  if (cleanA === cleanB) return true;
  if ((cleanA === 's1' || cleanA === 'top-stg-1') && (cleanB === 's1' || cleanB === 'top-stg-1')) return true;
  if ((cleanA === 's2' || cleanA === 'top-stg-2') && (cleanB === 's2' || cleanB === 'top-stg-2')) return true;
  if ((cleanA === 's3' || cleanA === 'top-stg-3') && (cleanB === 's3' || cleanB === 'top-stg-3')) return true;
  if ((cleanA === 's4' || cleanA === 'top-stg-4') && (cleanB === 's4' || cleanB === 'top-stg-4')) return true;
  return false;
};

// Pure Date & Time Release Determination Helper with Hierarchy Inheritance
export const parseUnlockTimestamp = (unlockDate, unlockTime, unlockDateTime) => {
  if (!unlockDate && !unlockDateTime) return null;

  if (typeof unlockDateTime === 'number' && !isNaN(unlockDateTime)) {
    return unlockDateTime;
  }

  if (unlockDateTime && typeof unlockDateTime === 'string' && (unlockDateTime.includes('Z') || unlockDateTime.length > 16)) {
    try {
      const parsed = new Date(unlockDateTime).getTime();
      if (!isNaN(parsed)) return parsed;
    } catch (e) {}
  }

  let rawDate = unlockDate || '';
  let rawTime = unlockTime || '00:00';

  if (!rawDate && unlockDateTime && typeof unlockDateTime === 'string') {
    const parts = unlockDateTime.split('T');
    rawDate = parts[0];
    if (parts[1] && !unlockTime) {
      rawTime = parts[1].substring(0, 5);
    }
  }

  if (rawDate && typeof rawDate === 'string') {
    if (rawDate.includes('T')) {
      const parts = rawDate.split('T');
      rawDate = parts[0];
      if (parts[1] && !unlockTime) {
        rawTime = parts[1].substring(0, 5);
      }
    }

    const dParts = rawDate.split('-').map(Number);
    if (dParts.length === 3 && !dParts.some(isNaN)) {
      const [year, month, day] = dParts;
      let hours = 0;
      let minutes = 0;
      if (rawTime) {
        const tParts = String(rawTime).split(':').map(Number);
        hours = isNaN(tParts[0]) ? 0 : tParts[0];
        minutes = isNaN(tParts[1]) ? 0 : tParts[1];
      }
      const d = new Date(year, month - 1, day, hours, minutes, 0, 0);
      const ts = d.getTime();
      if (!isNaN(ts)) return ts;
    }
  }

  if (unlockDateTime) {
    try {
      const parsed = new Date(unlockDateTime).getTime();
      if (!isNaN(parsed)) return parsed;
    } catch (e) {}
  }
  return null;
};

export const getScheduleInfo = (item, parentSchedule = null) => {
  if (!item) {
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

  let unlockDate = item.unlockDate || '';
  let unlockTime = item.unlockTime || '';
  let unlockDateTime = item.unlockDateTime || (unlockDate ? `${unlockDate}T${unlockTime || '00:00'}` : '');

  // Extract date and time in local timezone if missing but unlockDateTime is present
  if (unlockDateTime && (!unlockDate || !unlockTime)) {
    try {
      const dObj = new Date(unlockDateTime);
      if (!isNaN(dObj.getTime())) {
        const year = dObj.getFullYear();
        const month = String(dObj.getMonth() + 1).padStart(2, '0');
        const day = String(dObj.getDate()).padStart(2, '0');
        if (!unlockDate) {
          unlockDate = `${year}-${month}-${day}`;
        }
        if (!unlockTime) {
          const hours = String(dObj.getHours()).padStart(2, '0');
          const minutes = String(dObj.getMinutes()).padStart(2, '0');
          unlockTime = `${hours}:${minutes}`;
        }
      }
    } catch (e) {}
  }

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
  const targetTime = parseUnlockTimestamp(unlockDate, unlockTime, unlockDateTime);

  if (!targetTime || isNaN(targetTime)) {
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
    quizzes = [],
    liveSessions = [],
    completedMilestoneItemIds = [],
    toggleItemCompletion = () => {},
    markItemCompleted = () => {},
    unmarkItemCompleted = () => {},
    toggleSubtopicCompletion = () => {},
    courseLessons = [],
    milestoneLocks = [],
    setLessonLock = () => {},
    removeLessonLock = () => {},
    getLessonLockStatus = () => {},
    codingQuestions = [],
    projects = [],
    availableBatches = []
  } = useLmsData();

  // Mode Toggle: 'admin' (CRUD & Schedule Setter) vs 'user' (Main LMS Student View)

  const [selectedBatch, setSelectedBatchState] = useState(
    activeBatchFilter && activeBatchFilter !== 'ALL' ? activeBatchFilter : 'ALL'
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

  const [selectedSubtopicState, setSelectedSubtopicState] = useState(null); // { stageId, subtopicId }
  const [expandedStages, setExpandedStages] = useState({ 'stage-1': true, 'stage-1-w': true, 'stage-1-s': true, 's1': true, 's1-w': true, 's1-s': true });
  const [expandedModule, setExpandedModule] = useState(null);

  const toggleStageAccordion = (stageId) => {
    setExpandedStages((prev) => {
      const isCurrentlyOpen = !!prev[stageId];
      if (isCurrentlyOpen) {
        return {};
      }
      return { [stageId]: true };
    });
  };

  const [searchParams] = useSearchParams();
  const queryCourseId = searchParams.get('courseId') || courses[0]?.id || '';

  const [selectedCourseId, setSelectedCourseId] = useState(() => searchParams.get('courseId') || courses[0]?.id || '');
  const [selectedStudentAccessId, setSelectedStudentAccessId] = useState('ALL');

  // Derive active milestones stages from current milestone state or selected course
  const getActiveMilestoneStages = () => {
    const cleanNorm = (str) => String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    const stripSuffix = (str) => String(str || '').replace(/-(w|s)$/i, '').trim();

    // Helper to resolve lessons for a specific subtopic strictly without cross-stage bleeding
    const resolveLessonsForSubtopic = (subId, subTitle, stageId) => {
      if (!Array.isArray(courseLessons) || courseLessons.length === 0) return [];
      const subIdClean = stripSuffix(subId);
      const subIdNorm = cleanNorm(subId);
      const mappedModId = SUBTOPIC_MODULE_MAP[subIdClean] || subIdClean;

      return courseLessons.filter(l => {
        const lModClean = stripSuffix(l.module_id);
        const lModId = cleanNorm(l.module_id);
        const lStgId = l.stage_id;

        // Strict stage boundary check
        if (stageId && lStgId && !isMatchingStage(lStgId, stageId)) {
          return false;
        }

        // Strict module/subtopic ID match
        if (lModClean === subIdClean || lModClean === mappedModId || lModId === subIdNorm) {
          return true;
        }
        return false;
      });
    };

    let baseStages = [];

    // 1. Primary: Use course-specific milestones if a course is selected
    if (selectedCourseId && selectedCourseId !== 'ALL') {
      const courseMilestones = milestonesByBatch?.[selectedCourseId];
      if (Array.isArray(courseMilestones?.stages) && courseMilestones.stages.length > 0) {
        baseStages = courseMilestones.stages;
      } else {
        const targetCourse = courses.find(c => c.id === selectedCourseId || c.title?.toLowerCase() === selectedCourseId.toLowerCase());
        if (targetCourse && Array.isArray(targetCourse.topics) && targetCourse.topics.length > 0) {
          baseStages = targetCourse.topics.map((t, idx) => ({
            id: t.id || `stg-${idx}`,
            stageNumber: `STAGE 0${idx + 1}`,
            phaseTag: `${targetCourse.title} • Stage ${idx + 1}`,
            title: t.title,
            unlockDate: t.unlockDate || (idx === 0 ? formatLocalDate(new Date()) : null),
            unlockTime: t.unlockTime || '09:00',
            unlockDateTime: t.unlockDateTime || null,
            liveClasses: t.liveClasses || t.live_classes || 0,
            practice: t.practice || 0,
            assessments: t.assessments || 0,
            subtopics: t.subtopics || []
          }));
        }
      }
    }

    // 2. Secondary fallback: Use batch milestones stages
    if ((!baseStages || baseStages.length === 0) && Array.isArray(currentMilestones?.stages) && currentMilestones.stages.length > 0) {
      baseStages = currentMilestones.stages;
    }

    if (!baseStages || baseStages.length === 0) return [];

    // All stages from the database are rendered without artificial client-side filters
    const cleanStages = baseStages.filter(s => !!s);

    return cleanStages.map((stage, idx) => {
      const stageId = stage.id || `stg-${idx}`;
      return {
        ...stage,
        id: stageId,
        subtopics: (stage.subtopics || []).map((sub, sIdx) => {
          const subId = sub.id || sub._id || sub.subtopic_id || `sub-${idx}-${sIdx}`;
          const cleanSubTitle = String(sub.title || '').replace(/^Module\s*\d+\s*:\s*/i, '').trim();
          let modules = Array.isArray(sub.modules) && sub.modules.length > 0 ? sub.modules : [];

          if (modules.length === 0) {
            const lessons = resolveLessonsForSubtopic(subId, cleanSubTitle, stageId);
            if (lessons.length > 0) {
              modules = lessons.map(lesson => ({
                id: lesson.id,
                title: String(lesson.title || '').replace(/^Module\s*\d+\s*:\s*/i, '').trim(),
                description: lesson.description || '',
                duration: lesson.duration || lesson.durationHours || '1hr 30min',
                durationHours: lesson.durationHours || '1hr 30min',
                topics: [],
                items: []
              }));
            }
          }

          return {
            ...sub,
            id: subId,
            title: cleanSubTitle,
            modulesCount: modules.length,
            modules: modules
          };
        })
      };
    });
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
  let totalLessonsCalculated = 0;

  const activeCourseId = (() => {
    if (selectedCourseId === 'ALL') {
      const pythonCourse = courses.find(c => c.title && c.title.toLowerCase().includes('python'));
      return pythonCourse ? pythonCourse.id : courses[0]?.id;
    }
    return selectedCourseId;
  })();

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

      const subIdClean = String(sub.id || '').replace(/-(w|s)$/i, '').trim();
      const mappedModId = SUBTOPIC_MODULE_MAP[subIdClean] || subIdClean;
      const matchingCourseLessons = courseLessons.filter(
        (l) => (!activeCourseId || l.course_id === activeCourseId) &&
               isMatchingStage(l.stage_id, stage.id) &&
               (String(l.module_id || '').replace(/-(w|s)$/i, '').trim() === subIdClean || String(l.module_id || '').replace(/-(w|s)$/i, '').trim() === mappedModId)
      );

      const countForThisSubtopic = Math.max(
        matchingCourseLessons.length,
        sub.modules?.length || 0,
        subItems.length,
        1
      );
      totalLessonsCalculated += countForThisSubtopic;

      const isSubDone =
        sub.isCompleted ||
        completedMilestoneItemIds.includes(sub.id) ||
        (subItems.length > 0 && subItems.every((it) => completedMilestoneItemIds.includes(it.id)));

      if (isSubDone) {
        completedSubtopicsCount += 1;
      }
    });
  });

  const courseLessonsCountForCourse = courseLessons.filter(
    (l) => !activeCourseId || l.course_id === activeCourseId
  ).length;

  const totalLessonsDisplayCount = Math.max(
    courseLessonsCountForCourse,
    totalLessonsCalculated,
    totalSubtopicsCount
  );

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

  const [expandedTopicItemIds, setExpandedTopicItemIds] = useState([]);

  const toggleTopicItemExpand = (itemId) => {
    setExpandedTopicItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const getTopicAgendaOverview = (item) => {
    if (item?.agenda && typeof item.agenda === 'string' && item.agenda.trim()) return item.agenda;
    if (item?.description && typeof item.description === 'string' && item.description.trim()) return item.description;
    if (item?.overview && typeof item.overview === 'string' && item.overview.trim()) return item.overview;
    return item?.title ? `${item.title} - In-depth discussion and live hands-on implementation.` : 'No session agenda specified.';
  };

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [targetModuleIdForItem, setTargetModuleIdForItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [itemFormData, setItemFormData] = useState({
    type: 'LIVE CLASS',
    title: '',
    description: '',
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
    const cleanNorm = (str) => String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    const stripSuffix = (str) => String(str || '').replace(/-(w|s)$/i, '').trim();

    const stage = filteredStages.find(
      (s) => s.id === selectedSubtopicState.stageId ||
             stripSuffix(s.id) === stripSuffix(selectedSubtopicState.stageId) ||
             cleanNorm(s.title) === cleanNorm(selectedSubtopicState.stageId)
    ) || filteredStages.find(s => (s.subtopics || []).some(st => st.id === selectedSubtopicState.subtopicId || stripSuffix(st.id) === stripSuffix(selectedSubtopicState.subtopicId) || cleanNorm(st.title) === cleanNorm(selectedSubtopicState.subtopicId)));

    if (!stage) return { activeStage: null, activeSubtopic: null };

    const sub = (stage.subtopics || []).find(
      (st) => st.id === selectedSubtopicState.subtopicId ||
              stripSuffix(st.id) === stripSuffix(selectedSubtopicState.subtopicId) ||
              cleanNorm(st.title) === cleanNorm(selectedSubtopicState.subtopicId)
    );

    if (!sub) return { activeStage: stage, activeSubtopic: null };

    // Robust module resolution: If sub.modules is empty, retrieve lessons from courseLessons database table
    let subModules = Array.isArray(sub.modules) && sub.modules.length > 0 ? sub.modules : [];
    if (subModules.length === 0 && Array.isArray(courseLessons) && courseLessons.length > 0) {
      const subIdClean = stripSuffix(sub.id);
      const subIdNorm = cleanNorm(sub.id);
      const mappedModId = SUBTOPIC_MODULE_MAP[subIdClean] || subIdClean;

      const matchedLessons = courseLessons.filter(l => {
        const lModClean = stripSuffix(l.module_id);
        const lModId = cleanNorm(l.module_id);
        const lStgId = l.stage_id;

        // Strict stage boundary check
        if (stage.id && lStgId && !isMatchingStage(lStgId, stage.id)) {
          return false;
        }

        // Strict module/subtopic ID match
        if (lModClean === subIdClean || lModClean === mappedModId || lModId === subIdNorm) {
          return true;
        }
        return false;
      });

      if (matchedLessons.length > 0) {
        subModules = matchedLessons.map(l => ({
          id: l.id,
          title: String(l.title || '').replace(/^Module\s*\d+\s*:\s*/i, '').trim(),
          description: l.description || '',
          duration: l.duration || l.durationHours || '1hr 30min',
          durationHours: l.durationHours || '1hr 30min',
          items: [],
          topics: []
        }));
      }
    }

    return {
      activeStage: stage,
      activeSubtopic: { stageId: stage.id, ...sub, modules: subModules }
    };
  };

  const { activeStage, activeSubtopic } = getActiveSubtopicAndStage();

  // Helper for rendering icons dynamically
  const renderItemIcon = (iconName, iconBg, isLocked = false) => {
    let IconComp = Video;
    if (iconName === 'Code') IconComp = Code;
    if (iconName === 'Building2' || iconName === 'FolderGit2') IconComp = Building2;
    if (iconName === 'FileCheck') IconComp = FileCheck;
    if (iconName === 'HelpCircle' || iconName === 'Help') IconComp = HelpCircle;
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
      }, selectedBatch);
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
      }, selectedBatch);
      addToast(
        unlockDate
          ? `📅 Subtopic release scheduled for ${unlockDate} at ${unlockTime}`
          : 'Subtopic schedule updated',
        'success'
      );
    } else if (scheduleTarget.type === 'module') {
      let targetCourseId = selectedCourseId;
      if (targetCourseId === 'ALL') {
        const pythonCourse = courses.find(c => c.title && c.title.toLowerCase().includes('python'));
        targetCourseId = pythonCourse ? pythonCourse.id : courses[0]?.id;
      }
      setLessonLock({
        lesson_id: scheduleTarget.id,
        batch_code: selectedBatch,
        course_id: targetCourseId || '',
        stage_id: scheduleTarget.stageId || '',
        module_id: scheduleTarget.subtopicId || '',
        unlock_date: unlockDate,
        unlock_time: unlockTime
      });
      if (scheduleTarget.stageId && scheduleTarget.subtopicId) {
        setModuleSchedule(scheduleTarget.stageId, scheduleTarget.subtopicId, scheduleTarget.id, {
          unlockDate,
          unlockTime,
          unlockDateTime: uDateTime
        }, selectedBatch);
      }
      addToast(
        unlockDate
          ? `📅 Lesson release scheduled for ${unlockDate} at ${unlockTime}`
          : 'Lesson schedule updated',
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
      }, selectedBatch);
      addToast('Stage schedule cleared (Available by default)', 'info');
    } else if (scheduleTarget.type === 'subtopic') {
      setSubtopicSchedule(scheduleTarget.stageId, scheduleTarget.id, {
        unlockDate: '',
        unlockTime: '',
        unlockDateTime: null
      }, selectedBatch);
      addToast('Subtopic schedule cleared (Inherits stage release)', 'info');
    } else if (scheduleTarget.type === 'module') {
      removeLessonLock(scheduleTarget.id, selectedBatch);
      if (scheduleTarget.stageId && scheduleTarget.subtopicId) {
        setModuleSchedule(scheduleTarget.stageId, scheduleTarget.subtopicId, scheduleTarget.id, {
          unlockDate: '',
          unlockTime: '',
          unlockDateTime: null
        }, selectedBatch);
      }
      addToast('Lesson schedule cleared (Inherits subtopic release)', 'info');
    }

    setIsScheduleModalOpen(false);
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
      updateStage(editingStage.id, payload, selectedBatch);
      addToast('Milestone stage updated successfully', 'success');
    } else {
      addStage(payload, selectedBatch);
      addToast('New milestone stage created', 'success');
    }
    setIsStageModalOpen(false);
  };

  const handleDeleteStage = (stageId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteStage(stageId, selectedBatch);
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
      updateSubtopic(targetStageIdForSubtopic, editingSubtopic.id, payload, selectedBatch);
      addToast('Subtopic updated', 'success');
    } else {
      addSubtopic(targetStageIdForSubtopic, payload, selectedBatch);
      addToast('Subtopic added to stage', 'success');
    }
    setIsSubtopicModalOpen(false);
  };

  const handleDeleteSubtopic = (stageId, subtopicId, title) => {
    if (window.confirm(`Delete subtopic "${title}"?`)) {
      deleteSubtopic(stageId, subtopicId, selectedBatch);
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
        duration: module.duration || module.durationHours || '1hr 30min',
        unlockDate: module.unlockDate || '',
        unlockTime: module.unlockTime || '09:00'
      });
    } else {
      setEditingModule(null);
      setModuleFormData({
        title: '',
        duration: '1hr 30min',
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
      updateModule(activeSubtopic.stageId, activeSubtopic.id, editingModule.id, payload, selectedBatch);
      addToast('Module updated', 'success');
    } else {
      addModule(activeSubtopic.stageId, activeSubtopic.id, payload, selectedBatch);
      addToast('New module added to learning path', 'success');
    }
    setIsModuleModalOpen(false);
  };

  const handleDeleteModule = (moduleId, title) => {
    if (!activeSubtopic) return;
    if (window.confirm(`Delete module "${title}" and all its resources?`)) {
      deleteModule(activeSubtopic.stageId, activeSubtopic.id, moduleId, selectedBatch);
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
        description: item.description || item.agenda || item.overview || '',
        actionText: item.actionText,
        url: item.url || ''
      });
    } else {
      setEditingItem(null);
      setItemFormData({
        type: 'LIVE CLASS',
        title: '',
        description: '',
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

    const desc = itemFormData.description || '';
    const payload = {
      ...itemFormData,
      description: desc,
      agenda: desc,
      overview: desc,
      typeColor,
      iconName,
      iconBg,
      btnStyle
    };
    const curMod = activeSubtopic.modules?.find(m => m.id === targetModuleIdForItem);
    const modTitle = curMod?.title || '';

    if (editingItem) {
      updateLearningItem(
        activeSubtopic.stageId,
        activeSubtopic.id,
        targetModuleIdForItem,
        editingItem.id,
        { ...payload, prevTitle: editingItem.title, topicIndex: editingItem.topicIndex, moduleTitle: modTitle },
        selectedBatch
      );
      addToast('Topic & agenda updated', 'success');
    } else {
      addLearningItem(
        activeSubtopic.stageId,
        activeSubtopic.id,
        targetModuleIdForItem,
        { ...payload, moduleTitle: modTitle },
        selectedBatch
      );
      addToast('Topic & agenda added to module', 'success');
    }
    setIsItemModalOpen(false);
  };

  const handleDeleteItem = (moduleId, itemId, title, topicIndex = undefined) => {
    if (!activeSubtopic) return;
    if (window.confirm(`Delete resource item "${title}"?`)) {
      const curMod = activeSubtopic.modules?.find(m => m.id === moduleId);
      deleteLearningItem(activeSubtopic.stageId, activeSubtopic.id, moduleId, itemId, selectedBatch, {
        title,
        topicIndex,
        moduleTitle: curMod?.title || ''
      });
      addToast('Resource item deleted', 'info');
    }
  };

  // Save Banner Overview
  const handleSaveOverview = (e) => {
    e.preventDefault();
    updateMilestonesOverview(overviewFormData, selectedBatch);
    addToast('Roadmap banner settings updated', 'success');
    setIsOverviewModalOpen(false);
  };

  // Action Click Handler for JOIN, VIEW, TAKE with Strict Date & Time Enforcement
  const handleActionClick = (actionText, title, url, isLocked, sInfo, itemId) => {
    if (isLocked) {
      if (url && url.startsWith('http')) {
        if (window.confirm(`[Admin Preview] This item is scheduled for ${sInfo.fullFormatted} (${sInfo.relativeText}). Test open link now?`)) {
          window.open(url, '_blank');
        }
      } else {
        addToast(`🔒 [Admin Preview] Scheduled for ${sInfo.fullFormatted}`, 'info');
      }
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
    <div className="space-y-5 pb-12">
      {/* Unified Page Header & Control Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
        <div className="space-y-4">
          {/* Top: Page Title & Realtime Indicator */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md shadow-purple-600/25">
              <Flag className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Milestones Roadmap</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Realtime Sync Active
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Manage course stages, modules, and unlock schedules with live cloud persistence</p>
            </div>
          </div>

          {/* Below Title: Course on Left, Category & Batch on Right */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 flex-shrink-0">
                <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                <span>Course:</span>
              </label>
              <div className="relative">
                <select
                  value={selectedCourseId || courses[0]?.id || ''}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="px-3.5 py-2 pr-8 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 hover:border-purple-300 focus:outline-none focus:border-purple-600 focus:bg-white transition-all shadow-2xs cursor-pointer appearance-none min-w-[200px]"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <BatchFilterSelector
              activeBatch={selectedBatch}
              onSelectBatch={setSelectedBatch}
              showNewBatch={false}
            />
          </div>
        </div>

        {/* Stats Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-bold flex-shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Stages</p>
              <p className="text-base font-black text-slate-900">{filteredStages.length}</p>
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold flex-shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Modules</p>
              <p className="text-base font-black text-slate-900">{totalSubtopicsCount}</p>
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Unlocked</p>
              <p className="text-base font-black text-slate-900">{autoUnlockedStagesCount} / {filteredStages.length}</p>
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold flex-shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Completion</p>
              <p className="text-base font-black text-slate-900">{completionPercentage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Timeline (Pure Time-Based Lock/Unlock System) */}
      <div className="relative pt-4">
        {filteredStages.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-100">
              <Layers className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800 mb-1">No milestones available</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              Schedule live sessions or add milestones to populate the curriculum roadmap for this batch.
            </p>
            <Button
              onClick={() => {
                setEditingStage(null);
                setStageFormData({
                  title: '',
                  stageNumber: 'STAGE 01',
                  phaseTag: 'Senior Engineering Cohort • Stage 1',
                  unlockDate: formatLocalDate(new Date()),
                  unlockTime: '09:00'
                });
                setIsStageModalOpen(true);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Create First Stage
            </Button>
          </div>
        ) : (
          filteredStages.map((stage, stageIndex) => {
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
                      ? 'border-purple-600 bg-purple-600 text-white'
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
                  onClick={() => toggleStageAccordion(stage.id)}
                  className="group bg-white text-slate-900 hover:bg-purple-50 p-5 cursor-pointer select-none transition-all duration-200 relative border-b border-slate-100"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner flex-shrink-0 transition-all duration-300 ${
                          isStageCurrentUnlocked
                            ? 'bg-purple-100 group-hover:bg-purple-100 text-purple-600 group-hover:text-purple-700'
                            : 'bg-slate-100 text-slate-400 group-hover:bg-purple-100 group-hover:text-purple-700'
                        }`}
                      >
                        {isStageCurrentUnlocked ? <Brain className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 group-hover:text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200 shadow-xs transition-colors duration-300">
                            {stage.stageNumber}
                          </span>
                          <span className="text-xs font-medium text-slate-400 group-hover:text-purple-500 transition-colors duration-300">
                            {stage.phaseTag}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-purple-700 mt-1 leading-snug transition-colors duration-300">
                          {stage.title}
                        </h3>
                        
                        <p className="text-xs text-slate-400 group-hover:text-purple-500 font-medium mt-1 flex items-center gap-1.5 transition-colors duration-300">
                          <span>{visibleSubtopics.length} Modules Included</span>
                          <span>•</span>
                          <span>{expandedStages[stage.id] ? 'Click card to hide modules' : 'Click card to view modules'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Right Side: Admin Schedule Setter & Dropdown Chevron */}
                    <div className="flex flex-wrap items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                      {/* Scheduled Date & Time Release Badge */}
                      {stageSched.hasSchedule ? (
                        stageSched.isLocked ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 group-hover:bg-amber-400/20 group-hover:backdrop-blur-md border border-amber-300 group-hover:border-amber-300/40 px-3.5 py-1.5 text-xs font-bold text-amber-800 group-hover:text-amber-900 transition-all duration-300 shadow-2xs">
                            <Clock className="w-3.5 h-3.5 text-amber-600 group-hover:text-amber-700 animate-pulse" />
                            <span>Unlocks: {stageSched.shortFormatted} ({stageSched.relativeText})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 group-hover:bg-emerald-400/20 group-hover:backdrop-blur-md border border-emerald-300 group-hover:border-emerald-300/40 px-3.5 py-1.5 text-xs font-bold text-emerald-800 group-hover:text-emerald-900 transition-all duration-300 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 group-hover:text-emerald-700" />
                            <span>UNLOCKED • Released {stageSched.dateFormatted}</span>
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 group-hover:bg-emerald-400/20 group-hover:backdrop-blur-md border border-emerald-300 group-hover:border-emerald-300/40 px-3.5 py-1.5 text-xs font-bold text-emerald-800 group-hover:text-emerald-900 transition-all duration-300 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>UNLOCKED • Available</span>
                        </span>
                      )}

                      {/* Admin Mode Schedule Setter and CRUD Buttons */}
                      <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 transition-all duration-300">
                        <button
                          onClick={() => handleOpenScheduleModal('stage', stage)}
                          title={stageSched.hasSchedule ? `Scheduled: ${stageSched.fullFormatted}` : 'Set Release Date & Time'}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                            stageSched.hasSchedule
                              ? 'bg-purple-600 text-white shadow-xs border border-purple-400/50 hover:bg-purple-700'
                              : 'bg-white text-purple-700 border border-slate-300 hover:bg-purple-50'
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <Clock className="w-3 h-3" />
                          <span>{stageSched.hasSchedule ? 'Date Set' : 'Set Date & Time'}</span>
                        </button>

                        <button
                          onClick={() => handleOpenSubtopicModal(stage.id, null)}
                          title="Add Subtopic to Stage"
                          className="p-1.5 text-slate-500 group-hover:text-purple-700 hover:bg-slate-200 group-hover:hover:bg-purple-100 rounded-lg transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenStageModal(stage)}
                          title="Edit Stage Details"
                          className="p-1.5 text-slate-500 group-hover:text-purple-700 hover:bg-slate-200 group-hover:hover:bg-purple-100 rounded-lg transition-all cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStage(stage.id, stage.title)}
                          title="Delete Stage"
                          className="p-1.5 text-rose-400 group-hover:text-rose-500 hover:bg-rose-50 group-hover:hover:bg-rose-100 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Interactive Chevron Toggle Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStageAccordion(stage.id);
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-100 text-purple-600 group-hover:text-purple-700 hover:bg-purple-200 transition-all cursor-pointer shadow-sm ml-1"
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
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleSubtopicCompletion(subtopic);
                                      const nextDone = !isSubDone;
                                      addToast(
                                        nextDone
                                          ? `✅ Marked "${subtopic.title}" as completed!`
                                          : `⚪ Marked "${subtopic.title}" as uncompleted`,
                                        'info'
                                      );
                                    }}
                                    title={isSubDone ? 'Topic Completed (Click to unmark)' : 'Click to mark topic as completed'}
                                    className={`flex h-7 w-7 items-center justify-center rounded-xl font-bold text-xs flex-shrink-0 cursor-pointer border transition-transform active:scale-95 ${
                                      isSubDone
                                        ? 'bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200'
                                        : isSubtopicLocked
                                        ? 'bg-slate-100 text-slate-600 border-slate-200'
                                        : 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200'
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
                                        <span
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSubtopicCompletion(subtopic);
                                            addToast(`⚪ Marked "${subtopic.title}" as uncompleted`, 'info');
                                          }}
                                          title="Click to uncomplete"
                                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200 cursor-pointer transition-colors"
                                        >
                                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                          <span>Completed ✕</span>
                                        </span>
                                      )}

                                      {/* Subtopic Scheduled Date Badge */}
                                      {subSched.hasSchedule && !subSched.inherited && (
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
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-6 text-slate-500 text-xs font-medium">
                        No modules added to this stage yet.
                        <button
                          onClick={() => handleOpenSubtopicModal(stage.id, null)}
                          className="mt-3 block mx-auto border-2 border-dashed border-purple-200 hover:border-purple-400 px-4 py-2 rounded-xl text-xs font-bold text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                        >
                          + Add First Module
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        }))}
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
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
            <div className="w-screen max-w-3xl lg:max-w-4xl bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300 border-l border-slate-200">
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

                      {(() => {
                        let subItems = [];
                        (activeSubtopic.modules || []).forEach((mod) => {
                          (mod.items || []).forEach((item) => subItems.push(item));
                        });
                        const isDrawerSubtopicDone =
                          activeSubtopic.isCompleted ||
                          completedMilestoneItemIds.includes(activeSubtopic.id) ||
                          (subItems.length > 0 && subItems.every((it) => completedMilestoneItemIds.includes(it.id)));

                        return (
                          <button
                            type="button"
                            onClick={() => {
                              toggleSubtopicCompletion(activeSubtopic);
                              addToast(
                                !isDrawerSubtopicDone
                                  ? `✅ Marked all topics in "${activeSubtopic.title}" as completed!`
                                  : `⚪ Marked "${activeSubtopic.title}" as uncompleted`,
                                'info'
                              );
                            }}
                            title={isDrawerSubtopicDone ? 'Topic Completed (Click to uncomplete all)' : 'Click to mark entire topic as completed'}
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 cursor-pointer transition-colors ${
                              isDrawerSubtopicDone
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200 shadow-2xs'
                                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-purple-50 hover:text-purple-700'
                            }`}
                          >
                            <CheckCircle2 className={`w-3 h-3 ${isDrawerSubtopicDone ? 'text-emerald-600' : 'text-slate-400'}`} />
                            <span>{isDrawerSubtopicDone ? 'Completed ✕' : 'Mark Topic Complete'}</span>
                          </button>
                        );
                      })()}

                      {(() => {
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

                    <button
                      onClick={() => handleOpenModuleModal(null)}
                      className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[11px] flex items-center gap-1 border border-purple-200 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Module</span>
                    </button>
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

                      const rawItems = module.items || [];

                      const cleanNorm = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
                      const stripSuffix = (str) => (str || '').replace(/-(w|s)$/i, '').trim();

                      const curModId = stripSuffix(module.id);
                      const curModTitle = cleanNorm(module.title);

                      // Match associated live session if scheduled
                      const matchedLiveSessions = (liveSessions || []).filter((s) => {
                        const sModId = stripSuffix(s.moduleId || s.innerTopicId || s.topic_id || s.module_id);
                        if (sModId && curModId && sModId === curModId) return true;

                        const sTitle = cleanNorm(s.sessionTitle || s.session_title || s.title);
                        const sModName = cleanNorm(s.moduleName || s.module_name);

                        if (sTitle && curModTitle && (sTitle === curModTitle || sTitle.includes(curModTitle) || curModTitle.includes(sTitle))) return true;
                        if (sModName && curModTitle && (sModName === curModTitle || sModName.includes(curModTitle) || curModTitle.includes(sModName))) return true;

                        return rawItems.some(
                          (it) =>
                            it.sessionId === s.id ||
                            `item-live-${s.id}` === it.id ||
                            (it.type === 'LIVE CLASS' && cleanNorm(it.title) === sTitle)
                        );
                      });

                      const primaryLiveSession = matchedLiveSessions[0] || null;
                      const moduleJoinLink = primaryLiveSession?.meetingLink || primaryLiveSession?.meeting_link || primaryLiveSession?.joinLink || primaryLiveSession?.url || rawItems.find(it => it.type === 'LIVE CLASS' && (it.url || it.joinLink))?.url || 'https://meet.google.com/aspire-lms-live';

                      const hasLiveClass = !!primaryLiveSession || rawItems.some(it => it.type === 'LIVE CLASS');

                      // Live Class Topics: Prioritize module.topics (the active Milestones state), then primaryLiveSession.topics or module.items
                      let liveClassTopics = [];
                      if (Array.isArray(module?.topics) && module.topics.length > 0) {
                        liveClassTopics = module.topics
                          .filter((t) => t && t.title && t.title.trim())
                          .map((t, idx) => ({
                            id: t.id || `topic-${module.id}-${idx}`,
                            topicIndex: idx,
                            title: t.title.trim(),
                            description: t.description || t.agenda || t.overview || '',
                            agenda: t.agenda || t.description || t.overview || '',
                            overview: t.overview || t.agenda || t.description || '',
                            type: 'LIVE CLASS',
                            actionText: 'JOIN',
                            url: moduleJoinLink
                          }));
                      } else if (Array.isArray(primaryLiveSession?.topics) && primaryLiveSession.topics.length > 0) {
                        liveClassTopics = primaryLiveSession.topics
                          .filter((t) => t && t.title && t.title.trim())
                          .map((t, idx) => ({
                            id: t.id || `topic-${module.id}-${idx}`,
                            topicIndex: idx,
                            title: t.title.trim(),
                            description: t.description || t.agenda || t.overview || '',
                            agenda: t.agenda || t.description || t.overview || '',
                            overview: t.overview || t.agenda || t.description || '',
                            type: 'LIVE CLASS',
                            actionText: 'JOIN',
                            url: moduleJoinLink
                          }));
                      } else if (rawItems.filter(it => it.type === 'LIVE CLASS' || it.type === 'TOPIC').length > 0) {
                        liveClassTopics = rawItems
                          .filter(it => (it.type === 'LIVE CLASS' || it.type === 'TOPIC') && it.title && it.title.trim())
                          .map((it, idx) => ({
                            ...it,
                            title: it.title.trim(),
                            topicIndex: idx,
                            agenda: it.agenda || it.description || it.overview || '',
                            description: it.description || it.agenda || it.overview || '',
                            overview: it.overview || it.agenda || it.description || ''
                          }));
                      }

                      // Auto-match assessments, coding questions, and practice items for this module
                      const autoMatchedAssessments = (assessments || [])
                        .filter(asm => {
                          const asmModId = stripSuffix(asm.moduleId || asm.innerTopicId || asm.topic_id || asm.module_id);
                          if (asmModId && curModId && asmModId === curModId) return true;
                          const tName = cleanNorm(asm.topicName || asm.topic_name || asm.title);
                          return tName && curModTitle && (tName.includes(curModTitle) || curModTitle.includes(tName));
                        })
                        .map(asm => ({
                          ...asm,
                          id: `item-asmnt-${asm.id}`,
                          assessmentId: asm.id,
                          type: 'ASSESSMENT',
                          typeColor: 'bg-blue-100 text-blue-800 border-blue-200',
                          iconName: 'FileCheck',
                          iconBg: 'bg-blue-600 text-white',
                          title: asm.title,
                          actionText: 'START',
                          url: '/assessments',
                          btnStyle: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30',
                          dueDate: asm.dueDate || '2026-08-30',
                          durationMinutes: asm.durationMinutes || 45,
                          totalMarks: asm.totalMarks || 100
                        }));

                      // Auto-match quizzes for this module
                      const autoMatchedQuizzes = (quizzes || [])
                        .filter(qz => {
                          const qzModId = stripSuffix(qz.moduleId || qz.innerTopicId || qz.topic_id || qz.module_id);
                          if (qzModId && curModId && (qzModId === curModId || qzModId.includes(curModId) || curModId.includes(qzModId))) return true;
                          const tName = cleanNorm(qz.topicName || qz.topic_name || qz.title);
                          return tName && curModTitle && (tName.includes(curModTitle) || curModTitle.includes(tName));
                        })
                        .map(qz => ({
                          ...qz,
                          id: `item-quiz-${qz.id}`,
                          quizId: qz.id,
                          assessmentId: qz.id,
                          type: 'QUIZ',
                          typeColor: 'bg-purple-100 text-purple-800 border-purple-200',
                          iconName: 'HelpCircle',
                          iconBg: 'bg-purple-600 text-white',
                          title: qz.title,
                          actionText: 'TAKE QUIZ',
                          url: '/assessments',
                          btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30',
                          dueDate: qz.dueDate || '2026-08-30',
                          durationMinutes: qz.durationMinutes || 45,
                          totalMarks: qz.totalMarks || 100
                        }));

                      const rawNonLive = rawItems.filter(it => it.type !== 'LIVE CLASS' && !liveClassTopics.some(lt => lt.id === it.id));
                      const otherResources = [
                        ...rawNonLive,
                        ...autoMatchedAssessments.filter(asm => !rawNonLive.some(it => it.assessmentId === asm.assessmentId || it.id === asm.id || (it.type === 'ASSESSMENT' && cleanNorm(it.title) === cleanNorm(asm.title)))),
                        ...autoMatchedQuizzes.filter(qz => !rawNonLive.some(it => it.quizId === qz.quizId || it.id === qz.id || (it.type === 'QUIZ' && cleanNorm(it.title) === cleanNorm(qz.title))))
                      ];

                      return (
                        <div key={module.id} className="rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs bg-white">
                          {/* Module Header Bar */}
                          <div
                            className={`w-full p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 text-left font-bold text-sm transition-all ${
                              isExpanded
                                ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white shadow-md'
                                : 'bg-slate-50 hover:bg-slate-100/90 text-slate-800'
                            }`}
                          >
                            <div
                              onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                              className="flex items-start sm:items-center gap-3.5 flex-1 cursor-pointer min-w-0"
                            >
                              <span
                                className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black shrink-0 shadow-2xs ${
                                  isExpanded ? 'bg-white/20 text-white border border-white/20' : 'bg-purple-100 text-purple-700 font-bold border border-purple-200'
                                }`}
                              >
                                {module.title.charAt(0).toUpperCase()}
                              </span>
                              <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-sm sm:text-base font-extrabold leading-snug break-normal">
                                  {module.title}
                                </span>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <span className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-md ${
                                    isExpanded ? 'bg-white/15 text-purple-100' : 'bg-white text-slate-600 border border-slate-200'
                                  }`}>
                                    <Clock className={`w-3 h-3 ${isExpanded ? 'text-purple-200' : 'text-slate-400'}`} />
                                    <span>{module.duration || module.durationHours || '1hr 30min'}</span>
                                  </span>

                                  {/* Module Schedule Badge */}
                                  {modSched.hasSchedule && !modSched.inherited && (
                                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border flex items-center gap-1 shrink-0 ${
                                      modSched.isLocked
                                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                                        : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                    }`}>
                                      {modSched.isLocked ? <Clock className="w-3 h-3 text-amber-700" /> : <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
                                      <span>{modSched.isLocked ? `Unlocks ${modSched.shortFormatted}` : `Released ${modSched.dateFormatted}`}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                              {/* Unified Single Join Live Class Button in Header */}
                              {hasLiveClass && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleActionClick('JOIN', module.title, moduleJoinLink, isModLocked, modSched, module.id);
                                  }}
                                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap ${
                                    isExpanded
                                      ? 'bg-white text-purple-700 hover:bg-purple-50 shadow-md hover:shadow-lg active:scale-95'
                                      : 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-500/30 active:scale-95'
                                  }`}
                                  title={`Join Daily Live Class for ${module.title}`}
                                >
                                  <Video className="w-3.5 h-3.5 animate-pulse" />
                                  <span>JOIN CLASS</span>
                                  <ExternalLink className="w-3 h-3 opacity-80" />
                                </button>
                              )}

                              <div className={`flex items-center gap-1 border-l pl-2 ${isExpanded ? 'border-white/20' : 'border-slate-200'}`}>
                                {/* Module Schedule Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenScheduleModal('module', module, activeSubtopic.stageId, activeSubtopic.id);
                                  }}
                                  title={modSched.hasSchedule && !modSched.inherited ? `Scheduled: ${modSched.fullFormatted}` : 'Set Release Schedule'}
                                  className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                                    modSched.hasSchedule && !modSched.inherited
                                      ? isExpanded ? 'bg-white/30 text-amber-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : isExpanded ? 'hover:bg-white/20 text-white' : 'text-slate-400 hover:text-purple-700 hover:bg-purple-50'
                                  }`}
                                >
                                  <Calendar className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenItemModal(module.id, null);
                                  }}
                                  title="Add Resource Item"
                                  className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                                    isExpanded ? 'hover:bg-white/20 text-white' : 'text-slate-400 hover:text-purple-700 hover:bg-purple-50'
                                  }`}
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenModuleModal(module);
                                  }}
                                  title="Edit Module"
                                  className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                                    isExpanded ? 'hover:bg-white/20 text-white' : 'text-slate-400 hover:text-purple-700 hover:bg-purple-50'
                                  }`}
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteModule(module.id, module.title);
                                  }}
                                  title="Delete Module"
                                  className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                                    isExpanded ? 'hover:bg-white/20 text-rose-200' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                  }`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                                  className="p-1.5 rounded-lg cursor-pointer transition-colors ml-1"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-white" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Module Expanded Content */}
                          {isExpanded && (
                            <div className="p-4 sm:p-5 space-y-4 bg-white">
                              {/* Admin Mode Schedule Info if locked */}
                              {isModLocked && (
                                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2.5">
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

                              {/* Top Unified Daily Live Class Info Strip */}
                              {hasLiveClass && (
                                <div className="bg-gradient-to-r from-purple-50 via-indigo-50/40 to-blue-50/30 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-purple-200/90 shadow-2xs flex items-center justify-between gap-3">
                                  {/* Left: Live Indicator & Mentor */}
                                  <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                                    <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
                                      <Video className="w-3.5 h-3.5 animate-pulse" />
                                    </div>
                                    <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md bg-purple-600 text-white shadow-2xs flex items-center gap-1.5 shrink-0">
                                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping inline-block" />
                                      DAILY LIVE CLASS
                                    </span>
                                    {primaryLiveSession?.instructor && (
                                      <span className="text-xs font-semibold text-purple-700 bg-purple-100/80 px-2.5 py-1 rounded-md border border-purple-200 shrink-0">
                                        Mentor: {primaryLiveSession.instructor}
                                      </span>
                                    )}
                                  </div>

                                  {/* Right side edge: Duration / Timing */}
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 bg-white px-3 py-1 rounded-md border border-purple-200 shadow-2xs">
                                      <Clock className="w-3.5 h-3.5 text-purple-600" />
                                      <span>{primaryLiveSession?.time || primaryLiveSession?.timing || module.duration || '1hr 30min'}</span>
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Daily Class Topics / Syllabus Agenda (Covered in this single Live Class) */}
                              {liveClassTopics.length > 0 && (
                                <div className="space-y-2.5 pt-2">
                                  <div className="flex items-center justify-between px-1">
                                    <span className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-2">
                                      <BookOpen className="w-4 h-4 text-purple-600" />
                                      <span>Class Topics & Syllabus Covered ({liveClassTopics.length} Topics)</span>
                                    </span>
                                  </div>

                                   <div className="space-y-2">
                                    {liveClassTopics.map((item, idx) => {
                                      const isItemDone = completedMilestoneItemIds.includes(item.id);
                                      const topicItemId = item.id || `topic-${module.id}-${idx}`;
                                      const isTopicExpanded = expandedTopicItemIds.includes(topicItemId);

                                      return (
                                        <div
                                          key={topicItemId}
                                          className={`p-3.5 rounded-xl border transition-all ${
                                            isItemDone
                                              ? 'bg-emerald-50/50 border-emerald-200 shadow-2xs'
                                              : isTopicExpanded
                                              ? 'bg-purple-50/25 border-purple-300 shadow-xs'
                                              : 'border-slate-200/80 bg-slate-50/70 hover:bg-slate-100/80'
                                          }`}
                                        >
                                          <div
                                            onClick={() => toggleTopicItemExpand(topicItemId)}
                                            className="flex items-center justify-between gap-3.5 cursor-pointer"
                                          >
                                            <div className="flex items-center gap-3.5 flex-1 min-w-0">
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

                                              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black shrink-0 border border-purple-200">
                                                {idx + 1}
                                              </div>

                                              <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                    Topic {idx + 1}
                                                  </span>
                                                  {isItemDone && (
                                                    <span
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleItemCompletion(item.id);
                                                        addToast(`⚪ Marked "${item.title}" as uncompleted`, 'info');
                                                      }}
                                                      title="Click to uncomplete"
                                                      className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200 cursor-pointer transition-colors"
                                                    >
                                                      COMPLETED ✕
                                                    </span>
                                                  )}
                                                </div>
                                                <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug break-words">
                                                  {item.title}
                                                </h4>
                                              </div>
                                            </div>

                                            {/* Admin Edit & Delete Actions + Expand Indicator */}
                                            <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                                              <button
                                                onClick={() => handleOpenItemModal(module.id, item)}
                                                title="Edit Topic"
                                                className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors"
                                              >
                                                <Edit2 className="w-3.5 h-3.5" />
                                              </button>
                                              <button
                                                onClick={() => handleDeleteItem(module.id, item.id, item.title, item.topicIndex)}
                                                title="Delete Topic"
                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => toggleTopicItemExpand(topicItemId)}
                                                className="p-1 text-slate-400 hover:text-purple-700 rounded-lg cursor-pointer transition-colors"
                                                title={isTopicExpanded ? 'Collapse Session Agenda' : 'View Session Agenda / Overview'}
                                              >
                                                {isTopicExpanded ? (
                                                  <ChevronDown className="w-4 h-4 text-purple-600" />
                                                ) : (
                                                  <ChevronRight className="w-4 h-4 text-slate-400" />
                                                )}
                                              </button>
                                            </div>
                                          </div>

                                          {/* Expanded Session Agenda / Overview */}
                                          {isTopicExpanded && (
                                            <div className="mt-3 pt-3 border-t border-purple-100/90 animate-in fade-in slide-in-from-top-1 duration-200 space-y-2">
                                              <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                                  <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                                                  <span>SESSION AGENDA / OVERVIEW</span>
                                                </span>
                                              </div>
                                              <div className="p-3.5 rounded-xl bg-white border border-purple-100 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal shadow-2xs">
                                                {getTopicAgendaOverview(item)}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Assessments, Coding, Projects, & Other Practice Resources */}
                              {otherResources.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                  <div className="flex items-center justify-between px-1">
                                    <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                                      <span>Practice Labs, Assessments & Projects ({otherResources.length} Items)</span>
                                    </span>
                                  </div>

                                  <div className="space-y-2">
                                    {otherResources.map((item) => {
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
                                              title={isItemDone ? 'Completed (Click to unmark)' : 'Click to mark as completed'}
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
                                                  <span
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      toggleItemCompletion(item.id);
                                                      addToast(`⚪ Marked "${item.title}" as uncompleted`, 'info');
                                                    }}
                                                    title="Click to uncomplete"
                                                    className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200 cursor-pointer transition-colors"
                                                  >
                                                    COMPLETED ✕
                                                  </span>
                                                )}
                                              </div>
                                              <h4 className="text-xs font-bold text-slate-800 leading-tight">{item.title}</h4>
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-1.5">
                                            <button
                                              onClick={() =>
                                                handleActionClick(item.actionText, item.title, item.url, isModLocked, modSched, item.id)
                                              }
                                              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                                item.btnStyle || 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30'
                                              }`}
                                              title={`${item.actionText} ${item.title}`}
                                            >
                                              <span>{item.actionText}</span>
                                              <ExternalLink className="w-3 h-3" />
                                            </button>

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
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {liveClassTopics.length === 0 && otherResources.length === 0 && (
                                <div className="text-center py-6 px-4 rounded-xl bg-slate-50/60 border border-dashed border-slate-200 space-y-2.5">
                                  <BookOpen className="w-5 h-5 mx-auto text-slate-300" />
                                  <p className="text-xs font-semibold text-slate-600">No class topics or learning resources added yet for this module.</p>
                                  <p className="text-[11px] text-slate-400">Topics scheduled in Live Sessions or added here will appear in real-time.</p>
                                  <div className="pt-1 flex items-center justify-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenItemModal(module.id, null)}
                                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>Add Topic / Resource</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {(liveClassTopics.length > 0 || otherResources.length > 0 || (module.items && module.items.length > 0)) && (
                                <button
                                  onClick={() => handleOpenItemModal(module.id, null)}
                                  className="w-full py-2 border border-dashed border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span> Add Topic / Resource to {module.title}</span>
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
                        <button
                          onClick={() => handleOpenModuleModal(null)}
                          className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Create First Module</span>
                        </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl space-y-6 animate-in zoom-in-95 duration-200 border border-slate-100">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Schedule Unlock</h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5 truncate max-w-xs">
                  {scheduleTarget.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-6">
              {/* Exact Date and Time Pickers */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>Unlock Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={scheduleFormData.unlockDate}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, unlockDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white transition-all cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    <span>Unlock Time</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={scheduleFormData.unlockTime}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, unlockTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white transition-all cursor-pointer"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClearSchedule}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 px-3 py-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  Clear Schedule
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">Estimated Duration</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={moduleFormData.duration || '1hr 30min'}
                    onChange={(e) => setModuleFormData({ ...moduleFormData, duration: e.target.value })}
                    placeholder="e.g. 1hr 30min"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold text-xs"
                  />
                </div>
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
                <label className="block font-bold text-slate-700 mb-1">Session Agenda / Overview (Optional)</label>
                <textarea
                  rows={3}
                  value={itemFormData.description}
                  onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                  placeholder="Enter detailed session agenda, key questions answered, or topic overview..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-medium"
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
