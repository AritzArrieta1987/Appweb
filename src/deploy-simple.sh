#!/bin/bash

# Script simple de deployment para BIGARTIST ROYALTIES
# Uso: ./deploy-simple.sh

# CONFIGURACIÓN
SERVER="usuario@app.bigartist.es"
SERVER_PATH="/var/www/bigartist"

# Build
echo "🔨 Compilando proyecto..."
npm run build

# Upload
echo "🚀 Subiendo archivos..."
rsync -avz --delete dist/ $SERVER:$SERVER_PATH/

echo "✅ ¡Deployment completado!"
