const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { supabase } = require('./config/supabase');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 1. HEALTH & DATABASE CONNECTION DIAGNOSTIC ENDPOINT
app.get('/api/health', async (req, res) => {
  try {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact' });
    res.json({
      status: 'online',
      message: 'Aspire LMS Backend & Database Connected',
      timestamp: new Date().toISOString(),
      supabaseUrl: process.env.SUPABASE_URL,
      databaseConnected: !error,
      profileCount: data ? data.length : 0
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 2. FULL DATABASE STATUS & DATA COUNTS API
app.get('/api/db-status', async (req, res) => {
  try {
    const { data: profiles } = await supabase.from('profiles').select('id, name, email, role');
    const { data: courses } = await supabase.from('courses').select('id, title');
    const { data: jobs } = await supabase.from('jobs').select('id, company, job_title, salary');
    const { data: liveSessions } = await supabase.from('live_sessions').select('id, session_title');
    const { data: assessments } = await supabase.from('assessments').select('id, title');

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      counts: {
        profiles: profiles?.length || 0,
        courses: courses?.length || 0,
        jobs: jobs?.length || 0,
        liveSessions: liveSessions?.length || 0,
        assessments: assessments?.length || 0
      },
      data: {
        profiles: profiles || [],
        courses: courses || [],
        jobs: jobs || [],
        liveSessions: liveSessions || [],
        assessments: assessments || []
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. PROFILES / USERS API
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const newUser = { id: `usr-${Date.now()}`, ...req.body };
    const { data, error } = await supabase.from('profiles').upsert([newUser]).select();
    if (error) throw error;
    res.status(201).json({ success: true, data: data[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. COURSES API
app.get('/api/courses', async (req, res) => {
  try {
    const { data, error } = await supabase.from('courses').select('*');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const newCourse = { id: `crs-${Date.now()}`, ...req.body };
    const { data, error } = await supabase.from('courses').upsert([newCourse]).select();
    if (error) throw error;
    res.status(201).json({ success: true, data: data[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. JOB PORTAL API (IN INDIAN RUPEES ₹)
app.get('/api/jobs', async (req, res) => {
  try {
    const { data, error } = await supabase.from('jobs').select('*');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const newJob = { id: `job-${Date.now()}`, ...req.body };
    const { data, error } = await supabase.from('jobs').upsert([newJob]).select();
    if (error) throw error;
    res.status(201).json({ success: true, data: data[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. LIVE SESSIONS API
app.get('/api/live-sessions', async (req, res) => {
  try {
    const { data, error } = await supabase.from('live_sessions').select('*');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/live-sessions', async (req, res) => {
  try {
    const newSess = { id: `sess-${Date.now()}`, ...req.body };
    const { data, error } = await supabase.from('live_sessions').upsert([newSess]).select();
    if (error) throw error;
    res.status(201).json({ success: true, data: data[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 7. STUDENT LMS FEED API BROADCAST
app.get('/api/v1/student-feed', async (req, res) => {
  try {
    const { data: courses } = await supabase.from('courses').select('*');
    const { data: liveSessions } = await supabase.from('live_sessions').select('*');
    const { data: jobs } = await supabase.from('jobs').select('*');
    const { data: placement } = await supabase.from('placement_resources').select('*');

    res.json({
      status: 'Connected & Syncing',
      endpoint: '/api/v1/student-feed',
      lastSynced: new Date().toISOString(),
      feedPayload: {
        courses: courses || [],
        liveSessions: liveSessions || [],
        jobOpportunities: jobs || [],
        placementResources: placement || []
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Aspire LMS Backend API server running on port ${PORT}`);
  console.log(`🔗 Connected to Supabase Project: ${process.env.SUPABASE_URL}`);
});
