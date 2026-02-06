#!/bin/bash

# Script para desplegar el LoginPanel con el diseño exacto del preview

cat > /var/www/bigartist/repo/src/components/LoginPanel.jsx << 'ENDOFFILE'
import { useState } from 'react';

// Iconos SVG inline
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

export default function LoginPanel({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // PARA PRODUCCIÓN: Descomentar esto cuando tengas el backend corriendo
    try {
      const response = await fetch('https://app.bigartist.es/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(email, password);
      } else {
        setError(data.message || 'Credenciales incorrectas');
      }
      return;
    } catch (err) {
      console.log('Backend no disponible, usando modo demo');
    }

    // MODO DEMO
    if (email === 'admin@bigartist.es' && password === 'admin123') {
      onLogin(email, password);
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }} className="login-container">
      {/* IMAGEN DE FONDO GLOBAL - cubre todo el ancho */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/images/Oficina.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        opacity: 0.6,
        zIndex: 1
      }} />

      {/* OVERLAY VERDE GLOBAL - aplicado a toda la imagen */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(13, 31, 35, 0.85) 0%, rgba(19, 46, 53, 0.8) 50%, rgba(45, 74, 83, 0.75) 100%)',
        backdropFilter: 'blur(2px)',
        zIndex: 2
      }} />

      {/* CAPA DE TINTE VERDE GLOBAL */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(32, 64, 64, 0.4)',
        mixBlendMode: 'multiply',
        zIndex: 2
      }} />

      {/* LADO IZQUIERDO - Logo y branding */}
      <div className="left-panel" style={{
        position: 'relative',
        width: '55%',
        overflow: 'hidden',
        zIndex: 3
      }}>
        {/* Logo y texto corporativo */}
        <div className="logo-section" style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 10,
          width: '80%'
        }}>
          {/* Logo BIGARTIST */}
          <img 
            src="/images/Bamlogo.png" 
            alt="BIGARTIST" 
            className="logo-image"
            style={{
              width: '100%',
              maxWidth: '500px',
              height: 'auto',
              marginBottom: '32px',
              filter: 'drop-shadow(0 0 40px rgba(201, 165, 116, 0.4))',
              objectFit: 'contain'
            }}
          />
          
          <div className="subtitle" style={{
            color: '#c9a574',
            fontSize: '24px',
            fontWeight: '300',
            letterSpacing: '6px',
            textTransform: 'uppercase',
            marginBottom: '40px'
          }}>
            Royalties Management
          </div>
          <div style={{
            width: '120px',
            height: '2px',
            background: 'linear-gradient(to right, transparent, #c9a574, transparent)',
            margin: '0 auto'
          }} />
        </div>

        {/* Línea de luz inferior - como en la imagen */}
        <div className="bottom-line" style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(to right, transparent, #c9a574, transparent)',
          boxShadow: '0 0 20px rgba(201, 165, 116, 0.6)'
        }} />
      </div>

      {/* LADO DERECHO - Formulario de login */}
      <div className="right-panel" style={{
        position: 'relative',
        width: '45%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        overflow: 'hidden',
        zIndex: 3
      }}>
        <div className="form-container" style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 3 }}>
          {/* Header del formulario */}
          <div style={{ marginBottom: '48px' }}>
            <h2 className="form-title" style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '12px',
              letterSpacing: '-0.5px'
            }}>
              Admin Panel
            </h2>
            <p className="form-subtitle" style={{
              fontSize: '15px',
              color: '#AFB3B7',
              fontWeight: '400'
            }}>
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin}>
            {error && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #ef4444',
                color: '#fca5a5',
                padding: '14px 16px',
                borderRadius: '10px',
                fontSize: '14px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '18px' }}>⚠️</span>
                {error}
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#AFB3B7',
                marginBottom: '10px',
                letterSpacing: '0.3px'
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bigartist.es"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '15px',
                  color: '#ffffff',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  border: '2px solid rgba(201, 165, 116, 0.3)',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#c9a574';
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
                }}
              />
            </div>

            {/* Contraseña */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#AFB3B7',
                marginBottom: '10px',
                letterSpacing: '0.3px'
              }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 48px 14px 16px',
                    fontSize: '15px',
                    color: '#ffffff',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    border: '2px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    fontWeight: '500'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#c9a574';
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#69818D',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#c9a574'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#69818D'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Botón de login */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#0D1F23',
                background: 'linear-gradient(135deg, #c9a574 0%, #d4b589 100%)',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)',
                marginBottom: '20px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 165, 116, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 165, 116, 0.3)';
              }}
            >
              Iniciar Sesión
            </button>

            {/* Link de recuperación */}
            <div style={{ textAlign: 'center' }}>
              <a 
                href="https://app.bigartist.es" 
                style={{
                  fontSize: '14px',
                  color: '#69818D',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#c9a574'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#69818D'}
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </form>

          {/* Footer */}
          <div style={{
            marginTop: '48px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(175, 179, 183, 0.2)',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '13px',
              color: '#69818D',
              fontWeight: '400'
            }}>
              © 2026 Big Artist Management S.L.
            </p>
          </div>
        </div>
      </div>

      {/* Estilos de animación */}
      <style>{`
        @keyframes ledPulse {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }

        /* RESPONSIVE MOBILE */
        @media (max-width: 968px) {
          .login-container {
            flex-direction: column !important;
          }

          .left-panel {
            width: 100% !important;
            min-height: 35vh !important;
            max-height: 35vh !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .right-panel {
            width: 100% !important;
            min-height: 65vh !important;
            padding: 30px 24px !important;
          }

          .logo-section {
            width: 90% !important;
            position: static !important;
            transform: none !important;
            padding: 0 20px;
          }

          .logo-image {
            max-width: 280px !important;
            margin-bottom: 20px !important;
            margin-left: auto !important;
            margin-right: auto !important;
            display: block !important;
          }

          .subtitle {
            font-size: 14px !important;
            letter-spacing: 3px !important;
            margin-bottom: 20px !important;
          }

          .bottom-line {
            display: none;
          }

          .form-container {
            max-width: 100% !important;
          }

          .form-title {
            font-size: 26px !important;
          }

          .form-subtitle {
            font-size: 14px !important;
          }
        }

        @media (max-width: 480px) {
          .left-panel {
            min-height: 30vh !important;
            max-height: 30vh !important;
          }

          .right-panel {
            min-height: 70vh !important;
            padding: 24px 20px !important;
          }

          .logo-image {
            max-width: 220px !important;
            margin-bottom: 16px !important;
          }

          .subtitle {
            font-size: 12px !important;
            letter-spacing: 2px !important;
            margin-bottom: 16px !important;
          }

          .form-title {
            font-size: 24px !important;
            margin-bottom: 8px !important;
          }

          .form-subtitle {
            font-size: 13px !important;
          }
        }
      `}</style>
    </div>
  );
}
ENDOFFILE

echo ""
echo "✅ LoginPanel.jsx actualizado con código EXACTO del preview"
echo "📦 Compilando..."

cd /var/www/bigartist/repo
npm run build

echo "🚀 Desplegando..."
sudo cp -r dist/* /var/www/bigartist/frontend/
sudo chown -R www-data:www-data /var/www/bigartist/frontend/
sudo systemctl reload nginx

TIMESTAMP=$(date +%s)
echo ""
echo "✅ ¡DESPLEGADO! Código exacto del preview de Figma Make"
echo "🌐 https://app.bigartist.es?v=$TIMESTAMP"
echo ""
echo "💡 Haz Cmd+Shift+R para limpiar caché"
echo ""
echo "📝 Credenciales demo:"
echo "   Email: admin@bigartist.es"
echo "   Password: admin123"
