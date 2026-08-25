import React, { useState } from 'react';
import type { UnitReadinessRecord, SectorDistribution } from '../../types/commander';
import { UnitReadinessTable } from '../../components/commander/UnitReadinessTable';
import { SectorDistributionBar } from '../../components/commander/SectorDistributionBar';
import { Activity, ShieldCheck } from 'lucide-react';

interface CommanderReadinessViewProps {
  unitRecords: UnitReadinessRecord[];
  sectorDistribution: SectorDistribution;
  onSelectUnitRecord: (record: UnitReadinessRecord) => void;
}

export const CommanderReadinessView: React.FC<CommanderReadinessViewProps> = ({
  unitRecords,
  sectorDistribution,
  onSelectUnitRecord,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#152235] border border-[#E0E7D8] dark:border-[#29384D] rounded-[17px] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#70873B] dark:text-[#C9DFA0]" />
            <h1 className="text-xl font-extrabold text-[#0B1830] dark:text-[#E8EEF5] font-sans">
              Unit Readiness Workspace
            </h1>
          </div>
          <p className="text-xs text-[#667085] dark:text-[#9AA8B8] mt-1">
            Aggregate operational readiness indices across all 21 monitored sector units. Zero individual identity data exposed.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#70873B] dark:text-[#C9DFA0] bg-[#F1F5E9] dark:bg-[#101A2A] px-3.5 py-2 rounded-xl border border-[#E0E7D8] dark:border-[#29384D]">
          <ShieldCheck className="w-4 h-4" />
          <span>Aggregate Telemetry Only</span>
        </div>
      </div>

      {/* Sector Distribution Summary */}
      <SectorDistributionBar
        distribution={sectorDistribution}
        selectedStatus={selectedStatus}
        onSelectStatus={(s) => setSelectedStatus(s)}
      />

      {/* Dedicated Unit Readiness Table */}
      <UnitReadinessTable
        records={unitRecords}
        selectedStatus={selectedStatus}
        onSelectUnit={onSelectUnitRecord}
      />
    </div>
  );
};
