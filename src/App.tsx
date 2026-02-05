import { useState } from 'react';
import LoginPanel from './components/LoginPanel';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LoginPanel onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#2a3f3f',
      color: 'white',
      fontFamily: 'system-ui'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', padding: '40px' }}>
        <h1 style={{ 
          fontSize: '48px', 
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #c9a574 0%, #d4b589 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '2px'
        }}>
          ✅ LOGIN EXITOSO
        </h1>
        <p style={{ 
          color: '#c9a574', 
          marginBottom: '32px',
          fontSize: '18px',
          lineHeight: '1.6'
        }}>
          Has iniciado sesión correctamente. El sistema está listo para el rediseño completo.
        </p>
        <div style={{
          backgroundColor: 'rgba(201, 165, 116, 0.1)',
          border: '2px solid rgba(201, 165, 116, 0.3)',
          borderRadius: '12px',
          padding: '24px',
          marginTop: '32px'
        }}>
          <p style={{ 
            color: '#AFB3B7', 
            fontSize: '14px',
            lineHeight: '1.8'
          }}>
            Todos los archivos antiguos han sido eliminados. <br />
            Solo se mantienen:<br />
            <strong style={{ color: '#c9a574' }}>LoginPanel.tsx</strong> y archivos esenciales del sistema.
          </p>
        </div>
        <button
          onClick={() => setIsLoggedIn(false)}
          style={{
            marginTop: '32px',
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #c9a574 0%, #d4b589 100%)',
            border: 'none',
            borderRadius: '10px',
            color: '#0D1F23',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '15px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 165, 116, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 165, 116, 0.3)';
          }}
        >
          Volver al Login
        </button>
      </div>
    </div>
  );
}
