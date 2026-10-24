/**
 * Project Deadline & Dynamic Due Date Management Utilities (Frontend ES Module)
 *
 * Implements dynamic calculation and tracking of batch-specific project due dates
 * using PostgreSQL JSONB key-value structures where:
 * - Key: The actual batch CODE (e.g., "A26W1", "A26S1", "A26W2", "A26S2").
 * - Value: The project's calculated due date (YYYY-MM-DD), or literal null if locked.
 *
 * Requirements:
 * - Mini: 3 calendar days
 * - Major: 5 calendar days
 * - Capstone: 10 calendar days (configurable 8-10 days)
 * - Formula: dueDate = milestoneUnlockDate + deadlineDays
 * - Batches with locked projects must have JSON null due dates.
 * - Independent batch data: updates to one batch never affect other batches.
 */

const DEFAULT_PROJECT_DEADLINES = {
  Mini: 3,
  Major: 5,
  Capstone: 10
};

const CAPSTONE_PROJECT_MIN_DAYS = 8;
const CAPSTONE_PROJECT_MAX_DAYS = 10;
const ADVANCED_PROJECT_MIN_DAYS = 8;
const ADVANCED_PROJECT_MAX_DAYS = 10;

/**
 * Normalizes project type string to canonical 'Mini', 'Major', or 'Capstone'.
 */
const normalizeProjectType = (type) => {
  if (!type) return 'Mini';
  const clean = String(type).trim().toLowerCase();
  if (clean.includes('capstone') || clean.includes('advanced')) return 'Capstone';
  if (clean.includes('major')) return 'Major';
  return 'Mini';
};

/**
 * Gets default deadline duration in calendar days for a given project type.
 */
const getDefaultDeadlineDays = (projectType, customConfig = null) => {
  const norm = normalizeProjectType(projectType);
  if (customConfig && typeof customConfig[norm] === 'number' && customConfig[norm] > 0) {
    return customConfig[norm];
  }
  return DEFAULT_PROJECT_DEADLINES[norm] || 3;
};

/**
 * Checks if a string is a legacy placeholder rather than a valid date.
 */
const isDummyPlaceholderDate = (str) => {
  if (!str) return true;
  const clean = String(str).trim().toLowerCase();
  return (
    clean === 'sep 30' ||
    clean === 'due sep 30' ||
    clean === 'aug 30' ||
    clean === 'due aug 30' ||
    clean === 'due' ||
    clean === 'tbd' ||
    clean === 'null' ||
    clean === 'undefined'
  );
};

/**
 * Validates whether date input contains a valid 4-digit year.
 */
const hasFourDigitYear = (dateInput) => {
  if (!dateInput) return false;
  if (dateInput instanceof Date) return !isNaN(dateInput.getTime());
  const str = String(dateInput);
  return /\b(19|20)\d{2}\b/.test(str);
};

/**
 * Validates configured deadline duration for a project type.
 */
const validateDeadlineDays = (projectType, days) => {
  const norm = normalizeProjectType(projectType);
  const numDays = parseInt(days, 10);

  if (isNaN(numDays) || numDays <= 0) {
    return {
      isValid: false,
      days: getDefaultDeadlineDays(norm),
      message: 'Deadline must be a positive number of calendar days.'
    };
  }

  if (norm === 'Capstone' || norm === 'Advanced') {
    if (numDays < CAPSTONE_PROJECT_MIN_DAYS) {
      return {
        isValid: false,
        days: CAPSTONE_PROJECT_MIN_DAYS,
        message: `Capstone Project deadlines must be configured between ${CAPSTONE_PROJECT_MIN_DAYS} and ${CAPSTONE_PROJECT_MAX_DAYS} days.`
      };
    }
    if (numDays > CAPSTONE_PROJECT_MAX_DAYS) {
      return {
        isValid: false,
        days: CAPSTONE_PROJECT_MAX_DAYS,
        message: `Capstone Project deadlines must be configured between ${CAPSTONE_PROJECT_MIN_DAYS} and ${CAPSTONE_PROJECT_MAX_DAYS} days.`
      };
    }
  }

  return { isValid: true, days: numDays, message: null };
};

