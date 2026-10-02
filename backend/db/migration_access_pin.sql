-- ====================================================================
-- ASPIRE LMS - ADD ACCESS PIN COLUMN TO STUDENTS TABLE
-- Run this SQL in Supabase Dashboard: SQL Editor -> New Query -> Run
-- ====================================================================

-- 1. Add access_pin column to students table (stores AES-encrypted PIN)
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS access_pin TEXT;

-- 2. Grant permissions (already covered by existing policies, but ensure)
GRANT ALL ON TABLE public.students TO anon, authenticated, service_role;
