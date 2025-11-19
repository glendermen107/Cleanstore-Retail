# 📋 Manual Técnico de Deployment - Cleanstore Retail

## 🏢 Información del Sistema

**Cleanstore Retail** es una plataforma completa de e-commerce desarrollada con tecnologías modernas:

- **Backend**: NestJS + TypeScript + PostgreSQL
- **Frontend**: Next.js 15 + React + TailwindCSS
- **Admin Panel**: Next.js 15 + React + TailwindCSS
- **Base de Datos**: PostgreSQL 16
- **Almacenamiento**: MinIO (S3-compatible)
- **Containerización**: Docker + Docker Compose

### 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Admin Panel   │    │   Backend API   │
│   (Next.js)     │    │   (Next.js)     │    │   (NestJS)      │
│   Port: 3002    │    │   Port: 3003    │    │   Port: 4002    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌─────────────────────────────────────────────────┐
         │              Docker Network                     │
         │            (cleanstore-network)                 │
         └─────────────────────────────────────────────────┘
                                 │
         ┌─────────────────┐    ┌─────────────────┐
         │   PostgreSQL    │    │     MinIO       │
         │   Port: 5433    │    │   Port: 9002/3  │
         └─────────────────┘    └─────────────────┘
```

---

## 🟦 1. Requisitos Previos

### 🖥️ Requisitos de Hardware

**Mínimos:**
- **CPU**: 2 cores
- **RAM**: 4 GB
- **Almacenamiento**: 20 GB libres
- **Red**: Conexión a Internet estable

**Recomendados:**
- **CPU**: 4+ cores
- **RAM**: 8+ GB
- **Almacenamiento**: 50+ GB SSD
- **Red**: Conexión de banda ancha

### 📦 Software Requerido

#### ✅ Obligatorio
- **Docker CE** (versión 20.10+)
- **Docker Compose V2** (versión 2.0+)
- **Git** (versión 2.30+)

#### 🔧 Opcional (para desarrollo)
- **Node.js** (versión 18+ LTS)
- **PostgreSQL Client** (psql)
- **MinIO Client** (mc)

### 🌐 Puertos Utilizados

| Servicio | Puerto Interno | Puerto Externo | Descripción |
|----------|----------------|----------------|-------------|
| Frontend | 3000 | 3002 | Aplicación web principal |
| Admin | 3001 | 3003 | Panel de administración |
| Backend | 4000 | 4002 | API REST |
| PostgreSQL | 5432 | 5433 | Base de datos |
| MinIO API | 9000 | 9002 | Almacenamiento de archivos |
| MinIO Console | 9001 | 9003 | Interfaz web de MinIO |

---

## 🟩 2. Preparación de la Máquina

### 🐧 Instalación en Ubuntu/Debian

#### Paso 1: Actualizar el sistema
```bash
sudo apt update && sudo apt upgrade -y
```

#### Paso 2: Instalar dependencias
```bash
sudo apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git
```

#### Paso 3: Instalar Docker CE
```bash
# Agregar clave GPG oficial de Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Agregar repositorio de Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Reiniciar sesión o ejecutar:
newgrp docker
```

#### Paso 4: Verificar instalación
```bash
docker --version
docker compose version
```

### 🪟 Instalación en Windows

#### Paso 1: Instalar Docker Desktop
1. Descargar Docker Desktop desde: https://www.docker.com/products/docker-desktop/
2. Ejecutar el instalador como administrador
3. Reiniciar el sistema cuando se solicite
4. Abrir Docker Desktop y completar la configuración inicial

#### Paso 2: Instalar Git
1. Descargar Git desde: https://git-scm.com/download/win
2. Ejecutar el instalador con configuración por defecto
3. Abrir Git Bash o PowerShell

#### Paso 3: Verificar instalación
```powershell
docker --version
docker compose version
git --version
```

### 🔄 Instalación en CentOS/RHEL

#### Paso 1: Instalar Docker
```bash
# Instalar yum-utils
sudo yum install -y yum-utils

# Agregar repositorio de Docker
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# Instalar Docker
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Iniciar y habilitar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER
```

### 📥 Clonar el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/cleanstore-retail.git

# Navegar al directorio
cd cleanstore-retail

# Verificar estructura
ls -la
```

### 🔧 Configuración de Variables de Entorno

#### Crear archivo de entorno de desarrollo
```bash
cat > .env.dev << 'EOF'
NODE_ENV=development
POSTGRES_HOST=cleanstore-postgres
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
POSTGRES_DB=cleanstore
MINIO_ENDPOINT=cleanstore-minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=password
MINIO_BUCKET=cleanstore
MINIO_USE_SSL=false
BACKEND_URL=http://cleanstore-backend:4000
FRONTEND_URL=http://cleanstore-frontend:3000
ADMIN_URL=http://cleanstore-admin:3001
NEXT_TELEMETRY_DISABLED=1
EOF
```

