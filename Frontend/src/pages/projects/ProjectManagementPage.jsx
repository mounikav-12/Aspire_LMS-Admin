import React, { useState } from 'react';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  FolderGit2,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  Code2,
  Star,
  ExternalLink,
  Trash2,
  Edit2,
  Edit3,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  FileCode2,
  Lightbulb,
  CheckSquare,
  Square,
  Eye,
  Calendar,
  Layers,
  BookOpen,
  EyeOff,
  Lock,
  MessageSquare,
  Send,
  FileText,
  Unlock
} from 'lucide-react';

export function ProjectManagementPage() {
  const { projects = [], courses = [], courseLessons = [], milestones = {}, addProject, updateProject, deleteProject, gradeSubmission, activeBatchFilter, getLessonLockStatus } = useLmsData();
  const { addToast } = useToast();

  // Navigation & Filter States
  const [projectTypeTab, setProjectTypeTab] = useState('Mini Projects'); // 'Mini Projects' | 'Major Projects' | 'Capstone Projects' | 'Templates'
  const [statusFilterTab, setStatusFilterTab] = useState('Assigned'); // 'Assigned' | 'Submitted' | 'Mentor Feedback'
  const [activeTab, setActiveTab] = useState('assigned');
  const [selectedType, setSelectedType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Project for Detail View (Matching Image 2 & Image 3)
  const [activeProjectDetail, setActiveProjectDetail] = useState(null);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Target Batches Eye Modal States
  const [viewingBatchesProject, setViewingBatchesProject] = useState(null);
  const [eyeActiveTab, setEyeActiveTab] = useState('Weekdays');
  const [selectedWeekdayBatches, setSelectedWeekdayBatches] = useState([]);
  const [selectedWeekendBatches, setSelectedWeekendBatches] = useState([]);

  const handleOpenEyeModal = (proj) => {
    setViewingBatchesProject(proj);
    setEyeActiveTab('Weekdays');
    try {
      const savedWd = localStorage.getItem(`aspire_lms_proj_wd_${proj.id}`);
      setSelectedWeekdayBatches(savedWd ? JSON.parse(savedWd) : []);
      const savedWe = localStorage.getItem(`aspire_lms_proj_we_${proj.id}`);
      setSelectedWeekendBatches(savedWe ? JSON.parse(savedWe) : []);
    } catch (e) {
      setSelectedWeekdayBatches([]);
      setSelectedWeekendBatches([]);
    }
  };

  // Grade Modal State
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');

  const handleOpenGradeModal = (projectId, submission) => {
    setGradingSubmission({ projectId, submission });
    setGradeInput(submission.grade || 85);
    setFeedbackInput(submission.mentorFeedback || '');
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    if (gradeSubmission) {
      await gradeSubmission(
        gradingSubmission.projectId,
        gradingSubmission.submission.id,
        gradeInput,
        feedbackInput
      );
    }
    addToast(`Saved feedback & grade for ${gradingSubmission.submission.studentName}`, 'success');
    setGradingSubmission(null);
  };

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    title: '',
    type: 'Mini',
    courseId: courses[0]?.id || '',
    stageId: '',
    subtopicId: '',
    innerTopicId: '',
    category: 'Full-Stack Web Dev',
    difficulty: 'Beginner',
    description: '',
    techStack: '',
    dueDate: '',
    templateUrl: '',
    status: 'Assigned',
    overview: '',
    requirements: '',
    steps: '',
    rubric: '',
    mentorTip: ''
  });

  const selectedCourseObj = courses.find((c) => c.id === formData.courseId) || courses[0];
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

  // Calculate Overall Metrics
  const totalAssigned = projects.reduce((acc, p) => acc + (p.assignedCount || 1), 0);
  const totalSubmitted = projects.reduce((acc, p) => acc + (p.submittedCount || 0), 0);
  const totalFeedback = projects.reduce((acc, p) => acc + (p.feedbackCount || 0), 0);
  const gradedProjects = projects.filter((p) => (p.avgGrade || 0) > 0);
  const overallAvgGrade = gradedProjects.length > 0
    ? Math.round(gradedProjects.reduce((acc, p) => acc + p.avgGrade, 0) / gradedProjects.length)
    : 89;

  // Category Tabs Filter Logic
  const filteredProjects = projects.filter((proj) => {
    if (!proj) return false;
    const title = (proj.title || '').toLowerCase();
    const desc = (proj.description || '').toLowerCase();
    const cat = (proj.category || '').toLowerCase();
    const query = (searchTerm || '').toLowerCase();

    const matchesSearch = title.includes(query) || desc.includes(query) || cat.includes(query);

    // Type Match
    let matchesType = true;
    if (projectTypeTab === 'Mini Projects') matchesType = (proj.type || 'Mini').toLowerCase().includes('mini');
    else if (projectTypeTab === 'Major Projects') matchesType = (proj.type || 'Mini').toLowerCase().includes('major');
    else if (projectTypeTab === 'Capstone Projects') matchesType = (proj.type || 'Mini').toLowerCase().includes('capstone');

    // Status Match
    let matchesStatus = true;
    if (statusFilterTab === 'Assigned') matchesStatus = proj.status === 'Assigned' || proj.status === 'Published';
    else if (statusFilterTab === 'Submitted') matchesStatus = (proj.submittedCount || 0) > 0;
    else if (statusFilterTab === 'Mentor Feedback') matchesStatus = (proj.feedbackCount || 0) > 0;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleOpenCreateModal = () => {
    const activeCourse = courses.find((c) => c.id === (courses[0]?.id || '')) || courses[0];
    const activeStage = activeCourse?.topics?.[0] || stagesList[0];
    const activeSub = activeStage?.subtopics?.[0];
    const activeInner = courseLessons?.find(
      (l) => l.course_id === activeCourse?.id && l.stage_id === activeStage?.id && l.module_id === activeSub?.id
    );
    setEditingProject(null);
    setFormData({
      title: '',
      type: 'Mini',
      courseId: activeCourse?.id || '',
      stageId: activeStage?.id || '',
      subtopicId: activeSub?.id || '',
      innerTopicId: activeInner?.id || '',
      category: 'Full-Stack Web Dev',
      difficulty: 'Beginner',
      description: '',
      techStack: '',
      dueDate: '',
      templateUrl: '',
      status: 'Assigned',
      overview: '',
      requirements: '',
      steps: '',
      rubric: '',
      mentorTip: ''
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (proj) => {
    const foundStage = stagesList.find((s) => s.id === proj.stageId) || stagesList[0];
    const subtopicsOfStage = foundStage?.subtopics || [];
    const foundSubtopic = subtopicsOfStage.find((st) => st.id === proj.subtopicId) || subtopicsOfStage[0];
    const firstInner = courseLessons?.find(
      (l) => l.course_id === proj.courseId && l.stage_id === foundStage?.id && l.module_id === foundSubtopic?.id
    );

    setEditingProject(proj);
    setFormData({
      title: proj.title || '',
      type: proj.type || 'Mini',
      courseId: proj.courseId || courses[0]?.id || '',
      stageId: foundStage?.id || '',
      subtopicId: foundSubtopic?.id || '',
      innerTopicId: proj.innerTopicId || firstInner?.id || '',
      category: proj.category || 'Module 2: Python Fundamentals',
      difficulty: proj.difficulty || 'Beginner',
      description: proj.description || '',
      techStack: Array.isArray(proj.techStack) ? proj.techStack.join(', ') : (proj.techStack || ''),
      dueDate: proj.dueDate || 'Aug 20',
      status: proj.status || 'Assigned',
      overview: proj.overview || proj.description || '',
      requirements: Array.isArray(proj.requirements)
        ? proj.requirements.map(r => typeof r === 'string' ? r : `${r.title}: ${r.desc}`).join('\n')
        : (proj.requirements || ''),
      steps: Array.isArray(proj.steps) ? proj.steps.join('\n') : (proj.steps || ''),
      rubric: Array.isArray(proj.rubric)
        ? proj.rubric.map(r => typeof r === 'string' ? r : `${r.label}: ${r.weight}`).join('\n')
        : (proj.rubric || ''),
      mentorTip: proj.mentorTip || 'Test code thoroughly before submitting drive link.'
    });
    setIsCreateModalOpen(true);
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      addToast('Please fill in project title and description', 'error');
      return;
    }

    const techStackList = typeof formData.techStack === 'string'
      ? formData.techStack.split(',').map((t) => t.trim()).filter(Boolean)
      : formData.techStack;

    const requirementsList = typeof formData.requirements === 'string'
      ? formData.requirements.split('\n').filter(Boolean).map(line => {
          if (line.includes(':')) {
            const [t, ...dParts] = line.split(':');
            return { title: t.trim(), desc: dParts.join(':').trim() };
          }
          return { title: line.trim(), desc: '' };
        })
      : formData.requirements;

    const stepsList = typeof formData.steps === 'string'
      ? formData.steps.split('\n').filter(Boolean)
      : formData.steps;

    const rubricList = typeof formData.rubric === 'string'
      ? formData.rubric.split('\n').filter(Boolean).map(line => {
          if (line.includes(':')) {
            const [l, ...wParts] = line.split(':');
            return { label: l.trim(), weight: wParts.join(':').trim() };
          }
          return { label: line.trim(), weight: '33%' };
        })
      : formData.rubric;

    const payload = {
      ...formData,
      techStack: techStackList,
      requirements: requirementsList,
      steps: stepsList,
      rubric: rubricList
    };

    if (editingProject) {
      const updatedProj = { ...editingProject, ...payload };
      await updateProject(editingProject.id, payload);
      if (activeProjectDetail?.id === editingProject.id) {
        setActiveProjectDetail(updatedProj);
      }
      addToast(`Updated project: "${formData.title}"`, 'success');
    } else {
      await addProject(payload);
      addToast(`Published project: "${formData.title}"`, 'success');
    }

    setIsCreateModalOpen(false);
    setEditingProject(null);
  };

  const handleDelete = async () => {
    if (deleteConfirmId) {
      await deleteProject(deleteConfirmId);
      addToast('Project deleted successfully', 'info');
      setDeleteConfirmId(null);
      if (activeProjectDetail?.id === deleteConfirmId) {
        setActiveProjectDetail(null);
      }
    }
  };
  const getTypeBadge = (type) => {
    switch (type) {
      case 'Capstone':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200/60">
            Capstone
          </span>
        );
      case 'Major':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200/60">
            Major
          </span>
        );
      case 'Mini':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200/60">
            Mini Project
          </span>
        );
    }
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Advanced':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-600 border border-rose-200/60">
            Advanced
          </span>
        );
      case 'Intermediate':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-600 border border-blue-200/60">
            Intermediate
          </span>
        );
      case 'Beginner':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-600 border border-emerald-200/60">
            Beginner
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Build real-world projects and get mentor feedback
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleOpenCreateModal}
            className="shadow-md"
          >
            Create New Project
          </Button>
        </div>
      </div>

      {/* Metric Cards matching Student LMS Screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Assigned Stat */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-100/80 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block leading-tight">{totalAssigned}</span>
            <span className="text-xs font-bold text-slate-500">Assigned</span>
          </div>
        </div>

        {/* Submitted Stat */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-100/80 border border-blue-200 flex items-center justify-center text-blue-600 flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block leading-tight">{totalSubmitted}</span>
            <span className="text-xs font-bold text-slate-500">Submitted</span>
          </div>
        </div>

        {/* With Feedback Stat */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-100/80 border border-purple-200 flex items-center justify-center text-purple-600 flex-shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block leading-tight">{totalFeedback}</span>
            <span className="text-xs font-bold text-slate-500">With Feedback</span>
          </div>
        </div>

        {/* Avg Grade Stat */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block leading-tight">{overallAvgGrade}%</span>
            <span className="text-xs font-bold text-slate-500">Avg Grade</span>
          </div>
        </div>
      </div>

      {/* Tabs Filter Bar (Assigned, Submitted, Mentor Feedback, Templates) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('assigned')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'assigned'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
            }`}
          >
            Assigned
          </button>
          <button
            onClick={() => setActiveTab('submitted')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'submitted'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
            }`}
          >
            Submitted
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'feedback'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
            }`}
          >
            Mentor Feedback
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
            }`}
          >
            Templates
          </button>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            options={[
              { value: 'All', label: 'All Types' },
              { value: 'Mini', label: 'Mini' },
              { value: 'Major', label: 'Major' },
              { value: 'Capstone', label: 'Capstone' }
            ]}
            className="w-32 text-xs"
          />
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search project title or tech..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area based on Active Tab */}
      {activeTab === 'assigned' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProjects.map((proj) => {
            const lockStatus = getLessonLockStatus(proj.innerTopicId, activeBatchFilter === 'ALL' ? 'Weekday Batch' : activeBatchFilter);

            return (
            <div
              key={proj.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header & Badges (Type & Difficulty) */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <FolderGit2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {proj.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
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
                    {getTypeBadge(proj.type || 'Mini')}
                    {getDifficultyBadge(proj.difficulty)}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-2 mb-4">
                  {proj.description}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {proj.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Row: Due Date & Action Button matching screenshot */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{proj.dueDate}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEyeModal(proj)}
                    className="p-2 text-slate-400 hover:text-purple-600 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer"
                    title="Target Batches"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(proj)}
                    className="p-2 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Edit Project"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(proj.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveProjectDetail(proj)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold px-4 py-2 rounded-2xl text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
          })}

          {filteredProjects.length === 0 && (
            <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <Code2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No projects found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search criteria or create a new real-world project for your students.
              </p>
              <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreateModal}>
                Create First Project
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Submitted Tab View (Student Submissions & Mentor Grading) */}
      {activeTab === 'submitted' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Student Submissions Log</h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {totalSubmitted} Submissions Received
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase border-b border-slate-200/80">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Project Title</th>
                  <th className="p-4">Submitted Date</th>
                  <th className="p-4">Repository / Demo</th>
                  <th className="p-4">Grade</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {projects.flatMap((p) =>
                  (p.submissions || []).map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={sub.studentAvatar}
                            alt={sub.studentName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <span className="font-bold text-slate-900">{sub.studentName}</span>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-slate-800">{p.title}</td>
                      <td className="p-4 text-slate-500">{sub.submittedAt}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={sub.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                          >
                            Repo <ExternalLink className="w-3 h-3" />
                          </a>
                          {sub.liveDemoUrl && (
                            <a
                              href={sub.liveDemoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 hover:underline flex items-center gap-1 font-semibold"
                            >
                              Live Demo <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {sub.status === 'Graded' ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-black">
                            {sub.grade}%
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-bold">
                            Pending Review
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenGradeModal(p.id, sub)}
                        >
                          {sub.status === 'Graded' ? 'Edit Grade' : 'Grade & Review'}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mentor Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          {projects.flatMap((p) =>
            (p.submissions || []).filter((s) => s.mentorFeedback).map((sub) => (
              <div key={sub.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={sub.studentAvatar} alt={sub.studentName} className="w-10 h-10 rounded-full border" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{sub.studentName}</h4>
                      <p className="text-xs text-slate-500 font-medium">{p.title}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
                    Score: {sub.grade}%
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-700 font-medium leading-relaxed">
                  <strong className="text-slate-900 block mb-1">Mentor Feedback:</strong>
                  "{sub.mentorFeedback}"
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">{p.title} Starter Kit</h4>
                <Badge variant="blue">{p.category}</Badge>
              </div>
              <p className="text-xs text-slate-600">{p.guidelines || 'Includes template repository setup and README instructions.'}</p>
              <a
                href={p.templateUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
              >
                View Repository Template <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Project Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={editingProject ? 'Edit Project Assignment' : 'Create Real-World Project'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Project Title"
            type="text"
            placeholder="e.g. Python Data Analyzer"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          {/* 4-TIER CASCADING HIERARCHY SELECTOR (CURRICULUM LOCATION & MILESTONE TOPIC MAPPING) */}
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
              <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-600" />
                    <span>CURRICULUM LOCATION & MILESTONE TOPIC MAPPING</span>
                  </label>
                  <span className="text-[11px] font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200/60">
                    4-Tier Milestone Cascade
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Tier 1: Course Track */}
                  <Select
                    label="1. COURSE TRACK"
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    options={courses.map((c) => ({ value: c.id, label: c.title }))}
                  />

                  {/* Tier 2: Course Module / Stage */}
                  <Select
                    label="2. COURSE MODULE / STAGE"
                    value={formData.stageId}
                    onChange={(e) => {
                      const newStageId = e.target.value;
                      const newStage = stagesList.find((s) => s.id === newStageId) || stagesList[0];
                      const firstSub = newStage?.subtopics?.[0];
                      const firstInner = courseLessons?.find(
                        (l) => l.course_id === formData.courseId && l.stage_id === newStageId && l.module_id === firstSub?.id
                      );
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

                  {/* Tier 3: Milestone Subtopic */}
                  <Select
                    label="3. MILESTONE SUBTOPIC"
                    value={formData.subtopicId}
                    onChange={(e) => {
                      const newSubId = e.target.value;
                      const targetStage = stagesList.find((s) => s.id === formData.stageId) || stagesList[0];
                      const targetSub = targetStage?.subtopics?.find((st) => st.id === newSubId) || targetStage?.subtopics?.[0];
                      const firstInner = courseLessons?.find(
                        (l) => l.course_id === formData.courseId && l.stage_id === formData.stageId && l.module_id === newSubId
                      );
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

                  {/* Tier 4: Specific Inner Topic */}
                  <Select
                    label="4. SPECIFIC INNER TOPIC"
                    value={formData.innerTopicId}
                    onChange={(e) => setFormData({ ...formData, innerTopicId: e.target.value })}
                    options={[
                      { value: '', label: 'None (Module Level)' },
                      ...currentInnerModules.map((l) => ({ value: l.id, label: l.title }))
                    ]}
                  />
                </div>
              </div>
            );
          })()}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Project Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { value: 'Mini', label: 'Mini Project' },
                { value: 'Major', label: 'Major Project' },
                { value: 'Capstone', label: 'Capstone Project' }
              ]}
            />

            <Input
              label="Due Date Label"
              type="text"
              placeholder="e.g. Aug 20"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <Input
            label="Tech Stack Tags (Comma-Separated)"
            type="text"
            placeholder="React, Node.js, PostgreSQL, Stripe"
            value={formData.techStack}
            onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
          />

          <Input
            label="Due Date Label"
            type="text"
            placeholder="Due Aug 20"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />

          <Input
            label="Starter Template Repo URL"
            type="text"
            placeholder="https://github.com/aspire-lms/ecommerce-starter"
            value={formData.templateUrl}
            onChange={(e) => setFormData({ ...formData, templateUrl: e.target.value })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
              Short Description
            </label>
            <textarea
              rows={2}
              placeholder="Build a Python script that analyzes, cleans, and generates insights from raw CSV data."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
              Full Project Overview Brief
            </label>
            <textarea
              rows={3}
              placeholder="Develop a production-ready solution adhering to industry coding standards, modular component organization, and clean user experience."
              value={formData.overview}
              onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
              Key Functional Requirements (Title: Description per line)
            </label>
            <textarea
              rows={3}
              placeholder="Responsive UI & Modern Layout: Ensure seamless experience across mobile, tablet, and desktop viewports.&#10;Input Validation & State Handling: Implement validation rules, error feedback, and loading states async.&#10;Clean Code & Version Control: Submit clean code with meaningful commit messages."
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
              Recommended Implementation Steps (One per line)
            </label>
            <textarea
              rows={3}
              placeholder="1. Setup project repository&#10;2. Build core feature logic&#10;3. Submit drive link"
              value={formData.steps}
              onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
              Evaluation Rubric Criteria & Weights (Label: Weight per line)
            </label>
            <textarea
              rows={3}
              placeholder="UI/UX & Responsiveness: 35%&#10;Functionality & Logic: 35%&#10;Code Quality & Cleanliness: 30%"
              value={formData.rubric}
              onChange={(e) => setFormData({ ...formData, rubric: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <Input
            label="Mentor Pro Tip"
            type="text"
            placeholder="e.g. Test code thoroughly before submitting drive link."
            value={formData.mentorTip}
            onChange={(e) => setFormData({ ...formData, mentorTip: e.target.value })}
          />

          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingProject ? 'Save Changes' : 'Publish Project'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Mentor Grade & Review Modal */}
      <Modal
        isOpen={!!gradingSubmission}
        onClose={() => setGradingSubmission(null)}
        title={`Grade Submission - ${gradingSubmission?.submission.studentName}`}
      >
        <form onSubmit={handleSaveGrade} className="space-y-4">
          <Input
            label="Awarded Grade Percentage (0 - 100)"
            type="number"
            min="0"
            max="100"
            value={gradeInput}
            onChange={(e) => setGradeInput(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
              Mentor Feedback Comments
            </label>
            <textarea
              rows={4}
              placeholder="Great architecture, clean state management, and clear documentation!"
              value={feedbackInput}
              onChange={(e) => setFeedbackInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
              required
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="secondary" onClick={() => setGradingSubmission(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Send}>
              Save Grade & Feedback
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Project Details Modal Popup matching screenshot */}
      <Modal
        isOpen={!!activeProjectDetail}
        onClose={() => setActiveProjectDetail(null)}
        title={activeProjectDetail?.title || 'Project Details'}
        maxWidth="max-w-4xl"
      >
        {activeProjectDetail && (
          <div className="space-y-6 pt-1">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100">
              {getTypeBadge(activeProjectDetail.type || 'Mini')}
              {getDifficultyBadge(activeProjectDetail.difficulty)}
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                {activeProjectDetail.category}
              </span>
              <span className="ml-auto text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Due {activeProjectDetail.dueDate}
              </span>
            </div>

            {/* Grid Layout matching image media_1787138288694 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left Column: Brief & Objectives (2 cols) */}
              <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-200/80 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-black text-purple-600 uppercase tracking-wider mb-1">
                    <FileText className="w-4 h-4" />
                    <span>PROJECT BRIEF & OBJECTIVES</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-2">Project Overview</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {activeProjectDetail.overview || activeProjectDetail.description}
                  </p>
                </div>

                {/* Key Functional Requirements */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                    KEY FUNCTIONAL REQUIREMENTS
                  </h4>
                  <div className="space-y-2">
                    {(Array.isArray(activeProjectDetail.requirements)
                      ? activeProjectDetail.requirements
                      : typeof activeProjectDetail.requirements === 'string'
                      ? activeProjectDetail.requirements.split('\n').filter(Boolean)
                      : []
                    ).map((req, idx) => {
                      const title = typeof req === 'string' ? (req.includes(':') ? req.split(':')[0] : req) : req.title;
                      const desc = typeof req === 'string' ? (req.includes(':') ? req.split(':').slice(1).join(':') : '') : req.desc;
                      return (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50/80 hover:bg-slate-100/60 border border-slate-200/80 rounded-2xl flex items-start gap-3 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-slate-900 block">{title}</span>
                            {desc && <p className="text-[11px] text-slate-500 leading-normal">{desc}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recommended Implementation Steps */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                    RECOMMENDED IMPLEMENTATION STEPS
                  </h4>
                  <div className="space-y-2">
                    {(Array.isArray(activeProjectDetail.steps)
                      ? activeProjectDetail.steps
                      : typeof activeProjectDetail.steps === 'string'
                      ? activeProjectDetail.steps.split('\n').filter(Boolean)
                      : ['Setup project repository', 'Build core feature logic', 'Submit drive link']
                    ).map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs text-slate-700 font-semibold">{typeof step === 'string' ? step.replace(/^\d+[\.\s]*/, '') : step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Evaluation Rubric & Mentor Pro Tips (1 col) */}
              <div className="space-y-4">
                {/* Evaluation Rubric */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-black text-purple-600 uppercase tracking-wider">
                    <Star className="w-4 h-4" />
                    <span>EVALUATION RUBRIC</span>
                  </div>
                  <div className="space-y-3">
                    {(Array.isArray(activeProjectDetail.rubric)
                      ? activeProjectDetail.rubric
                      : typeof activeProjectDetail.rubric === 'string'
                      ? activeProjectDetail.rubric.split('\n').filter(Boolean)
                      : []
                    ).map((rub, idx) => {
                      const label = typeof rub === 'string' ? (rub.includes(':') ? rub.split(':')[0] : rub) : rub.label;
                      const weight = typeof rub === 'string' ? (rub.includes(':') ? rub.split(':')[1] : '33%') : rub.weight;
                      const percentVal = parseInt(weight) || 35;
                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-slate-800">{label}</span>
                            <span className="text-purple-600 font-black">{weight}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-purple-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${percentVal}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mentor Pro Tips */}
                <div className="bg-amber-50/60 p-5 rounded-3xl border border-amber-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-700 uppercase tracking-wider">
                    <BookOpen className="w-4 h-4" />
                    <span>MENTOR PRO TIPS</span>
                  </div>
                  <ul className="text-xs text-amber-900/90 list-disc list-inside space-y-1 font-medium">
                    <li>{activeProjectDetail.mentorTip || 'Test code thoroughly before submitting drive link.'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Target Batches Selection Modal matching screenshot media_1787139432274 */}
      <Modal
        isOpen={!!viewingBatchesProject}
        onClose={() => setViewingBatchesProject(null)}
        title={viewingBatchesProject?.title || 'Target Batches'}
        subtitle="View and multi-select active Weekday and Weekend batch numbers for this project assignment"
        maxWidth="max-w-xl"
      >
        {viewingBatchesProject && (
          <div className="space-y-5 pt-2">
            {/* Weekday / Weekend Tabs with Counts */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEyeActiveTab('Weekdays')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  eyeActiveTab === 'Weekdays'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Weekday Batches</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                  eyeActiveTab === 'Weekdays' ? 'bg-purple-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {selectedWeekdayBatches.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setEyeActiveTab('Weekends')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  eyeActiveTab === 'Weekends'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Weekend Batches</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                  eyeActiveTab === 'Weekends' ? 'bg-purple-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {selectedWeekendBatches.length}
                </span>
              </button>
            </div>

            {/* Checkboxes List */}
            {eyeActiveTab === 'Weekdays' ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 font-semibold">
                  Check or uncheck Weekday batch numbers for this project:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['A26W1', 'A26W2', 'A26W3', 'A26W4'].map((bCode) => {
                    const isSelected = selectedWeekdayBatches.includes(bCode);
                    return (
                      <div
                        key={bCode}
                        onClick={() => {
                          setSelectedWeekdayBatches((prev) => {
                            const next = prev.includes(bCode) ? prev.filter((b) => b !== bCode) : [...prev, bCode];
                            if (viewingBatchesProject) {
                              try { localStorage.setItem(`aspire_lms_proj_wd_${viewingBatchesProject.id}`, JSON.stringify(next)); } catch (e) {}
                            }
                            return next;
                          });
                        }}
                        className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                          isSelected
                            ? 'bg-purple-50/80 border-2 border-purple-400 text-purple-950 font-extrabold shadow-2xs'
                            : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-700 font-bold'
                        }`}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-purple-600 flex-shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        )}
                        <span className="text-xs font-black tracking-wide">{bCode}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 font-semibold">
                  Check or uncheck Weekend batch numbers for this project:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['A26S1', 'A26S2', 'A26S3', 'A26S4'].map((bCode) => {
                    const isSelected = selectedWeekendBatches.includes(bCode);
                    return (
                      <div
                        key={bCode}
                        onClick={() => {
                          setSelectedWeekendBatches((prev) => {
                            const next = prev.includes(bCode) ? prev.filter((b) => b !== bCode) : [...prev, bCode];
                            if (viewingBatchesProject) {
                              try { localStorage.setItem(`aspire_lms_proj_we_${viewingBatchesProject.id}`, JSON.stringify(next)); } catch (e) {}
                            }
                            return next;
                          });
                        }}
                        className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                          isSelected
                            ? 'bg-purple-50/80 border-2 border-purple-400 text-purple-950 font-extrabold shadow-2xs'
                            : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-700 font-bold'
                        }`}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-purple-600 flex-shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        )}
                        <span className="text-xs font-black tracking-wide">{bCode}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  if (viewingBatchesProject) {
                    let newTargetBatch = 'All Batches';
                    const allSelected = [...selectedWeekdayBatches, ...selectedWeekendBatches];
                    if (allSelected.length > 0) {
                      newTargetBatch = allSelected.join(', ');
                    }

                    try {
                      localStorage.setItem(`aspire_lms_proj_wd_${viewingBatchesProject.id}`, JSON.stringify(selectedWeekdayBatches));
                      localStorage.setItem(`aspire_lms_proj_we_${viewingBatchesProject.id}`, JSON.stringify(selectedWeekendBatches));
                    } catch (e) {}

                    updateProject(viewingBatchesProject.id, { targetBatch: newTargetBatch, targetBatches: allSelected });
                    addToast(`Updated batch allocation for "${viewingBatchesProject.title}"`, 'success');
                  }
                  setViewingBatchesProject(null);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold px-6 py-2.5 rounded-2xl shadow-md shadow-purple-500/25 transition-all text-xs cursor-pointer"
              >
                Save Batch Preferences
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Project Assignment"
        message="Are you sure you want to delete this project? This will remove it from the Student LMS feed as well."
      />
    </div>
  );
}
