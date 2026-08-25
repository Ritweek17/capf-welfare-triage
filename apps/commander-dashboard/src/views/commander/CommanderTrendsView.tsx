import React, { useState } from 'react';
import type { WellbeingTrendPoint, DateRangeOption } from '../../types/commander';
import { TrendingUp, Activity, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface CommanderTrendsViewProps {
  trendData: WellbeingTrendPoint[];
}

export const CommanderTrendsView: React.FC<CommanderTrendsViewProps> = ({ trendData }) => {
  const [timeRange, setTimeRange] = useState<DateRangeOption>('30d');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const strokeColor = isDark ? '#C9DFA0' : '#70873B';
  const gridColor = isDark ? '#29384D' : '#E0E7D8';
  const axisColor = isDark ? '#7F8C9B' : '#89947F';

  return (
    <div className="space-y-8 animate-in fade-in duration-200 font-sans">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#152235] border border-[#E0E7D8] dark:border-[#29384D] rounded-[17px] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#70873B] dark:text-[#C9DFA0]" />
            <h1 className="text-xl font-extrabold text-[#0B1830] dark:text-[#E8EEF5] font-sans">
              Longitudinal Wellbeing Trends
            </h1>
          </div>
          <p className="text-xs text-[#667085] dark:text-[#9AA8B8] mt-1">
            Sector-wide longitudinal analysis tracking physical readiness, stress loads, and fatigue trajectories over time.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F1F5E9] dark:bg-[#101A2A] border border-[#E0E7D8] dark:border-[#29384D] text-xs font-mono">
          {(['7d', '30d', '90d'] as DateRangeOption[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeRange === range
                  ? 'bg-[#70873B] dark:bg-[#C9DFA0] text-white dark:text-[#0D1522] shadow-xs'
                  : 'text-[#667085] dark:text-[#9AA8B8] hover:text-[#0B1830] dark:hover:text-[#E8EEF5]'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Trajectory Card */}
      <div className="bg-white dark:bg-[#152235] border border-[#E0E7D8] dark:border-[#29384D] rounded-[17px] p-6 shadow-xs space-y-6 transition-colors">
        <div className="flex items-center justify-between border-b border-[#E0E7D8]/60 dark:border-[#29384D]/80 pb-4">
          <div>
            <span className="text-[11px] font-mono font-bold text-[#70873B] dark:text-[#C9DFA0] uppercase tracking-widest block">
              SECTOR WELLBEING INDEX TRAJECTORY ({timeRange.toUpperCase()})
            </span>
            <p className="text-xs text-[#667085] dark:text-[#9AA8B8] mt-0.5">
              Aggregated daily index calculated across all Monitored Units
            </p>
          </div>
          <div className="text-right font-mono">
            <span className="text-2xl font-extrabold text-[#0B1830] dark:text-[#E8EEF5]">87%</span>
            <span className="text-xs text-[#70873B] dark:text-[#C9DFA0] font-bold block">↑ 4.8% net recovery</span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="trendsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: axisColor }} tickLine={false} axisLine={{ stroke: gridColor }} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: axisColor }} tickLine={false} axisLine={{ stroke: gridColor }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-[#152235] border border-[#E0E7D8] dark:border-[#29384D] px-4 py-2.5 rounded-xl shadow-md text-xs space-y-1">
                        <p className="font-mono text-[10px] text-[#667085] dark:text-[#9AA8B8] uppercase">{label}</p>
                        <p className="font-bold text-[#0B1830] dark:text-[#E8EEF5]">
                          Wellbeing Index: {payload[0].value}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="wellbeingIndex"
                stroke={strokeColor}
                strokeWidth={3}
                fill="url(#trendsGradient)"
                dot={{ r: 4, fill: isDark ? '#152235' : '#FFFFFF', stroke: strokeColor, strokeWidth: 2 }}
                activeDot={{ r: 7, fill: strokeColor }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stress & Fatigue Trajectory Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stress Trend Card */}
        <div className="bg-white dark:bg-[#152235] border border-[#E0E7D8] dark:border-[#29384D] rounded-[17px] p-6 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#C58A2B] dark:text-[#C4A56A]" />
              <h3 className="font-bold text-[#0B1830] dark:text-[#E8EEF5] text-sm">
                Cumulative Operational Stress Index
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#C58A2B] dark:text-[#C4A56A] bg-[#C58A2B]/10 dark:bg-[#C4A56A]/15 px-2.5 py-0.5 rounded-full border border-[#C58A2B]/20">
              MODERATE
            </span>
          </div>

          <p className="text-xs text-[#667085] dark:text-[#9AA8B8]">
            Tracks shift density and cumulative overtime load across active personnel rosters.
          </p>

          <div className="p-4 rounded-xl bg-[#F8FAF5] dark:bg-[#101A2A] border border-[#E0E7D8] dark:border-[#29384D] flex items-center justify-between text-xs">
            <span className="text-[#667085] dark:text-[#9AA8B8]">7-Day Trajectory:</span>
            <span className="font-mono font-bold text-[#70873B] dark:text-[#C9DFA0]">↓ 2.1% Stress Reduction</span>
          </div>
        </div>

        {/* Fatigue Index Card */}
        <div className="bg-white dark:bg-[#152235] border border-[#E0E7D8] dark:border-[#29384D] rounded-[17px] p-6 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#70873B] dark:text-[#C9DFA0]" />
              <h3 className="font-bold text-[#0B1830] dark:text-[#E8EEF5] text-sm">
                Sleep & Fatigue Recovery Index
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#70873B] dark:text-[#C9DFA0] bg-[#70873B]/10 dark:bg-[#C9DFA0]/15 px-2.5 py-0.5 rounded-full border border-[#70873B]/20">
              STABLE
            </span>
          </div>

          <p className="text-xs text-[#667085] dark:text-[#9AA8B8]">
            Aggregate sleep efficiency and rest cycle stabilization across deployed sector units.
          </p>

          <div className="p-4 rounded-xl bg-[#F8FAF5] dark:bg-[#101A2A] border border-[#E0E7D8] dark:border-[#29384D] flex items-center justify-between text-xs">
            <span className="text-[#667085] dark:text-[#9AA8B8]">30-Day Trajectory:</span>
            <span className="font-mono font-bold text-[#70873B] dark:text-[#C9DFA0]">↑ 3.4% Rest Recovery</span>
          </div>
        </div>
      </div>
    </div>
  );
};
