import { useState, useEffect } from 'react';

interface DashboardProps {
  onLogout: () => void;
}

export default function DashboardClean({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [tabs] = useState(['Dashboard', 'Artistas', 'Catálogo']);

  useEffect(() => {
    const appHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    window.addEventListener('resize', appHeight);
    appHeight();
    return () => window.removeEventListener('resize', appHeight);
  }, []);

  return (
    <div style={{
      height: '100vh',
      height: 'var(--app-height)',
      backgroundColor: '#0a0f14',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden'
    }}>
      <style>{`
        :root {
          --app-height: 100vh;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .tab-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .tab-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, rgba(201, 165, 116, 0.1) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .tab-item:hover::before {
          opacity: 1;
        }

        .tab-item:hover {
          background: rgba(255, 255, 255, 0.06) !important;
          transform: translateY(-2px);
        }

        .tab-item:active {
          transform: translateY(0);
        }

        .avatar-button {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .avatar-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s ease, height 0.6s ease;
        }

        .avatar-button:hover::before {
          width: 100%;
          height: 100%;
        }

        .avatar-button:hover {
          transform: scale(1.08) rotate(5deg);
          box-shadow: 0 8px 24px rgba(201, 165, 116, 0.5) !important;
        }

        .avatar-button:active {
          transform: scale(1.02);
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .logo-container {
          transition: all 0.3s ease;
        }

        .logo-container:hover {
          transform: scale(1.02);
          filter: drop-shadow(0 4px 12px rgba(201, 165, 116, 0.3));
        }
      `}</style>

      {/* HEADER ESTILO QUICKBOOKS */}
      <header style={{
        height: '80px',
        background: 'linear-gradient(180deg, #1f252e 0%, #1a1f26 100%)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        gap: '24px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255, 255, 255, 0.05) inset',
        position: 'relative',
        zIndex: 10,
        borderBottom: '1px solid rgba(201, 165, 116, 0.1)'
      }}>
        {/* Logo */}
        <div className="logo-container" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0,
          cursor: 'pointer'
        }}>
          <img 
            src="/logo.png" 
            alt="BIGARTIST Logo"
            style={{
              height: '44px',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px rgba(201, 165, 116, 0.2))'
            }}
          />
        </div>

        {/* Separador sutil */}
        <div style={{
          width: '1px',
          height: '32px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)'
        }} />

        {/* Tabs horizontales */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px',
          overflow: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          height: '100%',
          paddingBottom: '0'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="tab-item"
              style={{
                position: 'relative',
                padding: '16px 32px',
                background: activeTab === tab 
                  ? 'linear-gradient(180deg, #0f1419 0%, #0a0f14 100%)' 
                  : 'transparent',
                border: 'none',
                borderTopLeftRadius: '18px',
                borderTopRightRadius: '18px',
                color: activeTab === tab ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                fontSize: '15px',
                fontWeight: activeTab === tab ? '600' : '400',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                height: activeTab === tab ? '54px' : '44px',
                marginBottom: activeTab === tab ? '0' : '10px',
                letterSpacing: '0.3px',
                boxShadow: activeTab === tab 
                  ? '0 -2px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(201, 165, 116, 0.1)' 
                  : 'none',
                backdropFilter: activeTab === tab ? 'blur(10px)' : 'none'
              }}
            >
              {tab}
              {activeTab === tab && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '20%',
                  right: '20%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent 0%, #c9a574 50%, transparent 100%)',
                  borderRadius: '2px 2px 0 0'
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Separador sutil */}
        <div style={{
          width: '1px',
          height: '32px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)'
        }} />

        {/* Avatar a la derecha */}
        <div className="avatar-button" style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #d4b589 0%, #c9a574 50%, #b8935f 100%)',
          border: '2px solid rgba(201, 165, 116, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: '800',
          color: '#1a1f26',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(201, 165, 116, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.5)',
          flexShrink: 0,
          letterSpacing: '-0.5px',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
        }}
        >
          A
        </div>
      </header>

      {/* CONTENT AREA VACÍA */}
      <main style={{
        height: 'calc(100vh - 80px)',
        height: 'calc(var(--app-height) - 80px)',
        overflow: 'auto',
        padding: '40px'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.2)',
          fontSize: '16px',
          fontWeight: '400',
          marginTop: '100px'
        }}>
          Área de contenido del dashboard
        </div>
      </main>
    </div>
  );
}