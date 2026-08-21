import React, { useState } from 'react';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';

export function Input({
  label,
  error,
  icon: Icon,
  helperText,
  className = '',
  id,
  type = 'text',
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === 'password';
  const effectiveType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full min-w-0 flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-[11px] font-extrabold text-slate-700 tracking-wider uppercase truncate">
          {label}
        </label>
      )}
      <div className="relative flex items-center min-w-0">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none transition-colors group-focus-within:text-blue-600 z-10">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={effectiveType}
          className={`w-full min-w-0 px-3.5 py-2.5 bg-slate-50/60 hover:bg-white border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none transition-all duration-200 ${
            Icon ? 'pl-10' : ''
          } ${
            isPasswordType ? 'pr-10' : ''
          } ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
              : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-2xs'
          } ${className}`}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-lg transition-colors cursor-pointer z-10"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-slate-600" />
            ) : (
              <Eye className="w-4 h-4 text-slate-400" />
            )}
          </button>
        )}
      </div>
      {error ? (
        <span className="text-xs text-rose-500 font-semibold">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-slate-500 font-medium">{helperText}</span>
      ) : null}
    </div>
  );
}

export function Select({
  label,
  options = [],
  children,
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full min-w-0 flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-[11px] font-extrabold text-slate-700 tracking-wider uppercase truncate" title={label}>
          {label}
        </label>
      )}
      <div className="relative flex items-center min-w-0">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none z-10">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <select
          id={selectId}
          className={`w-full min-w-0 px-3.5 py-2.5 pr-10 bg-slate-50/60 hover:bg-white border rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none transition-all duration-200 appearance-none cursor-pointer truncate ${
            Icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
              : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-2xs'
          } ${className}`}
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} className="py-1">
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <div className="absolute right-3.5 text-slate-400 pointer-events-none z-10">
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </div>
      </div>
      {error && <span className="text-xs text-rose-500 font-semibold">{error}</span>}
    </div>
  );
}