#### Crear archivo de entorno de producción
```bash
cat > .env.prod << 'EOF'
NODE_ENV=production
POSTGRES_HOST=cleanstore-postgres
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=SecurePassword123!
POSTGRES_DB=cleanstore
MINIO_ENDPOINT=cleanstore-minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=SecureMinIOPassword123!
MINIO_BUCKET=cleanstore
MINIO_USE_SSL=false
BACKEND_URL=http://cleanstore-backend:4000
FRONTEND_URL=http://cleanstore-frontend:3000
ADMIN_URL=http://cleanstore-admin:3001
NEXT_TELEMETRY_DISABLED=1
EOF
```

---

## 🟥 3. Construcción de Contenedores

### 🔨 Build Completo del Sistema

#### Paso 1: Limpiar entorno anterior (opcional)
```bash
# Detener contenedores existentes
docker compose down

# Limpiar imágenes, contenedores y volúmenes (⚠️ CUIDADO: Elimina datos)
docker system prune -a --volumes

# Limpiar solo imágenes sin usar
docker image prune -a
```

#### Paso 2: Construir todas las imágenes
```bash
# Build completo con logs detallados
docker compose build --no-cache --progress=plain

# Build individual por servicio (si es necesario)
docker compose build cleanstore-backend
docker compose build cleanstore-frontend
docker compose build cleanstore-admin
```

#### Paso 3: Verificar imágenes construidas
```bash
# Listar imágenes de Cleanstore
docker images | grep cleanstore

# Verificar tamaño de imágenes
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

### 🧹 Comandos de Limpieza

```bash
# Limpiar contenedores detenidos
docker container prune

# Limpiar imágenes sin usar
docker image prune

# Limpiar volúmenes sin usar
docker volume prune

# Limpiar redes sin usar
docker network prune

# Limpieza completa del sistema
docker system prune -a --volumes
```

---

## 🟧 4. Startup del Sistema

### 🚀 Inicio en Modo Desarrollo

#### Paso 1: Iniciar servicios
```bash
# Iniciar todos los servicios en background
docker compose up -d

# Iniciar con logs en tiempo real
docker compose up

# Iniciar servicios específicos
docker compose up -d cleanstore-postgres cleanstore-minio
```

#### Paso 2: Verificar estado de servicios
```bash
# Ver estado de todos los contenedores
docker compose ps

# Ver estado detallado
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

# Ver logs de todos los servicios
docker compose logs

# Ver logs de un servicio específico
docker compose logs -f cleanstore-backend
```

### 🏭 Inicio en Modo Producción

#### Paso 1: Usar script de producción
```bash
# Hacer ejecutable el script
chmod +x prod-up.sh

# Ejecutar script de producción
./prod-up.sh
```

#### Paso 2: Verificación manual
```bash
# Usar archivo de entorno de producción
docker compose --env-file .env.prod up -d

# Verificar servicios
docker compose ps
```

### 🔍 Verificación de Servicios

#### Backend API (Puerto 4002)
```bash
# Verificar health endpoint
curl -f http://localhost:4002/health

# Verificar API
curl -f http://localhost:4002/api/productos

# Verificar desde contenedor
docker exec cleanstore-backend curl -f http://localhost:4000/health
```

#### Frontend (Puerto 3002)
```bash
# Verificar página principal
curl -f http://localhost:3002

# Verificar desde navegador
# http://localhost:3002
```

#### Admin Panel (Puerto 3003)
```bash
# Verificar panel de admin
curl -f http://localhost:3003

# Verificar desde navegador
# http://localhost:3003
```

#### MinIO (Puertos 9002/9003)
```bash
# Verificar API de MinIO
curl -f http://localhost:9002/minio/health/live

# Acceder a consola web
# http://localhost:9003
# Usuario: admin
# Contraseña: password
```

#### PostgreSQL (Puerto 5433)
```bash
# Conectar con psql (si está instalado)
psql -h localhost -p 5433 -U admin -d cleanstore

# Verificar desde contenedor
docker exec -it cleanstore-postgres psql -U admin -d cleanstore -c "\dt"
```

### 📊 Monitoreo de Logs

```bash
# Logs de todos los servicios
docker compose logs -f

# Logs de un servicio específico
docker compose logs -f cleanstore-backend

# Logs con timestamp
docker compose logs -f -t

# Últimas 50 líneas de logs
docker compose logs --tail=50

# Logs desde una fecha específica
docker compose logs --since="2024-01-01T00:00:00"
```

---

## 🟨 5. Troubleshooting / Errores Comunes

### 🏥 Backend UNHEALTHY

#### Problema: Backend no responde en /health

**Síntomas:**
```bash
docker compose ps
# cleanstore-backend   unhealthy
```

**Diagnóstico:**
```bash
# Verificar logs del backend
docker compose logs cleanstore-backend

# Verificar si el puerto está abierto
docker exec cleanstore-backend netstat -tlnp | grep 4000

# Probar health endpoint internamente
docker exec cleanstore-backend curl -f http://localhost:4000/health
```

**Soluciones:**
```bash
# 1. Verificar variables de entorno
docker exec cleanstore-backend env | grep -E "(POSTGRES|MINIO)"

