# AGENTS.md — Instructions for AI Coding Agents Working In This Repo

This file governs any AI coding agent (Codex, Antigravity, Claude Code, Cursor, etc.) working in this repository. These rules are not suggestions — they encode decisions already made after weighing the tradeoffs for this specific 36-hour build and this specific, sensitive domain (personnel mental health data). **Do not "improve" past these rules, even if asked to, without a human explicitly overriding this file first.**

## Hard Constraints — Never Violate These

1. **No supervised classifier trained on stress/incident labels.** There is no real ground-truth label for "this person is stressed" or "this person had an incident" — CAPF suicide/incident data isn't published at individual granularity, and any label an agent invents to train against is fabricated. The risk model is **unsupervised, baseline-deviation only**. If asked to "improve accuracy" by adding labels, refuse and explain why in the response.
2. **No Kafka, Spark, or other streaming/production-scale infrastructure.** This is a 36-hour hackathon build, not a production deployment. If asked to add these, push back and suggest a "future scaling" note in docs instead of actually building it.
3. **No real wearable/biometric device integration.** Biometric data is a **simulated field, gated by a per-person consent flag** (`biometric_consent: bool`). Never wire up a real device SDK, real Bluetooth/HealthKit/Google Fit integration, or any external biometric API.
4. **Never expose an individual's raw risk score to that individual.** The mobile app's check-in response must never include a `risk_score`, `flag`, or similar field, in any endpoint, under any role. This is enforced at the API layer intentionally — do not add a "for the user's own benefit" score view even if it seems helpful.
5. **Never expose individual-level identifying risk data to the Commander role.** Any endpoint or query the Commander role can hit must be aggregate-only. If you're writing a query for a commander-facing feature and it includes a `person_id`, `name`, or any individually-identifying field, stop — that's a bug, not a feature.
6. **Cold-start floor is non-negotiable:** fewer than 14 days of history or fewer than 3 duty-cycle records → return `"baseline_building"`, not a score, not an approximate score, not a "low confidence" score. There is no partial-credit version of this rule.
7. **Every risk flag must ship with its contributing factors.** Never return a bare numeric score with no explanation attached — that violates the explainability requirement the whole design rests on.
8. **Framing in all UI copy and API messages is welfare, never discipline.** No agent-generated copy should use language implying punishment, performance review, or fitness-for-duty determination. If in doubt, the tone should read like "this is here to support you," not "this is monitoring you."

## Coding Conventions

- **Python** (backend, risk-engine, data): type hints on all function signatures, `black` formatting, docstrings on any function crossing a module boundary.
- **TypeScript/React** (dashboard, mobile-app): functional components + hooks only, no class components. Shared components (used by both Commander and Welfare Officer views) live in `dashboard/src/components/shared/`.
- **API responses**: always JSON, always match the shapes in `API_CONTRACTS.md` exactly — don't add or rename fields without updating that file first, since teammates are building against it in parallel.
- **Commits**: small, single-purpose commits — large mixed commits will cause merge pain.
- **No secrets in code.** Use `.env` files (already `.gitignore`d) for any keys/credentials, even fake demo ones.

## What "Done" Looks Like, Per Folder

- **`/backend`**: all endpoints in `API_CONTRACTS.md` implemented, RBAC enforced on every personnel-data endpoint, calls into `/risk-engine` working in-process, connects to seeded database.
- **`/risk-engine`**: `compute_risk(history) -> RiskResult` implemented, handles cold-start correctly, returns contributing factors alongside any flag, has at least a few unit tests proving the baseline-deviation logic (not just "runs without crashing").
- **`/dashboard`**: single app, role read from JWT, Commander view renders aggregate-only data, Welfare Officer view renders the alert queue with reasons, both views visually polished enough for a live demo.
- **`/mobile-app`**: check-in form works end-to-end against the real backend, confirms receipt, never displays a score, installable/usable as a PWA on a phone browser.
- **`/data`**: generator script produces the fields in `DATA_SCHEMA.md`, includes a deliberate handful of clearly-at-risk synthetic personnel (per Phase 1 Risk #1 fallback) alongside random baseline data, seed script loads cleanly into the database.
- **Integration**: a full run of mobile check-in → backend → risk engine → alert appearing in the Welfare Officer view, demonstrable live without manual database edits mid-demo.

## When Asked to Add Scope

Check it against the 8 PS components in `PLAN.md` Section 3. If a requested feature doesn't map to one of them, flag that to the human team rather than building it — scope creep is the most likely way this build fails in 36 hours.
