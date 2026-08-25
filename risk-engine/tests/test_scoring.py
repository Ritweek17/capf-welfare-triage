"""Scoring, explainability, and consent-gating tests."""

import unittest
from datetime import date, timedelta

from risk_engine.scoring import compute_risk


def build_history(
    *,
    duty_hours: list[int],
    checkin_gap: bool = False,
    biometric_consent: bool = False,
) -> dict:
    """Create a deterministic history for unit tests."""

    start = date(2026, 1, 1)
    duty_records = [
        {
            "date": (start + timedelta(days=index)).isoformat(),
            "hours": hours,
            "deployment_type": "routine",
        }
        for index, hours in enumerate(duty_hours)
    ]
    checkin_offset = len(duty_hours) - (22 if checkin_gap else 2)
    checkin_date = start + timedelta(days=checkin_offset)
    checkins = [
        {
            "timestamp": f"{checkin_date.isoformat()}T12:00:00Z",
            "mood_score": 4,
        }
    ]
    biometric_records = [
        {"date": (start + timedelta(days=index)).isoformat(), "resting_hr": 70}
        for index in range(len(duty_hours))
    ]
    return {
        "person_id": "p_test",
        "days_of_history": len(duty_hours),
        "duty_cycles_recorded": len(duty_hours),
        "duty_records": duty_records,
        "checkins": checkins,
        "biometric_consent": biometric_consent,
        "biometric_records": biometric_records,
    }


class ScoringTests(unittest.TestCase):
    """Verify explainable deviation behavior."""

    def test_stable_history_is_not_flagged(self) -> None:
        result = compute_risk(build_history(duty_hours=[8] * 60))

        self.assertEqual(result.status, "scored")
        self.assertFalse(result.flagged)
        self.assertEqual(result.factors, [])

    def test_persistent_workload_deviation_is_explained(self) -> None:
        result = compute_risk(build_history(duty_hours=[8] * 39 + [15] * 21))

        self.assertTrue(result.flagged)
        self.assertGreater(result.score or 0, 2.0)
        self.assertTrue(any(factor.factor == "duty_hours" for factor in result.factors))
        self.assertIsNotNone(result.suggested_tier)

    def test_checkin_gap_is_separate_from_mood(self) -> None:
        result = compute_risk(
            build_history(duty_hours=[8] * 60, checkin_gap=True)
        )

        self.assertFalse(result.flagged)
        self.assertTrue(
            any(factor.factor == "checkin_gap_days" for factor in result.factors)
        )

    def test_biometrics_are_ignored_without_consent(self) -> None:
        history = build_history(
            duty_hours=[8] * 60,
            biometric_consent=False,
        )
        history["biometric_records"] = [
            {"date": "2026-03-01", "resting_hr": 140},
        ]

        result = compute_risk(history)

        self.assertFalse(
            any(factor.factor == "resting_heart_rate" for factor in result.factors)
        )


if __name__ == "__main__":
    unittest.main()
