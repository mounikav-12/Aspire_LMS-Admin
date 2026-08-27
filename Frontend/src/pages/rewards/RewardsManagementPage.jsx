import React, { useState } from 'react';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Gift,
  Lock,
  Unlock,
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  Zap,
  Package,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  Check,
  ChevronDown,
  X
} from 'lucide-react';



export function RewardsManagementPage() {
  const {
    rewards = [],
    rewardsStoreConfig = {},
    updateRewardsStoreConfig,
    addReward,
    updateReward,
    deleteReward,
    toggleReleaseReward,
    releaseAllRewards,
    lockAllRewards
  } = useLmsData();

  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [deletingReward, setDeletingReward] = useState(null);

  // Store Header Banner State
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [headerFormData, setHeaderFormData] = useState({
    badgeText: rewardsStoreConfig?.badgeText || 'STUDENT MERCHANDISE & SWAG STORE',
    title: rewardsStoreConfig?.title || 'AspireNext Rewards & Merchandise',
    description: rewardsStoreConfig?.description || 'Earn XP points by solving coding practice problems, completing quizzes, and finishing course modules to unlock official branded merchandise.',
    xpBadgeLabel: rewardsStoreConfig?.xpBadgeLabel || '0 Total Student XP'
  });

  const handleOpenHeaderModal = () => {
    setHeaderFormData({
      badgeText: rewardsStoreConfig?.badgeText || 'STUDENT MERCHANDISE & SWAG STORE',
      title: rewardsStoreConfig?.title || 'AspireNext Rewards & Merchandise',
      description: rewardsStoreConfig?.description || 'Earn XP points by solving coding practice problems, completing quizzes, and finishing course modules to unlock official branded merchandise.',
      xpBadgeLabel: rewardsStoreConfig?.xpBadgeLabel || '0 Total Student XP'
    });
    setIsHeaderModalOpen(true);
  };

  const handleSaveHeader = (e) => {
    e.preventDefault();
    if (!headerFormData.title.trim()) {
      addToast('Please enter store heading title', 'error');
      return;
    }
    updateRewardsStoreConfig(headerFormData);
    addToast('Successfully updated Rewards Store Banner!', 'success');
    setIsHeaderModalOpen(false);
  };

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    requiredXp: 0,
    image: '',
    description: '',
    stock: 0,
    isReleased: false
  });

  const handleOpenAddModal = () => {
    setFormData({
      title: '',
      category: '',
      requiredXp: 0,
      image: '',
      description: '',
      stock: 0,
      isReleased: false
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (reward) => {
    setEditingReward(reward);
    setFormData({
      title: reward.title || '',
      category: reward.category || '',
      requiredXp: reward.requiredXp || 0,
      image: reward.image || '',
      description: reward.description || '',
      stock: reward.stock !== undefined ? reward.stock : 0,
      isReleased: reward.isReleased || false
    });
  };

  const handleSaveReward = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      addToast('Please enter reward title', 'error');
      return;
    }

    if (editingReward) {
      updateReward(editingReward.id, formData);
      addToast(`Updated reward "${formData.title}"`, 'success');
      setEditingReward(null);
    } else {
      addReward(formData);
      addToast(`Created reward "${formData.title}"`, 'success');
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingReward) {
      deleteReward(deletingReward.id);
      addToast(`Deleted reward "${deletingReward.title}"`, 'info');
      setDeletingReward(null);
    }
  };

  const handleToggleRelease = (reward) => {
    toggleReleaseReward(reward.id);
    if (!reward.isReleased) {
      addToast(`Released "${reward.title}" to Student LMS!`, 'success');
    } else {
      addToast(`Locked "${reward.title}" from Student LMS`, 'info');
    }
  };

  // Filtered Rewards
  const filteredRewards = rewards.filter((r) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.title?.toLowerCase().includes(term) ||
      r.description?.toLowerCase().includes(term) ||
      r.category?.toLowerCase().includes(term)
    );
  });

  // Calculate statistics
  const unlockedCount = rewards.filter((r) => r.isReleased).length;
  const lockedCount = rewards.filter((r) => !r.isReleased).length;

  return (
    <div className="space-y-6">
      {/* --- HERO STORE HEADER (Matching Image 1 - Editable) --- */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs relative group">
        {/* Quick Edit Banner Button */}
        <button
          type="button"
          onClick={handleOpenHeaderModal}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-400 hover:text-purple-600 border border-slate-200 hover:border-purple-300 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer opacity-90 group-hover:opacity-100 shadow-2xs z-10"
          title="Edit Store Banner Content"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Edit Banner</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pr-4 sm:pr-24">
          <div className="space-y-2">
            <div
              onClick={handleOpenHeaderModal}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-purple-700 text-[11px] font-black uppercase tracking-wider cursor-pointer hover:bg-purple-100 transition-colors"
              title="Click to edit badge text"
            >
              
              <span>{rewardsStoreConfig?.badgeText || 'STUDENT MERCHANDISE & SWAG STORE'}</span>
            </div>
            <h1
              onClick={handleOpenHeaderModal}
              className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight cursor-pointer hover:text-purple-700 transition-colors"
              title="Click to edit store title"
            >
              {rewardsStoreConfig?.title || 'AspireNext Rewards & Merchandise'}
            </h1>
            <p
              onClick={handleOpenHeaderModal}
              className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed cursor-pointer hover:text-slate-700 transition-colors"
              title="Click to edit store description"
            >
              {rewardsStoreConfig?.description || 'Earn XP points by solving coding practice problems, completing quizzes, and finishing course modules to unlock official branded merchandise.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center mt-2 md:mt-0">
            <div
              onClick={handleOpenHeaderModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-md shadow-purple-500/20 font-black text-xs cursor-pointer hover:from-purple-700 hover:to-indigo-700 transition-all"
              title="Click to edit XP badge"
            >
              <Zap className="w-4 h-4 fill-current text-yellow-300" />
              <span>{rewardsStoreConfig?.xpBadgeLabel || '0 Total Student XP'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- STAT METRIC CARDS (2 Cards: Unlocked & Locked matching reference) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Unlocked / Released Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-slate-900">
              {unlockedCount} Reward{unlockedCount !== 1 ? 's' : ''} Unlocked
            </div>
            <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Ready to Claim / Released to Students</span>
            </div>
          </div>
        </div>

        {/* Locked Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-slate-900">
              {lockedCount} Locked Reward{lockedCount !== 1 ? 's' : ''}
            </div>
            <div className="text-xs font-medium text-slate-500">
              Locked (XP Milestones & Admin Release)
            </div>
          </div>
        </div>
      </div>

      {/* --- ACTION & SEARCH BAR --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          {/* Search Input with Clear button */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search rewards by title (e.g. Mug, Sticker, T-Shirt)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-purple-500 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/15 transition-all shadow-2xs font-medium"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Add Reward Button placed beside search bar */}
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 shadow-md shadow-purple-500/20 font-extrabold text-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Reward</span>
          </Button>
        </div>

        {/* Release All & Lock All Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              releaseAllRewards();
              addToast('All catalog rewards released to Student LMS!', 'success');
            }}
            className="px-3.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Release All</span>
          </button>

          <button
            type="button"
            onClick={() => {
              lockAllRewards();
              addToast('All rewards locked by Admin', 'info');
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock All</span>
          </button>
        </div>
      </div>

      {/* --- REWARDS GRID (Matching Image 1 Cards) --- */}
      {filteredRewards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
            >
              {/* Product Image Container with 16:9 / 4:3 Aspect ratio */}
              <div className="relative h-60 sm:h-64 w-full bg-slate-950 overflow-hidden flex items-center justify-center">
                <img
                  src={reward.image}
                  alt={reward.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80';
                  }}
                />

                {/* Release Status Badge Overlay */}
                <div className="absolute top-3 right-3 z-10">
                  {reward.isReleased ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/90 text-white backdrop-blur-xs shadow-md flex items-center gap-1">
                      <Unlock className="w-3 h-3" />
                      <span>RELEASED</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-900/80 text-slate-200 backdrop-blur-xs shadow-md flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-300" />
                      <span>LOCKED</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  {/* Category & XP Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-wider bg-purple-50 text-purple-700 border border-purple-200/60 uppercase">
                      {reward.category || 'ACCESSORIES'}
                    </span>
                    <span className="text-xs font-black text-slate-900 tracking-wide">
                      {reward.requiredXp ? `${reward.requiredXp} XP` : '1000 XP'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-black text-slate-900 leading-snug group-hover:text-purple-600 transition-colors">
                    {reward.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {reward.description || 'Exclusive official merchandise reward for Aspire Next learners.'}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {/* Lock / Release Action Button (Matching Image 1) */}
                  <button
                    type="button"
                    onClick={() => handleToggleRelease(reward)}
                    className={`w-full py-2.5 px-4 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      reward.isReleased
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 shadow-2xs'
                        : 'bg-slate-50/90 border-slate-200 text-slate-600 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700'
                    }`}
                  >
                    {reward.isReleased ? (
                      <>
                        <Unlock className="w-4 h-4 text-emerald-600" />
                        <span>Released to Student LMS</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-slate-400" />
                        <span>Locked Reward</span>
                      </>
                    )}
                  </button>

                  {/* Card Admin Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-500">
                    <span className="text-[11px] font-medium text-slate-400">
                      Stock: <strong className="text-slate-700">{reward.stock || 50} units</strong>
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(reward)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Reward Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingReward(reward)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Reward"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title={searchTerm.trim() ? `No Rewards Matching "${searchTerm}"` : "No Rewards Found"}
          description={
            searchTerm.trim()
              ? "We couldn't find any rewards matching your search keyword. Try another name or clear the search filter."
              : "Create your first merchandise reward item to get started."
          }
          actionLabel={searchTerm.trim() ? "Clear Search" : "Add Reward Item"}
          onAction={searchTerm.trim() ? () => setSearchTerm('') : handleOpenAddModal}
        />
      )}

      {/* --- ADD / EDIT REWARD MODAL --- */}
      <Modal
        isOpen={isAddModalOpen || !!editingReward}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingReward(null);
        }}
        title={editingReward ? 'Edit Reward Item' : 'Add New Reward Item'}
        subtitle="Configure merchandise details, required XP points, and release visibility"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSaveReward} className="space-y-4">
          <Input
            label="Reward Title"
            placeholder="e.g. Developer Sticker Pack"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'ACCESSORIES', label: 'ACCESSORIES' },
                { value: 'DRINKWARE', label: 'DRINKWARE' },
                { value: 'STATIONERY', label: 'STATIONERY' },
                { value: 'APPAREL', label: 'APPAREL' },
                { value: 'GEAR', label: 'GEAR' }
              ]}
            />

            <Input
              label="Required XP Points"
              type="number"
              min="0"
              step="100"
              placeholder="e.g. 1000"
              value={formData.requiredXp}
              onChange={(e) => setFormData({ ...formData, requiredXp: Number(e.target.value) })}
              required
            />

            <Input
              label="Stock Quantity"
              type="number"
              min="0"
              placeholder="e.g. 50"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
            />
          </div>

          {/* Quick Preset Image Chooser */}
          <div className="space-y-2">
            <label className="text-[11px] font-extrabold text-slate-700 tracking-wider uppercase">
              Choose Preset Merchandise Image
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_IMAGES.map((preset) => {
                const isSelected = formData.image === preset.url;
                return (
                  <div
                    key={preset.url}
                    onClick={() => {
                      setFormData({
                        ...formData,
                        image: preset.url,
                        category: formData.category || preset.category,
                        requiredXp: formData.requiredXp || preset.defaultXp
                      });
                    }}
                    className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-square ${
                      isSelected
                        ? 'border-purple-600 ring-2 ring-purple-500/20'
                        : 'border-slate-200 hover:border-purple-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-purple-900/30 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Input
            label="Custom Image URL (Optional)"
            icon={ImageIcon}
            placeholder="/rewards/stickers.jpg or https://..."
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            helperText="Path to public image asset or external CDN URL"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 tracking-wider uppercase">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe this merchandise reward..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all shadow-2xs resize-none"
            />
          </div>

          {/* Release toggle */}
          <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-100 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-black text-purple-900 flex items-center gap-1.5">
                <Unlock className="w-3.5 h-3.5 text-purple-600" />
                <span>Release to Student LMS</span>
              </div>
              <p className="text-[11px] text-purple-700/80">
                When enabled, students can see and unlock this reward with their earned XP.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isReleased}
                onChange={(e) => setFormData({ ...formData, isReleased: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingReward(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingReward ? 'Save Reward' : 'Create Reward'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* --- EDIT STORE HEADER MODAL --- */}
      <Modal
        isOpen={isHeaderModalOpen}
        onClose={() => setIsHeaderModalOpen(false)}
        title="Edit Store Banner Content"
        subtitle="Customize the rewards store heading, badge text, description, and XP label"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveHeader} className="space-y-4">
          <Input
            label="Store Badge Text"
            placeholder="e.g. STUDENT MERCHANDISE & SWAG STORE"
            value={headerFormData.badgeText}
            onChange={(e) => setHeaderFormData({ ...headerFormData, badgeText: e.target.value })}
            required
          />

          <Input
            label="Store Heading Title"
            placeholder="e.g. AspireNext Rewards & Merchandise"
            value={headerFormData.title}
            onChange={(e) => setHeaderFormData({ ...headerFormData, title: e.target.value })}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 tracking-wider uppercase">
              Store Subtitle / Description
            </label>
            <textarea
              rows={3}
              placeholder="Earn XP points by solving coding practice problems..."
              value={headerFormData.description}
              onChange={(e) => setHeaderFormData({ ...headerFormData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all shadow-2xs resize-none"
              required
            />
          </div>

          <Input
            label="Student XP Badge Label"
            placeholder="e.g. 0 Total Student XP"
            value={headerFormData.xpBadgeLabel}
            onChange={(e) => setHeaderFormData({ ...headerFormData, xpBadgeLabel: e.target.value })}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setIsHeaderModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Header Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* --- DELETE CONFIRMATION DIALOG --- */}
      <ConfirmDialog
        isOpen={!!deletingReward}
        onClose={() => setDeletingReward(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Reward Item"
        message={`Are you sure you want to delete "${deletingReward?.title}"? This item will no longer appear in the store catalog.`}
        confirmText="Delete Reward"
      />
    </div>
  );
}
