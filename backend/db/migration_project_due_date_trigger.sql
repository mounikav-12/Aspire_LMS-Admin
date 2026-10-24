-- ====================================================================
-- ASPIRE LMS - AUTOMATIC PROJECT DUE DATE SYNC TRIGGER
-- Automatically recalculates and updates projects.due_date (JSONB)
-- whenever milestone_locks are inserted, updated, or deleted.
--
-- Instructions: Run this SQL in Supabase Dashboard:
-- SQL Editor -> New Query -> Paste & Run
-- ====================================================================

CREATE OR REPLACE FUNCTION public.sync_milestone_lock_to_projects()
RETURNS TRIGGER AS $$
DECLARE
  target_batch_code TEXT;
  target_lesson_id TEXT;
  target_module_id TEXT;
  target_stage_id TEXT;
  is_unlocked BOOLEAN;
  unlock_d DATE;
  proj RECORD;
  duration_days INT;
  calc_due_date DATE;
  due_date_str TEXT;
  batch_codes TEXT[];
  b_code TEXT;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_batch_code := OLD.batch_code;
    target_lesson_id := OLD.lesson_id;
    target_module_id := OLD.module_id;
    target_stage_id := OLD.stage_id;
    is_unlocked := false;
  ELSE
    target_batch_code := NEW.batch_code;
    target_lesson_id := NEW.lesson_id;
    target_module_id := NEW.module_id;
    target_stage_id := NEW.stage_id;
    is_unlocked := (NEW.is_locked = false AND NEW.unlock_date IS NOT NULL);
    unlock_d := NEW.unlock_date;
  END IF;

  IF target_batch_code IS NULL OR target_batch_code = '' THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  -- Determine target batch codes (expanding 'ALL', 'Weekend Batch', 'Weekday Batch')
  IF target_batch_code = 'ALL' THEN
    SELECT ARRAY_AGG(code) INTO batch_codes FROM public.batches WHERE code IS NOT NULL;
    IF batch_codes IS NULL OR array_length(batch_codes, 1) = 0 THEN
      batch_codes := ARRAY['A26W1', 'A26S1', 'A26W2', 'A26S2'];
    END IF;
  ELSIF target_batch_code ILIKE '%weekend%' THEN
    SELECT ARRAY_AGG(code) INTO batch_codes FROM public.batches WHERE code ILIKE '%s%' OR code ILIKE '%weekend%';
    IF batch_codes IS NULL OR array_length(batch_codes, 1) = 0 THEN
      batch_codes := ARRAY['A26S1', 'A26S2'];
    END IF;
  ELSIF target_batch_code ILIKE '%weekday%' THEN
    SELECT ARRAY_AGG(code) INTO batch_codes FROM public.batches WHERE code ILIKE '%w%' OR code ILIKE '%weekday%';
    IF batch_codes IS NULL OR array_length(batch_codes, 1) = 0 THEN
      batch_codes := ARRAY['A26W1', 'A26W2'];
    END IF;
  ELSE
    batch_codes := ARRAY[target_batch_code];
  END IF;

  -- Find all projects associated with this lesson, module, or stage
  FOR proj IN
    SELECT id, type, deadline_duration, due_date, inner_topic_id, subtopic_id, stage_id
    FROM public.projects
    WHERE
      (target_lesson_id IS NOT NULL AND (
        id = target_lesson_id OR
        inner_topic_id = target_lesson_id OR
        REGEXP_REPLACE(COALESCE(inner_topic_id, ''), '-(w|s)$', '', 'i') = REGEXP_REPLACE(target_lesson_id, '-(w|s)$', '', 'i')
      ))
      OR
      (target_module_id IS NOT NULL AND target_module_id <> '' AND (
        subtopic_id = target_module_id OR
        inner_topic_id = target_module_id OR
        REGEXP_REPLACE(COALESCE(subtopic_id, ''), '-(w|s)$', '', 'i') = REGEXP_REPLACE(target_module_id, '-(w|s)$', '', 'i')
      ))
      OR
      (target_stage_id IS NOT NULL AND target_stage_id <> '' AND (
        stage_id = target_stage_id
      ))
  LOOP
    IF is_unlocked THEN
      -- Determine deadline duration based on project type or custom duration
      duration_days := COALESCE(
        proj.deadline_duration,
        CASE
          WHEN LOWER(COALESCE(proj.type, '')) = 'capstone' OR LOWER(COALESCE(proj.type, '')) = 'advanced' THEN 10
          WHEN LOWER(COALESCE(proj.type, '')) = 'major' THEN 5
          ELSE 3
        END
      );

      calc_due_date := (unlock_d + (duration_days || ' days')::INTERVAL)::DATE;
      due_date_str := to_char(calc_due_date, 'YYYY-MM-DD');

      FOREACH b_code IN ARRAY batch_codes LOOP
        UPDATE public.projects
        SET due_date = jsonb_set(
          COALESCE(due_date, '{}'::jsonb),
          ARRAY[b_code],
          to_jsonb(due_date_str)
        )
        WHERE id = proj.id;
      END LOOP;
    ELSE
      -- Locked or deleted: Set due date to literal null for this batch
      FOREACH b_code IN ARRAY batch_codes LOOP
        UPDATE public.projects
        SET due_date = jsonb_set(
          COALESCE(due_date, '{}'::jsonb),
          ARRAY[b_code],
          'null'::jsonb
        )
        WHERE id = proj.id;
      END LOOP;
    END IF;
  END LOOP;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if present and recreate
DROP TRIGGER IF EXISTS trg_sync_milestone_lock_to_projects ON public.milestone_locks;
CREATE TRIGGER trg_sync_milestone_lock_to_projects
  AFTER INSERT OR UPDATE OR DELETE ON public.milestone_locks
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_milestone_lock_to_projects();
