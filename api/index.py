import sys
from pathlib import Path

from fastapi import FastAPI


REPOSITORY_ROOT = Path(__file__).resolve().parent.parent
BACKEND_ROOT = REPOSITORY_ROOT / "backend"
BACKEND_ROOT = REPOSITORY_ROOT / "capf-welfare-triage" / "backend"

if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.main import login as authenticate  # noqa: E402
from app.schemas import LoginRequest, LoginResponse  # noqa: E402


app = FastAPI(title="CENTURION API")


@app.get("/api/health")
def health() -> dict[str, str]:
    """Report whether the Vercel API function is available."""
    return {"status": "ok"}


@app.post("/api/login", response_model=LoginResponse)
def login(request: LoginRequest) -> LoginResponse:
    """Authenticate a supported synthetic demo account."""
    return authenticate(request)
