# 🚀 Guía de Deployment - BIGARTIST ROYALTIES

## 📋 Scripts Disponibles

Se han creado 3 scripts de deployment según tu infraestructura:

### 1️⃣ **deploy.sh** - Script Completo (Recomendado)
Script robusto con verificaciones y opciones avanzadas.

### 2️⃣ **deploy-simple.sh** - Script Simple
Script minimalista para deployment rápido con SSH/rsync.

### 3️⃣ **deploy-ftp.sh** - Script FTP
Para servidores que solo permiten acceso FTP.

---

## 🔧 Configuración Inicial

### Opción A: SSH/Rsync (Recomendado)

**1. Edita el archivo `deploy.sh` o `deploy-simple.sh`:**

```bash
# Editar estas líneas con tus datos reales
SERVER_USER="tu_usuario"          # Tu usuario SSH
SERVER_HOST="app.bigartist.es"    # Tu dominio
SERVER_PORT="22"                   # Puerto SSH (normalmente 22)
SERVER_PATH="/var/www/bigartist"   # Ruta donde está la web
```

**2. Dale permisos de ejecución:**

```bash
chmod +x deploy.sh
# o
chmod +x deploy-simple.sh
```

**3. Ejecuta el script:**

```bash
./deploy.sh
# o
./deploy-simple.sh
```

---

### Opción B: FTP

**1. Instala lftp (si no lo tienes):**

```bash
# Ubuntu/Debian
sudo apt-get install lftp

# macOS
brew install lftp
```

**2. Edita el archivo `deploy-ftp.sh`:**

```bash
FTP_HOST="app.bigartist.es"
FTP_USER="tu_usuario_ftp"
FTP_PASS="tu_contraseña_ftp"
FTP_DIR="/public_html"  # O la ruta de tu hosting
```

**3. Dale permisos y ejecuta:**

```bash
chmod +x deploy-ftp.sh
./deploy-ftp.sh
```

---

## 🔐 Autenticación SSH con Clave (Más Seguro)

### Generar par de claves SSH:

```bash
ssh-keygen -t rsa -b 4096 -C "tu_email@ejemplo.com"
```

### Copiar clave pública al servidor:

```bash
ssh-copy-id -p 22 usuario@app.bigartist.es
```

### Usar en el script:

```bash
# En deploy.sh, descomentar y configurar:
SSH_KEY="~/.ssh/id_rsa"
```

---

## 📦 Estructura de Carpetas en el Servidor

Tu servidor debe tener una estructura similar a:

```
/var/www/bigartist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── ...
```

---

## ⚙️ Configuración de Nginx (Si aplica)

Archivo de configuración típico para React SPA:

```nginx
server {
    listen 80;
    server_name app.bigartist.es;

    root /var/www/bigartist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache de assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Después de editar, reinicia Nginx:

```bash
sudo systemctl restart nginx
```

---

## 🔄 Reiniciar Servicios Automáticamente

En `deploy.sh`, descomenta según tu servidor:

### Para Nginx:
```bash
$SSH_CMD $SERVER_USER@$SERVER_HOST "sudo systemctl restart nginx"
```

### Para Apache:
```bash
$SSH_CMD $SERVER_USER@$SERVER_HOST "sudo systemctl restart apache2"
```

### Para PM2 (backend Node.js):
```bash
$SSH_CMD $SERVER_USER@$SERVER_HOST "cd $SERVER_PATH && pm2 restart all"
```

---

## ✅ Checklist Pre-Deployment

- [ ] Configuré las credenciales del servidor en el script
- [ ] Verifiqué la ruta correcta en el servidor
- [ ] El proyecto compila localmente sin errores (`npm run build`)
- [ ] Tengo acceso SSH/FTP al servidor
- [ ] Hice backup de la versión anterior
- [ ] El servidor tiene Node.js instalado (si es necesario)
- [ ] Configuré correctamente el archivo `.env` en el servidor

---

## 🐛 Solución de Problemas

### Error: "Permission denied"
```bash
# Dar permisos al script
chmod +x deploy.sh
```

### Error: "Connection refused"
```bash
# Verificar que el puerto SSH es correcto (normalmente 22)
# Verificar que puedes conectarte manualmente:
ssh usuario@app.bigartist.es
```

### Error: "rsync: command not found"
```bash
# Instalar rsync
sudo apt-get install rsync  # Ubuntu/Debian
brew install rsync          # macOS
```

### La página muestra en blanco después del deployment
- Verifica que la ruta base en `vite.config.ts` sea correcta
- Comprueba la consola del navegador para errores
- Verifica que todos los archivos se subieron correctamente

---

## 📝 Deployment Manual (Sin scripts)

Si prefieres hacerlo paso a paso:

### 1. Build local:
```bash
npm install
npm run build
```

### 2. Subir archivos:
```bash
# Con rsync
rsync -avz --delete dist/ usuario@app.bigartist.es:/var/www/bigartist/

# O con scp
scp -r dist/* usuario@app.bigartist.es:/var/www/bigartist/
```

### 3. Verificar:
```bash
# Conectarse al servidor
ssh usuario@app.bigartist.es

# Verificar archivos
ls -la /var/www/bigartist/
```

---

## 🎯 Variables de Entorno en Producción

Si tu aplicación usa variables de entorno:

1. Crea archivo `.env.production` localmente:
```env
VITE_API_URL=https://app.bigartist.es/api
VITE_ENV=production
```

2. El build las incluirá automáticamente

---

## 📞 Soporte

Si tienes problemas con el deployment:

1. Verifica los logs del servidor
2. Comprueba que la carpeta `dist/` se generó correctamente
3. Verifica permisos de archivos en el servidor
4. Revisa la configuración de tu servidor web (Nginx/Apache)

---

**¡Listo para deployment! 🚀**
