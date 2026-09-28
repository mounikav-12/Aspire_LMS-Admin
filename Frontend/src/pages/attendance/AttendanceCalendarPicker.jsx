import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock,
  Lock,
  Sparkles
} from 'lucide-react';

// Format YYYY-MM-DD to readable string like "20 Sep 2026"
export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/**
 * Premium custom calendar date picker for Attendance.
 * Replaces the native browser date input with an elegant popover that:
 * - Highlights completed attendance dates in GREEN
 * - Highlights uncompleted/missed attendance dates in RED
 * - Disables future dates (prevents selection)
 * - Identifies Today and Selected Date with distinct visual accents
 */
export function AttendanceCalendarPicker({
  value,
  onChange,
  maxDate,
  batchCode = null,
  attendanceData = {},
  availableBatches = [],
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  // Parse current active value or fallback to today
  const [initialYear, initialMonth] = useMemo(() => {
    if (value) {
      const [y, m] = value.split('-').map(Number);
      return [y, m - 1];
    }
    const now = new Date();
    return [now.getFullYear(), now.getMonth()];
  }, [value]);

  const [viewYear, setViewYear] = useState(initialYear);
  const [viewMonth, setViewMonth] = useState(initialMonth);

  // Sync view month/year when value changes externally
  useEffect(() => {
    if (value) {
      const [y, m] = value.split('-').map(Number);
      setViewYear(y);
      setViewMonth(m - 1);
    }
  }, [value]);

  // Handle outside click to close popover
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  // Max date (today) details
  const maxYearMonth = useMemo(() => {
    if (!maxDate) return null;
    const [my, mm] = maxDate.split('-').map(Number);
    return { year: my, month: mm - 1 };
  }, [maxDate]);

  // Month navigation helpers
  const canGoNextMonth = useMemo(() => {
    if (!maxYearMonth) return true;
    if (viewYear < maxYearMonth.year) return true;
    if (viewYear === maxYearMonth.year && viewMonth < maxYearMonth.month) return true;
    return false;
  }, [viewYear, viewMonth, maxYearMonth]);

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (!canGoNextMonth) return;
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleJumpToToday = (e) => {
    e.stopPropagation();
    if (maxDate) {
      onChange(maxDate);
      const [my, mm] = maxDate.split('-').map(Number);
      setViewYear(my);
      setViewMonth(mm - 1);
      setIsOpen(false);
    }
  };

  // Calendar Grid generation for viewYear & viewMonth
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

    const days = [];

    // Trailing days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        dateStr: null
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const mStr = String(viewMonth + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      const dateStr = `${viewYear}-${mStr}-${dStr}`;

      const isFuture = maxDate ? dateStr > maxDate : false;
      const isToday = maxDate ? dateStr === maxDate : false;
      const isSelected = dateStr === value;

      // Determine attendance status for this date:
      // 'completed' | 'not_completed' | 'today_pending' | 'future'
      let status = 'not_completed';
      if (isFuture) {
        status = 'future';
      } else if (batchCode) {
        const batchRecords = attendanceData[batchCode]?.[dateStr];
        if (batchRecords && Object.keys(batchRecords).length > 0) {
          const marked = Object.values(batchRecords).filter((r) => r && r.status !== null);
          if (marked.length > 0) {
            status = 'completed';
          } else if (isToday) {
            status = 'today_pending';
          } else {
            status = 'not_completed';
          }
        } else if (isToday) {
          status = 'today_pending';
        } else {
          status = 'not_completed';
        }
      } else {
        // View A: Across all batches
        const batches = availableBatches || [];
        const anyMarked = batches.some((b) => {
          const recs = attendanceData[b]?.[dateStr];
          return recs && Object.values(recs).some((r) => r && r.status !== null);
        });

        if (anyMarked) {
          status = 'completed';
        } else if (isToday) {
          status = 'today_pending';
        } else {
          status = 'not_completed';
        }
      }

      days.push({
        day: d,
        isCurrentMonth: true,
        dateStr,
        isFuture,
        isToday,
        isSelected,
        status
      });
    }

    // Fill remaining grid spaces (up to 35 or 42)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        dateStr: null
      });
    }

    return days;
  }, [viewYear, viewMonth, value, maxDate, batchCode, attendanceData, availableBatches]);

  // Selected date status for the trigger button badge
  const selectedDateStatus = useMemo(() => {
    if (!value) return null;
    if (maxDate && value > maxDate) return 'future';
    if (maxDate && value === maxDate) return 'today';

    if (batchCode) {
      const recs = attendanceData[batchCode]?.[value];
      if (recs && Object.values(recs).some((r) => r && r.status !== null)) return 'completed';
      return 'not_completed';
    } else {
      const batches = availableBatches || [];
      const anyMarked = batches.some((b) => {
        const recs = attendanceData[b]?.[value];
        return recs && Object.values(recs).some((r) => r && r.status !== null);
      });
      return anyMarked ? 'completed' : 'not_completed';
    }
  }, [value, maxDate, batchCode, attendanceData, availableBatches]);

  const handleSelectDate = (dateItem) => {
    if (!dateItem.isCurrentMonth || dateItem.isFuture) return;
    onChange(dateItem.dateStr);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={popoverRef}>
      {/* Trigger Button - Replaces native date input */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-150 cursor-pointer select-none text-xs md:text-sm font-extrabold shadow-2xs ${
          isOpen
            ? 'bg-blue-50/70 border-blue-500 text-blue-900 ring-2 ring-blue-500/20'
            : 'bg-white border-slate-200/90 text-slate-800 hover:border-blue-400 hover:bg-slate-50/70'
        }`}
        title="Open Attendance Calendar"
      >
        <div
          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
            isOpen ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
          }`}
        >
          <CalendarIcon className="w-3.5 h-3.5" />
        </div>

        <span className="tracking-tight">{formatDisplayDate(value)}</span>

        {/* Selected Date Status Pill */}
        {selectedDateStatus === 'completed' && (
          <span
            className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200"
            title="Attendance Completed for this date"
          />
        )}
        {selectedDateStatus === 'not_completed' && (
          <span
            className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-rose-200"
            title="Attendance Not Completed on this past date"
          />
        )}
        {selectedDateStatus === 'today' && (
          <span
            className="w-2 h-2 rounded-full bg-blue-500 ring-2 ring-blue-200 animate-pulse"
            title="Today"
          />
        )}

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ml-0.5 ${
            isOpen ? 'rotate-180 text-blue-600' : 'group-hover:text-slate-600'
          }`}
        />
      </button>

      {/* Floating Custom Calendar Popover */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 sm:right-0 sm:left-auto z-50 w-76 sm:w-80 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          {/* Header Month / Year Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>{MONTH_NAMES[viewMonth]}</span>
                <span className="text-slate-400 font-bold">{viewYear}</span>
              </h3>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNextMonth}
                disabled={!canGoNextMonth}
                className={`p-1.5 rounded-lg transition-colors ${
                  !canGoNextMonth
                    ? 'text-slate-200 cursor-not-allowed opacity-40'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer'
                }`}
                title={canGoNextMonth ? 'Next Month' : 'Future months not available'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 pt-3 pb-1 text-center">
            {WEEKDAYS.map((wd, i) => (
              <div
                key={wd}
                className={`text-[11px] font-black uppercase tracking-wider ${
                  i === 0 || i === 6 ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {wd}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 py-1">
            {calendarDays.map((item, idx) => {
              if (!item.isCurrentMonth) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="h-8 md:h-9 flex items-center justify-center text-xs text-slate-300 select-none opacity-25"
                  >
                    {item.day}
                  </div>
                );
              }

              // Visual styling based on status
              const isFuture = item.isFuture;
              const isSelected = item.isSelected;
              const isToday = item.isToday;
              const isCompleted = item.status === 'completed';
              const isNotCompleted = item.status === 'not_completed';
              const isTodayPending = item.status === 'today_pending';

              let cellStyle = 'bg-white hover:bg-slate-100 text-slate-700';

              if (isFuture) {
                cellStyle = 'bg-slate-50/50 text-slate-300 cursor-not-allowed opacity-40';
              } else if (isCompleted) {
                // Completed attendance -> Highlighted with GREEN color
                cellStyle = isSelected
                  ? 'bg-emerald-600 text-white font-black ring-2 ring-emerald-500 ring-offset-1 shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold hover:bg-emerald-100';
              } else if (isNotCompleted) {
                // Attendance Not Completed on past date -> Highlighted with RED color
                cellStyle = isSelected
                  ? 'bg-rose-600 text-white font-black ring-2 ring-rose-500 ring-offset-1 shadow-sm'
                  : 'bg-rose-50 text-rose-800 border border-rose-200/80 font-bold hover:bg-rose-100';
              } else if (isTodayPending) {
                // Today pending
                cellStyle = isSelected
                  ? 'bg-blue-600 text-white font-black ring-2 ring-blue-500 ring-offset-1 shadow-sm'
                  : 'bg-blue-50 text-blue-700 border border-blue-200 font-extrabold hover:bg-blue-100';
              }

              return (
                <button
                  key={`day-${item.day}`}
                  type="button"
                  disabled={isFuture}
                  onClick={() => handleSelectDate(item)}
                  className={`h-8 md:h-9 rounded-xl flex flex-col items-center justify-center relative transition-all duration-150 cursor-pointer ${cellStyle} ${
                    isSelected && !isCompleted && !isNotCompleted && !isTodayPending
                      ? 'ring-2 ring-blue-600 ring-offset-1 font-black'
                      : ''
                  }`}
                  title={
                    isFuture
                      ? 'Future Date (Cannot take attendance)'
                      : isCompleted
                      ? `Attendance Completed (${item.dateStr})`
                      : isNotCompleted
                      ? `Attendance Not Completed (${item.dateStr})`
                      : isToday
                      ? `Today (${item.dateStr})`
                      : item.dateStr
                  }
                >
                  <span className="text-xs">{item.day}</span>

                  {/* Highlight indicator dots */}
                  {isCompleted && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-emerald-500 absolute bottom-1" />
                  )}
                  {isNotCompleted && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-rose-500 absolute bottom-1" />
                  )}
                  {isTodayPending && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-blue-500 absolute bottom-1 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Jump & Legend Footer */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 px-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span className="text-slate-600 font-bold">Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span className="text-slate-600 font-bold">Not Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
                <span className="text-slate-400">Future</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-600" /> Past dates locked
              </span>
              <button
                type="button"
                onClick={handleJumpToToday}
                className="px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              >
                Go to Today
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
