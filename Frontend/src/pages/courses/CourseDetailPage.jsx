import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import { supabase } from '../../lib/supabaseClient';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { EmptyState } from '../../components/common/EmptyState';
import {
  ArrowLeft,
  Plus,
  Video,
  FileCheck2,
  Code2,
  Trash2,
  Edit2,
  Users,
  Star,
  Layers,
  ChevronDown,
  ChevronUp,
  Calendar,
  CheckSquare,
  Square,
  BookOpen
} from 'lucide-react';
export function CourseDetailPage() {
  const { courseId } = useParams();
  const { courses, updateCourse, milestones, availableBatches, courseLessons, addCourseLesson, updateCourseLesson, deleteCourseLesson, getLessonsForModule, updateStageSubtopics } = useLmsData();
  const { addToast } = useToast();

  const course = courses.find((c) => c.id === courseId);

  const milestoneStages = milestones?.stages || [];

  const defaultTopicsFromStages = milestoneStages.map((stg, i) => ({
    id: `top-stg-${i + 1}`,
    title: stg.title || `Stage ${i + 1}: ${stg.phaseTag || 'Curriculum Module'}`,
    liveClasses: stg.subtopics?.reduce((acc, sub) => acc + (sub.modulesCount || 2), 0) || (i === 0 ? 31 : 20),
    practice: stg.subtopics?.reduce((acc, sub) => acc + (sub.modulesCount || 2) * 2, 0) || (i === 0 ? 45 : 30),
    assessments: (stg.subtopics?.length || 4) * 2
  }));

  const isPythonFullStackCourse = (course?.title || '').toLowerCase().includes('python full') || (course?.id || '').includes('1786624019154');

  const topicsToRender = (course?.topics && course.topics.length > 0)
    ? course.topics
    : (initialMatchingCourse?.topics && initialMatchingCourse.topics.length > 0)
    ? initialMatchingCourse.topics
    : isPythonFullStackCourse
    ? defaultTopicsFromStages
    : [];

  // Active Tab State ('Weekdays' | 'Weekends')
  const [activeTab, setActiveTab] = useState('Weekdays');

  // Independent Selection States for Weekdays and Weekends
  const [selectedWeekdayBatches, setSelectedWeekdayBatches] = useState(() => {
    try {
      const saved = localStorage.getItem(`aspire_lms_selected_wd_${courseId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return ['A26W1']; // Default initial Weekdays selection
  });

  const [selectedWeekendBatches, setSelectedWeekendBatches] = useState(() => {
    try {
      const saved = localStorage.getItem(`aspire_lms_selected_we_${courseId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return ['A26S1']; // Default initial Weekends selection
  });

  // Dynamic Batch Category Lists
  const allBatches = availableBatches && availableBatches.length > 0
    ? availableBatches
    : ['A26W1', 'A26W2', 'A26W3', 'A26S1', 'A26S2', 'A26S3'];

  const weekdayBatches = allBatches.filter((b) => b.startsWith('A26W') && !b.startsWith('A26S'));
  const weekendBatches = allBatches.filter((b) => b.startsWith('A26S'));

  // Toggle Handlers (Completely Independent)
  const toggleWeekdayBatch = (bCode) => {
    setSelectedWeekdayBatches((prev) => {
      const next = prev.includes(bCode) ? prev.filter((b) => b !== bCode) : [...prev, bCode];
      try {
        localStorage.setItem(`aspire_lms_selected_wd_${courseId}`, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const toggleWeekendBatch = (bCode) => {
    setSelectedWeekendBatches((prev) => {
      const next = prev.includes(bCode) ? prev.filter((b) => b !== bCode) : [...prev, bCode];
      try {
        localStorage.setItem(`aspire_lms_selected_we_${courseId}`, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const [expandedTopicIds, setExpandedTopicIds] = useState(['top-p1', 'top-1']); // default first topic open
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [topicFormData, setTopicFormData] = useState({
    title: '',
    liveClasses: 2,
    practice: 3,
    assessments: 1
  });

  // --- SUBTOPICS / MODULES STATE & HANDLERS ---


  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
  const [activeStageTopicId, setActiveStageTopicId] = useState(null);
  const [editingModuleIndex, setEditingModuleIndex] = useState(null);
  const [moduleFormData, setModuleFormData] = useState({ title: '', duration: '' });

  // --- LESSONS (Sub-modules inside Modules) STATE ---
  const [expandedModuleIds, setExpandedModuleIds] = useState([]);
  const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);
  const [activeLessonContext, setActiveLessonContext] = useState({ stageId: null, moduleId: null });
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonFormData, setLessonFormData] = useState({ title: '', description: '' });

  // Seed mock stages to database if course has no stages in Supabase yet
  React.useEffect(() => {
    if (course && (!course.topics || course.topics.length === 0)) {
      const isPythonFullStackCourse = (course.title || '').toLowerCase().includes('python full') || (course.id || '').includes('1786624019154');
      
      const defaultTopicsFromStages = milestoneStages.map((stg, i) => ({
        id: `top-stg-${i + 1}`,
        title: stg.title || `Stage ${i + 1}: ${stg.phaseTag || 'Curriculum Module'}`,
        liveClasses: stg.subtopics?.reduce((acc, sub) => acc + (sub.modulesCount || 2), 0) || (i === 0 ? 31 : 20),
        practice: stg.subtopics?.reduce((acc, sub) => acc + (sub.modulesCount || 2) * 2, 0) || (i === 0 ? 45 : 30),
        assessments: (stg.subtopics?.length || 4) * 2
      }));

      const fallbackTopics = (initialMatchingCourse?.topics && initialMatchingCourse.topics.length > 0)
        ? initialMatchingCourse.topics
        : isPythonFullStackCourse
        ? defaultTopicsFromStages
        : [];
      
      if (fallbackTopics && fallbackTopics.length > 0) {
        updateCourse(course.id, { topics: fallbackTopics });
      }
    }
  }, [course, courseId]);

  const handleOpenAddModuleModal = (topicId) => {
    setActiveStageTopicId(topicId);
    setEditingModuleIndex(null);
    setModuleFormData({ title: '', duration: '' });
    setIsAddModuleModalOpen(true);
  };

  const handleOpenEditModuleModal = (topicId, idx, moduleItem) => {
    setActiveStageTopicId(topicId);
    setEditingModuleIndex(idx);
    setModuleFormData({
      title: moduleItem.title || '',
      duration: moduleItem.duration || ''
    });
    setIsAddModuleModalOpen(true);
  };

  const handleSaveModule = async (e) => {
    e.preventDefault();
    if (!moduleFormData.title.trim()) {
      addToast('Please enter module title', 'error');
      return;
    }

    const stageKey = activeStageTopicId;
    const matchingStage = topicsToRender.find((t) => t.id === stageKey);
    const currentList = matchingStage?.subtopics || [];

    let updatedList;
    if (editingModuleIndex !== null) {
      updatedList = currentList.map((m, idx) =>
        idx === editingModuleIndex ? { ...m, ...moduleFormData } : m
      );
      addToast(`Updated module "${moduleFormData.title}"`, 'success');
    } else {
      const newMod = {
        id: `subtop-${Date.now()}`,
        title: moduleFormData.title,
        duration: moduleFormData.duration || 'Web Architecture, Hands-on Coding & Projects'
      };
      updatedList = [...currentList, newMod];
      addToast(`Added module "${moduleFormData.title}" to Stage`, 'success');
    }

    await updateStageSubtopics(courseId, stageKey, updatedList);

    setIsAddModuleModalOpen(false);
    setEditingModuleIndex(null);
  };

  const handleDeleteModule = async (topicId, idx, moduleTitle) => {
    const matchingStage = topicsToRender.find((t) => t.id === topicId);
    const currentList = matchingStage?.subtopics || [];
    const updatedList = currentList.filter((_, i) => i !== idx);

    await updateStageSubtopics(courseId, topicId, updatedList);
    addToast(`Removed module "${moduleTitle}"`, 'info');
  };

  const toggleExpandModule = (moduleId) => {
    setExpandedModuleIds((prev) =>
      prev.includes(moduleId) ? [] : [moduleId]
    );
  };

  const handleOpenAddLessonModal = (stageId, moduleId) => {
    setActiveLessonContext({ stageId, moduleId });
    setEditingLesson(null);
    setLessonFormData({ title: '', description: '' });
    setIsAddLessonModalOpen(true);
  };

  const handleOpenEditLessonModal = (lesson) => {
    setActiveLessonContext({ stageId: lesson.stage_id, moduleId: lesson.module_id });
    setEditingLesson(lesson);
    setLessonFormData({ title: lesson.title || '', description: lesson.description || '' });
    setIsAddLessonModalOpen(true);
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    if (!lessonFormData.title.trim()) {
      addToast('Please enter lesson title', 'error');
      return;
    }

    if (editingLesson) {
      await updateCourseLesson(editingLesson.id, {
        title: lessonFormData.title.trim(),
        description: lessonFormData.description.trim()
      });
      addToast(`Updated lesson "${lessonFormData.title}"`, 'success');
    } else {
      await addCourseLesson({
        course_id: courseId,
        stage_id: activeLessonContext.stageId,
        module_id: activeLessonContext.moduleId,
        title: lessonFormData.title.trim(),
        description: lessonFormData.description.trim()
      });
      addToast(`Added lesson "${lessonFormData.title}"`, 'success');
    }

    setIsAddLessonModalOpen(false);
    setEditingLesson(null);
  };

  const handleDeleteLesson = async (lessonId, lessonTitle) => {
    await deleteCourseLesson(lessonId);
    addToast(`Removed lesson "${lessonTitle}"`, 'info');
  };

  const toggleExpandTopic = (topicId) => {
    setExpandedTopicIds((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  if (!course) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Course Not Found</h2>
        <Link to="/courses">
          <Button variant="primary" icon={ArrowLeft}>
            Back to Course Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const handleOpenAddModal = () => {
    setTopicFormData({ title: '', liveClasses: 2, practice: 3, assessments: 1 });
    setIsAddTopicModalOpen(true);
  };

  const handleOpenEditModal = (topic) => {
    setEditingTopic(topic);
    setTopicFormData({
      title: topic.title,
      liveClasses: topic.liveClasses,
      practice: topic.practice,
      assessments: topic.assessments
    });
  };

  const handleSaveTopic = (e) => {
    e.preventDefault();
    if (!topicFormData.title) {
      addToast('Please enter topic title', 'error');
      return;
    }

    let updatedTopics;
    if (editingTopic) {
      updatedTopics = (course.topics || []).map((t) =>
        t.id === editingTopic.id ? { ...t, ...topicFormData } : t
      );
      addToast(`Updated topic: "${topicFormData.title}"`, 'success');
      setEditingTopic(null);
    } else {
      const newTopic = {
        id: `top-${Date.now()}`,
        ...topicFormData
      };
      updatedTopics = [...(course.topics || []), newTopic];
      addToast(`Added topic: "${topicFormData.title}"`, 'success');
      setIsAddTopicModalOpen(false);
    }

    updateCourse(course.id, { topics: updatedTopics });
  };

  const handleDeleteTopic = async (topicId, topicTitle) => {
    const updatedTopics = (course.topics || []).filter((t) => t.id !== topicId);
    updateCourse(course.id, { topics: updatedTopics });

    try {
      await supabase.from('course_topics').delete().eq('id', topicId);
    } catch (e) {}

    addToast(`Removed topic "${topicTitle}"`, 'info');
  };

  const activeSelectedBatches = activeTab === 'Weekdays' ? selectedWeekdayBatches : selectedWeekendBatches;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <Breadcrumbs
        items={[
          { label: 'Courses', path: '/courses' },
          { label: course.title, path: `/courses/${course.id}` }
        ]}
      />

      {/* Course Hero Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-2xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="blue">{course.category}</Badge>
              <Badge variant="purple">{course.level}</Badge>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${
                course.targetBatch === 'Weekday Batch'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : course.targetBatch === 'Weekend Batch'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {course.targetBatch || 'All Batches'}
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {course.title}
            </h1>

            <p className="text-xs lg:text-sm text-slate-500 max-w-2xl leading-relaxed font-medium">
              {course.description}
            </p>

            <div className="flex items-center gap-6 pt-2 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" /> {course.enrolledCount} Enrolled
              </span>
              <span className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {course.rating} Rating
              </span>
              <span className="text-slate-400">Instructor: <strong className="text-slate-800 font-bold">{course.instructor}</strong></span>
            </div>
          </div>

          <div className="w-full lg:w-72 h-44 rounded-2xl overflow-hidden shadow-lg border border-slate-200 flex-shrink-0">
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* --- IN-PAGE BATCH NAVIGATION TABS & MULTI-SELECT PANEL --- */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" /> Student Batch & Schedule Selection
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Select active batches for Weekdays or Weekends to view student-specific curriculum modules and schedule timings.
            </p>
          </div>

          {/* In-Page Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('Weekdays')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'Weekdays'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Weekdays</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                activeTab === 'Weekdays' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {selectedWeekdayBatches.length} Selected
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('Weekends')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'Weekends'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Weekends</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                activeTab === 'Weekends' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {selectedWeekendBatches.length} Selected
              </span>
            </button>
          </div>
        </div>

        {/* Tab Panel Content: Weekdays */}
        {activeTab === 'Weekdays' ? (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" /> Weekday Batches (A26W Series)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {weekdayBatches.map((bCode) => {
                const isSelected = selectedWeekdayBatches.includes(bCode);
                const num = bCode.replace(/[^0-9]/g, '');

                return (
                  <div
                    key={bCode}
                    onClick={() => toggleWeekdayBatch(bCode)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20 text-blue-900 shadow-xs'
                        : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700'
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                    <span className="text-xs font-black">{bCode}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Tab Panel Content: Weekends */
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" /> Weekend Batches (A26S Series)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {weekendBatches.map((bCode) => {
                const isSelected = selectedWeekendBatches.includes(bCode);

                return (
                  <div
                    key={bCode}
                    onClick={() => toggleWeekendBatch(bCode)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 text-indigo-900 shadow-xs'
                        : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700'
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                    <span className="text-xs font-black">{bCode}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Topic Stages & Modules Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-600" /> Curriculum Stages ({topicsToRender?.length || 0})
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Explore stage roadmap, live classes, practice tasks, and curriculum modules for this course.
            </p>
          </div>
          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAddModal}>
            Add Stage
          </Button>
        </div>

        {topicsToRender && topicsToRender.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {topicsToRender.map((topic, index) => {
              const isExpanded = expandedTopicIds.includes(topic.id);
              const matchingStage = milestones?.stages?.[index];

              return (
                <div
                  key={topic.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div
                      onClick={() => toggleExpandTopic(topic.id)}
                      className="space-y-2 flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-black border border-blue-100/80">
                          Stage {index + 1}
                        </span>
                        <h3 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                          {topic.title}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Badge variant="emerald">
                          <Video className="w-3 h-3 mr-1" /> {topic.liveClasses} Live Classes
                        </Badge>
                        <Badge variant="sky">
                          <Code2 className="w-3 h-3 mr-1" /> {topic.practice} Practice Tasks
                        </Badge>
                        <Badge variant="purple">
                          <FileCheck2 className="w-3 h-3 mr-1" /> {topic.assessments} Assessments
                        </Badge>
                        <span className="text-[11px] font-bold text-blue-600 underline decoration-blue-300 underline-offset-4 ml-1">
                          {isExpanded ? 'Hide Modules' : 'Click to view modules'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => toggleExpandTopic(topic.id)}
                        className="p-2 text-slate-500 hover:text-blue-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                        title={isExpanded ? "Collapse Modules" : "Expand Modules"}
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(topic);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit Stage Module"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTopic(topic.id, topic.title);
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Delete Stage Module"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Stage Modules Drawer */}
                  {isExpanded && (() => {
                    const subtopicsList = topic.subtopics || [];

                    return (
                      <div className="mt-5 pt-4 border-t border-slate-100 bg-slate-50/60 p-5 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-blue-600" /> {matchingStage?.title || `Stage ${index + 1}`} Modules & Subtopics
                          </h4>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-bold text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded-lg">
                              {subtopicsList.length} Subtopics Configured
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              icon={Plus}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenAddModuleModal(topic.id);
                              }}
                              className="text-xs font-bold border-blue-200 text-blue-700 bg-white hover:bg-blue-50 cursor-pointer shadow-xs"
                            >
                              Add Module
                            </Button>
                          </div>
                        </div>

                        {subtopicsList.length > 0 ? (
                          <div className="space-y-3">
                            {subtopicsList.map((subtopic, sIdx) => (
                              <div
                                key={subtopic.id || sIdx}
                                className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-blue-300 transition-all group/mod overflow-hidden"
                              >
                                {/* Module Header (clickable to expand) */}
                                <div
                                  className="flex items-start justify-between gap-3 p-4.5 cursor-pointer"
                                  onClick={() => toggleExpandModule(subtopic.id || `mod-${topic.id}-${sIdx}`)}
                                >
                                  <div className="flex-1">
                                    <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                      <span className="w-5.5 h-5.5 rounded-lg bg-blue-100 text-blue-700 text-[11px] font-black flex items-center justify-center flex-shrink-0">
                                        {sIdx + 1}
                                      </span>
                                      <span>{subtopic.title}</span>
                                    </h5>
                                    {subtopic.duration && (
                                      <p className="text-xs text-slate-500 mt-1 font-medium pl-7 leading-relaxed">
                                        {subtopic.duration}
                                      </p>
                                    )}
                                    {(() => {
                                      const moduleId = subtopic.id || `mod-${topic.id}-${sIdx}`;
                                      const lessonsList = getLessonsForModule(courseId, topic.id, moduleId);
                                      return (
                                        <span className="text-[11px] font-bold text-blue-600 pl-7 mt-1 inline-block">
                                          {lessonsList.length} Lesson{lessonsList.length !== 1 ? 's' : ''} • {expandedModuleIds.includes(moduleId) ? 'Click to collapse' : 'Click to expand'}
                                        </span>
                                      );
                                    })()}
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleExpandModule(subtopic.id || `mod-${topic.id}-${sIdx}`);
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                      title={expandedModuleIds.includes(subtopic.id || `mod-${topic.id}-${sIdx}`) ? 'Collapse Lessons' : 'Expand Lessons'}
                                    >
                                      {expandedModuleIds.includes(subtopic.id || `mod-${topic.id}-${sIdx}`) ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenEditModuleModal(topic.id, sIdx, subtopic);
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                      title="Edit Module"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteModule(topic.id, sIdx, subtopic.title);
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                      title="Delete Module"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Expanded Lessons Drawer */}
                                {expandedModuleIds.includes(subtopic.id || `mod-${topic.id}-${sIdx}`) && (() => {
                                  const moduleId = subtopic.id || `mod-${topic.id}-${sIdx}`;
                                  const lessonsList = getLessonsForModule(courseId, topic.id, moduleId);

                                  return (
                                    <div className="border-t border-slate-100 bg-slate-50/40 p-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                          <BookOpen className="w-3.5 h-3.5 text-purple-600" /> Lessons / Sub-modules
                                        </span>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenAddLessonModal(topic.id, moduleId);
                                          }}
                                          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer"
                                        >
                                          <Plus className="w-3 h-3" /> Add Lesson
                                        </button>
                                      </div>

                                      {lessonsList.length > 0 ? (
                                        <div className="space-y-2">
                                          {lessonsList.map((lesson, lIdx) => (
                                            <div
                                              key={lesson.id}
                                              className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-purple-300 transition-all group/lesson"
                                            >
                                              <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                  <h6 className="font-semibold text-slate-800 text-[13px] flex items-center gap-2">
                                                    <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                                                      {lIdx + 1}
                                                    </span>
                                                    {lesson.title}
                                                  </h6>
                                                  {lesson.description && (
                                                    <p className="text-[11px] text-slate-500 mt-1 font-medium pl-7 leading-relaxed">
                                                      {lesson.description}
                                                    </p>
                                                  )}
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                                                  <button
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleOpenEditLessonModal(lesson);
                                                    }}
                                                    className="p-1 text-slate-400 hover:text-purple-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                                                    title="Edit Lesson"
                                                  >
                                                    <Edit2 className="w-3 h-3" />
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleDeleteLesson(lesson.id, lesson.title);
                                                    }}
                                                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                                                    title="Delete Lesson"
                                                  >
                                                    <Trash2 className="w-3 h-3" />
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="bg-white p-4 rounded-xl border border-dashed border-slate-300 text-center">
                                          <p className="text-[11px] font-semibold text-slate-400">No lessons added yet. Click "Add Lesson" to create sub-modules.</p>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 text-center space-y-3">
                            <p className="text-xs font-semibold text-slate-500">No curriculum modules created inside this stage yet.</p>
                            <Button
                              variant="primary"
                              size="sm"
                              icon={Plus}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenAddModuleModal(topic.id);
                              }}
                            >
                              Add First Module
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Layers}
            title="No Curriculum Stages Yet"
            description="This course does not have any curriculum stages or modules assigned yet. Click '+ Add Stage' to create stages and modules manually."
            actionLabel="Add First Stage"
            onAction={handleOpenAddModal}
          />
        )}
      </div>

      {/* Add / Edit Stage Modal */}
      <Modal
        isOpen={isAddTopicModalOpen || !!editingTopic}
        onClose={() => {
          setIsAddTopicModalOpen(false);
          setEditingTopic(null);
        }}
        title={editingTopic ? 'Edit Stage Module' : 'Add New Stage Module'}
        subtitle="Specify stage module title and item breakdown for live classes, practice, and tests"
      >
        <form onSubmit={handleSaveTopic} className="space-y-4">
          <Input
            label="Stage Module Title"
            placeholder="e.g. Stage 3: Microservices & Event-Driven Architecture"
            value={topicFormData.title}
            onChange={(e) => setTopicFormData({ ...topicFormData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Live Classes"
              type="number"
              min="0"
              value={topicFormData.liveClasses}
              onChange={(e) => setTopicFormData({ ...topicFormData, liveClasses: parseInt(e.target.value) || 0 })}
            />

            <Input
              label="Practice Tasks"
              type="number"
              min="0"
              value={topicFormData.practice}
              onChange={(e) => setTopicFormData({ ...topicFormData, practice: parseInt(e.target.value) || 0 })}
            />

            <Input
              label="Assessments"
              type="number"
              min="0"
              value={topicFormData.assessments}
              onChange={(e) => setTopicFormData({ ...topicFormData, assessments: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddTopicModalOpen(false);
                setEditingTopic(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingTopic ? 'Save Stage' : 'Add Stage Module'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add / Edit Module Inside Stage Modal */}
      <Modal
        isOpen={isAddModuleModalOpen}
        onClose={() => {
          setIsAddModuleModalOpen(false);
          setEditingModuleIndex(null);
        }}
        title={editingModuleIndex !== null ? 'Edit Stage Curriculum Module' : 'Add New Curriculum Module to Stage'}
        subtitle="Define module title and curriculum topics / description for students"
      >
        <form onSubmit={handleSaveModule} className="space-y-4">
          <Input
            label="Module Title"
            placeholder="e.g. Django ORM & Database Migration Architecture"
            value={moduleFormData.title}
            onChange={(e) => setModuleFormData({ ...moduleFormData, title: e.target.value })}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 tracking-wider uppercase">
              Curriculum Topics / Description
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Models, Fields, Migrations, QuerySet API, One-to-Many Relationships, Transactions"
              value={moduleFormData.duration}
              onChange={(e) => setModuleFormData({ ...moduleFormData, duration: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-2xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setIsAddModuleModalOpen(false);
                setEditingModuleIndex(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingModuleIndex !== null ? 'Save Module' : 'Add Module'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add / Edit Lesson Inside Module Modal */}
      <Modal
        isOpen={isAddLessonModalOpen}
        onClose={() => {
          setIsAddLessonModalOpen(false);
          setEditingLesson(null);
        }}
        title={editingLesson ? 'Edit Lesson / Sub-module' : 'Add New Lesson to Module'}
        subtitle="Define the lesson title and description for this sub-module"
      >
        <form onSubmit={handleSaveLesson} className="space-y-4">
          <Input
            label="Lesson Title"
            placeholder="e.g. Git Architecture & Version Control Concepts"
            value={lessonFormData.title}
            onChange={(e) => setLessonFormData({ ...lessonFormData, title: e.target.value })}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 tracking-wider uppercase">
              Description / Topics Covered
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Understanding distributed version control, repository structure, .git internals, HEAD pointers"
              value={lessonFormData.description}
              onChange={(e) => setLessonFormData({ ...lessonFormData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all shadow-2xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setIsAddLessonModalOpen(false);
                setEditingLesson(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingLesson ? 'Save Lesson' : 'Add Lesson'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