/**
 * Parses date parts without UTC shift issues.
 */
const parseLocalDateParts = (dateInput) => {
  if (!dateInput) return null;

  if (dateInput instanceof Date) {
    if (isNaN(dateInput.getTime())) return null;
    return {
      year: dateInput.getFullYear(),
      month: dateInput.getMonth() + 1,
      day: dateInput.getDate(),
      hours: dateInput.getHours(),
      minutes: dateInput.getMinutes(),
      seconds: dateInput.getSeconds()
    };
  }

  const str = String(dateInput).trim();
  const dateOnlyMatch = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (dateOnlyMatch) {
    const year = parseInt(dateOnlyMatch[1], 10);
    const month = parseInt(dateOnlyMatch[2], 10);
    const day = parseInt(dateOnlyMatch[3], 10);

    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    const timeMatch = str.match(/T(\d{1,2}):(\d{2})(?::(\d{2}))?/i) || str.match(/\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (timeMatch) {
      hours = parseInt(timeMatch[1], 10);
      minutes = parseInt(timeMatch[2], 10);
      seconds = timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;
    }

    return { year, month, day, hours, minutes, seconds };
  }

  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return {
      year: parsed.getFullYear(),
      month: parsed.getMonth() + 1,
      day: parsed.getDate(),
      hours: parsed.getHours(),
      minutes: parsed.getMinutes(),
      seconds: parsed.getSeconds()
    };
  }

  return null;
};

/**
 * Calculates due date from unlock/milestone date and duration in calendar days.
 * Formula: dueDate = milestoneUnlockDate + deadlineDays
 */
const calculateDueDate = (unlockDateInput, durationDays, unlockTimeInput = null) => {
  const parts = parseLocalDateParts(unlockDateInput);
  if (!parts) return null;

  const daysToAdd = Math.max(1, parseInt(durationDays, 10) || 3);

  const baseDate = new Date(parts.year, parts.month - 1, parts.day, parts.hours, parts.minutes, parts.seconds);
  const targetDate = new Date(parts.year, parts.month - 1, parts.day, 23, 59, 59, 999);
  targetDate.setDate(targetDate.getDate() + daysToAdd);

  const unlockYear = baseDate.getFullYear();
  const unlockMonth = String(baseDate.getMonth() + 1).padStart(2, '0');
  const unlockDay = String(baseDate.getDate()).padStart(2, '0');
  const unlockDate = `${unlockYear}-${unlockMonth}-${unlockDay}`;

  const dueYear = targetDate.getFullYear();
  const dueMonth = String(targetDate.getMonth() + 1).padStart(2, '0');
  const dueDay = String(targetDate.getDate()).padStart(2, '0');
  const dueDate = `${dueYear}-${dueMonth}-${dueDay}`;

  const formattedDueDate = targetDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedUnlockDate = baseDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return {
    unlockDate,
    unlockTime: unlockTimeInput || '00:00',
    unlockDateTime: baseDate.toISOString(),
    dueDate,
    dueTime: '23:59:59',
    dueDateTime: targetDate.toISOString(),
    formattedDueDate,
    formattedDueDateTime: `${formattedDueDate}, 11:59 PM`,
    formattedUnlockDate,
    durationDays: daysToAdd
  };
};

/**
 * Calculates remaining time / overdue status.
 */
