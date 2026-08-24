import os
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.schemas import AuthenticatedUser
from app.db import get_person_identity

# Local demo fallback only
JWT_SECRET = os.getenv("JWT_SECRET", "centurion-local-development-secret-change-me")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))

security = HTTPBearer()

def create_access_token(data: dict) -> str:
    """Create a signed JWT access token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> AuthenticatedUser:
    """Extract and verify the JWT to obtain the authenticated user."""
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        person_id: str = payload.get("person_id")
        role: str = payload.get("role")
        if person_id is None or role is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    person_db = get_person_identity(person_id)
    if not person_db:
        raise credentials_exception
    
    if person_db["role"] != role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Role mismatch between token and server."
        )

    return AuthenticatedUser(person_id=person_id, role=person_db["role"], unit=person_db["unit"])

def require_roles(*allowed_roles: str):
    """Dependency injection helper to restrict endpoint access by verified JWT roles."""
    def role_checker(user: AuthenticatedUser = Depends(get_current_user)) -> AuthenticatedUser:
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted for this role"
            )
        return user
    return role_checker

def require_same_unit(user: AuthenticatedUser, target_unit: str):
    """Helper to ensure a user only accesses data within their own unit."""
    if user.unit != target_unit:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to own unit"
        )

def require_self(user: AuthenticatedUser, target_person_id: str):
    """Helper to ensure a personnel only accesses their own data."""
    if user.role == "personnel" and user.person_id != target_person_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Personnel can only access their own data"
        )
