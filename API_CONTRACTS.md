# API Contracts — Finalize Now, Build in Parallel From Here

All Backend endpoints require `Authorization: Bearer <JWT>` except `/login`. JWT payload includes `person_id` and `role` (`personnel` | `welfare_officer` | `commander`).

---

## 1. `POST /login`

**Request**
```json
{
  "service_id": "CRPF-DEMO-00123",
  "password": "demo-password"
}
```

**Response `200`**
```json
{
  "access_token": "eyJhbGciOi...",
  "role": "personnel",
  "person_id": "p_00123"
}
```

---

## 2. `POST /checkins` — Mobile App → Backend

**Request** (role: `personnel`, can only submit for own `person_id`, taken from JWT — not in body)
```json
{
  "mood_score": 3,
  "note": "Rough week, extra duty hours",
  "structured_responses": {
    "sleep_quality": 2,
    "irritability": 3,
    "energy_level": 2
  }
}
```

**Response `200`** — **intentionally minimal, never a score (Decision 2)**
```json
{
  "status": "received",
  "checkin_id": "c_88213",
  "timestamp": "2026-08-23T14:02:00Z"
}
```

---

## 3. Backend → Risk Engine — **In-Process Function Call, Not HTTP** (Decision 3)

This is not a network contract — `/backend` imports `/risk-engine` directly. The function signature below **is** the contract; both teams build against this shape.

```python
# risk_engine/scoring.py

def compute_risk(history: PersonHistory) -> RiskResult:
    """
    history: aggregated leave/duty/checkin/(optional biometric) records
             for one person, with enough metadata to determine
             days-of-history and duty-cycle count.
    """
```

**`PersonHistory` (input shape, as a dataclass/dict)**
```json
{
  "person_id": "p_00123",
  "days_of_history": 42,
  "duty_cycles_recorded": 6,
  "leave_records": [{"date": "2026-07-01", "type": "annual"}],
  "duty_records": [{"date": "2026-08-20", "hours": 14}],
  "checkins": [{"date": "2026-08-22", "mood_score": 3}],
  "biometric_consent": false,
  "biometric_records": []
}
```

**`RiskResult` (output shape)**

Cold-start case (Decision 1):
```json
{
  "status": "baseline_building",
  "score": null,
  "flagged": false,
  "factors": []
}
```

Scored case (Decision 4 — z > 2.0 triggers a flag):
```json
{
  "status": "scored",
  "score": 2.4,
  "flagged": true,
  "factors": [
    {"factor": "leave_frequency", "deviation": "-60% vs personal baseline"},
    {"factor": "duty_hours", "deviation": "+40% vs personal baseline"},
    {"factor": "checkin_gap_days", "deviation": "21 days since last check-in"}
  ],
  "suggested_tier": "informal_checkin"
}
```

---

## 4. `GET /alerts` — Backend → Dashboard (Welfare Officer view only)

**Response `200`** (role: `welfare_officer` required — enforced server-side)
```json
{
  "alerts": [
    {
      "person_id": "p_00123",
      "flagged_at": "2026-08-23T09:00:00Z",
      "score": 2.4,
      "factors": [
        {"factor": "leave_frequency", "deviation": "-60% vs personal baseline"},
        {"factor": "duty_hours", "deviation": "+40% vs personal baseline"}
      ],
      "suggested_tier": "informal_checkin",
      "status": "open"
    }
  ]
}
```

**`POST /alerts/{alert_id}/log`** — welfare officer logs an outcome
```json
{
  "action_taken": "informal_checkin_completed",
  "notes": "Spoke with individual, referred to counseling voluntarily"
}
```

---

## 5. `GET /unit-summary` — Backend → Dashboard (Commander view only)

**Response `200`** (role: `commander` required — **no `person_id` or name fields exist in this response, by design**)
```json
{
  "unit": "3rd Company",
  "trend_30d": [
    {"date": "2026-07-24", "avg_risk_indicator": 0.8},
    {"date": "2026-08-23", "avg_risk_indicator": 1.6}
  ],
  "open_alert_count": 4,
  "personnel_count": 87
}
```
