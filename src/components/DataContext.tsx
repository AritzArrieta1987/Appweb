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
      // Sin conexión a la API, dejar arrays vacíos
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
      
      console.log('⚠️ No se pudo conectar a la API. Esperando datos reales.');
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