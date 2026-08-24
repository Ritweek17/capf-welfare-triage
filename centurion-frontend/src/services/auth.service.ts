import type {
  AuthSession,
  AuthUser,
  UserRole,
} from "../types/auth";

const SESSION_KEY =
  "centurion-session";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000";

interface BackendUser {
  login_id: string;
  personnel_id?: string | null;
  name?: string | null;
  role: string;
  company_id?: string | null;
  company_name?: string | null;
  designation?: string | null;
}

interface BackendLoginResponse {
  access_token: string;
  token_type?: string;
  user: BackendUser;
}

function normalizeRole(
  role: string
): UserRole {
  const normalized = role
    .trim()
    .toUpperCase();

  if (normalized === "COMMANDER") {
    return "COMMANDER";
  }

  if (
    normalized ===
      "WELFARE_OFFICER" ||
    normalized ===
      "WELFARE OFFICER" ||
    normalized ===
      "WELFARE-OFFICER"
  ) {
    return "WELFARE_OFFICER";
  }

  if (normalized === "PERSONNEL") {
    return "PERSONNEL";
  }

  throw new Error(
    `Unsupported user role: ${role}`
  );
}

function mapBackendUser(
  backendUser: BackendUser
): AuthUser {
  return {
    loginId:
      backendUser.login_id,

    personnelId:
      backendUser.personnel_id ??
      undefined,

    name:
      backendUser.name ??
      backendUser.login_id,

    role:
      normalizeRole(
        backendUser.role
      ),

    battalionId:
      backendUser.company_id ??
      undefined,

    battalionName:
      backendUser.company_name ??
      undefined,

    designation:
      backendUser.designation ??
      undefined,
  };
}

export async function login(
  loginId: string,
  password: string
): Promise<AuthSession> {
  const normalizedLoginId =
    loginId.trim();

  if (!normalizedLoginId) {
    throw new Error(
      "Login ID is required."
    );
  }

  if (!password) {
    throw new Error(
      "Password is required."
    );
  }

  let response: Response;

  try {
    response = await fetch(
      `${API_BASE_URL}/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          login_id:
            normalizedLoginId,

          password,
        }),
      }
    );
  } catch {
    throw new Error(
      "Unable to connect to the authentication service."
    );
  }

  if (!response.ok) {
    if (
      response.status === 401 ||
      response.status === 403
    ) {
      throw new Error(
        "Invalid Login ID or password."
      );
    }

    throw new Error(
      "Unable to sign in at the moment."
    );
  }

  const data =
    (await response.json()) as BackendLoginResponse;

  if (
    !data.access_token ||
    !data.user ||
    !data.user.login_id ||
    !data.user.role
  ) {
    throw new Error(
      "Invalid authentication response."
    );
  }

  const user =
    mapBackendUser(data.user);

  const session: AuthSession = {
    accessToken:
      data.access_token,

    user,
  };

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(session)
  );

  return session;
}

export function getSession():
  AuthSession | null {
  const stored =
    localStorage.getItem(
      SESSION_KEY
    );

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(
      stored
    ) as AuthSession;
  } catch {
    localStorage.removeItem(
      SESSION_KEY
    );

    return null;
  }
}

export function getAccessToken():
  string | null {
  return (
    getSession()?.accessToken ??
    null
  );
}

export function isAuthenticated():
  boolean {
  return getSession() !== null;
}

export function logout(): void {
  localStorage.removeItem(
    SESSION_KEY
  );
}

export function getRouteForRole(
  role: UserRole
): string {
  switch (role) {
    case "COMMANDER":
      return "/commander";

    case "WELFARE_OFFICER":
      return "/welfare";

    case "PERSONNEL":
      return "/personnel";

    default:
      return "/login";
  }
}
