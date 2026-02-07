import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as api from '../config/api';

export interface Artist {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  photo?: string;
  totalRevenue: number;
  totalStreams: number;
  trackCount?: number;
}

export interface Track {
  id: number;
  title: string;
  artistName: string;
  artistId: number;
  isrc?: string;
  upc?: string;
  totalRevenue: number;
  totalStreams: number;
  platforms: string[];
  audioUrl?: string;
}

export interface DashboardData {
  totalRevenue: number;
  totalStreams: number;
  artistCount: number;
  trackCount: number;
  platformBreakdown: { [key: string]: number };
  monthlyData: { month: string; revenue: number; streams: number }[];
}

interface DataContextType {
  artists: Artist[];
  tracks: Track[];
  dashboardData: DashboardData;
  loading: boolean;
  error: string | null;
  loadData: () => Promise<void>;
  clearAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalRevenue: 0,
    totalStreams: 0,
    artistCount: 0,
    trackCount: 0,
    platformBreakdown: {},
    monthlyData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos desde la API al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo desde la API con timeout
      const timeout = (ms: number) => new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), ms)
      );

      const [artistsData, tracksData, dashboardStats] = await Promise.race([
        Promise.all([
          api.getArtists(),
          api.getTracks(),
          api.getDashboardStats()
        ]),
        timeout(10000) // 10 segundos de timeout
      ]) as [any[], any[], any];

      // Transformar datos de API al formato del frontend
      const transformedArtists: Artist[] = artistsData.map(artist => ({
        id: artist.id,
        name: artist.name,
        email: artist.email,
        phone: artist.phone,
        photo: artist.photo_url,
        totalRevenue: artist.total_revenue,
        totalStreams: artist.total_streams,
        trackCount: artist.track_count
      }));

      const transformedTracks: Track[] = tracksData.map(track => ({
        id: track.id,
        title: track.title,
        artistName: track.artist_name,
        artistId: track.artist_id,
        isrc: track.isrc,
        upc: track.upc,
        totalRevenue: track.total_revenue,
        totalStreams: track.total_streams,
        platforms: track.platforms || [],
        audioUrl: track.audio_url
      }));

      setArtists(transformedArtists);
      setTracks(transformedTracks);
      setDashboardData(dashboardStats);
      
    } catch (error: any) {
      // Sin conexión a la API, añadir datos de prueba
      setArtists([
        {
          id: 1,
          name: 'Artista Demo',
          email: 'demo@bigartist.es',
          phone: '+34 600 000 000',
          photo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
          totalRevenue: 15420.50,
          totalStreams: 234567,
          trackCount: 12
        }
      ]);
      
      setTracks([
        {
          id: 1,
          title: 'Midnight Dreams',
          artistName: 'Artista Demo',
          artistId: 1,
          isrc: 'USRC12345678',
          upc: '123456789012',
          totalRevenue: 3250.75,
          totalStreams: 45678,
          platforms: ['Spotify', 'Apple Music', 'YouTube'],
          audioUrl: ''
        },
        {
          id: 2,
          title: 'Summer Vibes',
          artistName: 'Artista Demo',
          artistId: 1,
          isrc: 'USRC87654321',
          upc: '210987654321',
          totalRevenue: 4120.30,
          totalStreams: 67890,
          platforms: ['Spotify', 'Deezer', 'Tidal'],
          audioUrl: ''
        },
        {
          id: 3,
          title: 'Urban Nights',
          artistName: 'Artista Demo',
          artistId: 1,
          isrc: 'USRC11223344',
          upc: '334455667788',
          totalRevenue: 2890.45,
          totalStreams: 38999,
          platforms: ['Apple Music', 'Amazon Music'],
          audioUrl: ''
        }
      ]);
      
      setDashboardData({
        totalRevenue: 15420.50,
        totalStreams: 234567,
        artistCount: 1,
        trackCount: 3,
        platformBreakdown: {
          'Spotify': 4500.00,
          'Apple Music': 3800.50,
          'YouTube': 2100.00,
          'Deezer': 1520.00,
          'Amazon Music': 1800.00,
          'Tidal': 1700.00
        },
        monthlyData: [
          { month: 'Ene', revenue: 1200.50, streams: 18000 },
          { month: 'Feb', revenue: 1450.75, streams: 22000 },
          { month: 'Mar', revenue: 1680.30, streams: 25000 },
          { month: 'Abr', revenue: 1920.45, streams: 28500 },
          { month: 'May', revenue: 2150.80, streams: 31000 },
          { month: 'Jun', revenue: 2580.90, streams: 35567 }
        ]
      });
      
      console.log('⚠️ No se pudo conectar a la API. Usando datos de prueba.');
    } finally {
      setLoading(false);
    }
  };

  const clearAllData = () => {
    setArtists([]);
    setTracks([]);
    setDashboardData({
      totalRevenue: 0,
      totalStreams: 0,
      artistCount: 0,
      trackCount: 0,
      platformBreakdown: {},
      monthlyData: []
    });
  };

  return (
    <DataContext.Provider 
      value={{ 
        artists, 
        tracks, 
        dashboardData, 
        loading,
        error,
        loadData,
        clearAllData 
      }}
    >
      {children}
    </DataContext.Provider>
  );
};