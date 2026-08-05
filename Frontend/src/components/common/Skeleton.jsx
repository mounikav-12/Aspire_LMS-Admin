import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div className={`bg-slate-200/70 rounded-xl animate-skeleton ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-4">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }) {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
