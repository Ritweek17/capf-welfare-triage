import type {
  SectorHealthMetrics,
  UnitReadinessRecord,
  AttentionItem,
  SectorDistribution,
  WellbeingTrendPoint,
} from '../types/commander';

export const MOCK_SECTOR_HEALTH: SectorHealthMetrics = {
  wellbeingIndex: 87,
  wellbeingChange: '↑ 4.8%',
  isWellbeingPositive: true,
  readinessIndex: 94,
  readinessChange: '↑ 2.6%',
  isReadinessPositive: true,
  lastSync: '2 min ago',
};

export const MOCK_WELLBEING_TREND: WellbeingTrendPoint[] = [
  { date: 'Jul 26', wellbeingIndex: 81, readinessIndex: 90 },
  { date: 'Jul 30', wellbeingIndex: 82, readinessIndex: 91 },
  { date: 'Aug 03', wellbeingIndex: 80, readinessIndex: 89 },
  { date: 'Aug 07', wellbeingIndex: 83, readinessIndex: 92 },
  { date: 'Aug 11', wellbeingIndex: 85, readinessIndex: 93 },
  { date: 'Aug 15', wellbeingIndex: 84, readinessIndex: 92 },
  { date: 'Aug 19', wellbeingIndex: 86, readinessIndex: 94 },
  { date: 'Aug 24', wellbeingIndex: 87, readinessIndex: 94 },
];

export const MOCK_REQUIRES_ATTENTION: AttentionItem[] = [
  {
    id: 'att-1',
    unitCode: 'Alpha 07',
    unitName: 'Alpha 07 (Rifle Coy)',
    severity: 'HIGH',
    status: 'elevated',
    primaryContributingTrend: 'Stress trend increasing',
    changeOverTime: '↑ 12% / 7 days',
    trendDirection: 'up',
    recommendedAction: 'Review shift rotation density and evaluate unit overtime workload.',
    contributingFactors: [
      { name: 'Operational Overtime', percentage: 68 },
      { name: 'Rest Disruption', percentage: 52 },
      { name: 'Environmental Heat', percentage: 21 },
    ],
  },
  {
    id: 'att-2',
    unitCode: 'Bravo 14',
    unitName: 'Bravo 14 (Support Coy)',
    severity: 'MEDIUM',
    status: 'elevated',
    primaryContributingTrend: 'Fatigue trend detected',
    changeOverTime: '↓ readiness / 72h',
    trendDirection: 'down',
    recommendedAction: 'Mandate minimum 8h consecutive rest window post-patrol rotation.',
    contributingFactors: [
      { name: 'Night Duty Density', percentage: 62 },
      { name: 'Inadequate Rest', percentage: 54 },
    ],
  },
  {
    id: 'att-3',
    unitCode: 'Charlie 03',
    unitName: 'Charlie 03 (Outpost Unit)',
    severity: 'CRITICAL',
    status: 'critical',
    primaryContributingTrend: 'Sustained wellbeing decline',
    changeOverTime: '↓ 14% / 14 days',
    trendDirection: 'down',
    recommendedAction: 'Immediate welfare officer consultation and sector roster rebalancing.',
    contributingFactors: [
      { name: 'Isolation / Outpost Strain', percentage: 74 },
      { name: 'Extended Duty Cycle', percentage: 69 },
      { name: 'Supply Logistics Delay', percentage: 41 },
    ],
  },
];

export const MOCK_SECTOR_DISTRIBUTION: SectorDistribution = {
  totalUnits: 21,
  stable: 11,
  moderate: 7,
  elevated: 2,
  critical: 1,
};

