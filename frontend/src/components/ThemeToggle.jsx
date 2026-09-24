import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export default function ThemeToggle({ theme = 'dark', onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => {
        try {
          playClickSound();
        } catch (e) {}
        if (onToggle) onToggle();
      }}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      style={{
        padding: '6px 14px',
        borderRadius: '999px',
        background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF',
        border: `1.5px solid ${isDark ? '#FFD23F' : '#0284C7'}`,
        color: isDark ? '#FFD23F' : '#0284C7',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.8rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isDark
          ? '0 0 14px rgba(255, 210, 63, 0.2)'
          : '0 2px 8px rgba(2, 132, 199, 0.2)',
        flexShrink: 0
      }}
    >
      {isDark ? <Sun size={15} color="#FFD23F" /> : <Moon size={15} color="#0284C7" />}
      <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  );
}
