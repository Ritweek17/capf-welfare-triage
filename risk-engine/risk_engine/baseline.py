"""Personal historical baseline calculations for the risk engine."""

from __future__ import annotations

from dataclasses import dataclass
from statistics import mean, median, pstdev
from typing import Sequence


@dataclass(frozen=True, slots=True)
class BaselineStats:
    """Summary statistics for one person's historical feature values."""

    count: int
    mean: float
    median: float
    standard_deviation: float
    minimum: float
    maximum: float


def calculate_baseline(values: Sequence[float]) -> BaselineStats | None:
    """Return robust summary statistics, or ``None`` when no values exist."""

    if not values:
        return None

    numeric_values = [float(value) for value in values]
    return BaselineStats(
        count=len(numeric_values),
        mean=mean(numeric_values),
        median=median(numeric_values),
        standard_deviation=pstdev(numeric_values) if len(numeric_values) > 1 else 0.0,
        minimum=min(numeric_values),
        maximum=max(numeric_values),
    )


def standardized_deviation(value: float, baseline: BaselineStats) -> float:
    """Return a safe z-score-like deviation from a personal baseline.

    A zero-variance baseline cannot produce a conventional z-score. In that case
    the function uses a conservative relative deviation and caps the result so a
    single unusual value cannot dominate the entire composite score.
    """

    if baseline.standard_deviation > 1e-9:
        return (value - baseline.mean) / baseline.standard_deviation

    distance = abs(value - baseline.mean)
    scale = max(abs(baseline.mean) * 0.1, 1.0)
    return min(4.0, distance / scale)


def split_baseline_and_current(
    values: Sequence[tuple[object, float]],
    current_start: object,
) -> tuple[list[float], list[float]]:
    """Split dated values into historical and current windows.

    If no historical values exist, the first half of the available observations
    becomes the baseline so sufficient-history inputs remain scoreable.
    """

    historical = [value for record_date, value in values if record_date < current_start]
    current = [value for record_date, value in values if record_date >= current_start]
    if historical or len(values) < 2:
        return historical, current

    midpoint = max(1, len(values) // 2)
    return [value for _, value in values[:midpoint]], [
        value for _, value in values[midpoint:]
    ]
