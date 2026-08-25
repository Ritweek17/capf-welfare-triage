import React from 'react';
import type { SectorDistribution, UnitStatus } from '../../types/commander';
import { useTheme } from '../../context/ThemeContext';

interface SectorDistributionBarProps {
  distribution: SectorDistribution;
  selectedStatus?: string;
  onSelectStatus?: (status: UnitStatus | 'all') => void;
}

export const SectorDistributionBar: React.FC<SectorDistributionBarProps> = ({
  distribution,
  selectedStatus,
  onSelectStatus,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const { totalUnits, stable, moderate, elevated, critical } = distribution;

  const stablePct = ((stable / totalUnits) * 100).toFixed(1);
  const moderatePct = ((moderate / totalUnits) * 100).toFixed(1);
  const elevatedPct = ((elevated / totalUnits) * 100).toFixed(1);
  const criticalPct = ((critical / totalUnits) * 100).toFixed(1);

  const categories = [
    {
      id: 'stable',
      label: 'Stable',
      count: stable,
      percentage: stablePct,
      color: isDark ? '#C9DFA0' : '#70873B',
      textColor: isDark ? 'text-[#C9DFA0]' : 'text-[#70873B]',
    },
    {
      id: 'moderate',
      label: 'Moderate',
      count: moderate,
      percentage: moderatePct,
      color: isDark ? '#C4A56A' : '#C58A2B',
      textColor: isDark ? 'text-[#C4A56A]' : 'text-[#C58A2B]',
    },
    {
      id: 'elevated',
      label: 'Elevated',
      count: elevated,
      percentage: elevatedPct,
      color: isDark ? '#C4A56A' : '#C58A2B',
      textColor: isDark ? 'text-[#C4A56A]' : 'text-[#C58A2B]',
    },
    {
      id: 'critical',
      label: 'Critical',
      count: critical,
      percentage: criticalPct,
      color: isDark ? '#C77A7A' : '#C85A54',
      textColor: isDark ? 'text-[#C77A7A]' : 'text-[#C85A54]',
    },
  ];

  return (
    <section className="bg-white dark:bg-[#152235] border border-[#E0E7D8] dark:border-[#29384D] rounded-[17px] p-6 shadow-xs font-sans space-y-4 transition-colors duration-250">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-mono font-bold text-[#70873B] dark:text-[#C9DFA0] uppercase tracking-widest block">
            SECTOR DISTRIBUTION
          </span>
          <p className="text-xs text-[#667085] dark:text-[#9AA8B8] mt-0.5">
            Breakdown across 21 monitored units
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedStatus && selectedStatus !== 'all' && (
            <button
              onClick={() => onSelectStatus?.('all')}
              className="text-[11px] font-mono text-[#70873B] dark:text-[#C9DFA0] hover:underline font-semibold cursor-pointer"
            >
              Reset Filter
            </button>
          )}
          <span className="text-xs font-mono font-bold text-[#0B1830] dark:text-[#E8EEF5] bg-[#F1F5E9] dark:bg-[#101A2A] px-3 py-1 rounded-full border border-[#E0E7D8] dark:border-[#29384D]">
            {totalUnits} Units Total
          </span>
        </div>
      </div>

      {/* Refined Single Horizontal Segmented Bar */}
      <div className="w-full h-3.5 bg-[#F1F5E9] dark:bg-[#101A2A] rounded-full overflow-hidden flex border border-[#E0E7D8] dark:border-[#29384D]">
        <div
          title={`Stable: ${stable} units (${stablePct}%)`}
          className="h-full transition-all duration-300"
          style={{ width: `${stablePct}%`, backgroundColor: categories[0].color }}
        />
        <div
          title={`Moderate: ${moderate} units (${moderatePct}%)`}
          className="h-full opacity-80 transition-all duration-300"
          style={{ width: `${moderatePct}%`, backgroundColor: categories[1].color }}
        />
        <div
          title={`Elevated: ${elevated} units (${elevatedPct}%)`}
          className="h-full transition-all duration-300"
          style={{ width: `${elevatedPct}%`, backgroundColor: categories[2].color }}
        />
        <div
          title={`Critical: ${critical} units (${criticalPct}%)`}
          className="h-full transition-all duration-300"
          style={{ width: `${criticalPct}%`, backgroundColor: categories[3].color }}
        />
      </div>

      {/* Numerical Breakdown Items */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {categories.map((cat) => {
          const isSelected = selectedStatus === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectStatus?.(cat.id as UnitStatus)}
              className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#E1EFBD] dark:bg-[#26371E] border-[#70873B]/40 dark:border-[#C9DFA0]/40 shadow-2xs'
                  : 'bg-white dark:bg-[#152235] border-[#E0E7D8] dark:border-[#29384D] hover:bg-[#F8FAF5] dark:hover:bg-[#101A2A]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                <div>
                  <span className="text-xs font-semibold text-[#0B1830] dark:text-[#E8EEF5] block">{cat.label}</span>
                  <span className="text-[10px] font-mono text-[#89947F] dark:text-[#7F8C9B]">{cat.percentage}%</span>
                </div>
              </div>
              <span className={`text-base font-extrabold font-mono ${cat.textColor}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
