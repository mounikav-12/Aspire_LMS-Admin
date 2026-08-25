const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { supabase } = require('./config/supabase');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS — restrict to known origins. Add your deployed frontend URL here.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173').split(',');
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Vercel SSR)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    callback(new Error(`CORS policy: Origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      counts: {
        profiles: profiles?.length || 0,
        courses: courses?.length || 0,
        jobs: jobs?.length || 0,
        liveSessions: liveSessions?.length || 0
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

app.post('/api/auth/direct-login', async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ success: false, msg: 'Mobile number is required' });

    // Build a request-scoped profile — NOT stored in server memory
    const profile = {
      user: { username: `Student_${mobile.slice(-4)}`, mobile, role: 'student' },
      fullName: `Student ${mobile.slice(-4)}`,
      bio: 'Active Aspire LMS Student',
      phone: mobile,
      email: `student_${mobile}@aspire.edu`
    };

    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

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

app.put('/api/milestones', async (req, res) => {
  try {
    const { batchData, overview } = req.body;
    if (!batchData) {
      return res.status(400).json({ success: false, message: 'batchData is required' });
    }

    const weekdayStages = batchData['Weekday Batch']?.stages || batchData['default']?.stages || [];
    const weekdayOverview = batchData['Weekday Batch']?.overview || overview || {};
    const weekendStages = batchData['Weekend Batch']?.stages || [];
    const weekendOverview = batchData['Weekend Batch']?.overview || {};
    const now = new Date().toISOString();

    const rows = [
      { id: 'batch_data', overview: { batchData }, stages: weekdayStages, updated_at: now },
      { id: 'default', overview: weekdayOverview, stages: weekdayStages, updated_at: now },
      { id: 'Weekday Batch', overview: weekdayOverview, stages: weekdayStages, updated_at: now },
      { id: 'Weekend Batch', overview: weekendOverview, stages: weekendStages, updated_at: now },
      { id: 'ml-python-full-stack', overview: weekdayOverview, stages: weekdayStages, updated_at: now },
      { id: 'ml-python-weekend', overview: weekendOverview, stages: weekendStages, updated_at: now }
    ];

    Object.keys(batchData).forEach((k) => {
      if (!['batch_data', 'default', 'Weekday Batch', 'Weekend Batch', 'ml-python-full-stack', 'ml-python-weekend'].includes(k)) {
        rows.push({
          id: k,
          overview: batchData[k]?.overview || {},
          stages: batchData[k]?.stages || [],
          updated_at: now
        });
      }
    });

    const { error: upsertErr } = await supabase.from('milestones_data').upsert(rows);
    if (upsertErr) console.warn('Supabase milestones bulk upsert error:', upsertErr.message);

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

app.post('/api/milestones/completion', async (req, res) => {
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
      targetBatches: payload.targetBatches || []
    };
  }

  const targetBatchStr = payload.targetBatch || payload.target_batch || (Array.isArray(payload.targetBatches) ? payload.targetBatches.join(', ') : 'Weekday Batch');

  return {
    id,
    program_name: payload.programName || payload.program_name || 'Senior Engineering Cohort',
    technology: payload.technology || 'General',
    session_title: payload.sessionTitle || payload.session_title || payload.title || 'Live Session',
    date: payload.date || '',
    time: payload.time || '',
    meeting_link: payload.meetingLink || payload.meeting_link || '',
    status: payload.status || 'Upcoming',
    publish_status: payload.publishStatus || payload.publish_status || 'Published to Student LMS',
    instructor: payload.instructor || 'Sara Devi',
    description: typeof payload.description === 'string' && payload.description.trim().startsWith('{') ? payload.description : JSON.stringify(meta),
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

// =========================================================
// 4B. ASSESSMENTS API
// =========================================================
const formatDbAssessment = (payload, id = null) => {
  const packedTopicName = `${payload.moduleName || payload.stageName || ''}||${payload.subtopicName || ''}||${payload.topicName || payload.innerTopicTitle || ''}`;
  const packedTopicId = `${payload.stageId || ''}||${payload.subtopicId || ''}||${payload.innerTopicId || payload.moduleId || ''}`;

  return {
    id: id || payload.id || `asmnt-${Date.now()}`,
    title: payload.title || 'Untitled Assessment',
    course_id: payload.courseId || payload.course_id || null,
    course_name: payload.courseName || payload.course_name || '',
    topic_id: packedTopicId,
    topic_name: packedTopicName,
    duration_minutes: Number(payload.durationMinutes || payload.duration_minutes || 45),
    total_marks: Number(payload.totalMarks || payload.total_marks || 100),
    mcq_count: Number(payload.mcqCount || payload.mcq_count || (Array.isArray(payload.mcqs) ? payload.mcqs.length : 0)),
    coding_count: Number(payload.codingCount || payload.coding_count || (Array.isArray(payload.codingQuestions) ? payload.codingQuestions.length : (Array.isArray(payload.coding_questions) ? payload.coding_questions.length : 0))),
    status: payload.status || 'Active',
    publish_status: payload.publishStatus || payload.publish_status || 'Published',
    due_date: payload.dueDate || payload.due_date || '2026-08-15',
    mcqs: Array.isArray(payload.mcqs) ? payload.mcqs : (typeof payload.mcqs === 'string' ? JSON.parse(payload.mcqs) : []),
    coding_questions: Array.isArray(payload.codingQuestions)
      ? payload.codingQuestions
      : (Array.isArray(payload.coding_questions) ? payload.coding_questions : (typeof payload.coding_questions === 'string' ? JSON.parse(payload.coding_questions) : [])),
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
    stage_id: payload.stageId || payload.stage_id || 's1',
    subtopic_id: payload.subtopicId || payload.subtopic_id || 'm1_git',
    inner_topic_id: payload.innerTopicId || payload.inner_topic_id || payload.moduleId || 'l_git_1'
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

    res.json({
      status: 'Connected & Syncing',
      endpoint: '/api/v1/student-feed',
      lastSynced: new Date().toISOString(),
      feedPayload: {
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
