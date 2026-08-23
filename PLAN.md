# PS 26186 — AI-Based Predictive Personnel Stress & Welfare Monitoring System
### Team Plan — Smart India Hackathon 2026 (36-hour build)

---

## 1. Vision Statement (30-second version)

We're building a welfare-triage system that spots early signs of stress and burnout in CAPF personnel — not by asking anyone to confess how they're feeling, but by noticing when *their own* work patterns (leave, deployment load, duty hours) start drifting from what's normal *for them*. When the drift is significant, a welfare officer gets a flagged, explainable alert — never a diagnosis, never grounds for disciplinary action — so a human can check in before a small problem becomes a crisis. It matters because CRPF alone recorded 59 suicides in 2025, a five-year high, and most happened while personnel were on duty — and right now, the system for catching this early is a person noticing, if they notice at all.

---

## 2. The Problem, In Our Own Words

Right now, whether a stressed or burnt-out officer gets help basically comes down to luck — did a colleague or commander happen to notice, did the person say something, did anyone connect the dots across their leave record, their duty roster, and how withdrawn they'd become. There's no systematic early-warning layer. By the time a crisis is visible, it's often too late to intervene gently.

Two things make this worse:
- **The data that *would* show a pattern already exists** (leave records, deployment history, duty schedules) but nobody's looking at it as a *pattern* — it's scattered across HR systems, not analyzed as a signal.
- **We don't even have reliable numbers on how bad this is.** NCRB stopped publishing CAPF-specific suicide data after 2020, so the official picture is incomplete precisely when it matters most. That absence of data is itself part of the case for building this.

So the problem isn't "we don't care about personnel welfare" — it's "we have no proactive, structured way to notice early, and we have no system that can flag concern without either invading privacy or becoming a surveillance/punishment tool." That second part is just as important as the first: a system personnel don't trust won't get used honestly, and will just push people to hide more.

---

## 3. Feature List — Mapped to the PS's 8 Required Components

The Problem Statement itself names 8 components under "Expected Solution." Every feature we build should trace back to one of these — nothing extra, nothing missing.

| # | PS Component | What We're Building |
|---|---|---|
| 1 | **Personnel Wellness Monitoring Dashboard** | Commander-facing dashboard: unit-level risk overview, trend lines, no individual raw scores exposed without welfare-officer role |
| 2 | **Mobile-based Wellness & Self-Assessment App** | Simple daily/weekly check-in (mood scale + optional free text + optional GMHAT-style structured questions), fully voluntary |
| 3 | **Predictive Behavioral Analytics Engine** | Anomaly detection layer that compares each person's current indicators against *their own* historical baseline |
| 4 | **Stress & Burnout Risk Prediction Models** | The scoring model itself — unsupervised, deviation-based, explainable (see Section 5) |
| 5 | **Welfare Intervention Recommendation System** | When risk crosses a threshold, system suggests a tiered action (informal check-in → structured conversation → referral), never "diagnosis" |
| 6 | **Role-Based Access Control & Privacy Management Framework** | Three roles minimum: Personnel (self only), Welfare Officer (flagged individuals, with justification logged), Commander (aggregate/unit-level only, no individual scores) |
| 7 | **Automated Alerts for Authorized Welfare Personnel** | Alert queue for welfare officers when someone crosses a risk threshold — includes the *reasons* (explainability), not just a red flag |
| 8 | **Data Anonymization & Secure Storage Mechanisms** | Simulated data pipeline demonstrating pseudonymization at rest, access logging, and a consent flag governing what's visible to whom |

Nothing on this list is invented scope — if a teammate proposes a feature, first ask "which of these 8 does it serve?" If it doesn't map cleanly, cut it or park it as a "future work" slide bullet.

---

## 4. Tech Stack & Repo Structure

**Decision: Monorepo.** With two people and 36 hours, a monorepo means one clone, one place to see everything working together for the demo, and no time lost debugging cross-repo integration late in the build.

**Stack (deliberately boring and fast to assemble):**

