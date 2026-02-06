#!/bin/bash

echo "🎨 DESPLEGANDO BIGARTIST DESDE GITHUB"
echo "======================================"
echo ""
echo "📦 Repositorio: https://github.com/AritzArrieta1987/Appweb.git"
echo ""

# Variables
SERVER="root@94.143.141.241"
REPO_PATH="/var/www/bigartist/repo"

echo "🔗 Conectando al servidor y desplegando..."
echo ""

# Conectar al servidor y ejecutar comandos
ssh $SERVER << 'ENDSSH'

echo "📂 Navegando al repositorio..."
cd /var/www/bigartist/repo

echo ""
echo "📥 Obteniendo última versión desde GitHub..."
git fetch origin
git reset --hard origin/main
git pull origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Código actualizado desde GitHub"
  echo ""
  echo "📦 Instalando dependencias (si hay nuevas)..."
  npm install
  
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
    echo "📊 ÚLTIMO COMMIT:"
    git log -1 --pretty=format:"   %h - %s (%cr) <%an>"
    echo ""
    echo ""
    echo "🎨 CARACTERÍSTICAS DESPLEGADAS:"
    echo ""
    echo "   ✨ Página de Artistas Premium"
    echo "   ├── Grid de artistas con fotos grandes"
    echo "   ├── Stats: Revenue, Streams, Tracks"
    echo "   ├── Click para ver ArtistPanel completo"
    echo "   ├── Efectos hover dorados"
    echo "   └── Integrado con DataContext"
    echo ""
    echo "   📊 Dashboard Completo"
    echo "   ├── Line Chart temporal (CSV data)"
    echo "   ├── Pie Chart DSP plataformas"
    echo "   ├── Top 10 canciones recientes"
    echo "   ├── Stats en tiempo real desde API"
    echo "   └── Colores por plataforma (Spotify, Apple, etc)"
    echo ""
    echo "   📁 Catálogo Musical"
    echo "   ├── Tabla completa de tracks"
    echo "   ├── ISRC codes con badge azul"
    echo "   ├── Streams y Revenue por canción"
    echo "   ├── Tags de plataformas (max 3 + contador)"
    echo "   └── Efectos hover premium"
    echo ""
    echo "   📤 CSV Uploader"
    echo "   ├── Drag & Drop funcional"
    echo "   ├── Formato The Orchard"
    echo "   ├── Preview de datos"
    echo "   ├── Procesamiento automático"
    echo "   └── Creación de artistas + tracks"
    echo ""
    echo "   🎨 Diseño Premium"
    echo "   ├── Fondo de imagen con overlay verde"
    echo "   ├── Glassmorphism en todas las cards"
    echo "   ├── Header que se oculta al scroll"
    echo "   ├── Colores corporativos (#2a3f3f + #c9a574)"
    echo "   └── Responsive con bottom nav móvil"
    echo ""
    echo "🧪 PRUEBA AHORA:"
    echo ""
    echo "   1. Abre https://app.bigartist.es"
    echo "   2. Login: admin@bigartist.es / admin123"
    echo "   3. Click en 'Artistas' → Ver grid completo"
    echo "   4. Click en un artista → ArtistPanel con detalles"
    echo "   5. Click en 'Catálogo' → Ver todas las canciones"
    echo "   6. Click en 'Dashboard' → Ver gráficos interactivos"
    echo ""
    echo "🔄 Limpia caché si no ves cambios:"
    echo "   • Mac: Cmd + Shift + R"
    echo "   • Windows: Ctrl + Shift + R"
    echo "   • Safari iOS: Ajustes > Safari > Borrar historial"
    echo ""
    echo "💾 Backup guardado en:"
    echo "   /var/www/bigartist/frontend.backup-$(date +%Y%m%d-%H%M%S)"
    echo ""
  else
    echo ""
    echo "❌ ERROR EN COMPILACIÓN"
    echo ""
    echo "Revisa los logs arriba para ver el error"
    exit 1
  fi
else
  echo ""
  echo "❌ ERROR AL HACER GIT PULL"
  echo ""
  echo "Revisa los logs arriba para ver el error"
  exit 1
fi

ENDSSH

echo ""
echo "✅ Script completado"
echo ""
