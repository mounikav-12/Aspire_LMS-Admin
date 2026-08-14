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
  coding_count INTEGER DEFAULT 1,
  status VARCHAR(50) DEFAULT 'Active',
  publish_status VARCHAR(50) DEFAULT 'Published',
  due_date DATE DEFAULT '2026-08-15',
  mcqs JSONB DEFAULT '[]'::jsonb,
  coding_questions JSONB DEFAULT '[]'::jsonb,
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

-- 10. AUDIT ACTIVITIES LOG TABLE
CREATE TABLE IF NOT EXISTS public.audit_activities (
  id VARCHAR(255) PRIMARY KEY,
  text TEXT NOT NULL,
  time VARCHAR(100) NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
  attendance INTEGER DEFAULT 92,
  progress INTEGER DEFAULT 78,
  status VARCHAR(50) DEFAULT 'Active',
  joined_date DATE DEFAULT CURRENT_DATE,
  gpa NUMERIC(3,2) DEFAULT 3.80,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
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
('usr-1', 'Super Admin', 'aspireAdmin@gmail.com', 'Super Admin', 'Super Admin', 'Executive Leadership', 'Active', '2025-01-15', '+91 98765-43210', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'),
('usr-2', 'Alex Rivera', 'alex.rivera@aspirelms.io', 'Admin', 'Admin', 'Curriculum Operations', 'Active', '2025-02-01', '+91 98765-43211', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
('usr-3', 'Priya Sharma', 'priya.s@aspirelms.io', 'Manager', 'Manager', 'Engineering Training', 'Active', '2025-03-10', '+91 98765-43212', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'),
('usr-4', 'David Chen', 'david.chen@aspirelms.io', 'Instructor', 'Instructor', 'Frontend Systems', 'Active', '2025-03-22', '+91 98765-43213', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.courses (id, title, category, level, instructor, publish_status, thumbnail, enrolled_count, rating, description) VALUES
('crs-101', 'Full-Stack React & Node.js Mastery', 'Web Development', 'Intermediate', 'David Chen', 'Published', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80', 342, 4.90, 'Master modern full-stack web applications with React 18, Tailwind CSS, Express, and PostgreSQL.'),
('crs-102', 'Cloud Architecture & DevOps Essentials', 'Cloud & Infrastructure', 'Advanced', 'Alex Rivera', 'Published', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80', 218, 4.80, 'Learn Docker containerization, Kubernetes orchestration, AWS Cloud infra, and automated CI/CD pipelines.'),
('crs-103', 'Data Structures & System Design for Tech Interviews', 'Computer Science', 'All Levels', 'Priya Sharma', 'Published', 'https://images.unsplash.com/photo-1516116211223-4c7141467477?w=600&auto=format&fit=crop&q=80', 520, 4.95, 'Comprehensive preparation for high-frequency DSA patterns, microservice architecture, and high scalability design.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.batches (id, code, category, status) VALUES
('btc-1', 'A26W1', 'Weekday', 'Active'),
('btc-2', 'A26W2', 'Weekday', 'Active'),
('btc-3', 'A26W3', 'Weekday', 'Active'),
('btc-4', 'A26S1', 'Weekend', 'Active'),
('btc-5', 'A26S2', 'Weekend', 'Active'),
('btc-6', 'A26S3', 'Weekend', 'Active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.students (id, registration_id, name, email, batch, status, joined_date, avatar, enrolled_courses) VALUES
('std-w1', 'A26W0001', 'Rahul Sharma', 'rahul.sharma@gmail.com', 'A26W1', 'Active', '2026-01-10', 'https://api.dicebear.com/7.x/initials/svg?seed=Rahul%20Sharma&backgroundColor=e0e7ff&textColor=3730a3&bold=true', '["crs-101", "crs-103"]'::jsonb),
('std-w2', 'A26W0002', 'Ananya Verma', 'ananya.verma@gmail.com', 'A26W1', 'Active', '2026-01-12', 'https://api.dicebear.com/7.x/initials/svg?seed=Ananya%20Verma&backgroundColor=e0e7ff&textColor=3730a3&bold=true', '["crs-101"]'::jsonb),
('std-w3', 'A26W0003', 'Vikram Patel', 'vikram.patel@gmail.com', 'A26W2', 'Active', '2026-01-15', 'https://api.dicebear.com/7.x/initials/svg?seed=Vikram%20Patel&backgroundColor=e0e7ff&textColor=3730a3&bold=true', '["crs-101", "crs-102"]'::jsonb),
('std-w4', 'A26W0004', 'Sneha Reddy', 'sneha.reddy@gmail.com', 'A26W3', 'Active', '2026-01-18', 'https://api.dicebear.com/7.x/initials/svg?seed=Sneha%20Reddy&backgroundColor=e0e7ff&textColor=3730a3&bold=true', '["crs-101"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.live_sessions (id, program_name, technology, session_title, date, time, meeting_link, status, publish_status, instructor, description) VALUES
('sess-1', 'Full-Stack Web Dev', 'React 18', 'React Server Components & State Management', '2026-08-16', '10:00 AM - 12:00 PM', 'https://meet.google.com/asp-live-01', 'Scheduled', 'Published to Student LMS', 'David Chen', 'Deep dive into RSC, streaming SSR, and scalable context patterns.'),
('sess-2', 'Cloud DevOps', 'Docker & Kubernetes', 'Containerizing Microservices & Deployment', '2026-08-18', '02:00 PM - 04:00 PM', 'https://meet.google.com/asp-live-02', 'Scheduled', 'Published to Student LMS', 'Alex Rivera', 'Hands-on session building multi-stage Dockerfiles and Helm charts.')
ON CONFLICT (id) DO NOTHING;

