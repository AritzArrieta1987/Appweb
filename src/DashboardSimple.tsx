import { useState, useEffect, useRef } from 'react';
import { Bell, BarChart3, Users, Music, FileText, Upload, Settings, LogOut, TrendingUp, DollarSign, Database, PieChart, Disc, CheckCircle, AlertCircle, Info, X, ArrowLeft, Camera, Grid3x3, List, Play, Pause, UploadCloud, Clock, Plus, Edit2, Trash2, Calendar, Percent, Eye, FileSignature, User, Mail, Phone, Globe, MapPin, Lock, Shield, Save, Volume2, VolumeX, Wallet, ArrowUpRight, ArrowDownRight, Download, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import CSVUploader from './components/CSVUploader';
import WorldMap from './components/WorldMap';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { FinancesPanel } from './components/FinancesPanel';
import ArtistPortal from './components/ArtistPortal';
import { useData } from './components/DataContext';
import { NewContractModal } from './components/NewContractModal';

interface DashboardProps {
  onLogout: () => void;
  sharedPaymentRequests?: any[];
  setSharedPaymentRequests?: (requests: any[]) => void;
  sharedNotifications?: any[];
  setSharedNotifications?: (notifications: any[]) => void;
}

export default function DashboardSimple({ 
  onLogout, 
  sharedPaymentRequests, 
  setSharedPaymentRequests,
  sharedNotifications,
  setSharedNotifications 
}: DashboardProps) {
  const { artists, tracks, dashboardData, uploadedFiles } = useData();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Usar notificaciones compartidas si están disponibles, sino usar estado local
  const [localNotifications, setLocalNotifications] = useState([
    { id: 1, type: 'success', title: 'CSV Procesado', message: 'Se han importado 15 canciones correctamente', time: 'Hace 5 min', read: false },
    { id: 2, type: 'info', title: 'Nuevo Artista', message: 'Se ha añadido un nuevo artista al catálogo', time: 'Hace 1 hora', read: false },
    { id: 3, type: 'warning', title: 'Actualización Pendiente', message: 'Hay datos pendientes de sincronizar', time: 'Hace 2 horas', read: false }
  ]);
  const notifications = sharedNotifications || localNotifications;
  const setNotifications = setSharedNotifications || setLocalNotifications;
  
  const notificationRef = useRef<HTMLDivElement>(null);
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
  const [contractsView, setContractsView] = useState<'grid' | 'list'>('grid');
  const [showNewContractModal, setShowNewContractModal] = useState(false);
  const [newContract, setNewContract] = useState({
    artistId: '',
    percentage: 70,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // 1 año después
    serviceType: 'Distribución', // Pre-seleccionado
    amount: 0
  });
  const [showArtistContractsModal, setShowArtistContractsModal] = useState(false);
  const [selectedArtistContracts, setSelectedArtistContracts] = useState<any[]>([]);
  const [expandedArtistId, setExpandedArtistId] = useState<number | null>(null);
  
  // Usar solicitudes de pago compartidas si están disponibles, sino usar estado local
  const [localPaymentRequests, setLocalPaymentRequests] = useState<any[]>([
    { 
      id: 1, 
      artistId: 1,
      artistName: 'J Balvin', 
      artistPhoto: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      firstName: 'José',
      lastName: 'Álvaro Osorio Balvín',
      amount: 5420.50, 
      status: 'pending', 
      date: '2025-02-10', 
      method: 'Transferencia Bancaria', 
      accountNumber: 'ES91 2100 0418 4502 0005 1332' 
    },
    { 
      id: 2, 
      artistId: 2,
      artistName: 'Bad Bunny', 
      artistPhoto: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
      firstName: 'Benito',
      lastName: 'Antonio Martínez Ocasio',
      amount: 8750.00, 
      status: 'pending', 
      date: '2025-02-08', 
      method: 'Transferencia Bancaria', 
      accountNumber: 'ES76 0049 5103 4128 1012 3456' 
    },
    { 
      id: 3, 
      artistId: 3,
      artistName: 'Rosalía', 
      artistPhoto: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400',
      firstName: 'Rosalía',
      lastName: 'Vila Tobella',
      amount: 3200.00, 
      status: 'completed', 
      date: '2025-01-28', 
      method: 'Transferencia Bancaria', 
      accountNumber: 'ES65 2100 5000 1212 3456 7890' 
    }
  ]);
  const paymentRequests = sharedPaymentRequests || localPaymentRequests;
  const setPaymentRequests = setSharedPaymentRequests || setLocalPaymentRequests;

  // Sincronizar artistas locales con los del contexto
  useEffect(() => {
    setLocalArtists(artists);
  }, [artists]);

  // Cargar contratos desde backend
  useEffect(() => {
    const loadContracts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/contracts');
        if (response.ok) {
          const data = await response.json();
          setContracts(data);
        }
      } catch (error) {
        console.log('Backend not available, using mock data');
        // Si hay error, usar mock solo al inicio
        if (artists.length > 0) {
          const mockContracts = artists.map((artist, index) => ({
            id: index + 1,
            artistId: artist.id,
            artistName: artist.name,
            artistPhoto: artist.photo,
            percentage: index === 0 ? 70 : 60,
            startDate: '2024-01-01',
            endDate: '2026-12-31',
            status: 'active',
            type: 'Exclusivo',
            serviceType: index === 0 ? 'Distribución' : index === 1 ? 'Sello Discográfico' : 'Management',
            territory: 'Mundial',
            advancePayment: index === 0 ? 5000 : 3000,
            terms: 'Contrato de distribución musical con participación en royalties de streaming y ventas digitales.',
            createdAt: '2024-01-01'
          }));
          setContracts(mockContracts);
        }
      }
    };
    
    if (contracts.length === 0) {
      loadContracts();
    }
  }, [artists]);

  // Función para guardar cambios en contrato
  const handleSaveContract = (updatedContract: any) => {
    setContracts(prevContracts => 
      prevContracts.map(c => c.id === updatedContract.id ? updatedContract : c)
    );
    setEditingContract(null);
  };

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
          <div style={{ padding: '4px 16px' }}>
            {/* Grid 4 columnas - Cards solas sin contenedor */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: '16px',
              alignItems: 'stretch',
              width: '100%'
            }}>
                  {/* Card 1: Ingresos Totales */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.12) 0%, rgba(201, 165, 116, 0.05) 100%)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(201, 165, 116, 0.25)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(201, 165, 116, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <TrendingUp size={18} color="#c9a574" />
                      </div>
                      <p style={{ 
                        fontSize: '11px', 
                        color: 'rgba(255, 255, 255, 0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                        fontWeight: '600'
                      }}>
                        Ingresos
                      </p>
                    </div>
                    
                    <div style={{ 
                      fontSize: '28px', 
                      fontWeight: '800', 
                      color: '#c9a574',
                      lineHeight: '1',
                      marginBottom: '6px'
                    }}>
                      €{dashboardData.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11px'
                    }}>
                      <span style={{ 
                        color: '#10b981',
                        fontWeight: '700'
                      }}>
                        +12.5%
                      </span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                        vs anterior
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Beneficios BAM */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.12) 0%, rgba(201, 165, 116, 0.05) 100%)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(201, 165, 116, 0.25)',
                    position: 'relative'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(201, 165, 116, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <DollarSign size={18} color="#c9a574" />
                      </div>
                      <p style={{ 
                        fontSize: '11px', 
                        color: 'rgba(255, 255, 255, 0.7)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                        fontWeight: '600'
                      }}>
                        BAM
                      </p>
                    </div>
                    
                    <div style={{ 
                      fontSize: '28px', 
                      fontWeight: '800', 
                      color: '#c9a574',
                      lineHeight: '1',
                      marginBottom: '6px'
                    }}>
                      €{artists.reduce((sum, artist) => {
                        const contract = contracts.find(c => c.artistId === artist.id);
                        const bamPercentage = contract ? (100 - contract.percentage) / 100 : 0.30;
                        return sum + ((artist.totalRevenue || 0) * bamPercentage);
                      }, 0).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                    
                    <div style={{ 
                      fontSize: '11px', 
                      color: 'rgba(255, 255, 255, 0.5)'
                    }}>
                      30% comisión
                    </div>
                  </div>

                  {/* Card 3: Beneficios Artistas */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    position: 'relative'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Users size={18} color="rgba(201, 165, 116, 0.8)" />
                      </div>
                      <p style={{ 
                        fontSize: '11px', 
                        color: 'rgba(255, 255, 255, 0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                        fontWeight: '600'
                      }}>
                        Artistas
                      </p>
                    </div>
                    
                    <div style={{ 
                      fontSize: '28px', 
                      fontWeight: '800', 
                      color: 'rgba(201, 165, 116, 0.9)',
                      lineHeight: '1',
                      marginBottom: '6px'
                    }}>
                      €{artists.reduce((sum, artist) => {
                        const contract = contracts.find(c => c.artistId === artist.id);
                        const artistPercentage = contract ? contract.percentage / 100 : 0.70;
                        return sum + ((artist.totalRevenue || 0) * artistPercentage);
                      }, 0).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                    
                    <div style={{ 
                      fontSize: '11px', 
                      color: 'rgba(255, 255, 255, 0.5)'
                    }}>
                      70% royalties
                    </div>
                  </div>

                  {/* Card 4: Tendencia con línea */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.15)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(201, 165, 116, 0.15)'
                  }}>
                    <p style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '16px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px'
                    }}>
                      Últimos 6 Meses
                    </p>
                    <div style={{
                      height: '70px',
                      position: 'relative',
                      paddingBottom: '20px'
                    }}>
                      {/* SVG para la línea de tendencia */}
                      <svg style={{
                        position: 'absolute',
                        width: '100%',
                        height: '70px',
                        top: 0,
                        left: 0
                      }} viewBox="0 0 100 70" preserveAspectRatio="none">
                        {/* Línea de tendencia */}
                        <polyline
                          points={csvLineData.slice(-6).map((data: any, index: number) => {
                            const x = (index / (csvLineData.slice(-6).length - 1)) * 100;
                            const y = 70 - ((data.revenue / Math.max(...csvLineData.slice(-6).map((d: any) => d.revenue))) * 60);
                            return `${x},${y}`;
                          }).join(' ')}
                          fill="none"
                          stroke="#c9a574"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Área bajo la línea con gradiente */}
                        <polygon
                          points={`0,70 ${csvLineData.slice(-6).map((data: any, index: number) => {
                            const x = (index / (csvLineData.slice(-6).length - 1)) * 100;
                            const y = 70 - ((data.revenue / Math.max(...csvLineData.slice(-6).map((d: any) => d.revenue))) * 60);
                            return `${x},${y}`;
                          }).join(' ')} 100,70`}
                          fill="url(#lineGradient)"
                        />
                        <defs>
                          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(201, 165, 116, 0.3)" />
                            <stop offset="100%" stopColor="rgba(201, 165, 116, 0.05)" />
                          </linearGradient>
                        </defs>
                      </svg>
                      
                      {/* Puntos en la línea */}
                      <svg style={{
                        position: 'absolute',
                        width: '100%',
                        height: '70px',
                        top: 0,
                        left: 0,
                        pointerEvents: 'none'
                      }} viewBox="0 0 100 70">
                        {csvLineData.slice(-6).map((data: any, index: number) => {
                          const x = (index / (csvLineData.slice(-6).length - 1)) * 100;
                          const y = 70 - ((data.revenue / Math.max(...csvLineData.slice(-6).map((d: any) => d.revenue))) * 60);
                          const isLast = index === csvLineData.slice(-6).length - 1;
                          return (
                            <circle
                              key={index}
                              cx={x}
                              cy={y}
                              r={isLast ? "2.5" : "1.5"}
                              fill={isLast ? "#c9a574" : "rgba(201, 165, 116, 0.6)"}
                              style={{
                                filter: isLast ? 'drop-shadow(0 0 4px rgba(201, 165, 116, 0.8))' : 'none'
                              }}
                            />
                          );
                        })}
                      </svg>
                      
                      {/* Labels de meses */}
                      <div style={{
                        position: 'absolute',
                        bottom: '-20px',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingLeft: '2px',
                        paddingRight: '2px'
                      }}>
                        {csvLineData.slice(-6).map((data: any, index: number) => (
                          <span key={index} style={{
                            fontSize: '9px',
                            color: index === csvLineData.slice(-6).length - 1 ? '#c9a574' : 'rgba(255, 255, 255, 0.4)',
                            fontWeight: index === csvLineData.slice(-6).length - 1 ? '700' : '500'
                          }}>
                            {data.mes.substring(0, 3)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
            </div>

            {/* CATÁLOGO MUSICAL - Debajo de las cards */}
            <div style={{ marginTop: '32px' }}>
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

            {/* NUEVAS CAJAS DEBAJO DEL CATÁLOGO */}
            <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {/* Caja 1 - Estadísticas de Reproducción */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '16px',
                padding: '24px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.4)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(201, 165, 116, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(201, 165, 116, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <BarChart3 size={24} color="#c9a574" />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff' }}>Estadísticas de Reproducción</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#AFB3B7' }}>Total Streams</p>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>
                      {tracks.reduce((sum, track) => sum + track.totalStreams, 0).toLocaleString('es-ES')}
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#AFB3B7' }}>Promedio por Canción</p>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: '#c9a574' }}>
                      {tracks.length > 0 ? Math.round(tracks.reduce((sum, track) => sum + track.totalStreams, 0) / tracks.length).toLocaleString('es-ES') : '0'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#AFB3B7' }}>Total Canciones</p>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>
                      {tracks.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Caja 2 - Ingresos del Catálogo */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '16px',
                padding: '24px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.4)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(201, 165, 116, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(201, 165, 116, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <TrendingUp size={24} color="#c9a574" />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff' }}>Ingresos del Catálogo</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#AFB3B7' }}>Revenue Total</p>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: '#c9a574' }}>
                      €{tracks.reduce((sum, track) => sum + track.totalRevenue, 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#AFB3B7' }}>Promedio por Canción</p>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>
                      €{tracks.length > 0 ? (tracks.reduce((sum, track) => sum + track.totalRevenue, 0) / tracks.length).toLocaleString('es-ES', { minimumFractionDigits: 2 }) : '0.00'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#AFB3B7' }}>Top Track Revenue</p>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: '#c9a574' }}>
                      €{tracks.length > 0 ? Math.max(...tracks.map(t => t.totalRevenue)).toLocaleString('es-ES', { minimumFractionDigits: 2 }) : '0.00'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* TOP 3 ARTISTAS */}
            <div style={{ marginTop: '32px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '16px',
                padding: '24px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.4)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(201, 165, 116, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(201, 165, 116, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Users size={24} color="#c9a574" />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff' }}>Top 3 Artistas</h3>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {localArtists
                    .sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
                    .slice(0, 3)
                    .map((artist, index) => {
                      return (
                        <div key={artist.id} style={{
                          background: 'rgba(42, 63, 63, 0.3)',
                          borderRadius: '12px',
                          padding: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          border: '1px solid rgba(201, 165, 116, 0.2)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(42, 63, 63, 0.5)';
                          e.currentTarget.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(42, 63, 63, 0.3)';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}>
                          {/* Artist Photo */}
                          <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: '2px solid rgba(201, 165, 116, 0.3)',
                            flexShrink: 0
                          }}>
                            {artist.photo ? (
                              <img 
                                src={artist.photo} 
                                alt={artist.name}
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'cover' 
                                }} 
                              />
                            ) : (
                              <div style={{
                                width: '100%',
                                height: '100%',
                                background: 'rgba(201, 165, 116, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <User size={28} color="#c9a574" />
                              </div>
                            )}
                          </div>

                          {/* Artist Info */}
                          <div style={{ flex: 1 }}>
                            <p style={{ 
                              fontSize: '16px', 
                              fontWeight: '600', 
                              color: '#ffffff',
                              marginBottom: '4px'
                            }}>
                              {artist.name}
                            </p>
                            <p style={{ fontSize: '13px', color: '#AFB3B7' }}>
                              {artist.email || 'Sin email'}
                            </p>
                          </div>

                          {/* Revenue */}
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ 
                              fontSize: '20px', 
                              fontWeight: '700', 
                              color: '#c9a574',
                              marginBottom: '4px'
                            }}>
                              €{(artist.totalRevenue || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                            </p>
                            <p style={{ fontSize: '12px', color: '#AFB3B7' }}>
                              Total Revenue
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  
                  {localArtists.length === 0 && (
                    <div style={{
                      padding: '32px',
                      textAlign: 'center',
                      color: '#AFB3B7'
                    }}>
                      <Users size={48} color="rgba(201, 165, 116, 0.3)" style={{ marginBottom: '12px' }} />
                      <p>No hay artistas registrados</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* WORLD MAP - Distribución Global de Royalties */}
            <div style={{ marginTop: '32px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '16px',
                padding: '24px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.4)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(201, 165, 116, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(201, 165, 116, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Globe size={24} color="#c9a574" />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff' }}>Distribución Global de Royalties</h3>
                </div>
                
                {/* WorldMap Component */}
                <div style={{ minHeight: '450px' }}>
                  <WorldMap territoryData={dashboardData.territoryBreakdown} />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'Subir CSV':
        return <CSVUploader />;
      
      case 'Finanzas':
        return <FinancesPanel dashboardData={dashboardData} artists={artists} uploadedFiles={uploadedFiles} paymentRequests={paymentRequests} setPaymentRequests={setPaymentRequests} notifications={notifications} setNotifications={setNotifications} />;
      
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
          <div style={{ padding: '24px' }}>
            {/* Simple Header with View Toggle */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                  Contratos
                </h2>
                <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
                  {contracts.length} contratos activos · {contracts.filter(c => new Date(c.endDate) < new Date()).length} expirados
                  {contracts.length > 0 && (
                    <span style={{ marginLeft: '8px', fontSize: '12px', opacity: 0.7 }}>
                      ({Array.from(new Set(contracts.map(c => c.serviceType))).join(', ')})
                    </span>
                  )}
                </p>
              </div>
              
              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {/* New Contract Button */}
                <button
                  onClick={() => setShowNewContractModal(true)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #c9a574, #d4b684)',
                    border: 'none',
                    color: '#1a2332',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(201, 165, 116, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Plus size={18} />
                  Nuevo Contrato
                </button>
                
                {/* View Toggle Buttons */}
                <div style={{ 
                  display: 'flex', 
                  gap: '8px',
                  background: 'rgba(42, 63, 63, 0.4)',
                  padding: '6px',
                  borderRadius: '12px',
                  border: '1px solid rgba(201, 165, 116, 0.2)'
                }}>
                <button
                  onClick={() => setContractsView('grid')}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: contractsView === 'grid' ? 'linear-gradient(135deg, #c9a574, #d4b684)' : 'transparent',
                    border: 'none',
                    color: contractsView === 'grid' ? '#1a2332' : 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Grid3x3 size={18} />
                  Grid
                </button>
                <button
                  onClick={() => setContractsView('list')}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: contractsView === 'list' ? 'linear-gradient(135deg, #c9a574, #d4b684)' : 'transparent',
                    border: 'none',
                    color: contractsView === 'list' ? '#1a2332' : 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <List size={18} />
                  Lista
                </button>
              </div>
              </div>
            </div>

            {/* Info Banner - Multiple Contracts */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.1), rgba(42, 63, 63, 0.4))',
              border: '1px solid rgba(201, 165, 116, 0.3)',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(201, 165, 116, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <FileText size={20} color="#c9a574" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600', marginBottom: '4px' }}>
                  🎯 Contratos Múltiples por Artista
                </p>
                <p style={{ fontSize: '13px', color: '#AFB3B7', lineHeight: '1.5' }}>
                  Cada artista puede tener <span style={{ color: '#c9a574', fontWeight: '600' }}>varios contratos simultáneos</span> (Distribución, Editorial, Management, Sello Discográfico, Conciertos) con <span style={{ color: '#c9a574', fontWeight: '600' }}>porcentajes independientes</span>. Haz clic en el botón <Plus size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> para añadir más contratos.
                </p>
              </div>
            </div>

            {/* Contracts Grid/List - Grouped by Artist */}
            <div style={{
              display: contractsView === 'grid' ? 'grid' : 'flex',
              gridTemplateColumns: contractsView === 'grid' ? 'repeat(auto-fill, minmax(420px, 1fr))' : undefined,
              flexDirection: contractsView === 'list' ? 'column' : undefined,
              gap: '24px'
            }}>
              {/* Group contracts by artist */}
              {(() => {
                console.log('📋 Total contratos en el estado:', contracts.length, contracts);
                return Array.from(new Set(contracts.map(c => c.artistId)));
              })().map((artistId) => {
                const artistContracts = contracts.filter(c => c.artistId === artistId).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
                const mainContract = artistContracts[0];
                const artist = artists.find(a => a.id === artistId);
                const hasMultipleContracts = artistContracts.length > 1;
                const isExpanded = expandedArtistId === artistId;
                
                // Debug: mostrar cuántos contratos tiene este artista
                console.log(`👤 Artista ${artist?.name} (ID: ${artistId}):`, artistContracts.length, 'contratos', artistContracts.map(c => ({ id: c.id, type: c.serviceType, percentage: c.percentage })));
                
                // Check if any contract is expired or expiring soon
                const hasExpiredContract = artistContracts.some(c => new Date(c.endDate) < new Date());
                const hasExpiringSoonContract = artistContracts.some(c => {
                  const days = Math.ceil((new Date(c.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return days > 0 && days <= 30;
                });
                
                return (
                  <div key={artistId} style={{
                    background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                    border: `2px solid ${hasExpiredContract ? 'rgba(239, 68, 68, 0.4)' : hasExpiringSoonContract ? 'rgba(251, 191, 36, 0.4)' : 'rgba(201, 165, 116, 0.2)'}`,
                    borderRadius: '16px',
                    padding: '24px',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = contractsView === 'grid' ? 'translateY(-4px)' : 'translateX(4px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(201, 165, 116, 0.2)';
                    e.currentTarget.style.borderColor = hasExpiredContract ? 'rgba(239, 68, 68, 0.6)' : hasExpiringSoonContract ? 'rgba(251, 191, 36, 0.6)' : 'rgba(201, 165, 116, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = hasExpiredContract ? 'rgba(239, 68, 68, 0.4)' : hasExpiringSoonContract ? 'rgba(251, 191, 36, 0.4)' : 'rgba(201, 165, 116, 0.2)';
                  }}>
                    
                    {/* Artist Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                      <div style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        border: '2px solid rgba(201, 165, 116, 0.3)',
                        flexShrink: 0
                      }}>
                        {artist?.photo ? (
                          <img 
                            src={artist.photo} 
                            alt={artist.name}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover' 
                            }} 
                          />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            background: 'rgba(201, 165, 116, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <User size={36} color="#c9a574" />
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>
                            {artist?.name || 'Artista Desconocido'}
                          </h3>
                          <div style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '700',
                            background: hasMultipleContracts && !isExpanded 
                              ? 'linear-gradient(135deg, rgba(201, 165, 116, 0.4), rgba(201, 165, 116, 0.3))'
                              : 'linear-gradient(135deg, rgba(201, 165, 116, 0.3), rgba(201, 165, 116, 0.2))',
                            color: '#c9a574',
                            border: `1px solid ${hasMultipleContracts && !isExpanded ? 'rgba(201, 165, 116, 0.6)' : 'rgba(201, 165, 116, 0.4)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: hasMultipleContracts && !isExpanded ? '0 0 12px rgba(201, 165, 116, 0.4)' : 'none',
                            animation: hasMultipleContracts && !isExpanded ? 'pulse 2s infinite' : 'none'
                          }}>
                            <FileText size={12} />
                            {artistContracts.length} {artistContracts.length === 1 ? 'contrato' : 'contratos'}
                          </div>
                        </div>
                        <p style={{ fontSize: '13px', color: '#AFB3B7' }}>
                          Revenue Total: <span style={{ color: '#c9a574', fontWeight: '600' }}>
                            €{(artist?.totalRevenue || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                          </span>
                        </p>
                        {/* Quick Contract Types Preview */}
                        {hasMultipleContracts && !isExpanded && (
                          <div style={{ 
                            display: 'flex', 
                            gap: '4px', 
                            marginTop: '6px',
                            flexWrap: 'wrap'
                          }}>
                            {artistContracts.slice(0, 3).map((c, idx) => (
                              <div key={idx} style={{
                                fontSize: '10px',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background: 'rgba(201, 165, 116, 0.1)',
                                color: '#c9a574',
                                border: '1px solid rgba(201, 165, 116, 0.2)'
                              }}>
                                {c.serviceType}
                              </div>
                            ))}
                            {artistContracts.length > 3 && (
                              <div style={{
                                fontSize: '10px',
                                padding: '2px 6px',
                                color: '#AFB3B7'
                              }}>
                                +{artistContracts.length - 3} más
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Expand/Collapse Button */}
                      {hasMultipleContracts && (
                        <button
                          onClick={() => setExpandedArtistId(isExpanded ? null : artistId)}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: isExpanded ? 'linear-gradient(135deg, #c9a574, #d4b684)' : 'rgba(201, 165, 116, 0.2)',
                            border: '1px solid rgba(201, 165, 116, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            color: isExpanded ? '#1a2332' : '#c9a574'
                          }}
                          onMouseEnter={(e) => {
                            if (!isExpanded) {
                              e.currentTarget.style.background = 'rgba(201, 165, 116, 0.3)';
                            }
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            if (!isExpanded) {
                              e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
                            }
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      )}
                      
                      {/* Add New Contract Button */}
                      <button
                        onClick={() => {
                          console.log('➕ Añadiendo nuevo contrato para artista:', artistId, artist?.name);
                          const today = new Date();
                          const oneYearLater = new Date(today);
                          oneYearLater.setFullYear(today.getFullYear() + 1);
                          
                          // Tipos de contratos disponibles
                          const allTypes = ['Distribución', 'Editorial', 'Management', 'Sello Discográfico', 'Conciertos'];
                          
                          // Tipos que ya tiene este artista
                          const existingTypes = artistContracts.map(c => c.serviceType);
                          
                          // Sugerir el primer tipo que NO tenga
                          const suggestedType = allTypes.find(type => !existingTypes.includes(type)) || 'Distribución';
                          
                          console.log(`💡 Artista tiene: [${existingTypes.join(', ')}]. Sugiriendo: ${suggestedType}`);
                          
                          setNewContract({
                            artistId: artistId.toString(),
                            percentage: 70,
                            startDate: today.toISOString().split('T')[0],
                            endDate: oneYearLater.toISOString().split('T')[0],
                            serviceType: suggestedType,
                            amount: 0
                          });
                          setShowNewContractModal(true);
                        }}
                        title={`➕ Añadir nuevo contrato (${artist?.name || 'artista'} puede tener Distribución, Editorial, Management, Sello, Conciertos simultáneamente)`}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.3), rgba(201, 165, 116, 0.2))',
                          border: '1px solid rgba(201, 165, 116, 0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          color: '#c9a574',
                          position: 'relative',
                          boxShadow: '0 0 8px rgba(201, 165, 116, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #c9a574, #d4b684)';
                          e.currentTarget.style.transform = 'scale(1.1)';
                          e.currentTarget.style.color = '#1a2332';
                          e.currentTarget.style.boxShadow = '0 0 16px rgba(201, 165, 116, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(201, 165, 116, 0.3), rgba(201, 165, 116, 0.2))';
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.color = '#c9a574';
                          e.currentTarget.style.boxShadow = '0 0 8px rgba(201, 165, 116, 0.3)';
                        }}
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    {/* Contracts List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(isExpanded ? artistContracts : [mainContract]).map((contract, index) => {
                        const isExpired = new Date(contract.endDate) < new Date();
                        const daysUntilExpiry = Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                        const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry <= 30;
                        const isWorkType = contract.serviceType === 'Trabajo';
                        
                        return (
                          <div key={contract.id} style={{
                            background: 'rgba(42, 63, 63, 0.4)',
                            borderRadius: '12px',
                            padding: '16px',
                            border: `1px solid ${isExpired ? 'rgba(239, 68, 68, 0.3)' : isExpiringSoon ? 'rgba(251, 191, 36, 0.3)' : 'rgba(201, 165, 116, 0.2)'}`,
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = isExpired ? 'rgba(239, 68, 68, 0.5)' : isExpiringSoon ? 'rgba(251, 191, 36, 0.5)' : 'rgba(201, 165, 116, 0.4)';
                            e.currentTarget.style.background = 'rgba(42, 63, 63, 0.6)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = isExpired ? 'rgba(239, 68, 68, 0.3)' : isExpiringSoon ? 'rgba(251, 191, 36, 0.3)' : 'rgba(201, 165, 116, 0.2)';
                            e.currentTarget.style.background = 'rgba(42, 63, 63, 0.4)';
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  background: 'rgba(201, 165, 116, 0.15)',
                                  color: '#c9a574',
                                  border: '1px solid rgba(201, 165, 116, 0.3)'
                                }}>
                                  {contract.serviceType || 'Sin especificar'}
                                </div>
                                <span style={{ fontSize: '12px', color: '#AFB3B7' }}>#{contract.id}</span>
                              </div>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <div style={{
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  background: isExpired ? 'rgba(239, 68, 68, 0.2)' : isExpiringSoon ? 'rgba(251, 191, 36, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                  color: isExpired ? '#EF4444' : isExpiringSoon ? '#FBBF24' : '#22C55E',
                                  border: `1px solid ${isExpired ? 'rgba(239, 68, 68, 0.4)' : isExpiringSoon ? 'rgba(251, 191, 36, 0.4)' : 'rgba(34, 197, 94, 0.4)'}`
                                }}>
                                  {isExpired ? 'Expirado' : isExpiringSoon ? `${daysUntilExpiry} días` : 'Activo'}
                                </div>
                                <button
                                  onClick={() => setEditingContract(contract)}
                                  style={{
                                    padding: '6px',
                                    borderRadius: '8px',
                                    background: 'rgba(201, 165, 116, 0.2)',
                                    border: '1px solid rgba(201, 165, 116, 0.3)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(201, 165, 116, 0.3)';
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                  }}
                                >
                                  <Edit2 size={14} color="#c9a574" />
                                </button>
                              </div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: isWorkType ? '1fr 1fr 1fr' : '2fr 1fr 1fr', gap: '16px' }}>
                              {/* Percentage or Amount */}
                              <div>
                                {isWorkType ? (
                                  <>
                                    <span style={{ fontSize: '11px', color: '#AFB3B7', display: 'block', marginBottom: '4px' }}>
                                      Lo que cobramos
                                    </span>
                                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#c9a574' }}>
                                      €{(contract.amount || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <div style={{ display: 'flex', gap: '12px', marginBottom: '6px' }}>
                                      <div>
                                        <span style={{ fontSize: '11px', color: '#AFB3B7', display: 'block', marginBottom: '2px' }}>Artista</span>
                                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#c9a574' }}>
                                          {contract.percentage}%
                                        </span>
                                      </div>
                                      <div>
                                        <span style={{ fontSize: '11px', color: '#AFB3B7', display: 'block', marginBottom: '2px' }}>BAM</span>
                                        <span style={{ fontSize: '16px', fontWeight: '700', color: 'rgba(201, 165, 116, 0.7)' }}>
                                          {100 - contract.percentage}%
                                        </span>
                                      </div>
                                    </div>
                                    <div style={{
                                      height: '6px',
                                      background: 'rgba(42, 63, 63, 0.6)',
                                      borderRadius: '3px',
                                      overflow: 'hidden',
                                      display: 'flex'
                                    }}>
                                      <div style={{
                                        width: `${contract.percentage}%`,
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #c9a574, #d4b684)',
                                        transition: 'width 0.5s ease'
                                      }} />
                                      <div style={{
                                        width: `${100 - contract.percentage}%`,
                                        height: '100%',
                                        background: 'linear-gradient(90deg, rgba(201, 165, 116, 0.5), rgba(201, 165, 116, 0.7))',
                                        transition: 'width 0.5s ease'
                                      }} />
                                    </div>
                                  </>
                                )}
                              </div>
                              
                              {/* Dates */}
                              <div>
                                <span style={{ fontSize: '11px', color: '#AFB3B7', display: 'block', marginBottom: '4px' }}>
                                  Inicio
                                </span>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>
                                  {new Date(contract.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                              
                              <div>
                                <span style={{ fontSize: '11px', color: '#AFB3B7', display: 'block', marginBottom: '4px' }}>
                                  Fin
                                </span>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: isExpired ? '#EF4444' : isExpiringSoon ? '#FBBF24' : '#ffffff' }}>
                                  {new Date(contract.endDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Message when collapsed with multiple contracts */}
                      {!isExpanded && hasMultipleContracts && (
                        <div style={{
                          marginTop: '12px',
                          padding: '12px 16px',
                          background: 'rgba(201, 165, 116, 0.1)',
                          borderRadius: '10px',
                          border: '1px dashed rgba(201, 165, 116, 0.3)',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => setExpandedArtistId(artistId)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(201, 165, 116, 0.15)';
                          e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
                          e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                        }}>
                          <span style={{ fontSize: '13px', color: '#c9a574', fontWeight: '600' }}>
                            <ChevronDown size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                            Haz clic para ver los {artistContracts.length - 1} contratos restantes
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {contracts.length === 0 && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '2px dashed rgba(201, 165, 116, 0.3)',
                borderRadius: '20px',
                padding: '64px 32px',
                textAlign: 'center'
              }}>
                <FileText size={64} color="rgba(201, 165, 116, 0.3)" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
                  No hay contratos registrados
                </h3>
                <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
                  Los contratos aparecerán automáticamente cuando agregues artistas
                </p>
              </div>
            )}
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
    // Preparar datos del artista en el formato que espera ArtistPortal
    const artistTracks = tracks.filter(t => t.artistId === selectedArtist.id);
    
    // Calcular datos mensuales (últimos 6 meses)
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentMonth = new Date().getMonth();
    const monthlyData = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthRevenue = artistTracks.reduce((sum, track) => sum + (track.totalRevenue || 0) / 6, 0);
      const monthStreams = artistTracks.reduce((sum, track) => sum + (track.totalStreams || 0) / 6, 0);
      
      monthlyData.push({
        month: monthNames[monthIndex],
        revenue: Math.round(monthRevenue),
        streams: Math.round(monthStreams)
      });
    }
    
    // Calcular breakdown por plataforma
    const platformBreakdown: { [key: string]: number } = {};
    artistTracks.forEach(track => {
      if (track.platforms && Array.isArray(track.platforms)) {
        track.platforms.forEach((platform: string) => {
          if (!platformBreakdown[platform]) {
            platformBreakdown[platform] = 0;
          }
          platformBreakdown[platform] += (track.totalRevenue || 0) / track.platforms.length;
        });
      }
    });
    
    const artistPortalData = {
      id: selectedArtist.id,
      name: selectedArtist.name,
      email: selectedArtist.email || '',
      photo: selectedArtist.photo,
      totalRevenue: selectedArtist.totalRevenue || 0,
      totalStreams: selectedArtist.totalStreams || 0,
      tracks: artistTracks,
      monthlyData: monthlyData,
      platformBreakdown: platformBreakdown
    };
    
    // Filtrar contratos del artista
    const artistContracts = contracts.filter(c => c.artistId === selectedArtist.id);
    
    return (
      <ArtistPortal
        artistData={artistPortalData}
        contracts={artistContracts}
        onLogout={() => setSelectedArtist(null)}
        globalPaymentRequests={paymentRequests}
        setGlobalPaymentRequests={setPaymentRequests}
        setNotifications={setNotifications}
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

      {/* Contract Edit Modal */}
      {editingContract && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={() => setEditingContract(null)}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.95) 0%, rgba(30, 47, 47, 0.98) 100%)',
            border: '2px solid rgba(201, 165, 116, 0.3)',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff' }}>
                  Editar Contrato
                </h2>
                <button
                  onClick={() => setEditingContract(null)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  }}
                >
                  <X size={20} color="#EF4444" />
                </button>
              </div>
              <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
                Modifica los detalles del contrato de {artists.find(a => a.id === editingContract.artistId)?.name}
              </p>
            </div>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Service Type */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#c9a574', 
                  marginBottom: '8px' 
                }}>
                  Tipo de Servicio
                </label>
                <select
                  value={editingContract.serviceType || ''}
                  onChange={(e) => setEditingContract({ ...editingContract, serviceType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: 'rgba(42, 63, 63, 0.4)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.6)';
                    e.currentTarget.style.background = 'rgba(42, 63, 63, 0.6)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                    e.currentTarget.style.background = 'rgba(42, 63, 63, 0.4)';
                  }}
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Distribución">Distribución</option>
                  <option value="Editorial">Editorial</option>
                  <option value="Management">Management</option>
                  <option value="Sello Discográfico">Sello Discográfico</option>
                  <option value="Conciertos">Conciertos</option>
                  <option value="Trabajo">Trabajo</option>
                </select>
              </div>

              {/* Percentage */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#c9a574', 
                  marginBottom: '8px' 
                }}>
                  Porcentaje del Artista (%)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingContract.percentage}
                    onInput={(e) => {
                      const input = e.target as HTMLInputElement;
                      const value = Math.min(100, Math.max(0, parseInt(input.value) || 0));
                      setEditingContract({ ...editingContract, percentage: value });
                    }}
                    onChange={(e) => {
                      const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                      setEditingContract({ ...editingContract, percentage: value });
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      background: 'rgba(42, 63, 63, 0.4)',
                      border: '1px solid rgba(201, 165, 116, 0.3)',
                      color: '#ffffff',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.6)';
                      e.currentTarget.style.background = 'rgba(42, 63, 63, 0.6)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                      e.currentTarget.style.background = 'rgba(42, 63, 63, 0.4)';
                    }}
                  />
                  <Percent size={18} color="#c9a574" style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }} />
                </div>
                {/* Visual Percentage Display */}
                <div style={{ 
                  marginTop: '16px',
                  background: 'rgba(42, 63, 63, 0.4)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(201, 165, 116, 0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '13px', color: '#AFB3B7', display: 'block', marginBottom: '4px' }}>Artista</span>
                      <span style={{ fontSize: '24px', fontWeight: '700', color: '#c9a574' }}>
                        {editingContract.percentage}%
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '13px', color: '#AFB3B7', display: 'block', marginBottom: '4px' }}>BAM</span>
                      <span style={{ fontSize: '24px', fontWeight: '700', color: 'rgba(201, 165, 116, 0.7)' }}>
                        {100 - editingContract.percentage}%
                      </span>
                    </div>
                  </div>
                  <div style={{
                    height: '10px',
                    background: 'rgba(42, 63, 63, 0.6)',
                    borderRadius: '5px',
                    overflow: 'hidden',
                    display: 'flex'
                  }}>
                    <div style={{
                      width: `${editingContract.percentage}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #c9a574, #d4b684)',
                      transition: 'width 0.3s ease'
                    }} />
                    <div style={{
                      width: `${100 - editingContract.percentage}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, rgba(201, 165, 116, 0.5), rgba(201, 165, 116, 0.7))',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#c9a574', 
                  marginBottom: '8px' 
                }}>
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  value={editingContract.startDate}
                  onChange={(e) => setEditingContract({ ...editingContract, startDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: 'rgba(42, 63, 63, 0.4)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.6)';
                    e.currentTarget.style.background = 'rgba(42, 63, 63, 0.6)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                    e.currentTarget.style.background = 'rgba(42, 63, 63, 0.4)';
                  }}
                />
              </div>

              {/* End Date */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#c9a574', 
                  marginBottom: '8px' 
                }}>
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  value={editingContract.endDate}
                  onChange={(e) => setEditingContract({ ...editingContract, endDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: 'rgba(42, 63, 63, 0.4)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.6)';
                    e.currentTarget.style.background = 'rgba(42, 63, 63, 0.6)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                    e.currentTarget.style.background = 'rgba(42, 63, 63, 0.4)';
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                marginTop: '8px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(201, 165, 116, 0.2)'
              }}>
                <button
                  onClick={() => setEditingContract(null)}
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    borderRadius: '12px',
                    background: 'rgba(42, 63, 63, 0.4)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(42, 63, 63, 0.6)';
                    e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(42, 63, 63, 0.4)';
                    e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleSaveContract(editingContract)}
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #c9a574, #d4b684)',
                    border: 'none',
                    color: '#1a2332',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(201, 165, 116, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Save size={18} />
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Contract Modal */}
      <NewContractModal
        show={showNewContractModal}
        onClose={() => {
          setShowNewContractModal(false);
          setNewContract({
            artistId: '',
            percentage: 70,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            serviceType: 'Distribución',
            amount: 0
          });
        }}
        newContract={newContract}
        setNewContract={setNewContract}
        artists={artists}
        contracts={contracts}
        onSave={async () => {
          if (!newContract.artistId || !newContract.endDate || !newContract.serviceType) {
            alert('⚠️ Por favor completa los campos requeridos');
            return;
          }
          
          try {
            console.log('📤 Enviando contrato:', newContract);
            const response = await fetch('http://localhost:5000/api/contracts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newContract)
            });
            
            if (response.ok) {
              const savedContract = await response.json();
              console.log('✅ Contrato guardado:', savedContract);
              setContracts([...contracts, savedContract]);
              alert('✅ Contrato creado exitosamente');
              setShowNewContractModal(false);
              setNewContract({
                artistId: '',
                percentage: 70,
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                serviceType: 'Distribución',
                amount: 0
              });
            } else {
              alert('❌ Error del servidor');
            }
          } catch (error) {
            console.error('Error:', error);
            const artist = artists.find(a => a.id === parseInt(newContract.artistId));
            const newContractWithId = {
              id: Date.now(),
              ...newContract,
              artistId: parseInt(newContract.artistId),
              artistName: artist?.name || 'Artista Desconocido',
              artistPhoto: artist?.photo || '',
              status: 'active',
              type: 'Exclusivo',
              territory: 'Mundial',
              advancePayment: 0,
              terms: 'Contrato creado desde el dashboard',
              createdAt: new Date().toISOString().split('T')[0]
            };
            console.log('💾 Creando contrato localmente:', newContractWithId);
            setContracts([...contracts, newContractWithId]);
            alert('✅ Contrato creado localmente');
            setShowNewContractModal(false);
            setNewContract({
              artistId: '',
              percentage: 70,
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
              serviceType: 'Distribución',
              amount: 0
            });
          }
        }}
      />

      {showNewContractModal && false && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.96) 0%, rgba(15, 20, 25, 0.98) 100%)',
          backdropFilter: 'blur(24px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '0',
          animation: 'fadeIn 0.3s ease'
        }} onClick={() => setShowNewContractModal(false)}>
          <div style={{
            background: '#0d1117',
            borderRadius: '16px',
            padding: '0',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid rgba(201, 165, 116, 0.2)',
            boxShadow: '0 40px 80px rgba(0, 0, 0, 0.9), 0 0 1px rgba(201, 165, 116, 0.3)',
            margin: '20px'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Header Bar - Sticky */}
            <div style={{
              position: 'sticky',
              top: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(180deg, #161b22 0%, #0d1117 100%)',
              borderBottom: '1px solid rgba(201, 165, 116, 0.12)',
              padding: '20px 28px',
              zIndex: 100,
              borderRadius: '16px 16px 0 0',
              backdropFilter: 'blur(10px)'
            }}>
              {/* Close Button */}
              <button
                onClick={() => setShowNewContractModal(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(201, 165, 116, 0.08)',
                  border: '1px solid rgba(201, 165, 116, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(220, 53, 69, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(220, 53, 69, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(201, 165, 116, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.15)';
                }}
              >
                <X size={18} color="#c9a574" strokeWidth={2} />
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Icon */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15), rgba(201, 165, 116, 0.05))',
                  border: '1px solid rgba(201, 165, 116, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FileSignature size={24} color="#c9a574" strokeWidth={2} />
                </div>
                
                {/* Title */}
                <div style={{ flex: 1 }}>
                  <h2 style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: '#ffffff',
                    marginBottom: '4px',
                    letterSpacing: '-0.3px'
                  }}>
                    {newContract.artistId && artists.find(a => a.id === parseInt(newContract.artistId))
                      ? `Nuevo Contrato • ${artists.find(a => a.id === parseInt(newContract.artistId))?.name}`
                      : 'Crear Nuevo Contrato'
                    }
                  </h2>
                  <p style={{ 
                    fontSize: '13px', 
                    color: 'rgba(201, 165, 116, 0.7)',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    {newContract.artistId && contracts.filter(c => c.artistId === parseInt(newContract.artistId)).length > 0
                      ? `${contracts.filter(c => c.artistId === parseInt(newContract.artistId)).length} contrato(s) existente(s)`
                      : 'Completa la información requerida'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Form Container */}
            <div style={{ padding: '28px', background: '#0d1117' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Artist Selection Card */}
              <div style={{
                background: '#161b22',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(201, 165, 116, 0.12)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#c9a574', 
                  marginBottom: '14px',
                  letterSpacing: '0.2px'
                }}>
                  <User size={16} strokeWidth={2.5} />
                  Seleccionar Artista
                  <span style={{ 
                    fontSize: '10px', 
                    padding: '2px 7px', 
                    background: 'rgba(220, 53, 69, 0.15)', 
                    color: '#ef4444', 
                    borderRadius: '4px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px'
                  }}>
                    Requerido
                  </span>
                </label>
                <select
                  value={newContract.artistId}
                  onChange={(e) => setNewContract({ ...newContract, artistId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: newContract.artistId 
                      ? '#0d1117' 
                      : '#0d1117',
                    border: `1.5px solid ${newContract.artistId ? '#c9a574' : 'rgba(201, 165, 116, 0.2)'}`,
                    color: newContract.artistId ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                    fontSize: '14px',
                    fontWeight: '600',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#c9a574';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201, 165, 116, 0.08)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = newContract.artistId ? '#c9a574' : 'rgba(201, 165, 116, 0.2)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Seleccionar artista</option>
                  {artists.map(artist => {
                    const artistContractCount = contracts.filter(c => c.artistId === artist.id).length;
                    return (
                      <option key={artist.id} value={artist.id} style={{ background: '#1e2f2f' }}>
                        {artist.name} {artistContractCount > 0 ? `(${artistContractCount} contrato${artistContractCount > 1 ? 's' : ''})` : '(Sin contratos)'}
                      </option>
                    );
                  })}
                </select>
                
                {/* Show existing contracts for selected artist */}
                {newContract.artistId && contracts.filter(c => c.artistId === parseInt(newContract.artistId)).length > 0 && (
                  <div style={{
                    marginTop: '10px',
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'rgba(201, 165, 116, 0.06)',
                    border: '1px solid rgba(201, 165, 116, 0.15)'
                  }}>
                    <p style={{ fontSize: '11px', color: '#c9a574', fontWeight: '600', marginBottom: '6px' }}>
                      📋 Contratos existentes:
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {contracts.filter(c => c.artistId === parseInt(newContract.artistId)).map((c) => (
                        <div key={c.id} style={{
                          fontSize: '10px',
                          padding: '4px 8px',
                          borderRadius: '5px',
                          background: 'rgba(201, 165, 116, 0.12)',
                          color: '#c9a574',
                          border: '1px solid rgba(201, 165, 116, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <CheckCircle size={10} />
                          {c.serviceType} ({c.percentage}%)
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: '10px', color: '#AFB3B7', marginTop: '6px', marginBottom: 0 }}>
                      💡 Puedes añadir un tipo diferente con porcentajes independientes
                    </p>
                  </div>
                )}
              </div>

              {/* Service Type Card */}
              <div style={{
                background: '#161b22',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(201, 165, 116, 0.12)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#c9a574', 
                  marginBottom: '14px',
                  letterSpacing: '0.2px'
                }}>
                  <FileText size={16} strokeWidth={2.5} />
                  Tipo de Contrato
                  <span style={{ 
                    fontSize: '10px', 
                    padding: '2px 7px', 
                    background: 'rgba(220, 53, 69, 0.15)', 
                    color: '#ef4444', 
                    borderRadius: '4px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px'
                  }}>
                    Requerido
                  </span>
                </label>
                <select
                  value={newContract.serviceType}
                  onChange={(e) => {
                    const selectedType = e.target.value;
                    // Porcentajes sugeridos según tipo de contrato
                    let suggestedPercentage = 70;
                    switch(selectedType) {
                      case 'Distribución':
                        suggestedPercentage = 70;
                        break;
                      case 'Editorial':
                        suggestedPercentage = 50;
                        break;
                      case 'Management':
                        suggestedPercentage = 20;
                        break;
                      case 'Sello Discográfico':
                        suggestedPercentage = 60;
                        break;
                      case 'Conciertos':
                        suggestedPercentage = 80;
                        break;
                      default:
                        suggestedPercentage = 70;
                    }
                    setNewContract({ ...newContract, serviceType: selectedType, percentage: suggestedPercentage });
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: '#0d1117',
                    border: `1.5px solid ${newContract.serviceType ? '#c9a574' : 'rgba(201, 165, 116, 0.2)'}`,
                    color: newContract.serviceType ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                    fontSize: '14px',
                    fontWeight: '600',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#c9a574';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201, 165, 116, 0.08)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = newContract.serviceType ? '#c9a574' : 'rgba(201, 165, 116, 0.2)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="" style={{ background: '#1e2f2f' }}>Seleccionar tipo de contrato</option>
                  <option value="Distribución" style={{ background: '#1e2f2f' }}>📀 Distribución · 70%</option>
                  <option value="Editorial" style={{ background: '#1e2f2f' }}>📝 Editorial · 50%</option>
                  <option value="Management" style={{ background: '#1e2f2f' }}>👔 Management · 20%</option>
                  <option value="Sello Discográfico" style={{ background: '#1e2f2f' }}>🎵 Sello Discográfico · 60%</option>
                  <option value="Conciertos" style={{ background: '#1e2f2f' }}>🎤 Conciertos · 80%</option>
                  <option value="Trabajo" style={{ background: '#1e2f2f' }}>💼 Trabajo (cantidad fija)</option>
                </select>
                {newContract.serviceType && newContract.serviceType !== 'Trabajo' && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: 'rgba(201, 165, 116, 0.08)',
                    border: '1px solid rgba(201, 165, 116, 0.2)',
                    fontSize: '11px',
                    color: '#c9a574',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Info size={13} />
                    <span>
                      {newContract.serviceType === 'Distribución' && 'Porcentaje típico: 65-85% para el artista'}
                      {newContract.serviceType === 'Editorial' && 'Porcentaje típico: 40-75% para el artista'}
                      {newContract.serviceType === 'Management' && 'Porcentaje típico: 10-30% para el artista'}
                      {newContract.serviceType === 'Sello Discográfico' && 'Porcentaje típico: 50-80% para el artista'}
                      {newContract.serviceType === 'Conciertos' && 'Porcentaje típico: 70-90% para el artista'}
                    </span>
                  </div>
                )}
              </div>

              {/* Percentage or Amount Card */}
              <div style={{
                background: '#161b22',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(201, 165, 116, 0.12)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}>
                {newContract.serviceType === 'Trabajo' ? (
                  <>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#c9a574', 
                      marginBottom: '8px' 
                    }}>
                      Cantidad que Cobramos (€)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={newContract.amount}
                        onChange={(e) => {
                          const value = Math.max(0, parseFloat(e.target.value) || 0);
                          setNewContract({ ...newContract, amount: value });
                        }}
                        style={{
                          width: '100%',
                          padding: '14px 48px 14px 16px',
                          borderRadius: '12px',
                          background: 'rgba(42, 63, 63, 0.4)',
                          border: '1px solid rgba(201, 165, 116, 0.3)',
                          color: '#ffffff',
                          fontSize: '15px',
                          outline: 'none',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.6)';
                          e.currentTarget.style.background = 'rgba(42, 63, 63, 0.6)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                          e.currentTarget.style.background = 'rgba(42, 63, 63, 0.4)';
                        }}
                      />
                      <DollarSign size={18} color="#c9a574" style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none'
                      }} />
                    </div>
                    <div style={{ 
                      marginTop: '16px',
                      background: 'rgba(42, 63, 63, 0.4)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(201, 165, 116, 0.2)',
                      textAlign: 'center'
                    }}>
                      <span style={{ fontSize: '13px', color: '#AFB3B7', display: 'block', marginBottom: '8px' }}>
                        Importe a cobrar
                      </span>
                      <span style={{ fontSize: '32px', fontWeight: '700', color: '#c9a574' }}>
                        €{newContract.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <label style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#c9a574',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        letterSpacing: '0.2px'
                      }}>
                        <Percent size={15} strokeWidth={2.5} />
                        Porcentaje del Artista
                      </label>
                      <span style={{ 
                        fontSize: '11px', 
                        color: 'rgba(201, 165, 116, 0.8)', 
                        fontWeight: '600',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(201, 165, 116, 0.08)',
                        border: '1px solid rgba(201, 165, 116, 0.2)'
                      }}>
                        {(() => {
                          switch(newContract.serviceType) {
                            case 'Distribución': return '💡 Típico: 70%';
                            case 'Editorial': return '💡 Típico: 50%';
                            case 'Management': return '💡 Típico: 20%';
                            case 'Sello Discográfico': return '💡 Típico: 60%';
                            case 'Conciertos': return '💡 Típico: 80%';
                            default: return '💡 Configurable';
                          }
                        })()}
                      </span>
                    </div>
                    {/* Quick Percentage Buttons */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      {(() => {
                        // Porcentajes rápidos según el tipo de contrato
                        let quickPercentages = [50, 60, 70, 80, 90];
                        switch(newContract.serviceType) {
                          case 'Distribución':
                            quickPercentages = [65, 70, 75, 80, 85];
                            break;
                          case 'Editorial':
                            quickPercentages = [40, 50, 60, 70, 75];
                            break;
                          case 'Management':
                            quickPercentages = [10, 15, 20, 25, 30];
                            break;
                          case 'Sello Discográfico':
                            quickPercentages = [50, 60, 70, 75, 80];
                            break;
                          case 'Conciertos':
                            quickPercentages = [70, 75, 80, 85, 90];
                            break;
                          default:
                            quickPercentages = [50, 60, 70, 80, 90];
                        }
                        return quickPercentages;
                      })().map(percent => (
                        <button
                          key={percent}
                          type="button"
                          onClick={() => setNewContract({ ...newContract, percentage: percent })}
                          style={{
                            flex: 1,
                            padding: '10px 12px',
                            borderRadius: '8px',
                            background: newContract.percentage === percent 
                              ? 'linear-gradient(135deg, #c9a574, #d4b684)' 
                              : 'rgba(42, 63, 63, 0.35)',
                            border: newContract.percentage === percent 
                              ? '1.5px solid #c9a574' 
                              : '1.5px solid rgba(201, 165, 116, 0.2)',
                            color: newContract.percentage === percent ? '#0d1117' : 'rgba(255, 255, 255, 0.8)',
                            fontSize: '13px',
                            fontWeight: newContract.percentage === percent ? '800' : '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: newContract.percentage === percent 
                              ? '0 3px 12px rgba(201, 165, 116, 0.25)' 
                              : 'none',
                            transform: newContract.percentage === percent ? 'scale(1.02)' : 'scale(1)'
                          }}
                          onMouseEnter={(e) => {
                            if (newContract.percentage !== percent) {
                              e.currentTarget.style.background = 'rgba(42, 63, 63, 0.55)';
                              e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.4)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (newContract.percentage !== percent) {
                              e.currentTarget.style.background = 'rgba(42, 63, 63, 0.35)';
                              e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
                            }
                          }}
                        >
                          {percent}%
                        </button>
                      ))}
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newContract.percentage}
                        onInput={(e) => {
                          const input = e.target as HTMLInputElement;
                          const value = Math.min(100, Math.max(0, parseInt(input.value) || 0));
                          setNewContract({ ...newContract, percentage: value });
                        }}
                        onChange={(e) => {
                          const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                          setNewContract({ ...newContract, percentage: value });
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          background: 'rgba(42, 63, 63, 0.35)',
                          border: '1px solid rgba(201, 165, 116, 0.25)',
                          color: '#ffffff',
                          fontSize: '14px',
                          outline: 'none',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.5)';
                          e.currentTarget.style.background = 'rgba(42, 63, 63, 0.5)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.25)';
                          e.currentTarget.style.background = 'rgba(42, 63, 63, 0.35)';
                        }}
                      />
                      <Percent size={16} color="#c9a574" style={{
                        position: 'absolute',
                        right: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none'
                      }} />
                    </div>
                    {/* Visual Percentage Display */}
                    <div style={{ 
                      marginTop: '16px',
                      background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.10), rgba(201, 165, 116, 0.04))',
                      borderRadius: '12px',
                      padding: '18px',
                      border: '1.5px solid rgba(201, 165, 116, 0.25)',
                      boxShadow: '0 4px 16px rgba(201, 165, 116, 0.08)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                          <span style={{ 
                            fontSize: '10px', 
                            color: 'rgba(255, 255, 255, 0.5)', 
                            display: 'block', 
                            marginBottom: '4px',
                            fontWeight: '600',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase'
                          }}>
                            Artista
                          </span>
                          <span style={{ fontSize: '26px', fontWeight: '800', color: '#c9a574', textShadow: '0 2px 8px rgba(201, 165, 116, 0.25)' }}>
                            {newContract.percentage}%
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ 
                            fontSize: '10px', 
                            color: 'rgba(255, 255, 255, 0.5)', 
                            display: 'block', 
                            marginBottom: '4px',
                            fontWeight: '600',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase'
                          }}>
                            BIGARTIST
                          </span>
                          <span style={{ fontSize: '26px', fontWeight: '800', color: 'rgba(201, 165, 116, 0.6)', textShadow: '0 2px 8px rgba(201, 165, 116, 0.15)' }}>
                            {100 - newContract.percentage}%
                          </span>
                        </div>
                      </div>
                      <div style={{
                        height: '10px',
                        background: 'rgba(20, 30, 30, 0.6)',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        display: 'flex',
                        border: '1px solid rgba(201, 165, 116, 0.15)',
                        boxShadow: 'inset 0 1px 4px rgba(0, 0, 0, 0.25)'
                      }}>
                        <div style={{
                          width: `${newContract.percentage}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #c9a574 0%, #d4b684 100%)',
                          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: '0 0 10px rgba(201, 165, 116, 0.4)',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                            animation: 'shimmer 2s infinite'
                          }} />
                        </div>
                        <div style={{
                          width: `${100 - newContract.percentage}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, rgba(201, 165, 116, 0.3), rgba(201, 165, 116, 0.5))',
                          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }} />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Dates Card */}
              <div style={{
                background: '#161b22',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(201, 165, 116, 0.12)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#c9a574', 
                  marginBottom: '14px',
                  letterSpacing: '0.2px'
                }}>
                  <Calendar size={16} strokeWidth={2.5} />
                  Vigencia del Contrato
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '11px', 
                    fontWeight: '700', 
                    color: 'rgba(201, 165, 116, 0.7)', 
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px'
                  }}>
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={newContract.startDate}
                    onChange={(e) => setNewContract({ ...newContract, startDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: '#0d1117',
                      border: '1.5px solid rgba(201, 165, 116, 0.2)',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: '600',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#c9a574';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201, 165, 116, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '11px', 
                    fontWeight: '700', 
                    color: 'rgba(201, 165, 116, 0.7)', 
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px'
                  }}>
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={newContract.endDate}
                    onChange={(e) => setNewContract({ ...newContract, endDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: '#0d1117',
                      border: '1.5px solid rgba(201, 165, 116, 0.2)',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: '600',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#c9a574';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201, 165, 116, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Contract Summary or Missing Fields Warning */}
              {newContract.artistId && newContract.serviceType ? (
                <div style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.12), rgba(201, 165, 116, 0.04))',
                  border: '1.5px solid rgba(201, 165, 116, 0.3)',
                  marginTop: '4px'
                }}>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#c9a574', 
                    fontWeight: '600', 
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <CheckCircle size={14} />
                    ✅ Resumen del Contrato - ¡Listo para Crear!
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>Artista:</span>
                      <span style={{ fontSize: '13px', color: '#ffffff', fontWeight: '600' }}>
                        {artists.find(a => a.id === parseInt(newContract.artistId))?.name || 'No seleccionado'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>Tipo:</span>
                      <span style={{ fontSize: '13px', color: '#c9a574', fontWeight: '600' }}>
                        {newContract.serviceType}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>Porcentaje Artista:</span>
                      <span style={{ fontSize: '14px', color: '#c9a574', fontWeight: '700' }}>
                        {newContract.percentage}%
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>Duración:</span>
                      <span style={{ fontSize: '12px', color: '#ffffff' }}>
                        {new Date(newContract.startDate).toLocaleDateString('es-ES')} - {new Date(newContract.endDate).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'rgba(251, 191, 36, 0.08)',
                  border: '1.5px dashed rgba(251, 191, 36, 0.3)',
                  marginTop: '4px'
                }}>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#fbbf24', 
                    fontWeight: '600', 
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    ⚠️ Completa los campos para activar el botón de guardado
                  </div>
                  <ul style={{ fontSize: '11px', color: '#fbbf24', margin: 0, paddingLeft: '18px', lineHeight: '1.5' }}>
                    {!newContract.artistId && <li>✗ Selecciona un artista</li>}
                    {!newContract.serviceType && <li>✗ Selecciona el tipo de contrato</li>}
                    {!newContract.endDate && <li>✗ Define la fecha de fin</li>}
                  </ul>
                </div>
              )}
              </div>
            </div>
            
            {/* Footer Bar - Sticky */}
            <div style={{
              position: 'sticky',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)',
              borderTop: '1px solid rgba(201, 165, 116, 0.12)',
              padding: '16px 28px',
              zIndex: 100,
              borderRadius: '0 0 16px 16px',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              gap: '12px'
            }}>
                <button
                  onClick={() => {
                    setShowNewContractModal(false);
                    setNewContract({
                      artistId: '',
                      percentage: 70,
                      startDate: new Date().toISOString().split('T')[0],
                      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                      serviceType: 'Distribución',
                      amount: 0
                    });
                  }}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: '1.5px solid rgba(255, 255, 255, 0.12)',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!newContract.artistId || !newContract.endDate || !newContract.serviceType) {
                      alert('⚠️ Por favor completa:\n' + 
                        (!newContract.artistId ? '- Artista\n' : '') +
                        (!newContract.serviceType ? '- Tipo de contrato\n' : '') +
                        (!newContract.endDate ? '- Fecha de fin' : ''));
                      return;
                    }
                    
                    try {
                      console.log('📤 Enviando contrato al backend:', newContract);
                      const response = await fetch('http://localhost:5000/api/contracts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newContract)
                      });
                      
                      if (response.ok) {
                        const savedContract = await response.json();
                        console.log('✅ Contrato guardado:', savedContract);
                        setContracts([...contracts, savedContract]);
                        alert('✅ Contrato creado exitosamente');
                        setShowNewContractModal(false);
                        setNewContract({
                          artistId: '',
                          percentage: 70,
                          startDate: new Date().toISOString().split('T')[0],
                          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                          serviceType: 'Distribución',
                          amount: 0
                        });
                      } else {
                        alert('❌ Error del servidor al crear el contrato');
                      }
                    } catch (error) {
                      console.error('❌ Error creating contract:', error);
                      // Si el backend no está disponible, crear localmente
                      const artist = artists.find(a => a.id === parseInt(newContract.artistId));
                      const newContractWithId = {
                        id: Date.now(), // ID temporal único
                        ...newContract,
                        artistId: parseInt(newContract.artistId),
                        artistName: artist?.name || 'Artista Desconocido',
                        artistPhoto: artist?.photo || '',
                        status: 'active',
                        type: 'Exclusivo',
                        territory: 'Mundial',
                        advancePayment: 0,
                        terms: 'Contrato creado desde el dashboard',
                        createdAt: new Date().toISOString().split('T')[0]
                      };
                      console.log('💾 Creando contrato localmente:', newContractWithId);
                      setContracts([...contracts, newContractWithId]);
                      alert('✅ Contrato creado localmente (backend no disponible)');
                      setShowNewContractModal(false);
                      setNewContract({
                        artistId: '',
                        percentage: 70,
                        startDate: new Date().toISOString().split('T')[0],
                        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                        serviceType: 'Distribución',
                        amount: 0
                      });
                    }
                  }}
                  disabled={!newContract.artistId || !newContract.endDate || !newContract.serviceType}
                  style={{
                    flex: 1,
                    padding: '12px 32px',
                    borderRadius: '8px',
                    background: (!newContract.artistId || !newContract.endDate || !newContract.serviceType) 
                      ? 'rgba(201, 165, 116, 0.12)' 
                      : 'linear-gradient(90deg, #c9a574 0%, #d4b684 100%)',
                    border: 'none',
                    color: (!newContract.artistId || !newContract.endDate || !newContract.serviceType) 
                      ? 'rgba(255, 255, 255, 0.3)' 
                      : '#0d1117',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: (!newContract.artistId || !newContract.endDate || !newContract.serviceType) 
                      ? 'not-allowed' 
                      : 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: (!newContract.artistId || !newContract.endDate || !newContract.serviceType) ? 0.5 : 1,
                    boxShadow: (!newContract.artistId || !newContract.endDate || !newContract.serviceType) 
                      ? 'none' 
                      : '0 6px 20px rgba(201, 165, 116, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    letterSpacing: '0.2px'
                  }}
                  onMouseEnter={(e) => {
                    if (newContract.artistId && newContract.endDate && newContract.serviceType) {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(201, 165, 116, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (newContract.artistId && newContract.endDate && newContract.serviceType) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 165, 116, 0.3)';
                    }
                  }}
                >
                  <CheckCircle size={18} strokeWidth={2.5} />
                  {(!newContract.artistId || !newContract.endDate || !newContract.serviceType) 
                    ? '🔒 Completa los Campos Requeridos' 
                    : '✅ Crear Contrato Ahora'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Artist Contracts Modal */}
      {showArtistContractsModal && selectedArtistContracts.length > 0 && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => setShowArtistContractsModal(false)}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 47, 47, 0.95) 0%, rgba(20, 30, 30, 0.98) 100%)',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '900px',
            width: '100%',
            border: '2px solid rgba(201, 165, 116, 0.3)',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.4)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.3), rgba(201, 165, 116, 0.1))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(201, 165, 116, 0.4)'
                  }}>
                    <FileText size={32} color="#c9a574" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                      Contratos de {artists.find(a => a.id === selectedArtistContracts[0].artistId)?.name}
                    </h2>
                    <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                      {selectedArtistContracts.length} contratos totales
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowArtistContractsModal(false)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <X size={20} color="#EF4444" />
                </button>
              </div>
            </div>

            {/* Contracts List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {selectedArtistContracts.map((contract) => {
                const isExpired = new Date(contract.endDate) < new Date();
                const daysUntilExpiry = Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry <= 30;

                return (
                  <div key={contract.id} style={{
                    background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                    border: `2px solid ${isExpired ? 'rgba(239, 68, 68, 0.4)' : isExpiringSoon ? 'rgba(251, 191, 36, 0.4)' : 'rgba(201, 165, 116, 0.2)'}`,
                    borderRadius: '16px',
                    padding: '20px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = isExpired ? 'rgba(239, 68, 68, 0.6)' : isExpiringSoon ? 'rgba(251, 191, 36, 0.6)' : 'rgba(201, 165, 116, 0.4)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isExpired ? 'rgba(239, 68, 68, 0.4)' : isExpiringSoon ? 'rgba(251, 191, 36, 0.4)' : 'rgba(201, 165, 116, 0.2)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px 200px auto', gap: '20px', alignItems: 'center' }}>
                      {/* Contract Info */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>
                            Contrato #{contract.id}
                          </h3>
                          <div style={{
                            padding: '3px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            background: 'rgba(201, 165, 116, 0.15)',
                            color: '#c9a574',
                            border: '1px solid rgba(201, 165, 116, 0.3)'
                          }}>
                            {contract.serviceType || 'Sin especificar'}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                          <div>
                            <span style={{ color: '#AFB3B7' }}>Inicio: </span>
                            <span style={{ color: '#ffffff', fontWeight: '600' }}>
                              {new Date(contract.startDate).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                          <div>
                            <span style={{ color: '#AFB3B7' }}>Fin: </span>
                            <span style={{ 
                              color: isExpired ? '#EF4444' : isExpiringSoon ? '#FBBF24' : '#ffffff', 
                              fontWeight: '600' 
                            }}>
                              {new Date(contract.endDate).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Percentage */}
                      <div style={{
                        background: 'rgba(42, 63, 63, 0.4)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        border: '1px solid rgba(201, 165, 116, 0.2)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <div>
                            <span style={{ fontSize: '11px', color: '#AFB3B7', display: 'block', marginBottom: '2px' }}>Artista</span>
                            <span style={{ fontSize: '18px', fontWeight: '700', color: '#c9a574' }}>
                              {contract.percentage}%
                            </span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '11px', color: '#AFB3B7', display: 'block', marginBottom: '2px' }}>BAM</span>
                            <span style={{ fontSize: '18px', fontWeight: '700', color: 'rgba(201, 165, 116, 0.7)' }}>
                              {100 - contract.percentage}%
                            </span>
                          </div>
                        </div>
                        <div style={{
                          height: '6px',
                          background: 'rgba(42, 63, 63, 0.6)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                          display: 'flex'
                        }}>
                          <div style={{
                            width: `${contract.percentage}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #c9a574, #d4b684)',
                            transition: 'width 0.5s ease'
                          }} />
                          <div style={{
                            width: `${100 - contract.percentage}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, rgba(201, 165, 116, 0.5), rgba(201, 165, 116, 0.7))',
                            transition: 'width 0.5s ease'
                          }} />
                        </div>
                      </div>

                      {/* Status */}
                      <div>
                        <div style={{
                          padding: '8px 16px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: isExpired ? 'rgba(239, 68, 68, 0.2)' : isExpiringSoon ? 'rgba(251, 191, 36, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                          color: isExpired ? '#EF4444' : isExpiringSoon ? '#FBBF24' : '#22C55E',
                          border: `1px solid ${isExpired ? 'rgba(239, 68, 68, 0.4)' : isExpiringSoon ? 'rgba(251, 191, 36, 0.4)' : 'rgba(34, 197, 94, 0.4)'}`,
                          textAlign: 'center'
                        }}>
                          {isExpired ? 'Expirado' : isExpiringSoon ? `${daysUntilExpiry} días` : 'Activo'}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => {
                          setEditingContract(contract);
                          setShowArtistContractsModal(false);
                        }}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '10px',
                          background: 'rgba(201, 165, 116, 0.2)',
                          border: '1px solid rgba(201, 165, 116, 0.4)',
                          color: '#c9a574',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(201, 165, 116, 0.3)';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <Edit2 size={14} />
                        Editar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

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