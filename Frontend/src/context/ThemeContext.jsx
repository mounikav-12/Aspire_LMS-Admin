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

  const isFirstRender = useRef(true);
  const transitionTimerRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (currentTheme, withTransition = true) => {
      let isDarkTheme = false;
      if (currentTheme === 'dark') {
        isDarkTheme = true;
      } else if (currentTheme === 'light') {
        isDarkTheme = false;
      } else {
        isDarkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      setResolvedTheme(isDarkTheme ? 'dark' : 'light');

      if (withTransition) {
        if (transitionTimerRef.current) {
          clearTimeout(transitionTimerRef.current);
        }
        root.classList.add('theme-transitioning');
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
        }, 350);
      }
    };

    if (isFirstRender.current) {
      isFirstRender.current = false;
      applyTheme(theme, false);
    } else {
      applyTheme(theme, true);
    }

    try {
      localStorage.setItem('theme', theme);
    } catch {
      // Ignore storage write error
    }

    // Listen to OS changes when theme is set to 'system'
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemChange = () => {
        if (theme === 'system') {
          applyTheme('system', true);
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

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'light';
      // When in 'system' mode, switch to opposite of current resolved theme
      return resolvedTheme === 'dark' ? 'light' : 'dark';
    });
  };

  const isDark = resolvedTheme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, toggleTheme, isDark }}>
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
