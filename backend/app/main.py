from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import LoginRequest, LoginResponse
from app.db import get_demo_account
from app.auth import create_access_token

app = FastAPI(title="CAPF Welfare Triage API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

@app.get("/health")
def health_check():
    """Optional health endpoint for local development."""
    return {"status": "ok"}

@app.post("/login", response_model=LoginResponse)
def login(request: LoginRequest):
    """Authenticate and return a JWT access token for supported demo accounts."""
    
    # Generic error to prevent account enumeration
    auth_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid Service ID or password."
    )
    
    account = get_demo_account(request.service_id)
    if not account:
        raise auth_exception
        
    # NOTE: Production must use a secure hashing algorithm (Argon2/bcrypt) to compare passwords.
    # We use plaintext here solely to match the synthetic demo SQLite seed.
    if request.password != account["password"]:
        raise auth_exception
        
    role = account["role"]
    person_id = account["person_id"]
    
    # Only allow documented roles
    if role not in ["commander", "welfare_officer", "personnel"]:
        raise auth_exception

    access_token = create_access_token(
        data={"person_id": person_id, "role": role}
    )
    
    return LoginResponse(
        access_token=access_token,
        role=role,
        person_id=person_id
    )
