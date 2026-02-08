import { useState, useEffect, useRef } from 'react';
import { Bell, BarChart3, Users, Music, FileText, Upload, Settings, LogOut, TrendingUp, DollarSign, Database, PieChart, Disc, CheckCircle, AlertCircle, Info, X, ArrowLeft, Camera, Grid3x3, List, Play, Pause, UploadCloud, Clock, Plus, Edit2, Trash2, Calendar, Percent, Eye, FileSignature, User, Mail, Phone, Globe, MapPin, Lock, Shield, Save, Volume2, VolumeX, Wallet, ArrowUpRight, ArrowDownRight, Download, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import logoImage from 'figma:asset/aa0296e2522220bcfcda71f86c708cb2cbc616b9.png';
import backgroundImage from 'figma:asset/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493.png';
import CSVUploader from './components/CSVUploader';
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
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [contracts, setContracts] = useState<any[]>([]);
  const [showContractModal, setShowContractModal] = useState(false);
  const [editingContract, setEditingContract] = useState<any | null>(null);
  const [selectedContractView, setSelectedContractView] = useState<any | null>(null);

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
            {/* Header Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '445px 1fr',
              gap: '12px',
              marginBottom: '24px',
              padding: '0',
              width: '100%'
            }}>
              {/* Main Welcome Card */}
              <div style={{
                background: 'rgba(42, 63, 63, 0.3)',
                borderRadius: '16px',
                padding: '28px 32px',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '8px',
                  lineHeight: '1.3'
                }}>
                  Hola, aquí está el resumen
                  <br />
                  de tus royalties.
                </h2>
                
                {/* Mini bar chart */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '4px',
                  height: '60px',
                  marginTop: '20px',
                  marginBottom: '24px'
                }}>
                  {csvLineData.slice(-6).map((data, index) => (
                    <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{
                        width: '100%',
                        backgroundColor: index === csvLineData.slice(-6).length - 1 ? '#c9a574' : 'rgba(201, 165, 116, 0.3)',
                        height: `${Math.max(20, (data.revenue / Math.max(...csvLineData.map(d => d.revenue))) * 60)}px`,
                        borderRadius: '4px 4px 0 0',
                        transition: 'all 0.3s ease'
                      }} />
                      <span style={{
                        fontSize: '10px',
                        color: index === csvLineData.slice(-6).length - 1 ? '#c9a574' : 'rgba(255, 255, 255, 0.5)',
                        fontWeight: index === csvLineData.slice(-6).length - 1 ? '600' : '400'
                      }}>
                        {data.mes.substring(0, 3)}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '16px' }}>
                  <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '8px' }}>
                    Este mes tus artistas han generado
                  </p>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: '#c9a574' }}>
                    €{dashboardData.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Stats Card with Multiple Metrics */}
              <div style={{
                background: 'rgba(42, 63, 63, 0.6)',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(201, 165, 116, 0.15)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}>
                {/* Average Revenue per Artist - Más oscuro arriba */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Gráfico de barras difuminado dentro de Beneficios de BAM */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.15,
                    pointerEvents: 'none',
                    zIndex: 0
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { value: 45 },
                          { value: 52 },
                          { value: 38 },
                          { value: 65 },
                          { value: 48 },
                          { value: 72 },
                          { value: 58 },
                          { value: 68 }
                        ]}
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                      >
                        <Bar 
                          dataKey="value" 
                          fill="url(#bamBarGradient)"
                          radius={[4, 4, 0, 0]}
                        />
                        <defs>
                          <linearGradient id="bamBarGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#c9a574" stopOpacity={0.5} />
                            <stop offset="100%" stopColor="#c9a574" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px', fontWeight: '600', position: 'relative', zIndex: 2 }}>
                    Beneficios de Bam
                  </p>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#c9a574', marginBottom: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.3)', position: 'relative', zIndex: 2 }}>
                    €{artists.reduce((sum, artist) => {
                      const contract = contracts.find(c => c.artistId === artist.id);
                      const bamPercentage = contract ? (100 - contract.percentage) / 100 : 0.30;
                      return sum + ((artist.totalRevenue || 0) * bamPercentage);
                    }, 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p style={{ fontSize: '12px', color: '#4ade80', fontWeight: '500', position: 'relative', zIndex: 2 }}>
                    <ArrowUpRight size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Según porcentajes de contratos
                  </p>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(201, 165, 116, 0.15)', position: 'relative', zIndex: 1 }} />

                {/* Total Streams - Más gris abajo */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Gráfico de barras difuminado dentro de Beneficios de Artistas */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.1,
                    pointerEvents: 'none',
                    zIndex: 0
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { value: 38 },
                          { value: 55 },
                          { value: 42 },
                          { value: 58 },
                          { value: 51 },
                          { value: 65 },
                          { value: 48 },
                          { value: 60 }
                        ]}
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                      >
                        <Bar 
                          dataKey="value" 
                          fill="url(#artistBarGradient)"
                          radius={[4, 4, 0, 0]}
                        />
                        <defs>
                          <linearGradient id="artistBarGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#999999" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#999999" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '8px', fontWeight: '400', position: 'relative', zIndex: 2 }}>
                    Beneficio de Artistas
                  </p>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: 'rgba(201, 165, 116, 0.7)', marginBottom: '4px', position: 'relative', zIndex: 2 }}>
                    €{artists.reduce((sum, artist) => {
                      const contract = contracts.find(c => c.artistId === artist.id);
                      const artistPercentage = contract ? contract.percentage / 100 : 0.70;
                      return sum + ((artist.totalRevenue || 0) * artistPercentage);
                    }, 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p style={{ fontSize: '12px', color: 'rgba(74, 222, 128, 0.7)', position: 'relative', zIndex: 2 }}>
                    <ArrowUpRight size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Según porcentajes de contratos
                  </p>
                </div>
              </div>
            </div>

            {/* Segunda fila con caja izquierda y 3 cajas verticales a la derecha */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '16px',
              width: '100%'
            }}>
              {/* Primera línea: Columna izquierda (Info + Nueva) + Columna central (Cajas 1, 2, 3) + Columna derecha (Caja 4) */}
              <div style={{
                display: 'flex',
                gap: '4px',
                justifyContent: 'space-between',
                width: '100%'
              }}>
                {/* Columna izquierda: Información Adicional y Nueva Sección */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {/* Caja de Información Adicional */}
                  <div style={{
                    background: 'rgba(42, 63, 63, 0.3)',
                    borderRadius: '16px',
                    padding: '20px 32px',
                    border: '1px solid rgba(201, 165, 116, 0.2)',
                    backdropFilter: 'blur(10px)',
                    width: '870px',
                    height: '205px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#ffffff',
                      marginBottom: '16px'
                    }}>
                      Artistas Pendientes de Solicitud
                    </h3>
                    {artists.length > 0 ? (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        overflowY: 'auto',
                        maxHeight: '140px'
                      }}>
                        {artists.filter(artist => artist.totalRevenue > 0).map((artist, index) => (
                          <div key={artist.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            background: 'rgba(201, 165, 116, 0.1)',
                            borderRadius: '8px',
                            border: '1px solid rgba(201, 165, 116, 0.15)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: artist.photo ? `url(${artist.photo})` : '#c9a574',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#2a3f3f'
                              }}>
                                {!artist.photo && artist.name.charAt(0).toUpperCase()}
                              </div>
                              <span style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#ffffff'
                              }}>
                                {artist.name}
                              </span>
                            </div>
                            <span style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#c9a574'
                            }}>
                              €{artist.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        textAlign: 'center',
                        marginTop: '32px'
                      }}>
                        No hay artistas con royalties pendientes
                      </p>
                    )}
                  </div>

                  {/* Nueva Sección - Ventas del Último Año */}
                  <div style={{
                    background: 'rgba(42, 63, 63, 0.3)',
                    borderRadius: '16px',
                    padding: '20px 32px',
                    border: '1px solid rgba(201, 165, 116, 0.2)',
                    backdropFilter: 'blur(10px)',
                    width: '870px',
                    height: '418px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#ffffff',
                      marginBottom: '8px'
                    }}>
                      Ventas del Último Año
                    </h3>
                    <div style={{
                      display: 'flex',
                      gap: '24px',
                      marginBottom: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '12px',
                          height: '3px',
                          background: '#c9a574',
                          borderRadius: '2px'
                        }} />
                        <span style={{
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.8)'
                        }}>
                          Año actual
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '12px',
                          height: '3px',
                          background: 'rgba(255, 255, 255, 0.4)',
                          borderRadius: '2px',
                          backgroundImage: 'repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.4) 0px, rgba(255, 255, 255, 0.4) 4px, transparent 4px, transparent 8px)'
                        }} />
                        <span style={{
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.6)'
                        }}>
                          Año anterior
                        </span>
                      </div>
                    </div>
                    <div style={{ flexGrow: 1, width: '100%', minHeight: '300px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { month: 'Ene', actual: 45000, anterior: 38000 },
                            { month: 'Feb', actual: 52000, anterior: 42000 },
                            { month: 'Mar', actual: 48000, anterior: 45000 },
                            { month: 'Abr', actual: 61000, anterior: 49000 },
                            { month: 'May', actual: 55000, anterior: 51000 },
                            { month: 'Jun', actual: 67000, anterior: 54000 },
                            { month: 'Jul', actual: 72000, anterior: 58000 },
                            { month: 'Ago', actual: 68000, anterior: 62000 },
                            { month: 'Sep', actual: 74000, anterior: 65000 },
                            { month: 'Oct', actual: 79000, anterior: 68000 },
                            { month: 'Nov', actual: 83000, anterior: 71000 },
                            { month: 'Dic', actual: 91000, anterior: 76000 }
                          ]}
                          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                        >
                          <XAxis 
                            dataKey="month" 
                            stroke="rgba(255, 255, 255, 0.6)"
                            style={{ fontSize: '12px' }}
                          />
                          <YAxis 
                            stroke="rgba(255, 255, 255, 0.6)"
                            style={{ fontSize: '12px' }}
                            tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                          />
                          <Tooltip
                            contentStyle={{
                              background: 'rgba(42, 63, 63, 0.95)',
                              border: '1px solid rgba(201, 165, 116, 0.3)',
                              borderRadius: '8px',
                              color: '#ffffff'
                            }}
                            formatter={(value: any) => [`€${value.toLocaleString()}`, '']}
                            labelStyle={{ color: '#c9a574' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="actual" 
                            stroke="#c9a574" 
                            strokeWidth={2.5}
                            dot={{ fill: '#c9a574', r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Año actual"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="anterior" 
                            stroke="rgba(255, 255, 255, 0.4)" 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ fill: 'rgba(255, 255, 255, 0.4)', r: 3 }}
                            activeDot={{ r: 5 }}
                            name="Año anterior"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Columna central: Caja 1, Caja 2 y Caja 3 */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {/* Caja 1 - Solicitudes de Royalties */}
                  <div style={{
                    background: 'rgba(42, 63, 63, 0.3)',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    border: '1px solid rgba(201, 165, 116, 0.2)',
                    backdropFilter: 'blur(10px)',
                    width: '490px',
                    height: '205px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#ffffff',
                      marginBottom: '10px'
                    }}>
                      Solicitudes de Royalties
                    </h4>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      overflowY: 'auto',
                      flex: 1
                    }}>
                      {artists.length > 0 ? (
                        artists.slice(0, 3).map((artist, index) => (
                          <div key={artist.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 12px',
                            background: 'rgba(201, 165, 116, 0.1)',
                            borderRadius: '10px',
                            border: '1px solid rgba(201, 165, 116, 0.2)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                              <div style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '50%',
                                background: artist.photo ? `url(${artist.photo})` : '#c9a574',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#2a3f3f',
                                flexShrink: 0
                              }}>
                                {!artist.photo && artist.name.charAt(0).toUpperCase()}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: '#ffffff',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                  {artist.name}
                                </div>
                                <div style={{
                                  fontSize: '11px',
                                  color: 'rgba(255, 255, 255, 0.5)',
                                  marginTop: '2px'
                                }}>
                                  Hace {index + 1}h
                                </div>
                              </div>
                            </div>
                            <div style={{
                              fontSize: '13px',
                              fontWeight: '700',
                              color: '#c9a574',
                              whiteSpace: 'nowrap',
                              marginLeft: '12px'
                            }}>
                              €{artist.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontSize: '13px',
                          textAlign: 'center'
                        }}>
                          No hay solicitudes
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Caja 2 - Transferencias */}
                  <div style={{
                    background: 'rgba(42, 63, 63, 0.3)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid rgba(201, 165, 116, 0.2)',
                    backdropFilter: 'blur(10px)',
                    width: '490px',
                    height: '205px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                      {/* Icono */}
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.2), rgba(201, 165, 116, 0.1))',
                        border: '1px solid rgba(201, 165, 116, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <ArrowUpRight style={{
                          width: '26px',
                          height: '26px',
                          color: '#c9a574'
                        }} />
                      </div>

                      {/* Contenido */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        flex: 1
                      }}>
                        <h4 style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: 'rgba(255, 255, 255, 0.7)',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Transferencias Realizadas
                        </h4>
                        <div style={{
                          fontSize: '32px',
                          fontWeight: '700',
                          color: '#ffffff',
                          lineHeight: '1',
                          marginTop: '2px'
                        }}>
                          {artists.filter(a => a.totalRevenue > 0).length}
                        </div>
                        <p style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.5)',
                          marginTop: '2px'
                        }}>
                          Artistas con pagos procesados
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Caja 3 - Royalties Pendientes */}
                  <div style={{
                    background: 'rgba(42, 63, 63, 0.3)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid rgba(201, 165, 116, 0.2)',
                    backdropFilter: 'blur(10px)',
                    width: '490px',
                    height: '205px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                      {/* Icono */}
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(251, 191, 36, 0.1))',
                        border: '1px solid rgba(251, 191, 36, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Clock style={{
                          width: '26px',
                          height: '26px',
                          color: '#fbbf24'
                        }} />
                      </div>

                      {/* Contenido */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        flex: 1
                      }}>
                        <h4 style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: 'rgba(255, 255, 255, 0.7)',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Royalties Pendientes
                        </h4>
                        <div style={{
                          fontSize: '32px',
                          fontWeight: '700',
                          color: '#ffffff',
                          lineHeight: '1',
                          marginTop: '2px'
                        }}>
                          €{dashboardData.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </div>
                        <p style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.5)',
                          marginTop: '2px'
                        }}>
                          De plataformas de streaming
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Columna derecha: Caja 4 - Gross Profit */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {/* Caja 4 - Gross Profit (Tarjeta Vertical) */}
                  <div style={{
                    background: 'rgba(42, 63, 63, 0.4)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '2px solid rgba(42, 63, 63, 0.6)',
                    width: '290px',
                    height: '414px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(42, 63, 63, 0.3)'
                  }}>
                    {/* Decoración de fondo */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-30px',
                      right: '-30px',
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: 'rgba(0, 0, 0, 0.05)',
                      pointerEvents: 'none'
                    }} />

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      {/* Icono */}
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <TrendingUp style={{
                          width: '24px',
                          height: '24px',
                          color: '#5a8a8a'
                        }} />
                      </div>

                      {/* Contenido */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        flex: 1
                      }}>
                        <h4 style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: 'rgba(255, 255, 255, 0.7)',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Gross Profit
                        </h4>
                        <div style={{
                          fontSize: '32px',
                          fontWeight: '700',
                          color: '#c9a574',
                          lineHeight: '1',
                          marginTop: '2px'
                        }}>
                          €{artists.reduce((sum, artist) => {
                            const contract = contracts.find(c => c.artistId === artist.id);
                            const bamPercentage = contract ? (100 - contract.percentage) / 100 : 0.30;
                            return sum + ((artist.totalRevenue || 0) * bamPercentage);
                          }, 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          marginTop: '2px'
                        }}>
                          Ingresos BAM según contratos
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Caja 5 - Net Profit */}
                  <div style={{
                    background: 'rgba(42, 63, 63, 0.4)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '2px solid rgba(42, 63, 63, 0.6)',
                    width: '290px',
                    height: '205px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(42, 63, 63, 0.3)'
                  }}>
                    {/* Decoración de fondo */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-30px',
                      right: '-30px',
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: 'rgba(0, 0, 0, 0.05)',
                      pointerEvents: 'none'
                    }} />

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      {/* Icono */}
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <DollarSign style={{
                          width: '24px',
                          height: '24px',
                          color: '#5a8a8a'
                        }} />
                      </div>

                      {/* Contenido */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        flex: 1
                      }}>
                        <h4 style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: 'rgba(255, 255, 255, 0.7)',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          Net Profit
                        </h4>
                        <div style={{
                          fontSize: '32px',
                          fontWeight: '700',
                          color: '#c9a574',
                          lineHeight: '1',
                          marginTop: '2px'
                        }}>
                          €{(artists.reduce((sum, artist) => {
                            const contract = contracts.find(c => c.artistId === artist.id);
                            const bamPercentage = contract ? (100 - contract.percentage) / 100 : 0.30;
                            return sum + ((artist.totalRevenue || 0) * bamPercentage);
                          }, 0) * 0.85).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          marginTop: '2px'
                        }}>
                          Después de gastos operativos (15%)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        );
      
      case 'Subir CSV':
        return <CSVUploader />;
      
      case 'Finanzas':
        return <FinancesPanel dashboardData={dashboardData} artists={artists} />;
      
      case 'Artistas':
        return (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
              Artistas
            </h1>

            {/* Artists Grid */}
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
            ) : (
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
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.1)';
                          e.currentTarget.style.background = 'rgba(201, 165, 116, 1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.background = 'rgba(201, 165, 116, 0.95)';
                        }}
                      >
                        <Camera size={20} color="#ffffff" />
                      </label>
                      <input
                        id={`photo-upload-${artist.id}`}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handlePhotoChange(artist.id, e)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Artist Name */}
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>
                      {artist.name}
                    </h3>

                    {/* Stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#AFB3B7' }}>Revenue:</span>
                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#c9a574' }}>
                          {formatEuro(artist.totalRevenue)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#AFB3B7' }}>Streams:</span>
                        <span style={{ fontSize: '16px', fontWeight: '600', color: '#60a5fa' }}>
                          {artist.totalStreams.toLocaleString()}
                        </span>
                      </div>
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
            {/* Header with View Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                  Catálogo Musical
                </h1>
                <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
                  {tracks.length} canciones en total
                </p>
              </div>
              
              {/* View Mode Toggle */}
              <div style={{
                display: 'flex',
                gap: '8px',
                background: 'rgba(42, 63, 63, 0.4)',
                padding: '4px',
                borderRadius: '12px',
                border: '1px solid rgba(201, 165, 116, 0.2)'
              }}>
                <button
                  onClick={() => setCatalogViewMode('grid')}
                  style={{
                    padding: '8px 16px',
                    background: catalogViewMode === 'grid' ? 'rgba(201, 165, 116, 0.3)' : 'transparent',
                    border: catalogViewMode === 'grid' ? '1px solid rgba(201, 165, 116, 0.5)' : '1px solid transparent',
                    borderRadius: '8px',
                    color: catalogViewMode === 'grid' ? '#c9a574' : '#AFB3B7',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Grid3x3 size={16} />
                  Grid
                </button>
                <button
                  onClick={() => setCatalogViewMode('list')}
                  style={{
                    padding: '8px 16px',
                    background: catalogViewMode === 'list' ? 'rgba(201, 165, 116, 0.3)' : 'transparent',
                    border: catalogViewMode === 'list' ? '1px solid rgba(201, 165, 116, 0.5)' : '1px solid transparent',
                    borderRadius: '8px',
                    color: catalogViewMode === 'list' ? '#c9a574' : '#AFB3B7',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <List size={16} />
                  List
                </button>
              </div>
            </div>

            {/* Empty State */}
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
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Sube un archivo CSV para crear el catálogo automáticamente</p>
              </div>
            ) : catalogViewMode === 'grid' ? (
              /* GRID VIEW */
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px'
              }}>
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    style={{
                      background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                      border: '1px solid rgba(201, 165, 116, 0.2)',
                      borderRadius: '16px',
                      padding: '20px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.4)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Album Cover Placeholder */}
                    <div 
                      className="track-cover"
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.2) 0%, rgba(201, 165, 116, 0.05) 100%)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <Disc size={48} color="#c9a574" style={{ opacity: 0.4 }} />
                      
                      {/* Play/Upload Overlay */}
                      <div 
                        className="track-overlay"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0, 0, 0, 0.6)',
                          backdropFilter: 'blur(4px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        }}
                      >
                        {/* Play/Pause Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayPause(track.id, (track as any).audioUrl);
                          }}
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: playingTrackId === track.id ? 'rgba(239, 68, 68, 0.9)' : 'rgba(201, 165, 116, 0.9)',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {playingTrackId === track.id ? (
                            <Pause size={20} color="#fff" />
                          ) : (
                            <Play size={20} color="#fff" style={{ marginLeft: '2px' }} />
                          )}
                        </button>

                        {/* Upload Audio Button */}
                        <label style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: 'rgba(96, 165, 250, 0.9)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}>
                          <UploadCloud size={20} color="#fff" />
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={(e) => handleAudioUpload(track.id, e)}
                            style={{ display: 'none' }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Track Info */}
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {track.title}
                    </h3>

                    <p style={{
                      fontSize: '14px',
                      color: '#AFB3B7',
                      marginBottom: '12px'
                    }}>
                      {track.artistName}
                    </p>

                    {/* ISRC */}
                    {track.isrc && (
                      <code style={{
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        color: '#60a5fa',
                        background: 'rgba(96, 165, 250, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid rgba(96, 165, 250, 0.2)',
                        display: 'inline-block',
                        marginBottom: '12px'
                      }}>
                        {track.isrc}
                      </code>
                    )}

                    {/* Stats */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(201, 165, 116, 0.1)'
                    }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Streams</div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#4ade80' }}>
                          {track.totalStreams.toLocaleString()}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Revenue</div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#c9a574' }}>
                          {formatEuro(track.totalRevenue)}
                        </div>
                      </div>
                    </div>

                    {/* Platforms */}
                    <div style={{
                      display: 'flex',
                      gap: '4px',
                      flexWrap: 'wrap',
                      marginTop: '12px'
                    }}>
                      {track.platforms.slice(0, 2).map((platform, i) => (
                        <div
                          key={i}
                          style={{
                            padding: '4px 8px',
                            background: 'rgba(201, 165, 116, 0.1)',
                            borderRadius: '6px',
                            border: '1px solid rgba(201, 165, 116, 0.2)',
                            fontSize: '10px',
                            color: '#c9a574',
                            fontWeight: '500'
                          }}
                        >
                          {platform}
                        </div>
                      ))}
                      {track.platforms.length > 2 && (
                        <div style={{
                          padding: '4px 8px',
                          background: 'rgba(96, 165, 250, 0.1)',
                          borderRadius: '6px',
                          fontSize: '10px',
                          color: '#60a5fa',
                          fontWeight: '500'
                        }}>
                          +{track.platforms.length - 2}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* LIST VIEW */
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {tracks.map((track, index) => (
                    <div
                      key={track.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '50px 2fr 1.5fr 1fr 1fr 1fr 120px',
                        gap: '16px',
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'all 0.3s ease',
                        alignItems: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(201, 165, 116, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                      }}
                    >
                      {/* Play Button */}
                      <button
                        onClick={() => handlePlayPause(track.id, (track as any).audioUrl)}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: playingTrackId === track.id 
                            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(239, 68, 68, 0.1) 100%)'
                            : 'linear-gradient(135deg, rgba(201, 165, 116, 0.3) 0%, rgba(201, 165, 116, 0.1) 100%)',
                          border: playingTrackId === track.id
                            ? '1px solid rgba(239, 68, 68, 0.5)'
                            : '1px solid rgba(201, 165, 116, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {playingTrackId === track.id ? (
                          <Pause size={18} color="#ef4444" />
                        ) : (
                          <Play size={18} color="#c9a574" style={{ marginLeft: '2px' }} />
                        )}
                      </button>

                      {/* Title */}
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', marginBottom: '2px' }}>
                          {track.title}
                        </div>
                        {track.isrc && (
                          <code style={{
                            fontSize: '11px',
                            fontFamily: 'monospace',
                            color: '#60a5fa',
                            opacity: 0.7
                          }}>
                            {track.isrc}
                          </code>
                        )}
                      </div>

                      {/* Artist */}
                      <div style={{ fontSize: '14px', color: '#AFB3B7' }}>
                        {track.artistName}
                      </div>

                      {/* Streams */}
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#4ade80' }}>
                        {track.totalStreams.toLocaleString()}
                      </div>

                      {/* Revenue */}
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#c9a574' }}>
                        {formatEuro(track.totalRevenue)}
                      </div>

                      {/* Platforms */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                        {track.platforms.slice(0, 2).map((platform, i) => (
                          <div
                            key={i}
                            style={{
                              padding: '4px 6px',
                              background: 'rgba(201, 165, 116, 0.1)',
                              borderRadius: '4px',
                              fontSize: '10px',
                              color: '#c9a574',
                              fontWeight: '500'
                            }}
                          >
                            {platform}
                          </div>
                        ))}
                        {track.platforms.length > 2 && (
                          <div style={{
                            padding: '4px 6px',
                            background: 'rgba(96, 165, 250, 0.1)',
                            borderRadius: '4px',
                            fontSize: '10px',
                            color: '#60a5fa',
                            fontWeight: '500'
                          }}>
                            +{track.platforms.length - 2}
                          </div>
                        )}
                      </div>

                      {/* Upload Audio */}
                      <label style={{
                        padding: '8px 12px',
                        background: 'rgba(96, 165, 250, 0.1)',
                        border: '1px solid rgba(96, 165, 250, 0.3)',
                        borderRadius: '8px',
                        color: '#60a5fa',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.3s ease',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(96, 165, 250, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(96, 165, 250, 0.1)';
                      }}
                      >
                        <UploadCloud size={14} />
                        Audio
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => handleAudioUpload(track.id, e)}
                          style={{ display: 'none' }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CSS for Grid Hover Effect */}
            <style>{`
              .track-cover:hover .track-overlay {
                opacity: 1 !important;
              }
            `}</style>
          </div>
        );

      case 'Contratos':
        return (
          <div>
            {/* Header with Add Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                  Gestión de Contratos
                </h1>
                <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
                  {contracts.length} contratos registrados
                </p>
              </div>
              
              <button
                onClick={() => {
                  setEditingContract(null);
                  setShowContractModal(true);
                }}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #c9a574 0%, #b8956a 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(201, 165, 116, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 165, 116, 0.3)';
                }}
              >
                <Plus size={18} />
                Nuevo Contrato
              </button>
            </div>

            {/* Empty State */}
            {contracts.length === 0 ? (
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '16px',
                padding: '48px',
                textAlign: 'center'
              }}>
                <FileSignature size={48} color="#c9a574" style={{ margin: '0 auto 16px' }} />
                <p style={{ fontSize: '18px', color: '#AFB3B7', marginBottom: '8px' }}>No hay contratos registrados</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Crea un nuevo contrato para empezar</p>
              </div>
            ) : (
              /* Contracts List */
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {contracts.map((contract) => {
                  const statusConfig = {
                    active: { label: 'Activo', color: '#4ade80', bgColor: 'rgba(74, 222, 128, 0.1)' },
                    pending: { label: 'Pendiente', color: '#fbbf24', bgColor: 'rgba(251, 191, 36, 0.1)' },
                    expired: { label: 'Vencido', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' }
                  }[contract.status];

                  return (
                    <div
                      key={contract.id}
                      style={{
                        background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                        border: '1px solid rgba(201, 165, 116, 0.2)',
                        borderRadius: '16px',
                        padding: '24px',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px',
                        flexWrap: 'wrap'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.4)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Artist Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '250px' }}>
                        {contract.artistPhoto ? (
                          <img
                            src={contract.artistPhoto}
                            alt={contract.artistName}
                            style={{
                              width: '64px',
                              height: '64px',
                              borderRadius: '12px',
                              objectFit: 'cover',
                              border: '2px solid rgba(201, 165, 116, 0.3)'
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.3) 0%, rgba(201, 165, 116, 0.1) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid rgba(201, 165, 116, 0.3)'
                          }}>
                            <Users size={28} color="#c9a574" />
                          </div>
                        )}
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                            {contract.artistName}
                          </h3>
                          <p style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '6px' }}>
                            {contract.type} • {contract.territory}
                          </p>
                          {/* Status Badge */}
                          <div style={{
                            display: 'inline-flex',
                            padding: '4px 10px',
                            background: statusConfig.bgColor,
                            borderRadius: '6px',
                            border: `1px solid ${statusConfig.color}40`,
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <div style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: statusConfig.color
                            }} />
                            <span style={{ fontSize: '11px', fontWeight: '600', color: statusConfig.color }}>
                              {statusConfig.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Contract Stats */}
                      <div style={{
                        display: 'flex',
                        gap: '24px',
                        flex: 1,
                        flexWrap: 'wrap',
                        minWidth: '300px'
                      }}>
                        {/* Percentage */}
                        <div style={{ flex: '1 1 120px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                            <Percent size={14} color="#c9a574" />
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>Royalties</span>
                          </div>
                          <div style={{ fontSize: '24px', fontWeight: '700', color: '#c9a574' }}>
                            {contract.percentage}%
                          </div>
                        </div>

                        {/* Advance */}
                        <div style={{ flex: '1 1 120px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                            <DollarSign size={14} color="#4ade80" />
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>Anticipo</span>
                          </div>
                          <div style={{ fontSize: '24px', fontWeight: '700', color: '#4ade80' }}>
                            {formatEuro(contract.advancePayment)}
                          </div>
                        </div>

                        {/* Dates */}
                        <div style={{ flex: '1 1 200px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                            <Calendar size={14} color="#60a5fa" />
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>Vigencia</span>
                          </div>
                          <div style={{ fontSize: '13px', color: '#60a5fa', fontWeight: '600' }}>
                            {new Date(contract.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                          <div style={{ fontSize: '13px', color: '#60a5fa', fontWeight: '600' }}>
                            {new Date(contract.endDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                        <button
                          onClick={() => setSelectedContractView(contract)}
                          style={{
                            padding: '10px 16px',
                            background: 'rgba(96, 165, 250, 0.1)',
                            border: '1px solid rgba(96, 165, 250, 0.3)',
                            borderRadius: '10px',
                            color: '#60a5fa',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.3s ease',
                            whiteSpace: 'nowrap'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(96, 165, 250, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(96, 165, 250, 0.1)';
                          }}
                        >
                          <Eye size={14} />
                          Ver
                        </button>
                        <button
                          onClick={() => {
                            setEditingContract(contract);
                            setShowContractModal(true);
                          }}
                          style={{
                            padding: '10px 16px',
                            background: 'rgba(201, 165, 116, 0.1)',
                            border: '1px solid rgba(201, 165, 116, 0.3)',
                            borderRadius: '10px',
                            color: '#c9a574',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.3s ease',
                            whiteSpace: 'nowrap'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
                          }}
                        >
                          <Edit2 size={14} />
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar el contrato de ${contract.artistName}?`)) {
                              setContracts(prev => prev.filter(c => c.id !== contract.id));
                              setNotifications(prev => [{
                                id: Date.now(),
                                type: 'success',
                                title: 'Contrato Eliminado',
                                message: `El contrato de ${contract.artistName} ha sido eliminado`,
                                time: 'Ahora',
                                read: false
                              }, ...prev]);
                            }
                          }}
                          style={{
                            padding: '10px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '10px',
                            color: '#ef4444',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Modal para Ver Contrato */}
            {selectedContractView && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                  padding: '20px'
                }}
                onClick={() => setSelectedContractView(null)}
              >
                <div
                  style={{
                    background: 'linear-gradient(135deg, #2a3f3f 0%, #1e2f2f 100%)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '20px',
                    padding: '32px',
                    maxWidth: '600px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    position: 'relative'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setSelectedContractView(null)}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <X size={16} color="#ef4444" />
                  </button>

                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#c9a574', marginBottom: '24px' }}>
                    Detalles del Contrato
                  </h2>

                  {/* Artist */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', padding: '16px', background: 'rgba(201, 165, 116, 0.1)', borderRadius: '12px' }}>
                    {selectedContractView.artistPhoto && (
                      <img
                        src={selectedContractView.artistPhoto}
                        alt={selectedContractView.artistName}
                        style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }}
                      />
                    )}
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                        {selectedContractView.artistName}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
                        {selectedContractView.type} • {selectedContractView.territory}
                      </p>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ padding: '16px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Porcentaje de Royalties</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#c9a574' }}>
                        {selectedContractView.percentage}%
                      </div>
                    </div>
                    <div style={{ padding: '16px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Anticipo Pagado</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#4ade80' }}>
                        {formatEuro(selectedContractView.advancePayment)}
                      </div>
                    </div>
                    <div style={{ padding: '16px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Vigencia del Contrato</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#60a5fa' }}>
                        {new Date(selectedContractView.startDate).toLocaleDateString('es-ES')} - {new Date(selectedContractView.endDate).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                    <div style={{ padding: '16px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Términos del Contrato</div>
                      <div style={{ fontSize: '14px', color: '#AFB3B7', lineHeight: '1.6' }}>
                        {selectedContractView.terms}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal para Crear/Editar Contrato - TODO: Implementar */}
            {showContractModal && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                  padding: '20px'
                }}
                onClick={() => setShowContractModal(false)}
              >
                <div
                  style={{
                    background: 'linear-gradient(135deg, #2a3f3f 0%, #1e2f2f 100%)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '20px',
                    padding: '32px',
                    maxWidth: '600px',
                    width: '100%',
                    textAlign: 'center'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <FileSignature size={48} color="#c9a574" style={{ margin: '0 auto 16px' }} />
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>
                    Formulario de Contrato
                  </h2>
                  <p style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '24px' }}>
                    Esta funcionalidad se implementará próximamente
                  </p>
                  <button
                    onClick={() => setShowContractModal(false)}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #c9a574 0%, #b8956a 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'Configuración':
        return <ConfigurationPanel onSaveNotification={(notification) => {
          setNotifications(prev => [notification, ...prev]);
        }} />;
      
      default:
        return (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
              {activeTab}
            </h1>
            <div style={{
              background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '16px', color: '#AFB3B7' }}>Sección en construcción</p>
            </div>
          </div>
        );
    }
  };

  // Si hay un artista seleccionado, mostrar solo el ArtistPortal (sin el layout del dashboard)
  if (selectedArtist) {
    const artistTracks = tracks.filter(t => t.artistId === selectedArtist.id);
    
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
    
    const artistData = {
      id: selectedArtist.id,
      name: selectedArtist.name,
      email: selectedArtist.email || '',
      photo: selectedArtist.photo,
      totalRevenue: selectedArtist.totalRevenue,
      totalStreams: selectedArtist.totalStreams,
      tracks: artistTracks,
      monthlyData: dashboardData.monthlyData,
      platformBreakdown
    };
    
    return (
      <div style={{ position: 'relative' }}>
        {/* Flecha blanca minimalista para volver al panel de artistas */}
        <button
          onClick={() => setSelectedArtist(null)}
          style={{
            position: 'fixed',
            top: '100px',
            left: '32px',
            zIndex: 1000,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-4px)';
            e.currentTarget.style.opacity = '0.7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.opacity = '1';
          }}
        >
          <ArrowLeft size={32} color="#ffffff" strokeWidth={2.5} />
        </button>
        
        <ArtistPortal 
          onLogout={() => setSelectedArtist(null)}
          artistData={artistData}
        />
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* IMAGEN DE FONDO GLOBAL - cubre todo el ancho */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        opacity: 0.6,
        zIndex: 0
      }} />

      {/* OVERLAY VERDE GLOBAL - aplicado a toda la imagen */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(13, 31, 35, 0.85) 0%, rgba(19, 46, 53, 0.8) 50%, rgba(45, 74, 83, 0.75) 100%)',
        backdropFilter: 'blur(2px)',
        zIndex: 0
      }} />

      {/* CAPA DE TINTE VERDE GLOBAL */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(32, 64, 64, 0.4)',
        mixBlendMode: 'multiply' as const,
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={{
          background: isScrolled ? 'rgba(20, 35, 35, 0.95)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(10px)' : 'blur(0px)',
          borderBottom: '1px solid rgba(201, 165, 116, 0.2)',
          padding: isScrolled ? '8px 32px' : '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: 'all 0.3s ease',
          boxShadow: isScrolled ? '0 4px 24px rgba(0, 0, 0, 0.4)' : 'none',
          transform: showHeader ? 'translateY(0)' : 'translateY(-100%)',
          opacity: showHeader ? 1 : 0
        }}>
          <img 
            src={logoImage}
            alt="BIGARTIST"
            style={{
              height: isScrolled ? '30px' : '40px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px rgba(201, 165, 116, 0.2))',
              transition: 'height 0.3s ease'
            }}
          />

          <div style={{ display: 'flex', gap: '8px', flex: 1, overflowX: 'auto' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  style={{
                    padding: isScrolled ? '6px 14px' : '8px 16px',
                    background: activeTab === tab.name ? 'rgba(201, 165, 116, 0.2)' : 'transparent',
                    border: activeTab === tab.name ? '1px solid rgba(201, 165, 116, 0.4)' : '1px solid transparent',
                    borderRadius: '12px',
                    color: activeTab === tab.name ? '#c9a574' : '#AFB3B7',
                    fontSize: isScrolled ? '12px' : '13px',
                    fontWeight: activeTab === tab.name ? '600' : '400',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Icon size={isScrolled ? 14 : 15} />
                  {tab.name}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }} ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  width: isScrolled ? '36px' : '40px',
                  height: isScrolled ? '36px' : '40px',
                  borderRadius: '50%',
                  background: 'rgba(201, 165, 116, 0.1)',
                  border: '1px solid rgba(201, 165, 116, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c9a574',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}
              >
                <Bell size={isScrolled ? 16 : 18} />
                {notifications.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {notifications.length}
                  </div>
                )}
              </button>

              {/* Notification Panel */}
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  right: 0,
                  width: '380px',
                  maxHeight: '500px',
                  background: 'linear-gradient(135deg, rgba(20, 35, 35, 0.98) 0%, rgba(15, 30, 30, 0.98) 100%)',
                  border: '1px solid rgba(201, 165, 116, 0.3)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(20px)',
                  overflow: 'hidden',
                  zIndex: 1000
                }}>
                  {/* Header */}
                  <div style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid rgba(201, 165, 116, 0.2)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                      Notificaciones
                    </h3>
                    <div style={{ fontSize: '12px', color: '#AFB3B7' }}>
                      {notifications.length} nuevas
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div style={{
                    maxHeight: '420px',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                  }}>
                    {notifications.length === 0 ? (
                      <div style={{
                        padding: '48px 20px',
                        textAlign: 'center',
                        color: '#AFB3B7'
                      }}>
                        <Bell size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                        <p style={{ fontSize: '14px' }}>No hay notificaciones</p>
                      </div>
                    ) : (
                      notifications.map((notif) => {
                        const { icon: IconComponent, color } = getNotificationIcon(notif.type);
                        return (
                          <div
                            key={notif.id}
                            style={{
                              padding: '16px 20px',
                              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                              background: notif.read ? 'transparent' : 'rgba(201, 165, 116, 0.05)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              position: 'relative'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = notif.read ? 'transparent' : 'rgba(201, 165, 116, 0.05)';
                            }}
                            onClick={() => markAsRead(notif.id)}
                          >
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                              {/* Icon */}
                              <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                background: `${color}15`,
                                border: `1px solid ${color}40`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                <IconComponent size={18} color={color} />
                              </div>

                              {/* Content */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: '#ffffff',
                                  marginBottom: '4px'
                                }}>
                                  {notif.title}
                                </div>
                                <div style={{
                                  fontSize: '13px',
                                  color: '#AFB3B7',
                                  marginBottom: '6px',
                                  lineHeight: '1.4'
                                }}>
                                  {notif.message}
                                </div>
                                <div style={{
                                  fontSize: '12px',
                                  color: '#6b7280'
                                }}>
                                  {notif.time}
                                </div>
                              </div>

                              {/* Delete Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notif.id);
                                }}
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '6px',
                                  background: 'transparent',
                                  border: 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  color: '#6b7280',
                                  transition: 'all 0.2s ease',
                                  flexShrink: 0
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                  e.currentTarget.style.color = '#ef4444';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'transparent';
                                  e.currentTarget.style.color = '#6b7280';
                                }}
                              >
                                <X size={14} />
                              </button>
                            </div>

                            {/* Unread Indicator */}
                            {!notif.read && (
                              <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '8px',
                                transform: 'translateY(-50%)',
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: '#c9a574'
                              }} />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onLogout}
              style={{
                padding: isScrolled ? '8px 12px' : '10px 16px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                color: '#ef4444',
                fontSize: isScrolled ? '13px' : '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              <LogOut size={isScrolled ? 14 : 16} />
              Salir
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main style={{
          padding: '0 0 40px 0',
          paddingTop: '75px',
          width: '100%',
          minHeight: 'calc(100vh - 80px)'
        }}>
          {renderContent()}
        </main>

        {/* Footer */}
        <footer style={{
          position: 'relative',
          marginTop: '60px',
          padding: '20px 40px'
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto'
          }}>
            {/* Bottom Section */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div style={{
                fontSize: '12px',
                color: 'rgba(175, 179, 183, 0.6)'
              }}>
                © 2026 BIGARTIST ROYALTIES. Todos los derechos reservados.
              </div>
              <div style={{
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap'
              }}>
                {['Política de Privacidad', 'Términos y Condiciones', 'Cookies'].map((link, i) => (
                  <a
                    key={i}
                    href="#"
                    style={{
                      fontSize: '12px',
                      color: 'rgba(175, 179, 183, 0.6)',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#c9a574'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(175, 179, 183, 0.6)'}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}