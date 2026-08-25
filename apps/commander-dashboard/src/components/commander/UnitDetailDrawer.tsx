import React from 'react';
import type { UnitReadinessRecord, AttentionItem, UnitStatus } from '../../types/commander';
import { X, TrendingUp, Info } from 'lucide-react';

interface UnitDetailDrawerProps {
  unitRecord: UnitReadinessRecord | null;
  attentionItem: AttentionItem | null;
  onClose: () => void;
}

export const UnitDetailDrawer: React.FC<UnitDetailDrawerProps> = ({
  unitRecord,
  attentionItem,
  onClose,
}) => {
  if (!unitRecord && !attentionItem) return null;

  const unitCode = unitRecord?.code || attentionItem?.unitCode || 'Unit Intelligence';
  const unitName = unitRecord?.name || attentionItem?.unitName || unitCode;
  const status: UnitStatus = unitRecord?.status || attentionItem?.status || 'stable';
  const wellbeing = unitRecord?.wellbeing || 82;
  const readiness = unitRecord?.readiness || 87;

  const statusBadgeStyles: Record<UnitStatus, string> = {
    stable: 'text-[#70873B] dark:text-[#C9DFA0] bg-[#70873B]/10 dark:bg-[#C9DFA0]/15 border-[#70873B]/20 dark:border-[#C9DFA0]/30',
    moderate: 'text-[#C58A2B] dark:text-[#C4A56A] bg-[#C58A2B]/10 dark:bg-[#C4A56A]/15 border-[#C58A2B]/20 dark:border-[#C4A56A]/30',
    elevated: 'text-[#C58A2B] dark:text-[#C4A56A] bg-[#C58A2B]/10 dark:bg-[#C4A56A]/15 border-[#C58A2B]/20 dark:border-[#C4A56A]/30',
    critical: 'text-[#C85A54] dark:text-[#C77A7A] bg-[#C85A54]/10 dark:bg-[#C77A7A]/15 border-[#C85A54]/20 dark:border-[#C77A7A]/30',
  };

  const badgeStyle = statusBadgeStyles[status];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-[#152235] border-l border-[#E0E7D8] dark:border-[#29384D] h-full flex flex-col justify-between p-6 shadow-2xl overflow-y-auto text-[#0B1830] dark:text-[#E8EEF5] animate-in slide-in-from-right duration-300 transition-colors">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E0E7D8] dark:border-[#29384D] pb-4 mb-5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#70873B] dark:text-[#C9DFA0] uppercase tracking-wider">
                UNIT AGGREGATE INTELLIGENCE
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#F8FAF5] dark:bg-[#101A2A] text-[#667085] dark:text-[#9AA8B8] hover:text-[#0B1830] dark:hover:text-[#E8EEF5] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Unit Name & Status */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[#0B1830] dark:text-[#E8EEF5] tracking-tight font-sans">
                {unitCode}
              </h2>
              <span
                className={`px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${badgeStyle}`}
              >
                {status}
              </span>
            </div>
            <p className="text-xs text-[#667085] dark:text-[#9AA8B8]">{unitName}</p>
          </div>

          {/* Core Aggregate Numbers */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-4 rounded-xl bg-[#F8FAF5] dark:bg-[#101A2A] border border-[#E0E7D8] dark:border-[#29384D]">
              <span className="text-[10px] font-mono font-bold text-[#667085] dark:text-[#9AA8B8] block uppercase">
                WELLBEING INDEX
              </span>
              <span className="text-2xl font-extrabold text-[#70873B] dark:text-[#C9DFA0] font-mono tracking-tight">
                {wellbeing}%
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#F8FAF5] dark:bg-[#101A2A] border border-[#E0E7D8] dark:border-[#29384D]">
              <span className="text-[10px] font-mono font-bold text-[#667085] dark:text-[#9AA8B8] block uppercase">
                READINESS INDEX
              </span>
              <span className="text-2xl font-extrabold text-[#0B1830] dark:text-[#E8EEF5] font-mono tracking-tight">
                {readiness}%
              </span>
            </div>
          </div>

          {/* Attention Trend or Driver Details */}
          {attentionItem && (
            <div className="p-4 rounded-xl bg-[#F8FAF5] dark:bg-[#101A2A] border border-[#E0E7D8] dark:border-[#29384D] mb-6 space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#C58A2B] dark:text-[#C4A56A] uppercase tracking-wider block">
                WELFARE REVIEW ALERT
              </span>
              <p className="text-xs font-bold text-[#0B1830] dark:text-[#E8EEF5] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#C58A2B] dark:text-[#C4A56A]" />
                {attentionItem.primaryContributingTrend}
              </p>
              <p className="text-xs text-[#667085] dark:text-[#9AA8B8] leading-relaxed">
                {attentionItem.recommendedAction}
              </p>
            </div>
          )}

          {/* Contributing Factors */}
          <div className="space-y-3 mb-6">
            <span className="text-[10px] font-mono font-bold text-[#667085] dark:text-[#9AA8B8] uppercase tracking-wider block">
              PRIMARY AGGREGATE DRIVERS
            </span>
            <div className="space-y-2">
              {[
                { name: 'Operational Overtime', pct: 68 },
                { name: 'Rest Disruption', pct: 52 },
                { name: 'Physical Strain', pct: 31 },
              ].map((f, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-white dark:bg-[#101A2A] border border-[#E0E7D8] dark:border-[#29384D] flex items-center justify-between text-xs"
                >
                  <span className="text-[#667085] dark:text-[#9AA8B8] font-medium">{f.name}</span>
                  <span className="font-mono font-bold text-[#70873B] dark:text-[#C9DFA0]">{f.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Protocol Notice */}
          <div className="p-3 rounded-xl bg-[#F1F5E9] dark:bg-[#101A2A] border border-[#E0E7D8] dark:border-[#29384D] text-[10px] text-[#667085] dark:text-[#9AA8B8] flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-[#70873B] dark:text-[#C9DFA0] shrink-0" />
            <span>
              Privacy protected · All personnel identity vectors remain 100% private. Intelligence presented at aggregate roster level only.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#E0E7D8] dark:border-[#29384D] space-y-2">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-[#70873B] dark:bg-[#C9DFA0] hover:bg-[#4B7361] dark:hover:bg-[#7FA68A] text-white dark:text-[#0D1522] font-extrabold text-xs transition-colors cursor-pointer shadow-xs"
          >
            Acknowledge Unit Telemetry
          </button>
        </div>
      </div>
    </div>
  );
};
