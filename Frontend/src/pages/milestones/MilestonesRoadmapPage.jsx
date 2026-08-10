import React, { useState } from 'react';
import {
  BookOpen,
  Trophy,
  Zap,
  Brain,
  Clock,
  ChevronRight,
  ChevronDown,
  Lock,
  Video,
  Code,
  FileCheck,
  ExternalLink,
  Sparkles,
  X
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function MilestonesRoadmapPage() {
  const { addToast } = useToast();
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [expandedModule, setExpandedModule] = useState('mod-1');

  // Stages & Topics Data
  const stages = [
    {
      id: 'stage-1',
      stageNumber: 'STAGE 01',
      phaseTag: 'Phase 1 • Core Mastery',
      title: 'Stage 1: Python & Core Fundamentals',
      status: 'IN PROGRESS',
      statusType: 'in-progress', // 'in-progress', 'available', 'locked'
      isLocked: false,
      subtopics: [
        {
          id: 'python-basics',
          title: 'Python Programming Basics',
          description: 'Click to view subtopics',
          duration: 'Master fundamental data structures, variable declarations, loops, and OOP concepts in Python 3.',
          modulesCount: 2,
          modules: [
            {
              id: 'mod-1',
              title: 'Variables & Data Types',
              items: [
                {
                  id: 'item-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  icon: Video,
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Variables Live Workshop',
                  actionText: 'JOIN',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                },
                {
                  id: 'item-2',
                  type: 'PRACTICAL LAB',
                  typeColor: 'bg-amber-100 text-amber-700 border-amber-200',
                  icon: Code,
                  iconBg: 'bg-amber-500 text-white',
                  title: 'Variables Practice Lab',
                  actionText: 'VIEW',
                  btnStyle: 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30'
                },
                {
                  id: 'item-3',
                  type: 'ASSESSMENT',
                  typeColor: 'bg-blue-100 text-blue-700 border-blue-200',
                  icon: FileCheck,
                  iconBg: 'bg-blue-600 text-white',
                  title: 'Variables Topic Quiz',
                  actionText: 'TAKE',
                  btnStyle: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30'
                }
              ]
            },
            {
              id: 'mod-2',
              title: 'Functions & OOP Concepts',
              items: [
                {
                  id: 'item-4',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  icon: Video,
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Functions & Modules Live Workshop',
                  actionText: 'JOIN',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                },
                {
                  id: 'item-5',
                  type: 'PRACTICAL LAB',
                  typeColor: 'bg-amber-100 text-amber-700 border-amber-200',
                  icon: Code,
                  iconBg: 'bg-amber-500 text-white',
                  title: 'OOP Concepts Practice Lab',
                  actionText: 'VIEW',
                  btnStyle: 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30'
                },
                {
                  id: 'item-6',
                  type: 'ASSESSMENT',
                  typeColor: 'bg-blue-100 text-blue-700 border-blue-200',
                  icon: FileCheck,
                  iconBg: 'bg-blue-600 text-white',
                  title: 'Functions & OOP Evaluation',
                  actionText: 'TAKE',
                  btnStyle: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/30'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'stage-2',
      stageNumber: 'STAGE 02',
      phaseTag: 'Phase 2 • Core Mastery',
      title: 'Stage 2: Machine Learning & AI Models',
      status: 'AVAILABLE',
      statusType: 'available',
      isLocked: false,
      subtopics: [
        {
          id: 'ml-fundamentals',
          title: 'ML Fundamentals & Scikit-Learn',
          description: 'Click to view subtopics',
          duration: 'Explore regression models, classification metrics, decision trees, and model optimization.',
          modulesCount: 2,
          modules: [
            {
              id: 'mod-ml-1',
              title: 'Supervised Learning & Regression',
              items: [
                {
                  id: 'item-ml-1',
                  type: 'LIVE CLASS',
                  typeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                  icon: Video,
                  iconBg: 'bg-purple-600 text-white',
                  title: 'Scikit-Learn Live Masterclass',
                  actionText: 'JOIN',
                  btnStyle: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/30'
                },
                {
                  id: 'item-ml-2',
                  type: 'PRACTICAL LAB',
                  typeColor: 'bg-amber-100 text-amber-700 border-amber-200',
                  icon: Code,
                  iconBg: 'bg-amber-500 text-white',
                  title: 'House Price Prediction Lab',
                  actionText: 'VIEW',
                  btnStyle: 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'stage-3',
      stageNumber: 'STAGE 03 • ADVANCED',
      phaseTag: 'Phase 3 • Advanced Mastery',
      title: 'Stage 3: Advanced AI & Cloud Deployment',
      status: 'LOCKED',
      statusType: 'locked',
      isLocked: true,
      subtopics: []
    }
  ];

  const handleActionClick = (actionName, title) => {
    addToast(`Launching ${actionName} for "${title}"...`, 'info');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Milestones Roadmap</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Track your journey and master core engineering fundamentals.
        </p>
      </div>

      {/* Top Banner Card (Vibrant Purple Gradient) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-600 p-6 sm:p-8 text-white shadow-xl shadow-purple-600/20">
        <div className="relative z-10 space-y-6">
          {/* Banner Header Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-100 border border-white/20">
              <BookOpen className="w-4 h-4" />
              <span>Milestone Curriculum Roadmap</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-xs font-semibold text-purple-100 border border-white/15">
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>4 / 12 Completed</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-xs font-semibold text-purple-100 border border-white/15">
                <Zap className="w-3.5 h-3.5 text-cyan-300" />
                <span>Level 3 Unlocked</span>
              </div>
            </div>
          </div>

          {/* Banner Main Headline */}
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white max-w-3xl leading-snug">
            Master core engineering fundamentals, advanced AI models, and real-world project deployments.
          </h2>

          {/* Banner Overall Track Completion Progress */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-purple-100">
              <span>Overall Track Completion</span>
              <span className="font-bold text-white">45%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20 backdrop-blur-sm p-0.5">
              <div
                className="h-full rounded-full bg-white transition-all duration-500 shadow-sm"
                style={{ width: '45%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stage Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-8 pt-4">
        {/* Timeline Vertical Line */}
        <div className="absolute left-3.5 sm:left-4 top-6 bottom-6 w-0.5 bg-slate-200" />

        {stages.map((stage) => {
          const isCurrentInProgress = stage.statusType === 'in-progress';
          const isAvailable = stage.statusType === 'available';
          const isLocked = stage.statusType === 'locked';

          return (
            <div key={stage.id} className="relative flex items-start gap-4 sm:gap-6 group">
              {/* Timeline Node Circle */}
              <div
                className={`relative z-10 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 transition-all ${
                  isCurrentInProgress
                    ? 'border-purple-600 bg-white text-purple-600 ring-4 ring-purple-100'
                    : isAvailable
                    ? 'border-purple-400 bg-white text-purple-500'
                    : 'border-slate-300 bg-slate-100 text-slate-400'
                }`}
              >
                {isLocked ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : (
                  <div className="flex items-center justify-center rounded-full bg-purple-600 text-white p-1">
                    <Brain className="w-3 h-3" />
                  </div>
                )}
              </div>

              {/* Stage Card */}
              <div
                className={`flex-1 rounded-3xl border p-5 sm:p-6 transition-all duration-200 shadow-xs ${
                  isCurrentInProgress
                    ? 'bg-white border-slate-200'
                    : isAvailable
                    ? 'bg-white border-slate-200'
                    : 'bg-slate-50/70 border-slate-200/80 opacity-75'
                }`}
              >
                {/* Stage Header Info */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                        isLocked ? 'bg-slate-200 text-slate-500' : 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                      }`}
                    >
                      {isLocked ? <Lock className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                          {stage.stageNumber}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">{stage.phaseTag}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                        {stage.title}
                      </h3>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isCurrentInProgress && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                        <span className="h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
                        IN PROGRESS
                      </span>
                    )}
                    {isAvailable && (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        AVAILABLE
                      </span>
                    )}
                    {isLocked && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-200/80 px-3 py-1 text-xs font-bold text-slate-500">
                        <Lock className="w-3 h-3" />
                        LOCKED
                      </span>
                    )}
                  </div>
                </div>

                {/* Subtopic Action Buttons */}
                {!isLocked && stage.subtopics.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {stage.subtopics.map((subtopic) => (
                      <div key={subtopic.id}>
                        {subtopic.id === 'python-basics' ? (
                          /* Highlighted Subtopic Button (Matching Picture 1) */
                          <button
                            onClick={() => setSelectedSubtopic(subtopic)}
                            className="w-full text-left rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 p-4 text-white shadow-md shadow-purple-600/25 hover:shadow-lg hover:shadow-purple-600/35 hover:scale-[1.005] transition-all flex items-center justify-between group cursor-pointer"
                          >
                            <div className="flex items-center gap-3.5">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white">
                                <Clock className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-bold text-white text-sm sm:text-base leading-tight">
                                  {subtopic.title}
                                </p>
                                <p className="text-xs text-purple-100/90 font-medium mt-0.5">
                                  {subtopic.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 group-hover:bg-white group-hover:text-purple-700 transition-all text-white">
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </button>
                        ) : (
                          /* Standard Subtopic Capsule Button */
                          <button
                            onClick={() => setSelectedSubtopic(subtopic)}
                            className="w-full text-left rounded-2xl bg-slate-100/80 hover:bg-purple-50 hover:border-purple-200 border border-slate-200/80 px-4 py-3 text-slate-800 transition-all flex items-center justify-between group cursor-pointer"
                          >
                            <span className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-purple-700">
                              {subtopic.title}
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-Over Right Drawer (Picture 2 Content) */}
      {selectedSubtopic && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay with Blur */}
          <div
            onClick={() => setSelectedSubtopic(null)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer Side Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300 border-l border-slate-200">
              
              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                      {selectedSubtopic.title}
                    </h2>
                    <div className="mt-2">
                      <span className="inline-block bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-purple-200">
                        TOPIC CATALOG
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-3 leading-relaxed">
                      {selectedSubtopic.duration}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedSubtopic(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Section Header: LEARNING PATH */}
                <div className="flex items-center justify-between text-xs font-bold tracking-wider text-slate-400 uppercase">
                  <span>LEARNING PATH</span>
                  <span>{selectedSubtopic.modulesCount} modules</span>
                </div>

                {/* Modules Accordion List */}
                <div className="space-y-4">
                  {selectedSubtopic.modules.map((module) => {
                    const isExpanded = expandedModule === module.id;

                    return (
                      <div
                        key={module.id}
                        className="rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs"
                      >
                        {/* Module Header Bar */}
                        <button
                          onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                          className={`w-full p-4 flex items-center justify-between text-left font-bold text-sm transition-all cursor-pointer ${
                            isExpanded
                              ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-black ${
                                isExpanded ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {module.title.startsWith('Variables') ? 'V' : 'F'}
                            </span>
                            <span>{module.title}</span>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-white" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                        </button>

                        {/* Module Expanded Item Cards */}
                        {isExpanded && (
                          <div className="p-4 space-y-3 bg-white">
                            {module.items.map((item) => (
                              <div
                                key={item.id}
                                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-xl ${item.iconBg}`}>
                                    <item.icon className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded border inline-block mb-0.5 ${item.typeColor}`}>
                                      {item.type}
                                    </span>
                                    <h4 className="text-xs font-bold text-slate-800 leading-tight">
                                      {item.title}
                                    </h4>
                                  </div>
                                </div>

                                {/* Action Button */}
                                <button
                                  onClick={() => handleActionClick(item.actionText, item.title)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${item.btnStyle}`}
                                >
                                  <span>{item.actionText}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Bottom Action Bar: Ask AI Tutor PRO */}
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <button
                  onClick={() => addToast('AI Tutor PRO assistant connected!', 'success')}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Ask AI Tutor</span>
                  <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                    PRO
                  </span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
