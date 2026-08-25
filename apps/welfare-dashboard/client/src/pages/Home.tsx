/* Command Calm: an editorial welfare operations desk. Navy anchors trust, cobalt marks action, and every alert stays explainable and human-reviewed. */
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { asOfDate, dashboardData, getDataQualityNote, type DemoRole, type SignalDirection, type Severity, type WelfareAlert } from "@/lib/syntheticData";
import WorkspaceView from "@/components/WorkspaceView";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileDown,
  Filter,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Monitor,
  MoreHorizontal,
  Moon,
  NotebookPen,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  UsersRound,
  X,
} from "lucide-react";

const { alerts, metrics, pulseBars, stabilityBars, counts } = dashboardData;
const LOGIN_PAGE_URL = import.meta.env.VITE_LOGIN_PAGE_URL || "/?logout=1";
type ThemePreference = "light" | "dark" | "device";

const navGroups = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", icon: LayoutDashboard },
      { label: "Support queue", icon: ClipboardCheck, count: String(counts.all).padStart(2, "0") },
      { label: "Personnel context", icon: UsersRound },
      { label: "Unit pulse", icon: Activity },
    ],
  },
  {
    label: "Stewardship",
    items: [
      { label: "Case notes", icon: NotebookPen },
      { label: "Resources", icon: BookOpen },
      { label: "Access & privacy", icon: ShieldCheck },
    ],
  },
];


function SeverityChip({ severity }: { severity: Severity }) {
  const className = severity.toLowerCase();
  return (
    <span className={`severity-chip ${className}`}>
      <span className="severity-dot" />
      {severity}
    </span>
  );
}

function MiniBars({ bars, tone = "cobalt" }: { bars: number[]; tone?: "cobalt" | "navy" }) {
  return (
    <div className={`mini-bars ${tone}`} aria-hidden="true">
      {bars.map((height, index) => (
        <span key={`${height}-${index}`} style={{ height: `${height}%` }} />
      ))}
    </div>
  );
}

function SignalMark({ direction }: { direction: SignalDirection }) {
  if (direction === "up") return <ArrowUpRight size={13} strokeWidth={2.2} />;
  if (direction === "down") return <ArrowDownRight size={13} strokeWidth={2.2} />;
  return <span className="neutral-mark">—</span>;
}

