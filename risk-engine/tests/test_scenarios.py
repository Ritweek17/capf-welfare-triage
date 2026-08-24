"""Deterministic demo scenarios for the welfare-support prototype."""

import unittest
from datetime import date, timedelta

from risk_engine.scoring import compute_risk


def scenario_history(
    *,
    duty_hours: list[int],
    deployment_types: list[str] | None = None,
    checkin_dates: list[int] | None = None,
    mood_scores: list[int] | None = None,
) -> dict:
    """Build a dated, synthetic 60-day scenario history."""

    start = date(2026, 1, 1)
    deployment_types = deployment_types or ["routine"] * len(duty_hours)
    checkin_dates = checkin_dates or list(range(6, len(duty_hours), 7))
    mood_scores = mood_scores or [4] * len(checkin_dates)
    return {
        "person_id": "scenario_person",
        "days_of_history": len(duty_hours),
        "duty_cycles_recorded": len(duty_hours),
        "duty_records": [
            {
                "date": (start + timedelta(days=index)).isoformat(),
                "hours": hours,
                "deployment_type": deployment_types[index],
            }
            for index, hours in enumerate(duty_hours)
        ],
        "checkins": [
            {
                "timestamp": f"{(start + timedelta(days=index)).isoformat()}T12:00:00Z",
                "mood_score": mood_scores[position],
            }
            for position, index in enumerate(checkin_dates)
        ],
    }


class ScenarioTests(unittest.TestCase):
    """Verify the five non-clinical demo stories used for rehearsal."""

    def test_stable_baseline_is_not_flagged(self) -> None:
        result = compute_risk(scenario_history(duty_hours=[8] * 60))

        self.assertFalse(result.flagged)
        self.assertEqual(result.factors, [])

    def test_workload_escalation_is_flagged_and_explained(self) -> None:
        result = compute_risk(scenario_history(duty_hours=[8] * 39 + [15] * 21))

        self.assertTrue(result.flagged)
        self.assertIn("duty_hours", {factor.factor for factor in result.factors})

    def test_deployment_pressure_with_recovery_gap_is_flagged(self) -> None:
        result = compute_risk(
            scenario_history(
                duty_hours=[8] * 60,
                deployment_types=["routine"] * 39 + ["high_stress_posting"] * 21,
                checkin_dates=[6, 13, 20, 27, 34],
            )
        )

        self.assertTrue(result.flagged)
        factors = {factor.factor for factor in result.factors}
        self.assertIn("deployment_pressure", factors)
        self.assertIn("checkin_gap_days", factors)

    def test_wellness_decline_is_flagged_without_diagnosis(self) -> None:
        result = compute_risk(
            scenario_history(
                duty_hours=[8] * 60,
                checkin_dates=[6, 13, 20, 27, 34, 41, 48, 55],
                mood_scores=[4, 4, 4, 4, 5, 1, 1, 1],
            )
        )

        self.assertTrue(result.flagged)
        self.assertIn("mood_score", {factor.factor for factor in result.factors})

    def test_false_positive_protection_keeps_normal_variation_unflagged(self) -> None:
        result = compute_risk(
            scenario_history(duty_hours=[8, 9, 8, 7, 9, 8] * 10)
        )

        self.assertFalse(result.flagged)
        self.assertLess(result.score or 0.0, 2.0)


if __name__ == "__main__":
    unittest.main()
