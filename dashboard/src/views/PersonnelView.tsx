import { useState, type FormEvent } from "react";
import { submitCheckIn } from "../api/client";

export default function PersonnelView() {
  const [mood, setMood] = useState(3);
  const [note, setNote] = useState("");
  const [sleep, setSleep] = useState(3);
  const [irritability, setIrritability] = useState(2);
  const [energy, setEnergy] = useState(3);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await submitCheckIn({
        mood_score: mood,
        note: note.trim() || undefined,
        structured_responses: {
          sleep_quality: sleep,
          irritability,
          energy_level: energy,
        },
      });
      setMessage("Your check-in was received. Thank you for taking a moment for yourself.");
      setNote("");
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Unable to submit your check-in.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="role-page personnel-page" style={pageStyle}>
      <div style={eyebrowStyle}>PERSONNEL · VOLUNTARY CHECK-IN</div>
      <h2 style={headingStyle}>How are you doing today?</h2>
      <p style={subheadingStyle}>This is a private welfare check-in. Your response is used to support a human conversation, not to make a diagnosis.</p>
      <form className="role-panel" onSubmit={handleSubmit} style={formStyle}>
        <label style={labelStyle}>Overall mood: <strong>{mood}/5</strong>
          <input type="range" min="1" max="5" value={mood} onChange={(event) => setMood(Number(event.target.value))} style={{ width: "100%" }} />
        </label>
        <label style={labelStyle}>Sleep quality
          <select value={sleep} onChange={(event) => setSleep(Number(event.target.value))} style={inputStyle}>{[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}/5</option>)}</select>
        </label>
        <label style={labelStyle}>Irritability
          <select value={irritability} onChange={(event) => setIrritability(Number(event.target.value))} style={inputStyle}>{[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}/5</option>)}</select>
        </label>
        <label style={labelStyle}>Energy level
          <select value={energy} onChange={(event) => setEnergy(Number(event.target.value))} style={inputStyle}>{[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}/5</option>)}</select>
        </label>
        <label style={labelStyle}>Optional note
          <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} placeholder="Anything you would like to record for yourself?" style={textareaStyle} />
        </label>
        <button disabled={saving} type="submit" style={primaryButtonStyle}>{saving ? "Sending…" : "Submit voluntary check-in"}</button>
        {message && <div style={noticeStyle}>{message}</div>}
      </form>
    </main>
  );
}

const pageStyle = { maxWidth: 720, margin: "0 auto", padding: "2rem" };
const formStyle = { display: "grid", gap: "1.25rem", marginTop: "1.5rem", padding: "1.5rem", background: "#ffffff", border: "1px solid #dbe4d2", borderRadius: "16px" };
const eyebrowStyle = { color: "#6b8f1a", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.08em" };
const headingStyle = { margin: "0.4rem 0", color: "#0f172a", fontSize: "2rem" };
const subheadingStyle = { color: "#64748b", lineHeight: 1.6 };
const labelStyle = { display: "grid", gap: "0.55rem", color: "#334155", fontWeight: 600 };
const inputStyle = { width: "100%", padding: "0.7rem", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#ffffff" };
const textareaStyle = { width: "100%", padding: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", boxSizing: "border-box" as const, resize: "vertical" as const };
const primaryButtonStyle = { border: 0, borderRadius: "9px", padding: "0.85rem 1rem", background: "#0f172a", color: "#ffffff", cursor: "pointer", fontWeight: 700 };
const noticeStyle = { padding: "0.8rem 1rem", borderRadius: "10px", background: "#f5f9ee", color: "#536329" };
