"""RBAC helper tests for the backend authorization boundary."""

import unittest

from fastapi import HTTPException

from app.auth import require_roles, require_same_unit, require_self
from app.schemas import AuthenticatedUser


class RBACTests(unittest.TestCase):
    """Verify role, unit, and self-access checks."""

    def setUp(self) -> None:
        self.personnel = AuthenticatedUser(
            person_id="p_00013",
            role="personnel",
            unit="1st Company",
        )
        self.welfare_officer = AuthenticatedUser(
            person_id="wel_1st",
            role="welfare_officer",
            unit="1st Company",
        )
        self.commander = AuthenticatedUser(
            person_id="cmd_1st",
            role="commander",
            unit="1st Company",
        )

    def test_role_dependency_allows_authorized_role(self) -> None:
        checker = require_roles("welfare_officer")
        self.assertIs(checker(self.welfare_officer), self.welfare_officer)

    def test_role_dependency_rejects_wrong_role(self) -> None:
        checker = require_roles("commander")
        with self.assertRaises(HTTPException) as raised:
            checker(self.personnel)
        self.assertEqual(raised.exception.status_code, 403)

    def test_personnel_can_only_access_self(self) -> None:
        require_self(self.personnel, "p_00013")
        with self.assertRaises(HTTPException) as raised:
            require_self(self.personnel, "p_00014")
        self.assertEqual(raised.exception.status_code, 403)

    def test_welfare_officer_can_review_individual(self) -> None:
        require_self(self.welfare_officer, "p_00014")

    def test_unit_boundary_is_enforced(self) -> None:
        require_same_unit(self.welfare_officer, "1st Company")
        with self.assertRaises(HTTPException) as raised:
            require_same_unit(self.welfare_officer, "2nd Company")
        self.assertEqual(raised.exception.status_code, 403)


if __name__ == "__main__":
    unittest.main()
