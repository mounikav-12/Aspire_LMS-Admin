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
  Video,
  Plus,
  Search,
  Calendar,
  Clock,
  ExternalLink,
  UserCheck,
  Edit2,
  Trash2,
  Tv2
} from 'lucide-react';

export function LiveSessionListPage() {
  const { liveSessions, addLiveSession, updateLiveSession, deleteLiveSession } = useLmsData();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [deletingSession, setDeletingSession] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    programName: 'Senior Engineering Cohort',
    technology: 'React 18 & TypeScript',
    sessionTitle: '',
    date: '2026-08-08',
    time: '18:00 - 19:30 EST',
    meetingLink: 'https://meet.google.com/aspire-lms-live',
    instructor: 'David Chen',
    description: ''
  });

  const handleOpenAddModal = () => {
    setFormData({
      programName: 'Senior Engineering Cohort',
      technology: 'React 18 & TypeScript',
      sessionTitle: '',
      date: '2026-08-08',
      time: '18:00 - 19:30 EST',
      meetingLink: 'https://meet.google.com/aspire-lms-live',
      instructor: 'David Chen',
      description: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (sess) => {
    setEditingSession(sess);
    setFormData({
      programName: sess.programName,
      technology: sess.technology,
      sessionTitle: sess.sessionTitle,
      date: sess.date,
      time: sess.time,
      meetingLink: sess.meetingLink,
      instructor: sess.instructor,
      description: sess.description
    });
  };

  const handleSaveSession = (e) => {
    e.preventDefault();
    if (!formData.sessionTitle || !formData.meetingLink) {
      addToast('Please fill in session title and meeting link', 'error');
      return;
    }

    if (editingSession) {
      updateLiveSession(editingSession.id, formData);
      addToast(`Updated live session: "${formData.sessionTitle}"`, 'success');
      setEditingSession(null);
    } else {
      addLiveSession(formData);
      addToast(`Scheduled live session: "${formData.sessionTitle}"`, 'success');
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingSession) {
      deleteLiveSession(deletingSession.id);
      addToast(`Cancelled live session "${deletingSession.sessionTitle}"`, 'info');
      setDeletingSession(null);
    }
  };

  const filteredSessions = liveSessions.filter((s) => {
    const matchesSearch =
      s.sessionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.technology.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Video className="w-7 h-7 text-blue-600" /> Live Sessions & Meeting Rooms
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Schedule live webinars, broadcast Google Meet / Zoom links, and manage instructor class calendars.
          </p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAddModal}>
          Schedule Live Class
        </Button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search live sessions by title, tech stack, instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="w-full md:w-56">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'Live Soon', label: 'Live Soon' },
              { value: 'Upcoming', label: 'Upcoming' },
              { value: 'Completed', label: 'Completed' }
            ]}
          />
        </div>
      </div>

      {/* Live Session Grid Cards */}
      {filteredSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((sess) => (
            <div
              key={sess.id}
              className="group bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1.5 p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Badges & Actions */}
                <div className="flex items-center justify-between">
                  <Badge variant="blue" className="px-3 py-1">
                    {sess.technology}
                  </Badge>

                  <div className="flex items-center gap-2">
                    <Badge variant={sess.status === 'Live Soon' ? 'rose' : sess.status === 'Completed' ? 'slate' : 'sky'}>
                      {sess.status === 'Live Soon' && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-1 inline-block" />}
                      {sess.status}
                    </Badge>

                    <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl">
                      <button
                        onClick={() => handleOpenEditModal(sess)}
                        className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                        title="Edit Session"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingSession(sess)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                        title="Cancel Session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Session Title */}
                <div>
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    {sess.programName}
                  </span>
                  <h3 className="font-black text-slate-900 text-base group-hover:text-blue-600 transition-colors leading-snug">
                    {sess.sessionTitle}
                  </h3>
                </div>

                {/* Date & Time */}
                <div className="space-y-2 pt-1 text-xs text-slate-600 font-semibold bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>{sess.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-600 flex-shrink-0" />
                    <span>{sess.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 pt-1 border-t border-slate-200/60">
                    <UserCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Instructor: <strong className="text-slate-800 font-bold">{sess.instructor}</strong></span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                  {sess.description}
                </p>
              </div>

              {/* Meeting Room Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <a
                  href={sess.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
                >
                  <Tv2 className="w-4 h-4" /> Open Meeting Room <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Live Sessions Found"
          description="Schedule live webinars or broadcast meeting room links."
          actionLabel="Schedule Live Class"
          onAction={handleOpenAddModal}
        />
      )}

      {/* Add / Edit Live Session Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingSession}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingSession(null);
        }}
        title={editingSession ? 'Edit Live Session' : 'Schedule Live Class Session'}
        subtitle="Configure session title, tech track, meeting room link, and date/time"
      >
        <form onSubmit={handleSaveSession} className="space-y-4">
          <Input
            label="Session Title"
            placeholder="e.g. Deep Dive into React Server Components"
            value={formData.sessionTitle}
            onChange={(e) => setFormData({ ...formData, sessionTitle: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Cohort / Program Name"
              placeholder="e.g. Senior Engineering Cohort #4"
              value={formData.programName}
              onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
            />

            <Input
              label="Technology Track"
              placeholder="e.g. React 18 & TypeScript"
              value={formData.technology}
              onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />

            <Input
              label="Time Slot"
              placeholder="e.g. 18:00 - 19:30 EST"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>

          <Input
            label="Meeting Room URL (Google Meet, Zoom, MS Teams)"
            placeholder="https://meet.google.com/aspire-lms-live"
            value={formData.meetingLink}
            onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
            required
          />

          <Input
            label="Instructor Name"
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 tracking-wider uppercase">
              Session Agenda / Overview
            </label>
            <textarea
              rows={3}
              placeholder="Detail session objectives and lab prerequisites..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-2xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingSession(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingSession ? 'Save Session' : 'Schedule Session'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingSession}
        onClose={() => setDeletingSession(null)}
        onConfirm={handleDeleteConfirm}
        title="Cancel Live Session"
        message={`Are you sure you want to cancel "${deletingSession?.sessionTitle}"?`}
        confirmText="Cancel Session"
      />
    </div>
  );
}
