import { useState } from 'react';
import { Wallet, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Download, Filter, Calendar, Eye, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface FinancesPanelProps {
  dashboardData: any;
  artists: any[];
}

export function FinancesPanel({ dashboardData, artists }: FinancesPanelProps) {
  const [financesTab, setFinancesTab] = useState('overview'); // overview, income, expenses, reports
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // month, quarter, year

  // Datos de ejemplo para ingresos mensuales
  const monthlyIncomeData = [
    { month: 'Ene', income: 12500, expenses: 3200, profit: 9300 },
    { month: 'Feb', income: 15800, expenses: 3500, profit: 12300 },
    { month: 'Mar', income: 18200, expenses: 4100, profit: 14100 },
    { month: 'Abr', income: 16900, expenses: 3800, profit: 13100 },
    { month: 'May', income: 21500, expenses: 4500, profit: 17000 },
    { month: 'Jun', income: 19800, expenses: 4200, profit: 15600 }
  ];

  // Datos de gastos por categoría
  const expensesData = [
    { category: 'Marketing', amount: 8500, percentage: 35 },
    { category: 'Distribución', amount: 6200, percentage: 26 },
    { category: 'Producción', amount: 4800, percentage: 20 },
    { category: 'Administrativo', amount: 3200, percentage: 13 },
    { category: 'Otros', amount: 1500, percentage: 6 }
  ];

  // Datos de ingresos por plataforma
  const platformIncomeData = [
    { platform: 'Spotify', amount: 45200, change: 12.5 },
    { platform: 'Apple Music', amount: 28900, change: 8.3 },
    { platform: 'YouTube Music', amount: 15600, change: -2.1 },
    { platform: 'Amazon Music', amount: 12400, change: 15.7 },
    { platform: 'Deezer', amount: 8900, change: 5.4 }
  ];

  const formatEuro = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
          Finanzas y Reportes
        </h1>
        <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
          Gestiona y analiza los ingresos, gastos y reportes financieros
        </p>
      </div>

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
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
      <div>
        {/* Resumen General */}
        {financesTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              {/* Total Ingresos */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.2) 0%, rgba(74, 222, 128, 0.05) 100%)',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: '#AFB3B7', fontWeight: '500' }}>Ingresos Totales</span>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(74, 222, 128, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ArrowUpRight size={20} color="#4ade80" />
                  </div>
                </div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#4ade80', marginBottom: '8px' }}>
                  {formatEuro(dashboardData.totalRevenue || 0)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingUp size={14} color="#4ade80" />
                  <span style={{ fontSize: '13px', color: '#4ade80', fontWeight: '600' }}>+12.5%</span>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>vs mes anterior</span>
                </div>
              </div>

              {/* Total Gastos */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.05) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: '#AFB3B7', fontWeight: '500' }}>Gastos Totales</span>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ArrowDownRight size={20} color="#ef4444" />
                  </div>
                </div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#ef4444', marginBottom: '8px' }}>
                  {formatEuro(24300)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingUp size={14} color="#ef4444" />
                  <span style={{ fontSize: '13px', color: '#ef4444', fontWeight: '600' }}>+5.2%</span>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>vs mes anterior</span>
                </div>
              </div>

              {/* Beneficio Neto */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.3) 0%, rgba(201, 165, 116, 0.1) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.4)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: '#AFB3B7', fontWeight: '500' }}>Beneficio Neto</span>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(201, 165, 116, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Wallet size={20} color="#c9a574" />
                  </div>
                </div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#c9a574', marginBottom: '8px' }}>
                  {formatEuro((dashboardData.totalRevenue || 0) - 24300)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingUp size={14} color="#c9a574" />
                  <span style={{ fontSize: '13px', color: '#c9a574', fontWeight: '600' }}>+18.3%</span>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>vs mes anterior</span>
                </div>
              </div>

              {/* Margen de Beneficio */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.2) 0%, rgba(96, 165, 250, 0.05) 100%)',
                border: '1px solid rgba(96, 165, 250, 0.3)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: '#AFB3B7', fontWeight: '500' }}>Margen de Beneficio</span>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(96, 165, 250, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <TrendingUp size={20} color="#60a5fa" />
                  </div>
                </div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#60a5fa', marginBottom: '8px' }}>
                  78.5%
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingUp size={14} color="#60a5fa" />
                  <span style={{ fontSize: '13px', color: '#60a5fa', fontWeight: '600' }}>+3.2%</span>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>vs mes anterior</span>
                </div>
              </div>
            </div>

            {/* Gráfico de Evolución */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>
                  Evolución Financiera
                </h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['month', 'quarter', 'year'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      style={{
                        padding: '8px 16px',
                        background: selectedPeriod === period ? 'rgba(201, 165, 116, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                        border: selectedPeriod === period ? '1px solid rgba(201, 165, 116, 0.4)' : '1px solid rgba(201, 165, 116, 0.1)',
                        borderRadius: '8px',
                        color: selectedPeriod === period ? '#c9a574' : '#AFB3B7',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {period === 'month' ? 'Mes' : period === 'quarter' ? 'Trimestre' : 'Año'}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyIncomeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(201, 165, 116, 0.1)" />
                  <XAxis dataKey="month" stroke="#AFB3B7" />
                  <YAxis stroke="#AFB3B7" />
                  <Tooltip
                    contentStyle={{
                      background: '#1e2f2f',
                      border: '1px solid rgba(201, 165, 116, 0.3)',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                  <Line type="monotone" dataKey="income" stroke="#4ade80" strokeWidth={3} name="Ingresos" />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} name="Gastos" />
                  <Line type="monotone" dataKey="profit" stroke="#c9a574" strokeWidth={3} name="Beneficio" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Top Artistas por Ingresos */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '20px' }}>
                Top Artistas por Ingresos
              </h2>
              <div style={{ display: 'grid', gap: '12px' }}>
                {artists.slice(0, 5).map((artist, index) => (
                  <div
                    key={artist.id}
                    style={{
                      padding: '16px',
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
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
                    {artist.photoUrl && (
                      <img
                        src={artist.photoUrl}
                        alt={artist.name}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '10px',
                          objectFit: 'cover',
                          border: '2px solid rgba(201, 165, 116, 0.3)'
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>
                        {artist.name}
                      </div>
                      <div style={{ fontSize: '13px', color: '#AFB3B7' }}>
                        {artist.totalTracks || 0} canciones
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#4ade80' }}>
                        {formatEuro(artist.totalRevenue || 0)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {artist.totalStreams?.toLocaleString() || 0} streams
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ingresos */}
        {financesTab === 'income' && (
          <div>
            {/* Ingresos por Plataforma */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '20px' }}>
                Ingresos por Plataforma
              </h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                {platformIncomeData.map((platform) => (
                  <div
                    key={platform.platform}
                    style={{
                      padding: '20px',
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '16px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>
                        {platform.platform}
                      </div>
                      <div style={{ fontSize: '13px', color: '#AFB3B7' }}>
                        Streaming
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#4ade80', marginBottom: '4px' }}>
                        {formatEuro(platform.amount)}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        justifyContent: 'flex-end'
                      }}>
                        {platform.change > 0 ? (
                          <ArrowUpRight size={14} color="#4ade80" />
                        ) : (
                          <ArrowDownRight size={14} color="#ef4444" />
                        )}
                        <span style={{
                          fontSize: '13px',
                          color: platform.change > 0 ? '#4ade80' : '#ef4444',
                          fontWeight: '600'
                        }}>
                          {platform.change > 0 ? '+' : ''}{platform.change}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gráfico de Barras */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '20px' }}>
                Ingresos Mensuales
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlyIncomeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(201, 165, 116, 0.1)" />
                  <XAxis dataKey="month" stroke="#AFB3B7" />
                  <YAxis stroke="#AFB3B7" />
                  <Tooltip
                    contentStyle={{
                      background: '#1e2f2f',
                      border: '1px solid rgba(201, 165, 116, 0.3)',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                  />
                  <Bar dataKey="income" fill="#4ade80" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Gastos */}
        {financesTab === 'expenses' && (
          <div>
            {/* Gastos por Categoría */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '20px' }}>
                Gastos por Categoría
              </h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                {expensesData.map((expense) => (
                  <div
                    key={expense.category}
                    style={{
                      padding: '20px',
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#ffffff' }}>
                        {expense.category}
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#ef4444' }}>
                        {formatEuro(expense.amount)}
                      </div>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${expense.percentage}%`,
                        height: '100%',
                        background: '#ef4444',
                        borderRadius: '4px'
                      }} />
                    </div>
                    <div style={{ fontSize: '13px', color: '#AFB3B7', marginTop: '8px' }}>
                      {expense.percentage}% del total
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reportes */}
        {financesTab === 'reports' && (
          <div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              borderRadius: '16px',
              padding: '32px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
                Reportes Financieros
              </h2>
              <p style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '24px' }}>
                Descarga reportes detallados de tus finanzas
              </p>

              <div style={{ display: 'grid', gap: '16px' }}>
                {[
                  { name: 'Reporte Mensual', description: 'Resumen completo del mes actual', period: 'Junio 2024' },
                  { name: 'Reporte Trimestral', description: 'Análisis del último trimestre', period: 'Q2 2024' },
                  { name: 'Reporte Anual', description: 'Balance completo del año', period: '2024' },
                  { name: 'Reporte por Artista', description: 'Desglose de ingresos por artista', period: 'Personalizado' }
                ].map((report) => (
                  <div
                    key={report.name}
                    style={{
                      padding: '20px',
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '16px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>
                        {report.name}
                      </div>
                      <div style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '6px' }}>
                        {report.description}
                      </div>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        background: 'rgba(96, 165, 250, 0.1)',
                        borderRadius: '6px',
                        border: '1px solid rgba(96, 165, 250, 0.3)'
                      }}>
                        <Calendar size={12} color="#60a5fa" />
                        <span style={{ fontSize: '12px', color: '#60a5fa', fontWeight: '600' }}>
                          {report.period}
                        </span>
                      </div>
                    </div>
                    <button
                      style={{
                        padding: '10px 20px',
                        background: 'rgba(201, 165, 116, 0.1)',
                        border: '1px solid rgba(201, 165, 116, 0.3)',
                        borderRadius: '10px',
                        color: '#c9a574',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
                      }}
                    >
                      <Download size={16} />
                      Descargar PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
