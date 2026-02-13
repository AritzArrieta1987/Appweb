-- =====================================================
-- BIGARTIST ROYALTIES - MySQL Database Schema
-- =====================================================

-- Tabla de Usuarios/Admin
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'artist') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Artistas
CREATE TABLE IF NOT EXISTS artists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  photo_url TEXT,
  total_revenue DECIMAL(15, 2) DEFAULT 0,
  total_streams BIGINT DEFAULT 0,
  user_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Índice para búsqueda rápida de artistas
CREATE INDEX idx_artist_name ON artists(name);

-- Tabla de Canciones/Tracks
CREATE TABLE IF NOT EXISTS tracks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist_id INT NOT NULL,
  isrc VARCHAR(20),
  upc VARCHAR(20),
  total_revenue DECIMAL(15, 2) DEFAULT 0,
  total_streams BIGINT DEFAULT 0,
  audio_url TEXT,
  release_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
  UNIQUE KEY unique_track (title, artist_id, isrc)
);

-- Índices para búsqueda rápida
CREATE INDEX idx_track_title ON tracks(title);
CREATE INDEX idx_track_isrc ON tracks(isrc);
CREATE INDEX idx_track_artist ON tracks(artist_id);

-- Tabla de Plataformas
CREATE TABLE IF NOT EXISTS platforms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar plataformas principales
INSERT IGNORE INTO platforms (name, display_name, color) VALUES
('Spotify', 'Spotify', '#1DB954'),
('Apple Music', 'Apple Music', '#FA243C'),
('YouTube', 'YouTube', '#FF0000'),
('Amazon Music', 'Amazon Music', '#FF9900'),
('Deezer', 'Deezer', '#FEAA2D'),
('Tidal', 'Tidal', '#000000'),
('Pandora', 'Pandora', '#3668FF');

-- Tabla de Royalties (líneas detalladas del CSV)
CREATE TABLE IF NOT EXISTS royalties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  track_id INT NOT NULL,
  platform_id INT NOT NULL,
  sale_month VARCHAR(20) NOT NULL,
  sale_date DATE,
  quantity INT DEFAULT 0,
  revenue DECIMAL(15, 4) NOT NULL,
  territory VARCHAR(10),
  csv_filename VARCHAR(255),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE,
  FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

-- Índices para consultas rápidas
CREATE INDEX idx_royalty_track ON royalties(track_id);
CREATE INDEX idx_royalty_platform ON royalties(platform_id);
CREATE INDEX idx_royalty_month ON royalties(sale_month);
CREATE INDEX idx_royalty_date ON royalties(sale_date);

-- Tabla de Estadísticas Mensuales (para dashboard rápido)
CREATE TABLE IF NOT EXISTS monthly_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  month VARCHAR(20) NOT NULL,
  year INT NOT NULL,
  total_revenue DECIMAL(15, 2) DEFAULT 0,
  total_streams BIGINT DEFAULT 0,
  artist_count INT DEFAULT 0,
  track_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_month (month, year)
);

-- Tabla de Estadísticas por Plataforma y Mes
CREATE TABLE IF NOT EXISTS platform_monthly_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  platform_id INT NOT NULL,
  month VARCHAR(20) NOT NULL,
  year INT NOT NULL,
  revenue DECIMAL(15, 2) DEFAULT 0,
  streams BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE,
  UNIQUE KEY unique_platform_month (platform_id, month, year)
);

-- Tabla de Contratos
CREATE TABLE IF NOT EXISTS contracts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  artist_id INT NOT NULL,
  contract_type ENUM('distribution', 'management', 'label', 'publishing') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  royalty_percentage DECIMAL(5, 2) NOT NULL,
  advance_amount DECIMAL(15, 2) DEFAULT 0,
  recoupment_amount DECIMAL(15, 2) DEFAULT 0,
  status ENUM('active', 'expired', 'terminated') DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

