import React from 'react';
import type { SectorHealthMetrics, WellbeingTrendPoint } from '../../types/commander';
import { TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface SectorHealthHeroProps {
  metrics: SectorHealthMetrics;
  trendData: WellbeingTrendPoint[];
}

export const SectorHealthHero: React.FC<SectorHealthHeroProps> = ({ metrics, trendData }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const chartColors = {
    stroke: isDark ? '#C9DFA0' : '#70873B',
    axis: isDark ? '#29384D' : '#E0E7D8',
    axisText: isDark ? '#7F8C9B' : '#89947F',
    tooltipBg: isDark ? '#152235' : '#FFFFFF',
    tooltipBorder: isDark ? '#29384D' : '#E0E7D8',
    tooltipText: isDark ? '#E8EEF5' : '#0B1830',
  };

  return (
    <section className="bg-white dark:bg-[#152235] border border-[#E0E7D8] dark:border-[#29384D] rounded-[17px] p-8 shadow-xs font-sans relative overflow-hidden transition-colors duration-250">
      {/* Sector Health Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-[#E0E7D8]/60 dark:border-[#29384D]/80 pb-4">
        <div>
          <span className="text-[11px] font-mono font-bold text-[#70873B] dark:text-[#C9DFA0] uppercase tracking-widest block">
            SECTOR HEALTH
          </span>
          <p className="text-xs text-[#667085] dark:text-[#9AA8B8] mt-0.5">
            Macro operational picture across 21 monitored sector units
          </p>
        </div>

        {/* Primary Message Indicator Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E1EFBD]/60 dark:bg-[#26371E]/60 border border-[#70873B]/25 dark:border-[#C9DFA0]/25 text-xs font-semibold text-[#70873B] dark:text-[#C9DFA0]">
          <span className="w-2 h-2 rounded-full bg-[#70873B] dark:bg-[#C9DFA0]" />
          <span>Sector Healthy & Operationally Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        {/* Left Side: Large Wellbeing Index */}
        <div className="lg:col-span-5 space-y-5">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl sm:text-7xl font-extrabold text-[#0B1830] dark:text-[#E8EEF5] tracking-tight font-sans">
                {metrics.wellbeingIndex}%
              </span>
              <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#70873B] dark:text-[#C9DFA0] bg-[#E1EFBD] dark:bg-[#26371E] px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{metrics.wellbeingChange}</span>
              </div>
            </div>

            <p className="text-xs font-semibold text-[#0B1830] dark:text-[#E8EEF5] mt-1.5">Overall wellbeing index</p>
            <p className="text-[11px] text-[#89947F] dark:text-[#7F8C9B] font-mono">vs previous period</p>
          </div>

          {/* Secondary Metric: Operational Readiness */}
          <div className="pt-4 border-t border-[#E0E7D8]/80 dark:border-[#29384D]/80 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-[#0B1830] dark:text-[#E8EEF5]">OPERATIONAL READINESS</span>
              <span className="text-[#70873B] dark:text-[#C9DFA0] font-mono font-bold">{metrics.readinessIndex}%</span>
            </div>

            {/* Restrained Progress Bar */}
            <div className="w-full h-2.5 bg-[#F1F5E9] dark:bg-[#101A2A] rounded-full overflow-hidden border border-[#E0E7D8] dark:border-[#29384D]">
              <div
                className="h-full bg-[#70873B] dark:bg-[#C9DFA0] rounded-full transition-all duration-700 ease-out"
                style={{ width: `${metrics.readinessIndex}%` }}
              />
            </div>
            <p className="text-[11px] text-[#667085] dark:text-[#9AA8B8]">
              94% aggregate operational readiness indicator
            </p>
          </div>
        </div>

        {/* Right Side: Refined Wellbeing Trajectory Line Chart */}
        <div className="lg:col-span-7 h-48 w-full">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#667085] dark:text-[#9AA8B8] mb-2">
            <span>WELLBEING TRAJECTORY (30 DAYS)</span>
            <span className="text-[#70873B] dark:text-[#C9DFA0] font-bold">STABLE +4.8%</span>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="heroDynamicGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.stroke} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={chartColors.stroke} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: chartColors.axisText }}
                axisLine={{ stroke: chartColors.axis }}
                tickLine={false}
              />
              <YAxis domain={[50, 100]} hide />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div
                        style={{
                          backgroundColor: chartColors.tooltipBg,
                          borderColor: chartColors.tooltipBorder,
                        }}
                        className="border px-3.5 py-2 rounded-xl shadow-md text-xs space-y-0.5"
                      >
                        <p className="font-mono text-[10px] text-[#667085] dark:text-[#9AA8B8] uppercase">
                          {label}
                        </p>
                        <p
                          style={{ color: chartColors.tooltipText }}
                          className="font-bold text-sm"
                        >
                          Index: {payload[0].value}%
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
                stroke={chartColors.stroke}
                strokeWidth={2.5}
                fill="url(#heroDynamicGradient)"
                dot={{ r: 3.5, fill: isDark ? '#152235' : '#FFFFFF', stroke: chartColors.stroke, strokeWidth: 2 }}
                activeDot={{ r: 6, fill: chartColors.stroke }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};