# 2. Reiniciar solo el backend
docker compose restart cleanstore-backend

# 3. Reconstruir el backend
docker compose build --no-cache cleanstore-backend
docker compose up -d cleanstore-backend

# 4. Verificar dependencias
docker compose logs cleanstore-postgres
docker compose logs cleanstore-minio
```

### 🌐 Frontend/Admin UNHEALTHY

#### Problema: Frontend o Admin no responden

**Síntomas:**
```bash
curl http://localhost:3002
# curl: (7) Failed to connect to localhost port 3002
```

**Diagnóstico:**
```bash
# Verificar logs
docker compose logs cleanstore-frontend
docker compose logs cleanstore-admin

# Verificar proceso Node.js
docker exec cleanstore-frontend ps aux | grep node
```

**Soluciones:**
```bash
# 1. Verificar build de Next.js
docker exec cleanstore-frontend ls -la /app/.next

# 2. Reiniciar servicio
docker compose restart cleanstore-frontend

# 3. Reconstruir imagen
docker compose build --no-cache cleanstore-frontend
docker compose up -d cleanstore-frontend

# 4. Verificar variables de entorno
docker exec cleanstore-frontend env | grep BACKEND_URL
```

### 🗄️ MinIO - Problemas de Credenciales

#### Problema: No se puede acceder a MinIO

**Síntomas:**
```bash
curl http://localhost:9002/minio/health/live
# Access Denied
```

**Soluciones:**
```bash
# 1. Verificar credenciales
docker exec cleanstore-minio env | grep MINIO_ROOT

# 2. Reiniciar MinIO
docker compose restart cleanstore-minio

# 3. Verificar volumen de datos
docker volume inspect cleanstore-minio-data

# 4. Recrear contenedor MinIO
docker compose stop cleanstore-minio
docker compose rm cleanstore-minio
docker compose up -d cleanstore-minio
```

### 🐘 PostgreSQL - No Inicia por Permisos

#### Problema: PostgreSQL no puede iniciar

**Síntomas:**
```bash
docker compose logs cleanstore-postgres
# FATAL: data directory "/var/lib/postgresql/data" has wrong ownership
```

**Soluciones:**
```bash
# 1. Verificar permisos del volumen
docker volume inspect cleanstore-postgres-data

# 2. Recrear volumen (⚠️ ELIMINA DATOS)
docker compose down
docker volume rm cleanstore-postgres-data
docker compose up -d cleanstore-postgres

# 3. Corregir permisos manualmente
docker run --rm -v cleanstore-postgres-data:/data alpine chown -R 999:999 /data
```

### 📁 Carpetas de Volumen No Creadas

#### Problema: Volúmenes no se crean correctamente

**Diagnóstico:**
```bash
# Listar volúmenes
docker volume ls | grep cleanstore

# Inspeccionar volumen
docker volume inspect cleanstore-postgres-data
```

**Soluciones:**
```bash
# 1. Crear volúmenes manualmente
docker volume create cleanstore-postgres-data
docker volume create cleanstore-minio-data

# 2. Recrear con docker compose
docker compose down
docker compose up -d
```

### 🔌 Problemas con Puertos Ocupados

#### Problema: Puerto ya está en uso

**Síntomas:**
```bash
docker compose up
# Error: bind: address already in use
```

**Diagnóstico:**
```bash
# Verificar qué proceso usa el puerto
sudo netstat -tlnp | grep :3002
sudo lsof -i :3002

# En Windows
netstat -ano | findstr :3002
```

**Soluciones:**
```bash
# 1. Cambiar puertos en docker-compose.yml
# Editar puertos externos: "3004:3000" en lugar de "3002:3000"

# 2. Detener proceso que usa el puerto
sudo kill -9 <PID>

# 3. Usar puertos alternativos
docker compose -f docker-compose.yml -f docker-compose.override.yml up -d
```

### 🔧 Variables de Entorno Mal Configuradas

#### Problema: Servicios no se conectan entre sí

**Diagnóstico:**
```bash
# Verificar variables en cada contenedor
docker exec cleanstore-backend env
docker exec cleanstore-frontend env
```

**Soluciones:**
```bash
# 1. Recrear archivo .env
cp .env.example .env

# 2. Reiniciar con nuevas variables
docker compose down
docker compose --env-file .env.prod up -d

# 3. Verificar red de Docker
docker network inspect cleanstore-network
```

### 🔄 Reinicio Completo del Sistema

```bash
# Script de reinicio completo
#!/bin/bash
echo "🛑 Deteniendo todos los servicios..."
docker compose down

echo "🧹 Limpiando contenedores..."
docker container prune -f

echo "🔄 Reiniciando servicios..."
docker compose up -d

echo "⏳ Esperando inicialización..."
sleep 30

echo "🏥 Verificando estado..."
docker compose ps
```

---

## 🟪 6. Deploy en Servidor Remoto

### 🌐 Preparación del Servidor

#### Paso 1: Conectar al servidor
```bash
# Conectar por SSH
ssh usuario@ip-del-servidor

