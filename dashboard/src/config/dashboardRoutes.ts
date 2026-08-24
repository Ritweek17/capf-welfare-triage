import type { UserRole } from "../types/auth";

const DEFAULT_COMMANDER_DASHBOARD_URL =
  "http://localhost:5174/#commander";
const DEFAULT_WELFARE_DASHBOARD_URL =
  "http://localhost:3000/";
const DEFAULT_PERSONNEL_DASHBOARD_URL =
  "http://localhost:3000/personal";

const dashboardUrls: Partial<Record<UserRole, string>> = {
  COMMANDER:
    import.meta.env.VITE_COMMANDER_DASHBOARD_URL ||
    DEFAULT_COMMANDER_DASHBOARD_URL,
  WELFARE_OFFICER:
    import.meta.env.VITE_WELFARE_DASHBOARD_URL ||
    DEFAULT_WELFARE_DASHBOARD_URL,
  PERSONNEL:
    import.meta.env.VITE_PERSONNEL_DASHBOARD_URL ||
    DEFAULT_PERSONNEL_DASHBOARD_URL,
};

export function getDashboardUrl(role: UserRole): string | null {
  return dashboardUrls[role] ?? null;
}
