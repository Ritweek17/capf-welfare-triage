# Hour 0–2 Checklist

- [ ] **(0:00–0:15) Repo init.** Create the repo with the folder tree from `FOLDER_TREE.md` already scaffolded (empty files are fine), both clone it.
- [ ] **(0:15–0:30) Walk through `API_CONTRACTS.md` and `DATA_SCHEMA.md` together before building diverges.** Any field or shape either person needs changed gets settled now — once agreed, these don't change mid-build without both people knowing, since both halves are about to build against them in parallel.
- [ ] **(0:30–0:50) Dependency install, each person in their own half:**
  - Person A (Backend + Risk Engine + Data): Python venv + `pip install fastapi uvicorn sqlalchemy python-jose[cryptography] pydantic pandas numpy scikit-learn pytest faker`
  - Person B (Dashboard + Mobile): `npm create vite@latest . -- --template react-ts` for both `/dashboard` and `/mobile-app`, then install a component/chart lib for the dashboard
- [ ] **(0:50–1:05) Database stood up.** Person A spins up Postgres (or SQLite if simpler) and confirms the schema in `DATA_SCHEMA.md` matches the models being written in `/backend/app/models.py`.
- [ ] **(1:05–1:20) JWT shape agreed.** Person A confirms the JWT shape (`person_id`, `role`) so Person B can build the dashboard and mobile app against a fake/stub token immediately without waiting for real auth to be finished.
- [ ] **(1:20–1:40) "Hello world" proof each half runs:**
  - Person A: backend serves `/health`, and `risk_engine.compute_risk()` runs against a hardcoded fake `PersonHistory` and returns *something*.
  - Person B: dashboard renders a blank shell, mobile app renders a blank shell.
- [ ] **(1:40–2:00) Demo-mode role switcher confirmed working.** Person B builds and verifies the "View as Commander / View as Welfare Officer" switcher using the 2 fixed demo accounts from `DATA_SCHEMA.md`, matching `PLAN.md`'s Risk Fallback #2 (hardcoded demo accounts, not a full user-management system).

Parallel build begins at Hour 2.
