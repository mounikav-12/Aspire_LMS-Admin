-- ====================================================================
-- ASPIRE LMS - FIX STUDENTS TABLE PERMISSIONS, COLUMNS & RLS
-- Run this SQL in Supabase Dashboard: SQL Editor -> New Query -> Run
-- ====================================================================

-- 1. Ensure students table exists with all required columns
CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  mobile_number TEXT,
  registration_id TEXT,
  batch TEXT DEFAULT 'A26W1',
  enrolled_courses JSONB DEFAULT '[]'::jsonb,
  avatar TEXT,
  status TEXT DEFAULT 'Active',
  joined_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add any missing columns to existing table
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS mobile_number TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS registration_id TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS batch TEXT DEFAULT 'A26W1';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS enrolled_courses JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS joined_date TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Grant table and sequence permissions to anon, authenticated, and service_role
GRANT ALL ON TABLE public.students TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 4. Enable Row Level Security (RLS) and configure permissive app access policies
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow full app access on students" ON public.students;
DROP POLICY IF EXISTS "Public Read Students" ON public.students;
DROP POLICY IF EXISTS "Public Write Students" ON public.students;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.students;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.students;
DROP POLICY IF EXISTS "Enable update for all users" ON public.students;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.students;

CREATE POLICY "Allow full app access on students" ON public.students
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- 5. Ensure students table is included in the Supabase Realtime publication
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;
