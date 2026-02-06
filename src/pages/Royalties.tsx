import { useState, useEffect } from 'react';
import { Upload, Download, DollarSign, TrendingUp, Calendar, FileText } from 'lucide-react';
import { royaltiesAPI, artistsAPI } from '../utils/api';

interface Royalty {
  id: number;
  artist_id: number;
  artist_name: string;
  period_start: string;
  period_end: string;
  total_streams: number;
  total_revenue: number;
  artist_share: number;
  label_share: number;
  status: string;
  created_at: string;
}

export default function Royalties() {
  const [royalties, setRoyalties] = useState<Royalty[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [royaltiesRes, artistsRes] = await Promise.all([
        royaltiesAPI.getAll(),
        artistsAPI.getAll(),
      ]);
      
      if (royaltiesRes.success && royaltiesRes.data) {
        setRoyalties(royaltiesRes.data);
      }
      if (artistsRes.success && artistsRes.data) {
        setArtists(artistsRes.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await royaltiesAPI.upload(formData);
      if (response.success) {
        alert('Archivo CSV cargado exitosamente');
        setSelectedFile(null);
        loadData();
      } else {
        alert('Error al cargar el archivo: ' + response.message);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error al cargar el archivo');
    } finally {
      setUploading(false);
    }
  };

  const handleCalculateRoyalties = async () => {
    if (!confirm('¿Calcular royalties para todos los artistas? Esta acción puede tardar unos minutos.')) {
      return;
    }

    setCalculating(true);
    try {
      const response = await royaltiesAPI.calculate();
      if (response.success) {
        alert('Royalties calculados exitosamente');
        loadData();
      } else {
        alert('Error al calcular royalties: ' + response.message);
      }
    } catch (error) {
      console.error('Error calculating royalties:', error);
      alert('Error al calcular royalties');
    } finally {
      setCalculating(false);
    }
  };

  const totalStats = {
    totalRevenue: royalties.reduce((sum, r) => sum + r.total_revenue, 0),
    totalStreams: royalties.reduce((sum, r) => sum + r.total_streams, 0),
    totalArtistShare: royalties.reduce((sum, r) => sum + r.artist_share, 0),
    totalLabelShare: royalties.reduce((sum, r) => sum + r.label_share, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--accent-gold)] mb-2">
          Royalties
        </h1>
        <p className="text-[var(--text-muted)]">
          Gestiona y calcula los royalties de tus artistas
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[var(--bg-darker)] rounded-xl p-6 border border-[var(--accent-gold)]/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-lg bg-green-500/10">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Ingresos Totales</p>
              <p className="text-2xl font-bold text-[var(--text-light)]">
                €{totalStats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-darker)] rounded-xl p-6 border border-[var(--accent-gold)]/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Total Streams</p>
              <p className="text-2xl font-bold text-[var(--text-light)]">
                {totalStats.totalStreams.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-darker)] rounded-xl p-6 border border-[var(--accent-gold)]/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-lg bg-[var(--accent-gold)]/10">
              <DollarSign className="w-6 h-6 text-[var(--accent-gold)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Parte Artistas</p>
              <p className="text-2xl font-bold text-[var(--accent-gold)]">
                €{totalStats.totalArtistShare.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-darker)] rounded-xl p-6 border border-[var(--accent-gold)]/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-lg bg-purple-500/10">
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Parte Label</p>
              <p className="text-2xl font-bold text-[var(--text-light)]">
                €{totalStats.totalLabelShare.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload CSV */}
        <div className="bg-[var(--bg-darker)] rounded-xl p-6 border border-[var(--accent-gold)]/20">
          <h3 className="text-lg font-semibold text-[var(--text-light)] mb-4">
            Cargar Reporte CSV
          </h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Sube archivos CSV de The Orchard para procesar royalties
          </p>
          <form onSubmit={handleFileUpload} className="space-y-4">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full bg-[var(--bg-dark)] border border-[var(--accent-gold)]/30 
                rounded-lg px-4 py-3 text-[var(--text-light)]
                focus:outline-none focus:border-[var(--accent-gold)]"
            />
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="w-full flex items-center justify-center gap-2 bg-[var(--accent-gold)] 
                text-[var(--bg-dark)] px-6 py-3 rounded-lg font-semibold hover:bg-[#b89560] 
                transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-5 h-5" />
              {uploading ? 'Cargando...' : 'Cargar Archivo'}
            </button>
          </form>
        </div>

        {/* Calculate Royalties */}
        <div className="bg-[var(--bg-darker)] rounded-xl p-6 border border-[var(--accent-gold)]/20">
          <h3 className="text-lg font-semibold text-[var(--text-light)] mb-4">
            Calcular Royalties
          </h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Procesa y calcula los royalties para todos los artistas basándose en los datos cargados
          </p>
          <button
            onClick={handleCalculateRoyalties}
            disabled={calculating}
            className="w-full flex items-center justify-center gap-2 bg-green-600 
              text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 
              transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrendingUp className="w-5 h-5" />
            {calculating ? 'Calculando...' : 'Calcular Royalties'}
          </button>
        </div>
      </div>

      {/* Royalties Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent-gold)] border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-[var(--bg-darker)] rounded-xl border border-[var(--accent-gold)]/20 overflow-hidden">
          <div className="p-6 border-b border-[var(--accent-gold)]/20">
            <h3 className="text-lg font-semibold text-[var(--text-light)]">
              Historial de Royalties
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--bg-dark)] border-b border-[var(--accent-gold)]/20">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-muted)]">
                    Artista
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-muted)]">
                    Período
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-[var(--text-muted)]">
                    Streams
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-[var(--text-muted)]">
                    Ingresos
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-[var(--text-muted)]">
                    Artista
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-[var(--text-muted)]">
                    Label
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
                    <td className="px-6 py-4 font-medium text-[var(--text-light)]">
                      {royalty.artist_name}
                    </td>
                    <td className="px-6 py-4 text-[var(--text-muted)]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
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
                    <td className="px-6 py-4 text-right font-semibold text-[var(--accent-gold)]">
                      €{royalty.artist_share.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-purple-400">
                      €{royalty.label_share.toLocaleString()}
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
      )}
    </div>
  );
}
