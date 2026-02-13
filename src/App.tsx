import { useState, useEffect } from 'react';
import { DataProvider, useData } from './components/DataContext';
import LoginPanel from './components/LoginPanel';
import DashboardComplete from './components/DashboardComplete';
import ArtistPortal from './components/ArtistPortal';
import { Toaster } from './components/Toaster';
import { toast } from 'sonner@2.0.3';

// Componente principal con Provider
function MainApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'admin' | 'artist'>('admin');
  const { loadData, artists, tracks } = useData();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userString = localStorage.getItem('user');
    
    if (token && userString) {
      setIsLoggedIn(true);
      loadData();
      
      try {
        const user = JSON.parse(userString);
        // Detectar si es admin o artista
        if (user.email === 'admin@bigartist.es') {
          setUserType('admin');
        } else {
          setUserType('artist');
        }
      } catch (error) {
        console.error('Error parsing user:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    toast.success('Sesión cerrada correctamente');
  };

  if (!isLoggedIn) {
    return <LoginPanel onLoginSuccess={() => { 
      setIsLoggedIn(true); 
      loadData();
      
      // Detectar tipo de usuario al hacer login
      const userString = localStorage.getItem('user');
      if (userString) {
        try {
          const user = JSON.parse(userString);
          if (user.email === 'admin@bigartist.es') {
            setUserType('admin');
          } else {
            setUserType('artist');
          }
        } catch (error) {
          console.error('Error parsing user:', error);
        }
      }
    }} />;
  }

  // Si es artista, mostrar ArtistPortal
  if (userType === 'artist') {
    const userString = localStorage.getItem('user');
    let artistData = null;
    
    if (userString) {
      try {
        const user = JSON.parse(userString);
        // Buscar los datos del artista
        const artist = artists.find(a => a.email === user.email || a.name === user.name);
        
        if (artist) {
          // Filtrar tracks del artista
          const artistTracks = tracks.filter(track => track.artistName === artist.name);
          
          // Calcular datos mensuales (mock data por ahora)
          const monthlyData = [
            { month: 'Ene', revenue: 4500, streams: 120000 },
            { month: 'Feb', revenue: 5200, streams: 145000 },
            { month: 'Mar', revenue: 4800, streams: 132000 },
            { month: 'Abr', revenue: 6100, streams: 168000 },
            { month: 'May', revenue: 5800, streams: 159000 },
            { month: 'Jun', revenue: 6700, streams: 182000 },
          ];
          
          // Calcular platform breakdown
          const platformBreakdown: { [key: string]: number } = {};
          artistTracks.forEach(track => {
            track.platforms?.forEach((platform: string) => {
              if (!platformBreakdown[platform]) {
                platformBreakdown[platform] = 0;
              }
              platformBreakdown[platform] += track.totalRevenue || 0;
            });
          });
          
          artistData = {
            id: artist.id,
            name: artist.name,
            email: artist.email || user.email,
            photo: artist.photo,
            totalRevenue: artist.totalRevenue,
            totalStreams: artist.totalStreams,
            tracks: artistTracks,
            monthlyData,
            platformBreakdown
          };
        }
      } catch (error) {
        console.error('Error loading artist data:', error);
      }
    }
    
    return (
      <>
        <Toaster />
        <ArtistPortal onLogout={handleLogout} artistData={artistData || undefined} />
      </>
    );
  }

  // Si es admin, mostrar DashboardComplete
  return (
    <>
      <Toaster />
      <DashboardComplete onLogout={handleLogout} />
    </>
  );
}

// Export con Provider
export default function App() {
  return (
    <DataProvider>
      <MainApp />
    </DataProvider>
  );
}