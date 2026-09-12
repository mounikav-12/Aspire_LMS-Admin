import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export function CustomSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  icon: Icon,
  error,
  className = '',
  buttonClassName = '',
  accentColor = 'emerald',
  searchable = undefined,
  maxHeight = 'max-h-60'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize options to [{ value, label }]
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        value: opt.value !== undefined ? opt.value : opt.id,
        label: opt.label !== undefined ? opt.label : (opt.title || opt.name || String(opt.value))
      };
    }
    return { value: opt, label: String(opt) };
  });

  // Automatically enable search if there are more than 6 options
  const isSearchEnabled = searchable !== undefined ? searchable : normalizedOptions.length > 6;

  // Filter options if search query present
  const filteredOptions = isSearchEnabled && searchQuery.trim()
    ? normalizedOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : normalizedOptions;

  const selectedOption = normalizedOptions.find(
    (opt) => opt.value === value || (value && String(opt.value).toLowerCase() === String(value).toLowerCase())
  ) || {
    value: value || '',
    label: value ? String(value) : placeholder
  };

  // Close on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && isSearchEnabled && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, isSearchEnabled]);

  const handleSelect = (val) => {
    if (disabled) return;
    if (onChange) {
      // Pass synthetic event format for drop-in compatibility with (e) => e.target.value
      onChange({ target: { value: val } });
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  // Accent color styles
  const accentStyles = {
    emerald: {
      ring: 'focus:border-emerald-500 ring-2 ring-emerald-500/20 border-emerald-500',
      activeItem: 'bg-emerald-50/90 text-emerald-800 font-bold border border-emerald-200/80',
      checkIcon: 'text-emerald-600',
      chevronOpen: 'rotate-180 text-emerald-600',
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    },
    blue: {
      ring: 'focus:border-blue-500 ring-2 ring-blue-500/20 border-blue-500',
      activeItem: 'bg-blue-50/90 text-blue-800 font-bold border border-blue-200/80',
      checkIcon: 'text-blue-600',
      chevronOpen: 'rotate-180 text-blue-600',
      badge: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    purple: {
      ring: 'focus:border-purple-500 ring-2 ring-purple-500/20 border-purple-500',
      activeItem: 'bg-purple-50/90 text-purple-800 font-bold border border-purple-200/80',
      checkIcon: 'text-purple-600',
      chevronOpen: 'rotate-180 text-purple-600',
      badge: 'bg-purple-100 text-purple-700 border-purple-200'
    }
  };

  const currentTheme = accentStyles[accentColor] || accentStyles.emerald;

  return (
    <div
      className={`w-full min-w-0 flex flex-col gap-1.5 relative ${isOpen ? 'z-50' : 'z-10'} ${className}`}
      ref={dropdownRef}
    >
      {label && (
        <label className="text-[11px] font-extrabold text-slate-700 tracking-wider uppercase truncate" title={label}>
          {label}
        </label>
      )}

      <div className="relative min-w-0">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full min-w-0 px-3.5 py-2.5 bg-slate-50/70 hover:bg-white border rounded-xl text-xs sm:text-sm font-medium text-left flex items-center justify-between transition-all duration-150 cursor-pointer shadow-2xs ${
            disabled
              ? 'opacity-60 cursor-not-allowed bg-slate-100 border-slate-200'
              : isOpen
              ? `bg-white ${currentTheme.ring} shadow-sm text-slate-900`
              : error
              ? 'border-rose-300 hover:border-rose-400 text-slate-800'
              : 'border-slate-200 hover:border-slate-300 text-slate-800'
          } ${buttonClassName}`}
        >
          <div className="flex items-center gap-2 min-w-0 truncate pr-2">
            {Icon && <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />}
            <span className="truncate" title={selectedOption.label}>
              {selectedOption.label || placeholder}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
              isOpen ? currentTheme.chevronOpen : ''
            }`}
          />
        </button>

        {/* DROPDOWN MENU PANEL: ALWAYS ANCHORED AT THE BOTTOM (top-full mt-1.5) */}
        {isOpen && !disabled && (
          <div
            className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1.5 duration-150"
            style={{ minWidth: '100%' }}
          >
            {/* Quick Search Bar when options count > 6 */}
            {isSearchEnabled && (
              <div className="p-2 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-10">
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search options..."
                    className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-slate-800 placeholder-slate-400"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 p-0.5 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Scrollable Options List */}
            <div className={`p-1.5 space-y-0.5 overflow-y-auto ${maxHeight}`}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, idx) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={`${opt.value}-${idx}`}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-left transition-all cursor-pointer group ${
                        isSelected
                          ? currentTheme.activeItem
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                      }`}
                      title={opt.label}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2 flex-1">
                        <span className="text-left break-words leading-snug">{opt.label}</span>
                      </div>
                      {isSelected && (
                        <Check className={`w-4 h-4 ${currentTheme.checkIcon} flex-shrink-0`} />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-4 text-center text-xs text-slate-400 italic">
                  No matching options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <span className="text-xs text-rose-500 font-semibold">{error}</span>}
    </div>
  );
}
