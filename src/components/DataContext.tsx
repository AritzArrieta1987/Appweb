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
        platforms: track.platforms || []
      }));

      setArtists(transformedArtists);
      setTracks(transformedTracks);
      setDashboardData(dashboardStats);
      
    } catch (error: any) {
      // Cargar datos de demostración silenciosamente
      
      // DATOS DE DEMOSTRACIÓN
      const demoArtists: Artist[] = [
        {
          id: 1,
          name: 'Bad Bunny',
          email: 'badbunny@bigartist.es',
          phone: '+34 600 123 456',
          photo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
          totalRevenue: 45678.50,
          totalStreams: 12500000,
          trackCount: 8
        },
        {
          id: 2,
          name: 'Rosalía',
          email: 'rosalia@bigartist.es',
          phone: '+34 600 234 567',
          photo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
          totalRevenue: 38920.75,
          totalStreams: 9800000,
          trackCount: 6
        },
        {
          id: 3,
          name: 'C. Tangana',
          email: 'tangana@bigartist.es',
          phone: '+34 600 345 678',
          photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
          totalRevenue: 32150.25,
          totalStreams: 8200000,
          trackCount: 7
        },
        {
          id: 4,
          name: 'Aitana',
          email: 'aitana@bigartist.es',
          phone: '+34 600 456 789',
          photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
          totalRevenue: 28560.00,
          totalStreams: 7100000,
          trackCount: 5
        },
        {
          id: 5,
          name: 'Rauw Alejandro',
          email: 'rauw@bigartist.es',
          phone: '+34 600 567 890',
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
          totalRevenue: 41230.80,
          totalStreams: 10500000,
          trackCount: 9
        },
        {
          id: 6,
          name: 'Artist Demo',
          email: 'artist@bigartist.es',
          phone: '+34 600 000 000',
          photo: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
          totalRevenue: 52340.90,
          totalStreams: 13800000,
          trackCount: 10
        }
      ];

      const demoTracks: Track[] = [
        // Bad Bunny tracks
        { id: 1, title: 'Tití Me Preguntó', artistName: 'Bad Bunny', artistId: 1, isrc: 'USRC12301234', totalRevenue: 8500.50, totalStreams: 2200000, platforms: ['Spotify', 'Apple Music', 'YouTube'] },
        { id: 2, title: 'Moscow Mule', artistName: 'Bad Bunny', artistId: 1, isrc: 'USRC12301235', totalRevenue: 7800.25, totalStreams: 1950000, platforms: ['Spotify', 'Apple Music', 'Deezer'] },
        { id: 3, title: 'Me Porto Bonito', artistName: 'Bad Bunny', artistId: 1, isrc: 'USRC12301236', totalRevenue: 6500.00, totalStreams: 1680000, platforms: ['Spotify', 'YouTube', 'Amazon Music'] },
        
        // Rosalía tracks
        { id: 4, title: 'DESPECHÁ', artistName: 'Rosalía', artistId: 2, isrc: 'ESRC12201234', totalRevenue: 9200.50, totalStreams: 2350000, platforms: ['Spotify', 'Apple Music', 'YouTube'] },
        { id: 5, title: 'LA FAMA', artistName: 'Rosalía', artistId: 2, isrc: 'ESRC12201235', totalRevenue: 8100.75, totalStreams: 2080000, platforms: ['Spotify', 'Apple Music'] },
        { id: 6, title: 'SAOKO', artistName: 'Rosalía', artistId: 2, isrc: 'ESRC12201236', totalRevenue: 7500.00, totalStreams: 1920000, platforms: ['Spotify', 'YouTube', 'Deezer'] },
        
        // C. Tangana tracks
        { id: 7, title: 'Demasiadas Mujeres', artistName: 'C. Tangana', artistId: 3, isrc: 'ESRC12301234', totalRevenue: 6800.25, totalStreams: 1750000, platforms: ['Spotify', 'Apple Music', 'YouTube'] },
        { id: 8, title: 'Tú Me Dejaste de Querer', artistName: 'C. Tangana', artistId: 3, isrc: 'ESRC12301235', totalRevenue: 6200.50, totalStreams: 1590000, platforms: ['Spotify', 'Apple Music'] },
        { id: 9, title: 'Ingobernable', artistName: 'C. Tangana', artistId: 3, isrc: 'ESRC12301236', totalRevenue: 5800.00, totalStreams: 1480000, platforms: ['Spotify', 'YouTube'] },
        
        // Aitana tracks
        { id: 10, title: 'Mon Amour', artistName: 'Aitana', artistId: 4, isrc: 'ESRC12401234', totalRevenue: 7200.00, totalStreams: 1850000, platforms: ['Spotify', 'Apple Music', 'YouTube'] },
        { id: 11, title: 'Formentera', artistName: 'Aitana', artistId: 4, isrc: 'ESRC12401235', totalRevenue: 6500.00, totalStreams: 1670000, platforms: ['Spotify', 'Apple Music'] },
        { id: 12, title: 'Ni Una Más', artistName: 'Aitana', artistId: 4, isrc: 'ESRC12401236', totalRevenue: 5900.00, totalStreams: 1510000, platforms: ['Spotify', 'YouTube', 'Deezer'] },
        
        // Rauw Alejandro tracks
        { id: 13, title: 'Todo de Ti', artistName: 'Rauw Alejandro', artistId: 5, isrc: 'PRRC12301234', totalRevenue: 8900.50, totalStreams: 2280000, platforms: ['Spotify', 'Apple Music', 'YouTube'] },
        { id: 14, title: 'Tattoo', artistName: 'Rauw Alejandro', artistId: 5, isrc: 'PRRC12301235', totalRevenue: 7800.25, totalStreams: 2000000, platforms: ['Spotify', 'Apple Music', 'Amazon Music'] },
        { id: 15, title: 'Punto 40', artistName: 'Rauw Alejandro', artistId: 5, isrc: 'PRRC12301236', totalRevenue: 7100.00, totalStreams: 1820000, platforms: ['Spotify', 'YouTube'] },
        
        // Artist Demo tracks
        { id: 16, title: 'Summer Nights', artistName: 'Artist Demo', artistId: 6, isrc: 'DEMO12301234', totalRevenue: 9500.50, totalStreams: 2450000, platforms: ['Spotify', 'Apple Music', 'YouTube'] },
        { id: 17, title: 'Midnight Dreams', artistName: 'Artist Demo', artistId: 6, isrc: 'DEMO12301235', totalRevenue: 8800.75, totalStreams: 2280000, platforms: ['Spotify', 'Apple Music', 'Deezer'] },
        { id: 18, title: 'Electric Soul', artistName: 'Artist Demo', artistId: 6, isrc: 'DEMO12301236', totalRevenue: 7900.00, totalStreams: 2050000, platforms: ['Spotify', 'YouTube', 'Amazon Music'] },
        { id: 19, title: 'Heartbeat', artistName: 'Artist Demo', artistId: 6, isrc: 'DEMO12301237', totalRevenue: 7200.25, totalStreams: 1880000, platforms: ['Spotify', 'Apple Music', 'YouTube'] },
        { id: 20, title: 'Golden Hour', artistName: 'Artist Demo', artistId: 6, isrc: 'DEMO12301238', totalRevenue: 6800.50, totalStreams: 1760000, platforms: ['Spotify', 'Apple Music'] },
        { id: 21, title: 'Rising Sun', artistName: 'Artist Demo', artistId: 6, isrc: 'DEMO12301239', totalRevenue: 6400.00, totalStreams: 1650000, platforms: ['Spotify', 'YouTube', 'Deezer'] },
        { id: 22, title: 'Ocean Waves', artistName: 'Artist Demo', artistId: 6, isrc: 'DEMO12301240', totalRevenue: 5900.90, totalStreams: 1520000, platforms: ['Apple Music', 'YouTube'] },
        { id: 23, title: 'City Lights', artistName: 'Artist Demo', artistId: 6, isrc: 'DEMO12301241', totalRevenue: 5500.00, totalStreams: 1420000, platforms: ['Spotify', 'Deezer'] },
        { id: 24, title: 'Stargazer', artistName: 'Artist Demo', artistId: 6, isrc: 'DEMO12301242', totalRevenue: 5100.00, totalStreams: 1320000, platforms: ['Spotify', 'Apple Music', 'YouTube'] },
        { id: 25, title: 'Neon Dreams', artistName: 'Artist Demo', artistId: 6, isrc: 'DEMO12301243', totalRevenue: 4840.00, totalStreams: 1250000, platforms: ['Spotify', 'YouTube', 'Amazon Music'] }
      ];

      const demoDashboard: DashboardData = {
        totalRevenue: 186540.30,
        totalStreams: 46350000,
        artistCount: 5,
        trackCount: 15,
        platformBreakdown: {
          'Spotify': 82450.50,
          'Apple Music': 54230.75,
          'YouTube': 32150.25,
          'Amazon Music': 12890.00,
          'Deezer': 4818.80
        },
        monthlyData: [
          { month: 'Ene 2024', revenue: 28450.50, streams: 7200000 },
          { month: 'Feb 2024', revenue: 31280.75, streams: 7850000 },
          { month: 'Mar 2024', revenue: 29650.25, streams: 7450000 },
          { month: 'Abr 2024', revenue: 33120.00, streams: 8300000 },
          { month: 'May 2024', revenue: 32040.80, streams: 8050000 },
          { month: 'Jun 2024', revenue: 31998.00, streams: 7500000 }
        ]
      };

      setArtists(demoArtists);
      setTracks(demoTracks);
      setDashboardData(demoDashboard);
      
      setError('Modo demostración: Mostrando datos de ejemplo');
      
      console.log('✅ Datos de demostración cargados:', {
        artists: demoArtists.length,
        tracks: demoTracks.length,
        totalRevenue: demoDashboard.totalRevenue
      });
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