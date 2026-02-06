#!/bin/bash

# =====================================================
# SCRIPT DE INSTALACIÓN AUTOMÁTICA - BIGARTIST BACKEND
# =====================================================

echo "🎵 BIGARTIST ROYALTIES - Instalación Backend"
echo "=============================================="
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Variables
DB_NAME="bigartist_royalties"
DB_USER="bigartist_user"
DB_PASS="BigArtist2026!Secure"
JWT_SECRET=$(openssl rand -base64 32)
BACKEND_DIR="/var/www/bigartist/backend"

echo -e "${BLUE}📁 Creando estructura del backend...${NC}"
mkdir -p $BACKEND_DIR/{config,middleware,routes,scripts,uploads}

# =====================================================
# CREAR ARCHIVOS DEL BACKEND
# =====================================================

echo -e "${BLUE}📝 Creando archivos de configuración...${NC}"

# 1. package.json
cat > $BACKEND_DIR/package.json << 'PKGJSON'
{
  "name": "bigartist-backend",
  "version": "1.0.0",
  "description": "Backend API para BIGARTIST ROYALTIES",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "create-admin": "node scripts/createAdmin.js"
  },
  "keywords": ["royalties", "music", "api"],
  "author": "BIGARTIST",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "multer": "^1.4.5-lts.1",
    "csv-parser": "^3.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
PKGJSON

# 2. .env
cat > $BACKEND_DIR/.env << ENVFILE
DB_HOST=localhost
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASS
DB_NAME=$DB_NAME
JWT_SECRET=$JWT_SECRET
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://app.bigartist.es
ENVFILE

# 3. config/database.js
cat > $BACKEND_DIR/config/database.js << 'DBCONFIG'
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'bigartist_royalties',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL conectado correctamente');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error conectando a MySQL:', err.message);
  });

module.exports = pool;
DBCONFIG

# 4. middleware/auth.js
cat > $BACKEND_DIR/middleware/auth.js << 'AUTHMW'
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No se proporcionó token de autenticación' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Token inválido o expirado' 
    });
  }
};

module.exports = authMiddleware;
AUTHMW

# 5. routes/auth.js
cat > $BACKEND_DIR/routes/auth.js << 'AUTHROUTE'
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
});

module.exports = router;
AUTHROUTE

# 6. routes/csv.js (COMPLETO CON PROCESAMIENTO)
cat > $BACKEND_DIR/routes/csv.js << 'CSVROUTE'
const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

