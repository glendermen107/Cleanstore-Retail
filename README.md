# 🛍️ Cleanstore-Retail

**Plataforma eCommerce moderna y escalable**, construida con **NestJS**, **PostgreSQL**, **Redis**, **Meilisearch** y **Transbank Webpay** para pagos en línea.
Incluye módulos completos de productos, categorías, pedidos, pagos y administración básica.

---

# ✨ Características Principales

* 🛒 **Catálogo de productos** con categorías
* 🧺 **Carrito + checkout completo**
* 💳 **Pagos en línea con Webpay Plus**
* 📦 **Gestión de pedidos** (pendiente, pagado, cancelado)
* 🧾 **Integración profesional Webpay TEST** (ACK + retorno + validaciones)
* 🔎 **Buscador avanzado con Meilisearch**
* 🗄️ **Storage interno MinIO** (local)
* 🚀 Preparado para Docker y despliegue en VM

---

# 📦 Requisitos Previos

Asegúrate de tener instalados:

| Componente              | Versión recomendada |
| ----------------------- | ------------------- |
| Node.js                 | 18+                 |
| Docker + Docker Compose | Última versión      |
| PostgreSQL              | (si no usas Docker) |
| Redis                   | (si no usas Docker) |
| Meilisearch             | (si no usas Docker) |

👉 **Recomendación:** Siempre ejecutar con Docker Compose (mucho más simple).

---

# ⚡ Instalación y Ejecución con Docker (Recomendado)

El proyecto está preparado para levantarse completo con:

```
docker compose up -d
```

Esto levanta automáticamente:

* 📦 Backend NestJS
* 🐘 PostgreSQL
* ⚡ Redis
* 🔎 Meilisearch
* 📁 MinIO
* 🌐 PgAdmin (opcional)

### 1. Clonar el proyecto

```
git clone https://github.com/turepo/cleanstore-retail.git
cd cleanstore-retail
```

### 2. Crear archivo `.env`

Copia el ejemplo:

```
cp .env.example .env
```

Configura:

* Credenciales PostgreSQL
* Host del backend
* Llaves Webpay TEST (`COMMERCE_CODE`, `API_KEY_SECRET`)
* Config Redis
* Config Meilisearch

### 3. Construir e iniciar

```
docker compose build
docker compose up -d
```

### 4. Verificar servicios

| Servicio      | URL                                            |
| ------------- | ---------------------------------------------- |
| API Backend   | [http://localhost:4000](http://localhost:4000) |
| PgAdmin       | [http://localhost:5050](http://localhost:5050) |
| Meilisearch   | [http://localhost:7700](http://localhost:7700) |
| MinIO Console | [http://localhost:9001](http://localhost:9001) |

---

# 🧪 Ejecutar el proyecto sin Docker (modo manual)

### 1. Instalar dependencias

```
npm install
```

### 2. Levantar el backend

```
npm run start:dev
```

Debes tener PostgreSQL, Redis y Meilisearch corriendo localmente.

---

# 🔧 Scripts útiles

| Comando              | Descripción                       |
| -------------------- | --------------------------------- |
| `npm run start:dev`  | Modo desarrollo                   |
| `npm run build`      | Construcción para producción      |
| `npm run start:prod` | Ejecutar build en modo producción |
| `npm run test`       | Correr pruebas unitarias          |
| `npm run lint`       | Analizar código                   |

---

# 💳 Flujo de Pagos Webpay Implementado

1. Iniciar transacción → `/pagos/iniciar`
2. Formulario Webpay
3. Retorno del usuario → `/pagos/retorno?token_ws=...`
4. Confirmación Webpay (ACK) → `/pagos/ack`
5. Consulta de detalle → `/pagos/detalle/:token`

Incluye:

* Validación de montos
* Manejador de duplicados
* Manejo de errores Webpay (422, rechazado, cancelado)
* Idempotencia completa

---

# 📁 Estructura del Proyecto

```
src/
 ├── modules/
 │    ├── productos/
 │    ├── categorias/
 │    ├── pedidos/
 │    ├── pagos/
 │    └── auth/ (futuro)
 ├── common/
 ├── database/
 └── main.ts

