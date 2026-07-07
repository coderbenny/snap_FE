'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'snapit-theme';

function applyTheme(mode) {
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = mode === 'dark' || (mode === 'system' && systemDark);
  document.documentElement.classList.toggle('dark', isDark);
}

export function useTheme() {
  const [theme, setThemeState] = useState('system');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) || 'system';
    setThemeState(stored);
    applyTheme(stored);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = () => {
      if ((localStorage.getItem(STORAGE_KEY) || 'system') === 'system') {
        applyTheme('system');
      }
    };
    mq.addEventListener('change', onSystemChange);
    return () => mq.removeEventListener('change', onSystemChange);
  }, []);

  const setTheme = useCallback((mode) => {
    localStorage.setItem(STORAGE_KEY, mode);
    setThemeState(mode);
    applyTheme(mode);
  }, []);

  const cycle = useCallback(() => {
    setThemeState((current) => {
      const next = { system: 'light', light: 'dark', dark: 'system' }[current];
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
      return next;
    });
  }, []);

  return { theme, setTheme, cycle };
}