router.post('/upload', authMiddleware, upload.single('csvFile'), async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó archivo CSV'
      });
    }

    console.log(`📤 Procesando CSV: ${req.file.originalname}`);
    
    await connection.beginTransaction();
    
    const file = req.file;
    const results = [];
    let totalRevenue = 0;
    let totalStreams = 0;
    const artistsSet = new Set();
    const tracksSet = new Set();
    const monthlyStats = {};
    const platformStats = {};
    
    await new Promise((resolve, reject) => {
      fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`📋 Total de líneas: ${results.length}`);

    for (const row of results) {
      try {
        const artistName = (row['Artist Name'] || row['Artist'] || '').trim();
        if (!artistName) continue;

        let [artistRows] = await connection.query(
          'SELECT id FROM artists WHERE name = ?',
          [artistName]
        );
        
        let artistId;
        if (artistRows.length === 0) {
          const [result] = await connection.query(
            'INSERT INTO artists (name, total_revenue, total_streams) VALUES (?, 0, 0)',
            [artistName]
          );
          artistId = result.insertId;
        } else {
          artistId = artistRows[0].id;
        }
        artistsSet.add(artistId);
        
        const trackTitle = (row['Track Name'] || row['Track'] || '').trim();
        const isrc = (row['ISRC'] || '').trim() || null;
        const upc = (row['UPC'] || '').trim() || null;
        
        if (!trackTitle) continue;

        let [trackRows] = await connection.query(
          'SELECT id FROM tracks WHERE title = ? AND artist_id = ?',
          [trackTitle, artistId]
        );
        
        let trackId;
        if (trackRows.length === 0) {
          const [result] = await connection.query(
            'INSERT INTO tracks (title, artist_id, isrc, upc, total_revenue, total_streams) VALUES (?, ?, ?, ?, 0, 0)',
            [trackTitle, artistId, isrc, upc]
          );
          trackId = result.insertId;
        } else {
          trackId = trackRows[0].id;
        }
        tracksSet.add(trackId);
        
        const platformName = (row['DMS'] || row['DSP'] || row['Platform'] || row['Store'] || '').trim();
        if (!platformName) continue;

        let [platformRows] = await connection.query(
          'SELECT id FROM platforms WHERE name = ?',
          [platformName]
        );
        
        let platformId;
        if (platformRows.length === 0) {
          const [result] = await connection.query(
            'INSERT INTO platforms (name, display_name) VALUES (?, ?)',
            [platformName, platformName]
          );
          platformId = result.insertId;
        } else {
          platformId = platformRows[0].id;
        }
        
        const revenueStr = (row['Label Share Net Receipts'] || row['Revenue'] || row['Earnings'] || '0')
          .toString()
          .replace(/[$€£¥]/g, '')
          .replace(/\s/g, '')
          .trim();
        
        let revenue = 0;
        if (revenueStr.includes('.') && revenueStr.includes(',')) {
          revenue = parseFloat(revenueStr.replace(/\./g, '').replace(',', '.'));
        } else if (revenueStr.includes(',') && !revenueStr.includes('.')) {
          revenue = parseFloat(revenueStr.replace(',', '.'));
        } else {
          revenue = parseFloat(revenueStr.replace(/,/g, ''));
        }
        
        const streams = parseInt((row['Quantity'] || row['Streams'] || row['Units'] || '0')
          .toString()
          .replace(/,/g, '')
          .trim()) || 0;
        
        const saleMonth = (row['Sale Month'] || row['Period'] || row['Month'] || '').trim();
        const saleDate = row['Sale Date'] || null;
        const territory = (row['Territory'] || row['Country'] || '').trim() || null;
        
        totalRevenue += revenue;
        totalStreams += streams;
        
        await connection.query(
          `INSERT INTO royalties 
           (track_id, platform_id, sale_month, sale_date, quantity, revenue, territory, csv_filename, uploaded_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [trackId, platformId, saleMonth, saleDate, streams, revenue, territory, file.originalname]
        );

        if (saleMonth) {
          if (!monthlyStats[saleMonth]) {
            monthlyStats[saleMonth] = { revenue: 0, streams: 0 };
          }
          monthlyStats[saleMonth].revenue += revenue;
          monthlyStats[saleMonth].streams += streams;
        }

        if (!platformStats[platformName]) {
          platformStats[platformName] = { revenue: 0, streams: 0 };
        }
        platformStats[platformName].revenue += revenue;
        platformStats[platformName].streams += streams;

      } catch (rowError) {
        console.error(`⚠️ Error procesando fila:`, rowError.message);
      }
    }
    
    console.log(`💰 Revenue total: €${totalRevenue.toFixed(2)}`);
    console.log(`📊 Streams totales: ${totalStreams.toLocaleString()}`);
    
    for (const artistId of artistsSet) {
      await connection.query(
        `UPDATE artists SET 
         total_revenue = (SELECT COALESCE(SUM(r.revenue), 0) FROM royalties r JOIN tracks t ON r.track_id = t.id WHERE t.artist_id = ?),
         total_streams = (SELECT COALESCE(SUM(r.quantity), 0) FROM royalties r JOIN tracks t ON r.track_id = t.id WHERE t.artist_id = ?)
         WHERE id = ?`,
        [artistId, artistId, artistId]
      );
    }
    
    for (const trackId of tracksSet) {
      await connection.query(
        `UPDATE tracks SET 
         total_revenue = (SELECT COALESCE(SUM(revenue), 0) FROM royalties WHERE track_id = ?),
         total_streams = (SELECT COALESCE(SUM(quantity), 0) FROM royalties WHERE track_id = ?)
         WHERE id = ?`,
        [trackId, trackId, trackId]
      );
    }

    const [uploadResult] = await connection.query(
      `INSERT INTO csv_uploads 
       (filename, rows_processed, total_revenue, total_streams, unique_artists, unique_tracks, status, uploaded_by_user_id) 
       VALUES (?, ?, ?, ?, ?, ?, 'completed', ?)`,
      [file.originalname, results.length, totalRevenue, totalStreams, artistsSet.size, tracksSet.size, req.user.id]
    );
    
    await connection.commit();
    fs.unlinkSync(file.path);
    
    console.log('✅ CSV procesado exitosamente');
    
    res.json({
      success: true,
      message: 'CSV procesado correctamente',
      data: {
        filename: file.originalname,
        rows_processed: results.length,
        total_revenue: totalRevenue,
        total_streams: totalStreams,
        unique_artists: artistsSet.size,
        unique_tracks: tracksSet.size,
        upload_id: uploadResult.insertId,
        monthly_breakdown: monthlyStats,
        platform_breakdown: platformStats
      }
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('❌ Error procesando CSV:', error);
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Error procesando CSV',
      error: error.message
    });
  } finally {
    connection.release();
  }
});

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const [uploads] = await pool.query(
      `SELECT id, filename, rows_processed, total_revenue, total_streams, 
              unique_artists, unique_tracks, upload_date, status
       FROM csv_uploads 
       ORDER BY upload_date DESC 
       LIMIT 50`
    );

    res.json({
      success: true,
      data: uploads
    });
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo historial'
    });
  }
});

module.exports = router;
CSVROUTE

# 7. routes/dashboard.js
cat > $BACKEND_DIR/routes/dashboard.js << 'DASHROUTE'
const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const [totalsResult] = await pool.query(`
      SELECT 
        COALESCE(SUM(revenue), 0) as total_revenue,
        COALESCE(SUM(quantity), 0) as total_streams
      FROM royalties
    `);

    const [countsResult] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM artists) as artist_count,
        (SELECT COUNT(*) FROM tracks) as track_count
    `);

    const [platformData] = await pool.query(`
      SELECT 
        p.name as platform_name,
        p.color,
        COALESCE(SUM(r.revenue), 0) as revenue,
        COALESCE(SUM(r.quantity), 0) as streams
      FROM platforms p
      LEFT JOIN royalties r ON p.id = r.platform_id
      GROUP BY p.id, p.name, p.color
      ORDER BY revenue DESC
    `);

    const platformBreakdown = {};
    platformData.forEach(platform => {
      platformBreakdown[platform.platform_name] = parseFloat(platform.revenue);
    });

    const [monthlyData] = await pool.query(`
      SELECT 
        sale_month as month,
        COALESCE(SUM(revenue), 0) as revenue,
        COALESCE(SUM(quantity), 0) as streams
      FROM royalties
      WHERE sale_month IS NOT NULL AND sale_month != ''
      GROUP BY sale_month
      ORDER BY 
        CASE 
          WHEN sale_month LIKE 'October%' THEN 1
          WHEN sale_month LIKE 'November%' THEN 2
          WHEN sale_month LIKE 'December%' THEN 3
          WHEN sale_month LIKE 'January%' THEN 4
          ELSE 99
        END
      LIMIT 12
    `);

    const formattedMonthlyData = monthlyData.map(item => ({
      month: item.month,
      revenue: parseFloat(item.revenue),
      streams: parseInt(item.streams)
    }));

    res.json({
      totalRevenue: parseFloat(totalsResult[0].total_revenue),
      totalStreams: parseInt(totalsResult[0].total_streams),
      artistCount: countsResult[0].artist_count,
      trackCount: countsResult[0].track_count,
      platformBreakdown,
      monthlyData: formattedMonthlyData
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas',
      error: error.message
    });
  }
});

