# Cleanstore Admin Panel

Panel de administración moderno para Cleanstore Retail construido con Next.js 14, TypeScript, Tailwind CSS y shadcn/ui.

## 🚀 Características

- ✅ **Next.js 14** con App Router
- ✅ **TypeScript** para type safety
- ✅ **Tailwind CSS v4** con tema OKLCH moderno
- ✅ **shadcn/ui** componentes
- ✅ **Tema Dark/Light** con next-themes
- ✅ **Dashboard completo** con estadísticas y gráficos
- ✅ **CRUD completo** de productos y categorías
- ✅ **Gestión de pedidos** con cambio de estados
- ✅ **Subida de imágenes** a MinIO
- ✅ **Integración completa** con backend NestJS
- ✅ **Responsive design**

## 📦 Instalación

1. **Instalar dependencias:**
```bash
cd admin
npm install
```

2. **Instalar dependencias adicionales:**
```bash
npm install tailwindcss-animate
```

## 🛠️ Configuración

### Backend API
Asegúrate de que el backend NestJS esté ejecutándose en `http://localhost:4000` con todos los endpoints del módulo admin implementados.

### Variables de entorno
El panel está configurado para conectarse automáticamente al backend en `localhost:4000`. Si necesitas cambiar la URL, modifica `src/lib/api.ts`.

## 🚀 Ejecutar en desarrollo

```bash
npm run dev
```

El panel estará disponible en `http://localhost:3001`

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Layout principal del admin
│   │   ├── page.tsx            # Dashboard
│   │   ├── productos/          # Gestión de productos
│   │   ├── categorias/         # Gestión de categorías
│   │   ├── pedidos/            # Gestión de pedidos
│   │   └── estadisticas/       # Estadísticas y reportes
│   ├── globals.css             # Estilos globales con tema OKLCH
│   └── layout.tsx              # Layout raíz
├── components/
│   ├── admin/                  # Componentes específicos del admin
│   ├── ui/                     # Componentes shadcn/ui
│   ├── theme-provider.tsx      # Proveedor de tema
│   └── theme-toggle.tsx        # Toggle dark/light
└── lib/
    ├── api.ts                  # Cliente API y tipos
    └── utils.ts                # Utilidades
```

## 🎨 Tema y Estilos

El panel utiliza un tema OKLCH moderno con:
- **Colores primarios:** Púrpura elegante
- **Modo oscuro/claro** automático
- **Componentes shadcn/ui** personalizados
- **Tipografía Inter** para mejor legibilidad

## 📊 Funcionalidades

### Dashboard
- Resumen de métricas clave
- Gráficos de ventas por mes
- Top productos más vendidos
- Estadísticas en tiempo real

### Productos
- Lista completa con filtros
- Crear/editar productos
- Subida múltiple de imágenes
- Gestión de ofertas y destacados
- Validaciones completas

### Categorías
- CRUD completo
- Validación de eliminación
- Conteo de productos asociados

### Pedidos
- Lista con estados y filtros
- Vista detallada completa
- Cambio de estados
- Información de pagos
- Datos del cliente

### Estadísticas
- Ventas por período
- Gráficos interactivos
- Análisis de pedidos por estado
- Métricas de rendimiento

## 🔌 Integración con Backend

El panel consume los siguientes endpoints del backend NestJS:

### Productos
- `GET /admin/productos` - Lista de productos
- `POST /admin/productos` - Crear producto
- `PUT /admin/productos/:id` - Actualizar producto
- `DELETE /admin/productos/:id` - Eliminar producto
- `GET /admin/productos/top/:limit` - Top productos

### Categorías
- `GET /admin/categorias` - Lista de categorías
- `POST /admin/categorias` - Crear categoría
- `PUT /admin/categorias/:id` - Actualizar categoría
- `DELETE /admin/categorias/:id` - Eliminar categoría

### Pedidos
- `GET /admin/pedidos` - Lista de pedidos
- `GET /admin/pedidos/:id` - Detalle de pedido
- `PATCH /admin/pedidos/:id/estado` - Cambiar estado

### Estadísticas
- `GET /admin/estadisticas/resumen` - Dashboard
- `GET /admin/estadisticas/ventas-por-dia` - Ventas diarias

### Imágenes
- `POST /imagenes/upload/:productoId` - Subir imágenes
- `DELETE /imagenes/:productoId/:imagenId` - Eliminar imagen

## 🚀 Producción

```bash
npm run build
npm start
```

## 🛠️ Desarrollo

### Agregar nuevos componentes shadcn/ui
```bash
npx shadcn-ui@latest add [component-name]
```

### Personalizar tema
Edita `src/app/globals.css` para modificar las variables CSS del tema OKLCH.

## 📝 Notas

- El panel está optimizado para pantallas de escritorio y tablets
- Todas las imágenes se manejan a través de MinIO
- Los formularios incluyen validación completa
- Los gráficos son responsivos y interactivos
- El tema se sincroniza automáticamente con las preferencias del sistema

## 🎯 Próximas mejoras

- [ ] Paginación en tablas
- [ ] Filtros avanzados
- [ ] Exportación de datos
- [ ] Notificaciones en tiempo real
- [ ] Gestión de usuarios admin
- [ ] Logs de actividad