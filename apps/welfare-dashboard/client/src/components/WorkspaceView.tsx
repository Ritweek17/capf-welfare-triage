/* Command Calm workspace views: every alternate surface keeps source-data traceability, human review, and role-based visibility explicit. */
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  ClipboardCheck,
  FileText,
  HeartHandshake,
  LockKeyhole,
  MessageCircle,
  NotebookPen,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { dashboardData, type DemoRole, type PersonnelRecord, type Severity, type WelfareAlert } from "@/lib/syntheticData";

type WorkspaceViewProps = {
  view: string;
  role: DemoRole;
  selected: WelfareAlert;
  personnel: PersonnelRecord[];
  alerts: WelfareAlert[];
  battalions: typeof dashboardData.battalions;
  metrics: typeof dashboardData.metrics;
  notes: Record<string, string[]>;
  noteDraft: string;
  dismissedIds: string[];
  onSelect: (id: string) => void;
  onNoteDraftChange: (value: string) => void;
  onSaveNote: () => void;
  onLogOutcome: () => void;
  onDismiss: () => void;
  onNotify: (message: string) => void;
};

function SeverityChip({ severity }: { severity: Severity }) {
  return <span className={`severity-chip ${severity.toLowerCase()}`}><span className="severity-dot" />{severity}</span>;
}

function MiniBars({ values }: { values: number[] }) {
  return <div className="workspace-bars" aria-hidden="true">{values.map((value, index) => <i key={`${value}-${index}`} style={{ height: `${Math.max(14, value)}%` }} />)}</div>;
}

function WorkspaceHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="workspace-header"><div><p className="section-overline"><span className="overline-rule" /> {eyebrow}</p><h2>{title}</h2><p>{description}</p></div>{action}</div>;
}

function CommanderOverview({ battalions, metrics, onNotify }: Pick<WorkspaceViewProps, "battalions" | "metrics" | "onNotify">) {
  return <div className="workspace-stack">
    <WorkspaceHeader eyebrow="Commander view · aggregate only" title="Unit readiness without individual scores" description="The commander view keeps names and individual welfare flags behind the welfare officer role." action={<span className="role-guard"><LockKeyhole size={14} /> Aggregate visibility</span>} />
    <div className="aggregate-strip"><div><span>Roster represented</span><strong>{metrics.rosterSize}</strong><small>provided source records</small></div><div><span>Signals in view</span><strong>{metrics.openFlags}</strong><small>held by welfare staff</small></div><div><span>Average stability</span><strong>{metrics.unitStability}%</strong><small>derived from source risk band</small></div><div><span>Check-in recency</span><strong>{metrics.checkInCoverage}%</strong><small>7 days or less</small></div></div>
    <div className="battalion-grid">{battalions.map((battalion) => <article className="panel battalion-card" key={battalion.id}><div className="battalion-top"><div><span className="panel-kicker">{battalion.id} · aggregate</span><h3>{battalion.name}</h3></div><span className="battalion-score">{battalion.stability}<small>% stable</small></span></div><div className="battalion-bars"><MiniBars values={battalion.trend} /></div><div className="battalion-meta"><span>{battalion.personnelCount} source records</span><span>{battalion.coverage}% recent check-in</span></div><div className="battalion-alert"><span>{battalion.flaggedCount} signal{battalion.flaggedCount === 1 ? "" : "s"} held for welfare review</span><span className="battalion-high">{battalion.highCount} high</span></div></article>)}</div>
    <article className="privacy-callout"><div className="privacy-callout-icon"><ShieldCheck size={17} /></div><div><strong>Individual context stays protected.</strong><p>Commander access exposes direction of travel at unit level; it does not expose names, mood scores, or individual risk labels.</p></div><button onClick={() => onNotify("Role-based access notes opened for this demo.")}>View access notes <ArrowUpRight size={14} /></button></article>
  </div>;
}

