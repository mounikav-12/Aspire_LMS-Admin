import React, { useState } from 'react';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { DEFAULT_STAGES, getSubtopicsForStage, getInnerModulesForSubtopic } from '../sessions/LiveSessionListPage';
import {
  FolderGit2,
  Plus,
  Search,
  Play,
  Clock,
  UserCheck,
  Edit2,
  Trash2,
  Video,
  Image as ImageIcon,
  BookOpen,
  Layers,
  Bookmark,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export function RecordingLibraryPage() {
  const {
    courses = [],
    courseLessons = [],
    milestones,
    milestonesByBatch,
    recordings = [],
    addRecording,
    updateRecording,
    deleteRecording,
    activeBatchFilter,
    setActiveBatchFilter
  } = useLmsData();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const courseIdParam = urlParams.get('courseId');
      if (courseIdParam) return courseIdParam;
    } catch (e) {}
    return courses[0]?.id || '';
  });
  const [selectedStageId, setSelectedStageId] = useState('ALL');
  const [selectedSubtopicId, setSelectedSubtopicId] = useState('ALL');
  const [selectedModuleId, setSelectedModuleId] = useState('ALL');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRecording, setEditingRecording] = useState(null);
  const [deletingRecording, setDeletingRecording] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    instructor: '',
    videoUrl: '',
    thumbnail: '',
    description: '',
    instructions: '',
    courseId: '',
    courseName: '',
    stageId: '',
    stageName: '',
    subtopicId: '',
    subtopicName: '',
    moduleId: '',
    moduleName: ''
  });

  const activeCourseId = selectedCourseId || courses[0]?.id || '';
  const activeCourseObj = courses.find((c) => c.id === activeCourseId) || courses[0];
  const activeStagesList =
    activeCourseId && activeCourseId !== 'ALL' && milestonesByBatch?.[activeCourseId]?.stages && milestonesByBatch[activeCourseId].stages.length > 0
      ? milestonesByBatch[activeCourseId].stages
      : activeCourseObj?.topics && activeCourseObj.topics.length > 0
      ? activeCourseObj.topics
      : milestones?.stages && milestones.stages.length > 0
      ? milestones.stages
      : DEFAULT_STAGES;

  const selectedStageObj = selectedStageId !== 'ALL' ? activeStagesList.find(s => s.id === selectedStageId) : null;
  const subtopicsForStage = selectedStageObj ? getSubtopicsForStage(selectedStageObj) : [];

  const selectedSubtopicObj = selectedSubtopicId !== 'ALL' ? subtopicsForStage.find(sub => sub.id === selectedSubtopicId) : null;
  const modulesForSubtopic = selectedSubtopicObj ? getInnerModulesForSubtopic(selectedSubtopicObj, courseLessons, selectedStageId) : [];

  const handleOpenAddModal = () => {
    const activeCourse = courses.find((c) => c.id === (selectedCourseId || courses[0]?.id));
    const nextStages = activeCourse?.id
      ? (milestonesByBatch?.[activeCourse.id]?.stages || activeCourse?.topics || [])
      : [];
    const initStage = selectedStageId !== 'ALL' ? selectedStageObj : nextStages[0];
    const initSubs = initStage ? getSubtopicsForStage(initStage) : [];
    const initSub = selectedSubtopicId !== 'ALL' ? selectedSubtopicObj : initSubs[0];
    const initMods = initSub ? getInnerModulesForSubtopic(initSub, courseLessons, initStage?.id) : [];
    const initMod = selectedModuleId !== 'ALL' ? initMods.find(m => (m.id || m.title) === selectedModuleId) : initMods[0];

    setFormData({
      title: initMod?.title || '',
      duration: initMod?.duration || '1h 30m',
      instructor: '',
      videoUrl: '',
      thumbnail: '',
      description: '',
      instructions: '',
      courseId: activeCourse?.id || '',
      courseName: activeCourse?.title || '',
      stageId: initStage?.id || '',
      stageName: initStage?.title || '',
      subtopicId: initSub?.id || '',
      subtopicName: initSub?.title || '',
      moduleId: initMod?.id || '',
      moduleName: initMod?.title || ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (e, rec) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingRecording(rec);
    setFormData({
      title: rec.title || '',
      duration: rec.duration || '',
      instructor: rec.instructor || '',
      videoUrl: rec.videoUrl || '',
      thumbnail: rec.thumbnail || '',
      description: rec.description || '',
      instructions: rec.instructions || '',
      courseId: rec.courseId || '',
      courseName: rec.courseName || '',
      stageId: rec.stageId || '',
      stageName: rec.stageName || '',
      subtopicId: rec.subtopicId || '',
      subtopicName: rec.subtopicName || '',
      moduleId: rec.moduleId || '',
      moduleName: rec.moduleName || ''
    });
  };

  const handleDeleteClick = (e, rec) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingRecording(rec);
  };

  const handleSaveRecording = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.title.trim()) {
      addToast('Please enter video title', 'error');
      return;
    }

    const recPayload = {
      ...formData,
      conceptName: formData.moduleName || formData.subtopicName || formData.title || 'Video Lecture'
    };

    if (editingRecording) {
      updateRecording(editingRecording.id, recPayload);
      addToast(`Updated recording: "${formData.title}"`, 'success');
      setEditingRecording(null);
    } else {
      addRecording(recPayload);
      addToast(`Recording "${formData.title}" added to library!`, 'success');
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingRecording) {
      deleteRecording(deletingRecording.id);
      addToast(`Deleted recording "${deletingRecording.title}"`, 'info');
      setDeletingRecording(null);
    }
  };

  const filteredRecordings = recordings.filter((r) => {
    const activeCourseId = selectedCourseId || courses[0]?.id || '';
    const matchesCourse =
      !selectedCourseId ||
      selectedCourseId === 'ALL' ||
      !r.courseId ||
      r.courseId === selectedCourseId ||
      r.course_id === selectedCourseId ||
      (r.courseName && activeCourseObj && r.courseName === activeCourseObj.title);

    const matchesStage =
      selectedStageId === 'ALL' ||
      !r.stageId ||
      r.stageId === selectedStageId ||
      r.stage_id === selectedStageId ||
      (selectedStageObj && (r.stageName === selectedStageObj.title || r.stageTitle === selectedStageObj.title));

    const matchesSubtopic =
      selectedSubtopicId === 'ALL' ||
      !r.subtopicId ||
      r.subtopicId === selectedSubtopicId ||
      r.subtopic_id === selectedSubtopicId ||
      (selectedSubtopicObj && (r.subtopicName === selectedSubtopicObj.title || r.subtopicTitle === selectedSubtopicObj.title));

    const matchesModule =
      selectedModuleId === 'ALL' ||
      !r.moduleId ||
      r.moduleId === selectedModuleId ||
      r.module_id === selectedModuleId ||
      (modulesForSubtopic.some(m => (m.id === r.moduleId || m.title === r.moduleName)));

    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.conceptName && r.conceptName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.instructor && r.instructor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.stageName && r.stageName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.subtopicName && r.subtopicName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.moduleName && r.moduleName.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCourse && matchesStage && matchesSubtopic && matchesModule && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <FolderGit2 className="w-7 h-7 text-blue-600" /> Video Recording Library
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Manage recorded tech lectures, video stream links, concept deep-dives, and exercise guides published to the Student LMS.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAddModal}>
              Add Video Recording
            </Button>
          </div>
        </div>

        {/* Filters Container */}
        <div className="flex flex-wrap items-center gap-4 pt-2.5 border-t border-slate-100/60">
          {/* Course Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 flex-shrink-0">
              <BookOpen className="w-3.5 h-3.5 text-purple-600" />
              <span>Course:</span>
            </label>
            <div className="relative">
              <select
                value={selectedCourseId || courses[0]?.id || ''}
                onChange={(e) => {
                  setSelectedCourseId(e.target.value);
                  setSelectedStageId('ALL');
                  setSelectedSubtopicId('ALL');
                  setSelectedModuleId('ALL');
                }}
                className="px-3.5 py-2 pr-8 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 hover:border-purple-300 focus:outline-none focus:border-purple-600 focus:bg-white transition-all shadow-2xs cursor-pointer appearance-none max-w-[240px] truncate"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Milestone Stage Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 flex-shrink-0">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Stage:</span>
            </label>
            <div className="relative">
              <select
                value={selectedStageId}
                onChange={(e) => {
                  setSelectedStageId(e.target.value);
                  setSelectedSubtopicId('ALL');
                  setSelectedModuleId('ALL');
                }}
                className="px-3.5 py-2 pr-8 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 hover:border-blue-300 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-2xs cursor-pointer appearance-none max-w-[200px] truncate"
              >
                <option value="ALL">All Stages</option>
                {activeStagesList.map((stg) => (
                  <option key={stg.id} value={stg.id}>
                    {stg.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Milestone Module Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 flex-shrink-0">
              <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
              <span>Milestone Module:</span>
            </label>
            <div className="relative">
              <select
                value={selectedSubtopicId}
                onChange={(e) => {
                  setSelectedSubtopicId(e.target.value);
                  setSelectedModuleId('ALL');
                }}
                disabled={selectedStageId === 'ALL'}
                className="px-3.5 py-2 pr-8 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 hover:border-emerald-300 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs cursor-pointer appearance-none max-w-[200px] truncate disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="ALL">All Milestone Modules</option>
                {selectedStageId !== 'ALL' &&
                  subtopicsForStage.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.title}
                    </option>
                  ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Specific Module Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Specific Module:</span>
            </label>
            <div className="relative">
              <select
                value={selectedModuleId}
                onChange={(e) => setSelectedModuleId(e.target.value)}
                disabled={selectedSubtopicId === 'ALL'}
                className="px-3.5 py-2 pr-8 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 hover:border-purple-300 focus:outline-none focus:border-purple-600 focus:bg-white transition-all shadow-2xs cursor-pointer appearance-none max-w-[200px] truncate disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="ALL">All Specific Modules</option>
                {selectedSubtopicId !== 'ALL' &&
                  modulesForSubtopic.map((mod) => (
                    <option key={mod.id} value={mod.id}>
                      {mod.title}
                    </option>
                  ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search recording library by title, concept name, instructor, stage..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Recording Cards Grid */}
      {filteredRecordings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecordings.map((rec) => (
            <Link
              key={rec.id}
              to={`/library/${rec.id}`}
              className="group bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail Container */}
                <div className="relative h-44 overflow-hidden bg-slate-900">
                  <img
                    src={rec.thumbnail}
                    alt={rec.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  {/* Play Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center group-hover:bg-slate-900/20 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Duration Pill */}
                  <div className="absolute bottom-3 right-3 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-xs flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-400" /> {rec.duration}
                  </div>

                  {/* Edit/Delete Actions */}
                  <div className="absolute top-3 right-3 flex gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-xl shadow-md z-10">
                    <button
                      onClick={(e) => handleOpenEditModal(e, rec)}
                      className="p-1 text-slate-600 hover:text-blue-600 transition-colors"
                      title="Edit Recording"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, rec)}
                      className="p-1 text-slate-600 hover:text-rose-600 transition-colors"
                      title="Delete Recording"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {rec.conceptName && <Badge variant="blue">{rec.conceptName}</Badge>}
                    {rec.stageName && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 truncate max-w-[140px]">
                        {rec.stageName}
                      </span>
                    )}
                    {rec.subtopicName && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 truncate max-w-[150px]">
                        {rec.subtopicName}
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {rec.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
                    {rec.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" /> {rec.instructor}
                </span>
                <span className="font-bold text-blue-600 group-hover:underline">Watch Video →</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Recordings Found"
          description="Upload video recordings for student review or adjust the filters."
          actionLabel="Add Recording"
          onAction={handleOpenAddModal}
        />
      )}

      {/* Add / Edit Recording Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingRecording}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingRecording(null);
        }}
        title={editingRecording ? 'Edit Recording Details' : 'Add Video Recording'}
        subtitle="Specify video stream URL, lecture metadata, and curriculum milestone mapping"
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleSaveRecording} className="space-y-4">
          <Input
            label="Video Title"
            placeholder="e.g. System Design: Rate Limiter & Token Bucket"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          {/* CASCADING MILESTONE CURRICULUM LOCATION MAPPING */}
          {(() => {
            const modalCourseId = formData.courseId || selectedCourseId || courses[0]?.id || '';
            const currentStagesList = modalCourseId
              ? (milestonesByBatch?.[modalCourseId]?.stages ||
                 courses.find((c) => c.id === modalCourseId)?.topics ||
                 [])
              : [];

            const currentStageObj = formData.stageId
              ? currentStagesList.find((s) => s.id === formData.stageId || s.title === formData.stageName)
              : null;

            const currentSubtopicsArr = currentStageObj ? getSubtopicsForStage(currentStageObj) : [];

            const currentSubtopicObj = formData.subtopicId
              ? currentSubtopicsArr.find((st) => st.id === formData.subtopicId || st.title === formData.subtopicName)
              : null;

            const currentInnerModules = currentSubtopicObj ? getInnerModulesForSubtopic(currentSubtopicObj, courseLessons, currentStageObj?.id) : [];

            return (
              <div className="bg-gradient-to-br from-slate-50 via-purple-50/20 to-blue-50/40 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-purple-100/80">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Curriculum Location & Milestone Topic Mapping
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Step 1: Course Track */}
                  <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-purple-100/90 shadow-2xs">
                    <Select
                      label="1. Course Track"
                      value={formData.courseId || ''}
                      onChange={(e) => {
                        const newCourseId = e.target.value;
                        const courseObj = courses.find((c) => c.id === newCourseId);
                        const nextStages = newCourseId
                          ? (milestonesByBatch?.[newCourseId]?.stages || courseObj?.topics || [])
                          : [];
                        const firstStage = nextStages[0];
                        const firstSubs = firstStage ? getSubtopicsForStage(firstStage) : [];
                        const firstSub = firstSubs[0];
                        const firstMods = firstSub ? getInnerModulesForSubtopic(firstSub, courseLessons, firstStage?.id) : [];
                        const firstMod = firstMods[0];

                        setFormData({
                          ...formData,
                          title: firstMod?.title || formData.title,
                          duration: firstMod?.duration || formData.duration,
                          courseId: newCourseId,
                          courseName: courseObj?.title || '',
                          stageId: firstStage?.id || '',
                          stageName: firstStage?.title || '',
                          subtopicId: firstSub?.id || '',
                          subtopicName: firstSub?.title || '',
                          moduleId: firstMod?.id || '',
                          moduleName: firstMod?.title || ''
                        });
                      }}
                      options={[
                        { value: '', label: 'Select Course' },
                        ...courses.map((c) => ({ value: c.id, label: c.title }))
                      ]}
                      required
                    />
                  </div>

                  {/* Step 2: Milestone Stage */}
                  <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-blue-100/90 shadow-2xs">
                    <Select
                      label="2. Milestone Stage"
                      value={formData.stageId || ''}
                      onChange={(e) => {
                        const newStageId = e.target.value;
                        const newStage = currentStagesList.find((s) => s.id === newStageId);
                        const newSubs = newStage ? getSubtopicsForStage(newStage) : [];
                        const newSub = newSubs[0];
                        const newMods = newSub ? getInnerModulesForSubtopic(newSub, courseLessons, newStage?.id) : [];
                        const newMod = newMods[0];

                        setFormData({
                          ...formData,
                          title: newMod?.title || formData.title,
                          duration: newMod?.duration || formData.duration,
                          stageId: newStageId,
                          stageName: newStage?.title || '',
                          subtopicId: newSub?.id || '',
                          subtopicName: newSub?.title || '',
                          moduleId: newMod?.id || '',
                          moduleName: newMod?.title || ''
                        });
                      }}
                      options={[
                        { value: '', label: 'Select Stage' },
                        ...currentStagesList.map((s, idx) => ({
                          value: s.id,
                          label: s.title || `Stage ${idx + 1}`
                        }))
                      ]}
                    />
                  </div>

                  {/* Step 3: Milestone Module */}
                  <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-emerald-100/90 shadow-2xs">
                    <Select
                      label="3. Milestone Module"
                      value={formData.subtopicId || ''}
                      onChange={(e) => {
                        const newSubId = e.target.value;
                        const foundSub = currentSubtopicsArr.find((st) => st.id === newSubId);
                        const foundMods = foundSub ? getInnerModulesForSubtopic(foundSub, courseLessons, currentStageObj?.id) : [];
                        const foundMod = foundMods[0];

                        setFormData({
                          ...formData,
                          title: foundMod?.title || formData.title,
                          duration: foundMod?.duration || formData.duration,
                          subtopicId: newSubId,
                          subtopicName: foundSub?.title || '',
                          moduleId: foundMod?.id || '',
                          moduleName: foundMod?.title || ''
                        });
                      }}
                      options={[
                        { value: '', label: 'Select Milestone Module' },
                        ...currentSubtopicsArr.map((st) => ({
                          value: st.id,
                          label: st.title
                        }))
                      ]}
                    />
                  </div>

                  {/* Step 4: Specific Module */}
                  <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-purple-100/90 shadow-2xs">
                    <Select
                      label="4. Specific Module"
                      value={formData.moduleId || ''}
                      onChange={(e) => {
                        const newModId = e.target.value;
                        const foundMod = currentInnerModules.find((m) => (m.id || m.title) === newModId);

                        setFormData({
                          ...formData,
                          title: foundMod?.title || formData.title,
                          duration: foundMod?.duration || formData.duration,
                          moduleId: newModId,
                          moduleName: foundMod?.title || ''
                        });
                      }}
                      options={[
                        { value: '', label: 'Select Specific Module' },
                        ...currentInnerModules.map((m) => ({
                          value: m.id || m.title,
                          label: m.title
                        }))
                      ]}
                    />
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Duration"
              placeholder="e.g. 1h 45m"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />

            <Input
              label="Instructor Name"
              placeholder="e.g. Staff Instructor"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            />
          </div>

          <Input
            label="Video Stream / Drive / YouTube URL"
            icon={Video}
            placeholder="https://drive.google.com/file/d/... or https://.../video.mp4"
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            helperText="Supports Google Drive share links, YouTube, Vimeo, and direct MP4/S3 stream links"
            required
          />

          <Input
            label="Cover Thumbnail Image URL"
            icon={ImageIcon}
            placeholder="https://images.unsplash.com/photo-xxx"
            value={formData.thumbnail}
            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
            helperText="Optional poster image URL for the video player"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
              Video Overview / Description
            </label>
            <textarea
              rows={3}
              placeholder="Detailed concept walkthrough explanation..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingRecording(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingRecording ? 'Save Recording' : 'Add Recording'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingRecording}
        onClose={() => setDeletingRecording(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Video Recording"
        message={`Are you sure you want to delete "${deletingRecording?.title}"?`}
        confirmText="Delete Recording"
      />
    </div>
  );
}
