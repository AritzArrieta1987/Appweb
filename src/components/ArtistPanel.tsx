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
  tracks?: Track[];
  onBack: () => void;
}

export default function ArtistPanel({ artist, tracks = [], onBack }: ArtistPanelProps) {
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

  // Datos de ejemplo para gráficos
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
        {/* Header fijo con tabs */}
        <header style={{
          background: 'transparent',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(201, 165, 116, 0.15)',
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
          boxShadow: 'none',
          transform: showHeader ? 'translateY(0)' : 'translateY(-100%)',
          opacity: showHeader ? 1 : 0
        }}>
          {/* Botón Volver */}
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: isScrolled ? '6px 12px' : '8px 16px',
              background: 'rgba(201, 165, 116, 0.2)',
              border: '1px solid rgba(201, 165, 116, 0.4)',
              borderRadius: '10px',
              color: '#c9a574',
              fontSize: isScrolled ? '12px' : '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(201, 165, 116, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
            }}
          >
            <ArrowLeft size={isScrolled ? 14 : 16} />
            Volver
          </button>

          {/* Tabs en el header */}
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
                    e.currentTarget.style.color = '#c9a574';
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

          {/* Nombre del artista */}
          <div style={{
            fontSize: isScrolled ? '14px' : '16px',
            fontWeight: '600',
            color: '#c9a574',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s ease'
          }}>
            {artist.name}
          </div>
        </header>

        {/* Hero Banner con foto del artista */}
        <div style={{
          position: 'relative',
          height: '65vh',
          minHeight: '650px',
          overflow: 'hidden',
          marginTop: '0'
        }}>
          {/* Imagen con blur */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: artist.photo ? `url(${artist.photo})` : 'none',
            backgroundColor: artist.photo ? 'transparent' : 'rgba(201, 165, 116, 0.1)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            transform: 'scale(1.05)'
          }} />

          {/* Degradado principal - De arriba hacia abajo - MÁS VISIBLE */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(13, 31, 35, 0.75) 0%, rgba(13, 31, 35, 0.3) 15%, transparent 30%, transparent 50%, rgba(13, 31, 35, 0.4) 70%, rgba(13, 31, 35, 0.85) 90%, rgba(13, 31, 35, 0.98) 100%)'
          }} />

          {/* Degradado lateral izquierdo - MÁS VISIBLE */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(13, 31, 35, 0.7) 0%, rgba(13, 31, 35, 0.3) 20%, transparent 40%)'
          }} />

          {/* Degradado lateral derecho - MÁS VISIBLE */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(270deg, rgba(13, 31, 35, 0.7) 0%, rgba(13, 31, 35, 0.3) 20%, transparent 40%)'
          }} />
          
          {/* Overlay con tinte verde y dorado - MÁS VISIBLE */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.25) 0%, rgba(32, 64, 64, 0.4) 50%, rgba(13, 31, 35, 0.5) 100%)',
            mixBlendMode: 'multiply' as const
          }} />

          {/* Degradado inferior para transición suave al fondo */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '250px',
            background: 'linear-gradient(180deg, transparent 0%, rgba(13, 31, 35, 0.5) 40%, rgba(13, 31, 35, 0.85) 70%, rgba(13, 31, 35, 0.98) 100%)',
            pointerEvents: 'none'
          }} />
          
          {/* Información del artista - FUERA del blur */}
          <div style={{
            position: 'absolute',
            bottom: '80px',
            left: '40px',
            right: '40px',
            zIndex: 5
          }}>
            <p style={{
              fontSize: '20px',
              fontWeight: '500',
              color: '#c9a574',
              marginBottom: '16px',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.9), 0 4px 24px rgba(0, 0, 0, 0.7)'
            }}>
              Bienvenido
            </p>
            <h1 style={{
              fontSize: '84px',
              fontWeight: '900',
              color: '#ffffff',
              marginBottom: '16px',
              letterSpacing: '-3px',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.9), 0 4px 24px rgba(0, 0, 0, 0.8), 0 8px 32px rgba(0, 0, 0, 0.6)',
              lineHeight: '1'
            }}>
              {artist.name}
            </h1>
          </div>
        </div>

        {/* Contenido principal */}
        <div style={{ padding: '40px' }}>
          {/* Dashboard Content */}
          {activeTab === 'Dashboard' && (
            <div style={{ padding: '0' }}>
              {/* Contenido limpio sin cajas */}
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

              {topTracks.length > 0 ? (
                <>
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
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '48px', color: '#AFB3B7' }}>
                  <Music size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                  <p>No hay canciones disponibles</p>
                </div>
              )}
            </div>
          )}

          {/* Royalties & Perfil tabs mantienen el diseño básico */}
          {activeTab === 'Royalties' && (
            <>
              {/* Cajas financieras que se superponen con el banner */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '24px',
                marginTop: '-120px',
                marginBottom: '40px',
                position: 'relative',
                zIndex: 10
              }}>
                {/* Caja 1: Total Generado */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(42, 63, 63, 0.4) 100%)',
                  border: '2px solid rgba(201, 165, 116, 0.3)',
                  borderRadius: '20px',
                  padding: '32px',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(201, 165, 116, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(201, 165, 116, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(201, 165, 116, 0.1)';
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #c9a574 0%, #b8956a 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 16px rgba(201, 165, 116, 0.4)'
                    }}>
                      <Wallet size={28} color="#fff" />
                    </div>
                    <div style={{
                      padding: '6px 14px',
                      background: 'rgba(74, 222, 128, 0.15)',
                      border: '1px solid rgba(74, 222, 128, 0.3)',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#4ade80',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <TrendingUp size={14} />
                      +12.5%
                    </div>
                  </div>
                  
                  <div>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#AFB3B7',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Total Generado
                    </p>
                    <h3 style={{
                      fontSize: '42px',
                      fontWeight: '800',
                      color: '#c9a574',
                      marginBottom: '4px',
                      letterSpacing: '-1px'
                    }}>
                      {formatEuro(artist.totalRevenue)}
                    </h3>
                    <p style={{
                      fontSize: '13px',
                      color: '#69818D',
                      fontWeight: '400'
                    }}>
                      Ingresos totales acumulados
                    </p>
                  </div>
                </div>

                {/* Caja 2: Próximo Pago */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(42, 63, 63, 0.4) 100%)',
                  border: '2px solid rgba(201, 165, 116, 0.3)',
                  borderRadius: '20px',
                  padding: '32px',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(201, 165, 116, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 2px rgba(201, 165, 116, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(201, 165, 116, 0.1)';
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 16px rgba(96, 165, 250, 0.4)'
                    }}>
                      <CreditCard size={28} color="#fff" />
                    </div>
                    <div style={{
                      padding: '6px 14px',
                      background: 'rgba(201, 165, 116, 0.15)',
                      border: '1px solid rgba(201, 165, 116, 0.3)',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#c9a574',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Calendar size={14} />
                      15 Feb
                    </div>
                  </div>
                  
                  <div>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#AFB3B7',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Próximo Pago
                    </p>
                    <h3 style={{
                      fontSize: '42px',
                      fontWeight: '800',
                      color: '#60a5fa',
                      marginBottom: '4px',
                      letterSpacing: '-1px'
                    }}>
                      {formatEuro(artist.totalRevenue * 0.15)}
                    </h3>
                    <p style={{
                      fontSize: '13px',
                      color: '#69818D',
                      fontWeight: '400'
                    }}>
                      Royalties de este mes
                    </p>
                  </div>
                </div>
              </div>

              {/* Contenido adicional de royalties */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(42, 63, 63, 0.4) 100%)',
                border: '2px solid rgba(201, 165, 116, 0.3)',
                borderRadius: '20px',
                padding: '28px',
                textAlign: 'center'
              }}>
                <DollarSign size={48} color="#c9a574" style={{ margin: '0 auto 16px' }} />
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
                  Historial de Royalties
                </h2>
                <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
                  Detalles completos de pagos disponibles próximamente
                </p>
              </div>
            </>
          )}

          {activeTab === 'Perfil' && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(42, 63, 63, 0.4) 100%)',
              border: '2px solid rgba(201, 165, 116, 0.3)',
              borderRadius: '20px',
              padding: '28px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '24px' }}>
                Información del Perfil
              </h2>

              <div style={{ display: 'grid', gap: '20px', maxWidth: '600px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#AFB3B7', marginBottom: '8px' }}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={artist.name}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(201, 165, 116, 0.2)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#AFB3B7', marginBottom: '8px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={artist.email || ''}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(201, 165, 116, 0.2)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#AFB3B7', marginBottom: '8px' }}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={artist.phone || ''}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(201, 165, 116, 0.2)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}