module.exports = router;
DASHROUTE

# 8. routes/artists.js
cat > $BACKEND_DIR/routes/artists.js << 'ARTISTROUTE'
const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const [artists] = await pool.query(`
      SELECT 
        a.id,
        a.name,
        a.email,
        a.phone,
        a.photo_url,
        a.total_revenue,
        a.total_streams,
        COUNT(DISTINCT t.id) as track_count
      FROM artists a
      LEFT JOIN tracks t ON a.id = t.artist_id
      GROUP BY a.id
      ORDER BY a.total_revenue DESC
    `);

    res.json({
      success: true,
      data: artists
    });
  } catch (error) {
    console.error('Error obteniendo artistas:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo artistas'
    });
  }
});

module.exports = router;
ARTISTROUTE

# 9. routes/tracks.js
cat > $BACKEND_DIR/routes/tracks.js << 'TRACKROUTE'
const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const [tracks] = await pool.query(`
      SELECT 
        t.id,
        t.title,
        t.isrc,
        t.upc,
        t.total_revenue,
        t.total_streams,
        t.artist_id,
        a.name as artist_name
      FROM tracks t
      JOIN artists a ON t.artist_id = a.id
      ORDER BY t.total_revenue DESC
    `);

    res.json({
      success: true,
      data: tracks
    });
  } catch (error) {
    console.error('Error obteniendo tracks:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo tracks'
    });
  }
});

