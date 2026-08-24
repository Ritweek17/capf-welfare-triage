"""Transparent welfare-support tier recommendations."""

from __future__ import annotations


def suggested_tier(score: float) -> str | None:
    """Map a composite deviation to a non-diagnostic support action."""

    if score < 2.0:
        return None
    if score < 3.0:
        return "informal_checkin"
    if score < 4.0:
        return "structured_conversation"
    return "referral"
