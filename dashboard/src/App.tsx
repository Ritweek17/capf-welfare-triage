import React from "react";
import { useAuth } from "./auth/useAuth";
import LoginPage from "./views/LoginPage";
import PersonnelView from "./views/PersonnelView";

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

function DashboardPending({ role, onBack }: { role: string; onBack: () => void }) {
  return (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start" }}>
      <div>{role} dashboard integration pending.</div>
      <button
        onClick={onBack}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#334155",
          color: "white",
          border: "none",
          borderRadius: "0.25rem",
          cursor: "pointer"
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#475569")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#334155")}
      >
        Go Back
      </button>
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
      view = <DashboardPending role="COMMANDER" onBack={logout} />;
      break;
    case "WELFARE_OFFICER":
      view = <DashboardPending role="WELFARE_OFFICER" onBack={logout} />;
      break;
    case "PERSONNEL":
      view = <PersonnelView />;
      break;
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
