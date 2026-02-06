import { useState } from 'react';
import { Bell, BarChart3, Users, Music, FileText, Upload, Settings, LogOut } from 'lucide-react';
import logoImage from 'figma:asset/aa0296e2522220bcfcda71f86c708cb2cbc616b9.png';
import backgroundImage from 'figma:asset/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493.png';

interface DashboardProps {
  onLogout: () => void;
}

export default function DashboardSimple({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState(3);

  const tabs = [
    { name: 'Dashboard', icon: BarChart3 },
    { name: 'Artistas', icon: Users },
    { name: 'Catálogo', icon: Music },
    { name: 'Contratos', icon: FileText },
    { name: 'Subir CSV', icon: Upload },
    { name: 'Configuración', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div>
            <h1 className="mobile-title" style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
              Dashboard
            </h1>
            <div className="mobile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {[
                { title: 'Total Royalties', value: '€124,532', change: '+12.5%', color: '#c9a574' },
                { title: 'Artistas Activos', value: '42', change: '+3', color: '#4ade80' },
                { title: 'Canciones', value: '1,284', change: '+18', color: '#60a5fa' },
                { title: 'Pagos Pendientes', value: '€8,420', change: '-5.2%', color: '#f87171' }
              ].map((stat, i) => (
                <div key={i} className="mobile-stat-card" style={{
                  background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
                  border: '1px solid rgba(201, 165, 116, 0.2)',
                  borderRadius: '16px',
                  padding: '24px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '8px', fontWeight: '500' }}>
                    {stat.title}
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '13px', color: stat.color, fontWeight: '600' }}>
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'Artistas':
        return (
          <div>
            <h1 className="mobile-title" style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
              Gestión de Artistas
            </h1>
            <div style={{
              background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <Users size={48} style={{ color: '#c9a574', marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', color: '#AFB3B7' }}>Sección en construcción</p>
            </div>
          </div>
        );
      
      case 'Catálogo':
        return (
          <div>
            <h1 className="mobile-title" style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
              Catálogo Musical
            </h1>
            <div style={{
              background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <Music size={48} style={{ color: '#c9a574', marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', color: '#AFB3B7' }}>Sección en construcción</p>
            </div>
          </div>
        );
      
      case 'Contratos':
        return (
          <div>
            <h1 className="mobile-title" style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
              Contratos
            </h1>
            <div style={{
              background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <FileText size={48} style={{ color: '#c9a574', marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', color: '#AFB3B7' }}>Sección en construcción</p>
            </div>
          </div>
        );
      
      case 'Subir CSV':
        return (
          <div>
            <h1 className="mobile-title" style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
              Subir CSV
            </h1>
            <div style={{
              background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <Upload size={48} style={{ color: '#c9a574', marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', color: '#AFB3B7' }}>Sección en construcción</p>
            </div>
          </div>
        );
      
      case 'Configuración':
        return (
          <div>
            <h1 className="mobile-title" style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
              Configuración
            </h1>
            <div style={{
              background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <Settings size={48} style={{ color: '#c9a574', marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', color: '#AFB3B7' }}>Sección en construcción</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: window.innerWidth <= 768 ? '80px' : '0'
    }}>
      {/* Imagen de fondo */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        opacity: 0.6,
        zIndex: 0
      }} />

      {/* Overlay verde oscuro */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(13, 31, 35, 0.85) 0%, rgba(19, 46, 53, 0.8) 50%, rgba(45, 74, 83, 0.75) 100%)',
        backdropFilter: 'blur(2px)',
        zIndex: 0
      }} />

      {/* Capa de tinte verde */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(32, 64, 64, 0.4)',
        mixBlendMode: 'multiply' as const,
        zIndex: 0
      }} />

      {/* Contenido sobre el fondo */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Estilos Responsive */}
        <style>{`
          @media (max-width: 768px) {
            .mobile-header {
              padding: 12px 16px !important;
              gap: 12px !important;
            }

            .mobile-logo {
              height: 32px !important;
            }

            .mobile-tabs {
              display: none !important;
            }

            .mobile-actions {
              margin-left: auto !important;
            }

            .mobile-content {
              padding: 20px 16px 20px 16px !important;
            }

            .mobile-grid {
              grid-template-columns: 1fr !important;
              gap: 16px !important;
            }

            .mobile-title {
              font-size: 24px !important;
              margin-bottom: 16px !important;
            }

            .mobile-stat-card {
              padding: 20px !important;
            }

            /* Bottom Navigation */
            .bottom-nav {
              display: flex !important;
              position: fixed !important;
              bottom: 0 !important;
              left: 0 !important;
              right: 0 !important;
              background: rgba(42, 63, 63, 0.95) !important;
              backdrop-filter: blur(20px) !important;
              border-top: 1px solid rgba(201, 165, 116, 0.2) !important;
              padding: 8px 8px calc(8px + env(safe-area-inset-bottom)) 8px !important;
              z-index: 1000 !important;
              box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.3) !important;
            }

            .bottom-nav-item {
              flex: 1 !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: center !important;
              gap: 4px !important;
              padding: 8px 4px !important;
              border-radius: 12px !important;
              cursor: pointer !important;
              transition: all 0.2s ease !important;
              border: none !important;
              background: transparent !important;
            }

            .bottom-nav-item.active {
              background: rgba(201, 165, 116, 0.15) !important;
            }

            .bottom-nav-icon {
              width: 24px !important;
              height: 24px !important;
              transition: all 0.2s ease !important;
            }

            .bottom-nav-item.active .bottom-nav-icon {
              transform: scale(1.1) !important;
            }

            .bottom-nav-label {
              font-size: 11px !important;
              font-weight: 500 !important;
              letter-spacing: 0.3px !important;
            }
          }

          @media (min-width: 769px) {
            .bottom-nav {
              display: none !important;
            }
          }

          @media (max-width: 480px) {
            .mobile-header {
              padding: 10px 12px !important;
            }

            .mobile-logo {
              height: 28px !important;
            }

            .mobile-title {
              font-size: 22px !important;
            }

            .mobile-content {
              padding: 16px 12px 16px 12px !important;
            }

            .bottom-nav-label {
              font-size: 10px !important;
            }
          }
        `}</style>

        {/* Header */}
        <header className="mobile-header" style={{
          background: 'rgba(42, 63, 63, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}>
          {/* Logo */}
          <img 
            src={logoImage}
            alt="BIGARTIST"
            className="mobile-logo"
            style={{
              height: '40px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px rgba(201, 165, 116, 0.2))'
            }}
          />

          {/* Tabs - Solo Desktop */}
          <div className="mobile-tabs" style={{
            display: 'flex',
            gap: '8px',
            flex: 1,
            overflowX: 'auto'
          }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className="mobile-tab"
                  style={{
                    padding: '12px 20px',
                    background: activeTab === tab.name 
                      ? 'rgba(201, 165, 116, 0.2)' 
                      : 'transparent',
                    border: activeTab === tab.name 
                      ? '1px solid rgba(201, 165, 116, 0.4)' 
                      : '1px solid transparent',
                    borderRadius: '12px',
                    color: activeTab === tab.name ? '#c9a574' : '#AFB3B7',
                    fontSize: '14px',
                    fontWeight: activeTab === tab.name ? '600' : '400',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Icon size={16} />
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Notificaciones y Logout */}
          <div className="mobile-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Campana */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(201, 165, 116, 0.1)',
                  border: '1px solid rgba(201, 165, 116, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c9a574',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <Bell size={18} />
                {notifications > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {notifications}
                  </div>
                )}
              </button>
            </div>

            {/* Logout - Solo Desktop */}
            <button
              onClick={onLogout}
              style={{
                padding: '10px 16px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                color: '#ef4444',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: window.innerWidth <= 768 ? 'none' : 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <LogOut size={16} />
              Salir
            </button>
          </div>
        </header>

        {/* Contenido */}
        <main className="mobile-content" style={{
          padding: '40px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {renderContent()}
        </main>

        {/* Bottom Navigation - Solo Móvil */}
        <nav className="bottom-nav" style={{ display: 'none' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`bottom-nav-item ${activeTab === tab.name ? 'active' : ''}`}
                style={{
                  color: activeTab === tab.name ? '#c9a574' : '#AFB3B7'
                }}
              >
                <Icon className="bottom-nav-icon" size={24} />
                <span className="bottom-nav-label">{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}