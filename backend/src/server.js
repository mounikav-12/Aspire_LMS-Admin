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
app.use(express.json());

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
// 3. STUDENT DASHBOARD & COURSE SCHEDULE API
// =========================================================
app.get('/api/student/course-schedule', async (req, res) => {
  try {
    const courseHierarchy = {
      _id: "crs-ai-ml",
      name: "AI & Machine Learning Program",
      stages: [
        {
          _id: "stg-1",
          name: "STAGE 1: PYTHON & CORE FUNDAMENTALS",
          topics: [
            {
              _id: "top-1",
              name: "Python Programming Basics",
              subtopics: [
                {
                  _id: "sub-101",
                  name: "Variables & Data Types",
                  cheatSheetUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                  sessions: {
                    live: { _id: "sess-live-1", title: "Variables & Data Types Live Class", scheduledDate: new Date().toISOString() },
                    lab: { _id: "sess-lab-1", title: "Variables Lab Practice" },
                    assessment: { _id: "sess-mcq-1", title: "Variables Assessment Quiz" }
                  }
                },
                {
                  _id: "sub-102",
                  name: "Functions & OOP Concepts",
                  cheatSheetUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                  sessions: {
                    lab: { _id: "sess-lab-2", title: "Functions & Classes Lab" },
                    assessment: { _id: "sess-mcq-2", title: "OOP Assessment" }
                  }
                }
              ]
            }
          ]
        },
        {
          _id: "stg-2",
          name: "STAGE 2: MACHINE LEARNING & AI MODELS",
          topics: [
            {
              _id: "top-2",
              name: "Supervised Learning Algorithms",
              subtopics: [
                {
                  _id: "sub-201",
                  name: "Linear & Logistic Regression",
                  sessions: {
                    live: { _id: "sess-live-2", title: "Regression Models Workshop", scheduledDate: new Date(Date.now() + 86400000).toISOString() }
                  }
                }
              ]
            }
          ]
        }
      ]
    };

    const calendarSchedule = [
      {
        _id: "sched-1",
        type: "LIVE_CLASS",
        subtopicName: "Variables & Data Types",
        topicName: "Python Programming Basics",
        subtopicId: "sub-101",
        scheduledDate: new Date().toISOString(),
        duration: "120 min"
      },
      {
        _id: "sched-2",
        type: "LAB",
        subtopicName: "Variables Lab Practice",
        topicName: "Python Programming Basics",
        subtopicId: "sub-101",
        scheduledDate: new Date().toISOString(),
        duration: "45 min"
      }
    ];

    res.json({ courseHierarchy, calendarSchedule });
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

app.get('/api/live-sessions', async (req, res) => {
  try {
    const { data, error } = await supabase.from('live_sessions').select('*');
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/live-sessions', async (req, res) => {
  try {
    const newSess = { id: `sess-${Date.now()}`, ...req.body };
    const { data, error } = await supabase.from('live_sessions').upsert([newSess]).select();
    res.status(201).json({ success: true, data: data ? data[0] : newSess });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================
// 5. MCQ TESTS API
// =========================================================
app.get('/api/mcq/:subtopicId', (req, res) => {
  res.json([
    {
      _id: "mcq-set-1",
      level: "EASY",
      setType: "PRACTICE",
      title: "Variables & Data Types Practice",
      userResult: null
    },
    {
      _id: "mcq-set-2",
      level: "MEDIUM",
      setType: "ASSIGNMENT",
      title: "Variables Core Evaluation",
      userResult: null
    }
  ]);
});

// =========================================================
// 5. PROJECTS API
// =========================================================
app.get('/api/projects', async (req, res) => {
  try {
    const { data, error } = await supabase.from('projects').select('*');
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const newProj = { id: `proj-${Date.now()}`, ...req.body };
    const { data, error } = await supabase.from('projects').upsert([newProj]).select();
    res.status(201).json({ success: true, data: data ? data[0] : newProj });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================
// 6. DAILY SCHEDULE API
// =========================================================
app.get('/api/schedule', async (req, res) => {
  try {
    const { data, error } = await supabase.from('daily_schedules').select('*');
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/schedule', async (req, res) => {
  try {
    const newTopic = { id: `top-sched-${Date.now()}`, ...req.body };
    const { data, error } = await supabase.from('daily_schedules').upsert([newTopic]).select();
    res.status(201).json({ success: true, data: data ? data[0] : newTopic });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================
// 7. STUDENT LMS FEED API BROADCAST
// =========================================================
app.get('/api/v1/student-feed', async (req, res) => {
  try {
    const { data: courses } = await supabase.from('courses').select('*');
    const { data: liveSessions } = await supabase.from('live_sessions').select('*');
    const { data: jobs } = await supabase.from('jobs').select('*');
    const { data: projects } = await supabase.from('projects').select('*');
    const { data: dailySchedules } = await supabase.from('daily_schedules').select('*');

    res.json({
      status: 'Connected & Syncing',
      endpoint: '/api/v1/student-feed',
      lastSynced: new Date().toISOString(),
      feedPayload: {
        courses: courses || [],
        dailySchedule: dailySchedules || [],
        projects: projects || [],
        liveSessions: liveSessions || [],
        jobOpportunities: jobs || []
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
