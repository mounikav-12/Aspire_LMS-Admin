-- ====================================================================
-- ASPIRE LMS - MILESTONE LOCK/UNLOCK SYSTEM MIGRATION
-- Run this SQL in Supabase Dashboard: SQL Editor -> New Query -> Run
-- ====================================================================

-- 1. COURSE LESSONS TABLE (3rd level: sub-modules / lessons inside modules)
CREATE TABLE IF NOT EXISTS public.course_lessons (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  stage_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MILESTONE LOCKS TABLE (per-lesson, per-batch lock/unlock schedules)
CREATE TABLE IF NOT EXISTS public.milestone_locks (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  stage_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  batch_code TEXT NOT NULL,
  unlock_date DATE,
  unlock_time TEXT,
  unlock_datetime TIMESTAMPTZ,
  is_locked BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lesson_id, batch_code)
);

-- 3. ADD SUBTOPICS/MODULES JSONB COLUMN TO course_topics (migrate from localStorage)
ALTER TABLE public.course_topics ADD COLUMN IF NOT EXISTS subtopics JSONB DEFAULT '[]'::jsonb;

-- 4. ADD HIERARCHY COLUMNS TO coding_questions
ALTER TABLE public.coding_questions ADD COLUMN IF NOT EXISTS course_id TEXT;
ALTER TABLE public.coding_questions ADD COLUMN IF NOT EXISTS stage_id TEXT;
ALTER TABLE public.coding_questions ADD COLUMN IF NOT EXISTS subtopic_id TEXT;
ALTER TABLE public.coding_questions ADD COLUMN IF NOT EXISTS inner_topic_id TEXT;

-- 5. ROW LEVEL SECURITY POLICIES
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Lessons" ON public.course_lessons FOR SELECT USING (true);
CREATE POLICY "Public Write Lessons" ON public.course_lessons FOR ALL USING (true);

ALTER TABLE public.milestone_locks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Locks" ON public.milestone_locks FOR SELECT USING (true);
CREATE POLICY "Public Write Locks" ON public.milestone_locks FOR ALL USING (true);
