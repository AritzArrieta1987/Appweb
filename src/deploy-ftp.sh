#!/bin/bash

# Script de deployment usando FTP para BIGARTIST ROYALTIES
# Uso: ./deploy-ftp.sh

# CONFIGURACIÓN
FTP_HOST="app.bigartist.es"
FTP_USER="usuario_ftp"
FTP_PASS="contraseña_ftp"
FTP_DIR="/public_html"

# Build
echo "🔨 Compilando proyecto..."
npm run build

# Upload con lftp
echo "🚀 Subiendo archivos por FTP..."
lftp -c "
set ftp:ssl-allow no;
open -u $FTP_USER,$FTP_PASS $FTP_HOST;
mirror -R --delete --verbose dist/ $FTP_DIR/;
bye;
"

echo "✅ ¡Deployment completado!"
