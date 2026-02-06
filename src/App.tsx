import { useState, useEffect } from 'react';
import LoginPanel from './components/LoginPanel';
import DashboardSimple from './DashboardSimple';
import { DataProvider, useData } from './components/DataContext';

// Componente interno para manejar la vista según el tipo de usuario
function AuthenticatedApp({ onLogout }: { onLogout: () => void }) {
  const { artists, tracks } = useData();
  const [userType, setUserType] = useState<'admin' | 'artist' | null>(null);

  useEffect(() => {
    // Obtener datos del usuario desde localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        
        // Si el email termina en @bigartist.es y NO es admin@bigartist.es, es un artista
        if (user.email && user.email.includes('@bigartist.es')) {
          if (user.email === 'admin@bigartist.es') {
            setUserType('admin');
          } else {
            setUserType('artist');
          }
        } else {
          // Por defecto, cualquier otro email es admin
          setUserType('admin');
        }
      } catch (error) {
        console.error('Error parsing user:', error);
        setUserType('admin');
      }
    }
  }, [artists]);

  // Mientras se carga, mostrar loading
  if (!userType) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f1616 0%, #1a2626 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#c9a574',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        Cargando...
      </div>
    );
  }

  // Si es artista, mostrar mensaje temporal
  if (userType === 'artist') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f1616 0%, #1a2626 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px',
        color: '#ffffff',
        padding: '40px'
      }}>
        <div style={{ fontSize: '24px', fontWeight: '700', color: '#c9a574' }}>
          Portal de Artista
        </div>
        <div style={{ fontSize: '16px', color: '#AFB3B7' }}>
          En construcción...
        </div>
        <button
          onClick={onLogout}
          style={{
            padding: '12px 24px',
            background: '#c9a574',
            border: 'none',
            borderRadius: '10px',
            color: '#0D1F23',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  // Si es admin, mostrar dashboard completo
  return <DashboardSimple onLogout={onLogout} />;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  // Mostrar loading mientras se verifica
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f1616 0%, #1a2626 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#c9a574',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        Cargando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPanel onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <DataProvider>
      <AuthenticatedApp onLogout={handleLogout} />
    </DataProvider>
  );
}