- **Backend / API:** Python, FastAPI (fast to write, easy for teammates to read, good for the ML layer to live in the same language)
- **Risk/Anomaly Engine:** Python — `scikit-learn` (Isolation Forest or a simple z-score/rolling-baseline deviation model), `pandas` for the data prep. Deliberately simple and explainable over "impressive."
- **Database:** PostgreSQL (or SQLite if time is short) — relational fits HR-style tabular data naturally
- **Commander/Welfare Dashboard:** React + a component library (e.g., shadcn/Tailwind) — fast to build clean-looking screens
- **Mobile Wellness App:** React Native (or, if time-pressured, a mobile-responsive web app — a PWA can pass as "mobile app" in a 36-hour demo and saves real build time)
- **Auth/RBAC:** Simple JWT-based auth with a `role` field — don't over-engineer this, a working 3-role gate is enough
- **Synthetic data:** Python scripts generating realistic-looking (fake) personnel records — leave patterns, deployment history, duty hours, optional self-reports

```
/repo-root
  /backend            (FastAPI: auth, RBAC, data models, alerts API)
  /risk-engine         (anomaly detection model + explainability layer)
  /dashboard           (React — commander + welfare officer views)
  /mobile-app          (React Native or PWA — self check-in)
  /data                (synthetic data generator + seed scripts)
  /docs                (this plan, pitch deck, architecture diagram)
```

This structure maps directly to the split in Section 8 — each half has an obvious owner.

---

## 5. Data & Scoring Approach, In Plain Language

**What data we simulate:** Since we can't and shouldn't use real personnel data, we generate realistic synthetic records — leave frequency, deployment/posting history, duty-hour patterns, transfer frequency, training load — for a set of fake "personnel," each with a plausible history over time. A subset also has optional self-report entries (mood check-ins) and an opt-in biometric/wellness flag.

**How the risk score works:** Instead of training a model to say "this pattern equals stress" (which would require real labeled stress incidents that simply don't exist — CAPF suicide/incident data isn't published at that granularity, and inventing labels would mean the model is learning our guesses, not reality), we do something more honest: we build a **baseline for each person from their own history**, and flag when their *current* pattern deviates significantly from *their own normal* — for example, someone whose leave-taking drops sharply, whose duty hours spike, and who stops responding to check-ins, all at once, gets flagged, even if that same pattern would be "normal" for someone else.

**Why this is explainable:** Every flag comes with the specific factors that triggered it ("leave frequency down 60% from personal baseline, duty hours up 40%, no self-report in 21 days") — not a mystery score. This matters both for the jury and for real deployment: per Cynthia Rudin's argument on high-stakes decisions, an uninterpretable black box is a liability when the outcome affects someone's career and wellbeing, not just an inconvenience.

**Why it's not a diagnosis:** The output is explicitly framed as "worth a human welfare check-in," never "this person has X condition." The system surfaces a *pattern worth a conversation* — it never claims clinical knowledge it doesn't have, and it's paired with human judgment at every step, matching the PS's own instruction that this must support welfare, not discipline.

---

## 6. The 3 Screens That Matter for the Demo

**1. Commander's View — "Is my unit okay, at a glance?"**
A unit-level dashboard: aggregate trend lines (e.g., "unit-wide risk indicators trending up over past 30 days"), never individual names or scores. The point is force-readiness visibility without individual surveillance — a commander should be able to say "something's shifting in 3rd Company" without knowing who specifically triggered it.

**2. Welfare Officer's View — "Who needs a check-in, and why?"**
A queue of flagged individuals (only visible to this role), each with the specific factors behind the flag, a suggested tier of response (informal chat vs. structured referral), and a place to log the outcome. This is the operational heart of the demo — it should visibly show *why* someone was flagged, not just *that* they were.

**3. Mobile Check-In — "How am I doing, on my terms."**
A short, low-friction weekly check-in: a mood scale, an optional free-text note, and an optional structured wellness question (in the spirit of GMHAT-style assessment, kept simple). It should feel closer to a quick personal log than a form, and it should be visibly clear to the user that this is voluntary and private.

---

## 7. Ethics & Privacy — Mapped to the PS's Own "Key Technical Challenges"

