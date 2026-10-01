import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, ChevronDown, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle({
  variant = 'navbar', // 'navbar' | 'sidebar' | 'dropdown' | 'floating' | 'inline'
  isCollapsed = false,
  className = ''
}) {
  const { theme, setTheme, toggleTheme, isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const themeOptions = [
    { id: 'light', label: 'Light Mode', icon: Sun, desc: 'Crisp daylight interface' },
    { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Deep slate, reduced eye strain' },
    { id: 'system', label: 'System Default', icon: Laptop, desc: 'Matches device preference' }
  ];

  // 1. Floating variant (e.g., Auth Pages)
  if (variant === 'floating') {
    return (
      <div className={`fixed top-4 right-4 z-50 ${className}`} ref={dropdownRef}>
        <div className="relative">
          <button
            type="button"
            onClick={toggleTheme}
            onContextMenu={(e) => {
              e.preventDefault();
              setIsOpen(!isOpen);
            }}
            title={`Current: ${theme.toUpperCase()} (${isDark ? 'Dark' : 'Light'}). Click to toggle, right-click for options.`}
            className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 rounded-2xl shadow-lg hover:shadow-xl text-slate-700 dark:text-slate-200 transition-all duration-300 hover:scale-105 cursor-pointer group"
          >
            <div className="relative w-4.5 h-4.5 flex items-center justify-center">
              <Sun className={`w-4.5 h-4.5 text-amber-500 absolute transition-all duration-300 ease-in-out ${
                isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0 pointer-events-none'
              }`} />
              <Moon className={`w-4.5 h-4.5 text-blue-600 dark:text-blue-400 absolute transition-all duration-300 ease-in-out ${
                isDark ? 'opacity-0 rotate-90 scale-0 pointer-events-none' : 'opacity-100 rotate-0 scale-100'
              }`} />
            </div>
            <span className="text-xs font-bold capitalize hidden sm:inline">
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in duration-150">
              <div className="text-[10px] font-black uppercase text-slate-400 px-2.5 py-1.5 tracking-wider">
                Select Theme
              </div>
              {themeOptions.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setTheme(opt.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      <span>{opt.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. Sidebar variant (in the sidebar footer)
  if (variant === 'sidebar') {
    if (isCollapsed) {
      return (
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          className="w-full flex items-center justify-center p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800/80 rounded-xl transition-all cursor-pointer group"
        >
          <div className="relative w-4.5 h-4.5 flex items-center justify-center">
            <Sun className={`w-4.5 h-4.5 text-amber-500 absolute transition-all duration-300 ease-in-out ${
              isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0 pointer-events-none'
            }`} />
            <Moon className={`w-4.5 h-4.5 text-slate-600 dark:text-blue-400 absolute transition-all duration-300 ease-in-out ${
              isDark ? 'opacity-0 rotate-90 scale-0 pointer-events-none' : 'opacity-100 rotate-0 scale-100'
            }`} />
          </div>
        </button>
      );
    }

    return (
      <div className={`space-y-1 ${className}`} ref={dropdownRef}>
        <div
          onClick={toggleTheme}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleTheme();
            }
          }}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          className="flex items-center justify-between px-3 py-2 bg-slate-100/70 dark:bg-slate-800/50 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-xl cursor-pointer transition-colors duration-300 select-none group"
        >
          <div className="flex items-center gap-2">
            <div className="relative w-4 h-4 flex items-center justify-center">
              <Sun className={`w-4 h-4 text-amber-500 absolute transition-all duration-300 ease-in-out ${
                isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0 pointer-events-none'
              }`} />
              <Moon className={`w-4 h-4 text-blue-600 dark:text-blue-400 absolute transition-all duration-300 ease-in-out ${
                isDark ? 'opacity-0 rotate-90 scale-0 pointer-events-none' : 'opacity-100 rotate-0 scale-100'
              }`} />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors duration-300">
              {isDark ? 'Dark Theme' : 'Light Theme'}
            </span>
          </div>

          <div
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out ${
              isDark ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-300 ease-in-out ${
                isDark ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
        </div>
      </div>
    );
  }

  // 3. Navbar variant (Header icon button with quick toggle + menu dropdown)
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="flex items-center">
        <button
          type="button"
          onClick={toggleTheme}
          title={`Currently ${isDark ? 'Dark Mode' : 'Light Mode'} (${theme} preference). Click to toggle theme.`}
          className="p-1.5 sm:px-2.5 sm:py-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100/80 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/70 rounded-xl transition-colors duration-300 flex items-center gap-2 cursor-pointer group shadow-2xs"
          aria-label="Toggle dark mode"
        >
          <div className="relative w-4 h-4 flex items-center justify-center">
            <Sun className={`w-4 h-4 text-amber-500 absolute transition-all duration-300 ease-in-out ${
              isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0 pointer-events-none'
            }`} />
            <Moon className={`w-4 h-4 text-blue-600 dark:text-blue-400 absolute transition-all duration-300 ease-in-out ${
              isDark ? 'opacity-0 rotate-90 scale-0 pointer-events-none' : 'opacity-100 rotate-0 scale-100'
            }`} />
          </div>
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 hidden md:inline transition-colors duration-300">
            {isDark ? 'Dark' : 'Light'}
          </span>
          <ChevronDown
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className={`w-3 h-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Theme selection dropdown panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 px-2.5 py-1.5 tracking-wider">
            Appearance Mode
          </div>
          {themeOptions.map((opt) => {
            const IconComponent = opt.icon;
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setTheme(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <IconComponent className="w-4 h-4 flex-shrink-0" />
                  <div className="text-left">
                    <p className="leading-tight">{opt.label}</p>
                    <p className="text-[10px] font-normal text-slate-400 dark:text-slate-500">
                      {opt.desc}
                    </p>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
