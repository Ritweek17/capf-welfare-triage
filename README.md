# CAPF Welfare Triage

CENTURION is a privacy-first welfare early-warning prototype with role-specific experiences for Personnel, Welfare Officers, and Commanders. Personnel never receive raw risk scores, and Commander views remain aggregate-only.

## Frontend applications

- `dashboard/` — Login and authentication gateway
- `apps/commander-dashboard/` — Aggregate Commander dashboard
- `apps/welfare-dashboard/` — Welfare Officer and Personnel dashboards

For the unified Vercel build and deployment routes, see [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md).
Web-first welfare-triage prototype for synthetic CAPF personnel data. The
current demo flow is:

```text
Personnel check-in → personal baseline/risk engine → explainable alert
→ Welfare Officer intervention log → Commander aggregate trend
```

## Run locally

From the repository root, create a Python environment and install the backend
dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

Start the API in one terminal:

```bash
PYTHONPATH=backend:risk-engine uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The API uses `data/synthetic_data.sqlite3` by default. To use a disposable
copy during rehearsal, set `CAPF_API_DB=/path/to/demo.sqlite3`. The committed
database is seeded synthetic data; runtime risk results and intervention
records are written to the database used by the API.

Install and start the dashboard in a second terminal:

```bash
cd dashboard
npm ci
npm run dev
```

Open `http://127.0.0.1:5173`.

The committed database and credentials are synthetic demo data only. Example
accounts include:

```text
Personnel:       CRPF-PER-00013 / demo-p-00013-2026
Welfare Officer: CRPF-WEL-1ST   / demo-welfare-1st-2026
Commander:       CRPF-CMD-1ST   / demo-commander-1st-2026
```

## Verification

```bash
cd dashboard
npm run typecheck
npm run build
```

Risk-engine tests can run without pytest through the standard library test
runner:

```bash
PYTHONPATH=risk-engine python -m unittest discover -s risk-engine/tests -v
```

Backend RBAC tests use the same runner:

```bash
PYTHONPATH=backend:risk-engine python -m unittest discover -s backend/tests -v
```

The model purpose, limitations, synthetic-data boundary, consent gate, and
human-review requirement are documented in [MODEL_CARD.md](MODEL_CARD.md).

Welfare Officer endpoints expose individual alerts and audit each access.
Commander endpoints contain aggregate trends and counts only. Personnel
check-ins return receipt information only; they never return risk scores,
flags, or internal welfare state.

The native mobile app and the separate `centurion-frontend` app remain outside
the current canonical demo path; the responsive `dashboard` Personnel view is
the current mobile-ready experience.
