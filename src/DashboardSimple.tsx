import { useState, useEffect, useRef } from 'react';
import { Bell, BarChart3, Users, Music, FileText, Upload, Settings, LogOut, TrendingUp, DollarSign, Database, PieChart, Disc, CheckCircle, AlertCircle, Info, X, ArrowLeft, Camera, Grid3x3, List, Play, Pause, UploadCloud, Clock, Plus, Edit2, Trash2, Calendar, Percent, Eye, FileSignature, User, Mail, Phone, Globe, MapPin, Lock, Shield, Save, Volume2, VolumeX, Wallet, ArrowUpRight, ArrowDownRight, Download, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import logoImage from 'figma:asset/aa0296e2522220bcfcda71f86c708cb2cbc616b9.png';
import backgroundImage from 'figma:asset/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493.png';
import CSVUploader from './components/CSVUploader';
import WorldMap from './components/WorldMap';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { FinancesPanel } from './components/FinancesPanel';
import ArtistPanel from './components/ArtistPanel';
import ArtistPortal from './components/ArtistPortal';
import { useData } from './components/DataContext';

interface DashboardProps {
  onLogout: () => void;
}

export default function DashboardSimple({ onLogout }: DashboardProps) {
  const { artists, tracks, dashboardData } = useData();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', title: 'CSV Procesado', message: 'Se han importado 15 canciones correctamente', time: 'Hace 5 min', read: false },
    { id: 2, type: 'info', title: 'Nuevo Artista', message: 'Se ha añadido un nuevo artista al catálogo', time: 'Hace 1 hora', read: false },
    { id: 3, type: 'warning', title: 'Actualización Pendiente', message: 'Hay datos pendientes de sincronizar', time: 'Hace 2 horas', read: false }
  ]);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [showChart, setShowChart] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [localArtists, setLocalArtists] = useState<any[]>([]);
  const [catalogViewMode, setCatalogViewMode] = useState<'grid' | 'list'>('grid');
  const [artistViewMode, setArtistViewMode] = useState<'grid' | 'list'>('grid');
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [contracts, setContracts] = useState<any[]>([]);
  const [showContractModal, setShowContractModal] = useState(false);
  const [editingContract, setEditingContract] = useState<any | null>(null);
  const [selectedContractView, setSelectedContractView] = useState<any | null>(null);
  const [showWorldMap, setShowWorldMap] = useState(false);

  // Sincronizar artistas locales con los del contexto
  useEffect(() => {
    setLocalArtists(artists);
  }, [artists]);

  // Cargar contratos (temporal - luego desde backend)
  useEffect(() => {
    // TODO: Cargar desde backend con api.getContracts()
    if (artists.length > 0) {
      const mockContracts = artists.map((artist, index) => ({
        id: index + 1,
        artistId: artist.id,
        artistName: artist.name,
        artistPhoto: artist.photo,
        percentage: index === 0 ? 70 : 60,
        startDate: '2024-01-01',
        endDate: '2026-12-31',
        status: 'active', // active, pending, expired
        type: 'Exclusivo', // Exclusivo, No Exclusivo
        territory: 'Mundial',
        advancePayment: index === 0 ? 5000 : 3000,
        terms: 'Contrato de distribución musical con participación en royalties de streaming y ventas digitales.',
        createdAt: '2024-01-01'
      }));
      setContracts(mockContracts);
    }
  }, [artists]);

  // Función para formatear importes en formato europeo
  const formatEuro = (amount: number): string => {
    return amount.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + '€';
  };

  // Función para reproducir/pausar audio
  const handlePlayPause = (trackId: number, audioUrl?: string) => {
    if (!audioUrl) return;

    if (playingTrackId === trackId) {
      // Pausar
      audioRef.current?.pause();
      setPlayingTrackId(null);
    } else {
      // Reproducir
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setPlayingTrackId(trackId);
      
      // Cuando termine, resetear
      audioRef.current.onended = () => {
        setPlayingTrackId(null);
      };
    }
  };

  // Función para subir audio a una canción
  const handleAudioUpload = async (trackId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const audioUrl = reader.result as string;
        
        // TODO: Guardar en backend
        // await api.updateTrackAudio(trackId, audioUrl);
        
        // Actualizar localmente (temporal)
        console.log(`Audio subido para track ${trackId}:`, audioUrl.substring(0, 50) + '...');
        
        // Mostrar notificación
        setNotifications(prev => [{
          id: Date.now(),
          type: 'success',
          title: 'Audio Subido',
          message: 'El audio se ha subido correctamente',
          time: 'Ahora',
          read: false
        }, ...prev]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para cambiar la foto del artista
  const handlePhotoChange = (artistId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        // Actualizar artista localmente
        const updatedArtists = localArtists.map(artist => 
          artist.id === artistId ? { ...artist, photo: imageUrl } : artist
        );
        setLocalArtists(updatedArtists);
        
        // Si el artista seleccionado es el que se está editando, actualizar también
        if (selectedArtist?.id === artistId) {
          setSelectedArtist((prev: any) => ({ ...prev, photo: imageUrl }));
        }
        
        // Mostrar notificación de éxito
        setNotifications(prev => [
          {
            id: Date.now(),
            type: 'success',
            title: 'Foto Actualizada',
            message: `La foto de ${localArtists.find(a => a.id === artistId)?.name} se ha actualizado correctamente`,
            time: 'Ahora',
            read: false
          },
          ...prev
        ]);
        
        // Aquí podrías hacer la llamada al backend para guardar la foto
        // await api.updateArtistPhoto(artistId, imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Detectar scroll para contraer y ocultar header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Ocultar header al hacer scroll hacia abajo, mostrarlo al hacer scroll hacia arriba
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
      } else if (currentScrollY < lastScrollY) {
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Cerrar notificaciones al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Función para marcar notificación como leída
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  // Función para eliminar notificación
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // Obtener icono según tipo de notificación
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return { icon: CheckCircle, color: '#4ade80' };
      case 'warning':
        return { icon: AlertCircle, color: '#f59e0b' };
      case 'error':
        return { icon: AlertCircle, color: '#ef4444' };
      default:
        return { icon: Info, color: '#60a5fa' };
    }
  };

  const tabs = [
    { name: 'Dashboard', icon: BarChart3 },
    { name: 'Finanzas', icon: Wallet },
    { name: 'Artistas', icon: Users },
    { name: 'Catálogo', icon: Music },
    { name: 'Contratos', icon: FileText },
    { name: 'Subir CSV', icon: Upload },
    { name: 'Configuración', icon: Settings }
  ];

  // Datos para gráfico circular de CSV - Artistas
  const csvChartData = artists.slice(0, 5).map((artist, index) => {
    const colors = ['#c9a574', '#4ade80', '#60a5fa', '#f87171', '#a78bfa'];
    return {
      name: artist.name,
      value: artist.totalRevenue,
      color: colors[index % colors.length]
    };
  });

  // Datos para gráfico lineal de CSV - Periodos reales del CSV
  const csvLineData = dashboardData.monthlyData.length > 0 
    ? dashboardData.monthlyData.map(data => ({
        mes: data.month,
        revenue: data.revenue,
        streams: data.streams
      }))
    : [];

  // Datos para gráfico circular de DSP - Plataformas
  const platformColors: { [key: string]: string } = {
    'Spotify': '#1DB954',
    'Apple Music': '#FA243C',
    'YouTube': '#FF0000',
    'Amazon Music': '#FF9900',
    'Deezer': '#FEAA2D',
    'Tidal': '#000000',
    'Pandora': '#3668FF'
  };

  const dspChartData = Object.entries(dashboardData.platformBreakdown)
    .slice(0, 7)
    .map(([name, value]) => ({
      name,
      value,
      color: platformColors[name] || '#c9a574'
    }));

  // Datos de canciones recientes del CSV - Top 10
  const recentTracks = tracks
    .slice()
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10)
    .map((track) => {
      const platformColor = platformColors[track.platforms[0]] || '#c9a574';
      return {
        title: track.title,
        artist: track.artistName,
        isrc: track.isrc || 'N/A',
        streams: track.totalStreams,
        revenue: track.totalRevenue,
        platform: track.platforms[0] || 'Unknown',
        platformColor
      };
    });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map(f => f.name);
      setUploadedFiles(prev => [...prev, ...fileNames]);
      setShowChart(true);
      
      setTimeout(() => {
        alert(`✅ ${files.length} archivo(s) procesado(s) correctamente`);
      }, 1000);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div style={{ padding: '0' }}>
            {/* Dashboard limpio sin cajas */}
          </div>
        );
      
      case 'Subir CSV':
        return <CSVUploader />;
      
      case 'Finanzas':
        return <FinancesPanel dashboardData={dashboardData} artists={artists} />;
      
      case 'Artistas':
        return (
          <div>
            {/* View Mode Toggle */}
            {artists.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  padding: '4px',
                  background: 'rgba(42, 63, 63, 0.4)',
                  borderRadius: '12px',
                  border: '1px solid rgba(201, 165, 116, 0.2)'
                }}>
                  <button
                    onClick={() => setArtistViewMode('grid')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: artistViewMode === 'grid' ? 'rgba(201, 165, 116, 0.3)' : 'transparent',
                      color: artistViewMode === 'grid' ? '#c9a574' : 'rgba(255, 255, 255, 0.6)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Grid3x3 size={18} />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Grid</span>
                  </button>
                  <button
                    onClick={() => setArtistViewMode('list')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: artistViewMode === 'list' ? 'rgba(201, 165, 116, 0.3)' : 'transparent',
                      color: artistViewMode === 'list' ? '#c9a574' : 'rgba(255, 255, 255, 0.6)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <List size={18} />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>List</span>
                  </button>
                </div>
              </div>
            )}

            {/* Artists Content */}
            {artists.length === 0 ? (
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '16px',
                padding: '48px',
                textAlign: 'center'
              }}>
                <Users size={48} color="#c9a574" style={{ margin: '0 auto 16px' }} />
                <p style={{ fontSize: '18px', color: '#AFB3B7', marginBottom: '8px' }}>No hay artistas aún</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Sube un archivo CSV para crear artistas automáticamente</p>
              </div>
            ) : artistViewMode === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {localArtists.map((artist) => (
                  <div
                    key={artist.id}
                    style={{
                      background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.1) 0%, rgba(42, 63, 63, 0.4) 100%)',
                      border: '1px solid rgba(201, 165, 116, 0.2)',
                      borderRadius: '16px',
                      padding: '24px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(201, 165, 116, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
                    }}
                    onClick={() => setSelectedArtist(artist)}
                  >
                    {/* Artist Photo with Camera Button */}
                    <div style={{
                      width: '100%',
                      height: '200px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      background: artist.photo 
                        ? `url(${artist.photo}) center/cover`
                        : 'linear-gradient(135deg, rgba(201, 165, 116, 0.2) 0%, rgba(42, 63, 63, 0.3) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}>
                      {!artist.photo && <Users size={48} color="#c9a574" />}
                      
                      {/* Botón de cambiar foto */}
                      <label
                        htmlFor={`photo-upload-${artist.id}`}
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'rgba(201, 165, 116, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: '2px solid rgba(255, 255, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                          zIndex: 10
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.1)';
                          e.currentTarget.style.background = '#c9a574';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.background = 'rgba(201, 165, 116, 0.95)';
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Camera size={20} color="#1a1a1a" strokeWidth={2.5} />
                        <input
                          id={`photo-upload-${artist.id}`}
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handlePhotoChange(artist.id, e)}
                        />
                      </label>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
                      {artist.name}
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                      <div>
                        <p style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '4px' }}>Ingresos</p>
                        <p style={{ fontSize: '18px', fontWeight: '700', color: '#c9a574' }}>
                          €{artist.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '4px' }}>Streams</p>
                        <p style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>
                          {artist.totalStreams.toLocaleString('es-ES')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {localArtists.map((artist) => (
                  <div
                    key={artist.id}
                    style={{
                      background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                      border: '1px solid rgba(201, 165, 116, 0.2)',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(201, 165, 116, 0.1) 0%, rgba(42, 63, 63, 0.5) 100%)';
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)';
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
                    }}
                    onClick={() => setSelectedArtist(artist)}
                  >
                    {/* Artist Photo */}
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      background: artist.photo 
                        ? `url(${artist.photo}) center/cover`
                        : 'linear-gradient(135deg, rgba(201, 165, 116, 0.2) 0%, rgba(42, 63, 63, 0.3) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      position: 'relative',
                      border: '2px solid rgba(201, 165, 116, 0.2)'
                    }}>
                      {!artist.photo && <Users size={32} color="#c9a574" />}
                      
                      {/* Botón de cambiar foto */}
                      <label
                        htmlFor={`photo-upload-list-${artist.id}`}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'rgba(201, 165, 116, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: '2px solid rgba(255, 255, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                          zIndex: 10
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.1)';
                          e.currentTarget.style.background = '#c9a574';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.background = 'rgba(201, 165, 116, 0.95)';
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Camera size={14} color="#1a1a1a" strokeWidth={2.5} />
                        <input
                          id={`photo-upload-list-${artist.id}`}
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handlePhotoChange(artist.id, e)}
                        />
                      </label>
                    </div>

                    {/* Artist Name */}
                    <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#ffffff',
                        marginBottom: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {artist.name}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#AFB3B7' }}>
                        {artist.email || 'Sin email'}
                      </p>
                    </div>

                    {/* Ingresos */}
                    <div style={{ flex: '0 0 150px', textAlign: 'right' }}>
                      <p style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '4px' }}>Ingresos</p>
                      <p style={{ fontSize: '18px', fontWeight: '700', color: '#c9a574' }}>
                        €{artist.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    {/* Streams */}
                    <div style={{ flex: '0 0 120px', textAlign: 'right' }}>
                      <p style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '4px' }}>Streams</p>
                      <p style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
                        {artist.totalStreams.toLocaleString('es-ES')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'Catálogo':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#ffffff' }}>Catálogo Musical</h1>
              
              {/* View Mode Toggle */}
              <div style={{
                display: 'flex',
                gap: '8px',
                padding: '4px',
                background: 'rgba(42, 63, 63, 0.4)',
                borderRadius: '12px',
                border: '1px solid rgba(201, 165, 116, 0.2)'
              }}>
                <button
                  onClick={() => setCatalogViewMode('grid')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: catalogViewMode === 'grid' ? 'rgba(201, 165, 116, 0.3)' : 'transparent',
                    color: catalogViewMode === 'grid' ? '#c9a574' : 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Grid3x3 size={18} />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Grid</span>
                </button>
                <button
                  onClick={() => setCatalogViewMode('list')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: catalogViewMode === 'list' ? 'rgba(201, 165, 116, 0.3)' : 'transparent',
                    color: catalogViewMode === 'list' ? '#c9a574' : 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <List size={18} />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>List</span>
                </button>
              </div>
            </div>

            {tracks.length === 0 ? (
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '16px',
                padding: '48px',
                textAlign: 'center'
              }}>
                <Music size={48} color="#c9a574" style={{ margin: '0 auto 16px' }} />
                <p style={{ fontSize: '18px', color: '#AFB3B7', marginBottom: '8px' }}>No hay canciones aún</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Sube un archivo CSV para importar tu catálogo</p>
              </div>
            ) : catalogViewMode === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    style={{
                      background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                      border: '1px solid rgba(201, 165, 116, 0.2)',
                      borderRadius: '16px',
                      padding: '20px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(201, 165, 116, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
                    }}
                  >
                    {/* Album Cover / Audio Upload */}
                    <div style={{
                      width: '100%',
                      height: '180px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(42, 63, 63, 0.3) 100%)',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <Music size={48} color="#c9a574" opacity={0.3} />
                      
                      {/* Play/Pause Button */}
                      <button
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          right: '12px',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'rgba(201, 165, 116, 0.95)',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        onClick={() => handlePlayPause(track.id, track.audioUrl)}
                      >
                        {playingTrackId === track.id ? (
                          <Pause size={20} color="#1a1a1a" fill="#1a1a1a" />
                        ) : (
                          <Play size={20} color="#1a1a1a" fill="#1a1a1a" />
                        )}
                      </button>

                      {/* Upload Audio Button */}
                      <label
                        htmlFor={`audio-upload-${track.id}`}
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'rgba(42, 63, 63, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(201, 165, 116, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
                          e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(42, 63, 63, 0.95)';
                          e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                        }}
                      >
                        <UploadCloud size={18} color="#c9a574" />
                        <input
                          id={`audio-upload-${track.id}`}
                          type="file"
                          accept="audio/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleAudioUpload(track.id, e)}
                        />
                      </label>
                    </div>

                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#ffffff',
                      marginBottom: '6px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {track.title}
                    </h3>
                    
                    <p style={{
                      fontSize: '13px',
                      color: '#AFB3B7',
                      marginBottom: '12px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {track.artistName}
                    </p>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(201, 165, 116, 0.1)'
                    }}>
                      <div>
                        <p style={{ fontSize: '11px', color: '#AFB3B7', marginBottom: '4px' }}>Revenue</p>
                        <p style={{ fontSize: '15px', fontWeight: '700', color: '#c9a574' }}>
                          €{track.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '11px', color: '#AFB3B7', marginBottom: '4px' }}>Streams</p>
                        <p style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>
                          {track.totalStreams.toLocaleString('es-ES')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    style={{
                      background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                      border: '1px solid rgba(201, 165, 116, 0.2)',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(201, 165, 116, 0.1) 0%, rgba(42, 63, 63, 0.5) 100%)';
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)';
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
                    }}
                  >
                    {/* Play Button */}
                    <button
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'rgba(201, 165, 116, 0.2)',
                        border: '1px solid rgba(201, 165, 116, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(201, 165, 116, 0.4)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      onClick={() => handlePlayPause(track.id, track.audioUrl)}
                    >
                      {playingTrackId === track.id ? (
                        <Pause size={18} color="#c9a574" fill="#c9a574" />
                      ) : (
                        <Play size={18} color="#c9a574" fill="#c9a574" />
                      )}
                    </button>

                    {/* Track Info */}
                    <div style={{ flex: '1 1 300px', minWidth: 0 }}>
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#ffffff',
                        marginBottom: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {track.title}
                      </h3>
                      <p style={{
                        fontSize: '13px',
                        color: '#AFB3B7',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {track.artistName}
                      </p>
                    </div>

                    {/* ISRC */}
                    <div style={{ flex: '0 0 120px', textAlign: 'center' }}>
                      <p style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '2px' }}>ISRC</p>
                      <p style={{ fontSize: '13px', color: '#ffffff', fontFamily: 'monospace' }}>
                        {track.isrc || 'N/A'}
                      </p>
                    </div>

                    {/* Streams */}
                    <div style={{ flex: '0 0 100px', textAlign: 'right' }}>
                      <p style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '2px' }}>Streams</p>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                        {track.totalStreams.toLocaleString('es-ES')}
                      </p>
                    </div>

                    {/* Revenue */}
                    <div style={{ flex: '0 0 100px', textAlign: 'right' }}>
                      <p style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '2px' }}>Revenue</p>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: '#c9a574' }}>
                        €{track.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'Contratos':
        return (
          <div style={{ padding: '0' }}>
            {/* Contratos limpio sin cajas */}
          </div>
        );
      
      case 'Configuración':
        return <ConfigurationPanel />;
      
      default:
        return null;
    }
  };

  // Si hay un artista seleccionado, mostrar el panel del artista
  if (selectedArtist) {
    return (
      <ArtistPanel
        artist={selectedArtist}
        onBack={() => setSelectedArtist(null)}
      />
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, #1a2332 0%, #0f1419 50%, #1a2332 100%)`,
      position: 'relative'
    }}>
      {/* Style tag to force transparent buttons */}
      <style>{`
        button.nav-tab-button,
        button.nav-tab-button:hover,
        button.nav-tab-button:focus,
        button.nav-tab-button:active,
        button.nav-tab-button:focus-visible,
        button.nav-tab-button:focus-within,
        button.nav-tab-button:visited,
        button.nav-tab-button:link,
        button.nav-tab-button::before,
        button.nav-tab-button::after {
          background: rgba(0, 0, 0, 0) !important;
          background-color: rgba(0, 0, 0, 0) !important;
          background-image: none !important;
          box-shadow: none !important;
          outline: none !important;
          backdrop-filter: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
        }
      `}</style>
      
      {/* IMAGEN DE FONDO GLOBAL - igual que LoginPanel */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        opacity: 0.6,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* OVERLAY VERDE GLOBAL - aplicado a toda la imagen */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(13, 31, 35, 0.85) 0%, rgba(19, 46, 53, 0.8) 50%, rgba(45, 74, 83, 0.75) 100%)',
        backdropFilter: 'blur(2px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* CAPA DE TINTE VERDE GLOBAL */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(32, 64, 64, 0.4)',
        mixBlendMode: 'multiply' as const,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Main Container */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header - Auto-hide on scroll */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'transparent',
          backdropFilter: 'none',
          borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
          padding: '12px 48px',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: showHeader ? 'translateY(0)' : 'translateY(-100%)',
          boxShadow: 'none'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '32px'
          }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <img 
                src={logoImage} 
                alt="Logo" 
                style={{ 
                  height: '40px',
                  transition: 'all 0.4s ease'
                }} 
              />
            </div>

            {/* Navigation Tabs */}
            <div style={{
              display: window.innerWidth >= 768 ? 'flex' : 'none',
              gap: '8px',
              flex: 1,
              justifyContent: 'center'
            }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.name;
                
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className="nav-tab-button"
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '10px',
                      background: 'rgba(0, 0, 0, 0)',
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      backgroundImage: 'none',
                      color: isActive ? '#c9a574' : 'rgba(255, 255, 255, 0.6)',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'color 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      whiteSpace: 'nowrap',
                      boxShadow: 'none',
                      outline: 'none'
                    } as React.CSSProperties}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#c9a574';
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0)';
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                      }
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0)';
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                    }}
                  >
                    <Icon size={18} />
                    {tab.name}
                  </button>
                );
              })}
            </div>

            {/* Right Section - Notifications & Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
              {/* Notifications Button */}
              <div style={{ position: 'relative' }} ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: showNotifications 
                      ? 'rgba(201, 165, 116, 0.2)' 
                      : 'rgba(42, 63, 63, 0.4)',
                    border: `1px solid ${showNotifications ? 'rgba(201, 165, 116, 0.4)' : 'rgba(201, 165, 116, 0.2)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (!showNotifications) {
                      e.currentTarget.style.background = 'rgba(201, 165, 116, 0.15)';
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showNotifications) {
                      e.currentTarget.style.background = 'rgba(42, 63, 63, 0.4)';
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
                    }
                  }}
                >
                  <Bell size={20} color="#c9a574" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#ef4444',
                      border: '2px solid #1a2332',
                      animation: 'pulse 2s ease-in-out infinite'
                    }} />
                  )}
                </button>

                {/* Notifications Panel */}
                {showNotifications && (
                  <div style={{
                    position: 'absolute',
                    top: '54px',
                    right: 0,
                    width: '380px',
                    maxHeight: '500px',
                    background: 'rgba(26, 35, 50, 0.98)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(201, 165, 116, 0.2)',
                    borderRadius: '16px',
                    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.5)',
                    overflow: 'hidden',
                    zIndex: 1000
                  }}>
                    <div style={{
                      padding: '20px 24px',
                      borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
                        Notificaciones
                      </h3>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: 'rgba(201, 165, 116, 0.15)',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#c9a574'
                      }}>
                        {notifications.filter(n => !n.read).length} nuevas
                      </span>
                    </div>

                    <div style={{
                      maxHeight: '420px',
                      overflowY: 'auto'
                    }}>
                      {notifications.length === 0 ? (
                        <div style={{
                          padding: '48px 24px',
                          textAlign: 'center',
                          color: 'rgba(255, 255, 255, 0.5)'
                        }}>
                          <Bell size={32} color="rgba(201, 165, 116, 0.3)" style={{ margin: '0 auto 12px' }} />
                          <p style={{ fontSize: '14px' }}>No hay notificaciones</p>
                        </div>
                      ) : (
                        notifications.map((notification) => {
                          const { icon: Icon, color } = getNotificationIcon(notification.type);
                          return (
                            <div
                              key={notification.id}
                              style={{
                                padding: '16px 24px',
                                borderBottom: '1px solid rgba(201, 165, 116, 0.05)',
                                background: notification.read 
                                  ? 'transparent' 
                                  : 'rgba(201, 165, 116, 0.03)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(201, 165, 116, 0.08)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = notification.read 
                                  ? 'transparent' 
                                  : 'rgba(201, 165, 116, 0.03)';
                              }}
                              onClick={() => markAsRead(notification.id)}
                            >
                              <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '10px',
                                  background: `${color}20`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0
                                }}>
                                  <Icon size={18} color={color} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '6px'
                                  }}>
                                    <h4 style={{
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      color: '#ffffff',
                                      marginBottom: '4px'
                                    }}>
                                      {notification.title}
                                    </h4>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNotification(notification.id);
                                      }}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: '4px',
                                        cursor: 'pointer',
                                        opacity: 0.5,
                                        transition: 'opacity 0.3s ease'
                                      }}
                                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.5')}
                                    >
                                      <X size={14} color="rgba(255, 255, 255, 0.6)" />
                                    </button>
                                  </div>
                                  <p style={{
                                    fontSize: '12px',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    marginBottom: '8px',
                                    lineHeight: '1.4'
                                  }}>
                                    {notification.message}
                                  </p>
                                  <span style={{
                                    fontSize: '11px',
                                    color: 'rgba(255, 255, 255, 0.4)'
                                  }}>
                                    {notification.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  color: '#ef4444',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                }}
              >
                <LogOut size={18} />
                Salir
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          padding: '32px 48px 48px'
        }}>
          {renderContent()}
        </div>

        {/* Bottom Navigation - Mobile Only */}
        <div style={{
          display: window.innerWidth < 768 ? 'block' : 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(26, 35, 50, 0.98)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(201, 165, 116, 0.2)',
          padding: '12px 16px',
          zIndex: 100,
          boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px'
          }}>
            {tabs.slice(0, 4).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.name;
              
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  style={{
                    padding: '12px 8px',
                    background: isActive 
                      ? 'rgba(201, 165, 116, 0.15)' 
                      : 'transparent',
                    border: 'none',
                    borderRadius: '12px',
                    color: isActive ? '#c9a574' : 'rgba(255, 255, 255, 0.6)',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Icon size={20} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Keyframes for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}