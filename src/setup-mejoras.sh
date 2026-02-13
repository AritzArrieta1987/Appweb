#!/bin/bash

# =====================================================
# Script de Instalación de Mejoras v2.1.0
# BIGARTIST ROYALTIES
# =====================================================

set -e  # Exit on error

echo "=========================================="
echo "🎵 BIGARTIST ROYALTIES - Setup v2.1.0"
echo "=========================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# =====================================================
# 1. VERIFICAR REQUISITOS
# =====================================================

echo "📋 Verificando requisitos previos..."
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado"
    exit 1
else
    NODE_VERSION=$(node -v)
    print_success "Node.js detectado: $NODE_VERSION"
fi

# Verificar npm
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado"
    exit 1
else
    NPM_VERSION=$(npm -v)
    print_success "npm detectado: $NPM_VERSION"
fi

echo ""

# =====================================================
# 2. INSTALAR DEPENDENCIAS BACKEND
# =====================================================

echo "📦 Instalando nuevas dependencias del backend..."
echo ""

cd backend

if npm install express-rate-limit@7.1.5 winston@3.11.0; then
    print_success "Dependencias instaladas correctamente"
else
    print_error "Error instalando dependencias"
    exit 1
fi

cd ..
echo ""

# =====================================================
# 3. CONFIGURAR VARIABLES DE ENTORNO
# =====================================================

echo "⚙️  Configurando variables de entorno..."
echo ""

# Frontend .env
if [ ! -f .env ]; then
    cp .env.example .env
    print_success "Archivo .env creado (frontend)"
    print_warning "IMPORTANTE: Edita .env con tu configuración"
else
    print_info "Archivo .env ya existe (frontend)"
fi

# Backend .env
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    print_success "Archivo backend/.env creado"
    print_warning "IMPORTANTE: Edita backend/.env con tus credenciales"
else
    print_info "Archivo backend/.env ya existe"
fi

echo ""

# =====================================================
# 4. CREAR CARPETA DE LOGS
# =====================================================

echo "📝 Creando carpeta de logs..."
echo ""

if [ ! -d backend/logs ]; then
    mkdir -p backend/logs
    chmod 755 backend/logs
    print_success "Carpeta backend/logs creada"
else
    print_info "Carpeta backend/logs ya existe"
fi

echo ""

# =====================================================
# 5. VERIFICAR ARCHIVOS CRÍTICOS
# =====================================================

echo "🔍 Verificando archivos críticos..."
echo ""

REQUIRED_FILES=(
    "utils/validation.ts"
    "hooks/useNotifications.ts"
    "hooks/useContracts.ts"
    "hooks/usePaymentRequests.ts"
    "hooks/useScrollHeader.ts"
    "hooks/useAudioPlayer.ts"
    "backend/config/logger.js"
    "backend/routes/contracts.js"
)

ALL_FILES_OK=true

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "$file"
    else
        print_error "$file (falta)"
        ALL_FILES_OK=false
    fi
done

echo ""

if [ "$ALL_FILES_OK" = false ]; then
    print_error "Faltan archivos críticos"
    exit 1
fi

# =====================================================
# 6. GENERAR JWT SECRET SI ES NECESARIO
# =====================================================

echo "🔐 Generando JWT Secret..."
echo ""

if [ -f backend/.env ]; then
    # Verificar si JWT_SECRET está vacío o es el ejemplo
    if grep -q "JWT_SECRET=tu_jwt_secret" backend/.env; then
        NEW_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
        
        # Reemplazar en el archivo
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/JWT_SECRET=tu_jwt_secret.*/JWT_SECRET=$NEW_SECRET/" backend/.env
        else
            # Linux
            sed -i "s/JWT_SECRET=tu_jwt_secret.*/JWT_SECRET=$NEW_SECRET/" backend/.env
        fi
        
        print_success "JWT_SECRET generado automáticamente"
    else
        print_info "JWT_SECRET ya configurado"
    fi
fi

echo ""

# =====================================================
# 7. RESUMEN Y PRÓXIMOS PASOS
# =====================================================

echo "=========================================="
echo "✅ INSTALACIÓN COMPLETADA"
echo "=========================================="
echo ""

print_success "Todas las mejoras han sido instaladas correctamente"
echo ""

echo "📋 Próximos pasos:"
echo ""
echo "1. 📝 Editar archivos de configuración:"
echo "   - .env (frontend)"
echo "   - backend/.env (backend)"
echo ""
echo "2. 🗄️  Configurar base de datos:"
echo "   - DB_HOST, DB_USER, DB_PASSWORD en backend/.env"
echo ""
echo "3. 🚀 Iniciar servicios:"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: npm run dev"
echo ""
echo "4. 🧪 Verificar funcionamiento:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend:  http://localhost:5000/api/health"
echo ""
echo "=========================================="
echo ""

print_info "Para más detalles, consulta:"
echo "  - COMO_APLICAR_MEJORAS.md"
echo "  - MEJORAS_IMPLEMENTADAS.md"
echo ""

# =====================================================
# 8. VERIFICACIÓN OPCIONAL
# =====================================================

echo "¿Deseas verificar la instalación ahora? (s/n)"
read -r VERIFY

if [ "$VERIFY" = "s" ] || [ "$VERIFY" = "S" ]; then
    echo ""
    echo "🧪 Ejecutando verificaciones..."
    echo ""
    
    # Verificar que las nuevas dependencias están instaladas
    if npm list express-rate-limit --prefix backend &> /dev/null; then
        print_success "express-rate-limit instalado"
    else
        print_error "express-rate-limit NO instalado"
    fi
    
    if npm list winston --prefix backend &> /dev/null; then
        print_success "winston instalado"
    else
        print_error "winston NO instalado"
    fi
    
    echo ""
    print_info "Verificación completa"
fi

echo ""
print_success "¡Todo listo! 🎉"
echo ""
