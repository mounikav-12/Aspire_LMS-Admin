// Helper to get local date as YYYY-MM-DD string without UTC offset issues
export const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Robust date & time parser across all string formats (YYYY-MM-DD, HH:MM, HH:MM AM/PM, HH:MM - HH:MM, ISO)
export const parseUnlockDateTime = (unlockDate, unlockTime, unlockDateTime) => {
  if (!unlockDate && !unlockDateTime) return null;

  if (unlockDate) {
    const rawDate = String(unlockDate).split('T')[0];
    const parts = rawDate.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);

      let hours = 0;
      let minutes = 0;

      if (unlockTime) {
        const timeStr = String(unlockTime);
        const match = timeStr.match(/(\d{1,2}):(\d{2})/);
        if (match) {
          hours = parseInt(match[1], 10);
          minutes = parseInt(match[2], 10);
          if (/pm/i.test(timeStr) && hours < 12) {
            hours += 12;
          } else if (/am/i.test(timeStr) && hours === 12) {
            hours = 0;
          }
        }
      }

      const parsed = new Date(year, month, day, hours, minutes, 0);
      if (!isNaN(parsed.getTime())) return parsed;
    }
  }

  if (unlockDateTime) {
    const d = new Date(unlockDateTime);
    if (!isNaN(d.getTime())) return d;
  }

  const fallback = new Date(unlockDateTime || unlockDate);
  return isNaN(fallback.getTime()) ? null : fallback;
};

// Pure Date & Time Release Determination Helper with Hierarchy Inheritance & Live Timestamp Support
export const getScheduleInfo = (item, parentSchedule = null, nowTimestamp = Date.now()) => {
  if (!item) {
    return {
      hasSchedule: false,
      isUnlocked: false,
      isLocked: true,
      unlockDate: '',
      unlockTime: '',
      unlockDateTime: null,
      dateFormatted: '',
      timeFormatted: '',
      fullFormatted: 'Release date not set',
      shortFormatted: 'No date set',
      relativeText: 'Locked',
      statusLabel: 'LOCKED',
      inherited: false
    };
  }

  // 1. If parent schedule is explicitly LOCKED (e.g. parent Stage is scheduled for future), child inherits lock
  if (parentSchedule && parentSchedule.isLocked) {
    return {
      hasSchedule: parentSchedule.hasSchedule,
      isUnlocked: false,
      isLocked: true,
      unlockDate: parentSchedule.unlockDate,
      unlockTime: parentSchedule.unlockTime,
      unlockDateTime: parentSchedule.unlockDateTime,
      dateFormatted: parentSchedule.dateFormatted,
      timeFormatted: parentSchedule.timeFormatted,
      fullFormatted: parentSchedule.fullFormatted,
      shortFormatted: parentSchedule.shortFormatted,
      relativeText: parentSchedule.relativeText,
      statusLabel: 'LOCKED',
      inherited: true
    };
  }

  const unlockDate = item.unlockDate || '';
  const unlockTime = item.unlockTime || '';
  const unlockDateTime = item.unlockDateTime || (unlockDate ? `${unlockDate}T${unlockTime || '00:00'}` : '');

  // 2. If child item does NOT have its own specific date/time set:
  if (!unlockDate && !unlockDateTime) {
    if (parentSchedule && parentSchedule.isUnlocked) {
      return {
        hasSchedule: parentSchedule.hasSchedule,
        isUnlocked: true,
        isLocked: false,
        unlockDate: parentSchedule.unlockDate,
        unlockTime: parentSchedule.unlockTime,
        unlockDateTime: parentSchedule.unlockDateTime,
        dateFormatted: parentSchedule.dateFormatted,
        timeFormatted: parentSchedule.timeFormatted,
        fullFormatted: parentSchedule.fullFormatted,
        shortFormatted: parentSchedule.shortFormatted,
        relativeText: 'Released',
        statusLabel: 'UNLOCKED',
        inherited: true
      };
    }

    return {
      hasSchedule: false,
      isUnlocked: true,
      isLocked: false,
      unlockDate: '',
      unlockTime: '',
      unlockDateTime: null,
      dateFormatted: '',
      timeFormatted: '',
      fullFormatted: 'Available',
      shortFormatted: 'Available',
      relativeText: 'Released',
      statusLabel: 'UNLOCKED',
      inherited: false
    };
  }

  // 3. Item has its OWN specific scheduled date & time
  const parsedDate = parseUnlockDateTime(unlockDate, unlockTime, unlockDateTime);
  if (!parsedDate) {
    return {
      hasSchedule: false,
      isUnlocked: true,
      isLocked: false,
      unlockDate,
      unlockTime,
      unlockDateTime,
      dateFormatted: '',
      timeFormatted: '',
      fullFormatted: 'Available',
      shortFormatted: 'Available',
      relativeText: 'Released',
      statusLabel: 'UNLOCKED',
      inherited: false
    };
  }

  const targetTime = parsedDate.getTime();
  const isUnlocked = nowTimestamp >= targetTime;
  const isLocked = !isUnlocked;

  const dateFormatted = parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeFormatted = parsedDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const diffMs = targetTime - nowTimestamp;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  let relativeText = '';
  if (isLocked) {
    if (diffDays > 0) {
      relativeText = `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      relativeText = `in ${diffHours} hr${diffHours > 1 ? 's' : ''}`;
    } else {
      const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
      relativeText = `in ${diffMins} min${diffMins > 1 ? 's' : ''}`;
    }
  } else {
    relativeText = 'Released';
  }

  return {
    hasSchedule: true,
    isUnlocked,
    isLocked,
    unlockDate,
    unlockTime,
    unlockDateTime,
    dateFormatted,
    timeFormatted,
    fullFormatted: `${dateFormatted} at ${timeFormatted}`,
    shortFormatted: `${dateFormatted}, ${timeFormatted}`,
    relativeText,
    statusLabel: isUnlocked ? 'UNLOCKED' : 'LOCKED',
    inherited: false
  };
};
