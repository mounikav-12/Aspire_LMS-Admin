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
    quizzes,
    courses,
    courseLessons,
    milestones,
    milestonesByBatch,
    addAssessment,
    updateAssessment,
    deleteAssessment,
    addQuiz,
    updateQuiz,
    deleteQuiz,
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

  const [selectedBatch, setSelectedBatch] = useState(activeBatchFilter || 'Weekday Batch');

  const handleSelectBatch = (bVal) => {
    setSelectedBatch(bVal);
    if (setActiveBatchFilter) setActiveBatchFilter(bVal);
  };

  const [activeMainTab, setActiveMainTab] = useState('ASSESSMENTS'); // 'ASSESSMENTS' | 'QUIZZES'
  const [activeStatusFilter, setActiveStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'COMPLETED'
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [deletingAssessment, setDeletingAssessment] = useState(null);

  // Form state for creating/editing assessment
  const [formData, setFormData] = useState({
    title: '',
    evalType: 'assessment', // 'assessment' | 'quiz'
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
        mcqType: 'theoretical',
        question: '',
        codeSnippet: '',
        options: ['', '', '', ''],
        correctIndex: 0
      }
    ],
    codingQuestions: [
      {
        title: '',
        problemStatement: ''
      }
    ]
  });

  // Batch Selection State for Modal
  const [batchActiveTab, setBatchActiveTab] = useState('Weekdays');
  const [selectedWeekdayBatches, setSelectedWeekdayBatches] = useState(allWeekdayBatchesList);
  const [selectedWeekendBatches, setSelectedWeekendBatches] = useState(allWeekendBatchesList);

  const selectedCourseObj = courses.find((c) => c.id === formData.courseId) || courses[0];
  const stagesList =
    formData.courseId && formData.courseId !== 'ALL' && milestonesByBatch?.[formData.courseId]?.stages && milestonesByBatch[formData.courseId].stages.length > 0
      ? milestonesByBatch[formData.courseId].stages
      : selectedCourseObj?.topics && selectedCourseObj.topics.length > 0
      ? selectedCourseObj.topics
      : milestones?.stages && milestones.stages.length > 0
      ? milestones.stages
      : DEFAULT_STAGES;

  const handleOpenAddModal = () => {
    const firstStage = stagesList[0];
    const stageSubs = getSubtopicsForStage(firstStage);
    const firstSub = stageSubs[0];
    const subLessons = getInnerModulesForSubtopic(firstSub, courseLessons, firstStage?.id);
    const firstMod = subLessons[0];

    setBatchActiveTab('Weekdays');
    setSelectedWeekdayBatches(allWeekdayBatchesList);
    setSelectedWeekendBatches(allWeekendBatchesList);
    setFormData({
      title: '',
      evalType: activeMainTab === 'QUIZZES' ? 'quiz' : 'assessment',
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
          mcqType: 'theoretical',
          question: '',
          codeSnippet: '',
          options: ['', '', '', ''],
          correctIndex: 0
        }
      ],
      codingQuestions: [
        {
          title: '',
          problemStatement: ''
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
          mcqType: m.mcqType || (m.codeSnippet ? 'coding' : 'theoretical'),
          question: m.question || '',
          codeSnippet: m.codeSnippet || '',
          options: Array.isArray(m.options) ? [...m.options] : ['Option A', 'Option B', 'Option C', 'Option D'],
          correctIndex: m.correctIndex !== undefined ? m.correctIndex : 0
        }))
      : [
          {
            mcqType: 'theoretical',
            question: '',
            codeSnippet: '',
            options: ['', '', '', ''],
            correctIndex: 0
          }
        ];

    const initialCoding = Array.isArray(asm.codingQuestions) && asm.codingQuestions.length > 0
      ? asm.codingQuestions.map((c) => ({
          title: c.title || '',
          problemStatement: c.problemStatement || c.instructions || ''
        }))
      : [
          {
            title: '',
            problemStatement: ''
          }
        ];

    const targetStage = stagesList.find((s) => s.id === asm.stageId || s.title === asm.stageName || s.title === asm.moduleName) || stagesList[0];
    const stageSubs = getSubtopicsForStage(targetStage);
    const targetSub = stageSubs.find((st) => st.id === asm.subtopicId || st.title === asm.subtopicName) || stageSubs[0];
    const subLessons = getInnerModulesForSubtopic(targetSub, courseLessons, targetStage?.id);
    const targetMod = subLessons.find((m) => (m.id || m.title) === (asm.innerTopicId || asm.moduleId || asm.topicName)) || subLessons[0];

    const detectedEvalType = asm.evalType || (asm.category?.toLowerCase().includes('quiz') || asm.title?.toLowerCase().includes('quiz') ? 'quiz' : 'assessment');

    setFormData({
      title: asm.title,
      evalType: detectedEvalType,
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
      mcqs: initialMcqs,
      codingQuestions: initialCoding
    });
  };

  // MCQ Question Array Handlers
  const handleAddMcq = (type = 'theoretical') => {
    setFormData((prev) => ({
      ...prev,
      mcqs: [
        ...prev.mcqs,
        {
          mcqType: typeof type === 'string' ? type : 'theoretical',
          question: '',
          codeSnippet: '',
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

  const handleUpdateMcqType = (mcqIndex, value) => {
    setFormData((prev) => {
      const updated = [...prev.mcqs];
      updated[mcqIndex] = { ...updated[mcqIndex], mcqType: value };
      return { ...prev, mcqs: updated };
    });
  };

  const handleUpdateMcqCodeSnippet = (mcqIndex, value) => {
    setFormData((prev) => {
      const updated = [...prev.mcqs];
      updated[mcqIndex] = { ...updated[mcqIndex], codeSnippet: value };
      return { ...prev, mcqs: updated };
    });
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

  // Coding Question Array Handlers
  const handleAddCoding = () => {
    setFormData((prev) => ({
      ...prev,
      codingQuestions: [
        ...(prev.codingQuestions || []),
        { title: '', description: '' }
      ]
    }));
  };

  const handleRemoveCoding = (index) => {
    setFormData((prev) => ({
      ...prev,
      codingQuestions: (prev.codingQuestions || []).filter((_, i) => i !== index)
    }));
  };

  const handleUpdateCodingTitle = (index, value) => {
    setFormData((prev) => {
      const updated = [...(prev.codingQuestions || [])];
      updated[index] = { ...updated[index], title: value };
      return { ...prev, codingQuestions: updated };
    });
  };

  const handleUpdateCodingDesc = (index, value) => {
    setFormData((prev) => {
      const updated = [...(prev.codingQuestions || [])];
      updated[index] = { ...updated[index], description: value, problemStatement: value };
      return { ...prev, codingQuestions: updated };
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
    const subLessons = getInnerModulesForSubtopic(currentSubObj, courseLessons, currentStageObj?.id);
    const currentModObj = subLessons.find((m) => (m.id || m.title) === (formData.innerTopicId || formData.moduleId || formData.topicName)) || subLessons[0];

    const isQuizEval = (formData.evalType || 'assessment') === 'quiz';
    const totalMcqsCount = formData.mcqs.length;
    const totalCodingCount = isQuizEval ? 0 : (formData.codingQuestions?.length || 0);
    const totalQuestionsCount = totalMcqsCount + totalCodingCount;

    const allBatches = [...selectedWeekdayBatches, ...selectedWeekendBatches];
    const targetBatchStr = allBatches.length > 0 ? allBatches.join(', ') : 'All Batches';

    const assessmentPayload = {
      title: formData.title,
      evalType: formData.evalType || 'assessment',
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
      codingQuestions: isQuizEval ? [] : formData.codingQuestions,
      targetBatches: allBatches,
      targetBatch: targetBatchStr
    };

    const isQuizTarget = isQuizEval || activeMainTab === 'QUIZZES';

    if (editingAssessment) {
      if (isQuizTarget) {
        updateQuiz(editingAssessment.id, { ...assessmentPayload, evalType: 'quiz' });
        addToast(`Updated quiz "${formData.title}" (${totalQuestionsCount} MCQs)`, 'success');
      } else {
        updateAssessment(editingAssessment.id, assessmentPayload);
        addToast(`Updated assessment "${formData.title}" (${totalQuestionsCount} MCQs)`, 'success');
      }
      setEditingAssessment(null);
    } else {
      if (isQuizTarget) {
        addQuiz({ ...assessmentPayload, evalType: 'quiz' });
        addToast(`Published quiz "${formData.title}" (${totalQuestionsCount} MCQs) to quizzes table!`, 'success');
      } else {
        addAssessment(assessmentPayload);
        addToast(`Published assessment "${formData.title}" (${totalQuestionsCount} MCQs) & linked to Milestone!`, 'success');
      }
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingAssessment) {
      const isQuizItem = deletingAssessment.evalType === 'quiz' || activeMainTab === 'QUIZZES';
      if (isQuizItem) {
        deleteQuiz(deletingAssessment.id);
        addToast(`Deleted quiz "${deletingAssessment.title}"`, 'info');
      } else {
        deleteAssessment(deletingAssessment.id);
        addToast(`Deleted assessment "${deletingAssessment.title}"`, 'info');
      }
      setDeletingAssessment(null);
    }
  };

  const currentTabItems = activeMainTab === 'QUIZZES' ? (quizzes || []) : (assessments || []);

  const filteredAssessments = [...currentTabItems]
    .filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.subtopicName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse = courseFilter === 'ALL' || a.courseId === courseFilter;

      let matchesStatus = true;
      if (activeStatusFilter === 'PUBLISHED') {
        matchesStatus = a.status === 'Published' || !a.status || a.status === 'Completed';
      } else if (activeStatusFilter === 'DRAFT') {
        matchesStatus = a.status === 'Draft' || a.status === 'Pending';
      }

      return matchesSearch && matchesCourse && matchesStatus;
    })
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (a.created_at ? new Date(a.created_at).getTime() : 0);
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (b.created_at ? new Date(b.created_at).getTime() : 0);
      if (timeA && timeB) return timeA - timeB;
      return 0;
    });

  // Calculate Aggregate Metrics
  const totalQuestionsAllAssessments = assessments.reduce(
    (acc, a) => acc + (a.mcqs?.length || a.mcqCount || a.totalQuestions || 0),
    0
  );

  const currentModalTheoryCount = (formData.mcqs || []).filter(m => m.mcqType !== 'coding').length;
  const currentModalCodingMcqCount = (formData.mcqs || []).filter(m => m.mcqType === 'coding').length;
  const currentModalTotalQuestions = (formData.mcqs || []).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-normal text-slate-900 flex items-center gap-2.5">
            <FileCheck2 className="w-6 h-6 text-purple-600" /> Practice Hub & Evaluations
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Topic-based practice assessments, tests, and module quizzes for enrolled students.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <NavLink to="/coding-questions">
            <Button variant="outline" size="md" icon={Code2} className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-bold">
              Coding Bank
            </Button>
          </NavLink>
          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAddModal}>
            {activeMainTab === 'QUIZZES' ? 'Create Quiz' : 'Create Assessment'}
          </Button>
        </div>
      </div>

      {/* Primary Category Switcher & Secondary Status Filters */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Top Primary Tabs: Assessments vs Quizzes */}
          <div className="bg-slate-100/90 p-1.5 rounded-2xl inline-flex items-center gap-1.5 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setActiveMainTab('ASSESSMENTS');
                setActiveStatusFilter('ALL');
              }}
              className={`px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                activeMainTab === 'ASSESSMENTS'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25 font-extrabold'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-white/60 font-bold'
              }`}
            >
              Assessments
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMainTab('QUIZZES');
                setActiveStatusFilter('ALL');
              }}
              className={`px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                activeMainTab === 'QUIZZES'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25 font-extrabold'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-white/60 font-bold'
              }`}
            >
              Quizzes
            </button>
          </div>

          {/* Secondary Sub-Filter Pills: All / Published / Drafts */}
          <div className="bg-slate-100/80 p-1 rounded-2xl inline-flex items-center gap-1 border border-slate-200/60">
            <button
              type="button"
              onClick={() => setActiveStatusFilter('ALL')}
              className={`px-4 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                activeStatusFilter === 'ALL'
                  ? 'bg-white text-purple-950 font-extrabold shadow-2xs border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800 font-semibold'
              }`}
            >
              {activeMainTab === 'QUIZZES' ? 'All Quizzes' : 'All Assessments'}
            </button>
            <button
              type="button"
              onClick={() => setActiveStatusFilter('PUBLISHED')}
              className={`px-4 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                activeStatusFilter === 'PUBLISHED'
                  ? 'bg-white text-purple-950 font-extrabold shadow-2xs border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800 font-semibold'
              }`}
            >
              Published
            </button>
            <button
              type="button"
              onClick={() => setActiveStatusFilter('DRAFT')}
              className={`px-4 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                activeStatusFilter === 'DRAFT'
                  ? 'bg-white text-purple-950 font-extrabold shadow-2xs border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800 font-semibold'
              }`}
            >
              Drafts
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeMainTab === 'QUIZZES' ? 'quizzes' : 'assessments'} by title, topic, course name...`}
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

      {/* Assessment / Quiz Cards */}
      {filteredAssessments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAssessments.map((asm) => {
            const mcqCount = asm.mcqs?.length || asm.mcqCount || 0;
            const codingCount = asm.codingQuestions?.length || asm.codingCount || 0;
            const totalQ = asm.totalQuestions || mcqCount + codingCount;
            const isQuizItem = asm.evalType === 'quiz' || asm.category?.toLowerCase().includes('quiz') || asm.title?.toLowerCase().includes('quiz');
            const typeBadgeLabel = isQuizItem ? 'MODULE QUIZ' : codingCount > 0 ? 'CODING ASSESSMENT' : 'MCQ ASSESSMENT';

            return (
              <div
                key={asm.id}
                className="group bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-300 transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col justify-between h-full"
              >
                <div className="space-y-4">
                  {/* Card Header: Badges on Left, Action Icons on Right */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      {/* Type Badge */}
                      <span className="bg-purple-100/90 text-purple-700 font-extrabold text-[11px] px-3 py-1 rounded-xl tracking-wide uppercase border border-purple-200/60 flex-shrink-0">
                        {typeBadgeLabel}
                      </span>

                      {/* Topic Tag */}
                      {(asm.subtopicName || asm.topicName || asm.moduleName) && (
                        <span className="bg-slate-100 text-slate-700 font-bold text-[11px] px-3 py-1 rounded-xl border border-slate-200/70 truncate max-w-[200px]">
                          {asm.subtopicName || asm.topicName || asm.moduleName}
                        </span>
                      )}

                      {/* Course Tag */}
                      {asm.courseName && (
                        <span className="bg-blue-50 text-blue-700 font-bold text-[11px] px-2.5 py-1 rounded-xl border border-blue-200/60 truncate max-w-[180px]">
                          {asm.courseName}
                        </span>
                      )}
                    </div>

                    {/* Edit & Delete Action Buttons */}
                    <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/60 flex-shrink-0">
                      <button
                        onClick={() => handleOpenEditModal(asm)}
                        className="p-1.5 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                        title="Edit Evaluation"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingAssessment(asm)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                        title="Delete Evaluation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5 pt-1">
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-purple-600 transition-colors leading-snug">
                      {asm.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                      Test your understanding of {asm.subtopicName || asm.topicName || asm.title} concepts.
                    </p>
                  </div>

                  {/* Clean Horizontal Metric Strip */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="bg-slate-100/90 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-200/60 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-600" /> {asm.durationMinutes || 45} mins
                    </span>

                    <span className="bg-amber-50 text-amber-700 font-extrabold text-xs px-3 py-1.5 rounded-xl border border-amber-200/80 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" /> +{asm.totalMarks || 100} XP
                    </span>

                    <span className="bg-purple-50 text-purple-700 font-bold text-xs px-3 py-1.5 rounded-xl border border-purple-100 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-purple-600" /> {mcqCount} MCQ{mcqCount !== 1 ? 's' : ''}
                      {!isQuizItem && codingCount > 0 && ` • ${codingCount} Coding`}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  {(() => {
                    const statusVal = asm.status || asm.publishStatus || '';
                    const isPublished = statusVal === 'Published' || statusVal === 'Active' || statusVal === 'Live Published';
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold border text-[11px] ${
                        isPublished
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                          : statusVal === 'Draft' || statusVal === 'Pending'
                          ? 'bg-slate-100 text-slate-600 border-slate-200/70'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {statusVal || 'Published'}
                      </span>
                    );
                  })()}

                  <button
                    onClick={() => handleOpenEditModal(asm)}
                    className="inline-flex items-center gap-1 font-extrabold text-purple-600 hover:text-purple-800 transition-all group-hover:translate-x-1 cursor-pointer"
                  >
                    <span>View {isQuizItem ? 'Quiz' : 'Assessment'} Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title={activeMainTab === 'QUIZZES' ? 'No Quizzes Found' : 'No Assessments Found'}
          description={activeMainTab === 'QUIZZES' ? 'Create your first topic module practice quiz.' : 'Create your first practice assessment evaluation.'}
          actionLabel={activeMainTab === 'QUIZZES' ? 'Add Quiz' : 'Add Assessment'}
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
        title={
          editingAssessment
            ? `Edit ${editingAssessment.evalType === 'quiz' ? 'Quiz' : 'Assessment'} & Questions`
            : `Create ${activeMainTab === 'QUIZZES' ? 'Quiz' : 'Assessment'}`
        }
        subtitle="Configure parameters, MCQ questions, and coding task prompts"
        maxWidth="max-w-6xl"
      >
        <form onSubmit={handleSaveAssessment} className="space-y-4">
          {/* Title, Type & Assessment Capacity Header Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 items-end">
            <div className="md:col-span-2">
              <Input
                label="Evaluation Title"
                placeholder="e.g. Git Architecture & Version Control Assessment"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Select
                label="Evaluation Type"
                value={formData.evalType || 'assessment'}
                onChange={(e) => setFormData({ ...formData, evalType: e.target.value })}
                options={[
                  { value: 'assessment', label: 'Practice Assessment' },
                  { value: 'quiz', label: 'Module Quiz' }
                ]}
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
                  {currentModalTheoryCount} Theory MCQs
                </span>
                {currentModalCodingMcqCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-200 font-semibold border border-emerald-500/30">
                    {currentModalCodingMcqCount} Coding MCQs
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 4-TIER CASCADING HIERARCHY SELECTOR (2x2 Grid) */}
          {(() => {
            const currentStageObj = stagesList.find((s) => s.id === formData.stageId || s.title === formData.stageName) || stagesList[0];
            const currentSubtopicsArr = getSubtopicsForStage(currentStageObj);
            const currentSubtopicObj = currentSubtopicsArr.find((st) => st.id === formData.subtopicId || st.title === formData.subtopicName) || currentSubtopicsArr[0];
            const currentInnerModules = getInnerModulesForSubtopic(currentSubtopicObj, courseLessons, currentStageObj?.id);
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
                        const newStages =
                          newCourseId && newCourseId !== 'ALL' && milestonesByBatch?.[newCourseId]?.stages && milestonesByBatch[newCourseId].stages.length > 0
                            ? milestonesByBatch[newCourseId].stages
                            : selectedC?.topics && selectedC.topics.length > 0
                            ? selectedC.topics
                            : milestones?.stages && milestones.stages.length > 0
                            ? milestones.stages
                            : DEFAULT_STAGES;
                        const firstStage = newStages[0];
                        const firstSubs = getSubtopicsForStage(firstStage);
                        const firstSub = firstSubs[0];
                        const firstLessons = getInnerModulesForSubtopic(firstSub, courseLessons, firstStage?.id);
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
                        const firstLessons = getInnerModulesForSubtopic(firstSub, courseLessons, newStage?.id);
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
                        const targetLessons = getInnerModulesForSubtopic(targetSub, courseLessons, formData.stageId);
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600" /> Multiple Choice Questions ({formData.mcqs.length})
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">Add theoretical or coding code-snippet MCQs with 4 choices and select the correct answer</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Plus}
                  onClick={() => handleAddMcq('theoretical')}
                  className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                >
                  Add Theoretical MCQ
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Code2}
                  onClick={() => handleAddMcq('coding')}
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  Add Coding MCQ
                </Button>
              </div>
            </div>

            {formData.mcqs.map((mcq, mIndex) => {
              const isCodingMcq = mcq.mcqType === 'coding';
              return (
                <div key={mIndex} className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-3.5 relative group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold text-xs">
                        MCQ #{mIndex + 1}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-md font-extrabold text-[11px] border ${isCodingMcq ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {isCodingMcq ? '💻 Coding MCQ' : '📖 Theoretical MCQ'}
                      </span>
                    </div>

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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-1">
                      <Select
                        label="MCQ Category / Format"
                        value={mcq.mcqType || 'theoretical'}
                        onChange={(e) => handleUpdateMcqType(mIndex, e.target.value)}
                        options={[
                          { value: 'theoretical', label: '📖 Theoretical MCQ' },
                          { value: 'coding', label: '💻 Coding MCQ (Code Snippet)' }
                        ]}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        label="Question Prompt"
                        placeholder={isCodingMcq ? "e.g. What will be the output of the code snippet below?" : "e.g. Which Git command initializes a repository?"}
                        value={mcq.question}
                        onChange={(e) => handleUpdateMcqQuestion(mIndex, e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Code Snippet Box for Coding MCQs */}
                  {isCodingMcq && (
                    <div className="flex flex-col gap-1.5 pt-1">
                      <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-emerald-600" /> Code Snippet / Problem Code Box
                      </label>
                      <textarea
                        rows={4}
                        placeholder={`# Write or paste your problem code snippet here\ndef calculate_total(a, b):\n    return a + b\n\nprint(calculate_total(10, 20))`}
                        value={mcq.codeSnippet || ''}
                        onChange={(e) => handleUpdateMcqCodeSnippet(mIndex, e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-900 text-emerald-400 font-mono text-xs border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
                      />
                    </div>
                  )}

                  {/* 4 Options Grid */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                      Answer Choices (Options)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                  </div>

                  <Select
                    label="Correct Option (Mark Correct Answer)"
                    value={mcq.correctIndex}
                    onChange={(e) => handleUpdateMcqCorrectIndex(mIndex, e.target.value)}
                    options={mcq.options.map((opt, idx) => ({
                      value: idx,
                      label: `Option ${idx + 1}: ${opt || `Choice ${idx + 1}`}`
                    }))}
                  />
                </div>
              );
            })}
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