function PersonnelSelfView({ personnel, onNotify }: Pick<WorkspaceViewProps, "personnel" | "onNotify">) {
  const self = personnel.find((record) => record.role === "PERSONNEL") ?? personnel[0];
  const [mood, setMood] = useState(self.mood_score);
  return <div className="workspace-stack self-view">
    <WorkspaceHeader eyebrow="Personnel view · private to you" title="Your welfare check-in" description="A low-friction space to record how today is landing. Sharing is voluntary and separate from command reporting." action={<span className="role-guard"><LockKeyhole size={14} /> Private view</span>} />
    <div className="self-grid"><article className="panel self-card"><div className="self-card-top"><div className="large-avatar">{self.initials}</div><div><span className="panel-kicker">{self.personnel_id} · {self.battalion_id}</span><h3>{self.name}</h3><p>{self.rank}</p></div></div><div className="self-metrics"><div><span>Duty hours</span><strong>{self.duty_hours_weekly}<small> / week</small></strong></div><div><span>Leave used</span><strong>{self.leaves_last_30_days}<small> / 30 days</small></strong></div><div><span>Recent check-in</span><strong>{self.days_since_last_checkin}<small> days ago</small></strong></div></div><div className="self-note"><ShieldCheck size={15} /><span>Your self-report is optional. The system does not diagnose or make disciplinary decisions.</span></div></article><article className="panel checkin-card"><div className="panel-kicker"><span className="panel-number">01</span> Weekly pulse</div><h3>How are you feeling today?</h3><p>Choose a number only if you want to. This demo keeps the response on this device.</p><div className="mood-row" role="radiogroup" aria-label="Mood score"><span>Low</span>{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => <button key={value} className={mood === value ? "active" : ""} onClick={() => setMood(value)} role="radio" aria-checked={mood === value}>{value}</button>)}<span>Steady</span></div><textarea placeholder="Optional note — only if it helps you" /><button className="primary-button full" onClick={() => onNotify(`Check-in saved privately at ${mood}/10 for this demo.`)}><Check size={16} /> Save private check-in</button><button className="text-button" onClick={() => onNotify("Support resources opened.")}>See support resources <ArrowUpRight size={14} /></button></article></div>
  </div>;
}

function QueueWorkspace({ alerts, selected, dismissedIds, onSelect, onLogOutcome, onDismiss }: Pick<WorkspaceViewProps, "alerts" | "selected" | "dismissedIds" | "onSelect" | "onLogOutcome" | "onDismiss">) {
  const visible = alerts.filter((alert) => !dismissedIds.includes(alert.id));
  return <div className="workspace-stack"><WorkspaceHeader eyebrow="Welfare officer view · prioritized queue" title="Support queue" description="Review the source-derived signal, then choose the least intrusive helpful next step." action={<span className="queue-count-label">{visible.length} open rows</span>} /><div className="workspace-two-column"><article className="panel full-queue-panel"><div className="panel-heading compact-heading"><div><div className="panel-kicker"><span className="panel-number">01</span> Source-aligned alerts</div><h3>People needing context</h3></div></div><div className="workspace-queue-list">{visible.map((alert) => <button key={alert.id} className={`workspace-queue-row ${selected.id === alert.id ? "selected" : ""}`} onClick={() => onSelect(alert.id)}><div className="queue-avatar">{alert.initials}</div><div><strong>{alert.name}</strong><span>{alert.battalion_id} · {alert.role}</span></div><div className="workspace-queue-signal"><strong>{alert.signal}</strong><span>{alert.days_since_last_checkin} days since check-in</span></div><SeverityChip severity={alert.severity} /><strong className="workspace-score">{alert.riskScore}</strong><ChevronRight size={15} /></button>)}</div></article><article className="panel quick-action-panel"><div className="panel-kicker"><span className="panel-number">02</span> Selected case</div><div className="quick-case"><div className="large-avatar">{selected.initials}</div><div><h3>{selected.name}</h3><p>{selected.personnel_id} · {selected.battalion_id}</p></div><SeverityChip severity={selected.severity} /></div><p>{selected.summary}</p><div className="quick-factors">{selected.factors.map((factor) => <div key={factor.label}><span>{factor.label}</span><strong>{factor.value}</strong></div>)}</div><button className="primary-button full" onClick={onLogOutcome}><NotebookPen size={16} /> Log follow-up outcome</button><button className="secondary-button full" onClick={onDismiss}><Check size={16} /> {dismissedIds.includes(selected.id) ? "Reopen row" : "Mark row reviewed"}</button></article></div></div>;
}

