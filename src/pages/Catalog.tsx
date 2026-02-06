import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Play, Pause, Music } from 'lucide-react';
import { catalogAPI, artistsAPI } from '../utils/api';

interface Track {
  id: number;
  title: string;
  artist_id: number;
  artist_name: string;
  isrc: string;
  upc?: string;
  genre?: string;
  release_date?: string;
  audio_url?: string;
  cover_url?: string;
  duration?: string;
}

export default function Catalog() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [audioElement] = useState(new Audio());

  const [formData, setFormData] = useState({
    title: '',
    artist_id: '',
    isrc: '',
    upc: '',
    genre: '',
    release_date: '',
    audio: null as File | null,
    cover: null as File | null,
  });

  useEffect(() => {
    loadData();
    return () => {
      audioElement.pause();
    };
  }, []);

  const loadData = async () => {
    try {
      const [tracksRes, artistsRes] = await Promise.all([
        catalogAPI.getAll(),
        artistsAPI.getAll(),
      ]);
      
      if (tracksRes.success && tracksRes.data) {
        setTracks(tracksRes.data);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('artist_id', formData.artist_id);
    data.append('isrc', formData.isrc);
    data.append('upc', formData.upc);
    data.append('genre', formData.genre);
    data.append('release_date', formData.release_date);
    if (formData.audio) {
      data.append('audio', formData.audio);
    }
    if (formData.cover) {
      data.append('cover', formData.cover);
    }

    try {
      if (editingTrack) {
        await catalogAPI.update(editingTrack.id, formData);
      } else {
        await catalogAPI.create(data);
      }
      loadData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving track:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta canción?')) {
      try {
        await catalogAPI.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting track:', error);
      }
    }
  };

  const handlePlayPause = (track: Track) => {
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

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTrack(null);
    setFormData({
      title: '',
      artist_id: '',
      isrc: '',
      upc: '',
      genre: '',
      release_date: '',
      audio: null,
      cover: null,
    });
  };

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.artist_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--accent-gold)] mb-2">
            Catálogo Musical
          </h1>
          <p className="text-[var(--text-muted)]">
            Gestiona tu biblioteca de música
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[var(--accent-gold)] text-[var(--bg-dark)] 
            px-6 py-3 rounded-lg font-semibold hover:bg-[#b89560] transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nueva Canción
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar canciones..."
          className="w-full bg-[var(--bg-darker)] border border-[var(--accent-gold)]/20 rounded-lg 
            pl-12 pr-4 py-3 text-[var(--text-light)] placeholder-[var(--text-muted)]
            focus:outline-none focus:border-[var(--accent-gold)]"
        />
      </div>

      {/* Tracks List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent-gold)] border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-[var(--bg-darker)] rounded-xl border border-[var(--accent-gold)]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--bg-dark)] border-b border-[var(--accent-gold)]/20">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-muted)]">
                    #
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-muted)]">
                    Título
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-muted)]">
                    Artista
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-muted)]">
                    ISRC
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-muted)]">
                    Género
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-[var(--text-muted)]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTracks.map((track, index) => (
                  <tr
                    key={track.id}
                    className="border-b border-[var(--accent-gold)]/10 hover:bg-[var(--accent-gold)]/5 
                      transition-colors"
                  >
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handlePlayPause(track)}
                        className="w-10 h-10 rounded-full bg-[var(--accent-gold)] flex items-center 
                          justify-center hover:bg-[#b89560] transition-all"
                      >
                        {playingId === track.id ? (
                          <Pause className="w-5 h-5 text-[var(--bg-dark)]" />
                        ) : (
                          <Play className="w-5 h-5 text-[var(--bg-dark)] ml-0.5" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-gradient-to-br from-[var(--accent-gold)]/20 
                          to-[var(--bg-dark)] flex items-center justify-center">
                          {track.cover_url ? (
                            <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover rounded" />
                          ) : (
                            <Music className="w-6 h-6 text-[var(--accent-gold)]/40" />
                          )}
                        </div>
                        <span className="font-medium text-[var(--text-light)]">{track.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-muted)]">
                      {track.artist_name}
                    </td>
                    <td className="px-6 py-4 text-[var(--text-muted)] font-mono text-sm">
                      {track.isrc}
                    </td>
                    <td className="px-6 py-4">
                      {track.genre && (
                        <span className="px-3 py-1 bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] 
                          rounded-full text-sm">
                          {track.genre}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingTrack(track);
                            setFormData({
                              title: track.title,
                              artist_id: track.artist_id.toString(),
                              isrc: track.isrc,
                              upc: track.upc || '',
                              genre: track.genre || '',
                              release_date: track.release_date || '',
                              audio: null,
                              cover: null,
                            });
                            setShowModal(true);
                          }}
                          className="p-2 rounded-lg bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] 
                            hover:bg-[var(--accent-gold)]/20 transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(track.id)}
                          className="p-2 rounded-lg bg-[var(--danger)]/10 text-[var(--danger)] 
                            hover:bg-[var(--danger)]/20 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[var(--bg-darker)] rounded-2xl w-full max-w-2xl border border-[var(--accent-gold)]/20 my-8">
            <div className="p-6 border-b border-[var(--accent-gold)]/20">
              <h2 className="text-2xl font-bold text-[var(--accent-gold)]">
                {editingTrack ? 'Editar Canción' : 'Nueva Canción'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-light)] mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[var(--bg-dark)] border border-[var(--accent-gold)]/30 
                      rounded-lg px-4 py-3 text-[var(--text-light)]
                      focus:outline-none focus:border-[var(--accent-gold)]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-light)] mb-2">
                    Artista
                  </label>
                  <select
                    value={formData.artist_id}
                    onChange={(e) => setFormData({ ...formData, artist_id: e.target.value })}
                    className="w-full bg-[var(--bg-dark)] border border-[var(--accent-gold)]/30 
                      rounded-lg px-4 py-3 text-[var(--text-light)]
                      focus:outline-none focus:border-[var(--accent-gold)]"
                    required
                  >
                    <option value="">Seleccionar artista</option>
                    {artists.map((artist) => (
                      <option key={artist.id} value={artist.id}>
                        {artist.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-light)] mb-2">
                    ISRC
                  </label>
                  <input
                    type="text"
                    value={formData.isrc}
                    onChange={(e) => setFormData({ ...formData, isrc: e.target.value })}
                    className="w-full bg-[var(--bg-dark)] border border-[var(--accent-gold)]/30 
                      rounded-lg px-4 py-3 text-[var(--text-light)] font-mono
                      focus:outline-none focus:border-[var(--accent-gold)]"
                    placeholder="USXXX0000000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-light)] mb-2">
                    UPC
                  </label>
                  <input
                    type="text"
                    value={formData.upc}
                    onChange={(e) => setFormData({ ...formData, upc: e.target.value })}
                    className="w-full bg-[var(--bg-dark)] border border-[var(--accent-gold)]/30 
                      rounded-lg px-4 py-3 text-[var(--text-light)] font-mono
                      focus:outline-none focus:border-[var(--accent-gold)]"
                    placeholder="000000000000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-light)] mb-2">
                    Género
                  </label>
                  <input
                    type="text"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full bg-[var(--bg-dark)] border border-[var(--accent-gold)]/30 
                      rounded-lg px-4 py-3 text-[var(--text-light)]
                      focus:outline-none focus:border-[var(--accent-gold)]"
                    placeholder="Pop, Rock, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-light)] mb-2">
                    Fecha de Lanzamiento
                  </label>
                  <input
                    type="date"
                    value={formData.release_date}
                    onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                    className="w-full bg-[var(--bg-dark)] border border-[var(--accent-gold)]/30 
                      rounded-lg px-4 py-3 text-[var(--text-light)]
                      focus:outline-none focus:border-[var(--accent-gold)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-light)] mb-2">
                    Audio
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setFormData({ ...formData, audio: e.target.files?.[0] || null })}
                    className="w-full bg-[var(--bg-dark)] border border-[var(--accent-gold)]/30 
                      rounded-lg px-4 py-3 text-[var(--text-light)]
                      focus:outline-none focus:border-[var(--accent-gold)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-light)] mb-2">
                    Portada
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, cover: e.target.files?.[0] || null })}
                    className="w-full bg-[var(--bg-dark)] border border-[var(--accent-gold)]/30 
                      rounded-lg px-4 py-3 text-[var(--text-light)]
                      focus:outline-none focus:border-[var(--accent-gold)]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-[var(--bg-dark)] text-[var(--text-light)] px-6 py-3 
                    rounded-lg hover:bg-[var(--accent-gold)]/10 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[var(--accent-gold)] text-[var(--bg-dark)] px-6 py-3 
                    rounded-lg font-semibold hover:bg-[#b89560] transition-all"
                >
                  {editingTrack ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