const calculateRemainingTime = (dueDateTimeOrDate, nowTimestamp = Date.now()) => {
  if (!dueDateTimeOrDate || isDummyPlaceholderDate(dueDateTimeOrDate) || !hasFourDigitYear(dueDateTimeOrDate)) {
    return { isOverdue: false, daysLeft: 0, hoursLeft: 0, label: 'ON_TRACK', text: '' };
  }

  let dueMs;
  if (typeof dueDateTimeOrDate === 'string' && dueDateTimeOrDate.includes('T')) {
    dueMs = new Date(dueDateTimeOrDate).getTime();
  } else if (typeof dueDateTimeOrDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dueDateTimeOrDate.trim())) {
    const parts = parseLocalDateParts(dueDateTimeOrDate);
    dueMs = new Date(parts.year, parts.month - 1, parts.day, 23, 59, 59).getTime();
  } else {
    dueMs = new Date(dueDateTimeOrDate).getTime();
  }

  if (isNaN(dueMs)) {
    return { isOverdue: false, daysLeft: 0, hoursLeft: 0, label: 'ON_TRACK', text: '' };
  }

  const diffMs = dueMs - nowTimestamp;
  const isOverdue = diffMs < 0;
  const absDiff = Math.abs(diffMs);

  const totalHours = Math.floor(absDiff / (1000 * 60 * 60));
  const totalDays = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;

  if (isOverdue) {
    let text = '';
    if (totalDays > 0) {
      text = `Overdue by ${totalDays} day${totalDays > 1 ? 's' : ''}`;
    } else if (totalHours > 0) {
      text = `Overdue by ${totalHours} hr${totalHours > 1 ? 's' : ''}`;
    } else {
      text = 'Overdue by less than 1 hr';
    }
    return { isOverdue: true, daysLeft: 0, hoursLeft: 0, totalHours, label: 'OVERDUE', text };
  }

  let text = '';
  let label = 'ON_TRACK';

  if (totalDays > 1) {
    text = `${totalDays} days remaining`;
  } else if (totalDays === 1) {
    text = `1 day remaining (${remainingHours} hrs)`;
    label = 'DUE_SOON';
  } else if (totalHours > 0) {
    text = `${totalHours} hr${totalHours > 1 ? 's' : ''} remaining`;
    label = 'DUE_TODAY';
  } else {
    const mins = Math.max(1, Math.floor(absDiff / (1000 * 60)));
    text = `${mins} min${mins > 1 ? 's' : ''} remaining`;
    label = 'DUE_TODAY';
  }

  return { isOverdue: false, daysLeft: totalDays, hoursLeft: remainingHours, totalHours, label, text };
};

// ============================================================================
// BATCH-WISE DUE DATES JSON / JSONB SYSTEM (Key: Batch Code)
// ============================================================================

/**
 * Resolves an identifier (which could be a batch ID, code, or alias) to its canonical batch code.
 */
const resolveBatchCode = (identifier, batchesList = []) => {
  if (!identifier) return '';
  const clean = String(identifier).trim();
  if (Array.isArray(batchesList) && batchesList.length > 0) {
    const lower = clean.toLowerCase();
    const matched = batchesList.find(b => {
      if (typeof b === 'string') return b.toLowerCase() === lower;
      return (
        String(b.id || '').toLowerCase() === lower ||
        String(b.code || '').toLowerCase() === lower ||
        String(b.name || '').toLowerCase() === lower
      );
    });
    if (matched) {
      if (typeof matched === 'string') return matched.trim();
      if (matched.code) return matched.code.trim();
    }
  }
  return clean;
};

/**
 * Safely parses batch due dates from a JSON object, JSONB string, or legacy field.
 * Returns a normalized key-value object where:
 * - Key: Batch CODE (e.g. "A26W1", "A26S1")
 * - Value: ISO Date string (YYYY-MM-DD), or literal null.
 */
const parseBatchDueDates = (dueDatesInput, batchesList = []) => {
  if (!dueDatesInput) return {};

  let rawMap = dueDatesInput;
  if (typeof dueDatesInput === 'string') {
    const trimmed = dueDatesInput.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        rawMap = JSON.parse(trimmed);
      } catch (e) {
        return {};
      }
    } else {
      return {};
    }
  }

  if (typeof rawMap !== 'object' || rawMap === null || Array.isArray(rawMap)) {
    return {};
  }

  const normalized = {};
  for (const [key, val] of Object.entries(rawMap)) {
    if (!key) continue;
    const cleanKey = resolveBatchCode(key, batchesList);

    if (val === null || val === undefined || val === '' || val === 'null' || val === 'None' || val === 'undefined') {
      normalized[cleanKey] = null;
    } else if (typeof val === 'string') {
      const trimmedVal = val.trim();
      const match = trimmedVal.match(/^(\d{4}-\d{2}-\d{2})/);
      if (match) {
        normalized[cleanKey] = match[1];
      } else if (isDummyPlaceholderDate(trimmedVal)) {
        normalized[cleanKey] = null;
      } else if (hasFourDigitYear(trimmedVal)) {
        const parts = parseLocalDateParts(trimmedVal);
        if (parts) {
          const y = parts.year;
          const m = String(parts.month).padStart(2, '0');
          const d = String(parts.day).padStart(2, '0');
          normalized[cleanKey] = `${y}-${m}-${d}`;
        } else {
          normalized[cleanKey] = null;
        }
      } else {
        normalized[cleanKey] = null;
      }
    } else if (typeof val === 'object' && val !== null) {
      const d = val.dueDate || val.due_date;
      if (d && hasFourDigitYear(d)) {
        const parts = parseLocalDateParts(d);
        if (parts) {
          const y = parts.year;
          const m = String(parts.month).padStart(2, '0');
          const dStr = String(parts.day).padStart(2, '0');
          normalized[cleanKey] = `${y}-${m}-${dStr}`;
        } else {
          normalized[cleanKey] = null;
        }
      } else {
        normalized[cleanKey] = null;
      }
    } else {
      normalized[cleanKey] = null;
    }
  }

  return normalized;
};

