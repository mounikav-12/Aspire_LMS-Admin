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
  Rocket,
  Code,
  Terminal,
  GraduationCap,
  Lightbulb,
  Brain,
  Heart,
  Flag,
  Compass,
  Gift,
  Key,
  Cpu,
  Globe,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  UserCheck,
  Layers,
  Clock,
  ArrowRight,
  BookOpen,
  Filter,
  Check,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal
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
  Gem,
  Rocket,
  Code,
  Terminal,
  GraduationCap,
  Lightbulb,
  Brain,
  Heart,
  Flag,
  Compass,
  Gift,
  Key,
  Cpu,
  Globe,
  Sparkles,
  BookOpen
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
  },
  teal: {
    bg: 'bg-teal-50/70 hover:bg-teal-50',
    border: 'border-teal-200/80 hover:border-teal-400',
    text: 'text-teal-700',
    iconGradient: 'from-teal-600 to-emerald-600 text-white shadow-teal-500/25 ring-teal-500/10',
    badge: 'bg-teal-100/80 text-teal-800 border-teal-200',
    accent: 'bg-teal-600'
  },
  cyan: {
    bg: 'bg-cyan-50/70 hover:bg-cyan-50',
    border: 'border-cyan-200/80 hover:border-cyan-400',
    text: 'text-cyan-700',
    iconGradient: 'from-cyan-500 to-blue-600 text-white shadow-cyan-500/25 ring-cyan-500/10',
    badge: 'bg-cyan-100/80 text-cyan-800 border-cyan-200',
    accent: 'bg-cyan-500'
  },
  orange: {
    bg: 'bg-orange-50/70 hover:bg-orange-50',
    border: 'border-orange-200/80 hover:border-orange-400',
    text: 'text-orange-700',
    iconGradient: 'from-orange-500 to-amber-600 text-white shadow-orange-500/25 ring-orange-500/10',
    badge: 'bg-orange-100/80 text-orange-800 border-orange-200',
    accent: 'bg-orange-500'
  },
  violet: {
    bg: 'bg-violet-50/70 hover:bg-violet-50',
    border: 'border-violet-200/80 hover:border-violet-400',
    text: 'text-violet-700',
    iconGradient: 'from-violet-600 to-purple-600 text-white shadow-violet-500/25 ring-violet-500/10',
    badge: 'bg-violet-100/80 text-violet-800 border-violet-200',
    accent: 'bg-violet-600'
  },
  fuchsia: {
    bg: 'bg-fuchsia-50/70 hover:bg-fuchsia-50',
    border: 'border-fuchsia-200/80 hover:border-fuchsia-400',
    text: 'text-fuchsia-700',
    iconGradient: 'from-fuchsia-600 to-pink-600 text-white shadow-fuchsia-500/25 ring-fuchsia-500/10',
    badge: 'bg-fuchsia-100/80 text-fuchsia-800 border-fuchsia-200',
    accent: 'bg-fuchsia-600'
  },
  lime: {
    bg: 'bg-lime-50/70 hover:bg-lime-50',
    border: 'border-lime-200/80 hover:border-lime-400',
    text: 'text-lime-700',
    iconGradient: 'from-lime-500 to-emerald-600 text-white shadow-lime-500/25 ring-lime-500/10',
    badge: 'bg-lime-100/80 text-lime-800 border-lime-200',
    accent: 'bg-lime-500'
  },
  red: {
    bg: 'bg-red-50/70 hover:bg-red-50',
    border: 'border-red-200/80 hover:border-red-400',
    text: 'text-red-700',
    iconGradient: 'from-red-600 to-rose-600 text-white shadow-red-500/25 ring-red-500/10',
    badge: 'bg-red-100/80 text-red-800 border-red-200',
    accent: 'bg-red-600'
  },
  pink: {
    bg: 'bg-pink-50/70 hover:bg-pink-50',
    border: 'border-pink-200/80 hover:border-pink-400',
    text: 'text-pink-700',
    iconGradient: 'from-pink-500 to-rose-500 text-white shadow-pink-500/25 ring-pink-500/10',
    badge: 'bg-pink-100/80 text-pink-800 border-pink-200',
    accent: 'bg-pink-500'
  },
  sky: {
    bg: 'bg-sky-50/70 hover:bg-sky-50',
    border: 'border-sky-200/80 hover:border-sky-400',
    text: 'text-sky-700',
    iconGradient: 'from-sky-500 to-blue-500 text-white shadow-sky-500/25 ring-sky-500/10',
    badge: 'bg-sky-100/80 text-sky-800 border-sky-200',
    accent: 'bg-sky-500'
  },
  green: {
    bg: 'bg-green-50/70 hover:bg-green-50',
    border: 'border-green-200/80 hover:border-green-400',
    text: 'text-green-700',
    iconGradient: 'from-green-600 to-emerald-600 text-white shadow-green-500/25 ring-green-500/10',
    badge: 'bg-green-100/80 text-green-800 border-green-200',
    accent: 'bg-green-600'
  },
  yellow: {
    bg: 'bg-yellow-50/70 hover:bg-yellow-50',
    border: 'border-yellow-200/80 hover:border-yellow-400',
    text: 'text-yellow-800',
    iconGradient: 'from-yellow-500 to-amber-500 text-white shadow-yellow-500/25 ring-yellow-500/10',
    badge: 'bg-yellow-100/80 text-yellow-800 border-yellow-200',
    accent: 'bg-yellow-500'
  },
  slate: {
    bg: 'bg-slate-100/80 hover:bg-slate-100',
    border: 'border-slate-300 hover:border-slate-400',
    text: 'text-slate-800',
    iconGradient: 'from-slate-700 to-slate-900 text-white shadow-slate-500/25 ring-slate-500/10',
    badge: 'bg-slate-200 text-slate-800 border-slate-300',
    accent: 'bg-slate-700'
  },
  zinc: {
    bg: 'bg-zinc-100/80 hover:bg-zinc-100',
    border: 'border-zinc-300 hover:border-zinc-400',
    text: 'text-zinc-800',
    iconGradient: 'from-zinc-600 to-slate-800 text-white shadow-zinc-500/25 ring-zinc-500/10',
    badge: 'bg-zinc-200 text-zinc-800 border-zinc-300',
    accent: 'bg-zinc-600'
  },
  stone: {
    bg: 'bg-stone-100/80 hover:bg-stone-100',
    border: 'border-stone-300 hover:border-stone-400',
    text: 'text-stone-800',
    iconGradient: 'from-stone-600 to-neutral-800 text-white shadow-stone-500/25 ring-stone-500/10',
    badge: 'bg-stone-200 text-stone-800 border-stone-300',
    accent: 'bg-stone-600'
  }
};

