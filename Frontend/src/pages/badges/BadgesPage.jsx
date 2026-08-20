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
  Crown,
  Gem,
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
  BookOpen,
  Filter,
  Check,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  Lock,
  Unlock,
  GraduationCap
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
  Flame,
  Crown,
  Gem
};

const COLOR_THEMES = {
  blue: {
    bg: 'bg-blue-50/70 hover:bg-blue-50',
    border: 'border-blue-200/80 hover:border-blue-400',
    text: 'text-blue-700',
    iconGradient: 'from-blue-600 to-indigo-600 text-white shadow-blue-500/25 ring-blue-500/10',
    badge: 'bg-blue-100/80 text-blue-800 border-blue-200',
    accent: 'bg-blue-600'
  },
  indigo: {
    bg: 'bg-indigo-50/70 hover:bg-indigo-50',
    border: 'border-indigo-200/80 hover:border-indigo-400',
    text: 'text-indigo-700',
    iconGradient: 'from-indigo-600 to-violet-600 text-white shadow-indigo-500/25 ring-indigo-500/10',
    badge: 'bg-indigo-100/80 text-indigo-800 border-indigo-200',
    accent: 'bg-indigo-600'
  },
  emerald: {
    bg: 'bg-emerald-50/70 hover:bg-emerald-50',
    border: 'border-emerald-200/80 hover:border-emerald-400',
    text: 'text-emerald-700',
    iconGradient: 'from-emerald-600 to-teal-600 text-white shadow-emerald-500/25 ring-emerald-500/10',
    badge: 'bg-emerald-100/80 text-emerald-800 border-emerald-200',
    accent: 'bg-emerald-600'
  },
  amber: {
    bg: 'bg-amber-50/70 hover:bg-amber-50',
    border: 'border-amber-200/80 hover:border-amber-400',
    text: 'text-amber-700',
    iconGradient: 'from-amber-500 to-orange-600 text-white shadow-amber-500/25 ring-amber-500/10',
    badge: 'bg-amber-100/80 text-amber-800 border-amber-200',
    accent: 'bg-amber-500'
  },
  purple: {
    bg: 'bg-purple-50/70 hover:bg-purple-50',
    border: 'border-purple-200/80 hover:border-purple-400',
    text: 'text-purple-700',
    iconGradient: 'from-purple-600 to-indigo-600 text-white shadow-purple-500/25 ring-purple-500/10',
    badge: 'bg-purple-100/80 text-purple-800 border-purple-200',
    accent: 'bg-purple-600'
  },
  rose: {
    bg: 'bg-rose-50/70 hover:bg-rose-50',
    border: 'border-rose-200/80 hover:border-rose-400',
    text: 'text-rose-700',
    iconGradient: 'from-rose-600 to-pink-600 text-white shadow-rose-500/25 ring-rose-500/10',
    badge: 'bg-rose-100/80 text-rose-800 border-rose-200',
    accent: 'bg-rose-600'
  }
};

