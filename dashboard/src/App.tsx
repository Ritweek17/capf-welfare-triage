import { useAuth } from "./auth/useAuth";
import LoginPage from "./views/LoginPage";
import CommanderView from "./views/CommanderView";
import WelfareOfficerView from "./views/WelfareOfficerView";
import PersonnelView from "./views/PersonnelView";

export default function App() {
  const { session, isAuthenticated, login, isInitializing } = useAuth();

  if (isInitializing) {
    return null; // Or a loading spinner if preferred
  }

  if (!isAuthenticated || !session) {
    return <LoginPage onLogin={login} />;
  }

  switch (session.role) {
    case "COMMANDER":
      return <CommanderView />;
    case "WELFARE_OFFICER":
      return <WelfareOfficerView />;
    case "PERSONNEL":
      return <PersonnelView />;
    default:
      return <LoginPage onLogin={login} />;
  }
}
