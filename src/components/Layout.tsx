import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Menu, X, LogOut, Home, Users, Music, FileText, DollarSign, User } from 'lucide-react';
import { authAPI, getCurrentUser } from '../utils/api';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const currentUser = getCurrentUser();

  const isAdmin = currentUser?.role === 'admin';

  const adminMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Artistas', path: '/artists' },
    { icon: Music, label: 'Catálogo', path: '/catalog' },
    { icon: FileText, label: 'Contratos', path: '/contracts' },
    { icon: DollarSign, label: 'Royalties', path: '/royalties' },
  ];

  const artistMenuItems = [
    { icon: Home, label: 'Mi Portal', path: '/artist-portal' },
    { icon: Music, label: 'Mi Música', path: '/artist-portal/music' },
    { icon: DollarSign, label: 'Mis Ingresos', path: '/artist-portal/earnings' },
  ];

  const menuItems = isAdmin ? adminMenuItems : artistMenuItems;

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  useEffect(() => {
    // Close sidebar on route change (mobile)
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-dark)]">
      {/* Desktop Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-[var(--bg-darker)] 
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-[var(--accent-gold)]/20">
          <h1 className="text-2xl font-bold text-[var(--accent-gold)]">
            BIGARTIST
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Royalties Management</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-[var(--accent-gold)] text-[var(--bg-dark)]' 
                    : 'text-[var(--text-light)] hover:bg-[var(--accent-gold)]/10'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-[var(--accent-gold)]/20">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-gold)] flex items-center justify-center">
              <User className="w-6 h-6 text-[var(--bg-dark)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-light)] truncate">
                {currentUser?.name || currentUser?.email}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {isAdmin ? 'Administrador' : 'Artista'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg
              text-[var(--text-muted)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]
              transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-[var(--bg-darker)] border-b border-[var(--accent-gold)]/20 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-[var(--accent-gold)]/10 text-[var(--text-light)]"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h2 className="text-lg md:text-xl font-semibold text-[var(--text-light)]">
                {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h2>
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-[var(--accent-gold)]/10 text-[var(--text-light)]"
              >
                <Bell className="w-6 h-6" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--danger)] 
                    text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-darker)] rounded-lg 
                  shadow-xl border border-[var(--accent-gold)]/20 z-50">
                  <div className="p-4 border-b border-[var(--accent-gold)]/20">
                    <h3 className="font-semibold text-[var(--text-light)]">Notificaciones</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-4 hover:bg-[var(--accent-gold)]/5 cursor-pointer border-b border-[var(--accent-gold)]/10">
                      <p className="text-sm text-[var(--text-light)]">
                        Nuevo reporte de royalties disponible
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">Hace 2 horas</p>
                    </div>
                    <div className="p-4 hover:bg-[var(--accent-gold)]/5 cursor-pointer border-b border-[var(--accent-gold)]/10">
                      <p className="text-sm text-[var(--text-light)]">
                        Contrato actualizado
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">Hace 5 horas</p>
                    </div>
                    <div className="p-4 hover:bg-[var(--accent-gold)]/5 cursor-pointer">
                      <p className="text-sm text-[var(--text-light)]">
                        Nuevo artista registrado
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">Hace 1 día</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>

        {/* Bottom Navigation (Mobile only) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-darker)] 
          border-t border-[var(--accent-gold)]/20 z-40">
          <div className="flex justify-around items-center h-16">
            {menuItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`
                    flex flex-col items-center justify-center flex-1 h-full
                    transition-all duration-200
                    ${isActive 
                      ? 'text-[var(--accent-gold)]' 
                      : 'text-[var(--text-muted)]'
                    }
                  `}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
