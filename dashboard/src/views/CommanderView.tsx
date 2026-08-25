import { useEffect, useState, type ReactNode } from "react";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  EyeOff,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { fetchUnitSummary } from "../api/client";
import TrendChart from "../components/shared/TrendChart";
import type { UnitSummary } from "../types/auth";

type CommanderTab = "overview" | "trends" | "privacy";

interface CommanderViewProps {
  onLogout: () => void;
}

export default function CommanderView({ onLogout }: CommanderViewProps) {
  const [summary, setSummary] = useState<UnitSummary | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<CommanderTab>("overview");

  useEffect(() => {
    fetchUnitSummary()
      .then(setSummary)
      .catch((reason: Error) => setError(reason.message));
  }, []);

  return (
    <div className="commander-app">
      <aside className="commander-sidebar">
        <div>
          <div className="commander-sidebar-brand">
            <span><ShieldCheck size={20} /></span>
            <div><strong>CENTURION</strong><small>Command welfare view</small></div>
          </div>
          <nav className="commander-nav" aria-label="Commander navigation">
            <CommanderNavButton active={activeTab === "overview"} icon={<LayoutDashboard size={16} />} onClick={() => setActiveTab("overview")}>Overview</CommanderNavButton>
            <CommanderNavButton active={activeTab === "trends"} icon={<BarChart3 size={16} />} onClick={() => setActiveTab("trends")}>Wellbeing trends</CommanderNavButton>
            <CommanderNavButton active={activeTab === "privacy"} icon={<EyeOff size={16} />} onClick={() => setActiveTab("privacy")}>Privacy boundary</CommanderNavButton>
          </nav>
        </div>
        <div className="commander-sidebar-footer">
          <div className="commander-scope-pill"><CheckCircle2 size={14} /><span>Aggregate scope active</span></div>
          <button type="button" onClick={onLogout}><LogOut size={15} /> Sign out</button>
        </div>
      </aside>

      <main className="commander-main">
        <header className="commander-topbar">
          <div>
            <span className="commander-kicker">COMMANDER · AGGREGATE VIEW</span>
            <h1>{summary?.unit ?? "Unit welfare overview"}</h1>
          </div>
          <div className="commander-topbar-status"><span /> Live synthetic data · 30-day window</div>
        </header>

        {error ? <div className="commander-error" role="alert">{error}</div> : null}
        {!summary && !error ? <div className="commander-loading">Loading your authorized aggregate overview…</div> : null}
        {summary ? <CommanderContent summary={summary} activeTab={activeTab} /> : null}
      </main>
    </div>
  );
}

function CommanderNavButton({ active, icon, children, onClick }: { active: boolean; icon: ReactNode; children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" className={`commander-nav-button${active ? " is-active" : ""}`} onClick={onClick} aria-current={active ? "page" : undefined}>
      {icon}<span>{children}</span>
    </button>
  );
}

function CommanderContent({ summary, activeTab }: { summary: UnitSummary; activeTab: CommanderTab }) {
  const latest = summary.trend_30d[summary.trend_30d.length - 1];
  const previous = summary.trend_30d[summary.trend_30d.length - 2];
  const aggregateSignal = latest?.avg_risk_indicator ?? 0;
  const signalDelta = latest && previous ? aggregateSignal - previous.avg_risk_indicator : 0;

  if (activeTab === "privacy") {
    return <CommanderPrivacyPanel />;
  }

  return (
    <div className="commander-content">
      <section className="commander-intro">
        <div>
          <span className="commander-kicker">UNIT HEALTH PICTURE</span>
          <h2>Support where the unit pattern shifts.</h2>
          <p>Aggregate indicators help identify where welfare support may be useful. Individual names, scores, notes, check-ins, and biometric values are not shown in this view.</p>
        </div>
        <div className="commander-privacy-badge"><ShieldCheck size={16} /><span>0 individual risk records exposed</span></div>
      </section>

      <section className="commander-metric-grid" aria-label="Aggregate unit metrics">
        <MetricCard label="Personnel in unit" value={summary.personnel_count} detail="Synthetic roster count" />
        <MetricCard label="Open support alerts" value={summary.open_alert_count} detail="Welfare Officer queue" accent="attention" />
        <MetricCard label="Check-in participation" value={`${latest?.checkin_participation_rate ?? 0}%`} detail="Latest recorded day" accent="blue" />
        <MetricCard label="Aggregate signal" value={aggregateSignal.toFixed(2)} detail={signalDelta >= 0 ? `+${signalDelta.toFixed(2)} vs prior point` : `${signalDelta.toFixed(2)} vs prior point`} accent="sage" />
      </section>

      {activeTab === "overview" ? (
        <section className="commander-hero-panel">
          <div className="commander-panel-heading">
            <div><span className="commander-kicker">SECTOR HEALTH</span><h2>Unit wellbeing trajectory</h2><p>Aggregate signal and voluntary participation over the last 30 days.</p></div>
            <span className="commander-period"><CalendarDays size={14} /> 30 days</span>
          </div>
          <TrendChart points={summary.trend_30d} />
          <div className="commander-chart-footer"><span><TrendingUp size={14} /> Aggregate vector only</span><span>Human welfare review remains the decision point</span></div>
        </section>
      ) : (
        <section className="commander-hero-panel">
          <div className="commander-panel-heading">
            <div><span className="commander-kicker">WELLBEING TRENDS</span><h2>30-day aggregate movement</h2><p>Use this signal as context for unit-level support planning, not as an individual assessment.</p></div>
            <span className="commander-period"><BarChart3 size={14} /> Aggregate vector</span>
          </div>
          <TrendChart points={summary.trend_30d} />
          <div className="commander-trend-note"><ShieldCheck size={15} /><span>Commander access excludes individual identifiers and raw welfare records by design.</span></div>
        </section>
      )}
    </div>
  );
}

function MetricCard({ label, value, detail, accent = "default" }: { label: string; value: string | number; detail: string; accent?: "default" | "attention" | "blue" | "sage" }) {
  return (
    <article className={`commander-metric-card commander-metric-${accent}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function CommanderPrivacyPanel() {
  return (
    <div className="commander-content">
      <section className="commander-privacy-panel">
        <div className="commander-privacy-heading"><span><ShieldCheck size={20} /></span><div><span className="commander-kicker">PRIVACY LANE · CLEAR</span><h2>Aggregate intelligence only</h2></div></div>
        <p>Commander access is intentionally limited to unit-level trends and counts. This prevents welfare signals from becoming a personnel surveillance or disciplinary tool.</p>
        <div className="commander-privacy-list">
          <PrivacyItem title="No individual identifiers" text="Names, person IDs, notes, and individual check-ins are excluded from the Commander response." />
          <PrivacyItem title="Welfare Officer boundary" text="Individual explainable alerts and intervention records remain available only to authorized Welfare Officers." />
          <PrivacyItem title="Human-led support" text="Aggregate movement is context for support planning; it is never a diagnosis or fitness-for-duty decision." />
        </div>
      </section>
    </div>
  );
}

function PrivacyItem({ title, text }: { title: string; text: string }) {
  return <div className="commander-privacy-item"><CheckCircle2 size={16} /><div><strong>{title}</strong><p>{text}</p></div></div>;
}