-- Tabla de Archivos CSV subidos
CREATE TABLE IF NOT EXISTS csv_uploads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  rows_processed INT DEFAULT 0,
  total_revenue DECIMAL(15, 2) DEFAULT 0,
  total_streams BIGINT DEFAULT 0,
  unique_artists INT DEFAULT 0,
  unique_tracks INT DEFAULT 0,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploaded_by_user_id INT,
  status ENUM('processing', 'completed', 'failed') DEFAULT 'processing',
  error_message TEXT,
  FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabla de Notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info', 'success', 'warning', 'csv_upload') DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índice para consultas rápidas de notificaciones
CREATE INDEX idx_notification_user ON notifications(user_id);
CREATE INDEX idx_notification_read ON notifications(is_read);

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de Artistas con estadísticas completas
CREATE OR REPLACE VIEW artist_stats AS
SELECT 
  a.id,
  a.name,
  a.email,
  a.photo_url,
  COUNT(DISTINCT t.id) as track_count,
  SUM(r.revenue) as total_revenue,
  SUM(r.quantity) as total_streams,
  COUNT(DISTINCT r.platform_id) as platform_count
FROM artists a
LEFT JOIN tracks t ON a.id = t.artist_id
LEFT JOIN royalties r ON t.id = r.track_id
GROUP BY a.id, a.name, a.email, a.photo_url;

-- Vista de Top Tracks
CREATE OR REPLACE VIEW top_tracks AS
SELECT 
  t.id,
  t.title,
  a.name as artist_name,
  t.isrc,
  SUM(r.revenue) as total_revenue,
  SUM(r.quantity) as total_streams,
  COUNT(DISTINCT r.platform_id) as platform_count
FROM tracks t
JOIN artists a ON t.artist_id = a.id
LEFT JOIN royalties r ON t.id = r.track_id
GROUP BY t.id, t.title, a.name, t.isrc
ORDER BY total_revenue DESC;

-- Vista de Revenue por Plataforma
CREATE OR REPLACE VIEW platform_revenue AS
SELECT 
  p.name as platform_name,
  p.color,
  SUM(r.revenue) as total_revenue,
  SUM(r.quantity) as total_streams,
  COUNT(DISTINCT r.track_id) as track_count
FROM platforms p
LEFT JOIN royalties r ON p.id = r.platform_id
GROUP BY p.id, p.name, p.color
ORDER BY total_revenue DESC;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

-- Procedimiento para actualizar totales de artista
DELIMITER //
CREATE PROCEDURE update_artist_totals(IN artist_id_param INT)
BEGIN
  UPDATE artists a
  SET 
    total_revenue = (
      SELECT COALESCE(SUM(r.revenue), 0)
      FROM tracks t
      JOIN royalties r ON t.id = r.track_id
      WHERE t.artist_id = artist_id_param
    ),
    total_streams = (
      SELECT COALESCE(SUM(r.quantity), 0)
      FROM tracks t
      JOIN royalties r ON t.id = r.track_id
      WHERE t.artist_id = artist_id_param
    )
  WHERE a.id = artist_id_param;
END //
DELIMITER ;

-- Procedimiento para actualizar totales de track
DELIMITER //
CREATE PROCEDURE update_track_totals(IN track_id_param INT)
BEGIN
  UPDATE tracks t
  SET 
    total_revenue = (
      SELECT COALESCE(SUM(revenue), 0)
      FROM royalties
      WHERE track_id = track_id_param
    ),
    total_streams = (
      SELECT COALESCE(SUM(quantity), 0)
      FROM royalties
      WHERE track_id = track_id_param
    )
  WHERE t.id = track_id_param;
END //
DELIMITER ;

-- =====================================================
-- DATOS DE PRUEBA (Opcional)
-- =====================================================

-- Usuario admin de prueba (password: admin123)
-- Hash bcrypt de 'admin123'
INSERT IGNORE INTO users (email, password_hash, role) VALUES
('admin@bigartist.es', '$2b$10$rXN3Z4QZ8QZ8QZ8QZ8QZ8eK5vJ5vJ5vJ5vJ5vJ5vJ5vJ5vJ5vJ5vJ', 'admin');