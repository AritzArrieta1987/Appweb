# API Endpoints para Backend Node.js/Express

## 🔧 Configuración Inicial

### 1. Instalar dependencias en tu servidor
```bash
npm install express mysql2 bcrypt jsonwebtoken cors dotenv multer csv-parser
```

### 2. Variables de entorno (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=bigartist_royalties
JWT_SECRET=tu_clave_secreta_muy_segura
PORT=3000
```

### 3. Conexión MySQL (config/database.js)
```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

---

## 📋 Endpoints Necesarios

### **Autenticación**

#### `POST /api/auth/login`
Login de usuario admin
```json
// Request
{
  "email": "admin@bigartist.es",
  "password": "admin123"
}

// Response
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "admin@bigartist.es",
    "role": "admin"
  }
}
```

---

### **Dashboard**

#### `GET /api/dashboard/stats`
Obtener estadísticas generales
```json
// Response
{
  "totalRevenue": 125430.50,
  "totalStreams": 8542300,
  "artistCount": 45,
  "trackCount": 234,
  "platformBreakdown": {
    "Spotify": 75430.20,
    "Apple Music": 32500.30,
    "YouTube": 17500.00
  },
  "monthlyData": [
    { "month": "Octubre", "revenue": 42500.20, "streams": 2850000 },
    { "month": "Noviembre", "revenue": 41230.30, "streams": 2742000 },
    { "month": "Diciembre", "revenue": 41700.00, "streams": 2950300 }
  ]
}
```

---

### **Artistas**

#### `GET /api/artists`
Obtener todos los artistas
```json
// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Artist Name",
      "email": "artist@example.com",
      "photo_url": "https://...",
      "total_revenue": 15430.50,
      "total_streams": 842300,
      "track_count": 12
    }
  ]
}
```

#### `GET /api/artists/:id`
Obtener artista específico con detalles

#### `POST /api/artists`
Crear nuevo artista
```json
// Request
{
  "name": "New Artist",
  "email": "artist@example.com",
  "phone": "+34 600 000 000",
  "photo_url": "https://..."
}
```

#### `PUT /api/artists/:id`
Actualizar artista

#### `DELETE /api/artists/:id`
Eliminar artista

---

### **Tracks/Catálogo**

#### `GET /api/tracks`
Obtener todas las canciones
```json
// Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Song Title",
      "artist_name": "Artist Name",
      "artist_id": 1,
      "isrc": "USRC12345678",
      "total_revenue": 2430.50,
      "total_streams": 142300,
      "platforms": ["Spotify", "Apple Music", "YouTube"]
    }
  ]
}
```

#### `GET /api/tracks/:id`
Obtener track específico

#### `POST /api/tracks`
Crear nuevo track

---

### **CSV Upload - ¡IMPORTANTE!**

#### `POST /api/csv/upload`
Subir y procesar archivo CSV
```javascript
// Usa multipart/form-data
// Campo: 'csvFile' (archivo)

// Response
{
  "success": true,
  "message": "CSV procesado correctamente",
  "data": {
    "filename": "octubre_2024.csv",
    "rows_processed": 1523,
    "total_revenue": 42500.20,
    "total_streams": 2850000,
    "unique_artists": 34,
    "unique_tracks": 156,
    "upload_id": 12
  }
}
```

**Proceso del endpoint:**
1. Recibir archivo CSV
2. Parsear línea por línea
3. Para cada línea:
   - Buscar o crear artista
   - Buscar o crear track
   - Buscar o crear plataforma
   - Insertar royalty
4. Actualizar totales (artistas, tracks)
5. Actualizar estadísticas mensuales
6. Registrar en csv_uploads

#### `GET /api/csv/history`
Obtener historial de archivos subidos

---

### **Royalties**

#### `GET /api/royalties`
Obtener royalties con filtros
```
Query params:
- artist_id
- track_id
- platform_id
- month
- year
- limit
- offset
```

#### `GET /api/royalties/by-month`
Obtener royalties agrupados por mes

#### `GET /api/royalties/by-platform`
Obtener royalties agrupados por plataforma

---

### **Plataformas**

#### `GET /api/platforms`
Obtener todas las plataformas

---

### **Contratos**

#### `GET /api/contracts`
Obtener todos los contratos

#### `POST /api/contracts`
Crear nuevo contrato

#### `PUT /api/contracts/:id`
Actualizar contrato

---

## 🔐 Middleware de Autenticación

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