# O usando clave privada
ssh -i ~/.ssh/mi-clave.pem usuario@ip-del-servidor
```

#### Paso 2: Instalar dependencias
```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-plugin git

# CentOS/RHEL
sudo yum update -y
sudo yum install -y docker git
sudo systemctl start docker
sudo systemctl enable docker
```

#### Paso 3: Configurar usuario
```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Reiniciar sesión
exit
ssh usuario@ip-del-servidor
```

### 📥 Clonación y Configuración

#### Paso 1: Clonar repositorio
```bash
# Clonar en el servidor
git clone https://github.com/tu-usuario/cleanstore-retail.git
cd cleanstore-retail

# Verificar rama
git branch -a
git checkout main
```

#### Paso 2: Configurar entorno de producción
```bash
# Crear configuración de producción
cat > .env.prod << 'EOF'
NODE_ENV=production
POSTGRES_HOST=cleanstore-postgres
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=SuperSecurePassword123!
POSTGRES_DB=cleanstore
MINIO_ENDPOINT=cleanstore-minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=SuperSecureMinIOPassword123!
MINIO_BUCKET=cleanstore
MINIO_USE_SSL=false
BACKEND_URL=http://cleanstore-backend:4000
FRONTEND_URL=http://cleanstore-frontend:3000
ADMIN_URL=http://cleanstore-admin:3001
NEXT_TELEMETRY_DISABLED=1
EOF

# Proteger archivo de configuración
chmod 600 .env.prod
```

### 🚀 Deployment Inicial

#### Paso 1: Build y deploy
```bash
# Hacer ejecutables los scripts
chmod +x *.sh

# Ejecutar build de producción
./prod-build.sh

# Iniciar en producción
./prod-up.sh
```

#### Paso 2: Verificar deployment
```bash
# Verificar servicios
docker compose ps

# Verificar conectividad
curl -f http://localhost:3002
curl -f http://localhost:4002/health

# Verificar logs
docker compose logs --tail=50
```

### 🔄 Actualización de la Aplicación

#### Script de actualización automática
```bash
cat > update-app.sh << 'EOF'
#!/bin/bash

echo "🔄 Actualizando Cleanstore Retail..."

# Backup de datos
echo "💾 Creando backup..."
./backup-data.sh

# Actualizar código
echo "📥 Actualizando código..."
git fetch origin
git pull origin main

# Reconstruir imágenes
echo "🔨 Reconstruyendo imágenes..."
docker compose build --no-cache

# Reiniciar servicios sin perder datos
echo "🔄 Reiniciando servicios..."
docker compose up -d

# Verificar estado
echo "🏥 Verificando estado..."
sleep 30
docker compose ps

echo "✅ Actualización completada!"
EOF

chmod +x update-app.sh
```

#### Actualización manual paso a paso
```bash
# 1. Crear backup
docker exec cleanstore-postgres pg_dump -U admin cleanstore > backup-$(date +%Y%m%d-%H%M%S).sql

# 2. Actualizar código
git pull origin main

# 3. Reconstruir solo si hay cambios en Dockerfile
docker compose build --no-cache cleanstore-backend
docker compose build --no-cache cleanstore-frontend
docker compose build --no-cache cleanstore-admin

# 4. Reiniciar servicios (mantiene datos)
docker compose up -d

# 5. Verificar
docker compose ps
docker compose logs --tail=20
```

### 💾 Backup y Restauración

#### Script de backup completo
```bash
cat > backup-data.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="backups/$(date +%Y%m%d-%H%M%S)"
mkdir -p $BACKUP_DIR

echo "💾 Creando backup completo..."

# Backup PostgreSQL
echo "📊 Backup de base de datos..."
docker exec cleanstore-postgres pg_dump -U admin cleanstore > $BACKUP_DIR/database.sql

# Backup MinIO (archivos)
echo "📁 Backup de archivos..."
docker run --rm -v cleanstore-minio-data:/data -v $(pwd)/$BACKUP_DIR:/backup alpine tar czf /backup/minio-data.tar.gz -C /data .

# Backup configuración
echo "⚙️ Backup de configuración..."
cp .env.prod $BACKUP_DIR/
cp docker-compose.yml $BACKUP_DIR/

echo "✅ Backup completado en: $BACKUP_DIR"
EOF

chmod +x backup-data.sh
```

#### Script de restauración
```bash
cat > restore-data.sh << 'EOF'
#!/bin/bash

if [ -z "$1" ]; then
    echo "Uso: ./restore-data.sh <directorio-backup>"
    exit 1
fi

BACKUP_DIR=$1

echo "🔄 Restaurando desde: $BACKUP_DIR"

# Detener servicios
docker compose down

# Restaurar base de datos
echo "📊 Restaurando base de datos..."
docker compose up -d cleanstore-postgres
sleep 10
docker exec -i cleanstore-postgres psql -U admin cleanstore < $BACKUP_DIR/database.sql

