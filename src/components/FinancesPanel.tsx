import { useState } from 'react';
import { Wallet, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Download, Filter, Calendar, Eye, FileText, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface FinancesPanelProps {
  dashboardData: any;
  artists: any[];
}

export function FinancesPanel({ dashboardData, artists }: FinancesPanelProps) {
  const [financesTab, setFinancesTab] = useState('overview');

  // Mock contracts data - En producción esto vendría del backend
  const contracts = artists.map((artist, index) => ({
    id: index + 1,
    artistId: artist.id,
    percentage: index === 0 ? 70 : 60,
  }));

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
                marginBottom: '-2px'
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
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div style={{ padding: '0' }}>
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
              {artists.length > 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  overflowY: 'auto',
                  maxHeight: '140px'
                }}>
                  {artists.filter(artist => artist.totalRevenue > 0).map((artist: any, index: number) => (
                    <div key={artist.id} style={{
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
                          background: artist.photo ? `url(${artist.photo})` : '#c9a574',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#2a3f3f'
                        }}>
                          {!artist.photo && artist.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#ffffff'
                        }}>
                          {artist.name}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#c9a574'
                      }}>
                        €{artist.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                  No hay artistas con royalties pendientes
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
                {artists.length > 0 ? (
                  artists.slice(0, 3).map((artist: any, index: number) => (
                    <div key={artist.id} style={{
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
                          background: artist.photo ? `url(${artist.photo})` : '#c9a574',
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
                          {!artist.photo && artist.name.charAt(0).toUpperCase()}
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
                            {artist.name}
                          </div>
                          <div style={{
                            fontSize: '11px',
                            color: 'rgba(255, 255, 255, 0.5)',
                            marginTop: '2px'
                          }}>
                            Hace {index + 1}h
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
                        €{artist.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))
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
                    {artists.filter(a => a.totalRevenue > 0).length}
                  </div>
                  <p style={{
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginTop: '2px'
                  }}>
                    Artistas con pagos procesados
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
                    €{dashboardData.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </div>
                  <p style={{
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginTop: '2px'
                  }}>
                    De plataformas de streaming
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
      </div>
    </div>
  );
}