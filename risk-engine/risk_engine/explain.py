"""Explainable contributing-factor formatting for welfare-support signals."""

from __future__ import annotations


def format_percentage_deviation(current: float, baseline: float) -> str:
    """Format a current value relative to its personal baseline."""

    if abs(baseline) <= 1e-9:
        if abs(current) <= 1e-9:
            percentage = 0.0
        else:
            return "increased from zero personal baseline"
    else:
        percentage = ((current - baseline) / abs(baseline)) * 100

    sign = "+" if percentage >= 0 else ""
    return f"{sign}{percentage:.0f}% vs personal baseline"


def format_unit_deviation(current: float, baseline: float, unit: str) -> str:
    """Format an absolute deviation with a human-readable unit."""

    difference = current - baseline
    sign = "+" if difference >= 0 else ""
    return f"{sign}{difference:.1f} {unit} vs personal baseline"


def format_gap_deviation(gap_days: int) -> str:
    """Explain a persistent check-in gap without calling it negative wellness."""

    return f"{gap_days} days since last voluntary check-in"
