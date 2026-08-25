import type {
  AlertItem,
  CheckInRequest,
  CheckInResponse,
  LoginResponse,
  InterventionStatus,
  UnitSummary,
} from "../types/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const SESSION_KEY = "centurion-session";

function getStoredAccessToken(): string | null {
  const storedSession = localStorage.getItem(SESSION_KEY);
  if (!storedSession) {
    return null;
  }
  try {
    return (JSON.parse(storedSession) as { accessToken?: string }).accessToken ?? null;
  } catch {
    return null;
  }
}

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getStoredAccessToken();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
    });
  } catch {
    throw new Error("Unable to connect to the welfare service.");
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error("You are not authorized for this welfare action.");
  }
  if (!response.ok) {
    throw new Error("The welfare service could not complete that request.");
  }
  return (await response.json()) as T;
}

export async function loginRequest(
  serviceId: string,
  password: string,
): Promise<LoginResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service_id: serviceId, password }),
    });
  } catch {
    throw new Error("Unable to connect to the authentication service.");
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error("Invalid Service ID or password.");
  }
  if (!response.ok) {
    throw new Error("Unable to sign in at the moment.");
  }

  const data = (await response.json()) as Partial<LoginResponse>;
  if (!data.access_token || !data.role || !data.person_id) {
    throw new Error("Invalid authentication response.");
  }
  return data as LoginResponse;
}

export async function submitCheckIn(
  payload: CheckInRequest,
): Promise<CheckInResponse> {
  return apiRequest<CheckInResponse>("/checkins", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  const response = await apiRequest<{ alerts: AlertItem[] }>("/alerts");
  return response.alerts;
}

export async function logIntervention(
  alertId: string,
  actionTaken: string,
  notes: string,
  status: InterventionStatus,
  followUpDate: string,
): Promise<void> {
  await apiRequest(`/alerts/${alertId}/log`, {
    method: "POST",
    body: JSON.stringify({
      action_taken: actionTaken,
      notes,
      status,
      follow_up_date: followUpDate || null,
    }),
  });
}

export async function fetchUnitSummary(): Promise<UnitSummary> {
  return apiRequest<UnitSummary>("/unit-summary");
}
