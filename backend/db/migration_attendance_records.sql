-- ====================================================================
-- ASPIRE LMS - RECREATE ATTENDANCE_RECORDS TABLE & ENABLE REALTIME
-- Run this SQL in Supabase Dashboard: SQL Editor -> New Query -> Run
-- ====================================================================

-- 1. Drop old table with incompatible constraints (UUID / session_id NOT NULL)
DROP TABLE IF EXISTS public.attendance_records CASCADE;

-- 2. Create the clean daily attendance records table
CREATE TABLE public.attendance_records (
  id TEXT PRIMARY KEY,
  batch_code TEXT NOT NULL,
  date DATE NOT NULL,
  student_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  remarks TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create high-performance query indexes
CREATE INDEX idx_attendance_records_batch_date ON public.attendance_records(batch_code, date);
CREATE INDEX idx_attendance_records_student ON public.attendance_records(student_id);

-- 4. Grant table and sequence permissions to anon, authenticated, and service_role
GRANT ALL ON TABLE public.attendance_records TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 5. Enable Row Level Security (RLS) with open permissive app policies
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow full app access on attendance_records" ON public.attendance_records;
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