/**
 * Initializes batch due dates for a list of batch codes.
 * Requirement 3: Locked batches must have literal null due dates.
 */
const initializeBatchDueDates = (allBatchCodes = [], existingDueDates = {}, batchesList = []) => {
  const current = parseBatchDueDates(existingDueDates, batchesList);
  const result = {};

  for (const [k, v] of Object.entries(current)) {
    const cleanK = resolveBatchCode(k, batchesList);
    result[cleanK] = v;
  }

  for (const bCode of allBatchCodes) {
    if (!bCode) continue;
    const cleanCode = resolveBatchCode(bCode, batchesList);
    if (result[cleanCode] === undefined) {
      result[cleanCode] = null;
    }
  }

  if (Array.isArray(batchesList) && batchesList.length > 0) {
    for (const b of batchesList) {
      if (b.id && b.code && b.id !== b.code && result[b.id] !== undefined) {
        if (result[b.code] === undefined || result[b.code] === null) {
          result[b.code] = result[b.id];
        }
        delete result[b.id];
      }
    }
  }

  return result;
};

/**
 * Updates a specific batch code's due date in a project's batch map without affecting other batches.
 */
const updateProjectBatchDueDate = (
  currentDueDates,
  batchCodeOrId,
  newDueDateOrNull,
  allBatchCodes = [],
  batchesList = []
) => {
  if (!batchCodeOrId) return parseBatchDueDates(currentDueDates, batchesList);

  const targetBatchCode = resolveBatchCode(batchCodeOrId, batchesList);
  const current = parseBatchDueDates(currentDueDates, batchesList);
  const result = { ...current };

  if (Array.isArray(allBatchCodes)) {
    for (const code of allBatchCodes) {
      if (!code) continue;
      const clean = resolveBatchCode(code, batchesList);
      if (result[clean] === undefined) {
        result[clean] = null;
      }
    }
  }

  let finalValue = null;
  if (newDueDateOrNull && !isDummyPlaceholderDate(newDueDateOrNull) && hasFourDigitYear(newDueDateOrNull)) {
    const parts = parseLocalDateParts(newDueDateOrNull);
    if (parts) {
      const y = parts.year;
      const m = String(parts.month).padStart(2, '0');
      const d = String(parts.day).padStart(2, '0');
      finalValue = `${y}-${m}-${d}`;
    }
  }

  result[targetBatchCode] = finalValue;

  if (Array.isArray(batchesList) && batchesList.length > 0) {
    const matched = batchesList.find(b => b.code === targetBatchCode);
    if (matched && matched.id && matched.id !== targetBatchCode && result[matched.id] !== undefined) {
      delete result[matched.id];
    }
  }

  return result;
};

/**
 * Atomic batch due date update helper for concurrency safety.
 */
const atomicMergeBatchDueDates = (currentMap, batchCodeOrId, newDateOrNull, batchesList = []) => {
  const parsed = parseBatchDueDates(currentMap, batchesList);
  const cleanCode = resolveBatchCode(batchCodeOrId, batchesList);
  let cleanDate = null;
  if (newDateOrNull && hasFourDigitYear(newDateOrNull)) {
    const parts = parseLocalDateParts(newDateOrNull);
    if (parts) {
      cleanDate = `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`;
    }
  }
  return {
    ...parsed,
    [cleanCode]: cleanDate
  };
};

