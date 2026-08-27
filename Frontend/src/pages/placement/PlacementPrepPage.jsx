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
  Lightbulb,
  Download,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  FileSpreadsheet
} from 'lucide-react';

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
    category: 'Interview Tips',
    title: '',
    author: '',
    readTime: '',
    snippet: '',
    linkUrl: ''
  });

  const handleOpenAddModal = () => {
    setFormData({
      category: 'Interview Tips',
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
      category: res.category,
      title: res.title,
      author: res.author,
      readTime: res.readTime,
      snippet: res.snippet,
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
    { id: 'ALL', label: 'All Resources', icon: Sparkles },
    { id: 'Interview Tips', label: 'Interview Tips', icon: Lightbulb },
    { id: 'Coding Practice', label: 'Coding Practice', icon: Code2 },
    { id: 'Articles', label: 'Articles & System Design', icon: BookOpen },
    { id: 'PDFs', label: 'PDF Cheatsheets', icon: FileText }
  ];

  const filteredResources = placementResources.filter((res) => {
    const matchesTab = activeTab === 'ALL' || res.category === activeTab;
    const matchesSearch =
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.snippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleDownload = (res) => {
    if (res.linkUrl) {
      window.open(res.linkUrl, '_blank');
      addToast(`Downloading PDF document: "${res.title}"...`, 'success');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-blue-600" /> Placement & Interview Prep Hub
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Curated technical interview tips, coding pattern guides, system design articles, and downloadable PDF cheatsheets.
          </p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAddModal}>
          Add Placement Resource
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                  : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
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
            placeholder="Search interview guides, coding practice, or PDF resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Cards Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="group bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        res.category === 'Interview Tips'
                          ? 'amber'
                          : res.category === 'Coding Practice'
                          ? 'sky'
                          : res.category === 'PDFs'
                          ? 'rose'
                          : 'blue'
                      }
                    >
                      {res.category}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-semibold">{res.readTime}</span>
                    <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEditModal(res)}
                        className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
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

                <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors">
                  {res.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed font-medium">{res.snippet}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">{res.author ? `By ${res.author}` : ''}</span>
                {res.category === 'PDFs' ? (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Download}
                    onClick={() => handleDownload(res)}
                  >
                    Download PDF
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={ExternalLink}
                    onClick={() => addToast(`Opening guide: ${res.title}`, 'info')}
                  >
                    Read Guide
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Placement Resources Found"
          description="Publish interview tips, system design articles, or PDF cheatsheets."
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
        subtitle="Publish technical interview tips, coding practice guides, or PDF cheatsheets"
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
              options={[
                { value: 'Interview Tips', label: 'Interview Tips' },
                { value: 'Coding Practice', label: 'Coding Practice' },
                { value: 'Articles', label: 'Articles & System Design' },
                { value: 'PDFs', label: 'PDF Cheatsheets' }
              ]}
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
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />

            <Input
              label="PDF File URL / Document Link"
              icon={FileSpreadsheet}
              placeholder="https://domain.com/cheatsheet.pdf"
              value={formData.linkUrl}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              helperText="Enter direct PDF URL or AWS S3 document download link"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 tracking-wider uppercase">
              Snippet Summary / Overview
            </label>
            <textarea
              rows={3}
              placeholder="Brief summary of the interview guide or cheat sheet content..."
              value={formData.snippet}
              onChange={(e) => setFormData({ ...formData, snippet: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-2xs"
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
