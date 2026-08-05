import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs({ items }) {
  const location = useLocation();

  // If custom items not passed, auto calculate from path
  const paths = items || location.pathname.split('/').filter(Boolean).map((segment, index, arr) => {
    const url = `/${arr.slice(0, index + 1).join('/')}`;
    const label = segment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    return { label, url };
  });

  return (
    <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
      <Link to="/" className="hover:text-indigo-600 flex items-center gap-1 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </Link>

      {paths.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          {idx === paths.length - 1 ? (
            <span className="font-semibold text-slate-800">{item.label}</span>
          ) : (
            <Link to={item.url} className="hover:text-indigo-600 transition-colors">
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
