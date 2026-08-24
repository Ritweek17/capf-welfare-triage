import { useState, useEffect } from "react";
import type { AuthSession, UserRole } from "../types/auth";
import { loginRequest } from "../api/client";

const SESSION_KEY = "centurion-session";

function normalizeRole(role: string): UserRole {
  const upperRole = role.toUpperCase();
  if (
    upperRole === "COMMANDER" ||
    upperRole === "WELFARE_OFFICER" ||
    upperRole === "PERSONNEL"
  ) {
    return upperRole as UserRole;
  }
  throw new Error(`Unsupported role: ${role}`);
}

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const storedSession = localStorage.getItem(SESSION_KEY);
    if (storedSession) {
      try {
        setSession(JSON.parse(storedSession));
      } catch (error) {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsInitializing(false);
  }, []);

  const login = async (serviceId: string, password: string) => {
    const response = await loginRequest(serviceId, password);
    const normalizedRole = normalizeRole(response.role);

    const newSession: AuthSession = {
      accessToken: response.access_token,
      serviceId,
      personId: response.person_id,
      role: normalizedRole,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    setSession(newSession);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  return {
    session,
    isAuthenticated: session !== null,
    login,
    logout,
    isInitializing,
  };
}

export function getStoredAccessToken(): string | null {
  const storedSession = localStorage.getItem(SESSION_KEY);
  if (storedSession) {
    try {
      const session = JSON.parse(storedSession) as AuthSession;
      return session.accessToken;
    } catch (error) {
      return null;
    }
  }
  return null;
}
