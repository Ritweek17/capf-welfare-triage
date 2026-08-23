# Synthetic Data Schema

All data below is **entirely fake/generated** — no real personnel data is used anywhere in this build.

## `Person`

| Field | Type | Notes |
|---|---|---|
| `person_id` | string (PK) | pseudonymized, e.g. `p_00123` |
| `unit` | string | e.g. `"3rd Company"` |
| `role` | enum | `personnel` \| `welfare_officer` \| `commander` |
| `enrolled_at` | date | used to compute `days_of_history` for cold-start check |
| `biometric_consent` | bool | **gates whether `BiometricRecord` rows are ever included in a risk-engine call (Decision incorporated)** |
| `is_deliberate_at_risk_profile` | bool | internal-only flag for the data lead — marks the handful of hand-crafted "clearly at-risk" synthetic personnel (Phase 1 Risk #1 fallback); never exposed via any API |

## `LeaveRecord`

| Field | Type | Notes |
|---|---|---|
| `id` | string (PK) | |
| `person_id` | string (FK) | |
| `date` | date | |
| `type` | enum | `annual` \| `emergency` \| `medical` \| `none_taken_this_period` |

## `DutyRecord`

| Field | Type | Notes |
|---|---|---|
| `id` | string (PK) | |
| `person_id` | string (FK) | |
| `date` | date | |
| `hours` | int | duty hours that day/shift |
| `deployment_type` | enum | `routine` \| `high_stress_posting` \| `training` |
| `transfer_flag` | bool | true on the date of a posting transfer |

## `CheckIn`

| Field | Type | Notes |
|---|---|---|
| `id` | string (PK) | |
| `person_id` | string (FK) | |
| `timestamp` | datetime | |
| `mood_score` | int (1–5) | |
| `note` | string, nullable | optional free text |
| `structured_responses` | JSON, nullable | optional GMHAT-style structured questions, e.g. `{"sleep_quality": int, "irritability": int, "energy_level": int}` |

## `BiometricRecord` (only generated/used if `biometric_consent = true`)

| Field | Type | Notes |
|---|---|---|
| `id` | string (PK) | |
| `person_id` | string (FK) | |
| `date` | date | |
| `resting_hr` | int, nullable | simulated |
| `sleep_hours` | float, nullable | simulated |

## `RiskResult` (written by Backend after calling risk-engine — not generated synthetically, computed at runtime)

| Field | Type | Notes |
|---|---|---|
| `id` | string (PK) | |
| `person_id` | string (FK) | |
| `computed_at` | datetime | |
| `status` | enum | `baseline_building` \| `scored` |
| `score` | float, nullable | null if `baseline_building` |
| `flagged` | bool | |
| `factors` | JSON, nullable | list of contributing-factor objects |
| `suggested_tier` | string, nullable | |

## `AccessLog` (privacy requirement — logs every view of individual-level data)

| Field | Type | Notes |
|---|---|---|
| `id` | string (PK) | |
| `accessed_by_person_id` | string (FK) | must be a `welfare_officer` |
| `accessed_person_id` | string (FK) | whose record was viewed |
| `timestamp` | datetime | |
| `reason` | string, nullable | optional justification note |

## Generator Notes for the Data Lead

- Generate **~150 fake personnel** across 2–3 units, with **90 days** of `LeaveRecord`/`DutyRecord` history each, so most people clear the 14-day cold-start floor well before the demo.
- Deliberately hold **10–15 personnel below the 14-day/3-duty-cycle floor** to demonstrate the `"baseline_building"` state live in the demo.
- Deliberately craft **3–5 personnel with an obvious at-risk pattern** (declining leave, spiking duty hours, dropped check-ins) — flag them with `is_deliberate_at_risk_profile = true` internally so the demo reliably produces a flagged alert.
- Set `biometric_consent = true` for only a **minority subset** (e.g. ~20%) to demonstrate the opt-in gate actually gates something in the demo.
- Keep the rest statistically "boring" (normal variation, no manufactured pattern) so the anomaly detection has real contrast to work against.
- Also generate realistic **`CheckIn` history** for each person over the same 90-day window (not just `LeaveRecord`/`DutyRecord`) — regular, roughly-weekly check-ins for the "boring" baseline personnel. For the deliberately-crafted at-risk profiles, include a **deliberately large check-in gap** (e.g. 20+ days with no check-in) so the `"checkin_gap_days"` factor in the risk engine's output has real data to compute against instead of being an empty/placeholder field.
- **Seed 2 fixed demo login accounts, separate from the ~150 monitored-personnel pool:** one with `role = welfare_officer` and one with `role = commander`, each with known, fixed credentials (or a pre-issued fixed token) for demo use. These are login/viewing accounts only — they should not appear in the monitored-personnel data used by the risk engine.
