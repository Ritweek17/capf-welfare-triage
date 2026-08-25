export type UserRole = "COMMANDER" | "WELFARE_OFFICER" | "PERSONNEL";

export interface LoginResponse {
  access_token: string;
  role: string;
  person_id: string;
}

export interface AuthSession {
  accessToken: string;
  serviceId: string;
  personId: string;
  role: UserRole;
}

export interface CheckInRequest {
  mood_score: number;
  note?: string;
  structured_responses?: {
    sleep_quality: number;
    irritability: number;
    energy_level: number;
  };
}

export interface CheckInResponse {
  status: string;
  checkin_id: string;
  timestamp: string;
}

export interface AlertFactor {
  factor: string;
  deviation: string;
}

export interface AlertItem {
  alert_id: string;
  person_id: string;
  flagged_at: string;
  score: number;
  display_score: number;
  factors: AlertFactor[];
  suggested_tier?: string | null;
  status: string;
}

export type InterventionStatus = "reviewed" | "follow_up_scheduled" | "closed";

export interface UnitTrendPoint {
  date: string;
  avg_risk_indicator: number;
  checkin_participation_rate: number;
}

export interface UnitSummary {
  unit: string;
  trend_30d: UnitTrendPoint[];
  open_alert_count: number;
  personnel_count: number;
}
