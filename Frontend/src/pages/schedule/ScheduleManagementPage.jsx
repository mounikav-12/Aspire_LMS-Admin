import React, { useState } from 'react';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  ArrowRight,
  Edit3,
  Trash2,
  ExternalLink,
  BookOpen,
  Sparkles
} from 'lucide-react';

export function ScheduleManagementPage() {
  const { dailySchedule, addScheduleTopic, updateScheduleTopic, deleteScheduleTopic, toggleTopicStatus } = useLmsData();
  const { addToast } = useToast();

  // Selected date state defaulting to 2026-08-07 (matching screenshot)
  const [selectedDate, setSelectedDate] = useState(new Date('2026-08-07'));
  const [selectedProgram, setSelectedProgram] = useState('AI & Machine Learning Program');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    topicIndex: 'Topic 1',
    categoryTag: 'Functions',
    duration: '45 mins',
    title: '',
    description: '',
    lessonUrl: 'https://www.w3schools.com/python/'
  });

  const formatDateKey = (dateObj) => {
    return dateObj.toISOString().split('T')[0];
  };

  const formattedDateKey = formatDateKey(selectedDate);

  // Helper for human readable date matching screenshot: "Thursday, August 7, 2026"
  const formattedDateHeading = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const shortMonthDay = selectedDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric'
  });

  const isToday = formatDateKey(new Date()) === formattedDateKey || formattedDateKey === '2026-08-07';

  // Fetch current day's schedule data
  const currentDayData = dailySchedule[formattedDateKey] || {
    dayLabel: 'Day 7 of 31',
    programName: selectedProgram,
    topics: []
  };

  // Date Navigation handlers
  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handleJumpToday = () => {
    setSelectedDate(new Date('2026-08-07'));
  };

  const handleOpenCreateModal = () => {
    setEditingTopic(null);
    setFormData({
      topicIndex: `Topic ${(currentDayData.topics?.length || 0) + 1}`,
      categoryTag: 'Functions',
      duration: '45 mins',
      title: '',
      description: '',
      lessonUrl: 'https://www.w3schools.com/python/'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (topic) => {
    setEditingTopic(topic);
    setFormData({
      topicIndex: topic.topicIndex,
      categoryTag: topic.categoryTag,
      duration: topic.duration,
      title: topic.title,
      description: topic.description,
      lessonUrl: topic.lessonUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      addToast('Please fill in title and description', 'error');
      return;
    }

    if (editingTopic) {
      await updateScheduleTopic(formattedDateKey, editingTopic.id, {
        topicIndex: formData.topicIndex,
        categoryTag: formData.categoryTag,
        duration: formData.duration,
        title: formData.title,
        description: formData.description,
        lessonUrl: formData.lessonUrl
      });
      addToast(`Updated topic: "${formData.title}"`, 'success');
    } else {
      await addScheduleTopic(formattedDateKey, {
        topicIndex: formData.topicIndex,
        categoryTag: formData.categoryTag,
        duration: formData.duration,
        title: formData.title,
        description: formData.description,
        lessonUrl: formData.lessonUrl
      });
      addToast(`Added topic for ${shortMonthDay}: "${formData.title}"`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (deleteConfirmId) {
      await deleteScheduleTopic(formattedDateKey, deleteConfirmId);
      addToast('Deleted topic from schedule', 'info');
      setDeleteConfirmId(null);
    }
  };

  const handleToggleStatus = async (topicId) => {
    await toggleTopicStatus(formattedDateKey, topicId);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header matching screenshot layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Your Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Manage daily learning topics, lesson durations, and curriculum schedules
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Calendar Jump Button matching screenshot */}
          <div className="relative">
            <input
              type="date"
              value={formattedDateKey}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            <button
              type="button"
              className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-2xl font-bold text-xs flex items-center gap-2 border border-blue-200/60 shadow-2xs transition-all cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4 text-blue-600" />
              <span>Calendar</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleOpenCreateModal}
            className="shadow-md"
          >
            Add Topic
          </Button>
        </div>
      </div>

      {/* Date Navigation Bar matching screenshot: < Thursday, August 7, 2026 Today > */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <button
          onClick={handlePrevDay}
          className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          title="Previous Day"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <h2 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight text-center">
            {formattedDateHeading}
          </h2>
          {isToday && (
            <button
              onClick={handleJumpToday}
              className="px-3 py-1 bg-blue-100/70 text-blue-700 rounded-full text-xs font-extrabold border border-blue-200/60"
            >
              Today
            </button>
          )}
        </div>

        <button
          onClick={handleNextDay}
          className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          title="Next Day"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Subheader Banner: Topics for August 7 & Day 7 of 31 Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <BookMarked className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Topics for {shortMonthDay}
          </h3>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200/70">
            {currentDayData.dayLabel || 'Day 7 of 31'}
          </span>
        </div>
      </div>

      {/* Topics Cards Grid matching screenshot layout & card styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {(currentDayData.topics || []).map((topic) => (
          <div
            key={topic.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between space-y-4 group relative"
          >
            <div>
              {/* Header Badges & Duration matching screenshot */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {/* Interactive Status Toggle (Checkmark vs Circle) */}
                  <button
                    onClick={() => handleToggleStatus(topic.id)}
                    className="cursor-pointer focus:outline-none transition-transform hover:scale-110"
                    title={topic.status === 'Completed' ? 'Mark as Scheduled' : 'Mark as Completed'}
                  >
                    {topic.status === 'Completed' ? (
                      <div className="w-6 h-6 rounded-full bg-blue-900 flex items-center justify-center text-white shadow-xs">
                        <CheckCircle2 className="w-5 h-5 text-white fill-blue-900" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-slate-300 hover:border-blue-600 transition-colors" />
                    )}
                  </button>

                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-extrabold border border-blue-100">
                    {topic.topicIndex}
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">
                    {topic.categoryTag}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{topic.duration}</span>
                </div>
              </div>

              {/* Topic Title matching screenshot typography */}
              <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug mb-2">
                {topic.title}
              </h4>

              {/* Topic Description matching screenshot */}
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {topic.description}
              </p>
            </div>

            {/* Bottom Row: Open Lesson View Link & Admin Controls */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <a
                href={topic.lessonUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors group-hover:translate-x-0.5"
              >
                Open Lesson View <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEditModal(topic)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                  title="Edit Topic"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(topic.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete Topic"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {(currentDayData.topics || []).length === 0 && (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No topics scheduled for {shortMonthDay}</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click below to schedule daily topics, duration, and lesson materials for this date.
            </p>
            <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreateModal}>
              Add First Topic for {shortMonthDay}
            </Button>
          </div>
        )}
      </div>

      {/* Create / Edit Topic Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTopic ? 'Edit Schedule Topic' : `Add Topic for ${shortMonthDay}`}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Topic Index Label"
              type="text"
              placeholder="Topic 1"
              value={formData.topicIndex}
              onChange={(e) => setFormData({ ...formData, topicIndex: e.target.value })}
              required
            />

            <Input
              label="Category Tag"
              type="text"
              placeholder="Functions / OOP / Data Science"
              value={formData.categoryTag}
              onChange={(e) => setFormData({ ...formData, categoryTag: e.target.value })}
              required
            />
          </div>

          <Input
            label="Estimated Duration"
            type="text"
            placeholder="45 mins"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
          />

          <Input
            label="Topic Title"
            type="text"
            placeholder="Python *args and **kwargs Variable Arguments"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
              Topic Description & Learning Objectives
            </label>
            <textarea
              rows={3}
              placeholder="Accepting dynamic positional and keyword arguments in reusable functions"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
              required
            />
          </div>

          <Input
            label="Lesson Resource URL"
            type="text"
            placeholder="https://www.w3schools.com/python/"
            value={formData.lessonUrl}
            onChange={(e) => setFormData({ ...formData, lessonUrl: e.target.value })}
          />

          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingTopic ? 'Save Changes' : 'Schedule Topic'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Schedule Topic"
        message="Are you sure you want to remove this topic from the daily schedule?"
      />
    </div>
  );
}
