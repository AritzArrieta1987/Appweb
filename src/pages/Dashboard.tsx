import { useState, useEffect } from 'react';
import { Users, Music, FileText, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { statsAPI } from '../utils/api';

interface DashboardStats {
  totalArtists: number;
  totalTracks: number;
  totalContracts: number;
  totalRoyalties: number;
  monthlyGrowth: number;
  recentActivity: any[];
  revenueByMonth: any[];
  topArtists: any[];
  genreDistribution: any[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalArtists: 0,
    totalTracks: 0,
    totalContracts: 0,
    totalRoyalties: 0,
    monthlyGrowth: 0,
    recentActivity: [],
    revenueByMonth: [],
    topArtists: [],
    genreDistribution: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await statsAPI.getDashboard();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#c9a574', '#2a3f3f', '#4a6363', '#7a9393'];

  const statCards = [
    {
      title: 'Artistas',
      value: stats.totalArtists,
      icon: Users,
      color: 'text-[var(--accent-gold)]',
      bgColor: 'bg-[var(--accent-gold)]/10',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Canciones',
      value: stats.totalTracks,
      icon: Music,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Contratos',
      value: stats.totalContracts,
      icon: FileText,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      trend: '+5%',
      trendUp: true,
    },
    {
      title: 'Royalties Total',
      value: `€${stats.totalRoyalties.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      trend: '+18%',
      trendUp: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent-gold)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--accent-gold)] mb-2">
          Dashboard
        </h1>
        <p className="text-[var(--text-muted)]">
          Bienvenido al panel de control de BIGARTIST
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-[var(--bg-darker)] rounded-xl p-6 border border-[var(--accent-gold)]/20 
                hover:border-[var(--accent-gold)]/40 transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${card.trendUp ? 'text-green-400' : 'text-red-400'}`}>
                  {card.trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{card.trend}</span>
                </div>
              </div>
              <h3 className="text-[var(--text-muted)] text-sm mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-[var(--text-light)]">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-[var(--bg-darker)] rounded-xl p-6 border border-[var(--accent-gold)]/20">
          <h3 className="text-lg font-semibold text-[var(--text-light)] mb-4">
            Ingresos Mensuales
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.revenueByMonth.length > 0 ? stats.revenueByMonth : [
              { month: 'Ene', revenue: 45000 },
              { month: 'Feb', revenue: 52000 },
              { month: 'Mar', revenue: 48000 },
              { month: 'Abr', revenue: 61000 },
              { month: 'May', revenue: 55000 },
              { month: 'Jun', revenue: 67000 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a6363" opacity={0.1} />
              <XAxis dataKey="month" stroke="#adb5bd" />
              <YAxis stroke="#adb5bd" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2d2d',
                  border: '1px solid #c9a574',
                  borderRadius: '8px',
                  color: '#f8f9fa'
                }}
              />
              <Bar dataKey="revenue" fill="#c9a574" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Growth Trend */}
        <div className="bg-[var(--bg-darker)] rounded-xl p-6 border border-[var(--accent-gold)]/20">
          <h3 className="text-lg font-semibold text-[var(--text-light)] mb-4">
            Tendencia de Crecimiento
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[
              { month: 'Ene', artists: 12, tracks: 45 },
              { month: 'Feb', artists: 15, tracks: 58 },
              { month: 'Mar', artists: 18, tracks: 72 },
              { month: 'Abr', artists: 22, tracks: 89 },
              { month: 'May', artists: 25, tracks: 105 },
              { month: 'Jun', artists: 28, tracks: 124 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a6363" opacity={0.1} />
              <XAxis dataKey="month" stroke="#adb5bd" />
              <YAxis stroke="#adb5bd" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2d2d',
                  border: '1px solid #c9a574',
                  borderRadius: '8px',
                  color: '#f8f9fa'
                }}
              />
              <Line type="monotone" dataKey="artists" stroke="#c9a574" strokeWidth={2} />
              <Line type="monotone" dataKey="tracks" stroke="#4a9eff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Genre Distribution */}
        <div className="bg-[var(--bg-darker)] rounded-xl p-6 border border-[var(--accent-gold)]/20">
          <h3 className="text-lg font-semibold text-[var(--text-light)] mb-4">
            Distribución por Género
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.genreDistribution.length > 0 ? stats.genreDistribution : [
                  { name: 'Pop', value: 35 },
                  { name: 'Rock', value: 25 },
                  { name: 'Hip Hop', value: 20 },
                  { name: 'Electronic', value: 20 },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Artists */}
        <div className="bg-[var(--bg-darker)] rounded-xl p-6 border border-[var(--accent-gold)]/20 lg:col-span-2">
          <h3 className="text-lg font-semibold text-[var(--text-light)] mb-4">
            Top Artistas
          </h3>
          <div className="space-y-4">
            {(stats.topArtists.length > 0 ? stats.topArtists : [
              { name: 'Juan Pérez', revenue: 15420, tracks: 12 },
              { name: 'María García', revenue: 12800, tracks: 8 },
              { name: 'Carlos Rodríguez', revenue: 11200, tracks: 15 },
              { name: 'Ana Martínez', revenue: 9500, tracks: 6 },
              { name: 'Luis Sánchez', revenue: 8700, tracks: 10 },
            ]).slice(0, 5).map((artist, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[var(--bg-dark)] 
                rounded-lg hover:bg-[var(--accent-gold)]/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent-gold)] flex items-center 
                    justify-center text-[var(--bg-dark)] font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--text-light)]">{artist.name}</p>
                    <p className="text-sm text-[var(--text-muted)]">{artist.tracks} canciones</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[var(--accent-gold)]">
                    €{artist.revenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">royalties</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[var(--bg-darker)] rounded-xl p-6 border border-[var(--accent-gold)]/20">
        <h3 className="text-lg font-semibold text-[var(--text-light)] mb-4">
          Actividad Reciente
        </h3>
        <div className="space-y-3">
          {[
            { action: 'Nuevo artista registrado', detail: 'Juan Pérez', time: 'Hace 2 horas' },
            { action: 'Royalties calculados', detail: 'Mes de Mayo 2026', time: 'Hace 5 horas' },
            { action: 'Contrato actualizado', detail: 'María García', time: 'Hace 1 día' },
            { action: 'Nueva canción agregada', detail: '"Summer Vibes"', time: 'Hace 2 días' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-[var(--bg-dark)] 
              rounded-lg border-l-4 border-[var(--accent-gold)]">
              <div>
                <p className="font-medium text-[var(--text-light)]">{activity.action}</p>
                <p className="text-sm text-[var(--text-muted)]">{activity.detail}</p>
              </div>
              <span className="text-xs text-[var(--text-muted)]">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
