"""Reusable RBAC dependency exports for protected backend routes."""

from app.auth import require_roles, require_same_unit, require_self

__all__ = ["require_roles", "require_same_unit", "require_self"]
