import { useState, useEffect, useRef } from 'react';
import { Bell, BarChart3, Music, FileText, DollarSign, LogOut, Disc, CheckCircle, AlertCircle, Info, X, TrendingUp, Calendar, Camera, Upload as UploadIcon, Settings, Wallet, CreditCard, Globe, Clock, Download, Eye, FileSignature } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import logoImage from 'figma:asset/aa0296e2522220bcfcda71f86c708cb2cbc616b9.png';
import backgroundImage from 'figma:asset/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493.png';

interface ArtistPortalProps {
  onLogout: () => void;
  artistData?: {
    id: number;
    name: string;
    email: string;
    photo?: string;
    totalRevenue: number;
    totalStreams: number;
    tracks: any[];
    monthlyData: { month: string; revenue: number; streams: number }[];
    platformBreakdown: { [key: string]: number };
  };
}

export default function ArtistPortal({ onLogout, artistData }: ArtistPortalProps) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', title: 'Nuevo Pago', message: 'Se ha procesado tu pago de royalties', time: 'Hace 2 días', read: false },
    { id: 2, type: 'info', title: 'Reporte Disponible', message: 'Tu reporte mensual está listo', time: 'Hace 1 semana', read: false }
  ]);
  const notificationRef = useRef<HTMLDivElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollYRef = useRef(0);
  const [bannerImage, setBannerImage] = useState<string>(
    artistData?.photo || 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1400&h=300&fit=crop'
  );

  // Estados para el formulario de pago
  const [paymentFormData, setPaymentFormData] = useState({
    firstName: '',
    lastName: '',
    accountHolder: '',
    iban: '',
    amount: ''
  });

  // Datos de ejemplo para historial de pagos
  const [paymentHistory, setPaymentHistory] = useState([
    {
      id: 1,
      date: '15/01/2025',
      amount: 2450.00,
      status: 'Completado',
      method: 'Transferencia Bancaria',
      reference: 'PAY-2025-001'
    },
    {
      id: 2,
      date: '15/12/2024',
      amount: 1875.50,
      status: 'Completado',
      method: 'Transferencia Bancaria',
      reference: 'PAY-2024-012'
    },
    {
      id: 3,
      date: '15/11/2024',
      amount: 3120.75,
      status: 'Completado',
      method: 'Transferencia Bancaria',
      reference: 'PAY-2024-011'
    },
    {
      id: 4,
      date: '15/10/2024',
      amount: 2680.00,
      status: 'Completado',
      method: 'Transferencia Bancaria',
      reference: 'PAY-2024-010'
    }
  ]);

  // Auto-completar titular de cuenta cuando cambian nombre o apellidos
  useEffect(() => {
    if (paymentFormData.firstName || paymentFormData.lastName) {
      const fullName = `${paymentFormData.firstName} ${paymentFormData.lastName}`.trim();
      setPaymentFormData(prev => ({
        ...prev,
        accountHolder: fullName
      }));
    }
  }, [paymentFormData.firstName, paymentFormData.lastName]);

  // Datos de ejemplo para contratos
  const [contracts] = useState([
    {
      id: 1,
      title: 'Contrato de Distribución Digital',
      type: 'Distribución',
      status: 'Activo',
      startDate: '01/01/2024',
      endDate: '31/12/2026',
      royaltyPercentage: 70,
      description: 'Contrato de distribución digital para todas las plataformas de streaming',
      territories: 'Mundial',
      platforms: ['Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music', 'Deezer']
    },
    {
      id: 2,
      title: 'Acuerdo de Royalties',
      type: 'Royalties',
      status: 'Activo',
      startDate: '15/06/2023',
      endDate: '14/06/2025',
      royaltyPercentage: 65,
      description: 'Acuerdo de reparto de royalties por reproducción y ventas digitales',
      territories: 'Europa y América',
      platforms: ['Spotify', 'Apple Music', 'YouTube Music']
    },
    {
      id: 3,
      title: 'Contrato de Sincronización',
      type: 'Sincronización',
      status: 'Pendiente Firma',
      startDate: '01/03/2026',
      endDate: '28/02/2028',
      royaltyPercentage: 50,
      description: 'Licenciamiento de música para uso en películas, series y publicidad',
      territories: 'Mundial',
      platforms: ['Todas las plataformas audiovisuales']
    }
  ]);

  // Estado para contrato seleccionado (modal de detalle)
  const [selectedContract, setSelectedContract] = useState<any>(null);

  // Estado para notificación de éxito de pago
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  // Auto-cerrar notificación después de 4 segundos
  useEffect(() => {
    if (showPaymentSuccess) {
      const timer = setTimeout(() => {
        setShowPaymentSuccess(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showPaymentSuccess]);

  // Actualizar banner cuando cambia la foto del artista
  useEffect(() => {
    if (artistData?.photo) {
      setBannerImage(artistData.photo);
    }
  }, [artistData?.photo]);

  // Función para formatear importes en formato europeo
  const formatEuro = (amount: number): string => {
    return amount.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + '€';
  };

  // Detectar scroll para contraer y ocultar header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 400) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY > 100) {
        setShowHeader(false);
      } else if (currentScrollY < lastScrollYRef.current) {
        setShowHeader(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Cerrar notificaciones al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Función para marcar notificación como leída
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  // Función para eliminar notificación
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // Función para cambiar imagen del banner
  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para manejar carga de CSV
  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setUploadMessage({ type: 'success', text: `Archivo "${file.name}" cargado correctamente. Procesando datos...` });
        setTimeout(() => setUploadMessage(null), 5000);
      } else {
        setUploadMessage({ type: 'error', text: 'Por favor, selecciona un archivo CSV válido.' });
        setTimeout(() => setUploadMessage(null), 5000);
      }
    }
  };

  // Función para abrir selector de archivo CSV
  const triggerCSVUpload = () => {
    csvInputRef.current?.click();
  };

  // Obtener icono según tipo de notificación
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return { icon: CheckCircle, color: '#4ade80' };
      case 'warning':
        return { icon: AlertCircle, color: '#f59e0b' };
      case 'error':
        return { icon: AlertCircle, color: '#ef4444' };
      default:
        return { icon: Info, color: '#60a5fa' };
    }
  };

  const tabs = [
    { name: 'Dashboard', icon: BarChart3 },
    { name: 'Mi Catálogo', icon: Music },
    { name: 'Royalties', icon: DollarSign },
    { name: 'Contratos', icon: FileText },
    { name: 'Configuración', icon: Settings }
  ];

  // Datos de ejemplo (cuando artistData no esté disponible)
  const mockData = {
    id: 1,
    name: 'Artista Demo',
    email: 'artista@bigartist.es',
    totalRevenue: 0,
    totalStreams: 0,
    tracks: [],
    monthlyData: [],
    platformBreakdown: {}
  };

  const data = artistData || mockData;

  // Colores de plataformas
  const platformColors: { [key: string]: string } = {
    'Spotify': '#1DB954',
    'Apple Music': '#FA243C',
    'YouTube': '#FF0000',
    'Amazon Music': '#FF9900',
    'Deezer': '#FEAA2D',
    'Tidal': '#000000',
    'Pandora': '#3668FF'
  };

  // Datos para gráfico de plataformas
  const platformChartData = Object.entries(data.platformBreakdown).map(([name, value]) => ({
    name,
    value,
    color: platformColors[name] || '#c9a574'
  }));

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div>
            {/* Métricas principales - Fila superior con 4 tarjetas */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '32px'
            }}>
              {/* Total Royalties */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '20px',
                padding: '20px',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(201, 165, 116, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <DollarSign size={24} color="#c9a574" />
                  </div>
                  <div style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#6b7280',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    textAlign: 'right'
                  }}>
                    Total Royalties
                  </div>
                </div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#ffffff',
                  letterSpacing: '-0.5px',
                  marginBottom: '8px'
                }}>
                  {formatEuro(data.totalRevenue).split('€')[0]}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#4ade80',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <TrendingUp size={12} />
                  <span>Balance disponible</span>
                </div>
              </div>

              {/* Income */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '20px',
                padding: '20px',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(201, 165, 116, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <TrendingUp size={24} color="#c9a574" />
                  </div>
                  <div style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#6b7280',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    textAlign: 'right'
                  }}>
                    Total Income
                  </div>
                </div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#ffffff',
                  letterSpacing: '-0.5px',
                  marginBottom: '8px'
                }}>
                  {formatEuro(data.totalRevenue).split('€')[0]}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#4ade80',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <TrendingUp size={12} />
                  <span>Este mes</span>
                </div>
              </div>

              {/* Streams */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '20px',
                padding: '20px',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(201, 165, 116, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <BarChart3 size={24} color="#c9a574" />
                  </div>
                  <div style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#6b7280',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    textAlign: 'right'
                  }}>
                    Total Streams
                  </div>
                </div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#ffffff',
                  letterSpacing: '-0.5px',
                  marginBottom: '8px'
                }}>
                  {data.totalStreams.toLocaleString()}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#4ade80',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <TrendingUp size={12} />
                  <span>Reproducciones</span>
                </div>
              </div>

              {/* Canciones */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '20px',
                padding: '20px',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(201, 165, 116, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Music size={24} color="#c9a574" />
                  </div>
                  <div style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#6b7280',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    textAlign: 'right'
                  }}>
                    Total Canciones
                  </div>
                </div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#ffffff',
                  letterSpacing: '-0.5px',
                  marginBottom: '8px'
                }}>
                  {data.tracks.length}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#4ade80',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <TrendingUp size={12} />
                  <span>En catálogo</span>
                </div>
              </div>
            </div>

            {/* Fila de gráficos y datos */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              marginBottom: '32px'
            }}>
              {/* Overview - Gráfico de ingresos mensuales */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <BarChart3 size={20} color="#c9a574" />
                  Overview
                </h2>
                
                {data.monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(201, 165, 116, 0.1)" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#AFB3B7" 
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        stroke="#AFB3B7" 
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => `${value}€`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a2f2f',
                          border: '1px solid rgba(201, 165, 116, 0.3)',
                          borderRadius: '8px',
                          color: '#ffffff'
                        }}
                        formatter={(value: any) => [`${value}€`, 'Ingresos']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#c9a574" 
                        strokeWidth={3}
                        dot={{ fill: '#c9a574', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{
                    height: '250px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <BarChart3 size={48} color="#c9a574" style={{ opacity: 0.3 }} />
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>
                      No hay datos disponibles
                    </p>
                  </div>
                )}
              </div>

              {/* Data Details - Información de cuenta */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <Music size={20} color="#c9a574" />
                  DSP
                </h2>

                {/* Distribución de Plataformas */}
                <div style={{
                    background: 'rgba(201, 165, 116, 0.08)',
                    border: '1px solid rgba(201, 165, 116, 0.2)',
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <div style={{
                      fontSize: '12px',
                      color: '#AFB3B7',
                      marginBottom: '16px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontWeight: '600'
                    }}>
                      Distribución Plataformas
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      {[
                        { name: 'Spotify', streams: '2,946', revenue: '€20,575.55', color: 'rgba(30, 215, 96, 0.15)' },
                        { name: 'Apple Music', streams: '824', revenue: '€14,239.90', color: 'rgba(252, 81, 133, 0.15)' },
                        { name: 'YouTube Music', streams: '431', revenue: '€8,756.10', color: 'rgba(255, 0, 0, 0.15)' }
                      ].map((platform, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '10px',
                            padding: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div>
                            <div style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#ffffff',
                              marginBottom: '3px'
                            }}>
                              {platform.name}
                            </div>
                            <div style={{
                              fontSize: '11px',
                              color: '#6b7280'
                            }}>
                              {platform.streams} streams
                            </div>
                          </div>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '700',
                            color: '#c9a574'
                          }}>
                            {platform.revenue}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
              </div>
            </div>

            {/* Sección de carga de CSV (Prueba) */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <FileText size={20} color="#c9a574" />
                Archivos CSV Cargados
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { 
                    name: 'royalties_enero_2024.csv', 
                    date: '15 Ene 2024', 
                    records: '1,245', 
                    revenue: '€12,450.80',
                    status: 'Procesado'
                  },
                  { 
                    name: 'royalties_febrero_2024.csv', 
                    date: '18 Feb 2024', 
                    records: '1,389', 
                    revenue: '€15,230.50',
                    status: 'Procesado'
                  },
                  { 
                    name: 'royalties_marzo_2024.csv', 
                    date: '12 Mar 2024', 
                    records: '1,567', 
                    revenue: '€18,890.25',
                    status: 'Procesado'
                  }
                ].map((file, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '20px',
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
                      gap: '16px',
                      alignItems: 'center',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                  >
                    {/* Nombre del archivo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: 'rgba(201, 165, 116, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <FileText size={20} color="#c9a574" />
                      </div>
                      <div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#ffffff',
                          marginBottom: '4px'
                        }}>
                          {file.name}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280'
                        }}>
                          Formato: The Orchard
                        </div>
                      </div>
                    </div>

                    {/* Fecha */}
                    <div>
                      <div style={{
                        fontSize: '11px',
                        color: '#AFB3B7',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Fecha
                      </div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#ffffff'
                      }}>
                        {file.date}
                      </div>
                    </div>

                    {/* Registros */}
                    <div>
                      <div style={{
                        fontSize: '11px',
                        color: '#AFB3B7',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Registros
                      </div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#ffffff'
                      }}>
                        {file.records}
                      </div>
                    </div>

                    {/* Ingresos */}
                    <div>
                      <div style={{
                        fontSize: '11px',
                        color: '#AFB3B7',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Ingresos
                      </div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#c9a574'
                      }}>
                        {file.revenue}
                      </div>
                    </div>

                    {/* Estado */}
                    <div>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        background: 'rgba(74, 222, 128, 0.1)',
                        border: '1px solid rgba(74, 222, 128, 0.3)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#4ade80'
                      }}>
                        <CheckCircle size={14} />
                        {file.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'Mi Catálogo':
        return (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
              Mi Catálogo
            </h1>
            
            {data.tracks.length === 0 ? (
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '16px',
                padding: '48px',
                textAlign: 'center'
              }}>
                <Music size={48} color="#c9a574" style={{ margin: '0 auto 16px' }} />
                <p style={{ fontSize: '18px', color: '#AFB3B7', marginBottom: '8px' }}>No hay canciones aún</p>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Tus canciones aparecerán aquí cuando se procesen los datos</p>
              </div>
            ) : (
              <div style={{
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                border: '1px solid rgba(201, 165, 116, 0.2)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {data.tracks.map((track: any, index: number) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '20px',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
                        borderRadius: '12px',
                        border: '1px solid rgba(201, 165, 116, 0.15)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(201, 165, 116, 0.08) 0%, rgba(201, 165, 116, 0.03) 100%)';
                        e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)';
                        e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.15)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {/* Icono de canción */}
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.25) 0%, rgba(201, 165, 116, 0.1) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: '1px solid rgba(201, 165, 116, 0.2)',
                        boxShadow: '0 4px 12px rgba(201, 165, 116, 0.1)'
                      }}>
                        <Disc size={28} color="#c9a574" />
                      </div>

                      {/* Información de la canción */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#ffffff',
                          marginBottom: '6px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {track.title}
                        </div>
                        
                        {/* ISRC Code */}
                        {track.isrc && (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            background: 'rgba(201, 165, 116, 0.1)',
                            border: '1px solid rgba(201, 165, 116, 0.2)',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#c9a574',
                            fontFamily: 'monospace',
                            letterSpacing: '0.5px'
                          }}>
                            <Globe size={12} />
                            {track.isrc}
                          </div>
                        )}
                      </div>

                      {/* Badge de estado */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        background: 'rgba(74, 222, 128, 0.1)',
                        border: '1px solid rgba(74, 222, 128, 0.3)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#4ade80'
                      }}>
                        <CheckCircle size={14} />
                        Activo
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      
      case 'Royalties':
        return (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#ffffff' }}>
              Mis Royalties
            </h1>
            <p style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '32px' }}>
              Gestiona tus pagos y solicita transferencias
            </p>
            
            {/* Grid: Tarjeta y Formulario lado a lado */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '420px 1fr',
              gap: '24px',
              marginBottom: '24px',
              alignItems: 'start'
            }}>
              {/* Tarjeta de Balance Principal - Estilo Banco Premium */}
              <div style={{
                background: 'linear-gradient(135deg, #1a2f2f 0%, #2a3f3f 25%, #1f3838 50%, #2c4848 75%, #1a2f2f 100%)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(201, 165, 116, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                aspectRatio: '1.586',
                border: '1px solid rgba(201, 165, 116, 0.15)'
              }}>
              {/* Patrón de rejilla decorativo */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'linear-gradient(rgba(201, 165, 116, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201, 165, 116, 0.03) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
                opacity: 0.5
              }} />
              
              {/* Círculos decorativos */}
              <div style={{
                position: 'absolute',
                top: '-80px',
                right: '-80px',
                width: '250px',
                height: '250px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(201, 165, 116, 0.15) 0%, transparent 70%)',
                filter: 'blur(50px)'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-60px',
                left: '-60px',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(201, 165, 116, 0.1) 0%, transparent 70%)',
                filter: 'blur(40px)'
              }} />

              {/* Línea decorativa superior */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(201, 165, 116, 0.5) 50%, transparent 100%)'
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Logo y chip */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '32px'
                }}>
                  <div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: 'rgba(201, 165, 116, 0.7)',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      marginBottom: '6px'
                    }}>
                      Cuenta Premium
                    </div>
                    <div style={{
                      fontSize: '17px',
                      fontWeight: '800',
                      background: 'linear-gradient(135deg, #c9a574 0%, #e6c79a 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      letterSpacing: '0.5px'
                    }}>
                      BIGARTIST ROYALTIES
                    </div>
                  </div>
                  
                  {/* Chip de tarjeta */}
                  <div style={{
                    width: '48px',
                    height: '38px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.3) 0%, rgba(201, 165, 116, 0.15) 100%)',
                    border: '1px solid rgba(201, 165, 116, 0.4)',
                    position: 'relative',
                    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      right: '8px',
                      bottom: '8px',
                      border: '1px solid rgba(201, 165, 116, 0.3)',
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>

                {/* Balance disponible */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'rgba(201, 165, 116, 0.7)',
                    marginBottom: '8px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}>
                    Balance Disponible
                  </div>
                  <div style={{
                    fontSize: '42px',
                    fontWeight: '900',
                    background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-1.5px',
                    lineHeight: '1',
                    textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    filter: 'drop-shadow(0 2px 4px rgba(255, 255, 255, 0.1))'
                  }}>
                    {formatEuro(data.totalRevenue)}
                  </div>
                </div>

                {/* Footer: Nombre del titular y logo de red */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end'
                }}>
                  <div>
                    <div style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      color: 'rgba(201, 165, 116, 0.5)',
                      marginBottom: '6px',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase'
                    }}>
                      Titular de la cuenta
                    </div>
                    <div style={{
                      fontSize: '17px',
                      fontWeight: '800',
                      color: '#ffffff',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
                    }}>
                      {data.name}
                    </div>
                  </div>
                  
                  {/* Logo de red de pago (estilo Mastercard/Visa) */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(201, 165, 116, 0.25)',
                      border: '2px solid rgba(201, 165, 116, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <Wallet size={18} color="#c9a574" />
                    </div>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(201, 165, 116, 0.35)',
                      border: '2px solid rgba(201, 165, 116, 0.5)',
                      marginLeft: '-16px',
                      backdropFilter: 'blur(10px)'
                    }} />
                  </div>
                </div>
              </div>
              </div>

              {/* Formulario de Solicitud de Pago */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(42, 63, 63, 0.4) 100%)',
                border: '2px solid rgba(201, 165, 116, 0.3)',
                borderRadius: '20px',
                padding: '32px',
                backdropFilter: 'blur(10px)'
              }}>
                <h2 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <CreditCard size={24} color="#c9a574" />
                  Solicitar Pago
                </h2>
                <p style={{
                  fontSize: '13px',
                  color: '#AFB3B7',
                  marginBottom: '28px'
                }}>
                  Completa tus datos bancarios para recibir el pago
                </p>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  
                  // Generar fecha actual
                  const today = new Date();
                  const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
                  
                  // Generar referencia única
                  const newId = paymentHistory.length > 0 ? Math.max(...paymentHistory.map(p => p.id)) + 1 : 1;
                  const reference = `PAY-${today.getFullYear()}-${newId.toString().padStart(3, '0')}`;
                  
                  // Crear nuevo pago
                  const newPayment = {
                    id: newId,
                    date: formattedDate,
                    amount: parseFloat(paymentFormData.amount),
                    status: 'Pendiente',
                    method: 'Transferencia Bancaria',
                    reference: reference
                  };
                  
                  // Agregar al inicio del historial
                  setPaymentHistory([newPayment, ...paymentHistory]);
                  
                  // Limpiar formulario
                  setPaymentFormData({
                    firstName: '',
                    lastName: '',
                    accountHolder: '',
                    iban: '',
                    amount: ''
                  });
                  
                  // Mostrar notificación de éxito
                  setShowPaymentSuccess(true);
                }}>
                  {/* Grid de campos del formulario */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '20px',
                    marginBottom: '20px'
                  }}>
                    {/* Nombre */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#AFB3B7',
                        marginBottom: '8px'
                      }}>
                        Nombre *
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentFormData.firstName}
                        onChange={(e) => setPaymentFormData({ ...paymentFormData, firstName: e.target.value })}
                        placeholder="Introduce tu nombre"
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(201, 165, 116, 0.3)',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          outline: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#c9a574';
                          e.currentTarget.style.background = 'rgba(201, 165, 116, 0.08)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        }}
                      />
                    </div>

                    {/* Apellidos */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#AFB3B7',
                        marginBottom: '8px'
                      }}>
                        Apellidos *
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentFormData.lastName}
                        onChange={(e) => setPaymentFormData({ ...paymentFormData, lastName: e.target.value })}
                        placeholder="Introduce tus apellidos"
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(201, 165, 116, 0.3)',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          outline: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#c9a574';
                          e.currentTarget.style.background = 'rgba(201, 165, 116, 0.08)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        }}
                      />
                    </div>
                  </div>

                  {/* Titular de la cuenta - Ancho completo */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#AFB3B7',
                      marginBottom: '8px'
                    }}>
                      Titular de la Cuenta *
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentFormData.accountHolder}
                      readOnly
                      placeholder="Se completará automáticamente"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'rgba(201, 165, 116, 0.05)',
                        border: '1px solid rgba(201, 165, 116, 0.3)',
                        borderRadius: '12px',
                        color: '#c9a574',
                        fontSize: '14px',
                        fontWeight: '600',
                        fontFamily: 'inherit',
                        outline: 'none',
                        cursor: 'not-allowed'
                      }}
                    />
                    <div style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      marginTop: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Info size={12} />
                      Este campo se completa automáticamente con tu nombre y apellidos
                    </div>
                  </div>

                  {/* IBAN - Ancho completo */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#AFB3B7',
                      marginBottom: '8px'
                    }}>
                      Número de Cuenta (IBAN) *
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentFormData.iban}
                      onChange={(e) => setPaymentFormData({ ...paymentFormData, iban: e.target.value })}
                      placeholder="ES00 0000 0000 0000 0000 0000"
                      maxLength={34}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(201, 165, 116, 0.3)',
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                        letterSpacing: '1px',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#c9a574';
                        e.currentTarget.style.background = 'rgba(201, 165, 116, 0.08)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      }}
                    />
                    <div style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      marginTop: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Info size={12} />
                      Introduce tu IBAN completo (24 caracteres)
                    </div>
                  </div>

                  {/* Importe y botón */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '20px',
                    alignItems: 'end'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#AFB3B7',
                        marginBottom: '8px'
                      }}>
                        Importe a Solicitar *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          required
                          value={paymentFormData.amount}
                          onChange={(e) => setPaymentFormData({ ...paymentFormData, amount: e.target.value })}
                          min="0"
                          max={data.totalRevenue}
                          step="0.01"
                          placeholder="0.00"
                          style={{
                            width: '100%',
                            padding: '14px 50px 14px 16px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(201, 165, 116, 0.3)',
                            borderRadius: '12px',
                            color: '#ffffff',
                            fontSize: '18px',
                            fontWeight: '600',
                            fontFamily: 'inherit',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#c9a574';
                            e.currentTarget.style.background = 'rgba(201, 165, 116, 0.08)';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          right: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#c9a574'
                        }}>
                          €
                        </div>
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#6b7280',
                        marginTop: '6px'
                      }}>
                        Máximo disponible: <span style={{ color: '#c9a574', fontWeight: '600' }}>{formatEuro(data.totalRevenue)}</span>
                      </div>
                    </div>

                    {/* Botón de envío */}
                    <div>
                      <button
                      type="submit"
                      style={{
                        padding: '16px 40px',
                        background: 'linear-gradient(135deg, #c9a574 0%, #b8956a 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#0D1F23',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 6px 20px rgba(201, 165, 116, 0.4)',
                        height: '54px',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 28px rgba(201, 165, 116, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 165, 116, 0.4)';
                      }}
                    >
                        <DollarSign size={20} />
                        Solicitar Transferencia
                      </button>
                    </div>
                  </div>

                  {/* Info de proceso */}
                  <div style={{
                    background: 'rgba(96, 165, 250, 0.08)',
                    border: '1px solid rgba(96, 165, 250, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    gap: '12px',
                    marginTop: '20px'
                  }}>
                    <Info size={18} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '12px', color: '#AFB3B7', lineHeight: '1.5' }}>
                      Las transferencias se procesan en <span style={{ color: '#60a5fa', fontWeight: '600' }}>2-3 días hábiles</span>. Recibirás una notificación cuando se complete el pago.
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Historial de Pagos - Ancho completo debajo */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Calendar size={20} color="#c9a574" />
                Historial de Pagos
              </h2>

              {/* Tabla de historial */}
              {paymentHistory.length === 0 ? (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '10px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <FileText size={32} color="#c9a574" style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                  <p style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '4px' }}>
                    No hay pagos registrados
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>
                    Tus transferencias aparecerán aquí
                  </p>
                </div>
              ) : (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  {/* Encabezado de la tabla */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr 180px 200px 160px',
                    gap: '16px',
                    padding: '16px 20px',
                    background: 'rgba(201, 165, 116, 0.08)',
                    borderBottom: '1px solid rgba(201, 165, 116, 0.15)'
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Fecha
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Referencia
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Método
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>
                      Importe
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#c9a574', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>
                      Estado
                    </div>
                  </div>

                  {/* Filas de pagos */}
                  {paymentHistory.map((payment) => (
                    <div
                      key={payment.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '140px 1fr 180px 200px 160px',
                        gap: '16px',
                        padding: '18px 20px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(201, 165, 116, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: '500' }}>
                        {payment.date}
                      </div>
                      <div style={{ fontSize: '13px', color: '#AFB3B7', fontFamily: 'monospace', fontWeight: '600' }}>
                        {payment.reference}
                      </div>
                      <div style={{ fontSize: '13px', color: '#AFB3B7' }}>
                        {payment.method}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#c9a574', textAlign: 'right' }}>
                        {formatEuro(payment.amount)}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          background: payment.status === 'Pendiente' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(74, 222, 128, 0.1)',
                          border: payment.status === 'Pendiente' ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(74, 222, 128, 0.3)',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: payment.status === 'Pendiente' ? '#fbbf24' : '#4ade80'
                        }}>
                          {payment.status === 'Pendiente' ? <Clock size={14} /> : <CheckCircle size={14} />}
                          {payment.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      
      case 'Configuración':
        return (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#ffffff' }}>
              Configuración
            </h1>
            <p style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '32px' }}>
              Gestiona tu cuenta y preferencias
            </p>

            {/* Sección: Cambiar Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(42, 63, 63, 0.4) 100%)',
              border: '2px solid rgba(201, 165, 116, 0.3)',
              borderRadius: '20px',
              padding: '28px',
              backdropFilter: 'blur(10px)',
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Camera size={24} color="#c9a574" />
                Banner del Perfil
              </h2>
              <p style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '20px' }}>
                Personaliza la imagen de banner de tu portal
              </p>
              
              <div style={{
                width: '100%',
                height: '180px',
                borderRadius: '12px',
                backgroundImage: `url(${bannerImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                marginBottom: '16px',
                border: '2px solid rgba(201, 165, 116, 0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}>
                  <UploadIcon size={32} color="#ffffff" />
                </div>
              </div>
              
              <button
                onClick={() => bannerInputRef.current?.click()}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #c9a574 0%, #b8956a 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#0D1F23',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(201, 165, 116, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 165, 116, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(201, 165, 116, 0.3)';
                }}
              >
                <Camera size={18} />
                Cambiar Banner
              </button>

              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                style={{ display: 'none' }}
              />
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(42, 63, 63, 0.4) 100%)',
              border: '2px solid rgba(201, 165, 116, 0.3)',
              borderRadius: '20px',
              padding: '28px',
              backdropFilter: 'blur(10px)',
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Settings size={24} color="#c9a574" />
                Información del Perfil
              </h2>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#AFB3B7', marginBottom: '8px' }}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={data.name}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(201, 165, 116, 0.2)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#AFB3B7', marginBottom: '8px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={data.email}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(201, 165, 116, 0.2)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'Contratos':
        return (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#ffffff' }}>
              Mis Contratos
            </h1>
            <p style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '32px' }}>
              Gestiona tus acuerdos y contratos con BIGARTIST ROYALTIES
            </p>

            {/* Grid de Contratos */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: '24px',
              marginBottom: '32px'
            }}>
              {contracts.map((contract) => (
                <div
                  key={contract.id}
                  style={{
                    background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                    border: contract.status === 'Activo' ? '2px solid rgba(201, 165, 116, 0.4)' : '1px solid rgba(201, 165, 116, 0.2)',
                    borderRadius: '16px',
                    padding: '24px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(201, 165, 116, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => setSelectedContract(contract)}
                >
                  {/* Header del contrato */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#ffffff',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <FileSignature size={20} color="#c9a574" />
                        {contract.title}
                      </h3>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        background: contract.status === 'Activo' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                        border: contract.status === 'Activo' ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid rgba(251, 191, 36, 0.3)',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: contract.status === 'Activo' ? '#4ade80' : '#fbbf24',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {contract.status === 'Activo' ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {contract.status}
                      </div>
                    </div>
                  </div>

                  {/* Descripción */}
                  <p style={{
                    fontSize: '13px',
                    color: '#AFB3B7',
                    lineHeight: '1.6',
                    marginBottom: '20px'
                  }}>
                    {contract.description}
                  </p>

                  {/* Información clave */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    marginBottom: '20px',
                    padding: '16px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '12px',
                    border: '1px solid rgba(201, 165, 116, 0.1)'
                  }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#AFB3B7', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Tipo
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                        {contract.type}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#AFB3B7', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Royalty
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#c9a574' }}>
                        {contract.royaltyPercentage}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#AFB3B7', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Inicio
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>
                        {contract.startDate}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#AFB3B7', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Fin
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>
                        {contract.endDate}
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div style={{
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedContract(contract);
                      }}
                      style={{
                        flex: 1,
                        background: 'rgba(201, 165, 116, 0.1)',
                        border: '1px solid rgba(201, 165, 116, 0.3)',
                        borderRadius: '10px',
                        padding: '10px 16px',
                        color: '#c9a574',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <Eye size={16} />
                      Ver Detalles
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Descargando contrato...');
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #c9a574 0%, #b8956a 100%)',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '10px 16px',
                        color: '#1a1a1a',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 165, 116, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 165, 116, 0.3)';
                      }}
                    >
                      <Download size={16} />
                      PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Información adicional */}
            <div style={{
              background: 'rgba(96, 165, 250, 0.08)',
              border: '1px solid rgba(96, 165, 250, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              gap: '12px'
            }}>
              <Info size={20} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '13px', color: '#AFB3B7', lineHeight: '1.6' }}>
                <strong style={{ color: '#60a5fa' }}>Información importante:</strong> Todos los contratos son legalmente vinculantes. 
                Si tienes dudas sobre alguna cláusula o necesitas realizar modificaciones, contacta con tu gestor en 
                <span style={{ color: '#c9a574', fontWeight: '600' }}> contacto@bigartist.es</span>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
              {activeTab}
            </h1>
            <div style={{
              background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '16px', color: '#AFB3B7' }}>Sección en construcción</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* IMAGEN DE FONDO GLOBAL */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        opacity: 0.25,
        filter: 'blur(0px)',
        zIndex: 0
      }} />

      {/* OVERLAY VERDE GLOBAL */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
        backdropFilter: 'blur(2px)',
        opacity: 0.75,
        zIndex: 0
      }} />

      {/* CAPA DE TINTE VERDE GLOBAL */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 32, 39, 0.3)',
        mixBlendMode: 'multiply' as const,
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Banner con menú integrado */}
        <div style={{
          position: 'relative',
          height: '570px',
          overflow: 'hidden'
        }}>
          {/* Banner Image Background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${bannerImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
            {/* Overlays del Banner */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(15, 32, 39, 0.5) 0%, rgba(32, 58, 67, 0.45) 50%, rgba(44, 83, 100, 0.4) 100%)'
            }} />
            
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 32, 39, 0.25)',
              mixBlendMode: 'multiply' as const
            }} />
            
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(15, 32, 39, 0.7) 0%, rgba(15, 32, 39, 0.4) 15%, transparent 35%, rgba(15, 32, 39, 0.05) 50%, rgba(15, 32, 39, 0.1) 65%, rgba(15, 32, 39, 0.2) 75%, rgba(15, 32, 39, 0.35) 85%, rgba(15, 32, 39, 0.5) 93%, rgba(15, 32, 39, 0.65) 98%, rgba(15, 32, 39, 0.75) 100%)'
            }} />
            
            {/* Degradado suave hacia el fondo (30px) */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '30px',
              background: 'linear-gradient(180deg, transparent 0%, rgba(15, 32, 39, 0.9) 100%)',
              pointerEvents: 'none'
            }} />
          </div>

          {/* Menú superior integrado en el banner */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            padding: '12px 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
            background: 'linear-gradient(180deg, rgba(15, 32, 39, 0.7) 0%, rgba(15, 32, 39, 0.3) 70%, transparent 100%)',
            borderBottom: '1px solid rgba(201, 165, 116, 0.1)'
          }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <img 
                src={logoImage}
                alt="BIGARTIST"
                style={{
                  height: '40px',
                  transition: 'all 0.4s ease'
                }}
              />
            </div>

            {/* Tabs del menú */}
            <div style={{ display: 'flex', gap: '8px', flex: 1, justifyContent: 'center' }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.name;
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '10px',
                      background: 'rgba(0, 0, 0, 0)',
                      color: isActive ? '#c9a574' : 'rgba(255, 255, 255, 0.6)',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'color 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#c9a574';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                      }
                    }}
                  >
                    <Icon size={18} />
                    {tab.name}
                  </button>
                );
              })}
            </div>

            {/* Notificaciones y Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
              <div style={{ position: 'relative' }} ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: showNotifications 
                      ? 'rgba(201, 165, 116, 0.2)' 
                      : 'rgba(42, 63, 63, 0.4)',
                    border: `1px solid ${showNotifications ? 'rgba(201, 165, 116, 0.4)' : 'rgba(201, 165, 116, 0.2)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                >
                  <Bell size={20} color="#c9a574" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#ef4444',
                      border: '2px solid #1a2332',
                      animation: 'pulse 2s ease-in-out infinite'
                    }} />
                  )}
                </button>

                {/* Notification Panel */}
                {showNotifications && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 12px)',
                    right: 0,
                    width: '380px',
                    maxHeight: '500px',
                    background: 'linear-gradient(135deg, rgba(20, 35, 35, 0.98) 0%, rgba(15, 30, 30, 0.98) 100%)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(20px)',
                    overflow: 'hidden',
                    zIndex: 1000
                  }}>
                    <div style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid rgba(201, 165, 116, 0.2)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                        Notificaciones
                      </h3>
                      <div style={{ fontSize: '12px', color: '#AFB3B7' }}>
                        {notifications.filter(n => !n.read).length} nuevas
                      </div>
                    </div>

                    <div style={{
                      maxHeight: '420px',
                      overflowY: 'auto',
                      overflowX: 'hidden'
                    }}>
                      {notifications.map((notif) => {
                        const { icon: IconComponent, color } = getNotificationIcon(notif.type);
                        return (
                          <div
                            key={notif.id}
                            style={{
                              padding: '16px 20px',
                              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                              background: notif.read ? 'transparent' : 'rgba(201, 165, 116, 0.05)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              position: 'relative'
                            }}
                            onClick={() => markAsRead(notif.id)}
                          >
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                              <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                background: `${color}15`,
                                border: `1px solid ${color}40`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                <IconComponent size={18} color={color} />
                              </div>

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: '#ffffff',
                                  marginBottom: '4px'
                                }}>
                                  {notif.title}
                                </div>
                                <div style={{
                                  fontSize: '13px',
                                  color: '#AFB3B7',
                                  marginBottom: '6px',
                                  lineHeight: '1.4'
                                }}>
                                  {notif.message}
                                </div>
                                <div style={{
                                  fontSize: '12px',
                                  color: '#6b7280'
                                }}>
                                  {notif.time}
                                </div>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notif.id);
                                }}
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '6px',
                                  background: 'transparent',
                                  border: 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  color: '#6b7280',
                                  transition: 'all 0.2s ease',
                                  flexShrink: 0
                                }}
                              >
                                <X size={14} />
                              </button>
                            </div>

                            {!notif.read && (
                              <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '8px',
                                transform: 'translateY(-50%)',
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: '#c9a574'
                              }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={onLogout}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  color: '#ef4444',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <LogOut size={18} />
                Salir
              </button>
            </div>
          </div>

          {/* Texto de Bienvenida */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '0 40px 40px 40px'
          }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '12px',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4)',
              letterSpacing: '-0.5px',
              margin: 0,
              marginBottom: '12px'
            }}>
              Bienvenido, {data.name}
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#AFB3B7',
              fontWeight: '400',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
              margin: 0
            }}>
              Resumen de tu actividad y estadísticas
            </p>
          </div>
        </div>

        {/* Main Content */}
        <main style={{
          padding: '40px',
          paddingTop: '40px',
          maxWidth: '1400px',
          margin: '0 auto',
          minHeight: 'calc(100vh - 80px)'
        }}>
          {renderContent()}
        </main>

        {/* Footer */}
        <footer style={{
          position: 'relative',
          marginTop: '60px',
          padding: '20px 40px'
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div style={{
                fontSize: '12px',
                color: 'rgba(175, 179, 183, 0.6)'
              }}>
                © 2026 BIGARTIST ROYALTIES. Todos los derechos reservados.
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Notificación de éxito de pago */}
      {showPaymentSuccess && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.98) 0%, rgba(30, 47, 47, 0.98) 100%)',
          border: '2px solid #c9a574',
          borderRadius: '16px',
          padding: '20px 24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(201, 165, 116, 0.3)',
          zIndex: 10000,
          minWidth: '400px',
          backdropFilter: 'blur(10px)',
          animation: 'slideInRight 0.4s ease-out'
        }}>
          <style>{`
            @keyframes slideInRight {
              from {
                transform: translateX(400px);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          `}</style>
          
          <div style={{ display: 'flex', alignItems: 'start', gap: '16px' }}>
            {/* Icono de éxito */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0.1) 100%)',
              border: '2px solid rgba(251, 191, 36, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Clock size={24} color="#fbbf24" />
            </div>

            {/* Contenido */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                Solicitud Enviada
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  background: 'rgba(251, 191, 36, 0.15)',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#fbbf24',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Pendiente
                </div>
              </div>
              <div style={{
                fontSize: '14px',
                color: '#AFB3B7',
                lineHeight: '1.5'
              }}>
                Tu solicitud de pago ha sido enviada correctamente. Se procesará en 2-3 días hábiles.
              </div>
            </div>

            {/* Botón cerrar */}
            <button
              onClick={() => setShowPaymentSuccess(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#AFB3B7',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
                e.currentTarget.style.color = '#c9a574';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#AFB3B7';
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Barra de progreso de auto-cierre */}
          <div style={{
            marginTop: '16px',
            height: '3px',
            background: 'rgba(201, 165, 116, 0.2)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #c9a574 0%, #b8956a 100%)',
              animation: 'progressBar 4s linear',
              transformOrigin: 'left'
            }} />
          </div>
          <style>{`
            @keyframes progressBar {
              from {
                transform: scaleX(1);
              }
              to {
                transform: scaleX(0);
              }
            }
          `}</style>
        </div>
      )}

      {/* Modal de Detalle del Contrato */}
      {selectedContract && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
          }}
          onClick={() => setSelectedContract(null)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.98) 0%, rgba(30, 47, 47, 0.98) 100%)',
              border: '2px solid #c9a574',
              borderRadius: '20px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
              animation: 'modalFadeIn 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`
              @keyframes modalFadeIn {
                from {
                  opacity: 0;
                  transform: scale(0.9);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}</style>

            {/* Header del Modal */}
            <div style={{
              padding: '28px',
              borderBottom: '1px solid rgba(201, 165, 116, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <FileSignature size={28} color="#c9a574" />
                  {selectedContract.title}
                </h2>
                <button
                  onClick={() => setSelectedContract(null)}
                  style={{
                    background: 'rgba(201, 165, 116, 0.1)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '8px',
                    padding: '8px',
                    color: '#c9a574',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                background: selectedContract.status === 'Activo' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                border: selectedContract.status === 'Activo' ? '1px solid rgba(74, 222, 128, 0.4)' : '1px solid rgba(251, 191, 36, 0.4)',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '700',
                color: selectedContract.status === 'Activo' ? '#4ade80' : '#fbbf24',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {selectedContract.status === 'Activo' ? <CheckCircle size={14} /> : <Clock size={14} />}
                {selectedContract.status}
              </div>
            </div>

            {/* Contenido del Modal */}
            <div style={{ padding: '28px' }}>
              {/* Descripción */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#c9a574',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Descripción
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#AFB3B7',
                  lineHeight: '1.7'
                }}>
                  {selectedContract.description}
                </p>
              </div>

              {/* Información Clave - Grid 2x2 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                marginBottom: '28px'
              }}>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(201, 165, 116, 0.2)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <div style={{
                    fontSize: '11px',
                    color: '#AFB3B7',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Tipo de Contrato
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#ffffff'
                  }}>
                    {selectedContract.type}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(201, 165, 116, 0.2)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <div style={{
                    fontSize: '11px',
                    color: '#AFB3B7',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Porcentaje de Royalty
                  </div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#c9a574'
                  }}>
                    {selectedContract.royaltyPercentage}%
                  </div>
                </div>

                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(201, 165, 116, 0.2)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <div style={{
                    fontSize: '11px',
                    color: '#AFB3B7',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Fecha de Inicio
                  </div>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#ffffff'
                  }}>
                    {selectedContract.startDate}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(201, 165, 116, 0.2)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <div style={{
                    fontSize: '11px',
                    color: '#AFB3B7',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Fecha de Finalización
                  </div>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#ffffff'
                  }}>
                    {selectedContract.endDate}
                  </div>
                </div>
              </div>

              {/* Territorios */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#c9a574',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Territorios
                </h3>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(201, 165, 116, 0.2)',
                  borderRadius: '12px',
                  padding: '14px 18px'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Globe size={16} color="#c9a574" />
                    {selectedContract.territories}
                  </div>
                </div>
              </div>

              {/* Plataformas */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#c9a574',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Plataformas Incluidas
                </h3>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  {selectedContract.platforms.map((platform: string, index: number) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(201, 165, 116, 0.1)',
                        border: '1px solid rgba(201, 165, 116, 0.3)',
                        borderRadius: '10px',
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#c9a574'
                      }}
                    >
                      {platform}
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón de Descarga */}
              <button
                onClick={() => alert('Descargando contrato PDF...')}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #c9a574 0%, #b8956a 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px',
                  color: '#1a1a1a',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 16px rgba(201, 165, 116, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(201, 165, 116, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(201, 165, 116, 0.4)';
                }}
              >
                <Download size={20} />
                Descargar Contrato (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}