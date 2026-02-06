# 🚀 INSTALACIÓN RÁPIDA - Backend BIGARTIST

## 📋 Paso 1: Instalar Dependencias

```bash
cd backend
npm install
```

## 🗄️ Paso 2: Configurar MySQL

### 2.1. Crear base de datos
```bash
mysql -u root -p
```

En MySQL:
```sql
CREATE DATABASE bigartist_royalties CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'bigartist_user'@'localhost' IDENTIFIED BY 'tu_password_seguro';
GRANT ALL PRIVILEGES ON bigartist_royalties.* TO 'bigartist_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2.2. Importar schema
```bash
mysql -u bigartist_user -p bigartist_royalties < ../database/schema.sql
```

## ⚙️ Paso 3: Configurar Variables de Entorno

```bash
cp .env.example .env
nano .env
```

Editar el archivo `.env`:
```env
DB_HOST=localhost
DB_USER=bigartist_user
DB_PASSWORD=tu_password_real
DB_NAME=bigartist_royalties
JWT_SECRET=genera_una_clave_secreta_larga_y_aleatoria
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://app.bigartist.es
```

## 👤 Paso 4: Crear Usuario Admin

```bash
npm run create-admin
```

Esto creará un usuario:
- **Email**: `admin@bigartist.es`
- **Password**: `admin123`

⚠️ **IMPORTANTE**: Cambia esta contraseña después del primer login!

## 🚀 Paso 5: Iniciar Servidor

### Modo desarrollo (con nodemon):
```bash
npm run dev
```

### Modo producción (con PM2):
```bash
npm install -g pm2
pm2 start server.js --name "bigartist-api"
pm2 startup
pm2 save
```

## ✅ Paso 6: Verificar Funcionamiento

```bash
curl http://localhost:3000/api/health
```

Deberías ver:
```json
{
  "success": true,
  "message": "BIGARTIST API funcionando correctamente",
  "timestamp": "2026-02-06T..."
}
```

## 📤 Paso 7: Probar Upload de CSV

### Desde el frontend:
1. Hacer login con `admin@bigartist.es` / `admin123`
2. Ir a la sección de CSV Upload
3. Subir un archivo CSV formato The Orchard
4. Ver estadísticas actualizadas en el Dashboard

### Desde curl (prueba manual):
```bash
# 1. Login y obtener token
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bigartist.es","password":"admin123"}' \
  | jq -r '.token')

# 2. Subir CSV
curl -X POST http://localhost:3000/api/csv/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "csvFile=@/ruta/a/tu/archivo.csv"

# 3. Ver estadísticas
curl http://localhost:3000/api/dashboard/stats \
  -H "Authorization: Bearer $TOKEN"
```

## 📊 Endpoints Disponibles

```
POST   /api/auth/login          - Login
GET    /api/dashboard/stats     - Estadísticas dashboard
GET    /api/artists             - Lista de artistas
GET    /api/tracks              - Lista de tracks
POST   /api/csv/upload          - Subir CSV
GET    /api/csv/history         - Historial de CSVs
GET    /api/health              - Health check
```

## 🔧 Comandos Útiles

```bash
# Ver logs de PM2
pm2 logs bigartist-api

# Reiniciar servidor
pm2 restart bigartist-api

# Ver estado
pm2 status

# Detener servidor
pm2 stop bigartist-api

# Backup de base de datos
mysqldump -u bigartist_user -p bigartist_royalties > backup_$(date +%Y%m%d).sql
```

## 🐛 Troubleshooting

### Error: Cannot connect to MySQL
```bash
# Verificar que MySQL esté corriendo
sudo systemctl status mysql
sudo systemctl start mysql
```

### Error: ER_NOT_SUPPORTED_AUTH_MODE
```sql
ALTER USER 'bigartist_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tu_password';
FLUSH PRIVILEGES;
```

### Error: Cannot find module
```bash
npm install
```

### Error: EADDRINUSE (puerto ocupado)
```bash
# Cambiar el puerto en .env
PORT=3001
```

## 📁 Estructura del Proyecto

```
backend/
├── config/
│   └── database.js          # Conexión MySQL
├── middleware/
│   └── auth.js              # JWT middleware
├── routes/
│   ├── auth.js              # Login
│   ├── csv.js               # Upload CSV ⭐
│   ├── dashboard.js         # Estadísticas
│   ├── artists.js           # CRUD artistas
│   └── tracks.js            # CRUD tracks
├── scripts/
│   └── createAdmin.js       # Crear usuario admin
├── uploads/                 # Archivos CSV temporales
├── .env                     # Variables de entorno
├── .env.example             # Ejemplo de .env
├── package.json
└── server.js                # Servidor principal
```

## 🎯 Próximos Pasos

1. ✅ Backend instalado y corriendo
2. ✅ Base de datos MySQL configurada
3. ✅ Usuario admin creado
4. 📱 Configurar frontend para conectar a la API
5. 🌍 Desplegar en servidor de producción
6. 🔒 Configurar SSL/HTTPS
7. 🔐 Cambiar contraseña admin por defecto

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs: `pm2 logs bigartist-api`
2. Verifica conexión MySQL: `mysql -u bigartist_user -p`
3. Verifica puerto: `netstat -tulpn | grep 3000`
4. Revisa variables de entorno: `cat .env`
