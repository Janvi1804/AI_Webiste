"use client";

import { useEffect, useState } from "react";

type NavItem = { icon: string; label: string; badge?: string };

const navigation: NavItem[] = [
  { icon: "⌘", label: "Overview" }, { icon: "◫", label: "Projects" },
  { icon: "✓", label: "Tasks", badge: "8" }, { icon: "◎", label: "Customers" },
  { icon: "◈", label: "Leads" }, { icon: "◷", label: "Meetings" },
  { icon: "▤", label: "Documents" }, { icon: "✦", label: "Support", badge: "3" },
  { icon: "▥", label: "Reports" },
];

const projects = [
  { name: "Northstar website refresh", client: "Northstar Health", progress: 72, due: "Aug 28", tone: "purple", avatars: ["JM", "AK", "SL"] },
  { name: "Q3 customer portal", client: "Atelier Works", progress: 48, due: "Sep 14", tone: "amber", avatars: ["AK", "DN"] },
  { name: "Partner onboarding", client: "Wavelength", progress: 89, due: "Aug 11", tone: "green", avatars: ["SL", "JM", "RN"] },
];
const tasks = [
  ["Finalize product copy", "Today", "JM"], ["Review data migration plan", "Today", "AK"], ["Send client progress update", "Tomorrow", "SL"], ["Prepare Q3 campaign brief", "Fri, Aug 9", "RN"]
];

