import { useState, useEffect } from 'react';
import { Bell, BarChart3, Users, Music, FileText, Upload, Settings, LogOut, TrendingUp, DollarSign, Database, PieChart, Disc } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import logoImage from 'figma:asset/aa0296e2522220bcfcda71f86c708cb2cbc616b9.png';
import backgroundImage from 'figma:asset/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493.png';

interface DashboardProps {
  onLogout: () => void;
}

export default function DashboardSimple({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState(3);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [showChart, setShowChart] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
    { name: 'Artistas', icon: Users },
    { name: 'Catálogo', icon: Music },
    { name: 'Contratos', icon: FileText },
    { name: 'Subir CSV', icon: Upload },
    { name: 'Configuración', icon: Settings }
  ];

  const salesData: any[] = [];

  // Datos para gráfico circular de CSV
  const csvChartData: any[] = [];

  // Datos para gráfico lineal de CSV
  const csvLineData: any[] = [];

  // Datos para gráfico circular de DSP
  const dspChartData: any[] = [];

  // Datos de canciones recientes del CSV
  const recentTracks: any[] = [];

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
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
              Dashboard
            </h1>
            
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              {[
                { title: 'Total Royalties', value: '€0', change: '+0%', color: '#c9a574' },
                { title: 'Artistas Activos', value: '0', change: '+0', color: '#4ade80' },
                { title: 'Canciones', value: '0', change: '+0', color: '#60a5fa' },
                { title: 'Pagos Pendientes', value: '€0', change: '0%', color: '#f87171' }
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
        return (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
              Subir CSV
            </h1>
            
            <div style={{
              background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
              border: '2px dashed rgba(201, 165, 116, 0.4)',
              borderRadius: '16px',
              padding: '48px',
              textAlign: 'center',
              marginBottom: '32px'
            }}>
              <Upload size={48} color="#c9a574" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
                Arrastra tus archivos CSV aquí
              </h3>
              <p style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '24px' }}>
                O haz clic para seleccionar archivos
              </p>
              <input
                type="file"
                accept=".csv"
                multiple
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="csv-upload"
              />
              <label htmlFor="csv-upload">
                <div style={{
                  display: 'inline-block',
                  padding: '12px 32px',
                  background: 'linear-gradient(135deg, #c9a574 0%, #b8956a 100%)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Seleccionar archivos
                </div>
              </label>
            </div>

            {showChart && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '16px',
                padding: '32px'
              }}>
                <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#ffffff', marginBottom: '24px' }}>
                  Evolución de Ventas
                </h3>
                
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(201, 165, 116, 0.1)" />
                    <XAxis dataKey="mes" stroke="#AFB3B7" />
                    <YAxis stroke="#AFB3B7" />
                    <Tooltip />
                    <Line type="monotone" dataKey="ventas" stroke="#60a5fa" strokeWidth={3} />
                    <Line type="monotone" dataKey="royalties" stroke="#c9a574" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
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
              {notifications > 0 && (
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
                  {notifications}
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