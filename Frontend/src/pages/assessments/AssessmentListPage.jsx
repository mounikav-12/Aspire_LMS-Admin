import React, { useState } from 'react';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
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
  CheckCircle2
} from 'lucide-react';

export function AssessmentListPage() {
  const { assessments, courses, addAssessment, updateAssessment, deleteAssessment } = useLmsData();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [deletingAssessment, setDeletingAssessment] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    courseId: courses[0]?.id || '',
    durationMinutes: 45,
    totalMarks: 100,
    dueDate: '2026-08-15',
    mcqQuestion: 'Which React hook handles side effects?',
    mcqOptions: 'useState, useEffect, useMemo, useContext',
    mcqCorrect: 1,
    codingTitle: 'Implement Custom Debounce Function',
    codingDesc: 'Write a TypeScript debounce helper function with generic parameters.'
  });

  const handleOpenAddModal = () => {
    setFormData({
      title: '',
      courseId: courses[0]?.id || '',
      durationMinutes: 45,
      totalMarks: 100,
      dueDate: '2026-08-15',
      mcqQuestion: 'Which React hook handles side effects?',
      mcqOptions: 'useState, useEffect, useMemo, useContext',
      mcqCorrect: 1,
      codingTitle: 'Implement Custom Debounce Function',
      codingDesc: 'Write a TypeScript debounce helper function with generic parameters.'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (asm) => {
    setEditingAssessment(asm);
    setFormData({
      title: asm.title,
      courseId: asm.courseId,
      durationMinutes: asm.durationMinutes,
      totalMarks: asm.totalMarks,
      dueDate: asm.dueDate || '2026-08-15',
      mcqQuestion: asm.mcqs?.[0]?.question || '',
      mcqOptions: asm.mcqs?.[0]?.options?.join(', ') || '',
      mcqCorrect: asm.mcqs?.[0]?.correctIndex || 0,
      codingTitle: asm.codingQuestions?.[0]?.title || '',
      codingDesc: asm.codingQuestions?.[0]?.description || ''
    });
  };

  const handleSaveAssessment = (e) => {
    e.preventDefault();
    if (!formData.title) {
      addToast('Please enter assessment title', 'error');
      return;
    }

    const selectedCourse = courses.find((c) => c.id === formData.courseId) || courses[0];

    const assessmentPayload = {
      title: formData.title,
      courseId: selectedCourse?.id,
      courseName: selectedCourse?.title,
      durationMinutes: parseInt(formData.durationMinutes) || 45,
      totalMarks: parseInt(formData.totalMarks) || 100,
      dueDate: formData.dueDate,
      mcqCount: 5,
      codingCount: 1,
      mcqs: [
        {
          question: formData.mcqQuestion,
          options: formData.mcqOptions.split(',').map((o) => o.trim()),
          correctIndex: parseInt(formData.mcqCorrect) || 0
        }
      ],
      codingQuestions: [
        {
          title: formData.codingTitle,
          description: formData.codingDesc,
          starterCode: '// Starter code'
        }
      ]
    };

    if (editingAssessment) {
      updateAssessment(editingAssessment.id, assessmentPayload);
      addToast(`Updated assessment: "${formData.title}"`, 'success');
      setEditingAssessment(null);
    } else {
      addAssessment(assessmentPayload);
      addToast(`Assessment "${formData.title}" published!`, 'success');
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
        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAddModal}>
          Create Assessment
        </Button>
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
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Avg Evaluation Marks</p>
            <p className="text-lg font-bold text-slate-900">75 Total Points</p>
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

      {/* Modern Unique Assessment Cards */}
      {filteredAssessments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAssessments.map((asm) => (
            <div
              key={asm.id}
              className="group bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1.5 p-6 flex flex-col justify-between h-full"
            >
              <div className="space-y-4">
                {/* Header Badge & Action Icons */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 bg-blue-50/90 text-blue-700 font-bold px-3 py-1.5 rounded-xl border border-blue-200/60 text-xs">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="truncate max-w-[240px]">{asm.courseName}</span>
                  </span>

                  <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                    <button
                      onClick={() => handleOpenEditModal(asm)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                      title="Edit Assessment"
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

                {/* Title */}
                <div className="min-h-[2.5rem] flex items-center">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors leading-snug">
                    {asm.title}
                  </h3>
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
                    <span>{asm.mcqCount || 5} MCQs</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100/80">
                    <Code2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{asm.codingCount || 1} Coding Task</span>
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
                    Edit Quiz <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Assessments Found"
          description="Create your first assessment evaluation quiz."
          actionLabel="Add Assessment"
          onAction={handleOpenAddModal}
        />
      )}

      {/* Add / Edit Assessment Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingAssessment}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingAssessment(null);
        }}
        title={editingAssessment ? 'Edit Assessment' : 'Create Assessment'}
        subtitle="Configure quiz parameters, MCQ questions, and coding task prompts"
      >
        <form onSubmit={handleSaveAssessment} className="space-y-4">
          <Input
            label="Assessment Title"
            placeholder="e.g. React Concurrent Features & Hooks Evaluation"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Associated Course Track"
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              options={courses.map((c) => ({ value: c.id, label: c.title }))}
            />

            <Input
              label="Duration (Minutes)"
              type="number"
              value={formData.durationMinutes}
              onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

          {/* MCQ Question Builder */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Sample MCQ Question</h4>
            <Input
              label="Question Text"
              placeholder="e.g. Which React hook memoizes calculations?"
              value={formData.mcqQuestion}
              onChange={(e) => setFormData({ ...formData, mcqQuestion: e.target.value })}
            />
            <Input
              label="Options (Comma Separated)"
              placeholder="useState, useMemo, useEffect, useRef"
              value={formData.mcqOptions}
              onChange={(e) => setFormData({ ...formData, mcqOptions: e.target.value })}
            />
          </div>

          {/* Coding Challenge Builder */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Sample Coding Challenge</h4>
            <Input
              label="Coding Question Title"
              placeholder="e.g. Custom `useLocalStorage` Hook"
              value={formData.codingTitle}
              onChange={(e) => setFormData({ ...formData, codingTitle: e.target.value })}
            />
            <Input
              label="Coding Description / Prompt"
              placeholder="Write a custom hook that syncs to window.localStorage..."
              value={formData.codingDesc}
              onChange={(e) => setFormData({ ...formData, codingDesc: e.target.value })}
            />
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
              {editingAssessment ? 'Save Assessment' : 'Publish Assessment'}
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
