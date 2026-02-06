# 🚀 Guía Completa de Despliegue - BIGARTIST ROYALTIES

## 📋 Requisitos Previos

- Servidor con Ubuntu/Debian (VPS, DigitalOcean, AWS, etc.)
- Dominio configurado: **app.bigartist.es**
- Acceso SSH al servidor
- Node.js 18+ instalado
- MySQL 8.0+ instalado

---

## PARTE 1: Configurar MySQL en el Servidor

### 1.1. Instalar MySQL
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar MySQL
sudo apt install mysql-server -y

# Iniciar servicio
sudo systemctl start mysql
sudo systemctl enable mysql

# Configurar seguridad (establecer contraseña root)
sudo mysql_secure_installation
```

### 1.2. Crear Base de Datos
```bash
# Conectar a MySQL
sudo mysql -u root -p

# En el prompt de MySQL:
CREATE DATABASE bigartist_royalties CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Crear usuario para la aplicación (CAMBIA LA CONTRASEÑA)
CREATE USER 'bigartist_user'@'localhost' IDENTIFIED BY 'TU_CONTRASEÑA_SEGURA';

# Dar permisos
GRANT ALL PRIVILEGES ON bigartist_royalties.* TO 'bigartist_user'@'localhost';
FLUSH PRIVILEGES;

# Salir
EXIT;
```

### 1.3. Importar Schema
```bash
# Copiar el archivo schema.sql a tu servidor (vía SCP o FTP)
# Luego ejecutar:
mysql -u bigartist_user -p bigartist_royalties < /ruta/a/schema.sql
```

### 1.4. Verificar Tablas
```bash
mysql -u bigartist_user -p bigartist_royalties

# En MySQL:
SHOW TABLES;

# Deberías ver:
# - users
# - artists
# - tracks
# - platforms
# - royalties
# - monthly_stats
# - platform_monthly_stats
# - contracts
# - csv_uploads
```

---

## PARTE 2: Configurar Backend Node.js

### 2.1. Estructura del Proyecto
```bash
# En tu servidor
cd /var/www
sudo mkdir bigartist-backend
sudo chown $USER:$USER bigartist-backend
cd bigartist-backend

# Inicializar proyecto
npm init -y
```

### 2.2. Instalar Dependencias
```bash
npm install express mysql2 bcrypt jsonwebtoken cors dotenv multer csv-parser
npm install -D nodemon
```

### 2.3. Crear Variables de Entorno
```bash
# Crear archivo .env
nano .env
```

Contenido del `.env`:
```env
# Base de datos
DB_HOST=localhost
DB_USER=bigartist_user
DB_PASSWORD=TU_CONTRASEÑA_SEGURA
DB_NAME=bigartist_royalties

# JWT
JWT_SECRET=tu_clave_secreta_muy_muy_segura_cambiar_esto

# Puerto
PORT=3000

# Entorno
NODE_ENV=production
```

### 2.4. Crear Estructura de Archivos

Copia todo el código del archivo `/database/API_ENDPOINTS.md` para implementar:

```
bigartist-backend/
├── config/
│   └── database.js          # Conexión MySQL
├── middleware/
│   └── auth.js              # Middleware JWT
├── routes/
│   ├── auth.js              # Login
│   ├── artists.js           # CRUD artistas
│   ├── tracks.js            # CRUD tracks
│   ├── csv.js               # Upload CSV (IMPORTANTE)
│   ├── dashboard.js         # Estadísticas
│   └── contracts.js         # Contratos
├── uploads/                 # Carpeta temporal CSVs
├── .env                     # Variables entorno
├── package.json
└── server.js                # Servidor principal
```

### 2.5. Instalar PM2 (Process Manager)
```bash
sudo npm install -g pm2

# Iniciar servidor
pm2 start server.js --name "bigartist-api"

# Configurar para iniciar con el sistema
pm2 startup
pm2 save

# Ver logs
pm2 logs bigartist-api

# Estado
pm2 status
```

---

## PARTE 3: Configurar NGINX (Reverse Proxy)

### 3.1. Instalar NGINX
```bash
sudo apt install nginx -y
```

### 3.2. Configurar Virtual Host
```bash
sudo nano /etc/nginx/sites-available/bigartist
```

Contenido:
```nginx
server {
    listen 80;
    server_name app.bigartist.es;

    # Frontend - archivos estáticos
    root /var/www/bigartist-frontend/dist;
    index index.html;

    # API Backend
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend - SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Aumentar tamaño máximo de archivos (para CSVs grandes)
    client_max_body_size 50M;
}
```

### 3.3. Activar Sitio
```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/bigartist /etc/nginx/sites-enabled/

# Remover default
sudo rm /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Reiniciar NGINX
sudo systemctl restart nginx
```

### 3.4. Configurar SSL con Let's Encrypt
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL
sudo certbot --nginx -d app.bigartist.es

# Renovación automática (ya viene configurada)
sudo certbot renew --dry-run
```

---

## PARTE 4: Desplegar Frontend React

### 4.1. Compilar Frontend
```bash
# En tu máquina local, dentro del proyecto de React
npm run build

# Se genera carpeta dist/ o build/
```

### 4.2. Subir a Servidor
```bash
# Desde tu máquina local
scp -r dist/* usuario@tu-servidor:/var/www/bigartist-frontend/
```

O usando Git:
```bash
# En el servidor
cd /var/www
sudo mkdir bigartist-frontend
sudo chown $USER:$USER bigartist-frontend
cd bigartist-frontend

# Clonar repo
git clone https://github.com/AritzArrieta1987/Appweb.git .

# Instalar dependencias
npm install

# Compilar
npm run build

# Los archivos estarán en dist/ (Vite) o build/ (CRA)
```

