import { useState } from 'react';
import { User, Mail, Phone, Globe, MapPin, Save, Bell, Shield, Settings, Clock, Lock, Info, Camera } from 'lucide-react';

interface ConfigurationPanelProps {
  onSaveNotification: (notification: any) => void;
}

export function ConfigurationPanel({ onSaveNotification }: ConfigurationPanelProps) {
  const [configTab, setConfigTab] = useState('profile');
  const [companySettings, setCompanySettings] = useState({
    name: 'BIGARTIST ROYALTIES',
    email: 'admin@bigartist.es',
    phone: '+34 910 000 000',
    website: 'https://app.bigartist.es',
    address: 'Madrid, España',
    logo: ''
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newArtistAlert: true,
    csvUploadAlert: true,
    contractExpiry: true,
    monthlyReport: true,
    soundEnabled: true
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    ipWhitelist: false
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
          Configuración
        </h1>
        <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
          Gestiona las preferencias de tu cuenta y aplicación
        </p>
      </div>

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
        borderBottom: '2px solid rgba(201, 165, 116, 0.2)',
        paddingBottom: '0',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'profile', label: 'Perfil de Empresa', icon: User },
          { id: 'notifications', label: 'Notificaciones', icon: Bell },
          { id: 'security', label: 'Seguridad', icon: Shield },
          { id: 'preferences', label: 'Preferencias', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = configTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setConfigTab(tab.id)}
              style={{
                padding: '12px 20px',
                background: isActive ? 'rgba(201, 165, 116, 0.1)' : 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid #c9a574' : '2px solid transparent',
                color: isActive ? '#c9a574' : '#AFB3B7',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                marginBottom: '-2px'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = '#AFB3B7';
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div>
        {/* Perfil de Empresa */}
        {configTab === 'profile' && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
            border: '1px solid rgba(201, 165, 116, 0.2)',
            borderRadius: '16px',
            padding: '32px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '24px' }}>
              Información de la Empresa
            </h2>

            <div style={{ display: 'grid', gap: '24px' }}>
              {/* Logo */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#AFB3B7', marginBottom: '12px' }}>
                  Logo de la Empresa
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.3) 0%, rgba(201, 165, 116, 0.1) 100%)',
                    border: '2px solid rgba(201, 165, 116, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User size={32} color="#c9a574" />
                  </div>
                  <label style={{
                    padding: '10px 20px',
                    background: 'rgba(201, 165, 116, 0.1)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '10px',
                    color: '#c9a574',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                  }}>
                    <Camera size={16} />
                    Cambiar Logo
                    <input type="file" accept="image/*" style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              {[
                { key: 'name', label: 'Nombre de la Empresa', icon: User, type: 'text' },
                { key: 'email', label: 'Email Corporativo', icon: Mail, type: 'email' },
                { key: 'phone', label: 'Teléfono', icon: Phone, type: 'tel' },
                { key: 'website', label: 'Sitio Web', icon: Globe, type: 'url' },
                { key: 'address', label: 'Dirección', icon: MapPin, type: 'text' }
              ].map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.key}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#AFB3B7', marginBottom: '8px' }}>
                      <Icon size={14} style={{ display: 'inline', marginRight: '6px' }} />
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={companySettings[field.key as keyof typeof companySettings]}
                      onChange={(e) => setCompanySettings({ ...companySettings, [field.key]: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(201, 165, 116, 0.3)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#c9a574'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)'}
                    />
                  </div>
                );
              })}

              {/* Save Button */}
              <button
                onClick={() => {
                  onSaveNotification({
                    id: Date.now(),
                    type: 'success',
                    title: 'Configuración Guardada',
                    message: 'Los cambios se han guardado correctamente',
                    time: 'Ahora',
                    read: false
                  });
                }}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #c9a574 0%, #b8956a 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center',
                  width: 'fit-content',
                  marginLeft: 'auto',
                  boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(201, 165, 116, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 165, 116, 0.3)';
                }}
              >
                <Save size={16} />
                Guardar Cambios
              </button>
            </div>
          </div>
        )}

        {/* Notificaciones */}
        {configTab === 'notifications' && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
            border: '1px solid rgba(201, 165, 116, 0.2)',
            borderRadius: '16px',
            padding: '32px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
              Preferencias de Notificaciones
            </h2>
            <p style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '24px' }}>
              Configura cómo y cuándo quieres recibir notificaciones
            </p>

            <div style={{ display: 'grid', gap: '16px' }}>
              {[
                { key: 'emailNotifications', label: 'Notificaciones por Email', description: 'Recibir alertas importantes por correo electrónico' },
                { key: 'newArtistAlert', label: 'Nuevo Artista Registrado', description: 'Notificar cuando se añade un nuevo artista' },
                { key: 'csvUploadAlert', label: 'Carga de CSV Completada', description: 'Alertar cuando finaliza la importación de datos' },
                { key: 'contractExpiry', label: 'Vencimiento de Contratos', description: 'Avisar 30 días antes del vencimiento de contratos' },
                { key: 'monthlyReport', label: 'Informes Mensuales', description: 'Recibir resumen mensual de actividad y royalties' },
                { key: 'soundEnabled', label: 'Sonido de Notificaciones', description: 'Reproducir sonido al recibir notificaciones' }
              ].map((item) => (
                <div
                  key={item.key}
                  style={{
                    padding: '20px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '13px', color: '#AFB3B7' }}>
                      {item.description}
                    </div>
                  </div>
                  <label style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: '52px',
                    height: '28px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        [item.key]: e.target.checked
                      })}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: notificationSettings[item.key as keyof typeof notificationSettings] ? '#4ade80' : 'rgba(107, 114, 128, 0.3)',
                      transition: '0.4s',
                      borderRadius: '28px',
                      border: `1px solid ${notificationSettings[item.key as keyof typeof notificationSettings] ? '#4ade80' : 'rgba(107, 114, 128, 0.5)'}`
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: '20px',
                        width: '20px',
                        left: notificationSettings[item.key as keyof typeof notificationSettings] ? '28px' : '4px',
                        bottom: '3px',
                        background: '#ffffff',
                        transition: '0.4s',
                        borderRadius: '50%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }} />
                    </span>
                  </label>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                onSaveNotification({
                  id: Date.now(),
                  type: 'success',
                  title: 'Preferencias Guardadas',
                  message: 'Tus preferencias de notificaciones se han actualizado',
                  time: 'Ahora',
                  read: false
                });
              }}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #c9a574 0%, #b8956a 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center',
                width: 'fit-content',
                marginLeft: 'auto',
                marginTop: '24px',
                boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(201, 165, 116, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 165, 116, 0.3)';
              }}
            >
              <Save size={16} />
              Guardar Preferencias
            </button>
          </div>
        )}

        {/* Seguridad */}
        {configTab === 'security' && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
            border: '1px solid rgba(201, 165, 116, 0.2)',
            borderRadius: '16px',
            padding: '32px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
              Configuración de Seguridad
            </h2>
            <p style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '24px' }}>
              Mantén tu cuenta segura con estas opciones
            </p>

            <div style={{ display: 'grid', gap: '20px' }}>
              {/* 2FA */}
              <div style={{
                padding: '24px',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px',
                border: '1px solid rgba(96, 165, 250, 0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Lock size={18} color="#60a5fa" />
                      <span style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
                        Autenticación de Dos Factores (2FA)
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#AFB3B7' }}>
                      Añade una capa adicional de seguridad a tu cuenta
                    </p>
                  </div>
                  <label style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: '52px',
                    height: '28px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) => setSecuritySettings({
                        ...securitySettings,
                        twoFactorAuth: e.target.checked
                      })}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: securitySettings.twoFactorAuth ? '#4ade80' : 'rgba(107, 114, 128, 0.3)',
                      transition: '0.4s',
                      borderRadius: '28px',
                      border: `1px solid ${securitySettings.twoFactorAuth ? '#4ade80' : 'rgba(107, 114, 128, 0.5)'}`
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: '20px',
                        width: '20px',
                        left: securitySettings.twoFactorAuth ? '28px' : '4px',
                        bottom: '3px',
                        background: '#ffffff',
                        transition: '0.4s',
                        borderRadius: '50%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }} />
                    </span>
                  </label>
                </div>
                {securitySettings.twoFactorAuth && (
                  <div style={{
                    padding: '16px',
                    background: 'rgba(96, 165, 250, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(96, 165, 250, 0.2)'
                  }}>
                    <p style={{ fontSize: '13px', color: '#60a5fa', marginBottom: '8px' }}>
                      ✓ Autenticación de dos factores activada
                    </p>
                    <button style={{
                      padding: '8px 16px',
                      background: 'rgba(96, 165, 250, 0.2)',
                      border: '1px solid rgba(96, 165, 250, 0.3)',
                      borderRadius: '8px',
                      color: '#60a5fa',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      Configurar Aplicación de Autenticación
                    </button>
                  </div>
                )}
              </div>

              {/* Session Timeout */}
              <div style={{
                padding: '24px',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Clock size={18} color="#c9a574" />
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
                    Tiempo de Sesión Inactiva
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '16px' }}>
                  Cierra sesión automáticamente después de un período de inactividad
                </p>
                <select
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings({
                    ...securitySettings,
                    sessionTimeout: parseInt(e.target.value)
                  })}
                  style={{
                    padding: '10px 16px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value={15}>15 minutos</option>
                  <option value={30}>30 minutos</option>
                  <option value={60}>1 hora</option>
                  <option value={120}>2 horas</option>
                  <option value={0}>Nunca</option>
                </select>
              </div>

              {/* Change Password */}
              <div style={{
                padding: '24px',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Shield size={18} color="#ef4444" />
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
                    Cambiar Contraseña
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '16px' }}>
                  Actualiza tu contraseña regularmente para mayor seguridad
                </p>
                <button style={{
                  padding: '10px 20px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                }}
                >
                  Cambiar Contraseña
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                onSaveNotification({
                  id: Date.now(),
                  type: 'success',
                  title: 'Seguridad Actualizada',
                  message: 'Tu configuración de seguridad se ha guardado',
                  time: 'Ahora',
                  read: false
                });
              }}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #c9a574 0%, #b8956a 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center',
                width: 'fit-content',
                marginLeft: 'auto',
                marginTop: '24px',
                boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(201, 165, 116, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 165, 116, 0.3)';
              }}
            >
              <Save size={16} />
              Guardar Configuración
            </button>
          </div>
        )}

        {/* Preferencias */}
        {configTab === 'preferences' && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
            border: '1px solid rgba(201, 165, 116, 0.2)',
            borderRadius: '16px',
            padding: '32px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
              Preferencias de la Aplicación
            </h2>
            <p style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '24px' }}>
              Personaliza la experiencia de uso
            </p>

            <div style={{ display: 'grid', gap: '20px' }}>
              {/* Idioma */}
              <div style={{
                padding: '20px',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px'
              }}>
                <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
                  Idioma
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="pt">Português</option>
                </select>
              </div>

              {/* Zona Horaria */}
              <div style={{
                padding: '20px',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px'
              }}>
                <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
                  Zona Horaria
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Europe/Madrid">Europa/Madrid (GMT+1)</option>
                  <option value="America/New_York">América/Nueva York (GMT-5)</option>
                  <option value="America/Los_Angeles">América/Los Ángeles (GMT-8)</option>
                  <option value="America/Mexico_City">América/Ciudad de México (GMT-6)</option>
                </select>
              </div>

              {/* Formato de Moneda */}
              <div style={{
                padding: '20px',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px'
              }}>
                <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
                  Formato de Moneda
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="EUR">Euro (€)</option>
                  <option value="USD">Dólar Estadounidense ($)</option>
                  <option value="GBP">Libra Esterlina (£)</option>
                  <option value="MXN">Peso Mexicano (MXN)</option>
                </select>
              </div>

              {/* Info Box */}
              <div style={{
                padding: '20px',
                background: 'rgba(96, 165, 250, 0.1)',
                border: '1px solid rgba(96, 165, 250, 0.3)',
                borderRadius: '12px',
                display: 'flex',
                gap: '12px'
              }}>
                <Info size={20} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ fontSize: '14px', color: '#60a5fa', fontWeight: '600', marginBottom: '4px' }}>
                    Nota Importante
                  </p>
                  <p style={{ fontSize: '13px', color: '#AFB3B7', lineHeight: '1.5' }}>
                    Los cambios en las preferencias de idioma, zona horaria y formato de moneda se aplicarán en toda la aplicación después de guardar.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onSaveNotification({
                  id: Date.now(),
                  type: 'success',
                  title: 'Preferencias Guardadas',
                  message: 'Tus preferencias se han actualizado correctamente',
                  time: 'Ahora',
                  read: false
                });
              }}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #c9a574 0%, #b8956a 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center',
                width: 'fit-content',
                marginLeft: 'auto',
                marginTop: '24px',
                boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(201, 165, 116, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 165, 116, 0.3)';
              }}
            >
              <Save size={16} />
              Guardar Preferencias
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