/**
 * Calculates due date for a project when a milestone is announced for a batch.
 */
const calculateBatchProjectDueDate = (project, unlockDate, customDuration = null) => {
  if (!project || !unlockDate) return null;
  const projectType = project.type || 'Mini';
  const durationDays = customDuration !== null && customDuration !== undefined
    ? parseInt(customDuration, 10)
    : (project.deadlineDuration || getDefaultDeadlineDays(projectType));

  return calculateDueDate(unlockDate, durationDays);
};

/**
 * Backward-compatible unlock recorder.
 */
const recordBatchUnlock = (
  project,
  batchCodeOrId,
  unlockDate,
  customDuration = null,
  forceReset = false,
  allBatchCodes = [],
  batchesList = []
) => {
  if (!project || !batchCodeOrId) return project;

  const batchKey = resolveBatchCode(batchCodeOrId, batchesList);
  const existingBatchDueDates = project.batchDueDates ? { ...project.batchDueDates } : {};
  const currentJsonDueDates = parseBatchDueDates(project.due_date || project.dueDate || project.due_dates, batchesList);

  if (existingBatchDueDates[batchKey]?.dueDate && !forceReset) {
    return {
      ...project,
      batchDueDates: existingBatchDueDates,
      due_date: currentJsonDueDates
    };
  }

  const durationDays = customDuration !== null && customDuration !== undefined
    ? parseInt(customDuration, 10)
    : (project.deadlineDuration || getDefaultDeadlineDays(project.type));

  const calc = calculateDueDate(unlockDate, durationDays);
  if (!calc) return project;

  existingBatchDueDates[batchKey] = {
    ...calc,
    batchCode: batchKey,
    isLocked: false,
    updatedAt: new Date().toISOString()
  };

  const updatedJsonMap = updateProjectBatchDueDate(currentJsonDueDates, batchKey, calc.dueDate, allBatchCodes, batchesList);

  return {
    ...project,
    batchDueDates: existingBatchDueDates,
    due_date: updatedJsonMap,
    dueDate: calc.dueDate
  };
};

/**
 * Resolves effective due date for a project for a specific batch or student.
 * Features a Self-Healing Fallback: if project.due_date[batchCode] is null in the database
 * but an unlocked milestone lock exists in milestoneLocks, it calculates the due date on the fly
 * so the user never sees "Not unlocked" / "No due date" for an unlocked milestone.
 */
