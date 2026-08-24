import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import {
  getRouteForRole,
  getSession,
} from "../services/auth.service";

import type {
  UserRole,
} from "../types/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const session = getSession();

  if (!session) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    !allowedRoles.includes(
      session.user.role
    )
  ) {
    return (
      <Navigate
        to={getRouteForRole(
          session.user.role
        )}
        replace
      />
    );
  }

  return <>{children}</>;
}
