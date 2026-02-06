#!/bin/bash

# ==============================================
# BIGARTIST ROYALTIES - Script de Deployment
# ==============================================

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   BIGARTIST ROYALTIES - Deployment${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ==============================================
# CONFIGURACIÓN - Edita estos valores
# ==============================================

# Servidor
SERVER_USER="usuario"
SERVER_HOST="app.bigartist.es"
SERVER_PORT="22"

# Rutas en el servidor
SERVER_PATH="/var/www/bigartist"

# SSH Key (opcional, si usas autenticación por clave)
SSH_KEY=""  # Ejemplo: ~/.ssh/id_rsa

# ==============================================
# NO EDITAR DEBAJO DE ESTA LÍNEA
# ==============================================

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json no encontrado${NC}"
    echo -e "${RED}   Ejecuta este script desde la raíz del proyecto${NC}"
    exit 1
fi

# Paso 1: Instalar dependencias
echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al instalar dependencias${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencias instaladas${NC}"
echo ""

# Paso 2: Build del proyecto
echo -e "${YELLOW}🔨 Compilando proyecto React...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al compilar el proyecto${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Proyecto compilado${NC}"
echo ""

# Verificar que existe la carpeta dist o build
if [ ! -d "dist" ] && [ ! -d "build" ]; then
    echo -e "${RED}❌ Error: No se encontró la carpeta dist/ o build/${NC}"
    exit 1
fi

# Determinar carpeta de build
BUILD_DIR="dist"
if [ -d "build" ]; then
    BUILD_DIR="build"
fi

# Paso 3: Subir archivos al servidor
echo -e "${YELLOW}🚀 Subiendo archivos al servidor...${NC}"

# Construir comando SSH
SSH_CMD="ssh"
if [ ! -z "$SSH_KEY" ]; then
    SSH_CMD="$SSH_CMD -i $SSH_KEY"
fi
SSH_CMD="$SSH_CMD -p $SERVER_PORT"

# Construir comando RSYNC
RSYNC_CMD="rsync -avz --delete"
if [ ! -z "$SSH_KEY" ]; then
    RSYNC_CMD="$RSYNC_CMD -e 'ssh -i $SSH_KEY -p $SERVER_PORT'"
else
    RSYNC_CMD="$RSYNC_CMD -e 'ssh -p $SERVER_PORT'"
fi

# Ejecutar rsync
eval "$RSYNC_CMD $BUILD_DIR/ $SERVER_USER@$SERVER_HOST:$SERVER_PATH/"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al subir archivos al servidor${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Archivos subidos correctamente${NC}"
echo ""

# Paso 4: Reiniciar servicios (opcional)
echo -e "${YELLOW}🔄 Reiniciando servicios en el servidor...${NC}"

# Descomentar según tu configuración de servidor:

# Para Nginx:
# $SSH_CMD $SERVER_USER@$SERVER_HOST "sudo systemctl restart nginx"

# Para Apache:
# $SSH_CMD $SERVER_USER@$SERVER_HOST "sudo systemctl restart apache2"

# Para PM2 (si tienes backend Node.js):
# $SSH_CMD $SERVER_USER@$SERVER_HOST "cd $SERVER_PATH && pm2 restart all"

echo -e "${GREEN}✅ Servicios reiniciados${NC}"
echo ""

# Resumen final
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ ¡Deployment completado exitosamente!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🌐 URL: https://$SERVER_HOST${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