# Restaurar archivos MinIO
echo "📁 Restaurando archivos..."
docker run --rm -v cleanstore-minio-data:/data -v $(pwd)/$BACKUP_DIR:/backup alpine tar xzf /backup/minio-data.tar.gz -C /data

# Iniciar todos los servicios
docker compose up -d

echo "✅ Restauración completada!"
EOF

chmod +x restore-data.sh
```

### 🔒 Configuración de Firewall

#### Ubuntu/Debian (UFW)
```bash
# Habilitar UFW
sudo ufw enable

# Permitir SSH
sudo ufw allow ssh

# Permitir puertos de la aplicación
sudo ufw allow 3002/tcp  # Frontend
sudo ufw allow 3003/tcp  # Admin
sudo ufw allow 4002/tcp  # Backend
sudo ufw allow 9002/tcp  # MinIO API
sudo ufw allow 9003/tcp  # MinIO Console

# Verificar reglas
sudo ufw status
```

#### CentOS/RHEL (firewalld)
```bash
# Habilitar firewalld
sudo systemctl enable firewalld
sudo systemctl start firewalld

# Permitir puertos
sudo firewall-cmd --permanent --add-port=3002/tcp
sudo firewall-cmd --permanent --add-port=3003/tcp
sudo firewall-cmd --permanent --add-port=4002/tcp
sudo firewall-cmd --permanent --add-port=9002/tcp
sudo firewall-cmd --permanent --add-port=9003/tcp

# Recargar configuración
sudo firewall-cmd --reload

# Verificar
sudo firewall-cmd --list-ports
```

---

## 🔵 7. Actualización de la Aplicación

### 🔄 Proceso de Actualización Estándar

#### Paso 1: Preparación
```bash
# Crear backup antes de actualizar
./backup-data.sh

# Verificar estado actual
docker compose ps
docker compose logs --tail=10
```

#### Paso 2: Actualizar código fuente
```bash
# Obtener últimos cambios
git fetch origin
git status

# Ver cambios disponibles
git log --oneline HEAD..origin/main

# Aplicar cambios
git pull origin main
```

#### Paso 3: Identificar cambios
```bash
# Verificar si hay cambios en Dockerfiles
git diff HEAD~1 --name-only | grep -E "(Dockerfile|package\.json)"

# Verificar cambios en docker-compose.yml
git diff HEAD~1 docker-compose.yml
```

### 🔨 Actualización de Frontend/Admin

#### Cuando hay cambios en el código
```bash
# Reconstruir imagen del frontend
docker compose build --no-cache cleanstore-frontend

# Reiniciar solo el frontend
docker compose up -d cleanstore-frontend

# Verificar
curl -f http://localhost:3002
docker compose logs cleanstore-frontend --tail=20
```

#### Actualización del Admin Panel
```bash
# Reconstruir imagen del admin
docker compose build --no-cache cleanstore-admin

# Reiniciar solo el admin
docker compose up -d cleanstore-admin

# Verificar
curl -f http://localhost:3003
docker compose logs cleanstore-admin --tail=20
```

### 🔧 Actualización del Backend

#### Con cambios en la API
```bash
# Reconstruir backend
docker compose build --no-cache cleanstore-backend

# Reiniciar backend
docker compose up -d cleanstore-backend

# Verificar health
curl -f http://localhost:4002/health

# Verificar logs
docker compose logs cleanstore-backend --tail=30
```

#### Con migraciones de base de datos
```bash
# 1. Crear backup de la base de datos
docker exec cleanstore-postgres pg_dump -U admin cleanstore > migration-backup-$(date +%Y%m%d-%H%M%S).sql

# 2. Aplicar migraciones (si existen)
docker exec cleanstore-backend npm run migration:run

# 3. Verificar estado de la base de datos
docker exec -it cleanstore-postgres psql -U admin -d cleanstore -c "\dt"
```

### 🧹 Limpieza de Caché Docker

#### Limpieza selectiva
```bash
# Limpiar imágenes sin usar
docker image prune

# Limpiar contenedores detenidos
docker container prune

# Limpiar caché de build
docker builder prune
```

#### Limpieza completa (⚠️ Cuidado)
```bash
# Detener aplicación
docker compose down

# Limpieza completa (NO elimina volúmenes)
docker system prune -a

# Reconstruir todo
docker compose build --no-cache
docker compose up -d
```

### 📋 Script de Actualización Completa

```bash
cat > full-update.sh << 'EOF'
#!/bin/bash

set -e  # Salir si hay error

echo "🔄 Iniciando actualización completa de Cleanstore Retail..."

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: No se encuentra docker-compose.yml"
    exit 1
fi

# Crear backup
echo "💾 Creando backup..."
./backup-data.sh

# Actualizar código
echo "📥 Actualizando código fuente..."
git fetch origin
git pull origin main

# Verificar cambios en dependencias
if git diff HEAD~1 --name-only | grep -q "package\.json\|package-lock\.json"; then
    echo "📦 Detectados cambios en dependencias, reconstruyendo imágenes..."
    REBUILD_IMAGES=true
