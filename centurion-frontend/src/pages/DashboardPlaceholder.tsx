import {
  useNavigate,
} from "react-router-dom";

import {
  getSession,
  logout,
} from "../services/auth.service";

interface DashboardPlaceholderProps {
  title: string;
}

export default function DashboardPlaceholder({
  title,
}: DashboardPlaceholderProps) {
  const navigate =
    useNavigate();

  const session =
    getSession();

  function handleLogout() {
    logout();

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "#f4f6f1",
        fontFamily:
          "Inter, system-ui, sans-serif",
      }}
    >
      <section
        style={{
          width:
            "min(540px, 100%)",
          padding: "40px",
          borderRadius: "24px",
          background: "#ffffff",
          boxShadow:
            "0 20px 60px rgba(15,23,42,.10)",
          border:
            "1px solid rgba(15,23,42,.06)",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#78a91c",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.1em",
          }}
        >
          AUTHENTICATION SUCCESSFUL
        </p>

        <h1
          style={{
            margin:
              "12px 0 24px",
            color: "#0b1424",
            fontSize: "32px",
          }}
        >
          {title}
        </h1>

        <div
          style={{
            display: "grid",
            gap: "12px",
            color: "#475467",
            fontSize: "14px",
          }}
        >
          <p style={{ margin: 0 }}>
            Name:{" "}
            <strong>
              {session?.user.name ??
                "Not provided"}
            </strong>
          </p>

          <p style={{ margin: 0 }}>
            Login ID:{" "}
            <strong>
              {session?.user.loginId ??
                "Not provided"}
            </strong>
          </p>

          <p style={{ margin: 0 }}>
            Personnel ID:{" "}
            <strong>
              {session?.user
                .personnelId ??
                "Not applicable"}
            </strong>
          </p>

          <p style={{ margin: 0 }}>
            Designation:{" "}
            <strong>
              {session?.user
                .designation ??
                "Not provided"}
            </strong>
          </p>

          <p style={{ margin: 0 }}>
            Role:{" "}
            <strong>
              {session?.user.role ??
                "Not provided"}
            </strong>
          </p>

          <p style={{ margin: 0 }}>
            Company / Access Scope:{" "}
            <strong>
              {session?.user
                .companyName ??
                "Backend-defined access scope"}
            </strong>
          </p>
        </div>

        <div
          style={{
            marginTop: "28px",
            padding: "14px",
            borderRadius: "12px",
            background: "#f6faee",
            border:
              "1px solid rgba(120,169,28,.15)",
            color: "#536329",
            fontSize: "12px",
            lineHeight: 1.6,
          }}
        >
          This is a temporary integration page.
          The actual Commander, Welfare Officer,
          and Personnel dashboards will be
          connected by their respective frontend
          team members.
        </div>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            width: "100%",
            height: "50px",
            marginTop: "24px",
            border: "none",
            borderRadius: "12px",
            background: "#0b1424",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </section>
    </main>
  );
}
