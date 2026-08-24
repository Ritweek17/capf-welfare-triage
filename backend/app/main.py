from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.alerts import router as alerts_router
from app.routes.auth_routes import router as auth_router
from app.routes.checkins import router as checkins_router
from app.routes.unit_summary import router as unit_summary_router

app = FastAPI(title="CAPF Welfare Triage API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(checkins_router)
app.include_router(alerts_router)
app.include_router(unit_summary_router)
app.include_router(auth_router)


@app.get("/health")
def health_check() -> dict[str, str]:
    """Optional health endpoint for local development."""
    return {"status": "ok"}
