import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  confirmVariant = 'danger',
  isLoading = false
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-rose-100 text-rose-600 rounded-xl flex-shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant={confirmVariant}
          onClick={() => {
            onConfirm();
            onClose();
          }}
          disabled={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
