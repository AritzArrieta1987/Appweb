import { createContext, useContext, useState, ReactNode } from 'react';

export interface Artist {
  id: string;
  name: string;
  totalRevenue: number;
  totalStreams: number;
  photo?: string;
}

export interface Track {
  id: string;
  title: string;
  artistName: string;
  isrc?: string;
  totalStreams: number;
  totalRevenue: number;
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
  addCSVData: (csvDataArray: any[]) => void;
  clearAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
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

  const addCSVData = (csvDataArray: any[]) => {
    // Crear copias del estado actual
    const newArtistsMap: { [key: string]: Artist } = {};
    artists.forEach(artist => {
      newArtistsMap[artist.name] = { ...artist };
    });

    const newTracksMap: { [key: string]: Track } = {};
    tracks.forEach(track => {
      const key = track.isrc || track.id;
      newTracksMap[key] = { ...track };
    });

    const updatedPlatforms = { ...dashboardData.platformBreakdown };
    let totalRevenue = dashboardData.totalRevenue;
    let totalStreams = dashboardData.totalStreams;
    const monthlyDataMap: { [key: string]: { revenue: number; streams: number } } = {};

    // Copiar datos mensuales existentes
    dashboardData.monthlyData.forEach(data => {
      monthlyDataMap[data.month] = { revenue: data.revenue, streams: data.streams };
    });

    // Procesar todos los archivos CSV
    csvDataArray.forEach(csvData => {
      // Procesar artistas sin duplicados
      Object.entries(csvData.artistBreakdown || {}).forEach(([name, revenue]: [string, any]) => {
        if (newArtistsMap[name]) {
          newArtistsMap[name].totalRevenue += revenue;
        } else {
          newArtistsMap[name] = {
            id: `artist-${Date.now()}-${Math.random()}`,
            name,
            totalRevenue: revenue,
            totalStreams: 0,
            photo: undefined
          };
        }
      });

      // Procesar canciones sin duplicados
      (csvData.rows || []).forEach((row: any) => {
        const trackName = row['Track Name'] || row['Track'] || row['Song'] || row['Title'];
        const artistName = row['Artist Name'] || row['Artist'] || row['Display Artist'];
        const isrc = row['ISRC'] || '';
        const platform = row['DMS'] || row['DSP'] || row['Platform'] || row['Store'] || 'Unknown';
        
        const revenueStr = (row['Label Share Net Receipts'] || row['Revenue'] || '0').toString().trim();
        let normalizedRevenue = revenueStr.replace(/[$€]/g, '').replace(/\s/g, '').trim();
        
        if (normalizedRevenue.includes('.') && normalizedRevenue.includes(',')) {
          normalizedRevenue = normalizedRevenue.replace(/\./g, '').replace(',', '.');
        } else if (normalizedRevenue.includes(',')) {
          normalizedRevenue = normalizedRevenue.replace(',', '.');
        }
        
        const revenue = parseFloat(normalizedRevenue) || 0;
        const streamsStr = (row['Quantity'] || row['Streams'] || '0').toString().replace(/[,]/g, '').trim();
        const streams = parseInt(streamsStr) || 0;

        if (trackName && artistName) {
          const trackKey = isrc || `${artistName}-${trackName}`;
          
          if (newTracksMap[trackKey]) {
            newTracksMap[trackKey].totalRevenue += revenue;
            newTracksMap[trackKey].totalStreams += streams;
            if (platform && !newTracksMap[trackKey].platforms.includes(platform)) {
              newTracksMap[trackKey].platforms.push(platform);
            }
          } else {
            newTracksMap[trackKey] = {
              id: `track-${Date.now()}-${Math.random()}`,
              title: trackName,
              artistName: artistName,
              isrc: isrc || undefined,
              totalStreams: streams,
              totalRevenue: revenue,
              platforms: [platform]
            };
          }

          // Actualizar streams del artista
          if (newArtistsMap[artistName]) {
            newArtistsMap[artistName].totalStreams += streams;
          }
        }
      });

      // Actualizar plataformas
      Object.entries(csvData.platformBreakdown || {}).forEach(([platform, revenue]: [string, any]) => {
        updatedPlatforms[platform] = (updatedPlatforms[platform] || 0) + revenue;
      });

      // Acumular totales
      totalRevenue += csvData.totalRevenue || 0;
      totalStreams += csvData.totalStreams || 0;

      // Procesar datos mensuales
      if (csvData.monthlyBreakdown) {
        Object.entries(csvData.monthlyBreakdown).forEach(([month, data]: [string, any]) => {
          if (monthlyDataMap[month]) {
            monthlyDataMap[month].revenue += data.revenue;
            monthlyDataMap[month].streams += data.streams;
          } else {
            monthlyDataMap[month] = { revenue: data.revenue, streams: data.streams };
          }
        });
      }
    });

    // Convertir mapas a arrays
    const artistsArray = Object.values(newArtistsMap);
    const tracksArray = Object.values(newTracksMap);
    const monthlyDataArray = Object.entries(monthlyDataMap).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      streams: data.streams
    }));

    // Actualizar todos los estados
    setArtists(artistsArray);
    setTracks(tracksArray);
    setDashboardData({
      totalRevenue,
      totalStreams,
      artistCount: artistsArray.length,
      trackCount: tracksArray.length,
      platformBreakdown: updatedPlatforms,
      monthlyData: monthlyDataArray
    });
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
    <DataContext.Provider value={{ artists, tracks, dashboardData, addCSVData, clearAllData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}