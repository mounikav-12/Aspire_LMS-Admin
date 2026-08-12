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
  Eye,
  Settings,
  Book,
  FileText
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useLmsData } from '../../context/LmsDataContext';

export function MilestonesRoadmapPage() {
  const { addToast } = useToast();
  const {
    milestonesByBatch,
    getMilestoneDataForBatch,
    milestones,
    addStage,
    updateStage,
    toggleStageLock,
    updateStageStatus,
    deleteStage,
    addSubtopic,
    updateSubtopic,
    toggleSubtopicLock,
    deleteSubtopic,
    addModule,
    updateModule,
    toggleModuleLock,
    deleteModule,
    addLearningItem,
    updateLearningItem,
    deleteLearningItem,
    updateMilestonesOverview,
    activeBatchFilter,
    setActiveBatchFilter
  } = useLmsData();

  // Mode Toggle: 'admin' (CRUD management) vs 'user' (Student Portal View)
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
  const [selectedSubtopicState, setSelectedSubtopicState] = useState(null); // { stageId, subtopic }
  const [expandedModule, setExpandedModule] = useState(null);
  const [expandedStages, setExpandedStages] = useState({});

  const isStageUnlockedForUser = (stageIndex, stage) => {
    if (viewMode === 'admin') return true; // Admin can view everything
    if (stage.isLocked || stage.statusType === 'locked' || stage.status === 'LOCKED') return false;
    if (stageIndex === 0) return true; // Stage 1 unlocked initially
    const prevStage = currentMilestones?.stages?.[stageIndex - 1];
    const prevCompleted = prevStage?.status === 'COMPLETED' || prevStage?.statusType === 'completed';
    return prevCompleted;
  };

  // Filter stages based on selectedBatch
  const filteredStages = currentMilestones?.stages || [];

  // Automatic Real-Time Banner Calculations
  const autoTotalCount = filteredStages.reduce((acc, stg) => {
    return acc + (stg.subtopics?.length || 0);
  }, 0) || 31;

  const autoCompletedCount = filteredStages.reduce((acc, stg) => {
    if (stg.status === 'COMPLETED' || stg.statusType === 'completed') {
      return acc + (stg.subtopics?.length || 0);
    }
    const doneInStage = stg.subtopics?.filter((sub) => sub.isCompleted || sub.status === 'COMPLETED')?.length || 0;
    return acc + doneInStage;
  }, 0) || 0;

  const autoCompletionPercentage = autoTotalCount > 0
    ? Math.round((autoCompletedCount / autoTotalCount) * 100)
    : 0;

  const autoUnlockedLevel = filteredStages.filter((stg, idx) => isStageUnlockedForUser(idx, stg)).length || 1;

  const handleSubtopicClick = (stageIndex, stage, subtopic) => {
    const unlocked = isStageUnlockedForUser(stageIndex, stage);
    if (!unlocked) {
      const prevStageName = currentMilestones?.stages?.[stageIndex - 1]?.title || 'previous stage';
      addToast(`🔒 Stage is locked! Complete ${prevStageName} first to unlock.`, 'warning');
      return;
    }
    if (subtopic.isLocked && viewMode !== 'admin') {
      addToast(`🔒 Subtopic "${subtopic.title}" has been locked by admin.`, 'warning');
      return;
    }
    setSelectedSubtopicState({ stageId: stage.id, subtopicId: subtopic.id });
  };

  // Modal States
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState(null); // null for new, stage object for edit
  const [stageFormData, setStageFormData] = useState({
    stageNumber: 'STAGE 01',
    phaseTag: 'Phase 1 • Core Mastery',
    title: '',
    targetBatch: 'All Batches',
    status: 'IN PROGRESS',
    statusType: 'in-progress',
    isLocked: false
  });

  const [isSubtopicModalOpen, setIsSubtopicModalOpen] = useState(false);
  const [targetStageIdForSubtopic, setTargetStageIdForSubtopic] = useState(null);
  const [editingSubtopic, setEditingSubtopic] = useState(null);
  const [subtopicFormData, setSubtopicFormData] = useState({
    title: '',
    targetBatch: 'All Batches',
    description: 'Click to view subtopics',
    duration: ''
  });

  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [moduleFormData, setModuleFormData] = useState({ title: '' });

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
    headline: milestones?.overview?.headline || '',
    completedCount: milestones?.overview?.completedCount || 4,
    totalCount: milestones?.overview?.totalCount || 12,
    unlockedLevel: milestones?.overview?.unlockedLevel || 3,
    completionPercentage: milestones?.overview?.completionPercentage || 45
  });

  // Derived current active subtopic object from global state
  const getActiveSubtopic = () => {
    if (!selectedSubtopicState) return null;
    const stage = currentMilestones?.stages?.find((s) => s.id === selectedSubtopicState.stageId);
    if (!stage) return null;
    const sub = stage.subtopics?.find((st) => st.id === selectedSubtopicState.subtopicId);
    return sub ? { stageId: stage.id, ...sub } : null;
  };

  const activeSubtopic = getActiveSubtopic();

  // Helper for rendering icons dynamically
  const renderItemIcon = (iconName, iconBg) => {
    let IconComp = Video;
    if (iconName === 'Code') IconComp = Code;
    if (iconName === 'FileCheck') IconComp = FileCheck;
    if (iconName === 'BookText' || iconName === 'Book' || iconName === 'FileText') IconComp = Book;

    return (
      <div className={`p-2 rounded-xl ${iconBg || 'bg-purple-600 text-white'}`}>
        <IconComp className="w-4 h-4" />
      </div>
    );
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
        status: stage.status,
        statusType: stage.statusType,
        isLocked: stage.isLocked
      });
    } else {
      setEditingStage(null);
      const nextNum = (currentMilestones?.stages?.length || 0) + 1;
      setStageFormData({
        stageNumber: `STAGE 0${nextNum}`,
        phaseTag: `Phase ${nextNum} • Core Mastery`,
        title: '',
        targetBatch: selectedBatch !== 'ALL' ? selectedBatch : 'All Batches',
        status: 'AVAILABLE',
        statusType: 'available',
        isLocked: false
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
    if (editingStage) {
      updateStage(editingStage.id, stageFormData);
      addToast('Milestone stage updated successfully', 'success');
    } else {
      addStage(stageFormData);
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
        duration: subtopic.duration
      });
    } else {
      setEditingSubtopic(null);
      setSubtopicFormData({
        title: '',
        targetBatch: selectedBatch !== 'ALL' ? selectedBatch : 'All Batches',
        description: 'Click to view subtopics',
        duration: 'Master core concepts and practical workflows in this module.'
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
    if (editingSubtopic) {
      updateSubtopic(targetStageIdForSubtopic, editingSubtopic.id, subtopicFormData);
      addToast('Subtopic updated', 'success');
    } else {
      addSubtopic(targetStageIdForSubtopic, subtopicFormData);
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
      setModuleFormData({ title: module.title });
    } else {
      setEditingModule(null);
      setModuleFormData({ title: '' });
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

    if (editingModule) {
      updateModule(activeSubtopic.stageId, activeSubtopic.id, editingModule.id, moduleFormData);
      addToast('Module title updated', 'success');
    } else {
      addModule(activeSubtopic.stageId, activeSubtopic.id, moduleFormData);
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

  const handleActionClick = (actionText, title, url) => {
    if (url && url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      addToast(`Executing ${actionText} for "${title}"`, 'info');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar with Title & Admin/User View Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Milestones Roadmap</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Track your journey and master core engineering fundamentals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Batch Selector Pills */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setSelectedBatch('Weekday Batch')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedBatch === 'Weekday Batch'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Weekday (A26W)
            </button>
            <button
              onClick={() => setSelectedBatch('Weekend Batch')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
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
        <div className="bg-purple-50 border border-purple-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-end gap-3 text-xs">

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setOverviewFormData({
                  headline: milestones?.overview?.headline || '',
                  completedCount: milestones?.overview?.completedCount || 4,
                  totalCount: milestones?.overview?.totalCount || 12,
                  unlockedLevel: milestones?.overview?.unlockedLevel || 3,
                  completionPercentage: milestones?.overview?.completionPercentage || 45
                });
                setIsOverviewModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-purple-300 text-purple-700 hover:bg-purple-100 font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Banner Headline</span>
            </button>

            <button
              onClick={() => handleOpenStageModal(null)}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/25 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Milestone Stage</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Banner Card (Vibrant Purple Gradient - Picture 1) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-600 p-6 sm:p-8 text-white shadow-xl shadow-purple-600/20">
        <div className="relative z-10 space-y-6">
          {/* Banner Header Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-100 border border-white/20">
              <BookOpen className="w-4 h-4" />
              <span>{milestones?.overview?.trackTitle || 'Python full stack + DSA with AI'}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-xs font-semibold text-purple-100 border border-white/15">
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {autoCompletedCount} / {autoTotalCount} Completed
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-xs font-semibold text-purple-100 border border-white/15">
                <Zap className="w-3.5 h-3.5 text-cyan-300" />
                <span>Level {autoUnlockedLevel} Unlocked</span>
              </div>
            </div>
          </div>

          {/* Banner Main Headline */}
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white max-w-3xl leading-snug">
            {milestones?.overview?.headline || 'Master core engineering fundamentals, advanced AI models, full-stack frameworks, and real-world project deployments.'}
          </h2>

          {/* Banner Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-purple-100">
              <span>Overall Track Completion</span>
              <span className="font-bold text-white">{autoCompletionPercentage}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20 backdrop-blur-sm p-0.5">
              <div
                className="h-full rounded-full bg-white transition-all duration-500 shadow-sm"
                style={{ width: `${autoCompletionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stage Timeline */}
      <div className="relative pt-4">
        {filteredStages.map((stage, stageIndex) => {
          const unlockedForUser = isStageUnlockedForUser(stageIndex, stage);
          const isCurrentInProgress = stage.statusType === 'in-progress' || stage.status === 'IN PROGRESS';
          const isCompleted = stage.statusType === 'completed' || stage.status === 'COMPLETED';
          const isAvailable = (stage.statusType === 'available' || stage.status === 'AVAILABLE') && unlockedForUser;
          const isLocked = !unlockedForUser || stage.statusType === 'locked' || stage.status === 'LOCKED' || stage.isLocked;

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
                    isFirstStage
                      ? 'top-[18px]'
                      : isLastStage
                      ? 'top-0 h-[18px]'
                      : 'top-0'
                  }`}
                  style={!isLastStage ? { bottom: '-2rem' } : {}}
                />

                <div
                  className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all shadow-sm ${
                    isCompleted
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : isCurrentInProgress
                      ? 'border-purple-600 bg-purple-600 text-white ring-4 ring-purple-100 shadow-purple-600/30'
                      : isAvailable
                      ? 'border-purple-500 bg-white text-purple-600 ring-2 ring-purple-200'
                      : 'border-slate-300 bg-slate-100 text-slate-400'
                  }`}
                >
                  {isLocked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Brain className="w-4 h-4" />
                  )}
                </div>
              </div>

              {/* Stage Card */}
              <div className="flex-1 rounded-3xl border border-purple-200/80 shadow-md shadow-purple-600/10 overflow-hidden transition-all duration-300 bg-white">
                {/* Main Purple Card Header (Clickable Dropdown Banner) */}
                <div
                  onClick={() =>
                    setExpandedStages((prev) => ({
                      ...prev,
                      [stage.id]: !prev[stage.id]
                    }))
                  }
                  className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 text-white p-5 sm:p-6 cursor-pointer select-none transition-all hover:brightness-105 group relative overflow-hidden"
                >
                  {/* Decorative Glow */}
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-inner flex-shrink-0">
                        {isLocked ? <Lock className="w-6 h-6" /> : <Brain className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-wider text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200 shadow-xs">
                            {stage.stageNumber}
                          </span>
                          <span className="text-xs font-medium text-purple-200">{stage.phaseTag}</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mt-1 leading-snug">
                          {stage.title}
                        </h3>
                        <p className="text-xs text-purple-200/90 font-medium mt-1 flex items-center gap-1.5">
                          <span>{visibleSubtopics.length} Modules Included</span>
                          <span>•</span>
                          <span>{expandedStages[stage.id] ? 'Click card to hide modules' : 'Click card to view modules'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Right Actions: Status Badges, Admin Controls & Dropdown Arrow */}
                    <div className="flex flex-wrap items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 backdrop-blur-md border border-emerald-300/40 px-3 py-1 text-xs font-bold text-emerald-200">
                          ✅ COMPLETED
                        </span>
                      )}
                      {isCurrentInProgress && !isCompleted && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-400/30 backdrop-blur-md border border-purple-300/40 px-3 py-1 text-xs font-bold text-white">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                          IN PROGRESS
                        </span>
                      )}
                      {isAvailable && !isCompleted && !isCurrentInProgress && (
                        <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 text-xs font-bold text-white">
                          AVAILABLE
                        </span>
                      )}
                      {isLocked && !isCompleted && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 text-xs font-bold text-slate-200">
                          <Lock className="w-3 h-3" />
                          LOCKED
                        </span>
                      )}

                      {viewMode === 'admin' && (
                        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/20">
                          {/* Admin Lock/Unlock Toggle Button */}
                          <button
                            onClick={() => {
                              toggleStageLock(stage.id);
                              addToast(stage.isLocked ? `🔓 Stage "${stage.title}" unlocked` : `🔒 Stage "${stage.title}" locked`, 'info');
                            }}
                            title={stage.isLocked ? "Click to Unlock Stage" : "Click to Lock Stage"}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                              stage.isLocked
                                ? 'bg-rose-500/30 text-rose-100 border border-rose-400/40 hover:bg-rose-500/50'
                                : 'bg-emerald-500/30 text-emerald-100 border border-emerald-400/40 hover:bg-emerald-500/50'
                            }`}
                          >
                            {stage.isLocked ? <Lock className="w-3.5 h-3.5 text-rose-200" /> : <Unlock className="w-3.5 h-3.5 text-emerald-200" />}
                            <span>{stage.isLocked ? 'Locked' : 'Unlocked'}</span>
                          </button>

                          {/* Admin Status Dropdown Selector */}
                          <select
                            value={stage.status || (stage.isLocked ? 'LOCKED' : 'AVAILABLE')}
                            onChange={(e) => {
                              updateStageStatus(stage.id, e.target.value);
                              addToast(`Stage status set to ${e.target.value}`, 'success');
                            }}
                            className="text-xs font-bold bg-purple-950/80 border border-purple-400/40 text-white rounded-lg px-2 py-1 cursor-pointer hover:bg-purple-900 focus:ring-2 focus:ring-purple-300"
                          >
                            <option value="IN PROGRESS" className="bg-purple-900 text-white">⚡ IN PROGRESS</option>
                            <option value="AVAILABLE" className="bg-purple-900 text-white">🔓 AVAILABLE</option>
                            <option value="COMPLETED" className="bg-purple-900 text-white">✅ COMPLETED</option>
                            <option value="LOCKED" className="bg-purple-900 text-white">🔒 LOCKED</option>
                          </select>

                          <button
                            onClick={() => handleOpenSubtopicModal(stage.id, null)}
                            title="Add Subtopic to Stage"
                            className="p-1.5 text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenStageModal(stage)}
                            title="Edit Stage Details"
                            className="p-1.5 text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStage(stage.id, stage.title)}
                            title="Delete Stage"
                            className="p-1.5 text-rose-200 hover:text-white hover:bg-rose-500/30 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-purple-700 transition-all cursor-pointer shadow-sm ml-1"
                        title={expandedStages[stage.id] ? "Collapse Modules" : "Expand Modules"}
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
                        const isSubtopicEffectiveLocked = isLocked || subtopic.isLocked;
                        return (
                          <div key={subtopic.id} className="relative group/sub">
                            <div className="relative flex items-center gap-2">
                              <button
                                onClick={() => handleSubtopicClick(stageIndex, stage, subtopic)}
                                className={`w-full text-left rounded-2xl px-4 py-3.5 transition-all flex items-center justify-between group cursor-pointer border shadow-xs ${
                                  isSubtopicEffectiveLocked
                                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                    : 'bg-white hover:bg-purple-50/80 hover:border-purple-300 border-slate-200/90 text-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-bold text-xs flex-shrink-0">
                                    {subtopicIndex + 1}
                                  </div>
                                  <div>
                                    <span className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-purple-700 block">
                                      {subtopic.title}
                                    </span>
                                    {subtopic.duration && (
                                      <span className="text-[11px] font-medium text-slate-500 block mt-0.5">
                                        {subtopic.duration}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {isSubtopicEffectiveLocked && <Lock className="w-3.5 h-3.5 text-rose-600" />}
                                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                                </div>
                              </button>

                              {viewMode === 'admin' && (
                                <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs flex-shrink-0">
                                  <button
                                    onClick={() => {
                                      toggleSubtopicLock(stage.id, subtopic.id);
                                      addToast(isSubtopicEffectiveLocked ? `🔓 Subtopic "${subtopic.title}" unlocked` : `🔒 Subtopic "${subtopic.title}" locked`, 'info');
                                    }}
                                    title={isSubtopicEffectiveLocked ? "Unlock Subtopic" : "Lock Subtopic"}
                                    className="p-1 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-md cursor-pointer"
                                  >
                                    {isSubtopicEffectiveLocked ? <Lock className="w-3.5 h-3.5 text-rose-600" /> : <Unlock className="w-3.5 h-3.5 text-emerald-600" />}
                                  </button>
                                  <button
                                    onClick={() => handleOpenSubtopicModal(stage.id, subtopic)}
                                    title="Edit Subtopic"
                                    className="p-1 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-md cursor-pointer"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSubtopic(stage.id, subtopic.id, subtopic.title)}
                                    title="Delete Subtopic"
                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
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
      {activeSubtopic && (
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
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-block bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-purple-200">
                        TOPIC CATALOG
                      </span>
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

                      return (
                        <div
                          key={module.id}
                          className="rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs"
                        >
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
                              className="flex items-center gap-2.5 flex-1 cursor-pointer"
                            >
                              <span
                                className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-black ${
                                  isExpanded ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {module.title.charAt(0).toUpperCase()}
                              </span>
                              <span>{module.title}</span>
                              {module.isLocked && (
                                <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                                  <Lock className="w-3 h-3" />
                                  Locked
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {viewMode === 'admin' && (
                                <div className="flex items-center gap-1 border-r border-white/20 pr-2 mr-1">
                                  <button
                                    onClick={() => {
                                      toggleModuleLock(activeSubtopic.stageId, activeSubtopic.id, module.id);
                                      addToast(module.isLocked ? `🔓 Module "${module.title}" unlocked` : `🔒 Module "${module.title}" locked`, 'info');
                                    }}
                                    title={module.isLocked ? "Unlock Module" : "Lock Module"}
                                    className="p-1 hover:bg-white/20 rounded cursor-pointer text-white"
                                  >
                                    {module.isLocked ? <Lock className="w-3.5 h-3.5 text-rose-200" /> : <Unlock className="w-3.5 h-3.5 text-emerald-200" />}
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

                              <button
                                onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                                className="cursor-pointer"
                              >
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
                              {module.items && module.items.length > 0 ? (
                                module.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors group/item"
                                  >
                                    <div className="flex items-center gap-3">
                                      {renderItemIcon(item.iconName, item.iconBg)}
                                      <div>
                                        <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded border inline-block mb-0.5 ${item.typeColor}`}>
                                          {item.type}
                                        </span>
                                        <h4 className="text-xs font-bold text-slate-800 leading-tight">
                                          {item.title}
                                        </h4>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                      <button
                                        onClick={() => handleActionClick(item.actionText, item.title, item.url)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${item.btnStyle}`}
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
                                ))
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
                              )}

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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stage Availability Status</label>
                  <select
                    value={stageFormData.statusType}
                    onChange={(e) => {
                      const val = e.target.value;
                      let statusText = 'AVAILABLE';
                      let isLocked = false;
                      if (val === 'in-progress') statusText = 'IN PROGRESS';
                      if (val === 'locked') {
                        statusText = 'LOCKED';
                        isLocked = true;
                      }
                      setStageFormData({
                        ...stageFormData,
                        statusType: val,
                        status: statusText,
                        isLocked
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold bg-white"
                  >
                    <option value="in-progress">IN PROGRESS</option>
                    <option value="available">AVAILABLE</option>
                    <option value="locked">LOCKED</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lock Icon Overlay</label>
                  <select
                    value={stageFormData.isLocked ? 'true' : 'false'}
                    onChange={(e) => setStageFormData({ ...stageFormData, isLocked: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold bg-white"
                  >
                    <option value="false">Unlocked</option>
                    <option value="true">Locked (Requires prerequisite completion)</option>
                  </select>
                </div>
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
                  onChange={(e) => setModuleFormData({ title: e.target.value })}
                  placeholder="e.g. Variables & Data Types or Docker Networking"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold"
                />
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