function PersonnelContext({ personnel, onNotify }: Pick<WorkspaceViewProps, "personnel" | "onNotify">) {
  const [battalion, setBattalion] = useState("All");
  const options = ["All", ...Array.from(new Set(personnel.map((record) => record.battalion_id)))];
  const filtered = battalion === "All" ? personnel : personnel.filter((record) => record.battalion_id === battalion);
  return <div className="workspace-stack"><WorkspaceHeader eyebrow="Authorized context · source rows" title="Personnel context" description="Welfare officers can inspect the submitted operational fields and the derived explanation together." action={<select className="workspace-select" value={battalion} onChange={(event) => setBattalion(event.target.value)} aria-label="Filter by battalion">{options.map((option) => <option key={option}>{option}</option>)}</select>} /><article className="panel context-table-panel"><div className="table-caption"><span>{filtered.length} records in view</span><span><LockKeyhole size={13} /> Consent state is sourced from the SIH bundle</span></div><div className="context-table-wrap"><table className="context-table"><thead><tr><th>Personnel</th><th>Battalion</th><th>Duty / leave</th><th>Mood</th><th>Check-in</th><th>Source risk</th><th>Derived signal</th></tr></thead><tbody>{filtered.map((record) => <tr key={record.personnel_id} onClick={() => onNotify(`${record.name} context selected for authorized review.`)}><td><strong>{record.name}</strong><span>{record.personnel_id} · {record.role}</span></td><td>{record.battalion_id}</td><td>{record.duty_hours_weekly}h <span className="table-muted">/ {record.leaves_last_30_days} leave</span></td><td>{record.mood_score}/10</td><td>{record.days_since_last_checkin}d ago</td><td><SeverityChip severity={record.severity} /></td><td><span className="table-signal">{record.signal}</span></td></tr>)}</tbody></table></div></article></div>;
}

function NotesWorkspace({ selected, notes, noteDraft, onNoteDraftChange, onSaveNote, onNotify }: Pick<WorkspaceViewProps, "selected" | "notes" | "noteDraft" | "onNoteDraftChange" | "onSaveNote" | "onNotify">) {
  const selectedNotes = notes[selected.id] ?? [];
  return <div className="workspace-stack"><WorkspaceHeader eyebrow="Case notes · human record" title="Close the loop gently" description="Write down what was learned in the conversation. Notes stay separate from the derived source signal." action={<span className="role-guard"><NotebookPen size={14} /> Officer-authored</span>} /><div className="notes-layout"><article className="panel note-editor"><div className="note-editor-top"><div className="large-avatar">{selected.initials}</div><div><span className="panel-kicker">Selected welfare case</span><h3>{selected.name}</h3><p>{selected.personnel_id} · {selected.battalion_id}</p></div></div><label htmlFor="case-note">New note</label><textarea id="case-note" value={noteDraft} onChange={(event) => onNoteDraftChange(event.target.value)} placeholder="Record context, what the person asked for, or the agreed next step…" /><button className="primary-button" onClick={onSaveNote}><NotebookPen size={15} /> Save officer note</button><button className="text-button" onClick={() => onNotify("Note visibility guidance opened.")}>Who can see this? <ArrowUpRight size={14} /></button></article><article className="panel note-history"><div className="panel-kicker"><span className="panel-number">02</span> Saved on this device</div><h3>Case history</h3>{selectedNotes.length ? selectedNotes.map((note, index) => <div className="saved-note" key={`${note}-${index}`}><span>Note {String(index + 1).padStart(2, "0")}</span><p>{note}</p></div>) : <div className="empty-note"><FileText size={20} /><strong>No officer notes yet</strong><span>Start with context, not a conclusion.</span></div>}</article></div></div>;
}

