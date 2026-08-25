/* Command Calm: light civic-service workspace, navy rail, precise cobalt action states, human-review framing. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import PersonnelDashboard from "./pages/PersonnelDashboard";

function Router() {
  return (
    <Switch>
      <Route path="/welfare/personnel" component={PersonnelDashboard} />
      <Route path="/welfare" component={Home} />
      <Route path="/welfare/" component={Home} />
      <Route component={Home} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
