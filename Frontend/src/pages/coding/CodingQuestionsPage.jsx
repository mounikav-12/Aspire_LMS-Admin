import React, { useState } from 'react';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { DEFAULT_STAGES, getSubtopicsForStage, getInnerModulesForSubtopic } from '../sessions/LiveSessionListPage';
import { isMatchingStage, getStageNumber, SUBTOPIC_MODULE_MAP } from '../milestones/MilestonesRoadmapPage';
import {
  Code2,
  Plus,
  Search,
  Clock,
  Award,
  Sparkles,
  Edit2,
  Trash2,
  Eye,
  FileCode2,
  Tag,
  CheckCircle2,
  BookOpen,
  Terminal,
  HelpCircle,
  Copy,
  Check,
  Layers,
  Bookmark,
  ChevronDown,
  FileJson,
  ClipboardPaste,
  Upload,
  XCircle,
  AlertCircle
} from 'lucide-react';

export function CodingQuestionsPage() {
  const { codingQuestions = [], courses = [], courseLessons = [], milestones, milestonesByBatch, addCodingQuestion, updateCodingQuestion, deleteCodingQuestion, activeBatchFilter, setActiveBatchFilter } = useLmsData();
  const { addToast } = useToast();

  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [selectedStageId, setSelectedStageId] = useState('ALL');
  const [selectedSubtopicId, setSelectedSubtopicId] = useState('ALL');
  const [selectedModuleId, setSelectedModuleId] = useState('ALL');

  React.useEffect(() => {
    if (!selectedCourseId && courses && courses.length > 0) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  const activeCourseId = selectedCourseId || courses[0]?.id || '';
  const activeCourseObj = courses.find((c) => c.id === activeCourseId) || courses[0];

  // Helper string cleaners
  const cleanId = (id) => String(id || '').replace(/-(w|s)$/i, '').trim().toLowerCase();
  const cleanStr = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();

  // Resolve stages with subtopics properly
  const activeStagesList = React.useMemo(() => {
    const courseMilestones = activeCourseId && activeCourseId !== 'ALL' ? milestonesByBatch?.[activeCourseId]?.stages : null;
    if (Array.isArray(courseMilestones) && courseMilestones.length > 0 && courseMilestones.some(s => (s.subtopics && s.subtopics.length > 0) || (s.modules && s.modules.length > 0))) {
      return courseMilestones;
    }
    const batchMilestones = milestonesByBatch?.[activeBatchFilter]?.stages;
    if (Array.isArray(batchMilestones) && batchMilestones.length > 0) {
      return batchMilestones;
    }
    if (Array.isArray(milestones?.stages) && milestones.stages.length > 0) {
      return milestones.stages;
    }
    if (activeCourseObj?.topics && activeCourseObj.topics.length > 0) {
      return activeCourseObj.topics.map((top, idx) => {
        const matchingMilestoneStage = (milestones?.stages || []).find(ms => isMatchingStage(ms.id, top.id) || idx === (ms.stageIndex || idx));
        return {
          ...top,
          subtopics: (top.subtopics && top.subtopics.length > 0) ? top.subtopics : (matchingMilestoneStage?.subtopics || [])
        };
      });
    }
    return DEFAULT_STAGES;
  }, [activeCourseId, activeCourseObj, milestonesByBatch, activeBatchFilter, milestones]);

  const selectedStageObj = selectedStageId !== 'ALL'
    ? (activeStagesList.find((s) => s.id === selectedStageId || isMatchingStage(s.id, selectedStageId)) || null)
    : null;
  const subtopicsForStage = selectedStageObj ? getSubtopicsForStage(selectedStageObj) : [];

  const selectedSubtopicObj = selectedSubtopicId !== 'ALL'
    ? (subtopicsForStage.find((sub) =>
        sub.id === selectedSubtopicId ||
        cleanId(sub.id) === cleanId(selectedSubtopicId) ||
        SUBTOPIC_MODULE_MAP[cleanId(sub.id)] === cleanId(selectedSubtopicId) ||
        cleanStr(sub.title) === cleanStr(selectedSubtopicId)
      ) || null)
    : null;

  const modulesForSubtopic = selectedSubtopicObj ? getInnerModulesForSubtopic(selectedSubtopicObj, courseLessons, selectedStageId) : [];

  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [languageFilter, setLanguageFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deletingQuestion, setDeletingQuestion] = useState(null);
  const [viewingSolution, setViewingSolution] = useState(null); // { question, tab: 'starter' | 'solution' }

  // JSON Auto-Import State
  const [importMode, setImportMode] = useState('paste'); // 'paste' | 'file'
  const [pastedJson, setPastedJson] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [jsonExtractedCount, setJsonExtractedCount] = useState(0);
  const [jsonTestCasesCount, setJsonTestCasesCount] = useState(0);
  const [jsonParsing, setJsonParsing] = useState(false);
  const [jsonDragOver, setJsonDragOver] = useState(false);

  // Form State for Posting / Editing Coding Question
  const [formData, setFormData] = useState({
    title: '',
    category: 'Algorithms & Data Structures',
    difficulty: 'Easy',
    marks: 20,
    timeLimitMinutes: 15,
    language: 'JavaScript',
    courseId: courses[0]?.id || '',
    courseName: courses[0]?.title || '',
    stageId: '',
    stageName: '',
    subtopicId: '',
    subtopicName: '',
    innerTopicId: '',
    topicName: '',
    tags: '',
    problemStatement: '',
    inputFormat: '',
    outputFormat: '',
    starterCode: '',
    solutionCode: '',
    sampleTestCases: [
      {
        input: '',
        output: '',
        explanation: ''
      }
    ]
  });

  const modalSelectedCourse = courses.find((c) => c.id === formData.courseId) || courses[0];
  const modalStagesList = React.useMemo(() => {
    const courseMilestones = formData.courseId && formData.courseId !== 'ALL' ? milestonesByBatch?.[formData.courseId]?.stages : null;
    if (Array.isArray(courseMilestones) && courseMilestones.length > 0 && courseMilestones.some(s => (s.subtopics && s.subtopics.length > 0) || (s.modules && s.modules.length > 0))) {
      return courseMilestones;
    }
    const batchMilestones = milestonesByBatch?.[activeBatchFilter]?.stages;
    if (Array.isArray(batchMilestones) && batchMilestones.length > 0) {
      return batchMilestones;
    }
    if (Array.isArray(milestones?.stages) && milestones.stages.length > 0) {
      return milestones.stages;
    }
    if (modalSelectedCourse?.topics && modalSelectedCourse.topics.length > 0) {
      return modalSelectedCourse.topics.map((top, idx) => {
        const matchingMilestoneStage = (milestones?.stages || []).find(ms => isMatchingStage(ms.id, top.id) || idx === (ms.stageIndex || idx));
        return {
          ...top,
          subtopics: (top.subtopics && top.subtopics.length > 0) ? top.subtopics : (matchingMilestoneStage?.subtopics || [])
        };
      });
    }
    return DEFAULT_STAGES;
  }, [formData.courseId, modalSelectedCourse, milestonesByBatch, activeBatchFilter, milestones]);

  const currentStageObj = modalStagesList.find((s) => s.id === formData.stageId || isMatchingStage(s.id, formData.stageId)) || modalStagesList[0];
  const currentSubtopicsArr = getSubtopicsForStage(currentStageObj);
  const currentSubtopicObj = currentSubtopicsArr.find((st) => st.id === formData.subtopicId || cleanId(st.id) === cleanId(formData.subtopicId) || cleanStr(st.title) === cleanStr(formData.subtopicId)) || currentSubtopicsArr[0];
  const currentInnerTopicsArr = getInnerModulesForSubtopic(currentSubtopicObj, courseLessons, currentStageObj?.id);

  React.useEffect(() => {
    if (courses && courses.length > 0 && !formData.stageId) {
      const activeCourse = courses.find((c) => c.id === formData.courseId) || courses[0];
      const activeStage = modalStagesList[0];
      const activeSubs = getSubtopicsForStage(activeStage);
      const activeSub = activeSubs[0];
      const activeInners = getInnerModulesForSubtopic(activeSub, courseLessons, activeStage?.id);
      const activeInner = activeInners[0];
      setFormData((prev) => ({
        ...prev,
        courseId: prev.courseId || activeCourse?.id || '',
        courseName: prev.courseName || activeCourse?.title || '',
        stageId: prev.stageId || activeStage?.id || '',
        stageName: prev.stageName || activeStage?.title || '',
        subtopicId: prev.subtopicId || activeSub?.id || '',
        subtopicName: prev.subtopicName || activeSub?.title || '',
        innerTopicId: prev.innerTopicId || activeInner?.id || '',
        topicName: prev.topicName || activeInner?.title || ''
      }));
    }
  }, [courses, formData.courseId, modalStagesList, courseLessons]);

  // Calculate stats
  const totalQuestionsCount = codingQuestions.length;
  const easyCount = codingQuestions.filter((q) => q.difficulty === 'Easy').length;
  const mediumCount = codingQuestions.filter((q) => q.difficulty === 'Medium').length;
  const hardCount = codingQuestions.filter((q) => q.difficulty === 'Hard').length;

  // Helper to resolve question stage/subtopic/module even if unlinked or legacy format
  const resolveHierarchy = React.useCallback((q) => {
    if (!q) return { stageId: '', stageNum: null, subtopicId: '', moduleId: '' };

    const rawStage = q.stageId || q.stage_id || q.stageName || q.stage_name || q.stage || '';
    const rawSub = q.subtopicId || q.subtopic_id || q.subtopicName || q.subtopic_name || q.subtopic || '';
    const rawMod = q.innerTopicId || q.inner_topic_id || q.moduleId || q.module_id || q.moduleName || q.module_name || q.topicName || q.topic_name || q.topic || '';
    const title = String(q.title || '').toLowerCase();
    const cat = String(q.category || '').toLowerCase();
    const tags = Array.isArray(q.tags) ? q.tags.join(' ').toLowerCase() : String(q.tags || '').toLowerCase();
    const text = `${title} ${cat} ${tags} ${String(q.problemStatement || '').toLowerCase()}`;

    let stageNum = getStageNumber(rawStage);
    let resolvedStageId = rawStage;
    let resolvedSubId = rawSub;
    let resolvedModId = rawMod;

    // 1. If stageNum not found from rawStage, check subtopic
    if (stageNum === null && rawSub) {
      const cleanSub = String(rawSub).replace(/-(w|s)$/i, '').trim().toLowerCase();
      const cleanNorm = (str) => String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();

      for (const stg of activeStagesList) {
        const stgNum = getStageNumber(stg.id) || getStageNumber(stg.stageNumber) || getStageNumber(stg.title);
        const subs = getSubtopicsForStage(stg);
        const foundSub = subs.find(s =>
          cleanId(s.id) === cleanSub ||
          SUBTOPIC_MODULE_MAP[cleanId(s.id)] === cleanSub ||
          SUBTOPIC_MODULE_MAP[cleanSub] === cleanId(s.id) ||
          cleanNorm(s.title) === cleanNorm(rawSub) ||
          cleanNorm(s.id) === cleanNorm(rawSub)
        );
        if (foundSub) {
          stageNum = stgNum;
          resolvedStageId = stg.id;
          resolvedSubId = foundSub.id;
          break;
        }
      }
    }

    // 2. If stageNum still not found, try lesson in courseLessons or curriculum lessons
    if (stageNum === null && rawMod) {
      const cleanMod = String(rawMod).replace(/-(w|s)$/i, '').trim().toLowerCase();
      const cleanNorm = (str) => String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
      const lesson = (courseLessons || []).find(l =>
        cleanId(l.id) === cleanMod ||
        cleanNorm(l.title) === cleanNorm(rawMod)
      );
      if (lesson) {
        stageNum = getStageNumber(lesson.stage_id);
        resolvedStageId = lesson.stage_id;
        resolvedSubId = resolvedSubId || lesson.module_id;
        resolvedModId = lesson.id;
      }
    }

    // 3. If stageNum still not found, infer from title, tags, and problem statement
    if (stageNum === null) {
      if (
        text.includes('html') ||
        text.includes('css') ||
        text.includes('web page') ||
        text.includes('dom') ||
        text.includes('javascript') ||
        text.includes('frontend') ||
        text.includes('bootstrap') ||
        text.includes('git')
      ) {
        stageNum = 1;
        const s1 = activeStagesList.find(s => (getStageNumber(s.id) || getStageNumber(s.title)) === 1);
        resolvedStageId = s1?.id || 'top-stg-1';
        if (!resolvedSubId) {
          if (text.includes('html') || text.includes('web page')) resolvedSubId = 'm1_html';
          else if (text.includes('css') || text.includes('flexbox')) resolvedSubId = 'm1_css_fund';
          else if (text.includes('git')) resolvedSubId = 'm1_git';
          else if (text.includes('dom')) resolvedSubId = 'm1_dom';
          else if (text.includes('javascript') || text.includes('js')) resolvedSubId = 'm1_js_ess';
        }
      } else if (
        text.includes('python') ||
        text.includes('django') ||
        text.includes('postgres') ||
        text.includes('sql') ||
        text.includes('dsa') ||
        text.includes('array') ||
        text.includes('string') ||
        text.includes('anagram') ||
        text.includes('two sum') ||
        text.includes('linked list') ||
        text.includes('tree') ||
        text.includes('stack') ||
        text.includes('queue') ||
        text.includes('algorithm') ||
        text.includes('hash') ||
        text.includes('sort') ||
        text.includes('backend')
      ) {
        stageNum = 2;
        const s2 = activeStagesList.find(s => (getStageNumber(s.id) || getStageNumber(s.title)) === 2);
        resolvedStageId = s2?.id || 'top-stg-2';
        if (!resolvedSubId) {
          if (text.includes('anagram') || text.includes('two sum') || text.includes('array') || text.includes('string') || text.includes('hash') || text.includes('sort')) resolvedSubId = 'm2_dsa_arrays';
          else if (text.includes('linked list')) resolvedSubId = 'm2_dsa_linkedlist';
          else if (text.includes('tree')) resolvedSubId = 'm2_dsa_trees';
          else if (text.includes('postgres') || text.includes('sql')) resolvedSubId = 'm2_postgres';
          else if (text.includes('django')) resolvedSubId = 'm2_django_api';
          else if (text.includes('oop')) resolvedSubId = 'm2_py_oop';
          else resolvedSubId = 'm2_py_fund';
        }
      } else if (
        text.includes('ai') ||
        text.includes('cloud') ||
        text.includes('docker') ||
        text.includes('aws') ||
        text.includes('gemini') ||
        text.includes('fastapi') ||
        text.includes('integration')
      ) {
        stageNum = 3;
        const s3 = activeStagesList.find(s => (getStageNumber(s.id) || getStageNumber(s.title)) === 3);
        resolvedStageId = s3?.id || 'top-stg-3';
      } else if (
        text.includes('career') ||
        text.includes('interview') ||
        text.includes('resume') ||
        text.includes('portfolio') ||
        text.includes('system design')
      ) {
        stageNum = 4;
        const s4 = activeStagesList.find(s => (getStageNumber(s.id) || getStageNumber(s.title)) === 4);
        resolvedStageId = s4?.id || 'top-stg-4';
      } else {
        stageNum = 1;
        resolvedStageId = activeStagesList[0]?.id || 'top-stg-1';
      }
    }

    return {
      stageId: resolvedStageId,
      stageNum,
      subtopicId: resolvedSubId,
      moduleId: resolvedModId
    };
  }, [activeStagesList, courseLessons]);

  // Filter list
  const filteredQuestions = codingQuestions.filter((q) => {
    const qCourseId = q.courseId || q.course_id;
    const hierarchy = resolveHierarchy(q);
    const qStageId = hierarchy.stageId || q.stageId || q.stage_id;
    const qSubtopicId = hierarchy.subtopicId || q.subtopicId || q.subtopic_id;
    const qModuleId = hierarchy.moduleId || q.innerTopicId || q.inner_topic_id || q.moduleId || q.module_id;

    const matchesCourse = !activeCourseId || !qCourseId || qCourseId === 'ALL' || qCourseId === activeCourseId;
    const matchesStage = selectedStageId === 'ALL' || isMatchingStage(qStageId, selectedStageId) || (hierarchy.stageNum !== null && getStageNumber(selectedStageId) === hierarchy.stageNum);

    const matchesSubtopic =
      selectedSubtopicId === 'ALL' ||
      cleanId(qSubtopicId) === cleanId(selectedSubtopicId) ||
      SUBTOPIC_MODULE_MAP[cleanId(qSubtopicId)] === cleanId(selectedSubtopicId) ||
      SUBTOPIC_MODULE_MAP[cleanId(selectedSubtopicId)] === cleanId(qSubtopicId) ||
      (selectedSubtopicObj && (
        cleanStr(q.subtopicName) === cleanStr(selectedSubtopicObj.title) ||
        cleanStr(qSubtopicId) === cleanStr(selectedSubtopicObj.title) ||
        cleanId(qSubtopicId) === cleanId(selectedSubtopicObj.id) ||
        cleanId(hierarchy.subtopicId) === cleanId(selectedSubtopicObj.id)
      ));

    const selectedModObj = selectedModuleId !== 'ALL' ? modulesForSubtopic.find((m) => m.id === selectedModuleId || cleanId(m.id) === cleanId(selectedModuleId)) : null;
    const matchesModule =
      selectedModuleId === 'ALL' ||
      cleanId(qModuleId) === cleanId(selectedModuleId) ||
      (selectedModObj && (
        cleanStr(q.moduleName) === cleanStr(selectedModObj.title) ||
        cleanStr(q.topicName) === cleanStr(selectedModObj.title) ||
        cleanStr(qModuleId) === cleanStr(selectedModObj.title) ||
        cleanId(hierarchy.moduleId) === cleanId(selectedModObj.id)
      ));

    const matchesSearch =
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.category && q.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (q.problemStatement && q.problemStatement.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (q.tags && Array.isArray(q.tags) && q.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesDifficulty = difficultyFilter === 'ALL' || q.difficulty === difficultyFilter;
    const matchesLanguage = languageFilter === 'ALL' || q.language === languageFilter;

    return matchesCourse && matchesStage && matchesSubtopic && matchesModule && matchesSearch && matchesDifficulty && matchesLanguage;
  });

  const handleOpenAddModal = () => {
    const activeCourse = courses.find((c) => c.id === (selectedCourseId || courses[0]?.id)) || courses[0];
    const nextStages = (milestonesByBatch?.[activeCourse?.id]?.stages?.length > 0)
      ? milestonesByBatch[activeCourse.id].stages
      : (milestonesByBatch?.[activeBatchFilter]?.stages?.length > 0)
      ? milestonesByBatch[activeBatchFilter].stages
      : milestones?.stages || DEFAULT_STAGES;
    const activeStage = nextStages[0];
    const activeSubs = getSubtopicsForStage(activeStage);
    const activeSub = activeSubs[0];

    setEditingQuestion(null);
    setFormData({
      title: '',
      category: 'Algorithms & Data Structures',
      difficulty: 'Easy',
      marks: 20,
      timeLimitMinutes: 15,
      language: 'JavaScript',
      courseId: activeCourse?.id || '',
      courseName: activeCourse?.title || '',
      stageId: activeStage?.id || '',
      stageName: activeStage?.title || '',
      subtopicId: activeSub?.id || '',
      subtopicName: activeSub?.title || '',
      innerTopicId: '',
      topicName: '',
      tags: '',
      problemStatement: '',
      inputFormat: '',
      outputFormat: '',
      starterCode: '',
      solutionCode: '',
      sampleTestCases: [
        {
          input: '',
          output: '',
          explanation: ''
        }
      ]
    });
    setPastedJson('');
    setJsonError('');
    setJsonExtractedCount(0);
    setJsonTestCasesCount(0);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cq) => {
    setEditingQuestion(cq);
    const hierarchy = resolveHierarchy(cq);
    const qCourseId = cq.courseId || cq.course_id || courses[0]?.id || '';
    const activeCourse = courses.find((c) => c.id === qCourseId) || courses[0];
    const nextStages = (milestonesByBatch?.[qCourseId]?.stages?.length > 0)
      ? milestonesByBatch[qCourseId].stages
      : (milestonesByBatch?.[activeBatchFilter]?.stages?.length > 0)
      ? milestonesByBatch[activeBatchFilter].stages
      : milestones?.stages || DEFAULT_STAGES;
    const qStageId = cq.stageId || cq.stage_id || hierarchy.stageId || nextStages[0]?.id || '';
    const stageObj = nextStages.find(s => s.id === qStageId || isMatchingStage(s.id, qStageId) || (hierarchy.stageNum && (getStageNumber(s.id) || getStageNumber(s.title)) === hierarchy.stageNum)) || nextStages[0];
    const stageSubs = getSubtopicsForStage(stageObj);
    const qSubId = cq.subtopicId || cq.subtopic_id || hierarchy.subtopicId || stageSubs[0]?.id || '';
    const subObj = stageSubs.find(s => s.id === qSubId || cleanId(s.id) === cleanId(qSubId) || cleanStr(s.title) === cleanStr(qSubId)) || stageSubs[0];
    const subMods = getInnerModulesForSubtopic(subObj, courseLessons, stageObj?.id);
    const qModId = cq.innerTopicId || cq.inner_topic_id || cq.moduleId || cq.module_id || hierarchy.moduleId || '';
    const modObj = subMods.find(m => m.id === qModId || cleanId(m.id) === cleanId(qModId) || cleanStr(m.title) === cleanStr(qModId));

    setFormData({
      title: cq.title || '',
      category: cq.category || 'Algorithms & Data Structures',
      difficulty: cq.difficulty || 'Easy',
      marks: cq.marks || 20,
      timeLimitMinutes: cq.timeLimitMinutes || 15,
      language: cq.language || 'JavaScript',
      courseId: qCourseId,
      courseName: activeCourse?.title || cq.courseName || '',
      stageId: stageObj?.id || qStageId,
      stageName: stageObj?.title || cq.stageName || '',
      subtopicId: subObj?.id || qSubId,
      subtopicName: subObj?.title || cq.subtopicName || '',
      innerTopicId: modObj?.id || qModId,
      topicName: modObj?.title || cq.moduleName || cq.topicName || '',
      tags: Array.isArray(cq.tags) ? cq.tags.join(', ') : cq.tags || '',
      problemStatement: cq.problemStatement || cq.problem_statement || '',
      inputFormat: cq.inputFormat || cq.input_format || '',
      outputFormat: cq.outputFormat || cq.output_format || '',
      starterCode: cq.starterCode || cq.starter_code || '',
      solutionCode: cq.solutionCode || cq.solution_code || '',
      sampleTestCases: (cq.sampleTestCases && cq.sampleTestCases.length > 0)
        ? cq.sampleTestCases.map((tc) => ({ ...tc }))
        : (cq.testCases && cq.testCases.length > 0
          ? cq.testCases.map((tc) => ({ ...tc }))
          : [{ input: '', output: '', explanation: '' }])
    });
    setPastedJson('');
    setJsonError('');
    setJsonExtractedCount(0);
    setJsonTestCasesCount(0);
    setIsModalOpen(true);
  };

  // Test cases handler
  const handleAddTestCase = () => {
    setFormData((prev) => ({
      ...prev,
      sampleTestCases: [...prev.sampleTestCases, { input: '', output: '', explanation: '' }]
    }));
  };

  const handleRemoveTestCase = (index) => {
    setFormData((prev) => ({
      ...prev,
      sampleTestCases: prev.sampleTestCases.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateTestCase = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.sampleTestCases];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, sampleTestCases: updated };
    });
  };

  // ─── JSON Auto-Import Parser for Coding Questions ──────────────────────────
  const parseAndFillCodingQuestion = (rawInput, sourceName = 'Pasted JSON') => {
    if (!rawInput || (typeof rawInput === 'string' && !rawInput.trim())) {
      throw new Error('Please provide valid JSON content.');
    }

    let cleaned = typeof rawInput === 'string' ? rawInput.trim() : rawInput;
    if (typeof cleaned === 'string' && cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }

    let parsed;
    try {
      parsed = typeof cleaned === 'string' ? JSON.parse(cleaned) : cleaned;
    } catch (err) {
      throw new Error('Invalid JSON syntax: ' + err.message);
    }

    let count = 1;
    if (Array.isArray(parsed)) {
      count = parsed.length;
      parsed = parsed[0];
    }
    // Unwrap if wrapped in questions, codingQuestions, or data objects
    if (parsed && typeof parsed === 'object') {
      if (Array.isArray(parsed.codingQuestions) && parsed.codingQuestions.length > 0) {
        count = parsed.codingQuestions.length;
        parsed = parsed.codingQuestions[0];
      } else if (Array.isArray(parsed.coding_questions) && parsed.coding_questions.length > 0) {
        count = parsed.coding_questions.length;
        parsed = parsed.coding_questions[0];
      } else if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        count = parsed.questions.length;
        parsed = parsed.questions[0];
      } else if (parsed.codingQuestion && typeof parsed.codingQuestion === 'object') {
        parsed = parsed.codingQuestion;
      } else if (parsed.question && typeof parsed.question === 'object') {
        parsed = parsed.question;
      } else if (parsed.data && typeof parsed.data === 'object' && !Array.isArray(parsed.data)) {
        parsed = parsed.data;
      }
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Expected a JSON object containing coding question details.');
    }

    const title = parsed.title || parsed.name || parsed.questionTitle || parsed.question_title || parsed.question || '';
    const problemStatement =
      parsed.problemStatement ||
      parsed.problem_statement ||
      parsed.description ||
      parsed.problem ||
      parsed.statement ||
      parsed.desc ||
      '';
    const inputFormat = parsed.inputFormat || parsed.input_format || parsed.input_description || '';
    const outputFormat = parsed.outputFormat || parsed.output_format || parsed.output_description || '';
    const starterCode = parsed.starterCode || parsed.starter_code || parsed.codeTemplate || parsed.template || parsed.starter_template || '';
    const solutionCode = parsed.solutionCode || parsed.solution_code || parsed.solution || parsed.referenceCode || parsed.model_solution || '';

    // Difficulty
    let difficulty = 'Easy';
    const rawDiff = (parsed.difficulty || '').toLowerCase();
    if (rawDiff.includes('hard')) difficulty = 'Hard';
    else if (rawDiff.includes('med')) difficulty = 'Medium';

    // Language
    let language = 'JavaScript';
    const rawLang = (parsed.language || '').toLowerCase();
    if (rawLang.includes('python')) language = 'Python';
    else if (rawLang.includes('type')) language = 'TypeScript';
    else if (rawLang.includes('java') && !rawLang.includes('script')) language = 'Java';
    else if (rawLang.includes('c++') || rawLang.includes('cpp')) language = 'C++';

    // Category
    let category = 'Algorithms & Data Structures';
    const rawCat = (parsed.category || '').toLowerCase();
    if (rawCat.includes('react') || rawCat.includes('front')) category = 'React & Frontend Engineering';
    else if (rawCat.includes('back') || rawCat.includes('system')) category = 'Backend & System Design';
    else if (rawCat.includes('data') || rawCat.includes('sql')) category = 'Database & SQL';

    // Tags
    let tags = '';
    if (Array.isArray(parsed.tags)) tags = parsed.tags.join(', ');
    else if (typeof parsed.tags === 'string') tags = parsed.tags;

    // Helper: Safely normalize any value (string, number, boolean, array, object) into a string
    const normalizeValue = (val) => {
      if (val === undefined || val === null) return '';
      if (typeof val === 'string') return val;
      if (typeof val === 'number' || typeof val === 'boolean') return String(val);
      try {
        return JSON.stringify(val);
      } catch (e) {
        return String(val);
      }
    };

    // ─── Robust Test Cases Extraction ───
    let rawTC =
      parsed.sampleTestCases ||
      parsed.sample_test_cases ||
      parsed.sampleTestcases ||
      parsed.sampleCases ||
      parsed.sample_cases ||
      parsed.testCases ||
      parsed.test_cases ||
      parsed.testcases ||
      parsed.test_case ||
      parsed.testCase ||
      parsed.examples ||
      parsed.example ||
      parsed.samples ||
      parsed.cases ||
      parsed.tests ||
      parsed.test_suite ||
      parsed.testSuite ||
      null;

    if (typeof rawTC === 'string') {
      try {
        const p = JSON.parse(rawTC);
        if (Array.isArray(p) || (p && typeof p === 'object')) rawTC = p;
      } catch (e) {}
    }

    let testCasesList = [];
    if (Array.isArray(rawTC)) {
      testCasesList = rawTC;
    } else if (rawTC && typeof rawTC === 'object') {
      const entries = Object.entries(rawTC);
      const firstVal = entries[0]?.[1];
      if (firstVal && typeof firstVal === 'object' && !Array.isArray(firstVal)) {
        testCasesList = Object.values(rawTC);
      } else {
        testCasesList = entries.map(([k, v]) => ({ input: k, output: v }));
      }
    }

    // Check top-level sampleInput/input & sampleOutput/output if testCasesList is empty
    if (testCasesList.length === 0) {
      const topInput = parsed.sampleInput !== undefined ? parsed.sampleInput : (parsed.sample_input !== undefined ? parsed.sample_input : parsed.input);
      const topOutput = parsed.sampleOutput !== undefined ? parsed.sampleOutput : (parsed.sample_output !== undefined ? parsed.sample_output : parsed.output);
      if (topInput !== undefined || topOutput !== undefined) {
        testCasesList.push({
          input: topInput,
          output: topOutput,
          explanation: parsed.sampleExplanation || parsed.sample_explanation || parsed.explanation || ''
        });
      }
    }

    // If still empty, parse Example 1/2 from problemStatement/description text
    if (testCasesList.length === 0) {
      const text = problemStatement || parsed.description || parsed.statement || '';
      if (text) {
        const exampleRegex = /Input[:\s]+([^\n\r]+(?:\r?\n(?!Output|Expected|Returns|Example|Explanation)[^\n\r]+)*)\s*(?:Output|Expected|Returns)[:\s]+([^\n\r]+(?:\r?\n(?!Explanation|Example|Input)[^\n\r]+)*)/gi;
        let match;
        while ((match = exampleRegex.exec(text)) !== null) {
          const inStr = match[1]?.trim();
          let outStr = match[2]?.trim();
          let explanation = '';
          const tail = text.slice(match.index);
          const expMatch = tail.match(/Explanation[:\s]+([^\n\r]+(?:\r?\n(?!Example|Input)[^\n\r]+)*)/i);
          if (expMatch) explanation = expMatch[1].trim();

          if (inStr || outStr) {
            testCasesList.push({ input: inStr || '', output: outStr || '', explanation });
          }
        }
      }
    }

    // Now normalize every test case into { input, output, explanation }
    const extractedTC = [];
    for (const tc of testCasesList) {
      if (!tc && tc !== 0 && tc !== false) continue;

      if (Array.isArray(tc)) {
        extractedTC.push({
          input: normalizeValue(tc[0]),
          output: normalizeValue(tc[1]),
          explanation: normalizeValue(tc[2])
        });
        continue;
      }

      if (typeof tc === 'string') {
        const inMatch = tc.match(/Input[:\s]+([^\n\r]+(?:\r?\n(?!Output|Expected|Returns|Example|Explanation)[^\n\r]+)*)/i);
        const outMatch = tc.match(/(?:Output|Expected|Returns)[:\s]+([^\n\r]+(?:\r?\n(?!Explanation|Example|Input)[^\n\r]+)*)/i);
        const expMatch = tc.match(/Explanation[:\s]+([\s\S]*)/i);
        if (inMatch || outMatch) {
          extractedTC.push({
            input: normalizeValue((inMatch ? inMatch[1] : '').trim()),
            output: normalizeValue((outMatch ? outMatch[1] : '').trim()),
            explanation: normalizeValue((expMatch ? expMatch[1] : '').trim())
          });
        } else {
          extractedTC.push({
            input: normalizeValue(tc.trim()),
            output: '',
            explanation: ''
          });
        }
        continue;
      }

      if (typeof tc === 'object') {
        const inputVal =
          tc.input !== undefined
            ? tc.input
            : tc.in !== undefined
            ? tc.in
            : tc.stdin !== undefined
            ? tc.stdin
            : tc.inputText !== undefined
            ? tc.inputText
            : tc.input_text !== undefined
            ? tc.input_text
            : tc.input_data !== undefined
            ? tc.input_data
            : tc.inputs !== undefined
            ? tc.inputs
            : tc.args !== undefined
            ? tc.args
            : tc.arguments !== undefined
            ? tc.arguments
            : tc.params !== undefined
            ? tc.params
            : tc.parameters !== undefined
            ? tc.parameters
            : tc.test_input !== undefined
            ? tc.test_input
            : tc.query !== undefined
            ? tc.query
            : '';

        const outputVal =
          tc.output !== undefined
            ? tc.output
            : tc.expected !== undefined
            ? tc.expected
            : tc.out !== undefined
            ? tc.out
            : tc.stdout !== undefined
            ? tc.stdout
            : tc.expectedOutput !== undefined
            ? tc.expectedOutput
            : tc.expected_output !== undefined
            ? tc.expected_output
            : tc.outputText !== undefined
            ? tc.outputText
            : tc.output_text !== undefined
            ? tc.output_text
            : tc.result !== undefined
            ? tc.result
            : tc.return !== undefined
            ? tc.return
            : tc.returnValue !== undefined
            ? tc.returnValue
            : tc.ans !== undefined
            ? tc.ans
            : tc.answer !== undefined
            ? tc.answer
            : tc.target !== undefined
            ? tc.target
            : '';

        const expVal =
          tc.explanation !== undefined
            ? tc.explanation
            : tc.explain !== undefined
            ? tc.explain
            : tc.note !== undefined
            ? tc.note
            : tc.notes !== undefined
            ? tc.notes
            : tc.description !== undefined
            ? tc.description
            : tc.reason !== undefined
            ? tc.reason
            : tc.details !== undefined
            ? tc.details
            : '';

        extractedTC.push({
          input: normalizeValue(inputVal),
          output: normalizeValue(outputVal),
          explanation: normalizeValue(expVal)
        });
      }
    }

    const finalTestCases = extractedTC.length > 0
      ? extractedTC
      : [{ input: '', output: '', explanation: '' }];

    const resolvedInputFormat = inputFormat || (extractedTC[0]?.input ? extractedTC[0].input : '');
    const resolvedOutputFormat = outputFormat || (extractedTC[0]?.output ? extractedTC[0].output : '');

    const parsedHierarchy = resolveHierarchy({
      title,
      category,
      tags,
      problemStatement,
      stageId: parsed.stageId || parsed.stage_id,
      stageName: parsed.stageName || parsed.stage_name,
      subtopicId: parsed.subtopicId || parsed.subtopic_id,
      subtopicName: parsed.subtopicName || parsed.subtopic_name,
      innerTopicId: parsed.innerTopicId || parsed.inner_topic_id || parsed.moduleId || parsed.module_id,
      moduleName: parsed.moduleName || parsed.module_name || parsed.topicName || parsed.topic_name
    });

    const parsedStageObj = modalStagesList.find(s => isMatchingStage(s.id, parsedHierarchy.stageId) || (parsedHierarchy.stageNum && (getStageNumber(s.id) || getStageNumber(s.title)) === parsedHierarchy.stageNum)) || modalStagesList[0];
    const parsedStageSubs = getSubtopicsForStage(parsedStageObj);
    const parsedSubObj = parsedStageSubs.find(s => s.id === parsedHierarchy.subtopicId || cleanId(s.id) === cleanId(parsedHierarchy.subtopicId) || cleanStr(s.title) === cleanStr(parsedHierarchy.subtopicId)) || parsedStageSubs[0];
    const parsedSubMods = getInnerModulesForSubtopic(parsedSubObj, courseLessons, parsedStageObj?.id);
    const parsedModObj = parsedSubMods.find(m => m.id === parsedHierarchy.moduleId || cleanId(m.id) === cleanId(parsedHierarchy.moduleId) || cleanStr(m.title) === cleanStr(parsedHierarchy.moduleId));

    setFormData((prev) => ({
      ...prev,
      title: title || prev.title,
      stageId: parsedStageObj?.id || prev.stageId,
      stageName: parsedStageObj?.title || prev.stageName,
      subtopicId: parsedSubObj?.id || prev.subtopicId,
      subtopicName: parsedSubObj?.title || prev.subtopicName,
      innerTopicId: parsedModObj?.id || prev.innerTopicId || '',
      topicName: parsedModObj?.title || prev.topicName || '',
      difficulty,
      language,
      category,
      marks: parsed.marks !== undefined ? Number(parsed.marks) : prev.marks,
      timeLimitMinutes: parsed.timeLimitMinutes || parsed.timeLimit || prev.timeLimitMinutes,
      tags: tags || prev.tags,
      problemStatement: problemStatement || prev.problemStatement,
      inputFormat: resolvedInputFormat || prev.inputFormat,
      outputFormat: resolvedOutputFormat || prev.outputFormat,
      starterCode: starterCode || prev.starterCode,
      solutionCode: solutionCode || prev.solutionCode,
      sampleTestCases: finalTestCases
    }));

    setJsonExtractedCount(count);
    setJsonTestCasesCount(extractedTC.length);
    addToast(
      `✅ Auto-filled question "${title || 'from JSON'}" with ${extractedTC.length} test case(s)!`,
      'success'
    );
  };

  const handlePastedJsonImport = () => {
    if (!pastedJson.trim()) {
      setJsonError('Please paste your coding question JSON first.');
      return;
    }
    setJsonError('');
    try {
      parseAndFillCodingQuestion(pastedJson.trim(), 'Pasted JSON');
      setPastedJson('');
    } catch (err) {
      console.error('[Coding Question JSON Parse Error]', err);
      setJsonError(err.message || 'Failed to parse JSON. Please check the JSON format.');
    }
  };

  const handleJsonFileUpload = async (file) => {
    if (!file) return;
    if (!file.name?.toLowerCase().endsWith('.json') && file.type !== 'application/json') {
      setJsonError('Please upload a valid .json file.');
      return;
    }
    setJsonParsing(true);
    setJsonError('');
    try {
      const text = await file.text();
      parseAndFillCodingQuestion(text, file.name);
    } catch (err) {
      console.error('[File Upload Error]', err);
      setJsonError(err.message || 'Failed to read JSON file.');
    } finally {
      setJsonParsing(false);
    }
  };

  const handleLoadSampleCodingJson = () => {
    const sample = {
      title: "Two Sum Problem",
      difficulty: "Easy",
      language: "JavaScript",
      category: "Algorithms & Data Structures",
      marks: 20,
      timeLimitMinutes: 20,
      tags: "Array, Hash Map, Two Pointers",
      problemStatement: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
      inputFormat: "nums = [2, 7, 11, 15], target = 9",
      outputFormat: "[0, 1]",
      starterCode: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n  // Write your solution here\n}",
      solutionCode: "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) return [map.get(comp), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}",
      sampleTestCases: [
        {
          input: "nums = [2, 7, 11, 15], target = 9",
          output: "[0, 1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
        },
        {
          input: "nums = [3, 2, 4], target = 6",
          output: "[1, 2]",
          explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
        }
      ]
    };
    setPastedJson(JSON.stringify(sample, null, 2));
    setJsonError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.problemStatement) {
      addToast('Please provide question title and problem statement', 'error');
      return;
    }

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const targetCourse = courses.find((c) => c.id === formData.courseId) || courses[0];
    const targetStage = modalStagesList.find((s) => s.id === formData.stageId || isMatchingStage(s.id, formData.stageId));
    const targetSubs = getSubtopicsForStage(targetStage);
    const targetSub = targetSubs.find((st) => st.id === formData.subtopicId);
    const targetLessons = getInnerModulesForSubtopic(targetSub, courseLessons, targetStage?.id);
    const targetLesson = targetLessons.find((l) => l.id === formData.innerTopicId);

    const payload = {
      title: formData.title,
      category: formData.category,
      difficulty: formData.difficulty,
      marks: parseInt(formData.marks) || 20,
      timeLimitMinutes: parseInt(formData.timeLimitMinutes) || 15,
      language: formData.language,
      courseId: formData.courseId,
      courseName: targetCourse?.title || formData.courseName || '',
      stageId: formData.stageId,
      stageName: targetStage?.title || formData.stageName || '',
      subtopicId: formData.subtopicId,
      subtopicName: targetSub?.title || formData.subtopicName || '',
      innerTopicId: formData.innerTopicId,
      moduleName: targetLesson?.title || formData.topicName || '',
      topicName: targetLesson?.title || formData.topicName || '',
      tags: tagsArray,
      problemStatement: formData.problemStatement,
      inputFormat: formData.inputFormat,
      outputFormat: formData.outputFormat,
      starterCode: formData.starterCode,
      solutionCode: formData.solutionCode,
      sampleTestCases: (formData.sampleTestCases || []).filter((tc) => (tc.input !== '' && tc.input !== undefined) || (tc.output !== '' && tc.output !== undefined)),
      testCases: (formData.sampleTestCases || []).filter((tc) => (tc.input !== '' && tc.input !== undefined) || (tc.output !== '' && tc.output !== undefined)),
      test_cases: (formData.sampleTestCases || []).filter((tc) => (tc.input !== '' && tc.input !== undefined) || (tc.output !== '' && tc.output !== undefined))
    };

    if (editingQuestion) {
      updateCodingQuestion(editingQuestion.id, payload);
      addToast(`Updated coding question: "${formData.title}"`, 'success');
    } else {
      addCodingQuestion(payload);
      addToast(`Posted new coding question: "${formData.title}"`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingQuestion) {
      deleteCodingQuestion(deletingQuestion.id);
      addToast(`Deleted coding question "${deletingQuestion.title}"`, 'info');
      setDeletingQuestion(null);
    }
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Hard':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">Hard</span>;
      case 'Medium':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">Medium</span>;
      case 'Easy':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">Easy</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Code2 className="w-6 h-6" />
            </div>
            Coding Questions Bank
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Post coding problems, test cases, and solution templates for student assessments
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Batch Selector Pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setActiveBatchFilter && setActiveBatchFilter('Weekday Batch')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeBatchFilter === 'Weekday Batch' || activeBatchFilter === 'ALL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Weekday (A26W)
            </button>
            <button
              onClick={() => setActiveBatchFilter && setActiveBatchFilter('Weekend Batch')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeBatchFilter === 'Weekend Batch'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Weekend (A26S)
            </button>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleOpenAddModal}
            className="shadow-md bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Post New Question
          </Button>
        </div>
      </div>

      {/* Filters Container */}
      <div className="flex flex-wrap items-center gap-4 pt-2.5 border-t border-slate-100/60">
        {/* Course Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 flex-shrink-0">
            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
            <span>Course:</span>
          </label>
          <div className="relative">
            <select
              value={selectedCourseId || courses[0]?.id || ''}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setSelectedStageId('ALL');
                setSelectedSubtopicId('ALL');
                setSelectedModuleId('ALL');
              }}
              className="px-3.5 py-2 pr-8 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 hover:border-purple-300 focus:outline-none focus:border-purple-600 focus:bg-white transition-all shadow-2xs cursor-pointer appearance-none max-w-[240px] truncate"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Milestone Stage Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 flex-shrink-0">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Stage:</span>
          </label>
          <div className="relative">
            <select
              value={selectedStageId}
              onChange={(e) => {
                setSelectedStageId(e.target.value);
                setSelectedSubtopicId('ALL');
                setSelectedModuleId('ALL');
              }}
              className="px-3.5 py-2 pr-8 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 hover:border-blue-300 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-2xs cursor-pointer appearance-none max-w-[200px] truncate"
            >
              <option value="ALL">All Stages</option>
              {activeStagesList.map((stg) => (
                <option key={stg.id} value={stg.id}>
                  {stg.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Milestone Module Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 flex-shrink-0">
            <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
            <span>Milestone Module:</span>
          </label>
          <div className="relative">
            <select
              value={selectedSubtopicId}
              onChange={(e) => {
                setSelectedSubtopicId(e.target.value);
                setSelectedModuleId('ALL');
              }}
              disabled={selectedStageId === 'ALL'}
              className="px-3.5 py-2 pr-8 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 hover:border-emerald-300 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs cursor-pointer appearance-none max-w-[200px] truncate disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="ALL">All Milestone Modules</option>
              {selectedStageId !== 'ALL' &&
                subtopicsForStage.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.title}
                  </option>
                ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Specific Module Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Specific Module:</span>
          </label>
          <div className="relative">
            <select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              disabled={selectedSubtopicId === 'ALL'}
              className="px-3.5 py-2 pr-8 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 hover:border-purple-300 focus:outline-none focus:border-purple-600 focus:bg-white transition-all shadow-2xs cursor-pointer appearance-none max-w-[200px] truncate disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="ALL">All Specific Modules</option>
              {selectedSubtopicId !== 'ALL' &&
                modulesForSubtopic.map((mod) => (
                  <option key={mod.id} value={mod.id}>
                    {mod.title}
                  </option>
                ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block leading-tight">{totalQuestionsCount}</span>
            <span className="text-xs font-bold text-slate-500">Total Questions</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block leading-tight">{easyCount}</span>
            <span className="text-xs font-bold text-slate-500">Easy Problems</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block leading-tight">{mediumCount}</span>
            <span className="text-xs font-bold text-slate-500">Medium Problems</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block leading-tight">{hardCount}</span>
            <span className="text-xs font-bold text-slate-500">Hard Problems</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          <Select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Difficulties' },
              { value: 'Easy', label: 'Easy' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Hard', label: 'Hard' }
            ]}
            className="w-36 text-xs"
          />

          <Select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Languages' },
              { value: 'JavaScript', label: 'JavaScript' },
              { value: 'TypeScript', label: 'TypeScript' },
              { value: 'Python', label: 'Python' },
              { value: 'Java', label: 'Java' },
              { value: 'C++', label: 'C++' }
            ]}
            className="w-36 text-xs"
          />
        </div>

        <div className="relative flex-1 sm:w-64 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search title, tag, or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Question Cards List */}
      <div className="space-y-4">
        {filteredQuestions.map((cq) => {
          const hierarchy = resolveHierarchy(cq);
          const displayStage = activeStagesList.find(s => isMatchingStage(s.id, hierarchy.stageId) || (hierarchy.stageNum !== null && (getStageNumber(s.id) || getStageNumber(s.stageNumber) || getStageNumber(s.title)) === hierarchy.stageNum));
          const stageSubs = displayStage ? getSubtopicsForStage(displayStage) : [];
          const displaySub = stageSubs.find(st => cleanId(st.id) === cleanId(hierarchy.subtopicId) || SUBTOPIC_MODULE_MAP[cleanId(st.id)] === cleanId(hierarchy.subtopicId) || cleanStr(st.title) === cleanStr(hierarchy.subtopicId) || cleanStr(st.id) === cleanStr(hierarchy.subtopicId));
          const subMods = displaySub ? getInnerModulesForSubtopic(displaySub, courseLessons, displayStage?.id) : [];
          const displayMod = subMods.find(m => cleanId(m.id) === cleanId(hierarchy.moduleId) || cleanStr(m.title) === cleanStr(hierarchy.moduleId));

          return (
            <div
              key={cq.id}
              className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-snug">{cq.title}</h3>

                    {getDifficultyBadge(cq.difficulty || 'Easy')}
                    {cq.language && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-100/80">
                        {cq.language}
                      </span>
                    )}
                    {(cq.marks || cq.points) && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200/60">
                        {cq.marks || cq.points} Marks
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 font-medium flex items-center gap-2 flex-wrap">
                    <span>{cq.category || cq.topic || 'Algorithms & Data Structures'}</span>
                    {(displayStage || cq.stageName || cq.stageId) && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 text-blue-600 font-semibold">
                          <Layers className="w-3 h-3 text-blue-500" />
                          <span>{displayStage?.title || cq.stageName || (activeStagesList.find(s => isMatchingStage(s.id, cq.stageId))?.title) || cq.stageId}</span>
                        </span>
                      </>
                    )}
                    {(displaySub || cq.subtopicName || cq.subtopicId) && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                          <Bookmark className="w-3 h-3 text-emerald-500" />
                          <span>{displaySub?.title || cq.subtopicName || cq.subtopicId}</span>
                        </span>
                      </>
                    )}
                    {(displayMod || cq.moduleName || cq.topicName || cq.innerTopicId) && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 text-purple-600 font-semibold">
                          <Sparkles className="w-3 h-3 text-purple-500" />
                          <span>{displayMod?.title || cq.moduleName || cq.topicName || cq.innerTopicId}</span>
                        </span>
                      </>
                    )}
                    {(cq.timeLimitMinutes || cq.timeLimit || cq.duration) && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cq.timeLimitMinutes || cq.timeLimit || cq.duration} Mins</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setViewingSolution({ question: cq, tab: 'starter' })}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" /> Code & Solution
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(cq)}
                    className="p-2 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Edit Question"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingQuestion(cq)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Problem Statement */}
              {(cq.problemStatement || cq.description) && (
                <div className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                  {cq.problemStatement || cq.description}
                </div>
              )}

              {/* Tags & Sample Test Preview */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                {Array.isArray(cq.tags) && cq.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    {cq.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-0.5 bg-slate-100/80 text-slate-600 rounded-lg text-[11px] font-semibold border border-slate-200/50">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {cq.sampleTestCases && cq.sampleTestCases.length > 0 && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    {cq.sampleTestCases.length} Sample Test Case(s) Included
                  </span>
                )}
              </div>
          </div>
        );
        })}

        {filteredQuestions.length === 0 && (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <Code2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No coding questions found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Post your first coding challenge or adjust your filters.
            </p>
            <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAddModal}>
              Post Coding Question
            </Button>
          </div>
        )}
      </div>

      {/* Post / Edit Coding Question Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPastedJson('');
          setJsonError('');
          setJsonExtractedCount(0);
        }}
        title={editingQuestion ? 'Edit Coding Question' : 'Post New Coding Question'}
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* AUTO-IMPORT FROM JSON SECTION */}
          <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-emerald-600" />
                <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                  Auto-Import from JSON
                </span>
                <span className="text-[11px] text-slate-400 font-medium">(auto-fill form fields)</span>
              </div>

              {/* Mode Toggle Tabs: Paste JSON vs Upload File */}
              <div className="inline-flex rounded-xl bg-slate-200/70 p-1 border border-slate-200 text-xs font-bold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => { setImportMode('paste'); setJsonError(''); }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    importMode === 'paste'
                      ? 'bg-white text-emerald-700 shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ClipboardPaste className="w-3.5 h-3.5 text-emerald-600" />
                  Paste JSON
                </button>
                <button
                  type="button"
                  onClick={() => { setImportMode('file'); setJsonError(''); }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    importMode === 'file'
                      ? 'bg-white text-emerald-700 shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  Upload .JSON
                </button>
              </div>
            </div>

            {/* TAB 1: PASTE JSON */}
            {importMode === 'paste' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-600">
                    Paste coding question JSON:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleLoadSampleCodingJson}
                      className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 hover:underline cursor-pointer"
                    >
                      Insert Sample JSON
                    </button>
                    {pastedJson && (
                      <button
                        type="button"
                        onClick={() => { setPastedJson(''); setJsonError(''); }}
                        className="text-[11px] font-bold text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <textarea
                  rows={5}
                  value={pastedJson}
                  onChange={(e) => setPastedJson(e.target.value)}
                  placeholder={`{\n  "title": "Two Sum",\n  "difficulty": "Easy",\n  "language": "JavaScript",\n  "problemStatement": "...",\n  "sampleTestCases": [{ "input": "...", "output": "..." }]\n}`}
                  className="w-full px-3.5 py-2 bg-white text-slate-800 font-mono text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all shadow-inner resize-y"
                />

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] text-slate-500">
                    💡 Click <strong>Parse &amp; Fill Question</strong> to populate all problem details, test cases, and starter code.
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    icon={Sparkles}
                    onClick={handlePastedJsonImport}
                    disabled={!pastedJson.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    Parse &amp; Fill Question
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 2: UPLOAD .JSON FILE */}
            {importMode === 'file' && (
              <label
                htmlFor="coding-json-upload"
                className={`flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all ${
                  jsonDragOver
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-300 bg-white hover:border-emerald-400 hover:bg-emerald-50/30'
                }`}
                onDragOver={(e) => { e.preventDefault(); setJsonDragOver(true); }}
                onDragLeave={() => setJsonDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setJsonDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) handleJsonFileUpload(file);
                }}
              >
                <input
                  id="coding-json-upload"
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleJsonFileUpload(file);
                    e.target.value = '';
                  }}
                />
                {jsonParsing ? (
                  <div className="flex items-center gap-2 py-1 text-emerald-700 text-xs font-bold">
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span>Reading &amp; parsing JSON file…</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-600 py-1 text-xs font-semibold">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>Drop your <strong className="text-emerald-700 font-bold">.json</strong> file here or <span className="text-emerald-600 underline">click to browse</span></span>
                  </div>
                )}
              </label>
            )}

            {/* Status & Error feedback */}
            {jsonError && (
              <div className="flex items-start gap-2 px-3 py-2 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>{jsonError}</span>
              </div>
            )}
            {jsonExtractedCount > 0 && !jsonError && (
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  Coding question fields filled successfully
                  {jsonTestCasesCount > 0 ? ` with ${jsonTestCasesCount} sample test case(s)` : ''}!
                  You can review or edit any fields below.
                </span>
              </div>
            )}
          </div>

          <Input
            label="Question Title"
            placeholder="e.g. Two Sum Problem or Custom Hook Implementation"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="1. Course Track"
              value={formData.courseId}
              onChange={(e) => {
                const newCourseId = e.target.value;
                const selectedC = courses.find((c) => c.id === newCourseId);
                const nextStages = (milestonesByBatch?.[newCourseId]?.stages?.length > 0)
                  ? milestonesByBatch[newCourseId].stages
                  : (milestonesByBatch?.[activeBatchFilter]?.stages?.length > 0)
                  ? milestonesByBatch[activeBatchFilter].stages
                  : milestones?.stages || DEFAULT_STAGES;
                const firstStage = nextStages[0];
                const firstSubs = getSubtopicsForStage(firstStage);
                const firstSub = firstSubs[0];
                setFormData((prev) => ({
                  ...prev,
                  courseId: newCourseId,
                  courseName: selectedC?.title || '',
                  stageId: firstStage?.id || '',
                  stageName: firstStage?.title || '',
                  subtopicId: firstSub?.id || '',
                  subtopicName: firstSub?.title || '',
                  innerTopicId: '',
                  topicName: ''
                }));
              }}
              options={courses.map((c) => ({ value: c.id, label: c.title }))}
            />
            <Select
              label="2. Milestone Stage"
              value={formData.stageId || currentStageObj?.id || ''}
              onChange={(e) => {
                const newStageId = e.target.value;
                const newStage = modalStagesList.find((s) => s.id === newStageId || isMatchingStage(s.id, newStageId)) || modalStagesList[0];
                const newSubs = getSubtopicsForStage(newStage);
                const firstSub = newSubs[0];
                setFormData((prev) => ({
                  ...prev,
                  stageId: newStageId,
                  stageName: newStage?.title || '',
                  subtopicId: firstSub?.id || '',
                  subtopicName: firstSub?.title || '',
                  innerTopicId: '',
                  topicName: ''
                }));
              }}
              options={modalStagesList.map((stg) => ({
                value: stg.id,
                label: stg.title
              }))}
            />
            <Select
              label="3. Milestone Subtopic"
              value={formData.subtopicId || currentSubtopicObj?.id || ''}
              onChange={(e) => {
                const newSubId = e.target.value;
                const targetSub = currentSubtopicsArr.find((st) => st.id === newSubId || cleanId(st.id) === cleanId(newSubId) || cleanStr(st.title) === cleanStr(newSubId)) || currentSubtopicsArr[0];
                setFormData((prev) => ({
                  ...prev,
                  subtopicId: newSubId,
                  subtopicName: targetSub?.title || '',
                  innerTopicId: '',
                  topicName: ''
                }));
              }}
              options={currentSubtopicsArr.map((sub) => ({
                value: sub.id,
                label: sub.title
              }))}
            />
            <Select
              label="4. Specific Lesson (Optional)"
              value={formData.innerTopicId || ''}
              onChange={(e) => {
                const newInnerId = e.target.value;
                const targetMod = currentInnerTopicsArr.find((m) => m.id === newInnerId || cleanId(m.id) === cleanId(newInnerId) || cleanStr(m.title) === cleanStr(newInnerId));
                setFormData((prev) => ({
                  ...prev,
                  innerTopicId: newInnerId,
                  topicName: targetMod?.title || ''
                }));
              }}
              options={[
                { value: '', label: 'None (Module Level)' },
                ...currentInnerTopicsArr.map((l) => ({ value: l.id, label: l.title }))
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Programming Language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              options={[
                { value: 'JavaScript', label: 'JavaScript' },
                { value: 'TypeScript', label: 'TypeScript' },
                { value: 'Python', label: 'Python' },
                { value: 'Java', label: 'Java' },
                { value: 'C++', label: 'C++' }
              ]}
            />

            <Select
              label="Difficulty Level"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              options={[
                { value: 'Easy', label: 'Easy' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Hard', label: 'Hard' }
              ]}
            />

            <Select
              label="Category / Topic"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'Algorithms & Data Structures', label: 'Algorithms & DS' },
                { value: 'React & Frontend Engineering', label: 'React & Frontend' },
                { value: 'Backend & System Design', label: 'Backend & System Design' },
                { value: 'Database & SQL', label: 'Database & SQL' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Marks / Points"
              type="number"
              value={formData.marks}
              onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
            />

            <Input
              label="Time Limit (Minutes)"
              type="number"
              value={formData.timeLimitMinutes}
              onChange={(e) => setFormData({ ...formData, timeLimitMinutes: e.target.value })}
            />

            <Input
              label="Tags (Comma-Separated)"
              placeholder="Arrays, HashMap, React"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          {/* Problem Statement */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
              Problem Statement / Description
            </label>
            <textarea
              rows={4}
              placeholder="Write detailed problem instructions, input constraints, and goals..."
              value={formData.problemStatement}
              onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all font-medium leading-relaxed"
              required
            />
          </div>

          {/* Input & Output Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Input Format"
              placeholder="e.g. nums = [2, 7, 11, 15], target = 9"
              value={formData.inputFormat}
              onChange={(e) => setFormData({ ...formData, inputFormat: e.target.value })}
            />
            <Input
              label="Output Format"
              placeholder="e.g. [0, 1]"
              value={formData.outputFormat}
              onChange={(e) => setFormData({ ...formData, outputFormat: e.target.value })}
            />
          </div>

          {/* Sample Test Cases Builder */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                Sample Test Cases ({formData.sampleTestCases.length})
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={handleAddTestCase}
                className="text-xs border-emerald-200 text-emerald-700"
              >
                Add Test Case
              </Button>
            </div>

            {formData.sampleTestCases.map((tc, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600">Test Case #{idx + 1}</span>
                  {formData.sampleTestCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTestCase(idx)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    placeholder="Input (e.g. nums=[2,7], target=9)"
                    value={tc.input}
                    onChange={(e) => handleUpdateTestCase(idx, 'input', e.target.value)}
                  />
                  <Input
                    placeholder="Expected Output (e.g. [0, 1])"
                    value={tc.output}
                    onChange={(e) => handleUpdateTestCase(idx, 'output', e.target.value)}
                  />
                </div>
                <Input
                  placeholder="Explanation / Note (Optional)"
                  value={tc.explanation}
                  onChange={(e) => handleUpdateTestCase(idx, 'explanation', e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Starter Code & Solution Code */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-500" /> Starter Code Template (Students see this)
              </label>
              <textarea
                rows={4}
                value={formData.starterCode}
                onChange={(e) => setFormData({ ...formData, starterCode: e.target.value })}
                className="w-full p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Solution Code / Trainer Reference
              </label>
              <textarea
                rows={4}
                value={formData.solutionCode}
                onChange={(e) => setFormData({ ...formData, solutionCode: e.target.value })}
                className="w-full p-3 bg-slate-900 text-blue-300 font-mono text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingQuestion(null);
                setPastedJson('');
                setJsonError('');
                setJsonExtractedCount(0);
                setJsonTestCasesCount(0);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {editingQuestion ? 'Save Changes' : 'Post Coding Question'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Viewing Starter / Solution Code Modal */}
      {viewingSolution && (
        <Modal
          isOpen={!!viewingSolution}
          onClose={() => setViewingSolution(null)}
          title={`Code & Solution - ${viewingSolution.question.title}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-4">
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setViewingSolution({ ...viewingSolution, tab: 'starter' })}
                className={`px-4 py-2 text-xs font-bold cursor-pointer border-b-2 ${
                  viewingSolution.tab === 'starter'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Starter Template Code
              </button>
              <button
                onClick={() => setViewingSolution({ ...viewingSolution, tab: 'solution' })}
                className={`px-4 py-2 text-xs font-bold cursor-pointer border-b-2 ${
                  viewingSolution.tab === 'solution'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Solution Code
              </button>
            </div>

            <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-2xl overflow-x-auto leading-relaxed">
              <code>
                {viewingSolution.tab === 'starter'
                  ? viewingSolution.question.starterCode || '// No starter code provided'
                  : viewingSolution.question.solutionCode || '// No solution code provided'}
              </code>
            </pre>

            {viewingSolution.question.sampleTestCases && viewingSolution.question.sampleTestCases.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Sample Test Cases</h5>
                {viewingSolution.question.sampleTestCases.map((tc, i) => (
                  <div key={i} className="bg-slate-50 p-3 rounded-xl border text-xs space-y-1 font-mono">
                    <p><strong className="text-slate-700">Input:</strong> {tc.input}</p>
                    <p><strong className="text-emerald-700">Expected Output:</strong> {tc.output}</p>
                    {tc.explanation && <p className="font-sans text-slate-500 text-[11px]">{tc.explanation}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingQuestion}
        onClose={() => setDeletingQuestion(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Coding Question"
        message={`Are you sure you want to remove "${deletingQuestion?.title}" from the question bank?`}
      />
    </div>
  );
}
