'use client';

import { useCallback, useEffect, useState } from 'react';

export type ThemeColor = 'blue' | 'terracota' | 'pink' | 'purple' | 'green' | 'orange';

const THEME_COLOR_KEY = 'vet-theme-color';
const DEFAULT_THEME: ThemeColor = 'blue';

export function useThemeColor() {
  const [themeColor, setThemeColorState] = useState<ThemeColor>(DEFAULT_THEME);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_COLOR_KEY) as ThemeColor | null;
    if (stored && ['blue', 'terracota', 'pink', 'purple', 'green', 'orange'].includes(stored)) {
      setThemeColorState(stored);
      document.documentElement.setAttribute('data-theme-color', stored);
    } else {
      document.documentElement.setAttribute('data-theme-color', DEFAULT_THEME);
    }
  }, []);

  const setThemeColor = useCallback((color: ThemeColor) => {
    setThemeColorState(color);
    localStorage.setItem(THEME_COLOR_KEY, color);
    document.documentElement.setAttribute('data-theme-color', color);
  }, []);

  return { themeColor, setThemeColor };
}
