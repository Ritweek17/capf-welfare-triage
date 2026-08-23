# Architecture — PS 26186

## Components

```
[Mobile App (PWA)]                [Dashboard (single React app,
      |                            role-conditional rendering)]
      | HTTPS/JSON                        ^
      v                                   | HTTPS/JSON
   [Backend — FastAPI] <--- in-process ---[Risk Engine — Python lib]
      |
      v
   [Postgres/SQLite]
```

- **Mobile App** talks only to the Backend, only over HTTPS/JSON. It never talks to the risk engine or the database directly.
- **Backend** is the single gatekeeper: every read or write to the database, and every call into the risk engine, goes through it. This is also where RBAC and consent checks are enforced — never in the frontend.
- **Risk Engine** is a Python library imported directly into the Backend process (Decision 3). It exposes one function boundary: `compute_risk(person_history) -> RiskResult`. No network hop, no separate deployment.
- **Dashboard** is **one app**, not two. It reads the `role` claim out of the JWT issued at login and conditionally renders either the Commander view (aggregates only) or the Welfare Officer view (flagged individuals + reasons). Same components, same bundle, different data the API is willing to return for that role.

## Data Flow: Mobile Check-In → Alert

1. **Personnel submits a check-in** (mood scale, optional note, optional structured questions) via the mobile app → `POST /checkins` on the Backend, authenticated as that person.
2. **Backend writes the check-in** to the database, tagged with `person_id` and `timestamp`. It returns `{"status": "received"}` to the mobile app — **no score, ever, in this response** (Decision 2).
3. **Risk is recomputed at two fixed trigger points only — no async/background job:**
   - **Immediately, synchronously, right after a check-in is saved** in step 2 — the Backend pulls that person's full recent history (leave, duty hours, deployment record, check-ins, and — only if `biometric_consent = true` — biometric data) and calls `risk_engine.compute_risk(history)` in-process before the request completes.
   - **Again, synchronously, every time `GET /alerts` is called** — the Backend recomputes risk for the relevant personnel at request time, so the Welfare Officer view is always showing a fresh result rather than a stale cached one.
   
   Both trigger points call the same in-process function; there is no separate scheduler, queue, or polling loop to build.
4. **Risk Engine checks history length first.** If `< 14 days` or `< 3 duty-cycle data points` → returns `{"status": "baseline_building"}` and stops (Decision 1). No score is computed or stored for this person yet.
5. **If enough history exists**, the Risk Engine computes a composite deviation z-score against that person's own historical baseline. If `z > 2.0` (Decision 4), it returns a `RiskResult` with the score, the contributing factors (e.g. "leave frequency -60% vs. baseline"), and a suggested response tier.
6. **Backend stores the RiskResult** (pseudonymized, access-logged) and, if flagged, writes an entry to the **Welfare Officer alert queue**.
7. **Welfare Officer's dashboard view** (`GET /alerts`, role = welfare_officer) shows the queue with per-person reasons. **Commander's dashboard view** (`GET /unit-summary`, role = commander) only ever sees aggregated, non-identifying trend data — the backend enforces this at the query level, not just the UI level.

## Where RBAC and Consent Gate Each Step

| Step | Gate |
|---|---|
| Mobile check-in submission | Person can only write their own check-in (JWT `person_id` must match) |
| Mobile check-in response | Hardcoded to never include a score field, regardless of role |
| Risk engine call | Backend only includes biometric fields in the history payload if `biometric_consent = true` for that person |
| `GET /alerts` (flagged individuals + reasons) | Requires `role = welfare_officer`; every access is written to an access log with who/when |
| `GET /unit-summary` (aggregates) | Requires `role = commander`; query is aggregate-only at the SQL level — individual `person_id`s are never in the response payload, so there's no field to accidentally leak |
| Any endpoint returning personnel data | Backend checks role on every request; there is no "trusted frontend" — the dashboard enforces nothing on its own |

## Why the Dashboard Is One App, Not Two

Same layout shell, same design system, same login flow — the only thing that changes is which API endpoints the logged-in role is allowed to call and which components render with that data. Building two separate apps would double frontend work for zero benefit in a 36-hour window, and risks the two views drifting out of visual consistency right before the demo.

## Why Mobile Is a PWA (Fallback Decision Confirmed Here)

Per Phase 1 Risk #3: native app tooling is a real failure point in 36 hours. Building the mobile app as a mobile-responsive web app (installable as a PWA) satisfies the PS's "mobile-based" requirement, demos cleanly on a phone browser, and shares tooling/patterns with the dashboard team if time gets tight.
