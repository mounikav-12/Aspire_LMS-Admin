/**
 * Project Deadline & Dynamic Due Date Management Utilities
 *
 * Implements dynamic calculation and tracking of project due dates for
 * Mini, Major, and Advanced projects based on unlock/release timestamps
 * for batches and individual students.
 *
 * Requirements:
 * - Mini Project: 3 calendar days after unlock.
 * - Major Project: 5 calendar days after unlock.
 * - Advanced Project: 10 calendar days after unlock (configurable within 8-10 days).
 * - Formula: dueDate = projectUnlockDate + deadlineDays.
 * - Batch-level and student-level release support with independent due dates.
 * - Non-destructive: prevent duplicate unlock events from resetting deadlines.
 * - Consistent timezone and date boundaries without UTC day shifts.
 */

export const DEFAULT_PROJECT_DEADLINES = {
  Mini: 3,
  Major: 5,
  Capstone: 10
};

export const CAPSTONE_PROJECT_MIN_DAYS = 8;
export const CAPSTONE_PROJECT_MAX_DAYS = 10;
export const ADVANCED_PROJECT_MIN_DAYS = 8;
export const ADVANCED_PROJECT_MAX_DAYS = 10;

/**
 * Normalizes project type string to canonical 'Mini', 'Major', or 'Advanced'.
 */
export const normalizeProjectType = (type) => {
  if (!type) return 'Mini';
  const clean = String(type).trim().toLowerCase();
  if (clean.includes('capstone') || clean.includes('advanced')) return 'Capstone';
  if (clean.includes('major')) return 'Major';
  return 'Mini';
};

/**
 * Gets default deadline duration in calendar days for a given project type.
 */
export const getDefaultDeadlineDays = (projectType, customConfig = null) => {
  const norm = normalizeProjectType(projectType);
  if (customConfig && typeof customConfig[norm] === 'number' && customConfig[norm] > 0) {
    return customConfig[norm];
  }
  return DEFAULT_PROJECT_DEADLINES[norm] || 3;
};

/**
 * Validates configured deadline duration for a project type.
 * Advanced projects are constrained to 8-10 calendar days.
 */

