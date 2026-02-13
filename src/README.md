# 🎵 BIGARTIST ROYALTIES

Sistema completo de gestión de royalties musicales con frontend en React y backend en Node.js/Express + MySQL.

![Version](https://img.shields.io/badge/version-2.1.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.3.1-blue)

---

## ✨ Características Principales

### 🎯 **Gestión Completa**
- ✅ **Dashboard con estadísticas en tiempo real** - Gráficos y métricas
- ✅ **Procesamiento CSV The Orchard** - Carga y análisis automático
- ✅ **Gestión de artistas con fotos** - CRUD completo
- ✅ **Catálogo musical con audio** - Reproductor integrado
- ✅ **Mapa mundial interactivo** - Datos por territorio
- ✅ **Sistema de contratos** - Backend completo con validaciones
- ✅ **Cálculo automático de royalties** - Por artista, track y plataforma
- ✅ **Portal para artistas** - Vista independiente para cada artista
- ✅ **Sistema de notificaciones** - Con auto-refresh opcional
- ✅ **Pagos con validación IBAN** - Algoritmo módulo 97

### 🔒 **Seguridad**
- ✅ **Autenticación JWT** - Tokens seguros
- ✅ **Rate Limiting** - Protección contra abuse (3 niveles)
- ✅ **Validaciones reales** - IBAN, emails, teléfonos
- ✅ **Variables de entorno** - Configuración segura
- ✅ **Logging profesional** - Winston con rotación

### 🎨 **Diseño Premium**
- ✅ **Estética Sony Music/Universal** - Diseño profesional
- ✅ **Colores corporativos** - #2a3f3f + #c9a574
- ✅ **Responsive completo** - Desktop + Mobile
- ✅ **Bottom navigation móvil** - Automático <768px
- ✅ **Animaciones suaves** - Transiciones fluidas

### 🛠️ **Arquitectura**
- ✅ **Frontend modular** - Custom hooks reutilizables
- ✅ **Backend escalable** - Rutas modulares + middleware
- ✅ **Base de datos optimizada** - 10 tablas + stored procedures
- ✅ **API RESTful** - Endpoints bien documentados

---

## 📊 Puntuación: 9.5/10

**Mejoras recientes (v2.1.0):**
- ✅ Variables de entorno configurables
- ✅ Validación IBAN real (algoritmo módulo 97)
- ✅ Rate limiting en 3 niveles
- ✅ Sistema de logging con Winston
- ✅ Backend de contratos completo
- ✅ Custom hooks para código modular

---

## 🚀 Inicio Rápido

### **1. Requisitos Previos**
```bash
Node.js >= 16.0.0
MySQL >= 8.0
npm >= 7.0.0
```

### **2. Instalación Frontend**
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/bigartist-royalties.git
cd bigartist-royalties

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Iniciar desarrollo
npm run dev
```

### **3. Instalación Backend**
```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales de MySQL

# Crear base de datos
mysql -u root -p < database/schema.sql

# Crear usuario admin
npm run create-admin

# Iniciar servidor
npm run dev
```

### **4. Acceso**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Admin: `admin@bigartist.es` / `admin123`

---

## 📁 Estructura del Proyecto

```
bigartist-royalties/
├── 📂 components/          # Componentes React
│   ├── CSVUploader.tsx
│   ├── WorldMap.tsx
│   ├── ArtistPortal.tsx
│   ├── FinancesPanel.tsx
│   └── ...
├── 📂 hooks/               # Custom Hooks ⭐ NUEVO
│   ├── useNotifications.ts
│   ├── useContracts.ts
│   ├── usePaymentRequests.ts
│   ├── useScrollHeader.ts
│   └── useAudioPlayer.ts
├── 📂 utils/               # Utilidades ⭐ NUEVO
│   └── validation.ts       # Validaciones IBAN, email, etc
├── 📂 config/
│   └── api.ts              # Configuración API
├── 📂 backend/
│   ├── 📂 config/
│   │   ├── database.js
│   │   └── logger.js       # ⭐ NUEVO Winston logger
│   ├── 📂 routes/
│   │   ├── auth.js
│   │   ├── artists.js
│   │   ├── tracks.js
│   │   ├── csv.js
│   │   ├── dashboard.js
│   │   ├── notifications.js
│   │   └── contracts.js    # ⭐ NUEVO CRUD completo
│   ├── 📂 middleware/
│   │   └── auth.js
│   ├── 📂 logs/            # ⭐ NUEVO Archivos de log
│   └── server.js           # ⭐ MEJORADO Rate limiting
├── 📂 database/
│   └── schema.sql
├── .env.example            # ⭐ NUEVO
├── App.tsx
├── DashboardSimple.tsx
└── package.json
```

---

## 🔧 Configuración

### **Variables de Entorno Frontend (`.env`)**
```bash
# URL del Backend API
VITE_API_URL=http://localhost:5000/api
```

### **Variables de Entorno Backend (`backend/.env`)**
```bash
# Puerto
PORT=5000

# Base de Datos
DB_HOST=localhost
DB_USER=bigartist_user
DB_PASSWORD=tu_password
DB_NAME=bigartist_royalties

# JWT Secret (generar con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=tu_jwt_secret_super_seguro

# CORS
FRONTEND_URL=http://localhost:5173

# Entorno
NODE_ENV=development
```

---

## 📡 API Endpoints

### **Autenticación**
```
POST   /api/auth/login              # Login con rate limiting (5/15min)
```

### **Dashboard**
```
GET    /api/dashboard/stats         # Estadísticas completas
```

### **Artistas**
```
GET    /api/artists                 # Listar todos
GET    /api/artists/:id             # Obtener uno
POST   /api/artists                 # Crear nuevo
PUT    /api/artists/:id             # Actualizar
DELETE /api/artists/:id             # Eliminar
```

### **Tracks**
```
GET    /api/tracks                  # Listar todos
GET    /api/tracks/:id              # Obtener uno
```

### **CSV Upload**
```
POST   /api/csv/upload              # Subir CSV (20/hora)
GET    /api/csv/history             # Historial de uploads
```

### **Contratos** ⭐ NUEVO
```
GET    /api/contracts               # Listar todos
GET    /api/contracts/:id           # Obtener uno
GET    /api/contracts/artist/:id    # Por artista
POST   /api/contracts               # Crear nuevo
PUT    /api/contracts/:id           # Actualizar
DELETE /api/contracts/:id           # Eliminar
```

### **Notificaciones**
```
GET    /api/notifications           # Listar todas
PUT    /api/notifications/:id/read  # Marcar como leída
PUT    /api/notifications/read-all  # Marcar todas
POST   /api/notifications           # Crear nueva
```

---

## 🎨 Custom Hooks Disponibles

### **useNotifications**
```typescript
const { 
  notifications, 
  unreadCount, 
  markAsRead,
  addNotification 
} = useNotifications(autoRefresh?, interval?);
```

### **useContracts**
```typescript
const { 
  contracts, 
  loading,
  createContract,
  updateContract,
  getContractsByArtist 
} = useContracts();
```

### **usePaymentRequests**
```typescript
const { 
  paymentRequests,
  createPaymentRequest,  // Con validación IBAN integrada
  getTotalPending 
} = usePaymentRequests();
```

### **useScrollHeader**
```typescript
const { 
  isScrolled, 
  showHeader 
} = useScrollHeader(threshold?, hideThreshold?);
```

### **useAudioPlayer**
```typescript
const { 
  playingTrackId,
  isPlaying,
  playTrack,
  pause,
  volume,
  changeVolume 
} = useAudioPlayer();
```

---

## 🔒 Seguridad

### **Rate Limiting**
- **API General:** 100 requests / 15 minutos
- **Login:** 5 intentos / 15 minutos
- **Uploads:** 20 archivos / 1 hora

### **Validaciones Implementadas**
- ✅ IBAN (algoritmo módulo 97 ISO 13616)
- ✅ Email (formato RFC 5322)
- ✅ Teléfono español (+34)
- ✅ Importes monetarios
- ✅ Porcentajes (0-100)
- ✅ Fechas y rangos

### **Logging**
- Archivos rotados automáticamente (5MB max)
- `backend/logs/combined.log` - Todos los logs
- `backend/logs/error.log` - Solo errores
- Metadata: IP, user agent, timestamps

---

## 📚 Documentación Adicional

- **[MEJORAS_IMPLEMENTADAS.md](./MEJORAS_IMPLEMENTADAS.md)** - Detalles de mejoras v2.1.0
- **[COMO_APLICAR_MEJORAS.md](./COMO_APLICAR_MEJORAS.md)** - Guía de aplicación
- **[EVALUACION_SISTEMA.md](./EVALUACION_SISTEMA.md)** - Evaluación técnica completa
- **[REVISION_COMPLETA.md](./REVISION_COMPLETA.md)** - Revisión de problemas
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guía de despliegue
- **[backend/README.md](./backend/README.md)** - Documentación del backend

---

## 🧪 Testing

```bash
# Frontend
npm run test

# Backend
cd backend
npm run test

# E2E (próximamente)
npm run test:e2e
```

---

## 🚀 Despliegue

### **Producción (Servidor Propio)**
```bash
# Ver guía completa en DEPLOYMENT.md

# Resumen rápido:
./deploy-from-github.sh
```

### **Variables de entorno en producción**
```bash
# Frontend
VITE_API_URL=https://api.bigartist.es/api

# Backend
NODE_ENV=production
DB_HOST=tu_servidor_mysql
JWT_SECRET=secret_super_seguro_produccion
```

---

## 📊 Stack Tecnológico

### **Frontend**
- React 18.3.1
- TypeScript
- Vite 6.0.3
- Recharts (gráficos)
- Lucide React (iconos)
- Tailwind CSS v4

### **Backend**
- Node.js 16+
- Express 4.18.2
- MySQL2 3.6.5
- JWT (jsonwebtoken)
- Bcrypt
- Winston (logging) ⭐ NUEVO
- Express Rate Limit ⭐ NUEVO

### **Base de Datos**
- MySQL 8.0+
- 10 tablas relacionadas
- Stored procedures
- Vistas optimizadas
- Índices en campos clave

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/AmazingFeature`
3. Commit: `git commit -m 'Add AmazingFeature'`
4. Push: `git push origin feature/AmazingFeature`
5. Abre un Pull Request

---

## 📝 Changelog

### **v2.1.0** (2025-02-12) - Mejoras de Calidad
- ✅ Variables de entorno configurables
- ✅ Validación IBAN real (algoritmo módulo 97)
- ✅ Rate limiting en 3 niveles
- ✅ Sistema de logging con Winston
- ✅ Backend de contratos completo (CRUD)
- ✅ Custom hooks para código modular
- ✅ Puntuación: 8.5/10 → 9.5/10

### **v2.0.0** (2025-02-10) - Sistema Completo
- ✅ Dashboard con estadísticas
- ✅ Procesamiento CSV completo
- ✅ WorldMap con datos reales
- ✅ Portal para artistas
- ✅ Sistema de notificaciones
- ✅ Gestión de pagos

---

## 📧 Contacto

**BIGARTIST ROYALTIES**
- Web: https://app.bigartist.es
- Email: info@bigartist.es

---

## 📄 Licencia

ISC License - Ver [LICENSE](./LICENSE) para más detalles

---

## 🙏 Agradecimientos

- The Orchard (formato CSV)
- Comunidad React
- Comunidad Node.js
- Todos los contribuidores

---

<div align="center">

**⭐ Si este proyecto te fue útil, por favor dale una estrella ⭐**

Hecho con ❤️ por el equipo de BIGARTIST

</div>
