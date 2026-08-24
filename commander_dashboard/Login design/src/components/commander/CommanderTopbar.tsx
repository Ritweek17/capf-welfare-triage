import React, { useState } from 'react';
import type { DateRangeOption } from '../../types/commander';
import { Calendar, Check, Menu, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

interface CommanderTopbarProps {
  dateRange: DateRangeOption;
  onDateRangeChange: (range: DateRangeOption) => void;
  lastSync: string;
  onOpenMenu: () => void;
}

export const CommanderTopbar: React.FC<CommanderTopbarProps> = ({
  dateRange,
  onDateRangeChange,
  lastSync,
  onOpenMenu,
}) => {
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);

  const rangeLabels: Record<DateRangeOption, string> = {
    '7d': 'Last 7 Days',
    '14d': 'Last 14 Days',
    '30d': 'Last 30 Days',
    '90d': 'Last 90 Days',
  };

  return (
    <header className="bg-[#F8FAF5]/95 dark:bg-[#0D1522]/95 backdrop-blur-xl border-b border-[#E0E7D8] dark:border-[#29384D] px-5 sm:px-8 py-4 sticky top-0 z-20 font-sans transition-colors duration-250">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-6xl mx-auto">
        {/* Title & Scope Metadata */}
        <div className="flex items-center gap-3">
          <button onClick={onOpenMenu} className="lg:hidden w-9 h-9 grid place-items-center rounded-xl border border-[#E0E7D8] dark:border-[#29384D] bg-white dark:bg-[#152235]" aria-label="Open navigation"><Menu className="w-4 h-4" /></button>
          <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-extrabold tracking-tight text-[#0B1830] dark:text-[#E8EEF5] font-sans">
              Commander overview
            </h1>
            <span className="text-[#89947F] dark:text-[#7F8C9B]">•</span>
            <span className="text-xs text-[#667085] dark:text-[#9AA8B8] font-medium">Alpha Sector HQ</span>
            <span className="text-[#89947F] dark:text-[#7F8C9B]">·</span>
            <span className="text-xs font-mono text-[#667085] dark:text-[#9AA8B8]">21 units monitored</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#70873B] dark:text-[#C9DFA0] font-semibold"><ShieldCheck className="w-3 h-3" /> Aggregate-only welfare intelligence</div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden xl:flex items-center gap-2 text-xs font-mono text-[#667085] dark:text-[#9AA8B8]">
            <span>Synced {lastSync}</span>
            <span className="text-[#E0E7D8] dark:text-[#29384D]">|</span>
            <div className="flex items-center gap-1.5 text-[#70873B] dark:text-[#C9DFA0]">
              <span className="w-2 h-2 rounded-full bg-[#70873B] dark:bg-[#C9DFA0]" />
              <span className="text-[11px] uppercase tracking-wider font-semibold">
                LIVE
              </span>
            </div>
          </div>

          {/* Date Range Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRangeDropdown(!showRangeDropdown)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F8FAF5] dark:bg-[#101A2A] border border-[#E0E7D8] dark:border-[#29384D] hover:border-[#667085]/30 text-xs font-semibold text-[#0B1830] dark:text-[#E8EEF5] transition-all cursor-pointer shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5 text-[#70873B] dark:text-[#C9DFA0]" />
              <span>{rangeLabels[dateRange]}</span>
              <span className="text-[#89947F] dark:text-[#7F8C9B] text-[9px]">▼</span>
            </button>

            {showRangeDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#152235] border border-[#E0E7D8] dark:border-[#29384D] rounded-xl shadow-lg p-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                {(['7d', '14d', '30d', '90d'] as DateRangeOption[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onDateRangeChange(r);
                      setShowRangeDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                      dateRange === r
                        ? 'bg-[#E1EFBD] dark:bg-[#26371E] text-[#70873B] dark:text-[#C9DFA0] font-bold'
                        : 'text-[#667085] dark:text-[#9AA8B8] hover:bg-[#F8FAF5] dark:hover:bg-[#101A2A] hover:text-[#0B1830] dark:hover:text-[#E8EEF5]'
                    }`}
                  >
                    <span>{rangeLabels[r]}</span>
                    {dateRange === r && <Check className="w-3.5 h-3.5 text-[#70873B] dark:text-[#C9DFA0]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Header Theme Switcher Pill */}
          <div className="sm:hidden">
            <ThemeToggle compact />
          </div>
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <div className="hidden md:flex items-center gap-2 pl-1"><span className="w-9 h-9 grid place-items-center rounded-full bg-[#0B1830] text-white text-[10px] font-extrabold">AS</span><div className="flex flex-col"><strong className="text-[11px] text-[#0B1830] dark:text-[#E8EEF5]">A. Singh</strong><small className="text-[9px] text-[#667085] dark:text-[#9AA8B8]">Commander</small></div></div>
        </div>
      </div>
    </header>
  );
};
