import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon = FolderOpen,
  title = 'No records found',
  description = 'There are no items matching your criteria at this time.',
  actionLabel,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs my-4">
      <div className="p-4 bg-slate-100 text-slate-400 rounded-2xl mb-4">
        <Icon className="w-10 h-10" />
      </div>
      <h4 className="text-base font-bold text-slate-800">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
