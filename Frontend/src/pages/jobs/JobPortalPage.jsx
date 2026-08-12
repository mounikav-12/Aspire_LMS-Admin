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
  Briefcase,
  Plus,
  Search,
  MapPin,
  IndianRupee,
  Building2,
  Calendar,
  Send,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  Image as ImageIcon
} from 'lucide-react';

export function JobPortalPage() {
  const { jobs = [], addJob, updateJob, toggleJobLock, deleteJob, activeBatchFilter, setActiveBatchFilter } = useLmsData();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deletingJob, setDeletingJob] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    company: '',
    jobTitle: '',
    jobType: 'Full-Time / Remote',
    salary: '₹14,00,000 - ₹18,00,000 / yr',
    location: 'Bengaluru / Remote',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
    description: '',
    isLocked: false
  });

  const handleOpenAddModal = () => {
    setFormData({
      company: '',
      jobTitle: '',
      jobType: 'Full-Time / Remote',
      salary: '₹14,00,000 - ₹18,00,000 / yr',
      location: 'Bengaluru / Remote',
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
      description: '',
      isLocked: false
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      company: job.company || '',
      jobTitle: job.jobTitle || '',
      jobType: job.jobType || 'Full-Time / Remote',
      salary: job.salary || '₹14,00,000 - ₹18,00,000 / yr',
      location: job.location || '',
      logo: job.logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
      description: job.description || '',
      isLocked: !!job.isLocked
    });
  };

  const handleSaveJob = (e) => {
    e.preventDefault();
    if (!formData.company || !formData.jobTitle) {
      addToast('Please fill in company name and job title', 'error');
      return;
    }

    if (editingJob) {
      updateJob(editingJob.id, formData);
      addToast(`Updated job: "${formData.jobTitle}"`, 'success');
      setEditingJob(null);
    } else {
      addJob(formData);
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

  const handleApplyNow = (job) => {
    setApplyingJob(job);
  };

  const handleConfirmApplication = (e) => {
    e.preventDefault();
    addToast(`Application submitted successfully for ${applyingJob?.jobTitle} at ${applyingJob?.company}!`, 'success');
    setApplyingJob(null);
  };

  // Defensive Filter Logic for Job Items
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
            <Briefcase className="w-6 h-6 text-blue-600" /> Career & Job Opportunities
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Browse corporate placement openings, post company positions, and manage direct candidate applications.
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

          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAddModal}>
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
            className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
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

      {/* Job Cards Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="group bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1.5 p-6 flex flex-col justify-between h-full"
            >
              <div className="space-y-4">
                {/* Logo & Actions */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={job.logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80'}
                      alt={job.company || 'Company'}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                    />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{job.company || 'Corporate Partner'}</h4>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        <Badge variant="blue">
                          {job.jobType || 'Full-Time'}
                        </Badge>
                        {job.isLocked ? (
                          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                            <Lock className="w-3 h-3" /> Locked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                            <Unlock className="w-3 h-3" /> Unlocked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl">
                    <button
                      onClick={() => {
                        toggleJobLock(job.id);
                        addToast(
                          job.isLocked
                            ? `🔓 Position for "${job.company}" unlocked`
                            : `🔒 Position for "${job.company}" locked`,
                          'info'
                        );
                      }}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        job.isLocked
                          ? 'text-rose-600 hover:bg-rose-100/80 bg-rose-50 border border-rose-200'
                          : 'text-emerald-600 hover:bg-emerald-100/80 bg-emerald-50 border border-emerald-200'
                      }`}
                      title={job.isLocked ? "Click to Unlock Job Position" : "Click to Lock Job Position"}
                    >
                      {job.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(job)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                      title="Edit Job"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingJob(job)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                      title="Delete Job"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Job Title */}
                <div className="min-h-[2.5rem] flex items-center">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors leading-snug">
                    {job.jobTitle || 'Software Position'}
                  </h3>
                </div>

                {/* Key Metrics in Indian Rupees (₹) */}
                <div className="space-y-2.5 pt-2 text-xs font-semibold bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <IndianRupee className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="font-extrabold text-emerald-900">{job.salary || '₹14,00,000 - ₹18,00,000 / yr'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span>{job.location || 'Remote'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 font-medium">
                    <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>Posted on {job.postedDate || 'Recent'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-medium">
                  {job.description || 'Position details and candidate requirements...'}
                </p>
              </div>

              {/* Apply Button Action */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                {job.isLocked ? (
                  <Button
                    variant="secondary"
                    size="md"
                    className="w-full bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed hover:bg-slate-100 shadow-none"
                    icon={Lock}
                    onClick={() => addToast('🔒 This job position is locked for applications.', 'warning')}
                  >
                    Applications Locked
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    icon={Send}
                    onClick={() => handleApplyNow(job)}
                  >
                    Apply Now
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Job Postings Found"
          description="Create job openings to help students launch their tech careers."
          actionLabel="Post Job"
          onAction={handleOpenAddModal}
        />
      )}

      {/* Add / Edit Job Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingJob}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingJob(null);
        }}
        title={editingJob ? 'Edit Job Opening' : 'Post New Job Opening'}
        subtitle="Specify company, logo URL, salary range in Indian Rupees (₹), location, and requirements"
      >
        <form onSubmit={handleSaveJob} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Company Name"
              icon={Building2}
              placeholder="e.g. Stripe, Datadog"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />

            <Input
              label="Job Title"
              placeholder="e.g. Senior Frontend Developer"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Job Type"
              value={formData.jobType}
              onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
              options={[
                { value: 'Full-Time / Remote', label: 'Full-Time / Remote' },
                { value: 'Full-Time', label: 'Full-Time (Onsite)' },
                { value: 'Contract / Remote', label: 'Contract / Remote' },
                { value: 'Internship', label: 'Internship' }
              ]}
            />

            <Input
              label="Salary Range (in Indian Rupees ₹)"
              icon={IndianRupee}
              placeholder="₹12,00,000 - ₹18,00,000 / yr"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Location"
              icon={MapPin}
              placeholder="Bengaluru, Hyderabad, or Remote"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />

            <Select
              label="Lock Status (Access Control)"
              value={formData.isLocked ? 'locked' : 'unlocked'}
              onChange={(e) => setFormData({ ...formData, isLocked: e.target.value === 'locked' })}
              options={[
                { value: 'unlocked', label: '🔓 Unlocked (Open for Applications)' },
                { value: 'locked', label: '🔒 Locked (Applications Closed)' }
              ]}
            />
          </div>

          <Input
            label="Company Logo Image URL"
            icon={ImageIcon}
            placeholder="https://images.unsplash.com/photo-xxx"
            value={formData.logo}
            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
            helperText="Optional image URL for company logo icon"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 tracking-wider uppercase">
              Job Description & Requirements
            </label>
            <textarea
              rows={3}
              placeholder="Detail position duties, tech stack expectations..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-2xs"
              required
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
            <Button type="submit" variant="primary">
              {editingJob ? 'Save Job' : 'Post Job'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Apply Drawer / Modal */}
      <Modal
        isOpen={!!applyingJob}
        onClose={() => setApplyingJob(null)}
        title={`Apply for ${applyingJob?.jobTitle}`}
        subtitle={`at ${applyingJob?.company}`}
      >
        <form onSubmit={handleConfirmApplication} className="space-y-4">
          <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-100 text-xs space-y-1">
            <p className="font-extrabold text-blue-900">{applyingJob?.jobTitle}</p>
            <p className="text-blue-700 font-semibold">{applyingJob?.salary} • {applyingJob?.location}</p>
          </div>

          <Input label="Your Resume Link / Portfolio" placeholder="https://github.com/myusername" required />
          <Input label="Cover Note / Pitch" placeholder="Brief note about why you're a great fit..." />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setApplyingJob(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Send}>
              Submit Application
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
