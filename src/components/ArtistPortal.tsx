import { useState, useEffect, useRef } from 'react';
import { Bell, BarChart3, Music, FileText, DollarSign, LogOut, Disc, CheckCircle, AlertCircle, Info, X, TrendingUp, Calendar, Camera, Upload as UploadIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import logoImage from 'figma:asset/aa0296e2522220bcfcda71f86c708cb2cbc616b9.png';
import backgroundImage from 'figma:asset/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493.png';

interface ArtistPortalProps {
  onLogout: () => void;
  artistData?: {
    id: number;
    name: string;
    email: string;
    photo?: string;
    totalRevenue: number;
    totalStreams: number;
    tracks: any[];
    monthlyData: { month: string; revenue: number; streams: number }[];
    platformBreakdown: { [key: string]: number };
  };
}

export default function ArtistPortal({ onLogout, artistData }: ArtistPortalProps) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', title: 'Nuevo Pago', message: 'Se ha procesado tu pago de royalties', time: 'Hace 2 días', read: false },
    { id: 2, type: 'info', title: 'Reporte Disponible', message: 'Tu reporte mensual está listo', time: 'Hace 1 semana', read: false }
  ]);
  const notificationRef = useRef<HTMLDivElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [bannerImage, setBannerImage] = useState<string>('https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1400&h=300&fit=crop');

  // Función para formatear importes en formato europeo
  const formatEuro = (amount: number): string => {
    return amount.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + '€';
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

  // Función para cambiar imagen del banner
  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
    { name: 'Mis Canciones', icon: Music },
    { name: 'Royalties', icon: DollarSign },
    { name: 'Contratos', icon: FileText }
  ];

  // Datos de ejemplo (cuando artistData no esté disponible)
  const mockData = {
    id: 1,
    name: 'Artista Demo',
    email: 'artista@bigartist.es',
    totalRevenue: 0,
    totalStreams: 0,
    tracks: [],
    monthlyData: [],
    platformBreakdown: {}
  };

  const data = artistData || mockData;

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

  // Datos para gráfico de plataformas
  const platformChartData = Object.entries(data.platformBreakdown).map(([name, value]) => ({
    name,
    value,
    color: platformColors[name] || '#c9a574'
  }));

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#ffffff' }}>
              Bienvenido, {data.name}
            </h1>
            <p style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '32px' }}>
              Aquí puedes ver todas tus estadísticas y royalties
            </p>
            
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              {[
                { title: 'Total Royalties', value: formatEuro(data.totalRevenue), change: '+0%', color: '#c9a574' },
                { title: 'Total Streams', value: data.totalStreams.toLocaleString(), change: `+${data.totalStreams.toLocaleString()}`, color: '#4ade80' },
                { title: 'Canciones', value: data.tracks.length.toString(), change: `${data.tracks.length} tracks`, color: '#60a5fa' },
                { title: 'Plataformas', value: Object.keys(data.platformBreakdown).length.toString(), change: 'DSPs activos', color: '#f87171' }
              ].map((stat, i) => (
                <div key={i} style={{
                  background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                  border: '1px solid rgba(201, 165, 116, 0.2)',
                  borderRadius: '16px',
                  padding: '24px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '8px', fontWeight: '500' }}>
                    {stat.title}
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '13px', color: stat.color, fontWeight: '600' }}>
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Two Column Layout: Revenue Chart + Platform Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              
              {/* Revenue Chart */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(42, 63, 63, 0.4) 100%)',
                border: '2px solid rgba(201, 165, 116, 0.3)',
                borderRadius: '20px',
                padding: '28px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(201, 165, 116, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
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
                    <TrendingUp size={24} color="#fff" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '2px' }}>
                      Ingresos Mensuales
                    </h2>
                    <p style={{ fontSize: '13px', color: '#AFB3B7' }}>
                      Evolución de tus royalties
                    </p>
                  </div>
                </div>

                {data.monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.monthlyData}>
                      <XAxis dataKey="month" stroke="#AFB3B7" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#AFB3B7" style={{ fontSize: '12px' }} />
                      <Tooltip 
                        formatter={(value: number) => [`€${value}`, 'Revenue']}
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
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#AFB3B7' }}>
                    <p>No hay datos disponibles</p>
                  </div>
                )}
              </div>

              {/* Platform Breakdown */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(42, 63, 63, 0.4) 100%)',
                border: '2px solid rgba(201, 165, 116, 0.3)',
                borderRadius: '20px',
                padding: '28px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(201, 165, 116, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
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
                    <BarChart3 size={24} color="#fff" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '2px' }}>
                      Por Plataforma
                    </h2>
                    <p style={{ fontSize: '13px', color: '#AFB3B7' }}>
                      Distribución de ingresos
                    </p>
                  </div>
                </div>

                {platformChartData.length > 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <ResponsiveContainer width="50%" height={250}>
                      <PieChart>
                        <Pie
                          data={platformChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={5}
                          dataKey="value"
                          label={(entry) => {
                            const total = platformChartData.reduce((sum, item) => sum + item.value, 0);
                            const percent = ((entry.value / total) * 100).toFixed(1);
                            return `${percent}%`;
                          }}
                        >
                          {platformChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => `€${value}`}
                          contentStyle={{
                            background: 'rgba(30, 47, 47, 0.95)',
                            border: '1px solid rgba(201, 165, 116, 0.3)',
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {platformChartData.map((platform, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '10px',
                          padding: '8px 12px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '3px',
                            background: platform.color
                          }} />
                          <span style={{ 
                            color: '#ffffff', 
                            fontSize: '14px', 
                            fontWeight: '500',
                            flex: 1
                          }}>
                            {platform.name}
                          </span>
                          <span style={{ 
                            color: '#c9a574', 
                            fontSize: '14px', 
                            fontWeight: '600'
                          }}>
                            €{platform.value.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#AFB3B7' }}>
                    <p>No hay datos de plataformas</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'Mis Canciones':
        return (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
              Mis Canciones
            </h1>
            
            {data.tracks.length === 0 ? (
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '16px',
                padding: '48px',
                textAlign: 'center'
              }}>
                <Music size={48} color="#c9a574" style={{ margin: '0 auto 16px' }} />
                <p style={{ fontSize: '18px', color: '#AFB3B7', marginBottom: '8px' }}>No hay canciones aún</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Tus canciones aparecerán aquí cuando se procesen los datos</p>
              </div>
            ) : (
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                {/* Table Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1.5fr',
                  gap: '16px',
                  padding: '12px 16px',
                  background: 'rgba(201, 165, 116, 0.1)',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  borderBottom: '2px solid rgba(201, 165, 116, 0.3)'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase' }}>Canción</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase' }}>ISRC</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase' }}>Streams</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase' }}>Revenue</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase' }}>Plataformas</div>
                </div>

                {/* Table Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {data.tracks.map((track: any, index: number) => (
                    <div
                      key={index}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1.5fr',
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
                          flexShrink: 0
                        }}>
                          <Disc size={20} color="#c9a574" />
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
                          borderRadius: '6px',
                          border: '1px solid rgba(96, 165, 250, 0.2)'
                        }}>
                          {track.isrc || 'N/A'}
                        </code>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#4ade80' }}>
                          {track.totalStreams?.toLocaleString() || '0'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#c9a574' }}>
                          {formatEuro(track.totalRevenue || 0)}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                        {(track.platforms || []).slice(0, 3).map((platform: string, i: number) => (
                          <div
                            key={i}
                            style={{
                              padding: '4px 8px',
                              background: 'rgba(201, 165, 116, 0.1)',
                              borderRadius: '6px',
                              border: '1px solid rgba(201, 165, 116, 0.2)',
                              fontSize: '11px',
                              color: '#c9a574',
                              fontWeight: '500'
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
            )}
          </div>
        );
      
      case 'Royalties':
        return (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
              Mis Royalties
            </h1>
            
            <div style={{
              background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <DollarSign size={48} color="#c9a574" style={{ margin: '0 auto 16px' }} />
              <p style={{ fontSize: '18px', color: '#AFB3B7', marginBottom: '8px' }}>Historial de Pagos</p>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Esta sección mostrará el historial de tus pagos de royalties</p>
            </div>
          </div>
        );
      
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

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* IMAGEN DE FONDO GLOBAL */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        opacity: 0.45,
        filter: 'blur(1px)',
        zIndex: 0
      }} />

      {/* OVERLAY VERDE GLOBAL */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(13, 31, 35, 0.88) 0%, rgba(19, 46, 53, 0.85) 50%, rgba(45, 74, 83, 0.82) 100%)',
        backdropFilter: 'blur(2px)',
        zIndex: 0
      }} />

      {/* CAPA DE TINTE VERDE GLOBAL */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(32, 64, 64, 0.5)',
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
                            onClick={() => markAsRead(notif.id)}
                          >
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
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
                              >
                                <X size={14} />
                              </button>
                            </div>

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

        {/* Artist Banner */}
        <div style={{
          position: 'relative',
          marginTop: '80px',
          width: '100%'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '420px',
            overflow: 'visible'
          }}>
            {/* Banner Image */}
            <div style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${bannerImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}>
              {/* Overlay Verde Principal */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(13, 31, 35, 0.75) 0%, rgba(19, 46, 53, 0.7) 50%, rgba(45, 74, 83, 0.65) 100%)'
              }} />
              
              {/* Capa de Tinte Verde para Mimetizar */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(32, 64, 64, 0.5)',
                mixBlendMode: 'multiply' as const
              }} />
              
              {/* Gradient Oscuro Inferior Pronunciado */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 0%, transparent 30%, rgba(13, 31, 35, 0.3) 50%, rgba(13, 31, 35, 0.7) 75%, rgba(13, 31, 35, 0.95) 100%)'
              }} />
              
              {/* Difuminado Extra para Mimetizar con Fondo */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '300px',
                background: 'linear-gradient(180deg, transparent 0%, rgba(19, 46, 53, 0.3) 30%, rgba(32, 64, 64, 0.6) 60%, rgba(42, 63, 63, 0.85) 85%, rgba(42, 63, 63, 0.95) 100%)',
                filter: 'blur(35px)',
                transform: 'translateY(50px)',
                pointerEvents: 'none'
              }} />
              
              {/* Change Photo Button */}
              <button
                onClick={() => bannerInputRef.current?.click()}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  padding: '10px 16px',
                  background: 'rgba(201, 165, 116, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(201, 165, 116, 0.5)',
                  borderRadius: '10px',
                  color: '#0D1F23',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(201, 165, 116, 1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(201, 165, 116, 0.9)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                }}
              >
                <Camera size={16} />
                Cambiar Banner
              </button>

              {/* Hidden File Input */}
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main style={{
          padding: '40px',
          paddingTop: '32px',
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
                {['Política de Privacidad', 'Términos y Condiciones', 'Soporte'].map((link, i) => (
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