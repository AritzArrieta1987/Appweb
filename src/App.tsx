import { useState } from 'react';
import LoginPanel from './components/LoginPanel';
import DashboardSimple from './DashboardSimple';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('user');
  };

  if (!isLoggedIn) {
    return <LoginPanel onLoginSuccess={handleLoginSuccess} />;
  }

  return <DashboardSimple onLogout={handleLogout} />;
}