export function BadgesPage() {
  const { badges = [], addBadge, updateBadge, deleteBadge, students = [] } = useLmsData();
  const { isSuperAdmin, currentRole } = useAuth();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'showcase'

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
    color: 'blue',
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
      color: 'blue',
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
      color: badge.color || 'blue',
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
      addToast('Badge removed from catalog', 'info');
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
    const cat = (b.category || '').toLowerCase();
    const matchesSearch = name.includes(query) || desc.includes(query) || cat.includes(query);
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Academic', 'Skill', 'Achievement', 'Milestone'];

  const availableIcons = [
    { key: 'Award', label: 'Award Ribbon' },
    { key: 'Trophy', label: 'Trophy Cup' },
    { key: 'Star', label: 'Star' },
    { key: 'Zap', label: 'Lightning' },
    { key: 'Medal', label: 'Medal' },
    { key: 'Shield', label: 'Shield' },
    { key: 'Target', label: 'Target' },
    { key: 'Flame', label: 'Flame' },
    { key: 'Crown', label: 'Crown' },
    { key: 'Gem', label: 'Gem' }
  ];

  const availableColors = [
    { key: 'blue', label: 'Royal Blue', bg: 'bg-blue-600' },
    { key: 'indigo', label: 'Indigo', bg: 'bg-indigo-600' },
    { key: 'emerald', label: 'Emerald', bg: 'bg-emerald-600' },
    { key: 'amber', label: 'Amber Gold', bg: 'bg-amber-500' },
    { key: 'purple', label: 'Purple', bg: 'bg-purple-600' },
    { key: 'rose', label: 'Rose Red', bg: 'bg-rose-600' }
  ];

  return (
    <div className="space-y-7">
      {/* Executive Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-xs border border-slate-200/80">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>Gamified Recognition Engine</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
              Badges & Achievements
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Motivate student progress with dynamic skill badges, milestone trophies, and automated achievement rewards across all learning stages.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Switcher Pills */}
            <div className="p-1 bg-slate-100/90 border border-slate-200 rounded-2xl flex items-center gap-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab('catalog')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'catalog'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                Badge Catalog ({badges.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('showcase')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'showcase'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                Student View
              </button>
            </div>

            <Button
              variant="primary"
              icon={Plus}
              onClick={handleOpenAddModal}
              className="shadow-md shadow-blue-500/20"
            >
              Create Badge
            </Button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Badges</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{badges.length}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Active</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">XP Reward Pool</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {badges.reduce((acc, b) => acc + (parseInt(b.points) || 100), 0)}
            </span>
            <span className="text-xs font-bold text-slate-400">Total Points</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Categories</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {new Set(badges.map((b) => b.category)).size}
            </span>
            <span className="text-xs font-semibold text-slate-500">Domains</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Roster</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{students.length}</span>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">Eligible</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Category Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const count = cat === 'All' ? badges.length : badges.filter((b) => b.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                    : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 font-bold'
                }`}
              >
                <span>{cat}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-200/80 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search badge name or criteria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-2xs font-semibold"
          />
        </div>
      </div>

      {/* CATALOG VIEW MODE */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBadges.map((badge) => {
            const IconComp = ICON_MAP[badge.icon] || Award;
            const theme = COLOR_THEMES[badge.color] || COLOR_THEMES.blue;

            return (
              <div
                key={badge.id}
                className={`bg-white rounded-3xl border ${theme.border} ${theme.bg} shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 p-6 flex flex-col justify-between space-y-5 group relative overflow-hidden`}
              >
                <div>
                  {/* Badge Header: Icon Avatar, Title & Points */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.iconGradient} flex items-center justify-center flex-shrink-0 shadow-lg ring-4 transition-transform duration-300 group-hover:scale-105`}>
                        <IconComp className="w-7 h-7" />
                      </div>
                      <div>
                        <span className={`inline-block mb-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${theme.badge}`}>
                          {badge.category}
                        </span>
                        <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-blue-700 transition-colors">
                          {badge.name}
                        </h3>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-slate-900 text-amber-300 border border-slate-800 text-xs font-black shadow-xs flex-shrink-0 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{badge.points || '100 XP'}</span>
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                    {badge.description}
                  </p>

                  {/* Criteria Box */}
                  {badge.criteria && (
                    <div className="p-3.5 bg-white/90 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Requirement Criteria</span>
                      <p className="text-xs text-slate-800 font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>{badge.criteria}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setAwardModalBadge(badge)}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-extrabold text-white bg-slate-900 hover:bg-blue-600 shadow-md transition-all cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-blue-400" />
                    <span>Award Badge</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(badge)}
                      className="p-2 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-white transition-colors cursor-pointer"
                      title="Edit Badge"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(badge.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-white transition-colors cursor-pointer"
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
            <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-2xs">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-800">No Badges Match Your Filter</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search criteria or category filter to find badges.
                </p>
              </div>
              <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAddModal}>
                Create First Badge
              </Button>
            </div>
          )}
        </div>
      )}

      {/* STUDENT SHOWCASE VIEW MODE */}
      {activeTab === 'showcase' && (
        <div className="space-y-6">
          <div className="p-6 bg-blue-50/70 border border-blue-200/80 rounded-3xl text-slate-900 space-y-1.5">
            <h3 className="text-base font-black flex items-center gap-2 text-slate-900">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Student Profile Achievement Preview</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl font-medium">
              This preview demonstrates how badges are presented to enrolled students on their LMS profile dashboard upon achieving course milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge, idx) => {
              const IconComp = ICON_MAP[badge.icon] || Award;
              const theme = COLOR_THEMES[badge.color] || COLOR_THEMES.blue;
              const isUnlocked = idx < 2; // Preview first 2 as unlocked for demo

              return (
                <div
                  key={badge.id}
                  className={`bg-white rounded-3xl border p-6 transition-all duration-300 ${
                    isUnlocked
                      ? 'border-emerald-200 shadow-md bg-gradient-to-b from-white to-emerald-50/30'
                      : 'border-slate-200/80 opacity-80 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      isUnlocked
                        ? `bg-gradient-to-br ${theme.iconGradient} shadow-lg ring-4`
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      <IconComp className="w-7 h-7" />
                    </div>

                    {isUnlocked ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1.5 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-black flex items-center gap-1.5 border border-slate-300">
                        <Lock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-black text-slate-900 text-base mb-1">{badge.name}</h4>
                  <p className="text-xs text-slate-600 mb-4">{badge.description}</p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-500">{badge.category}</span>
                    <span className="font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      {badge.points || '100 XP'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Badge Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBadge ? 'Edit Badge Details' : 'Create New Skill Badge'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-5">
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

            <Input
              label="XP Reward Value"
              type="text"
              placeholder="e.g. 150 XP"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: e.target.value })}
            />
          </div>

          {/* Interactive Icon Selector */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
              Badge Icon Avatar
            </label>
            <div className="grid grid-cols-5 gap-2.5 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              {availableIcons.map((ic) => {
                const IconC = ICON_MAP[ic.key] || Award;
                const isSelected = formData.icon === ic.key;
                return (
                  <button
                    key={ic.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: ic.key })}
                    className={`p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-600'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <IconC className="w-5 h-5" />
                    <span className="text-[9px] font-black tracking-tight truncate max-w-full">{ic.key}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Color Theme Selector */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
              Color Theme Accent
            </label>
            <div className="grid grid-cols-6 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              {availableColors.map((col) => {
                const isSelected = formData.color === col.key;
                return (
                  <button
                    key={col.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: col.key })}
                    className={`h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${col.bg} ${
                      isSelected ? 'ring-4 ring-offset-2 ring-blue-600 scale-105' : 'hover:scale-95 opacity-90'
                    }`}
                    title={col.label}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          <Input
            label="Requirement Criteria"
            type="text"
            placeholder="e.g. Score >= 90% in Stage 2 Python Assessment"
            value={formData.criteria}
            onChange={(e) => setFormData({ ...formData, criteria: e.target.value })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
              Badge Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of what this badge recognizes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs font-medium"
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
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Select a student from the active roster to award this badge to. The student will instantly receive the badge on their LMS profile.
          </p>

          <Select
            label="Select Student Roster"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            options={[
              { value: '', label: '-- Choose Student --' },
              ...students.map((s) => ({ value: s.id, label: `${s.name} (${s.batch || 'A26W1'})` }))
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
          <p className="text-xs text-slate-600 font-medium">
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
