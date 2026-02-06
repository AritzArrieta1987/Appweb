import { useState, useEffect } from 'react';
import { Bell, BarChart3, Music, FileText, User, LogOut, TrendingUp, DollarSign, Disc, Award, X, Clock, CheckCircle, AlertCircle, Wallet, CreditCard, ArrowDownToLine, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import logoImage from 'figma:asset/aa0296e2522220bcfcda71f86c708cb2cbc616b9.png';
import backgroundImage from 'figma:asset/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493.png';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, type Notification } from '../config/api';

interface Artist {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  photo?: string;
  totalRevenue: number;
  totalStreams: number;
  trackCount: number;
}

interface Track {
  id: number;
  title: string;
  artistName: string;
  artistId: number;
  isrc?: string;
  totalRevenue: number;
  totalStreams: number;
  platforms: string[];
}

interface ArtistDashboardProps {
  artist: Artist;
  tracks: Track[];
  onLogout: () => void;
}

export default function ArtistDashboard({ artist, tracks, onLogout }: ArtistDashboardProps) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Función para formatear importes en formato europeo
  const formatEuro = (amount: number): string => {
    return amount.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + '€';
  };

  // Cargar notificaciones
  useEffect(() => {
    const loadNotifications = async () => {
      const notifs = await getNotifications();
      setNotifications(notifs);
    };

    loadNotifications();

    // Recargar notificaciones cada 30 segundos
    const interval = setInterval(loadNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  // Función para formatear tiempo relativo
  const formatTimeAgo = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Ahora mismo';
    if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `Hace ${Math.floor(seconds / 86400)}d`;
    return date.toLocaleDateString('es-ES');
  };

  const handleMarkAsRead = async (id: number) => {
    await markNotificationAsRead(id);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications(prev =>
      prev.map(n => ({ ...n, is_read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

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

  const tabs = [
    { name: 'Dashboard', icon: BarChart3 },
    { name: 'Mi Catálogo', icon: Music },
    { name: 'Royalties', icon: DollarSign },
    { name: 'Contratos', icon: FileText },
    { name: 'Mi Perfil', icon: User }
  ];

  const [royaltiesTab, setRoyaltiesTab] = useState<'historial' | 'retirar'>('historial');

  // Datos mensuales del artista
  const monthlyData = [
    { month: 'Ene', revenue: 4500, streams: 1200000 },
    { month: 'Feb', revenue: 5200, streams: 1450000 },
    { month: 'Mar', revenue: 4800, streams: 1320000 },
    { month: 'Abr', revenue: 6100, streams: 1680000 },
    { month: 'May', revenue: 5800, streams: 1590000 },
    { month: 'Jun', revenue: 6700, streams: 1820000 },
  ];

  // Colores de plataformas
  const platformColors: { [key: string]: string } = {
    'Spotify': '#1DB954',
    'Apple Music': '#FA243C',
    'YouTube': '#FF0000',
    'Amazon Music': '#FF9900',
    'Deezer': '#FEAA2D',
    'Tidal': '#000000',
    'Pandora': '#3668FF'
  };

  // Distribución por plataforma
  const platformData = tracks.reduce((acc: any[], track) => {
    track.platforms.forEach(platform => {
      const existing = acc.find(p => p.name === platform);
      if (existing) {
        existing.value += track.totalRevenue;
      } else {
        acc.push({
          name: platform,
          value: track.totalRevenue,
          color: platformColors[platform] || '#c9a574'
        });
      }
    });
    return acc;
  }, []);

  // Top tracks del artista
  const topTracks = tracks
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div>
            {/* Hero Banner - Full Width */}
            <div style={{
              position: 'relative',
              marginLeft: '-40px',
              marginRight: '-40px',
              marginTop: '-100px',
              marginBottom: '32px',
              height: '400px',
              background: artist.photo 
                ? `url(${artist.photo}) center/cover`
                : 'linear-gradient(135deg, rgba(201, 165, 116, 0.3) 0%, rgba(42, 63, 63, 0.5) 100%)',
              overflow: 'hidden'
            }}>
              {/* Overlay oscuro con degradado que se mimetiza con el fondo */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(15, 22, 22, 0.2) 0%, rgba(15, 22, 22, 0.6) 40%, rgba(19, 46, 53, 0.85) 70%, rgba(26, 50, 50, 0.95) 85%, #1a3232 100%)'
              }} />

              {/* Botón para cambiar foto */}
              <label style={{
                position: 'absolute',
                top: '120px',
                right: '40px',
                padding: '12px 20px',
                background: 'rgba(201, 165, 116, 0.2)',
                border: '2px solid rgba(201, 165, 116, 0.5)',
                borderRadius: '12px',
                color: '#c9a574',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                zIndex: 2
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(201, 165, 116, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.7)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.5)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                Cambiar Portada
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        // Aquí podrías actualizar la foto en el estado o enviarla al backend
                        console.log('Nueva foto seleccionada:', reader.result);
                        // Por ahora solo mostramos en consola
                        alert('Funcionalidad de cambio de foto: En una implementación real, esto subiría la imagen al servidor.');
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>

              {/* Información del artista */}
              <div style={{
                position: 'absolute',
                bottom: '32px',
                left: '40px',
                right: '40px',
                zIndex: 2
              }}>
                <h1 style={{
                  fontSize: '48px',
                  fontWeight: '900',
                  color: '#ffffff',
                  marginBottom: '12px',
                  letterSpacing: '-1px',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                }}>
                  ¡Bienvenido, {artist.name}!
                </h1>
                <p style={{
                  fontSize: '16px',
                  color: '#AFB3B7',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)'
                }}>
                  Aquí está el resumen de tu actividad musical
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              {[
                { title: 'Ingresos Totales', value: formatEuro(artist.totalRevenue), icon: DollarSign, color: '#c9a574' },
                { title: 'Total Streams', value: artist.totalStreams.toLocaleString(), icon: TrendingUp, color: '#4ade80' },
                { title: 'Canciones', value: tracks.length.toString(), icon: Music, color: '#60a5fa' },
                { title: 'Plataformas', value: platformData.length.toString(), icon: Disc, color: '#f87171' }
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} style={{
                    background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                    border: '1px solid rgba(201, 165, 116, 0.2)',
                    borderRadius: '16px',
                    padding: '24px',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      background: `linear-gradient(135deg, ${stat.color}33 0%, ${stat.color}11 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${stat.color}44`
                    }}>
                      <Icon size={28} color={stat.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '4px', fontWeight: '500' }}>
                        {stat.title}
                      </div>
                      <div style={{ fontSize: '26px', fontWeight: '700', color: '#ffffff' }}>
                        {stat.value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
              {/* Revenue Evolution */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(42, 63, 63, 0.4) 100%)',
                border: '2px solid rgba(201, 165, 116, 0.3)',
                borderRadius: '20px',
                padding: '28px',
                backdropFilter: 'blur(10px)'
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                  Evolución de Ingresos
                </h2>
                <p style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '24px' }}>
                  Últimos 6 meses
                </p>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(201, 165, 116, 0.1)" />
                    <XAxis 
                      dataKey="month" 
                      stroke="rgba(201, 165, 116, 0.4)" 
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="rgba(201, 165, 116, 0.4)" 
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(30, 47, 47, 0.95)',
                        border: '1px solid rgba(201, 165, 116, 0.3)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#c9a574" 
                      strokeWidth={3}
                      dot={{ fill: '#c9a574', r: 5 }}
                      activeDot={{ r: 7 }}
                      name="Ingresos (€)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Platform Distribution */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(42, 63, 63, 0.4) 100%)',
                border: '2px solid rgba(201, 165, 116, 0.3)',
                borderRadius: '20px',
                padding: '28px',
                backdropFilter: 'blur(10px)'
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                  Por Plataforma
                </h2>
                <p style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '24px' }}>
                  Distribución de ingresos
                </p>

                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatEuro(value)}
                      contentStyle={{
                        background: 'rgba(30, 47, 47, 0.95)',
                        border: '1px solid rgba(201, 165, 116, 0.3)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {platformData.slice(0, 5).map((platform, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '3px',
                          background: platform.color
                        }} />
                        <span style={{ fontSize: '13px', color: '#ffffff' }}>
                          {platform.name}
                        </span>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#c9a574' }}>
                        {formatEuro(platform.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(42, 63, 63, 0.4) 100%)',
              border: '2px solid rgba(201, 165, 116, 0.3)',
              borderRadius: '20px',
              padding: '28px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #c9a574 0%, #b8956a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(201, 165, 116, 0.3)'
                }}>
                  <Award size={24} color="#fff" />
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '2px' }}>
                    Tus Top Tracks
                  </h2>
                  <p style={{ fontSize: '13px', color: '#AFB3B7' }}>
                    Canciones más exitosas
                  </p>
                </div>
              </div>

              {/* Table */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '3fr 1.5fr 1fr 1fr 1fr',
                gap: '16px',
                padding: '12px 16px',
                background: 'rgba(201, 165, 116, 0.1)',
                borderRadius: '12px',
                marginBottom: '12px',
                borderBottom: '2px solid rgba(201, 165, 116, 0.3)'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase' }}>
                  Canción
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase' }}>
                  ISRC
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase' }}>
                  Streams
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase' }}>
                  Ingresos
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase' }}>
                  Plataformas
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {topTracks.map((track, index) => (
                  <div
                    key={track.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '3fr 1.5fr 1fr 1fr 1fr',
                      gap: '16px',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.3) 0%, rgba(201, 165, 116, 0.1) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#c9a574'
                      }}>
                        {index + 1}
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                        {track.title}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <code style={{
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        color: '#60a5fa',
                        background: 'rgba(96, 165, 250, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '6px'
                      }}>
                        {track.isrc || 'N/A'}
                      </code>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#4ade80' }}>
                        {track.totalStreams.toLocaleString()}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#c9a574' }}>
                        {formatEuro(track.totalRevenue)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                      {track.platforms.slice(0, 3).map((platform, i) => (
                        <div
                          key={i}
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: platformColors[platform] || '#c9a574'
                          }}
                          title={platform}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Mi Catálogo':
        return (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
              Mi Catálogo Musical
            </h1>

            <div style={{
              background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(42, 63, 63, 0.4) 100%)',
              border: '2px solid rgba(201, 165, 116, 0.3)',
              borderRadius: '20px',
              padding: '28px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '16px', color: '#AFB3B7' }}>
                  Tienes <strong style={{ color: '#c9a574' }}>{tracks.length} canciones</strong> en tu catálogo
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr',
                      gap: '16px',
                      padding: '20px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>
                        {track.title}
                      </div>
                      <div style={{ fontSize: '13px', color: '#AFB3B7' }}>
                        ISRC: {track.isrc || 'N/A'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '4px' }}>Streams</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#4ade80' }}>
                        {track.totalStreams.toLocaleString()}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '4px' }}>Ingresos</div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#c9a574' }}>
                        {formatEuro(track.totalRevenue)}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '4px' }}>Plataformas</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                        {track.platforms.length}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {track.platforms.map((platform, i) => (
                        <div
                          key={i}
                          style={{
                            fontSize: '11px',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            background: `${platformColors[platform] || '#c9a574'}22`,
                            color: platformColors[platform] || '#c9a574',
                            border: `1px solid ${platformColors[platform] || '#c9a574'}44`,
                            fontWeight: '600'
                          }}
                        >
                          {platform}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Royalties':
        return (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
              Retirar Fondos
            </h1>

            {/* Saldo Disponible */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.2) 0%, rgba(42, 63, 63, 0.5) 100%)',
              border: '2px solid rgba(201, 165, 116, 0.4)',
              borderRadius: '20px',
              padding: '32px',
              marginBottom: '32px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #c9a574 0%, #b8956a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 24px rgba(201, 165, 116, 0.4)'
              }}>
                <Wallet size={40} color="#fff" />
              </div>
              <div style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '12px', fontWeight: '500' }}>
                Saldo Disponible para Retiro
              </div>
              <div style={{ fontSize: '48px', fontWeight: '900', color: '#c9a574', marginBottom: '8px' }}>
                {formatEuro(artist.totalRevenue)}
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(175, 179, 183, 0.7)' }}>
                Total acumulado de royalties
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Formulario de Retiro */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(42, 63, 63, 0.4) 100%)',
                border: '2px solid rgba(201, 165, 116, 0.3)',
                borderRadius: '20px',
                padding: '28px',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ArrowDownToLine size={24} color="#fff" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '2px' }}>
                      Solicitar Retiro
                    </h2>
                    <p style={{ fontSize: '13px', color: '#AFB3B7' }}>
                      Completa los datos para procesar tu pago
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Cantidad a retirar */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#c9a574',
                      marginBottom: '8px'
                    }}>
                      Cantidad a Retirar
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        placeholder="0.00"
                        max={artist.totalRevenue}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          paddingRight: '40px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(201, 165, 116, 0.3)',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '16px',
                          fontWeight: '600',
                          outline: 'none'
                        }}
                      />
                      <span style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#c9a574',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}>€</span>
                    </div>
                    <button
                      style={{
                        marginTop: '8px',
                        padding: '6px 12px',
                        background: 'rgba(201, 165, 116, 0.1)',
                        border: '1px solid rgba(201, 165, 116, 0.3)',
                        borderRadius: '8px',
                        color: '#c9a574',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        const input = e.currentTarget.parentElement?.querySelector('input');
                        if (input) input.value = artist.totalRevenue.toString();
                      }}
                    >
                      Retirar Todo
                    </button>
                  </div>

                  {/* Método de Pago */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#c9a574',
                      marginBottom: '8px'
                    }}>
                      Método de Pago
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(201, 165, 116, 0.3)',
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontSize: '14px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="transferencia">Transferencia Bancaria</option>
                      <option value="paypal">PayPal</option>
                      <option value="bizum">Bizum</option>
                    </select>
                  </div>

                  {/* IBAN */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#c9a574',
                      marginBottom: '8px'
                    }}>
                      IBAN / Número de Cuenta
                    </label>
                    <input
                      type="text"
                      placeholder="ES00 0000 0000 0000 0000 0000"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(201, 165, 116, 0.3)',
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>

                  {/* Titular de la Cuenta */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#c9a574',
                      marginBottom: '8px'
                    }}>
                      Titular de la Cuenta
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre completo del titular"
                      defaultValue={artist.name}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(201, 165, 116, 0.3)',
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Banco */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#c9a574',
                      marginBottom: '8px'
                    }}>
                      Nombre del Banco
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: BBVA, Santander, CaixaBank..."
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(201, 165, 116, 0.3)',
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Información Importante */}
                  <div style={{
                    padding: '16px',
                    background: 'rgba(96, 165, 250, 0.1)',
                    border: '1px solid rgba(96, 165, 250, 0.3)',
                    borderRadius: '12px',
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <Info size={20} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '12px', color: '#AFB3B7', lineHeight: '1.6' }}>
                      <strong style={{ color: '#60a5fa' }}>Importante:</strong> Las solicitudes de retiro se procesan en un plazo de 5-7 días hábiles. Asegúrate de que los datos bancarios sean correctos.
                    </div>
                  </div>

                  {/* Botón de Solicitud */}
                  <button
                    onClick={() => {
                      alert('✅ Solicitud de retiro enviada correctamente.\n\nRecibirás una confirmación por email en las próximas 24 horas.\n\nEl pago se procesará en 5-7 días hábiles.');
                    }}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'linear-gradient(135deg, #c9a574 0%, #b8956a 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      boxShadow: '0 4px 16px rgba(201, 165, 116, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 24px rgba(201, 165, 116, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(201, 165, 116, 0.3)';
                    }}
                  >
                    <CreditCard size={20} />
                    Solicitar Retiro
                  </button>
                </div>
              </div>

              {/* Historial de Retiros */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(42, 63, 63, 0.4) 100%)',
                border: '2px solid rgba(201, 165, 116, 0.3)',
                borderRadius: '20px',
                padding: '28px',
                backdropFilter: 'blur(10px)'
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                  Historial de Retiros
                </h2>
                <p style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '24px' }}>
                  Últimas solicitudes de pago
                </p>

                {/* Lista de retiros de ejemplo */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { date: '15 Ene 2026', amount: 2500, status: 'Completado', method: 'Transferencia' },
                    { date: '10 Dic 2025', amount: 1850, status: 'Completado', method: 'PayPal' },
                    { date: '05 Nov 2025', amount: 3200, status: 'Completado', method: 'Transferencia' },
                    { date: '22 Oct 2025', amount: 1500, status: 'Completado', method: 'Bizum' }
                  ].map((retiro, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>
                          {formatEuro(retiro.amount)}
                        </div>
                        <div style={{ fontSize: '12px', color: '#AFB3B7' }}>
                          {retiro.date} · {retiro.method}
                        </div>
                      </div>
                      <div style={{
                        padding: '6px 12px',
                        background: 'rgba(74, 222, 128, 0.1)',
                        border: '1px solid rgba(74, 222, 128, 0.3)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#4ade80'
                      }}>
                        ✓ {retiro.status}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Info adicional */}
                <div style={{
                  marginTop: '24px',
                  padding: '16px',
                  background: 'rgba(201, 165, 116, 0.05)',
                  border: '1px solid rgba(201, 165, 116, 0.2)',
                  borderRadius: '12px'
                }}>
                  <div style={{ fontSize: '12px', color: '#AFB3B7', lineHeight: '1.6' }}>
                    <strong style={{ color: '#c9a574' }}>Política de retiros:</strong><br />
                    • Mínimo de retiro: 50€<br />
                    • Comisión: 0% (gratis)<br />
                    • Tiempo de procesamiento: 5-7 días hábiles
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Contratos':
        return (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
              Mis Contratos
            </h1>

            <div style={{
              background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(42, 63, 63, 0.4) 100%)',
              border: '2px solid rgba(201, 165, 116, 0.3)',
              borderRadius: '20px',
              padding: '40px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <FileText size={64} color="#c9a574" style={{ margin: '0 auto 24px' }} />
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>
                Contrato Activo
              </h2>
              <p style={{ fontSize: '16px', color: '#AFB3B7', marginBottom: '32px' }}>
                Contrato de distribución digital vigente
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px',
                maxWidth: '600px',
                margin: '0 auto',
                textAlign: 'left'
              }}>
                <div style={{
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '8px' }}>Tipo de Contrato</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
                    Distribución Digital
                  </div>
                </div>

                <div style={{
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '8px' }}>Porcentaje</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#4ade80' }}>
                    70% Artista
                  </div>
                </div>

                <div style={{
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '8px' }}>Fecha de Inicio</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
                    01/01/2024
                  </div>
                </div>

                <div style={{
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '8px' }}>Estado</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#4ade80' }}>
                    ✓ Activo
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Mi Perfil':
        return (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
              Mi Perfil
            </h1>

            <div style={{
              background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(42, 63, 63, 0.4) 100%)',
              border: '2px solid rgba(201, 165, 116, 0.3)',
              borderRadius: '20px',
              padding: '40px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ display: 'flex', gap: '40px', alignItems: 'start' }}>
                {/* Foto de perfil */}
                <div style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '16px',
                  background: artist.photo 
                    ? `url(${artist.photo}) center/cover`
                    : 'linear-gradient(135deg, rgba(201, 165, 116, 0.3) 0%, rgba(42, 63, 63, 0.5) 100%)',
                  border: '3px solid rgba(201, 165, 116, 0.3)',
                  boxShadow: '0 8px 32px rgba(201, 165, 116, 0.2)',
                  flexShrink: 0
                }} />

                {/* Información */}
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#ffffff', marginBottom: '24px' }}>
                    {artist.name}
                  </h2>

                  <div style={{ display: 'grid', gap: '16px' }}>
                    {artist.email && (
                      <div style={{
                        padding: '16px 20px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                      }}>
                        <div style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '6px' }}>Email</div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
                          {artist.email}
                        </div>
                      </div>
                    )}

                    {artist.phone && (
                      <div style={{
                        padding: '16px 20px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                      }}>
                        <div style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '6px' }}>Teléfono</div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
                          {artist.phone}
                        </div>
                      </div>
                    )}

                    <div style={{
                      padding: '16px 20px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      <div style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '6px' }}>ID de Artista</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
                        #{artist.id.toString().padStart(6, '0')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* BACKGROUND IMAGE */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.15,
        zIndex: 0
      }} />

      {/* OVERLAY VERDE GLOBAL */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(13, 31, 35, 0.85) 0%, rgba(19, 46, 53, 0.8) 50%, rgba(45, 74, 83, 0.75) 100%)',
        backdropFilter: 'blur(2px)',
        zIndex: 0
      }} />

      {/* CAPA DE TINTE VERDE */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(32, 64, 64, 0.4)',
        mixBlendMode: 'multiply' as const,
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* HEADER */}
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

          <div style={{ display: 'flex', gap: '8px', flex: 1, overflowX: 'auto' }} className="tabs-container">
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
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.name) {
                      e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
                      e.currentTarget.style.color = '#c9a574';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.name) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#AFB3B7';
                    }
                  }}
                >
                  <Icon size={isScrolled ? 14 : 15} />
                  {tab.name}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
              }}
            >
              <Bell size={isScrolled ? 16 : 18} />
              {unreadCount > 0 && (
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
                  {unreadCount}
                </div>
              )}
            </button>

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
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
              }}
            >
              <LogOut size={isScrolled ? 14 : 16} />
              Salir
            </button>
          </div>
        </header>

        {/* PANEL DE NOTIFICACIONES */}
        {showNotifications && (
          <>
            {/* Overlay para cerrar al hacer clic fuera */}
            <div
              onClick={() => setShowNotifications(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 110,
                background: 'transparent'
              }}
            />

            {/* Panel de Notificaciones */}
            <div style={{
              position: 'fixed',
              top: isScrolled ? '70px' : '90px',
              right: '32px',
              width: '420px',
              maxHeight: '600px',
              background: 'linear-gradient(180deg, rgba(20, 35, 35, 0.98) 0%, rgba(15, 22, 22, 0.99) 100%)',
              border: '2px solid rgba(201, 165, 116, 0.4)',
              borderRadius: '20px',
              overflow: 'hidden',
              zIndex: 120,
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s ease'
            }}>
              {/* Header del Panel */}
              <div style={{
                padding: '24px',
                borderBottom: '1px solid rgba(201, 165, 116, 0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(201, 165, 116, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #c9a574 0%, #b8956a 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Bell size={20} color="#fff" />
                  </div>
                  <div>
                    <h3 style={{ 
                      color: '#ffffff', 
                      fontSize: '18px', 
                      fontWeight: '700',
                      marginBottom: '2px'
                    }}>
                      Notificaciones
                    </h3>
                    <p style={{ fontSize: '12px', color: '#AFB3B7' }}>
                      {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowNotifications(false)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <X size={20} color="#AFB3B7" />
                </button>
              </div>

              {/* Botón Marcar Todas como Leídas */}
              {unreadCount > 0 && (
                <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(201, 165, 116, 0.1)' }}>
                  <button
                    onClick={handleMarkAllAsRead}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: 'rgba(201, 165, 116, 0.1)',
                      border: '1px solid rgba(201, 165, 116, 0.3)',
                      borderRadius: '10px',
                      color: '#c9a574',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                    }}
                  >
                    <CheckCircle size={16} />
                    Marcar todas como leídas
                  </button>
                </div>
              )}

              {/* Lista de Notificaciones */}
              <div style={{ 
                maxHeight: '450px', 
                overflowY: 'auto',
                padding: '12px'
              }}>
                {notifications.length === 0 ? (
                  <div style={{
                    padding: '60px 20px',
                    textAlign: 'center'
                  }}>
                    <Bell size={48} color="rgba(201, 165, 116, 0.3)" style={{ margin: '0 auto 16px' }} />
                    <p style={{ 
                      fontSize: '16px', 
                      fontWeight: '600',
                      color: '#AFB3B7',
                      marginBottom: '8px'
                    }}>
                      No hay notificaciones
                    </p>
                    <p style={{ fontSize: '13px', color: 'rgba(175, 179, 183, 0.6)' }}>
                      Te avisaremos cuando haya novedades
                    </p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const getNotificationIcon = () => {
                      switch (notif.type) {
                        case 'csv_upload':
                          return <Music size={20} color="#4ade80" />;
                        case 'success':
                          return <CheckCircle size={20} color="#4ade80" />;
                        case 'warning':
                          return <AlertCircle size={20} color="#f59e0b" />;
                        default:
                          return <Bell size={20} color="#60a5fa" />;
                      }
                    };

                    const getNotificationBg = () => {
                      switch (notif.type) {
                        case 'csv_upload':
                          return 'rgba(74, 222, 128, 0.05)';
                        case 'success':
                          return 'rgba(74, 222, 128, 0.05)';
                        case 'warning':
                          return 'rgba(245, 158, 11, 0.05)';
                        default:
                          return 'rgba(96, 165, 250, 0.05)';
                      }
                    };

                    const getNotificationBorder = () => {
                      switch (notif.type) {
                        case 'csv_upload':
                          return '1px solid rgba(74, 222, 128, 0.2)';
                        case 'success':
                          return '1px solid rgba(74, 222, 128, 0.2)';
                        case 'warning':
                          return '1px solid rgba(245, 158, 11, 0.2)';
                        default:
                          return '1px solid rgba(96, 165, 250, 0.2)';
                      }
                    };

                    return (
                      <div
                        key={notif.id}
                        onClick={() => handleMarkAsRead(notif.id)}
                        style={{
                          padding: '16px',
                          marginBottom: '8px',
                          background: notif.is_read 
                            ? 'rgba(255, 255, 255, 0.02)' 
                            : getNotificationBg(),
                          border: notif.is_read 
                            ? '1px solid rgba(255, 255, 255, 0.05)' 
                            : getNotificationBorder(),
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          opacity: notif.is_read ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = notif.is_read 
                            ? 'rgba(255, 255, 255, 0.04)' 
                            : 'rgba(201, 165, 116, 0.1)';
                          e.currentTarget.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = notif.is_read 
                            ? 'rgba(255, 255, 255, 0.02)' 
                            : getNotificationBg();
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        {/* Indicador de no leída */}
                        {!notif.is_read && (
                          <div style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#ef4444',
                            boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)'
                          }} />
                        )}

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                          {/* Icono */}
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {getNotificationIcon()}
                          </div>

                          {/* Contenido */}
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontSize: '14px',
                              fontWeight: '700',
                              color: '#ffffff',
                              marginBottom: '6px',
                              paddingRight: '16px'
                            }}>
                              {notif.title}
                            </div>
                            <div style={{
                              fontSize: '13px',
                              color: '#AFB3B7',
                              lineHeight: '1.5',
                              marginBottom: '8px'
                            }}>
                              {notif.message}
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '11px',
                              color: 'rgba(175, 179, 183, 0.6)',
                              fontWeight: '500'
                            }}>
                              <Clock size={12} />
                              {formatTimeAgo(notif.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}

        {/* MAIN CONTENT */}
        <main style={{
          padding: '40px',
          paddingTop: '100px',
          maxWidth: '1400px',
          margin: '0 auto',
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

      {/* BOTTOM NAVIGATION - Mobile Only */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '70px',
        background: 'linear-gradient(180deg, rgba(15, 22, 22, 0.98) 0%, rgba(10, 15, 15, 0.99) 100%)',
        borderTop: '1px solid rgba(201, 165, 116, 0.2)',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 20px',
        zIndex: 100,
        backdropFilter: 'blur(20px)'
      }}
      className="bottom-nav"
      >
        {tabs.slice(0, 5).map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;
          
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                background: 'transparent',
                border: 'none',
                color: isActive ? '#c9a574' : '#69818D',
                cursor: 'pointer',
                padding: '8px 12px',
                transition: 'all 0.3s ease'
              }}
            >
              <Icon size={22} />
              <span style={{
                fontSize: '10px',
                fontWeight: isActive ? '700' : '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {tab.name === 'Mi Catálogo' ? 'Catálogo' : tab.name === 'Mi Perfil' ? 'Perfil' : tab.name}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Styles */}
      <style>{`
        @media (max-width: 768px) {
          header {
            padding: 12px 16px !important;
            flex-wrap: wrap;
          }

          header img {
            height: 28px !important;
          }

          .tabs-container {
            order: 3;
            width: 100%;
            margin-top: 8px;
            justify-content: flex-start;
          }

          main {
            padding: 20px !important;
            padding-top: 120px !important;
            padding-bottom: 90px !important;
          }

          .bottom-nav {
            display: flex !important;
          }

          footer {
            padding-bottom: 80px !important;
          }
        }
      `}</style>
    </div>
  );
}