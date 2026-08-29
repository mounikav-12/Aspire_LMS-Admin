-- ========================================================
-- ASPIRE LMS ADMIN - SUPABASE POSTGRESQL SCHEMA & SEED DATA
-- Project Ref: maahwymvereyofrhrytx
-- ========================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / STAFF USERS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(100) NOT NULL DEFAULT 'Instructor',
  original_role VARCHAR(100) NOT NULL DEFAULT 'Instructor',
  department VARCHAR(255) DEFAULT 'Curriculum Operations',
  status VARCHAR(50) DEFAULT 'Active',
  joined_date DATE DEFAULT CURRENT_DATE,
  phone VARCHAR(50) DEFAULT '+91 98765-43210',
  avatar TEXT,
  passwords VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ROLE PERMISSIONS MATRIX TABLE
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id SERIAL PRIMARY KEY,
  role VARCHAR(100) NOT NULL,
  permission_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role, permission_id)
);

-- 3. COURSES CATALOG TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  level VARCHAR(100) NOT NULL,
  instructor VARCHAR(255) NOT NULL,
  publish_status VARCHAR(50) DEFAULT 'Published',
  thumbnail TEXT,
  enrolled_count INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 4.80,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. COURSE TOPICS MODULES TABLE
CREATE TABLE IF NOT EXISTS public.course_topics (
  id VARCHAR(255) PRIMARY KEY,
  course_id VARCHAR(255) REFERENCES public.courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  live_classes INTEGER DEFAULT 0,
  practice INTEGER DEFAULT 0,
  assessments INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ASSESSMENTS & QUIZZES TABLE
CREATE TABLE IF NOT EXISTS public.assessments (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  course_id VARCHAR(255) REFERENCES public.courses(id) ON DELETE SET NULL,
  course_name VARCHAR(255),
  topic_id VARCHAR(255),
  topic_name VARCHAR(255),
  duration_minutes INTEGER DEFAULT 45,
  total_marks INTEGER DEFAULT 100,
  mcq_count INTEGER DEFAULT 5,
  status VARCHAR(50) DEFAULT 'Active',
  publish_status VARCHAR(50) DEFAULT 'Published',
  due_date DATE DEFAULT '2026-08-30',
  mcqs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.assessments DROP COLUMN IF EXISTS coding_count;
ALTER TABLE public.assessments DROP COLUMN IF EXISTS coding_questions;

CREATE TABLE IF NOT EXISTS public.quizzes (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  course_id VARCHAR(255) REFERENCES public.courses(id) ON DELETE SET NULL,
  course_name VARCHAR(255),
  topic_id VARCHAR(255),
  topic_name VARCHAR(255),
  duration_minutes INTEGER DEFAULT 45,
  total_marks INTEGER DEFAULT 100,
  mcq_count INTEGER DEFAULT 5,
  status VARCHAR(50) DEFAULT 'Active',
  publish_status VARCHAR(50) DEFAULT 'Published',
  due_date DATE DEFAULT '2026-08-30',
  mcqs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. LIVE SESSIONS SCHEDULE TABLE
CREATE TABLE IF NOT EXISTS public.live_sessions (
  id VARCHAR(255) PRIMARY KEY,
  program_name VARCHAR(255) NOT NULL,
  technology VARCHAR(255) NOT NULL,
  session_title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(100) NOT NULL,
  meeting_link TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Upcoming',
  publish_status VARCHAR(100) DEFAULT 'Published to Student LMS',
  instructor VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. JOB PORTAL OPENINGS TABLE (IN INDIAN RUPEES ₹)
CREATE TABLE IF NOT EXISTS public.jobs (
  id VARCHAR(255) PRIMARY KEY,
  company VARCHAR(255) NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  job_type VARCHAR(100) NOT NULL,
  salary VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  posted_date DATE DEFAULT CURRENT_DATE,
  publish_status VARCHAR(100) DEFAULT 'Live Feed',
  logo TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. RECORDING LIBRARY TABLE
CREATE TABLE IF NOT EXISTS public.recordings (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  concept_name VARCHAR(255),
  duration VARCHAR(50) DEFAULT '1h 30m',
  instructor VARCHAR(255) NOT NULL,
  publish_status VARCHAR(100) DEFAULT 'Available in Student Library',
  posted_date DATE DEFAULT CURRENT_DATE,
  video_url TEXT NOT NULL,
  thumbnail TEXT,
  description TEXT,
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. PLACEMENT PREP RESOURCES TABLE
CREATE TABLE IF NOT EXISTS public.placement_resources (
  id VARCHAR(255) PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(100) DEFAULT 'Guide',
  author VARCHAR(255) DEFAULT 'Career Success Team',
  publish_status VARCHAR(50) DEFAULT 'Published',
  read_time VARCHAR(50) DEFAULT '10 min read',
  snippet TEXT,
  link_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. DROP AUDIT ACTIVITIES TABLE IF EXISTS
DROP TABLE IF EXISTS public.audit_activities CASCADE;

-- 11. MILESTONES ROADMAP TABLE
CREATE TABLE IF NOT EXISTS public.milestones_data (
  id VARCHAR(100) PRIMARY KEY DEFAULT 'default',
  overview JSONB NOT NULL DEFAULT '{}'::jsonb,
  stages JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. BATCHES TABLE
CREATE TABLE IF NOT EXISTS public.batches (
  id VARCHAR(255) PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255),
  category VARCHAR(100) DEFAULT 'Weekday',
  status VARCHAR(50) DEFAULT 'Active',
  student_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. STUDENTS ROSTER TABLE
CREATE TABLE IF NOT EXISTS public.students (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  registration_id VARCHAR(100),
  batch VARCHAR(100) DEFAULT 'A26W1',
  enrolled_courses JSONB DEFAULT '["crs-101"]'::jsonb,
  avatar TEXT,
  status VARCHAR(50) DEFAULT 'Active',
  joined_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Batches" ON public.batches FOR SELECT USING (true);
CREATE POLICY "Public Write Batches" ON public.batches FOR ALL USING (true);

CREATE POLICY "Public Read Students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Public Write Students" ON public.students FOR ALL USING (true);


CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Write Profiles" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Public Read Permissions" ON public.role_permissions FOR SELECT USING (true);
CREATE POLICY "Public Write Permissions" ON public.role_permissions FOR ALL USING (true);

CREATE POLICY "Public Read Courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Public Write Courses" ON public.courses FOR ALL USING (true);

CREATE POLICY "Public Read Course Topics" ON public.course_topics FOR SELECT USING (true);
CREATE POLICY "Public Write Course Topics" ON public.course_topics FOR ALL USING (true);

CREATE POLICY "Public Read Assessments" ON public.assessments FOR SELECT USING (true);
CREATE POLICY "Public Write Assessments" ON public.assessments FOR ALL USING (true);

CREATE POLICY "Public Read Quizzes" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Public Write Quizzes" ON public.quizzes FOR ALL USING (true);

CREATE POLICY "Public Read Live Sessions" ON public.live_sessions FOR SELECT USING (true);
CREATE POLICY "Public Write Live Sessions" ON public.live_sessions FOR ALL USING (true);

CREATE POLICY "Public Read Jobs" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Public Write Jobs" ON public.jobs FOR ALL USING (true);

CREATE POLICY "Public Read Recordings" ON public.recordings FOR SELECT USING (true);
CREATE POLICY "Public Write Recordings" ON public.recordings FOR ALL USING (true);

CREATE POLICY "Public Read Placement" ON public.placement_resources FOR SELECT USING (true);
CREATE POLICY "Public Write Placement" ON public.placement_resources FOR ALL USING (true);

CREATE POLICY "Public Read Audit" ON public.audit_activities FOR SELECT USING (true);
CREATE POLICY "Public Write Audit" ON public.audit_activities FOR ALL USING (true);

CREATE POLICY "Public Read Milestones Data" ON public.milestones_data FOR SELECT USING (true);
CREATE POLICY "Public Write Milestones Data" ON public.milestones_data FOR ALL USING (true);

-- INITIAL SEED DATA
INSERT INTO public.profiles (id, name, email, role, original_role, department, status, joined_date, phone, avatar) VALUES
('usr-1', 'Super Admin', 'aspireAdmin@gmail.com', 'Super Admin', 'Super Admin', 'Executive Leadership', 'Active', '2025-01-15', '+91 98765-43210', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.batches (id, code, category, status) VALUES
('btc-1', 'A26W1', 'Weekday', 'Active'),
('btc-2', 'A26W2', 'Weekday', 'Active'),
('btc-3', 'A26W3', 'Weekday', 'Active'),
('btc-4', 'A26S1', 'Weekend', 'Active'),
('btc-5', 'A26S2', 'Weekend', 'Active'),
('btc-6', 'A26S3', 'Weekend', 'Active')
ON CONFLICT (id) DO NOTHING;


