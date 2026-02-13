import { X, FileSignature, User, FileText, Percent, DollarSign, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

interface NewContractModalProps {
  show: boolean;
  onClose: () => void;
  newContract: {
    artistId: string;
    percentage: number;
    startDate: string;
    endDate: string;
    serviceType: string;
    amount: number;
  };
  setNewContract: (contract: any) => void;
  artists: any[];
  contracts: any[];
  onSave: () => void;
}

export function NewContractModal({
  show,
  onClose,
  newContract,
  setNewContract,
  artists,
  contracts,
  onSave
}: NewContractModalProps) {
  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #2a3f3f 0%, #1a2a2a 100%)',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '88vh',
          overflowY: 'auto',
          position: 'relative',
          border: '1px solid rgba(201, 165, 116, 0.25)',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.8)',
          animation: 'slideUp 0.3s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 20px',
            borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
            background: 'linear-gradient(180deg, rgba(201, 165, 116, 0.08), transparent)'
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(220, 53, 69, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(220, 53, 69, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            <X size={16} color="#c9a574" strokeWidth={2.5} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background:
                  'linear-gradient(135deg, rgba(201, 165, 116, 0.2), rgba(201, 165, 116, 0.08))',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <FileSignature size={20} color="#c9a574" strokeWidth={2.5} />
            </div>

            <div>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '2px',
                  letterSpacing: '-0.3px'
                }}
              >
                {newContract.artistId &&
                artists.find((a) => a.id === parseInt(newContract.artistId))
                  ? `Nuevo Contrato • ${
                      artists.find((a) => a.id === parseInt(newContract.artistId))?.name
                    }`
                  : 'Nuevo Contrato'}
              </h2>
              <p
                style={{
                  fontSize: '12px',
                  color: 'rgba(201, 165, 116, 0.6)',
                  margin: 0,
                  fontWeight: '500'
                }}
              >
                {newContract.artistId &&
                contracts.filter((c) => c.artistId === parseInt(newContract.artistId)).length > 0
                  ? `${
                      contracts.filter((c) => c.artistId === parseInt(newContract.artistId)).length
                    } contrato(s) existente(s)`
                  : 'Completa los campos requeridos'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Artist Selection */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#c9a574',
                  marginBottom: '10px'
                }}
              >
                <User size={14} strokeWidth={2.5} />
                Artista
                <span
                  style={{
                    fontSize: '9px',
                    padding: '2px 6px',
                    background: 'rgba(220, 53, 69, 0.15)',
                    color: '#ef4444',
                    borderRadius: '4px',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}
                >
                  Requerido
                </span>
              </label>
              <select
                value={newContract.artistId}
                onChange={(e) => setNewContract({ ...newContract, artistId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: '#0d1117',
                  border: `1.5px solid ${
                    newContract.artistId ? '#c9a574' : 'rgba(201, 165, 116, 0.2)'
                  }`,
                  color: newContract.artistId ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                  fontSize: '13px',
                  fontWeight: '600',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#c9a574';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201, 165, 116, 0.08)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = newContract.artistId
                    ? '#c9a574'
                    : 'rgba(201, 165, 116, 0.2)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="">Seleccionar artista</option>
                {artists.map((artist) => {
                  const artistContractCount = contracts.filter((c) => c.artistId === artist.id)
                    .length;
                  return (
                    <option key={artist.id} value={artist.id}>
                      {artist.name} {artistContractCount > 0 ? `(${artistContractCount})` : ''}
                    </option>
                  );
                })}
              </select>

              {/* Existing Contracts Info */}
              {newContract.artistId &&
                contracts.filter((c) => c.artistId === parseInt(newContract.artistId)).length >
                  0 && (
                  <div
                    style={{
                      marginTop: '8px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      background: 'rgba(201, 165, 116, 0.06)',
                      border: '1px solid rgba(201, 165, 116, 0.12)'
                    }}
                  >
                    <p
                      style={{
                        fontSize: '10px',
                        color: '#c9a574',
                        fontWeight: '600',
                        marginBottom: '4px'
                      }}
                    >
                      Contratos existentes:
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {contracts
                        .filter((c) => c.artistId === parseInt(newContract.artistId))
                        .map((c) => (
                          <div
                            key={c.id}
                            style={{
                              fontSize: '9px',
                              padding: '3px 6px',
                              borderRadius: '4px',
                              background: 'rgba(201, 165, 116, 0.1)',
                              color: '#c9a574',
                              border: '1px solid rgba(201, 165, 116, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                          >
                            {c.serviceType} ({c.percentage}%)
                          </div>
                        ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Service Type */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#c9a574',
                  marginBottom: '10px'
                }}
              >
                <FileText size={14} strokeWidth={2.5} />
                Tipo de Contrato
                <span
                  style={{
                    fontSize: '9px',
                    padding: '2px 6px',
                    background: 'rgba(220, 53, 69, 0.15)',
                    color: '#ef4444',
                    borderRadius: '4px',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}
                >
                  Requerido
                </span>
              </label>
              <select
                value={newContract.serviceType}
                onChange={(e) => {
                  const selectedType = e.target.value;
                  let suggestedPercentage = 70;
                  switch (selectedType) {
                    case 'Distribución':
                      suggestedPercentage = 70;
                      break;
                    case 'Editorial':
                      suggestedPercentage = 50;
                      break;
                    case 'Management':
                      suggestedPercentage = 20;
                      break;
                    case 'Sello Discográfico':
                      suggestedPercentage = 60;
                      break;
                    case 'Conciertos':
                      suggestedPercentage = 80;
                      break;
                    default:
                      suggestedPercentage = 70;
                  }
                  setNewContract({ ...newContract, serviceType: selectedType, percentage: suggestedPercentage });
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: '#0d1117',
                  border: `1.5px solid ${
                    newContract.serviceType ? '#c9a574' : 'rgba(201, 165, 116, 0.2)'
                  }`,
                  color: newContract.serviceType ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                  fontSize: '13px',
                  fontWeight: '600',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#c9a574';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201, 165, 116, 0.08)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = newContract.serviceType
                    ? '#c9a574'
                    : 'rgba(201, 165, 116, 0.2)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="">Seleccionar tipo</option>
                <option value="Distribución">📀 Distribución</option>
                <option value="Editorial">📝 Editorial</option>
                <option value="Management">👔 Management</option>
                <option value="Sello Discográfico">🎵 Sello Discográfico</option>
                <option value="Conciertos">🎤 Conciertos</option>
                <option value="Trabajo">💼 Trabajo (cantidad fija)</option>
              </select>
            </div>

            {/* Percentage or Amount */}
            <div>
              {newContract.serviceType === 'Trabajo' ? (
                <>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#c9a574',
                      marginBottom: '10px'
                    }}
                  >
                    Cantidad (€)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newContract.amount}
                      onChange={(e) => {
                        const value = Math.max(0, parseFloat(e.target.value) || 0);
                        setNewContract({ ...newContract, amount: value });
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 40px 10px 12px',
                        borderRadius: '8px',
                        background: '#0d1117',
                        border: '1.5px solid rgba(201, 165, 116, 0.2)',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: '600',
                        outline: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#c9a574';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
                      }}
                    />
                    <DollarSign
                      size={16}
                      color="#c9a574"
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none'
                      }}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: '10px',
                      background: 'rgba(201, 165, 116, 0.08)',
                      borderRadius: '8px',
                      padding: '10px',
                      border: '1px solid rgba(201, 165, 116, 0.15)',
                      textAlign: 'center'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.5)',
                        display: 'block',
                        marginBottom: '4px'
                      }}
                    >
                      Importe a cobrar
                    </span>
                    <span style={{ fontSize: '24px', fontWeight: '700', color: '#c9a574' }}>
                      €{newContract.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px'
                    }}
                  >
                    <label
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#c9a574',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <Percent size={13} strokeWidth={2.5} />
                      Porcentaje del Artista
                    </label>
                    <span
                      style={{
                        fontSize: '10px',
                        color: 'rgba(201, 165, 116, 0.7)',
                        fontWeight: '600',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(201, 165, 116, 0.08)',
                        border: '1px solid rgba(201, 165, 116, 0.15)'
                      }}
                    >
                      {(() => {
                        switch (newContract.serviceType) {
                          case 'Distribución':
                            return 'Típico: 70%';
                          case 'Editorial':
                            return 'Típico: 50%';
                          case 'Management':
                            return 'Típico: 20%';
                          case 'Sello Discográfico':
                            return 'Típico: 60%';
                          case 'Conciertos':
                            return 'Típico: 80%';
                          default:
                            return 'Configurable';
                        }
                      })()}
                    </span>
                  </div>

                  {/* Quick Percentage Buttons */}
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                    {(() => {
                      let quickPercentages = [50, 60, 70, 80, 90];
                      switch (newContract.serviceType) {
                        case 'Distribución':
                          quickPercentages = [65, 70, 75, 80, 85];
                          break;
                        case 'Editorial':
                          quickPercentages = [40, 50, 60, 70, 75];
                          break;
                        case 'Management':
                          quickPercentages = [10, 15, 20, 25, 30];
                          break;
                        case 'Sello Discográfico':
                          quickPercentages = [50, 60, 70, 75, 80];
                          break;
                        case 'Conciertos':
                          quickPercentages = [70, 75, 80, 85, 90];
                          break;
                      }
                      return quickPercentages;
                    })().map((percent) => (
                      <button
                        key={percent}
                        type="button"
                        onClick={() => setNewContract({ ...newContract, percentage: percent })}
                        style={{
                          flex: 1,
                          padding: '8px',
                          borderRadius: '6px',
                          background:
                            newContract.percentage === percent
                              ? 'linear-gradient(135deg, #c9a574, #d4b684)'
                              : 'rgba(42, 63, 63, 0.3)',
                          border:
                            newContract.percentage === percent
                              ? '1.5px solid #c9a574'
                              : '1.5px solid rgba(201, 165, 116, 0.15)',
                          color:
                            newContract.percentage === percent ? '#0d1117' : 'rgba(255, 255, 255, 0.7)',
                          fontSize: '12px',
                          fontWeight: newContract.percentage === percent ? '700' : '600',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (newContract.percentage !== percent) {
                            e.currentTarget.style.background = 'rgba(42, 63, 63, 0.5)';
                            e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (newContract.percentage !== percent) {
                            e.currentTarget.style.background = 'rgba(42, 63, 63, 0.3)';
                            e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.15)';
                          }
                        }}
                      >
                        {percent}%
                      </button>
                    ))}
                  </div>

                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newContract.percentage}
                      onChange={(e) => {
                        const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                        setNewContract({ ...newContract, percentage: value });
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 40px 10px 12px',
                        borderRadius: '8px',
                        background: '#0d1117',
                        border: '1.5px solid rgba(201, 165, 116, 0.2)',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: '600',
                        outline: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#c9a574';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
                      }}
                    />
                    <Percent
                      size={14}
                      color="#c9a574"
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none'
                      }}
                    />
                  </div>

                  {/* Visual Split */}
                  <div
                    style={{
                      marginTop: '12px',
                      background: 'rgba(201, 165, 116, 0.06)',
                      borderRadius: '8px',
                      padding: '12px',
                      border: '1px solid rgba(201, 165, 116, 0.15)'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: '9px',
                            color: 'rgba(255, 255, 255, 0.4)',
                            display: 'block',
                            marginBottom: '2px',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}
                        >
                          Artista
                        </span>
                        <span style={{ fontSize: '20px', fontWeight: '700', color: '#c9a574' }}>
                          {newContract.percentage}%
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span
                          style={{
                            fontSize: '9px',
                            color: 'rgba(255, 255, 255, 0.4)',
                            display: 'block',
                            marginBottom: '2px',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}
                        >
                          BIGARTIST
                        </span>
                        <span
                          style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            color: 'rgba(201, 165, 116, 0.5)'
                          }}
                        >
                          {100 - newContract.percentage}%
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        height: '8px',
                        background: 'rgba(20, 30, 30, 0.6)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        display: 'flex',
                        border: '1px solid rgba(201, 165, 116, 0.12)'
                      }}
                    >
                      <div
                        style={{
                          width: `${newContract.percentage}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #c9a574, #d4b684)',
                          transition: 'width 0.3s ease'
                        }}
                      />
                      <div
                        style={{
                          width: `${100 - newContract.percentage}%`,
                          height: '100%',
                          background: 'rgba(201, 165, 116, 0.25)',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Dates */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#c9a574',
                  marginBottom: '10px'
                }}
              >
                <Calendar size={14} strokeWidth={2.5} />
                Vigencia
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      fontWeight: '700',
                      color: 'rgba(201, 165, 116, 0.6)',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Inicio
                  </label>
                  <input
                    type="date"
                    value={newContract.startDate}
                    onChange={(e) => setNewContract({ ...newContract, startDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: '#0d1117',
                      border: '1.5px solid rgba(201, 165, 116, 0.2)',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: '600',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#c9a574';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      fontWeight: '700',
                      color: 'rgba(201, 165, 116, 0.6)',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Fin
                  </label>
                  <input
                    type="date"
                    value={newContract.endDate}
                    onChange={(e) => setNewContract({ ...newContract, endDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: '#0d1117',
                      border: '1.5px solid rgba(201, 165, 116, 0.2)',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: '600',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#c9a574';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Summary or Warning */}
            {newContract.artistId && newContract.serviceType ? (
              <div
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(201, 165, 116, 0.08)',
                  border: '1px solid rgba(201, 165, 116, 0.2)'
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    color: '#c9a574',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <CheckCircle size={12} />
                  Resumen
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
                      Artista:
                    </span>
                    <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: '600' }}>
                      {artists.find((a) => a.id === parseInt(newContract.artistId))?.name}
                    </span>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
                      Tipo:
                    </span>
                    <span style={{ fontSize: '12px', color: '#c9a574', fontWeight: '600' }}>
                      {newContract.serviceType}
                    </span>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
                      Porcentaje:
                    </span>
                    <span style={{ fontSize: '13px', color: '#c9a574', fontWeight: '700' }}>
                      {newContract.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(251, 191, 36, 0.08)',
                  border: '1px dashed rgba(251, 191, 36, 0.3)'
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    color: '#fbbf24',
                    fontWeight: '600',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  ⚠️ Completa los campos requeridos
                </div>
                <ul
                  style={{
                    fontSize: '10px',
                    color: '#fbbf24',
                    margin: 0,
                    paddingLeft: '16px',
                    lineHeight: '1.4'
                  }}
                >
                  {!newContract.artistId && <li>Selecciona un artista</li>}
                  {!newContract.serviceType && <li>Selecciona el tipo</li>}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid rgba(201, 165, 116, 0.1)',
            display: 'flex',
            gap: '10px',
            background: 'linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.2))'
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: 'transparent',
              border: '1.5px solid rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!newContract.artistId || !newContract.endDate || !newContract.serviceType}
            style={{
              flex: 1,
              padding: '10px 24px',
              borderRadius: '8px',
              background:
                !newContract.artistId || !newContract.endDate || !newContract.serviceType
                  ? 'rgba(201, 165, 116, 0.12)'
                  : 'linear-gradient(90deg, #c9a574, #d4b684)',
              border: 'none',
              color:
                !newContract.artistId || !newContract.endDate || !newContract.serviceType
                  ? 'rgba(255, 255, 255, 0.3)'
                  : '#0d1117',
              fontSize: '13px',
              fontWeight: '700',
              cursor:
                !newContract.artistId || !newContract.endDate || !newContract.serviceType
                  ? 'not-allowed'
                  : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              opacity:
                !newContract.artistId || !newContract.endDate || !newContract.serviceType ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (newContract.artistId && newContract.endDate && newContract.serviceType) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 165, 116, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (newContract.artistId && newContract.endDate && newContract.serviceType) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            <CheckCircle size={16} strokeWidth={2.5} />
            {!newContract.artistId || !newContract.endDate || !newContract.serviceType
              ? 'Completa los Campos'
              : 'Crear Contrato'}
          </button>
        </div>
      </div>
    </div>
  );
}