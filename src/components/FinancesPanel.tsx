import { useState } from 'react';
import { Wallet, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Download, Filter, Calendar, Eye, FileText, Clock, ChevronDown, TrendingDown, Check, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { IncomeSection } from './IncomeSection';
import { ExpensesSection } from './ExpensesSection';
import { toast } from '../utils/toast';

interface FinancesPanelProps {
  dashboardData: any;
  artists: any[];
  uploadedFiles?: any[];
  paymentRequests?: any[];
  setPaymentRequests?: (requests: any[]) => void;
  notifications?: any[];
  setNotifications?: (notifications: any[]) => void;
}

export function FinancesPanel({ dashboardData, artists, paymentRequests = [], setPaymentRequests, notifications = [], setNotifications }: FinancesPanelProps) {
  const [financesTab, setFinancesTab] = useState('overview');
  const [reportPeriod, setReportPeriod] = useState('monthly'); // monthly, quarterly, yearly
  const [reportMonth, setReportMonth] = useState(new Date().getMonth());
  const [reportYear, setReportYear] = useState(new Date().getFullYear());

  // Mock contracts data - En producción esto vendría del backend
  const contracts = artists.map((artist, index) => ({
    id: index + 1,
    artistId: artist.id,
    percentage: index === 0 ? 70 : 60,
  }));

  // Filtrar solicitudes pendientes
  const pendingRequests = paymentRequests.filter(req => req.status === 'pending');

  // Datos para gráfico lineal - Periodos reales del CSV
  const csvLineData = dashboardData.monthlyData.length > 0 
    ? dashboardData.monthlyData.map((data: any) => ({
        mes: data.month,
        revenue: data.revenue,
        streams: data.streams
      }))
    : [];

  return (
    <div style={{ paddingLeft: '24px', paddingRight: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
          Finanzas y Reportes
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
          Gestiona y analiza los ingresos, gastos y reportes financieros
        </p>
      </div>

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '36px',
        borderBottom: '2px solid rgba(201, 165, 116, 0.2)',
        paddingBottom: '0',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'overview', label: 'Resumen General', icon: Wallet },
          { id: 'income', label: 'Ingresos', icon: ArrowUpRight },
          { id: 'expenses', label: 'Gastos', icon: ArrowDownRight },
          { id: 'requests', label: 'Solicitudes', icon: DollarSign, badge: pendingRequests.length },
          { id: 'reports', label: 'Reportes', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = financesTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFinancesTab(tab.id)}
              style={{
                padding: '12px 20px',
                background: isActive ? 'rgba(201, 165, 116, 0.1)' : 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid #c9a574' : '2px solid transparent',
                color: isActive ? '#c9a574' : '#AFB3B7',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                marginBottom: '-2px',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = '#AFB3B7';
              }}
            >
              <Icon size={16} />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <>
                  <style>
                    {`
                      @keyframes badgePulse {
                        0%, 100% {
                          box-shadow: 0 0 10px rgba(201, 165, 116, 0.4);
                          transform: scale(1);
                        }
                        50% {
                          box-shadow: 0 0 20px rgba(201, 165, 116, 0.8);
                          transform: scale(1.05);
                        }
                      }
                    `}
                  </style>
                  <span style={{
                    background: '#c9a574',
                    color: '#2a3f3f',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    minWidth: '18px',
                    textAlign: 'center',
                    animation: 'badgePulse 2s ease-in-out infinite'
                  }}>
                    {tab.badge}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div style={{ padding: '0' }}>
        {/* Overview Tab Content */}
        {financesTab === 'overview' && (
          <>
        {/* Header Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '430px 1fr',
          gap: '16px',
          marginBottom: '32px',
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
              {csvLineData.slice(-6).map((data: any, index: number) => (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{
                    width: '100%',
                    backgroundColor: index === csvLineData.slice(-6).length - 1 ? '#c9a574' : 'rgba(201, 165, 116, 0.3)',
                    height: `${Math.max(20, (data.revenue / Math.max(...csvLineData.map((d: any) => d.revenue))) * 60)}px`,
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
              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.75)', marginBottom: '8px' }}>
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
            gap: '28px',
            height: '427px'
          }}>
            {/* Average Revenue per Artist - Más oscuro arriba */}
            <div style={{ position: 'relative', zIndex: 1, minHeight: '100px' }}>
              {/* Gráfico de barras difuminado dentro de Beneficios de BAM */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.25,
                pointerEvents: 'none',
                zIndex: 0,
                minHeight: '100px'
              }}>
                <ResponsiveContainer width="100%" height={100}>
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
                      fill="url(#bamBarGradientFinances)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="bamBarGradientFinances" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c9a574" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#c9a574" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.95)', marginBottom: '8px', fontWeight: '600', position: 'relative', zIndex: 2 }}>
                Beneficios de Bam
              </p>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#c9a574', marginBottom: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.3)', position: 'relative', zIndex: 2 }}>
                €{artists.reduce((sum, artist) => {
                  const contract = contracts.find(c => c.artistId === artist.id);
                  const bamPercentage = contract ? (100 - contract.percentage) / 100 : 0.30;
                  return sum + ((artist.totalRevenue || 0) * bamPercentage);
                }, 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(201, 165, 116, 0.15)', position: 'relative', zIndex: 1 }} />

            {/* Total Streams - Más gris abajo */}
            <div style={{ position: 'relative', zIndex: 1, minHeight: '100px' }}>
              {/* Gráfico de barras difuminado dentro de Beneficios de Artistas */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.15,
                pointerEvents: 'none',
                zIndex: 0,
                minHeight: '100px'
              }}>
                <ResponsiveContainer width="100%" height={100}>
                  <BarChart
                    data={[
                      { value: 35 },
                      { value: 42 },
                      { value: 28 },
                      { value: 55 },
                      { value: 38 },
                      { value: 62 },
                      { value: 48 },
                      { value: 58 }
                    ]}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <Bar 
                      dataKey="value" 
                      fill="url(#artistBarGradientFinances)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="artistBarGradientFinances" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px', fontWeight: '400', position: 'relative', zIndex: 2 }}>
                Beneficio de Artistas
              </p>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'rgba(201, 165, 116, 0.7)', marginBottom: '4px', position: 'relative', zIndex: 2 }}>
                €{artists.reduce((sum, artist) => {
                  const contract = contracts.find(c => c.artistId === artist.id);
                  const artistPercentage = contract ? contract.percentage / 100 : 0.70;
                  return sum + ((artist.totalRevenue || 0) * artistPercentage);
                }, 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* Segunda fila */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px 295px',
          gap: '16px',
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
              width: '100%',
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
              {pendingRequests.length > 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  overflowY: 'auto',
                  maxHeight: '140px'
                }}>
                  {pendingRequests.map((request: any) => (
                    <div key={request.id} style={{
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
                          background: request.artistPhoto ? `url(${request.artistPhoto})` : '#c9a574',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#2a3f3f'
                        }}>
                          {!request.artistPhoto && request.artistName.charAt(0).toUpperCase()}
                        </div>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#ffffff'
                        }}>
                          {request.artistName}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#c9a574'
                      }}>
                        €{request.amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                  No hay solicitudes pendientes
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
              width: '100%',
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
            gap: '12px'
          }}>
            {/* Caja 1 - Solicitudes de Royalties */}
            <div style={{
              background: 'rgba(42, 63, 63, 0.3)',
              borderRadius: '16px',
              padding: '16px 20px',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              backdropFilter: 'blur(10px)',
              width: '100%',
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
                {pendingRequests.length > 0 ? (
                  pendingRequests.slice(0, 3).map((request: any) => {
                    const requestDate = new Date(request.date);
                    const now = new Date();
                    const diffHours = Math.floor((now.getTime() - requestDate.getTime()) / (1000 * 60 * 60));
                    const timeAgo = diffHours < 24 ? `Hace ${diffHours}h` : `Hace ${Math.floor(diffHours / 24)}d`;
                    
                    return (
                      <div key={request.id} style={{
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
                            background: request.artistPhoto ? `url(${request.artistPhoto})` : '#c9a574',
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
                            {!request.artistPhoto && request.artistName.charAt(0).toUpperCase()}
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
                              {request.artistName}
                            </div>
                            <div style={{
                              fontSize: '11px',
                              color: 'rgba(255, 255, 255, 0.5)',
                              marginTop: '2px'
                            }}>
                              {timeAgo}
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
                          €{request.amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    );
                  })
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
              width: '100%',
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
                    {paymentRequests.filter(r => r.status === 'completed').length}
                  </div>
                  <p style={{
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginTop: '2px'
                  }}>
                    Solicitudes completadas
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
              width: '100%',
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
                    €{pendingRequests.reduce((sum, req) => sum + req.amount, 0).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                  <p style={{
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginTop: '2px'
                  }}>
                    Solicitudes pendientes de pago
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
              height: '427px',
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
        </>
        )}

        {/* Income Tab Content */}
        {financesTab === 'income' && (
          <IncomeSection dashboardData={dashboardData} artists={artists} />
        )}

        {/* Expenses Tab Content */}
        {financesTab === 'expenses' && (
          <ExpensesSection dashboardData={dashboardData} artists={artists} />
        )}

        {/* Reports Tab Content */}
        {financesTab === 'reports' && (
          <div style={{ padding: '0' }}>
            {/* Filtros y Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              {/* Filtros de Período */}
              <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'rgba(42, 63, 63, 0.4)',
                  borderRadius: '12px',
                  border: '1px solid rgba(201, 165, 116, 0.2)'
                }}>
                  <Filter size={16} color="#c9a574" />
                  <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>
                    Período:
                  </span>
                  <select
                    value={reportPeriod}
                    onChange={(e) => setReportPeriod(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#c9a574',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <option value="monthly" style={{ background: '#2a3f3f' }}>Mensual</option>
                    <option value="quarterly" style={{ background: '#2a3f3f' }}>Trimestral</option>
                    <option value="yearly" style={{ background: '#2a3f3f' }}>Anual</option>
                  </select>
                  <ChevronDown size={14} color="#c9a574" />
                </div>

                {reportPeriod === 'monthly' && (
                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <select
                      value={reportMonth}
                      onChange={(e) => setReportMonth(Number(e.target.value))}
                      style={{
                        padding: '10px 14px',
                        background: 'rgba(42, 63, 63, 0.4)',
                        border: '1px solid rgba(201, 165, 116, 0.2)',
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((month, idx) => (
                        <option key={idx} value={idx} style={{ background: '#2a3f3f' }}>{month}</option>
                      ))}
                    </select>
                    <select
                      value={reportYear}
                      onChange={(e) => setReportYear(Number(e.target.value))}
                      style={{
                        padding: '10px 14px',
                        background: 'rgba(42, 63, 63, 0.4)',
                        border: '1px solid rgba(201, 165, 116, 0.2)',
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <option value={2026} style={{ background: '#2a3f3f' }}>2026</option>
                      <option value={2025} style={{ background: '#2a3f3f' }}>2025</option>
                      <option value={2024} style={{ background: '#2a3f3f' }}>2024</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Botón de Generar Reporte */}
              <button
                onClick={() => {
                  alert('Reporte generado exitosamente. En producción se descargaría un PDF.');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #c9a574 0%, #b8935d 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#2a3f3f',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 165, 116, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 165, 116, 0.3)';
                }}
              >
                <Download size={18} />
                Descargar Reporte
              </button>
            </div>

            {/* Tarjetas de Resumen */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '32px'
            }}>
              {/* Card 1: Ingresos del Período */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(201, 165, 116, 0.05) 100%)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(201, 165, 116, 0.3)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'rgba(201, 165, 116, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <TrendingUp size={20} color="#c9a574" />
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Ingresos
                  </span>
                </div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#c9a574',
                  marginBottom: '8px'
                }}>
                  €{dashboardData.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <ArrowUpRight size={14} color="#4ade80" />
                  <span style={{
                    fontSize: '12px',
                    color: '#4ade80',
                    fontWeight: '600'
                  }}>
                    +12.5%
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }}>
                    vs período anterior
                  </span>
                </div>
              </div>

              {/* Card 2: BAM Comisión */}
              <div style={{
                background: 'rgba(42, 63, 63, 0.4)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'rgba(201, 165, 116, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <DollarSign size={20} color="#c9a574" />
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    BAM (30%)
                  </span>
                </div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '8px'
                }}>
                  €{(dashboardData.totalRevenue * 0.3).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}>
                  Comisión de gestión
                </div>
              </div>

              {/* Card 3: Artistas Pagos */}
              <div style={{
                background: 'rgba(42, 63, 63, 0.4)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'rgba(201, 165, 116, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ArrowUpRight size={20} color="#c9a574" />
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Artistas (70%)
                  </span>
                </div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '8px'
                }}>
                  €{(dashboardData.totalRevenue * 0.7).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}>
                  Total pagado a artistas
                </div>
              </div>

              {/* Card 4: Gastos */}
              <div style={{
                background: 'rgba(42, 63, 63, 0.4)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ArrowDownRight size={20} color="#ef4444" />
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Gastos
                  </span>
                </div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#ef4444',
                  marginBottom: '8px'
                }}>
                  €{(dashboardData.totalRevenue * 0.15).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}>
                  Operativos y distribución
                </div>
              </div>
            </div>

            {/* Gráfico Comparativo */}
            <div style={{
              background: 'rgba(42, 63, 63, 0.3)',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              marginBottom: '32px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '24px'
              }}>
                Comparativa Ingresos vs Gastos
              </h3>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { mes: 'Ene', ingresos: 45000, gastos: 8500 },
                      { mes: 'Feb', ingresos: 52000, gastos: 9200 },
                      { mes: 'Mar', ingresos: 48000, gastos: 8800 },
                      { mes: 'Abr', ingresos: 61000, gastos: 10500 },
                      { mes: 'May', ingresos: 55000, gastos: 9800 },
                      { mes: 'Jun', ingresos: 67000, gastos: 11200 }
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis
                      dataKey="mes"
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
                      dataKey="ingresos" 
                      stroke="#c9a574" 
                      strokeWidth={3}
                      dot={{ fill: '#c9a574', r: 5 }}
                      activeDot={{ r: 7 }}
                      name="Ingresos"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="gastos" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      dot={{ fill: '#ef4444', r: 5 }}
                      activeDot={{ r: 7 }}
                      name="Gastos"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Lista de Reportes Generados */}
            <div style={{
              background: 'rgba(42, 63, 63, 0.3)',
              borderRadius: '16px',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#ffffff',
                  margin: 0
                }}>
                  Reportes Generados
                </h3>
              </div>
              <div style={{ padding: '0' }}>
                {[
                  { name: 'Reporte Enero 2026', date: '01/02/2026', size: '2.4 MB', type: 'Mensual' },
                  { name: 'Reporte Diciembre 2025', date: '01/01/2026', size: '2.2 MB', type: 'Mensual' },
                  { name: 'Reporte Q4 2025', date: '01/01/2026', size: '6.8 MB', type: 'Trimestral' },
                  { name: 'Reporte Noviembre 2025', date: '01/12/2025', size: '2.1 MB', type: 'Mensual' },
                  { name: 'Reporte Anual 2025', date: '01/01/2026', size: '15.3 MB', type: 'Anual' }
                ].map((report, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '20px 24px',
                      borderBottom: index < 4 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(201, 165, 116, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'rgba(201, 165, 116, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FileText size={20} color="#c9a574" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#ffffff',
                          marginBottom: '4px'
                        }}>
                          {report.name}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.5)'
                        }}>
                          {report.date} · {report.size} · {report.type}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => alert('Vista previa del reporte')}
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(201, 165, 116, 0.1)',
                          border: '1px solid rgba(201, 165, 116, 0.3)',
                          borderRadius: '8px',
                          color: '#c9a574',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
                        }}
                      >
                        <Eye size={14} />
                        Ver
                      </button>
                      <button
                        onClick={() => alert('Descargando reporte...')}
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(201, 165, 116, 0.1)',
                          border: '1px solid rgba(201, 165, 116, 0.3)',
                          borderRadius: '8px',
                          color: '#c9a574',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
                        }}
                      >
                        <Download size={14} />
                        Descargar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Solicitudes Tab Content */}
        {financesTab === 'requests' && (
          <div>
            {/* Header */}
            <div style={{
              background: 'rgba(42, 63, 63, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '8px'
                  }}>
                    Solicitudes de Pago
                  </h2>
                  <p style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}>
                    Gestiona las solicitudes de royalties de tus artistas
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '16px'
                }}>
                  <div style={{
                    textAlign: 'center',
                    padding: '12px 24px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#ffffff'
                    }}>
                      {pendingRequests.length}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginTop: '4px'
                    }}>
                      Pendientes
                    </div>
                  </div>
                  <div style={{
                    textAlign: 'center',
                    padding: '12px 24px',
                    background: 'rgba(201, 165, 116, 0.15)',
                    borderRadius: '12px',
                    border: '1px solid rgba(201, 165, 116, 0.3)'
                  }}>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#c9a574'
                    }}>
                      {paymentRequests.filter(r => r.status === 'completed').length}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginTop: '4px'
                    }}>
                      Completadas
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Solicitudes List */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {paymentRequests.length === 0 ? (
                <div style={{
                  background: 'rgba(42, 63, 63, 0.3)',
                  borderRadius: '16px',
                  border: '1px solid rgba(201, 165, 116, 0.2)',
                  padding: '64px',
                  textAlign: 'center'
                }}>
                  <DollarSign size={48} style={{ margin: '0 auto 16px', opacity: 0.3, color: '#c9a574' }} />
                  <p style={{
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginBottom: '8px'
                  }}>
                    No hay solicitudes de pago
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.4)'
                  }}>
                    Las solicitudes de los artistas aparecerán aquí
                  </p>
                </div>
              ) : (
                <>
                  {paymentRequests.map((request) => (
                    <div
                      key={request.id}
                      style={{
                        background: 'rgba(42, 63, 63, 0.4)',
                        borderRadius: '16px',
                        border: '1px solid rgba(201, 165, 116, 0.2)',
                        padding: '28px 32px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(42, 63, 63, 0.5)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(201, 165, 116, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(42, 63, 63, 0.4)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                      }}
                    >
                      {/* Header Row: ID + Estado + Acciones */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                        paddingBottom: '16px',
                        borderBottom: '1px solid rgba(201, 165, 116, 0.15)'
                      }}>
                        <div style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontWeight: '600',
                          letterSpacing: '0.5px'
                        }}>
                          ID #{request.id.toString().slice(-4)}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {/* Estado */}
                          <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          background: request.status === 'pending' 
                            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(175, 179, 183, 0.1) 100%)' 
                            : request.status === 'completed'
                            ? 'linear-gradient(135deg, rgba(201, 165, 116, 0.25) 0%, rgba(181, 145, 96, 0.15) 100%)'
                            : 'linear-gradient(135deg, rgba(42, 63, 63, 0.3) 0%, rgba(62, 83, 83, 0.2) 100%)',
                          color: request.status === 'pending'
                            ? '#ffffff'
                            : request.status === 'completed'
                            ? '#e5c590'
                            : '#AFB3B7',
                          border: `1.5px solid ${
                            request.status === 'pending'
                              ? 'rgba(255, 255, 255, 0.3)'
                              : request.status === 'completed'
                              ? 'rgba(201, 165, 116, 0.5)'
                              : 'rgba(42, 63, 63, 0.4)'
                          }`,
                          boxShadow: request.status === 'pending'
                            ? '0 0 20px rgba(255, 255, 255, 0.1)'
                            : request.status === 'completed'
                            ? '0 0 20px rgba(201, 165, 116, 0.25)'
                            : '0 0 20px rgba(42, 63, 63, 0.2)'
                        }}>
                          <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: request.status === 'pending'
                              ? '#ffffff'
                              : request.status === 'completed'
                              ? '#c9a574'
                              : '#AFB3B7',
                            boxShadow: `0 0 8px ${
                              request.status === 'pending'
                                ? '#ffffff'
                                : request.status === 'completed'
                                ? '#c9a574'
                                : '#AFB3B7'
                            }`
                          }} />
                          {request.status === 'pending' ? 'Pendiente' : request.status === 'completed' ? 'Completada' : 'En Proceso'}
                        </div>

                        {/* Acciones */}
                        {request.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => {
                                if (setPaymentRequests) {
                                  setPaymentRequests(
                                    paymentRequests.map(r => 
                                      r.id === request.id 
                                        ? { ...r, status: 'completed' }
                                        : r
                                    )
                                  );
                                  if (setNotifications) {
                                    setNotifications([{
                                      id: Date.now(),
                                      type: 'success',
                                      title: 'Pago Aprobado',
                                      message: `Pago de €${request.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} a ${request.artistName} aprobado`,
                                      time: 'Ahora',
                                      read: false
                                    }]);
                                  }
                                  
                                  // Mostrar toast de confirmación
                                  toast.success('Pago Aprobado', {
                                    description: `El pago de €${request.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} a ${request.artistName} ha sido aprobado exitosamente.`,
                                    duration: 5000,
                                  });
                                }
                              }}
                              style={{
                                padding: '10px 18px',
                                background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.25) 0%, rgba(181, 145, 96, 0.2) 100%)',
                                border: '1.5px solid rgba(201, 165, 116, 0.5)',
                                borderRadius: '10px',
                                color: '#e5c590',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 12px rgba(201, 165, 116, 0.15)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(201, 165, 116, 0.35) 0%, rgba(181, 145, 96, 0.3) 100%)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 165, 116, 0.3)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(201, 165, 116, 0.25) 0%, rgba(181, 145, 96, 0.2) 100%)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 165, 116, 0.15)';
                              }}
                            >
                              <Check size={16} strokeWidth={3} />
                              Aprobar
                            </button>
                            <button
                              onClick={() => {
                                if (setPaymentRequests && confirm('¿Estás seguro de rechazar esta solicitud?')) {
                                  setPaymentRequests(
                                    paymentRequests.filter(r => r.id !== request.id)
                                  );
                                  if (setNotifications) {
                                    setNotifications([{
                                      id: Date.now(),
                                      type: 'error',
                                      title: 'Pago Rechazado',
                                      message: `Solicitud de ${request.artistName} rechazada`,
                                      time: 'Ahora',
                                      read: false
                                    }]);
                                  }
                                }
                              }}
                              style={{
                                padding: '10px 18px',
                                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.3) 0%, rgba(62, 83, 83, 0.2) 100%)',
                                border: '1.5px solid rgba(175, 179, 183, 0.4)',
                                borderRadius: '10px',
                                color: '#AFB3B7',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 12px rgba(42, 63, 63, 0.2)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(62, 83, 83, 0.3) 100%)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(42, 63, 63, 0.3)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(42, 63, 63, 0.3) 0%, rgba(62, 83, 83, 0.2) 100%)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(42, 63, 63, 0.2)';
                              }}
                            >
                              <X size={16} strokeWidth={3} />
                              Rechazar
                            </button>
                          </div>
                        )}
                        {request.status === 'completed' && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 18px',
                            background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.2) 0%, rgba(181, 145, 96, 0.15) 100%)',
                            borderRadius: '10px',
                            border: '1.5px solid rgba(201, 165, 116, 0.4)',
                            boxShadow: '0 0 15px rgba(201, 165, 116, 0.2)'
                          }}>
                            <Check size={16} color="#c9a574" strokeWidth={3} />
                            <span style={{
                              fontSize: '12px',
                              fontWeight: '700',
                              color: '#c9a574',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              Pagado
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                      {/* Content Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto auto',
                      gap: '32px',
                      alignItems: 'center'
                    }}>
                      {/* Artista */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          background: request.artistPhoto ? `url(${request.artistPhoto})` : '#c9a574',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          fontWeight: '700',
                          color: '#2a3f3f',
                          flexShrink: 0,
                          border: '2px solid rgba(201, 165, 116, 0.3)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                        }}>
                          {!request.artistPhoto && request.artistName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#ffffff',
                            marginBottom: '4px'
                          }}>
                            {request.artistName}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.5)'
                          }}>
                            Artista
                          </div>
                        </div>
                      </div>

                      {/* Beneficiario */}
                      <div>
                        <div style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.5)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '6px'
                        }}>
                          Beneficiario
                        </div>
                        <div style={{
                          fontSize: '15px',
                          color: '#ffffff',
                          fontWeight: '600',
                          marginBottom: '4px'
                        }}>
                          {request.firstName} {request.lastName}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontFamily: 'monospace'
                        }}>
                          {request.accountNumber}
                        </div>
                      </div>

                      {/* Monto */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.5)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '6px'
                        }}>
                          Monto
                        </div>
                        <div style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: '#c9a574',
                          letterSpacing: '-0.5px'
                        }}>
                          €{request.amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>

                      {/* Fecha */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.5)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '6px'
                        }}>
                          Fecha Solicitud
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontWeight: '600'
                        }}>
                          {new Date(request.date).toLocaleDateString('es-ES', { 
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}