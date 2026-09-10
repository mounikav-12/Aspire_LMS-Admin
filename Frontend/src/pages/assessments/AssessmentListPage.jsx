import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { BatchFilterSelector } from '../../components/common/BatchFilterSelector';
import { DEFAULT_STAGES, getSubtopicsForStage, getInnerModulesForSubtopic } from '../sessions/LiveSessionListPage';
import { isMatchingStage, SUBTOPIC_MODULE_MAP } from '../milestones/MilestonesRoadmapPage';
import {
  FileCheck2,
  Plus,
  Search,
  Clock,
  Award,
  HelpCircle,
  Code2,
  Calendar,
  Edit2,
  Trash2,
  BookOpen,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Layers,
  ListChecks,
  CheckSquare,
  Square,
  Video,
  Code,
  FileCheck,
  Bookmark,
  ChevronDown,
  Lock,
  FileText,
  FileJson,
  ClipboardPaste,
  Upload,
  XCircle,
  AlertCircle
} from 'lucide-react';

export function AssessmentListPage() {
  const {
    assessments,
    quizzes,
    courses,
    courseLessons,
    milestones,
    milestonesByBatch,
    addAssessment,
    updateAssessment,
    deleteAssessment,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    activeBatchFilter,
    setActiveBatchFilter,
    availableBatches,
    getItemLockStatus
  } = useLmsData();
  const { addToast } = useToast();

  const allWeekdayBatchesList = (
    availableBatches && availableBatches.length > 0
      ? availableBatches.filter(
          (b) => b.startsWith('A26W') && !b.startsWith('A26S') && !b.startsWith('A26WE')
        )
      : []
  );
  const allWeekendBatchesList = (
    availableBatches && availableBatches.length > 0
      ? availableBatches
          .filter((b) => b.startsWith('A26S') || b.startsWith('A26WE'))
          .map((b) => b.replace(/^A26WE/, 'A26S'))
          .filter((b, i, arr) => arr.indexOf(b) === i)
      : []
  );

  const [selectedBatch, setSelectedBatch] = useState(activeBatchFilter || 'Weekday Batch');

  const handleSelectBatch = (bVal) => {
    setSelectedBatch(bVal);
    if (setActiveBatchFilter) setActiveBatchFilter(bVal);
  };

  const [activeMainTab, setActiveMainTab] = useState('ASSESSMENTS'); // 'ASSESSMENTS' | 'QUIZZES'
  const [activeStatusFilter, setActiveStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'COMPLETED'
  const [searchTerm, setSearchTerm] = useState('');

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
  const activeStagesList =
    activeCourseId && activeCourseId !== 'ALL' && milestonesByBatch?.[activeCourseId]?.stages && milestonesByBatch[activeCourseId].stages.length > 0
      ? milestonesByBatch[activeCourseId].stages
      : activeCourseObj?.topics && activeCourseObj.topics.length > 0
      ? activeCourseObj.topics
      : milestones?.stages && milestones.stages.length > 0
      ? milestones.stages
      : DEFAULT_STAGES;

  const selectedStageObj = selectedStageId !== 'ALL' ? activeStagesList.find((s) => s.id === selectedStageId) : null;
  const subtopicsForStage = selectedStageObj ? getSubtopicsForStage(selectedStageObj) : [];

  const selectedSubtopicObj = selectedSubtopicId !== 'ALL' ? subtopicsForStage.find((sub) => sub.id === selectedSubtopicId) : null;
  const modulesForSubtopic = selectedSubtopicObj ? getInnerModulesForSubtopic(selectedSubtopicObj, courseLessons, selectedStageId) : [];
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [deletingAssessment, setDeletingAssessment] = useState(null);

  // Form state for creating/editing assessment
  const [formData, setFormData] = useState({
    title: '',
    evalType: 'assessment', // 'assessment' | 'quiz'
    courseId: '',
    courseName: '',
    stageId: '',
    stageName: '',
    subtopicId: '',
    subtopicName: '',
    innerTopicId: '',
    topicName: '',
    durationMinutes: 45,
    totalMarks: 100,
    dueDate: '2026-08-30',
    mcqs: [
      {
        mcqType: 'theoretical',
        question: '',
        codeSnippet: '',
        options: ['', '', '', ''],
        correctIndex: 0
      }
    ],
    codingQuestions: [
      {
        title: '',
        problemStatement: ''
      }
    ]
  });

  // Batch Selection State for Modal
  const [batchActiveTab, setBatchActiveTab] = useState('Weekdays');
  const [selectedWeekdayBatches, setSelectedWeekdayBatches] = useState(allWeekdayBatchesList);
  const [selectedWeekendBatches, setSelectedWeekendBatches] = useState(allWeekendBatchesList);

  // PDF & JSON Import State
  const [importMode, setImportMode] = useState('paste'); // 'paste' | 'file'
  const [pastedText, setPastedText] = useState('');
  const [pdfParsing, setPdfParsing] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfExtractedCount, setPdfExtractedCount] = useState(0);
  const [pdfDragOver, setPdfDragOver] = useState(false);

  // ─── PDF MCQ Parser ───────────────────────────────────────────────────────
  // Robust parser that handles:
  //  • Multi-line questions and options
  //  • Options inline on same line as question
  //  • Formats: A) A. (A) a) a. with or without space
  //  • Answer lines: "Answer: A", "Ans: B", "Correct Answer: C"
  //  • Correct answer marked with asterisk: *A) or (A)*
  //  • Both 1. and Q1. and Q.1 question numbering
  const parseMcqsFromText = (text) => {
    // ── Step 1: Pre-process ─────────────────────────────────────────────────
    // Insert a newline before any option marker so they always start fresh
    // Option markers: "A)" "A." "(A)" "a)" "a." "[A]"  possibly with leading space
    let normalized = text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Insert newline before option-like tokens so they are on their own line
      .replace(/\s+([A-Da-d][.)]\s)/g, '\n$1')
      .replace(/\s+(\([A-Da-d]\)\s)/g, '\n$1')
      // Insert newline before answer-key tokens
      .replace(/\s+((?:ans(?:wer)?|correct\s*answer?)\s*[:.])/gi, '\nANS_MARKER $1')
      // Insert newline before next question number so blocks are clean
      .replace(/([.?!])\s+(\d{1,3}[.)]\s)/g, '$1\n$2');

    const lines = normalized.split('\n').map(l => l.trim()).filter(Boolean);

    // ── Step 2: Split into question blocks ──────────────────────────────────
    // A question block starts with: "1." "Q1." "Q.1" "(1)" "1)"
    const isQuestionStart = (l) => /^(?:Q\.?\s*)?\d{1,3}[.)]\s+\S/.test(l) || /^\(\d{1,3}\)\s+\S/.test(l);
    const isOptionLine    = (l) => /^[*]?[([]?[A-Da-d][.)>\]]\s*.+/.test(l);
    const isAnswerLine    = (l) => /^(?:ANS_MARKER\s+)?(?:ans(?:wer)?|correct(?:\s+answer)?)\s*[:.\s]/i.test(l);

    // Find where each question starts
    const blockStarts = [];
    lines.forEach((l, idx) => { if (isQuestionStart(l)) blockStarts.push(idx); });

    if (blockStarts.length === 0) return [];

    const extracted = [];

    blockStarts.forEach((startIdx, bi) => {
      const endIdx = bi + 1 < blockStarts.length ? blockStarts[bi + 1] : lines.length;
      const block  = lines.slice(startIdx, endIdx);

      // ── Parse question text ──────────────────────────────────────────────
      // Strip leading "1." / "Q1." prefix
      const firstLine = block[0].replace(/^(?:Q\.?\s*)?\d{1,3}[.)]\s*/, '').replace(/^\(\d{1,3}\)\s*/, '').trim();
      let questionParts = [firstLine];
      let li = 1;

      // Consume continuation lines until we hit an option or answer
      while (li < block.length && !isOptionLine(block[li]) && !isAnswerLine(block[li])) {
        questionParts.push(block[li]);
        li++;
      }
      const questionText = questionParts.join(' ').trim();

      // ── Parse options ────────────────────────────────────────────────────
      const options = [];
      let correctIndex = -1;

      while (li < block.length && options.length < 4) {
        const ol = block[li];
        if (isAnswerLine(ol)) break;

        // Asterisk = correct answer marker
        const asterisk = ol.match(/^\*[([]?([A-Da-d])[.)>\]]\s*(.+)/);
        const normal   = ol.match(/^[([]?([A-Da-d])[.)>\]]\s*(.+)/);

        if (asterisk) {
          const idx = asterisk[1].toUpperCase().charCodeAt(0) - 65;
          let optText = asterisk[2].trim();
          li++;
          // Collect multi-line option text
          while (li < block.length && !isOptionLine(block[li]) && !isAnswerLine(block[li])) {
            optText += ' ' + block[li]; li++;
          }
          options[idx] = optText.trim();
          correctIndex = idx;
        } else if (normal) {
          const idx = normal[1].toUpperCase().charCodeAt(0) - 65;
          let optText = normal[2].trim();
          li++;
          while (li < block.length && !isOptionLine(block[li]) && !isAnswerLine(block[li])) {
            optText += ' ' + block[li]; li++;
          }
          options[idx] = optText.trim();
        } else {
          li++;
        }
      }

      // ── Parse answer line ────────────────────────────────────────────────
      while (li < block.length) {
        const al = block[li];
        // Patterns: "Answer: A"  "Ans:B"  "Correct Answer: (C)"  "ANS_MARKER Answer: D"
        const ansMatch = al.match(/(?:ans(?:wer)?|correct(?:\s+answer)?)\s*[:.)\s]\s*[([]?([A-Da-d])[.)>\]]?/i);
        if (ansMatch) {
          correctIndex = ansMatch[1].toUpperCase().charCodeAt(0) - 65;
        }
        li++;
      }

      // ── Build result ─────────────────────────────────────────────────────
      // Fill sparse option array gaps (if options were stored by index)
      const filledOptions = [
        options[0] || '',
        options[1] || '',
        options[2] || '',
        options[3] || ''
      ];
      const nonEmpty = filledOptions.filter(o => o.trim());

      if (questionText && nonEmpty.length >= 2) {
        extracted.push({
          mcqType: 'theoretical',
          question: questionText,
          codeSnippet: '',
          options: filledOptions,
          correctIndex: correctIndex >= 0 ? Math.min(correctIndex, 3) : 0
        });
      }
    });

    return extracted;
  };

  // ─── JSON MCQ Parser ──────────────────────────────────────────────────────
  // Supports multiple common JSON formats:
  //  1. Array of questions: [{ question: "...", options: [...], answer: "A" | 0 }]
  //  2. Object with questions/mcqs/data key: { title: "...", questions: [...] }
  //  3. Keyed dictionary of questions: { "1": { question: "...", options: [...] } }
  //  4. Options as array of strings, array of {text, isCorrect} objects, or {A: "...", B: "..."} map
  const parseMcqsFromJson = (jsonString) => {
    let parsed;
    try {
      parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
    } catch (err) {
      throw new Error('Invalid JSON syntax: ' + err.message);
    }

    let rawList = [];
    let metadata = {};

    if (Array.isArray(parsed)) {
      rawList = parsed;
    } else if (parsed && typeof parsed === 'object') {
      metadata = parsed;
      if (Array.isArray(parsed.questions)) rawList = parsed.questions;
      else if (Array.isArray(parsed.mcqs)) rawList = parsed.mcqs;
      else if (Array.isArray(parsed.items)) rawList = parsed.items;
      else if (Array.isArray(parsed.data)) rawList = parsed.data;
      else {
        const values = Object.values(parsed);
        if (values.length > 0 && typeof values[0] === 'object' && (values[0].question || values[0].q || values[0].options)) {
          rawList = values;
        }
      }
    }

    if (!rawList || rawList.length === 0) {
      throw new Error('No questions found in JSON. Expected an array of question objects, or an object with a "questions" or "mcqs" array.');
    }

    const mcqs = [];

    rawList.forEach((item) => {
      if (!item || typeof item !== 'object') return;
      const questionText = item.question || item.q || item.prompt || item.title || item.questionText || '';
      if (!questionText && !item.codeSnippet && !item.code) return;

      const codeSnippet = item.codeSnippet || item.code || item.snippet || '';
      const mcqType = item.mcqType || (codeSnippet || item.type === 'coding' ? 'coding' : 'theoretical');

      let options = [];
      let detectedCorrectIndex = -1;

      if (Array.isArray(item.options)) {
        item.options.forEach((opt, oIdx) => {
          if (typeof opt === 'string' || typeof opt === 'number') {
            options.push(String(opt).trim());
          } else if (opt && typeof opt === 'object') {
            const optText = opt.text || opt.label || opt.value || opt.option || '';
            options.push(String(optText).trim());
            if (opt.isCorrect || opt.correct || opt.is_correct) {
              detectedCorrectIndex = oIdx;
            }
          }
        });
      } else if (item.options && typeof item.options === 'object') {
        const keys = ['A', 'B', 'C', 'D'];
        const hasLetterKeys = keys.every((k) => k in item.options);
        if (hasLetterKeys) {
          keys.forEach((k) => options.push(String(item.options[k] || '').trim()));
        } else {
          Object.keys(item.options).forEach((k) => options.push(String(item.options[k] || '').trim()));
        }
      } else if (item.choices && Array.isArray(item.choices)) {
        item.choices.forEach((c) => options.push(String(c).trim()));
      }

      while (options.length < 4) options.push('');
      options = options.slice(0, 4);

      let ansVal = item.correctIndex !== undefined ? item.correctIndex :
                   item.answer !== undefined ? item.answer :
                   item.correctAnswer !== undefined ? item.correctAnswer :
                   item.correct !== undefined ? item.correct :
                   item.ans !== undefined ? item.ans :
                   item.correct_index !== undefined ? item.correct_index :
                   item.correct_answer;

      if (detectedCorrectIndex >= 0) {
        // Already found from option object
      } else if (typeof ansVal === 'number') {
        detectedCorrectIndex = ansVal >= 0 && ansVal <= 3 ? ansVal : 0;
      } else if (typeof ansVal === 'string') {
        const trimmed = ansVal.trim().toUpperCase();
        if (['A', 'B', 'C', 'D'].includes(trimmed)) {
          detectedCorrectIndex = trimmed.charCodeAt(0) - 65;
        } else if (/^[0-3]$/.test(trimmed)) {
          detectedCorrectIndex = parseInt(trimmed, 10);
        } else {
          const optMatch = options.findIndex((o) => o.toLowerCase() === ansVal.toLowerCase().trim());
          if (optMatch >= 0) detectedCorrectIndex = optMatch;
          else detectedCorrectIndex = 0;
        }
      } else {
        detectedCorrectIndex = 0;
      }

      mcqs.push({
        mcqType,
        question: String(questionText).trim(),
        codeSnippet: String(codeSnippet || ''),
        options,
        correctIndex: Math.min(Math.max(0, detectedCorrectIndex), 3)
      });
    });

    return { mcqs, metadata };
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    const fileName = file.name || '';
    const isPdf = file.type === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');
    const isJson = file.type === 'application/json' || fileName.toLowerCase().endsWith('.json');

    if (!isPdf && !isJson) {
      setPdfError('Please upload a valid PDF (.pdf) or JSON (.json) file.');
      return;
    }

    setPdfParsing(true);
    setPdfError('');
    setPdfFileName(fileName);
    setPdfExtractedCount(0);

    try {
      let parsedMcqs = [];
      let importedMetadata = null;

      if (isJson) {
        const text = await file.text();
        const result = parseMcqsFromJson(text);
        parsedMcqs = result.mcqs;
        importedMetadata = result.metadata;
      } else {
        // PDF handling via pdfjs-dist
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString();

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = '';
        for (let p = 1; p <= pdf.numPages; p++) {
          const page = await pdf.getPage(p);
          const content = await page.getTextContent();

          const lineMap = {};
          content.items.forEach((item) => {
            if (!item.str) return;
            const yBucket = Math.round(item.transform[5] / 3) * 3;
            if (!lineMap[yBucket]) lineMap[yBucket] = [];
            lineMap[yBucket].push({ x: item.transform[4], str: item.str });
          });

          const sortedYs = Object.keys(lineMap).map(Number).sort((a, b) => b - a);
          const pageLines = sortedYs.map((y) =>
            lineMap[y]
              .sort((a, b) => a.x - b.x)
              .map((i) => i.str)
              .join(' ')
              .trim()
          ).filter(Boolean);

          fullText += pageLines.join('\n') + '\n\n';
        }

        console.log('[PDF Import] Extracted text (first 2000 chars):\n', fullText.slice(0, 2000));
        parsedMcqs = parseMcqsFromText(fullText);
      }

      if (!parsedMcqs || parsedMcqs.length === 0) {
        setPdfError(
          isJson
            ? 'No valid questions found in the JSON file. Ensure it contains questions with options and an answer.'
            : 'No MCQ questions detected. Make sure the PDF uses numbered questions (1. Question → A/B/C/D options).'
        );
        setPdfParsing(false);
        return;
      }

      setFormData((prev) => {
        const existingReal = prev.mcqs.filter(
          (m) => m.question.trim() !== '' || m.options.some((o) => o.trim() !== '')
        );
        const nextState = {
          ...prev,
          mcqs: existingReal.length > 0 ? [...existingReal, ...parsedMcqs] : parsedMcqs
        };

        // Auto-fill header fields from JSON metadata if present and not already customized
        if (importedMetadata) {
          if (importedMetadata.title && !prev.title) nextState.title = importedMetadata.title;
          if (importedMetadata.durationMinutes && !prev.durationMinutes) nextState.durationMinutes = importedMetadata.durationMinutes;
          if (importedMetadata.totalMarks && !prev.totalMarks) nextState.totalMarks = importedMetadata.totalMarks;
          if (importedMetadata.dueDate && !prev.dueDate) nextState.dueDate = importedMetadata.dueDate;
        }

        return nextState;
      });

      setPdfExtractedCount(parsedMcqs.length);
      addToast(`✅ Extracted ${parsedMcqs.length} questions from "${fileName}"`, 'success');
    } catch (err) {
      console.error('[Import Error]', err);
      setPdfError(err.message || 'Failed to read file. Make sure it has a valid format.');
    } finally {
      setPdfParsing(false);
    }
  };

  const handlePdfUpload = handleFileUpload;

  const handlePastedContentImport = () => {
    if (!pastedText.trim()) {
      setPdfError('Please paste your JSON questions into the box first.');
      return;
    }

    setPdfParsing(true);
    setPdfError('');

    try {
      const trimmed = pastedText.trim();
      let parsedMcqs = [];
      let importedMetadata = null;

      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        const result = parseMcqsFromJson(trimmed);
        parsedMcqs = result.mcqs;
        importedMetadata = result.metadata;
      } else {
        parsedMcqs = parseMcqsFromText(trimmed);
      }

      if (!parsedMcqs || parsedMcqs.length === 0) {
        setPdfError('No questions found. Ensure your JSON has an array of questions with options and an answer.');
        setPdfParsing(false);
        return;
      }

      setFormData((prev) => {
        const existingReal = prev.mcqs.filter(
          (m) => m.question.trim() !== '' || m.options.some((o) => o.trim() !== '')
        );
        const nextState = {
          ...prev,
          mcqs: existingReal.length > 0 ? [...existingReal, ...parsedMcqs] : parsedMcqs
        };

        if (importedMetadata) {
          if (importedMetadata.title && !prev.title) nextState.title = importedMetadata.title;
          if (importedMetadata.durationMinutes && !prev.durationMinutes) nextState.durationMinutes = importedMetadata.durationMinutes;
          if (importedMetadata.totalMarks && !prev.totalMarks) nextState.totalMarks = importedMetadata.totalMarks;
          if (importedMetadata.dueDate && !prev.dueDate) nextState.dueDate = importedMetadata.dueDate;
        }

        return nextState;
      });

      setPdfExtractedCount(parsedMcqs.length);
      setPdfFileName('Pasted JSON / Text');
      addToast(`✅ Successfully imported ${parsedMcqs.length} questions from pasted content!`, 'success');
      setPastedText('');
    } catch (err) {
      console.error('[Paste Import Error]', err);
      // Fallback attempt: try parsing as raw numbered text if JSON failed
      try {
        const fallback = parseMcqsFromText(pastedText.trim());
        if (fallback && fallback.length > 0) {
          setFormData((prev) => {
            const existingReal = prev.mcqs.filter((m) => m.question.trim() !== '' || m.options.some((o) => o.trim() !== ''));
            return { ...prev, mcqs: existingReal.length > 0 ? [...existingReal, ...fallback] : fallback };
          });
          setPdfExtractedCount(fallback.length);
          setPdfFileName('Pasted Questions');
          addToast(`✅ Successfully imported ${fallback.length} questions!`, 'success');
          setPastedText('');
          return;
        }
      } catch (e2) {}
      setPdfError(err.message || 'Failed to parse JSON. Please check the JSON format.');
    } finally {
      setPdfParsing(false);
    }
  };

  const handleLoadSampleJson = () => {
    const sample = [
      {
        question: "What is the primary purpose of version control?",
        options: [
          "To track and manage changes to files over time",
          "To increase computer storage",
          "To replace programming languages",
          "To automatically deploy applications"
        ],
        answer: "A"
      },
      {
        question: "Which problem can version control help solve when multiple developers work on the same project?",
        options: [
          "Tracking changes made by different developers",
          "Increasing monitor resolution",
          "Creating database tables automatically",
          "Installing operating systems"
        ],
        answer: "A"
      },
      {
        question: "Git is best described as a:",
        options: [
          "Distributed version control system",
          "Cloud hosting platform only",
          "Code editor",
          "Web browser"
        ],
        answer: "A"
      }
    ];
    setPastedText(JSON.stringify(sample, null, 2));
    setPdfError('');
  };

  const selectedCourseObj = courses.find((c) => c.id === formData.courseId) || courses[0];
  const stagesList =
    formData.courseId && formData.courseId !== 'ALL' && milestonesByBatch?.[formData.courseId]?.stages && milestonesByBatch[formData.courseId].stages.length > 0
      ? milestonesByBatch[formData.courseId].stages
      : selectedCourseObj?.topics && selectedCourseObj.topics.length > 0
      ? selectedCourseObj.topics
      : milestones?.stages && milestones.stages.length > 0
      ? milestones.stages
      : DEFAULT_STAGES;

  const handleOpenAddModal = () => {
    const firstStage = stagesList[0];
    const stageSubs = getSubtopicsForStage(firstStage);
    const firstSub = stageSubs[0];
    const subLessons = getInnerModulesForSubtopic(firstSub, courseLessons, firstStage?.id);
    const firstMod = subLessons[0];

    setBatchActiveTab('Weekdays');
    setSelectedWeekdayBatches(allWeekdayBatchesList);
    setSelectedWeekendBatches(allWeekendBatchesList);
    setFormData({
      title: '',
      evalType: activeMainTab === 'QUIZZES' ? 'quiz' : 'assessment',
      courseId: courses[0]?.id || '',
      courseName: courses[0]?.title || '',
      stageId: firstStage?.id || '',
      stageName: firstStage?.title || '',
      subtopicId: firstSub?.id || '',
      subtopicName: firstSub?.title || '',
      innerTopicId: firstMod?.id || '',
      topicName: firstMod?.title || '',
      durationMinutes: 45,
      totalMarks: 100,
      dueDate: '2026-08-30',
      mcqs: [
        {
          mcqType: 'theoretical',
          question: '',
          codeSnippet: '',
          options: ['', '', '', ''],
          correctIndex: 0
        }
      ],
      codingQuestions: [
        {
          title: '',
          problemStatement: ''
        }
      ]
    });
    setEditingAssessment(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (asm) => {
    setEditingAssessment(asm);
    setBatchActiveTab('Weekdays');

    let initialWd = [];
    let initialWe = [];
    if (Array.isArray(asm.targetBatches) && asm.targetBatches.length > 0) {
      initialWd = asm.targetBatches.filter(
        (b) => b.startsWith('A26W') && !b.startsWith('A26S') && !b.startsWith('A26WE')
      );
      initialWe = asm.targetBatches.filter((b) => b.startsWith('A26S') || b.startsWith('A26WE'));
    } else if (typeof asm.targetBatch === 'string' && asm.targetBatch && asm.targetBatch !== 'All Batches') {
      const parsed = asm.targetBatch.split(',').map((s) => s.trim());
      initialWd = parsed.filter(
        (b) => b.startsWith('A26W') && !b.startsWith('A26S') && !b.startsWith('A26WE')
      );
      initialWe = parsed.filter((b) => b.startsWith('A26S') || b.startsWith('A26WE'));
    }
    if (initialWd.length === 0 && initialWe.length === 0) {
      initialWd = allWeekdayBatchesList;
      initialWe = allWeekendBatchesList;
    }
    setSelectedWeekdayBatches(initialWd);
    setSelectedWeekendBatches(initialWe);

    const initialMcqs = asm.mcqs && asm.mcqs.length > 0
      ? asm.mcqs.map((m) => ({
          mcqType: m.mcqType || (m.codeSnippet ? 'coding' : 'theoretical'),
          question: m.question || '',
          codeSnippet: m.codeSnippet || '',
          options: Array.isArray(m.options) ? [...m.options] : ['Option A', 'Option B', 'Option C', 'Option D'],
          correctIndex: m.correctIndex !== undefined ? m.correctIndex : 0
        }))
      : [
          {
            mcqType: 'theoretical',
            question: '',
            codeSnippet: '',
            options: ['', '', '', ''],
            correctIndex: 0
          }
        ];

    const initialCoding = Array.isArray(asm.codingQuestions) && asm.codingQuestions.length > 0
      ? asm.codingQuestions.map((c) => ({
          title: c.title || '',
          problemStatement: c.problemStatement || c.instructions || ''
        }))
      : [
          {
            title: '',
            problemStatement: ''
          }
        ];

    const targetStage = stagesList.find((s) => s.id === asm.stageId || s.title === asm.stageName || s.title === asm.moduleName) || stagesList[0];
    const stageSubs = getSubtopicsForStage(targetStage);
    const targetSub = stageSubs.find((st) => st.id === asm.subtopicId || st.title === asm.subtopicName) || stageSubs[0];
    const subLessons = getInnerModulesForSubtopic(targetSub, courseLessons, targetStage?.id);
    const targetMod = subLessons.find((m) => (m.id || m.title) === (asm.innerTopicId || asm.moduleId || asm.topicName)) || subLessons[0];

    const detectedEvalType = asm.evalType || (asm.category?.toLowerCase().includes('quiz') || asm.title?.toLowerCase().includes('quiz') ? 'quiz' : 'assessment');

    setFormData({
      title: asm.title,
      evalType: detectedEvalType,
      courseId: asm.courseId || courses[0]?.id || '',
      courseName: asm.courseName || courses.find((c) => c.id === asm.courseId)?.title || '',
      stageId: targetStage?.id || '',
      stageName: targetStage?.title || '',
      subtopicId: targetSub?.id || '',
      subtopicName: targetSub?.title || '',
      innerTopicId: targetMod?.id || '',
      topicName: targetMod?.title || '',
      durationMinutes: asm.durationMinutes || 45,
      totalMarks: asm.totalMarks || 100,
      dueDate: asm.dueDate || '2026-08-30',
      mcqs: initialMcqs,
      codingQuestions: initialCoding
    });
  };

  // MCQ Question Array Handlers
  const handleAddMcq = (type = 'theoretical') => {
    setFormData((prev) => ({
      ...prev,
      mcqs: [
        ...prev.mcqs,
        {
          mcqType: typeof type === 'string' ? type : 'theoretical',
          question: '',
          codeSnippet: '',
          options: ['', '', '', ''],
          correctIndex: 0
        }
      ]
    }));
  };

  const handleRemoveMcq = (index) => {
    setFormData((prev) => ({
      ...prev,
      mcqs: prev.mcqs.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateMcqType = (mcqIndex, value) => {
    setFormData((prev) => {
      const updated = [...prev.mcqs];
      updated[mcqIndex] = { ...updated[mcqIndex], mcqType: value };
      return { ...prev, mcqs: updated };
    });
  };

  const handleUpdateMcqCodeSnippet = (mcqIndex, value) => {
    setFormData((prev) => {
      const updated = [...prev.mcqs];
      updated[mcqIndex] = { ...updated[mcqIndex], codeSnippet: value };
      return { ...prev, mcqs: updated };
    });
  };

  const handleUpdateMcqQuestion = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.mcqs];
      updated[index] = { ...updated[index], question: value };
      return { ...prev, mcqs: updated };
    });
  };

  const handleUpdateMcqOption = (mcqIndex, optIndex, value) => {
    setFormData((prev) => {
      const updatedMcqs = [...prev.mcqs];
      const updatedOptions = [...updatedMcqs[mcqIndex].options];
      updatedOptions[optIndex] = value;
      updatedMcqs[mcqIndex] = { ...updatedMcqs[mcqIndex], options: updatedOptions };
      return { ...prev, mcqs: updatedMcqs };
    });
  };

  const handleUpdateMcqCorrectIndex = (mcqIndex, value) => {
    setFormData((prev) => {
      const updated = [...prev.mcqs];
      updated[mcqIndex] = { ...updated[mcqIndex], correctIndex: parseInt(value) || 0 };
      return { ...prev, mcqs: updated };
    });
  };

  // Coding Question Array Handlers
  const handleAddCoding = () => {
    setFormData((prev) => ({
      ...prev,
      codingQuestions: [
        ...(prev.codingQuestions || []),
        { title: '', description: '' }
      ]
    }));
  };

  const handleRemoveCoding = (index) => {
    setFormData((prev) => ({
      ...prev,
      codingQuestions: (prev.codingQuestions || []).filter((_, i) => i !== index)
    }));
  };

  const handleUpdateCodingTitle = (index, value) => {
    setFormData((prev) => {
      const updated = [...(prev.codingQuestions || [])];
      updated[index] = { ...updated[index], title: value };
      return { ...prev, codingQuestions: updated };
    });
  };

  const handleUpdateCodingDesc = (index, value) => {
    setFormData((prev) => {
      const updated = [...(prev.codingQuestions || [])];
      updated[index] = { ...updated[index], description: value, problemStatement: value };
      return { ...prev, codingQuestions: updated };
    });
  };

  // Save / Update Assessment
  const handleSaveAssessment = (e) => {
    e.preventDefault();
    if (!formData.title) {
      addToast('Please enter assessment title', 'error');
      return;
    }

    const selectedCourse = courses.find((c) => c.id === formData.courseId) || courses[0];
    const currentStageObj = stagesList.find((s) => s.id === formData.stageId || s.title === formData.stageName) || stagesList[0];
    const stageSubs = getSubtopicsForStage(currentStageObj);
    const currentSubObj = stageSubs.find((st) => st.id === formData.subtopicId || st.title === formData.subtopicName) || stageSubs[0];
    const subLessons = getInnerModulesForSubtopic(currentSubObj, courseLessons, currentStageObj?.id);
    const currentModObj = subLessons.find((m) => (m.id || m.title) === (formData.innerTopicId || formData.moduleId || formData.topicName)) || subLessons[0];

    const isQuizEval = (formData.evalType || 'assessment') === 'quiz';
    const totalMcqsCount = formData.mcqs.length;
    const totalCodingCount = isQuizEval ? 0 : (formData.codingQuestions?.length || 0);
    const totalQuestionsCount = totalMcqsCount + totalCodingCount;

    const allBatches = [...selectedWeekdayBatches, ...selectedWeekendBatches];
    const targetBatchStr = allBatches.length > 0 ? allBatches.join(', ') : 'All Batches';

    const assessmentPayload = {
      title: formData.title,
      evalType: formData.evalType || 'assessment',
      courseId: selectedCourse?.id || formData.courseId,
      courseName: selectedCourse?.title || formData.courseName,
      stageId: currentStageObj?.id || formData.stageId,
      stageName: currentStageObj?.title || formData.stageName,
      moduleName: currentStageObj?.title || formData.stageName,
      subtopicId: currentSubObj?.id || formData.subtopicId,
      subtopicName: currentSubObj?.title || formData.subtopicName,
      innerTopicId: currentModObj?.id || formData.innerTopicId || formData.moduleId,
      moduleId: currentModObj?.id || formData.innerTopicId || formData.moduleId,
      topicName: currentModObj?.title || formData.topicName,
      durationMinutes: parseInt(formData.durationMinutes) || 45,
      totalMarks: parseInt(formData.totalMarks) || 100,
      dueDate: formData.dueDate || '2026-08-30',
      mcqCount: totalMcqsCount,
      totalQuestions: totalQuestionsCount,
      mcqs: formData.mcqs,
      codingQuestions: isQuizEval ? [] : formData.codingQuestions,
      targetBatches: allBatches,
      targetBatch: targetBatchStr
    };

    const isQuizTarget = isQuizEval || activeMainTab === 'QUIZZES';

    if (editingAssessment) {
      if (isQuizTarget) {
        updateQuiz(editingAssessment.id, { ...assessmentPayload, evalType: 'quiz' });
        addToast(`Updated quiz "${formData.title}" (${totalQuestionsCount} MCQs)`, 'success');
      } else {
        updateAssessment(editingAssessment.id, assessmentPayload);
        addToast(`Updated assessment "${formData.title}" (${totalQuestionsCount} MCQs)`, 'success');
      }
      setEditingAssessment(null);
    } else {
      if (isQuizTarget) {
        addQuiz({ ...assessmentPayload, evalType: 'quiz' });
        addToast(`Published quiz "${formData.title}" (${totalQuestionsCount} MCQs) to quizzes table!`, 'success');
      } else {
        addAssessment(assessmentPayload);
        addToast(`Published assessment "${formData.title}" (${totalQuestionsCount} MCQs) & linked to Milestone!`, 'success');
      }
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingAssessment) {
      const isQuizItem = deletingAssessment.evalType === 'quiz' || activeMainTab === 'QUIZZES';
      if (isQuizItem) {
        deleteQuiz(deletingAssessment.id);
        addToast(`Deleted quiz "${deletingAssessment.title}"`, 'info');
      } else {
        deleteAssessment(deletingAssessment.id);
        addToast(`Deleted assessment "${deletingAssessment.title}"`, 'info');
      }
      setDeletingAssessment(null);
    }
  };

  const currentTabItems = activeMainTab === 'QUIZZES' ? (quizzes || []) : (assessments || []);

  const filteredAssessments = [...currentTabItems]
    .filter((a) => {
      const aCourseId = a.courseId || a.course_id;
      const aStageId = a.stageId || a.stage_id;
      const aSubtopicId = a.subtopicId || a.subtopic_id;
      const aModuleId = a.innerTopicId || a.inner_topic_id || a.moduleId || a.module_id;

      const matchesCourse = !activeCourseId || !aCourseId || aCourseId === 'ALL' || aCourseId === activeCourseId;
      const matchesStage = selectedStageId === 'ALL' || isMatchingStage(aStageId, selectedStageId);

      const cleanId = (id) => String(id || '').replace(/-(w|s)$/i, '').trim().toLowerCase();
      const cleanStr = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();

      const matchesSubtopic =
        selectedSubtopicId === 'ALL' ||
        cleanId(aSubtopicId) === cleanId(selectedSubtopicId) ||
        SUBTOPIC_MODULE_MAP[cleanId(aSubtopicId)] === cleanId(selectedSubtopicId) ||
        SUBTOPIC_MODULE_MAP[cleanId(selectedSubtopicId)] === cleanId(aSubtopicId) ||
        (selectedSubtopicObj && cleanStr(a.subtopicName) === cleanStr(selectedSubtopicObj.title));

      const selectedModObj = selectedModuleId !== 'ALL' ? modulesForSubtopic.find(m => m.id === selectedModuleId) : null;
      const matchesModule =
        selectedModuleId === 'ALL' ||
        cleanId(aModuleId) === cleanId(selectedModuleId) ||
        (selectedModObj && (cleanStr(a.moduleName) === cleanStr(selectedModObj.title) || cleanStr(a.topicName) === cleanStr(selectedModObj.title)));

      const matchesSearch =
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.subtopicName?.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesStatus = true;
      if (activeStatusFilter === 'PUBLISHED') {
        matchesStatus = a.status === 'Published' || !a.status || a.status === 'Completed';
      } else if (activeStatusFilter === 'DRAFT') {
        matchesStatus = a.status === 'Draft' || a.status === 'Pending';
      }

      return matchesSearch && matchesCourse && matchesStage && matchesSubtopic && matchesModule && matchesStatus;
    })
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (a.created_at ? new Date(a.created_at).getTime() : 0);
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (b.created_at ? new Date(b.created_at).getTime() : 0);
      if (timeA && timeB) return timeA - timeB;
      return 0;
    });

  // Calculate Aggregate Metrics
  const totalQuestionsAllAssessments = assessments.reduce(
    (acc, a) => acc + (a.mcqs?.length || a.mcqCount || a.totalQuestions || 0),
    0
  );

  const currentModalTheoryCount = (formData.mcqs || []).filter(m => m.mcqType !== 'coding').length;
  const currentModalCodingMcqCount = (formData.mcqs || []).filter(m => m.mcqType === 'coding').length;
  const currentModalTotalQuestions = (formData.mcqs || []).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-normal text-slate-900 flex items-center gap-2.5">
            <FileCheck2 className="w-6 h-6 text-purple-600" /> Practice Hub & Evaluations
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Topic-based practice assessments, tests, and module quizzes for enrolled students.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAddModal}>
            {activeMainTab === 'QUIZZES' ? 'Create Weekly Assessment' : 'Create Daily Assessment'}
          </Button>
        </div>
      </div>

      {/* Curriculum Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Course Track */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-600" /> Course Track
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
                className="w-full px-3.5 py-2.5 pr-8 rounded-xl text-xs font-bold text-slate-800 bg-slate-50/80 border border-slate-200 hover:border-purple-300 focus:outline-none focus:border-purple-600 focus:bg-white transition-all shadow-2xs cursor-pointer appearance-none truncate"
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

          {/* Milestone Stage */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" /> Milestone Stage
            </label>
            <div className="relative">
              <select
                value={selectedStageId}
                onChange={(e) => {
                  setSelectedStageId(e.target.value);
                  setSelectedSubtopicId('ALL');
                  setSelectedModuleId('ALL');
                }}
                className="w-full px-3.5 py-2.5 pr-8 rounded-xl text-xs font-bold text-slate-800 bg-slate-50/80 border border-slate-200 hover:border-blue-300 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-2xs cursor-pointer appearance-none truncate"
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

          {/* Milestone Module */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-emerald-600" /> Milestone Module
            </label>
            <div className="relative">
              <select
                value={selectedSubtopicId}
                onChange={(e) => {
                  setSelectedSubtopicId(e.target.value);
                  setSelectedModuleId('ALL');
                }}
                disabled={selectedStageId === 'ALL'}
                className="w-full px-3.5 py-2.5 pr-8 rounded-xl text-xs font-bold text-slate-800 bg-slate-50/80 border border-slate-200 hover:border-emerald-300 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs cursor-pointer appearance-none truncate disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Specific Module */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Specific Module
            </label>
            <div className="relative">
              <select
                value={selectedModuleId}
                onChange={(e) => setSelectedModuleId(e.target.value)}
                disabled={selectedSubtopicId === 'ALL'}
                className="w-full px-3.5 py-2.5 pr-8 rounded-xl text-xs font-bold text-slate-800 bg-slate-50/80 border border-slate-200 hover:border-purple-300 focus:outline-none focus:border-purple-600 focus:bg-white transition-all shadow-2xs cursor-pointer appearance-none truncate disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>

      {/* Primary Category Switcher & Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Switcher Tabs */}
        <div className="bg-slate-100/90 p-1.5 rounded-xl inline-flex items-center gap-1.5 shadow-2xs flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveMainTab('ASSESSMENTS');
              setActiveStatusFilter('ALL');
            }}
            className={`px-6 py-2.5 rounded-xl text-xs md:text-sm transition-all cursor-pointer ${
              activeMainTab === 'ASSESSMENTS'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25 font-extrabold'
                : 'text-slate-600 hover:text-purple-700 hover:bg-white/60 font-bold'
            }`}
          >
            Daily Assessments
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveMainTab('QUIZZES');
              setActiveStatusFilter('ALL');
            }}
            className={`px-6 py-2.5 rounded-xl text-xs md:text-sm transition-all cursor-pointer ${
              activeMainTab === 'QUIZZES'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25 font-extrabold'
                : 'text-slate-600 hover:text-purple-700 hover:bg-white/60 font-bold'
            }`}
          >
            Weekly Assessments
          </button>
        </div>

        {/* Integrated Search Input */}
        <div className="relative w-full sm:w-72 md:w-80 flex-shrink-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeMainTab === 'QUIZZES' ? 'weekly assessments' : 'daily assessments'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100 transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Assessment / Quiz Cards */}
      {filteredAssessments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAssessments.map((asm) => {
            const mcqCount = asm.mcqs?.length || asm.mcqCount || 0;
            const codingCount = asm.codingQuestions?.length || asm.codingCount || 0;
            const totalQ = asm.totalQuestions || mcqCount + codingCount;
            const isQuizItem = asm.evalType === 'quiz' || asm.category?.toLowerCase().includes('quiz') || asm.title?.toLowerCase().includes('quiz');
            const typeBadgeLabel = isQuizItem ? 'MODULE QUIZ' : codingCount > 0 ? 'CODING ASSESSMENT' : 'MCQ ASSESSMENT';
            const lockStatus = getItemLockStatus ? getItemLockStatus(asm.id, activeBatchFilter) : null;

            return (
              <div
                key={asm.id}
                className="group bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-300 transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col justify-between h-full"
              >
                <div className="space-y-4">
                  {/* Card Header: Badges on Left, Action Icons on Right */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      {/* Lock Badge */}
                      {lockStatus?.isLocked && (
                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 font-bold px-2.5 py-1 rounded-xl border border-rose-200/60 text-[10px]">
                          <Lock className="w-3 h-3 text-rose-600 flex-shrink-0" />
                          <span>{lockStatus.label}</span>
                        </span>
                      )}

                      {/* Type Badge */}
                      <span className="bg-purple-100/90 text-purple-700 font-extrabold text-[11px] px-3 py-1 rounded-xl tracking-wide uppercase border border-purple-200/60 flex-shrink-0">
                        {typeBadgeLabel}
                      </span>

                      {/* Topic Tag */}
                      {(asm.subtopicName || asm.topicName || asm.moduleName) && (
                        <span className="bg-slate-100 text-slate-700 font-bold text-[11px] px-3 py-1 rounded-xl border border-slate-200/70 truncate max-w-[200px]">
                          {asm.subtopicName || asm.topicName || asm.moduleName}
                        </span>
                      )}

                      {/* Course Tag */}
                      {asm.courseName && (
                        <span className="bg-blue-50 text-blue-700 font-bold text-[11px] px-2.5 py-1 rounded-xl border border-blue-200/60 truncate max-w-[180px]">
                          {asm.courseName}
                        </span>
                      )}
                    </div>

                    {/* Edit & Delete Action Buttons */}
                    <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/60 flex-shrink-0">
                      <button
                        onClick={() => handleOpenEditModal(asm)}
                        className="p-1.5 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                        title="Edit Evaluation"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingAssessment(asm)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                        title="Delete Evaluation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5 pt-1">
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-purple-600 transition-colors leading-snug">
                      {asm.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                      Test your understanding of {asm.subtopicName || asm.topicName || asm.title} concepts.
                    </p>
                  </div>

                  {/* Clean Horizontal Metric Strip */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="bg-slate-100/90 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-200/60 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-600" /> {asm.durationMinutes || 45} mins
                    </span>

                    <span className="bg-amber-50 text-amber-700 font-extrabold text-xs px-3 py-1.5 rounded-xl border border-amber-200/80 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" /> +{asm.totalMarks || 100} XP
                    </span>

                    <span className="bg-purple-50 text-purple-700 font-bold text-xs px-3 py-1.5 rounded-xl border border-purple-100 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-purple-600" /> {mcqCount} MCQ{mcqCount !== 1 ? 's' : ''}
                      {!isQuizItem && codingCount > 0 && ` • ${codingCount} Coding`}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  {(() => {
                    const statusVal = asm.status || asm.publishStatus || '';
                    const isPublished = statusVal === 'Published' || statusVal === 'Active' || statusVal === 'Live Published';
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold border text-[11px] ${
                        isPublished
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                          : statusVal === 'Draft' || statusVal === 'Pending'
                          ? 'bg-slate-100 text-slate-600 border-slate-200/70'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {statusVal || 'Published'}
                      </span>
                    );
                  })()}

                  <button
                    onClick={() => handleOpenEditModal(asm)}
                    className="inline-flex items-center gap-1 font-extrabold text-purple-600 hover:text-purple-800 transition-all group-hover:translate-x-1 cursor-pointer"
                  >
                    <span>View {isQuizItem ? 'Quiz' : 'Assessment'} Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title={activeMainTab === 'QUIZZES' ? 'No Weekly Assessments Found' : 'No Daily Assessments Found'}
          description={activeMainTab === 'QUIZZES' ? 'Create your first weekly assessment.' : 'Create your first daily assessment.'}
          actionLabel={activeMainTab === 'QUIZZES' ? 'Add Weekly Assessment' : 'Add Daily Assessment'}
          onAction={handleOpenAddModal}
        />
      )}

      {/* Add / Edit Assessment Modal with Dynamic Question Builder */}
      <Modal
        isOpen={isAddModalOpen || !!editingAssessment}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingAssessment(null);
          // Reset PDF import state
          setPdfFileName('');
          setPdfExtractedCount(0);
          setPdfError('');
          setPdfParsing(false);
          setPastedText('');
        }}
        title={
          editingAssessment
            ? `Edit ${editingAssessment.evalType === 'quiz' ? 'Quiz' : 'Assessment'} & Questions`
            : `Create ${activeMainTab === 'QUIZZES' ? 'Quiz' : 'Assessment'}`
        }
        subtitle="Configure parameters, MCQ questions, and coding task prompts"
        maxWidth="max-w-6xl"
      >
        <form onSubmit={handleSaveAssessment} className="space-y-4">
          {/* Title, Type & Assessment Capacity Header Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 items-end">
            <div className="md:col-span-2">
              <Input
                label="Evaluation Title"
                placeholder="e.g. Git Architecture & Version Control Assessment"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Select
                label="Evaluation Type"
                value={formData.evalType || 'assessment'}
                onChange={(e) => setFormData({ ...formData, evalType: e.target.value })}
                options={[
                  { value: 'assessment', label: 'Practice Assessment' },
                  { value: 'quiz', label: 'Module Quiz' }
                ]}
              />
            </div>

            {/* Total Questions Header Banner */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-2.5 sm:p-3 rounded-2xl text-white flex items-center justify-between shadow-md mb-0.5">
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-blue-300 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block">Capacity</span>
                  <span className="text-xs font-black text-white">
                    Total Questions: <strong className="text-amber-300">{currentModalTotalQuestions}</strong>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="px-2.5 py-0.5 rounded-lg bg-white/10 text-blue-100 font-semibold border border-white/15">
                  {currentModalTheoryCount} Theory MCQs
                </span>
                {currentModalCodingMcqCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-200 font-semibold border border-emerald-500/30">
                    {currentModalCodingMcqCount} Coding MCQs
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 4-TIER CASCADING HIERARCHY SELECTOR (2x2 Grid) */}
          {(() => {
            const currentStageObj = stagesList.find((s) => s.id === formData.stageId || s.title === formData.stageName) || stagesList[0];
            const currentSubtopicsArr = getSubtopicsForStage(currentStageObj);
            const currentSubtopicObj = currentSubtopicsArr.find((st) => st.id === formData.subtopicId || st.title === formData.subtopicName) || currentSubtopicsArr[0];
            const currentInnerModules = getInnerModulesForSubtopic(currentSubtopicObj, courseLessons, currentStageObj?.id);
            const currentModObj = currentInnerModules.find((m) => (m.id || m.title) === (formData.innerTopicId || formData.moduleId || formData.topicName)) || currentInnerModules[0];
            const existingItems = currentModObj?.items || [];

            const handleAutoFillFromMilestone = () => {
              const subTitleClean = currentSubtopicObj?.title ? currentSubtopicObj.title.replace(/^Module\s+\d+:\s*/i, '') : '';
              const modTitle = currentModObj?.title || '';
              const combinedTitle = subTitleClean && modTitle && !modTitle.toLowerCase().includes(subTitleClean.toLowerCase())
                ? `${subTitleClean}: ${modTitle} Evaluation`
                : (modTitle ? `${modTitle} Evaluation` : (subTitleClean ? `${subTitleClean} Assessment` : 'Interactive Module Evaluation'));

              setFormData((prev) => ({
                ...prev,
                title: combinedTitle,
                stageId: currentStageObj?.id || prev.stageId,
                stageName: currentStageObj?.title || prev.stageName,
                subtopicId: currentSubtopicObj?.id || prev.subtopicId,
                subtopicName: currentSubtopicObj?.title || prev.subtopicName,
                innerTopicId: currentModObj?.id || prev.innerTopicId,
                topicName: currentModObj?.title || prev.topicName
              }));
              addToast(`Auto-filled: "${combinedTitle}"`, 'info');
            };

            return (
              <div className="bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/40 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-blue-100/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        Curriculum Location & Milestone Topic Mapping
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Assessments automatically sync to this Milestone topic in real-time
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoFillFromMilestone}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-100/80 hover:bg-blue-200 border border-blue-300 rounded-lg transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
                    title="Auto-populate Assessment Title from selected Milestone content"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                    <span>Auto-Fill from Milestone</span>
                  </button>
                </div>

                {/* 2x2 Structured Step Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Step 1: Course Track */}
                  <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-blue-100/90 shadow-2xs">
                    <Select
                      label="1. Course Track"
                      value={formData.courseId}
                      onChange={(e) => {
                        const newCourseId = e.target.value;
                        const selectedC = courses.find((c) => c.id === newCourseId);
                        const newStages =
                          newCourseId && newCourseId !== 'ALL' && milestonesByBatch?.[newCourseId]?.stages && milestonesByBatch[newCourseId].stages.length > 0
                            ? milestonesByBatch[newCourseId].stages
                            : selectedC?.topics && selectedC.topics.length > 0
                            ? selectedC.topics
                            : milestones?.stages && milestones.stages.length > 0
                            ? milestones.stages
                            : DEFAULT_STAGES;
                        const firstStage = newStages[0];
                        const firstSubs = getSubtopicsForStage(firstStage);
                        const firstSub = firstSubs[0];
                        const firstLessons = getInnerModulesForSubtopic(firstSub, courseLessons, firstStage?.id);
                        const firstMod = firstLessons[0];
                        setFormData({
                          ...formData,
                          courseId: newCourseId,
                          courseName: selectedC?.title || '',
                          stageId: firstStage?.id || '',
                          stageName: firstStage?.title || '',
                          subtopicId: firstSub?.id || '',
                          subtopicName: firstSub?.title || '',
                          innerTopicId: firstMod?.id || '',
                          topicName: firstMod?.title || ''
                        });
                      }}
                      options={courses.map((c) => ({ value: c.id, label: c.title }))}
                    />
                  </div>

                  {/* Step 2: Course Module / Stage */}
                  <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-blue-100/90 shadow-2xs">
                    <Select
                      label="2. Milestone Stage"
                      value={formData.stageId || currentStageObj?.id || ''}
                      onChange={(e) => {
                        const newStageId = e.target.value;
                        const newStage = stagesList.find((s) => s.id === newStageId) || stagesList[0];
                        const newSubs = getSubtopicsForStage(newStage);
                        const firstSub = newSubs[0];
                        const firstLessons = getInnerModulesForSubtopic(firstSub, courseLessons, newStage?.id);
                        const firstMod = firstLessons[0];
                        setFormData({
                          ...formData,
                          stageId: newStageId,
                          stageName: newStage?.title || '',
                          subtopicId: firstSub?.id || '',
                          subtopicName: firstSub?.title || '',
                          innerTopicId: firstMod?.id || '',
                          topicName: firstMod?.title || ''
                        });
                      }}
                      options={stagesList.map((stg) => ({
                        value: stg.id,
                        label: stg.title
                      }))}
                    />
                  </div>

                  {/* Step 3: Milestone Subtopic / Module Track */}
                  <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-blue-100/90 shadow-2xs">
                    <Select
                      label="3. Milestone Subtopic / Module Track"
                      value={formData.subtopicId || currentSubtopicObj?.id || ''}
                      onChange={(e) => {
                        const newSubId = e.target.value;
                        const targetSub = currentSubtopicsArr.find((st) => st.id === newSubId) || currentSubtopicsArr[0];
                        const targetLessons = getInnerModulesForSubtopic(targetSub, courseLessons, formData.stageId);
                        const firstMod = targetLessons[0];
                        setFormData({
                          ...formData,
                          subtopicId: newSubId,
                          subtopicName: targetSub?.title || '',
                          innerTopicId: firstMod?.id || '',
                          topicName: firstMod?.title || ''
                        });
                      }}
                      options={currentSubtopicsArr.map((sub, idx) => ({
                        value: sub.id,
                        label: `${idx + 1}. ${sub.title}`
                      }))}
                    />
                  </div>

                  {/* Step 4: Specific Topic Module */}
                  <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-blue-100/90 shadow-2xs">
                    <Select
                      label="4. Specific Topic Module"
                      value={formData.innerTopicId || currentModObj?.id || ''}
                      onChange={(e) => {
                        const newModId = e.target.value;
                        const targetMod = currentInnerModules.find((m) => (m.id || m.title) === newModId) || currentInnerModules[0];
                        setFormData({
                          ...formData,
                          innerTopicId: newModId,
                          topicName: targetMod?.title || ''
                        });
                      }}
                      options={currentInnerModules.map((mod) => ({
                        value: mod.id || mod.title,
                        label: mod.title
                      }))}
                    />
                  </div>
                </div>
              </div>
            );
          })()}

          {/* BATCH ALLOCATION DROPDOWNS: WEEKDAY & WEEKEND */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-purple-100/90 shadow-2xs">
              <Select
                label="Weekday Batches"
                value={
                  selectedWeekdayBatches.length === 0
                    ? 'NONE'
                    : selectedWeekdayBatches.length === allWeekdayBatchesList.length
                    ? 'ALL'
                    : selectedWeekdayBatches.length === 1
                    ? selectedWeekdayBatches[0]
                    : selectedWeekdayBatches.join(',')
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'ALL') {
                    setSelectedWeekdayBatches(allWeekdayBatchesList);
                  } else if (val === 'NONE') {
                    setSelectedWeekdayBatches([]);
                  } else {
                    setSelectedWeekdayBatches(val.split(',').filter(Boolean));
                  }
                }}
                options={[
                  { value: 'ALL', label: 'All Weekday Batches' },
                  ...allWeekdayBatchesList.map((b) => ({ value: b, label: `Weekday Batch ${b}` })),
                  ...(selectedWeekdayBatches.length > 1 && selectedWeekdayBatches.length < allWeekdayBatchesList.length
                    ? [{ value: selectedWeekdayBatches.join(','), label: `Selected: ${selectedWeekdayBatches.join(', ')}` }]
                    : []),
                  { value: 'NONE', label: 'None (Exclude Weekday Batches)' }
                ]}
              />
            </div>

            <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-purple-100/90 shadow-2xs">
              <Select
                label="Weekend Batches"
                value={
                  selectedWeekendBatches.length === 0
                    ? 'NONE'
                    : selectedWeekendBatches.length === allWeekendBatchesList.length
                    ? 'ALL'
                    : selectedWeekendBatches.length === 1
                    ? selectedWeekendBatches[0]
                    : selectedWeekendBatches.join(',')
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'ALL') {
                    setSelectedWeekendBatches(allWeekendBatchesList);
                  } else if (val === 'NONE') {
                    setSelectedWeekendBatches([]);
                  } else {
                    setSelectedWeekendBatches(val.split(',').filter(Boolean));
                  }
                }}
                options={[
                  { value: 'ALL', label: 'All Weekend Batches' },
                  ...allWeekendBatchesList.map((b) => ({ value: b, label: `Weekend Batch ${b}` })),
                  ...(selectedWeekendBatches.length > 1 && selectedWeekendBatches.length < allWeekendBatchesList.length
                    ? [{ value: selectedWeekendBatches.join(','), label: `Selected: ${selectedWeekendBatches.join(', ')}` }]
                    : []),
                  { value: 'NONE', label: 'None (Exclude Weekend Batches)' }
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <Input
              label="Duration (Minutes)"
              type="number"
              value={formData.durationMinutes}
              onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
            />

            <Input
              label="XP Points"
              type="number"
              value={formData.totalMarks}
              onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
            />

            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          {/* IMPORT QUESTIONS SECTION (PASTE JSON OR UPLOAD FILE) */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-violet-600" />
                <h4 className="font-extrabold text-sm text-slate-900">Auto-Import Questions</h4>
                <span className="text-[11px] text-slate-400 font-medium">(auto-fill questions below)</span>
              </div>

              {/* Mode Toggle Tabs: Paste JSON vs Upload File */}
              <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => { setImportMode('paste'); setPdfError(''); }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    importMode === 'paste'
                      ? 'bg-white text-violet-700 shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ClipboardPaste className="w-3.5 h-3.5 text-violet-600" />
                  Paste JSON / Text
                </button>
                <button
                  type="button"
                  onClick={() => { setImportMode('file'); setPdfError(''); }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    importMode === 'file'
                      ? 'bg-white text-violet-700 shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  Upload PDF / JSON
                </button>
              </div>
            </div>

            {/* TAB 1: PASTE JSON / TEXT DIRECTLY */}
            {importMode === 'paste' && (
              <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <ClipboardPaste className="w-4 h-4 text-violet-600" />
                    Paste your JSON questions directly below:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleLoadSampleJson}
                      className="text-[11px] font-bold text-violet-600 hover:text-violet-800 hover:underline cursor-pointer"
                    >
                      Insert Sample JSON
                    </button>
                    {pastedText && (
                      <button
                        type="button"
                        onClick={() => { setPastedText(''); setPdfError(''); }}
                        className="text-[11px] font-bold text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <textarea
                  rows={6}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder={`Paste JSON array here, e.g.:\n[\n  {\n    "question": "What is Git?",\n    "options": ["Version control", "Database", "Browser", "Editor"],\n    "answer": "A"\n  }\n]\n(Also supports exam text: 1. Question → A) ... Answer: A)`}
                  className="w-full px-3.5 py-2.5 bg-white text-slate-800 font-mono text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all shadow-inner resize-y"
                />

                <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5">
                  <span className="text-[11px] text-slate-500">
                    💡 Paste your JSON array and click <strong>Parse &amp; Fill MCQs</strong> to instantly fill the questions below.
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    icon={Sparkles}
                    onClick={handlePastedContentImport}
                    disabled={!pastedText.trim() || pdfParsing}
                    className="bg-violet-600 hover:bg-violet-700 text-white font-bold"
                  >
                    {pdfParsing ? 'Parsing...' : 'Parse & Fill MCQs'}
                  </Button>
                </div>

                {pdfExtractedCount > 0 && pdfFileName.includes('Pasted') && (
                  <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>{pdfExtractedCount} questions successfully extracted and loaded into builder below!</span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: UPLOAD FILE (PDF OR JSON) */}
            {importMode === 'file' && (
              <label
                htmlFor="file-upload-input"
                className={`flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed rounded-2xl p-5 cursor-pointer transition-all ${
                  pdfDragOver
                    ? 'border-violet-500 bg-violet-50'
                    : pdfExtractedCount > 0
                    ? 'border-green-400 bg-green-50/60'
                    : 'border-slate-300 bg-slate-50/60 hover:border-violet-400 hover:bg-violet-50/40'
                }`}
                onDragOver={(e) => { e.preventDefault(); setPdfDragOver(true); }}
                onDragLeave={() => setPdfDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setPdfDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) handleFileUpload(file);
                }}
              >
                <input
                  id="file-upload-input"
                  type="file"
                  accept=".pdf,.json,application/pdf,application/json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleFileUpload(file);
                    e.target.value = '';
                  }}
                />

                {pdfParsing ? (
                  <div className="flex flex-col items-center gap-2 py-1">
                    <div className="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-semibold text-violet-700">Reading file &amp; extracting questions…</p>
                  </div>
                ) : pdfExtractedCount > 0 ? (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-extrabold text-green-700">{pdfExtractedCount} questions extracted!</p>
                      <p className="text-[11px] text-green-600">{pdfFileName} — questions added to builder below</p>
                    </div>
                    <button
                      type="button"
                      title="Clear import"
                      onClick={(e) => {
                        e.preventDefault();
                        setPdfFileName('');
                        setPdfExtractedCount(0);
                        setPdfError('');
                      }}
                      className="ml-2 p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 py-1 text-center">
                    <div className="flex items-center gap-2 text-slate-400 mb-0.5">
                      <Upload className="w-6 h-6 text-slate-500" />
                      <FileText className="w-5 h-5 text-violet-600" />
                      <FileJson className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      Drop your <span className="text-violet-700 font-extrabold">PDF</span> or <span className="text-amber-700 font-extrabold">JSON</span> file here or <span className="text-violet-600 underline">click to browse</span>
                    </p>
                    <p className="text-[11px] text-slate-500 max-w-lg">
                      Supports exam PDFs (<span className="font-mono">1. Q → A/B/C/D → Answer: A</span>) and JSON files (<span className="font-mono">{`[{"question", "options", "answer"}]`}</span>)
                    </p>
                  </div>
                )}
              </label>
            )}

            {/* Error message */}
            {pdfError && (
              <div className="flex items-start gap-2 px-3.5 py-2.5 bg-rose-50 border border-rose-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-rose-700 font-medium">{pdfError}</p>
              </div>
            )}
          </div>

          {/* DYNAMIC MCQ QUESTION BUILDER SECTION */}
          <div className="space-y-4 pt-2 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600" /> Multiple Choice Questions ({formData.mcqs.length})
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">Add theoretical or coding code-snippet MCQs with 4 choices and select the correct answer</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Plus}
                  onClick={() => handleAddMcq('theoretical')}
                  className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                >
                  Add Theoretical MCQ
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Code2}
                  onClick={() => handleAddMcq('coding')}
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  Add Coding MCQ
                </Button>
              </div>
            </div>

            {formData.mcqs.map((mcq, mIndex) => {
              const isCodingMcq = mcq.mcqType === 'coding';
              return (
                <div key={mIndex} className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-3.5 relative group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold text-xs">
                        MCQ #{mIndex + 1}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-md font-extrabold text-[11px] border ${isCodingMcq ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {isCodingMcq ? '💻 Coding MCQ' : '📖 Theoretical MCQ'}
                      </span>
                    </div>

                    {formData.mcqs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMcq(mIndex)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-1">
                      <Select
                        label="MCQ Category / Format"
                        value={mcq.mcqType || 'theoretical'}
                        onChange={(e) => handleUpdateMcqType(mIndex, e.target.value)}
                        options={[
                          { value: 'theoretical', label: '📖 Theoretical MCQ' },
                          { value: 'coding', label: '💻 Coding MCQ (Code Snippet)' }
                        ]}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        label="Question Prompt"
                        placeholder={isCodingMcq ? "e.g. What will be the output of the code snippet below?" : "e.g. Which Git command initializes a repository?"}
                        value={mcq.question}
                        onChange={(e) => handleUpdateMcqQuestion(mIndex, e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Code Snippet Box for Coding MCQs */}
                  {isCodingMcq && (
                    <div className="flex flex-col gap-1.5 pt-1">
                      <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-emerald-600" /> Code Snippet / Problem Code Box
                      </label>
                      <textarea
                        rows={4}
                        placeholder={`# Write or paste your problem code snippet here\ndef calculate_total(a, b):\n    return a + b\n\nprint(calculate_total(10, 20))`}
                        value={mcq.codeSnippet || ''}
                        onChange={(e) => handleUpdateMcqCodeSnippet(mIndex, e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-900 text-emerald-400 font-mono text-xs border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
                      />
                    </div>
                  )}

                  {/* 4 Options Grid */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                      Answer Choices (Options)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {mcq.options.map((opt, oIndex) => (
                        <Input
                          key={oIndex}
                          label={`Option ${oIndex + 1}`}
                          placeholder={`Choice ${oIndex + 1}`}
                          value={opt}
                          onChange={(e) => handleUpdateMcqOption(mIndex, oIndex, e.target.value)}
                          required
                        />
                      ))}
                    </div>
                  </div>

                  <Select
                    label="Correct Option (Mark Correct Answer)"
                    value={mcq.correctIndex}
                    onChange={(e) => handleUpdateMcqCorrectIndex(mIndex, e.target.value)}
                    options={mcq.options.map((opt, idx) => ({
                      value: idx,
                      label: `Option ${idx + 1}: ${opt || `Choice ${idx + 1}`}`
                    }))}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingAssessment(null);
                setPdfFileName('');
                setPdfExtractedCount(0);
                setPdfError('');
                setPdfParsing(false);
                setPastedText('');
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingAssessment ? `Save Assessment (${currentModalTotalQuestions} Questions)` : `Publish Assessment (${currentModalTotalQuestions} Questions)`}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingAssessment}
        onClose={() => setDeletingAssessment(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Assessment"
        message={`Are you sure you want to delete "${deletingAssessment?.title}"?`}
        confirmText="Delete Assessment"
      />
    </div>
  );
}
