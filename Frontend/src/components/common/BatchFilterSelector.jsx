import React, { useState } from 'react';
import { useLmsData } from '../../context/LmsDataContext';
import { Plus, Layers, Check } from 'lucide-react';
import { Modal } from './Modal';
import { Input, Select } from './Input';
import { Button } from './Button';

export function BatchFilterSelector({ activeBatch, onSelectBatch, className = '' }) {
  const { availableBatches, addBatch } = useLmsData();

  const currentBatch = activeBatch || 'ALL';
  const [categoryTab, setCategoryTab] = useState('ALL'); // 'ALL' | 'WEEKDAY' | 'WEEKEND'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBatchCategory, setNewBatchCategory] = useState('Weekday');
  const [customBatchNumber, setCustomBatchNumber] = useState('');

  const weekdayBatches = (availableBatches || []).filter(
    (b) => b.startsWith('A26W') && !b.startsWith('A26S')
  );
  const weekendBatches = (availableBatches || []).filter((b) => b.startsWith('A26S'));

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

  const visibleBatches =
    categoryTab === 'WEEKDAY'
      ? weekdayBatches
      : categoryTab === 'WEEKEND'
      ? weekendBatches
      : availableBatches || [];

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 shadow-2xs">
        <button
          type="button"
          onClick={() => {
            setCategoryTab('ALL');
            onSelectBatch('ALL');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            currentBatch === 'ALL' && categoryTab === 'ALL'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
          }`}
        >
          All Batches
        </button>

        <button
          type="button"
          onClick={() => {
            setCategoryTab('WEEKDAY');
            if (!weekdayBatches.includes(currentBatch)) {
              onSelectBatch(weekdayBatches[0] || 'A26W1');
            }
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
            categoryTab === 'WEEKDAY' || (currentBatch.startsWith('A26W') && !currentBatch.startsWith('A26S'))
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
          }`}
        >
          Weekday (A26W)
        </button>

        <button
          type="button"
          onClick={() => {
            setCategoryTab('WEEKEND');
            if (!weekendBatches.includes(currentBatch)) {
              onSelectBatch(weekendBatches[0] || 'A26S1');
            }
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
            categoryTab === 'WEEKEND' || currentBatch.startsWith('A26S')
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
          }`}
        >
          Weekend (A26S)
        </button>
      </div>

      {/* Specific Batch Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        {visibleBatches.map((bCode) => {
          const isSelected = currentBatch === bCode;
          const isWeekday = bCode.startsWith('A26W') && !bCode.startsWith('A26S');

          return (
            <button
              key={bCode}
              type="button"
              onClick={() => onSelectBatch(bCode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                isSelected
                  ? isWeekday
                    ? 'bg-purple-50 text-purple-700 border-purple-300 ring-2 ring-purple-500/20'
                    : 'bg-purple-50 text-purple-700 border-purple-300 ring-2 ring-purple-500/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>{bCode}</span>
              {isSelected && <Check className="w-3.5 h-3.5 ml-0.5 text-purple-600" />}
            </button>
          );
        })}

        {/* Add New Batch Button */}
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-purple-600 bg-white hover:bg-purple-50/50 border border-dashed border-slate-300 hover:border-purple-400 transition-all flex items-center gap-1 cursor-pointer"
          title="Create a new batch code"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Batch</span>
        </button>
      </div>

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

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
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
