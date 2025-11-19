# 📸 Guía de Subida de Imágenes - MinIO + NestJS

Esta guía te permite probar la funcionalidad completa de subida de imágenes para productos.

## 🚀 Iniciar el Sistema

```bash
cd Cleanstore-Retail
docker compose up --build
```

Espera a que todos los servicios estén listos:
- ✅ PostgreSQL en puerto 5432
- ✅ MinIO en puerto 9000 (API) y 9001 (Console)
- ✅ Backend NestJS en puerto 4000

## 🔧 Acceso a MinIO Console

Puedes acceder a la consola web de MinIO en:
```
http://localhost:9001
Usuario: admin
Contraseña: password
```

## 📋 Preparar Datos de Prueba

### 1. Crear Categoría
```bash
curl -X POST http://localhost:4000/categorias \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Smartphones"}'
```

### 2. Crear Producto
```bash
curl -X POST http://localhost:4000/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "iPhone 15 Pro",
    "descripcion": "Smartphone Apple con chip A17 Pro",
    "precio": 1299.99,
    "stock": 50,
    "tamano": "6.1 pulgadas",
    "categoriaId": 1,
    "ofertaActiva": false,
    "esDestacado": true
  }'
```

**Guarda el ID del producto devuelto para los siguientes pasos.**

---

## 📸 PRUEBAS DE SUBIDA DE IMÁGENES

### 3.1 Subir Una Imagen
```bash
curl -X POST http://localhost:4000/productos/[PRODUCTO_ID]/imagenes \
  -F "files=@ruta/a/tu/imagen1.jpg"
```

### 3.2 Subir Múltiples Imágenes
```bash
curl -X POST http://localhost:4000/productos/[PRODUCTO_ID]/imagenes \
  -F "files=@imagen1.jpg" \
  -F "files=@imagen2.png" \
  -F "files=@imagen3.webp"
```

### 3.3 Subir Imágenes con Orden Específico
```bash
curl -X POST http://localhost:4000/productos/[PRODUCTO_ID]/imagenes \
  -F "files=@imagen1.jpg" \
  -F "files=@imagen2.png" \
  -F "ordenes=[2,1]"
```

### 3.4 Listar Imágenes del Producto
```bash
curl -X GET http://localhost:4000/productos/[PRODUCTO_ID]/imagenes
```

**Respuesta esperada:**
```json
[
  {
    "id": "uuid-imagen-1",
    "productoId": "uuid-producto",
    "url": "http://localhost:9000/cleanstore/productos/uuid-producto/uuid-archivo.jpg",
    "filename": "productos/uuid-producto/uuid-archivo.jpg",
    "originalName": "imagen1.jpg",
    "mimeType": "image/jpeg",
    "size": 245760,
    "orden": 1,
    "createdAt": "2025-11-16T...",
    "updatedAt": "2025-11-16T..."
  }
]
```

### 3.5 Actualizar Orden de Imagen
```bash
curl -X PATCH http://localhost:4000/productos/[PRODUCTO_ID]/imagenes/[IMAGEN_ID]/orden \
  -H "Content-Type: application/json" \
  -d '{"orden": 5}'
```

### 3.6 Eliminar Imagen
```bash
curl -X DELETE http://localhost:4000/productos/[PRODUCTO_ID]/imagenes/[IMAGEN_ID]
```

### 3.7 Ver Producto con Imágenes
```bash
curl -X GET http://localhost:4000/productos/[PRODUCTO_ID]
```

---

## 🧪 PRUEBAS DE VALIDACIÓN

### 4.1 Archivo No Permitido (debe fallar)
```bash
curl -X POST http://localhost:4000/productos/[PRODUCTO_ID]/imagenes \
  -F "files=@documento.pdf"
```

**Respuesta esperada:**
```json
{
  "message": "Tipo de archivo no permitido: application/pdf",
  "error": "Bad Request",
  "statusCode": 400
}
```

### 4.2 Archivo Muy Grande (debe fallar)
```bash
# Crear archivo de prueba de 6MB (excede el límite de 5MB)
dd if=/dev/zero of=archivo_grande.jpg bs=1M count=6

curl -X POST http://localhost:4000/productos/[PRODUCTO_ID]/imagenes \
  -F "files=@archivo_grande.jpg"
```

