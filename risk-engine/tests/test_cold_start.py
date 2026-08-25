"""Cold-start behavior tests for the risk engine."""

import unittest

from risk_engine.scoring import compute_risk


class ColdStartTests(unittest.TestCase):
    """Verify that insufficient history never receives an approximate score."""

    def test_short_history_returns_baseline_building(self) -> None:
        result = compute_risk(
            {
                "person_id": "p_short",
                "days_of_history": 13,
                "duty_cycles_recorded": 10,
            }
        )

        self.assertEqual(result.status, "baseline_building")
        self.assertIsNone(result.score)
        self.assertIsNone(result.display_score)
        self.assertFalse(result.flagged)
        self.assertEqual(result.to_dict()["factors"], [])

    def test_fewer_than_three_duty_cycles_returns_baseline_building(self) -> None:
        result = compute_risk(
            {
                "person_id": "p_sparse",
                "days_of_history": 30,
                "duty_cycles_recorded": 2,
            }
        )

        self.assertEqual(result.status, "baseline_building")
        self.assertIsNone(result.score)


if __name__ == "__main__":
    unittest.main()
