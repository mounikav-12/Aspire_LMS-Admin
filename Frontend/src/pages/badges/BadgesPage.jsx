import React, { useState } from 'react';
import {
  Award,
  Trophy,
  Star,
  Zap,
  Medal,
  Shield,
  Target,
  Flame,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Sparkles,
  UserCheck,
  Layers,
  Clock,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useLmsData } from '../../context/LmsDataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/common/Modal';
import { Input, Select } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

const ICON_MAP = {
  Award,
  Trophy,
  Star,
  Zap,
  Medal,
  Shield,
  Target,
  Flame
};

const COLOR_THEMES = {
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    iconBg: 'bg-purple-600 text-white',
    badge: 'bg-purple-100 text-purple-800'
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    iconBg: 'bg-emerald-600 text-white',
    badge: 'bg-emerald-100 text-emerald-800'
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    iconBg: 'bg-amber-500 text-white',
    badge: 'bg-amber-100 text-amber-800'
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    iconBg: 'bg-blue-600 text-white',
    badge: 'bg-blue-100 text-blue-800'
  },
  indigo: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    iconBg: 'bg-indigo-600 text-white',
    badge: 'bg-indigo-100 text-indigo-800'
  },
  rose: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    iconBg: 'bg-rose-600 text-white',
    badge: 'bg-rose-100 text-rose-800'
  }
};

