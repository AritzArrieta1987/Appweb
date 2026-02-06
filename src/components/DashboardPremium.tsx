import { useState, useEffect } from 'react';
import { Bell, TrendingUp, Users, FileText, DollarSign, Menu, X, LogOut, Home, Mic2, Music, Calculator, FileSignature, BarChart3, Settings, Search, ArrowUpRight, ArrowDownRight, PlayCircle } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

// Datos mejorados
const revenueData = [
  { month: 'Ene', income: 45000, expenses: 12000 },
  { month: 'Feb', income: 52000, expenses: 14000 },
  { month: 'Mar', income: 48000, expenses: 13500 },
  { month: 'Abr', income: 61000, expenses: 15000 },
  { month: 'May', income: 58000, expenses: 14500 },
  { month: 'Jun', income: 67000, expenses: 16000 },
];

const topTracks = [
  { name: 'Monaco', artist: 'Bad Bunny', streams: '2.4M', revenue: '€45,200', growth: '+24%' },
  { name: 'Despechá', artist: 'Rosalía', streams: '1.8M', revenue: '€38,900', growth: '+18%' },
  { name: 'Ingobernable', artist: 'C. Tangana', streams: '1.2M', revenue: '€28,500', growth: '+12%' },
  { name: 'Emergencia', artist: 'Nathy Peluso', streams: '890K', revenue: '€21,200', growth: '+32%' },
];

const platformData = [
  { platform: 'Spotify', value: 45, color: '#1DB954' },
  { platform: 'Apple Music', value: 28, color: '#c9a574' },
  { platform: 'YouTube', value: 18, color: '#FF0000' },
  { platform: 'Otros', value: 9, color: '#6b7280' },
];

interface DashboardProps {
  onLogout: () => void;
}

