import React, { useState } from 'react';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/common/Badge';
import {
  Code2,
  Plus,
  Search,
  Clock,
  Award,
  Sparkles,
  Edit2,
  Trash2,
  Eye,
  FileCode2,
  Tag,
  CheckCircle2,
  BookOpen,
  Terminal,
  HelpCircle,
  Copy,
  Check,
  Lock,
  Unlock
} from 'lucide-react';

export function CodingQuestionsPage() {
  const { codingQuestions, courses, courseLessons, addCodingQuestion, updateCodingQuestion, deleteCodingQuestion, activeBatchFilter, setActiveBatchFilter, getLessonLockStatus } = useLmsData();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [languageFilter, setLanguageFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deletingQuestion, setDeletingQuestion] = useState(null);
  const [viewingSolution, setViewingSolution] = useState(null); // { question, tab: 'starter' | 'solution' }

  // Form State for Posting / Editing Coding Question
  const [formData, setFormData] = useState({
    title: '',
    category: 'Algorithms & Data Structures',
    difficulty: 'Easy',
    marks: 20,
    timeLimitMinutes: 15,
    language: 'JavaScript',
    courseId: courses[0]?.id || '',
    stageId: '',
    subtopicId: '',
    innerTopicId: '',
    tags: 'Arrays, HashMap, LeetCode',
    problemStatement: '',
    inputFormat: '',
    outputFormat: '',
    starterCode: `function solution() {\n  // Write your code here\n}`,
    solutionCode: `function solution() {\n  // Optimal solution code\n}`,
    sampleTestCases: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'nums[0] + nums[1] == 9'
      }
    ]
  });

  const selectedCourseObj = courses.find((c) => c.id === formData.courseId) || courses[0];
  const stagesList = selectedCourseObj?.topics || [];
  const currentStageObj = stagesList.find((s) => s.id === formData.stageId) || stagesList[0];
  const currentSubtopicsArr = currentStageObj?.subtopics || [];
  const currentSubtopicObj = currentSubtopicsArr.find((st) => st.id === formData.subtopicId) || currentSubtopicsArr[0];
  const currentInnerTopicsArr = courseLessons?.filter(
    (l) =>
      l.course_id === formData.courseId &&
      l.stage_id === formData.stageId &&
      l.module_id === formData.subtopicId
  ) || [];

  React.useEffect(() => {
    if (courses && courses.length > 0 && !formData.stageId) {
      const activeCourse = courses.find((c) => c.id === formData.courseId) || courses[0];
      const activeStage = activeCourse?.topics?.[0];
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

  // Calculate stats
  const totalQuestionsCount = codingQuestions.length;
  const easyCount = codingQuestions.filter((q) => q.difficulty === 'Easy').length;
  const mediumCount = codingQuestions.filter((q) => q.difficulty === 'Medium').length;
  const hardCount = codingQuestions.filter((q) => q.difficulty === 'Hard').length;

  // Filter list
  const filteredQuestions = codingQuestions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.problemStatement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.tags && q.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesDifficulty = difficultyFilter === 'ALL' || q.difficulty === difficultyFilter;
    const matchesLanguage = languageFilter === 'ALL' || q.language === languageFilter;

    return matchesSearch && matchesDifficulty && matchesLanguage;
  });

  const handleOpenAddModal = () => {
    const activeCourse = courses.find((c) => c.id === (courses[0]?.id || '')) || courses[0];
    const activeStage = activeCourse?.topics?.[0];
    const activeSub = activeStage?.subtopics?.[0];
    const activeInner = courseLessons?.find(
      (l) => l.course_id === activeCourse?.id && l.stage_id === activeStage?.id && l.module_id === activeSub?.id
    );

    setEditingQuestion(null);
    setFormData({
      title: '',
      category: 'Algorithms & Data Structures',
      difficulty: 'Easy',
      marks: 20,
      timeLimitMinutes: 15,
      language: 'JavaScript',
      courseId: activeCourse?.id || '',
      stageId: activeStage?.id || '',
      subtopicId: activeSub?.id || '',
      innerTopicId: activeInner?.id || '',
      tags: 'Arrays, HashMap',
      problemStatement: '',
      inputFormat: '',
      outputFormat: '',
      starterCode: `function solution() {\n  // Write your code here\n}`,
      solutionCode: `function solution() {\n  // Optimal solution code\n}`,
      sampleTestCases: [
        {
          input: 'input_sample_1',
          output: 'output_sample_1',
          explanation: 'Sample test explanation'
        }
      ]
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cq) => {
    setEditingQuestion(cq);
    setFormData({
      title: cq.title,
      category: cq.category,
      difficulty: cq.difficulty,
      marks: cq.marks,
      timeLimitMinutes: cq.timeLimitMinutes || 15,
      language: cq.language || 'JavaScript',
      courseId: cq.courseId || '',
      stageId: cq.stageId || '',
      subtopicId: cq.subtopicId || '',
      innerTopicId: cq.innerTopicId || '',
      tags: Array.isArray(cq.tags) ? cq.tags.join(', ') : cq.tags || '',
      problemStatement: cq.problemStatement,
      inputFormat: cq.inputFormat || '',
      outputFormat: cq.outputFormat || '',
      starterCode: cq.starterCode || '',
      solutionCode: cq.solutionCode || '',
      sampleTestCases: cq.sampleTestCases && cq.sampleTestCases.length > 0
        ? cq.sampleTestCases.map((tc) => ({ ...tc }))
        : [{ input: '', output: '', explanation: '' }]
    });
    setIsModalOpen(true);
  };

  // Test cases handler
  const handleAddTestCase = () => {
    setFormData((prev) => ({
      ...prev,
      sampleTestCases: [...prev.sampleTestCases, { input: '', output: '', explanation: '' }]
    }));
  };

  const handleRemoveTestCase = (index) => {
    setFormData((prev) => ({
      ...prev,
      sampleTestCases: prev.sampleTestCases.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateTestCase = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.sampleTestCases];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, sampleTestCases: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.problemStatement) {
      addToast('Please provide question title and problem statement', 'error');
      return;
    }

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: formData.title,
      category: formData.category,
      difficulty: formData.difficulty,
      marks: parseInt(formData.marks) || 20,
      timeLimitMinutes: parseInt(formData.timeLimitMinutes) || 15,
      language: formData.language,
      courseId: formData.courseId,
      stageId: formData.stageId,
      subtopicId: formData.subtopicId,
      innerTopicId: formData.innerTopicId,
      tags: tagsArray,
      problemStatement: formData.problemStatement,
      inputFormat: formData.inputFormat,
      outputFormat: formData.outputFormat,
      starterCode: formData.starterCode,
      solutionCode: formData.solutionCode,
      sampleTestCases: formData.sampleTestCases.filter((tc) => tc.input || tc.output)
    };

    if (editingQuestion) {
      updateCodingQuestion(editingQuestion.id, payload);
      addToast(`Updated coding question: "${formData.title}"`, 'success');
    } else {
      addCodingQuestion(payload);
      addToast(`Posted new coding question: "${formData.title}"`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingQuestion) {
      deleteCodingQuestion(deletingQuestion.id);
      addToast(`Deleted coding question "${deletingQuestion.title}"`, 'info');
      setDeletingQuestion(null);
    }
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Hard':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">Hard</span>;
      case 'Medium':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">Medium</span>;
      case 'Easy':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">Easy</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Code2 className="w-6 h-6" />
            </div>
            Coding Questions Bank
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Post coding problems, test cases, and solution templates for student assessments
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Batch Selector Pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setActiveBatchFilter && setActiveBatchFilter('Weekday Batch')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeBatchFilter === 'Weekday Batch' || activeBatchFilter === 'ALL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Weekday (A26W)
            </button>
            <button
              onClick={() => setActiveBatchFilter && setActiveBatchFilter('Weekend Batch')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeBatchFilter === 'Weekend Batch'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Weekend (A26S)
            </button>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleOpenAddModal}
            className="shadow-md bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Post New Question
          </Button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block leading-tight">{totalQuestionsCount}</span>
            <span className="text-xs font-bold text-slate-500">Total Questions</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block leading-tight">{easyCount}</span>
            <span className="text-xs font-bold text-slate-500">Easy Problems</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block leading-tight">{mediumCount}</span>
            <span className="text-xs font-bold text-slate-500">Medium Problems</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block leading-tight">{hardCount}</span>
            <span className="text-xs font-bold text-slate-500">Hard Problems</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          <Select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Difficulties' },
              { value: 'Easy', label: 'Easy' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Hard', label: 'Hard' }
            ]}
            className="w-36 text-xs"
          />

          <Select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Languages' },
              { value: 'JavaScript', label: 'JavaScript' },
              { value: 'TypeScript', label: 'TypeScript' },
              { value: 'Python', label: 'Python' },
              { value: 'Java', label: 'Java' },
              { value: 'C++', label: 'C++' }
            ]}
            className="w-36 text-xs"
          />
        </div>

        <div className="relative flex-1 sm:w-64 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search title, tag, or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Question Cards List */}
      <div className="space-y-4">
        {filteredQuestions.map((cq) => {
          const lockStatus = getLessonLockStatus(cq.innerTopicId || cq.subtopicId, activeBatchFilter === 'ALL' ? 'Weekday Batch' : activeBatchFilter);

          return (
            <div
              key={cq.id}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-lg leading-snug">{cq.title}</h3>
                    {lockStatus.isLocked ? (
                      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-lg border border-rose-200/60 text-[10px]">
                        <Lock className="w-3 h-3 text-rose-600 flex-shrink-0" />
                        <span>{lockStatus.label}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-lg border border-emerald-200/60 text-[10px]">
                        <Unlock className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        <span>Unlocked</span>
                      </span>
                    )}
                    {getDifficultyBadge(cq.difficulty)}
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-100">
                      {cq.language}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                      {cq.marks} Marks
                    </span>
                  </div>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                  <span>{cq.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {cq.timeLimitMinutes} Mins
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewingSolution({ question: cq, tab: 'starter' })}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" /> Code & Solution
                </button>
                <button
                  onClick={() => handleOpenEditModal(cq)}
                  className="p-2 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                  title="Edit Question"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingQuestion(cq)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Problem Statement */}
            <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
              {cq.problemStatement}
            </p>

            {/* Tags & Sample Test Preview */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {cq.tags && cq.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-semibold">
                    #{tag}
                  </span>
                ))}
              </div>

              {cq.sampleTestCases && cq.sampleTestCases.length > 0 && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  {cq.sampleTestCases.length} Sample Test Case(s) Included
                </span>
              )}
            </div>
          </div>
        );
        })}

        {filteredQuestions.length === 0 && (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <Code2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No coding questions found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Post your first coding challenge or adjust your filters.
            </p>
            <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAddModal}>
              Post Coding Question
            </Button>
          </div>
        )}
      </div>

      {/* Post / Edit Coding Question Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingQuestion ? 'Edit Coding Question' : 'Post New Coding Question'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Question Title"
            placeholder="e.g. Two Sum Problem or Custom Hook Implementation"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="1. Course Track"
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              options={courses.map((c) => ({ value: c.id, label: c.title }))}
            />
            <Select
              label="2. Course Module / Stage"
              value={formData.stageId}
              onChange={(e) => {
                const newStageId = e.target.value;
                const newStage = stagesList.find((s) => s.id === newStageId) || stagesList[0];
                const firstSub = newStage?.subtopics?.[0];
                const firstInner = courseLessons?.find(l => l.course_id === formData.courseId && l.stage_id === newStageId && l.module_id === firstSub?.id);
                setFormData({
                  ...formData,
                  stageId: newStageId,
                  subtopicId: firstSub?.id || '',
                  innerTopicId: firstInner?.id || ''
                });
              }}
              options={stagesList.map((stg) => ({
                value: stg.id,
                label: stg.title
              }))}
            />
            <Select
              label="3. Milestone Subtopic"
              value={formData.subtopicId}
              onChange={(e) => {
                const newSubId = e.target.value;
                const targetStage = stagesList.find((s) => s.id === formData.stageId) || stagesList[0];
                const targetSub = targetStage?.subtopics?.find((st) => st.id === newSubId) || targetStage?.subtopics?.[0];
                const firstInner = courseLessons?.find(l => l.course_id === formData.courseId && l.stage_id === formData.stageId && l.module_id === newSubId);
                setFormData({
                  ...formData,
                  subtopicId: newSubId,
                  innerTopicId: firstInner?.id || ''
                });
              }}
              options={currentSubtopicsArr.map((sub) => ({
                value: sub.id,
                label: sub.title
              }))}
            />
            <Select
              label="4. Specific Lesson (Optional)"
              value={formData.innerTopicId}
              onChange={(e) => setFormData({ ...formData, innerTopicId: e.target.value })}
              options={[
                { value: '', label: 'None (Module Level)' },
                ...currentInnerTopicsArr.map((l) => ({ value: l.id, label: l.title }))
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Programming Language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              options={[
                { value: 'JavaScript', label: 'JavaScript' },
                { value: 'TypeScript', label: 'TypeScript' },
                { value: 'Python', label: 'Python' },
                { value: 'Java', label: 'Java' },
                { value: 'C++', label: 'C++' }
              ]}
            />

            <Select
              label="Difficulty Level"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              options={[
                { value: 'Easy', label: 'Easy' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Hard', label: 'Hard' }
              ]}
            />

            <Select
              label="Category / Topic"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'Algorithms & Data Structures', label: 'Algorithms & DS' },
                { value: 'React & Frontend Engineering', label: 'React & Frontend' },
                { value: 'Backend & System Design', label: 'Backend & System Design' },
                { value: 'Database & SQL', label: 'Database & SQL' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Marks / Points"
              type="number"
              value={formData.marks}
              onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
            />

            <Input
              label="Time Limit (Minutes)"
              type="number"
              value={formData.timeLimitMinutes}
              onChange={(e) => setFormData({ ...formData, timeLimitMinutes: e.target.value })}
            />

            <Input
              label="Tags (Comma-Separated)"
              placeholder="Arrays, HashMap, React"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          {/* Problem Statement */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
              Problem Statement / Description
            </label>
            <textarea
              rows={4}
              placeholder="Write detailed problem instructions, input constraints, and goals..."
              value={formData.problemStatement}
              onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all font-medium leading-relaxed"
              required
            />
          </div>

          {/* Input & Output Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Input Format"
              placeholder="e.g. nums = [2, 7, 11, 15], target = 9"
              value={formData.inputFormat}
              onChange={(e) => setFormData({ ...formData, inputFormat: e.target.value })}
            />
            <Input
              label="Output Format"
              placeholder="e.g. [0, 1]"
              value={formData.outputFormat}
              onChange={(e) => setFormData({ ...formData, outputFormat: e.target.value })}
            />
          </div>

          {/* Sample Test Cases Builder */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                Sample Test Cases ({formData.sampleTestCases.length})
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={handleAddTestCase}
                className="text-xs border-emerald-200 text-emerald-700"
              >
                Add Test Case
              </Button>
            </div>

            {formData.sampleTestCases.map((tc, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600">Test Case #{idx + 1}</span>
                  {formData.sampleTestCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTestCase(idx)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    placeholder="Input (e.g. nums=[2,7], target=9)"
                    value={tc.input}
                    onChange={(e) => handleUpdateTestCase(idx, 'input', e.target.value)}
                  />
                  <Input
                    placeholder="Expected Output (e.g. [0, 1])"
                    value={tc.output}
                    onChange={(e) => handleUpdateTestCase(idx, 'output', e.target.value)}
                  />
                </div>
                <Input
                  placeholder="Explanation / Note (Optional)"
                  value={tc.explanation}
                  onChange={(e) => handleUpdateTestCase(idx, 'explanation', e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Starter Code & Solution Code */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-500" /> Starter Code Template (Students see this)
              </label>
              <textarea
                rows={4}
                value={formData.starterCode}
                onChange={(e) => setFormData({ ...formData, starterCode: e.target.value })}
                className="w-full p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Solution Code / Mentor Reference
              </label>
              <textarea
                rows={4}
                value={formData.solutionCode}
                onChange={(e) => setFormData({ ...formData, solutionCode: e.target.value })}
                className="w-full p-3 bg-slate-900 text-blue-300 font-mono text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {editingQuestion ? 'Save Changes' : 'Post Coding Question'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Viewing Starter / Solution Code Modal */}
      {viewingSolution && (
        <Modal
          isOpen={!!viewingSolution}
          onClose={() => setViewingSolution(null)}
          title={`Code & Solution - ${viewingSolution.question.title}`}
        >
          <div className="space-y-4">
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setViewingSolution({ ...viewingSolution, tab: 'starter' })}
                className={`px-4 py-2 text-xs font-bold cursor-pointer border-b-2 ${
                  viewingSolution.tab === 'starter'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Starter Template Code
              </button>
              <button
                onClick={() => setViewingSolution({ ...viewingSolution, tab: 'solution' })}
                className={`px-4 py-2 text-xs font-bold cursor-pointer border-b-2 ${
                  viewingSolution.tab === 'solution'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Solution Code
              </button>
            </div>

            <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-2xl overflow-x-auto leading-relaxed">
              <code>
                {viewingSolution.tab === 'starter'
                  ? viewingSolution.question.starterCode || '// No starter code provided'
                  : viewingSolution.question.solutionCode || '// No solution code provided'}
              </code>
            </pre>

            {viewingSolution.question.sampleTestCases && viewingSolution.question.sampleTestCases.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Sample Test Cases</h5>
                {viewingSolution.question.sampleTestCases.map((tc, i) => (
                  <div key={i} className="bg-slate-50 p-3 rounded-xl border text-xs space-y-1 font-mono">
                    <p><strong className="text-slate-700">Input:</strong> {tc.input}</p>
                    <p><strong className="text-emerald-700">Expected Output:</strong> {tc.output}</p>
                    {tc.explanation && <p className="font-sans text-slate-500 text-[11px]">{tc.explanation}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingQuestion}
        onClose={() => setDeletingQuestion(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Coding Question"
        message={`Are you sure you want to remove "${deletingQuestion?.title}" from the question bank?`}
      />
    </div>
  );
}
