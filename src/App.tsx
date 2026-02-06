import { useState, useEffect } from 'react';
import LoginPanel from './components/LoginPanel';
import DashboardSimple from './DashboardSimple';
import ArtistPortal from './components/ArtistPortal';
import { DataProvider, useData } from './components/DataContext';

// Componente interno para manejar la vista según el tipo de usuario
function AuthenticatedApp({ onLogout }: { onLogout: () => void }) {
  const { artists, tracks } = useData();
  const [userType, setUserType] = useState<'admin' | 'artist' | null>(null);
  const [artistData, setArtistData] = useState<any>(null);

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
            
            // Buscar los datos del artista por email
            const artist = artists.find(a => a.email === user.email);
            if (artist) {
              const artistTracks = tracks.filter(t => t.artistId === artist.id);
              
              // Calcular platform breakdown para el artista
              const platformBreakdown: { [key: string]: number } = {};
              artistTracks.forEach(track => {
                track.platforms.forEach(platform => {
                  if (!platformBreakdown[platform]) {
                    platformBreakdown[platform] = 0;
                  }
                  platformBreakdown[platform] += track.totalRevenue / track.platforms.length;
                });
              });
              
              setArtistData({
                id: artist.id,
                name: artist.name,
                email: artist.email,
                photo: artist.photo,
                totalRevenue: artist.totalRevenue,
                totalStreams: artist.totalStreams,
                tracks: artistTracks,
                monthlyData: [], // Esto vendría del backend en producción
                platformBreakdown
              });
            }
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
  }, [artists, tracks]);

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

  // Si es artista, mostrar ArtistPortal
  if (userType === 'artist') {
    return <ArtistPortal onLogout={onLogout} artistData={artistData} />;
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