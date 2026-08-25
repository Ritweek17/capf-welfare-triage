import type { 
  RiskDistributionItem, 
  TrendDataPoint, 
  StressIndicator, 
  AlertItem, 
  CompanyUnit, 
  WelfareReport, 
  DirectoryResource 
} from '../types';

export const INITIAL_RISK_DISTRIBUTION: RiskDistributionItem[] = [
  { name: 'Low Risk', value: 892, color: '#10B981', percentage: '71.5%' },
  { name: 'Moderate Risk', value: 228, color: '#F59E0B', percentage: '18.3%' },
  { name: 'High Risk', value: 128, color: '#EF4444', percentage: '10.2%' },
];

export const TREND_DATA_30_DAYS: TrendDataPoint[] = [
  { date: 'May 1', high: 32, moderate: 48, low: 88, dutyHoursAvg: 58 },
  { date: 'May 8', high: 30, moderate: 58, low: 84, dutyHoursAvg: 60 },
  { date: 'May 15', high: 41, moderate: 42, low: 104, dutyHoursAvg: 64 },
  { date: 'May 22', high: 28, moderate: 56, low: 96, dutyHoursAvg: 59 },
  { date: 'May 29', high: 38, moderate: 60, low: 122, dutyHoursAvg: 62 },
  { date: 'Jun 5', high: 35, moderate: 62, low: 115, dutyHoursAvg: 61 },
  { date: 'Jun 12', high: 29, moderate: 50, low: 130, dutyHoursAvg: 56 },
];

export const STRESS_INDICATORS_DATA: StressIndicator[] = [
  { id: 'ind-1', label: 'High Duty Hours (>60h/wk)', percentage: 68, color: 'bg-rose-500', category: 'Operational', affectedCount: 848 },
  { id: 'ind-2', label: 'Frequent Night Duties (>3 consecutive)', percentage: 54, color: 'bg-amber-500', category: 'Operational', affectedCount: 673 },
  { id: 'ind-3', label: 'Long Deployment (>180 days away)', percentage: 47, color: 'bg-amber-500', category: 'Deployment', affectedCount: 586 },
  { id: 'ind-4', label: 'Insufficient Leave Granted (<15 days/yr)', percentage: 41, color: 'bg-amber-400', category: 'Administrative', affectedCount: 511 },
  { id: 'ind-5', label: 'Irregular Rest Cycles (<6h sleep window)', percentage: 32, color: 'bg-amber-300', category: 'Health', affectedCount: 399 },
];

export const INITIAL_ALERTS: AlertItem[] = [
  { 
    id: 'alt-1', 
    level: 'High', 
    title: 'High Risk Increase (+18%)', 
    unit: 'Alpha Company', 
    time: '10 mins ago',
    date: 'Today 14:15',
    status: 'New',
    description: 'Alpha Company experienced a sharp surge in high stress indicators following 14 consecutive days of high-intensity border patrol deployment.',
    primaryFactor: 'High Duty Hours & Consecutive Night Duties',
    assignedOfficer: 'Unassigned'
  },
  { 
    id: 'alt-2', 
    level: 'Moderate', 
    title: 'Moderate Risk Spike', 
    unit: 'Bravo Company', 
    time: '25 mins ago',
    date: 'Today 14:00',
    status: 'Under Review',
    description: 'Bravo Company shows elevated rest deficit scores due to continuous night shift rotations during convoy escort operations.',
    primaryFactor: 'Irregular Rest & Night Duty Density',
    assignedOfficer: 'Insp. R. Sharma (Welfare Officer)'
  },
  { 
    id: 'alt-3', 
    level: 'High', 
    title: 'High Duty Hour Alert', 
    unit: 'Charlie Company', 
    time: '45 mins ago',
    date: 'Today 13:40',
    status: 'New',
    description: 'Over 65% personnel in Charlie Company logged over 68 operational duty hours in the preceding 7-day cycle.',
    primaryFactor: 'Overtime Duty Load',
    assignedOfficer: 'Unassigned'
  },
  { 
    id: 'alt-4', 
    level: 'Moderate', 
    title: 'Leave Backlog Threshold', 
    unit: 'Echo Company', 
    time: '2 hours ago',
    date: 'Today 12:15',
    status: 'Under Review',
    description: 'Echo Company has 42 pending leave requests exceeding 30 days processing time due to operational manpower shortages.',
    primaryFactor: 'Insufficient Leave Approval Rate',
    assignedOfficer: 'Sub-Insp. V. Kumar'
  },
  { 
    id: 'alt-5', 
    level: 'Low', 
    title: 'Rest Schedule Normalization', 
    unit: 'Foxtrot Company', 
    time: '4 hours ago',
    date: 'Today 10:30',
    status: 'Mitigated',
    description: 'Foxtrot Company rest cycle rotation restored after completing rotation handover.',
    primaryFactor: 'Rest Cycle Recovery',
    assignedOfficer: 'Capt. A. Singh'
  }
];

