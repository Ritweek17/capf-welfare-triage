# CAPF Welfare Triage — Implementation Checklist

This checklist turns the revised web-first plan into an executable build sequence.

The current milestone is complete only when one synthetic person's timeline travels through:

```text
synthetic data → personal baseline → risk result → explanation → welfare alert
→ intervention log → commander aggregate
```

## Decisions and guardrails

- [x] Use the web-first prototype for this milestone; defer native React Native/mobile work.
- [x] Keep risk scoring as an in-process backend → risk-engine call, not a public scoring API.
- [x] Keep `API_CONTRACTS.md` frozen unless a deliberate contract change is reviewed first.
- [x] Keep `dashboard` as the canonical frontend; do not develop two competing frontend apps.
- [x] Preserve the cold-start floor: fewer than 14 history days or fewer than 3 duty-cycle records returns `baseline_building`.
- [x] Never expose an individual's raw risk score or flag to that individual.
- [x] Never expose individual identifying risk data through Commander endpoints.
- [x] Every flagged result must include contributing factors.
- [x] Keep all UI/API language welfare-oriented, never disciplinary or diagnostic.

## P0 — Environment and contract readiness

- [x] Add the dashboard TypeScript setup required for clean editor diagnostics: React typings, `tsconfig.json`, and Vite environment typings.
- [x] Add reproducible build/type-check scripts for `dashboard`.
- [x] Create/use a Python virtual environment and install `backend/requirements.txt` plus the local risk-engine package.
- [x] Confirm the backend, dashboard, SQLite database, and risk-engine imports work from documented commands.
- [x] Explicitly leave the separate `centurion-frontend` app outside the canonical demo path; `dashboard` is the frontend to run.
- [x] Confirm the final request/response shapes in `API_CONTRACTS.md` before implementing endpoints.

## P0 — Risk engine

- [x] Define typed `PersonHistory`, baseline, factor, and `RiskResult` structures.
- [x] Implement personal baseline calculations from available leave, duty, deployment, check-in, and consented biometric data.
- [x] Implement the non-negotiable cold-start behavior.
- [x] Implement workload/recovery features using the current dataset first: duty hours, consecutive duty days, leave gaps, deployment intensity, and check-in gaps.
- [x] Implement normalized personal deviations with safe handling for low variance and missing data.
- [x] Implement persistence protection so one abnormal period does not immediately become high priority.
- [x] Keep categories interpretable while mapping them to the existing API contract where necessary.
- [x] Implement explainability factors for every flagged result.
- [x] Implement transparent intervention recommendations and suggested tiers.
- [x] Add tests for stable baseline, workload escalation, missing data behavior, low variance, cold start, and consent gating.

## P0 — Backend and storage

- [x] Keep the existing JWT login shape working: `service_id` + `password` → `access_token`, `role`, `person_id`.
- [x] Enforce Personnel self-only access in backend dependencies/routes.
- [x] Enforce Welfare Officer-only access to individual alerts.
- [x] Enforce Commander-only access to aggregate unit summaries.
- [x] Implement/verify database models and queries for check-ins, risk results, alerts, interventions, and audit logs.
- [x] Implement `POST /checkins` with mood, optional note, and structured responses.
- [x] Ensure the check-in response contains only receipt information and never a score, flag, or risk state.
- [x] Implement the synchronous backend → risk-engine bridge after check-in submission.
- [x] Implement `GET /alerts` with contributing factors and suggested tier.
- [x] Recompute or refresh alert state according to the agreed contract and architecture.
- [x] Implement `POST /alerts/{alert_id}/log` for intervention/outcome logging.
- [x] Implement `GET /unit-summary` as aggregate-only SQL/query logic.
- [x] Add audit logging for Welfare Officer access to individual-level data.
- [x] Add backend tests for 401/403 behavior, self-only access, Commander privacy, and Welfare Officer access.

## P0 — Synthetic data and scenarios

- [x] Keep synthetic-only data generation.
- [x] Keep deliberate at-risk profiles alongside ordinary baseline personnel.
- [x] Keep cold-start personnel below the history/duty threshold.
- [x] Keep biometric records gated by `biometric_consent`.
- [x] Keep seeded SQLite data valid and integrity-checkable.
- [x] Validate five demo scenarios: stable, workload escalation, deployment/recovery imbalance, wellness decline, and false-positive protection.
- [x] Use the existing deployment records in the risk engine; add no extra training/deployment schema without a demo need.
- [x] Add repeatable scenario validation with expected welfare-support outputs, not clinical labels.

## P0 — Dashboard, in this order

### Welfare Officer view

- [x] Replace the placeholder with an alert queue.
- [x] Show risk-support level, contributing factors, trend context, and suggested action.
- [x] Add alert details and intervention logging.
- [x] Add follow-up date/status handling.
- [x] Make the welfare/support framing visible in the UI.

### Commander view

- [x] Replace the placeholder with unit health overview.
- [x] Show aggregate risk indicators, participation, and open-alert counts.
- [x] Verify no person ID, name, individual score, note, or raw biometric value reaches the Commander response/UI.

### Personnel view

- [x] Replace the placeholder with a responsive web check-in experience.
- [x] Show consent and privacy messaging.
- [x] Support optional note and structured wellness responses.
- [x] Show receipt confirmation only after submission.
- [x] Do not show the user's risk score, flag, or internal welfare state.
- [ ] Add voluntary support-resource/request-support affordance if it fits the current contract.

## P0 — Integration and demo rehearsal

- [x] Verify the committed synthetic database is seeded and integrity-checkable.
- [x] Start backend and dashboard from documented commands.
- [x] Log in with all three demo roles.
- [x] Submit a Personnel check-in successfully.
- [x] Confirm the backend calls the risk engine and stores the result.
- [x] Confirm a flagged synthetic scenario appears in the Welfare Officer queue with reasons.
- [x] Log an intervention and confirm the alert status changes.
- [x] Confirm Commander sees only aggregate unit data.
- [x] Verify Personnel never receives a score/flag in any response.
- [x] Run the complete demo flow twice from a clean database state.

## P1 — Quality, documentation, and pitch support

- [x] Add a short model card: purpose, inputs, outputs, non-goals, limitations, synthetic-data limitation, missing-data behavior, thresholds, and human-review requirement.
- [x] Document API startup, database seeding, frontend startup, and demo credentials in `README.md`.
- [x] Document privacy, consent, audit logging, and Commander aggregation boundaries.
- [x] Verify and report synthetic scenario behavior, explainability completeness, RBAC pass rate, and end-to-end latency—not clinical accuracy.
- [x] Update the pitch/demo story around one person's timeline from baseline to intervention to unit aggregate.
- [ ] Rehearse welfare-not-discipline language throughout the live demo.

## P2 — Deferred work

- [ ] Native React Native/mobile application.
- [ ] Real wearable or biometric integrations.
- [ ] Advanced machine learning or deep-learning models.
- [ ] Real CAPF data ingestion or clinical validation.
- [ ] Production-scale infrastructure and microservices.

## Definition of done

- [x] Risk engine has meaningful implementation and passing tests.
- [x] Backend implements the required contract endpoints with RBAC.
- [x] Welfare Officer can review an explainable alert and log an intervention.
- [x] Commander can see aggregate trends without individual risk data.
- [x] Personnel can submit a voluntary responsive check-in without seeing a score or flag.
- [x] The complete synthetic end-to-end flow works without manual database edits.
- [x] Dashboard type-check/build/start commands are documented and reproducible.
