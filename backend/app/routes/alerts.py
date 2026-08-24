"""Welfare Officer alert and intervention route definitions."""

from __future__ import annotations

import json

from fastapi import APIRouter, Depends, HTTPException, status

from app.auth import require_roles
from app.db import (
    get_alert,
    get_person_identity,
    get_personnel_ids,
    list_open_alerts,
    log_intervention,
    record_access,
)
from app.risk_bridge import recompute_person_risk
from app.schemas import (
    AlertFactor,
    AlertItem,
    AlertsResponse,
    AuthenticatedUser,
    InterventionLogRequest,
    InterventionLogResponse,
)


router = APIRouter()


@router.get("/alerts", response_model=AlertsResponse)
def get_alerts(
    user: AuthenticatedUser = Depends(require_roles("welfare_officer")),
) -> AlertsResponse:
    """Refresh authorized unit risk and return explainable flagged cases."""

    for person_id in get_personnel_ids(user.unit):
        recompute_person_risk(person_id, force=False)

    rows = list_open_alerts()
    alerts: list[AlertItem] = []
    for row in rows:
        target = get_person_identity(row["person_id"])
        if target is None or target["unit"] != user.unit:
            continue
        factors = json.loads(row["factors"] or "[]")
        record_access(user.person_id, row["person_id"], "viewed welfare alert queue")
        score = float(row["score"] or 0.0)
        alerts.append(
            AlertItem(
                alert_id=row["id"],
                person_id=row["person_id"],
                flagged_at=row["computed_at"],
                score=score,
                display_score=min(100, round(score * 25)),
                factors=[AlertFactor(**factor) for factor in factors],
                suggested_tier=row["suggested_tier"],
                status=row["alert_status"],
            )
        )
    return AlertsResponse(alerts=alerts)


@router.post(
    "/alerts/{alert_id}/log",
    response_model=InterventionLogResponse,
)
def log_alert_intervention(
    alert_id: str,
    request: InterventionLogRequest,
    user: AuthenticatedUser = Depends(require_roles("welfare_officer")),
) -> InterventionLogResponse:
    """Record an intervention only for an alert in the officer's unit."""

    alert = get_alert(alert_id)
    if alert is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found",
        )
    target = get_person_identity(alert["person_id"])
    if target is None or target["unit"] != user.unit:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to own unit",
        )
    log_intervention(
        alert_id,
        user.person_id,
        request.action_taken,
        request.notes,
        request.status,
        request.follow_up_date,
    )
    return InterventionLogResponse(status="logged", alert_id=alert_id)
