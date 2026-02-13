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
  territory?: string;
  audioUrl?: string;
}

export interface DashboardData {
  totalRevenue: number;
  totalStreams: number;
  artistCount: number;
  trackCount: number;
  platformBreakdown: { [key: string]: number };
  territoryBreakdown?: { [key: string]: { revenue: number; streams: number } };
  monthlyData: { month: string; revenue: number; streams: number }[];
}

export interface UploadedFile {
  name: string;
  rows: number;
  revenue: number;
  streams: number;
  artists: number;
  tracks: number;
  uploadDate?: string;
}

interface DataContextType {
  artists: Artist[];
  tracks: Track[];
  dashboardData: DashboardData;
  uploadedFiles: UploadedFile[];
  loading: boolean;
  error: string | null;
  loadData: () => Promise<void>;
  clearAllData: () => void;
  addUploadedFile: (file: UploadedFile) => void;
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
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      name: 'TheOrchard_Royalties_Enero_2024.csv',
      rows: 2847,
      revenue: 18542.75,
      streams: 342567,
      artists: 15,
      tracks: 127,
      uploadDate: '15/01/2024, 09:23'
    },
    {
      name: 'TheOrchard_Royalties_Febrero_2024.csv',
      rows: 3124,
      revenue: 21890.40,
      streams: 398234,
      artists: 18,
      tracks: 145,
      uploadDate: '14/02/2024, 10:15'
    },
    {
      name: 'TheOrchard_Royalties_Marzo_2024.csv',
      rows: 2956,
      revenue: 19765.30,
      streams: 367891,
      artists: 16,
      tracks: 138,
      uploadDate: '12/03/2024, 11:42'
    },
    {
      name: 'TheOrchard_Royalties_Abril_2024.csv',
      rows: 3387,
      revenue: 24123.85,
      streams: 425678,
      artists: 20,
      tracks: 162,
      uploadDate: '10/04/2024, 08:56'
    },
    {
      name: 'TheOrchard_Royalties_Mayo_2024.csv',
      rows: 3642,
      revenue: 26890.50,
      streams: 478923,
      artists: 22,
      tracks: 175,
      uploadDate: '15/05/2024, 14:33'
    },
    {
      name: 'TheOrchard_Royalties_Junio_2024.csv',
      rows: 3198,
      revenue: 22456.90,
      streams: 401234,
      artists: 19,
      tracks: 151,
      uploadDate: '11/06/2024, 09:18'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        territory: track.territory,
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
          territory: 'US',
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
          territory: 'US',
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
          territory: 'US',
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
        territoryBreakdown: {
          'US': { revenue: 15420.50, streams: 234567 }
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
    setUploadedFiles([]);
  };

  const addUploadedFile = (file: UploadedFile) => {
    setUploadedFiles(prev => [...prev, file]);
  };

  return (
    <DataContext.Provider 
      value={{ 
        artists, 
        tracks, 
        dashboardData,
        uploadedFiles,
        loading,
        error,
        loadData,
        clearAllData,
        addUploadedFile
      }}
    >
      {children}
    </DataContext.Provider>
  );
};