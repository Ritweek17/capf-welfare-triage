"""Personnel check-in route definitions."""

from fastapi import APIRouter, Depends

from app.auth import require_roles
from app.db import insert_checkin
from app.risk_bridge import recompute_person_risk
from app.schemas import AuthenticatedUser, CheckInRequest, CheckInResponse


router = APIRouter()


@router.post("/checkins", response_model=CheckInResponse)
def submit_checkin(
    request: CheckInRequest,
    user: AuthenticatedUser = Depends(require_roles("personnel")),
) -> CheckInResponse:
    """Save a voluntary check-in and synchronously recompute personal risk."""

    checkin_id, timestamp = insert_checkin(user.person_id, request.dict())
    recompute_person_risk(user.person_id)
    return CheckInResponse(
        status="received",
        checkin_id=checkin_id,
        timestamp=timestamp,
    )
