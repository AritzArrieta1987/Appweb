#!/bin/bash

echo "🚀 DESPLEGANDO BIGARTIST DASHBOARD AL SERVIDOR..."
echo ""

cd /var/www/bigartist/repo

echo "1️⃣ Limpiando compilaciones anteriores..."
rm -rf dist node_modules/.vite

echo ""
echo "2️⃣ Compilando proyecto..."
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Compilación exitosa"
  
  echo ""
  echo "3️⃣ Desplegando a producción..."
  
  # Limpiar frontend
  sudo rm -rf /var/www/bigartist/frontend/*
  
  # Copiar archivos compilados
  sudo cp -rf dist/* /var/www/bigartist/frontend/
  
  # Copiar imágenes
  sudo mkdir -p /var/www/bigartist/frontend/images
  sudo cp -f public/images/*.png /var/www/bigartist/frontend/images/ 2>/dev/null || true
  
  # Dar permisos
  sudo chown -R www-data:www-data /var/www/bigartist/frontend/
  
  # Recargar Nginx
  sudo nginx -s reload
  
  # Timestamp para cache busting
  TIMESTAMP=$(date +%s)
  
  echo ""
  echo "✅ ¡DASHBOARD DESPLEGADO EXITOSAMENTE!"
  echo ""
  echo "🌐 URL: https://app.bigartist.es?v=$TIMESTAMP"
  echo ""
  echo "📋 Características desplegadas:"
  echo "   ✅ Login con modo demo (cualquier email/password)"
  echo "   ✅ Dashboard con 6 secciones"
  echo "   ✅ Bottom Navigation en móvil (estilo app)"
  echo "   ✅ Tabs horizontales en desktop"
  echo "   ✅ Campana de notificaciones funcional"
  echo "   ✅ Diseño responsive optimizado"
  echo ""
  echo "💡 Haz Cmd+Shift+R en el navegador para limpiar caché"
  echo ""
  echo "🔑 Credenciales de prueba:"
  echo "   Email: cualquier@email.com"
  echo "   Password: cualquier_password"
  
else
  echo ""
  echo "❌ ERROR EN COMPILACIÓN:"
  npm run build 2>&1 | tail -50
  exit 1
fi
