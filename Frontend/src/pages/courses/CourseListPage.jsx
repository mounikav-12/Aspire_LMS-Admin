import React, { useState } from 'react';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { BatchFilterSelector } from '../../components/common/BatchFilterSelector';
import {
  BookOpen,
  Plus,
  Search,
  Star,
  Users,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronDown,
  Check,
  Layers,
  Image as ImageIcon,
  Eye,
  CheckSquare,
  Square,
  Calendar
} from 'lucide-react';

function CustomDropdownSelect({ label, value, onChange, options = [], icon: Icon, placeholder = 'Select an option' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || {
    value,
    label: value || placeholder
  };

  return (
    <div className="w-full min-w-0 flex flex-col gap-1.5" ref={dropdownRef}>
      {label && (
        <label className="text-[11px] font-extrabold text-slate-700 tracking-wider uppercase truncate" title={label}>
          {label}
        </label>
      )}
      <div className="relative min-w-0">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full min-w-0 px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border rounded-xl text-sm text-left flex items-center justify-between transition-all duration-200 cursor-pointer shadow-2xs ${
            isOpen
              ? 'bg-white border-blue-500 ring-4 ring-blue-500/10 text-slate-900'
              : 'border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 truncate pr-2">
            {Icon && <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />}
            <span className="truncate text-sm font-medium">{selectedOption.label}</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-blue-600' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 left-0 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="truncate pr-2">{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function getCourseModulesCount(course, milestones) {
  if (!course) return 0;

  if (Array.isArray(course.topics) && course.topics.length > 0) {
    let totalModules = 0;
    let hasExplicitNested = false;
    course.topics.forEach(t => {
      if (Array.isArray(t.modules) && t.modules.length > 0) {
        totalModules += t.modules.length;
        hasExplicitNested = true;
      } else if (Array.isArray(t.subtopics) && t.subtopics.length > 0) {
        totalModules += t.subtopics.length;
        hasExplicitNested = true;
      } else if (typeof t.modulesCount === 'number' && t.modulesCount > 0) {
        totalModules += t.modulesCount;
        hasExplicitNested = true;
      }
    });
    if (hasExplicitNested && totalModules > 0) return totalModules;
    return course.topics.length;
  }

  const isPythonFullStackCourse = (course.title || '').toLowerCase().includes('python full') || (course.id || '').includes('1786624019154');
  if (isPythonFullStackCourse) {
    const milestoneStages = milestones?.stages || [];
    return milestoneStages.length > 0 ? milestoneStages.length : 4;
  }

  return 0;
}

function CourseCardItem({ course, onViewBatches, onEdit, onDelete, milestones }) {
  const navigate = useNavigate();

  const topicCount = getCourseModulesCount(course, milestones);

  const getEffectiveBatchBadge = () => {
    let wdList = null;
    let weList = null;
    try {
      const savedWd = localStorage.getItem(`aspire_lms_card_wd_${course.id}`);
      if (savedWd) wdList = JSON.parse(savedWd);
      const savedWe = localStorage.getItem(`aspire_lms_card_we_${course.id}`);
      if (savedWe) weList = JSON.parse(savedWe);
    } catch (e) {}

    const hasWd = Array.isArray(wdList) && wdList.length > 0;
    const hasWe = Array.isArray(weList) && weList.length > 0;

    if (hasWd && hasWe) {
      return { label: 'All', color: 'bg-emerald-600 text-white' };
    }
    if (hasWd && !hasWe) {
      return { label: 'Weekday', color: 'bg-blue-600 text-white' };
    }
    if (hasWe && !hasWd) {
      return { label: 'Weekend', color: 'bg-indigo-600 text-white' };
    }

    if (!course.targetBatch || course.targetBatch === 'All Batches' || course.targetBatch === 'ALL' || course.targetBatch === 'Weekday & Weekend' || course.targetBatch === 'All') {
      return { label: 'All', color: 'bg-emerald-600 text-white' };
    }
    if (course.targetBatch?.startsWith('A26S') || course.targetBatch === 'Weekend Batch' || course.targetBatch === 'Weekend') {
      return { label: 'Weekend', color: 'bg-indigo-600 text-white' };
    }
    if (course.targetBatch?.startsWith('A26W') || course.targetBatch === 'Weekday Batch' || course.targetBatch === 'Weekday') {
      return { label: 'Weekday', color: 'bg-blue-600 text-white' };
    }
    return { label: course.targetBatch === 'All Batches' ? 'All' : course.targetBatch === 'Weekday Batch' ? 'Weekday' : course.targetBatch === 'Weekend Batch' ? 'Weekend' : course.targetBatch, color: 'bg-emerald-600 text-white' };
  };

  const batchBadge = getEffectiveBatchBadge();

  return (
    <div
      onClick={() => navigate(`/courses/${course.id}`)}
      className="group bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between h-full cursor-pointer"
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
          <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
            <span className="bg-slate-950/80 text-white text-[11px] font-bold px-3 py-1 rounded-lg backdrop-blur-md border border-white/10 shadow-sm">
              {course.category}
            </span>
          </div>

          {/* Actions Top Right */}
          <div
            className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200/60 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Eye Symbol Button (View & Select Batches Popup) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewBatches(course);
              }}
              className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="View & Select Course Batches"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(course);
              }}
              className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Edit Course"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(course);
              }}
              className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Delete Course"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 space-y-3">

          {/* Metrics Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5 font-semibold text-slate-600">
              <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>{course.enrolledCount} Students Enrolled</span>
            </span>

            <span className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200/60">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{course.rating}</span>
            </span>
          </div>

          {/* Fixed Min-Height Title */}
          <div className="min-h-[2.75rem] flex items-center">
            <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
              {course.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed min-h-[2.25rem]">
            {course.description}
          </p>

          {/* Topic Modules Count Pill */}
          <div className="pt-2 flex items-center gap-2 text-xs font-bold text-slate-800">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Layers className="w-4 h-4" />
            </div>
            <span>{topicCount} Topic Modules</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium truncate max-w-[40%]">By {course.instructor}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/milestones?courseId=${course.id}`);
            }}
            className="inline-flex items-center gap-1 font-extrabold text-[11px] text-purple-700 bg-purple-100/70 hover:bg-purple-200/80 px-2.5 py-1 rounded-lg border border-purple-200 transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
            <span>Milestones Roadmap</span>
          </button>
          <span className="inline-flex items-center gap-1 font-bold text-blue-600 group-hover:text-blue-800 transition-all group-hover:translate-x-1">
            Explore Topics <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
}

