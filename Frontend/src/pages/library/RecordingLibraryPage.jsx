import React, { useState } from 'react';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { BatchFilterSelector } from '../../components/common/BatchFilterSelector';
import {
  FolderGit2,
  Plus,
  Search,
  Play,
  Clock,
  UserCheck,
  Edit2,
  Trash2,
  Video,
  Image as ImageIcon
} from 'lucide-react';

export function RecordingLibraryPage() {
  const { recordings, addRecording, updateRecording, deleteRecording, activeBatchFilter, setActiveBatchFilter } = useLmsData();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRecording, setEditingRecording] = useState(null);
  const [deletingRecording, setDeletingRecording] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    conceptName: '',
    duration: '',
    instructor: '',
    videoUrl: '',
    thumbnail: '',
    description: '',
    instructions: ''
  });

  const handleOpenAddModal = () => {
    setFormData({
      title: '',
      conceptName: '',
      duration: '',
      instructor: '',
      videoUrl: '',
      thumbnail: '',
      description: '',
      instructions: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (e, rec) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingRecording(rec);
    setFormData({
      title: rec.title,
      conceptName: rec.conceptName,
      duration: rec.duration,
      instructor: rec.instructor,
      videoUrl: rec.videoUrl || '',
      thumbnail: rec.thumbnail || '',
      description: rec.description,
      instructions: rec.instructions
    });
  };

  const handleDeleteClick = (e, rec) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingRecording(rec);
  };

  const handleSaveRecording = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.conceptName) {
      addToast('Please enter title and concept name', 'error');
      return;
    }

    if (editingRecording) {
      updateRecording(editingRecording.id, formData);
      addToast(`Updated recording: "${formData.title}"`, 'success');
      setEditingRecording(null);
    } else {
      addRecording(formData);
      addToast(`Recording "${formData.title}" added to library!`, 'success');
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingRecording) {
      deleteRecording(deletingRecording.id);
      addToast(`Deleted recording "${deletingRecording.title}"`, 'info');
      setDeletingRecording(null);
    }
  };

  const filteredRecordings = recordings.filter((r) => {
    return (
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.conceptName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-7 h-7 text-blue-600" /> Video Recording Library
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage recorded tech lectures, video stream links, concept deep-dives, and exercise guides published to the Student LMS.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">

          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAddModal}>
            Add Video Recording
          </Button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search recording library by title, concept name, instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Recording Cards Grid */}
      {filteredRecordings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecordings.map((rec) => (
            <Link
              key={rec.id}
              to={`/library/${rec.id}`}
              className="group bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail Container */}
                <div className="relative h-44 overflow-hidden bg-slate-900">
                  <img
                    src={rec.thumbnail}
                    alt={rec.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  {/* Play Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center group-hover:bg-slate-900/20 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Duration Pill */}
                  <div className="absolute bottom-3 right-3 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-xs flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-400" /> {rec.duration}
                  </div>

                  {/* Edit/Delete Actions */}
                  <div className="absolute top-3 right-3 flex gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-xl shadow-md z-10">
                    <button
                      onClick={(e) => handleOpenEditModal(e, rec)}
                      className="p-1 text-slate-600 hover:text-blue-600 transition-colors"
                      title="Edit Recording"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, rec)}
                      className="p-1 text-slate-600 hover:text-rose-600 transition-colors"
                      title="Delete Recording"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 space-y-2">
                  <Badge variant="blue">{rec.conceptName}</Badge>

                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {rec.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
                    {rec.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" /> {rec.instructor}
                </span>
                <span className="font-bold text-blue-600 group-hover:underline">Watch Video →</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Recordings Found"
          description="Upload video recordings for student review."
          actionLabel="Add Recording"
          onAction={handleOpenAddModal}
        />
      )}

      {/* Add / Edit Recording Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingRecording}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingRecording(null);
        }}
        title={editingRecording ? 'Edit Recording Details' : 'Add Video Recording'}
        subtitle="Specify video stream URL, lecture metadata, concept tags, and lab instructions"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSaveRecording} className="space-y-4">
          <Input
            label="Video Title"
            placeholder="e.g. System Design: Rate Limiter & Token Bucket"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Concept Name"
              placeholder="e.g. Distributed Caching"
              value={formData.conceptName}
              onChange={(e) => setFormData({ ...formData, conceptName: e.target.value })}
              required
            />

            <Input
              label="Duration"
              placeholder="e.g. 1h 45m"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
          </div>

          <Input
            label="Instructor Name"
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
          />

          <Input
            label="Video Stream / File URL (.mp4, AWS S3, Vimeo, Cloudinary)"
            icon={Video}
            placeholder="https://www.w3schools.com/html/mov_bbb.mp4"
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            helperText="Enter a direct MP4 URL, AWS S3 link, or video stream endpoint"
            required
          />

          <Input
            label="Cover Thumbnail Image URL"
            icon={ImageIcon}
            placeholder="https://images.unsplash.com/photo-xxx"
            value={formData.thumbnail}
            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
            helperText="Optional poster image URL for the video player"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
              Video Overview / Description
            </label>
            <textarea
              rows={2}
              placeholder="Detailed concept walkthrough explanation..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
              Lab Instructions / Action Steps
            </label>
            <textarea
              rows={2}
              placeholder="Prerequisites and code repository instructions..."
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingRecording(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingRecording ? 'Save Recording' : 'Add Recording'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingRecording}
        onClose={() => setDeletingRecording(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Video Recording"
        message={`Are you sure you want to delete "${deletingRecording?.title}"?`}
        confirmText="Delete Recording"
      />
    </div>
  );
}
