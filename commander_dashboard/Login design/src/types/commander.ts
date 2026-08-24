export type DateRangeOption = '7d' | '14d' | '30d' | '90d';

export type UnitStatus = 'stable' | 'moderate' | 'elevated' | 'critical';

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface SectorHealthMetrics {
  wellbeingIndex: number;
  wellbeingChange: string;
  isWellbeingPositive: boolean;
  readinessIndex: number;
  readinessChange: string;
  isReadinessPositive: boolean;
  lastSync: string;
}

export interface UnitReadinessRecord {
  id: string;
  code: string;
  name: string;
  wellbeing: number;
  readiness: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  status: UnitStatus;
  personnelCount: number;
  primaryStressor?: string;
  lastCheckIn?: string;
  detailsNote?: string;
}

export interface AttentionItem {
  id: string;
  unitCode: string;
  unitName: string;
  severity: AlertSeverity;
  status: UnitStatus;
  primaryContributingTrend: string;
  changeOverTime: string;
  trendDirection: 'up' | 'down';
  recommendedAction: string;
  contributingFactors: { name: string; percentage: number }[];
}

export interface SectorDistribution {
  totalUnits: number;
  stable: number;
  moderate: number;
  elevated: number;
  critical: number;
}

export interface WellbeingTrendPoint {
  date: string;
  wellbeingIndex: number;
  readinessIndex: number;
}
