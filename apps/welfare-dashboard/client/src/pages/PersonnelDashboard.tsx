import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Bell,
  BookOpen,
  CalendarCheck,
  Check,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Clock3,
  HeartHandshake,
  Home,
  LifeBuoy,
  LockKeyhole,
  LogOut,
  Menu,
  MessageCircle,
  Monitor,
  Moon,
  Phone,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import "./personnel-dashboard.css";

const LOGIN_PAGE_URL = import.meta.env.VITE_LOGIN_PAGE_URL || "/?logout=1";

type View = "Overview" | "Check-in" | "Support" | "Appointments" | "Resources" | "Privacy";
type ThemePreference = "light" | "dark" | "device";

const navItems: { label: View; icon: typeof Home }[] = [
  { label: "Overview", icon: Home },
  { label: "Check-in", icon: ClipboardList },
  { label: "Support", icon: HeartHandshake },
  { label: "Appointments", icon: CalendarCheck },
  { label: "Resources", icon: BookOpen },
  { label: "Privacy", icon: ShieldCheck },
];

const resources = [
  { icon: LifeBuoy, title: "Stress reset", text: "A short grounding routine for a difficult shift.", time: "4 min" },
  { icon: MessageCircle, title: "Starting a conversation", text: "Simple words for asking someone you trust for support.", time: "3 min" },
  { icon: BookOpen, title: "Rest and recovery", text: "Practical steps for winding down after duty.", time: "6 min" },
];

function BrandMark() {
  return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3 41 9v13c0 11.2-6.9 19.1-17 23C13.9 41.1 7 33.2 7 22V9l17-6Z" fill="#0b1830"/><path d="M14 24h6l3-7 4 13 3-6h4" fill="none" stroke="#b7db50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function SectionTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <header className="personnel-section-title"><span>{eyebrow}</span><h1>{title}</h1><p>{copy}</p></header>;
}