function normalizeCategoryStr(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');
}

function isCategoryMatch(course, filter) {
  if (!filter || filter === 'ALL') return true;

  const cat = course.category || '';
  const title = course.title || '';

  const normCat = normalizeCategoryStr(cat);
  const normFilter = normalizeCategoryStr(filter);
  const normTitle = normalizeCategoryStr(title);

  if (filter === 'Courses') {
    return (
      normCat === 'courses' ||
      normCat === 'webdevelopment' ||
      normCat === 'cloudinfrastructure' ||
      normCat === 'computerscience' ||
      !normCat
    );
  }

  // Exact or normalized category match
  if (normCat === normFilter) return true;

  // Handles variations like "communication & soft skills", "communication and soft skills", "communication&softskills", "soft skills"
  if (normCat.length > 0 && (normCat.includes(normFilter) || normFilter.includes(normCat))) {
    return true;
  }

  // Fallback: If title explicitly mentions key category terms
  if (filter === 'Communication & Soft Skills') {
    if (normTitle.includes('communication') || normTitle.includes('softskill')) return true;
  } else if (filter === 'Aptitude & Reasoning') {
    if (normTitle.includes('aptitude') || normTitle.includes('reasoning')) return true;
  } else if (filter === 'Resume') {
    if (normTitle.includes('resume')) return true;
  } else if (filter === 'Portfolio') {
    if (normTitle.includes('portfolio')) return true;
  } else if (filter === 'LinkedIn') {
    if (normTitle.includes('linkedin')) return true;
  }

  return false;
}

const CATEGORY_TABS = [
  { id: 'ALL', label: 'All' },
  { id: 'Courses', label: 'Courses' },
  { id: 'Communication & Soft Skills', label: 'Communication & Soft Skills' },
  { id: 'Aptitude & Reasoning', label: 'Aptitude & Reasoning' },
  { id: 'Resume', label: 'Resume' },
  { id: 'Portfolio', label: 'Portfolio' },
  { id: 'LinkedIn', label: 'LinkedIn' }
];

