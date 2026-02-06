import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DollarSign, Music, TrendingUp, Calendar, Play, Pause } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCurrentUser, statsAPI, catalogAPI, royaltiesAPI } from '../utils/api';

function ArtistDashboard() {
  const currentUser = getCurrentUser();
  const [stats, setStats] = useState<any>({
    totalEarnings: 0,
    totalStreams: 0,
    totalTracks: 0,
    monthlyData: [],
  });
  const [royalties, setRoyalties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (currentUser?.artist_id) {
        const [statsRes, royaltiesRes] = await Promise.all([
          statsAPI.getArtistStats(currentUser.artist_id),
          royaltiesAPI.getByArtist(currentUser.artist_id),
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }
        if (royaltiesRes.success && royaltiesRes.data) {
          setRoyalties(royaltiesRes.data);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockMonthlyData = [
    { month: 'Ene', earnings: 1200, streams: 15000 },
    { month: 'Feb', earnings: 1500, streams: 18500 },
    { month: 'Mar', earnings: 1350, streams: 16800 },
    { month: 'Abr', earnings: 1800, streams: 22000 },
    { month: 'May', earnings: 2100, streams: 25500 },
    { month: 'Jun', earnings: 1900, streams: 23200 },
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
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--accent-gold)] mb-2">
          ¡Hola, {currentUser?.name}! 👋
        </h1>
        <p className="text-[var(--text-muted)]">
          Bienvenido a tu portal de artista
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--bg-darker)] rounded-xl p-6 border border-[var(--accent-gold)]/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-lg bg-green-500/10">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Ganancias Totales</p>
              <p className="text-2xl font-bold text-[var(--text-light)]">
                €{stats.totalEarnings?.toLocaleString() || '12,450'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span>+15% este mes</span>
          </div>
        </div>

        <div className="bg-[var(--bg-darker)] rounded-xl p-6 border border-[var(--accent-gold)]/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Play className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Total Streams</p>
              <p className="text-2xl font-bold text-[var(--text-light)]">
                {stats.totalStreams?.toLocaleString() || '145,230'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-400">
            <TrendingUp className="w-4 h-4" />
            <span>+8% este mes</span>
          </div>
        </div>

        <div className="bg-[var(--bg-darker)] rounded-xl p-6 border border-[var(--accent-gold)]/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-lg bg-[var(--accent-gold)]/10">
              <Music className="w-6 h-6 text-[var(--accent-gold)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Canciones</p>
              <p className="text-2xl font-bold text-[var(--text-light)]">
                {stats.totalTracks || '12'}
              </p>
            </div>
          </div>
          <p className="text-sm text-[var(--text-muted)]">En catálogo</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <div className="bg-[var(--bg-darker)] rounded-xl p-6 border border-[var(--accent-gold)]/20">
          <h3 className="text-lg font-semibold text-[var(--text-light)] mb-4">
            Ganancias Mensuales
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.monthlyData?.length > 0 ? stats.monthlyData : mockMonthlyData}>
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
              <Line type="monotone" dataKey="earnings" stroke="#c9a574" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Streams Chart */}
        <div className="bg-[var(--bg-darker)] rounded-xl p-6 border border-[var(--accent-gold)]/20">
          <h3 className="text-lg font-semibold text-[var(--text-light)] mb-4">
            Streams Mensuales
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.monthlyData?.length > 0 ? stats.monthlyData : mockMonthlyData}>
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
              <Bar dataKey="streams" fill="#4a9eff" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Royalties */}
      <div className="bg-[var(--bg-darker)] rounded-xl p-6 border border-[var(--accent-gold)]/20">
        <h3 className="text-lg font-semibold text-[var(--text-light)] mb-4">
          Pagos Recientes
        </h3>
        <div className="space-y-3">
          {(royalties.length > 0 ? royalties : [
            { id: 1, period: 'Mayo 2026', amount: 2100, streams: 25500, status: 'paid' },
            { id: 2, period: 'Abril 2026', amount: 1800, streams: 22000, status: 'paid' },
            { id: 3, period: 'Marzo 2026', amount: 1350, streams: 16800, status: 'paid' },
          ]).slice(0, 5).map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 bg-[var(--bg-dark)] rounded-lg 
                border-l-4 border-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-[var(--text-light)]">
                    {payment.period || `${new Date(payment.period_start).toLocaleDateString('es-ES')} - ${new Date(payment.period_end).toLocaleDateString('es-ES')}`}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {payment.streams?.toLocaleString() || payment.total_streams?.toLocaleString()} streams
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-[var(--accent-gold)]">
                  €{payment.amount?.toLocaleString() || payment.artist_share?.toLocaleString()}
                </p>
                <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded-full">
                  {payment.status === 'paid' ? 'Pagado' : 'Pendiente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArtistMusic() {
  const currentUser = getCurrentUser();
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [audioElement] = useState(new Audio());

  useEffect(() => {
    loadTracks();
    return () => {
      audioElement.pause();
    };
  }, []);

  const loadTracks = async () => {
    try {
      const response = await catalogAPI.getAll();
      if (response.success && response.data) {
        // Filter by current artist
        const artistTracks = response.data.filter(
          (track: any) => track.artist_id === currentUser?.artist_id
        );
        setTracks(artistTracks);
      }
    } catch (error) {
      console.error('Error loading tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = (track: any) => {
    if (playingId === track.id) {
      audioElement.pause();
      setPlayingId(null);
    } else {
      if (track.audio_url) {
        audioElement.src = track.audio_url;
        audioElement.play();
        setPlayingId(track.id);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent-gold)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--accent-gold)] mb-2">
          Mi Música
        </h1>
        <p className="text-[var(--text-muted)]">
          Explora tu catálogo musical
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="bg-[var(--bg-darker)] rounded-xl border border-[var(--accent-gold)]/20 
              overflow-hidden hover:border-[var(--accent-gold)]/40 transition-all hover:shadow-lg"
          >
            <div className="h-48 bg-gradient-to-br from-[var(--accent-gold)]/20 to-[var(--bg-dark)] 
              flex items-center justify-center relative">
              {track.cover_url ? (
                <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover" />
              ) : (
                <Music className="w-20 h-20 text-[var(--accent-gold)]/40" />
              )}
              <button
                onClick={() => handlePlayPause(track)}
                className="absolute inset-0 bg-black/50 flex items-center justify-center 
                  opacity-0 hover:opacity-100 transition-opacity"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--accent-gold)] flex items-center 
                  justify-center hover:bg-[#b89560] transition-all">
                  {playingId === track.id ? (
                    <Pause className="w-8 h-8 text-[var(--bg-dark)]" />
                  ) : (
                    <Play className="w-8 h-8 text-[var(--bg-dark)] ml-1" />
                  )}
                </div>
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-[var(--text-light)] mb-2">
                {track.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)] mb-2">ISRC: {track.isrc}</p>
              {track.genre && (
                <span className="inline-block px-3 py-1 bg-[var(--accent-gold)]/10 
                  text-[var(--accent-gold)] rounded-full text-sm">
                  {track.genre}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArtistEarnings() {
  const currentUser = getCurrentUser();
  const [royalties, setRoyalties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoyalties();
  }, []);

  const loadRoyalties = async () => {
    try {
      if (currentUser?.artist_id) {
        const response = await royaltiesAPI.getByArtist(currentUser.artist_id);
        if (response.success && response.data) {
          setRoyalties(response.data);
        }
      }
    } catch (error) {
      console.error('Error loading royalties:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalEarnings = royalties.reduce((sum, r) => sum + (r.artist_share || 0), 0);
  const totalStreams = royalties.reduce((sum, r) => sum + (r.total_streams || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent-gold)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--accent-gold)] mb-2">
          Mis Ingresos
        </h1>
        <p className="text-[var(--text-muted)]">
          Historial completo de tus royalties
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-darker)] rounded-xl p-6 border border-[var(--accent-gold)]/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-lg bg-green-500/10">
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)]">Ingresos Totales</p>
              <p className="text-3xl font-bold text-[var(--text-light)]">
                €{totalEarnings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-darker)] rounded-xl p-6 border border-[var(--accent-gold)]/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)]">Streams Totales</p>
              <p className="text-3xl font-bold text-[var(--text-light)]">
                {totalStreams.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Royalties Table */}
      <div className="bg-[var(--bg-darker)] rounded-xl border border-[var(--accent-gold)]/20 overflow-hidden">
        <div className="p-6 border-b border-[var(--accent-gold)]/20">
          <h3 className="text-lg font-semibold text-[var(--text-light)]">
            Historial de Pagos
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-dark)] border-b border-[var(--accent-gold)]/20">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-muted)]">
                  Período
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-[var(--text-muted)]">
                  Streams
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-[var(--text-muted)]">
                  Ingresos Totales
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-[var(--text-muted)]">
                  Tu Parte
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-[var(--text-muted)]">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {royalties.map((royalty) => (
                <tr
                  key={royalty.id}
                  className="border-b border-[var(--accent-gold)]/10 hover:bg-[var(--accent-gold)]/5 
                    transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[var(--accent-gold)]" />
                      <span className="text-sm text-[var(--text-light)]">
                        {new Date(royalty.period_start).toLocaleDateString('es-ES')} -{' '}
                        {new Date(royalty.period_end).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-[var(--text-light)]">
                    {royalty.total_streams.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-green-400">
                    €{royalty.total_revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[var(--accent-gold)] text-lg">
                    €{royalty.artist_share.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${royalty.status === 'paid' 
                        ? 'bg-green-500/10 text-green-400' 
                        : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                      {royalty.status === 'paid' ? 'Pagado' : 'Pendiente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ArtistPortal() {
  return (
    <Routes>
      <Route path="/" element={<ArtistDashboard />} />
      <Route path="/music" element={<ArtistMusic />} />
      <Route path="/earnings" element={<ArtistEarnings />} />
    </Routes>
  );
}
