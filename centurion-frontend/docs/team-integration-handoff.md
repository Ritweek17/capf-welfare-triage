# CENTURION TEAM INTEGRATION HANDOFF

## Current Status
Frontend Login: READY
Backend Integration: WAITING FOR /auth/login

## Final Routes
- `/login`
- `/commander`
- `/welfare`
- `/personnel`

## Role Mapping
- `COMMANDER` → `/commander`
- `WELFARE_OFFICER` → `/welfare`
- `PERSONNEL` → `/personnel`

## Personnel Dataset
- **Personnel Dataset:** `p_00001` → `p_00150`
- **Personnel Demo Shortcut:** `p_00013`
- **Company Distribution:**
  - 1st Company: 50
  - 2nd Company: 50
  - 3rd Company: 50

## Backend Teammate Contract
- **Authentication Request:** `login_id` + `password`
- **Authentication Response:** `access_token` + `user`
- **Expected Backend Endpoint:** `POST /auth/login`

### Request Format
```json
{
  "login_id": "p_00013",
  "password": "entered-password"
}
```

### Minimum Successful Response
```json
{
  "access_token": "jwt-token",
  "user": {
    "login_id": "p_00013",
    "role": "personnel"
  }
}
```

### Preferred Complete Response
```json
{
  "access_token": "jwt-token",
  "token_type": "bearer",
  "user": {
    "login_id": "p_00013",
    "personnel_id": "p_00013",
    "name": "Personnel Name",
    "role": "personnel",
    "company_id": null,
    "company_name": "1st Company",
    "designation": "Constable"
  }
}
```

## Frontend Session
- **Storage Key:** `centurion-session`
- **Session Information Available:**
  - `loginId`
  - `personnelId`
  - `name`
  - `role`
  - `companyId`
  - `companyName`
  - `designation`
  - `accessToken`

Dashboard teammates can use `getSession()` to retrieve authenticated user information, and `getAccessToken()` to retrieve the access token for protected API requests.

## Dashboard Teammates Integration
- **Commander teammate:** Replace `<DashboardPlaceholder title="Commander Dashboard" />` with `<CommanderDashboard />`
- **Welfare Officer teammate:** Replace `<DashboardPlaceholder title="Welfare Officer Dashboard" />` with `<WelfareDashboard />`
- **Personnel teammate:** Replace `<DashboardPlaceholder title="Personnel Dashboard" />` with `<PersonnelDashboard />`

They should NOT modify `LoginPage.tsx`, `auth.service.ts`, `ProtectedRoute.tsx`, or `auth.ts` unless the integration contract changes.

## Important Security Boundary
`ProtectedRoute` only protects frontend navigation. Real data authorization must always be enforced by the backend using the authenticated JWT and role. Never allow dashboard teammates to depend only on frontend role checks for sensitive API access.

## Frontend / Backend Responsibility Split

**Frontend owns:**
- Login UI
- Login ID + Password form
- Password show/hide
- Demo shortcut UI
- Authentication loading animation
- POST /auth/login request
- Frontend session storage
- Role normalization
- Role-based redirects
- ProtectedRoute
- Logout

**Backend team must handle:**
- Login account storage
- 150 Personnel accounts
- Commander account
- Welfare Officer account
- Password hashing
- Password verification
- JWT generation
- JWT validation
- API RBAC
- Personnel self-only authorization
- Welfare Officer authorization
- Commander authorization

## Deprecated Architecture
The frontend no longer depends on:
- 21 hardcoded accounts
- Battalion X, Battalion Y, Battalion Z
- BAT-X, BAT-Y, BAT-Z
- frontend password verification
- fake frontend JWT generation

## Frontend Environment Configuration

Create a local `.env` file:

```text
VITE_API_BASE_URL=http://localhost:8000
```

When the backend is deployed, replace the value with the backend URL.

Example:

```text
VITE_API_BASE_URL=https://api.example.com
```

Do not include `/auth/login` in `VITE_API_BASE_URL`.
The frontend automatically appends `/auth/login`.
