-- ====================================================================
-- ASPIRE LMS - BADGES TABLE MIGRATION
-- Run this SQL in Supabase Dashboard: SQL Editor -> New Query -> Run
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Award',
  color TEXT DEFAULT 'purple',
  category TEXT DEFAULT 'Achievement',
  criteria TEXT,
  points TEXT DEFAULT '100 XP',
  target_batch TEXT DEFAULT 'ALL BATCHES',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Badges" ON public.badges;
DROP POLICY IF EXISTS "Public Write Badges" ON public.badges;
CREATE POLICY "Public Read Badges" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Public Write Badges" ON public.badges FOR ALL USING (true);