export function CourseListPage() {
  const { courses, addCourse, updateCourse, deleteCourse, activeBatchFilter, setActiveBatchFilter, availableBatches, milestones } = useLmsData();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [batchFilter, setBatchFilterState] = useState(activeBatchFilter || 'ALL');

  React.useEffect(() => {
    if (activeBatchFilter && activeBatchFilter !== batchFilter) {
      setBatchFilterState(activeBatchFilter);
    }
  }, [activeBatchFilter]);

  const setBatchFilter = (val) => {
    setBatchFilterState(val);
    if (setActiveBatchFilter) setActiveBatchFilter(val);
  };
  const allWeekdayBatchesList = (
    availableBatches && availableBatches.length > 0
      ? availableBatches.filter(
          (b) => b.startsWith('A26W') && !b.startsWith('A26S') && !b.startsWith('A26WE')
        )
      : ['A26W1', 'A26W2', 'A26W3']
  );
  const allWeekendBatchesList = (
    availableBatches && availableBatches.length > 0
      ? availableBatches
          .filter((b) => b.startsWith('A26S') || b.startsWith('A26WE'))
          .map((b) => b.replace(/^A26WE/, 'A26S'))
          .filter((b, i, arr) => arr.indexOf(b) === i)
      : ['A26S1', 'A26S2']
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [viewingBatchesCourse, setViewingBatchesCourse] = useState(null);
  const [eyeActiveTab, setEyeActiveTab] = useState('Weekdays');
  const [selectedWeekdayBatches, setSelectedWeekdayBatches] = useState([]);
  const [selectedWeekendBatches, setSelectedWeekendBatches] = useState([]);

  const handleOpenEyeModal = (course) => {
    setViewingBatchesCourse(course);
    setEyeActiveTab('Weekdays');
    try {
      const savedWd = localStorage.getItem(`aspire_lms_card_wd_${course.id}`);
      setSelectedWeekdayBatches(savedWd ? JSON.parse(savedWd) : []);
      const savedWe = localStorage.getItem(`aspire_lms_card_we_${course.id}`);
      setSelectedWeekendBatches(savedWe ? JSON.parse(savedWe) : []);
    } catch (e) {
      setSelectedWeekdayBatches([]);
      setSelectedWeekendBatches([]);
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Courses',
    level: 'Intermediate',
    targetBatch: 'All Batches',
    instructor: 'David Chen',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    description: ''
  });

  const handleOpenAddModal = () => {
    setFormData({
      title: '',
      category: categoryFilter !== 'ALL' ? categoryFilter : 'Courses',
      level: 'Intermediate',
      targetBatch: batchFilter || activeBatchFilter || 'All Batches',
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
      category: course.category || 'Web Development',
      level: course.level || 'Intermediate',
      targetBatch: course.targetBatch || 'All Batches',
      instructor: course.instructor || 'David Chen',
      thumbnail: course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      description: course.description || ''
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
        targetBatch: batchFilter || activeBatchFilter || 'All Batches',
        topics: (formData.topics && formData.topics.length > 0) ? formData.topics : [
          {
            id: `top-${Date.now()}-1`,
            title: 'Stage 1: Front End + Repository (Git & Web Architecture)',
            liveClasses: 2,
            practice: 4,
            assessments: 1
          },
          {
            id: `top-${Date.now()}-2`,
            title: 'Stage 2: Core Fundamentals & Data Structures',
            liveClasses: 3,
            practice: 5,
            assessments: 1
          }
        ]
      });
      addToast(`Course "${formData.title}" created successfully!`, 'success');
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
    
    const matchesCategory = isCategoryMatch(c, categoryFilter);

    const matchesBatch = (() => {
      if (batchFilter === 'ALL') return true;
      if (!c.targetBatch || c.targetBatch === 'All Batches' || c.targetBatch === 'ALL') return true;
      if (c.targetBatch === batchFilter || c.targetBatch === activeBatchFilter) return true;

      const isWeekendFilter = batchFilter === 'Weekend Batch' || batchFilter.startsWith('A26S');
      const isWeekdayFilter = batchFilter === 'Weekday Batch' || (batchFilter.startsWith('A26W') && !batchFilter.startsWith('A26S'));

      const courseIsWeekend = c.targetBatch === 'Weekend Batch' || c.targetBatch?.startsWith('A26S');
      const courseIsWeekday = c.targetBatch === 'Weekday Batch' || (c.targetBatch?.startsWith('A26W') && !c.targetBatch?.startsWith('A26S'));

      let hasSelectedWeekendBatches = false;
      let hasSelectedWeekdayBatches = false;
      try {
        const savedWe = localStorage.getItem(`aspire_lms_card_we_${c.id}`);
        if (savedWe) {
          const parsed = JSON.parse(savedWe);
          if (Array.isArray(parsed) && parsed.length > 0) hasSelectedWeekendBatches = true;
        }
        const savedWd = localStorage.getItem(`aspire_lms_card_wd_${c.id}`);
        if (savedWd) {
          const parsed = JSON.parse(savedWd);
          if (Array.isArray(parsed) && parsed.length > 0) hasSelectedWeekdayBatches = true;
        }
      } catch (e) {}

      if (isWeekendFilter) {
        return courseIsWeekend || hasSelectedWeekendBatches || (!courseIsWeekday && !hasSelectedWeekdayBatches);
      }

      if (isWeekdayFilter) {
        return courseIsWeekday || hasSelectedWeekdayBatches || (!courseIsWeekend && !hasSelectedWeekendBatches);
      }

      return true;
    })();
    return matchesSearch && matchesCategory && matchesBatch;
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
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAddModal}>
            Create New Course
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORY_TABS.map((tab) => {
          const isActive = categoryFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 ring-2 ring-purple-600/30'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search learning modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
            Showing {filteredCourses.length} module{filteredCourses.length !== 1 ? 's' : ''}
          </span>

          <div className="w-44">
            <Select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Batches' },
                { value: 'Weekday Batch', label: 'Weekday Batch' },
                { value: 'Weekend Batch', label: 'Weekend Batch' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Structured Course Grid Cards */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCardItem
              key={course.id}
              course={course}
              milestones={milestones}
              onViewBatches={handleOpenEyeModal}
              onEdit={handleOpenEditModal}
              onDelete={(c) => setDeletingCourse(c)}
            />
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

      {/* --- PAGE-LEVEL EYE SYMBOL BATCH SELECTION MODAL POPUP --- */}
      <Modal
        isOpen={!!viewingBatchesCourse}
        onClose={() => setViewingBatchesCourse(null)}
        title={viewingBatchesCourse?.title || ''}
        subtitle="View and multi-select active Weekday and Weekend batch numbers for this course"
        maxWidth="max-w-xl"
      >
        <div className="space-y-5">
          {/* In-Popup Tabs matching uploaded image */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setEyeActiveTab('Weekdays')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                eyeActiveTab === 'Weekdays'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200/80 font-bold'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Weekday Batches</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                eyeActiveTab === 'Weekdays' ? 'bg-purple-700/90 text-white' : 'bg-slate-200/90 text-slate-800'
              }`}>
                {selectedWeekdayBatches.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setEyeActiveTab('Weekends')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                eyeActiveTab === 'Weekends'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200/80 font-bold'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Weekend Batches</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                eyeActiveTab === 'Weekends' ? 'bg-purple-700/90 text-white' : 'bg-slate-200/90 text-slate-800'
              }`}>
                {selectedWeekendBatches.length}
              </span>
            </button>
          </div>

          <div className="border-t border-slate-100 my-2"></div>

          {/* Weekdays Tab Batch Checkboxes */}
          {eyeActiveTab === 'Weekdays' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-semibold">
                Check or uncheck Weekday batch numbers for this course:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {((availableBatches && availableBatches.length > 0 ? availableBatches : ['A26W1', 'A26W2', 'A26W3']).filter(b => b.startsWith('A26W') && !b.startsWith('A26S') && !b.startsWith('A26WE'))).map((bCode) => {
                  const isSelected = selectedWeekdayBatches.includes(bCode);

                  return (
                    <div
                      key={bCode}
                      onClick={() => {
                        setSelectedWeekdayBatches((prev) => {
                          const next = prev.includes(bCode) ? prev.filter((b) => b !== bCode) : [...prev, bCode];
                          if (viewingBatchesCourse) {
                            try { localStorage.setItem(`aspire_lms_card_wd_${viewingBatchesCourse.id}`, JSON.stringify(next)); } catch (e) {}
                          }
                          return next;
                        });
                      }}
                      className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'bg-purple-50/80 border-2 border-purple-400 text-purple-950 font-extrabold shadow-2xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-700 font-bold'
                      }`}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      )}
                      <span className="text-xs font-black tracking-wide">{bCode}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Weekends Tab Batch Checkboxes */
            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-semibold">
                Check or uncheck Weekend batch numbers for this course:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {((availableBatches && availableBatches.length > 0 ? availableBatches.map(b => b.replace(/^A26WE/, 'A26S')) : ['A26S1', 'A26S2', 'A26S3', 'A26S4']).filter((b, i, arr) => (b.startsWith('A26S') || b.startsWith('A26WE')) && arr.indexOf(b) === i)).map((bCode) => {
                  const isSelected = selectedWeekendBatches.includes(bCode);

                  return (
                    <div
                      key={bCode}
                      onClick={() => {
                        setSelectedWeekendBatches((prev) => {
                          const next = prev.includes(bCode) ? prev.filter((b) => b !== bCode) : [...prev, bCode];
                          if (viewingBatchesCourse) {
                            try { localStorage.setItem(`aspire_lms_card_we_${viewingBatchesCourse.id}`, JSON.stringify(next)); } catch (e) {}
                          }
                          return next;
                        });
                      }}
                      className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'bg-purple-50/80 border-2 border-purple-400 text-purple-950 font-extrabold shadow-2xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-700 font-bold'
                      }`}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      )}
                      <span className="text-xs font-black tracking-wide">{bCode}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                if (viewingBatchesCourse) {
                  let newTargetBatch = 'All Batches';
                  const allSelected = [...selectedWeekdayBatches, ...selectedWeekendBatches];
                  if (allSelected.length > 0) {
                    newTargetBatch = allSelected.join(', ');
                  } else if (selectedWeekdayBatches.length > 0 && selectedWeekendBatches.length === 0) {
                    newTargetBatch = 'Weekday Batch';
                  } else if (selectedWeekendBatches.length > 0 && selectedWeekendBatches.length === 0) {
                    newTargetBatch = 'Weekend Batch';
                  }

                  try {
                    localStorage.setItem(`aspire_lms_card_wd_${viewingBatchesCourse.id}`, JSON.stringify(selectedWeekdayBatches));
                    localStorage.setItem(`aspire_lms_card_we_${viewingBatchesCourse.id}`, JSON.stringify(selectedWeekendBatches));
                  } catch (e) {}

                  updateCourse(viewingBatchesCourse.id, { targetBatch: newTargetBatch });
                  addToast(`Updated batch allocation for "${viewingBatchesCourse.title}"`, 'success');
                }
                setViewingBatchesCourse(null);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold px-6 py-2.5 rounded-2xl shadow-md shadow-purple-500/25 transition-all text-xs cursor-pointer"
            >
              Save Batch Preferences
            </button>
          </div>
        </div>
      </Modal>

      {/* Add / Edit Course Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingCourse}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingCourse(null);
        }}
        title={editingCourse ? 'Edit Course Details' : 'Add New Course'}
        subtitle="Define course properties, thumbnail URL, and instructor assignments"
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleSaveCourse} className="space-y-4">
          <Input
            label="Course Title"
            placeholder="e.g. Advanced System Design & Microservices"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomDropdownSelect
              label="Category"
              value={formData.category}
              onChange={(val) => setFormData({ ...formData, category: val })}
              options={[
                { value: 'Courses', label: 'Courses' },
                { value: 'Web Development', label: 'Web Development' },
                { value: 'Cloud & Infrastructure', label: 'Cloud & Infrastructure' },
                { value: 'Computer Science', label: 'Computer Science' },
                { value: 'Communication & Soft Skills', label: 'Communication & Soft Skills' },
                { value: 'Aptitude & Reasoning', label: 'Aptitude & Reasoning' },
                { value: 'Resume', label: 'Resume' },
                { value: 'Portfolio', label: 'Portfolio' },
                { value: 'LinkedIn', label: 'LinkedIn' }
              ]}
            />

            <CustomDropdownSelect
              label="Difficulty Level"
              value={formData.level}
              onChange={(val) => setFormData({ ...formData, level: val })}
              options={[
                { value: 'Beginner', label: 'Beginner' },
                { value: 'Intermediate', label: 'Intermediate' },
                { value: 'Advanced', label: 'Advanced' },
                { value: 'All Levels', label: 'All Levels' }
              ]}
            />

            <CustomDropdownSelect
              label="Target Batch Access"
              value={formData.targetBatch}
              onChange={(val) => setFormData({ ...formData, targetBatch: val })}
              options={[
                { value: 'All Batches', label: 'All Batches (Global Access)' },
                { value: 'Weekend Batch', label: 'Weekend Batches (All Weekend Students)' },
                { value: 'Weekday Batch', label: 'Weekday Batches (All Weekday Students)' },
                { value: 'A26S1', label: 'A26S1 (Weekend Batch Code)' },
                { value: 'A26S2', label: 'A26S2 (Weekend Batch Code)' },
                { value: 'A26S3', label: 'A26S3 (Weekend Batch Code)' },
                { value: 'A26S4', label: 'A26S4 (Weekend Batch Code)' },
                { value: 'A26W1', label: 'A26W1 (Weekday Batch Code)' },
                { value: 'A26W2', label: 'A26W2 (Weekday Batch Code)' },
                { value: 'A26W3', label: 'A26W3 (Weekday Batch Code)' },
                ...(availableBatches || [])
                  .filter((b) => !['A26S1', 'A26S2', 'A26S3', 'A26S4', 'A26W1', 'A26W2', 'A26W3'].includes(b))
                  .map((b) => ({
                    value: b,
                    label: b.startsWith('A26W') && !b.startsWith('A26S')
                      ? `${b} (Weekday Batch Code)`
                      : `${b} (Weekend Batch Code)`
                  }))
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-2xs resize-none"
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
