import { useState, useEffect } from 'react';
import { Bell, TrendingUp, Users, FileText, DollarSign, Menu, X, LogOut, ChevronRight, Home, Mic2, Music, Calculator, FileSignature, BarChart3, Settings, Search } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Datos de ejemplo
const revenueData = [
  { month: 'Ene', amount: 45000, streams: 2100000 },
  { month: 'Feb', amount: 52000, streams: 2450000 },
  { month: 'Mar', amount: 48000, streams: 2280000 },
  { month: 'Abr', amount: 61000, streams: 2890000 },
  { month: 'May', amount: 58000, streams: 2750000 },
  { month: 'Jun', amount: 67000, streams: 3120000 },
];

const topArtists = [
  { name: 'Bad Bunny', revenue: '€125,400', growth: '+24%', streams: '3.2M' },
  { name: 'Rosalía', revenue: '€98,200', growth: '+18%', streams: '2.8M' },
  { name: 'C. Tangana', revenue: '€76,500', growth: '+12%', streams: '2.1M' },
  { name: 'Nathy Peluso', revenue: '€31,500', growth: '+32%', streams: '1.4M' },
];

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(3);
  const [activeNav, setActiveNav] = useState('Dashboard');

  // Solución para altura en iOS
  useEffect(() => {
    const appHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    window.addEventListener('resize', appHeight);
    appHeight();
    return () => window.removeEventListener('resize', appHeight);
  }, []);

  const stats = [
    { label: 'Ingresos del Mes', value: '€67,000', change: '+15.3%', icon: DollarSign, trend: 'up' },
    { label: 'Total Streams', value: '3.12M', change: '+22.8%', icon: TrendingUp, trend: 'up' },
    { label: 'Artistas Activos', value: '24', change: '+4', icon: Users, trend: 'up' },
    { label: 'Contratos Vigentes', value: '18', change: '+2', icon: FileText, trend: 'up' },
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

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      height: 'var(--app-height)',
      backgroundColor: '#1a2828',
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
          background: rgba(42, 63, 63, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #c9a574 0%, #b8956a 100%);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #d4b589 0%, #c9a574 100%);
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .stat-card {
          animation: fadeIn 0.5s ease forwards;
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

      {/* SIDEBAR PREMIUM */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{
        width: '280px',
        background: 'linear-gradient(180deg, #2a3f3f 0%, #1f3232 100%)',
        borderRight: '1px solid rgba(201, 165, 116, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Logo Premium */}
        <div style={{
          padding: '40px 24px 32px',
          borderBottom: '1px solid rgba(201, 165, 116, 0.15)',
          background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.08) 0%, rgba(201, 165, 116, 0.02) 100%)'
        }}>
          <div style={{
            fontSize: '26px',
            fontWeight: '700',
            letterSpacing: '3px',
            background: 'linear-gradient(135deg, #c9a574 0%, #d4b589 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            BIGARTIST
          </div>
          <div style={{
            fontSize: '11px',
            color: 'rgba(201, 165, 116, 0.7)',
            textAlign: 'center',
            letterSpacing: '2px',
            fontWeight: '500'
          }}>
            ROYALTIES MANAGEMENT
          </div>
          <div style={{
            width: '60px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #c9a574, transparent)',
            margin: '16px auto 0'
          }} />
        </div>

        {/* Search Bar */}
        <div style={{ padding: '24px 20px 16px' }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(201, 165, 116, 0.08)',
            border: '1px solid rgba(201, 165, 116, 0.15)',
            borderRadius: '10px',
            padding: '10px 14px',
            transition: 'all 0.3s ease'
          }}>
            <Search size={18} style={{ color: 'rgba(201, 165, 116, 0.5)', marginRight: '10px' }} />
            <input
              type="text"
              placeholder="Buscar..."
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                fontWeight: '400'
              }}
            />
          </div>
        </div>

        {/* Navigation Premium */}
        <nav style={{ flex: 1, padding: '8px 20px', overflowY: 'auto' }}>
          {navItems.map((item, index) => {
            const isActive = item.label === activeNav;
            return (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  marginBottom: '6px',
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(201, 165, 116, 0.2) 0%, rgba(201, 165, 116, 0.1) 100%)'
                    : 'transparent',
                  border: isActive ? '1px solid rgba(201, 165, 116, 0.3)' : '1px solid transparent',
                  borderRadius: '12px',
                  color: isActive ? '#c9a574' : 'rgba(255, 255, 255, 0.6)',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '500',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  position: 'relative',
                  boxShadow: isActive ? '0 4px 12px rgba(201, 165, 116, 0.15)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(201, 165, 116, 0.08)';
                    e.currentTarget.style.color = '#c9a574';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                <item.icon size={20} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {isActive && (
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #c9a574 0%, #d4b589 100%)',
                    boxShadow: '0 0 8px rgba(201, 165, 116, 0.6)'
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Premium */}
        <div style={{
          padding: '24px',
          borderTop: '1px solid rgba(201, 165, 116, 0.15)',
          background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.05) 0%, transparent 100%)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '18px',
            padding: '12px',
            backgroundColor: 'rgba(201, 165, 116, 0.08)',
            borderRadius: '12px',
            border: '1px solid rgba(201, 165, 116, 0.15)'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #c9a574 0%, #d4b589 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: '700',
              color: '#2a3f3f',
              boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)'
            }}>
              A
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#ffffff', marginBottom: '2px' }}>
                Admin
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(201, 165, 116, 0.7)' }}>
                Administrador
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              color: '#ff6b6b',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: '#1a2828'
      }}>
        {/* HEADER PREMIUM */}
        <header style={{
          height: '88px',
          background: 'linear-gradient(135deg, #2a3f3f 0%, #253838 100%)',
          borderBottom: '1px solid rgba(201, 165, 116, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          flexShrink: 0,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: 'none',
                padding: '10px',
                backgroundColor: 'rgba(201, 165, 116, 0.1)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '10px',
                color: '#c9a574',
                cursor: 'pointer'
              }}
              className="mobile-menu"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
                marginBottom: '4px'
              }}>
                Dashboard
              </h1>
              <p style={{
                fontSize: '14px',
                color: 'rgba(201, 165, 116, 0.7)',
                fontWeight: '500'
              }}>
                Bienvenido, Admin • {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Notifications Premium */}
            <button
              style={{
                position: 'relative',
                padding: '12px',
                background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(201, 165, 116, 0.08) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.25)',
                borderRadius: '12px',
                color: '#c9a574',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(201, 165, 116, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
              <Bell size={20} />
              {notifications > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  minWidth: '20px',
                  height: '20px',
                  backgroundColor: '#ff6b6b',
                  borderRadius: '10px',
                  border: '2px solid #2a3f3f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#ffffff',
                  padding: '0 5px',
                  boxShadow: '0 2px 8px rgba(255, 107, 107, 0.4)'
                }}>
                  {notifications}
                </div>
              )}
            </button>
          </div>
        </header>

        {/* CONTENT AREA PREMIUM */}
        <main style={{
          flex: 1,
          overflow: 'auto',
          padding: '40px',
          backgroundColor: '#1a2828'
        }}>
          {/* Stats Grid Premium */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="stat-card"
                style={{
                  background: 'linear-gradient(135deg, #2a3f3f 0%, #253838 100%)',
                  border: '1px solid rgba(201, 165, 116, 0.2)',
                  borderRadius: '16px',
                  padding: '28px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  animationDelay: `${index * 0.1}s`,
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.4)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(201, 165, 116, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.2)';
                }}
              >
                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '120px',
                  height: '120px',
                  background: 'radial-gradient(circle, rgba(201, 165, 116, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                  transform: 'translate(40%, -40%)'
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', position: 'relative' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.2) 0%, rgba(201, 165, 116, 0.1) 100%)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#c9a574',
                    boxShadow: '0 4px 16px rgba(201, 165, 116, 0.15)'
                  }}>
                    <stat.icon size={26} strokeWidth={2} />
                  </div>
                  <div style={{
                    padding: '6px 12px',
                    background: stat.trend === 'up' 
                      ? 'linear-gradient(135deg, rgba(74, 222, 128, 0.15) 0%, rgba(74, 222, 128, 0.08) 100%)'
                      : 'linear-gradient(135deg, rgba(248, 113, 113, 0.15) 0%, rgba(248, 113, 113, 0.08) 100%)',
                    border: `1px solid ${stat.trend === 'up' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`,
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: stat.trend === 'up' ? '#4ade80' : '#f87171',
                    fontWeight: '700'
                  }}>
                    {stat.change}
                  </div>
                </div>
                <div style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.9) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '8px',
                  letterSpacing: '-1px',
                  lineHeight: '1.2'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(201, 165, 116, 0.8)',
                  fontWeight: '500',
                  letterSpacing: '0.2px'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section Premium */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {/* Revenue Chart Premium */}
            <div style={{
              background: 'linear-gradient(135deg, #2a3f3f 0%, #253838 100%)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.9) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '6px',
                  letterSpacing: '-0.3px'
                }}>
                  Evolución de Ingresos
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(201, 165, 116, 0.7)'
                }}>
                  Últimos 6 meses • Enero - Junio 2026
                </p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c9a574" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#c9a574" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(201, 165, 116, 0.1)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="rgba(201, 165, 116, 0.5)" 
                    style={{ fontSize: '13px', fontWeight: '500' }}
                    tick={{ fill: 'rgba(201, 165, 116, 0.7)' }}
                  />
                  <YAxis 
                    stroke="rgba(201, 165, 116, 0.5)" 
                    style={{ fontSize: '13px', fontWeight: '500' }}
                    tick={{ fill: 'rgba(201, 165, 116, 0.7)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#2a3f3f',
                      border: '1px solid rgba(201, 165, 116, 0.3)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      padding: '12px',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                    }}
                    labelStyle={{ color: '#c9a574', fontWeight: '600', marginBottom: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#c9a574" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Top Artists Premium */}
            <div style={{
              background: 'linear-gradient(135deg, #2a3f3f 0%, #253838 100%)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.9) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '6px',
                  letterSpacing: '-0.3px'
                }}>
                  Top Artistas
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(201, 165, 116, 0.7)'
                }}>
                  Mejor rendimiento del mes
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {topArtists.map((artist, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px',
                      background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.08) 0%, rgba(201, 165, 116, 0.03) 100%)',
                      border: '1px solid rgba(201, 165, 116, 0.15)',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(201, 165, 116, 0.08) 100%)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(201, 165, 116, 0.08) 0%, rgba(201, 165, 116, 0.03) 100%)';
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.15)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, #c9a574 ${index * 20}%, #d4b589 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#2a3f3f',
                        boxShadow: '0 4px 12px rgba(201, 165, 116, 0.25)'
                      }}>
                        #{index + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#ffffff',
                          marginBottom: '4px'
                        }}>
                          {artist.name}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: 'rgba(201, 165, 116, 0.6)'
                        }}>
                          {artist.streams} streams
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #c9a574 0%, #d4b589 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '4px'
                      }}>
                        {artist.revenue}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#4ade80',
                        fontWeight: '600'
                      }}>
                        {artist.growth}
                      </div>
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