export default function Home() {
  const [active, setActive] = useState("Overview");
  const [dark, setDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [created, setCreated] = useState(false);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setSearchOpen(true); }
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", listener); return () => window.removeEventListener("keydown", listener);
  }, []);

  return <main className={dark ? "app dark" : "app"}>
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><span></span><span></span><span></span></div><span>opervia<span className="brand-dot">.</span></span></div>
      <button className="workspace"><span className="workspace-logo">N</span><span><b>Northstar Studio</b><small>Growth workspace</small></span><span className="chevron">⌄</span></button>
      <nav aria-label="Main navigation">
        <p className="nav-label">WORKSPACE</p>
        {navigation.map(item => <button key={item.label} onClick={() => setActive(item.label)} className={`nav-item ${active === item.label ? "active" : ""}`}><span className="nav-icon">{item.icon}</span>{item.label}{item.badge && <em>{item.badge}</em>}</button>)}
        <p className="nav-label spaced">INTELLIGENCE</p>
        <button onClick={() => setAssistantOpen(true)} className="nav-item ai-nav"><span className="ai-icon">✦</span>AI Assistant<span className="new">New</span></button>
        <button className="nav-item"><span className="nav-icon">↯</span>Automations</button>
        <button className="nav-item"><span className="nav-icon">◌</span>Activity</button>
      </nav>
      <div className="sidebar-bottom">
        <button className="nav-item"><span className="nav-icon">?</span>Help center</button>
        <button onClick={() => setDark(!dark)} className="theme-switch" aria-label="Toggle theme"><span>{dark ? "☾" : "☀"}</span><span>{dark ? "Dark mode" : "Light mode"}</span><i></i></button>
        <div className="user-row"><div className="avatar janvi">JK</div><div><b>Janvi Kapoor</b><small>Workspace owner</small></div><span>···</span></div>
      </div>
    </aside>

    <section className="content">
      <header className="topbar"><div className="crumb"><span>Northstar Studio</span><b>/</b><strong>{active}</strong></div><div className="top-actions"><button onClick={() => setSearchOpen(true)} className="search"><span>⌕</span><span>Search anything</span><kbd>⌘ K</kbd></button><button className="icon-btn" aria-label="Notifications">♧<i></i></button><button onClick={() => setAssistantOpen(true)} className="assistant-button">✦ <span>Ask AI</span></button><button onClick={() => setCreated(true)} className="create-button">＋ <span>Create</span></button></div></header>
      <div className="page">
        <section className="intro"><div><p className="eyebrow">MONDAY, AUGUST 5</p><h1>Good morning, Janvi <span>✦</span></h1><p>Here is what needs your attention today.</p></div><div className="intro-actions"><button className="ghost-button">▦ Customize</button><button onClick={() => setCreated(true)} className="primary-button">＋ Create new</button></div></section>

        <section className="metrics" aria-label="Business metrics">
          <Metric icon="◫" title="Active projects" value="12" change="↑ 8.2%" detail="vs. last month" tint="violet" spark="spark-one" />
          <Metric icon="✓" title="Tasks due today" value="8" change="2 overdue" detail="needs attention" tint="orange" spark="spark-two" />
          <Metric icon="◈" title="Open pipeline" value="$84.2k" change="↑ 12.4%" detail="vs. last month" tint="blue" spark="spark-three" />
          <Metric icon="◌" title="Team capacity" value="76%" change="Healthy" detail="across 8 teammates" tint="green" spark="spark-four" />
        </section>

        <section className="dashboard-grid">
          <div className="card project-card"><div className="card-heading"><div><p className="section-kicker">DELIVERY</p><h2>Project health</h2></div><button className="text-button">View all <span>→</span></button></div><div className="project-list">{projects.map(p => <article className="project-row" key={p.name}><div className={`project-symbol ${p.tone}`}>{p.name.charAt(0)}</div><div className="project-copy"><h3>{p.name}</h3><p>{p.client} <span>•</span> Due {p.due}</p></div><div className="project-progress"><div><b>{p.progress}%</b><span className={`status ${p.tone}`}>{p.tone === "amber" ? "At risk" : p.tone === "green" ? "On track" : "Active"}</span></div><div className="progress-track"><i style={{width: `${p.progress}%`}}></i></div></div><div className="avatars">{p.avatars.map(a => <span key={a}>{a}</span>)}</div></article>)}</div><button className="wide-link">View project portfolio <span>→</span></button></div>

          <div className="card focus-card"><div className="card-heading"><div><p className="section-kicker">FOCUS</p><h2>Tasks requiring attention</h2></div><button className="more">•••</button></div><div className="task-list">{tasks.map(([name, due, owner], i) => <article className="task" key={name}><button className={`task-check c${i}`} aria-label={`Complete ${name}`}></button><div><h3>{name}</h3><p><span className={i < 2 ? "due-today" : ""}>{due}</span> <b>·</b> {i === 0 ? "Website refresh" : i === 1 ? "Data platform" : "Client success"}</p></div><div className="avatar small">{owner}</div></article>)}</div><button className="wide-link">Open my tasks <span>→</span></button></div>

          <div className="card revenue-card"><div className="card-heading"><div><p className="section-kicker">PERFORMANCE</p><h2>Revenue overview</h2></div><button className="select-button">Last 6 months⌄</button></div><div className="revenue-number"><h2>$184,620</h2><span>↑ 18.6%</span><p>compared with last period</p></div><div className="chart"><div className="y-labels"><span>$50k</span><span>$25k</span><span>$0</span></div><svg viewBox="0 0 640 180" preserveAspectRatio="none" aria-label="Revenue chart"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#6d67e9" stopOpacity=".20"/><stop offset="1" stopColor="#6d67e9" stopOpacity="0"/></linearGradient></defs><path d="M0,150 C40,133 59,134 94,141 S152,102 189,116 S245,110 285,73 S350,86 386,83 S443,33 476,55 S527,25 555,41 S598,19 640,25 L640,180 L0,180Z" fill="url(#area)"/><path d="M0,150 C40,133 59,134 94,141 S152,102 189,116 S245,110 285,73 S350,86 386,83 S443,33 476,55 S527,25 555,41 S598,19 640,25" fill="none" stroke="currentColor" strokeWidth="3"/><circle cx="476" cy="55" r="5" fill="white" stroke="currentColor" strokeWidth="3"/></svg><div className="months"><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span></div></div></div>

          <div className="card insight-card"><div className="insight-top"><span className="insight-icon">✦</span><span>AI INSIGHT</span><button className="more">•••</button></div><h2>Delivery risk is rising across two projects.</h2><p>Six dependent tasks are blocked, putting the August deadlines for Northstar and Atelier at risk.</p><div className="risk-summary"><span className="risk-dot"></span><span><b>3</b> projects need review</span><span className="risk-bar"><i></i></span></div><div className="insight-actions"><button className="outline-button">Review risks</button><button onClick={() => setAssistantOpen(true)} className="dark-button">Ask AI <span>→</span></button></div></div>

          <div className="card pipeline-card"><div className="card-heading"><div><p className="section-kicker">SALES</p><h2>Pipeline snapshot</h2></div><button className="text-button">Open pipeline <span>→</span></button></div><div className="pipeline"><div><p>Qualified</p><h3>12 <span>leads</span></h3><i className="bar purple" style={{width:"88%"}}></i></div><div><p>Proposal</p><h3>6 <span>leads</span></h3><i className="bar blue" style={{width:"55%"}}></i></div><div><p>Negotiation</p><h3>3 <span>leads</span></h3><i className="bar orange" style={{width:"31%"}}></i></div><div><p>Expected value</p><h3>$84.2k</h3><span className="positive">↑ 12.4%</span></div></div></div>

          <div className="card activity-card"><div className="card-heading"><div><p className="section-kicker">LIVE</p><h2>Recent activity</h2></div><button className="text-button">See all <span>→</span></button></div><div className="activity"><Activity avatar="AK" text={<><b>Ava Kim</b> completed <strong>Data model review</strong></>} time="12 min ago" color="blue"/><Activity avatar="✦" text={<><b>Opervia AI</b> created a weekly delivery report</>} time="34 min ago" color="violet"/><Activity avatar="SL" text={<><b>Sam Lee</b> added a note to <strong>Northstar Health</strong></>} time="1 hr ago" color="green"/></div></div>
        </section>
      </div>
    </section>

    {searchOpen && <div className="modal-wrap" role="dialog" aria-modal="true" aria-label="Search"><div className="command"><div className="command-search">⌕<input autoFocus placeholder="Search projects, tasks, customers..."/><kbd>ESC</kbd></div><p>QUICK ACTIONS</p>{["Create a new project", "Ask Opervia AI", "View tasks due today"].map(x => <button key={x} onClick={() => setSearchOpen(false)}>{x}<span>↵</span></button>)}</div></div>}
    {assistantOpen && <div className="assistant-drawer"><header><div><span className="ai-icon big">✦</span><div><b>Opervia AI</b><small>Your operations copilot</small></div></div><button onClick={() => setAssistantOpen(false)}>×</button></header><div className="assistant-chat"><div className="ai-message">I found <b>3 delivery risks</b> that need attention. Would you like a recovery plan for the affected projects?</div><div className="tool-status"><span>✓</span><div><b>Project health checked</b><small>Reviewed 12 active projects</small></div></div></div><div className="suggestions"><button>Show delayed projects</button><button>Create a task</button><button>Generate weekly report</button></div><div className="chat-input"><input placeholder="Ask anything about your business..."/><button>↑</button></div></div>}
    {created && <div className="toast"><span>✓</span><div><b>Workspace ready for your next move</b><small>Create menus would open here in the full product.</small></div><button onClick={() => setCreated(false)}>×</button></div>}
  </main>;
}

function Metric({icon,title,value,change,detail,tint,spark}: {icon:string;title:string;value:string;change:string;detail:string;tint:string;spark:string}) { return <article className="metric card"><div className={`metric-icon ${tint}`}>{icon}</div><div className="metric-top"><p>{title}</p><button>•••</button></div><h2>{value}</h2><div className="metric-bottom"><span className={tint === "orange" ? "negative" : "positive"}>{change}</span><small>{detail}</small></div><div className={`spark ${spark}`}><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></article> }
function Activity({avatar,text,time,color}: {avatar:string;text:React.ReactNode;time:string;color:string}) { return <article><span className={`avatar activity-avatar ${color}`}>{avatar}</span><div><p>{text}</p><small>{time}</small></div></article> }