export const isDummyPlaceholderDate = (str) => {
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

export const hasFourDigitYear = (dateInput) => {
  if (!dateInput) return false;
  if (dateInput instanceof Date) return !isNaN(dateInput.getTime());
  const str = String(dateInput);
  return /\b(19|20)\d{2}\b/.test(str);
};

export const validateDeadlineDays = (projectType, days) => {
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
 * Parses any date/time string safely into local calendar components: { year, month, day, hours, minutes, seconds }.
 * Avoids timezone drift / UTC offset day-shift bugs.
 */
export const parseLocalDateParts = (dateInput) => {
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
 * Calculates project due date from unlock date and deadline duration.
 * Formula: dueDate = projectUnlockDate + deadlineDays
 *
 * Sets due time to 23:59:59 (end-of-day) to give students the full calendar day.
 */
export const calculateDueDate = (unlockDateInput, durationDays, unlockTimeInput = null) => {
  const parts = parseLocalDateParts(unlockDateInput);
  if (!parts) return null;

  const daysToAdd = Math.max(1, parseInt(durationDays, 10) || 3);

  // Calendar day arithmetic: date.setDate(getDate() + days)
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
 * Calculates remaining time / overdue countdown relative to now.
 */
export const calculateRemainingTime = (dueDateTimeOrDate, nowTimestamp = Date.now()) => {
  if (!dueDateTimeOrDate || isDummyPlaceholderDate(dueDateTimeOrDate) || !hasFourDigitYear(dueDateTimeOrDate)) {
    return {
      isOverdue: false,
      daysLeft: 0,
      hoursLeft: 0,
      label: 'ON_TRACK',
      text: ''
    };
  }
  if (!dueDateTimeOrDate) {
    return {
      isOverdue: false,
      daysLeft: 0,
      hoursLeft: 0,
      label: 'ON_TRACK',
      text: ''
    };
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
    return {
      isOverdue: false,
      daysLeft: 0,
      hoursLeft: 0,
      label: 'ON_TRACK',
      text: ''
    };
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
    return {
      isOverdue: true,
      daysLeft: 0,
      hoursLeft: 0,
      totalHours,
      label: 'OVERDUE',
      text
    };
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

  return {
    isOverdue: false,
    daysLeft: totalDays,
    hoursLeft: remainingHours,
    totalHours,
    label,
    text
  };
};

/**
 * Records or retrieves a batch-level project unlock.
 * PREVENTS duplicate unlock events from resetting an established due date (Requirement 10).
 *
 * @param {Object} project - Project object
 * @param {string} batchCode - Batch identifier (e.g. 'A26W1', 'Weekday Batch')
 * @param {string|Date} unlockDate - Unlock date
 * @param {number|null} customDuration - Custom duration in days
 * @param {boolean} forceReset - Only true when admin explicitly requests recalculation
 * @returns {Object} Updated project record with batchDueDates
 */
export const recordBatchUnlock = (project, batchCode, unlockDate, customDuration = null, forceReset = false) => {
  if (!project || !batchCode) return project;

  const batchKey = String(batchCode).trim();
  const existingBatchDueDates = project.batchDueDates ? { ...project.batchDueDates } : {};
  const existingRecord = existingBatchDueDates[batchKey];

  // Requirement 10: If already unlocked and not forcing an explicit update, PRESERVE existing due date!
  if (existingRecord && existingRecord.dueDate && !forceReset) {
    return {
      ...project,
      batchDueDates: existingBatchDueDates
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

  return {
    ...project,
    batchDueDates: existingBatchDueDates
  };
};

/**
 * Records or retrieves a student-level project unlock.
 * PREVENTS duplicate unlock events from resetting an established student deadline.
 */
export const recordStudentUnlock = (project, studentId, unlockDate, customDuration = null, forceReset = false) => {
  if (!project || !studentId) return project;

  const stdKey = String(studentId).trim();
  const existingStudentDueDates = project.studentDueDates ? { ...project.studentDueDates } : {};
  const existingRecord = existingStudentDueDates[stdKey];

  if (existingRecord && existingRecord.dueDate && !forceReset) {
    return {
      ...project,
      studentDueDates: existingStudentDueDates
    };
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

  return {
    ...project,
    studentDueDates: existingStudentDueDates
  };
};

/**
 * Resolves the effective due date for a project given a batch code and/or student ID.
 *
 * Priority Resolution Order:
 * 1. Student override (project.studentDueDates[studentId])
 * 2. Exact batch match (project.batchDueDates[batchCode])
 * 3. Batch alias / group match (e.g. 'A26W1' matching 'Weekday Batch' or 'ALL')
 * 4. Dynamic calculation from milestoneLocks if unlocked in milestone_locks
 * 5. Legacy project due date fallback (Requirement 11)
 */
export const getEffectiveProjectDueDate = (
  project,
  batchCode = 'ALL',
  studentId = null,
  milestoneLocks = [],
  customTypeConfig = null
) => {
  if (!project) {
    return {
      dueDate: '',
      formattedDueDate: 'No deadline set',
      dueDateTime: null,
      unlockDate: null,
      isOverdue: false,
      remainingText: '',
      source: 'none',
      durationDays: 0
    };
  }

  const projectType = project.type || 'Mini';
  const durationDays = project.deadlineDuration || getDefaultDeadlineDays(projectType, customTypeConfig);

  // 1. Check student-specific override
  if (studentId && project.studentDueDates && project.studentDueDates[studentId]) {
    const sRec = project.studentDueDates[studentId];
    const rem = calculateRemainingTime(sRec.dueDateTime || sRec.dueDate);
    return {
      dueDate: sRec.dueDate,
      dueDateTime: sRec.dueDateTime,
      formattedDueDate: sRec.formattedDueDate || sRec.dueDate,
      formattedDueDateTime: sRec.formattedDueDateTime,
      unlockDate: sRec.unlockDate,
      unlockDateTime: sRec.unlockDateTime,
      durationDays: sRec.durationDays || durationDays,
      isOverdue: rem.isOverdue,
      remainingText: rem.text,
      statusLabel: rem.label,
      source: 'student'
    };
  }

  // 2. Check exact batch match
  const bDates = project.batchDueDates || {};
  if (batchCode && bDates[batchCode]) {
    const bRec = bDates[batchCode];
    const rem = calculateRemainingTime(bRec.dueDateTime || bRec.dueDate);
    return {
      dueDate: bRec.dueDate,
      dueDateTime: bRec.dueDateTime,
      formattedDueDate: bRec.formattedDueDate || bRec.dueDate,
      formattedDueDateTime: bRec.formattedDueDateTime,
      unlockDate: bRec.unlockDate,
      unlockDateTime: bRec.unlockDateTime,
      durationDays: bRec.durationDays || durationDays,
      isOverdue: rem.isOverdue,
      remainingText: rem.text,
      statusLabel: rem.label,
      source: 'batch'
    };
  }

  // 3. Check batch alias / group (e.g. 'Weekday Batch' <-> 'A26W1', 'Weekend Batch' <-> 'A26S1', or 'ALL')
  if (batchCode && batchCode !== 'ALL') {
    const isWeekend = /weekend|a26s|a26we/i.test(batchCode);
    const candidateKeys = isWeekend ? ['Weekend Batch', 'ALL'] : ['Weekday Batch', 'ALL'];
    for (const key of candidateKeys) {
      if (bDates[key]) {
        const bRec = bDates[key];
        const rem = calculateRemainingTime(bRec.dueDateTime || bRec.dueDate);
        return {
          dueDate: bRec.dueDate,
          dueDateTime: bRec.dueDateTime,
          formattedDueDate: bRec.formattedDueDate || bRec.dueDate,
          formattedDueDateTime: bRec.formattedDueDateTime,
          unlockDate: bRec.unlockDate,
          unlockDateTime: bRec.unlockDateTime,
          durationDays: bRec.durationDays || durationDays,
          isOverdue: rem.isOverdue,
          remainingText: rem.text,
          statusLabel: rem.label,
          source: 'batch_alias'
        };
      }
    }
  } else if (batchCode === 'ALL') {
    // If viewing ALL, return the earliest or first available batch due date if present
    const firstKey = Object.keys(bDates)[0];
    if (firstKey) {
      const bRec = bDates[firstKey];
      const rem = calculateRemainingTime(bRec.dueDateTime || bRec.dueDate);
      return {
        dueDate: bRec.dueDate,
        dueDateTime: bRec.dueDateTime,
        formattedDueDate: bRec.formattedDueDate || bRec.dueDate,
        formattedDueDateTime: bRec.formattedDueDateTime,
        unlockDate: bRec.unlockDate,
        unlockDateTime: bRec.unlockDateTime,
        durationDays: bRec.durationDays || durationDays,
        isOverdue: rem.isOverdue,
        remainingText: rem.text,
        statusLabel: rem.label,
        source: 'batch_first'
      };
    }
  }

  // 4. Milestone Locks Table Lookup (Dynamic match from module unlock date)
  if (Array.isArray(milestoneLocks) && milestoneLocks.length > 0) {
    const projId = project.id;
    const modId = project.moduleId || project.innerTopicId || project.module_id;
    const cleanStr = (s) => String(s || '').toLowerCase().replace(/-(w|s)$/i, '').trim();

    const matchingLock = milestoneLocks.find((l) => {
      const isItemMatch = l.lesson_id === projId ||
        cleanStr(l.lesson_id) === cleanStr(projId) ||
        (modId && (l.lesson_id === modId || cleanStr(l.lesson_id) === cleanStr(modId)));
      if (!isItemMatch) return false;
      if (batchCode === 'ALL') return true;
      return l.batch_code === batchCode || l.batch_code === 'ALL' ||
        (/weekend|a26s/i.test(batchCode) && /weekend|a26s/i.test(l.batch_code)) ||
        (/weekday|a26w/i.test(batchCode) && /weekday|a26w/i.test(l.batch_code));
    });

    if (matchingLock && matchingLock.unlock_date) {
      const calc = calculateDueDate(matchingLock.unlock_date, durationDays, matchingLock.unlock_time);
      if (calc) {
        const rem = calculateRemainingTime(calc.dueDateTime);
        return {
          dueDate: calc.dueDate,
          dueDateTime: calc.dueDateTime,
          formattedDueDate: calc.formattedDueDate,
          formattedDueDateTime: calc.formattedDueDateTime,
          unlockDate: calc.unlockDate,
          unlockDateTime: calc.unlockDateTime,
          durationDays,
          isOverdue: rem.isOverdue,
          remainingText: rem.text,
          statusLabel: rem.label,
          source: 'milestone_lock'
        };
      }
    }
  }

  // 5. Fallback if project has an explicit real date with a 4-digit year
  const legacyDueDate = project.dueDate || project.due_date || '';
  if (legacyDueDate && !isDummyPlaceholderDate(legacyDueDate) && hasFourDigitYear(legacyDueDate)) {
    const rem = calculateRemainingTime(legacyDueDate);
    return {
      dueDate: legacyDueDate,
      dueDateTime: null,
      formattedDueDate: legacyDueDate,
      formattedDueDateTime: legacyDueDate,
      unlockDate: null,
      unlockDateTime: null,
      durationDays,
      isOverdue: rem.isOverdue,
      remainingText: rem.text,
      statusLabel: rem.label,
      source: 'legacy'
    };
  }

  // Not yet unlocked for this batch - clear placeholder, show dynamic window
  return {
    dueDate: '',
    dueDateTime: null,
    formattedDueDate: `${durationDays} days after unlock`,
    formattedDueDateTime: `${durationDays} days after unlock`,
    unlockDate: null,
    unlockDateTime: null,
    durationDays,
    isOverdue: false,
    remainingText: '',
    statusLabel: 'PENDING_UNLOCK',
    source: 'pending'
  };
};

/**
 * Validates student submission against calculated deadline.
 */
export const checkSubmissionDeadline = (submissionDateInput, effectiveDueDateTimeOrDate) => {
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
