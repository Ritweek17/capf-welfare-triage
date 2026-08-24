"""Synchronous bridge from backend history queries to the risk engine."""

from __future__ import annotations

import json

from risk_engine.scoring import RiskFactor, RiskResult, compute_risk

from app.db import get_latest_risk_result, get_person_history, store_risk_result


def recompute_person_risk(
    person_id: str,
    *,
    force: bool = True,
) -> tuple[str, RiskResult]:
    """Compute and persist a result, reusing it for read-only refreshes."""

    if not force:
        latest = get_latest_risk_result(person_id)
        if latest is not None:
            return latest["id"], _risk_result_from_row(latest)

    result = compute_risk(get_person_history(person_id))
    result_id = store_risk_result(person_id, result)
    return result_id, result


def _risk_result_from_row(row: object) -> RiskResult:
    """Convert a stored SQLite result back to the engine result type."""

    factors = json.loads(row["factors"] or "[]")
    return RiskResult(
        status=row["status"],
        score=float(row["score"]) if row["score"] is not None else None,
        display_score=(
            min(100, round(float(row["score"]) * 25))
            if row["score"] is not None
            else None
        ),
        flagged=bool(row["flagged"]),
        factors=[RiskFactor(**factor) for factor in factors],
        suggested_tier=row["suggested_tier"],
    )