else
    echo "📦 No hay cambios en dependencias"
    REBUILD_IMAGES=false
fi

# Reconstruir imágenes si es necesario
if [ "$REBUILD_IMAGES" = true ]; then
    echo "🔨 Reconstruyendo imágenes..."
    docker compose build --no-cache
else
    echo "🔨 Reconstruyendo solo imágenes modificadas..."
    docker compose build
fi

# Reiniciar servicios
echo "🔄 Reiniciando servicios..."
docker compose up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 30

# Verificar estado
echo "🏥 Verificando estado de los servicios..."
docker compose ps

# Verificar conectividad
echo "🌐 Verificando conectividad..."
if curl -f http://localhost:4002/health > /dev/null 2>&1; then
    echo "✅ Backend: OK"
else
    echo "❌ Backend: ERROR"
fi

if curl -f http://localhost:3002 > /dev/null 2>&1; then
    echo "✅ Frontend: OK"
else
    echo "❌ Frontend: ERROR"
fi

if curl -f http://localhost:3003 > /dev/null 2>&1; then
    echo "✅ Admin: OK"
else
    echo "❌ Admin: ERROR"
fi

echo "✅ Actualización completada!"
echo ""
echo "📊 Para monitorear logs: docker compose logs -f"
echo "🛑 Para detener: docker compose down"
EOF

chmod +x full-update.sh
```

### 🔍 Verificación Post-Actualización

#### Checklist de verificación
```bash
# 1. Estado de contenedores
docker compose ps

# 2. Logs recientes
docker compose logs --tail=50

# 3. Conectividad de servicios
curl -f http://localhost:4002/health
curl -f http://localhost:3002
curl -f http://localhost:3003

# 4. Base de datos
docker exec cleanstore-postgres psql -U admin -d cleanstore -c "SELECT version();"

# 5. MinIO
curl -f http://localhost:9002/minio/health/live

# 6. Uso de recursos
docker stats --no-stream
```

---

## 🔥 8. Deploy en Oracle Cloud (OCI)

### ☁️ Configuración Inicial de Oracle Cloud

#### Paso 1: Crear Compute Instance
1. **Acceder a Oracle Cloud Console**
   - Ir a: https://cloud.oracle.com/
   - Iniciar sesión con tu cuenta

2. **Crear Compute Instance**
   ```
   Compute > Instances > Create Instance
   
   Configuración recomendada:
   - Name: cleanstore-production
   - Image: Ubuntu 22.04 LTS
   - Shape: VM.Standard.A1.Flex (ARM-based, Free Tier)
   - OCPU: 2
   - Memory: 12 GB
   - Boot Volume: 100 GB
   ```

3. **Configurar Red**
   ```
   Networking:
   - VCN: Create new VCN
   - Subnet: Create new public subnet
   - Assign public IP: Yes
   ```

4. **Configurar SSH**
   ```
   SSH Keys:
   - Upload your public key (.pub file)
   - Or generate new key pair
   ```

#### Paso 2: Configurar Security List (Firewall)
```bash
# En Oracle Cloud Console:
# Networking > Virtual Cloud Networks > Your VCN > Security Lists

# Agregar Ingress Rules:
Source: 0.0.0.0/0, Protocol: TCP, Port: 22   (SSH)
Source: 0.0.0.0/0, Protocol: TCP, Port: 80   (HTTP)
Source: 0.0.0.0/0, Protocol: TCP, Port: 443  (HTTPS)
Source: 0.0.0.0/0, Protocol: TCP, Port: 3002 (Frontend)
Source: 0.0.0.0/0, Protocol: TCP, Port: 3003 (Admin)
Source: 0.0.0.0/0, Protocol: TCP, Port: 4002 (Backend)
Source: 0.0.0.0/0, Protocol: TCP, Port: 9002 (MinIO API)
Source: 0.0.0.0/0, Protocol: TCP, Port: 9003 (MinIO Console)
```

### 🔧 Configuración del Servidor Oracle

#### Paso 1: Conectar al servidor
```bash
# Conectar usando SSH (reemplazar con tu IP pública)
ssh -i ~/.ssh/oracle-key ubuntu@XXX.XXX.XXX.XXX

# Actualizar sistema
sudo apt update && sudo apt upgrade -y
```

#### Paso 2: Instalar Docker en Oracle Linux/Ubuntu
```bash
# Instalar dependencias
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Agregar repositorio de Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Configurar usuario
sudo usermod -aG docker ubuntu
newgrp docker

# Verificar instalación
docker --version
docker compose version
```

#### Paso 3: Configurar firewall del sistema
```bash
# Ubuntu UFW
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3002/tcp
sudo ufw allow 3003/tcp
sudo ufw allow 4002/tcp
sudo ufw allow 9002/tcp
sudo ufw allow 9003/tcp

# Verificar
sudo ufw status
```

### 📥 Deployment en Oracle Cloud

#### Paso 1: Clonar y configurar
```bash
# Instalar Git
sudo apt install -y git

