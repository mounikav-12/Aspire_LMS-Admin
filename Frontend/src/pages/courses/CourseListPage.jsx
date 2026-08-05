import React, { useState } from 'react';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import {
  BookOpen,
  Plus,
  Search,
  Star,
  Users,
  Edit2,
  Trash2,
  ChevronRight,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

export function CourseListPage() {
  const { courses, addCourse, updateCourse, deleteCourse } = useLmsData();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Development',
    level: 'Intermediate',
    instructor: 'David Chen',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    description: ''
  });

  const handleOpenAddModal = () => {
    setFormData({
      title: '',
      category: 'Web Development',
      level: 'Intermediate',
      instructor: 'David Chen',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      description: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      category: course.category,
      level: course.level,
      instructor: course.instructor,
      thumbnail: course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      description: course.description
    });
  };

  const handleSaveCourse = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      addToast('Please fill in title and description', 'error');
      return;
    }

    if (editingCourse) {
      updateCourse(editingCourse.id, formData);
      addToast(`Updated course: "${formData.title}"`, 'success');
      setEditingCourse(null);
    } else {
      addCourse({
        ...formData,
        topics: [
          {
            id: `top-${Date.now()}-1`,
            title: 'Module 1: Core Fundamentals & Setup',
            liveClasses: 2,
            practice: 4,
            assessments: 1
          },
          {
            id: `top-${Date.now()}-2`,
            title: 'Module 2: Advanced System Architecture',
            liveClasses: 3,
            practice: 5,
            assessments: 2
          }
        ]
      });
      addToast(`Course "${formData.title}" created with default topic modules!`, 'success');
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingCourse) {
      deleteCourse(deletingCourse.id);
      addToast(`Deleted course "${deletingCourse.title}"`, 'info');
      setDeletingCourse(null);
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-normal text-slate-900 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-600" /> Course Catalog & Topics
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage curriculum tracks, author topics, and organize live classes, practice sets, and assessments.
          </p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAddModal}>
          Create New Course
        </Button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses by title, instructor, keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="w-full md:w-56">
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Categories' },
              { value: 'Web Development', label: 'Web Development' },
              { value: 'Cloud & Infrastructure', label: 'Cloud & Infrastructure' },
              { value: 'Computer Science', label: 'Computer Science' }
            ]}
          />
        </div>
      </div>

      {/* Structured Course Grid Cards */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between h-full"
            >
              {/* Top Section */}
              <div>
                {/* Fixed Height Thumbnail Header */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  {/* Category Pill Top Left */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-slate-950/80 text-white text-[11px] font-bold px-3 py-1 rounded-lg backdrop-blur-md border border-white/10 shadow-sm">
                      {course.category}
                    </span>
                  </div>

                  {/* Actions Top Right */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200/60 z-10">
                    <button
                      onClick={() => handleOpenEditModal(course)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit Course"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingCourse(course)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Delete Course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content Details with Structured Spacing */}
                <div className="p-5 space-y-3">
                  {/* Metrics Bar */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-600">
                      <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>{course.enrolledCount} Students Enrolled</span>
                    </span>

                    <span className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200/60">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{course.rating}</span>
                    </span>
                  </div>

                  {/* Fixed Min-Height Title for Proper Grid Alignment */}
                  <div className="min-h-[2.75rem] flex items-center">
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                  </div>

                  {/* Fixed Min-Height Description */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed min-h-[2.25rem]">
                    {course.description}
                  </p>

                  {/* Topic Modules Count Pill */}
                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-slate-800">
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                      <Layers className="w-4 h-4" />
                    </div>
                    <span>{course.topics?.length || 0} Topic Modules</span>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Section Always Aligned at Bottom */}
              <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium truncate max-w-[50%]">By {course.instructor}</span>
                <Link
                  to={`/courses/${course.id}`}
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 transition-all group-hover:translate-x-1"
                >
                  Explore Topics <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Courses Found"
          description="Create your first course track to start organizing topic modules."
          actionLabel="Add Course"
          onAction={handleOpenAddModal}
        />
      )}

      {/* Add / Edit Course Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingCourse}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingCourse(null);
        }}
        title={editingCourse ? 'Edit Course Details' : 'Add New Course'}
        subtitle="Define course properties, thumbnail URL, and instructor assignments"
      >
        <form onSubmit={handleSaveCourse} className="space-y-4">
          <Input
            label="Course Title"
            placeholder="e.g. Advanced System Design & Microservices"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'Web Development', label: 'Web Development' },
                { value: 'Cloud & Infrastructure', label: 'Cloud & Infrastructure' },
                { value: 'Computer Science', label: 'Computer Science' }
              ]}
            />

            <Select
              label="Difficulty Level"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              options={[
                { value: 'Beginner', label: 'Beginner' },
                { value: 'Intermediate', label: 'Intermediate' },
                { value: 'Advanced', label: 'Advanced' },
                { value: 'All Levels', label: 'All Levels' }
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Lead Instructor"
              placeholder="Instructor Name"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            />

            <Input
              label="Course Thumbnail Image URL"
              icon={ImageIcon}
              placeholder="https://images.unsplash.com/photo-xxx"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              helperText="Optional image URL for course cover card"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 tracking-wider uppercase">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Provide a comprehensive course overview..."
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
                setEditingCourse(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingCourse ? 'Save Course' : 'Create Course'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingCourse}
        onClose={() => setDeletingCourse(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Course Track"
        message={`Are you sure you want to delete "${deletingCourse?.title}"? All associated topics will be removed.`}
        confirmText="Delete Course"
      />
    </div>
  );
}
