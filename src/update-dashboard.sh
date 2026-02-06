#!/bin/bash

echo "🔄 Actualizando DashboardSimple con Bottom Navigation..."
echo ""

# Ruta del proyecto
PROJECT_PATH="/var/www/bigartist/repo"

cd $PROJECT_PATH

echo "✅ Actualizando componente DashboardSimple.tsx"
echo ""

# Aquí copiarías el archivo actualizado desde tu local
# O lo editarías directamente en el servidor

echo "📦 Recompilando..."
npm run build

echo ""
echo "🚀 Desplegando..."
sudo rm -rf /var/www/bigartist/frontend/*
sudo cp -rf dist/* /var/www/bigartist/frontend/
sudo chown -R www-data:www-data /var/www/bigartist/frontend/
sudo nginx -s reload

echo ""
echo "✅ ¡Actualización completada!"
echo "🌐 https://app.bigartist.es"
echo ""
echo "💡 Recarga con Cmd+Shift+R para ver cambios"
