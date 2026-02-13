# 🚀 CÓMO APLICAR LAS MEJORAS - GUÍA RÁPIDA

**Tiempo estimado:** 10-15 minutos

---

## 📋 CHECKLIST RÁPIDO

```
[ ] 1. Instalar dependencias nuevas en backend
[ ] 2. Configurar variables de entorno
[ ] 3. Crear carpeta de logs
[ ] 4. Reiniciar backend
[ ] 5. Verificar que todo funciona
```

---

## 1️⃣ INSTALAR DEPENDENCIAS DEL BACKEND

```bash
cd backend
npm install express-rate-limit@7.1.5 winston@3.11.0
```

**Resultado esperado:**
```
✅ added 2 packages
```

---

## 2️⃣ CONFIGURAR VARIABLES DE ENTORNO

### **Frontend:**
```bash
# Desde la raíz del proyecto
cp .env.example .env
```

**Editar `.env`:**
```bash
# Para desarrollo local
VITE_API_URL=http://localhost:5000/api

# O para producción
# VITE_API_URL=http://94.143.141.241/api
```

### **Backend:**
```bash
cd backend
cp .env.example .env
```

**Editar `backend/.env`:**
```bash
PORT=5000

# Base de datos
DB_HOST=localhost
DB_USER=bigartist_user
DB_PASSWORD=TU_PASSWORD_AQUI
DB_NAME=bigartist_royalties

# JWT Secret (genera uno único)
JWT_SECRET=CAMBIA_ESTO_POR_UN_SECRET_SEGURO

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Entorno
NODE_ENV=development
```

**💡 Generar JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 3️⃣ CREAR CARPETA DE LOGS

```bash
cd backend
mkdir -p logs
```

---

## 4️⃣ REINICIAR SERVICIOS

### **Backend:**
```bash
cd backend
npm run dev
```

**Deberías ver:**
```
==================================================
🎵 BIGARTIST ROYALTIES API
==================================================
✅ Servidor corriendo en puerto 5000
🌍 Entorno: development
📊 Base de datos: bigartist_royalties
🔗 Health check: http://localhost:5000/api/health
==================================================
```

### **Frontend:**
```bash
# En otra terminal, desde la raíz
npm run dev
```

---

## 5️⃣ VERIFICAR QUE TODO FUNCIONA

### ✅ **Test 1: Variables de entorno**
Abre el navegador y en la consola deberías ver:
```
🔗 API URL: http://localhost:5000/api
```

### ✅ **Test 2: Rate Limiting**
```bash
# Hacer varias peticiones rápidas (más de 100 en 15 min)
# Debería bloquearse después de 100
curl http://localhost:5000/api/health
```

### ✅ **Test 3: Logging**
Verifica que se crean los archivos:
```bash
ls backend/logs/
# Deberías ver: combined.log  error.log
```

### ✅ **Test 4: Validación IBAN**
En tu código, prueba:
```typescript
import { validateIBAN } from './utils/validation';

const result = validateIBAN('ES91 2100 0418 4502 0005 1332');
console.log(result); // { valid: true }
```

### ✅ **Test 5: Contratos API**
```bash
# Primero login para obtener token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}'

# Copiar el token y listar contratos
curl http://localhost:5000/api/contracts \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 🎨 USO DE LOS NUEVOS CUSTOM HOOKS

### **Ejemplo 1: useNotifications**
```typescript
import { useNotifications } from './hooks/useNotifications';

function MyComponent() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead 
  } = useNotifications(true, 30000); // auto-refresh cada 30s

  return (
    <div>
      <p>No leídas: {unreadCount}</p>
      {notifications.map(n => (
        <div key={n.id} onClick={() => markAsRead(n.id)}>
          {n.title}
        </div>
      ))}
    </div>
  );
}
```

### **Ejemplo 2: useContracts**
```typescript
import { useContracts } from './hooks/useContracts';

