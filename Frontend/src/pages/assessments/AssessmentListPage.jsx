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
    milestones,
    addAssessment,
    updateAssessment,
    deleteAssessment,
    activeBatchFilter,
    setActiveBatchFilter,
    availableBatches
  } = useLmsData();
  const { addToast } = useToast();

  const stagesList = (milestones && milestones.stages && milestones.stages.length > 0)
    ? milestones.stages
    : [
        {
          id: 'stage-1',
          title: 'Stage 1: Front End + Repository',
          subtopics: [
            { id: 'git-github', title: 'Git & GitHub Version Control' },
            { id: 'html5', title: 'HTML5 & Semantic Structure' },
            { id: 'css3', title: 'CSS3 & Responsive Layouts' },
            { id: 'javascript-es6', title: 'JavaScript Fundamentals & ES6+' },
            { id: 'reactjs', title: 'React.js Components & Hooks' }
          ]
        },
        {
          id: 'stage-2',
          title: 'Stage 2: Backend + DSA',
          subtopics: [
            { id: 'python-core', title: 'Python Syntax, OOP & Standard Library' },
            { id: 'express-django', title: 'REST API Design with Express & Django' },
            { id: 'postgresql', title: 'PostgreSQL Database & Relational Schemas' },
            { id: 'dsa-core', title: 'Data Structures & Algorithms (Trees, Graphs, DP)' }
          ]
        },
        {
          id: 'stage-3',
          title: 'Stage 3: AI & Cloud Integration',
          subtopics: [
            { id: 'ai-prompting', title: 'AI Model Integration & OpenAI APIs' },
            { id: 'docker-cloud', title: 'Docker, Containers & Cloud Deployment' }
          ]
        },
        {
          id: 'stage-4',
          title: 'Stage 4: Career Launchpad',
          subtopics: [
            { id: 'capstone-proj', title: 'Capstone Enterprise Full-Stack Deployment' },
            { id: 'mock-interview', title: 'System Design & Technical Mock Interviews' }
          ]
        }
      ];

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

  // Batch Selection State for Modal
  const [batchActiveTab, setBatchActiveTab] = useState('Weekdays');
  const [selectedWeekdayBatches, setSelectedWeekdayBatches] = useState(allWeekdayBatchesList);
  const [selectedWeekendBatches, setSelectedWeekendBatches] = useState(allWeekendBatchesList);

  // Form State with Dynamic Questions Array & 4-Tier Milestone Cascading Hierarchy
  const firstStage = stagesList[0];
  const firstSubtopic = firstStage?.subtopics?.[0];
  const firstInner = firstSubtopic?.modules?.[0];

  const [formData, setFormData] = useState({
    title: '',
    courseId: courses[0]?.id || '',
    stageId: firstStage?.id || 'stage-1',
    subtopicId: firstSubtopic?.id || 'git-github',
    innerTopicId: firstInner?.id || firstSubtopic?.id || '',
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

  const handleOpenAddModal = () => {
    const fStage = stagesList[0];
    const fSub = fStage?.subtopics?.[0];
    const fInner = fSub?.modules?.[0];

    setBatchActiveTab('Weekdays');
    setSelectedWeekdayBatches(allWeekdayBatchesList);
    setSelectedWeekendBatches(allWeekendBatchesList);

    setFormData({
      title: '',
      courseId: courses[0]?.id || '',
      stageId: fStage?.id || 'stage-1',
      subtopicId: fSub?.id || 'git-github',
      innerTopicId: fInner?.id || fSub?.id || '',
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

    setFormData({
      title: asm.title,
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
    const innerList = (selectedSubtopic && Array.isArray(selectedSubtopic.modules) && selectedSubtopic.modules.length > 0)
      ? selectedSubtopic.modules
      : [{ id: selectedSubtopic?.id || 'all-topics', title: selectedSubtopic?.title || 'General Overview' }];
    const selectedInnerTopic = innerList.find((m) => m.id === formData.innerTopicId || m.title === formData.innerTopicId) || innerList[0];

    const totalMcqsCount = formData.mcqs.length;
    const totalCodingCount = formData.codingQuestions.length;
    const totalQuestionsCount = totalMcqsCount + totalCodingCount;

    const allBatches = [...selectedWeekdayBatches, ...selectedWeekendBatches];
    const targetBatchStr = allBatches.length > 0 ? allBatches.join(', ') : 'All Batches';

    const assessmentPayload = {
      title: formData.title,
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
      codingQuestions: formData.codingQuestions,
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
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.courseName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = courseFilter === 'ALL' || a.courseId === courseFilter;
    return matchesSearch && matchesCourse;
  });

  // Calculate Overall Aggregate Metrics
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
            const codingCount = asm.codingQuestions?.length || asm.codingCount || 0;
            const totalQ = asm.totalQuestions || mcqCount + codingCount;

            return (
              <div
                key={asm.id}
                className="group bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1.5 p-6 flex flex-col justify-between h-full"
              >
                <div className="space-y-4">
                  {/* Header Badges & Action Icons */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 bg-blue-50/90 text-blue-700 font-bold px-3 py-1.5 rounded-xl border border-blue-200/60 text-xs">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span className="truncate max-w-[240px]">{asm.courseName || 'Python Full Stack'}</span>
                      </span>

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
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 bg-blue-50/70 p-2.5 rounded-xl border border-blue-100/80">
                      <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>{asm.durationMinutes} Minutes</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 bg-amber-50/70 p-2.5 rounded-xl border border-amber-100/80">
                      <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span>{asm.totalMarks} Points</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100/80">
                      <HelpCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span>{mcqCount} MCQs</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100/80">
                      <Code2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{codingCount} Coding Tasks</span>
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
        subtitle="Configure quiz parameters, MCQ questions, and coding task prompts"
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
                <span className="px-2 py-0.5 rounded-lg bg-white/10 text-blue-100 font-semibold border border-white/15">
                  {currentModalMcqCount} MCQs
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-white/10 text-blue-100 font-semibold border border-white/15">
                  {currentModalCodingCount} Coding
                </span>
              </div>
            </div>
          </div>

          {/* 4-TIER CASCADING HIERARCHY SELECTOR (2x2 Grid) */}
          {(() => {
            const currentStageObj = stagesList.find((s) => s.id === formData.stageId) || stagesList[0];
            const currentSubtopicsArr = currentStageObj?.subtopics || [];
            const currentSubtopicObj = currentSubtopicsArr.find((st) => st.id === formData.subtopicId) || currentSubtopicsArr[0];
            const currentInnerModules = (currentSubtopicObj && Array.isArray(currentSubtopicObj.modules) && currentSubtopicObj.modules.length > 0)
              ? currentSubtopicObj.modules
              : [{ id: currentSubtopicObj?.id || 'all-topics', title: currentSubtopicObj?.title || 'General Overview' }];

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

          {/* BATCH ALLOCATION: WEEKDAY & WEEKEND BATCHES */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            {/* Header & Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {/* Weekday Batches Tab */}
                <button
                  type="button"
                  onClick={() => setBatchActiveTab('Weekdays')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                    batchActiveTab === 'Weekdays'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                      : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Weekday Batches</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      batchActiveTab === 'Weekdays'
                        ? 'bg-white/25 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {selectedWeekdayBatches.length}
                  </span>
                </button>

                {/* Weekend Batches Tab */}
                <button
                  type="button"
                  onClick={() => setBatchActiveTab('Weekends')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                    batchActiveTab === 'Weekends'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                      : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Weekend Batches</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      batchActiveTab === 'Weekends'
                        ? 'bg-white/25 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {selectedWeekendBatches.length}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (batchActiveTab === 'Weekdays') {
                      setSelectedWeekdayBatches(
                        selectedWeekdayBatches.length === allWeekdayBatchesList.length
                          ? []
                          : allWeekdayBatchesList
                      );
                    } else {
                      setSelectedWeekendBatches(
                        selectedWeekendBatches.length === allWeekendBatchesList.length
                          ? []
                          : allWeekendBatchesList
                      );
                    }
                  }}
                  className="text-[11px] font-bold text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
                >
                  {batchActiveTab === 'Weekdays'
                    ? selectedWeekdayBatches.length === allWeekdayBatchesList.length
                      ? 'Deselect All'
                      : 'Select All'
                    : selectedWeekendBatches.length === allWeekendBatchesList.length
                    ? 'Deselect All'
                    : 'Select All'}
                </button>
              </div>
            </div>

            {/* Checkbox Grid - 4 Columns */}
            {batchActiveTab === 'Weekdays' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {allWeekdayBatchesList.map((bCode) => {
                  const isSelected = selectedWeekdayBatches.includes(bCode);

                  return (
                    <div
                      key={bCode}
                      onClick={() => {
                        setSelectedWeekdayBatches((prev) =>
                          prev.includes(bCode) ? prev.filter((b) => b !== bCode) : [...prev, bCode]
                        );
                      }}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-500/20 text-purple-900 font-bold shadow-2xs'
                          : 'bg-slate-50/60 border-slate-200 hover:bg-white hover:border-slate-300 text-slate-700 font-medium'
                      }`}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      )}
                      <span className="text-xs font-black tracking-wide">{bCode}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {allWeekendBatchesList.map((bCode) => {
                  const isSelected = selectedWeekendBatches.includes(bCode);

                  return (
                    <div
                      key={bCode}
                      onClick={() => {
                        setSelectedWeekendBatches((prev) =>
                          prev.includes(bCode) ? prev.filter((b) => b !== bCode) : [...prev, bCode]
                        );
                      }}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-500/20 text-purple-900 font-bold shadow-2xs'
                          : 'bg-slate-50/60 border-slate-200 hover:bg-white hover:border-slate-300 text-slate-700 font-medium'
                      }`}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      )}
                      <span className="text-xs font-black tracking-wide">{bCode}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <Input
              label="Duration (Minutes)"
              type="number"
              value={formData.durationMinutes}
              onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
            />

            <Input
              label="Total Marks"
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

          {/* DYNAMIC CODING CHALLENGE BUILDER SECTION */}
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
