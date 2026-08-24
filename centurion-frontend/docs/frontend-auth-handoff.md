CENTURION FRONTEND AUTH HANDOFF

Routes:

/login
/commander
/welfare
/personnel


Role Mapping:

COMMANDER
→ /commander

WELFARE_OFFICER
→ /welfare

PERSONNEL
→ /personnel


Login API expected:

POST /auth/login


Request:

{
  "login_id": "<login-id>",
  "password": "<password>"
}


Minimum successful response:

{
  "access_token": "<jwt>",
  "user": {
    "login_id": "<login-id>",
    "role": "<role>"
  }
}


Optional user response fields:

personnel_id
name
company_id
company_name
designation


Frontend token helper:

getAccessToken()


Frontend session helper:

getSession()


Logout helper:

logout()


Important:

Dashboard teammates should not modify the login flow.

They should replace only their DashboardPlaceholder component in App.tsx.

Backend authorization remains the backend team's responsibility.
