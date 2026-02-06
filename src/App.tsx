import { useState } from 'react';
import DashboardSimple from './DashboardSimple';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Directo al dashboard para probar

  const handleLogout = () => {
    setIsLoggedIn(false);
    console.log('Logout clicked');
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2a3f3f 0%, #1e2f2f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          background: 'rgba(42, 63, 63, 0.6)',
          padding: '48px',
          borderRadius: '20px',
          border: '1px solid rgba(201, 165, 116, 0.3)',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#c9a574', marginBottom: '16px' }}>
            BIGARTIST ROYALTIES
          </h1>
          <p style={{ fontSize: '16px', color: '#AFB3B7', marginBottom: '24px' }}>
            Has cerrado sesión
          </p>
          <button
            onClick={() => setIsLoggedIn(true)}
            style={{
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #c9a574 0%, #b8956a 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Volver a entrar
          </button>
        </div>
      </div>
    );
  }

  return <DashboardSimple onLogout={handleLogout} />;
}
