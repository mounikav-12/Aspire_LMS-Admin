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
  ChevronUp
} from 'lucide-react';

export function CourseDetailPage() {
  const { courseId } = useParams();
  const { courses, updateCourse, milestones } = useLmsData();
  const { addToast } = useToast();

  const course = courses.find((c) => c.id === courseId);

  const [expandedTopicIds, setExpandedTopicIds] = useState(['top-p1', 'top-1']); // default first topic open
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [topicFormData, setTopicFormData] = useState({
    title: '',
    liveClasses: 2,
    practice: 3,
    assessments: 1
  });

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

      {/* Topic Modules Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-600" /> Curriculum Topic Modules ({course.topics?.length || 0})
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Each topic module breaks down live class sessions, practice assignments, and assessments.
            </p>
          </div>
          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAddModal}>
            Add Topic Module
          </Button>
        </div>

        {course.topics && course.topics.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {course.topics.map((topic, index) => {
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
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 text-xs font-black flex items-center justify-center border border-blue-100">
                          #{index + 1}
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
                        title="Edit Topic"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTopic(topic.id, topic.title);
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Delete Topic"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Stage Modules Drawer */}
                  {isExpanded && (
                    <div className="mt-5 pt-4 border-t border-slate-100 bg-slate-50/60 p-5 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-blue-600" /> Stage Subtopics & Curriculum Topics
                        </h4>
                        <span className="text-[11px] font-bold text-slate-400">
                          {matchingStage?.subtopics?.length || 0} Subtopics Configured
                        </span>
                      </div>

                      {matchingStage?.subtopics && matchingStage.subtopics.length > 0 ? (
                        <div className="space-y-4">
                          {matchingStage.subtopics.map((subtopic, sIdx) => (
                            <div key={subtopic.id || sIdx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                  <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-black flex items-center justify-center">
                                      {sIdx + 1}
                                    </span>
                                    {subtopic.title}
                                  </h5>
                                  {subtopic.duration && (
                                    <p className="text-xs text-slate-500 mt-1 font-medium pl-7 leading-relaxed">
                                      {subtopic.duration}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2">
                          <p className="text-xs font-bold text-slate-700">Topic Module Summary:</p>
                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                              <span className="block font-black text-emerald-700 text-sm">{topic.liveClasses}</span>
                              <span className="text-[10px] text-emerald-600 font-bold">Live Classes</span>
                            </div>
                            <div className="p-2.5 bg-sky-50 rounded-xl border border-sky-100">
                              <span className="block font-black text-sky-700 text-sm">{topic.practice}</span>
                              <span className="text-[10px] text-sky-600 font-bold">Practice Tasks</span>
                            </div>
                            <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-100">
                              <span className="block font-black text-purple-700 text-sm">{topic.assessments}</span>
                              <span className="text-[10px] text-purple-600 font-bold">Assessments</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No Topics Found"
            description="Add topic modules to break down live classes, practice, and tests."
            actionLabel="Add Topic"
            onAction={handleOpenAddModal}
          />
        )}
      </div>

      {/* Add / Edit Topic Modal */}
      <Modal
        isOpen={isAddTopicModalOpen || !!editingTopic}
        onClose={() => {
          setIsAddTopicModalOpen(false);
          setEditingTopic(null);
        }}
        title={editingTopic ? 'Edit Topic Module' : 'Add New Topic Module'}
        subtitle="Specify topic title and item breakdown for live classes, practice, and tests"
      >
        <form onSubmit={handleSaveTopic} className="space-y-4">
          <Input
            label="Topic Module Title"
            placeholder="e.g. Module 3: Microservices & Event-Driven Architecture"
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
              {editingTopic ? 'Save Topic' : 'Add Topic Module'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
