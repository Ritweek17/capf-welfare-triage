import { useEffect, useState } from "react";
import { fetchUnitSummary } from "../api/client";
import TrendChart from "../components/shared/TrendChart";
import type { UnitSummary } from "../types/auth";

export default function CommanderView() {
  const [summary, setSummary] = useState<UnitSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUnitSummary().then(setSummary).catch((reason: Error) => setError(reason.message));
  }, []);

  if (error) {
    return <ViewMessage message={error} />;
  }
  if (!summary) {
    return <ViewMessage message="Loading your unit welfare overview…" />;
  }

  const latest = summary.trend_30d[summary.trend_30d.length - 1];
  return (
    <main style={pageStyle}>
      <div style={eyebrowStyle}>COMMANDER · AGGREGATE VIEW</div>
      <h2 style={headingStyle}>Unit welfare environment</h2>
      <p style={subheadingStyle}>
        Organizational trends help identify where support may be useful. Individual personnel data is not shown here.
      </p>
      <section style={statGridStyle}>
        <Stat label="Personnel" value={summary.personnel_count} />
        <Stat label="Open support alerts" value={summary.open_alert_count} />
        <Stat label="Today’s check-in participation" value={`${latest?.checkin_participation_rate ?? 0}%`} />
      </section>
      <section style={cardStyle}>
        <div style={eyebrowStyle}>30-DAY TREND</div>
        <h3 style={{ margin: "0.4rem 0 1rem", color: "#0f172a" }}>{summary.unit}</h3>
        <TrendChart points={summary.trend_30d} />
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={cardStyle}>
      <div style={subheadingStyle}>{label}</div>
      <div style={{ marginTop: "0.5rem", fontSize: "1.8rem", fontWeight: 800, color: "#0f172a" }}>{value}</div>
    </div>
  );
}

function ViewMessage({ message }: { message: string }) {
  return <main style={pageStyle}><p style={subheadingStyle}>{message}</p></main>;
}

const pageStyle = { maxWidth: 1100, margin: "0 auto", padding: "2rem" };
const cardStyle = { background: "#ffffff", border: "1px solid #dbe4d2", borderRadius: "16px", padding: "1.25rem", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)" };
const statGridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", margin: "1.5rem 0" };
const eyebrowStyle = { color: "#6b8f1a", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.08em" };
const headingStyle = { margin: "0.4rem 0", color: "#0f172a", fontSize: "2rem" };
const subheadingStyle = { color: "#64748b", lineHeight: 1.6 };
