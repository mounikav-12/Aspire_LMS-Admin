-- ====================================================================
-- ASPIRE LMS - CREATE / UPDATE ATTENDANCE RECORDS TABLE & REALTIME
-- Run this SQL in Supabase Dashboard: SQL Editor -> New Query -> Run
-- ====================================================================

-- 1. Create attendance_records table if it doesn't already exist
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id TEXT PRIMARY KEY,
  batch_code TEXT NOT NULL,
  date DATE NOT NULL,
  student_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  remarks TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. If table was created with old/different columns, safely add any missing columns
ALTER TABLE public.attendance_records ADD COLUMN IF NOT EXISTS batch_code TEXT;
ALTER TABLE public.attendance_records ADD COLUMN IF NOT EXISTS date DATE;
ALTER TABLE public.attendance_records ADD COLUMN IF NOT EXISTS student_id TEXT;
ALTER TABLE public.attendance_records ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE public.attendance_records ADD COLUMN IF NOT EXISTS remarks TEXT DEFAULT '';
ALTER TABLE public.attendance_records ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.attendance_records ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Create high-performance query indexes
CREATE INDEX IF NOT EXISTS idx_attendance_records_batch_date ON public.attendance_records(batch_code, date);
CREATE INDEX IF NOT EXISTS idx_attendance_records_student ON public.attendance_records(student_id);

-- 4. Grant table and sequence permissions to anon, authenticated, and service_role
GRANT ALL ON TABLE public.attendance_records TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 5. Enable Row Level Security (RLS) with open permissive app policies
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow full app access on attendance_records" ON public.attendance_records;
DROP POLICY IF EXISTS "Public Read attendance_records" ON public.attendance_records;
DROP POLICY IF EXISTS "Public Write attendance_records" ON public.attendance_records;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.attendance_records;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.attendance_records;
DROP POLICY IF EXISTS "Enable update for all users" ON public.attendance_records;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.attendance_records;

CREATE POLICY "Allow full app access on attendance_records" ON public.attendance_records
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- 6. Ensure attendance_records is included in Supabase Realtime broadcast publication
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance_records;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;
