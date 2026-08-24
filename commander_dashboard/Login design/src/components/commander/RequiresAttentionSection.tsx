import React from 'react';
import type { AttentionItem, AlertSeverity } from '../../types/commander';
import { AlertTriangle, ArrowRight, Info } from 'lucide-react';

interface RequiresAttentionSectionProps {
  items: AttentionItem[];
  onSelectUnit: (item: AttentionItem) => void;
}

export const RequiresAttentionSection: React.FC<RequiresAttentionSectionProps> = ({
  items,
  onSelectUnit,
}) => {
  const statusPillStyles: Record<AlertSeverity, string> = {
    CRITICAL: 'bg-[#C85A54]/10 dark:bg-[#C77A7A]/15 text-[#C85A54] dark:text-[#C77A7A] border-[#C85A54]/25 dark:border-[#C77A7A]/30',
    HIGH: 'bg-[#C58A2B]/10 dark:bg-[#C4A56A]/15 text-[#C58A2B] dark:text-[#C4A56A] border-[#C58A2B]/25 dark:border-[#C4A56A]/30',
    MEDIUM: 'bg-[#C58A2B]/10 dark:bg-[#C4A56A]/15 text-[#C58A2B] dark:text-[#C4A56A] border-[#C58A2B]/25 dark:border-[#C4A56A]/30',
    LOW: 'bg-[#F1F5E9] dark:bg-[#101A2A] text-[#667085] dark:text-[#9AA8B8] border-[#E0E7D8] dark:border-[#29384D]',
  };

  return (
    <section className="bg-white dark:bg-[#152235] border border-[#E0E7D8] dark:border-[#29384D] rounded-[17px] p-6 shadow-xs font-sans space-y-4 transition-colors duration-250">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E0E7D8]/60 dark:border-[#29384D]/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-mono font-bold text-[#0B1830] dark:text-[#E8EEF5] uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#C58A2B] dark:text-[#C4A56A]" />
              REQUIRES ATTENTION
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#C58A2B]/15 dark:bg-[#C4A56A]/15 text-[#C58A2B] dark:text-[#C4A56A] font-mono text-[10px] font-bold">
              03 UNITS
            </span>
          </div>
          <p className="text-xs text-[#667085] dark:text-[#9AA8B8] mt-0.5">
            03 units require welfare review · Click any unit for aggregate roster telemetry
          </p>
        </div>

        <span className="text-[11px] font-mono text-[#89947F] dark:text-[#7F8C9B] flex items-center gap-1">
          <Info className="w-3.5 h-3.5" /> Privacy protected · Aggregate only
        </span>
      </div>

      {/* 3 Clean Horizontal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => {
          const pillStyle = statusPillStyles[item.severity];
          return (
            <div
              key={item.id}
              onClick={() => onSelectUnit(item)}
              className="p-5 rounded-xl bg-white dark:bg-[#152235] border border-[#E0E7D8] dark:border-[#29384D] hover:border-[#70873B]/40 dark:hover:border-[#C9DFA0]/40 hover:bg-[#F8FAF5] dark:hover:bg-[#101A2A] transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Unit Name & Status */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-base text-[#0B1830] dark:text-[#E8EEF5] font-sans group-hover:text-[#70873B] dark:group-hover:text-[#C9DFA0] transition-colors">
                    {item.unitCode}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase ${pillStyle}`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Primary Trend */}
                <p className="text-xs font-semibold text-[#0B1830] dark:text-[#E8EEF5]">
                  {item.primaryContributingTrend}
                </p>
                <p className="text-xs font-mono text-[#667085] dark:text-[#9AA8B8] mt-1 font-medium">
                  {item.changeOverTime}
                </p>
              </div>

              {/* Action Link */}
              <div className="pt-3 border-t border-[#E0E7D8]/60 dark:border-[#29384D]/80 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-[#89947F] dark:text-[#7F8C9B]">Unit Welfare Review</span>

                <span className="text-[#70873B] dark:text-[#C9DFA0] font-bold text-xs group-hover:underline flex items-center gap-1">
                  Review unit <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