export const COMPANY_UNITS: CompanyUnit[] = [
  {
    id: 'unit-alpha',
    name: 'Alpha Company',
    code: 'COY-A',
    commander: 'Maj. R. K. Verma',
    location: 'Forward Base Sector 1',
    totalPersonnel: 156,
    lowRisk: 98,
    moderateRisk: 34,
    highRisk: 24,
    avgDutyHoursPerWeek: 64,
    nightShiftPercentage: 62,
    leaveDeficitCount: 38,
    status: 'High Attention Required'
  },
  {
    id: 'unit-bravo',
    name: 'Bravo Company',
    code: 'COY-B',
    commander: 'Capt. Suresh Menon',
    location: 'Sector 2 Grid',
    totalPersonnel: 160,
    lowRisk: 110,
    moderateRisk: 32,
    highRisk: 18,
    avgDutyHoursPerWeek: 59,
    nightShiftPercentage: 55,
    leaveDeficitCount: 29,
    status: 'Elevated Stress'
  },
  {
    id: 'unit-charlie',
    name: 'Charlie Company',
    code: 'COY-C',
    commander: 'Maj. Vikramaditya',
    location: 'Eastern Defense Zone',
    totalPersonnel: 158,
    lowRisk: 95,
    moderateRisk: 38,
    highRisk: 25,
    avgDutyHoursPerWeek: 66,
    nightShiftPercentage: 68,
    leaveDeficitCount: 44,
    status: 'High Attention Required'
  },
  {
    id: 'unit-delta',
    name: 'Delta Company',
    code: 'COY-D',
    commander: 'Capt. Priya Deshmukh',
    location: 'Central Garrison HQ',
    totalPersonnel: 154,
    lowRisk: 132,
    moderateRisk: 16,
    highRisk: 6,
    avgDutyHoursPerWeek: 48,
    nightShiftPercentage: 28,
    leaveDeficitCount: 12,
    status: 'Normal'
  },
  {
    id: 'unit-echo',
    name: 'Echo Company',
    code: 'COY-E',
    commander: 'Maj. Harvinder Singh',
    location: 'High Altitude Patrol Unit',
    totalPersonnel: 152,
    lowRisk: 104,
    moderateRisk: 32,
    highRisk: 16,
    avgDutyHoursPerWeek: 58,
    nightShiftPercentage: 48,
    leaveDeficitCount: 31,
    status: 'Elevated Stress'
  },
  {
    id: 'unit-foxtrot',
    name: 'Foxtrot Company',
    code: 'COY-F',
    commander: 'Capt. Neil D\'Souza',
    location: 'Reserve Depot Command',
    totalPersonnel: 155,
    lowRisk: 128,
    moderateRisk: 20,
    highRisk: 7,
    avgDutyHoursPerWeek: 50,
    nightShiftPercentage: 32,
    leaveDeficitCount: 15,
    status: 'Normal'
  },
  {
    id: 'unit-golf',
    name: 'Golf Company',
    code: 'COY-G',
    commander: 'Maj. Amitav Roy',
    location: 'Northern Transit Post',
    totalPersonnel: 158,
    lowRisk: 112,
    moderateRisk: 30,
    highRisk: 16,
    avgDutyHoursPerWeek: 57,
    nightShiftPercentage: 44,
    leaveDeficitCount: 22,
    status: 'Elevated Stress'
  },
  {
    id: 'unit-hotel',
    name: 'Hotel Company',
    code: 'COY-H',
    commander: 'Capt. T. Nagpal',
    location: 'HQ Support Battalion',
    totalPersonnel: 155,
    lowRisk: 113,
    moderateRisk: 26,
    highRisk: 16,
    avgDutyHoursPerWeek: 52,
    nightShiftPercentage: 35,
    leaveDeficitCount: 18,
    status: 'Normal'
  }
];