function ContractsPanel() {
  const { 
    contracts, 
    loading, 
    createContract 
  } = useContracts();

  const handleCreate = async () => {
    const result = await createContract({
      artistId: 1,
      percentage: 70,
      startDate: '2024-01-01',
      endDate: '2026-12-31',
      serviceType: 'Distribución',
      status: 'active'
    });
    
    if (result.success) {
      console.log('Contrato creado!');
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {contracts.map(c => (
        <div key={c.id}>{c.artistName} - {c.percentage}%</div>
      ))}
    </div>
  );
}
```

### **Ejemplo 3: usePaymentRequests con validación**
```typescript
import { usePaymentRequests } from './hooks/usePaymentRequests';

function PaymentForm() {
  const { createPaymentRequest } = usePaymentRequests();

  const handleSubmit = (data) => {
    const result = createPaymentRequest({
      artistId: data.artistId,
      artistName: data.artistName,
      artistPhoto: data.photo,
      firstName: data.firstName,
      lastName: data.lastName,
      amount: parseFloat(data.amount),
      method: 'Transferencia Bancaria',
      accountNumber: data.iban // Se valida automáticamente
    });

    if (!result.success) {
      alert(result.error); // Mostrará error de validación IBAN
    } else {
      alert('Solicitud creada!');
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### **Ejemplo 4: useScrollHeader**
```typescript
import { useScrollHeader } from './hooks/useScrollHeader';

function Header() {
  const { isScrolled, showHeader } = useScrollHeader(50, 100);

  return (
    <header 
      className={`
        ${isScrolled ? 'bg-dark shadow-lg' : 'bg-transparent'} 
        ${showHeader ? 'translate-y-0' : '-translate-y-full'}
        transition-all duration-300
      `}
    >
      Logo y navegación
    </header>
  );
}
```

### **Ejemplo 5: useAudioPlayer**
```typescript
import { useAudioPlayer } from './hooks/useAudioPlayer';

function TrackPlayer({ tracks }) {
  const { 
    playingTrackId, 
    isPlaying, 
    playTrack,
    currentTime,
    duration,
    formatTime
  } = useAudioPlayer();

  return (
    <div>
      {tracks.map(track => (
        <div key={track.id}>
          <button onClick={() => playTrack(track.id, track.audioUrl)}>
            {playingTrackId === track.id && isPlaying ? '⏸' : '▶'}
          </button>
          <span>{track.title}</span>
          {playingTrackId === track.id && (
            <div>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## 🔧 TROUBLESHOOTING

### **Problema: "Module not found: express-rate-limit"**
**Solución:**
```bash
cd backend
npm install express-rate-limit winston
```

### **Problema: "Cannot create logs directory"**
**Solución:**
```bash
cd backend
mkdir logs
chmod 755 logs
```

### **Problema: "VITE_API_URL is undefined"**
**Solución:**
```bash
# Verifica que existe .env en la raíz
ls -la .env

# Si no existe
cp .env.example .env

# Reinicia el servidor de Vite
npm run dev
```

### **Problema: "JWT_SECRET not found"**
**Solución:**
```bash
cd backend
# Verifica que existe .env
ls -la .env

# Si no existe
cp .env.example .env
# Edita .env y agrega un JWT_SECRET
```

### **Problema: Rate limiting bloquea durante desarrollo**
**Solución temporal:**
```javascript
// En backend/server.js, aumenta los límites para desarrollo
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Aumentado de 100 a 1000 para desarrollo
  // ...
});
```

---

## 📚 DOCUMENTACIÓN RELACIONADA

- **`/MEJORAS_IMPLEMENTADAS.md`** - Detalles técnicos de todas las mejoras
- **`/EVALUACION_SISTEMA.md`** - Evaluación completa del sistema
- **`/backend/.env.example`** - Todas las variables disponibles
- **`/.env.example`** - Variables del frontend

---

## ✅ CHECKLIST FINAL

Marca cuando completes cada paso:

```
✅ Dependencias instaladas (express-rate-limit, winston)
✅ .env creado y configurado (frontend)
✅ backend/.env creado y configurado
✅ Carpeta backend/logs creada
✅ Backend reiniciado sin errores
✅ Frontend reiniciado sin errores
✅ Test de variables de entorno OK
✅ Test de rate limiting OK
✅ Test de logging OK (archivos creados)
✅ Test de validación IBAN OK
✅ Test de API de contratos OK
```

---

## 🎉 ¡LISTO!

Tu sistema ahora tiene:
- ✅ Variables de entorno configurables
- ✅ Validación IBAN real con algoritmo módulo 97
- ✅ Rate limiting en 3 niveles
- ✅ Logging profesional con Winston
- ✅ Backend de contratos completo
- ✅ Custom hooks para código modular

**¡De 8.5/10 a 9.5/10!** 🚀

---

**¿Necesitas ayuda?** Consulta `/MEJORAS_IMPLEMENTADAS.md` para más detalles técnicos.
