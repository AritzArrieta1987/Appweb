import { useState, useEffect, useRef } from 'react';
import { Bell, BarChart3, Users, Music, FileText, Upload, Settings, LogOut, TrendingUp, DollarSign, Database, PieChart, Disc, CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import logoImage from 'figma:asset/aa0296e2522220bcfcda71f86c708cb2cbc616b9.png';
import backgroundImage from 'figma:asset/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493.png';
import CSVUploader from './components/CSVUploader';
import ArtistPanel from './components/ArtistPanel';
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
    // Si hay un artista seleccionado, mostrar el ArtistPanel
    if (selectedArtist) {
      const artistTracks = tracks.filter(t => t.artistId === selectedArtist.id);
      return (
        <ArtistPanel 
          artist={selectedArtist} 
          tracks={artistTracks}
          onBack={() => setSelectedArtist(null)}
        />
      );
    }

    switch (activeTab) {
      case 'Dashboard':
        return (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
              Dashboard
            </h1>
            
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              {[
                { title: 'Total Royalties', value: formatEuro(dashboardData.totalRevenue), change: '+0%', color: '#c9a574' },
                { title: 'Artistas Activos', value: dashboardData.artistCount.toString(), change: `+${dashboardData.artistCount}`, color: '#4ade80' },
                { title: 'Canciones', value: dashboardData.trackCount.toString(), change: `+${dashboardData.trackCount}`, color: '#60a5fa' },
                { title: 'Total Streams', value: dashboardData.totalStreams.toLocaleString(), change: `+${dashboardData.totalStreams.toLocaleString()}`, color: '#f87171' }
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

            {/* Two Column Layout: CSV Info + DSP Analytics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              
              {/* Left Column: CSV Upload Analysis */}
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
                    <Database size={24} color="#fff" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '2px' }}>
                      CSV Analysis
                    </h2>
                    <p style={{ fontSize: '13px', color: '#AFB3B7' }}>
                      Archivos procesados recientes
                    </p>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={csvLineData}>
                    <XAxis dataKey="mes" stroke="#AFB3B7" style={{ fontSize: '12px' }} />
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
              </div>

              {/* Right Column: DSP Analytics */}
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
                      DSP Analytics
                    </h2>
                    <p style={{ fontSize: '13px', color: '#AFB3B7' }}>
                      Digital Service Providers
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <ResponsiveContainer width="50%" height={250}>
                    <PieChart>
                      <Pie
                        data={dspChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                        label={(entry) => {
                          const total = dspChartData.reduce((sum, item) => sum + item.value, 0);
                          const percent = ((entry.value / total) * 100).toFixed(1);
                          return `${percent}%`;
                        }}
                        labelLine={true}
                      >
                        {dspChartData.map((entry, index) => (
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
                    {dspChartData.map((platform, index) => (
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
              </div>
            </div>

            {/* Full Width: Recent Tracks from CSV */}
            <div style={{
              marginTop: '24px',
              background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(42, 63, 63, 0.4) 100%)',
              border: '2px solid rgba(201, 165, 116, 0.3)',
              borderRadius: '20px',
              padding: '28px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(201, 165, 116, 0.1)'
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
                    Canciones Recientes del CSV
                  </h2>
                  <p style={{ fontSize: '13px', color: '#AFB3B7' }}>
                    Top tracks procesados recientemente
                  </p>
                </div>
              </div>

              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1.2fr 1fr 1fr 1fr',
                gap: '16px',
                padding: '12px 16px',
                background: 'rgba(201, 165, 116, 0.1)',
                borderRadius: '12px',
                marginBottom: '12px',
                borderBottom: '2px solid rgba(201, 165, 116, 0.3)'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Canción
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Artista
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  ISRC
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Streams
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Revenue
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Plataforma
                </div>
              </div>

              {/* Table Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentTracks.map((track, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1.5fr 1.2fr 1fr 1fr 1fr',
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
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.transform = 'translateX(0)';
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

                    {/* Artist */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: '#AFB3B7' }}>
                        {track.artist}
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
                        borderRadius: '6px',
                        border: '1px solid rgba(96, 165, 250, 0.2)'
                      }}>
                        {track.isrc}
                      </code>
                    </div>

                    {/* Streams */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#4ade80' }}>
                        {track.streams.toLocaleString()}
                      </span>
                    </div>

                    {/* Revenue */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#c9a574' }}>
                        €{track.revenue.toFixed(2)}
                      </span>
                    </div>

                    {/* Platform */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 10px',
                        background: `${track.platformColor}15`,
                        borderRadius: '8px',
                        border: `1px solid ${track.platformColor}40`
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: track.platformColor
                        }} />
                        <span style={{ fontSize: '12px', fontWeight: '500', color: '#ffffff' }}>
                          {track.platform}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'Subir CSV':
        return <CSVUploader />;
      
      case 'Artistas':
        return (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
              Artistas
            </h1>
            
            {/* Stats Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '16px',
                padding: '20px'
              }}>
                <div style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '8px' }}>Total Artistas</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#c9a574' }}>{artists.length}</div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '16px',
                padding: '20px'
              }}>
                <div style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '8px' }}>Revenue Total</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#4ade80' }}>
                  {formatEuro(artists.reduce((sum, a) => sum + a.totalRevenue, 0))}
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '16px',
                padding: '20px'
              }}>
                <div style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '8px' }}>Streams Totales</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#60a5fa' }}>
                  {artists.reduce((sum, a) => sum + a.totalStreams, 0).toLocaleString()}
                </div>
              </div>
            </div>

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
                {artists.map((artist) => (
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
                    {/* Artist Photo */}
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
                      justifyContent: 'center'
                    }}>
                      {!artist.photo && <Users size={48} color="#c9a574" />}
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
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
              Catálogo Musical
            </h1>
            
            {/* Stats Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '16px',
                padding: '20px'
              }}>
                <div style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '8px' }}>Total Canciones</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#c9a574' }}>{tracks.length}</div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '16px',
                padding: '20px'
              }}>
                <div style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '8px' }}>Revenue Total</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#4ade80' }}>
                  {formatEuro(tracks.reduce((sum, t) => sum + t.totalRevenue, 0))}
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '16px',
                padding: '20px'
              }}>
                <div style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '8px' }}>Streams Totales</div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#60a5fa' }}>
                  {tracks.reduce((sum, t) => sum + t.totalStreams, 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Tracks Table */}
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
            ) : (
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '16px',
                padding: '24px',
                overflowX: 'auto'
              }}>
                {/* Table Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.5fr 1.2fr 1fr 1fr 1.5fr',
                  gap: '16px',
                  padding: '12px 16px',
                  background: 'rgba(201, 165, 116, 0.1)',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  borderBottom: '2px solid rgba(201, 165, 116, 0.3)'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase' }}>Canción</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase' }}>Artista</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase' }}>ISRC</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase' }}>Streams</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase' }}>Revenue</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase' }}>Plataformas</div>
                </div>

                {/* Table Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {tracks.map((track, index) => (
                    <div
                      key={track.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1.5fr 1.2fr 1fr 1fr 1.5fr',
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
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.transform = 'translateX(0)';
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
                          flexShrink: 0
                        }}>
                          <Disc size={20} color="#c9a574" />
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                          {track.title}
                        </span>
                      </div>

                      {/* Artist */}
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#AFB3B7' }}>
                          {track.artistName}
                        </span>
                      </div>

                      {/* ISRC */}
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {track.isrc ? (
                          <code style={{
                            fontSize: '12px',
                            fontFamily: 'monospace',
                            color: '#60a5fa',
                            background: 'rgba(96, 165, 250, 0.1)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid rgba(96, 165, 250, 0.2)'
                          }}>
                            {track.isrc}
                          </code>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>N/A</span>
                        )}
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
                        {track.platforms.length > 3 && (
                          <div style={{
                            padding: '4px 8px',
                            background: 'rgba(96, 165, 250, 0.1)',
                            borderRadius: '6px',
                            fontSize: '11px',
                            color: '#60a5fa',
                            fontWeight: '500'
                          }}>
                            +{track.platforms.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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