export function BadgesPage() {
  const { badges = [], addBadge, updateBadge, deleteBadge, students = [] } = useLmsData();
  const { isSuperAdmin, currentRole } = useAuth();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [awardModalBadge, setAwardModalBadge] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Skill',
    icon: 'Award',
    color: 'purple',
    criteria: '',
    points: '100 XP',
    targetBatch: 'ALL BATCHES'
  });

  const handleOpenAddModal = () => {
    setEditingBadge(null);
    setFormData({
      name: '',
      description: '',
      category: 'Skill',
      icon: 'Award',
      color: 'purple',
      criteria: '',
      points: '100 XP',
      targetBatch: 'ALL BATCHES'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (badge) => {
    setEditingBadge(badge);
    setFormData({
      name: badge.name || '',
      description: badge.description || '',
      category: badge.category || 'Skill',
      icon: badge.icon || 'Award',
      color: badge.color || 'purple',
      criteria: badge.criteria || '',
      points: badge.points || '100 XP',
      targetBatch: badge.targetBatch || 'ALL BATCHES'
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Badge name is required', 'error');
      return;
    }

    if (editingBadge) {
      await updateBadge(editingBadge.id, formData);
      addToast(`Updated badge "${formData.name}"`, 'success');
    } else {
      await addBadge(formData);
      addToast(`Created new badge "${formData.name}"`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDeleteBadge = async () => {
    if (deleteConfirmId) {
      await deleteBadge(deleteConfirmId);
      addToast('Badge deleted successfully', 'info');
      setDeleteConfirmId(null);
    }
  };

  const handleAwardSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) {
      addToast('Please select a student to award the badge', 'error');
      return;
    }
    const targetStud = students.find((s) => s.id === selectedStudentId);
    addToast(`Awarded badge "${awardModalBadge?.name}" to ${targetStud?.name || 'Student'}!`, 'success');
    setAwardModalBadge(null);
    setSelectedStudentId('');
  };

  // Filter Logic
  const filteredBadges = badges.filter((b) => {
    const query = searchTerm.toLowerCase();
    const name = (b.name || '').toLowerCase();
    const desc = (b.description || '').toLowerCase();
    const matchesSearch = name.includes(query) || desc.includes(query);
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Academic', 'Skill', 'Achievement', 'Milestone'];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Milestone Rewards & Badges</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Badges Portal
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
            Create, manage, and award skill badges to recognize student achievements, project milestones, and course completions.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={handleOpenAddModal}
          className="relative z-10 bg-purple-600 hover:bg-purple-500 text-white font-extrabold shadow-lg shadow-purple-600/30 border border-purple-400/40 cursor-pointer"
        >
          Create New Badge
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block leading-tight">{badges.length}</span>
            <span className="text-xs font-bold text-slate-500">Total Badges</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block leading-tight">
              {new Set(badges.map((b) => b.category)).size}
            </span>
            <span className="text-xs font-bold text-slate-500">Active Categories</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block leading-tight">
              {badges.reduce((acc, b) => acc + (parseInt(b.points) || 100), 0)} XP
            </span>
            <span className="text-xs font-bold text-slate-500">Total XP Pool</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 flex-shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block leading-tight">
              {students.length}
            </span>
            <span className="text-xs font-bold text-slate-500">Eligible Students</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search badge name or criteria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBadges.map((badge) => {
          const IconComp = ICON_MAP[badge.icon] || Award;
          const theme = COLOR_THEMES[badge.color] || COLOR_THEMES.purple;

          return (
            <div
              key={badge.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between space-y-4 group"
            >
              <div>
                {/* Header: Icon, Name & Category */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${theme.iconBg}`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-tight group-hover:text-purple-700 transition-colors">
                        {badge.name}
                      </h3>
                      <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${theme.badge}`}>
                        {badge.category}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-black border border-slate-200">
                    {badge.points || '100 XP'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                  {badge.description}
                </p>

                {/* Criteria */}
                {badge.criteria && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Requirement Criteria</span>
                    <p className="text-slate-700 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                      <span>{badge.criteria}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setAwardModalBadge(badge)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Award Badge</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(badge)}
                    className="p-2 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Edit Badge"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(badge.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Badge"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredBadges.length === 0 && (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <Award className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No badges found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create custom achievement badges to reward students on the LMS platform.
            </p>
            <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAddModal}>
              Create First Badge
            </Button>
          </div>
        )}
      </div>

      {/* Add / Edit Badge Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBadge ? 'Edit Badge' : 'Create New Skill Badge'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Badge Name"
            type="text"
            placeholder="e.g. Python Master"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'Academic', label: 'Academic' },
                { value: 'Skill', label: 'Skill' },
                { value: 'Achievement', label: 'Achievement' },
                { value: 'Milestone', label: 'Milestone' }
              ]}
            />

            <Select
              label="Badge Icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              options={[
                { value: 'Award', label: 'Award Ribbon' },
                { value: 'Trophy', label: 'Trophy Cup' },
                { value: 'Star', label: 'Star' },
                { value: 'Zap', label: 'Zap Lightning' },
                { value: 'Medal', label: 'Medal' },
                { value: 'Shield', label: 'Shield' },
                { value: 'Target', label: 'Target Bullseye' },
                { value: 'Flame', label: 'Flame Energy' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Theme Color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              options={[
                { value: 'purple', label: 'Purple' },
                { value: 'emerald', label: 'Emerald Green' },
                { value: 'amber', label: 'Amber Gold' },
                { value: 'blue', label: 'Royal Blue' },
                { value: 'indigo', label: 'Indigo' },
                { value: 'rose', label: 'Rose Red' }
              ]}
            />

            <Input
              label="XP Reward Value"
              type="text"
              placeholder="e.g. 150 XP"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: e.target.value })}
            />
          </div>

          <Input
            label="Requirement Criteria"
            type="text"
            placeholder="e.g. Score >= 90% in Stage 2 Python Assessment"
            value={formData.criteria}
            onChange={(e) => setFormData({ ...formData, criteria: e.target.value })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
              Badge Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of what this badge recognizes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingBadge ? 'Save Badge' : 'Publish Badge'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Award Badge Modal */}
      <Modal
        isOpen={!!awardModalBadge}
        onClose={() => setAwardModalBadge(null)}
        title={`Award "${awardModalBadge?.name}" Badge`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAwardSubmit} className="space-y-4">
          <p className="text-xs text-slate-600 font-medium">
            Select a student to award this badge to. The badge will appear in the student's profile & LMS portal.
          </p>

          <Select
            label="Select Student"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            options={[
              { value: '', label: '-- Choose Student --' },
              ...students.map((s) => ({ value: s.id, label: `${s.name} (${s.email})` }))
            ]}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setAwardModalBadge(null)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" icon={Award}>
              Award Badge Now
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Delete Badge"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Are you sure you want to delete this badge? This action will remove it from the catalog.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="danger" type="button" onClick={handleDeleteBadge}>
              Delete Badge
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
