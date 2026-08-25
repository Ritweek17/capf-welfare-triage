"""Personal-baseline risk computation and contract-compatible result types."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from typing import Any, Mapping, Sequence

from risk_engine.baseline import (
    calculate_baseline,
    split_baseline_and_current,
    standardized_deviation,
)
from risk_engine.explain import (
    format_gap_deviation,
    format_percentage_deviation,
    format_unit_deviation,
)
from risk_engine.recommendations import suggested_tier


HISTORY_FLOOR_DAYS = 14
DUTY_CYCLE_FLOOR = 3
CURRENT_WINDOW_DAYS = 21
FLAG_THRESHOLD = 2.0


@dataclass(frozen=True, slots=True)
class RiskFactor:
    """One understandable reason contributing to a welfare-support signal."""

    factor: str
    deviation: str

    def to_dict(self) -> dict[str, str]:
        """Return the API contract representation."""

        return {"factor": self.factor, "deviation": self.deviation}


@dataclass(frozen=True, slots=True)
class RiskResult:
    """Risk-engine output matching the documented API contract."""

    status: str
    score: float | None
    display_score: int | None
    flagged: bool
    factors: list[RiskFactor] = field(default_factory=list)
    suggested_tier: str | None = None

    def to_dict(self) -> dict[str, Any]:
        """Serialize the result without adding fields to cold-start responses."""

        result: dict[str, Any] = {
            "status": self.status,
            "score": self.score,
            "display_score": self.display_score,
            "flagged": self.flagged,
            "factors": [factor.to_dict() for factor in self.factors],
        }
        if self.suggested_tier is not None:
            result["suggested_tier"] = self.suggested_tier
        return result


@dataclass(slots=True)
class PersonHistory:
    """Aggregated history accepted by :func:`compute_risk`."""

    person_id: str
    days_of_history: int
    duty_cycles_recorded: int
    leave_records: list[Mapping[str, Any]] = field(default_factory=list)
    duty_records: list[Mapping[str, Any]] = field(default_factory=list)
    checkins: list[Mapping[str, Any]] = field(default_factory=list)
    biometric_consent: bool = False
    biometric_records: list[Mapping[str, Any]] = field(default_factory=list)

    @classmethod
    def from_mapping(cls, history: Mapping[str, Any]) -> "PersonHistory":
        """Build a typed history from the JSON/dict contract shape."""

        consent = bool(history.get("biometric_consent", False))
        return cls(
            person_id=str(history.get("person_id", "")),
            days_of_history=int(history.get("days_of_history", 0)),
            duty_cycles_recorded=int(history.get("duty_cycles_recorded", 0)),
            leave_records=list(history.get("leave_records") or []),
            duty_records=list(history.get("duty_records") or []),
            checkins=list(history.get("checkins") or []),
            biometric_consent=consent,
            biometric_records=list(history.get("biometric_records") or []) if consent else [],
        )


def compute_risk(history: PersonHistory | Mapping[str, Any]) -> RiskResult:
    """Compute an explainable personal-baseline welfare-support signal.

    The function deliberately does not diagnose stress. It compares recent
    workload, leave, deployment, optional wellness, and check-in activity with
    the same person's prior pattern. Missing check-ins are treated as missing
    data; they are only surfaced as a separate activity-gap factor when the gap
    is persistent.
    """

    typed_history = (
        history
        if isinstance(history, PersonHistory)
        else PersonHistory.from_mapping(history)
    )
    if (
        typed_history.days_of_history < HISTORY_FLOOR_DAYS
        or typed_history.duty_cycles_recorded < DUTY_CYCLE_FLOOR
    ):
        return RiskResult(
            status="baseline_building",
            score=None,
            display_score=None,
            flagged=False,
        )

    dated_records = _all_dated_records(typed_history)
    if not dated_records:
        return RiskResult(
            status="scored",
            score=0.0,
            display_score=0,
            flagged=False,
        )

    current_date = max(record_date for record_date, _ in dated_records)
    current_start = current_date - timedelta(days=CURRENT_WINDOW_DAYS - 1)
    signals: list[tuple[str, float, float, str]] = []

    _add_duty_signal(typed_history, current_start, signals)
    _add_leave_signal(typed_history, current_start, signals)
    _add_deployment_signal(typed_history, current_start, signals)
    _add_mood_signal(typed_history, current_start, signals)
    _add_checkin_gap_signal(typed_history, current_date, signals)
    if typed_history.biometric_consent:
        _add_biometric_signal(typed_history, current_start, signals)

    score = _composite_score(signals)
    flagged = score > FLAG_THRESHOLD
    return RiskResult(
        status="scored",
        score=round(score, 3),
        display_score=min(100, round(score * 25)),
        flagged=flagged,
        factors=[
            RiskFactor(factor=name, deviation=deviation)
            for name, signal, _weight, deviation in signals
            if signal >= 1.0
        ],
        suggested_tier=suggested_tier(score),
    )


def _all_dated_records(history: PersonHistory) -> list[tuple[date, Mapping[str, Any]]]:
    """Collect records that can establish the current evaluation date."""

    records: list[tuple[date, Mapping[str, Any]]] = []
    collections = (
        history.leave_records,
        history.duty_records,
        history.checkins,
        history.biometric_records if history.biometric_consent else [],
    )
    for collection in collections:
        for record in collection:
            record_date = _record_date(record)
            if record_date is not None:
                records.append((record_date, record))
    return records


def _record_date(record: Mapping[str, Any]) -> date | None:
    """Parse either a date field or an ISO timestamp field."""

    raw_value = record.get("date") or record.get("timestamp")
    if raw_value is None:
        return None
    if isinstance(raw_value, datetime):
        return raw_value.date()
    if isinstance(raw_value, date):
        return raw_value

    text = str(raw_value)
    try:
        return datetime.fromisoformat(text.replace("Z", "+00:00")).date()
    except ValueError:
        try:
            return date.fromisoformat(text)
        except ValueError:
            return None


def _dated_values(
    records: Sequence[Mapping[str, Any]],
    value_getter: Any,
) -> list[tuple[date, float]]:
    """Extract numeric values with valid dates from record mappings."""

    values: list[tuple[date, float]] = []
    for record in records:
        record_date = _record_date(record)
        value = value_getter(record)
        if record_date is None or value is None:
            continue
        values.append((record_date, float(value)))
    return sorted(values, key=lambda item: item[0])


def _add_duty_signal(
    history: PersonHistory,
    current_start: date,
    signals: list[tuple[str, float, float, str]],
) -> None:
    """Add recent duty-hour escalation to the signal list."""

    values = _dated_values(history.duty_records, lambda record: record.get("hours"))
    baseline_values, current_values = split_baseline_and_current(values, current_start)
    baseline = calculate_baseline(baseline_values)
    current = calculate_baseline(current_values)
    if baseline is None or current is None:
        return
    signal = max(0.0, standardized_deviation(current.mean, baseline))
    if signal >= 1.0:
        signals.append(
            (
                "duty_hours",
                min(4.0, signal),
                0.45,
                format_percentage_deviation(current.mean, baseline.mean),
            )
        )


def _add_leave_signal(
    history: PersonHistory,
    current_start: date,
    signals: list[tuple[str, float, float, str]],
) -> None:
    """Add a sustained reduction in leave activity."""

    values = _dated_values(
        history.leave_records,
        lambda record: 0.0
        if record.get("type") == "none_taken_this_period"
        else 1.0,
    )
    baseline_values, current_values = split_baseline_and_current(values, current_start)
    baseline = calculate_baseline(baseline_values)
    current = calculate_baseline(current_values)
    if baseline is None or current is None or current.mean >= baseline.mean:
        return
    signal = max(0.0, standardized_deviation(current.mean, baseline))
    if signal >= 1.0:
        signals.append(
            (
                "leave_frequency",
                min(4.0, signal),
                0.15,
                format_percentage_deviation(current.mean, baseline.mean),
            )
        )


def _add_deployment_signal(
    history: PersonHistory,
    current_start: date,
    signals: list[tuple[str, float, float, str]],
) -> None:
    """Add a sustained increase in deployment intensity."""

    intensity = {"routine": 0.0, "training": 1.0, "high_stress_posting": 2.0}
    values = _dated_values(
        history.duty_records,
        lambda record: intensity.get(str(record.get("deployment_type")), 0.0),
    )
    baseline_values, current_values = split_baseline_and_current(values, current_start)
    baseline = calculate_baseline(baseline_values)
    current = calculate_baseline(current_values)
    if baseline is None or current is None or current.mean <= baseline.mean:
        return
    signal = max(0.0, standardized_deviation(current.mean, baseline))
    if signal >= 1.0:
        signals.append(
            (
                "deployment_pressure",
                min(4.0, signal),
                0.15,
                format_unit_deviation(current.mean, baseline.mean, "intensity"),
            )
        )


def _add_mood_signal(
    history: PersonHistory,
    current_start: date,
    signals: list[tuple[str, float, float, str]],
) -> None:
    """Add a decline in voluntary mood scores when recent data exists."""

    values = _dated_values(history.checkins, lambda record: record.get("mood_score"))
    baseline_values, current_values = split_baseline_and_current(values, current_start)
    baseline = calculate_baseline(baseline_values)
    current = calculate_baseline(current_values)
    if baseline is None or current is None or current.mean >= baseline.mean:
        return
    signal = max(0.0, -standardized_deviation(current.mean, baseline))
    if signal >= 1.0:
        signals.append(
            (
                "mood_score",
                min(4.0, signal),
                0.10,
                format_unit_deviation(current.mean, baseline.mean, "mood points"),
            )
        )


def _add_checkin_gap_signal(
    history: PersonHistory,
    current_date: date,
    signals: list[tuple[str, float, float, str]],
) -> None:
    """Surface a persistent check-in activity gap without labeling wellness."""

    checkin_dates = [
        record_date
        for record in history.checkins
        if (record_date := _record_date(record)) is not None
    ]
    if not checkin_dates:
        return
    gap_days = (current_date - max(checkin_dates)).days
    if gap_days < 14:
        return
    signal = min(4.0, max(1.0, (gap_days - 7) / 7))
    signals.append(
        (
            "checkin_gap_days",
            signal,
            0.15,
            format_gap_deviation(gap_days),
        )
    )


def _add_biometric_signal(
    history: PersonHistory,
    current_start: date,
    signals: list[tuple[str, float, float, str]],
) -> None:
    """Use simulated biometric fields only when explicit consent is true."""

    values = _dated_values(
        history.biometric_records,
        lambda record: record.get("resting_hr"),
    )
    baseline_values, current_values = split_baseline_and_current(values, current_start)
    baseline = calculate_baseline(baseline_values)
    current = calculate_baseline(current_values)
    if baseline is None or current is None or current.mean <= baseline.mean:
        return
    signal = max(0.0, standardized_deviation(current.mean, baseline))
    if signal >= 1.0:
        signals.append(
            (
                "resting_heart_rate",
                min(4.0, signal),
                0.10,
                format_unit_deviation(current.mean, baseline.mean, "bpm"),
            )
        )


def _composite_score(signals: Sequence[tuple[str, float, float, str]]) -> float:
    """Combine available adverse signals with normalized transparent weights."""

    if not signals:
        return 0.0
    total_weight = sum(weight for _, _signal, weight, _deviation in signals)
    if total_weight <= 0:
        return 0.0
    return sum(signal * weight for _, signal, weight, _deviation in signals) / total_weight