| PS Challenge | Our Answer |
|---|---|
| Privacy & confidentiality of sensitive data | RBAC with three tiers; individual scores never visible above Welfare Officer level; pseudonymized IDs in the risk engine |
| Preventing stigmatization | Commander dashboard shows aggregates only — no names, no individual flags ever surface above the welfare-officer tier |
| Minimizing false positives/negatives | Deviation-from-*self*-baseline (not population norms) reduces false flags from people whose "normal" is just different; explainability lets a human override |
| Ethical, transparent AI decisions | Every flag ships with its contributing factors — no black-box score, consistent with the interpretable-models-for-high-stakes-decisions principle |
| Securing sensitive psychological/welfare data | Data anonymization at rest, access logging on every view of flagged data, consent flag gating biometric data specifically |
| Building trust in the system | Self-assessment is opt-in and visibly personal-benefit-first (not "we're watching you"); framing throughout is welfare and support, never enforcement |

Real-world proof this approach works isn't hypothetical: CISF's "Know Your Men and Hear Your Men" initiative and its Project Mann helpline, and BSF's partnership with AIIMS, are existing CAPF-side efforts in this direction, and the US VA's REACH VET program is a real, deployed example of exactly this kind of predictive-analytics-for-welfare approach at scale. We're not inventing the concept — we're proposing a CAPF-tailored, privacy-first technical layer for it.

---

## 8. 2-Person Split

- **Person A: Backend + Risk Engine + Data/Synthetic Generation** — FastAPI service, auth/RBAC, alerts API, the anomaly detection model and baseline logic, and the synthetic dataset generator.
- **Person B: Dashboard + Mobile + Integration + Pitch** — commander/welfare officer dashboard, the mobile check-in app, wiring the pieces together for the live demo, and the pitch deck/narrative.

These three group naturally per person because Person A's half shares one language and dataflow (Python end-to-end, all working directly with the same data model), while Person B's half shares one frontend toolchain (React/TypeScript for both dashboard and mobile) plus ownership of how the whole thing looks and reads for the demo.

---

## 9. High-Level Phase Timeline (36 hours)

| Phase | Rough Time | Focus |
|---|---|---|
| **Kickoff** | Hour 0–2 | Data schema and API contracts locked so both halves can build in parallel without waiting on each other |
| **Core Build (parallel)** | Hour 2–18 | Person A builds backend + RBAC + risk engine + synthetic data; Person B builds dashboard skeleton + mobile check-in skeleton — both against the locked contracts |
| **Integration Pass 1** | Hour 18–22 | Wire real (synthetic) data through the pipeline end-to-end; first working vertical slice |
| **Polish & Feature Completion** | Hour 22–30 | Alerts, explainability display, RBAC edge cases, UI polish, mobile app finishing |
| **Integration Pass 2 + Rehearsal** | Hour 30–34 | Full run-through, fix what breaks, freeze scope |
| **Pitch Prep & Buffer** | Hour 34–36 | Deck finalized, story rehearsed, buffer for last-minute fires |

---

## 10. Top Risks & Fallbacks

1. **Risk: Anomaly model looks unconvincing on synthetic data (too clean or too random to show a compelling "aha" flag).**
   Fallback: Have the data lead hand-craft 2–3 clearly "at-risk" synthetic personnel with a deliberate pattern (declining leave, spiking hours, dropped check-ins) to guarantee the demo has a strong story, alongside genuinely random baseline data for the rest.

2. **Risk: RBAC/privacy layer eats too much time and isn't demo-ready.**
   Fallback: Implement the three roles with hardcoded demo accounts (not a full user-management system) — the *behavior difference between roles* is what the jury needs to see, not a production auth system.

3. **Risk: Mobile app build stalls (native tooling issues, emulator problems, etc.).**
   Fallback: Ship a mobile-responsive web check-in (PWA) instead — it satisfies the PS requirement and demos fine on a phone browser if native build time runs out.

4. **Risk: Integration happens too late and nothing connects end-to-end in time.**
   Fallback: Lock API contracts (request/response shapes) in Hour 0–2 so every component can be stubbed and tested independently before Integration Pass 1 — don't let integration be the first time components talk to each other.

5. **Risk: Jury reads this as a surveillance tool despite our intent, especially given the sensitivity of the domain.**
   Fallback: Bake the "welfare, not discipline" framing into the UI itself (e.g., explicit language in the welfare officer's view, visible consent messaging in the mobile app) — not just something we say in the pitch, but something the product visibly demonstrates.

---

*This document is the shared source of truth. If a decision here needs to change mid-build, update this doc first so everyone stays aligned — don't let scope drift happen only in someone's head.*
