export type UserRole = 'Commander' | 'WelfareOfficer' | 'Personnel' | 'UnitAdmin';
export type DateRangeOption = 'Last 7 Days' | 'Last 30 Days' | 'Last 90 Days' | 'Year to Date';

export interface RiskDistributionItem {
  name: string;
  value: number;
  color: string;
  percentage: string;
}

export interface TrendDataPoint {
  date: string;
  high: number;
  moderate: number;
  low: number;
  dutyHoursAvg?: number;
}

export interface StressIndicator {
  id: string;
  label: string;
  percentage: number;
  color: string;
  category: string;
  affectedCount: number;
}

export interface AlertItem {
  id: string;
  level: 'High' | 'Moderate' | 'Low';
  title: string;
  unit: string;
  time: string;
  date: string;
  status: 'New' | 'Under Review' | 'Mitigated';
  description: string;
  primaryFactor: string;
  assignedOfficer?: string;
}

export interface CompanyUnit {
  id: string;
  name: string;
  code: string;
  commander: string;
  location: string;
  totalPersonnel: number;
  lowRisk: number;
  moderateRisk: number;
  highRisk: number;
  avgDutyHoursPerWeek: number;
  nightShiftPercentage: number;
  leaveDeficitCount: number;
  status: 'Normal' | 'Elevated Stress' | 'High Attention Required';
}

export interface WelfareReport {
  id: string;
  title: string;
  type: string;
  generatedDate: string;
  fileSize: string;
  summary: string;
  format: 'PDF' | 'CSV';
}

export interface DirectoryResource {
  id: string;
  title: string;
  category: string;
  description: string;
  contactNumber?: string;
  linkText: string;
  iconName: string;
}

// LOGIN EXPERIENCE SPECIFIC TYPES
export type RoleOption = 'commander' | 'welfare_officer' | 'personnel';

export interface RoleConfig {
  id: RoleOption;
  title: string;
  badge: string;
  description: string;
  accentColor: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  icon: string;
  highlights: string[];
  securityNote: string;
  accessLevelLabel: string;
}

export interface SecurityPrivacyFeature {
  title: string;
  description: string;
  icon: string;
}
