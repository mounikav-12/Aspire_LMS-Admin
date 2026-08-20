import React, { useState } from 'react';
import { useLmsData } from '../../context/LmsDataContext';
import { useToast } from '../../context/ToastContext';
import {
  Layers,
  Calendar,
  Users,
  BookOpen,
  Plus,
  ArrowRight,
  Clock,
  Search
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Input, Select } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';

export function BatchManagementPage() {
  const { availableBatches, addBatch, students, courses, setActiveBatchFilter } = useLmsData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'WEEKDAY' | 'WEEKEND'
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBatchCategory, setNewBatchCategory] = useState('Weekday');
  const [customBatchNumber, setCustomBatchNumber] = useState('');

  // Segregate Batches cleanly
  const allBatches = availableBatches && availableBatches.length > 0
    ? availableBatches
    : ['A26W1', 'A26W2', 'A26W3', 'A26S1', 'A26S2', 'A26S3'];

  const weekdayBatches = allBatches.filter((b) => b.startsWith('A26W') && !b.startsWith('A26S') && !b.startsWith('A26WE'));
  const weekendBatches = allBatches.filter((b) => b.startsWith('A26S') || b.startsWith('A26WE'));

  // Calculate metrics per batch
  const getBatchMetrics = (bCode) => {
    const batchStudents = (students || []).filter((s) => s.batch === bCode);
    const isWeekend = bCode.startsWith('A26S') || bCode.startsWith('A26WE');
    
    // Find courses assigned or matching this batch
    const linkedCourses = (courses || []).filter((c) => {
      try {
        const storedWd = localStorage.getItem(`aspire_lms_card_wd_${c.id}`);
        const storedWe = localStorage.getItem(`aspire_lms_card_we_${c.id}`);

        let wdArr = [];
        let weArr = [];
        if (storedWd) { try { wdArr = JSON.parse(storedWd); } catch (e) {} }
        if (storedWe) { try { weArr = JSON.parse(storedWe); } catch (e) {} }

        if (wdArr.length > 0 || weArr.length > 0) {
          return wdArr.includes(bCode) || weArr.includes(bCode);
        }
      } catch (e) {}

      const target = (c.targetBatch || c.target_batch || 'All Batches').trim();
      const targetUpper = target.toUpperCase();

      if (targetUpper === 'ALL BATCHES' || targetUpper === 'ALL') return true;
      if (targetUpper.includes(bCode.toUpperCase())) return true;

      if (!targetUpper.includes('A26')) {
        if (isWeekend && (targetUpper === 'WEEKEND BATCH' || targetUpper === 'WEEKEND')) return true;
        if (!isWeekend && (targetUpper === 'WEEKDAY BATCH' || targetUpper === 'WEEKDAY')) return true;
      }

      return false;
    });

    return {
      studentCount: batchStudents.length,
      courseCount: linkedCourses.length,
      isWeekend,
      linkedCourses
    };
  };

  const handleAddBatch = (e) => {
    e.preventDefault();
    const num = customBatchNumber.trim().replace(/[^0-9]/g, '');
    if (!num) {
      addToast('Please enter a valid batch number', 'error');
      return;
    }

    const prefix = newBatchCategory === 'Weekday' ? 'A26W' : 'A26S';
    const newCode = `${prefix}${num}`;

    if (allBatches.includes(newCode)) {
      addToast(`Batch ${newCode} already exists`, 'error');
      return;
    }

    if (addBatch) addBatch(newCode, newBatchCategory);
    addToast(`Successfully created batch ${newCode}!`, 'success');
    setCustomBatchNumber('');
    setIsAddModalOpen(false);
  };

  const handleSelectBatchAndNavigate = (bCode, targetPath = '/students') => {
    if (setActiveBatchFilter) setActiveBatchFilter(bCode);
    navigate(`${targetPath}?batch=${encodeURIComponent(bCode)}`);
  };

  const filteredWeekday = weekdayBatches.filter((b) => b.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredWeekend = weekendBatches.filter((b) => b.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-normal text-slate-900 flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-blue-600" /> Batch Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Overview of all active Weekday and Weekend training batches, student enrollments, and track schedules.
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsAddModalOpen(true)} icon={Plus}>
          Add New Batch Code
        </Button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Batches</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{allBatches.length}</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Active LMS cohorts</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weekday Batches</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{weekdayBatches.length}</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Mon to Fri track</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weekend Batches</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{weekendBatches.length}</h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Sat & Sun track</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Filter Tabs and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Batches ({allBatches.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('WEEKDAY')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'WEEKDAY'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-500 hover:text-blue-600'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Weekday Batches ({weekdayBatches.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('WEEKEND')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'WEEKEND'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-500 hover:text-indigo-600'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Weekend Batches ({weekendBatches.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search batch code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* SEPARATED BATCHES DISPLAY */}
      <div className="space-y-8">
        {/* WEEKDAY BATCHES SECTION */}
        {(activeTab === 'ALL' || activeTab === 'WEEKDAY') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span>Weekday Batches</span>
                <span className="text-xs font-bold text-slate-500 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                  Mon – Fri Schedule
                </span>
              </h2>
              <span className="text-xs font-bold text-slate-400">
                {filteredWeekday.length} Active Batches
              </span>
            </div>

            {filteredWeekday.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWeekday.map((bCode) => {
                  const metrics = getBatchMetrics(bCode);
                  return (
                    <div
                      key={bCode}
                      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Header Badge */}
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-black rounded-lg border border-blue-200/70 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" />
                            {bCode}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            Weekday Track
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-black text-slate-900">
                            Batch {bCode}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-blue-600" /> Mon to Fri Regular Schedule
                          </p>
                        </div>

                        {/* Stats Metrics */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Enrolled Students
                            </span>
                            <span className="text-sm font-black text-slate-800 flex items-center gap-1 mt-0.5">
                              <Users className="w-3.5 h-3.5 text-blue-600" />
                              {metrics.studentCount}
                            </span>
                          </div>

                          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Linked Courses
                            </span>
                            <span className="text-sm font-black text-slate-800 flex items-center gap-1 mt-0.5">
                              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                              {metrics.courseCount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Links */}
                      <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleSelectBatchAndNavigate(bCode, '/students')}
                          className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5" /> View Students
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectBatchAndNavigate(bCode, '/courses')}
                          className="text-xs font-black text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          View Courses <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/70 text-slate-500 text-xs font-bold">
                No Weekday batches found matching search.
              </div>
            )}
          </div>
        )}

        {/* WEEKEND BATCHES SECTION */}
        {(activeTab === 'ALL' || activeTab === 'WEEKEND') && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                <span>Weekend Batches</span>
                <span className="text-xs font-bold text-slate-500 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60">
                  Sat – Sun Schedule
                </span>
              </h2>
              <span className="text-xs font-bold text-slate-400">
                {filteredWeekend.length} Active Batches
              </span>
            </div>

            {filteredWeekend.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWeekend.map((bCode) => {
                  const metrics = getBatchMetrics(bCode);
                  return (
                    <div
                      key={bCode}
                      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Header Badge */}
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-lg border border-indigo-200/70 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" />
                            {bCode}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            Weekend Track
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-black text-slate-900">
                            Batch {bCode}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Sat & Sun Intensive Schedule
                          </p>
                        </div>

                        {/* Stats Metrics */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Enrolled Students
                            </span>
                            <span className="text-sm font-black text-slate-800 flex items-center gap-1 mt-0.5">
                              <Users className="w-3.5 h-3.5 text-indigo-600" />
                              {metrics.studentCount}
                            </span>
                          </div>

                          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Linked Courses
                            </span>
                            <span className="text-sm font-black text-slate-800 flex items-center gap-1 mt-0.5">
                              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                              {metrics.courseCount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Links */}
                      <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleSelectBatchAndNavigate(bCode, '/students')}
                          className="text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5" /> View Students
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectBatchAndNavigate(bCode, '/courses')}
                          className="text-xs font-black text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          View Courses <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/70 text-slate-500 text-xs font-bold">
                No Weekend batches found matching search.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add New Batch Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Batch Code"
        subtitle="Create a new training cohort code for Weekday or Weekend schedule"
      >
        <form onSubmit={handleAddBatch} className="space-y-4">
          <Select
            label="Batch Category"
            value={newBatchCategory}
            onChange={(e) => setNewBatchCategory(e.target.value)}
            options={[
              { value: 'Weekday', label: 'Weekday Batch (A26W Series)' },
              { value: 'Weekend', label: 'Weekend Batch (A26S Series)' }
            ]}
          />

          <Input
            label="Batch Number"
            type="number"
            min="1"
            max="99"
            placeholder="e.g. 5 (creates A26W5)"
            value={customBatchNumber}
            onChange={(e) => setCustomBatchNumber(e.target.value)}
            required
            helperText={`Will generate code: ${
              newBatchCategory === 'Weekday' ? 'A26W' : 'A26S'
            }${customBatchNumber || 'X'}`}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Batch Code
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
