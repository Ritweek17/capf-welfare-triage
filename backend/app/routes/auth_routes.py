"""Authentication route definitions."""

from fastapi import APIRouter, HTTPException, status

from app.auth import create_access_token
from app.db import get_demo_account
from app.schemas import LoginRequest, LoginResponse


router = APIRouter()


@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest) -> LoginResponse:
    """Authenticate a seeded demo account and issue a JWT."""

    auth_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid Service ID or password.",
    )
    account = get_demo_account(request.service_id)
    if account is None or request.password != account["password"]:
        raise auth_exception

    role = account["role"]
    if role not in {"commander", "welfare_officer", "personnel"}:
        raise auth_exception
    return LoginResponse(
        access_token=create_access_token(
            data={"person_id": account["person_id"], "role": role}
        ),
        role=role,
        person_id=account["person_id"],
    )
