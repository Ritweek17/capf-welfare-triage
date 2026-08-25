"""Commander aggregate unit-summary route definitions."""

from fastapi import APIRouter, Depends

from app.auth import require_roles
from app.db import get_unit_summary
from app.schemas import AuthenticatedUser, UnitSummaryResponse


router = APIRouter()


@router.get("/unit-summary", response_model=UnitSummaryResponse)
def unit_summary(
    user: AuthenticatedUser = Depends(require_roles("commander")),
) -> UnitSummaryResponse:
    """Return aggregate-only unit trends for a Commander."""

    return UnitSummaryResponse(**get_unit_summary(user.unit))