export const WELFARE_REPORTS: WelfareReport[] = [
  {
    id: 'rep-1',
    title: 'Monthly CAPF Unit Welfare & Operational Fatigue Audit',
    type: 'Monthly Executive Audit',
    generatedDate: '2026-08-01',
    fileSize: '2.4 MB',
    summary: 'Comprehensive analysis of duty hours, night shift density, leave accumulation, and aggregate stress risk metrics across all 8 Companies.',
    format: 'PDF'
  },
  {
    id: 'rep-2',
    title: 'High Duty Hours & Rest Cycle Deficit Assessment',
    type: 'Operational Stress Focus',
    generatedDate: '2026-08-15',
    fileSize: '1.8 MB',
    summary: 'Targeted assessment of units exceeding 60 weekly duty hours, identifying high fatigue clusters and recommended deployment rotations.',
    format: 'CSV'
  },
  {
    id: 'rep-3',
    title: 'Leave Processing & Pending Request Backlog Audit',
    type: 'Administrative Welfare',
    generatedDate: '2026-08-20',
    fileSize: '1.1 MB',
    summary: 'Breakdown of personnel leave requests pending >21 days, leave grant rates, and impact on mental readiness indicators.',
    format: 'PDF'
  },
  {
    id: 'rep-4',
    title: 'Welfare Intervention & Tele-Counseling Utilization Log',
    type: 'Welfare Officer Report',
    generatedDate: '2026-08-22',
    fileSize: '890 KB',
    summary: 'Anonymized log of welfare interventions, counseling sessions dispatched, and rest cycle adjustments made.',
    format: 'CSV'
  }
];

export const DIRECTORY_RESOURCES: DirectoryResource[] = [
  {
    id: 'res-1',
    title: 'CAPF Tele-Mental Health Helpline (24/7 National Line)',
    category: 'Emergency Counseling',
    description: 'Toll-free, confidential tele-counseling support line manned by certified psychological officers for CAPF personnel and families.',
    contactNumber: '1800-11-22-33 / 011-2306-7890',
    linkText: 'Call Helpline / Direct Line Access',
    iconName: 'PhoneCall'
  },
  {
    id: 'res-2',
    title: 'CAPF Operational Rest & Duty Rotation Guidelines (SOP-2026)',
    category: 'Policy & SOPs',
    description: 'Official Standard Operating Procedures governing maximum consecutive deployment days, mandatory post-night duty sleep windows, and mandatory leave granting protocols.',
    linkText: 'Download Standard Operating Procedure (PDF)',
    iconName: 'FileText'
  },
  {
    id: 'res-3',
    title: 'Family Welfare & Medical Assistance Portal',
    category: 'Family Welfare',
    description: 'Direct portal for family health insurance claims, educational scholarships for children of CAPF personnel, and housing support applications.',
    linkText: 'Open Welfare Portal',
    iconName: 'Heart'
  },
  {
    id: 'res-4',
    title: 'Commander Fatigue Management & Early Intervention Checklist',
    category: 'Commander Tools',
    description: 'Actionable diagnostic guide for company commanders to recognize fatigue symptoms, reallocate shifts, and request welfare officer assistance.',
    linkText: 'View Intervention Checklist',
    iconName: 'CheckSquare'
  }
];
