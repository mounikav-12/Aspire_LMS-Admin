import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { BatchFilterSelector } from '../../components/common/BatchFilterSelector';
import { DEFAULT_STAGES, getSubtopicsForStage, getInnerModulesForSubtopic } from '../sessions/LiveSessionListPage';
import {
  FileCheck2,
  Plus,
  Search,
  Clock,
  Award,
  HelpCircle,
  Code2,
  Calendar,
  Edit2,
  Trash2,
  BookOpen,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Layers,
  ListChecks,
  CheckSquare,
  Square,
  Video,
  Code,
  FileCheck
} from 'lucide-react';

export function AssessmentListPage() {
  const {
    assessments,
    courses,
    courseLessons,
    milestones,
    addAssessment,
    updateAssessment,
    deleteAssessment,
    activeBatchFilter,
    setActiveBatchFilter,
    availableBatches
  } = useLmsData();
  const { addToast } = useToast();

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

  const [selectedBatch, setSelectedBatch] = useState(activeBatchFilter || 'Weekday Batch');

  const handleSelectBatch = (bVal) => {
    setSelectedBatch(bVal);
    if (setActiveBatchFilter) setActiveBatchFilter(bVal);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [deletingAssessment, setDeletingAssessment] = useState(null);

  // Form state for creating/editing assessment
  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    courseName: '',
    stageId: '',
    stageName: '',
    subtopicId: '',
    subtopicName: '',
    innerTopicId: '',
    topicName: '',
    durationMinutes: 45,
    totalMarks: 100,
    dueDate: '2026-08-30',
    mcqs: [
      {
        question: 'Which Git command initializes a new local repository?',
        options: ['git create', 'git init', 'git start', 'git repo'],
        correctIndex: 1
      }
    ]
  });

  // Batch Selection State for Modal
  const [batchActiveTab, setBatchActiveTab] = useState('Weekdays');
  const [selectedWeekdayBatches, setSelectedWeekdayBatches] = useState(allWeekdayBatchesList);
  const [selectedWeekendBatches, setSelectedWeekendBatches] = useState(allWeekendBatchesList);

  const selectedCourseObj = courses.find((c) => c.id === formData.courseId) || courses[0];
  const stagesList =
    milestones?.stages && milestones.stages.length > 0
      ? milestones.stages
      : selectedCourseObj?.topics && selectedCourseObj.topics.length > 0
      ? selectedCourseObj.topics
      : DEFAULT_STAGES;

  const handleOpenAddModal = () => {
    const firstStage = stagesList[0];
    const stageSubs = getSubtopicsForStage(firstStage);
    const firstSub = stageSubs[0];
    const subLessons = getInnerModulesForSubtopic(firstSub);
    const firstMod = subLessons[0];

    setBatchActiveTab('Weekdays');
    setSelectedWeekdayBatches(allWeekdayBatchesList);
    setSelectedWeekendBatches(allWeekendBatchesList);
    setFormData({
      title: '',
      courseId: courses[0]?.id || '',
      courseName: courses[0]?.title || '',
      stageId: firstStage?.id || '',
      stageName: firstStage?.title || '',
      subtopicId: firstSub?.id || '',
      subtopicName: firstSub?.title || '',
      innerTopicId: firstMod?.id || '',
      topicName: firstMod?.title || '',
      durationMinutes: 45,
      totalMarks: 100,
      dueDate: '2026-08-30',
      mcqs: [
        {
          question: 'Which Git command initializes a new local repository?',
          options: ['git create', 'git init', 'git start', 'git repo'],
          correctIndex: 1
        }
      ]
    });
    setEditingAssessment(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (asm) => {
    setEditingAssessment(asm);
    setBatchActiveTab('Weekdays');

    let initialWd = [];
    let initialWe = [];
    if (Array.isArray(asm.targetBatches) && asm.targetBatches.length > 0) {
      initialWd = asm.targetBatches.filter(
        (b) => b.startsWith('A26W') && !b.startsWith('A26S') && !b.startsWith('A26WE')
      );
      initialWe = asm.targetBatches.filter((b) => b.startsWith('A26S') || b.startsWith('A26WE'));
    } else if (typeof asm.targetBatch === 'string' && asm.targetBatch && asm.targetBatch !== 'All Batches') {
      const parsed = asm.targetBatch.split(',').map((s) => s.trim());
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

    const initialMcqs = asm.mcqs && asm.mcqs.length > 0
      ? asm.mcqs.map((m) => ({
          question: m.question || '',
          options: Array.isArray(m.options) ? [...m.options] : ['Option A', 'Option B', 'Option C', 'Option D'],
          correctIndex: m.correctIndex !== undefined ? m.correctIndex : 0
        }))
      : [
          {
            question: 'Which Git command initializes a new repository?',
            options: ['git create', 'git init', 'git start', 'git repo'],
            correctIndex: 1
          }
        ];

    const targetStage = stagesList.find((s) => s.id === asm.stageId || s.title === asm.stageName || s.title === asm.moduleName) || stagesList[0];
    const stageSubs = getSubtopicsForStage(targetStage);
    const targetSub = stageSubs.find((st) => st.id === asm.subtopicId || st.title === asm.subtopicName) || stageSubs[0];
    const subLessons = getInnerModulesForSubtopic(targetSub);
    const targetMod = subLessons.find((m) => (m.id || m.title) === (asm.innerTopicId || asm.moduleId || asm.topicName)) || subLessons[0];

    setFormData({
      title: asm.title,
      courseId: asm.courseId || courses[0]?.id || '',
      courseName: asm.courseName || courses.find((c) => c.id === asm.courseId)?.title || '',
      stageId: targetStage?.id || '',
      stageName: targetStage?.title || '',
      subtopicId: targetSub?.id || '',
      subtopicName: targetSub?.title || '',
      innerTopicId: targetMod?.id || '',
      topicName: targetMod?.title || '',
      durationMinutes: asm.durationMinutes || 45,
      totalMarks: asm.totalMarks || 100,
      dueDate: asm.dueDate || '2026-08-30',
      mcqs: initialMcqs
    });
  };

  // MCQ Question Array Handlers
  const handleAddMcq = () => {
    setFormData((prev) => ({
      ...prev,
      mcqs: [
        ...prev.mcqs,
        {
          question: '',
          options: ['', '', '', ''],
          correctIndex: 0
        }
      ]
    }));
  };

  const handleRemoveMcq = (index) => {
    setFormData((prev) => ({
      ...prev,
      mcqs: prev.mcqs.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateMcqQuestion = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.mcqs];
      updated[index] = { ...updated[index], question: value };
      return { ...prev, mcqs: updated };
    });
  };

  const handleUpdateMcqOption = (mcqIndex, optIndex, value) => {
    setFormData((prev) => {
      const updatedMcqs = [...prev.mcqs];
      const updatedOptions = [...updatedMcqs[mcqIndex].options];
      updatedOptions[optIndex] = value;
      updatedMcqs[mcqIndex] = { ...updatedMcqs[mcqIndex], options: updatedOptions };
      return { ...prev, mcqs: updatedMcqs };
    });
  };

  const handleUpdateMcqCorrectIndex = (mcqIndex, value) => {
    setFormData((prev) => {
      const updated = [...prev.mcqs];
      updated[mcqIndex] = { ...updated[mcqIndex], correctIndex: parseInt(value) || 0 };
      return { ...prev, mcqs: updated };
    });
  };

  // Save / Update Assessment
  const handleSaveAssessment = (e) => {
    e.preventDefault();
    if (!formData.title) {
      addToast('Please enter assessment title', 'error');
      return;
    }

    const selectedCourse = courses.find((c) => c.id === formData.courseId) || courses[0];
    const currentStageObj = stagesList.find((s) => s.id === formData.stageId || s.title === formData.stageName) || stagesList[0];
    const stageSubs = getSubtopicsForStage(currentStageObj);
    const currentSubObj = stageSubs.find((st) => st.id === formData.subtopicId || st.title === formData.subtopicName) || stageSubs[0];
    const subLessons = getInnerModulesForSubtopic(currentSubObj);
    const currentModObj = subLessons.find((m) => (m.id || m.title) === (formData.innerTopicId || formData.moduleId || formData.topicName)) || subLessons[0];

    const totalMcqsCount = formData.mcqs.length;
    const totalQuestionsCount = totalMcqsCount;

    const allBatches = [...selectedWeekdayBatches, ...selectedWeekendBatches];
    const targetBatchStr = allBatches.length > 0 ? allBatches.join(', ') : 'All Batches';

    const assessmentPayload = {
      title: formData.title,
      courseId: selectedCourse?.id || formData.courseId,
      courseName: selectedCourse?.title || formData.courseName,
      stageId: currentStageObj?.id || formData.stageId,
      stageName: currentStageObj?.title || formData.stageName,
      moduleName: currentStageObj?.title || formData.stageName,
      subtopicId: currentSubObj?.id || formData.subtopicId,
      subtopicName: currentSubObj?.title || formData.subtopicName,
      innerTopicId: currentModObj?.id || formData.innerTopicId || formData.moduleId,
      moduleId: currentModObj?.id || formData.innerTopicId || formData.moduleId,
      topicName: currentModObj?.title || formData.topicName,
      durationMinutes: parseInt(formData.durationMinutes) || 45,
      totalMarks: parseInt(formData.totalMarks) || 100,
      dueDate: formData.dueDate || '2026-08-30',
      mcqCount: totalMcqsCount,
      totalQuestions: totalQuestionsCount,
      mcqs: formData.mcqs,
      targetBatches: allBatches,
      targetBatch: targetBatchStr
    };

    if (editingAssessment) {
      updateAssessment(editingAssessment.id, assessmentPayload);
      addToast(`Updated assessment "${formData.title}" (${totalQuestionsCount} MCQs)`, 'success');
      setEditingAssessment(null);
    } else {
      addAssessment(assessmentPayload);
      addToast(`Published assessment "${formData.title}" (${totalQuestionsCount} MCQs) & linked to Milestone!`, 'success');
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingAssessment) {
      deleteAssessment(deletingAssessment.id);
      addToast(`Deleted assessment "${deletingAssessment.title}"`, 'info');
      setDeletingAssessment(null);
    }
  };

  const filteredAssessments = [...assessments]
    .filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.courseName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse = courseFilter === 'ALL' || a.courseId === courseFilter;
      return matchesSearch && matchesCourse;
    })
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (a.created_at ? new Date(a.created_at).getTime() : 0);
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (b.created_at ? new Date(b.created_at).getTime() : 0);
      if (timeA && timeB) return timeA - timeB;
      return 0;
    });

  // Calculate Overall Aggregate Metrics
  const totalQuestionsAllAssessments = assessments.reduce(
    (acc, a) => acc + (a.mcqs?.length || a.mcqCount || a.totalQuestions || 0),
    0
  );

  const currentModalMcqCount = formData.mcqs.length;
  const currentModalTotalQuestions = currentModalMcqCount;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-normal text-slate-900 flex items-center gap-2.5">
            <FileCheck2 className="w-6 h-6 text-blue-600" /> Assessments & Quizzes
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Author MCQ tests, code challenge prompts, and publish graded evaluations for enrolled students.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">

          <NavLink to="/coding-questions">
            <Button variant="outline" size="md" icon={Code2} className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-bold">
              Coding Bank
            </Button>
          </NavLink>
          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAddModal}>
            Create Assessment
          </Button>
        </div>
      </div>

      {/* Overview Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Evaluations</p>
            <p className="text-lg font-bold text-slate-900">{assessments.length} Active Quizzes</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <ListChecks className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Questions Configured</p>
            <p className="text-lg font-bold text-purple-700">{totalQuestionsAllAssessments} Questions</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">LMS Feed Sync</p>
            <p className="text-lg font-bold text-emerald-600">Published Live</p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search assessments by title, course name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="w-full md:w-64">
          <Select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Associated Courses' },
              ...courses.map((c) => ({ value: c.id, label: c.title }))
            ]}
          />
        </div>
      </div>

      {/* Assessment Cards */}
      {filteredAssessments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAssessments.map((asm) => {
            const mcqCount = asm.mcqs?.length || asm.mcqCount || 0;
            const totalQ = asm.totalQuestions || mcqCount;

            return (
              <div
                key={asm.id}
                className="group bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1.5 p-6 flex flex-col justify-between h-full"
              >
                <div className="space-y-4">
                  {/* Header Badges & Action Icons */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-blue-50/90 text-blue-700 font-bold px-3 py-1.5 rounded-xl border border-blue-200/60 text-xs">
                          <BookOpen className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                          <span className="truncate max-w-[240px]">{asm.courseName || 'Python Full Stack'}</span>
                        </span>

                      </div>

                      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                        <button
                          onClick={() => handleOpenEditModal(asm)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                          title="Edit Assessment & Questions"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingAssessment(asm)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                          title="Delete Assessment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Stage, Subtopic & Inner Topic Breadcrumb Pills */}
                    {(asm.moduleName || asm.subtopicName || asm.topicName) && (
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                        {asm.moduleName && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200/80 font-bold">
                            {asm.moduleName}
                          </span>
                        )}
                        {asm.subtopicName && (
                          <>
                            <span className="text-slate-400">➔</span>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200/80 font-bold">
                              {asm.subtopicName}
                            </span>
                          </>
                        )}
                        {asm.topicName && (
                          <>
                            <span className="text-slate-400">➔</span>
                            <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md border border-purple-200/80 font-bold">
                              Topic: {asm.topicName}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Title & Total Questions Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors leading-snug">
                      {asm.title}
                    </h3>
                    <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-black text-[11px] whitespace-nowrap border border-purple-200/60 flex-shrink-0">
                      {totalQ} Questions
                    </span>
                  </div>

                  {/* Color-Coordinated Metric Pills */}
                  <div className="grid grid-cols-3 gap-2.5 pt-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 bg-blue-50/70 p-2.5 rounded-xl border border-blue-100/80">
                      <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>{asm.durationMinutes} Minutes</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 bg-amber-50/70 p-2.5 rounded-xl border border-amber-100/80">
                      <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span>{asm.totalMarks} XP Points</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100/80">
                      <HelpCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span>{mcqCount} MCQs</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Due: <strong className="text-slate-800 font-bold">{asm.dueDate}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <Badge variant="emerald">Published</Badge>
                    <button
                      onClick={() => handleOpenEditModal(asm)}
                      className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 transition-all group-hover:translate-x-1 cursor-pointer"
                    >
                      Edit Quiz ({totalQ} Qs) <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No Assessments Found"
          description="Create your first assessment evaluation quiz."
          actionLabel="Add Assessment"
          onAction={handleOpenAddModal}
        />
      )}

      {/* Add / Edit Assessment Modal with Dynamic Question Builder */}
      <Modal
        isOpen={isAddModalOpen || !!editingAssessment}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingAssessment(null);
        }}
        title={editingAssessment ? 'Edit Assessment & Questions' : 'Create Assessment'}
        maxWidth="max-w-6xl"
      >
        <form onSubmit={handleSaveAssessment} className="space-y-4">
          {/* Title & Assessment Capacity Header Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-end">
            <div className="md:col-span-2">
              <Input
                label="Assessment Title"
                placeholder="e.g. React Concurrent Features & Hooks Evaluation"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Total Questions Header Banner */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-2.5 sm:p-3 rounded-2xl text-white flex items-center justify-between shadow-md mb-0.5">
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-blue-300 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block">Capacity</span>
                  <span className="text-xs font-black text-white">
                    Total Questions: <strong className="text-amber-300">{currentModalTotalQuestions}</strong>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="px-2.5 py-0.5 rounded-lg bg-white/10 text-blue-100 font-semibold border border-white/15">
                  {currentModalMcqCount} MCQs
                </span>
              </div>
            </div>
          </div>

          {/* 4-TIER CASCADING HIERARCHY SELECTOR (2x2 Grid) */}
          {(() => {
            const currentStageObj = stagesList.find((s) => s.id === formData.stageId || s.title === formData.stageName) || stagesList[0];
            const currentSubtopicsArr = getSubtopicsForStage(currentStageObj);
            const currentSubtopicObj = currentSubtopicsArr.find((st) => st.id === formData.subtopicId || st.title === formData.subtopicName) || currentSubtopicsArr[0];
            const currentInnerModules = getInnerModulesForSubtopic(currentSubtopicObj);
            const currentModObj = currentInnerModules.find((m) => (m.id || m.title) === (formData.innerTopicId || formData.moduleId || formData.topicName)) || currentInnerModules[0];
            const existingItems = currentModObj?.items || [];

            const handleAutoFillFromMilestone = () => {
              const subTitleClean = currentSubtopicObj?.title ? currentSubtopicObj.title.replace(/^Module\s+\d+:\s*/i, '') : '';
              const modTitle = currentModObj?.title || '';
              const combinedTitle = subTitleClean && modTitle && !modTitle.toLowerCase().includes(subTitleClean.toLowerCase())
                ? `${subTitleClean}: ${modTitle} Evaluation`
                : (modTitle ? `${modTitle} Evaluation` : (subTitleClean ? `${subTitleClean} Assessment` : 'Interactive Module Evaluation'));

              setFormData((prev) => ({
                ...prev,
                title: combinedTitle,
                stageId: currentStageObj?.id || prev.stageId,
                stageName: currentStageObj?.title || prev.stageName,
                subtopicId: currentSubtopicObj?.id || prev.subtopicId,
                subtopicName: currentSubtopicObj?.title || prev.subtopicName,
                innerTopicId: currentModObj?.id || prev.innerTopicId,
                topicName: currentModObj?.title || prev.topicName
              }));
              addToast(`Auto-filled: "${combinedTitle}"`, 'info');
            };

            return (
              <div className="bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/40 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-blue-100/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        Curriculum Location & Milestone Topic Mapping
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Assessments automatically sync to this Milestone topic in real-time
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoFillFromMilestone}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-100/80 hover:bg-blue-200 border border-blue-300 rounded-lg transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
                    title="Auto-populate Assessment Title from selected Milestone content"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                    <span>Auto-Fill from Milestone</span>
                  </button>
                </div>

                {/* 2x2 Structured Step Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Step 1: Course Track */}
                  <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-blue-100/90 shadow-2xs">
                    <Select
                      label="1. Course Track"
                      value={formData.courseId}
                      onChange={(e) => {
                        const newCourseId = e.target.value;
                        const selectedC = courses.find((c) => c.id === newCourseId);
                        const newStages = milestones?.stages && milestones.stages.length > 0
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
                          innerTopicId: firstMod?.id || '',
                          topicName: firstMod?.title || ''
                        });
                      }}
                      options={courses.map((c) => ({ value: c.id, label: c.title }))}
                    />
                  </div>

                  {/* Step 2: Course Module / Stage */}
                  <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-blue-100/90 shadow-2xs">
                    <Select
                      label="2. Milestone Stage"
                      value={formData.stageId || currentStageObj?.id || ''}
                      onChange={(e) => {
                        const newStageId = e.target.value;
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
                          innerTopicId: firstMod?.id || '',
                          topicName: firstMod?.title || ''
                        });
                      }}
                      options={stagesList.map((stg) => ({
                        value: stg.id,
                        label: stg.title
                      }))}
                    />
                  </div>

                  {/* Step 3: Milestone Subtopic / Module Track */}
                  <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-blue-100/90 shadow-2xs">
                    <Select
                      label="3. Milestone Subtopic / Module Track"
                      value={formData.subtopicId || currentSubtopicObj?.id || ''}
                      onChange={(e) => {
                        const newSubId = e.target.value;
                        const targetSub = currentSubtopicsArr.find((st) => st.id === newSubId) || currentSubtopicsArr[0];
                        const targetLessons = getInnerModulesForSubtopic(targetSub);
                        const firstMod = targetLessons[0];
                        setFormData({
                          ...formData,
                          subtopicId: newSubId,
                          subtopicName: targetSub?.title || '',
                          innerTopicId: firstMod?.id || '',
                          topicName: firstMod?.title || ''
                        });
                      }}
                      options={currentSubtopicsArr.map((sub, idx) => ({
                        value: sub.id,
                        label: `${idx + 1}. ${sub.title}`
                      }))}
                    />
                  </div>

                  {/* Step 4: Specific Topic Module */}
                  <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-blue-100/90 shadow-2xs">
                    <Select
                      label="4. Specific Topic Module"
                      value={formData.innerTopicId || currentModObj?.id || ''}
                      onChange={(e) => {
                        const newModId = e.target.value;
                        const targetMod = currentInnerModules.find((m) => (m.id || m.title) === newModId) || currentInnerModules[0];
                        setFormData({
                          ...formData,
                          innerTopicId: newModId,
                          topicName: targetMod?.title || ''
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

          {/* BATCH ALLOCATION DROPDOWNS: WEEKDAY & WEEKEND */}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <Input
              label="Duration (Minutes)"
              type="number"
              value={formData.durationMinutes}
              onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
            />

            <Input
              label="XP Points"
              type="number"
              value={formData.totalMarks}
              onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
            />

            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          {/* DYNAMIC MCQ QUESTION BUILDER SECTION */}
          <div className="space-y-4 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600" /> Multiple Choice Questions ({formData.mcqs.length})
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">Add MCQ question prompts, 4 choices, and select the correct answer</p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={handleAddMcq}
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                Add MCQ Question
              </Button>
            </div>

            {formData.mcqs.map((mcq, mIndex) => (
              <div key={mIndex} className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold text-xs">
                    MCQ #{mIndex + 1}
                  </span>
                  {formData.mcqs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMcq(mIndex)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <Input
                  label="Question Text"
                  placeholder="e.g. Which React hook memoizes values?"
                  value={mcq.question}
                  onChange={(e) => handleUpdateMcqQuestion(mIndex, e.target.value)}
                  required
                />

                {/* 4 Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {mcq.options.map((opt, oIndex) => (
                    <Input
                      key={oIndex}
                      label={`Option ${oIndex + 1}`}
                      placeholder={`Choice ${oIndex + 1}`}
                      value={opt}
                      onChange={(e) => handleUpdateMcqOption(mIndex, oIndex, e.target.value)}
                      required
                    />
                  ))}
                </div>

                <Select
                  label="Correct Option"
                  value={mcq.correctIndex}
                  onChange={(e) => handleUpdateMcqCorrectIndex(mIndex, e.target.value)}
                  options={mcq.options.map((opt, idx) => ({
                    value: idx,
                    label: `Option ${idx + 1}: ${opt || `Choice ${idx + 1}`}`
                  }))}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingAssessment(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingAssessment ? `Save Assessment (${currentModalTotalQuestions} Questions)` : `Publish Assessment (${currentModalTotalQuestions} Questions)`}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingAssessment}
        onClose={() => setDeletingAssessment(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Assessment"
        message={`Are you sure you want to delete "${deletingAssessment?.title}"?`}
        confirmText="Delete Assessment"
      />
    </div>
  );
}
