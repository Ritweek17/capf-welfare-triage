import type { UserRole } from "../types/auth";

const DEFAULT_COMMANDER_DASHBOARD_URL =
  "/commander/#commander";
const DEFAULT_WELFARE_DASHBOARD_URL =
  "/welfare/";
const DEFAULT_PERSONNEL_DASHBOARD_URL =
  "/welfare/personnel";

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