function WelfareBrandMark() {
  return (
    <svg
      className="brand-mark"
      viewBox="0 0 48 48"
      role="img"
      aria-label="CAPF welfare emblem"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24 3 41 9v13c0 11.2-6.9 19.1-17 23-10.1-3.9-17-11.8-17-23V9l17-6Z" fill="#0b1830" />
      <path d="M24 7.8 36.5 12v10c0 8.1-4.7 14-12.5 17.6C16.2 36 11.5 30.1 11.5 22V12L24 7.8Z" fill="#1557b0" />
      <path d="M14.5 24h6l2.6-6.2 4.2 12.4 2.7-6.2h3.5" fill="none" stroke="#d7f06a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 12.5v4M22 14.5h4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  const demoParams = new URLSearchParams(window.location.search);
  const initialView = demoParams.get("view") ?? "Overview";
  const [activeNav, setActiveNav] = useState(initialView);
  const [activeTab, setActiveTab] = useState<"All" | Severity>("All");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(alerts[0].id);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const role: DemoRole = "Welfare Officer";
  const [notes, setNotes] = useState<Record<string, string[]>>({});
  const [noteDraft, setNoteDraft] = useState("");
  const [themePreference, setThemePreference] = useState<ThemePreference>(() => {
    const saved = localStorage.getItem("welfare-theme");
    return saved === "light" || saved === "dark" || saved === "device" ? saved : "device";
  });
  const [deviceIsDark, setDeviceIsDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => setDeviceIsDark(event.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    localStorage.setItem("welfare-theme", themePreference);
  }, [themePreference]);

  const resolvedTheme = themePreference === "device" ? (deviceIsDark ? "dark" : "light") : themePreference;

  const filteredAlerts = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    return alerts.filter((alert) => {
      const matchesTab = activeTab === "All" || alert.severity === activeTab;
      const matchesQuery =
        !normalizedQuery ||
        `${alert.name} ${alert.unit} ${alert.id} ${alert.signal}`.toLowerCase().includes(normalizedQuery);
      return matchesTab && matchesQuery;
    });
  }, [activeTab, query]);

  const selected: WelfareAlert = alerts.find((alert) => alert.id === selectedId) ?? alerts[0];
  const selectedIsResolved = resolvedIds.includes(selected.id);

  const handleNav = (label: string) => {
    setActiveNav(label);
    setMobileNavOpen(false);
    if (label !== "Overview") toast(`${label} view is ready for the next integration pass.`);
  };

  const handleLogOutcome = () => {
    if (selectedIsResolved) {
      toast("This follow-up is already marked as reviewed.");
      return;
    }
    setResolvedIds((current) => [...current, selected.id]);
    toast(`Review logged for ${selected.name}. Human follow-up remains the decision point.`);
  };

  const handleSaveNote = () => {
    const trimmedNote = noteDraft.trim();
    if (!trimmedNote) {
      toast("Write a short context note before saving.");
      return;
    }
    setNotes((current) => ({ ...current, [selected.id]: [...(current[selected.id] ?? []), trimmedNote] }));
    setNoteDraft("");
    toast(`Officer note saved for ${selected.name}.`);
  };

  const handleDismiss = () => {
    setDismissedIds((current) => {
      if (current.includes(selected.id)) {
        toast(`${selected.id} reopened for welfare review.`);
        return current.filter((id) => id !== selected.id);
      }
      toast(`${selected.id} marked reviewed and removed from the open queue.`);
      return [...current, selected.id];
    });
  };

  const handleLogout = () => window.location.replace(LOGIN_PAGE_URL);

  return (
    <div className={`app-shell welfare-shell welfare-${resolvedTheme}`}>
      <aside className={`sidebar ${mobileNavOpen ? "is-open" : ""}`}>
        <div className="sidebar-topline" style={{backgroundColor: '#000000'}} />
        <div className="brand-lockup">
          <div className="brand-mark-wrap" style={{backgroundColor: '#063f89', borderRadius: '0px'}}>
            <WelfareBrandMark />
          </div>
          <div>
            <div className="brand-kicker">CAPF / 07</div>
            <div className="brand-name">Welfare Desk</div>
            <div className="brand-subtitle">Monitoring system</div>
          </div>
          <button className="sidebar-close" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation">
            <X size={18} />
          </button>
        </div>

        <div className="rail-divider" />
        <nav className="side-nav" aria-label="Primary navigation">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <p className="nav-label">{group.label}</p>
              {group.items.map(({ label, icon: Icon, count }) => (
                <button
                  key={label}
                  className={`nav-item ${activeNav === label ? "active" : ""}`}
                  onClick={() => handleNav(label)}
                  aria-current={activeNav === label ? "page" : undefined}
                >
                  <Icon size={18} strokeWidth={activeNav === label ? 2.25 : 1.8} />
                  <span>{label}</span>
                  {count ? <span className="nav-count">{count}</span> : null}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="support-card">
            <img src="/manus-storage/quiet-support-texture_d64ac5fd.png" alt="" className="support-card-texture" />
            <div className="support-card-content">
              <div className="support-icon"><HeartHandshake size={17} /></div>
              <p className="support-eyebrow">A human handoff</p>
              <h3>Need another view?</h3>
              <p>Talk through a case with the welfare cell before you act.</p>
              <button onClick={() => toast("Welfare cell handoff request noted.")} className="support-link">
                Request a handoff <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
          <div className="sidebar-footer">
            <span>System status</span>
            <span className="status-live"><i /> Live</span>
          </div>
        </div>
      </aside>

      {mobileNavOpen ? <button className="mobile-scrim" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation overlay" /> : null}

      <main className="main-content">
        <header className="topbar">
          <div className="mobile-topbar-left">
            <button className="mobile-menu" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
            <span className="mobile-brand">Welfare Desk</span>
          </div>
          <div className="topbar-context">
            <ShieldCheck size={14} />
            <span className="context-overline">Authorized welfare view</span>
          </div>
          <div className="topbar-actions">
            <label className="global-search">
              <Search size={16} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search personnel or case ID" aria-label="Search personnel or case ID" />
              <kbd>⌘ K</kbd>
            </label>
            <button className="date-switcher" onClick={() => toast("Date range selector is ready for the live data layer.")}>
              <CalendarDays size={15} />
              <span>24 Aug 2026</span>
              <ChevronDown size={14} />
            </button>
            <div className="welfare-theme-switcher" role="group" aria-label="Color theme">
              {([{ value: "light", label: "Light", icon: Sun }, { value: "dark", label: "Dark", icon: Moon }, { value: "device", label: "Device", icon: Monitor }] as const).map(({ value, label, icon: Icon }) => (
                <button key={value} className={themePreference === value ? "active" : ""} onClick={() => setThemePreference(value)} aria-pressed={themePreference === value} title={`${label} theme`}><Icon size={14} /><span>{label}</span></button>
              ))}
            </div>
            <button className="icon-button notification-button" onClick={() => toast("You have 3 new welfare desk notifications.")} aria-label="View notifications">
              <Bell size={18} />
              <span className="notification-count">3</span>
            </button>
            <div className="profile-chip role-profile">
              <span className="profile-avatar" role="img" aria-label="R. Menon profile">RM</span>
              <div><strong>R. Menon</strong><span>Welfare Officer</span></div>
              <button className="profile-sign-out" onClick={handleLogout} aria-label="Sign out" title="Sign out">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        <div className="page-wrap">
          {role !== "Welfare Officer" || activeNav !== "Overview" ? <WorkspaceView view={activeNav} role={role} selected={selected} personnel={dashboardData.personnel} alerts={alerts} battalions={dashboardData.battalions} metrics={metrics} notes={notes} noteDraft={noteDraft} dismissedIds={dismissedIds} onSelect={setSelectedId} onNoteDraftChange={setNoteDraft} onSaveNote={handleSaveNote} onLogOutcome={handleLogOutcome} onDismiss={handleDismiss} onNotify={(message) => toast(message)} /> : <>
          <section className="page-heading">
            <div>
              <p className="section-overline"><span className="overline-rule" /> {new Date(`${asOfDate}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase()} · MORNING BRIEF</p>
              <h1>Welfare desk</h1>
              <p className="heading-copy">Review alerts, follow-ups, and unit signals.</p>
            </div>
            <div className="heading-actions">
              <button className="secondary-button" onClick={() => toast("Brief export queued for this demo.")}><FileDown size={16} /> Export brief</button>
              <button className="primary-button" onClick={() => toast("New officer note started.")}><NotebookPen size={16} /> Log officer note</button>
            </div>
          </section>

          <section className="metric-strip" aria-label="Welfare desk metrics">
            <article className="metric-card lead-metric">
              <div className="metric-topline"><span className="metric-label">Open welfare flags</span><span className="metric-index">01 / 04</span></div>
              <div className="metric-value-row"><strong>{String(metrics.openFlags).padStart(2, "0")}</strong><span className="metric-delta up"><ArrowUpRight size={14} /> {metrics.recordsNeedingReview} source rows</span></div>
              <div className="metric-foot"><span>{metrics.highPriority} high priority</span><span>of {metrics.rosterSize.toLocaleString()} personnel</span></div>
            </article>
            <article className="metric-card">
              <div className="metric-topline"><span className="metric-label">Pending follow-ups</span><span className="metric-icon"><Clock3 size={15} /></span></div>
              <div className="metric-value-row"><strong>{String(metrics.pendingFollowUps).padStart(2, "0")}</strong><span className="metric-delta neutral">within SLA</span></div>
              <div className="metric-foot"><span>Oldest {metrics.oldestFollowUp}</span><span className="mini-status"><i /> on track</span></div>
            </article>
            <article className="metric-card">
              <div className="metric-topline"><span className="metric-label">Unit stability</span><span className="metric-icon"><Activity size={15} /></span></div>
              <div className="metric-value-row"><strong>{metrics.unitStability}<span className="metric-unit">%</span></strong><span className="metric-delta up"><ArrowUpRight size={14} /> 4.8%</span></div>
              <div className="metric-foot"><span>30-day signal</span><MiniBars bars={stabilityBars} /></div>
            </article>
            <article className="metric-card coverage-card">
              <div className="metric-topline"><span className="metric-label">Check-in coverage</span><span className="metric-icon"><MessageCircle size={15} /></span></div>
              <div className="metric-value-row"><strong>{metrics.checkInCoverage}<span className="metric-unit">%</span></strong><span className="metric-delta down"><ArrowDownRight size={14} /> 1.2%</span></div>
              <div className="metric-foot"><span>Voluntary self-report</span><span className="coverage-track"><i style={{ width: `${metrics.checkInCoverage}%` }} /></span></div>
            </article>
          </section>

          <section className="dashboard-grid">
            <article className="panel queue-panel">
              <div className="panel-heading queue-heading">
                <div>
                  <div className="panel-kicker"><span className="panel-number">02</span> Human review queue</div>
                  <h2>Review queue</h2>
                  <p>Source alerts with explainable factors.</p>
                </div>
                <button className="more-button" onClick={() => toast("Queue actions are available in the live data layer.")} aria-label="More queue actions"><MoreHorizontal size={18} /></button>
              </div>
              <div className="queue-toolbar">
                <div className="queue-tabs" role="tablist" aria-label="Filter welfare alerts">
                  {(["All", "High", "Medium", "Low"] as const).map((tab) => (
                    <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)} role="tab" aria-selected={activeTab === tab}>
                      {tab}<span>{String(tab === "All" ? counts.all : tab === "High" ? counts.high : tab === "Medium" ? counts.medium : counts.low).padStart(2, "0")}</span>
                    </button>
                  ))}
                </div>
                <button className="filter-button" onClick={() => toast("Advanced filters are ready for the API connection.")}><SlidersHorizontal size={15} /> Filters</button>
              </div>
              <div className="queue-list">
                {filteredAlerts.length > 0 ? filteredAlerts.map((alert, index) => (
                  <button key={alert.id} onClick={() => setSelectedId(alert.id)} className={`queue-row ${selected.id === alert.id ? "selected" : ""} ${resolvedIds.includes(alert.id) ? "resolved" : ""}`}>
                    <div className="queue-avatar">{alert.initials}</div>
                    <div className="queue-person"><strong>{alert.name}</strong><span>{alert.unit}</span></div>
                    <div className="queue-signal"><span>{alert.signal}</span><small>{alert.flaggedAt}</small></div>
                    <SeverityChip severity={alert.severity} />
                    <div className="queue-score"><span>Signal</span><strong>{alert.riskScore}</strong></div>
                    <ChevronRight className="row-chevron" size={17} />
                    {index < filteredAlerts.length - 1 ? <span className="row-rule" /> : null}
                  </button>
                )) : (
                  <div className="empty-queue"><Search size={20} /><strong>No matching welfare signals</strong><span>Try another name, unit, or case ID.</span><button onClick={() => { setQuery(""); setActiveTab("All"); }}>Clear filters</button></div>
                )}
              </div>
              <div className="queue-footer"><span><i className="tiny-live" /> Updated 14 minutes ago</span><button onClick={() => toast("The complete synthetic queue is ready for the live data layer.")}>View all {String(counts.all).padStart(2, "0")} <ArrowUpRight size={14} /></button></div>
            </article>

            <aside className="context-rail">
              <article className="panel context-panel">
                <div className="context-topline"><div className="panel-kicker"><span className="panel-number">03</span> Selected context</div><SeverityChip severity={selected.severity} /></div>
                <div className="selected-person">
                  <div className="large-avatar">{selected.initials}</div>
                  <div><h2>{selected.name}</h2><p>{selected.role} · {selected.id}</p><span>{selected.unit}</span></div>
                  <button className="more-button" onClick={() => toast("Secure case actions are available in the live data layer.")} aria-label="More selected case actions"><MoreHorizontal size={18} /></button>
                </div>
                <div className="signal-score">
                  <div><span className="score-label">Pattern deviation</span><strong>{selected.riskScore}<small>/100</small></strong><span className="score-caption">Not a diagnosis</span></div>
                  <div className="score-ring" style={{ "--score": `${selected.riskScore * 3.6}deg` } as React.CSSProperties}><div><span>review</span><strong>{selected.riskScore > 70 ? "now" : "soon"}</strong></div></div>
                </div>
                <p className="context-summary">{selected.summary}</p>
                <div className="factor-list">
                  {selected.factors.map((factor) => <div className="factor-row" key={factor.label}><span>{factor.label}</span><strong className={factor.direction}><SignalMark direction={factor.direction} />{factor.value}</strong></div>)}
                </div>
                <div className="recommendation"><div className="recommendation-icon"><Sparkles size={15} /></div><div><span>Suggested next step</span><strong>{selected.recommendation}</strong></div><ChevronRight size={16} /></div>
                <div className="context-actions"><button className={`primary-button full ${selectedIsResolved ? "is-complete" : ""}`} onClick={handleLogOutcome}>{selectedIsResolved ? <Check size={16} /> : <NotebookPen size={16} />}{selectedIsResolved ? "Review logged" : "Log follow-up outcome"}</button><button className="text-button" onClick={() => toast("Secure personnel context opened for authorized review.")}>Open full context <ArrowUpRight size={14} /></button></div>
              </article>

              <article className="privacy-card">
                <img src="/manus-storage/navy-signal-texture_ddc9998b.png" alt="" className="privacy-texture" />
                <div className="privacy-content">
                  <div className="privacy-heading"><div className="privacy-icon"><ShieldCheck size={16} /></div><span>Privacy lane / clear</span></div>
                  <h3>Every signal has a reason.</h3>
                  <p>Individual data is visible only to authorized welfare staff. Command views stay aggregate.</p>
                  <button onClick={() => handleNav("Access & privacy")} className="privacy-link">Review access log <ArrowUpRight size={14} /></button>
                </div>
              </article>
            </aside>
          </section>

          <section className="bottom-grid">
            <article className="panel pulse-panel">
              <div className="panel-heading compact-heading"><div><div className="panel-kicker"><span className="panel-number">04</span> Unit pulse</div><h2>Stability is holding</h2></div><button className="period-button" onClick={() => toast("30-day view selected.")}>30 days <ChevronDown size={14} /></button></div>
              <div className="pulse-body"><div className="pulse-stat"><strong>{metrics.unitStability}<span>%</span></strong><span><i className="pulse-up"><ArrowUpRight size={12} /></i> 4.8% vs last period</span><small>Aggregate signal, all companies</small></div><div className="pulse-chart"><div className="chart-guides"><span>100</span><span>75</span><span>50</span><span>25</span></div><MiniBars bars={pulseBars} tone="navy" /><div className="chart-axis"><span>26 Jul</span><span>02 Aug</span><span>09 Aug</span><span>16 Aug</span><span>24 Aug</span></div></div></div>
            </article>
            <article className="panel handoff-panel">
              <div className="panel-heading compact-heading"><div><div className="panel-kicker"><span className="panel-number">05</span> Today's rhythm</div><h2>Close the loop gently</h2></div><button className="more-button" onClick={() => toast("Daily rhythm actions are ready for integration.")} aria-label="More daily rhythm actions"><MoreHorizontal size={18} /></button></div>
              <div className="rhythm-list"><div><span className="rhythm-icon blue"><ClipboardCheck size={16} /></span><p><strong>{metrics.newSignalsToday}</strong><span>new signals triaged</span></p><span className="rhythm-time">by 10:00</span></div><div><span className="rhythm-icon navy"><MessageCircle size={16} /></span><p><strong>{metrics.pendingFollowUps}</strong><span>follow-ups due today</span></p><span className="rhythm-time">{metrics.urgentFollowUps} urgent</span></div><div><span className="rhythm-icon ivory"><HeartHandshake size={16} /></span><p><strong>{metrics.handoffsRequested}</strong><span>handoff requested</span></p><span className="rhythm-time">pending</span></div></div>
            </article>
          </section>

          <footer className="page-footer"><span>CAPF Welfare Monitoring System <b>·</b> {getDataQualityNote()}</span><span><ShieldCheck size={13} /> Welfare, not discipline <b>·</b> v0.8.4</span></footer>
          </>}
        </div>
      </main>
    </div>
  );
}
