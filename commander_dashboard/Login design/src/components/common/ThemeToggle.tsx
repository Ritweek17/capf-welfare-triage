import React from 'react';
import { useTheme, type ThemeMode } from '../../context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeToggleProps {
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false }) => {
  const { themeMode, setThemeMode } = useTheme();

  const options: { id: ThemeMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'Device', icon: Monitor },
  ];

  if (compact) {
    return (
      <div className="inline-flex items-center p-0.5 rounded-full bg-[#F1F5E9] dark:bg-[#101A2A] border border-[#E0E7D8] dark:border-[#29384D] transition-colors">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isActive = themeMode === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setThemeMode(opt.id)}
              title={`${opt.label} Mode`}
              className={`p-1.5 rounded-full text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#B7DB50] dark:bg-[#B7DB50] text-[#0B1830] shadow-xs font-bold'
                  : 'text-[#667085] dark:text-[#9AA8B8] hover:text-[#0B1830] dark:hover:text-[#E8EEF5]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-0.5 p-1 rounded-xl bg-[#F1F5E9] dark:bg-[#101A2A] border border-[#E0E7D8] dark:border-[#29384D] text-xs font-mono transition-colors">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = themeMode === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => setThemeMode(opt.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
              isActive
                ? 'bg-[#B7DB50] dark:bg-[#B7DB50] text-[#0B1830] font-bold shadow-xs'
                : 'text-[#667085] dark:text-[#9AA8B8] hover:text-[#0B1830] dark:hover:text-[#E8EEF5]'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