module.exports = router;
TRACKROUTE

# 10. server.js (SERVIDOR PRINCIPAL)
cat > $BACKEND_DIR/server.js << 'SERVERJS'
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const csvRoutes = require('./routes/csv');
const dashboardRoutes = require('./routes/dashboard');
const artistRoutes = require('./routes/artists');
const trackRoutes = require('./routes/tracks');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/csv', csvRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/tracks', trackRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'BIGARTIST API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🎵 BIGARTIST ROYALTIES API');
  console.log('='.repeat(50));
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log('='.repeat(50));
});

module.exports = app;
SERVERJS

# 11. scripts/createAdmin.js
cat > $BACKEND_DIR/scripts/createAdmin.js << 'ADMINSCRIPT'
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdmin() {
  try {
    console.log('🔧 Conectando a MySQL...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'bigartist_royalties'
    });

    console.log('✅ Conectado a MySQL');

    const email = 'admin@bigartist.es';
    const password = 'admin123';
    
    console.log('🔐 Generando hash de contraseña...');
    const passwordHash = await bcrypt.hash(password, 10);

    console.log('👤 Creando usuario admin...');
    await connection.query(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password_hash = ?',
      [email, passwordHash, 'admin', passwordHash]
    );

    console.log('✅ Usuario admin creado correctamente');
    console.log('');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
ADMINSCRIPT

echo -e "${GREEN}✅ Archivos del backend creados${NC}"

# =====================================================
# CONFIGURAR MYSQL
# =====================================================

echo -e "${BLUE}🗄️  Configurando MySQL...${NC}"

mysql -u root -p"$MYSQL_ROOT_PASSWORD" << MYSQL_SCRIPT
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
MYSQL_SCRIPT

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Base de datos configurada${NC}"
else
    echo -e "${RED}❌ Error configurando MySQL${NC}"
    echo -e "${YELLOW}Ejecuta manualmente:${NC}"
    echo "mysql -u root -p"
    echo "CREATE DATABASE $DB_NAME;"
    echo "CREATE USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';"
    echo "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';"
fi

# Crear schema
echo -e "${BLUE}📋 Creando tablas...${NC}"

mysql -u $DB_USER -p"$DB_PASS" $DB_NAME << 'SCHEMA_SQL'
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'artist') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS artists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  photo_url TEXT,
  total_revenue DECIMAL(15,2) DEFAULT 0,
  total_streams BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tracks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  artist_id INT NOT NULL,
  isrc VARCHAR(50),
  upc VARCHAR(50),
  total_revenue DECIMAL(15,2) DEFAULT 0,
  total_streams BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS platforms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  color VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS royalties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  track_id INT NOT NULL,
  platform_id INT NOT NULL,
  sale_month VARCHAR(50),
  sale_date DATE,
  quantity BIGINT DEFAULT 0,
  revenue DECIMAL(15,2) DEFAULT 0,
  territory VARCHAR(10),
  csv_filename VARCHAR(500),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE,
  FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS csv_uploads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(500) NOT NULL,
  rows_processed INT DEFAULT 0,
  total_revenue DECIMAL(15,2) DEFAULT 0,
  total_streams BIGINT DEFAULT 0,
  unique_artists INT DEFAULT 0,
  unique_tracks INT DEFAULT 0,
  status ENUM('processing', 'completed', 'failed') DEFAULT 'processing',
  uploaded_by_user_id INT,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);
