import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authAPI, setToken, setCurrentUser } from '../utils/api';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await authAPI.login(formData.email, formData.password);
        
        if (response.success && response.data) {
          setToken(response.data.token);
          setCurrentUser(response.data.user);
          
          // Redirect based on role
          if (response.data.user.role === 'admin') {
            navigate('/dashboard');
          } else {
            navigate('/artist-portal');
          }
        } else {
          setError(response.error || 'Error al iniciar sesión');
        }
      } else {
        const response = await authAPI.register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });

        if (response.success) {
          setError('');
          setIsLogin(true);
          alert('Registro exitoso. Por favor inicia sesión.');
        } else {
          setError(response.error || 'Error al registrarse');
        }
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-dark)] px-4 py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--accent-gold)] rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--accent-gold)] rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--accent-gold)] 
            rounded-2xl mb-4 shadow-2xl">
            <Music2 className="w-10 h-10 text-[var(--bg-dark)]" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--accent-gold)] mb-2">
            BIGARTIST
          </h1>
          <p className="text-[var(--text-muted)]">Royalties Management System</p>
        </div>

        {/* Auth Card */}
        <div className="bg-[var(--bg-darker)] rounded-2xl shadow-2xl border border-[var(--accent-gold)]/20 
          overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[var(--accent-gold)]/20">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`flex-1 py-4 font-semibold transition-all duration-200
                ${isLogin 
                  ? 'bg-[var(--accent-gold)] text-[var(--bg-dark)]' 
                  : 'text-[var(--text-muted)] hover:bg-[var(--accent-gold)]/5'
                }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`flex-1 py-4 font-semibold transition-all duration-200
                ${!isLogin 
                  ? 'bg-[var(--accent-gold)] text-[var(--bg-dark)]' 
                  : 'text-[var(--text-muted)] hover:bg-[var(--accent-gold)]/5'
                }`}
            >
              Registrarse
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-[var(--danger)]/10 border border-[var(--danger)]/30 
                text-[var(--danger)] px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[var(--text-light)] mb-2">
                  Nombre Completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[var(--bg-dark)] border border-[var(--accent-gold)]/30 
                      rounded-lg px-4 py-3 text-[var(--text-light)] placeholder-[var(--text-muted)]
                      focus:outline-none focus:border-[var(--accent-gold)] transition-all"
                    placeholder="Ingresa tu nombre"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--text-light)] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[var(--bg-dark)] border border-[var(--accent-gold)]/30 
                    rounded-lg pl-11 pr-4 py-3 text-[var(--text-light)] placeholder-[var(--text-muted)]
                    focus:outline-none focus:border-[var(--accent-gold)] transition-all"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-light)] mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[var(--bg-dark)] border border-[var(--accent-gold)]/30 
                    rounded-lg pl-11 pr-11 py-3 text-[var(--text-light)] placeholder-[var(--text-muted)]
                    focus:outline-none focus:border-[var(--accent-gold)] transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] 
                    hover:text-[var(--accent-gold)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-[var(--accent-gold)] hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--accent-gold)] text-[var(--bg-dark)] font-semibold 
                py-3 rounded-lg hover:bg-[#b89560] transition-all duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
            </button>
          </form>

          {/* Demo Credentials */}
          {isLogin && (
            <div className="px-8 pb-8">
              <div className="bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/20 
                rounded-lg p-4">
                <p className="text-xs font-semibold text-[var(--accent-gold)] mb-2">
                  Credenciales de prueba:
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Email: <span className="text-[var(--text-light)]">admin@bigartist.es</span>
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Contraseña: <span className="text-[var(--text-light)]">admin123</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-[var(--text-muted)] mt-8">
          © 2026 BIGARTIST. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