function CheckInCard() {
  const [mood, setMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const save = () => {
    if (!mood) return toast("Choose how today feels before saving.");
    toast("Your private check-in has been saved for this demo.");
    setNote("");
  };
  return <article className="personnel-card checkin-panel">
    <div className="card-heading"><div><span className="card-kicker">Private check-in</span><h2>How is today landing?</h2></div><span className="private-pill"><LockKeyhole size={13}/> Your view</span></div>
    <p className="card-copy">Choose what feels closest. You will never be shown a risk score or diagnosis.</p>
    <div className="feeling-scale" role="radiogroup" aria-label="How today feels">
      {[{n:1,t:"Very hard"},{n:2,t:"Difficult"},{n:3,t:"Managing"},{n:4,t:"Good"},{n:5,t:"Steady"}].map(({n,t}) => <button key={n} className={mood === n ? "active" : ""} onClick={() => setMood(n)} role="radio" aria-checked={mood === n}><strong>{n}</strong><span>{t}</span></button>)}
    </div>
    <label className="note-field">Anything you want to remember? <span>Optional</span><textarea value={note} onChange={event => setNote(event.target.value)} placeholder="Write a private note…"/></label>
    <div className="checkin-actions"><button className="personnel-primary" onClick={save}><Check size={16}/> Save check-in</button><small>Self-report is voluntary and is not a disciplinary input.</small></div>
  </article>;
}

function Overview({ setView }: { setView: (view: View) => void }) {
  return <>
    <SectionTitle eyebrow="Monday · 24 August" title="Good morning" copy="Your private welfare space for check-ins, support, and practical resources." />
    <div className="privacy-banner"><ShieldCheck size={20}/><div><strong>This space belongs to you.</strong><span>Your dashboard does not display risk scores, labels, or command assessments.</span></div><button onClick={() => setView("Privacy")}>How privacy works <ChevronRight size={14}/></button></div>
    <div className="personnel-overview-grid">
      <CheckInCard />
      <aside className="personnel-side-stack">
        <article className="personnel-card next-appointment"><div className="side-icon"><CalendarCheck size={18}/></div><span className="card-kicker">Next appointment</span><h3>Welfare cell check-in</h3><p>Thursday, 27 August · 11:30</p><span className="appointment-place">Wellness room · Alpha Company</span><button onClick={() => setView("Appointments")}>View appointment <ChevronRight size={14}/></button></article>
        <article className="personnel-card quick-support"><div className="side-icon"><HeartHandshake size={18}/></div><span className="card-kicker">Need to talk?</span><h3>Request confidential support</h3><p>Send a private request to the welfare cell. You choose the topic and preferred contact method.</p><button className="personnel-secondary" onClick={() => setView("Support")}>Request support</button></article>
      </aside>
    </div>
    <div className="personnel-card resource-preview"><div className="card-heading"><div><span className="card-kicker">Self-help library</span><h2>Small steps for this week</h2></div><button className="text-link" onClick={() => setView("Resources")}>View all <ChevronRight size={14}/></button></div><div className="resource-row">{resources.map(({icon:Icon,title,text,time}) => <button key={title} onClick={() => toast(`${title} opened.`)}><span><Icon size={18}/></span><div><strong>{title}</strong><p>{text}</p><small>{time} read</small></div><ChevronRight size={16}/></button>)}</div></div>
  </>;
}

function SupportView() {
  const [topic, setTopic] = useState("General wellbeing");
  const [method, setMethod] = useState("Phone call");
  return <><SectionTitle eyebrow="Confidential support" title="Ask for a human conversation" copy="Share only what you are comfortable sharing. A welfare officer will contact you using your preferred method."/><div className="personnel-two-column"><article className="personnel-card support-form"><label>What would you like support with?<select value={topic} onChange={e => setTopic(e.target.value)}><option>General wellbeing</option><option>Family concern</option><option>Workload and rest</option><option>Financial guidance</option><option>Something else</option></select></label><label>Preferred contact<select value={method} onChange={e => setMethod(e.target.value)}><option>Phone call</option><option>Private message</option><option>In-person meeting</option></select></label><label>Short note <span>Optional</span><textarea placeholder="Add only the context you want the welfare officer to receive."/></label><button className="personnel-primary" onClick={() => toast(`Support request sent. Preferred contact: ${method}.`)}><HeartHandshake size={16}/> Send private request</button></article><aside className="personnel-card reassurance-card"><LockKeyhole size={22}/><h3>What happens next?</h3><ol><li>Your request goes to authorized welfare staff.</li><li>A welfare officer contacts you using your chosen method.</li><li>You decide what to discuss and what next step feels helpful.</li></ol><div><Phone size={16}/><span><strong>Need immediate help?</strong>Contact your local emergency service or the on-duty welfare officer.</span></div></aside></div></>;
}

function AppointmentsView() {
  return <><SectionTitle eyebrow="Your schedule" title="Appointments" copy="Manage private welfare meetings and request a time that works around duty."/><div className="appointment-list"><article className="personnel-card appointment-item"><span className="date-block"><strong>27</strong><small>AUG</small></span><div><span className="status-chip confirmed">Confirmed</span><h3>Welfare cell check-in</h3><p><Clock3 size={14}/> 11:30–12:00 · Wellness room</p></div><button className="personnel-secondary" onClick={() => toast("Appointment details opened.")}>Details</button></article><article className="personnel-card empty-appointment"><CalendarCheck size={22}/><div><h3>Need another time?</h3><p>Request a private appointment without explaining why.</p></div><button className="personnel-primary" onClick={() => toast("Appointment request started.")}>Request appointment</button></article></div></>;
}

function ResourcesView() {
  return <><SectionTitle eyebrow="Practical guidance" title="Welfare resources" copy="Short, non-clinical guides you can use privately, at your own pace."/><div className="resource-library">{[...resources,{icon:CircleHelp,title:"Understanding confidentiality",text:"What welfare staff can see and why.",time:"5 min"},{icon:Sparkles,title:"A better sleep routine",text:"Simple recovery habits after changing shifts.",time:"7 min"},{icon:UserRound,title:"Supporting a colleague",text:"How to listen without trying to diagnose.",time:"5 min"}].map(({icon:Icon,title,text,time}) => <article className="personnel-card" key={title}><span className="library-icon"><Icon size={20}/></span><small>{time} read</small><h3>{title}</h3><p>{text}</p><button onClick={() => toast(`${title} opened.`)}>Open guide <ChevronRight size={14}/></button></article>)}</div></>;
}

function PrivacyView() {
  return <><SectionTitle eyebrow="Clear boundaries" title="Privacy and consent" copy="Understand what is stored, who can access it, and the choices that remain yours."/><div className="privacy-grid-personnel">{[{icon:LockKeyhole,title:"Private by design",copy:"This view is limited to your own profile. It never displays an individual risk score or label."},{icon:HeartHandshake,title:"Welfare access",copy:"Authorized welfare staff can receive requests and follow up with human context and care."},{icon:ShieldCheck,title:"Command boundary",copy:"Commanders receive aggregate unit trends only—not your name, notes, check-in response, or individual status."}].map(({icon:Icon,title,copy}) => <article className="personnel-card" key={title}><span><Icon size={20}/></span><h3>{title}</h3><p>{copy}</p></article>)}</div><article className="personnel-card consent-card"><div><span className="card-kicker">Optional data</span><h2>Biometric consent</h2><p>No real wearable is connected in this demo. Simulated biometric fields remain off unless explicit consent is recorded.</p></div><span className="consent-state"><X size={15}/> Not enabled</span></article></>;
}

export default function PersonnelDashboard() {
  const [view, setView] = useState<View>("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themePreference, setThemePreference] = useState<ThemePreference>(() => {
    const saved = localStorage.getItem("personnel-theme");
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
    localStorage.setItem("personnel-theme", themePreference);
  }, [themePreference]);

  const resolvedTheme = themePreference === "device" ? (deviceIsDark ? "dark" : "light") : themePreference;
  const navigate = (next: View) => { setView(next); setMobileOpen(false); window.scrollTo({top:0, behavior:"smooth"}); };
  return <div className={`personnel-shell theme-${resolvedTheme}`}>
    <aside className={`personnel-sidebar ${mobileOpen ? "open" : ""}`}><div className="personnel-brand"><span><BrandMark/></span><div><strong>My Welfare</strong><small>CAPF personnel portal</small></div><button onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={18}/></button></div><nav aria-label="Personnel navigation">{navItems.map(({label,icon:Icon}) => <button key={label} className={view === label ? "active" : ""} onClick={() => navigate(label)}><Icon size={18}/><span>{label}</span></button>)}</nav><div className="sidebar-help"><LifeBuoy size={18}/><strong>Support is available</strong><p>Reach the welfare cell privately when you need a conversation.</p><button onClick={() => navigate("Support")}>Get support</button></div><button className="personnel-logout" onClick={() => window.location.replace(LOGIN_PAGE_URL)}><LogOut size={17}/> Sign out</button></aside>
    {mobileOpen && <button className="personnel-scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay"/>}
    <main className="personnel-main"><header className="personnel-topbar"><button className="personnel-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20}/></button><div><span className="topbar-private"><LockKeyhole size={13}/> Private personnel view</span></div><div className="personnel-topbar-right"><div className="theme-switcher" role="group" aria-label="Color theme">{([{value:"light",label:"Light",icon:Sun},{value:"dark",label:"Dark",icon:Moon},{value:"device",label:"Device",icon:Monitor}] as const).map(({value,label,icon:Icon}) => <button key={value} className={themePreference === value ? "active" : ""} onClick={() => setThemePreference(value)} aria-pressed={themePreference === value} title={`${label} theme`}><Icon size={14}/><span>{label}</span></button>)}</div><div className="personnel-actions"><button aria-label="View notifications" onClick={() => toast("You have no new notifications.")}><Bell size={18}/></button><span className="personnel-avatar" role="img" aria-label="Private profile">P13</span><div><strong>My Profile</strong><small>p_00013 · 1st Company</small></div></div></div></header><div className="personnel-content">{view === "Overview" && <Overview setView={navigate}/>} {view === "Check-in" && <><SectionTitle eyebrow="Voluntary self-report" title="Your private check-in" copy="Pause for a moment and record how today feels—only if you want to."/><CheckInCard/></>} {view === "Support" && <SupportView/>} {view === "Appointments" && <AppointmentsView/>} {view === "Resources" && <ResourcesView/>} {view === "Privacy" && <PrivacyView/>}<footer className="personnel-footer"><ShieldCheck size={14}/> Welfare support, never discipline · Demo data only</footer></div></main>
  </div>;
}
