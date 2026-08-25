# Vercel deployment

This repository deploys the Login, Commander, Welfare, and Personnel views as one Vercel project and one public origin.

## Routes

- `/` — Login
- `/commander/#commander` — Commander dashboard
- `/welfare/` — Welfare dashboard
- `/welfare/personnel` — Personnel dashboard
- `/api/login` — Demo authentication function
- `/api/health` — API health check

## Deploy

1. Import this repository into Vercel.
2. Keep the project Root Directory at the repository root.
3. Add a `JWT_SECRET` environment variable with a long random value in Production, Preview, and Development.
4. Deploy. Vercel reads `vercel.json` and assembles all frontend projects into `dist/` automatically.

No `VITE_*` variables are required for the default same-origin deployment. They remain available if a dashboard or API is intentionally hosted elsewhere.

## Important scope note

The bundled API and SQLite database contain synthetic demo accounts for a prototype. Passwords in that dataset are intentionally demo-only. Before handling real personnel data, replace demo authentication and SQLite with a managed database, hashed passwords, audited authorization, and production secret management.
