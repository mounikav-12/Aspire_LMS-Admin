-- ====================================================================
-- ASPIRE LMS - DYNAMIC BATCH-WISE PROJECT DUE DATES MIGRATION
-- (Stored by Batch Code, e.g. "A26W1", "A26S1", etc.)
-- Run this SQL in Supabase Dashboard: SQL Editor -> New Query -> Run
-- ====================================================================

-- 1. SAFELY CONVERT projects.due_date TO JSONB
-- Preserves existing valid JSON or initializes to empty object
DO $$
BEGIN
  -- If due_date column is currently TEXT, convert to JSONB safely
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'projects' 
      AND column_name = 'due_date' 
      AND data_type = 'text'
  ) THEN
    ALTER TABLE public.projects 
      ALTER COLUMN due_date TYPE JSONB 
      USING (
        CASE 
          WHEN due_date IS NULL THEN '{}'::jsonb
          WHEN due_date ~ '^\s*\{' THEN due_date::jsonb
          ELSE '{}'::jsonb
        END
      );
  END IF;
END $$;

-- Ensure default is '{}'::jsonb
ALTER TABLE public.projects ALTER COLUMN due_date SET DEFAULT '{}'::jsonb;

-- Also ensure batch_due_dates column exists for backward compatibility
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS batch_due_dates JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS student_due_dates JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS deadline_duration INT DEFAULT NULL;

-- 2. CREATE ATOMIC BATCH DUE DATE UPDATE FUNCTION (Key: Batch Code)
-- Ensures concurrent updates to different batches cannot clobber each other
CREATE OR REPLACE FUNCTION update_project_batch_due_date(
  p_project_id TEXT,
  p_batch_id TEXT, -- accepts batch code or batch id
  p_due_date TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_updated JSONB;
  v_val JSONB;
  v_batch_code TEXT;
BEGIN
  -- Resolve batch code if a batch id was passed
  SELECT coalesce(code, p_batch_id) INTO v_batch_code
  FROM public.batches
  WHERE id = p_batch_id OR code = p_batch_id
  LIMIT 1;

  IF v_batch_code IS NULL THEN
    v_batch_code := p_batch_id;
  END IF;

  IF p_due_date IS NULL OR p_due_date = 'null' OR p_due_date = '' THEN
    v_val := 'null'::jsonb;
  ELSE
    v_val := to_jsonb(p_due_date);
  END IF;

  UPDATE public.projects
  SET due_date = CASE 
    WHEN due_date IS NULL OR jsonb_typeof(due_date) != 'object' 
      THEN jsonb_build_object(v_batch_code, v_val)
    ELSE (due_date - p_batch_id) || jsonb_build_object(v_batch_code, v_val)
  END
  WHERE id = p_project_id
  RETURNING due_date INTO v_updated;

  RETURN v_updated;
END;
$$ LANGUAGE plpgsql;

-- 3. PERMISSIONS & RLS POLICIES
GRANT EXECUTE ON FUNCTION public.update_project_batch_due_date(TEXT, TEXT, TEXT) TO authenticated, anon, service_role;

-- 4. INITIALIZE EXISTING BATCHES WITH NULL DUE DATES FOR LOCKED PROJECTS
-- Requirement 3: Batches whose projects are locked must have literal JSON null
DO $$
DECLARE
  r_proj RECORD;
  r_batch RECORD;
  v_due_date JSONB;
  v_lock_record RECORD;
  v_calc_date TEXT;
  v_duration INT;
BEGIN
  FOR r_proj IN SELECT id, type, stage_id, subtopic_id, inner_topic_id, due_date FROM public.projects LOOP
    v_due_date := CASE 
      WHEN r_proj.due_date IS NOT NULL AND jsonb_typeof(r_proj.due_date) = 'object' 
        THEN r_proj.due_date 
      ELSE '{}'::jsonb 
    END;

    -- Determine duration in days
    v_duration := CASE 
      WHEN lower(coalesce(r_proj.type, 'mini')) LIKE '%major%' THEN 5
      WHEN lower(coalesce(r_proj.type, 'mini')) LIKE '%capstone%' OR lower(coalesce(r_proj.type, 'mini')) LIKE '%advanced%' THEN 10
      ELSE 3
    END;

    FOR r_batch IN SELECT id, code, category FROM public.batches LOOP
      -- Remove legacy batch ID key if present
      IF (v_due_date ? r_batch.id) AND r_batch.id != r_batch.code THEN
        IF (v_due_date ->> r_batch.code) IS NULL THEN
          v_due_date := v_due_date || jsonb_build_object(r_batch.code, v_due_date -> r_batch.id);
        END IF;
        v_due_date := v_due_date - r_batch.id;
      END IF;

      -- If not already established under batch code:
      IF (v_due_date ->> r_batch.code) IS NULL THEN
        -- Check if an unlocked milestone lock exists for this batch
        SELECT unlock_date INTO v_lock_record 
        FROM public.milestone_locks 
        WHERE (
          lesson_id = r_proj.inner_topic_id OR 
          lesson_id = r_proj.subtopic_id OR 
          lesson_id = r_proj.id
        )
        AND (batch_code = r_batch.code OR batch_code = r_batch.id OR batch_code = 'ALL')
        AND is_locked = false 
        AND unlock_date IS NOT NULL 
        LIMIT 1;

        IF v_lock_record.unlock_date IS NOT NULL THEN
          -- Calculate due date: unlock_date + v_duration
          v_calc_date := to_char(v_lock_record.unlock_date + (v_duration || ' days')::interval, 'YYYY-MM-DD');
          v_due_date := v_due_date || jsonb_build_object(r_batch.code, to_jsonb(v_calc_date));
        ELSE
          -- Locked batch: Must have literal JSON null (Requirement 3)
          v_due_date := v_due_date || jsonb_build_object(r_batch.code, 'null'::jsonb);
        END IF;
      END IF;
    END LOOP;

    -- Update project
    UPDATE public.projects 
    SET due_date = v_due_date,
        batch_due_dates = v_due_date
    WHERE id = r_proj.id;
  END LOOP;
END $$;
