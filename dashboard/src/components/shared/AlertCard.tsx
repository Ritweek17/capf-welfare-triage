import type { AlertItem } from "../../types/auth";

interface AlertCardProps {
  alert: AlertItem;
  onLog: (alert: AlertItem) => void;
}

export default function AlertCard({ alert, onLog }: AlertCardProps) {
  return (
    <article
      className="role-panel alert-card"
      style={{
        border: "1px solid #dbe4d2",
        borderRadius: "16px",
        padding: "1.25rem",
        background: "#ffffff",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <div style={{ color: "#6b8f1a", fontSize: "0.75rem", fontWeight: 700 }}>
            WELFARE-SUPPORT SIGNAL
          </div>
          <h3 style={{ margin: "0.4rem 0", color: "#0f172a" }}>{alert.person_id}</h3>
          <div style={{ color: "#64748b", fontSize: "0.85rem" }}>
            Flagged {new Date(alert.flagged_at).toLocaleString()}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#0f172a", fontSize: "1.6rem", fontWeight: 800 }}>
            {alert.display_score}
          </div>
          <div style={{ color: "#64748b", fontSize: "0.75rem" }}>support indicator</div>
        </div>
      </div>

      <div style={{ marginTop: "1rem", display: "grid", gap: "0.5rem" }}>
        {alert.factors.map((factor) => (
          <div
            key={`${factor.factor}-${factor.deviation}`}
            className="alert-factor"
            style={{ padding: "0.65rem 0.75rem", borderRadius: "10px", background: "#f5f9ee" }}
          >
            <strong style={{ color: "#334155" }}>{factor.factor.replace(/_/g, " ")}</strong>
            <span style={{ color: "#64748b" }}> — {factor.deviation}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
        <span style={{ color: "#536329", fontSize: "0.85rem" }}>
          Suggested: {alert.suggested_tier?.replace(/_/g, " ") ?? "welfare review"}
        </span>
        <button
          type="button"
          onClick={() => onLog(alert)}
          style={{ border: 0, borderRadius: "8px", padding: "0.65rem 0.9rem", background: "#0f172a", color: "#ffffff", cursor: "pointer" }}
        >
          Log outcome
        </button>
      </div>
    </article>
  );
}
