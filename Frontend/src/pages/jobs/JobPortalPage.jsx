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
  Eye,
  CheckSquare,
  Square,
  Briefcase,
  Plus,
  Search,
  MapPin,
  Banknote,
  Building2,
  Calendar,
  Send,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  Users,
  Check,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  X,
  Image as ImageIcon
} from 'lucide-react';

export function JobPortalPage() {
  const { jobs = [], addJob, updateJob, toggleJobLock, deleteJob, availableBatches = [] } = useLmsData();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deletingJob, setDeletingJob] = useState(null);
  const [viewingJob, setViewingJob] = useState(null);
  const [viewingBatchesJob, setViewingBatchesJob] = useState(null);
  const [eyeActiveTab, setEyeActiveTab] = useState('Weekdays');
  const [selectedWeekdayBatches, setSelectedWeekdayBatches] = useState([]);
  const [selectedWeekendBatches, setSelectedWeekendBatches] = useState([]);

  const handleOpenEyeModal = (job) => {
    setViewingBatchesJob(job);
    setEyeActiveTab('Weekdays');
    try {
      const savedWd = localStorage.getItem(`aspire_lms_job_wd_${job.id}`);
      setSelectedWeekdayBatches(savedWd ? JSON.parse(savedWd) : []);
      const savedWe = localStorage.getItem(`aspire_lms_job_we_${job.id}`);
      setSelectedWeekendBatches(savedWe ? JSON.parse(savedWe) : []);
    } catch (e) {
      setSelectedWeekdayBatches([]);
      setSelectedWeekendBatches([]);
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    company: 'TCS',
    jobTitle: 'Python Developer',
    location: 'Hyderabad, India',
    salary: '4–7 LPA',
    openings: 3,
    deadline: 'Sep 30, 2026',
    statusBadge: 'APPLY NOW',
    jobType: 'Full-Time / Remote',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    description: 'TCS is hiring a Python Developer to join our high-impact engineering team. You will design, develop, and optimize core features, collaborate with senior architects, and ship scalable production code.',
    responsibilities: 'Architect and maintain clean, scalable web components and API integrations.\nWrite automated unit/integration tests and participate in technical peer code reviews.\nCollaborate closely with UI/UX designers, product managers, and backend engineers.\nOptimize web performance, rendering latency, and SEO metrics.',
    techStack: 'Python, Django, AWS, DSA',
    perks: 'Competitive ESOP packages, health insurance coverage, remote work options, learning allowance, and hardware equipment.',
    isLocked: false
  });

  const handleOpenAddModal = () => {
    setFormData({
      company: '',
      jobTitle: '',
      location: 'Hyderabad, India',
      salary: '4–7 LPA',
      openings: 3,
      deadline: 'Sep 30, 2026',
      statusBadge: 'APPLY NOW',
      jobType: 'Full-Time / Remote',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      description: '',
      responsibilities: 'Architect and maintain clean, scalable web components and API integrations.\nWrite automated unit/integration tests and participate in technical peer code reviews.\nCollaborate closely with UI/UX designers, product managers, and backend engineers.',
      techStack: 'Python, Django, AWS, DSA',
      perks: 'Competitive ESOP packages, health insurance coverage, remote work options, learning allowance, and hardware equipment.',
      isLocked: false
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      company: job.company || '',
      jobTitle: job.jobTitle || job.title || '',
      location: job.location || '',
      salary: job.salary || job.package || '4–7 LPA',
      openings: job.openings || 3,
      deadline: job.deadline || 'Sep 30, 2026',
      statusBadge: job.statusBadge || job.status || 'APPLY NOW',
      jobType: job.jobType || 'Full-Time / Remote',
      logo: job.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      description: job.description || '',
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : (job.responsibilities || ''),
      techStack: Array.isArray(job.techStack) ? job.techStack.join(', ') : (job.techStack || ''),
      perks: job.perks || '',
      isLocked: !!job.isLocked
    });
  };

  const handleSaveJob = (e) => {
    e.preventDefault();
    if (!formData.company || !formData.jobTitle) {
      addToast('Please fill in company name and job title', 'error');
      return;
    }

    const formattedPayload = {
      ...formData,
      responsibilities: typeof formData.responsibilities === 'string'
        ? formData.responsibilities.split('\n').filter(Boolean)
        : formData.responsibilities,
      techStack: typeof formData.techStack === 'string'
        ? formData.techStack.split(',').map(s => s.trim()).filter(Boolean)
        : formData.techStack
    };

    if (editingJob) {
      updateJob(editingJob.id, formattedPayload);
      addToast(`Updated job: "${formData.jobTitle}"`, 'success');
      setEditingJob(null);
    } else {
      addJob(formattedPayload);
      addToast(`Job opening posted for ${formData.company}!`, 'success');
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingJob) {
      deleteJob(deletingJob.id);
      addToast(`Removed job opening for ${deletingJob.company}`, 'info');
      setDeletingJob(null);
    }
  };

  const handleOpenViewModal = (job) => {
    setViewingJob(job);
  };

  const handleConfirmApplication = (e) => {
    e.preventDefault();
    addToast(`Application submitted successfully for ${viewingJob?.jobTitle || viewingJob?.title} at ${viewingJob?.company}!`, 'success');
    setViewingJob(null);
  };

  // Filter Logic for Job Items
  const filteredJobs = jobs.filter((j) => {
    if (!j) return false;
    const title = (j.jobTitle || j.title || '').toLowerCase();
    const company = (j.company || '').toLowerCase();
    const location = (j.location || '').toLowerCase();
    const jobType = (j.jobType || j.type || '').toLowerCase();
    const query = (searchTerm || '').toLowerCase();

    const matchesSearch = title.includes(query) || company.includes(query) || location.includes(query);
    const matchesType = jobTypeFilter === 'ALL' || jobType.includes(jobTypeFilter.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'UNLOCKED' && !j.isLocked) ||
      (statusFilter === 'LOCKED' && !!j.isLocked);

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-normal text-slate-900 flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-purple-600" /> Career & Job Opportunities
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Browse corporate placement openings, post company positions, and manage candidate applications for students.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAddModal} className="bg-purple-600 hover:bg-purple-700 border-purple-600">
            Post New Job
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by company, job title, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all"
          />
        </div>

        <div className="w-full md:w-48">
          <Select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Job Types' },
              { value: 'Full-Time', label: 'Full-Time' },
              { value: 'Remote', label: 'Remote Only' },
              { value: 'Contract', label: 'Contract' }
            ]}
          />
        </div>

        <div className="w-full md:w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'UNLOCKED', label: '🔓 Unlocked Only' },
              { value: 'LOCKED', label: '🔒 Locked Only' }
            ]}
          />
        </div>
      </div>

      {/* Job Cards Grid Matching Student LMS UI Image 1 */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const companyName = job.company || 'TCS';
            const title = job.jobTitle || job.title || 'Python Developer';
            const location = job.location || 'Hyderabad, India';
            const salary = job.salary || job.package || '4–7 LPA';
            const openings = job.openings !== undefined ? job.openings : 3;
            const deadline = job.deadline || 'Sep 30, 2026';
            const statusBadge = job.statusBadge || job.status || 'APPLY NOW';

            return (
              <div
                key={job.id}
                onClick={() => handleOpenViewModal(job)}
                className="group bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:border-purple-300 transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col justify-between h-full cursor-pointer relative"
              >
                <div>
                  {/* Top Header Row: Company & Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400 font-extrabold text-xs tracking-wider uppercase">
                      {companyName}
                    </span>
                    <span className="bg-emerald-100/90 text-emerald-700 font-bold px-3 py-1 rounded-full text-[10px] tracking-wider uppercase shadow-2xs">
                      {statusBadge}
                    </span>
                  </div>

                  {/* Job Title */}
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-purple-600 transition-colors mt-2.5 leading-snug">
                    {title}
                  </h3>

                  {/* 2-Column Info Details Grid */}
                  <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 my-5 text-xs font-semibold text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span className="truncate">{location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span className="font-extrabold text-slate-900 truncate">{salary}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span>Openings: {openings}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span className="truncate">Apply by {deadline}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  {/* Admin Quick Action Controls */}
                  <div
                    className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenEyeModal(job)}
                      className="p-1.5 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                      title="View & Select Job Batches"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        toggleJobLock(job.id);
                        addToast(
                          job.isLocked
                            ? `🔓 Position for "${companyName}" unlocked`
                            : `🔒 Position for "${companyName}" locked`,
                          'info'
                        );
                      }}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        job.isLocked
                          ? 'text-rose-600 hover:bg-rose-100/80 bg-rose-50 border border-rose-200'
                          : 'text-emerald-600 hover:bg-emerald-100/80 bg-emerald-50 border border-emerald-200'
                      }`}
                      title={job.isLocked ? "Unlock Job" : "Lock Job"}
                    >
                      {job.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(job)}
                      className="p-1.5 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                      title="Edit Job Opening"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingJob(job)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                      title="Delete Job Opening"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Apply Action Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenViewModal(job);
                    }}
                    className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-5 py-2.5 rounded-2xl transition-all shadow-md cursor-pointer ${
                      job.isLocked
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-none'
                        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/25 hover:shadow-lg'
                    }`}
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No Job Postings Found"
          description="Create job openings to help students launch their tech careers."
          actionLabel="Post Job"
          onAction={handleOpenAddModal}
        />
      )}

      {/* --- STUDENT LMS JOB DETAILS MODAL POPUP (MATCHING IMAGE 2) --- */}
      <Modal
        isOpen={!!viewingJob}
        onClose={() => setViewingJob(null)}
        maxWidth="max-w-2xl"
      >
        {viewingJob && (
          <div className="space-y-6">
            {/* Modal Header Row with Logo & Status */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl border border-slate-200 bg-white flex items-center justify-center font-black text-slate-900 text-base shadow-2xs overflow-hidden flex-shrink-0">
                  {viewingJob.logo ? (
                    <img src={viewingJob.logo} alt={viewingJob.company} className="w-full h-full object-cover" />
                  ) : (
                    <span>{(viewingJob.company || 'TCS').slice(0, 3).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-extrabold text-xs tracking-wider uppercase">
                      {viewingJob.company || 'TCS'}
                    </span>
                    <span className="bg-emerald-100 text-emerald-700 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] uppercase">
                      {viewingJob.statusBadge || viewingJob.status || 'APPLY NOW'}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mt-0.5">
                    {viewingJob.jobTitle || viewingJob.title || 'Python Developer'}
                  </h2>
                </div>
              </div>
            </div>

            {/* Top Metrics Grid Container Banner */}
            <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">LOCATION</span>
                <span className="font-bold text-slate-900 mt-0.5 block truncate">{viewingJob.location || 'Hyderabad, India'}</span>
              </div>

              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">PACKAGE</span>
                <span className="font-extrabold text-purple-600 mt-0.5 block">{viewingJob.salary || viewingJob.package || '4–7 LPA'}</span>
              </div>

              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">OPENINGS</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{viewingJob.openings !== undefined ? viewingJob.openings : 3} Positions</span>
              </div>

              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">DEADLINE</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{viewingJob.deadline || 'Sep 30, 2026'}</span>
              </div>
            </div>

            {/* Section 1: Role Description & Overview */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                ROLE DESCRIPTION & OVERVIEW
              </h4>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                {viewingJob.description || `${viewingJob.company || 'TCS'} is hiring a ${viewingJob.jobTitle || 'Python Developer'} to join our high-impact engineering team. You will design, develop, and optimize core features, collaborate with senior architects, and ship scalable production code.`}
              </p>
            </div>

            {/* Section 2: Key Responsibilities */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                KEY RESPONSIBILITIES
              </h4>
              <ul className="space-y-2 text-xs md:text-sm text-slate-700 font-medium">
                {(Array.isArray(viewingJob.responsibilities) && viewingJob.responsibilities.length > 0
                  ? viewingJob.responsibilities
                  : [
                      'Architect and maintain clean, scalable web components and API integrations.',
                      'Write automated unit/integration tests and participate in technical peer code reviews.',
                      'Collaborate closely with UI/UX designers, product managers, and backend engineers.',
                      'Optimize web performance, rendering latency, and SEO metrics.'
                    ]
                ).map((resp, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 3: Required Tech Stack & Skills */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                REQUIRED TECH STACK & SKILLS
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                {(Array.isArray(viewingJob.techStack) && viewingJob.techStack.length > 0
                  ? viewingJob.techStack
                  : ['Python', 'Django', 'AWS', 'DSA']
                ).map((tech, idx) => (
                  <span
                    key={idx}
                    className="bg-purple-50/80 text-purple-700 border border-purple-100/90 rounded-xl px-4 py-1.5 font-bold text-xs shadow-2xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Section 4: Company Perks & Benefits Box */}
            <div className="bg-purple-50/50 border border-purple-100/90 rounded-2xl p-4 space-y-1">
              <h5 className="text-xs font-extrabold text-purple-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Company Perks & Benefits</span>
              </h5>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {viewingJob.perks || 'Competitive ESOP packages, health insurance coverage, remote work options, learning allowance, and hardware equipment.'}
              </p>
            </div>

            {/* Modal Action Footer */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <Button variant="outline" size="md" onClick={() => setViewingJob(null)}>
                Close
              </Button>

              <Button
                variant="primary"
                size="md"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white border-purple-600 font-extrabold py-3"
                icon={Sparkles}
                onClick={handleConfirmApplication}
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* --- PAGE-LEVEL EYE SYMBOL BATCH SELECTION MODAL POPUP --- */}
      <Modal
        isOpen={!!viewingBatchesJob}
        onClose={() => setViewingBatchesJob(null)}
        title={`${viewingBatchesJob?.company || ''} ${viewingBatchesJob?.jobTitle || viewingBatchesJob?.title || ''}`}
        subtitle="View and multi-select active Weekday and Weekend batch numbers for this job position"
        maxWidth="max-w-xl"
      >
        <div className="space-y-5">
          {/* In-Popup Tabs matching uploaded image */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setEyeActiveTab('Weekdays')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                eyeActiveTab === 'Weekdays'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200/80 font-bold'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Weekday Batches</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                eyeActiveTab === 'Weekdays' ? 'bg-purple-700/90 text-white' : 'bg-slate-200/90 text-slate-800'
              }`}>
                {selectedWeekdayBatches.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setEyeActiveTab('Weekends')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                eyeActiveTab === 'Weekends'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200/80 font-bold'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Weekend Batches</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                eyeActiveTab === 'Weekends' ? 'bg-purple-700/90 text-white' : 'bg-slate-200/90 text-slate-800'
              }`}>
                {selectedWeekendBatches.length}
              </span>
            </button>
          </div>

          <div className="border-t border-slate-100 my-2"></div>

          {/* Weekdays Tab Batch Checkboxes */}
          {eyeActiveTab === 'Weekdays' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-semibold">
                Check or uncheck Weekday batch numbers for this job position:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {((availableBatches && availableBatches.length > 0 ? availableBatches : ['A26W1', 'A26W2', 'A26W3', 'A26W4']).filter(b => b.startsWith('A26W') && !b.startsWith('A26S') && !b.startsWith('A26WE'))).map((bCode) => {
                  const isSelected = selectedWeekdayBatches.includes(bCode);

                  return (
                    <div
                      key={bCode}
                      onClick={() => {
                        setSelectedWeekdayBatches((prev) => {
                          const next = prev.includes(bCode) ? prev.filter((b) => b !== bCode) : [...prev, bCode];
                          if (viewingBatchesJob) {
                            try { localStorage.setItem(`aspire_lms_job_wd_${viewingBatchesJob.id}`, JSON.stringify(next)); } catch (e) {}
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
            /* Weekends Tab Batch Checkboxes */
            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-semibold">
                Check or uncheck Weekend batch numbers for this job position:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {((availableBatches && availableBatches.length > 0 ? availableBatches.map(b => b.replace(/^A26WE/, 'A26S')) : ['A26S1', 'A26S2', 'A26S3', 'A26S4']).filter((b, i, arr) => (b.startsWith('A26S') || b.startsWith('A26WE')) && arr.indexOf(b) === i)).map((bCode) => {
                  const isSelected = selectedWeekendBatches.includes(bCode);

                  return (
                    <div
                      key={bCode}
                      onClick={() => {
                        setSelectedWeekendBatches((prev) => {
                          const next = prev.includes(bCode) ? prev.filter((b) => b !== bCode) : [...prev, bCode];
                          if (viewingBatchesJob) {
                            try { localStorage.setItem(`aspire_lms_job_we_${viewingBatchesJob.id}`, JSON.stringify(next)); } catch (e) {}
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
                if (viewingBatchesJob) {
                  let newTargetBatch = 'All Batches';
                  const allSelected = [...selectedWeekdayBatches, ...selectedWeekendBatches];
                  if (allSelected.length > 0) {
                    newTargetBatch = allSelected.join(', ');
                  }

                  try {
                    localStorage.setItem(`aspire_lms_job_wd_${viewingBatchesJob.id}`, JSON.stringify(selectedWeekdayBatches));
                    localStorage.setItem(`aspire_lms_job_we_${viewingBatchesJob.id}`, JSON.stringify(selectedWeekendBatches));
                  } catch (e) {}

                  updateJob(viewingBatchesJob.id, { targetBatch: newTargetBatch });
                  addToast(`Updated batch allocation for "${viewingBatchesJob.company}"`, 'success');
                }
                setViewingBatchesJob(null);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold px-6 py-2.5 rounded-2xl shadow-md shadow-purple-500/25 transition-all text-xs cursor-pointer"
            >
              Save Batch Preferences
            </button>
          </div>
        </div>
      </Modal>

      {/* --- ADD / EDIT JOB MODAL FORM --- */}
      <Modal
        isOpen={isAddModalOpen || !!editingJob}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingJob(null);
        }}
        title={editingJob ? 'Edit Job Opening' : 'Post New Job Opening'}
        subtitle="Configure company details, package range, location, openings, tech stack, and responsibilities"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSaveJob} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Row 1: Company Name & Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              icon={Building2}
              placeholder="e.g. Stripe, TCS"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />

            <Input
              label="Job Title"
              placeholder="e.g. Senior Frontend Engineer"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              required
            />
          </div>

          {/* Row 2: Location & Package / Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location"
              icon={MapPin}
              placeholder="e.g. Hyderabad, India / Remote"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />

            <Input
              label="Package / Salary"
              icon={Banknote}
              placeholder="e.g. 4–7 LPA"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              required
            />
          </div>

          {/* Row 3: Openings Count & Application Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Openings Count"
              type="number"
              icon={Users}
              placeholder="e.g. 3"
              value={formData.openings}
              onChange={(e) => setFormData({ ...formData, openings: parseInt(e.target.value) || 1 })}
              required
            />

            <Input
              label="Application Deadline"
              icon={Calendar}
              placeholder="e.g. Sep 30, 2026"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          {/* Row 4: Status Badge Text & Lock Access */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Status Badge Text"
              placeholder="e.g. APPLY NOW"
              value={formData.statusBadge}
              onChange={(e) => setFormData({ ...formData, statusBadge: e.target.value })}
            />

            <Select
              label="Lock Access"
              value={formData.isLocked ? 'locked' : 'unlocked'}
              onChange={(e) => setFormData({ ...formData, isLocked: e.target.value === 'locked' })}
              options={[
                { value: 'unlocked', label: '🔓 Unlocked (Open for Applications)' },
                { value: 'locked', label: '🔒 Locked (Applications Closed)' }
              ]}
            />
          </div>

          {/* Row 5: Tech Stack & Logo URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tech Stack (Comma Separated)"
              icon={Sparkles}
              placeholder="e.g. Python, Django, AWS, DSA"
              value={formData.techStack}
              onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
            />

            <Input
              label="Company Logo Image URL"
              icon={ImageIcon}
              placeholder="https://images.unsplash.com/photo-xxx"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
            />
          </div>

          {/* Row 6: Role Description & Overview */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 tracking-wider uppercase">
              Role Description & Overview
            </label>
            <textarea
              rows={3}
              placeholder="TCS is hiring a Python Developer to join our high-impact engineering team..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all shadow-2xs leading-relaxed"
              required
            />
          </div>

          {/* Row 7: Key Responsibilities */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 tracking-wider uppercase">
              Key Responsibilities (One per line)
            </label>
            <textarea
              rows={4}
              placeholder="Architect and maintain clean, scalable web components...\nWrite automated unit tests..."
              value={formData.responsibilities}
              onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all shadow-2xs font-mono leading-relaxed"
            />
          </div>

          {/* Row 8: Company Perks & Benefits */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 tracking-wider uppercase">
              Company Perks & Benefits
            </label>
            <Input
              placeholder="Competitive ESOP packages, health insurance coverage..."
              value={formData.perks}
              onChange={(e) => setFormData({ ...formData, perks: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingJob(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="bg-purple-600 hover:bg-purple-700 border-purple-600">
              {editingJob ? 'Save Job' : 'Post Job'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingJob}
        onClose={() => setDeletingJob(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Position"
        message={`Are you sure you want to remove job opening for ${deletingJob?.company}?`}
        confirmText="Delete Job"
      />
    </div>
  );
}