const BADGE_CATEGORIES = [
  'Academic',
  'Skill',
  'Achievement',
  'Milestone',
  'Coding',
  'Project',
  'Attendance',
  'Leadership',
  'Assessment',
  'Placement',
  'Special'
];

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
    if (!awardModalBadge) return;

    if (awardModalBadge.isAll) {
      addToast(`Awarded all ${badges.length} badges to all ${students.length} active students!`, 'success');
    } else {
      addToast(`Awarded badge "${awardModalBadge.name}" to all ${students.length} active students!`, 'success');
    }

    setAwardModalBadge(null);
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

  const categories = ['All', ...BADGE_CATEGORIES];

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
    { key: 'Gem', label: 'Gem' },
    { key: 'Rocket', label: 'Rocket' },
    { key: 'Code', label: 'Code' },
    { key: 'Terminal', label: 'Terminal' },
    { key: 'GraduationCap', label: 'Scholar' },
    { key: 'Lightbulb', label: 'Idea' },
    { key: 'Brain', label: 'Mastermind' },
    { key: 'Heart', label: 'Passion' },
    { key: 'Flag', label: 'Milestone' },
    { key: 'Compass', label: 'Explorer' },
    { key: 'Gift', label: 'Reward' },
    { key: 'Key', label: 'Key' },
    { key: 'Cpu', label: 'Core' },
    { key: 'Globe', label: 'Global' },
    { key: 'Sparkles', label: 'Sparkles' },
    { key: 'BookOpen', label: 'Reader' }
  ];

  const availableColors = [
    { key: 'blue', label: 'Royal Blue', bg: 'bg-blue-600' },
    { key: 'indigo', label: 'Indigo', bg: 'bg-indigo-600' },
    { key: 'emerald', label: 'Emerald', bg: 'bg-emerald-600' },
    { key: 'teal', label: 'Teal', bg: 'bg-teal-600' },
    { key: 'cyan', label: 'Electric Cyan', bg: 'bg-cyan-500' },
    { key: 'sky', label: 'Sky Blue', bg: 'bg-sky-500' },
    { key: 'green', label: 'Forest Green', bg: 'bg-green-600' },
    { key: 'lime', label: 'Neon Lime', bg: 'bg-lime-500' },
    { key: 'yellow', label: 'Bright Yellow', bg: 'bg-yellow-500' },
    { key: 'amber', label: 'Amber Gold', bg: 'bg-amber-500' },
    { key: 'orange', label: 'Sunset Orange', bg: 'bg-orange-500' },
    { key: 'red', label: 'Crimson Red', bg: 'bg-red-600' },
    { key: 'rose', label: 'Rose Red', bg: 'bg-rose-600' },
    { key: 'pink', label: 'Hot Pink', bg: 'bg-pink-500' },
    { key: 'fuchsia', label: 'Magenta Fuchsia', bg: 'bg-fuchsia-600' },
    { key: 'purple', label: 'Purple', bg: 'bg-purple-600' },
    { key: 'violet', label: 'Violet', bg: 'bg-violet-600' },
    { key: 'slate', label: 'Slate Dark', bg: 'bg-slate-700' },
    { key: 'zinc', label: 'Metallic Zinc', bg: 'bg-zinc-600' },
    { key: 'stone', label: 'Warm Stone', bg: 'bg-stone-600' }
  ];

  return (
    <div className="space-y-7">
      {/* Executive Hero Banner */}
      <div className="rounded-3xl bg-white p-6 shadow-2xs border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Badges & Achievements
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Manage student skill badges, milestone trophies, and achievement criteria
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="outline"
              icon={Award}
              onClick={() => setAwardModalBadge({ name: 'All Catalog Badges', isAll: true })}
              className="shadow-2xs border-purple-300 text-purple-700 hover:bg-purple-50 cursor-pointer font-bold text-xs"
            >
              Award All Badges to All Students
            </Button>

            <Button
              variant="primary"
              icon={Plus}
              onClick={handleOpenAddModal}
              className="shadow-md shadow-blue-500/20 text-xs"
            >
              Create Badge
            </Button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {/* Control Bar: Search & Category Dropdown */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search badge name or criteria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition-all shadow-2xs font-semibold"
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative w-full sm:w-56 flex-shrink-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white transition-all shadow-2xs cursor-pointer appearance-none pr-8"
          >
            {categories.map((cat) => {
              const count = cat === 'All' ? badges.length : badges.filter((b) => b.category === cat).length;
              return (
                <option key={cat} value={cat}>
                  {cat} ({count})
                </option>
              );
            })}
          </select>
          <ChevronRight className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
        </div>
      </div>

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
                {/* Badge Header: Icon Avatar & Title */}
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
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-extrabold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/25 transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4 text-purple-200" />
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

      {/* Add / Edit Badge Modal */}
      {(() => {
        const activeModalTheme = COLOR_THEMES[formData.color] || COLOR_THEMES.blue;
        const ActivePreviewIcon = ICON_MAP[formData.icon] || Award;

        return (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={editingBadge ? 'Edit Badge Details' : 'Create New Skill Badge'}
            maxWidth="max-w-3xl"
          >
            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* Live Badge Preview Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  Live Badge Preview
                </span>
                <div className={`bg-white rounded-2xl border ${activeModalTheme.border} ${activeModalTheme.bg} p-4 flex items-center gap-3.5 shadow-2xs transition-all duration-300`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activeModalTheme.iconGradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <ActivePreviewIcon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`inline-block mb-0.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${activeModalTheme.badge}`}>
                      {formData.category || 'Skill'}
                    </span>
                    <h4 className="font-black text-slate-900 text-sm truncate">
                      {formData.name || 'Badge Name Preview'}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium truncate">
                      {formData.description || 'Badge description preview...'}
                    </p>
                  </div>
                </div>
              </div>

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
                  onChange={(e) => {
                    const newCat = e.target.value;
                    let newCriteria = formData.criteria;
                    if (newCat === 'Attendance' && (!formData.criteria || !formData.criteria.includes('%'))) {
                      newCriteria = '90% Attendance';
                    }
                    setFormData({
                      ...formData,
                      category: newCat,
                      criteria: newCriteria
                    });
                  }}
                  options={BADGE_CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
                />

                <Input
                  label={formData.category === 'Attendance' ? 'Requirement Criteria (Attendance %)' : 'Requirement Criteria'}
                  type="text"
                  placeholder={
                    formData.category === 'Attendance'
                      ? 'e.g. 90% Attendance'
                      : 'e.g. Score >= 90% in Stage 2 Python Assessment'
                  }
                  value={formData.criteria}
                  onChange={(e) => setFormData({ ...formData, criteria: e.target.value })}
                />
              </div>

              {/* Icon Avatar & Color Theme Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                {/* Interactive Icon Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                    Badge Icon Avatar
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 p-2.5 bg-slate-50 rounded-2xl border border-slate-200 max-h-56 overflow-y-auto">
                    {availableIcons.map((ic) => {
                      const IconC = ICON_MAP[ic.key] || Award;
                      const isSelected = formData.icon === ic.key;
                      return (
                        <button
                          key={ic.key}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon: ic.key })}
                          className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            isSelected
                              ? `bg-gradient-to-br ${activeModalTheme.iconGradient} text-white shadow-md ring-2 ring-offset-1`
                              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          <IconC className="w-4 h-4" />
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
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 p-2.5 bg-slate-50 rounded-2xl border border-slate-200 max-h-56 overflow-y-auto">
                    {availableColors.map((col) => {
                      const isSelected = formData.color === col.key;
                      return (
                        <button
                          key={col.key}
                          type="button"
                          onClick={() => setFormData({ ...formData, color: col.key })}
                          className={`h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${col.bg} ${
                            isSelected ? 'ring-4 ring-offset-2 ring-slate-800 scale-105 shadow-md' : 'hover:scale-95 opacity-80 hover:opacity-100'
                          }`}
                          title={col.label}
                        >
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

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
    );
  })()}

      {/* Award Badge Modal */}
      <Modal
        isOpen={!!awardModalBadge}
        onClose={() => setAwardModalBadge(null)}
        title={awardModalBadge?.isAll ? 'Award All Badges to All Students' : `Award "${awardModalBadge?.name}" Badge`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAwardSubmit} className="space-y-4">
          <div className="p-4 bg-purple-50 border border-purple-200/80 rounded-2xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-600/20">
              <Award className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-slate-900">
                {awardModalBadge?.isAll ? 'Award All Catalog Badges' : awardModalBadge?.name}
              </h4>
              <p className="text-[11px] text-purple-700 font-bold">
                Target: All <span className="underline decoration-purple-400">{students.length} enrolled students</span>
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Clicking confirm will automatically award this badge to all students across all active batches in your roster.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setAwardModalBadge(null)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" icon={Award}>
              Award to All Students
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
