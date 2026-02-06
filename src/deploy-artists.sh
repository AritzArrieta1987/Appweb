#!/bin/bash

echo "🎨 DESPLEGANDO BIGARTIST - PÁGINA DE ARTISTAS COMPLETA"
echo "======================================================"
echo ""
echo "📦 Este script despliega:"
echo "  - DashboardSimple.tsx actualizado con página Artistas"
echo "  - DataContext integrado"
echo "  - ArtistPanel funcional"
echo "  - CSVUploader conectado"
echo ""

# Variables
SERVER="root@94.143.141.241"
REPO_PATH="/var/www/bigartist/repo"
FRONTEND_PATH="/var/www/bigartist/frontend"

echo "📤 Subiendo archivos al servidor..."
echo ""

# Copiar archivos necesarios al servidor
scp DashboardSimple.tsx $SERVER:$REPO_PATH/src/
scp App.tsx $SERVER:$REPO_PATH/src/
scp components/DataContext.tsx $SERVER:$REPO_PATH/src/components/
scp components/ArtistPanel.tsx $SERVER:$REPO_PATH/src/components/
scp components/CSVUploader.tsx $SERVER:$REPO_PATH/src/components/

echo ""
echo "✅ Archivos subidos correctamente"
echo ""
echo "🔨 Compilando y desplegando en el servidor..."
echo ""

# Conectar al servidor y ejecutar comandos
ssh $SERVER << 'ENDSSH'

echo "📂 Navegando al repositorio..."
cd /var/www/bigartist/repo

echo ""
echo "🔨 Compilando proyecto..."
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Compilación exitosa"
  echo ""
  echo "🚀 Desplegando a producción..."
  
  # Crear backup del frontend actual
  sudo cp -r /var/www/bigartist/frontend /var/www/bigartist/frontend.backup-$(date +%Y%m%d-%H%M%S)
  
  # Limpiar frontend
  sudo rm -rf /var/www/bigartist/frontend/*
  
  # Copiar archivos compilados
  sudo cp -rf dist/* /var/www/bigartist/frontend/
  
  # Dar permisos
  sudo chown -R www-data:www-data /var/www/bigartist/frontend/
  
  # Recargar Nginx
  sudo nginx -s reload
  
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ ¡BIGARTIST DESPLEGADO CON ÉXITO!"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "🌐 URL: https://app.bigartist.es"
  echo ""
  echo "🎨 NUEVAS CARACTERÍSTICAS:"
  echo ""
  echo "   ✨ Página de Artistas Premium"
  echo "   ├── Grid de artistas con fotos"
  echo "   ├── Stats: Revenue, Streams, Tracks"
  echo "   ├── Click para ver detalles completos"
  echo "   ├── ArtistPanel con gráficos interactivos"
  echo "   └── Diseño luxury dorado (#c9a574)"
  echo ""
  echo "   📊 Dashboard Mejorado"
  echo "   ├── Gráfico CSV temporal (Line Chart)"
  echo "   ├── Gráfico DSP (Pie Chart)"
  echo "   ├── Top 10 canciones recientes"
  echo "   └── Stats en tiempo real desde API"
  echo ""
  echo "   📁 Catálogo Musical"
  echo "   ├── Tabla completa de canciones"
  echo "   ├── ISRC, Streams, Revenue"
  echo "   ├── Plataformas por track"
  echo "   └── Efectos hover premium"
  echo ""
  echo "   📤 CSV Uploader"
  echo "   ├── Drag & Drop funcional"
  echo "   ├── Preview de datos"
  echo "   ├── Procesamiento automático"
  echo "   └── Creación de artistas + tracks"
  echo ""
  echo "🧪 PRUEBA AHORA:"
  echo ""
  echo "   1. Abre https://app.bigartist.es"
  echo "   2. Login: admin@bigartist.es / admin123"
  echo "   3. Click en 'Artistas' → Ver grid de artistas"
  echo "   4. Click en un artista → Ver ArtistPanel completo"
  echo "   5. Click en 'Catálogo' → Ver todas las canciones"
  echo "   6. Click en 'Subir CSV' → Arrastra archivo The Orchard"
  echo ""
  echo "🔄 Limpia caché si no ves cambios:"
  echo "   • Mac: Cmd + Shift + R"
  echo "   • Windows: Ctrl + Shift + R"
  echo "   • Safari iOS: Ajustes > Safari > Borrar historial"
  echo ""
  echo "💾 Backup guardado en:"
  echo "   /var/www/bigartist/frontend.backup-*"
  echo ""
else
  echo ""
  echo "❌ ERROR EN COMPILACIÓN"
  echo ""
  echo "Revisa los logs arriba para ver el error"
  exit 1
fi

ENDSSH

echo ""
echo "✅ Script completado desde tu máquina local"
echo ""
