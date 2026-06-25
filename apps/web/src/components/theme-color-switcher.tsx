'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Palette } from 'lucide-react';
import { useThemeColor, type ThemeColor } from '@/hooks/use-theme-color';

const themes: { id: ThemeColor; label: string; color: string }[] = [
  { id: 'blue', label: 'Azul', color: '#3b82f6' },
  { id: 'terracota', label: 'Terracota', color: '#e07a5f' },
  { id: 'pink', label: 'Rosa', color: '#e83e8c' },
  { id: 'purple', label: 'Púrpura', color: '#8b5cf6' },
  { id: 'green', label: 'Verde', color: '#22c55e' },
  { id: 'orange', label: 'Naranja', color: '#f97316' },
];

export function ThemeColorSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { themeColor, setThemeColor } = useThemeColor();

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg cursor-pointer"
        style={{ backgroundColor: themes.find(t => t.id === themeColor)?.color || '#3b82f6' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Palette className="h-5 w-5 text-white" />
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="fixed bottom-20 right-6 z-50 rounded-xl border bg-card p-4 shadow-xl"
            >
              <p className="mb-3 text-xs font-medium text-muted-foreground">COLOR DE ACENTO</p>
              <div className="flex gap-3">
                {themes.map((t) => (
                  <motion.button
                    key={t.id}
                    onClick={() => { setThemeColor(t.id); setIsOpen(false); }}
                    className="relative flex h-8 w-8 items-center justify-center rounded-full cursor-pointer"
                    style={{ backgroundColor: t.color }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    title={t.label}
                  >
                    {themeColor === t.id && (
                      <motion.div
                        layoutId="theme-dot"
                        className="h-2.5 w-2.5 rounded-full bg-white"
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