export default function DashboardPremium({ onLogout }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(3);
  const [activeNav, setActiveNav] = useState('Dashboard');

  useEffect(() => {
    const appHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    window.addEventListener('resize', appHeight);
    appHeight();
    return () => window.removeEventListener('resize', appHeight);
  }, []);

  const stats = [
    { 
      label: 'Ingresos Totales', 
      value: '€331,600', 
      change: '+12.5%', 
      trend: 'up',
      icon: DollarSign,
      subtitle: 'vs mes anterior',
      chartData: [42, 48, 45, 52, 58, 67]
    },
    { 
      label: 'Streams Totales', 
      value: '8.4M', 
      change: '+18.2%', 
      trend: 'up',
      icon: TrendingUp,
      subtitle: 'reproducciones',
      chartData: [2.1, 2.4, 2.2, 2.8, 2.7, 3.1]
    },
    { 
      label: 'Artistas Activos', 
      value: '24', 
      change: '+4', 
      trend: 'up',
      icon: Users,
      subtitle: 'generando ingresos',
      chartData: [18, 19, 20, 21, 22, 24]
    },
    { 
      label: 'Tasa de Conversión', 
      value: '85%', 
      change: '+5.2%', 
      trend: 'up',
      icon: FileText,
      subtitle: 'contratos cerrados',
      chartData: [72, 75, 78, 81, 83, 85]
    },
  ];

  const navItems = [
    { label: 'Dashboard', icon: Home },
    { label: 'Artistas', icon: Mic2 },
    { label: 'Catálogo', icon: Music },
    { label: 'Royalties', icon: Calculator },
    { label: 'Contratos', icon: FileSignature },
    { label: 'Reportes', icon: BarChart3 },
    { label: 'Configuración', icon: Settings },
  ];

  // Gauge circle calculation
  const gaugePercentage = 85;
  const gaugeRadius = 80;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const gaugeOffset = gaugeCircumference - (gaugePercentage / 100) * gaugeCircumference;

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      height: 'var(--app-height)',
      backgroundColor: '#0f1616',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden'
    }}>
      <style>{`
        :root {
          --app-height: 100vh;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(42, 63, 63, 0.2);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(201, 165, 116, 0.6) 0%, rgba(201, 165, 116, 0.3) 100%);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(201, 165, 116, 0.8) 0%, rgba(201, 165, 116, 0.5) 100%);
        }

        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .stat-card {
          animation: fadeInUp 0.6s ease forwards;
        }

        .glass-card {
          background: rgba(26, 40, 40, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(201, 165, 116, 0.15);
        }

        .glass-card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-card-hover:hover {
          background: rgba(26, 40, 40, 0.8);
          border-color: rgba(201, 165, 116, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(201, 165, 116, 0.15);
        }

        .tab-button {
          transition: all 0.3s ease;
        }

        .tab-button:hover {
          background: rgba(42, 63, 63, 0.8) !important;
        }

        @media (max-width: 968px) {
          .sidebar {
            position: fixed !important;
            z-index: 1000 !important;
            transform: translateX(-100%) !important;
            transition: transform 0.3s ease !important;
          }

          .sidebar.open {
            transform: translateX(0) !important;
          }

          .main-content {
            margin-left: 0 !important;
          }

          .mobile-menu {
            display: block !important;
          }
        }
      `}</style>

      {/* MAIN CONTENT - Sin sidebar por ahora */}
      <div className="main-content" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: '#0f1616'
      }}>
        {/* HEADER ESTILO QUICKBOOKS */}
        <header style={{
          height: '80px',
          background: '#1a2626',
          borderBottom: '1px solid rgba(42, 63, 63, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          flexShrink: 0,
          gap: '32px'
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexShrink: 0
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #c9a574 0%, #d4b589 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)'
            }}>
              <Music size={22} style={{ color: '#1a2626' }} />
            </div>
            <div>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                letterSpacing: '1px',
                color: '#ffffff'
              }}>
                BIGARTIST
              </div>
              <div style={{
                fontSize: '10px',
                color: 'rgba(201, 165, 116, 0.6)',
                letterSpacing: '1px',
                marginTop: '-2px'
              }}>
                ROYALTIES
              </div>
            </div>
          </div>

          {/* Tabs de navegación */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'center',
            maxWidth: '600px'
          }}>
            {['Dashboard', 'Artistas', 'Catálogo', 'Royalties'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveNav(tab)}
                className="tab-button"
                style={{
                  padding: '10px 24px',
                  background: activeNav === tab 
                    ? 'linear-gradient(135deg, #2a3f3f 0%, #1f3232 100%)'
                    : 'transparent',
                  border: activeNav === tab 
                    ? '1px solid rgba(201, 165, 116, 0.3)'
                    : '1px solid transparent',
                  borderRadius: '10px',
                  color: activeNav === tab ? '#c9a574' : 'rgba(255, 255, 255, 0.5)',
                  fontSize: '14px',
                  fontWeight: activeNav === tab ? '600' : '500',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Right side - Selector de periodo + Notificaciones + Avatar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexShrink: 0
          }}>
            {/* Selector de periodo */}
            <select
              style={{
                padding: '10px 16px',
                background: '#2a3f3f',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '10px',
                color: '#c9a574',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                paddingRight: '32px',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23c9a574' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center'
              }}
            >
              <option>Este Mes</option>
              <option>Este Trimestre</option>
              <option>Este Año</option>
              <option>Últimos 30 días</option>
            </select>

            {/* Notificaciones */}
            <button
              style={{
                position: 'relative',
                width: '44px',
                height: '44px',
                background: '#2a3f3f',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '10px',
                color: '#c9a574',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(42, 63, 63, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2a3f3f';
                e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
              }}
            >
              <Bell size={20} />
              {notifications > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  minWidth: '20px',
                  height: '20px',
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                  borderRadius: '10px',
                  border: '2px solid #1a2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#ffffff',
                  padding: '0 5px',
                  boxShadow: '0 2px 8px rgba(255, 107, 107, 0.5)'
                }}>
                  {notifications}
                </div>
              )}
            </button>

            {/* Avatar */}
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #c9a574 0%, #d4b589 100%)',
              border: '2px solid rgba(201, 165, 116, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: '700',
              color: '#1a2626',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(201, 165, 116, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 165, 116, 0.3)';
            }}
            >
              A
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main style={{
          flex: 1,
          overflow: 'auto',
          padding: '40px'
        }}>
          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="stat-card glass-card glass-card-hover"
                style={{
                  borderRadius: '20px',
                  padding: '28px',
                  position: 'relative',
                  overflow: 'hidden',
                  animationDelay: `${index * 0.1}s`,
                  cursor: 'pointer'
                }}
              >
                {/* Animated gradient background */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '160px',
                  height: '160px',
                  background: 'radial-gradient(circle, rgba(201, 165, 116, 0.15) 0%, transparent 70%)',
                  pointerEvents: 'none'
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.2) 0%, rgba(201, 165, 116, 0.05) 100%)',
                      border: '1px solid rgba(201, 165, 116, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#c9a574',
                      boxShadow: '0 8px 20px rgba(201, 165, 116, 0.15)'
                    }}>
                      <stat.icon size={28} strokeWidth={2.5} />
                    </div>
                    <div style={{
                      padding: '8px 14px',
                      background: stat.trend === 'up' 
                        ? 'linear-gradient(135deg, rgba(74, 222, 128, 0.2) 0%, rgba(74, 222, 128, 0.1) 100%)'
                        : 'linear-gradient(135deg, rgba(248, 113, 113, 0.2) 0%, rgba(248, 113, 113, 0.1) 100%)',
                      border: `1px solid ${stat.trend === 'up' ? 'rgba(74, 222, 128, 0.4)' : 'rgba(248, 113, 113, 0.4)'}`,
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: stat.trend === 'up' ? '#4ade80' : '#f87171',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      {stat.change}
                    </div>
                  </div>
                  
                  <div style={{
                    fontSize: '40px',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '8px',
                    letterSpacing: '-1.5px',
                    lineHeight: '1.1'
                  }}>
                    {stat.value}
                  </div>
                  
                  <div style={{
                    fontSize: '15px',
                    color: 'rgba(201, 165, 116, 0.7)',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}>
                    {stat.label}
                  </div>
                  
                  <div style={{
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontWeight: '500'
                  }}>
                    {stat.subtitle}
                  </div>

                  {/* Mini chart */}
                  <div style={{ marginTop: '20px', height: '40px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stat.chartData.map((val, i) => ({ value: val }))}>
                        <defs>
                          <linearGradient id={`mini-gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#c9a574" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#c9a574" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#c9a574" 
                          strokeWidth={2}
                          fill={`url(#mini-gradient-${index})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {/* Revenue Chart */}
            <div className="glass-card" style={{
              borderRadius: '20px',
              padding: '32px',
              minHeight: '400px'
            }}>
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '6px'
                }}>
                  Evolución de Ingresos
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(201, 165, 116, 0.6)'
                }}>
                  Comparativa mensual • Enero - Junio 2026
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c9a574" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#c9a574" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(201, 165, 116, 0.08)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="rgba(201, 165, 116, 0.4)" 
                    style={{ fontSize: '13px', fontWeight: '500' }}
                    tick={{ fill: 'rgba(201, 165, 116, 0.6)' }}
                  />
                  <YAxis 
                    stroke="rgba(201, 165, 116, 0.4)" 
                    style={{ fontSize: '13px', fontWeight: '500' }}
                    tick={{ fill: 'rgba(201, 165, 116, 0.6)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(26, 40, 40, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(201, 165, 116, 0.3)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      padding: '12px 16px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                    }}
                    labelStyle={{ color: '#c9a574', fontWeight: '600', marginBottom: '8px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#c9a574" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorIncome)"
                    name="Ingresos"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#ef4444" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorExpenses)"
                    name="Gastos"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Conversion Gauge */}
            <div className="glass-card" style={{
              borderRadius: '20px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '8px',
                textAlign: 'center'
              }}>
                Tasa de Conversión
              </h3>
              <p style={{
                fontSize: '13px',
                color: 'rgba(201, 165, 116, 0.6)',
                marginBottom: '32px',
                textAlign: 'center'
              }}>
                Contratos cerrados vs propuestas
              </p>
              
              <div style={{ position: 'relative', width: '220px', height: '220px' }}>
                <svg width="220" height="220" style={{ transform: 'rotate(-90deg)' }}>
                  {/* Background circle */}
                  <circle
                    cx="110"
                    cy="110"
                    r={gaugeRadius}
                    fill="none"
                    stroke="rgba(201, 165, 116, 0.1)"
                    strokeWidth="20"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="110"
                    cy="110"
                    r={gaugeRadius}
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="20"
                    strokeDasharray={gaugeCircumference}
                    strokeDashoffset={gaugeOffset}
                    strokeLinecap="round"
                    style={{ 
                      transition: 'stroke-dashoffset 1s ease',
                      filter: 'drop-shadow(0 0 8px rgba(201, 165, 116, 0.5))'
                    }}
                  />
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#c9a574" />
                      <stop offset="100%" stopColor="#f4e4c1" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '52px',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #c9a574 0%, #f4e4c1 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-2px',
                    lineHeight: '1'
                  }}>
                    {gaugePercentage}%
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: 'rgba(201, 165, 116, 0.6)',
                    marginTop: '4px',
                    fontWeight: '600'
                  }}>
                    Excelente
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: '24px',
                padding: '12px 20px',
                background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.15) 0%, rgba(74, 222, 128, 0.08) 100%)',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                borderRadius: '10px',
                fontSize: '13px',
                color: '#4ade80',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ArrowUpRight size={16} />
                +5.2% vs mes anterior
              </div>
            </div>
          </div>

          {/* Bottom Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px'
          }}>
            {/* Top Tracks */}
            <div className="glass-card" style={{
              borderRadius: '20px',
              padding: '32px'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '6px'
                }}>
                  Top Canciones
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(201, 165, 116, 0.6)'
                }}>
                  Mayor rendimiento del mes
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {topTracks.map((track, index) => (
                  <div
                    key={index}
                    className="glass-card-hover"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      background: 'rgba(26, 40, 40, 0.4)',
                      border: '1px solid rgba(201, 165, 116, 0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '10px',
                      background: `linear-gradient(135deg, rgba(201, 165, 116, ${0.8 - index * 0.15}) 0%, rgba(201, 165, 116, ${0.3 - index * 0.05}) 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#c9a574',
                      flexShrink: 0
                    }}>
                      #{index + 1}
                    </div>
                    <PlayCircle size={20} style={{ color: 'rgba(201, 165, 116, 0.5)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#ffffff',
                        marginBottom: '2px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {track.name}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: 'rgba(201, 165, 116, 0.6)'
                      }}>
                        {track.artist} • {track.streams}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #c9a574 0%, #f4e4c1 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '2px'
                      }}>
                        {track.revenue}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#4ade80',
                        fontWeight: '600'
                      }}>
                        {track.growth}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Distribution */}
            <div className="glass-card" style={{
              borderRadius: '20px',
              padding: '32px'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '6px'
                }}>
                  Distribución por Plataforma
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(201, 165, 116, 0.6)'
                }}>
                  Porcentaje de streams totales
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {platformData.map((platform, index) => (
                  <div key={index}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#ffffff'
                      }}>
                        {platform.platform}
                      </span>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: platform.color
                      }}>
                        {platform.value}%
                      </span>
                    </div>
                    <div style={{
                      height: '8px',
                      backgroundColor: 'rgba(201, 165, 116, 0.1)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div
                        style={{
                          width: `${platform.value}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, ${platform.color} 0%, ${platform.color}AA 100%)`,
                          borderRadius: '4px',
                          transition: 'width 1s ease',
                          boxShadow: `0 0 8px ${platform.color}66`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}