SCHEMA_SQL

echo -e "${GREEN}✅ Tablas creadas${NC}"

# =====================================================
# INSTALAR DEPENDENCIAS NPM
# =====================================================

echo -e "${BLUE}📦 Instalando dependencias NPM...${NC}"
cd $BACKEND_DIR
npm install

echo -e "${GREEN}✅ Dependencias instaladas${NC}"

# =====================================================
# CREAR USUARIO ADMIN
# =====================================================

echo -e "${BLUE}👤 Creando usuario admin...${NC}"
npm run create-admin

# =====================================================
# CONFIGURAR PM2
# =====================================================

echo -e "${BLUE}🚀 Configurando PM2...${NC}"

# Instalar PM2 si no está instalado
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2 no encontrado, instalando...${NC}"
    npm install -g pm2
fi

# Detener si ya está corriendo
pm2 stop bigartist-api 2>/dev/null || true
pm2 delete bigartist-api 2>/dev/null || true

# Iniciar servidor
pm2 start $BACKEND_DIR/server.js --name "bigartist-api"
pm2 save

echo -e "${GREEN}✅ PM2 configurado${NC}"

# =====================================================
# CONFIGURAR NGINX REVERSE PROXY
# =====================================================

echo -e "${BLUE}🌐 Configurando Nginx...${NC}"

cat > /etc/nginx/sites-available/bigartist-api << 'NGINX_CONFIG'
server {
    listen 3000;
    server_name 94.143.141.241;

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
}
NGINX_CONFIG

# Verificar configuración de Nginx
nginx -t && nginx -s reload

echo -e "${GREEN}✅ Nginx configurado${NC}"

# =====================================================
# VERIFICAR INSTALACIÓN
# =====================================================

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ INSTALACIÓN COMPLETADA${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}📊 Información del Backend:${NC}"
echo -e "  📁 Directorio: $BACKEND_DIR"
echo -e "  🗄️  Base de datos: $DB_NAME"
echo -e "  👤 Usuario DB: $DB_USER"
echo -e "  🔑 JWT Secret: $JWT_SECRET"
echo ""
echo -e "${BLUE}🔐 Credenciales Admin:${NC}"
echo -e "  📧 Email: admin@bigartist.es"
echo -e "  🔑 Password: admin123"
echo ""
echo -e "${BLUE}🔗 Endpoints:${NC}"
echo -e "  Health Check: http://94.143.141.241:3000/api/health"
echo -e "  Login: http://94.143.141.241:3000/api/auth/login"
echo -e "  CSV Upload: http://94.143.141.241:3000/api/csv/upload"
echo -e "  Dashboard: http://94.143.141.241:3000/api/dashboard/stats"
echo ""
echo -e "${BLUE}📝 Comandos útiles:${NC}"
echo -e "  pm2 logs bigartist-api     # Ver logs"
echo -e "  pm2 restart bigartist-api  # Reiniciar"
echo -e "  pm2 status                 # Ver estado"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo -e "  1. Cambia la contraseña de admin después del primer login"
echo -e "  2. Guarda estas credenciales en un lugar seguro"
echo ""

# Test de API
echo -e "${BLUE}🧪 Probando API...${NC}"
sleep 2
curl -s http://localhost:3000/api/health | jq '.' || echo "Respuesta recibida"

echo ""
echo -e "${GREEN}🎉 ¡Listo para usar!${NC}"