# Clonar repositorio
git clone https://github.com/tu-usuario/cleanstore-retail.git
cd cleanstore-retail

# Usar configuración optimizada para Oracle Cloud
cp docker-compose.oracle.yml docker-compose.yml
```

#### Paso 2: Configurar variables de entorno
```bash
# Crear configuración para Oracle Cloud
cat > .env.oracle << 'EOF'
NODE_ENV=production
POSTGRES_HOST=cleanstore-postgres
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=OracleSecurePassword123!
POSTGRES_DB=cleanstore
MINIO_ENDPOINT=cleanstore-minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=OracleMinIOSecurePassword123!
MINIO_BUCKET=cleanstore
MINIO_USE_SSL=false
BACKEND_URL=http://cleanstore-backend:4000
FRONTEND_URL=http://cleanstore-frontend:3000
ADMIN_URL=http://cleanstore-admin:3001
NEXT_TELEMETRY_DISABLED=1

# Oracle Cloud específico
POSTGRES_SHARED_BUFFERS=256MB
POSTGRES_EFFECTIVE_CACHE_SIZE=1GB
POSTGRES_WORK_MEM=8MB
EOF

# Proteger archivo
chmod 600 .env.oracle
```

#### Paso 3: Deploy inicial
```bash
# Hacer ejecutable el script de Oracle
chmod +x oracle-init.sh

# Ejecutar inicialización
./oracle-init.sh

# Iniciar servicios
docker compose --env-file .env.oracle up -d

# Verificar
docker compose ps
```

### 🌐 Configuración de Dominio y SSL

#### Paso 1: Configurar dominio (DNS)
```bash
# En tu proveedor de DNS, crear registros:
# A record: tu-dominio.com -> IP_PUBLICA_ORACLE
# A record: admin.tu-dominio.com -> IP_PUBLICA_ORACLE
# A record: api.tu-dominio.com -> IP_PUBLICA_ORACLE
```

#### Paso 2: Instalar Nginx y Certbot
```bash
# Instalar Nginx
sudo apt install -y nginx

# Instalar Certbot para Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx

