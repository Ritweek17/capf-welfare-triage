import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPlaceholder from "./pages/DashboardPlaceholder";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>

      {/* Root redirects to login */}
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      {/* Public Login Route */}
      <Route
        path="/login"
        element={<LoginPage />}
      />

      {/* =========================
          COMMANDER ROUTE
      ========================= */}

      <Route
        path="/commander"
        element={
          <ProtectedRoute
            allowedRoles={[
              "COMMANDER",
            ]}
          >
            <DashboardPlaceholder
              title="Commander Dashboard"
            />
          </ProtectedRoute>
        }
      />

      {/* =========================
          WELFARE OFFICER ROUTE
      ========================= */}

      <Route
        path="/welfare"
        element={
          <ProtectedRoute
            allowedRoles={[
              "WELFARE_OFFICER",
            ]}
          >
            <DashboardPlaceholder
              title="Welfare Officer Dashboard"
            />
          </ProtectedRoute>
        }
      />

      {/* =========================
          PERSONNEL ROUTE
      ========================= */}

      <Route
        path="/personnel"
        element={
          <ProtectedRoute
            allowedRoles={[
              "PERSONNEL",
            ]}
          >
            <DashboardPlaceholder
              title="Personnel Dashboard"
            />
          </ProtectedRoute>
        }
      />

      {/* Unknown routes */}
      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
}
