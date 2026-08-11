-- ====================================================================
-- ASPIRE LMS - SUPABASE DATABASE SCHEMA INITIALIZATION & REALTIME SETUP
-- Run this SQL in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ====================================================================

-- 1. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'Mini',
  category TEXT DEFAULT 'Full-Stack Web Dev',
  difficulty TEXT DEFAULT 'Intermediate',
  description TEXT,
  tech_stack JSONB DEFAULT '["React", "Node.js", "PostgreSQL"]'::jsonb,
  due_date TEXT,
  status TEXT DEFAULT 'Published',
  template_url TEXT,
  guidelines TEXT,
  assigned_count INT DEFAULT 1,
  submitted_count INT DEFAULT 0,
  feedback_count INT DEFAULT 0,
  avg_grade INT DEFAULT 0,
  is_locked BOOLEAN DEFAULT FALSE,
  submissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Web Development',
  level TEXT DEFAULT 'Intermediate',
  instructor TEXT DEFAULT 'Staff',
  publish_status TEXT DEFAULT 'Published',
  thumbnail TEXT,
  enrolled_count INT DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 4.8,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COURSE TOPICS TABLE
CREATE TABLE IF NOT EXISTS public.course_topics (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  live_classes INT DEFAULT 0,
  practice INT DEFAULT 0,
  assessments INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CAREER & JOBS TABLE
CREATE TABLE IF NOT EXISTS public.jobs (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_type TEXT DEFAULT 'Full-Time / Remote',
  salary TEXT DEFAULT '₹14,00,000 - ₹18,00,000 / yr',
  location TEXT DEFAULT 'Bengaluru / Remote',
  posted_date TEXT,
  publish_status TEXT DEFAULT 'Live Feed',
  is_locked BOOLEAN DEFAULT FALSE,
  logo TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LIVE SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.live_sessions (
  id TEXT PRIMARY KEY,
  program_name TEXT,
  technology TEXT,
  session_title TEXT NOT NULL,
  date TEXT,
  time TEXT,
  meeting_link TEXT,
  status TEXT DEFAULT 'Upcoming',
  publish_status TEXT DEFAULT 'Published to Student LMS',
  instructor TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PLACEMENT RESOURCES TABLE
CREATE TABLE IF NOT EXISTS public.placement_resources (
  id TEXT PRIMARY KEY,
  category TEXT,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'Guide',
  author TEXT,
  publish_status TEXT DEFAULT 'Published',
  read_time TEXT DEFAULT '10 min read',
  snippet TEXT,
  link_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MILESTONES ROADMAP TABLE
CREATE TABLE IF NOT EXISTS public.milestones_data (
  id TEXT PRIMARY KEY DEFAULT 'default',
  overview JSONB DEFAULT '{}'::jsonb,
  stages JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CODING QUESTIONS BANK TABLE
CREATE TABLE IF NOT EXISTS public.coding_questions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Medium',
  category TEXT DEFAULT 'Algorithms',
  tags JSONB DEFAULT '[]'::jsonb,
  problem_statement TEXT,
  starter_code TEXT,
  solution_code TEXT,
  test_cases JSONB DEFAULT '[]'::jsonb,
  created_date TEXT,
  posted_by TEXT DEFAULT 'Admin Portal',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'Instructor',
  original_role TEXT DEFAULT 'Instructor',
  department TEXT DEFAULT 'Curriculum Operations',
  status TEXT DEFAULT 'Active',
  joined_date TEXT,
  phone TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ROLE PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id SERIAL PRIMARY KEY,
  role TEXT NOT NULL,
  permission_key TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AUDIT ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS public.audit_activities (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  time TEXT DEFAULT 'Just now',
  type TEXT DEFAULT 'info',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ENABLE REALTIME PUBLICATION FOR TABLES
-- ====================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.projects, public.courses, public.jobs, public.live_sessions, public.placement_resources, public.milestones_data, public.coding_questions;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- ====================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) & SET PERMISSIVE APP POLICIES
-- ====================================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_activities ENABLE ROW LEVEL SECURITY;

-- CREATE POLICIES TO ALLOW APP DATA ACCESS
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow full app access on projects" ON public.projects;
  CREATE POLICY "Allow full app access on projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on courses" ON public.courses;
  CREATE POLICY "Allow full app access on courses" ON public.courses FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on course_topics" ON public.course_topics;
  CREATE POLICY "Allow full app access on course_topics" ON public.course_topics FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on jobs" ON public.jobs;
  CREATE POLICY "Allow full app access on jobs" ON public.jobs FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on live_sessions" ON public.live_sessions;
  CREATE POLICY "Allow full app access on live_sessions" ON public.live_sessions FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on placement_resources" ON public.placement_resources;
  CREATE POLICY "Allow full app access on placement_resources" ON public.placement_resources FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on milestones_data" ON public.milestones_data;
  CREATE POLICY "Allow full app access on milestones_data" ON public.milestones_data FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on coding_questions" ON public.coding_questions;
  CREATE POLICY "Allow full app access on coding_questions" ON public.coding_questions FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on profiles" ON public.profiles;
  CREATE POLICY "Allow full app access on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on role_permissions" ON public.role_permissions;
  CREATE POLICY "Allow full app access on role_permissions" ON public.role_permissions FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on audit_activities" ON public.audit_activities;
  CREATE POLICY "Allow full app access on audit_activities" ON public.audit_activities FOR ALL USING (true) WITH CHECK (true);
END $$;