# Crear configuración de Nginx
sudo tee /etc/nginx/sites-available/cleanstore << 'EOF'
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    location / {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name admin.tu-dominio.com;

    location / {
        proxy_pass http://localhost:3003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name api.tu-dominio.com;

    location / {
        proxy_pass http://localhost:4002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/cleanstore /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Paso 3: Configurar SSL con Let's Encrypt
```bash
# Obtener certificados SSL
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
sudo certbot --nginx -d admin.tu-dominio.com
sudo certbot --nginx -d api.tu-dominio.com

# Configurar renovación automática
sudo crontab -e
# Agregar línea:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### 🔄 Configurar Servicios con Systemd

#### Paso 1: Crear servicio systemd
```bash
sudo tee /etc/systemd/system/cleanstore.service << 'EOF'
[Unit]
Description=Cleanstore Retail Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ubuntu/cleanstore-retail
ExecStart=/usr/bin/docker compose --env-file .env.oracle up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Recargar systemd
sudo systemctl daemon-reload

# Habilitar servicio
sudo systemctl enable cleanstore.service

# Iniciar servicio
sudo systemctl start cleanstore.service

# Verificar estado
sudo systemctl status cleanstore.service
```

#### Paso 2: Configurar monitoreo
```bash
# Crear script de monitoreo
cat > /home/ubuntu/monitor-cleanstore.sh << 'EOF'
#!/bin/bash

LOG_FILE="/var/log/cleanstore-monitor.log"

echo "$(date): Verificando servicios Cleanstore..." >> $LOG_FILE

# Verificar contenedores
if ! docker compose ps | grep -q "Up"; then
    echo "$(date): ERROR - Servicios no están ejecutándose" >> $LOG_FILE
    systemctl restart cleanstore.service
fi

# Verificar conectividad
if ! curl -f http://localhost:4002/health > /dev/null 2>&1; then
    echo "$(date): ERROR - Backend no responde" >> $LOG_FILE
    docker compose restart cleanstore-backend
fi

echo "$(date): Verificación completada" >> $LOG_FILE
EOF

chmod +x /home/ubuntu/monitor-cleanstore.sh

# Agregar a crontab
(crontab -l 2>/dev/null; echo "*/5 * * * * /home/ubuntu/monitor-cleanstore.sh") | crontab -
```

### 📊 Optimización para Oracle Cloud Free Tier

#### Configuración de recursos limitados
```bash
# Crear docker-compose optimizado para Free Tier
cat > docker-compose.oracle-optimized.yml << 'EOF'
version: "3.9"

services:
  cleanstore-postgres:
    image: postgres:16-alpine
    container_name: cleanstore-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: cleanstore
      POSTGRES_SHARED_BUFFERS: 128MB
      POSTGRES_EFFECTIVE_CACHE_SIZE: 512MB
      POSTGRES_WORK_MEM: 4MB
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - cleanstore-network
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

  cleanstore-minio:
    image: minio/minio:latest
    container_name: cleanstore-minio
    restart: unless-stopped
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY}
    volumes:
      - minio_data:/data
    networks:
      - cleanstore-network
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M

  cleanstore-backend:
    build:
      context: ./backend
      dockerfile: dockerfile
    container_name: cleanstore-backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      NODE_OPTIONS: "--max-old-space-size=512"
      PORT: 4000
      POSTGRES_HOST: cleanstore-postgres
      POSTGRES_PORT: 5432
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: cleanstore
      MINIO_ENDPOINT: cleanstore-minio
      MINIO_PORT: 9000
      MINIO_ACCESS_KEY: ${MINIO_ACCESS_KEY}
      MINIO_SECRET_KEY: ${MINIO_SECRET_KEY}
      MINIO_BUCKET: cleanstore
      MINIO_USE_SSL: false
    ports:
      - "4002:4000"
    networks:
      - cleanstore-network
    depends_on:
      - cleanstore-postgres
      - cleanstore-minio
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M

  cleanstore-frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: cleanstore-frontend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      NODE_OPTIONS: "--max-old-space-size=512"
      NEXT_TELEMETRY_DISABLED: 1
      BACKEND_URL: http://cleanstore-backend:4000
    ports:
      - "3002:3000"
    networks:
      - cleanstore-network
    depends_on:
      - cleanstore-backend
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M

  cleanstore-admin:
    build:
      context: ./admin
      dockerfile: Dockerfile
    container_name: cleanstore-admin
    restart: unless-stopped
    environment:
      NODE_ENV: production
      NODE_OPTIONS: "--max-old-space-size=512"
      NEXT_TELEMETRY_DISABLED: 1
      BACKEND_URL: http://cleanstore-backend:4000
    ports:
      - "3003:3001"
    networks:
      - cleanstore-network
    depends_on:
      - cleanstore-backend
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M

networks:
  cleanstore-network:
    driver: bridge

volumes:
  postgres_data:
    driver: local
  minio_data:
    driver: local
EOF
```

### 🔍 Verificación Final en Oracle Cloud

```bash
# Verificar servicios
docker compose ps

# Verificar conectividad externa
curl -f http://tu-ip-publica:3002
curl -f http://tu-ip-publica:4002/health

# Verificar SSL (si configurado)
curl -f https://tu-dominio.com
curl -f https://admin.tu-dominio.com
curl -f https://api.tu-dominio.com

# Verificar logs
docker compose logs --tail=50

# Verificar recursos
docker stats --no-stream
free -h
df -h
```

---

## 📝 Comandos de Referencia Rápida

### 🚀 Comandos Básicos
```bash
# Iniciar aplicación
docker compose up -d

# Detener aplicación
docker compose down

# Ver estado
docker compose ps

# Ver logs
docker compose logs -f

# Reconstruir
docker compose build --no-cache

# Reiniciar servicio específico
docker compose restart cleanstore-backend
```

### 🔧 Comandos de Mantenimiento
```bash
# Backup completo
./backup-data.sh

# Actualizar aplicación
./full-update.sh

# Limpiar sistema
docker system prune -a

# Verificar salud
curl -f http://localhost:4002/health
```

### 📊 Comandos de Monitoreo
```bash
# Uso de recursos
docker stats

# Logs en tiempo real
docker compose logs -f --tail=100

# Verificar conectividad
curl -f http://localhost:3002
curl -f http://localhost:3003
curl -f http://localhost:4002/health
```

---

## ⚠️ Notas Importantes y Advertencias

### 🔒 Seguridad
- **Cambiar contraseñas por defecto** antes de producción
- **Usar HTTPS** en producción con certificados SSL
- **Configurar firewall** apropiadamente
- **Mantener Docker actualizado**

### 💾 Datos
- **Hacer backups regulares** de PostgreSQL y MinIO
- **Los volúmenes Docker persisten** los datos entre reinicios
- **`docker compose down --volumes`** **ELIMINA TODOS LOS DATOS**

### 🔄 Actualizaciones
- **Siempre hacer backup** antes de actualizar
- **Probar en desarrollo** antes de producción
- **Verificar logs** después de cada actualización

### 🌐 Red
- **Verificar puertos disponibles** antes del deployment
- **Configurar DNS** correctamente para dominios
- **Usar proxy reverso** (Nginx) en producción

---

## 📞 Soporte y Contacto

### 🐛 Reportar Problemas
- **GitHub Issues**: https://github.com/tu-usuario/cleanstore-retail/issues
- **Logs**: Siempre incluir logs relevantes
- **Versión**: Especificar versión de Docker y sistema operativo

### 📚 Documentación Adicional
- **Docker**: https://docs.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **Next.js**: https://nextjs.org/docs
- **NestJS**: https://docs.nestjs.com/

---

**✅ Manual completado - Cleanstore Retail v1.0**

*Última actualización: $(date +"%Y-%m-%d")*