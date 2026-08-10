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
  Settings
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useLmsData } from '../../context/LmsDataContext';

export function MilestonesRoadmapPage() {
  const { addToast } = useToast();
  const {
    milestones,
    addStage,
    updateStage,
    deleteStage,
    addSubtopic,
    updateSubtopic,
    deleteSubtopic,
    addModule,
    updateModule,
    deleteModule,
    addLearningItem,
    updateLearningItem,
    deleteLearningItem,
    updateMilestonesOverview
  } = useLmsData();

  // Mode Toggle: 'admin' (CRUD management) vs 'user' (Student View)
  const [viewMode, setViewMode] = useState('admin');

  // Selected subtopic for slide-over drawer
  const [selectedSubtopicState, setSelectedSubtopicState] = useState(null); // { stageId, subtopicId }
  const [expandedModule, setExpandedModule] = useState(null);

  // Modal States
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState(null);
  const [stageFormData, setStageFormData] = useState({
    stageNumber: 'STAGE 01',
    phaseTag: 'Phase 1 • Foundations',
    title: '',
    status: 'IN PROGRESS',
    statusType: 'in-progress',
    isLocked: false
  });

  const [isSubtopicModalOpen, setIsSubtopicModalOpen] = useState(false);
  const [targetStageIdForSubtopic, setTargetStageIdForSubtopic] = useState(null);
  const [editingSubtopic, setEditingSubtopic] = useState(null);
  const [subtopicFormData, setSubtopicFormData] = useState({
    title: '',
    duration: '',
    description: ''
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
    completedCount: milestones?.overview?.completedCount || 3,
    totalCount: milestones?.overview?.totalCount || 10,
    unlockedLevel: milestones?.overview?.unlockedLevel || 2,
    completionPercentage: milestones?.overview?.completionPercentage || 30,
    totalHours: milestones?.overview?.totalHours || 163
  });

  // Get current active module/subtopic for side drawer
  const getActiveSubtopic = () => {
    if (!selectedSubtopicState) return null;
    const stage = milestones?.stages?.find((s) => s.id === selectedSubtopicState.stageId);
    if (!stage) return null;
    const sub = stage.subtopics?.find((st) => st.id === selectedSubtopicState.subtopicId);
    return sub ? { stageId: stage.id, ...sub } : null;
  };

  const activeSubtopic = getActiveSubtopic();

  // Helper to render resource icon
  const renderItemIcon = (iconName, iconBg) => {
    let IconComp = Video;
    if (iconName === 'Code') IconComp = Code;
    if (iconName === 'FileCheck') IconComp = FileCheck;

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
        status: stage.status,
        statusType: stage.statusType,
        isLocked: stage.isLocked
      });
    } else {
      setEditingStage(null);
      const nextNum = (milestones?.stages?.length || 0) + 1;
      setStageFormData({
        stageNumber: `STAGE 0${nextNum}`,
        phaseTag: `Phase ${nextNum} • Core Mastery`,
        title: '',
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
      addToast('Stage updated successfully', 'success');
    } else {
      addStage(stageFormData);
      addToast('New stage created', 'success');
    }
    setIsStageModalOpen(false);
  };

  const handleDeleteStage = (stageId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteStage(stageId);
      if (selectedSubtopicState?.stageId === stageId) {
        setSelectedSubtopicState(null);
      }
      addToast('Stage deleted', 'info');
    }
  };

  // --- Handlers: Module / Subtopic ---
  const handleOpenSubtopicModal = (stageId, subtopic = null) => {
    setTargetStageIdForSubtopic(stageId);
    if (subtopic) {
      setEditingSubtopic(subtopic);
      setSubtopicFormData({
        title: subtopic.title,
        duration: subtopic.duration || '',
        description: subtopic.description || ''
      });
    } else {
      setEditingSubtopic(null);
      setSubtopicFormData({
        title: '',
        duration: '10 hrs',
        description: 'Module topics and practical evaluation'
      });
    }
    setIsSubtopicModalOpen(true);
  };

  const handleSaveSubtopic = (e) => {
    e.preventDefault();
    if (!subtopicFormData.title.trim()) {
      addToast('Please enter a module title', 'error');
      return;
    }
    if (editingSubtopic) {
      updateSubtopic(targetStageIdForSubtopic, editingSubtopic.id, subtopicFormData);
      addToast('Module updated', 'success');
    } else {
      addSubtopic(targetStageIdForSubtopic, subtopicFormData);
      addToast('Module added to stage', 'success');
    }
    setIsSubtopicModalOpen(false);
  };

  const handleDeleteSubtopic = (stageId, subtopicId, title) => {
    if (window.confirm(`Delete module "${title}"?`)) {
      deleteSubtopic(stageId, subtopicId);
      if (selectedSubtopicState?.subtopicId === subtopicId) {
        setSelectedSubtopicState(null);
      }
      addToast('Module removed', 'info');
    }
  };

  // --- Handlers: Inner Learning Path Section ---
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
      addToast('Please enter section title', 'error');
      return;
    }
    if (!activeSubtopic) return;

    if (editingModule) {
      updateModule(activeSubtopic.stageId, activeSubtopic.id, editingModule.id, moduleFormData);
      addToast('Learning section title updated', 'success');
    } else {
      addModule(activeSubtopic.stageId, activeSubtopic.id, moduleFormData);
      addToast('New section added to learning path', 'success');
    }
    setIsModuleModalOpen(false);
  };

  const handleDeleteModule = (moduleId, title) => {
    if (!activeSubtopic) return;
    if (window.confirm(`Delete section "${title}" and all its resources?`)) {
      deleteModule(activeSubtopic.stageId, activeSubtopic.id, moduleId);
      addToast('Section deleted', 'info');
    }
  };

  // --- Handlers: Learning Resource Item ---
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
      addToast('Resource item added', 'success');
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
      addToast(`Opening ${actionText} for "${title}"`, 'info');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Admin / Student View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Milestones Roadmap</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Track your journey and master core engineering fundamentals (4 Stages • 10 Modules • 163 Hours).
          </p>
        </div>

        {/* View Mode Toggle */}
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
            <span>⚙️ Admin Management Mode</span>
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
            <span>👁️ Student / User View</span>
          </button>
        </div>
      </div>

      {/* Admin Mode Control Bar */}
      {viewMode === 'admin' && (
        <div className="bg-purple-50 border border-purple-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-purple-950 font-medium">
            <span className="flex h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
            <span>
              <strong>Admin Control Active:</strong> Manage Stages, Modules, Resource items, and metadata links directly.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setOverviewFormData({
                  headline: milestones?.overview?.headline || '',
                  completedCount: milestones?.overview?.completedCount || 3,
                  totalCount: milestones?.overview?.totalCount || 10,
                  unlockedLevel: milestones?.overview?.unlockedLevel || 2,
                  completionPercentage: milestones?.overview?.completionPercentage || 30,
                  totalHours: milestones?.overview?.totalHours || 163
                });
                setIsOverviewModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-purple-300 text-purple-700 hover:bg-purple-100 font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Banner Stats</span>
            </button>

            <button
              onClick={() => handleOpenStageModal(null)}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/25 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Stage</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Banner Card (Purple Gradient - Picture 1) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-600 p-6 sm:p-8 text-white shadow-xl shadow-purple-600/20">
        <div className="relative z-10 space-y-6">
          {/* Banner Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-100 border border-white/20">
              <BookOpen className="w-4 h-4" />
              <span>Milestone Curriculum Roadmap • {milestones?.overview?.totalHours || 163} Hours Total</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-xs font-semibold text-purple-100 border border-white/15">
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {milestones?.overview?.completedCount || 3} / {milestones?.overview?.totalCount || 10} Modules Completed
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-xs font-semibold text-purple-100 border border-white/15">
                <Zap className="w-3.5 h-3.5 text-cyan-300" />
                <span>Level {milestones?.overview?.unlockedLevel || 2} Unlocked</span>
              </div>
            </div>
          </div>

          {/* Banner Main Headline */}
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white max-w-3xl leading-snug">
            {milestones?.overview?.headline || 'Master core engineering fundamentals, advanced AI models, and real-world project deployments.'}
          </h2>

          {/* Banner Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-purple-100">
              <span>Overall Track Completion</span>
              <span className="font-bold text-white">{milestones?.overview?.completionPercentage || 30}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20 backdrop-blur-sm p-0.5">
              <div
                className="h-full rounded-full bg-white transition-all duration-500 shadow-sm"
                style={{ width: `${milestones?.overview?.completionPercentage || 30}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stage Timeline (4 Stages) */}
      <div className="relative pl-6 sm:pl-8 space-y-8 pt-4">
        {/* Timeline Vertical Line */}
        <div className="absolute left-3.5 sm:left-4 top-6 bottom-6 w-0.5 bg-slate-200" />

        {milestones?.stages?.map((stage, sIdx) => {
          const isCurrentInProgress = stage.statusType === 'in-progress' || sIdx === 0;
          const isAvailable = stage.statusType === 'available' || (!stage.isLocked && sIdx > 0);
          const isLocked = stage.isLocked;

          return (
            <div key={stage.id} className="relative flex items-start gap-4 sm:gap-6 group">
              {/* Timeline Node Circle */}
              <div
                className={`relative z-10 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 transition-all ${
                  isCurrentInProgress
                    ? 'border-purple-600 bg-white text-purple-600 ring-4 ring-purple-100'
                    : isAvailable
                    ? 'border-purple-400 bg-white text-purple-500'
                    : 'border-slate-300 bg-slate-100 text-slate-400'
                }`}
              >
                {isLocked ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : (
                  <div className="flex items-center justify-center rounded-full bg-purple-600 text-white p-1">
                    <Brain className="w-3 h-3" />
                  </div>
                )}
              </div>

              {/* Stage Card */}
              <div
                className={`flex-1 rounded-3xl border p-5 sm:p-6 transition-all duration-200 shadow-xs ${
                  isCurrentInProgress
                    ? 'bg-white border-slate-200'
                    : isAvailable
                    ? 'bg-white border-slate-200'
                    : 'bg-slate-50/70 border-slate-200/80 opacity-75'
                }`}
              >
                {/* Stage Header Info */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                        isLocked ? 'bg-slate-200 text-slate-500' : 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                      }`}
                    >
                      {isLocked ? <Lock className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                          {stage.stageNumber}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">{stage.phaseTag}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                        {stage.title}
                      </h3>
                    </div>
                  </div>

                  {/* Status Badge & Admin Edit Controls */}
                  <div className="flex items-center gap-2">
                    {isCurrentInProgress && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                        <span className="h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
                        IN PROGRESS
                      </span>
                    )}
                    {isAvailable && !isCurrentInProgress && (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        AVAILABLE
                      </span>
                    )}
                    {isLocked && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-200/80 px-3 py-1 text-xs font-bold text-slate-500">
                        <Lock className="w-3 h-3" />
                        LOCKED
                      </span>
                    )}

                    {viewMode === 'admin' && (
                      <div className="flex items-center gap-1 ml-2 border-l border-slate-200 pl-2">
                        <button
                          onClick={() => handleOpenSubtopicModal(stage.id, null)}
                          title="Add Module to Stage"
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenStageModal(stage)}
                          title="Edit Stage"
                          className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStage(stage.id, stage.title)}
                          title="Delete Stage"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modules List directly nested inside Stage Card */}
                {stage.subtopics && stage.subtopics.length > 0 ? (
                  <div className="mt-4 p-3.5 sm:p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1 pb-1">
                      <span>Curriculum Modules ({stage.subtopics.length})</span>
                      <span>Click module to view learning path</span>
                    </div>

                    {stage.subtopics.map((subtopic, mIdx) => {
                      const isFirstInStage1 = sIdx === 0 && mIdx === 0;

                      return (
                        <div key={subtopic.id} className="relative group/sub flex items-center gap-2">
                          {isFirstInStage1 ? (
                            /* Highlighted Gradient Button Card for MOD-01 */
                            <button
                              onClick={() => setSelectedSubtopicState({ stageId: stage.id, subtopicId: subtopic.id })}
                              className="w-full text-left rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 p-4 text-white shadow-md shadow-purple-600/25 hover:shadow-lg hover:shadow-purple-600/35 hover:scale-[1.003] transition-all flex items-center justify-between group cursor-pointer"
                            >
                              <div className="flex items-center gap-3.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white">
                                  <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-bold text-white text-sm sm:text-base leading-tight">
                                      {subtopic.title}
                                    </p>
                                    {subtopic.duration && (
                                      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">
                                        {subtopic.duration}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-purple-100/90 font-medium mt-0.5">
                                    {subtopic.description || 'Click to view subtopics and resource cards'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 group-hover:bg-white group-hover:text-purple-700 transition-all text-white">
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            </button>
                          ) : (
                            /* Standard Capsule Card for Modules MOD-02 through MOD-10 */
                            <button
                              onClick={() => setSelectedSubtopicState({ stageId: stage.id, subtopicId: subtopic.id })}
                              className="w-full text-left rounded-2xl bg-slate-50 hover:bg-purple-50/80 hover:border-purple-200 border border-slate-200/90 px-4 py-3.5 text-slate-800 transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-bold text-xs">
                                  <Clock className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-purple-700">
                                      {subtopic.title}
                                    </span>
                                    {subtopic.duration && (
                                      <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-purple-200">
                                        {subtopic.duration}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                    {subtopic.description}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-purple-600">
                                <span className="text-[10px] font-semibold hidden sm:inline">View Resources</span>
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </button>
                          )}

                          {/* Admin Edit/Delete Controls for Module */}
                          {viewMode === 'admin' && (
                            <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs flex-shrink-0">
                              <button
                                onClick={() => handleOpenSubtopicModal(stage.id, subtopic)}
                                title="Edit Module"
                                className="p-1 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-md cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteSubtopic(stage.id, subtopic.id, subtopic.title)}
                                title="Delete Module"
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  viewMode === 'admin' && (
                    <button
                      onClick={() => handleOpenSubtopicModal(stage.id, null)}
                      className="mt-3 w-full border-2 border-dashed border-slate-200 hover:border-purple-400 p-3 rounded-2xl text-xs font-bold text-slate-500 hover:text-purple-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Module to {stage.stageNumber}</span>
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Slide-Over Topic Catalog Drawer (Picture 2 Content) */}
      {activeSubtopic && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setSelectedSubtopicState(null)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer Side Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300 border-l border-slate-200">
              
              {/* Drawer Scrollable Body */}
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
                      {activeSubtopic.duration && (
                        <span className="inline-block bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                          ⏱ {activeSubtopic.duration}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-3 leading-relaxed">
                      {activeSubtopic.description || 'Master fundamental concepts and complete all practical labs and topic evaluations.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedSubtopicState(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Section Header */}
                <div className="flex items-center justify-between text-xs font-bold tracking-wider uppercase text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>LEARNING PATH & RESOURCES</span>
                  </div>

                  {viewMode === 'admin' && (
                    <button
                      onClick={() => handleOpenModuleModal(null)}
                      className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[11px] flex items-center gap-1 border border-purple-200 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Add Section</span>
                    </button>
                  )}
                </div>

                {/* Module Learning Sections & Standard 3 Resource Cards */}
                <div className="space-y-4">
                  {activeSubtopic.modules && activeSubtopic.modules.length > 0 ? (
                    activeSubtopic.modules.map((module) => {
                      const isExpanded = expandedModule === module.id || activeSubtopic.modules.length === 1 || !expandedModule;

                      return (
                        <div
                          key={module.id}
                          className="rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs"
                        >
                          {/* Section Header Bar */}
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
                            </div>

                            <div className="flex items-center gap-2">
                              {viewMode === 'admin' && (
                                <div className="flex items-center gap-1 border-r border-white/20 pr-2 mr-1">
                                  <button
                                    onClick={() => handleOpenItemModal(module.id, null)}
                                    title="Add Resource Item"
                                    className="p-1 hover:bg-white/20 rounded cursor-pointer text-white"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenModuleModal(module)}
                                    title="Edit Section"
                                    className="p-1 hover:bg-white/20 rounded cursor-pointer text-white"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteModule(module.id, module.title)}
                                    title="Delete Section"
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

                          {/* 3 Resource Cards (LIVE CLASS, PRACTICAL LAB, ASSESSMENT) */}
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
                                            title="Edit Resource"
                                            className="p-1 text-slate-400 hover:text-purple-600 rounded cursor-pointer"
                                          >
                                            <Edit2 className="w-3 h-3" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteItem(module.id, item.id, item.title)}
                                            title="Delete Resource"
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
                                  <p>No learning items added yet.</p>
                                  {viewMode === 'admin' && (
                                    <button
                                      onClick={() => handleOpenItemModal(module.id, null)}
                                      className="px-3 py-1.5 bg-purple-50 text-purple-700 font-bold rounded-lg hover:bg-purple-100 text-xs inline-flex items-center gap-1 cursor-pointer"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>Add Resource</span>
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
                                  <span>+ Add Resource Item</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                      <p>No module section configured yet.</p>
                      {viewMode === 'admin' && (
                        <button
                          onClick={() => handleOpenModuleModal(null)}
                          className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Create Learning Section</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action Bar: Ask AI Tutor PRO */}
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <button
                  onClick={() => addToast('AI Tutor PRO assistant connected!', 'success')}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Ask AI Tutor</span>
                  <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                    PRO
                  </span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 1: Create / Edit Stage --- */}
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
                  <label className="block font-bold text-slate-700 mb-1">Stage Badge Number</label>
                  <input
                    type="text"
                    required
                    value={stageFormData.stageNumber}
                    onChange={(e) => setStageFormData({ ...stageFormData, stageNumber: e.target.value })}
                    placeholder="e.g. STAGE 05"
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
                    placeholder="e.g. Phase 5 • Cloud & DevOps"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Stage Title</label>
                <input
                  type="text"
                  required
                  value={stageFormData.title}
                  onChange={(e) => setStageFormData({ ...stageFormData, title: e.target.value })}
                  placeholder="e.g. STAGE 05 — Advanced Cloud Architecture"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
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
                  <label className="block font-bold text-slate-700 mb-1">Lock Mode</label>
                  <select
                    value={stageFormData.isLocked ? 'true' : 'false'}
                    onChange={(e) => setStageFormData({ ...stageFormData, isLocked: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold bg-white"
                  >
                    <option value="false">Unlocked</option>
                    <option value="true">Locked</option>
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

      {/* --- MODAL 2: Create / Edit Module --- */}
      {isSubtopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingSubtopic ? 'Edit Module' : 'Add Module to Stage'}
              </h3>
              <button onClick={() => setIsSubtopicModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubtopic} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Module Title</label>
                <input
                  type="text"
                  required
                  value={subtopicFormData.title}
                  onChange={(e) => setSubtopicFormData({ ...subtopicFormData, title: e.target.value })}
                  placeholder="e.g. MOD-11 — Microservices & Event Architecture"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Duration Badge (e.g. 5 hrs, 20 hrs)</label>
                <input
                  type="text"
                  required
                  value={subtopicFormData.duration}
                  onChange={(e) => setSubtopicFormData({ ...subtopicFormData, duration: e.target.value })}
                  placeholder="e.g. 20 hrs"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description Note</label>
                <textarea
                  rows={2}
                  value={subtopicFormData.description}
                  onChange={(e) => setSubtopicFormData({ ...subtopicFormData, description: e.target.value })}
                  placeholder="Module topic coverage and key takeaways"
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
                  {editingSubtopic ? 'Save Module' : 'Add Module'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: Section Modal --- */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingModule ? 'Edit Section Name' : 'Add Learning Path Section'}
              </h3>
              <button onClick={() => setIsModuleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModule} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Section Title</label>
                <input
                  type="text"
                  required
                  value={moduleFormData.title}
                  onChange={(e) => setModuleFormData({ title: e.target.value })}
                  placeholder="e.g. Core Learning Path"
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
                  Save Section
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
                {editingItem ? 'Edit Resource Item' : 'Add Resource Item'}
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
                    placeholder="JOIN, VIEW, TAKE"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-bold uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Resource Title</label>
                <input
                  type="text"
                  required
                  value={itemFormData.title}
                  onChange={(e) => setItemFormData({ ...itemFormData, title: e.target.value })}
                  placeholder="e.g. Git Branching Practice Lab"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Resource URL (Optional)</label>
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

      {/* --- MODAL 5: Banner Overview Modal --- */}
      {isOverviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Edit Banner Stats & Overview</h3>
              <button onClick={() => setIsOverviewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOverview} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Banner Headline</label>
                <textarea
                  rows={2}
                  required
                  value={overviewFormData.headline}
                  onChange={(e) => setOverviewFormData({ ...overviewFormData, headline: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Completed Modules</label>
                  <input
                    type="number"
                    value={overviewFormData.completedCount}
                    onChange={(e) => setOverviewFormData({ ...overviewFormData, completedCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Modules</label>
                  <input
                    type="number"
                    value={overviewFormData.totalCount}
                    onChange={(e) => setOverviewFormData({ ...overviewFormData, totalCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Hours</label>
                  <input
                    type="number"
                    value={overviewFormData.totalHours}
                    onChange={(e) => setOverviewFormData({ ...overviewFormData, totalHours: parseInt(e.target.value) || 163 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Overall Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={overviewFormData.completionPercentage}
                    onChange={(e) => setOverviewFormData({ ...overviewFormData, completionPercentage: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold"
                  />
                </div>
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
