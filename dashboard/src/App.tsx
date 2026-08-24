import React from "react";
import { useAuth } from "./auth/useAuth";
import { getDashboardUrl } from "./config/dashboardRoutes";
import LoginPage from "./views/LoginPage";
import type { UserRole } from "./types/auth";

function AuthenticatedShell({
  children,
  role,
  personId,
  onLogout,
}: {
  children: React.ReactNode;
  role: string;
  personId: string;
  onLogout: () => void;
}) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          backgroundColor: "#1e293b",
          borderBottom: "1px solid #334155",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#84cc16" }}>
            CENTURION
          </h1>
          <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            {role} &middot; {personId}
          </span>
        </div>
        <button
          onClick={onLogout}
          style={{
            backgroundColor: "transparent",
            color: "#f8fafc",
            border: "1px solid #475569",
            padding: "0.5rem 1rem",
            borderRadius: "0.25rem",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#334155")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          Sign Out
        </button>
      </header>
      <main>{children}</main>
    </div>
  );
}

function DashboardRedirect({ role }: { role: UserRole }) {
  const dashboardUrl = getDashboardUrl(role);

  React.useEffect(() => {
    if (dashboardUrl) {
      window.location.replace(dashboardUrl);
    }
  }, [dashboardUrl]);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        backgroundColor: "#0f172a",
        color: "#f8fafc",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <strong>Access verified</strong>
        <p style={{ color: "#94a3b8" }}>
          Opening your authorized dashboard...
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const { session, isAuthenticated, login, logout, isInitializing } = useAuth();
  const hasPushedHistory = React.useRef(false);

  React.useEffect(() => {
    if (!isAuthenticated) {
      hasPushedHistory.current = false;
      return;
    }

    if (!hasPushedHistory.current) {
      if (!window.history.state?.centurionAuthenticated) {
        window.history.pushState({ centurionAuthenticated: true }, "", window.location.href);
      }
      hasPushedHistory.current = true;
    }

    const handlePopState = () => {
      logout();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isAuthenticated, logout]);

  if (isInitializing) {
    return null; // Or a loading spinner if preferred
  }

  if (!isAuthenticated || !session) {
    return <LoginPage onLogin={login} />;
  }

  let view = <LoginPage onLogin={login} />;
  switch (session.role) {
    case "COMMANDER":
      return <DashboardRedirect role="COMMANDER" />;
    case "WELFARE_OFFICER":
      return <DashboardRedirect role="WELFARE_OFFICER" />;
    case "PERSONNEL":
      return <DashboardRedirect role="PERSONNEL" />;
  }

  return (
    <AuthenticatedShell
      role={session.role}
      personId={session.personId}
      onLogout={logout}
    >
      {view}
    </AuthenticatedShell>
  );
}
