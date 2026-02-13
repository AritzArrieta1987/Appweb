import { useState } from 'react';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#2a3f3f', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          padding: '40px', 
          borderRadius: '12px',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h1 style={{ color: '#c9a574', marginBottom: '30px', textAlign: 'center' }}>
            BIGARTIST ROYALTIES
          </h1>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(201, 165, 116, 0.3)',
                  borderRadius: '6px',
                  color: 'white'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(201, 165, 116, 0.3)',
                  borderRadius: '6px',
                  color: 'white'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                background: '#c9a574',
                border: 'none',
                borderRadius: '6px',
                color: '#2a3f3f',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#2a3f3f', 
      color: 'white',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '40px',
          borderBottom: '1px solid rgba(201, 165, 116, 0.3)',
          paddingBottom: '20px'
        }}>
          <h1 style={{ color: '#c9a574' }}>Dashboard BIGARTIST</h1>
          <button
            onClick={() => setIsLoggedIn(false)}
            style={{
              padding: '10px 20px',
              background: 'rgba(201, 165, 116, 0.2)',
              border: '1px solid #c9a574',
              borderRadius: '6px',
              color: '#c9a574',
              cursor: 'pointer'
            }}
          >
            Cerrar Sesión
          </button>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {[
            { title: 'Ingresos Totales', value: '€15,420.50', color: '#10b981' },
            { title: 'Reproducciones', value: '234,567', color: '#3b82f6' },
            { title: 'Artistas', value: '12', color: '#8b5cf6' },
            { title: 'Canciones', value: '47', color: '#f59e0b' }
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid rgba(201, 165, 116, 0.2)'
              }}
            >
              <div style={{ 
                fontSize: '14px', 
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '8px'
              }}>
                {stat.title}
              </div>
              <div style={{ 
                fontSize: '28px', 
                fontWeight: 'bold',
                color: stat.color
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid rgba(201, 165, 116, 0.2)'
        }}>
          <h2 style={{ color: '#c9a574', marginBottom: '20px' }}>
            Sistema Operativo
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            ✅ Sistema de gestión de royalties funcionando correctamente
          </p>
        </div>
      </div>
    </div>
  );
}
