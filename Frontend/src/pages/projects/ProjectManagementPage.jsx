import React, { useState } from 'react';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
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
  MessageSquare,
  Star,
  ExternalLink,
  Code2,
  Trash2,
  Edit3,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  Send,
  Layers,
  BookOpen
} from 'lucide-react';

export function ProjectManagementPage() {
  const { projects, addProject, updateProject, deleteProject, gradeSubmission } = useLmsData();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('assigned'); // 'assigned' | 'submitted' | 'feedback' | 'templates'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Grade Modal State
  const [gradingSubmission, setGradingSubmission] = useState(null); // { projectId, submission }
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'Mini',
    category: 'Full-Stack Web Dev',
    difficulty: 'Intermediate',
    description: '',
    techStack: 'React, Node.js, PostgreSQL',
    dueDate: 'Due Aug 25',
    templateUrl: 'https://github.com/aspire-lms/starter-repo',
    guidelines: 'Include clear setup instructions and clean code formatting.'
  });

  // Calculate Overall Metrics matching screenshot
  const totalAssigned = projects.reduce((acc, p) => acc + (p.assignedCount || 1), 0);
  const totalSubmitted = projects.reduce((acc, p) => acc + (p.submittedCount || 0), 0);
  const totalFeedback = projects.reduce((acc, p) => acc + (p.feedbackCount || 0), 0);
  const gradedProjects = projects.filter((p) => p.avgGrade > 0);
  const overallAvgGrade = gradedProjects.length > 0
    ? Math.round(gradedProjects.reduce((acc, p) => acc + p.avgGrade, 0) / gradedProjects.length)
    : 89;

  // Filter projects
  const filteredProjects = projects.filter((proj) => {
    const matchesSearch =
      proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.techStack.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'All' || (proj.type || 'Mini') === selectedType;
    const matchesCategory = selectedCategory === 'All' || proj.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || proj.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === 'All' || proj.status === selectedStatus;

    return matchesSearch && matchesType && matchesCategory && matchesDifficulty && matchesStatus;
  });

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      type: 'Mini',
      category: 'Full-Stack Web Dev',
      difficulty: 'Intermediate',
      description: '',
      techStack: 'React, Node.js, PostgreSQL',
      dueDate: 'Due Aug 25',
      templateUrl: 'https://github.com/aspire-lms/starter-repo',
      guidelines: 'Include clean commits and unit tests.'
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (proj) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title,
      type: proj.type || 'Mini',
      category: proj.category,
      difficulty: proj.difficulty,
      description: proj.description,
      techStack: proj.techStack.join(', '),
      dueDate: proj.dueDate,
      templateUrl: proj.templateUrl || '',
      guidelines: proj.guidelines || ''
    });
    setIsCreateModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      addToast('Please fill in title and description', 'error');
      return;
    }

    const formattedTechStack = formData.techStack
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editingProject) {
      await updateProject(editingProject.id, {
        title: formData.title,
        type: formData.type,
        category: formData.category,
        difficulty: formData.difficulty,
        description: formData.description,
        techStack: formattedTechStack,
        dueDate: formData.dueDate,
        templateUrl: formData.templateUrl,
        guidelines: formData.guidelines
      });
      addToast(`Updated project: "${formData.title}"`, 'success');
    } else {
      await addProject({
        title: formData.title,
        type: formData.type,
        category: formData.category,
        difficulty: formData.difficulty,
        description: formData.description,
        techStack: formattedTechStack,
        dueDate: formData.dueDate,
        templateUrl: formData.templateUrl,
        guidelines: formData.guidelines
      });
      addToast(`Published new project: "${formData.title}"`, 'success');
    }

    setIsCreateModalOpen(false);
  };

  const handleDelete = async () => {
    if (deleteConfirmId) {
      await deleteProject(deleteConfirmId);
      addToast('Project assignment deleted', 'info');
      setDeleteConfirmId(null);
    }
  };

  const handleOpenGradeModal = (projectId, submission) => {
    setGradingSubmission({ projectId, submission });
    setGradeInput(submission.grade || 85);
    setFeedbackInput(submission.mentorFeedback || '');
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    await gradeSubmission(
      gradingSubmission.projectId,
      gradingSubmission.submission.id,
      gradeInput,
      feedbackInput
    );
    addToast(`Saved feedback & grade for ${gradingSubmission.submission.studentName}`, 'success');
    setGradingSubmission(null);
  };

  // Helper for project type badge
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
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200/60">
            Major
          </span>
        );
      case 'Mini':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200/60">
            Mini
          </span>
        );
    }
  };

  // Helper for difficulty badge styling matching screenshot
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
          {filteredProjects.map((proj) => (
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
                  <Button
                    variant="primary"
                    size="sm"
                    className="px-4 py-1.5 rounded-xl font-bold bg-slate-900 hover:bg-blue-600 text-white transition-all shadow-md"
                    onClick={() => setActiveTab('submitted')}
                  >
                    Start <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

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
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Project Title"
            type="text"
            placeholder="e.g. E-commerce Platform"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Project Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { value: 'Mini', label: 'Mini' },
                { value: 'Major', label: 'Major' },
                { value: 'Capstone', label: 'Capstone' }
              ]}
            />

            <Select
              label="Track / Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'Full-Stack Web Dev', label: 'Full-Stack Web Dev' },
                { value: 'AI & Machine Learning', label: 'AI & Machine Learning' },
                { value: 'Frontend Systems', label: 'Frontend Systems' },
                { value: 'Backend & DevOps', label: 'Backend & DevOps' }
              ]}
            />

            <Select
              label="Difficulty Level"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              options={[
                { value: 'Beginner', label: 'Beginner' },
                { value: 'Intermediate', label: 'Intermediate' },
                { value: 'Advanced', label: 'Advanced' }
              ]}
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
              Project Description
            </label>
            <textarea
              rows={3}
              placeholder="Build a complete e-commerce platform with cart, checkout, and admin dashboard."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
              required
            />
          </div>

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
