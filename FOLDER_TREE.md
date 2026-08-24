# Folder Tree — Minimum Files for a Working Demo

Note: Commander, Welfare Officer, and Personnel are **one responsive dashboard app** with role-conditional rendering — there is only one `/dashboard` folder and no separate mobile app.

```
/repo-root
│
├── README.md
├── ARCHITECTURE.md
├── AGENTS.md
├── PLAN.md                          (Phase 1 document, copied in as-is)
│
├── /backend
│   ├── requirements.txt
│   ├── .env.example
│   ├── /app
│   │   ├── main.py                  # FastAPI app entrypoint, route registration
│   │   ├── auth.py                  # login, JWT issuance, role claim
│   │   ├── rbac.py                  # role-check dependency used on every protected route
│   │   ├── models.py                # SQLAlchemy models: Person (incl. biometric_consent bool),
│   │   │                            #   Checkin, LeaveRecord, DutyRecord, RiskResult, AccessLog
│   │   ├── schemas.py                # Pydantic request/response models (mirrors API_CONTRACTS.md)
│   │   ├── db.py                    # DB session/connection setup
│   │   ├── routes/
│   │   │   ├── checkins.py          # POST /checkins
│   │   │   ├── alerts.py            # GET /alerts (welfare_officer only)
│   │   │   ├── unit_summary.py      # GET /unit-summary (commander only)
│   │   │   └── auth_routes.py       # POST /login
│   │   └── risk_bridge.py           # calls risk_engine.compute_risk() synchronously — triggered
│   │                                #   after checkin save AND on every GET /alerts call; stores RiskResult
│   └── tests/
│       └── test_rbac.py             # proves commander can't see individual data, etc.
│
├── /risk-engine
│   ├── setup.py                     # so backend can `pip install -e .`
│   ├── risk_engine/
│   │   ├── __init__.py
│   │   ├── baseline.py              # per-person historical baseline computation
│   │   ├── scoring.py               # compute_risk(history) -> RiskResult, cold-start check,
│   │   │                            #   z-score threshold logic (Decision 4)
│   │   └── explain.py               # produces the contributing-factors list
│   └── tests/
│       ├── test_cold_start.py       # <14 days -> "baseline_building", nothing else
│       └── test_scoring.py          # known synthetic input -> expected flag/no-flag
│
├── /dashboard
│   ├── package.json
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx                  # reads role from JWT, routes to the right role view
│   │   ├── api/client.ts            # typed fetch wrapper matching API_CONTRACTS.md
│   │   ├── auth/useAuth.ts          # decodes JWT, exposes role + person_id
│   │   ├── views/
│   │   │   ├── CommanderView.tsx    # aggregate trend charts only
│   │   │   ├── WelfareOfficerView.tsx  # alert queue with reasons + action logging
│   │   │   └── PersonnelView.tsx     # responsive self-check-in form
│   │   └── components/
│   │       ├── shared/
│   │       │   ├── TrendChart.tsx
│   │       │   ├── AlertCard.tsx
│   │       │   └── Layout.tsx
│   └── index.html
│
├── /data
│   ├── generate_synthetic_data.py   # produces fields in DATA_SCHEMA.md
│   ├── seed_db.py                   # loads generated data into Postgres/SQLite
│   ├── at_risk_profiles.py          # deliberately-crafted at-risk personnel (Risk #1 fallback)
│   └── requirements.txt
│
└── /docs
    ├── PITCH_DECK.md (or .pptx)
    └── ARCHITECTURE_DIAGRAM.png     (exported from ARCHITECTURE.md description)
```
