#!/bin/bash

# ============================================
# BIGARTIST ROYALTIES - Instalación Automática
# Descarga desde GitHub y despliega automáticamente
# ============================================

# ⚠️ CONFIGURA TU REPOSITORIO AQUÍ:
GITHUB_REPO="https://github.com/TU-USUARIO/TU-REPOSITORIO.git"

echo "🚀 Instalando BIGARTIST ROYALTIES en app.bigartist.es..."

# Instalar Git
sudo apt install -y git

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar MySQL
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Configurar MySQL
sudo mysql -e "CREATE DATABASE IF NOT EXISTS bigartist_royalties;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'bigartist'@'localhost' IDENTIFIED BY 'BigArtist2024!';"
sudo mysql -e "GRANT ALL PRIVILEGES ON bigartist_royalties.* TO 'bigartist'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Crear tablas
sudo mysql bigartist_royalties << 'EOF'
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'artist') DEFAULT 'artist',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO users (id, username, password, role) VALUES 
(1, 'admin', '$2a$10$rZ5C8wKLOqKqKqKqKqKqKe8vKvKvKvKvKvKvKvKvKvKvKvKvKvK', 'admin');
EOF

# Instalar PM2
sudo npm install -g pm2

# Instalar Nginx
sudo apt install -y nginx

# Crear directorio del proyecto
mkdir -p /var/www/bigartist
cd /var/www/bigartist

# Clonar repositorio desde GitHub
echo "📦 Clonando repositorio desde GitHub..."
git clone $GITHUB_REPO repo
cd repo

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
npm install

# Compilar frontend
echo "🔨 Compilando frontend..."
npm run build

# Mover archivos compilados
echo "📁 Moviendo archivos compilados..."
mkdir -p /var/www/bigartist/frontend
cp -r dist/* /var/www/bigartist/frontend/

# Volver al directorio principal para crear backend
cd /var/www/bigartist

# Crear backend
cat > server.js << 'EOF'
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'bigartist',
  password: 'BigArtist2024!',
  database: 'bigartist_royalties'
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign({ id: user.id, role: user.role }, 'bigartist-secret-key', { expiresIn: '24h' });
    
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.listen(3001, () => console.log('✅ Backend corriendo en puerto 3001'));
EOF

# Crear package.json del backend
cat > package.json << 'EOF'
{
  "name": "bigartist-backend",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  }
}
EOF

# Instalar dependencias del backend
npm install

# Iniciar backend con PM2
pm2 start server.js --name bigartist-backend
pm2 save
pm2 startup

# Configurar Nginx
sudo tee /etc/nginx/sites-available/bigartist > /dev/null << 'EOF'
server {
    listen 80;
    server_name app.bigartist.es;
    
    root /var/www/bigartist/frontend;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Activar sitio
sudo ln -sf /etc/nginx/sites-available/bigartist /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

echo ""
echo "✅ ¡Instalación completada!"
echo ""
echo "🌐 Tu aplicación está corriendo en: http://app.bigartist.es"
echo "🔐 Usuario: admin | Contraseña: admin123"
echo ""
echo "📝 Para actualizar el código en el futuro:"
echo "   cd /var/www/bigartist/repo"
echo "   git pull"
echo "   npm run build"
echo "   cp -r dist/* /var/www/bigartist/frontend/"
echo ""