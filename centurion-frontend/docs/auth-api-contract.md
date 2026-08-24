# Auth API Contract

## 1. Endpoint
`POST /auth/login`

Base URL is configured via `VITE_API_BASE_URL` (e.g. `http://localhost:8000`). Full local request: `http://localhost:8000/auth/login`.

## 2. Request Schema
```json
{
  "login_id": "p_00013",
  "password": "user-entered-password"
}
```

## 3. Required Fields
- `login_id`
- `password`
Both should be strings. The frontend does NOT send `role`, `company`, `personnel_id`, or `battalion`. Role must never be selected or trusted from the frontend.

## 4. Success Response Schema
```json
{
  "access_token": "jwt-access-token",
  "token_type": "bearer",
  "user": {
    "login_id": "p_00013",
    "personnel_id": "p_00013",
    "name": "Example Personnel Name",
    "role": "personnel",
    "company_id": null,
    "company_name": "1st Company",
    "designation": "Constable"
  }
}
```

## 5. Required Response Fields
- `access_token`
- `user`
- `user.login_id`
- `user.role`

Without these fields, the frontend will treat the authentication response as invalid.

## 6. Optional Response Fields
- `user.personnel_id`
- `user.name`
- `user.company_id`
- `user.company_name`
- `user.designation`

For monitored Personnel, `personnel_id` should normally contain values such as `p_00001`, `p_00013`, `p_00150`. For Commander and Welfare Officer, do not invent a `personnel_id` if those accounts are separate application users.

## 7. Role Mapping
Backend may return lowercase values:
- `commander`
- `welfare_officer`
- `personnel`

Frontend will normalize them to:
- `COMMANDER`
- `WELFARE_OFFICER`
- `PERSONNEL`

Preferred backend role values are `commander`, `welfare_officer`, `personnel`. Do not return arbitrary role labels.

## 8. Frontend Routes
After successful login, frontend routing is:
- `commander` → `/commander`
- `welfare_officer` → `/welfare`
- `personnel` → `/personnel`

The backend must return the user's real authorized role. The frontend must never grant access based on the demo shortcut clicked by the user.

## 9. Error Handling
- **Invalid Credentials**: Backend should preferably return `401 Unauthorized` or `403 Forbidden`. Frontend maps either response to: `Invalid Login ID or password.`
- **Server Errors**: For `500` or `503`, frontend shows: `Unable to sign in at the moment.`
- **Connection Error**: If backend cannot be reached at all, frontend shows: `Unable to connect to the authentication service.`

## 10. JWT/Token Usage
Successful backend authentication should return `access_token`. Frontend stores it inside `centurion-session` and other frontend modules can retrieve it later through `getAccessToken()`. Protected API requests can then eventually send:
`Authorization: Bearer <access_token>`

JWT generation and verification are backend responsibilities.

## 11. Personnel Access Concept
The synthetic dataset contains 150 monitored personnel with IDs `p_00001` through `p_00150`. Personnel users must eventually be treated as self-only users. Conceptually:
`p_00013 login` → `PERSONNEL` → `may access data belonging to p_00013`.
They should not gain another person's identity by changing frontend values. Actual authorization enforcement remains the backend teammate's responsibility.

## 12. Welfare Access Concept
There is one separate Welfare Officer demo account. Expected role is `welfare_officer`. The Welfare Officer frontend route is `/welfare`. The backend teammate will define the exact permitted data scope. Do not hardcode a company scope in the frontend unless the backend explicitly returns one.

## 13. Commander Access Concept
There is one separate Commander demo account. Expected role is `commander`. Frontend route is `/commander`. Commander access should be determined by backend authorization. Do not use old `BAT-X`, `BAT-Y`, `BAT-Z` logic.

## 14. Session User Shape inside Frontend
Backend `snake_case` response is converted to frontend `camelCase`. Frontend session conceptually becomes:
```ts
{
  accessToken: "jwt-token",
  user: {
    loginId: "p_00013",
    personnelId: "p_00013",
    name: "Example Personnel Name",
    role: "PERSONNEL",
    companyId: undefined,
    companyName: "1st Company",
    designation: "Constable"
  }
}
```
Password must NEVER be included in the stored session.

## 15. Demo Account Information
Frontend has three demo shortcut types: Commander, Welfare Officer, Personnel. 
Personnel demo account uses `p_00013` as its Login ID. For Commander and Welfare Officer, use only the exact Login IDs discovered earlier in the project. Do not invent passwords. If passwords are not yet provided, document:
`Password: TO BE PROVIDED BY BACKEND TEAM`

## 16. Frontend/Backend Responsibility Split

**FRONTEND RESPONSIBILITIES**
- Render login form
- Collect Login ID and password
- Send POST /auth/login
- Store returned access token
- Store returned authenticated user
- Normalize role names
- Redirect according to role
- Protect frontend routes
- Logout by clearing frontend session

**BACKEND RESPONSIBILITIES**
- Maintain valid login accounts
- Verify Login ID
- Verify password
- Never expose password/hash
- Return authenticated user identity
- Return authorized role
- Return personnel/company mapping
- Generate access token/JWT
- Enforce real API authorization
- Enforce self-only Personnel access
- Enforce Welfare/Commander access rules

## 17. Important Security Note
Frontend route protection is a UX/security layer, but it is not sufficient for real authorization.
The backend must independently verify the JWT and user role for every protected API request.

## 18. Deprecated Old Battalion Auth Model
The following old frontend assumptions are deprecated:
- 21 hardcoded users
- Battalion X, Battalion Y, Battalion Z
- BAT-X, BAT-Y, BAT-Z
- frontend password verification
- fake frontend authentication tokens

New organization data comes from backend responses.
