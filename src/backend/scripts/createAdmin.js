// =====================================================
// Script para crear usuario admin inicial
// =====================================================

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

    // Datos del admin
    const email = 'admin@bigartist.es';
    const password = 'admin123'; // CAMBIAR EN PRODUCCIÓN
    
    console.log('🔐 Generando hash de contraseña...');
    const passwordHash = await bcrypt.hash(password, 10);

    console.log('👤 Creando usuario admin...');
    await connection.query(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password_hash = ?',
      [email, passwordHash, 'admin', passwordHash]
    );

    console.log('✅ Usuario admin creado/actualizado correctamente');
    console.log('');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('');
    console.log('⚠️  IMPORTANTE: Cambia esta contraseña en producción!');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
