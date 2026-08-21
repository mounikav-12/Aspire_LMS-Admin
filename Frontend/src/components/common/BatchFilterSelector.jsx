import React, { useState, useEffect } from 'react';
import { useLmsData } from '../../context/LmsDataContext';
import { Plus, Layers, Filter } from 'lucide-react';
import { Modal } from './Modal';
import { Input, Select } from './Input';
import { Button } from './Button';

export function BatchFilterSelector({ activeBatch, onSelectBatch, showNewBatch = true, className = '' }) {
  const { availableBatches = [], addBatch } = useLmsData();

  const currentBatch = activeBatch || 'ALL';

  // Helper to get category from batch code
  const getCategoryFromBatch = (b) => {
    if (!b || b === 'ALL') return 'ALL';
    if (b.startsWith('A26S')) return 'WEEKEND';
    if (b.startsWith('A26W')) return 'WEEKDAY';
    return 'ALL';
  };

  const [categoryTab, setCategoryTab] = useState(() => getCategoryFromBatch(currentBatch));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBatchCategory, setNewBatchCategory] = useState('Weekday');
  const [customBatchNumber, setCustomBatchNumber] = useState('');

  // Keep categoryTab in sync if activeBatch changes externally
  useEffect(() => {
    if (currentBatch !== 'ALL') {
      const derived = getCategoryFromBatch(currentBatch);
      setCategoryTab(derived);
    }
  }, [currentBatch]);

  const weekdayBatches = availableBatches.filter(
    (b) => b.startsWith('A26W') && !b.startsWith('A26S')
  );
  const weekendBatches = availableBatches.filter((b) => b.startsWith('A26S'));

  // Related batch options for Dropdown 2 based on Dropdown 1 selection
  const getRelatedBatchOptions = () => {
    if (categoryTab === 'WEEKDAY') {
      return [
        { value: 'ALL', label: 'All Weekday Batches' },
        ...weekdayBatches.map((b) => ({ value: b, label: `Batch ${b}` }))
      ];
    }
    if (categoryTab === 'WEEKEND') {
      return [
        { value: 'ALL', label: 'All Weekend Batches' },
        ...weekendBatches.map((b) => ({ value: b, label: `Batch ${b}` }))
      ];
    }
    return [
      { value: 'ALL', label: 'All Batches' },
      ...availableBatches.map((b) => ({ value: b, label: `Batch ${b}` }))
    ];
  };

  const handleCategoryChange = (e) => {
    const selectedCat = e.target.value;
    setCategoryTab(selectedCat);

    if (selectedCat === 'ALL') {
      onSelectBatch('ALL');
    } else if (selectedCat === 'WEEKDAY') {
      if (weekdayBatches.includes(currentBatch)) {
        // Keep current weekday batch
      } else {
        onSelectBatch(weekdayBatches[0] || 'ALL');
      }
    } else if (selectedCat === 'WEEKEND') {
      if (weekendBatches.includes(currentBatch)) {
        // Keep current weekend batch
      } else {
        onSelectBatch(weekendBatches[0] || 'ALL');
      }
    }
  };

  const handleBatchSelectChange = (e) => {
    onSelectBatch(e.target.value);
  };

  const handleAddBatchSubmit = (e) => {
    e.preventDefault();
    if (!customBatchNumber.trim()) return;

    const num = customBatchNumber.trim().replace(/[^0-9]/g, '');
    if (!num) return;

    const prefix = newBatchCategory === 'Weekday' ? 'A26W' : 'A26S';
    const newCode = `${prefix}${num}`;

    if (addBatch) addBatch(newCode, newBatchCategory);
    onSelectBatch(newCode);
    setCustomBatchNumber('');
    setIsAddModalOpen(false);
  };

  const relatedOptions = getRelatedBatchOptions();

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {/* Dropdown 1: Category Filter (All Batches, Weekday, Weekend) */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-purple-600" />
          <span>Category:</span>
        </label>
        <select
          value={categoryTab}
          onChange={handleCategoryChange}
          className="px-3 py-2 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white shadow-2xs cursor-pointer transition-all"
        >
          <option value="ALL">All Categories</option>
          <option value="WEEKDAY">Weekday (A26W)</option>
          <option value="WEEKEND">Weekend (A26S)</option>
        </select>
      </div>

      {/* Dropdown 2: Related Batches based on Dropdown 1 */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-purple-600" />
          <span>Batch:</span>
        </label>
        <select
          value={currentBatch}
          onChange={handleBatchSelectChange}
          className="px-3 py-2 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white shadow-2xs cursor-pointer transition-all min-w-[140px]"
        >
          {relatedOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Add New Batch Button */}
      {showNewBatch && (
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 bg-white hover:bg-blue-50/60 border border-dashed border-slate-300 hover:border-blue-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          title="Create a new batch code"
        >
          <Plus className="w-3.5 h-3.5 text-blue-600" />
          <span>New Batch</span>
        </button>
      )}

      {/* Add Batch Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Batch Code"
      >
        <form onSubmit={handleAddBatchSubmit} className="space-y-4">
          <Select
            label="Batch Category"
            value={newBatchCategory}
            onChange={(e) => setNewBatchCategory(e.target.value)}
            options={[
              { value: 'Weekday', label: 'Weekday Batch (A26W)' },
              { value: 'Weekend', label: 'Weekend Batch (A26S)' }
            ]}
          />

          <Input
            label="Batch Number"
            type="number"
            min="1"
            max="99"
            placeholder="e.g. 4 (creates A26W4)"
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
