from pydantic import BaseModel

class LoginRequest(BaseModel):
    service_id: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    role: str
    person_id: str

class AuthenticatedUser(BaseModel):
    person_id: str
    role: str
    unit: str
