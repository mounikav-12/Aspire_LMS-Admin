import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import {
  CalendarCheck,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  ArrowLeft,
  ArrowRight,
  Search,
  Download,
  Filter,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Check,
  AlertCircle,
  UserCheck,
  Percent,
  CheckCheck,
  Lock
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { AttendanceCalendarPicker } from './AttendanceCalendarPicker';

// Helper to get today's date formatted as YYYY-MM-DD in local time
const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Formatter for readable date headers
const formatReadableDate = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const isToday = dateStr === getTodayDateString();
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  const formatted = dateObj.toLocaleDateString('en-US', options);
  return isToday ? `${formatted} (Today)` : formatted;
};

// Storage key for attendance records
const ATTENDANCE_STORAGE_KEY = 'aspire_lms_attendance_records';

export function AttendancePage() {
  const {
    availableBatches = [],
    students = [],
    attendanceData = {},
    saveAttendanceData,
    isLoadingAttendance,
    isSavingAttendance: isContextSaving,
    attendanceLastSynced,
    fetchAttendanceData,
    isSupabaseConnected
  } = useLmsData();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Clear legacy mock storage if present
  useEffect(() => {
    try {
      localStorage.removeItem('aspire_lms_attendance_mock_v3');
    } catch (e) {}
  }, []);

  // Selected batch from URL query parameter
  const selectedBatch = searchParams.get('batch') || null;

  // Active date for attendance (defaults to today)
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());

  // Category filter on batches overview page: 'ALL' | 'WEEKDAY' | 'WEEKEND'
  const [batchCategoryFilter, setBatchCategoryFilter] = useState('ALL');
  const [batchSearchTerm, setBatchSearchTerm] = useState('');

  // Student search and status filter within selected batch
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [studentStatusFilter, setStudentStatusFilter] = useState('ALL');

  // Local draft state for the current batch and date before saving
  const [currentRosterState, setCurrentRosterState] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initial fetch from backend API on mount
  useEffect(() => {
    if (fetchAttendanceData) {
      fetchAttendanceData();
    }
  }, []);

  // When selectedBatch or selectedDate changes, reset unsaved draft flag
  useEffect(() => {
    setHasUnsavedChanges(false);
  }, [selectedBatch, selectedDate]);

  // When selectedBatch, selectedDate, students, or realtime attendanceData updates,
  // synchronize the roster state (unless user has active unsaved local edits)
  useEffect(() => {
    if (!selectedBatch) return;
    if (hasUnsavedChanges) return;

    const existingBatchDateData = attendanceData[selectedBatch]?.[selectedDate] || {};
    const batchStudents = students.filter((s) => s.batch === selectedBatch);

    // Populate roster state: if existing data exists, use it; otherwise, default to unmarked or empty
    const initialRoster = {};
    batchStudents.forEach((student) => {
      const existing = existingBatchDateData[student.id];
      initialRoster[student.id] = {
        status: existing?.status || null, // 'present' | 'absent' | 'late' | 'excused' | null
        remarks: existing?.remarks || ''
      };
    });

    setCurrentRosterState(initialRoster);
  }, [selectedBatch, selectedDate, students, attendanceData, hasUnsavedChanges]);

  // Navigation helpers for Batch selection
  const handleSelectBatch = (batchCode) => {
    setSearchParams({ batch: batchCode });
    setStudentSearchTerm('');
    setStudentStatusFilter('ALL');
  };

  const handleBackToBatches = () => {
    setSearchParams({});
  };

  const todayDateString = getTodayDateString();
  const isPastDate = selectedDate < todayDateString;
  const isToday = selectedDate === todayDateString;

  // Date navigation helpers - strictly prevents navigating into future dates
  const handleShiftDate = (days) => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const curr = new Date(y, m - 1, d);
    curr.setDate(curr.getDate() + days);
    const newY = curr.getFullYear();
    const newM = String(curr.getMonth() + 1).padStart(2, '0');
    const newD = String(curr.getDate()).padStart(2, '0');
    const targetDate = `${newY}-${newM}-${newD}`;

    if (targetDate > todayDateString) {
      addToast('Cannot navigate into future dates.', 'warning');
      return;
    }
    setSelectedDate(targetDate);
  };

  // Student Attendance Marking Handlers - Locked on past dates
  const handleMarkStudent = (studentId, status) => {
    if (isPastDate) {
      addToast('Attendance for past dates is locked and cannot be modified.', 'warning');
      return;
    }

    setCurrentRosterState((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        status: prev[studentId]?.status === status ? null : status // Toggle off if already active
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleUpdateRemarks = (studentId, remarks) => {
    if (isPastDate) return;

    setCurrentRosterState((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { status: null }),
        remarks
      }
    }));
    setHasUnsavedChanges(true);
  };

  // Fast Bulk Actions - Locked on past dates
  const handleBulkMark = (status) => {
    if (isPastDate) {
      addToast('Attendance for past dates is locked.', 'warning');
      return;
    }

    const batchStudents = students.filter((s) => s.batch === selectedBatch);
    const updated = { ...currentRosterState };
    batchStudents.forEach((s) => {
      updated[s.id] = {
        ...(updated[s.id] || {}),
        status
      };
    });
    setCurrentRosterState(updated);
    setHasUnsavedChanges(true);
    addToast(`Marked all students as ${status.toUpperCase()} for ${selectedBatch}`, 'info');
  };

  const handleResetAttendance = () => {
    if (isPastDate) {
      addToast('Attendance for past dates is locked.', 'warning');
      return;
    }

    const batchStudents = students.filter((s) => s.batch === selectedBatch);
    const updated = { ...currentRosterState };
    batchStudents.forEach((s) => {
      updated[s.id] = {
        status: null,
        remarks: ''
      };
    });
    setCurrentRosterState(updated);
    setHasUnsavedChanges(true);
    addToast('Cleared all attendance marks for this session', 'info');
  };

  // Save current roster to attendanceData - Disallowed on past dates
  const handleSaveAttendance = async () => {
    if (!selectedBatch) return;
    if (isPastDate) {
      addToast('Past attendance records are locked and cannot be edited.', 'warning');
      return;
    }

    setIsSaving(true);

    try {
      if (saveAttendanceData) {
        await saveAttendanceData(selectedBatch, selectedDate, currentRosterState);
      } else {
        const res = await fetch('/api/attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            batchCode: selectedBatch,
            date: selectedDate,
            roster: currentRosterState
          })
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to save attendance to backend');
        }
      }

      setHasUnsavedChanges(false);
      addToast(`Attendance for ${selectedBatch} (${selectedDate}) saved to database!`, 'success');
    } catch (err) {
      console.error('Save attendance error:', err);
      addToast(`Error saving attendance: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!selectedBatch) return;
    const batchStudents = students.filter((s) => s.batch === selectedBatch);

    const headers = ['Date', 'Batch Code', 'Student ID', 'Student Name', 'Email', 'Attendance Status', 'Remarks'];
    const rows = batchStudents.map((s) => {
      const record = currentRosterState[s.id];
      const statusStr = record?.status ? record.status.toUpperCase() : 'UNMARKED';
      const remarksStr = (record?.remarks || '').replace(/"/g, '""');
      return [
        selectedDate,
        selectedBatch,
        s.registrationId || s.id,
        `"${s.name}"`,
        s.email,
        statusStr,
        `"${remarksStr}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Attendance_${selectedBatch}_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(`Exported Attendance_${selectedBatch}_${selectedDate}.csv`, 'success');
  };

  // Metrics for all batches (View A)
  const batchMetrics = useMemo(() => {
    const list = availableBatches || [];
    return list.map((bCode) => {
      const batchStudents = students.filter((s) => s.batch === bCode);
      const isWeekend = bCode.startsWith('A26S') || bCode.startsWith('A26WE');
      const category = isWeekend ? 'Weekend' : 'Weekday';

      // Check attendance status for selectedDate
      const dateRecords = attendanceData[bCode]?.[selectedDate] || {};
      const markedStudents = Object.values(dateRecords).filter((r) => r.status !== null);
      const isMarked = markedStudents.length > 0;
      const presentCount = Object.values(dateRecords).filter((r) => r.status === 'present' || r.status === 'late').length;
      const absentCount = Object.values(dateRecords).filter((r) => r.status === 'absent').length;

      // Overall historical attendance rate for this batch
      const allDates = attendanceData[bCode] ? Object.keys(attendanceData[bCode]) : [];
      let totalEntries = 0;
      let totalPresent = 0;

      allDates.forEach((d) => {
        const dRecs = attendanceData[bCode][d] || {};
        Object.values(dRecs).forEach((r) => {
          if (r.status) {
            totalEntries++;
            if (r.status === 'present' || r.status === 'late') {
              totalPresent++;
            }
          }
        });
      });

      const overallRate = totalEntries > 0 ? Math.round((totalPresent / totalEntries) * 100) : null;

      return {
        code: bCode,
        category,
        isWeekend,
        studentCount: batchStudents.length,
        isMarked,
        presentCount,
        absentCount,
        overallRate,
        totalSessionsLogged: allDates.length
      };
    });
  }, [availableBatches, students, attendanceData, selectedDate]);

  // Filtered batches for View A
  const filteredBatches = useMemo(() => {
    return batchMetrics.filter((b) => {
      const matchesSearch = b.code.toLowerCase().includes(batchSearchTerm.toLowerCase());
      if (!matchesSearch) return false;

      if (batchCategoryFilter === 'WEEKDAY') return !b.isWeekend;
      if (batchCategoryFilter === 'WEEKEND') return b.isWeekend;
      return true;
    });
  }, [batchMetrics, batchSearchTerm, batchCategoryFilter]);

  // Metrics for Current Selected Batch (View B)
  const currentBatchStudents = useMemo(() => {
    if (!selectedBatch) return [];
    return students.filter((s) => s.batch === selectedBatch);
  }, [selectedBatch, students]);

  const rosterCounts = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let unmarked = 0;

    currentBatchStudents.forEach((s) => {
      const st = currentRosterState[s.id]?.status;
      if (st === 'present') present++;
      else if (st === 'absent') absent++;
      else if (st === 'late') late++;
      else unmarked++;
    });

    const total = currentBatchStudents.length;
    const markedTotal = present + absent + late;
    const presenceRate = markedTotal > 0 ? Math.round(((present + late) / markedTotal) * 100) : 0;

    return { total, present, absent, late, unmarked, presenceRate };
  }, [currentBatchStudents, currentRosterState]);

  // Filtered student list for View B
  const filteredStudents = useMemo(() => {
    return currentBatchStudents.filter((s) => {
      const q = studentSearchTerm.toLowerCase();
      const matchesText =
        s.name.toLowerCase().includes(q) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.registrationId && s.registrationId.toLowerCase().includes(q));

      if (!matchesText) return false;

      const currentStatus = currentRosterState[s.id]?.status;
      if (studentStatusFilter === 'ALL') return true;
      if (studentStatusFilter === 'UNMARKED') return !currentStatus;
      return currentStatus === studentStatusFilter.toLowerCase();
    });
  }, [currentBatchStudents, studentSearchTerm, studentStatusFilter, currentRosterState]);

  // Calculate student individual historical attendance percentage
  const getStudentHistoricalRate = (studentId) => {
    if (!selectedBatch || !attendanceData[selectedBatch]) return null;
    let total = 0;
    let attended = 0;

    Object.values(attendanceData[selectedBatch]).forEach((dateObj) => {
      const record = dateObj[studentId];
      if (record && record.status) {
        total++;
        if (record.status === 'present' || record.status === 'late') attended++;
      }
    });

    return total > 0 ? Math.round((attended / total) * 100) : null;
  };

  // =========================================================================
  // VIEW B: SELECTED BATCH STUDENT ATTENDANCE ROSTER
  // =========================================================================
  if (selectedBatch) {
    const isWeekend = selectedBatch.startsWith('A26S') || selectedBatch.startsWith('A26WE');

    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToBatches}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Return to Batch Cards"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">All Batches</span>
            </button>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Batch {selectedBatch}</span>
                </h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    isWeekend ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {isWeekend ? 'Weekend' : 'Weekday'}
                </span>
                {hasUnsavedChanges && !isPastDate && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 animate-pulse">
                    ● Unsaved Changes
                  </span>
                )}
                {isPastDate && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    <Lock className="w-3 h-3 text-amber-600" />
                    Locked (Read-Only)
                  </span>
                )}
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs"
                  title={attendanceLastSynced ? `Last database sync: ${new Date(attendanceLastSynced).toLocaleTimeString()}` : 'Connected to Supabase realtime broadcast'}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Realtime</span>
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5 font-medium">
                {isPastDate
                  ? 'Viewing historical attendance records. Past dates cannot be modified.'
                  : 'Mark and review daily attendance records for students enrolled in this cohort.'}
              </p>
            </div>
          </div>

          {/* Action buttons on top */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 text-xs font-bold"
              title="Export batch attendance for this date as CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </Button>

            {isPastDate ? (
              <div
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-xs font-bold cursor-not-allowed select-none"
                title="Past records are permanently locked"
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Locked (Read-Only)</span>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveAttendance}
                disabled={isSaving}
                className="flex items-center gap-1.5 text-xs font-bold shadow-sm shadow-blue-500/20"
              >
                {isSaving ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>{isSaving ? 'Saving...' : 'Save Attendance'}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Past Date Locked Notice Banner */}
        {isPastDate && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs font-semibold shadow-2xs">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Historical Record ({formatReadableDate(selectedDate)}):</strong> Attendance for this date is locked in read-only mode to prevent records from being altered.
              </span>
            </div>
            <button
              onClick={() => setSelectedDate(todayDateString)}
              className="px-3 py-1 bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold rounded-xl transition-colors cursor-pointer text-[11px] whitespace-nowrap self-start sm:self-auto"
            >
              Go to Today
            </button>
          </div>
        )}

        {/* Date Selector & Session Control Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 md:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/90 rounded-xl p-1 shadow-2xs">
              <button
                onClick={() => handleShiftDate(-1)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white transition-colors cursor-pointer"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <AttendanceCalendarPicker
                value={selectedDate}
                onChange={(newDate) => {
                  if (newDate > todayDateString) {
                    addToast('Cannot select future dates for attendance.', 'warning');
                    setSelectedDate(todayDateString);
                  } else {
                    setSelectedDate(newDate);
                  }
                }}
                maxDate={todayDateString}
                batchCode={selectedBatch}
                attendanceData={attendanceData}
                availableBatches={availableBatches}
              />

              <button
                onClick={() => handleShiftDate(1)}
                disabled={selectedDate >= todayDateString}
                className={`p-1.5 rounded-lg transition-colors ${
                  selectedDate >= todayDateString
                    ? 'text-slate-300 cursor-not-allowed opacity-40'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white cursor-pointer'
                }`}
                title={selectedDate >= todayDateString ? 'Future dates are not available' : 'Next Day'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setSelectedDate(todayDateString)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isToday
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 font-extrabold'
                  : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
              }`}
            >
              Today
            </button>

            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              Viewing: <strong className="text-slate-800 font-bold">{formatReadableDate(selectedDate)}</strong>
            </span>
          </div>

          {/* Quick Bulk Actions - Only active on current date */}
          {isPastDate ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-500">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Editing Locked for Past Date</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
                Fast Actions:
              </span>
              <button
                type="button"
                onClick={() => handleBulkMark('present')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Mark all students as Present"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>All Present</span>
              </button>

              <button
                type="button"
                onClick={() => handleBulkMark('absent')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Mark all students as Absent"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>All Absent</span>
              </button>

              <button
                type="button"
                onClick={handleResetAttendance}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Clear all marked statuses"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Live Attendance Counter Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Enrolled</p>
              <p className="text-lg font-black text-slate-900">{rosterCounts.total}</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Present</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-emerald-800">{rosterCounts.present}</span>
                {rosterCounts.total > 0 && (
                  <span className="text-[11px] font-bold text-emerald-600">
                    ({Math.round((rosterCounts.present / rosterCounts.total) * 100)}%)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-rose-100 bg-rose-50/20 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Absent</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-rose-800">{rosterCounts.absent}</span>
                {rosterCounts.total > 0 && (
                  <span className="text-[11px] font-bold text-rose-600">
                    ({Math.round((rosterCounts.absent / rosterCounts.total) * 100)}%)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-amber-100 bg-amber-50/20 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Late</p>
              <p className="text-lg font-black text-amber-800">{rosterCounts.late}</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-black">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unmarked</p>
              <p className="text-lg font-black text-slate-700">{rosterCounts.unmarked}</p>
            </div>
          </div>
        </div>

        {/* Student Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search student by name, email..."
              value={studentSearchTerm}
              onChange={(e) => setStudentSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-xs font-semibold text-slate-800 focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Filter:
            </span>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'PRESENT', label: 'Present' },
              { id: 'ABSENT', label: 'Absent' },
              { id: 'LATE', label: 'Late' },
              { id: 'UNMARKED', label: 'Unmarked' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStudentStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  studentStatusFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/25'
                    : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Student Attendance Roster List */}
        {currentBatchStudents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-2xs">
            <EmptyState
              icon={Users}
              title={`No Students Found in Batch ${selectedBatch}`}
              description="There are currently no students allocated to this batch. You can assign students from the Student Directory."
              action={
                <Button
                  variant="primary"
                  onClick={() => navigate(`/students?batch=${selectedBatch}`)}
                  className="flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Go to Student Directory</span>
                </Button>
              }
            />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center shadow-2xs">
            <p className="text-sm font-bold text-slate-700">No students match your filter criteria.</p>
            <p className="text-xs text-slate-400 mt-1">Try changing your search term or status filter.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setStudentSearchTerm('');
                setStudentStatusFilter('ALL');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            {/* Table Header on Desktop */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50/80 border-b border-slate-200/80 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              <div className="col-span-4">Student Details</div>
              <div className="col-span-4 text-center">Mark Attendance Status</div>
              <div className="col-span-3">Remarks / Reason</div>
              <div className="col-span-1 text-right">History</div>
            </div>

            {/* Student Rows */}
            <div className="divide-y divide-slate-100">
              {filteredStudents.map((student, idx) => {
                const currentRecord = currentRosterState[student.id] || { status: null, remarks: '' };
                const studentStatus = currentRecord.status;
                const historicalRate = getStudentHistoricalRate(student.id);

                return (
                  <div
                    key={student.id}
                    className={`p-4 md:px-6 transition-all duration-150 flex flex-col lg:grid lg:grid-cols-12 gap-4 items-start lg:items-center ${
                      studentStatus === 'present'
                        ? 'bg-emerald-50/30'
                        : studentStatus === 'absent'
                        ? 'bg-rose-50/30'
                        : studentStatus === 'late'
                        ? 'bg-amber-50/30'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    {/* Student Info */}
                    <div className="lg:col-span-4 flex items-center gap-3 w-full">
                      <span className="text-xs font-bold text-slate-400 w-5 text-right hidden sm:inline">
                        {idx + 1}.
                      </span>
                      <img
                        src={student.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name)}`}
                        alt={student.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-white shadow-2xs flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-slate-900 truncate">{student.name}</h4>
                          {student.registrationId && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              {student.registrationId}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium truncate">{student.email}</p>
                      </div>
                    </div>

                    {/* Interactive Attendance Status Toggle Buttons - Locked on past dates */}
                    <div className="lg:col-span-4 w-full flex items-center justify-start lg:justify-center">
                      {isPastDate ? (
                        <div className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                          {studentStatus === 'present' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Present</span>
                            </span>
                          ) : studentStatus === 'absent' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Absent</span>
                            </span>
                          ) : studentStatus === 'late' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Late</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 text-xs font-semibold">
                              <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                              <span>Unmarked</span>
                            </span>
                          )}
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-0.5 ml-1">
                            <Lock className="w-2.5 h-2.5 text-slate-400" /> Locked
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-inner gap-1 w-full sm:w-auto justify-between sm:justify-start">
                          {/* Present Button */}
                          <button
                            type="button"
                            onClick={() => handleMarkStudent(student.id, 'present')}
                            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                              studentStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 ring-2 ring-emerald-500/20'
                                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/80'
                            }`}
                            title="Mark Present"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </button>

                          {/* Absent Button */}
                          <button
                            type="button"
                            onClick={() => handleMarkStudent(student.id, 'absent')}
                            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                              studentStatus === 'absent'
                                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30 ring-2 ring-rose-500/20'
                                : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50/80'
                            }`}
                            title="Mark Absent"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </button>

                          {/* Late Button */}
                          <button
                            type="button"
                            onClick={() => handleMarkStudent(student.id, 'late')}
                            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                              studentStatus === 'late'
                                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30 ring-2 ring-amber-400/20'
                                : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50/80'
                            }`}
                            title="Mark Late"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Late</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Remarks Input */}
                    <div className="lg:col-span-3 w-full">
                      <input
                        type="text"
                        disabled={isPastDate}
                        readOnly={isPastDate}
                        placeholder={
                          isPastDate
                            ? currentRecord.remarks || 'No remarks recorded'
                            : 'Optional remarks (e.g. late 15m)...'
                        }
                        value={currentRecord.remarks || ''}
                        onChange={(e) => handleUpdateRemarks(student.id, e.target.value)}
                        className={`w-full px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
                          isPastDate
                            ? 'bg-slate-50 text-slate-500 border border-slate-200/80 cursor-not-allowed placeholder:text-slate-400'
                            : 'text-slate-700 bg-slate-50/80 hover:bg-white border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none placeholder:text-slate-400'
                        }`}
                      />
                    </div>

                    {/* History Rate */}
                    <div className="lg:col-span-1 w-full flex items-center justify-between lg:justify-end">
                      <span className="text-xs font-semibold text-slate-500 lg:hidden">Historical Presence:</span>
                      {historicalRate !== null ? (
                        <span
                          className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                            historicalRate >= 80
                              ? 'bg-emerald-100 text-emerald-800'
                              : historicalRate >= 60
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                          title="Overall Attendance Rate across all sessions"
                        >
                          {historicalRate}%
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">New</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Footer with floating save banner */}
            <div className="p-4 bg-slate-50/90 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500 font-medium text-center sm:text-left">
                Showing <strong className="text-slate-800 font-bold">{filteredStudents.length}</strong> of{' '}
                <strong className="text-slate-800 font-bold">{currentBatchStudents.length}</strong> students.
                {hasUnsavedChanges && !isPastDate && (
                  <span className="text-amber-600 font-bold ml-2">You have unsaved changes.</span>
                )}
                {isPastDate && (
                  <span className="text-slate-500 font-semibold ml-2">
                    <Lock className="w-3 h-3 inline mr-1 text-amber-600" />
                    Viewing locked historical record.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToBatches}
                  className="text-xs font-bold"
                >
                  Back to Batches
                </Button>

                {isPastDate ? (
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-xs font-bold cursor-not-allowed">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Locked (Read-Only)</span>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveAttendance}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 text-xs font-bold shadow-sm shadow-blue-500/20"
                  >
                    {isSaving ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>{isSaving ? 'Saving...' : 'Save Attendance'}</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW A: ALL BATCH CARDS OVERVIEW
  // =========================================================================
  const totalEnrolledAcrossBatches = students.length;
  const totalBatchesCount = availableBatches.length;
  const markedTodayCount = batchMetrics.filter((b) => b.isMarked).length;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                  Attendance Management
                </h1>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs"
                  title={attendanceLastSynced ? `Last database sync: ${new Date(attendanceLastSynced).toLocaleTimeString()}` : 'Connected to Supabase realtime broadcast'}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Realtime Sync Active</span>
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                Select an active cohort to mark daily student presence, log notes, and manage attendance records.
              </p>
            </div>
          </div>
        </div>

        {/* Global Date Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 self-start md:self-auto">
          {isPastDate && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 border border-amber-200 text-amber-800 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Past Date (Read-Only)</span>
            </span>
          )}
          <div className="flex items-center gap-1 bg-white border border-slate-200/90 rounded-2xl p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => handleShiftDate(-1)}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <AttendanceCalendarPicker
              value={selectedDate}
              onChange={(newDate) => {
                if (newDate > todayDateString) {
                  addToast('Cannot select future dates for attendance.', 'warning');
                  setSelectedDate(todayDateString);
                } else {
                  setSelectedDate(newDate);
                }
              }}
              maxDate={todayDateString}
              batchCode={null}
              attendanceData={attendanceData}
              availableBatches={availableBatches}
            />

            <button
              type="button"
              onClick={() => handleShiftDate(1)}
              disabled={selectedDate >= todayDateString}
              className={`p-1.5 rounded-xl transition-colors ${
                selectedDate >= todayDateString
                  ? 'text-slate-300 cursor-not-allowed opacity-40'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer'
              }`}
              title={selectedDate >= todayDateString ? 'Future dates are not available' : 'Next Day'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setSelectedDate(todayDateString)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isToday
                  ? 'bg-blue-50 text-blue-700 font-extrabold border border-blue-200'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Global Stat Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Batches</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{totalBatchesCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enrolled Students</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{totalEnrolledAcrossBatches}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isToday ? 'Recorded Today' : 'Recorded on Date'}
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-slate-900">
                {markedTodayCount} / {totalBatchesCount}
              </span>
              <span className="text-xs font-bold text-emerald-600">Batches</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
            isPastDate ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-600'
          }`}>
            {isPastDate ? <Lock className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isPastDate ? 'Date (Locked)' : 'Date Inspected'}
            </p>
            <p className="text-sm font-black text-slate-900 mt-1 truncate" title={selectedDate}>
              {formatReadableDate(selectedDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All Batches' },
            { id: 'WEEKDAY', label: 'Weekday (A26W)' },
            { id: 'WEEKEND', label: 'Weekend (A26S)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setBatchCategoryFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                batchCategoryFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/25'
                  : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search batch code (e.g. A26W1)..."
            value={batchSearchTerm}
            onChange={(e) => setBatchSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-xs font-semibold text-slate-800 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Batch Cards Grid */}
      {filteredBatches.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-2xs">
          <EmptyState
            icon={Layers}
            title="No Batches Found"
            description="No batches match your search criteria. Create new batches in Batch Management."
            action={
              <Button variant="primary" onClick={() => navigate('/batches')}>
                Go to Batch Management
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBatches.map((batch) => (
            <div
              key={batch.code}
              onClick={() => handleSelectBatch(batch.code)}
              className="group bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 p-5 shadow-2xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              {/* Subtle top indicator bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 transition-all ${
                  batch.isMarked
                    ? 'bg-emerald-500'
                    : batch.isWeekend
                    ? 'bg-purple-500'
                    : 'bg-blue-500'
                }`}
              />

              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shadow-2xs ${
                        batch.isWeekend
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}
                    >
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                        <span>Batch {batch.code}</span>
                      </h3>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {batch.category} Cohort
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold uppercase tracking-wide ${
                      batch.isWeekend
                        ? 'bg-purple-50 text-purple-700 border border-purple-200/80'
                        : 'bg-blue-50 text-blue-700 border border-blue-200/80'
                    }`}
                  >
                    {batch.category}
                  </span>
                </div>

                {/* Key Metrics Roster */}
                <div className="mt-5 grid grid-cols-2 gap-2.5 pt-4 border-t border-slate-100">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      Enrolled
                    </p>
                    <p className="text-base font-black text-slate-900 mt-0.5">
                      {batch.studentCount}{' '}
                      <span className="text-xs font-semibold text-slate-500">Students</span>
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Sessions Logged
                    </p>
                    <p className="text-base font-black text-slate-900 mt-0.5">
                      {batch.totalSessionsLogged}{' '}
                      <span className="text-xs font-semibold text-slate-500">Days</span>
                    </p>
                  </div>
                </div>

                {/* Status Banner */}
                <div className="mt-3">
                  {batch.isMarked ? (
                    <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isPastDate ? 'Recorded (Locked)' : 'Recorded for selected date'}</span>
                      </span>
                      <span className="text-[11px] font-extrabold bg-white px-2 py-0.5 rounded-md border border-emerald-200 text-emerald-700">
                        {batch.presentCount}P / {batch.absentCount}A
                      </span>
                    </div>
                  ) : (
                    <div className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                      isPastDate
                        ? 'bg-slate-50 border-slate-200/80 text-slate-600'
                        : 'bg-amber-50/80 border-amber-200/80 text-amber-800'
                    }`}>
                      <span className="flex items-center gap-1.5">
                        {isPastDate ? (
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        <span>{isPastDate ? 'No record logged (Locked)' : 'Pending for selected date'}</span>
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {isPastDate ? 'Locked' : 'Tap to mark'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Overall Attendance Rate Progress Bar */}
                {batch.overallRate !== null && (
                  <div className="mt-3.5">
                    <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                      <span className="text-slate-400">Historical Presence</span>
                      <span
                        className={
                          batch.overallRate >= 80
                            ? 'text-emerald-700'
                            : batch.overallRate >= 60
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }
                      >
                        {batch.overallRate}% Average
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          batch.overallRate >= 80
                            ? 'bg-emerald-500'
                            : batch.overallRate >= 60
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${batch.overallRate}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer CTA */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-600 group-hover:text-blue-700 transition-colors flex items-center gap-1.5">
                  {isPastDate && <Lock className="w-3.5 h-3.5 text-amber-600 inline" />}
                  <span>
                    {isPastDate
                      ? 'View Past Attendance (Locked)'
                      : batch.isMarked
                      ? 'Review & Edit Attendance'
                      : 'Mark Attendance'}
                  </span>
                </span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-all">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
