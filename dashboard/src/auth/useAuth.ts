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
    const currentUrl = new URL(window.location.href);
    const signOutRequested = currentUrl.searchParams.get("logout") === "1";

    if (signOutRequested) {
      localStorage.removeItem(SESSION_KEY);
      currentUrl.searchParams.delete("logout");
      window.history.replaceState(
        window.history.state,
        "",
        `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`
      );
      setIsInitializing(false);
      return;
    }

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

  const login = async (
    serviceId: string,
    password: string,
    requestedPortal?: UserRole
  ) => {
    const response = await loginRequest(serviceId, password);
    const authenticatedRole = normalizeRole(response.role);

    if (
      requestedPortal &&
      requestedPortal !== "PERSONNEL" &&
      requestedPortal !== authenticatedRole
    ) {
      const portalName = requestedPortal === "COMMANDER" ? "Commander" : "Welfare Officer";
      throw new Error(
        `This account does not have ${portalName} access. Select Personnel to open your private dashboard.`
      );
    }

    // Every authenticated member can use the private Personnel portal.
    // Privileged Commander/Welfare access still requires the matching role.
    const effectiveRole = requestedPortal === "PERSONNEL"
      ? "PERSONNEL"
      : authenticatedRole;

    const newSession: AuthSession = {
      accessToken: response.access_token,
      serviceId,
      personId: response.person_id,
      role: effectiveRole,
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
