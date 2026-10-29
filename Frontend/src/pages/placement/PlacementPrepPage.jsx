import React, { useState } from 'react';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Sparkles,
  Search,
  BookOpen,
  Code2,
  FileText,
  Download,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  FileSpreadsheet,
  Layers
} from 'lucide-react';

const CATEGORY_OPTIONS = [
  { value: 'PDF Guides', label: 'PDF Guides' },
  { value: 'Notes', label: 'Notes' },
  { value: 'Cheat Sheets', label: 'Cheat Sheets' },
  { value: 'Roadmaps', label: 'Roadmaps' },
  { value: 'Templates', label: 'Templates' }
];

export function PlacementPrepPage() {
  const { placementResources, addPlacementResource, updatePlacementResource, deletePlacementResource } = useLmsData();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [deletingResource, setDeletingResource] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    category: 'PDF Guides',
    title: '',
    author: '',
    readTime: '',
    snippet: '',
    linkUrl: ''
  });

  const handleOpenAddModal = () => {
    setFormData({
      category: 'PDF Guides',
      title: '',
      author: '',
      readTime: '',
      snippet: '',
      linkUrl: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (res) => {
    setEditingResource(res);
    setFormData({
      category: res.category || 'PDF Guides',
      title: res.title || '',
      author: res.author || '',
      readTime: res.readTime || '',
      snippet: res.snippet || '',
      linkUrl: res.linkUrl || ''
    });
  };

  const handleSaveResource = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.snippet) {
      addToast('Please fill in title and snippet summary', 'error');
      return;
    }

    if (editingResource) {
      updatePlacementResource(editingResource.id, formData);
      addToast(`Updated resource: "${formData.title}"`, 'success');
      setEditingResource(null);
    } else {
      addPlacementResource(formData);
      addToast(`Placement resource "${formData.title}" published!`, 'success');
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingResource) {
      deletePlacementResource(deletingResource.id);
      addToast(`Deleted placement resource "${deletingResource.title}"`, 'info');
      setDeletingResource(null);
    }
  };

  const tabs = [
    { id: 'ALL', label: 'All Types' },
    { id: 'PDF Guides', label: 'PDF Guides' },
    { id: 'Notes', label: 'Notes' },
    { id: 'Cheat Sheets', label: 'Cheat Sheets' },
    { id: 'Roadmaps', label: 'Roadmaps' },
    { id: 'Templates', label: 'Templates' }
  ];

  const getCategoryBadgeVariant = (category) => {
    switch (category) {
      case 'PDF Guides':
      case 'PDFs':
        return 'purple';
      case 'Notes':
      case 'Interview Tips':
        return 'emerald';
      case 'Cheat Sheets':
      case 'Coding Practice':
        return 'amber';
      case 'Roadmaps':
        return 'rose';
      case 'Templates':
        return 'sky';
      default:
        return 'blue';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'PDF Guides':
      case 'PDFs':
        return BookOpen;
      case 'Notes':
      case 'Interview Tips':
        return FileText;
      case 'Cheat Sheets':
      case 'Coding Practice':
        return Code2;
      case 'Roadmaps':
        return Layers;
      case 'Templates':
        return FileSpreadsheet;
      default:
        return BookOpen;
    }
  };

  const filteredResources = placementResources.filter((res) => {
    const resCat = (res.category || '').trim().toLowerCase();
    const tabId = activeTab.toLowerCase();

    let matchesTab = activeTab === 'ALL';
    if (!matchesTab) {
      if (resCat === tabId) {
        matchesTab = true;
      } else if (tabId === 'pdf guides' && (resCat === 'pdfs' || resCat === 'pdf' || resCat === 'articles')) {
        matchesTab = true;
      } else if (tabId === 'notes' && resCat === 'interview tips') {
        matchesTab = true;
      } else if (tabId === 'cheat sheets' && resCat === 'coding practice') {
        matchesTab = true;
      }
    }

    const matchesSearch =
      (res.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (res.snippet || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (res.author || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleDownload = (res) => {
    if (res.linkUrl) {
      window.open(res.linkUrl, '_blank');
      addToast(`Opening resource document: "${res.title}"...`, 'success');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-indigo-600" /> Placement & Interview Prep Hub
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Curated PDF guides, revision notes, cheat sheets, roadmaps, and templates for student placement preparation.
          </p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAddModal}>
          Add Placement Resource
        </Button>
      </div>

      {/* Filter Tabs matching Student LMS design */}
      <div className="flex flex-wrap items-center gap-2.5 pb-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-[1.02]'
                  : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search PDF guides, notes, cheat sheets, roadmaps, or templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Cards Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((res) => {
            const Icon = getCategoryIcon(res.category);
            const badgeVariant = getCategoryBadgeVariant(res.category);
            const displayCategory = res.category === 'PDFs' ? 'PDF Guides' : res.category;

            return (
              <div
                key={res.id}
                className="group bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors">
                          {res.title}
                        </h3>
                        <span className="text-[11px] text-slate-400 font-semibold">{res.readTime || 'Resource Guide'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={badgeVariant}>
                        {displayCategory}
                      </Badge>
                      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEditModal(res)}
                          className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                          title="Edit Resource"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingResource(res)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                          title="Delete Resource"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-medium pl-0.5">{res.snippet}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">{res.author ? `By ${res.author}` : ''}</span>
                  {res.linkUrl ? (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Download}
                      onClick={() => handleDownload(res)}
                    >
                      {res.category === 'PDF Guides' || res.category === 'PDFs' ? 'Download PDF' : 'Download Resource'}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={ExternalLink}
                      onClick={() => addToast(`Opening resource: ${res.title}`, 'info')}
                    >
                      View Resource
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No Placement Resources Found"
          description="Publish PDF guides, revision notes, cheat sheets, roadmaps, or templates."
          actionLabel="Add Resource"
          onAction={handleOpenAddModal}
        />
      )}

      {/* Add / Edit Resource Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingResource}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingResource(null);
        }}
        title={editingResource ? 'Edit Placement Resource' : 'Add Placement Resource'}
        subtitle="Publish PDF guides, revision notes, cheat sheets, roadmaps, or templates"
      >
        <form onSubmit={handleSaveResource} className="space-y-4">
          <Input
            label="Resource Title"
            placeholder="e.g. System Design Interview Survival Guide"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Resource Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={CATEGORY_OPTIONS}
            />

            <Input
              label="Read Time / Label"
              placeholder="e.g. 10 min read or PDF Guide"
              value={formData.readTime}
              onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Author Name"
              placeholder="e.g. Career Success Team"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />

            <Input
              label="Document URL / PDF Link"
              icon={FileSpreadsheet}
              placeholder="https://domain.com/cheatsheet.pdf"
              value={formData.linkUrl}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              helperText="Enter direct PDF URL or document download link"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 tracking-wider uppercase">
              Snippet Summary / Overview
            </label>
            <textarea
              rows={3}
              placeholder="Brief summary of the guide, notes, cheat sheet, roadmap, or template..."
              value={formData.snippet}
              onChange={(e) => setFormData({ ...formData, snippet: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-2xs"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingResource(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingResource ? 'Save Changes' : 'Publish Resource'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingResource}
        onClose={() => setDeletingResource(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Resource"
        message={`Are you sure you want to delete "${deletingResource?.title}"?`}
        confirmText="Delete Resource"
      />
    </div>
  );
}