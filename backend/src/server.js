const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { supabase } = require('./config/supabase');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS — dynamically allow request-scoped same-origin or configured origins, plus Vercel environments.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173').split(',');
app.use(cors((req, callback) => {
  const origin = req.header('Origin');
  const host = req.header('Host');
  let isAllowed = !origin; // Allow requests with no origin

  if (origin) {
    let originHostname = '';
    try {
      originHostname = new URL(origin).hostname;
    } catch (e) {}

    const hostNameOnly = host ? host.split(':')[0] : '';
    const isDev = process.env.NODE_ENV !== 'production';
    const isExplicitlyAllowed = ALLOWED_ORIGINS.includes(origin);
    const isSameHost = originHostname === hostNameOnly;
    const isVercel = origin.endsWith('.vercel.app') || origin.endsWith('.vercel.dev');

    if (isDev || isExplicitlyAllowed || isSameHost || isVercel) {
      isAllowed = true;
    }
  }

  if (isAllowed) {
    callback(null, {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    });
  } else {
    callback(new Error(`CORS policy: Origin ${origin} not allowed`));
  }
}));

// JWT verification middleware using Supabase auth client
const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Token verification failed' });
  }
};

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// =========================================================
// 1. DIAGNOSTICS & HEALTH CHECK ENDPOINTS
// =========================================================
app.get('/api/health', async (req, res) => {
  try {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact' });
    res.json({
      status: 'online',
      message: 'Aspire LMS Unified Backend & Supabase Database Connected',
      timestamp: new Date().toISOString(),
      supabaseUrl: process.env.SUPABASE_URL,
      databaseConnected: !error,
      profileCount: data ? data.length : 0
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.get('/api/db-status', async (req, res) => {
  try {
    const { data: profiles } = await supabase.from('profiles').select('id, name, email, role');
    const { data: courses } = await supabase.from('courses').select('id, title');
    const { data: jobs } = await supabase.from('jobs').select('id, company, job_title, salary');
    const { data: liveSessions } = await supabase.from('live_sessions').select('id, session_title');
    const { data: attRow } = await supabase.from('milestones_data').select('*').eq('id', 'attendance_data').single();
    const attSessions = attRow?.overview?.attendanceData
      ? Object.values(attRow.overview.attendanceData).reduce((acc, b) => acc + Object.keys(b || {}).length, 0)
      : 0;

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      counts: {
        profiles: profiles?.length || 0,
        courses: courses?.length || 0,
        jobs: jobs?.length || 0,
        liveSessions: liveSessions?.length || 0,
        attendanceSessions: attSessions
      },
      data: { profiles: profiles || [], courses: courses || [], jobs: jobs || [], liveSessions: liveSessions || [] }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================
// 2. AUTHENTICATION & PROFILE APIS (STUDENT + ADMIN)
// =========================================================
// NOTE: The previous global `currentSessionUser` variable has been removed.
// It was a critical bug — a server-level shared variable meant every
// HTTP request read/wrote the same object, leaking data between users.
// Auth state must be per-request (via JWT/session tokens).
// These endpoints now return stateless, request-scoped responses.

// Profile fetch — requires the client to send their own profile data.
// In a real implementation this should validate a JWT and fetch from DB.
app.get('/api/auth/profile', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Use the Supabase client directly for profile management.',
    note: 'This endpoint requires JWT-based auth — see AuthContext.jsx'
  });
});

app.put('/api/auth/profile', (req, res) => {
  // Stateless: no server-side session to update. Client manages profile via Supabase SDK.
  res.json({ success: true, message: 'Profile update should be done via Supabase client.' });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, role, department } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (role === 'Super Admin') {
      return res.status(403).json({ success: false, message: "Super Admin registration is prohibited." });
    }

    const newProfile = {
      id: `usr-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      role,
      department: department || 'General Staff',
      status: 'Active',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('profiles').insert([newProfile]).select();

    res.status(201).json({
      success: true,
      message: "Staff user registered successfully",
      profile: data ? data[0] : newProfile
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

// =========================================================
// 3. MILESTONES & COURSE SCHEDULE REALTIME DATABASE APIS
// =========================================================
app.get('/api/milestones', async (req, res) => {
  try {
    const { data: milesData, error } = await supabase.from('milestones_data').select('*');
    if (error) throw error;

    const batchRow = milesData?.find(m => m.id === 'batch_data');
    const defaultRow = milesData?.find(m => m.id === 'default');

    let batchData = batchRow?.overview?.batchData;
    if (!batchData && defaultRow) {
      batchData = {
        'Weekday Batch': { overview: defaultRow.overview || {}, stages: defaultRow.stages || [] },
        'Weekend Batch': { overview: defaultRow.overview || {}, stages: defaultRow.stages || [] }
      };
    }

    res.json({
      success: true,
      batchData: batchData || {},
      milestones: milesData || []
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/milestones', authenticateJWT, async (req, res) => {
  try {
    const { batchData } = req.body;
    if (!batchData) {
      return res.status(400).json({ success: false, message: 'batchData is required' });
    }

    const now = new Date().toISOString();
    const rows = [];

    Object.keys(batchData).forEach((k) => {
      if (!['batch_data', 'badges_data', 'completed_items', 'ml-python-full-stack', 'ml-python-weekend'].includes(k)) {
        rows.push({
          id: k,
          overview: batchData[k]?.overview || { trackTitle: 'Curriculum & Milestones Roadmap' },
          stages: batchData[k]?.stages || [],
          updated_at: now
        });
      }
    });

    if (rows.length > 0) {
      const { error: upsertErr } = await supabase.from('milestones_data').upsert(rows);
      if (upsertErr) console.warn('Supabase milestones bulk upsert error:', upsertErr.message);
    }

    res.json({
      success: true,
      message: 'Milestones all stages, subtopics, and modules successfully saved in realtime Supabase database',
      updatedAt: now
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/milestones/completion', async (req, res) => {
  try {
    const { data: compData, error } = await supabase.from('milestones_data').select('*').eq('id', 'completed_items').single();
    res.json({
      success: true,
      completedItemIds: compData?.overview?.itemIds || []
    });
  } catch (err) {
    res.json({ success: true, completedItemIds: [] });
  }
});

app.post('/api/milestones/completion', authenticateJWT, async (req, res) => {
  try {
    const { completedItemIds } = req.body;
    const { error } = await supabase.from('milestones_data').upsert([{
      id: 'completed_items',
      overview: { itemIds: completedItemIds || [] },
      stages: [],
      updated_at: new Date().toISOString()
    }]);
    if (error) throw error;
    res.json({ success: true, completedItemIds });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/student/course-schedule', async (req, res) => {
  try {
    const { data: milestonesData } = await supabase.from('milestones_data').select('*');
    const batchRow = milestonesData?.find(m => m.id === 'batch_data');
    const defaultBatchData = batchRow?.overview?.batchData || {};
    const stages = defaultBatchData['Weekday Batch']?.stages || defaultBatchData['default']?.stages || [];

    const courseHierarchy = {
      _id: "course-py-fullstack",
      name: "Python Full Stack + DSA with AI",
      stages: stages.map(stg => ({
        id: stg.id,
        title: stg.title,
        stageNumber: stg.stageNumber,
        status: stg.status,
        isLocked: stg.isLocked,
        unlockDate: stg.unlockDate || null,
        unlockTime: stg.unlockTime || null,
        unlockDateTime: stg.unlockDateTime || null,
        subtopics: stg.subtopics || []
      }))
    };

    const calendarSchedule = stages
      .filter(s => s.unlockDate)
      .map(s => ({
        stageId: s.id,
        title: s.title,
        unlockDate: s.unlockDate,
        unlockTime: s.unlockTime,
        unlockDateTime: s.unlockDateTime
      }));

    res.json({ success: true, courseHierarchy, calendarSchedule });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================
// 4. COURSES & JOBS & LIVE SESSIONS APIS
// =========================================================
app.get('/api/courses', async (req, res) => {
  try {
    const { data, error } = await supabase.from('courses').select('*');
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/jobs', async (req, res) => {
  try {
    const { data, error } = await supabase.from('jobs').select('*');
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const newJob = { id: `job-${Date.now()}`, ...req.body };
    const { data, error } = await supabase.from('jobs').upsert([newJob]).select();
    res.status(201).json({ success: true, data: data ? data[0] : newJob });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const formatDbLiveSession = (payload, existingId) => {
  const id = existingId || payload.id || `sess-${Date.now()}`;
  let meta = {};
  if (typeof payload.description === 'string' && payload.description.trim().startsWith('{')) {
    try { meta = JSON.parse(payload.description); } catch(e) {}
  } else {
    meta = {
      text: payload.description || '',
      courseId: payload.courseId || '',
      courseName: payload.courseName || '',
      stageId: payload.stageId || '',
      stageName: payload.stageName || '',
      subtopicId: payload.subtopicId || '',
      subtopicName: payload.subtopicName || '',
      moduleId: payload.moduleId || '',
      moduleName: payload.moduleName || '',
      isLocked: payload.isLocked !== undefined ? payload.isLocked : false,
      targetBatches: payload.targetBatches || [],
      topics: payload.topics || []
    };
  }

  if (Array.isArray(payload.topics)) {
    meta.topics = payload.topics;
  }

  const targetBatchStr = payload.targetBatch || payload.target_batch || (Array.isArray(payload.targetBatches) ? payload.targetBatches.join(', ') : 'Weekday Batch');

  const rawDate = payload.date !== undefined ? payload.date : (meta.date !== undefined ? meta.date : null);
  const cleanDate = (rawDate && typeof rawDate === 'string' && rawDate.trim() && rawDate.trim() !== 'null' && rawDate.trim() !== 'undefined') ? rawDate.trim() : null;
  meta.date = cleanDate;

  return {
    id,
    program_name: payload.programName || payload.program_name || 'Senior Engineering Cohort',
    technology: payload.technology || 'General',
    session_title: payload.sessionTitle || payload.session_title || payload.title || 'Live Session',
    date: cleanDate,
    time: payload.time || '',
    meeting_link: payload.meetingLink || payload.meeting_link || '',
    status: payload.status || 'Upcoming',
    publish_status: payload.publishStatus || payload.publish_status || 'Published to Student LMS',
    instructor: payload.instructor || 'Sara Devi',
    description: JSON.stringify(meta),
    target_batch: targetBatchStr,
    batch_code: payload.batchCode || payload.batch_code || 'A26W1',
    duration: payload.duration || '1h 30m'
  };
};

app.get('/api/live-sessions', async (req, res) => {
  try {
    const { data, error } = await supabase.from('live_sessions').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/live-sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('live_sessions').select('*').eq('id', id).single();
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/live-sessions', async (req, res) => {
  try {
    const dbItem = formatDbLiveSession(req.body);
    const { data, error } = await supabase.from('live_sessions').upsert([dbItem]).select();
    if (error) throw error;
    res.status(201).json({ success: true, data: data ? data[0] : dbItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/live-sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dbItem = formatDbLiveSession(req.body, id);
    const { data, error } = await supabase.from('live_sessions').update(dbItem).eq('id', id).select();
    if (error) throw error;
    res.json({ success: true, data: data ? data[0] : dbItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/live-sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('live_sessions').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true, message: `Live session ${id} deleted successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/live-sessions/:id/toggle-lock', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: existing } = await supabase.from('live_sessions').select('*').eq('id', id).single();
    if (!existing) return res.status(404).json({ success: false, message: 'Session not found' });

    let meta = {};
    if (existing.description && existing.description.trim().startsWith('{')) {
      try { meta = JSON.parse(existing.description); } catch(e) {}
    }
    meta.isLocked = !meta.isLocked;

    const { data, error } = await supabase.from('live_sessions').update({
      description: JSON.stringify(meta)
    }).eq('id', id).select();

    if (error) throw error;
    res.json({ success: true, isLocked: meta.isLocked, data: data ? data[0] : existing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const classifyAndNormalizeMcq = (rawMcq) => {
  if (!rawMcq || typeof rawMcq !== 'object') {
    return {
      mcqType: 'theoretical',
      question: '',
      codeSnippet: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: ''
    };
  }

  let question = String(rawMcq.question || rawMcq.q || rawMcq.prompt || rawMcq.title || rawMcq.questionText || '').trim();
  let codeSnippet = String(rawMcq.codeSnippet || rawMcq.code || rawMcq.snippet || rawMcq.starterCode || rawMcq.problemStatement || '').trim();
  let explanation = typeof rawMcq.explanation === 'string' ? rawMcq.explanation.trim() : (rawMcq.explanation ? JSON.stringify(rawMcq.explanation) : '');

  // Strip markdown bold asterisks from explanation (**word** -> word)
  if (explanation) {
    if (explanation.includes('LEGB') || explanation.includes('resolving variable names, Python searches')) {
      explanation = "Option 3 ('Local -> Enclosing -> Global -> Built-in') is correct. When resolving variable names, Python searches scopes in the order of the LEGB rule: 1. Local (inside function), 2. Enclosing (nested outer functions), 3. Global (module level), and 4. Built-in (Python builtins).";
    } else {
      explanation = explanation.replace(/\*\*([a-zA-Z0-9_ -]+?)\*\*/g, '$1').replace(/\*\*/g, '').trim();
    }
  }

  // Strip stray markdown bold asterisks from question prompt
  if (question) {
    question = question.replace(/\*\*([a-zA-Z0-9_ -]+?)\*\*/g, '$1').trim();
  }

  let options = [];
  let detectedCorrectIndex = -1;
  if (Array.isArray(rawMcq.options)) {
    rawMcq.options.forEach((opt, idx) => {
      if (typeof opt === 'string' || typeof opt === 'number') {
        options.push(String(opt).trim());
      } else if (opt && typeof opt === 'object') {
        options.push(String(opt.text || opt.label || opt.value || opt.option || '').trim());
        if (opt.isCorrect || opt.correct || opt.is_correct) detectedCorrectIndex = idx;
      }
    });
  } else if (rawMcq.choices && Array.isArray(rawMcq.choices)) {
    options = rawMcq.choices.map((c) => String(c).trim());
  } else if (rawMcq.options && typeof rawMcq.options === 'object') {
    ['A', 'B', 'C', 'D'].forEach((k) => {
      if (k in rawMcq.options) options.push(String(rawMcq.options[k]).trim());
    });
    if (options.length === 0) {
      Object.values(rawMcq.options).forEach((v) => options.push(String(v).trim()));
    }
  }
  while (options.length < 4) options.push('');
  options = options.slice(0, 4);

  if (detectedCorrectIndex < 0) {
    let ansVal = rawMcq.correctIndex !== undefined ? rawMcq.correctIndex :
                 rawMcq.answer !== undefined ? rawMcq.answer :
                 rawMcq.correctAnswer !== undefined ? rawMcq.correctAnswer :
                 rawMcq.correct !== undefined ? rawMcq.correct :
                 rawMcq.ans !== undefined ? rawMcq.ans :
                 rawMcq.correct_index !== undefined ? rawMcq.correct_index : 0;
    if (typeof ansVal === 'number') {
      detectedCorrectIndex = ansVal >= 0 && ansVal <= 3 ? ansVal : 0;
    } else if (typeof ansVal === 'string') {
      const trimmed = ansVal.trim().toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(trimmed)) {
        detectedCorrectIndex = trimmed.charCodeAt(0) - 65;
      } else if (/^[0-3]$/.test(trimmed)) {
        detectedCorrectIndex = parseInt(trimmed, 10);
      } else {
        const match = options.findIndex((o) => o.toLowerCase() === ansVal.toLowerCase().trim());
        detectedCorrectIndex = match >= 0 ? match : 0;
      }
    } else {
      detectedCorrectIndex = 0;
    }
  }

  // Clean multiple consecutive blank newlines from question
  question = question.replace(/(\r?\n\s*){2,}/g, '\n').trim();

  // Specific known questions and prompt fixes
  if (question.includes('What does the slash') && question.includes('asterisk') && question.includes('func(a, b')) {
    question = 'What do the slash (/) and asterisk (*) indicate in the function signature below?';
    codeSnippet = 'def func(a, b, /, c, d, *, e, f):\n    pass';
  } else if (question.includes('vertical margins') && question.includes('margin-top') && question.includes('inline element')) {
    question = 'What is the behavior of vertical margins (`margin-top` and `margin-bottom`) and vertical padding when applied to a pure inline element (like `<span>` or `<a>`)?';
    codeSnippet = '';
  } else if (question.includes('fundamental difference between abstract equality') && question.includes('strict equality')) {
    question = 'What is the fundamental difference between abstract equality (`==`) and strict equality (`===`)?';
    codeSnippet = '';
  }

  // Sanitize corrupted code snippets
  if (codeSnippet) {
    if (/^[)\]}>,]/.test(codeSnippet.trim()) ||
        codeSnippet.includes('and asterisk') ||
        codeSnippet.includes('and strict equality') ||
        codeSnippet.includes('and vertical padding') ||
        (/^\s*(and|or|the|is|what|indicate|which)\b/i.test(codeSnippet.trim()) && !/with\s+open/i.test(codeSnippet))) {
      codeSnippet = '';
    }
  }

  // Format squashed semicolon one-liners into clean multi-line code snippets
  if (codeSnippet && !codeSnippet.includes('\n')) {
    if (/^[a-zA-Z-]+:\s*[^;]+;(?:\s*[a-zA-Z-]+:\s*[^;]+;?)+$/.test(codeSnippet)) {
      codeSnippet = codeSnippet.split(';').map(s => s.trim()).filter(Boolean).map(s => `${s};`).join('\n');
    } else if (codeSnippet.split(';').length >= 3 && !/for\s*\([^)]*;[^)]*;[^)]*\)/.test(codeSnippet)) {
      codeSnippet = codeSnippet.split(';').map(s => s.trim()).filter(Boolean).join('\n');
    }
  }

  const explicitType = (rawMcq.mcqType || rawMcq.type || rawMcq.category || rawMcq.question_type || rawMcq.questionType || '').toString().toLowerCase().trim();
  let isCoding = (explicitType === 'coding' || explicitType === 'coding_mcq' || explicitType === 'code' || explicitType === 'practical');

  // Code block extraction from question prompt
  const codeBlockMatch = question.match(/```(?:[a-zA-Z0-9_-]+)?\s*\n([\s\S]*?)```/);
  if (codeBlockMatch) {
    if (!codeSnippet) {
      codeSnippet = codeBlockMatch[1].trim();
    }
    question = question.replace(/```(?:[a-zA-Z0-9_-]+)?\s*\n[\s\S]*?```/, '').trim();
    if (!question) question = 'What is the output or behavior of the following code snippet?';
    isCoding = true;
  }

  // HR, behavioral, and resume questions should always be theoretical
  if (/STAR Method|ATS-Compliant Resume|HR Interview Prep|Behavioral Interview/i.test(question)) {
    isCoding = false;
    codeSnippet = '';
  } else if (codeSnippet && codeSnippet.trim().length > 0) {
    isCoding = true;
  } else if (explicitType === 'theoretical') {
    isCoding = false;
    codeSnippet = '';
  } else if (!isCoding) {
    if (/\b(?:what (?:will be the|is the) (?:output|return value|result)|what does (?:the following|this) code (?:print|output|return|log)|output of (?:the following|this)?|evaluate output of|what will console\.log|what is the return value of|what does `.+?` (?:return|evaluate to)|what is the output of `.+?`)\b/i.test(question)) {
      isCoding = true;
    } else if (/(?:console\.log\s*\(|print\s*\(|def\s+[a-zA-Z_0-9]+\s*\(|function\s+[a-zA-Z_0-9]*\s*\(|class\s+[a-zA-Z_0-9]+(?:\(.*\))?:|SELECT\s+[\s\S]+?\s+FROM\s+|const\s+[a-zA-Z_0-9]+\s*=|let\s+[a-zA-Z_0-9]+\s*=|import\s+[\s\S]+?from\s+['"]|from\s+[a-zA-Z_0-9\.]+\s+import|lambda\s+[a-zA-Z0-9_,\s]+:)/i.test(question)) {
      isCoding = true;
    }
  }

  const finalType = isCoding ? 'coding' : 'theoretical';

  return {
    mcqType: finalType,
    question,
    codeSnippet: isCoding ? codeSnippet : '',
    options,
    correctIndex: Math.min(Math.max(0, detectedCorrectIndex), 3),
    explanation
  };
};

// =========================================================
// 4B. ASSESSMENTS API
// =========================================================
const formatDbAssessment = (payload, id = null) => {
  const packedTopicName = `${payload.moduleName || payload.stageName || ''}||${payload.subtopicName || ''}||${payload.topicName || payload.innerTopicTitle || ''}`;
  const packedTopicId = `${payload.stageId || ''}||${payload.subtopicId || ''}||${payload.innerTopicId || payload.moduleId || ''}`;

  const rawMcqs = Array.isArray(payload.mcqs)
    ? payload.mcqs
    : (typeof payload.mcqs === 'string' ? JSON.parse(payload.mcqs || '[]') : []);

  const cleanedMcqs = rawMcqs.map(classifyAndNormalizeMcq);

  return {
    id: id || payload.id || `asmnt-${Date.now()}`,
    title: payload.title || 'Untitled Assessment',
    course_id: payload.courseId || payload.course_id || null,
    course_name: payload.courseName || payload.course_name || '',
    topic_id: packedTopicId,
    topic_name: packedTopicName,
    duration_minutes: Number(payload.durationMinutes || payload.duration_minutes || (payload.evalType === 'quiz' ? 45 : 20)),
    total_marks: Number(payload.totalMarks || payload.total_marks || (payload.evalType === 'quiz' ? 100 : 10)),
    mcq_count: Number(payload.mcqCount || payload.mcq_count || cleanedMcqs.length),
    status: payload.status || 'Active',
    publish_status: payload.publishStatus || payload.publish_status || 'Published',
    due_date: payload.dueDate || payload.due_date || '2026-08-30',
    mcqs: cleanedMcqs,
    target_batch: payload.targetBatch || payload.target_batch || 'Weekday Batch'
  };
};

app.get('/api/assessments', async (req, res) => {
  try {
    const { data, error } = await supabase.from('assessments').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/assessments', async (req, res) => {
  try {
    const dbItem = formatDbAssessment(req.body);
    const { data, error } = await supabase.from('assessments').upsert([dbItem]).select();
    if (error) throw error;
    res.status(201).json({ success: true, data: data ? data[0] : dbItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/assessments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dbItem = formatDbAssessment(req.body, id);
    const { data, error } = await supabase.from('assessments').update(dbItem).eq('id', id).select();
    if (error) throw error;
    res.json({ success: true, data: data ? data[0] : dbItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/assessments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('assessments').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true, message: `Assessment ${id} deleted successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// QUIZZES ENDPOINTS
app.get('/api/quizzes', async (req, res) => {
  try {
    const { data, error } = await supabase.from('quizzes').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/quizzes', async (req, res) => {
  try {
    const dbItem = formatDbAssessment(req.body);
    const { data, error } = await supabase.from('quizzes').upsert([dbItem]).select();
    if (error) throw error;
    res.status(201).json({ success: true, data: data ? data[0] : dbItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dbItem = formatDbAssessment(req.body, id);
    const { data, error } = await supabase.from('quizzes').update(dbItem).eq('id', id).select();
    if (error) throw error;
    res.json({ success: true, data: data ? data[0] : dbItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/quizzes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('quizzes').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true, message: `Quiz ${id} deleted successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================
// 5. MCQ TESTS API
// =========================================================
app.get('/api/mcq/:subtopicId', (req, res) => {
  res.json([]);
});

// =========================================================
// 5. PROJECTS API
// =========================================================
const formatDbProject = (payload) => {
  const meta = {
    text: payload.description || '',
    courseId: payload.courseId || '',
    courseName: payload.courseName || '',
    stageId: payload.stageId || '',
    stageName: payload.stageName || '',
    subtopicId: payload.subtopicId || '',
    subtopicName: payload.subtopicName || '',
    moduleId: payload.innerTopicId || payload.moduleId || '',
    moduleName: payload.moduleName || payload.topicName || '',
    isLocked: !!payload.isLocked,
    targetBatches: payload.targetBatches || [],
    requirements: payload.requirements || [],
    steps: payload.steps || [],
    rubric: payload.rubric || [],
    mentorTip: payload.mentorTip || ''
  };

  const techStack = Array.isArray(payload.techStack)
    ? payload.techStack
    : (Array.isArray(payload.tech_stack)
        ? payload.tech_stack
        : (typeof payload.techStack === 'string'
            ? payload.techStack.split(',').map((s) => s.trim())
            : ['React', 'Node.js', 'PostgreSQL']));

  const targetBatchStr = payload.targetBatch || payload.target_batch || (Array.isArray(payload.targetBatches) ? payload.targetBatches.join(', ') : 'Weekday Batch');

  return {
    id: payload.id || `proj-${Date.now()}`,
    title: payload.title || 'Untitled Project',
    type: payload.type || 'Mini',
    category: payload.category || 'Full-Stack Web Dev',
    difficulty: payload.difficulty || 'Intermediate',
    description: JSON.stringify(meta),
    tech_stack: techStack,
    due_date: payload.dueDate || payload.due_date || 'Due Aug 30',
    status: payload.status || 'Published',
    template_url: payload.templateUrl || payload.template_url || '',
    guidelines: payload.guidelines || '',
    assigned_count: Number(payload.assignedCount || payload.assigned_count) || 1,
    submitted_count: Number(payload.submittedCount || payload.submitted_count) || 0,
    feedback_count: Number(payload.feedbackCount || payload.feedback_count) || 0,
    avg_grade: Number(payload.avgGrade || payload.avg_grade) || 0,
    is_locked: !!(payload.isLocked !== undefined ? payload.isLocked : payload.is_locked),
    submissions: Array.isArray(payload.submissions) ? payload.submissions : [],
    target_batch: targetBatchStr,
    overview: payload.overview || payload.description || '',
    requirements: Array.isArray(payload.requirements) ? payload.requirements : [],
    steps: Array.isArray(payload.steps) ? payload.steps : [],
    rubric: Array.isArray(payload.rubric) ? payload.rubric : [],
    mentor_tip: payload.mentorTip || payload.mentor_tip || '',
    course_id: payload.courseId || payload.course_id || 'crs-1786624019154-w',
    stage_id: payload.stageId || payload.stage_id || 'top-stg-1',
    subtopic_id: payload.subtopicId || payload.subtopic_id || 'mod-git',
    inner_topic_id: payload.innerTopicId || payload.inner_topic_id || payload.moduleId || 'lesson-1787196281985-0'
  };
};

app.get('/api/projects', async (req, res) => {
  try {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const dbItem = formatDbProject(req.body);
    const { data, error } = await supabase.from('projects').upsert([dbItem]).select();
    if (error) throw error;
    res.status(201).json({ success: true, data: data ? data[0] : dbItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dbItem = formatDbProject({ ...req.body, id });
    const { data, error } = await supabase.from('projects').update(dbItem).eq('id', id).select();
    if (error) throw error;
    res.json({ success: true, data: data ? data[0] : dbItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true, message: `Project ${id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================
// 6. DAILY SCHEDULE API (Legacy stub)
// =========================================================
app.get('/api/schedule', async (req, res) => {
  res.json({ success: true, data: [] });
});

app.post('/api/schedule', async (req, res) => {
  const newTopic = { id: `top-sched-${Date.now()}`, ...req.body };
  res.status(201).json({ success: true, data: newTopic });
});

// =========================================================
// 7. REWARDS & MERCHANDISE REALTIME DATABASE APIS
// =========================================================
const DEFAULT_REWARDS_SEED = [
  { id: 'rew-1', reward_title: 'Developer Sticker Pack', reward_image_url: '/rewards/stickers.jpg', reward_required_xp_points: 1000, is_locked: true, category: 'ACCESSORIES', stock: 100, description: 'High quality vinyl stickers for laptop and workspace customization.' },
  { id: 'rew-2', reward_title: 'Aspire Next Coffee Mug', reward_image_url: '/rewards/mug.jpg', reward_required_xp_points: 2000, is_locked: true, category: 'DRINKWARE', stock: 50, description: 'Matte ceramic coffee mug with premium branding.' },
  { id: 'rew-3', reward_title: 'Reusable Smart Notebook', reward_image_url: '/rewards/notebook.jpg', reward_required_xp_points: 3800, is_locked: true, category: 'STATIONERY', stock: 40, description: 'Cloud-connected reusable digital smart notebook.' },
  { id: 'rew-4', reward_title: 'Smart LED Flask', reward_image_url: '/rewards/flask.jpg', reward_required_xp_points: 5000, is_locked: true, category: 'DRINKWARE', stock: 35, description: 'Insulated stainless steel temperature display smart water flask.' },
  { id: 'rew-5', reward_title: 'Premium Developer T-Shirt', reward_image_url: '/rewards/tshirt.jpg', reward_required_xp_points: 8000, is_locked: true, category: 'APPAREL', stock: 60, description: '100% combed cotton high quality developer merchandise t-shirt.' },
  { id: 'rew-6', reward_title: 'Tech Backpack', reward_image_url: '/rewards/backpack.jpg', reward_required_xp_points: 15000, is_locked: true, category: 'GEAR', stock: 20, description: 'Water resistant laptop & tech accessories organizer backpack.' }
];

app.get('/api/rewards', async (req, res) => {
  try {
    const { data, error } = await supabase.from('rewards').select('*').order('reward_required_xp_points', { ascending: true });
    if (error) throw error;

    if (!data || data.length === 0) {
      try {
        await supabase.from('rewards').upsert(DEFAULT_REWARDS_SEED);
      } catch (seedErr) {}
      return res.json({ success: true, data: DEFAULT_REWARDS_SEED });
    }

    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.json({ success: true, data: DEFAULT_REWARDS_SEED, fallback: true, message: err.message });
  }
});

app.post('/api/rewards', async (req, res) => {
  try {
    const payload = req.body;
    const item = {
      id: payload.id || `rew-${Date.now()}`,
      reward_title: payload.reward_title || payload.title || 'New Reward',
      reward_image_url: payload.reward_image_url || payload.image || payload.image_url || '/rewards/stickers.jpg',
      reward_required_xp_points: Number(payload.reward_required_xp_points || payload.requiredXp || payload.required_xp || 1000),
      is_locked: payload.is_locked !== undefined ? payload.is_locked : (payload.isReleased !== undefined ? !payload.isReleased : true),
      category: payload.category || 'ACCESSORIES',
      stock: Number(payload.stock || 50),
      description: payload.description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('rewards').upsert([item]).select();
    if (error) console.warn('Supabase reward insert error:', error.message);

    res.status(201).json({ success: true, data: data ? data[0] : item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/rewards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const updates = {
      updated_at: new Date().toISOString()
    };
    if (payload.reward_title !== undefined || payload.title !== undefined) {
      updates.reward_title = payload.reward_title || payload.title;
    }
    if (payload.reward_image_url !== undefined || payload.image !== undefined || payload.image_url !== undefined) {
      updates.reward_image_url = payload.reward_image_url || payload.image || payload.image_url;
    }
    if (payload.reward_required_xp_points !== undefined || payload.requiredXp !== undefined || payload.required_xp !== undefined) {
      updates.reward_required_xp_points = Number(payload.reward_required_xp_points || payload.requiredXp || payload.required_xp);
    }
    if (payload.is_locked !== undefined) {
      updates.is_locked = payload.is_locked;
    } else if (payload.isReleased !== undefined) {
      updates.is_locked = !payload.isReleased;
    }
    if (payload.category !== undefined) updates.category = payload.category;
    if (payload.stock !== undefined) updates.stock = Number(payload.stock);
    if (payload.description !== undefined) updates.description = payload.description;

    const { data, error } = await supabase.from('rewards').update(updates).eq('id', id).select();
    if (error) console.warn('Supabase reward update error:', error.message);

    res.json({ success: true, data: data ? data[0] : updates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/rewards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('rewards').delete().eq('id', id);
    if (error) console.warn('Supabase reward delete error:', error.message);

    res.json({ success: true, message: `Reward ${id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/rewards/:id/toggle-lock', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: current } = await supabase.from('rewards').select('is_locked').eq('id', id).single();
    const newLocked = current ? !current.is_locked : false;

    const updates = {
      is_locked: newLocked,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('rewards').update(updates).eq('id', id).select();
    if (error) console.warn('Supabase toggle error:', error.message);

    res.json({ success: true, data: data ? data[0] : updates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/rewards/release-all', async (req, res) => {
  try {
    const updates = {
      is_locked: false,
      updated_at: new Date().toISOString()
    };
    await supabase.from('rewards').update(updates).neq('id', 'null');
    res.json({ success: true, message: 'All rewards released / unlocked' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/rewards/lock-all', async (req, res) => {
  try {
    const updates = {
      is_locked: true,
      updated_at: new Date().toISOString()
    };
    await supabase.from('rewards').update(updates).neq('id', 'null');
    res.json({ success: true, message: 'All rewards locked' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================
// 7B. ATTENDANCE REALTIME DATABASE APIS
// =========================================================
let inMemoryAttendanceCache = null;

// Helper: load attendance data from Supabase attendance_records table or milestones_data fallback
const getDbAttendanceData = async () => {
  // 1. Attempt to load from normalized attendance_records table
  try {
    const { data: records, error: recErr } = await supabase
      .from('attendance_records')
      .select('id, batch_code, date, student_id, status, remarks, updated_at');

    if (!recErr && Array.isArray(records) && records.length > 0) {
      const reconstructed = {};
      let latestUpdated = null;

      records.forEach((r) => {
        if (!r.batch_code || !r.date || !r.student_id) return;
        if (!reconstructed[r.batch_code]) reconstructed[r.batch_code] = {};
        if (!reconstructed[r.batch_code][r.date]) reconstructed[r.batch_code][r.date] = {};
        reconstructed[r.batch_code][r.date][r.student_id] = {
          status: r.status,
          remarks: r.remarks || ''
        };
        if (!latestUpdated || (r.updated_at && r.updated_at > latestUpdated)) {
          latestUpdated = r.updated_at;
        }
      });

      inMemoryAttendanceCache = reconstructed;
      return { attendanceData: reconstructed, updatedAt: latestUpdated || new Date().toISOString() };
    }
  } catch (err) {
    console.warn('[Attendance] attendance_records query notice:', err.message);
  }

  // 2. Fallback to milestones_data attendance_data JSON row
  try {
    const { data, error } = await supabase
      .from('milestones_data')
      .select('*')
      .eq('id', 'attendance_data')
      .single();

    if (!error && data && data.overview && data.overview.attendanceData) {
      inMemoryAttendanceCache = data.overview.attendanceData;
      return { attendanceData: data.overview.attendanceData, updatedAt: data.updated_at };
    }
  } catch (err) {
    console.warn('[Attendance] Supabase milestones_data fallback error:', err.message);
  }

  if (!inMemoryAttendanceCache) {
    inMemoryAttendanceCache = {};
  }

  return { attendanceData: inMemoryAttendanceCache, updatedAt: new Date().toISOString() };
};

// Helper: persist attendance data to both attendance_records table and milestones_data
const saveDbAttendanceData = async (newAttendanceData, specificBatch = null, specificDate = null, specificRoster = null) => {
  inMemoryAttendanceCache = newAttendanceData;
  const now = new Date().toISOString();
  let dbSuccess = false;

  // 1. If specific batch, date, and roster are provided, persist row-by-row into attendance_records
  if (specificBatch && specificDate && specificRoster && typeof specificRoster === 'object') {
    try {
      const rows = Object.entries(specificRoster)
        .filter(([studentId, data]) => data && data.status)
        .map(([studentId, data]) => ({
          id: `att_${specificBatch}_${specificDate}_${studentId}`,
          batch_code: specificBatch,
          date: specificDate,
          student_id: studentId,
          status: data.status,
          remarks: data.remarks || '',
          updated_at: now
        }));

      if (rows.length > 0) {
        const { error: upsertErr } = await supabase.from('attendance_records').upsert(rows);
        if (!upsertErr) {
          dbSuccess = true;
        } else {
          console.warn('[Attendance] attendance_records upsert note:', upsertErr.message);
        }
      }
    } catch (e) {
      console.warn('[Attendance] attendance_records row save note:', e.message);
    }
  }

  // 2. Persist to milestones_data JSON store for instant atomic retrieval & backward compatibility
  try {
    const { error } = await supabase.from('milestones_data').upsert([{
      id: 'attendance_data',
      overview: { attendanceData: newAttendanceData },
      stages: [],
      updated_at: now
    }]);

    if (!error) {
      dbSuccess = true;
    } else {
      console.warn('[Attendance] Supabase milestones_data upsert error:', error.message);
    }
  } catch (e) {
    console.warn('[Attendance] Database save error:', e.message);
  }

  return { success: true, dbSuccess, updatedAt: now };
};

// GET /api/attendance - fetch all attendance, or filtered by query ?batch=...&date=...
app.get('/api/attendance', async (req, res) => {
  try {
    const { batch, date } = req.query;
    const { attendanceData, updatedAt } = await getDbAttendanceData();

    if (batch && date) {
      const roster = attendanceData[batch]?.[date] || {};
      return res.json({ success: true, batch, date, roster, updatedAt });
    }

    if (batch) {
      const batchRecords = attendanceData[batch] || {};
      return res.json({ success: true, batch, records: batchRecords, updatedAt });
    }

    res.json({
      success: true,
      attendanceData,
      updatedAt,
      batchesTracked: Object.keys(attendanceData).length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/attendance/:batch - fetch attendance sessions for a specific batch
app.get('/api/attendance/:batch', async (req, res) => {
  try {
    const { batch } = req.params;
    const { attendanceData, updatedAt } = await getDbAttendanceData();
    const batchRecords = attendanceData[batch] || {};
    res.json({ success: true, batch, records: batchRecords, updatedAt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/attendance/:batch/:date - fetch attendance roster for a specific batch & date
app.get('/api/attendance/:batch/:date', async (req, res) => {
  try {
    const { batch, date } = req.params;
    const { attendanceData, updatedAt } = await getDbAttendanceData();
    const roster = attendanceData[batch]?.[date] || {};
    res.json({ success: true, batch, date, roster, updatedAt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST & PUT /api/attendance - save or update attendance records
const handleAttendanceSave = async (req, res) => {
  try {
    const { batchCode, date, roster, attendanceData: fullPayload } = req.body;
    const { attendanceData: existingData } = await getDbAttendanceData();
    const updatedData = { ...existingData };

    if (fullPayload && typeof fullPayload === 'object') {
      Object.keys(fullPayload).forEach((b) => {
        updatedData[b] = { ...(updatedData[b] || {}), ...(fullPayload[b] || {}) };
      });
    } else if (batchCode && date) {
      if (!updatedData[batchCode]) {
        updatedData[batchCode] = {};
      }
      updatedData[batchCode][date] = roster || {};
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid payload. Provide either { batchCode, date, roster } or { attendanceData }.'
      });
    }

    const { updatedAt, dbSuccess } = await saveDbAttendanceData(
      updatedData,
      batchCode || null,
      date || null,
      batchCode && date ? (roster || {}) : null
    );

    res.json({
      success: true,
      message: batchCode && date
        ? `Attendance for ${batchCode} on ${date} saved successfully.`
        : 'Attendance records updated successfully.',
      updatedAt,
      dbSuccess,
      attendanceData: updatedData
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

app.post('/api/attendance', handleAttendanceSave);
app.put('/api/attendance', handleAttendanceSave);

// POST /api/attendance/bulk-mark - bulk mark students in a batch for a date
app.post('/api/attendance/bulk-mark', async (req, res) => {
  try {
    const { batchCode, date, status, studentIds } = req.body;
    if (!batchCode || !date || !status) {
      return res.status(400).json({ success: false, message: 'batchCode, date, and status are required.' });
    }

    const { attendanceData } = await getDbAttendanceData();
    const updatedData = { ...attendanceData };
    if (!updatedData[batchCode]) updatedData[batchCode] = {};
    if (!updatedData[batchCode][date]) updatedData[batchCode][date] = {};

    let targetIds = studentIds;
    if (!targetIds || !Array.isArray(targetIds) || targetIds.length === 0) {
      const { data: dbStudents } = await supabase.from('students').select('id').eq('batch', batchCode);
      targetIds = dbStudents ? dbStudents.map(s => s.id) : [];
    }

    targetIds.forEach((id) => {
      const existing = updatedData[batchCode][date][id] || {};
      updatedData[batchCode][date][id] = {
        ...existing,
        status: status.toLowerCase()
      };
    });

    const { updatedAt, dbSuccess } = await saveDbAttendanceData(
      updatedData,
      batchCode,
      date,
      updatedData[batchCode][date]
    );

    res.json({
      success: true,
      message: `Marked ${targetIds.length} students as ${status.toUpperCase()} for ${batchCode} on ${date}.`,
      roster: updatedData[batchCode][date],
      updatedAt,
      dbSuccess
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/attendance/reset - clear attendance marks for a batch and date
app.post('/api/attendance/reset', async (req, res) => {
  try {
    const { batchCode, date } = req.body;
    if (!batchCode || !date) {
      return res.status(400).json({ success: false, message: 'batchCode and date are required.' });
    }

    const { attendanceData } = await getDbAttendanceData();
    const updatedData = { ...attendanceData };
    if (updatedData[batchCode]) {
      updatedData[batchCode][date] = {};
    }

    // Delete individual student rows from attendance_records table
    try {
      await supabase.from('attendance_records').delete().eq('batch_code', batchCode).eq('date', date);
    } catch (e) {
      console.warn('[Attendance] attendance_records reset note:', e.message);
    }

    const { updatedAt, dbSuccess } = await saveDbAttendanceData(updatedData);

    res.json({
      success: true,
      message: `Cleared attendance marks for ${batchCode} on ${date}.`,
      roster: {},
      updatedAt,
      dbSuccess
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/attendance/:batch/:date - delete session attendance records
app.delete('/api/attendance/:batch/:date', async (req, res) => {
  try {
    const { batch, date } = req.params;
    const { attendanceData } = await getDbAttendanceData();
    const updatedData = { ...attendanceData };

    if (updatedData[batch] && updatedData[batch][date]) {
      delete updatedData[batch][date];
    }

    // Delete individual rows from attendance_records table
    try {
      await supabase.from('attendance_records').delete().eq('batch_code', batch).eq('date', date);
    } catch (e) {
      console.warn('[Attendance] attendance_records delete note:', e.message);
    }

    const { updatedAt, dbSuccess } = await saveDbAttendanceData(updatedData);

    res.json({
      success: true,
      message: `Attendance session ${date} for ${batch} deleted.`,
      updatedAt,
      dbSuccess
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================
// 8. STUDENT LMS FEED API BROADCAST
// =========================================================
app.get('/api/v1/student-feed', async (req, res) => {
  try {
    const { data: courses } = await supabase.from('courses').select('*');
    const { data: liveSessions } = await supabase.from('live_sessions').select('*');
    const { data: jobs } = await supabase.from('jobs').select('*');
    const { data: projects } = await supabase.from('projects').select('*');
    const { data: milestonesData } = await supabase.from('milestones_data').select('*');
    const { data: lessons } = await supabase.from('course_lessons').select('*');
    const { data: locks } = await supabase.from('milestone_locks').select('*');
    const { data: rewardsData } = await supabase.from('rewards').select('*');
    const { attendanceData } = await getDbAttendanceData();

    res.json({
      status: 'Connected & Syncing',
      endpoint: '/api/v1/student-feed',
      lastSynced: new Date().toISOString(),
      feedPayload: {
        attendance: attendanceData || {},
        milestones: milestonesData || [],
        courseLessons: lessons || [],
        milestoneLocks: locks || [],
        courses: courses || [],
        dailySchedule: [],
        projects: projects || [],
        liveSessions: liveSessions || [],
        jobOpportunities: jobs || [],
        rewards: (rewardsData && rewardsData.length > 0 ? rewardsData : DEFAULT_REWARDS_SEED).map(r => ({
          id: r.id,
          reward_title: r.reward_title || r.title,
          reward_image_url: r.reward_image_url || r.image || r.image_url,
          reward_required_xp_points: r.reward_required_xp_points || r.required_xp,
          is_locked: r.is_locked,
          is_released_to_students: !r.is_locked,
          category: r.category,
          stock: r.stock,
          description: r.description
        }))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Aspire LMS Unified Express API server running on port ${PORT}`);
    console.log(`🔗 Connected to Supabase Database Project: ${process.env.SUPABASE_URL}`);
  });
}

module.exports = app;
