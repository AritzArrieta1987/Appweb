import { DollarSign, TrendingUp, Calendar, Sparkles, FileText, X, ArrowUpRight, ArrowDownRight, Download, Wallet, CreditCard, Building2, User } from 'lucide-react';

interface RoyaltiesSectionProps {
  totalRevenue: number;
  paymentRequests: Array<{
    id: number;
    amount: number;
    status: 'pending' | 'completed';
    date: string;
    method: string;
    accountNumber?: string;
    firstName?: string;
    lastName?: string;
  }>;
  showPaymentRequestModal: boolean;
  setShowPaymentRequestModal: (show: boolean) => void;
  paymentAmount: string;
  setPaymentAmount: (amount: string) => void;
  accountNumber: string;
  setAccountNumber: (account: string) => void;
  firstName: string;
  setFirstName: (name: string) => void;
  lastName: string;
  setLastName: (name: string) => void;
  onSubmitPayment: () => void;
}

export default function RoyaltiesSection({
  totalRevenue,
  paymentRequests,
  showPaymentRequestModal,
  setShowPaymentRequestModal,
  paymentAmount,
  setPaymentAmount,
  accountNumber,
  setAccountNumber,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  onSubmitPayment
}: RoyaltiesSectionProps) {
  const formatEuro = (amount: number): string => {
    return amount.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' €';
  };

  const availableBalance = totalRevenue - paymentRequests.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.amount, 0);
  const pendingAmount = paymentRequests.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header compacto */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ 
          fontSize: '22px', 
          fontWeight: '700', 
          marginBottom: '4px', 
          color: '#ffffff',
          letterSpacing: '-0.01em'
        }}>
          Royalties
        </h1>
        <p style={{ 
          fontSize: '12px', 
          color: '#8b9299', 
          margin: 0
        }}>
          Gestiona tus ingresos musicales
        </p>
      </div>
      
      {/* Card Principal compacto */}
      <div style={{
        background: 'rgba(42, 63, 63, 0.6)',
        backdropFilter: 'blur(20px)',
        borderRadius: '14px',
        padding: '20px',
        marginBottom: '16px',
        border: '1px solid rgba(201, 165, 116, 0.3)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
      }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ 
              fontSize: '10px', 
              color: '#8b9299', 
              marginBottom: '6px', 
              textTransform: 'uppercase', 
              letterSpacing: '1px', 
              fontWeight: '600' 
            }}>
              Saldo disponible
            </div>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: '#ffffff', 
              lineHeight: '1', 
              letterSpacing: '-0.02em',
              marginBottom: '4px'
            }}>
              {formatEuro(availableBalance)}
            </div>
            <div style={{
              fontSize: '11px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Listo para solicitar
            </div>
          </div>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'rgba(201, 165, 116, 0.15)',
            border: '1px solid rgba(201, 165, 116, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <DollarSign size={22} color="#c9a574" strokeWidth={2.5} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowPaymentRequestModal(true)}
            disabled={availableBalance <= 0}
            style={{
              flex: 1,
              padding: '10px 16px',
              background: availableBalance > 0 ? 'linear-gradient(135deg, #c9a574 0%, #d4b384 100%)' : 'rgba(201, 165, 116, 0.2)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '700',
              cursor: availableBalance > 0 ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              opacity: availableBalance > 0 ? 1 : 0.5
            }}
            onMouseEnter={(e) => {
              if (availableBalance > 0) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #d4b384 0%, #c9a574 100%)';
              }
            }}
            onMouseLeave={(e) => {
              if (availableBalance > 0) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #c9a574 0%, #d4b384 100%)';
              }
            }}
          >
            <ArrowUpRight size={14} strokeWidth={2.5} />
            Solicitar pago
          </button>
          <button
            style={{
              padding: '10px 14px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              color: '#8b9299',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = '#8b9299';
            }}
          >
            <Download size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Stats Grid compacto */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '10px', 
        marginBottom: '16px' 
      }}>
        {/* Total Generado */}
        <div style={{
          background: 'rgba(42, 63, 63, 0.4)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(201, 165, 116, 0.2)',
          borderRadius: '10px',
          padding: '12px 14px',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
        }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ fontSize: '9px', color: '#8b9299', fontWeight: '600', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              Total generado
            </div>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'rgba(201, 165, 116, 0.15)',
              border: '1px solid rgba(201, 165, 116, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={12} color="#c9a574" strokeWidth={2.5} />
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.01em' }}>
            {formatEuro(totalRevenue)}
          </div>
          <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px', fontWeight: '500' }}>
            Ingresos acumulados
          </div>
        </div>

        {/* Pendiente */}
        <div style={{
          background: 'rgba(42, 63, 63, 0.4)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(201, 165, 116, 0.2)',
          borderRadius: '10px',
          padding: '12px 14px',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.2)';
        }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ fontSize: '9px', color: '#8b9299', fontWeight: '600', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              En proceso
            </div>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'rgba(201, 165, 116, 0.15)',
              border: '1px solid rgba(201, 165, 116, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calendar size={12} color="#c9a574" strokeWidth={2.5} />
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.01em' }}>
            {formatEuro(pendingAmount)}
          </div>
          <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px', fontWeight: '500' }}>
            Pagos pendientes
          </div>
        </div>
      </div>

      {/* Historial compacto */}
      <div style={{
        background: 'rgba(42, 63, 63, 0.4)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(201, 165, 116, 0.2)',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '12px 14px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'rgba(201, 165, 116, 0.15)',
              border: '1px solid rgba(201, 165, 116, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CreditCard size={12} color="#c9a574" strokeWidth={2.5} />
            </div>
            <h2 style={{ 
              fontSize: '13px', 
              fontWeight: '700', 
              color: '#ffffff', 
              margin: 0
            }}>
              Historial de Pagos
            </h2>
            {paymentRequests.filter(r => r.status === 'completed').length > 0 && (
              <span style={{
                fontSize: '9px',
                fontWeight: '700',
                color: '#c9a574',
                background: 'rgba(201, 165, 116, 0.15)',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid rgba(201, 165, 116, 0.3)'
              }}>
                {paymentRequests.filter(r => r.status === 'completed').length} completados
              </span>
            )}
          </div>
          {paymentRequests.length > 0 && (
            <button style={{
              padding: '4px 8px',
              background: 'rgba(201, 165, 116, 0.1)',
              border: '1px solid rgba(201, 165, 116, 0.25)',
              borderRadius: '5px',
              fontSize: '9px',
              fontWeight: '600',
              color: '#c9a574',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
            }}
            >
              <Download size={10} strokeWidth={2.5} />
              Exportar
            </button>
          )}
        </div>
        
        {paymentRequests.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '32px 16px', 
            color: '#6b7280'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              margin: '0 auto 10px',
              borderRadius: '10px',
              background: 'rgba(201, 165, 116, 0.1)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={18} color="#c9a574" strokeWidth={2} />
            </div>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#ffffff', margin: '0 0 3px 0' }}>
              Sin movimientos
            </p>
            <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>
              Tus pagos aparecerán aquí
            </p>
          </div>
        ) : (
          <div>
            {paymentRequests.map((request, index) => {
              // Verificar si el pago fue completado recientemente (últimas 24 horas)
              const isRecentlyCompleted = request.status === 'completed' && 
                new Date().getTime() - new Date(request.date).getTime() < 24 * 60 * 60 * 1000;
              
              return (
              <div
                key={request.id}
                style={{
                  padding: '10px 14px',
                  borderBottom: index < paymentRequests.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  background: isRecentlyCompleted ? 'rgba(201, 165, 116, 0.08)' : 'transparent',
                  borderLeft: isRecentlyCompleted ? '3px solid #c9a574' : '3px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isRecentlyCompleted ? 'rgba(201, 165, 116, 0.08)' : 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: request.status === 'completed' 
                      ? 'rgba(201, 165, 116, 0.15)' 
                      : 'rgba(201, 165, 116, 0.1)',
                    border: '1px solid rgba(201, 165, 116, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {request.status === 'completed' ? (
                      <ArrowDownRight size={14} color="#c9a574" strokeWidth={2.5} />
                    ) : (
                      <Calendar size={14} color="#c9a574" strokeWidth={2.5} />
                    )}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: '#ffffff', 
                      marginBottom: '2px'
                    }}>
                      {request.status === 'completed' ? 'Pago completado' : 'Pago en proceso'}
                    </div>
                    <div style={{ 
                      fontSize: '10px', 
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontWeight: '500'
                    }}>
                      <span>{request.method}</span>
                      <span style={{ width: '2px', height: '2px', borderRadius: '50%', background: '#6b7280' }} />
                      <span>
                        {new Date(request.date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: '700', 
                      color: request.status === 'completed' ? '#c9a574' : '#ffffff',
                      marginBottom: '2px'
                    }}>
                      {request.status === 'completed' ? '-' : ''}{formatEuro(request.amount)}
                    </div>
                    <div style={{
                      display: 'inline-block',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontSize: '8px',
                      fontWeight: '600',
                      color: request.status === 'completed' ? '#c9a574' : '#8b9299',
                      background: request.status === 'completed' 
                        ? 'rgba(201, 165, 116, 0.15)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid ' + (request.status === 'completed'
                        ? 'rgba(201, 165, 116, 0.3)'
                        : 'rgba(255, 255, 255, 0.1)'),
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px'
                    }}>
                      {request.status === 'completed' ? 'OK' : 'Pendiente'}
                    </div>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showPaymentRequestModal && (
        <>
          <style>
            {`
              @keyframes modalSlide {
                from {
                  opacity: 0;
                  transform: scale(0.96) translateY(10px);
                }
                to {
                  opacity: 1;
                  transform: scale(1) translateY(0);
                }
              }
            `}
          </style>
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }} onClick={() => setShowPaymentRequestModal(false)}>
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'rgba(26, 47, 47, 0.95)',
                backdropFilter: 'blur(30px)',
                borderRadius: '20px',
                padding: '0',
                maxWidth: '480px',
                width: '100%',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(201, 165, 116, 0.2)',
                animation: 'modalSlide 0.3s ease'
              }}
            >
              {/* Header */}
              <div style={{ 
                padding: '24px 24px 20px 24px', 
                borderBottom: '1px solid rgba(201, 165, 116, 0.15)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(201, 165, 116, 0.15)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Sparkles size={20} color="#c9a574" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', margin: 0, marginBottom: '2px' }}>
                      Solicitar pago
                    </h2>
                    <p style={{ fontSize: '11px', color: '#8b9299', margin: 0 }}>
                      Retira tus ganancias
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPaymentRequestModal(false)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '9px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#8b9299',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#8b9299';
                  }}
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* Contenido */}
              <div style={{ padding: '24px' }}>
                {/* Saldo */}
                <div style={{
                  background: 'rgba(201, 165, 116, 0.15)',
                  border: '1px solid rgba(201, 165, 116, 0.3)',
                  borderRadius: '14px',
                  padding: '20px',
                  marginBottom: '20px'
                }}>
                  <div style={{ fontSize: '10px', color: '#8b9299', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>
                    Saldo disponible
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: '700', color: '#c9a574', letterSpacing: '-0.02em' }}>
                    {formatEuro(availableBalance)}
                  </div>
                </div>

                {/* Cantidad */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '8px'
                  }}>
                    Cantidad a solicitar
                  </label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="0.00"
                    max={availableBalance}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '16px',
                      fontFamily: 'inherit',
                      fontWeight: '600',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.6)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                  />
                  <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '6px', fontWeight: '500' }}>
                    Máximo: {formatEuro(availableBalance)}
                  </div>
                </div>

                {/* Nombre y Apellido */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '8px'
                    }}>
                      <User size={14} color="#c9a574" strokeWidth={2.5} />
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="José"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        fontWeight: '600',
                        outline: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.6)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '8px'
                    }}>
                      <User size={14} color="#c9a574" strokeWidth={2.5} />
                      Apellidos
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Álvarez García"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        fontWeight: '600',
                        outline: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.6)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      }}
                    />
                  </div>
                </div>

                {/* Número de Cuenta */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '8px'
                  }}>
                    <Building2 size={14} color="#c9a574" strokeWidth={2.5} />
                    Número de cuenta (IBAN)
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="ES91 2100 0418 4502 0005 1332"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      fontWeight: '600',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.6)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                  />
                  <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '6px', fontWeight: '500' }}>
                    Introduce tu IBAN para recibir la transferencia
                  </div>
                </div>

                {/* Botones */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setShowPaymentRequestModal(false)}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: '#8b9299',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.color = '#8b9299';
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={onSubmitPayment}
                    disabled={!paymentAmount || parseFloat(paymentAmount) <= 0 || parseFloat(paymentAmount) > availableBalance || !accountNumber.trim() || !firstName.trim() || !lastName.trim()}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: (!paymentAmount || parseFloat(paymentAmount) <= 0 || parseFloat(paymentAmount) > availableBalance || !accountNumber.trim() || !firstName.trim() || !lastName.trim())
                        ? 'rgba(201, 165, 116, 0.2)'
                        : 'linear-gradient(135deg, #c9a574 0%, #d4b384 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: (!paymentAmount || parseFloat(paymentAmount) <= 0 || parseFloat(paymentAmount) > availableBalance || !accountNumber.trim() || !firstName.trim() || !lastName.trim())
                        ? 'not-allowed'
                        : 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: (!paymentAmount || parseFloat(paymentAmount) <= 0 || parseFloat(paymentAmount) > availableBalance || !accountNumber.trim() || !firstName.trim() || !lastName.trim()) ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (paymentAmount && parseFloat(paymentAmount) > 0 && parseFloat(paymentAmount) <= availableBalance && accountNumber.trim() && firstName.trim() && lastName.trim()) {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #d4b384 0%, #c9a574 100%)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (paymentAmount && parseFloat(paymentAmount) > 0 && parseFloat(paymentAmount) <= availableBalance && accountNumber.trim() && firstName.trim() && lastName.trim()) {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #c9a574 0%, #d4b384 100%)';
                      }
                    }}
                  >
                    Enviar solicitud
                  </button>
                </div>

                {/* Info */}
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  background: 'rgba(201, 165, 116, 0.05)',
                  border: '1px solid rgba(201, 165, 116, 0.15)',
                  borderRadius: '8px',
                  fontSize: '10px',
                  color: '#8b9299',
                  lineHeight: '1.5'
                }}>
                  Las transferencias bancarias se procesan en <strong style={{ color: '#c9a574' }}>3-5 días hábiles</strong>. El pago se realizará al IBAN proporcionado.
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
