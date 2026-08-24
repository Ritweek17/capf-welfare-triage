import { useState, useEffect } from 'react';
import { LoginView } from './views/LoginView';
import { CommanderDashboard } from './components/commander/CommanderDashboard';

const LOGIN_PAGE_URL =
  import.meta.env.VITE_LOGIN_PAGE_URL || '/?logout=1';

export function App() {
  // Check URL hash or path to determine initial view
  const [currentView, setCurrentView] = useState<'login' | 'commander'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#commander' || window.location.pathname === '/commander') {
        return 'commander';
      }
    }
    return 'commander'; // Default to Commander Dashboard
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#commander' || window.location.pathname === '/commander') {
        setCurrentView('commander');
      } else if (window.location.hash === '#login' || window.location.pathname === '/login') {
        setCurrentView('login');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const returnToLogin = () => {
    window.location.replace(LOGIN_PAGE_URL);
  };

  return (
    <div className="relative min-h-screen">
      {currentView === 'commander' ? (
        <CommanderDashboard onLogout={returnToLogin} />
      ) : (
        <LoginView />
      )}
    </div>
  );
}

export default App;
