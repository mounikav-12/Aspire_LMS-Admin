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
  Square
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
    stageId: '',
    subtopicId: '',
    innerTopicId: '',
    durationMinutes: 45,
    totalMarks: 100,
    dueDate: '2026-08-15',
    mcqs: [
      {
        question: 'Which React hook should be used to memoize expensive calculation values?',
        options: ['useCallback', 'useMemo', 'useEffect', 'useRef'],
        correctIndex: 1
      }
    ],
    codingQuestions: [
      {
        title: 'Custom `useLocalStorage` Hook Implementation',
        description: 'Write a React custom hook named `useLocalStorage` that syncs state updates to window.localStorage with error handling.'
      }
    ]
  });

  // Batch Selection State for Modal
  const [batchActiveTab, setBatchActiveTab] = useState('Weekdays');
  const [selectedWeekdayBatches, setSelectedWeekdayBatches] = useState(allWeekdayBatchesList);
  const [selectedWeekendBatches, setSelectedWeekendBatches] = useState(allWeekendBatchesList);

  const initialCourseId = courses[0]?.id || '';
  const selectedCourseObj = courses.find((c) => c.id === initialCourseId) || courses[0];
  const stagesList = (selectedCourseObj?.topics && selectedCourseObj.topics.length > 0)
    ? selectedCourseObj.topics
    : [
        {
          id: 'stage-1',
          title: 'Stage 1: Front End + Repository',
          subtopics: [
            { id: 'git-github', title: 'Git & GitHub Version Control' },
            { id: 'html5', title: 'HTML5 & Semantic Structure' },
            { id: 'css3-basics', title: 'CSS3 Fundamentals & Layouts' },
            { id: 'js-essentials', title: 'JavaScript Essentials' }
          ]
        },
        {
          id: 'stage-2',
          title: 'Stage 2: Backend + DSA',
          subtopics: [
            { id: 'nodejs', title: 'Node.js & Express API' },
            { id: 'postgres', title: 'PostgreSQL & Database Design' },
            { id: 'dsa-arrays', title: 'DSA: Arrays & Strings' },
            { id: 'dsa-trees', title: 'DSA: Trees & Graphs' }
          ]
        },
        {
          id: 'stage-3',
          title: 'Stage 3: AI',
          subtopics: [
            { id: 'ml-foundations', title: 'Machine Learning Foundations' },
            { id: 'deep-learning', title: 'Deep Learning & Neural Networks' },
            { id: 'generative-ai', title: 'Generative AI & LLMs' }
          ]
        },
        {
          id: 'stage-4',
          title: 'Stage 4: Career Launchpad',
          subtopics: [
            { id: 'resume-building', title: 'Resume Building & Portfolio' },
            { id: 'mock-interviews', title: 'Mock Interviews & Grooming' }
          ]
        }
      ];

  React.useEffect(() => {
    if (courses && courses.length > 0 && !formData.stageId) {
      const activeCourse = courses.find((c) => c.id === formData.courseId) || courses[0];
      const activeStage = activeCourse?.topics?.[0] || stagesList[0];
      const activeSub = activeStage?.subtopics?.[0];
      const activeInner = courseLessons?.find(
        (l) => l.course_id === activeCourse?.id && l.stage_id === activeStage?.id && l.module_id === activeSub?.id
      );
      setFormData((prev) => ({
        ...prev,
        courseId: prev.courseId || activeCourse?.id || '',
        stageId: prev.stageId || activeStage?.id || '',
        subtopicId: prev.subtopicId || activeSub?.id || '',
        innerTopicId: prev.innerTopicId || activeInner?.id || ''
      }));
    }
  }, [courses, formData.courseId]);

  const handleOpenAddModal = () => {
    const activeCourse = courses.find((c) => c.id === (courses[0]?.id || '')) || courses[0];
    const activeStage = activeCourse?.topics?.[0] || stagesList[0];
    const activeSub = activeStage?.subtopics?.[0];
    const activeInner = courseLessons?.find(
      (l) => l.course_id === activeCourse?.id && l.stage_id === activeStage?.id && l.module_id === activeSub?.id
    );

    setBatchActiveTab('Weekdays');
    setSelectedWeekdayBatches(allWeekdayBatchesList);
    setSelectedWeekendBatches(allWeekendBatchesList);
    setFormData({
      title: '',
      evalType: activeMainTab === 'QUIZZES' ? 'quiz' : 'assessment',
      courseId: activeCourse?.id || '',
      stageId: activeStage?.id || '',
      subtopicId: activeSub?.id || '',
      innerTopicId: activeInner?.id || '',
      durationMinutes: 45,
      totalMarks: 100,
      dueDate: '2026-08-15',
      mcqs: [
        {
          question: 'Which React hook should be used to memoize expensive calculation values?',
          options: ['useCallback', 'useMemo', 'useEffect', 'useRef'],
          correctIndex: 1
        }
      ],
      codingQuestions: [
        {
          title: 'Custom `useLocalStorage` Hook Implementation',
          description: 'Write a React custom hook named `useLocalStorage` that syncs state updates to window.localStorage with error handling.'
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
            question: 'Which React hook handles side effects?',
            options: ['useState', 'useEffect', 'useMemo', 'useContext'],
            correctIndex: 1
          }
        ];

    const initialCoding = asm.codingQuestions && asm.codingQuestions.length > 0
      ? asm.codingQuestions.map((c) => ({
          title: c.title || '',
          description: c.description || ''
        }))
      : [
          {
            title: 'Implement Custom Debounce Function',
            description: 'Write a TypeScript debounce helper function with generic parameters.'
          }
        ];

    const foundStage = stagesList.find((s) => s.id === asm.stageId || s.title === asm.moduleName) || stagesList[0];
    const subtopicsOfStage = foundStage?.subtopics || [];
    const foundSubtopic = subtopicsOfStage.find((st) => st.id === asm.subtopicId || st.title === asm.subtopicName || st.title === asm.topicName) || subtopicsOfStage[0];
    const innerModulesOfSubtopic = (foundSubtopic && Array.isArray(foundSubtopic.modules) && foundSubtopic.modules.length > 0)
      ? foundSubtopic.modules
      : [{ id: foundSubtopic?.id || 'all', title: foundSubtopic?.title || 'General Overview' }];
    const foundInnerTopic = innerModulesOfSubtopic.find((m) => m.id === asm.innerTopicId || m.title === asm.topicName) || innerModulesOfSubtopic[0];

    const detectedEvalType = asm.evalType || (asm.category?.toLowerCase().includes('quiz') || asm.title?.toLowerCase().includes('quiz') ? 'quiz' : 'assessment');

    setFormData({
      title: asm.title,
      evalType: detectedEvalType,
      courseId: asm.courseId || courses[0]?.id || '',
      stageId: foundStage?.id || 'stage-1',
      subtopicId: foundSubtopic?.id || 'git-github',
      innerTopicId: foundInnerTopic?.id || foundSubtopic?.id || '',
      durationMinutes: asm.durationMinutes || 45,
      totalMarks: asm.totalMarks || 100,
      dueDate: asm.dueDate || '2026-08-15',
      mcqs: initialMcqs,
      codingQuestions: initialCoding
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

  // Coding Challenge Array Handlers
  const handleAddCoding = () => {
    setFormData((prev) => ({
      ...prev,
      codingQuestions: [
        ...prev.codingQuestions,
        {
          title: '',
          description: ''
        }
      ]
    }));
  };

  const handleRemoveCoding = (index) => {
    setFormData((prev) => ({
      ...prev,
      codingQuestions: prev.codingQuestions.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateCodingTitle = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.codingQuestions];
      updated[index] = { ...updated[index], title: value };
      return { ...prev, codingQuestions: updated };
    });
  };

  const handleUpdateCodingDesc = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.codingQuestions];
      updated[index] = { ...updated[index], description: value };
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
    const selectedStage = stagesList.find((s) => s.id === formData.stageId) || stagesList[0];
    const subtopicsOfStage = selectedStage?.subtopics || [];
    const selectedSubtopic = subtopicsOfStage.find((st) => st.id === formData.subtopicId) || subtopicsOfStage[0];
    
    // Resolve innerList from live course lessons
    const innerList = courseLessons?.filter(
      (l) =>
        l.course_id === formData.courseId &&
        l.stage_id === formData.stageId &&
        l.module_id === formData.subtopicId
    ) || [];
    
    // Find matching lesson
    const selectedInnerTopic = innerList.find((m) => m.id === formData.innerTopicId);

    const isQuizEval = (formData.evalType || 'assessment') === 'quiz';
    const totalMcqsCount = formData.mcqs.length;
    const totalCodingCount = isQuizEval ? 0 : formData.codingQuestions.length;
    const totalQuestionsCount = totalMcqsCount + totalCodingCount;

    const allBatches = [...selectedWeekdayBatches, ...selectedWeekendBatches];
    const targetBatchStr = allBatches.length > 0 ? allBatches.join(', ') : 'All Batches';

    const assessmentPayload = {
      title: formData.title,
      evalType: formData.evalType || 'assessment',
      courseId: selectedCourse?.id,
      courseName: selectedCourse?.title,
      stageId: selectedStage?.id,
      moduleName: selectedStage?.title,
      subtopicId: selectedSubtopic?.id,
      subtopicName: selectedSubtopic?.title,
      innerTopicId: selectedInnerTopic?.id,
      topicName: selectedInnerTopic?.title || selectedSubtopic?.title,
      durationMinutes: parseInt(formData.durationMinutes) || 45,
      totalMarks: parseInt(formData.totalMarks) || 100,
      dueDate: formData.dueDate,
      mcqCount: totalMcqsCount,
      codingCount: totalCodingCount,
      totalQuestions: totalQuestionsCount,
      mcqs: formData.mcqs,
      codingQuestions: isQuizEval ? [] : formData.codingQuestions,
      targetBatches: allBatches,
      targetBatch: targetBatchStr
    };

    if (editingAssessment) {
      updateAssessment(editingAssessment.id, assessmentPayload);
      addToast(`Updated assessment "${formData.title}" (${totalQuestionsCount} Questions)`, 'success');
      setEditingAssessment(null);
    } else {
      addAssessment(assessmentPayload);
      addToast(`Published assessment "${formData.title}" (${totalQuestionsCount} Questions)!`, 'success');
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

  const filteredAssessments = assessments.filter((a) => {
    const isQuiz = a.evalType === 'quiz' || a.category?.toLowerCase().includes('quiz') || a.title?.toLowerCase().includes('quiz');
    const matchesMainTab = activeMainTab === 'QUIZZES' ? isQuiz : !isQuiz;

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

    return matchesMainTab && matchesSearch && matchesCourse && matchesStatus;
  });

  // Calculate Aggregate Metrics
  const totalQuestionsAllAssessments = assessments.reduce(
    (acc, a) => acc + (a.totalQuestions || (a.mcqs?.length || a.mcqCount || 0) + (a.codingQuestions?.length || a.codingCount || 0)),
    0
  );

  const currentModalMcqCount = formData.mcqs.length;
  const currentModalCodingCount = formData.codingQuestions.length;
  const currentModalTotalQuestions = currentModalMcqCount + currentModalCodingCount;

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
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/70 text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Live Published
                  </span>

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
                <span className="px-2 py-0.5 rounded-lg bg-white/10 text-blue-100 font-semibold border border-white/15">
                  {currentModalMcqCount} MCQs
                </span>
                {formData.evalType !== 'quiz' && (
                  <span className="px-2 py-0.5 rounded-lg bg-white/10 text-blue-100 font-semibold border border-white/15">
                    {currentModalCodingCount} Coding
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 4-TIER CASCADING HIERARCHY SELECTOR (2x2 Grid) */}
          {(() => {
            const currentStageObj = stagesList.find((s) => s.id === formData.stageId) || stagesList[0];
            const currentSubtopicsArr = currentStageObj?.subtopics || [];
            const currentSubtopicObj = currentSubtopicsArr.find((st) => st.id === formData.subtopicId) || currentSubtopicsArr[0];
            const currentInnerModules = courseLessons?.filter(
              (l) =>
                l.course_id === formData.courseId &&
                l.stage_id === formData.stageId &&
                l.module_id === formData.subtopicId
            ) || [];

            return (
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-purple-100/80">
                  <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Curriculum Location & Milestone Topic Mapping
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Map this assessment evaluation to a specific course, milestone stage, subtopic, and topic module
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
                      onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                      options={courses.map((c) => ({ value: c.id, label: c.title }))}
                    />
                  </div>

                  {/* Step 2: Course Module / Stage */}
                  <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-purple-100/90 shadow-2xs">
                    <Select
                      label="2. Course Module / Stage"
                      value={formData.stageId}
                      onChange={(e) => {
                        const newStageId = e.target.value;
                        const newStage = stagesList.find((s) => s.id === newStageId) || stagesList[0];
                        const firstSub = newStage?.subtopics?.[0];
                        const firstInner = firstSub?.modules?.[0];
                        setFormData({
                          ...formData,
                          stageId: newStageId,
                          subtopicId: firstSub?.id || '',
                          innerTopicId: firstInner?.id || firstSub?.id || ''
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
                      value={formData.subtopicId}
                      onChange={(e) => {
                        const newSubId = e.target.value;
                        const targetStage = stagesList.find((s) => s.id === formData.stageId) || stagesList[0];
                        const targetSub = targetStage?.subtopics?.find((st) => st.id === newSubId) || targetStage?.subtopics?.[0];
                        const firstInner = targetSub?.modules?.[0];
                        setFormData({
                          ...formData,
                          subtopicId: newSubId,
                          innerTopicId: firstInner?.id || targetSub?.id || ''
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
                      value={formData.innerTopicId}
                      onChange={(e) => setFormData({ ...formData, innerTopicId: e.target.value })}
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

          {/* DYNAMIC CODING CHALLENGE BUILDER SECTION (ONLY FOR ASSESSMENTS) */}
          {formData.evalType !== 'quiz' && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-emerald-600" /> Coding Challenges ({formData.codingQuestions.length})
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">Add hands-on coding challenge titles and instructions for students</p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Plus}
                  onClick={handleAddCoding}
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  Add Coding Challenge
                </Button>
              </div>

              {formData.codingQuestions.map((coding, cIndex) => (
                <div key={cIndex} className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs">
                      Coding Task #{cIndex + 1}
                    </span>
                    {formData.codingQuestions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCoding(cIndex)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove Challenge"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <Input
                    label="Coding Question Title"
                    placeholder="e.g. Custom `useLocalStorage` Hook Implementation"
                    value={coding.title}
                    onChange={(e) => handleUpdateCodingTitle(cIndex, e.target.value)}
                    required
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                      Coding Description / Prompt Instructions
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Write a custom React hook named `useLocalStorage` that syncs state to window.localStorage..."
                      value={coding.description}
                      onChange={(e) => handleUpdateCodingDesc(cIndex, e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

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