### 4.3. Actualizar API URL

En `/config/api.ts`, asegúrate de que la URL de producción esté correcta:
```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://app.bigartist.es/api'  // ✅ Correcto
  : 'http://localhost:3000/api';
```

---

## PARTE 5: Configurar Firewall

```bash
# Permitir SSH, HTTP, HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Verificar
sudo ufw status
```

---

## PARTE 6: Crear Usuario Admin Inicial

```bash
# Conectar a MySQL
mysql -u bigartist_user -p bigartist_royalties

# Crear hash de contraseña (usa Node.js)
node -e "console.log(require('bcrypt').hashSync('admin123', 10))"

# Copiar el hash generado (ej: $2b$10$abcd...)

# En MySQL:
INSERT INTO users (email, password_hash, role) 
VALUES ('admin@bigartist.es', '$2b$10$HASH_AQUI', 'admin');

EXIT;
```

---

## PARTE 7: Conectar Frontend con Backend

Ahora debes actualizar el frontend para usar la API real en lugar del contexto local.

### 7.1. Actualizar DataContext

El `DataContext` actual guarda todo en memoria. Necesitamos cambiarlo para que llame a la API:

```typescript
// /components/DataContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../config/api';

// ... tipos existentes ...

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData>({...});
  const [loading, setLoading] = useState(true);

  // Cargar datos iniciales desde la API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar en paralelo
      const [artistsData, tracksData, dashboardStats] = await Promise.all([
        api.getArtists(),
        api.getTracks(),
        api.getDashboardStats()
      ]);
      
      setArtists(artistsData);
      setTracks(tracksData);
      setDashboardData(dashboardStats);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCSVData = async (files: File[]) => {
    // Subir archivos a la API
    for (const file of files) {
      await api.uploadCSV(file);
    }
    
    // Recargar datos
    await loadData();
  };

  return (
    <DataContext.Provider value={{ artists, tracks, dashboardData, addCSVData, loading }}>
      {children}
    </DataContext.Provider>
  );
};
```

### 7.2. Actualizar CSVUploader

El componente `CSVUploader` debe enviar archivos a la API:

```typescript
// /components/CSVUploader.tsx
import { uploadCSV } from '../config/api';

// En handleFileUpload:
const handleFileUpload = async (files: FileList) => {
  setProcessing(true);
  setError(null);
  
  try {
    for (const file of Array.from(files)) {
      const response = await uploadCSV(file);
      console.log('CSV procesado:', response);
    }
    
    // Recargar datos del contexto
    await loadData(); // Llamar función del contexto
    
    setSuccess(true);
  } catch (error) {
    setError(error.message);
  } finally {
    setProcessing(false);
  }
};
```

---

## ✅ CHECKLIST FINAL DE DESPLIEGUE

### Backend
- [ ] MySQL instalado y configurado
- [ ] Base de datos creada con schema.sql
- [ ] Usuario de base de datos creado
- [ ] Dependencias npm instaladas
- [ ] Variables de entorno configuradas (.env)
- [ ] Todos los endpoints implementados
- [ ] Endpoint CSV upload implementado y testeado
- [ ] PM2 configurado y servidor corriendo
- [ ] Usuario admin inicial creado

### Frontend
- [ ] Código compilado (npm run build)
- [ ] Archivos subidos al servidor
- [ ] API URL actualizada en /config/api.ts
- [ ] DataContext actualizado para usar API
- [ ] CSVUploader actualizado para usar API

### Servidor
- [ ] NGINX instalado y configurado
- [ ] Virtual host configurado
- [ ] SSL/HTTPS configurado (Let's Encrypt)
- [ ] Firewall configurado (ufw)
- [ ] Dominio app.bigartist.es apuntando al servidor

### Pruebas
- [ ] Login funciona
- [ ] Dashboard carga estadísticas
- [ ] Artistas se muestran correctamente
- [ ] Catálogo se muestra correctamente
- [ ] Subir CSV procesa y guarda en base de datos
- [ ] Dashboard se actualiza después de subir CSV
- [ ] SSL válido (candado verde en navegador)

---

## 🔧 COMANDOS ÚTILES

```bash
# Ver logs del backend
pm2 logs bigartist-api

# Reiniciar backend
pm2 restart bigartist-api

# Ver logs de NGINX
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Reiniciar NGINX
sudo systemctl restart nginx

# Ver logs de MySQL
sudo tail -f /var/log/mysql/error.log

# Backup de base de datos
mysqldump -u bigartist_user -p bigartist_royalties > backup_$(date +%Y%m%d).sql

# Restaurar backup
mysql -u bigartist_user -p bigartist_royalties < backup_20240101.sql
```

---

## 🆘 TROUBLESHOOTING

### Error: Cannot connect to MySQL
```bash
# Verificar que MySQL esté corriendo
sudo systemctl status mysql

# Verificar conexión
mysql -u bigartist_user -p bigartist_royalties
```

### Error: CORS
Asegúrate de tener configurado CORS en tu backend:
```javascript
// server.js
app.use(cors({
  origin: 'https://app.bigartist.es',
  credentials: true
}));
```

### Error: 502 Bad Gateway
```bash
# Verificar que el backend esté corriendo
pm2 status

# Verificar que esté escuchando en el puerto correcto
netstat -tulpn | grep 3000
```

### Error: CSV no se procesa
```bash
# Ver logs
pm2 logs bigartist-api

# Verificar permisos de carpeta uploads/
ls -la uploads/
chmod 755 uploads/
```

---

## 📞 CONTACTO

Para cualquier duda durante el despliegue, revisa:
- Logs de PM2: `pm2 logs`
- Logs de NGINX: `/var/log/nginx/`
- Consola del navegador (F12)
