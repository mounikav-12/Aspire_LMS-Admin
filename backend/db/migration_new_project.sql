-- ============================================================
-- ASPIRE LMS — NEW SUPABASE PROJECT MIGRATION SCRIPT
-- New Project Ref: maahwymvereyofrhrytx
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE DEFINITIONS
-- ============================================================

-- 1. PROFILES / STAFF USERS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'Instructor',
  original_role TEXT NOT NULL DEFAULT 'Instructor',
  department TEXT DEFAULT 'Curriculum Operations',
  status TEXT DEFAULT 'Active',
  joined_date TEXT,
  phone TEXT DEFAULT '+91 98765-43210',
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ROLE PERMISSIONS MATRIX TABLE
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id SERIAL PRIMARY KEY,
  role TEXT NOT NULL,
  permission_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role, permission_id)
);

-- 3. COURSES CATALOG TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Web Development',
  level TEXT DEFAULT 'Intermediate',
  instructor TEXT DEFAULT 'Staff',
  publish_status TEXT DEFAULT 'Published',
  thumbnail TEXT,
  enrolled_count INT DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 4.80,
  description TEXT,
  target_batch TEXT DEFAULT 'Weekday Batch',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. COURSE TOPICS / MODULES TABLE
CREATE TABLE IF NOT EXISTS public.course_topics (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  live_classes INT DEFAULT 0,
  practice INT DEFAULT 0,
  assessments INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ASSESSMENTS & QUIZZES TABLE
CREATE TABLE IF NOT EXISTS public.assessments (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  course_id TEXT REFERENCES public.courses(id) ON DELETE SET NULL,
  course_name TEXT,
  topic_id TEXT,
  topic_name TEXT,
  duration_minutes INT DEFAULT 45,
  total_marks INT DEFAULT 100,
  mcq_count INT DEFAULT 5,
  coding_count INT DEFAULT 1,
  status TEXT DEFAULT 'Active',
  publish_status TEXT DEFAULT 'Published',
  due_date TEXT DEFAULT '2026-08-15',
  mcqs JSONB DEFAULT '[]'::jsonb,
  coding_questions JSONB DEFAULT '[]'::jsonb,
  target_batch TEXT DEFAULT 'Weekday Batch',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LIVE SESSIONS SCHEDULE TABLE
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
  target_batch TEXT DEFAULT 'Weekday Batch',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. JOB PORTAL OPENINGS TABLE
CREATE TABLE IF NOT EXISTS public.jobs (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_type TEXT DEFAULT 'Full-Time / Remote',
  salary TEXT DEFAULT '14,00,000 - 18,00,000 / yr',
  location TEXT DEFAULT 'Bengaluru / Remote',
  posted_date TEXT,
  publish_status TEXT DEFAULT 'Live Feed',
  is_locked BOOLEAN DEFAULT FALSE,
  logo TEXT,
  description TEXT,
  target_batch TEXT DEFAULT 'Weekday Batch',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. RECORDING LIBRARY TABLE
CREATE TABLE IF NOT EXISTS public.recordings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  concept_name TEXT,
  duration TEXT DEFAULT '1h 30m',
  instructor TEXT NOT NULL,
  publish_status TEXT DEFAULT 'Available in Student Library',
  posted_date TEXT,
  video_url TEXT NOT NULL,
  thumbnail TEXT,
  description TEXT,
  instructions TEXT,
  target_batch TEXT DEFAULT 'Weekday Batch',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PLACEMENT PREP RESOURCES TABLE
CREATE TABLE IF NOT EXISTS public.placement_resources (
  id TEXT PRIMARY KEY,
  category TEXT,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'Guide',
  author TEXT DEFAULT 'Career Success Team',
  publish_status TEXT DEFAULT 'Published',
  read_time TEXT DEFAULT '10 min read',
  snippet TEXT,
  link_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. AUDIT ACTIVITIES LOG TABLE
CREATE TABLE IF NOT EXISTS public.audit_activities (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  time TEXT DEFAULT 'Just now',
  type TEXT DEFAULT 'info',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. MILESTONES ROADMAP TABLE
CREATE TABLE IF NOT EXISTS public.milestones_data (
  id TEXT PRIMARY KEY DEFAULT 'default',
  overview JSONB NOT NULL DEFAULT '{}'::jsonb,
  stages JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PROJECTS TABLE
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
  target_batch TEXT DEFAULT 'Weekday Batch',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. CODING QUESTIONS BANK TABLE
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
  target_batch TEXT DEFAULT 'Weekday Batch',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. DAILY SCHEDULES TABLE (referenced in backend /api/schedule — was missing from old schema)
CREATE TABLE IF NOT EXISTS public.daily_schedules (
  id TEXT PRIMARY KEY,
  title TEXT,
  topic TEXT,
  subtopic TEXT,
  date TEXT,
  time TEXT,
  type TEXT DEFAULT 'LIVE CLASS',
  status TEXT DEFAULT 'Scheduled',
  instructor TEXT,
  description TEXT,
  target_batch TEXT DEFAULT 'Weekday Batch',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ENABLE REALTIME PUBLICATION
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE
      public.profiles,
      public.role_permissions,
      public.courses,
      public.course_topics,
      public.assessments,
      public.live_sessions,
      public.jobs,
      public.recordings,
      public.placement_resources,
      public.audit_activities,
      public.milestones_data,
      public.projects,
      public.coding_questions,
      public.daily_schedules;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- ============================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_schedules ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- CREATE PERMISSIVE RLS POLICIES (FULL APP ACCESS)
-- ============================================================
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow full app access on profiles" ON public.profiles;
  CREATE POLICY "Allow full app access on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on role_permissions" ON public.role_permissions;
  CREATE POLICY "Allow full app access on role_permissions" ON public.role_permissions FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on courses" ON public.courses;
  CREATE POLICY "Allow full app access on courses" ON public.courses FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on course_topics" ON public.course_topics;
  CREATE POLICY "Allow full app access on course_topics" ON public.course_topics FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on assessments" ON public.assessments;
  CREATE POLICY "Allow full app access on assessments" ON public.assessments FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on live_sessions" ON public.live_sessions;
  CREATE POLICY "Allow full app access on live_sessions" ON public.live_sessions FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on jobs" ON public.jobs;
  CREATE POLICY "Allow full app access on jobs" ON public.jobs FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on recordings" ON public.recordings;
  CREATE POLICY "Allow full app access on recordings" ON public.recordings FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on placement_resources" ON public.placement_resources;
  CREATE POLICY "Allow full app access on placement_resources" ON public.placement_resources FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on audit_activities" ON public.audit_activities;
  CREATE POLICY "Allow full app access on audit_activities" ON public.audit_activities FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on milestones_data" ON public.milestones_data;
  CREATE POLICY "Allow full app access on milestones_data" ON public.milestones_data FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on projects" ON public.projects;
  CREATE POLICY "Allow full app access on projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on coding_questions" ON public.coding_questions;
  CREATE POLICY "Allow full app access on coding_questions" ON public.coding_questions FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Allow full app access on daily_schedules" ON public.daily_schedules;
  CREATE POLICY "Allow full app access on daily_schedules" ON public.daily_schedules FOR ALL USING (true) WITH CHECK (true);
END $$;

-- ============================================================
-- INITIAL SEED DATA
-- ============================================================

INSERT INTO public.profiles (id, name, email, role, original_role, department, status, joined_date, phone, avatar) VALUES
  ('usr-1', 'Super Admin', 'aspireAdmin@gmail.com', 'Super Admin', 'Super Admin', 'Executive Leadership', 'Active', '2025-01-15', '+91 98765-43210', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'),
  ('usr-2', 'Alex Rivera', 'alex.rivera@aspirelms.io', 'Admin', 'Admin', 'Curriculum Operations', 'Active', '2025-02-01', '+91 98765-43211', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
  ('usr-3', 'Priya Sharma', 'priya.s@aspirelms.io', 'Manager', 'Manager', 'Engineering Training', 'Active', '2025-03-10', '+91 98765-43212', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'),
  ('usr-4', 'David Chen', 'david.chen@aspirelms.io', 'Instructor', 'Instructor', 'Frontend Systems', 'Active', '2025-03-22', '+91 98765-43213', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.courses (id, title, category, level, instructor, publish_status, thumbnail, enrolled_count, rating, description, target_batch) VALUES
  ('crs-101', 'Full-Stack React & Node.js Mastery', 'Web Development', 'Intermediate', 'David Chen', 'Published', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80', 342, 4.90, 'Master modern full-stack web applications with React 18, Tailwind CSS, Express, and PostgreSQL.', 'Weekday Batch'),
  ('crs-102', 'Cloud Architecture & DevOps Essentials', 'Cloud & Infrastructure', 'Advanced', 'Alex Rivera', 'Published', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80', 218, 4.80, 'Learn Docker containerization, Kubernetes orchestration, AWS Cloud infra, and automated CI/CD pipelines.', 'Weekday Batch'),
  ('crs-103', 'Data Structures & System Design for Tech Interviews', 'Computer Science', 'All Levels', 'Priya Sharma', 'Published', 'https://images.unsplash.com/photo-1516116211223-4c7141467477?w=600&auto=format&fit=crop&q=80', 520, 4.95, 'Comprehensive preparation for high-frequency DSA patterns, microservice architecture, and high scalability design.', 'Weekday Batch')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.jobs (id, company, job_title, job_type, salary, location, posted_date, publish_status, logo, description, target_batch) VALUES
  ('job-1', 'Stripe', 'Senior Frontend Engineer (React/TypeScript)', 'Full-Time / Remote', '16,50,000 - 22,00,000 / yr', 'Bengaluru / Hyderabad (Remote)', '2026-08-01', 'Live Feed', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=120&auto=format&fit=crop&q=80', 'Looking for a Senior Frontend Developer to lead dashboard user experience, high performance component libraries, and checkout widget architecture.', 'Weekday Batch'),
  ('job-2', 'Datadog', 'Full-Stack Software Engineer', 'Full-Time', '14,00,000 - 18,00,000 / yr', 'Bengaluru, KA', '2026-08-02', 'Live Feed', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&auto=format&fit=crop&q=80', 'Join our telemetry dashboard squad building real-time monitoring charts, distributed log visualizers, and node graph analytics.', 'Weekday Batch'),
  ('job-3', 'Vercel', 'Developer Relations & Educator', 'Contract / Remote', '12,00,000 - 16,00,000 / yr', 'Remote India', '2026-07-28', 'Live Feed', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80', 'Create world-class technical guides, interactive sample applications, and conduct webinars on Next.js performance optimizations.', 'Weekday Batch')
ON CONFLICT (id) DO NOTHING;
