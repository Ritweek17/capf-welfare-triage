import React from "react";
import { LockKeyhole, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "./auth/useAuth";
import LoginPage from "./views/LoginPage";
import CommanderView from "./views/CommanderView";
import PersonnelView from "./views/PersonnelView";
import WelfareOfficerView from "./views/WelfareOfficerView";

function AuthenticatedShell({
  children,
  role,
  onLogout,
}: {
  children: React.ReactNode;
  role: string;
  onLogout: () => void;
}) {
  if (role === "COMMANDER") {
    return <>{children}</>;
  }

  return (
    <div className="authenticated-shell" style={{ minHeight: "100vh", color: "#f8fafc" }}>
      <header
        className="authenticated-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          backgroundColor: "#1e293b",
          borderBottom: "1px solid #334155",
        }}
      >
        <div className="authenticated-brand">
          <div className="authenticated-brand-mark" aria-hidden="true">
            <ShieldCheck size={19} />
          </div>
          <div className="authenticated-brand-copy">
            <strong>CENTURION</strong>
            <span>Welfare &amp; early-warning platform</span>
          </div>
          <span className="authenticated-role">{role.replace(/_/g, " ")}</span>
        </div>
        <div className="authenticated-header-actions">
          <span className="privacy-lane"><LockKeyhole size={13} /> Role-based access active</span>
          <button
            onClick={onLogout}
            aria-label="Sign out"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: "transparent",
              color: "#f8fafc",
              border: "1px solid #475569",
              padding: "0.5rem 0.8rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </header>
      <main>{children}</main>
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
      view = <CommanderView onLogout={logout} />;
      break;
    case "WELFARE_OFFICER":
      view = <WelfareOfficerView />;
      break;
    case "PERSONNEL":
      view = <PersonnelView />;
      break;
  }

  return (
    <AuthenticatedShell
      role={session.role}
      onLogout={logout}
    >
      {view}
    </AuthenticatedShell>
  );
}