### 4.3 Sin Archivos (debe fallar)
```bash
curl -X POST http://localhost:4000/productos/[PRODUCTO_ID]/imagenes
```

### 4.4 Producto Inexistente (debe fallar)
```bash
curl -X POST http://localhost:4000/productos/00000000-0000-0000-0000-000000000000/imagenes \
  -F "files=@imagen.jpg"
```

---

## 📱 PRUEBAS CON POSTMAN

### Configuración de Request

**1. Subir Imágenes:**
```
Method: POST
URL: http://localhost:4000/productos/{{productoId}}/imagenes
Headers: (ninguno necesario para multipart/form-data)

Body:
- Seleccionar "form-data"
- Key: "files" (tipo: File)
- Value: Seleccionar archivo(s)
- Para múltiples archivos, agregar múltiples keys "files"
```

**2. Orden Personalizado:**
```
Body (form-data):
- Key: "files" (File) → imagen1.jpg
- Key: "files" (File) → imagen2.jpg  
- Key: "ordenes" (Text) → [2,1]
```

**3. Variables de Entorno en Postman:**
```json
{
  "baseUrl": "http://localhost:4000",
  "productoId": "uuid-del-producto-creado",
  "imagenId": "uuid-de-imagen-creada"
}
```

---

## 🔍 VERIFICACIÓN EN MINIO

### Acceder a MinIO Console
1. Ir a `http://localhost:9001`
2. Login: `admin` / `password`
3. Navegar al bucket `cleanstore`
4. Ver carpeta `productos/[PRODUCTO_ID]/`
5. Verificar que las imágenes se subieron correctamente

### URLs Públicas
Las imágenes son accesibles públicamente en:
```
http://localhost:9000/cleanstore/productos/[PRODUCTO_ID]/[FILENAME]
```

---

## 🎯 FLUJO COMPLETO DE PRUEBA

### Escenario: Galería de Producto Completa

1. **Crear categoría y producto** (pasos 1-2)
2. **Subir 3-4 imágenes** del producto
3. **Verificar orden automático** (1, 2, 3, 4)
4. **Cambiar orden** de una imagen
5. **Eliminar una imagen**
6. **Consultar producto final** con imágenes ordenadas
7. **Verificar en MinIO** que los archivos existen
8. **Acceder a URLs públicas** directamente en el navegador

### Estados Esperados:
- **Producto:** Incluye array `imagenes` ordenado
- **MinIO:** Archivos organizados en `productos/[ID]/`
- **URLs:** Accesibles públicamente
- **Base de datos:** Registros con metadatos completos

---

## 🚨 Tipos de Archivo Soportados

- ✅ **JPEG** (.jpg, .jpeg)
- ✅ **PNG** (.png)
- ✅ **WebP** (.webp)
- ❌ **GIF** (no soportado)
- ❌ **SVG** (no soportado)
- ❌ **PDF, DOC, etc.** (no soportados)

## 📏 Límites

- **Tamaño máximo por archivo:** 5MB
- **Número máximo de archivos por request:** 10
- **Orden mínimo:** 0
- **Orden máximo:** 100

---

## 🔧 Troubleshooting

### Error: "Cannot connect to MinIO"
```bash
# Verificar que MinIO está corriendo
docker ps | grep minio

# Verificar logs de MinIO
docker logs cleanstore-retail-minio-1
```

### Error: "Bucket does not exist"
- El bucket se crea automáticamente al iniciar el servicio
- Verificar variables de entorno en `.env`
- Reiniciar el backend si es necesario

### Error: "File too large"
- Verificar que el archivo sea menor a 5MB
- Comprimir la imagen si es necesario

### Imágenes no se ven en el navegador
- Verificar que la URL sea correcta
- Verificar que MinIO esté accesible en puerto 9000
- Verificar política del bucket (debe ser pública)

---

## 🎉 ¡Listo!

Si todas las pruebas pasan correctamente, tu sistema de subida de imágenes está completamente funcional:

- ✅ Subida múltiple de archivos
- ✅ Validación de tipos y tamaños
- ✅ Almacenamiento en MinIO
- ✅ URLs públicas accesibles
- ✅ Gestión de orden de imágenes
- ✅ Eliminación segura
- ✅ Integración con productos
- ✅ Manejo robusto de errores

**¡Tu sistema de imágenes está listo para producción!** 📸🚀