module.exports = authMiddleware;
```

---

## 📤 Ejemplo de Procesamiento CSV

```javascript
// routes/csv.js
const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const pool = require('../config/database');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('csvFile'), async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const file = req.file;
    const results = [];
    let totalRevenue = 0;
    let totalStreams = 0;
    const artistsSet = new Set();
    const tracksSet = new Set();
    
    // Leer CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });
    
    // Procesar cada línea
    for (const row of results) {
      // 1. Obtener/crear artista
      const artistName = row['Artist Name'] || row['Artist'];
      let [artistRows] = await connection.query(
        'SELECT id FROM artists WHERE name = ?',
        [artistName]
      );
      
      let artistId;
      if (artistRows.length === 0) {
        const [result] = await connection.query(
          'INSERT INTO artists (name) VALUES (?)',
          [artistName]
        );
        artistId = result.insertId;
      } else {
        artistId = artistRows[0].id;
      }
      artistsSet.add(artistId);
      
      // 2. Obtener/crear track
      const trackTitle = row['Track Name'] || row['Track'];
      const isrc = row['ISRC'] || null;
      
      let [trackRows] = await connection.query(
        'SELECT id FROM tracks WHERE title = ? AND artist_id = ?',
        [trackTitle, artistId]
      );
      
      let trackId;
      if (trackRows.length === 0) {
        const [result] = await connection.query(
          'INSERT INTO tracks (title, artist_id, isrc) VALUES (?, ?, ?)',
          [trackTitle, artistId, isrc]
        );
        trackId = result.insertId;
      } else {
        trackId = trackRows[0].id;
      }
      tracksSet.add(trackId);
      
      // 3. Obtener/crear plataforma
      const platformName = row['DMS'] || row['DSP'] || row['Platform'];
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
      
      // 4. Procesar revenue y streams
      const revenueStr = (row['Label Share Net Receipts'] || row['Revenue'] || '0')
        .toString()
        .replace(/[$€]/g, '')
        .replace(/\s/g, '')
        .trim();
      
      let revenue = 0;
      if (revenueStr.includes('.') && revenueStr.includes(',')) {
        revenue = parseFloat(revenueStr.replace(/\./g, '').replace(',', '.'));
      } else if (revenueStr.includes(',')) {
        revenue = parseFloat(revenueStr.replace(',', '.'));
      } else {
        revenue = parseFloat(revenueStr);
      }
      
      const streams = parseInt((row['Quantity'] || row['Streams'] || '0').toString().replace(/,/g, ''));
      const saleMonth = row['Sale Month'] || row['Period'] || row['Month'] || '';
      
      totalRevenue += revenue;
      totalStreams += streams;
      
      // 5. Insertar royalty
      await connection.query(
        `INSERT INTO royalties 
         (track_id, platform_id, sale_month, quantity, revenue, csv_filename) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [trackId, platformId, saleMonth, streams, revenue, file.originalname]
      );
    }
    
    // 6. Actualizar totales
    for (const artistId of artistsSet) {
      await connection.query('CALL update_artist_totals(?)', [artistId]);
    }
    
    for (const trackId of tracksSet) {
      await connection.query('CALL update_track_totals(?)', [trackId]);
    }
    
    // 7. Registrar upload
    const [uploadResult] = await connection.query(
      `INSERT INTO csv_uploads 
       (filename, rows_processed, total_revenue, total_streams, unique_artists, unique_tracks, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'completed')`,
      [file.originalname, results.length, totalRevenue, totalStreams, artistsSet.size, tracksSet.size]
    );
    
    await connection.commit();
    
    // Eliminar archivo temporal
    fs.unlinkSync(file.path);
    
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
        upload_id: uploadResult.insertId
      }
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Error processing CSV:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error procesando CSV',
      error: error.message
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
```

---

## 🚀 Estructura del Servidor

```
backend/
├── config/
│   └── database.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   ├── artists.js
│   ├── tracks.js
│   ├── csv.js
│   ├── dashboard.js
│   └── contracts.js
├── uploads/ (temporal)
├── .env
├── package.json
└── server.js
```

### server.js básico
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const artistRoutes = require('./routes/artists');
const trackRoutes = require('./routes/tracks');
const csvRoutes = require('./routes/csv');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/csv', csvRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## ✅ Checklist de Despliegue

- [ ] Instalar MySQL en el servidor
- [ ] Crear base de datos: `CREATE DATABASE bigartist_royalties;`
- [ ] Ejecutar schema.sql
- [ ] Configurar variables de entorno (.env)
- [ ] Instalar dependencias npm
- [ ] Implementar endpoints necesarios
- [ ] Configurar CORS para tu dominio app.bigartist.es
- [ ] Actualizar frontend para hacer fetch a tu API
- [ ] Configurar SSL/HTTPS
- [ ] Configurar PM2 o similar para mantener el servidor corriendo
