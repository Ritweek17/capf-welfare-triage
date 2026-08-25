import React from 'react';
import type {
  SectorHealthMetrics,
  WellbeingTrendPoint,
  AttentionItem,
  SectorDistribution,
  UnitReadinessRecord,
} from '../../types/commander';

import { SectorHealthHero } from '../../components/commander/SectorHealthHero';
import { RequiresAttentionSection } from '../../components/commander/RequiresAttentionSection';
import { SectorDistributionBar } from '../../components/commander/SectorDistributionBar';
import { UnitReadinessTable } from '../../components/commander/UnitReadinessTable';

interface CommanderOverviewViewProps {
  healthMetrics: SectorHealthMetrics;
  trendData: WellbeingTrendPoint[];
  attentionItems: AttentionItem[];
  sectorDistribution: SectorDistribution;
  unitRecords: UnitReadinessRecord[];
  selectedStatusFilter: string;
  onSelectStatusFilter: (status: string) => void;
  onSelectAttentionItem: (item: AttentionItem) => void;
  onSelectUnitRecord: (record: UnitReadinessRecord) => void;
}

export const CommanderOverviewView: React.FC<CommanderOverviewViewProps> = ({
  healthMetrics,
  trendData,
  attentionItems,
  sectorDistribution,
  unitRecords,
  selectedStatusFilter,
  onSelectStatusFilter,
  onSelectAttentionItem,
  onSelectUnitRecord,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* HERO SECTION: Sector Health */}
      <SectorHealthHero metrics={healthMetrics} trendData={trendData} />

      {/* ATTENTION SECTION: Requires Attention */}
      <RequiresAttentionSection
        items={attentionItems}
        onSelectUnit={onSelectAttentionItem}
      />

      {/* SECTOR DISTRIBUTION */}
      <SectorDistributionBar
        distribution={sectorDistribution}
        selectedStatus={selectedStatusFilter}
        onSelectStatus={(status) => onSelectStatusFilter(status)}
      />

      {/* UNIT READINESS TABLE */}
      <UnitReadinessTable
        records={unitRecords}
        selectedStatus={selectedStatusFilter}
        onSelectUnit={onSelectUnitRecord}
      />
    </div>
  );
};
