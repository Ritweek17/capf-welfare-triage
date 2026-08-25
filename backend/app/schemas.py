"""Pydantic request and response schemas for the backend API."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    """Credentials for a seeded demo account."""

    service_id: str
    password: str


class LoginResponse(BaseModel):
    """Documented login response shared with the frontend."""

    access_token: str
    role: str
    person_id: str


class AuthenticatedUser(BaseModel):
    """Verified identity resolved from a JWT and the database."""

    person_id: str
    role: str
    unit: str


class CheckInRequest(BaseModel):
    """Voluntary Personnel wellness check-in payload."""

    mood_score: int = Field(ge=1, le=5)
    note: str | None = None
    structured_responses: dict[str, int] | None = None


class CheckInResponse(BaseModel):
    """Minimal receipt response; it intentionally contains no risk fields."""

    status: str
    checkin_id: str
    timestamp: str


class AlertFactor(BaseModel):
    """One explainable contributing factor."""

    factor: str
    deviation: str


class AlertItem(BaseModel):
    """Individual alert visible only to an authorized Welfare Officer."""

    alert_id: str
    person_id: str
    flagged_at: str
    score: float
    display_score: int
    factors: list[AlertFactor]
    suggested_tier: str | None = None
    status: str


class AlertsResponse(BaseModel):
    """Welfare Officer alert queue response."""

    alerts: list[AlertItem]


class InterventionLogRequest(BaseModel):
    """Outcome recorded by a Welfare Officer after reviewing an alert."""

    action_taken: str
    notes: str | None = None
    status: Literal["reviewed", "follow_up_scheduled", "closed"] = "reviewed"
    follow_up_date: str | None = None


class InterventionLogResponse(BaseModel):
    """Receipt for a recorded intervention."""

    status: str
    alert_id: str


class UnitTrendPoint(BaseModel):
    """Aggregate-only daily unit trend point."""

    date: str
    avg_risk_indicator: float
    checkin_participation_rate: float


class UnitSummaryResponse(BaseModel):
    """Commander-facing aggregate response with no individual identifiers."""

    unit: str
    trend_30d: list[UnitTrendPoint]
    open_alert_count: int
    personnel_count: int
