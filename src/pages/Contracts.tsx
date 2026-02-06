import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, FileText, Calendar, User } from 'lucide-react';
import { contractsAPI, artistsAPI } from '../utils/api';

interface Contract {
  id: number;
  artist_id: number;
  artist_name: string;
  contract_type: string;
  start_date: string;
  end_date?: string;
  royalty_percentage: number;
  advance_amount?: number;
  status: string;
  notes?: string;
}

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);

  const [formData, setFormData] = useState({
    artist_id: '',
    contract_type: 'recording',
    start_date: '',
    end_date: '',
    royalty_percentage: 70,
    advance_amount: '',
    status: 'active',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [contractsRes, artistsRes] = await Promise.all([
        contractsAPI.getAll(),
        artistsAPI.getAll(),
      ]);
      
      if (contractsRes.success && contractsRes.data) {
        setContracts(contractsRes.data);
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
    
    try {
      if (editingContract) {
        await contractsAPI.update(editingContract.id, formData);
      } else {
        await contractsAPI.create(formData);
      }
      loadData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving contract:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este contrato?')) {
      try {
        await contractsAPI.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting contract:', error);
      }
    }
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    setFormData({
      artist_id: contract.artist_id.toString(),
      contract_type: contract.contract_type,
      start_date: contract.start_date,
      end_date: contract.end_date || '',
      royalty_percentage: contract.royalty_percentage,
      advance_amount: contract.advance_amount?.toString() || '',
      status: contract.status,
      notes: contract.notes || '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingContract(null);
    setFormData({
      artist_id: '',
      contract_type: 'recording',
      start_date: '',
      end_date: '',
      royalty_percentage: 70,
      advance_amount: '',
      status: 'active',
      notes: '',
    });
  };

  const filteredContracts = contracts.filter(contract =>
    contract.artist_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.contract_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'expired': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getContractTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      recording: 'Grabación',
      publishing: 'Publicación',
      distribution: 'Distribución',
      licensing: 'Licencia',
      management: 'Management',
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--accent-gold)] mb-2">
            Contratos
          </h1>
          <p className="text-[var(--text-muted)]">
            Gestiona los contratos de tus artistas
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[var(--accent-gold)] text-[var(--bg-dark)] 
            px-6 py-3 rounded-lg font-semibold hover:bg-[#b89560] transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nuevo Contrato
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar contratos..."
          className="w-full bg-[var(--bg-darker)] border border-[var(--accent-gold)]/20 rounded-lg 
            pl-12 pr-4 py-3 text-[var(--text-light)] placeholder-[var(--text-muted)]
            focus:outline-none focus:border-[var(--accent-gold)]"
        />
      </div>

      {/* Contracts Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent-gold)] border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredContracts.map((contract) => (
            <div
              key={contract.id}
              className="bg-[var(--bg-darker)] rounded-xl border border-[var(--accent-gold)]/20 
                overflow-hidden hover:border-[var(--accent-gold)]/40 transition-all hover:shadow-lg"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-[var(--accent-gold)]/10">
                      <FileText className="w-6 h-6 text-[var(--accent-gold)]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--text-light)]">
                        {getContractTypeLabel(contract.contract_type)}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)]">#{contract.id}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(contract.status)}`}>
                    {contract.status === 'active' ? 'Activo' : 
                     contract.status === 'pending' ? 'Pendiente' : 
                     contract.status === 'expired' ? 'Expirado' : contract.status}
                  </span>
                </div>

                {/* Artist */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[var(--accent-gold)]/10">
                  <User className="w-4 h-4 text-[var(--text-muted)]" />
                  <span className="text-[var(--text-light)]">{contract.artist_name}</span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">Inicio</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[var(--accent-gold)]" />
                      <span className="text-sm text-[var(--text-light)]">
                        {new Date(contract.start_date).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                  {contract.end_date && (
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-1">Fin</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[var(--accent-gold)]" />
                        <span className="text-sm text-[var(--text-light)]">
                          {new Date(contract.end_date).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">Porcentaje</p>
                    <p className="text-xl font-bold text-[var(--accent-gold)]">
                      {contract.royalty_percentage}%
                    </p>
                  </div>
                  {contract.advance_amount && (
                    <div>
                      <p className="text-xs text-[var(--text-muted)] mb-1">Adelanto</p>
                      <p className="text-xl font-bold text-green-400">
                        €{contract.advance_amount.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {contract.notes && (
                  <div className="mb-4 p-3 bg-[var(--bg-dark)] rounded-lg">
                    <p className="text-xs text-[var(--text-muted)] mb-1">Notas</p>
                    <p className="text-sm text-[var(--text-light)]">{contract.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(contract)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[var(--accent-gold)]/10 
                      text-[var(--accent-gold)] px-4 py-2 rounded-lg hover:bg-[var(--accent-gold)]/20 
                      transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(contract.id)}
                    className="flex items-center justify-center gap-2 bg-[var(--danger)]/10 
                      text-[var(--danger)] px-4 py-2 rounded-lg hover:bg-[var(--danger)]/20 
                      transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[var(--bg-darker)] rounded-2xl w-full max-w-2xl border border-[var(--accent-gold)]/20 my-8">
            <div className="p-6 border-b border-[var(--accent-gold)]/20">
              <h2 className="text-2xl font-bold text-[var(--accent-gold)]">
                {editingContract ? 'Editar Contrato' : 'Nuevo Contrato'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    Tipo de Contrato
                  </label>
                  <select
                    value={formData.contract_type}
                    onChange={(e) => setFormData({ ...formData, contract_type: e.target.value })}
                    className="w-full bg-[var(--bg-dark)] border border-[var(--accent-gold)]/30 
                      rounded-lg px-4 py-3 text-[var(--text-light)]
                      focus:outline-none focus:border-[var(--accent-gold)]"
                    required
                  >
                    <option value="recording">Grabación</option>
                    <option value="publishing">Publicación</option>
                    <option value="distribution">Distribución</option>
                    <option value="licensing">Licencia</option>
                    <option value="management">Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-light)] mb-2">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full bg-[var(--bg-dark)] border border-[var(--accent-gold)]/30 
                      rounded-lg px-4 py-3 text-[var(--text-light)]
                      focus:outline-none focus:border-[var(--accent-gold)]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-light)] mb-2">
                    Fecha de Fin
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full bg-[var(--bg-dark)] border border-[var(--accent-gold)]/30 
                      rounded-lg px-4 py-3 text-[var(--text-light)]
                      focus:outline-none focus:border-[var(--accent-gold)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-light)] mb-2">
                    Porcentaje de Royalties
                  </label>
                  <input
                    type="number"
                    value={formData.royalty_percentage}
                    onChange={(e) => setFormData({ ...formData, royalty_percentage: parseInt(e.target.value) })}
                    min="0"
                    max="100"
                    className="w-full bg-[var(--bg-dark)] border border-[var(--accent-gold)]/30 
                      rounded-lg px-4 py-3 text-[var(--text-light)]
                      focus:outline-none focus:border-[var(--accent-gold)]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-light)] mb-2">
                    Adelanto (€)
                  </label>
                  <input
                    type="number"
                    value={formData.advance_amount}
                    onChange={(e) => setFormData({ ...formData, advance_amount: e.target.value })}
                    min="0"
                    className="w-full bg-[var(--bg-dark)] border border-[var(--accent-gold)]/30 
                      rounded-lg px-4 py-3 text-[var(--text-light)]
                      focus:outline-none focus:border-[var(--accent-gold)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-light)] mb-2">
                    Estado
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[var(--bg-dark)] border border-[var(--accent-gold)]/30 
                      rounded-lg px-4 py-3 text-[var(--text-light)]
                      focus:outline-none focus:border-[var(--accent-gold)]"
                    required
                  >
                    <option value="active">Activo</option>
                    <option value="pending">Pendiente</option>
                    <option value="expired">Expirado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-light)] mb-2">
                  Notas
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full bg-[var(--bg-dark)] border border-[var(--accent-gold)]/30 
                    rounded-lg px-4 py-3 text-[var(--text-light)]
                    focus:outline-none focus:border-[var(--accent-gold)] resize-none"
                  placeholder="Información adicional del contrato..."
                />
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
                  {editingContract ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
