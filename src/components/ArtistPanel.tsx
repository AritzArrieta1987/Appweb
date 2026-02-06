import { useState, useEffect } from 'react';
import { ArrowLeft, Music, TrendingUp, DollarSign, Calendar, PlayCircle, Download, FileText, Bell, BarChart3, User, Disc, Award, Wallet, CreditCard, Info } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import backgroundImage from 'figma:asset/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493.png';

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
  isrc?: string;
  totalRevenue: number;
  totalStreams: number;
  platforms: string[];
}

interface ArtistPanelProps {
  artist: Artist;
  tracks: Track[];
  onBack: () => void;
}

export default function ArtistPanel({ artist, tracks, onBack }: ArtistPanelProps) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('Este Mes');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Formatear euros
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

  const tabs = [
    { name: 'Dashboard', icon: BarChart3 },
    { name: 'Mis Canciones', icon: Music },
    { name: 'Royalties', icon: DollarSign },
    { name: 'Perfil', icon: User }
  ];

  // Datos de ejemplo para gráficos (en producción vendrían del backend)
  const monthlyData = [
    { month: 'Ene', revenue: 4500, streams: 120000 },
    { month: 'Feb', revenue: 5200, streams: 145000 },
    { month: 'Mar', revenue: 4800, streams: 132000 },
    { month: 'Abr', revenue: 6100, streams: 168000 },
    { month: 'May', revenue: 5800, streams: 159000 },
    { month: 'Jun', revenue: 6700, streams: 182000 },
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

  // Determinar si el usuario es artista o admin
  const userString = localStorage.getItem('user');
  let isArtistView = false;
  if (userString) {
    try {
      const user = JSON.parse(userString);
      isArtistView = user.email !== 'admin@bigartist.es' && user.email?.includes('@bigartist.es');
    } catch (error) {
      // ignore
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1616 0%, #1a2626 100%)',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Hero Banner con foto del artista */}
      <div style={{
        position: 'relative',
        height: '400px',
        background: artist.photo 
          ? `url(${artist.photo}) center/cover`
          : 'linear-gradient(135deg, rgba(201, 165, 116, 0.3) 0%, rgba(42, 63, 63, 0.5) 100%)',
        overflow: 'hidden'
      }}>
        {/* Overlay oscuro para legibilidad */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(15, 22, 22, 0.3) 0%, rgba(15, 22, 22, 0.85) 70%, #0f1616 100%)'
        }} />

        {/* Patrón de puntos decorativo */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(201, 165, 116, 0.1) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.3
        }} />

        {/* Botón de volver - posición absoluta */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '32px',
            left: '40px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: 'rgba(15, 22, 22, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(201, 165, 116, 0.4)',
            borderRadius: '10px',
            color: '#c9a574',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
            e.currentTarget.style.borderColor = '#c9a574';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(15, 22, 22, 0.8)';
            e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.4)';
          }}
        >
          <ArrowLeft size={20} />
          {isArtistView ? 'Cerrar Sesión' : 'Volver a Artistas'}
        </button>

        {/* Información del artista sobre el banner */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '40px',
          right: '40px',
          zIndex: 5
        }}>
          <h1 style={{
            fontSize: '64px',
            fontWeight: '900',
            color: '#ffffff',
            marginBottom: '16px',
            letterSpacing: '-1px',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
          }}>
            {artist.name}
          </h1>

          <div style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            {artist.email && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '15px',
                color: '#ffffff',
                background: 'rgba(15, 22, 22, 0.6)',
                backdropFilter: 'blur(10px)',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(201, 165, 116, 0.3)'
              }}>
                <span>📧</span>
                {artist.email}
              </div>
            )}

            {artist.phone && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '15px',
                color: '#ffffff',
                background: 'rgba(15, 22, 22, 0.6)',
                backdropFilter: 'blur(10px)',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(201, 165, 116, 0.3)'
              }}>
                <span>📱</span>
                {artist.phone}
              </div>
            )}
          </div>

          {/* Quick Stats en el banner */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, auto)',
            gap: '32px',
            width: 'fit-content'
          }}>
            <div style={{
              background: 'rgba(15, 22, 22, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(201, 165, 116, 0.4)',
              borderRadius: '12px',
              padding: '16px 24px'
            }}>
              <div style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Revenue
              </div>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#c9a574' }}>
                {formatEuro(artist.totalRevenue)}
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 22, 22, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(74, 222, 128, 0.4)',
              borderRadius: '12px',
              padding: '16px 24px'
            }}>
              <div style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Streams
              </div>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#4ade80' }}>
                {artist.totalStreams.toLocaleString()}
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 22, 22, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(96, 165, 250, 0.4)',
              borderRadius: '12px',
              padding: '16px 24px'
            }}>
              <div style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Tracks
              </div>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#60a5fa' }}>
                {artist.trackCount || tracks.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal con padding */}
      <div style={{ padding: '40px' }}>
        {/* Tabs Section */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              style={{
                padding: '12px 24px',
                background: activeTab === tab.name ? 'rgba(201, 165, 116, 0.2)' : 'rgba(15, 22, 22, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(201, 165, 116, 0.4)',
                borderRadius: '12px',
                color: '#c9a574',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
                e.currentTarget.style.borderColor = '#c9a574';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = activeTab === tab.name ? 'rgba(201, 165, 116, 0.2)' : 'rgba(15, 22, 22, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.4)';
              }}
            >
              <tab.icon size={20} style={{ marginRight: '8px' }} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Dashboard Content */}
        {activeTab === 'Dashboard' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {/* Revenue Evolution */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(42, 63, 63, 0.4) 100%)',
              border: '2px solid rgba(201, 165, 116, 0.3)',
              borderRadius: '20px',
              padding: '28px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                    Evolución de Ingresos
                  </h2>
                  <p style={{ fontSize: '13px', color: '#AFB3B7' }}>
                    Últimos 6 meses
                  </p>
                </div>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  style={{
                    padding: '8px 16px',
                    background: '#2a3f3f',
                    border: '1px solid rgba(201, 165, 116, 0.2)',
                    borderRadius: '8px',
                    color: '#c9a574',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <option>Este Mes</option>
                  <option>Este Trimestre</option>
                  <option>Este Año</option>
                </select>
              </div>

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
                    name="Revenue (€)"
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
        )}

        {/* Mis Canciones Content */}
        {activeTab === 'Mis Canciones' && (
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
                <Music size={24} color="#fff" />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '2px' }}>
                  Top Tracks
                </h2>
                <p style={{ fontSize: '13px', color: '#AFB3B7' }}>
                  Canciones más exitosas
                </p>
              </div>
            </div>

            {/* Table Header */}
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
                Revenue
              </div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase' }}>
                Plataformas
              </div>
            </div>

            {/* Table Rows */}
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
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
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
                  {/* Title */}
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

                  {/* ISRC */}
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

                  {/* Streams */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#4ade80' }}>
                      {track.totalStreams.toLocaleString()}
                    </span>
                  </div>

                  {/* Revenue */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#c9a574' }}>
                      {formatEuro(track.totalRevenue)}
                    </span>
                  </div>

                  {/* Platforms */}
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
        )}

        {/* Royalties Content */}
        {activeTab === 'Royalties' && (
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
                <DollarSign size={24} color="#fff" />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '2px' }}>
                  Royalties
                </h2>
                <p style={{ fontSize: '13px', color: '#AFB3B7' }}>
                  Detalles de los pagos
                </p>
              </div>
            </div>

            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
              gap: '16px',
              padding: '12px 16px',
              background: 'rgba(201, 165, 116, 0.1)',
              borderRadius: '12px',
              marginBottom: '12px',
              borderBottom: '2px solid rgba(201, 165, 116, 0.3)'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase' }}>
                Fecha
              </div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase' }}>
                Monto
              </div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase' }}>
                Plataforma
              </div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase' }}>
                Estado
              </div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase' }}>
                Detalles
              </div>
            </div>

            {/* Table Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Ejemplo de fila */}
              <div
                key="royalty1"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                  gap: '16px',
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
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
                {/* Fecha */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                    01/06/2023
                  </span>
                </div>

                {/* Monto */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#c9a574' }}>
                    {formatEuro(1500)}
                  </span>
                </div>

                {/* Plataforma */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                    Spotify
                  </span>
                </div>

                {/* Estado */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#4ade80' }}>
                    Pagado
                  </span>
                </div>

                {/* Detalles */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FileText size={16} color="#c9a574" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Perfil Content */}
        {activeTab === 'Perfil' && (
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
                <User size={24} color="#fff" />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '2px' }}>
                  Perfil
                </h2>
                <p style={{ fontSize: '13px', color: '#AFB3B7' }}>
                  Información personal
                </p>
              </div>
            </div>

            {/* Formulario de Perfil */}
            <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#c9a574', fontWeight: '600' }}>
                  Nombre
                </label>
                <input
                  type="text"
                  value={artist.name}
                  readOnly
                  style={{
                    padding: '10px 16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#c9a574', fontWeight: '600' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={artist.email || ''}
                  readOnly
                  style={{
                    padding: '10px 16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#c9a574', fontWeight: '600' }}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={artist.phone || ''}
                  readOnly
                  style={{
                    padding: '10px 16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', color: '#c9a574', fontWeight: '600' }}>
                  Foto de Perfil
                </label>
                <input
                  type="text"
                  value={artist.photo || ''}
                  readOnly
                  style={{
                    padding: '10px 16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}