const getEffectiveProjectDueDate = (
  project,
  batchCode = 'ALL',
  studentId = null,
  milestoneLocks = [],
  customTypeConfig = null,
  batchesList = [],
  onSelfHeal = null
) => {
  if (!project) {
    return {
      dueDate: null,
      formattedDueDate: 'Not unlocked',
      dueDateTime: null,
      unlockDate: null,
      isLocked: true,
      isOverdue: false,
      remainingText: '',
      statusLabel: 'LOCKED',
      source: 'none',
      durationDays: 0
    };
  }

  const projectType = project.type || 'Mini';
  const durationDays = project.deadlineDuration || getDefaultDeadlineDays(projectType, customTypeConfig);

  // 1. Student override
  if (studentId && project.studentDueDates && project.studentDueDates[studentId]) {
    const sRec = project.studentDueDates[studentId];
    const rem = calculateRemainingTime(sRec.dueDateTime || sRec.dueDate);
    const parts = parseLocalDateParts(sRec.dueDate);
    const formatted = parts
      ? new Date(parts.year, parts.month - 1, parts.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : sRec.dueDate;

    return {
      dueDate: sRec.dueDate,
      dueDateTime: sRec.dueDateTime || (sRec.dueDate ? `${sRec.dueDate}T23:59:59.000Z` : null),
      formattedDueDate: formatted,
      formattedDueDateTime: sRec.formattedDueDateTime,
      unlockDate: sRec.unlockDate,
      unlockDateTime: sRec.unlockDateTime,
      durationDays: sRec.durationDays || durationDays,
      isLocked: false,
      isOverdue: rem.isOverdue,
      remainingText: rem.text,
      statusLabel: rem.label,
      source: 'student'
    };
  }

  // 2. Parse batch-wise due dates JSON
  const batchJsonMap = parseBatchDueDates(project.due_date || project.dueDate || project.due_dates, batchesList);
  const richBatchDates = project.batchDueDates || {};
  const cleanTarget = String(batchCode || 'ALL').trim();

  const formatDateStr = (dateStr) => {
    if (!dateStr) return 'Not unlocked';
    const parts = parseLocalDateParts(dateStr);
    if (!parts) return dateStr;
    return new Date(parts.year, parts.month - 1, parts.day).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const buildResult = (dateVal, sourceLabel, richRec = null) => {
    if (!dateVal) {
      return {
        dueDate: null,
        formattedDueDate: 'Not unlocked',
        dueDateTime: null,
        unlockDate: null,
        unlockDateTime: null,
        durationDays,
        isLocked: true,
        isOverdue: false,
        remainingText: '',
        statusLabel: 'LOCKED',
        source: sourceLabel
      };
    }

    const cleanDate = String(dateVal).slice(0, 10);
    const dueDateTime = richRec?.dueDateTime || `${cleanDate}T23:59:59.000Z`;
    const rem = calculateRemainingTime(dueDateTime);
    const formattedDueDate = formatDateStr(cleanDate);

    return {
      dueDate: cleanDate,
      dueDateTime,
      formattedDueDate,
      formattedDueDateTime: `${formattedDueDate}, 11:59 PM`,
      unlockDate: richRec?.unlockDate || null,
      unlockDateTime: richRec?.unlockDateTime || null,
      durationDays: richRec?.durationDays || durationDays,
      isLocked: false,
      isOverdue: rem.isOverdue,
      remainingText: rem.text,
      statusLabel: rem.label,
      source: sourceLabel
    };
  };

  // Helper: Find matching lock from milestoneLocks array across all hierarchy levels
  const findMatchingMilestoneLock = (targetCode, onlyUnlocked = false) => {
    if (!Array.isArray(milestoneLocks) || milestoneLocks.length === 0) return null;

    const projId = project.id;
    const innerId = project.inner_topic_id || project.innerTopicId;
    const modId = project.moduleId || project.module_id;
    const subId = project.subtopic_id || project.subtopicId;
    const stgId = project.stage_id || project.stageId;
    const cleanStr = (s) => String(s || '').toLowerCase().replace(/-(w|s)$/i, '').trim();

    const cProj = cleanStr(projId);
    const cInner = cleanStr(innerId);
    const cMod = cleanStr(modId);
    const cSub = cleanStr(subId);
    const cStg = cleanStr(stgId);

    return milestoneLocks.find((l) => {
      if (onlyUnlocked && (l.is_locked || !l.unlock_date)) return false;

      const lLesson = cleanStr(l.lesson_id);
      const lModule = cleanStr(l.module_id);
      const lStage = cleanStr(l.stage_id);

      const isItemMatch =
        (lLesson && (lLesson === cProj || lLesson === cInner || lLesson === cMod || lLesson === cSub || lLesson === cStg)) ||
        (lModule && (lModule === cMod || lModule === cSub || lModule === cProj || lModule === cInner)) ||
        (lStage && cStg && lStage === cStg);

      if (!isItemMatch) return false;
      if (!targetCode || targetCode === 'ALL') return true;

      return (
        l.batch_code === targetCode ||
        l.batch_code === 'ALL' ||
        (/weekend|a26s/i.test(targetCode) && /weekend|a26s/i.test(l.batch_code)) ||
        (/weekday|a26w/i.test(targetCode) && /weekday|a26w/i.test(l.batch_code))
      );
    });
  };

  // If query is for 'ALL'
  if (cleanTarget === 'ALL') {
    const entries = Object.entries(batchJsonMap);
    if (entries.length > 0) {
      const unlocked = entries.filter(([_, v]) => v !== null && v !== undefined && hasFourDigitYear(v));
      if (unlocked.length > 0) {
        unlocked.sort((a, b) => new Date(a[1]).getTime() - new Date(b[1]).getTime());
        const [earliestBatchCode, earliestDate] = unlocked[0];
        const richRec = richBatchDates[earliestBatchCode] || null;
        return buildResult(earliestDate, 'batch_all_active', richRec);
      }
    }

    // Check milestoneLocks for any unlocked lock for ALL batches
    const unlockedLock = findMatchingMilestoneLock('ALL', true);
    if (unlockedLock) {
      const calc = calculateDueDate(unlockedLock.unlock_date, durationDays, unlockedLock.unlock_time);
      if (calc) {
        return buildResult(calc.dueDate, 'milestone_fallback_all', calc);
      }
    }

    return buildResult(null, 'batch_all_locked');
  }

  // 3. Exact batch code lookup
  const targetBatchCode = resolveBatchCode(cleanTarget, batchesList);
  const directValue = (targetBatchCode && batchJsonMap[targetBatchCode] !== undefined)
    ? batchJsonMap[targetBatchCode]
    : batchJsonMap[cleanTarget];

  // If a valid date string is already present in batch JSON, return it immediately
  if (directValue && hasFourDigitYear(directValue) && !isDummyPlaceholderDate(directValue)) {
    const richRec = richBatchDates[targetBatchCode] || richBatchDates[cleanTarget] || null;
    return buildResult(directValue, 'batch', richRec);
  }

  // Check richBatchDates exact match
  if (richBatchDates[targetBatchCode]?.dueDate && hasFourDigitYear(richBatchDates[targetBatchCode].dueDate)) {
    const bRec = richBatchDates[targetBatchCode];
    return buildResult(bRec.dueDate, 'batch_rich', bRec);
  }
  if (richBatchDates[cleanTarget]?.dueDate && hasFourDigitYear(richBatchDates[cleanTarget].dueDate)) {
    const bRec = richBatchDates[cleanTarget];
    return buildResult(bRec.dueDate, 'batch_rich', bRec);
  }

  // 4. Batch Category / Alias Lookup
  if (cleanTarget !== 'ALL') {
    const isWeekend = /weekend|a26s|a26we/i.test(cleanTarget);
    const candidateAliases = isWeekend
      ? ['A26S1', 'A26S2', 'Weekend Batch', 'weekend']
      : ['A26W1', 'A26W2', 'Weekday Batch', 'weekday'];

    for (const alias of candidateAliases) {
      const aliasVal = batchJsonMap[alias];
      if (aliasVal && hasFourDigitYear(aliasVal) && !isDummyPlaceholderDate(aliasVal)) {
        return buildResult(aliasVal, 'batch_alias', richBatchDates[alias] || null);
      }
      if (richBatchDates[alias]?.dueDate && hasFourDigitYear(richBatchDates[alias].dueDate)) {
        return buildResult(richBatchDates[alias].dueDate, 'batch_alias_rich', richBatchDates[alias]);
      }
    }
  }

  // 5. SELF-HEALING FALLBACK: Check milestoneLocks table
  // If the batch had null in the database (or was not yet synced), inspect milestoneLocks.
  // If milestoneLocks has an UNLOCKED record for this milestone, calculate the dynamic due date
  // immediately so the student/admin sees the correct date, and optionally trigger self-healing.
  const activeLock = findMatchingMilestoneLock(targetBatchCode || cleanTarget);
  if (activeLock) {
    if (activeLock.is_locked || !activeLock.unlock_date) {
      // Confirmed locked by milestone lock
      return buildResult(null, 'milestone_lock_confirmed_locked');
    }

    const calc = calculateDueDate(activeLock.unlock_date, durationDays, activeLock.unlock_time);
    if (calc) {
      // Trigger background self-healing write-back if callback provided
      if (typeof onSelfHeal === 'function') {
        try {
          onSelfHeal(project.id, targetBatchCode || cleanTarget, calc.dueDate);
        } catch (e) {}
      }
      return buildResult(calc.dueDate, 'milestone_self_heal_fallback', calc);
    }
  }

  // 6. If batch had explicit null in database and no unlocked milestone lock was found, it is locked
  if (directValue === null) {
    return buildResult(null, 'batch_explicit_null');
  }

  // 7. Backward-compatible Legacy single-date fallback
  const legacyDueDate = typeof project.dueDate === 'string' && !project.dueDate.startsWith('{')
    ? project.dueDate
    : (typeof project.due_date === 'string' && !project.due_date.startsWith('{') ? project.due_date : '');

  if (legacyDueDate && !isDummyPlaceholderDate(legacyDueDate) && hasFourDigitYear(legacyDueDate)) {
    return buildResult(legacyDueDate, 'legacy');
  }

  return {
    dueDate: null,
    formattedDueDate: 'Not unlocked',
    dueDateTime: null,
    unlockDate: null,
    unlockDateTime: null,
    durationDays,
    isLocked: true,
    isOverdue: false,
    remainingText: '',
    statusLabel: 'LOCKED',
    source: 'pending'
  };
};

/**
 * Validates student submission against calculated deadline.
 */
const checkSubmissionDeadline = (submissionDateInput, effectiveDueDateTimeOrDate) => {
  if (!submissionDateInput || !effectiveDueDateTimeOrDate) {
    return { isLate: false, label: 'ON_TIME', delayText: '' };
  }

  const subParts = parseLocalDateParts(submissionDateInput);
  const dueParts = parseLocalDateParts(effectiveDueDateTimeOrDate);
  if (!subParts || !dueParts) {
    return { isLate: false, label: 'ON_TIME', delayText: '' };
  }

  const subDate = new Date(subParts.year, subParts.month - 1, subParts.day, subParts.hours, subParts.minutes, subParts.seconds);
  const dueDate = new Date(dueParts.year, dueParts.month - 1, dueParts.day, dueParts.hours, dueParts.minutes, dueParts.seconds);

  const diffMs = subDate.getTime() - dueDate.getTime();
  if (diffMs <= 0) {
    return { isLate: false, label: 'ON_TIME', delayText: 'Submitted on time' };
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  const delayText = diffDays > 0
    ? `Submitted late by ${diffDays} day${diffDays > 1 ? 's' : ''}`
    : `Submitted late by ${diffHours} hour${diffHours > 1 ? 's' : ''}`;

  return {
    isLate: true,
    label: 'OVERDUE',
    delayText
  };
};

const recordStudentUnlock = (project, studentId, unlockDate, customDuration = null, forceReset = false) => {
  if (!project || !studentId) return project;
  const stdKey = String(studentId).trim();
  const existingStudentDueDates = project.studentDueDates ? { ...project.studentDueDates } : {};
  const existingRecord = existingStudentDueDates[stdKey];

  if (existingRecord && existingRecord.dueDate && !forceReset) {
    return { ...project, studentDueDates: existingStudentDueDates };
  }

  const durationDays = customDuration !== null && customDuration !== undefined
    ? parseInt(customDuration, 10)
    : (project.deadlineDuration || getDefaultDeadlineDays(project.type));

  const calc = calculateDueDate(unlockDate, durationDays);
  if (!calc) return project;

  existingStudentDueDates[stdKey] = {
    ...calc,
    studentId: stdKey,
    isLocked: false,
    updatedAt: new Date().toISOString()
  };

  return { ...project, studentDueDates: existingStudentDueDates };
};

module.exports = {
  DEFAULT_PROJECT_DEADLINES,
  CAPSTONE_PROJECT_MIN_DAYS,
  CAPSTONE_PROJECT_MAX_DAYS,
  ADVANCED_PROJECT_MIN_DAYS,
  ADVANCED_PROJECT_MAX_DAYS,
  normalizeProjectType,
  getDefaultDeadlineDays,
  isDummyPlaceholderDate,
  hasFourDigitYear,
  validateDeadlineDays,
  parseLocalDateParts,
  calculateDueDate,
  calculateRemainingTime,
  resolveBatchCode,
  parseBatchDueDates,
  initializeBatchDueDates,
  updateProjectBatchDueDate,
  atomicMergeBatchDueDates,
  calculateBatchProjectDueDate,
  recordBatchUnlock,
  getEffectiveProjectDueDate,
  checkSubmissionDeadline,
  recordStudentUnlock
};
