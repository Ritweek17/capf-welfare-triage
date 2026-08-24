import { useEffect, useState } from "react";
import AlertCard from "../components/shared/AlertCard";
import { fetchAlerts, logIntervention } from "../api/client";
import type { AlertItem, InterventionStatus } from "../types/auth";

export default function WelfareOfficerView() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [notes, setNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [interventionStatus, setInterventionStatus] = useState<InterventionStatus>("reviewed");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAlerts()
      .then(setAlerts)
      .catch((reason: Error) => setMessage(reason.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleLog() {
    if (!selectedAlert) return;
    try {
      await logIntervention(
        selectedAlert.alert_id,
        "informal_checkin_completed",
        notes,
        interventionStatus,
        followUpDate,
      );
      setAlerts((current) => current.map((alert) => alert.alert_id === selectedAlert.alert_id ? { ...alert, status: interventionStatus } : alert));
      setSelectedAlert(null);
      setNotes("");
      setFollowUpDate("");
      setInterventionStatus("reviewed");
      setMessage("Outcome logged. Follow-up remains human-led and confidential.");
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Unable to log the outcome.");
    }
  }

  return (
    <main style={pageStyle}>
      <div style={eyebrowStyle}>WELFARE OFFICER · CONFIDENTIAL QUEUE</div>
      <h2 style={headingStyle}>Who may need a check-in, and why?</h2>
      <p style={subheadingStyle}>
        These are explainable changes from a person’s own historical pattern, not diagnoses or disciplinary findings.
      </p>
      {message && <div style={noticeStyle}>{message}</div>}
      {loading ? <p style={subheadingStyle}>Refreshing authorized support signals…</p> : null}
      {!loading && alerts.length === 0 ? <div style={emptyStyle}>No open welfare-support signals for this unit.</div> : null}
      <div style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
        {alerts.map((alert) => <AlertCard key={alert.alert_id} alert={alert} onLog={setSelectedAlert} />)}
      </div>
      {selectedAlert && (
        <div style={modalBackdropStyle}>
          <section style={modalStyle}>
            <div style={eyebrowStyle}>LOG HUMAN OUTCOME</div>
            <h3 style={{ color: "#0f172a" }}>Support follow-up for {selectedAlert.person_id}</h3>
            <p style={subheadingStyle}>Record only what is appropriate for a confidential welfare follow-up.</p>
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional outcome notes" style={textareaStyle} rows={4} />
            <label style={fieldLabelStyle}>
              Follow-up status
              <select value={interventionStatus} onChange={(event) => setInterventionStatus(event.target.value as InterventionStatus)} style={inputStyle}>
                <option value="reviewed">Reviewed</option>
                <option value="follow_up_scheduled">Follow-up scheduled</option>
                <option value="closed">Closed</option>
              </select>
            </label>
            {interventionStatus === "follow_up_scheduled" && (
              <label style={fieldLabelStyle}>
                Follow-up date
                <input type="date" value={followUpDate} onChange={(event) => setFollowUpDate(event.target.value)} style={inputStyle} />
              </label>
            )}
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1rem" }}>
              <button type="button" onClick={() => setSelectedAlert(null)} style={secondaryButtonStyle}>Cancel</button>
              <button type="button" onClick={handleLog} style={primaryButtonStyle}>Save outcome</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

const pageStyle = { maxWidth: 1100, margin: "0 auto", padding: "2rem" };
const headingStyle = { margin: "0.4rem 0", color: "#0f172a", fontSize: "2rem" };
const subheadingStyle = { color: "#64748b", lineHeight: 1.6 };
const eyebrowStyle = { color: "#6b8f1a", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.08em" };
const noticeStyle = { marginTop: "1rem", padding: "0.8rem 1rem", borderRadius: "10px", background: "#f5f9ee", color: "#536329" };
const emptyStyle = { marginTop: "1.5rem", padding: "1.5rem", borderRadius: "16px", background: "#ffffff", border: "1px solid #dbe4d2", color: "#64748b" };
const modalBackdropStyle = { position: "fixed" as const, inset: 0, background: "rgba(15, 23, 42, 0.35)", display: "grid", placeItems: "center", padding: "1rem" };
const modalStyle = { width: "min(520px, 100%)", background: "#ffffff", borderRadius: "16px", padding: "1.5rem" };
const textareaStyle = { width: "100%", border: "1px solid #cbd5e1", borderRadius: "10px", padding: "0.75rem", resize: "vertical" as const, boxSizing: "border-box" as const };
const fieldLabelStyle = { display: "grid", gap: "0.35rem", marginTop: "0.9rem", color: "#334155", fontWeight: 700 };
const inputStyle = { width: "100%", border: "1px solid #cbd5e1", borderRadius: "10px", padding: "0.65rem", boxSizing: "border-box" as const, background: "#ffffff" };
const primaryButtonStyle = { border: 0, borderRadius: "8px", padding: "0.7rem 1rem", background: "#0f172a", color: "#ffffff", cursor: "pointer" };
const secondaryButtonStyle = { border: "1px solid #cbd5e1", borderRadius: "8px", padding: "0.7rem 1rem", background: "#ffffff", color: "#334155", cursor: "pointer" };
