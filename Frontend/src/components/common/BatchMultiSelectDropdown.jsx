import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Filter, Layers, CheckSquare, Square } from 'lucide-react';
import { useLmsData } from '../../context/LmsDataContext';

export function BatchMultiSelectDropdown({
  selectedWeekdayBatches = [],
  selectedWeekendBatches = [],
  onChangeWeekdayBatches,
  onChangeWeekendBatches,
  className = ''
}) {
  const { availableBatches = [] } = useLmsData();
  const [category, setCategory] = useState('ALL'); // 'ALL' | 'WEEKDAY' | 'WEEKEND'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const weekdayBatchesList = (
    availableBatches && availableBatches.length > 0
      ? availableBatches.filter(
          (b) => b.startsWith('A26W') && !b.startsWith('A26S') && !b.startsWith('A26WE')
        )
      : ['A26W1', 'A26W2', 'A26W3']
  );

  const weekendBatchesList = (
    availableBatches && availableBatches.length > 0
      ? availableBatches
          .filter((b) => b.startsWith('A26S') || b.startsWith('A26WE'))
          .map((b) => b.replace(/^A26WE/, 'A26S'))
          .filter((b, i, arr) => arr.indexOf(b) === i)
      : ['A26S1', 'A26S2', 'A26S3', 'A26S4']
  );

  // Relevant batch numbers based on selected category
  const relevantBatches =
    category === 'WEEKDAY'
      ? weekdayBatchesList
      : category === 'WEEKEND'
      ? weekendBatchesList
      : [...weekdayBatchesList, ...weekendBatchesList];

  const allSelectedInCategory = relevantBatches.every((bCode) => {
    if (bCode.startsWith('A26S') || bCode.startsWith('A26WE')) {
      return selectedWeekendBatches.includes(bCode);
    }
    return selectedWeekdayBatches.includes(bCode);
  });

  // Toggle single batch code
  const toggleBatch = (bCode) => {
    if (bCode.startsWith('A26S') || bCode.startsWith('A26WE')) {
      const isSelected = selectedWeekendBatches.includes(bCode);
      const updated = isSelected
        ? selectedWeekendBatches.filter((b) => b !== bCode)
        : [...selectedWeekendBatches, bCode];
      if (onChangeWeekendBatches) onChangeWeekendBatches(updated);
    } else {
      const isSelected = selectedWeekdayBatches.includes(bCode);
      const updated = isSelected
        ? selectedWeekdayBatches.filter((b) => b !== bCode)
        : [...selectedWeekdayBatches, bCode];
      if (onChangeWeekdayBatches) onChangeWeekdayBatches(updated);
    }
  };

  // Select/Deselect All in current Category
  const toggleSelectAllCategory = () => {
    if (allSelectedInCategory) {
      if (category === 'WEEKDAY') {
        if (onChangeWeekdayBatches) onChangeWeekdayBatches([]);
      } else if (category === 'WEEKEND') {
        if (onChangeWeekendBatches) onChangeWeekendBatches([]);
      } else {
        if (onChangeWeekdayBatches) onChangeWeekdayBatches([]);
        if (onChangeWeekendBatches) onChangeWeekendBatches([]);
      }
    } else {
      if (category === 'WEEKDAY') {
        if (onChangeWeekdayBatches) onChangeWeekdayBatches(weekdayBatchesList);
      } else if (category === 'WEEKEND') {
        if (onChangeWeekendBatches) onChangeWeekendBatches(weekendBatchesList);
      } else {
        if (onChangeWeekdayBatches) onChangeWeekdayBatches(weekdayBatchesList);
        if (onChangeWeekendBatches) onChangeWeekendBatches(weekendBatchesList);
      }
    }
  };

  // Label summary for Dropdown 2 trigger button
  const getSummaryText = () => {
    const totalSelected = selectedWeekdayBatches.length + selectedWeekendBatches.length;
    if (totalSelected === 0) return 'Select Batch Numbers';
    
    if (category === 'WEEKDAY') {
      if (selectedWeekdayBatches.length === weekdayBatchesList.length) return 'All Weekday Batches';
      return selectedWeekdayBatches.join(', ');
    }
    if (category === 'WEEKEND') {
      if (selectedWeekendBatches.length === weekendBatchesList.length) return 'All Weekend Batches';
      return selectedWeekendBatches.join(', ');
    }
    if (selectedWeekdayBatches.length === weekdayBatchesList.length && selectedWeekendBatches.length === weekendBatchesList.length) {
      return 'All Batches';
    }

    const combined = [...selectedWeekdayBatches, ...selectedWeekendBatches];
    if (combined.length <= 3) return combined.join(', ');
    return `${combined.length} Batches Selected (${combined.slice(0, 2).join(', ')}...)`;
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 items-start ${className}`}>
      {/* Dropdown 1: Category Selection (All Batches, Weekday, Weekend) */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-purple-600" />
          <span>Batch Category</span>
        </label>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 pr-9 bg-slate-50 border border-slate-200 hover:border-purple-300 focus:border-purple-600 focus:bg-white rounded-2xl text-xs font-bold text-slate-800 focus:outline-none shadow-2xs cursor-pointer transition-all appearance-none"
          >
            <option value="ALL">All Batches (Weekday & Weekend)</option>
            <option value="WEEKDAY">Weekday Batches</option>
            <option value="WEEKEND">Weekend Batches</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Dropdown 2: Multi-Select Batch Numbers */}
      <div className="space-y-1.5 relative" ref={dropdownRef}>
        <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-purple-600" />
          <span>Select Batch Numbers</span>
        </label>

        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border rounded-2xl text-xs font-bold text-slate-800 focus:outline-none transition-all shadow-2xs cursor-pointer ${
            isDropdownOpen
              ? 'border-purple-600 bg-white ring-2 ring-purple-500/10'
              : 'border-slate-200 hover:border-purple-300'
          }`}
        >
          <span className="truncate pr-2">{getSummaryText()}</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-purple-600' : ''}`} />
        </button>

        {/* Multi-Select Batch Numbers Dropdown List */}
        {isDropdownOpen && (
          <div className="mt-2 bg-white rounded-2xl shadow-md border border-slate-200 p-2 max-h-48 overflow-y-auto space-y-1 animate-in fade-in duration-150">
            {/* Select All Option */}
            <div
              onClick={toggleSelectAllCategory}
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-purple-50/80 hover:bg-purple-100/80 text-purple-950 font-extrabold text-xs cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {allSelectedInCategory ? (
                  <CheckSquare className="w-4 h-4 text-purple-600 flex-shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-purple-400 flex-shrink-0" />
                )}
                <span>{allSelectedInCategory ? 'Deselect All' : 'Select All'}</span>
              </div>
              <span className="text-[10px] uppercase font-black text-purple-600 bg-purple-100/90 px-2 py-0.5 rounded-md">
                {category}
              </span>
            </div>

            <div className="border-t border-slate-100 my-1" />

            {/* List of Batch Checkboxes */}
            {relevantBatches.map((bCode) => {
              const isChecked =
                bCode.startsWith('A26S') || bCode.startsWith('A26WE')
                  ? selectedWeekendBatches.includes(bCode)
                  : selectedWeekdayBatches.includes(bCode);

              return (
                <div
                  key={bCode}
                  onClick={() => toggleBatch(bCode)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                    isChecked
                      ? 'bg-purple-50/70 text-purple-950 font-extrabold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    )}
                    <span>{bCode}</span>
                  </div>
                  {isChecked && <Check className="w-3.5 h-3.5 text-purple-600" />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
