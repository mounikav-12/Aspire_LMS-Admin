import { createContext, useContext, useState, useEffect, useRef } from 'react';

const ThemeContext = createContext({
  theme: 'system',
  setTheme: () => {},
  resolvedTheme: 'light',
  toggleTheme: () => {},
  isDark: false
});

export function ThemeProvider({ children }) {
  // 'light' | 'dark' | 'system'
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
        return savedTheme;
      }
    } catch {
      // Fallback if localStorage is inaccessible
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') return 'dark';
      if (saved === 'light') return 'light';
    } catch {
      // Fallback
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  const transitionTimerRef = useRef(null);

  const applyThemeToDOM = (targetTheme, withTransition = true) => {
    if (typeof window === 'undefined') return false;
    const root = document.documentElement;

    let isDarkTheme = false;
    if (targetTheme === 'dark') {
      isDarkTheme = true;
    } else if (targetTheme === 'light') {
      isDarkTheme = false;
    } else {
      isDarkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (withTransition) {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
      root.classList.add('theme-transitioning');
    } else {
      root.classList.remove('theme-transitioning');
    }

    if (isDarkTheme) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }

    if (withTransition) {
      transitionTimerRef.current = setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 160);
    }

    try {
      localStorage.setItem('theme', targetTheme);
    } catch {
      // Ignore storage write error
    }

    return isDarkTheme;
  };

  const updateTheme = (newTheme) => {
    const isDarkTheme = applyThemeToDOM(newTheme, true);
    setTheme(newTheme);
    setResolvedTheme(isDarkTheme ? 'dark' : 'light');
  };

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    updateTheme(nextTheme);
  };

  useEffect(() => {
    // Initial mount: ensure DOM matches stored/detected theme immediately with NO transition delay
    const initialIsDark = applyThemeToDOM(theme, false);
    setResolvedTheme(initialIsDark ? 'dark' : 'light');

    // Listen to OS changes when theme is set to 'system'
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemChange = () => {
        if (theme === 'system') {
          const isDarkTheme = applyThemeToDOM('system', true);
          setResolvedTheme(isDarkTheme ? 'dark' : 'light');
        }
      };

      mediaQuery.addEventListener('change', handleSystemChange);
      return () => {
        mediaQuery.removeEventListener('change', handleSystemChange);
        if (transitionTimerRef.current) {
          clearTimeout(transitionTimerRef.current);
        }
      };
    }
  }, [theme]);

  const isDark = resolvedTheme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme, resolvedTheme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