function ResourcesWorkspace({ onNotify }: Pick<WorkspaceViewProps, "onNotify">) {
  const resources = [{ icon: HeartHandshake, title: "Conversation guide", copy: "A short, non-clinical prompt set for checking in with care." }, { icon: MessageCircle, title: "Welfare cell handoff", copy: "Know when to pause your own review and bring in another human." }, { icon: BookOpen, title: "Privacy playbook", copy: "Role visibility, consent language, and the reason behind each boundary." }];
  return <div className="workspace-stack"><WorkspaceHeader eyebrow="Resources · officer toolkit" title="Support without overreaching" description="Practical prompts for a welfare conversation, designed to keep the person—not the score—at the center." /><div className="resource-grid">{resources.map(({ icon: Icon, title, copy }) => <button className="panel resource-card" key={title} onClick={() => onNotify(`${title} opened for this demo.`)}><span className="resource-icon"><Icon size={18} /></span><span><strong>{title}</strong><small>{copy}</small></span><ChevronRight size={16} /></button>)}</div><article className="resource-principle"><Sparkles size={17} /><div><strong>Use the least intrusive helpful step.</strong><p>A flagged pattern is an invitation to ask, not evidence to act on without context.</p></div></article></div>;
}

function PrivacyWorkspace({ metrics, onNotify }: Pick<WorkspaceViewProps, "metrics" | "onNotify">) {
  return <div className="workspace-stack"><WorkspaceHeader eyebrow="Stewardship · visibility rules" title="Access & privacy" description="A visible reminder of what this frontend exposes to each role, using the consent and access model described in the project plan." action={<span className="role-guard"><ShieldCheck size={14} /> Privacy lane clear</span>} /><div className="privacy-grid"><article className="panel privacy-rule-card"><LockKeyhole size={19} /><h3>Welfare officer</h3><p>Can review submitted individual rows, derived factors, and officer-authored follow-up notes.</p><span>Current demo visibility: {metrics.openFlags} source alerts from SIH bundle</span></article><article className="panel privacy-rule-card"><UsersRound size={19} /><h3>Commander</h3><p>Can see battalion aggregates and direction of travel. Individual names and scores stay hidden.</p><span>Current demo visibility: 3 battalion summaries</span></article><article className="panel privacy-rule-card"><HeartHandshake size={19} /><h3>Personnel portal</h3><p>Members can access their own private check-in surface. Self-report is voluntary and not a disciplinary input.</p><span>Current demo visibility: self only</span></article></div><article className="panel access-log"><div className="panel-heading compact-heading"><div><div className="panel-kicker"><span className="panel-number">04</span> Local access log</div><h3>Recent review events</h3></div><button className="secondary-button" onClick={() => onNotify("Access log export queued for this demo.")}>Export log</button></div><div className="access-event"><span className="access-event-icon"><ShieldCheck size={14} /></span><p><strong>Welfare officer session</strong><span>Viewed source-derived context · no raw self-report present</span></p><time>now</time></div><div className="access-event"><span className="access-event-icon"><LockKeyhole size={14} /></span><p><strong>Commander boundary</strong><span>Individual welfare flags remain restricted by role</span></p><time>policy</time></div></article></div>;
}

export default function WorkspaceView(props: WorkspaceViewProps) {
  if (props.role === "Commander") return <CommanderOverview battalions={props.battalions} metrics={props.metrics} onNotify={props.onNotify} />;
  if (props.role === "Personnel") return <PersonnelSelfView personnel={props.personnel} onNotify={props.onNotify} />;
  if (props.view === "Support queue") return <QueueWorkspace alerts={props.alerts} selected={props.selected} dismissedIds={props.dismissedIds} onSelect={props.onSelect} onLogOutcome={props.onLogOutcome} onDismiss={props.onDismiss} />;
  if (props.view === "Personnel context") return <PersonnelContext personnel={props.personnel} onNotify={props.onNotify} />;
  if (props.view === "Unit pulse") return <CommanderOverview battalions={props.battalions} metrics={props.metrics} onNotify={props.onNotify} />;
  if (props.view === "Case notes") return <NotesWorkspace selected={props.selected} notes={props.notes} noteDraft={props.noteDraft} onNoteDraftChange={props.onNoteDraftChange} onSaveNote={props.onSaveNote} onNotify={props.onNotify} />;
  if (props.view === "Resources") return <ResourcesWorkspace onNotify={props.onNotify} />;
  if (props.view === "Access & privacy") return <PrivacyWorkspace metrics={props.metrics} onNotify={props.onNotify} />;
  return <CommanderOverview battalions={props.battalions} metrics={props.metrics} onNotify={props.onNotify} />;
}
