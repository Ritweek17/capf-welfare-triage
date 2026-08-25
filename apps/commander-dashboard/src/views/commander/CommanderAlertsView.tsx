import React from 'react';
import type { AttentionItem, UnitReadinessRecord, AlertSeverity } from '../../types/commander';
import { AlertTriangle, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';

interface CommanderAlertsViewProps {
  attentionItems: AttentionItem[];
  unitRecords: UnitReadinessRecord[];
  onSelectUnit: (item: AttentionItem) => void;
}

export const CommanderAlertsView: React.FC<CommanderAlertsViewProps> = ({
  attentionItems,
  onSelectUnit,
}) => {
  const severityBadgeStyles: Record<AlertSeverity, string> = {
    CRITICAL: 'bg-[#C85A54]/10 dark:bg-[#C77A7A]/15 text-[#C85A54] dark:text-[#C77A7A] border-[#C85A54]/25 dark:border-[#C77A7A]/30',
    HIGH: 'bg-[#C58A2B]/10 dark:bg-[#C4A56A]/15 text-[#C58A2B] dark:text-[#C4A56A] border-[#C58A2B]/25 dark:border-[#C4A56A]/30',
    MEDIUM: 'bg-[#C58A2B]/10 dark:bg-[#C4A56A]/15 text-[#C58A2B] dark:text-[#C4A56A] border-[#C58A2B]/25 dark:border-[#C4A56A]/30',
    LOW: 'bg-[#F1F5E9] dark:bg-[#101A2A] text-[#667085] dark:text-[#9AA8B8] border-[#E0E7D8] dark:border-[#29384D]',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 font-sans">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#152235] border border-[#E0E7D8] dark:border-[#29384D] rounded-[17px] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#C58A2B] dark:text-[#C4A56A]" />
            <h1 className="text-xl font-extrabold text-[#0B1830] dark:text-[#E8EEF5] font-sans">
              Active Alerts Workspace
            </h1>
          </div>
          <p className="text-xs text-[#667085] dark:text-[#9AA8B8] mt-1">
            Real-time aggregate sector telemetry alerts requiring commander welfare review or operational shift rebalancing.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C58A2B] dark:text-[#C4A56A] bg-[#C58A2B]/10 dark:bg-[#C4A56A]/15 px-3.5 py-2 rounded-xl border border-[#C58A2B]/20">
          <span>03 ACTIVE ALERTS</span>
        </div>
      </div>

      {/* Active Alerts List */}
      <div className="space-y-4">
        {attentionItems.map((item) => {
          const badgeStyle = severityBadgeStyles[item.severity];
          return (
            <div
              key={item.id}
              onClick={() => onSelectUnit(item)}
              className="bg-white dark:bg-[#152235] border border-[#E0E7D8] dark:border-[#29384D] hover:border-[#70873B]/40 dark:hover:border-[#C9DFA0]/40 rounded-[17px] p-6 shadow-xs hover:shadow-sm transition-all cursor-pointer group space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E0E7D8]/60 dark:border-[#29384D]/80 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-extrabold text-[#0B1830] dark:text-[#E8EEF5] font-sans group-hover:text-[#70873B] dark:group-hover:text-[#C9DFA0] transition-colors">
                    {item.unitCode}
                  </span>
                  <span className="text-xs text-[#667085] dark:text-[#9AA8B8]">({item.unitName})</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${badgeStyle}`}>
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[#89947F] dark:text-[#7F8C9B]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Detected 2h ago</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#667085] dark:text-[#9AA8B8] uppercase block">
                    PRIMARY DETECTED TREND
                  </span>
                  <p className="font-bold text-[#0B1830] dark:text-[#E8EEF5] mt-0.5">
                    {item.primaryContributingTrend}
                  </p>
                  <p className="font-mono text-[#70873B] dark:text-[#C9DFA0] text-[11px]">
                    {item.changeOverTime}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold text-[#667085] dark:text-[#9AA8B8] uppercase block">
                    RECOMMENDED COMMAND ACTION
                  </span>
                  <p className="text-[#667085] dark:text-[#9AA8B8] mt-0.5">
                    {item.recommendedAction}
                  </p>
                </div>

                <div className="flex items-center justify-end">
                  <span className="text-[#70873B] dark:text-[#C9DFA0] font-bold group-hover:underline inline-flex items-center gap-1.5 text-xs">
                    Inspect Aggregate Unit Data <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resolved Telemetry Section */}
      <div className="bg-white dark:bg-[#152235] border border-[#E0E7D8] dark:border-[#29384D] rounded-[17px] p-6 shadow-xs space-y-3 transition-colors">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0B1830] dark:text-[#E8EEF5]">
          <CheckCircle2 className="w-4 h-4 text-[#70873B] dark:text-[#C9DFA0]" />
          <span>Recently Resolved Sector Alerts (Past 7 Days)</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#F8FAF5] dark:bg-[#101A2A] border border-[#E0E7D8] dark:border-[#29384D] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0B1830] dark:text-[#E8EEF5]">Delta 09</span>
            <span className="text-[#667085] dark:text-[#9AA8B8]">· Rest Cycle Rebalanced</span>
          </div>
          <span className="font-mono text-[#70873B] dark:text-[#C9DFA0] font-bold">Resolved Yesterday</span>
        </div>
      </div>
    </div>
  );
};