export const MOCK_UNIT_RECORDS: UnitReadinessRecord[] = [
  { id: 'u1', code: 'Alpha 07', name: 'Alpha 07 (Rifle Coy)', wellbeing: 82, readiness: 87, trend: 'down', trendValue: '↓ 3.2%', status: 'elevated', personnelCount: 64, primaryStressor: 'Operational Overtime', lastCheckIn: '10m ago', detailsNote: 'Stress trend increasing over recent 7-day window.' },
  { id: 'u2', code: 'Bravo 14', name: 'Bravo 14 (Support Coy)', wellbeing: 76, readiness: 84, trend: 'down', trendValue: '↓ 4.1%', status: 'elevated', personnelCount: 68, primaryStressor: 'Night Duty Density', lastCheckIn: '15m ago', detailsNote: 'Fatigue trend detected post-patrol deployment.' },
  { id: 'u3', code: 'Charlie 03', name: 'Charlie 03 (Outpost Unit)', wellbeing: 61, readiness: 70, trend: 'down', trendValue: '↓ 8.4%', status: 'critical', personnelCount: 60, primaryStressor: 'Outpost Strain', lastCheckIn: '5m ago', detailsNote: 'Sustained wellbeing decline across past 14 days.' },
  { id: 'u4', code: 'Delta 09', name: 'Delta 09 (Logistics)', wellbeing: 94, readiness: 97, trend: 'up', trendValue: '↑ 1.8%', status: 'stable', personnelCount: 58, primaryStressor: 'Low', lastCheckIn: '8m ago', detailsNote: 'Optimal operational readiness.' },
  { id: 'u5', code: 'Echo 12', name: 'Echo 12 (HQ Detachment)', wellbeing: 89, readiness: 93, trend: 'up', trendValue: '↑ 2.2%', status: 'stable', personnelCount: 72, primaryStressor: 'Workload', lastCheckIn: '2m ago', detailsNote: 'Stable roster index.' },
  { id: 'u6', code: 'Foxtrot 02', name: 'Foxtrot 02 (Signals)', wellbeing: 78, readiness: 86, trend: 'down', trendValue: '↓ 1.4%', status: 'moderate', personnelCount: 55, primaryStressor: 'Shift Overtime', lastCheckIn: '12m ago', detailsNote: 'Moderate workload pressure.' },
  { id: 'u7', code: 'Golf 18', name: 'Golf 18 (Recon Squad)', wellbeing: 91, readiness: 95, trend: 'up', trendValue: '↑ 0.9%', status: 'stable', personnelCount: 42, primaryStressor: 'Low', lastCheckIn: '22m ago', detailsNote: 'Stable patrol performance.' },
  { id: 'u8', code: 'Hotel 05', name: 'Hotel 05 (Transport)', wellbeing: 88, readiness: 92, trend: 'up', trendValue: '↑ 3.1%', status: 'stable', personnelCount: 66, primaryStressor: 'Physical Strain', lastCheckIn: '4m ago', detailsNote: 'Good recovery cycle.' },
  { id: 'u9', code: 'India 11', name: 'India 11 (Border Patrol)', wellbeing: 74, readiness: 82, trend: 'down', trendValue: '↓ 2.0%', status: 'moderate', personnelCount: 50, primaryStressor: 'Environmental Heat', lastCheckIn: '18m ago', detailsNote: 'Heat exposure monitoring.' },
  { id: 'u10', code: 'Juliet 04', name: 'Juliet 04 (Comm Command)', wellbeing: 95, readiness: 98, trend: 'up', trendValue: '↑ 1.2%', status: 'stable', personnelCount: 48, primaryStressor: 'Low', lastCheckIn: '7m ago', detailsNote: 'Peak readiness index.' },
  { id: 'u11', code: 'Kilo 15', name: 'Kilo 15 (Medical Squad)', wellbeing: 79, readiness: 85, trend: 'up', trendValue: '↑ 0.5%', status: 'moderate', personnelCount: 38, primaryStressor: 'High Triage Workload', lastCheckIn: '1m ago', detailsNote: 'Balanced duty cycles.' },
  { id: 'u12', code: 'Lima 08', name: 'Lima 08 (Quartermaster)', wellbeing: 87, readiness: 92, trend: 'up', trendValue: '↑ 2.0%', status: 'stable', personnelCount: 62, primaryStressor: 'Physical Strain', lastCheckIn: '9m ago', detailsNote: 'Stable logistical throughput.' },
  { id: 'u13', code: 'Mike 21', name: 'Mike 21 (Armory Guard)', wellbeing: 86, readiness: 91, trend: 'up', trendValue: '↑ 1.5%', status: 'stable', personnelCount: 54, primaryStressor: 'Low', lastCheckIn: '14m ago', detailsNote: 'Normal guard rotation.' },
  { id: 'u14', code: 'November 01', name: 'November 01 (Outpost Alpha)', wellbeing: 75, readiness: 83, trend: 'down', trendValue: '↓ 1.8%', status: 'moderate', personnelCount: 46, primaryStressor: 'Rest Disruption', lastCheckIn: '30m ago', detailsNote: 'Monitoring sleep windows.' },
  { id: 'u15', code: 'Oscar 19', name: 'Oscar 19 (Reserve Coy)', wellbeing: 92, readiness: 96, trend: 'up', trendValue: '↑ 3.4%', status: 'stable', personnelCount: 56, primaryStressor: 'Low', lastCheckIn: '11m ago', detailsNote: 'Fully rested reserve strength.' },
  { id: 'u16', name: 'Papa 06 (Quick Response)', code: 'Papa 06', wellbeing: 90, readiness: 95, trend: 'up', trendValue: '↑ 2.8%', status: 'stable', personnelCount: 70, primaryStressor: 'Low', lastCheckIn: '3m ago', detailsNote: 'High readiness posture.' },
  { id: 'u17', code: 'Quebec 10', name: 'Quebec 10 (Engineering)', wellbeing: 77, readiness: 84, trend: 'down', trendValue: '↓ 1.2%', status: 'moderate', personnelCount: 64, primaryStressor: 'Physical Strain', lastCheckIn: '6m ago', detailsNote: 'Heavy duty cycle.' },
  { id: 'u18', code: 'Romeo 16', name: 'Romeo 16 (Heavy Squad)', wellbeing: 88, readiness: 93, trend: 'up', trendValue: '↑ 1.9%', status: 'stable', personnelCount: 52, primaryStressor: 'Low', lastCheckIn: '16m ago', detailsNote: 'Stable unit metrics.' },
  { id: 'u19', code: 'Sierra 13', name: 'Sierra 13 (Logistics B)', wellbeing: 73, readiness: 81, trend: 'down', trendValue: '↓ 2.5%', status: 'moderate', personnelCount: 58, primaryStressor: 'Inadequate Rest', lastCheckIn: '20m ago', detailsNote: 'Shift density adjustment scheduled.' },
  { id: 'u20', code: 'Tango 20', name: 'Tango 20 (Forward Post)', wellbeing: 93, readiness: 96, trend: 'up', trendValue: '↑ 2.7%', status: 'stable', personnelCount: 62, primaryStressor: 'Low', lastCheckIn: '13m ago', detailsNote: 'High operational morale.' },
  { id: 'u21', code: 'Uniform 17', name: 'Uniform 17 (Staff Unit)', wellbeing: 76, readiness: 83, trend: 'down', trendValue: '↓ 1.0%', status: 'moderate', personnelCount: 75, primaryStressor: 'Workload', lastCheckIn: '5m ago', detailsNote: 'Routine monitoring active.' },
];
