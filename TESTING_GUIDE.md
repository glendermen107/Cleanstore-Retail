# 🧪 Guía Completa de Pruebas - Cleanstore Retail Backend

Esta guía te permitirá probar todos los módulos y funcionalidades del backend de e-commerce que hemos construido.

## 📋 Prerrequisitos

1. **Docker y Docker Compose** instalados
2. **Postman** o cualquier cliente REST
3. **Backend ejecutándose** en `http://localhost:4000`

## 🚀 Iniciar el Backend

```bash
cd Cleanstore-Retail
docker compose up --build
```

Espera a ver este mensaje:
```
[Nest] 1 - LOG [NestApplication] Nest application successfully started
```

---

## 🏗️ MÓDULO 1: CATEGORÍAS

### 1.1 Crear Categoría
```http
POST http://localhost:4000/categorias
Content-Type: application/json

{
  "nombre": "Electrónicos"
}
```

**Respuesta esperada:**
```json
{
  "id": 1,
  "nombre": "Electrónicos"
}
```

### 1.2 Listar Categorías
```http
GET http://localhost:4000/categorias
```

### 1.3 Obtener Categoría por ID
```http
GET http://localhost:4000/categorias/1
```

### 1.4 Actualizar Categoría
```http
PATCH http://localhost:4000/categorias/1
Content-Type: application/json

{
  "nombre": "Electrónicos y Gadgets"
}
```

---

## 📱 MÓDULO 2: PRODUCTOS

### 2.1 Crear Producto
```http
POST http://localhost:4000/productos
Content-Type: application/json

{
  "nombre": "iPhone 15 Pro",
  "descripcion": "Smartphone Apple con chip A17 Pro",
  "precio": 1299.99,
  "stock": 50,
  "tamano": "6.1 pulgadas",
  "imagenUrl": "https://example.com/iphone15.jpg",
  "categoriaId": 1,
  "ofertaActiva": false,
  "esDestacado": true
}
```

### 2.2 Crear Producto con Oferta
```http
POST http://localhost:4000/productos
Content-Type: application/json

{
  "nombre": "Samsung Galaxy S24",
  "descripcion": "Smartphone Samsung con IA integrada",
  "precio": 999.99,
  "stock": 30,
  "tamano": "6.2 pulgadas",
  "imagenUrl": "https://example.com/galaxy-s24.jpg",
  "categoriaId": 1,
  "ofertaActiva": true,
  "precioOferta": 799.99,
  "esDestacado": false
}
```

### 2.3 Listar Productos
```http
GET http://localhost:4000/productos
```

### 2.4 Obtener Producto por ID
```http
GET http://localhost:4000/productos/[ID_DEL_PRODUCTO]
```

---

## 🛒 MÓDULO 3: PEDIDOS

### 3.1 Crear Pedido Completo
```http
POST http://localhost:4000/pedidos
Content-Type: application/json

{
  "nombreCliente": "Juan Pérez",
  "email": "juan.perez@email.com",
  "telefono": "+56912345678",
  "direccion": "Av. Providencia 1234, Depto 501",
  "comuna": "Providencia",
  "notas": "Entregar en horario de oficina",
  "items": [
    {
      "productoId": "[ID_DEL_IPHONE]",
      "cantidad": 1
    },
    {
      "productoId": "[ID_DEL_SAMSUNG]",
      "cantidad": 2
    }
  ]
}
```

**Nota:** Reemplaza `[ID_DEL_IPHONE]` y `[ID_DEL_SAMSUNG]` con los IDs reales de los productos creados.

### 3.2 Listar Pedidos
```http
GET http://localhost:4000/pedidos
```

### 3.3 Obtener Pedido por ID
```http
GET http://localhost:4000/pedidos/[ID_DEL_PEDIDO]
```

### 3.4 Actualizar Estado del Pedido
```http
PATCH http://localhost:4000/pedidos/[ID_DEL_PEDIDO]
Content-Type: application/json

{
  "estado": "procesando",
  "notas": "Pedido en preparación"
}
```

---

## 💳 MÓDULO 4: PAGOS - FLUJO COMPLETO

### 4.1 Iniciar Transacción de Pago
```http
POST http://localhost:4000/pagos/iniciar
Content-Type: application/json

{
  "pedidoId": "[ID_DEL_PEDIDO]",
  "monto": 2099.97
}
```

**Respuesta esperada:**
```json
{
  "token": "01ab...",
  "url": "https://webpay3gint.transbank.cl/webpayserver/initTransaction"
}
```

### 4.2 Simular Retorno de Webpay (Pago Exitoso)
```http
GET http://localhost:4000/pagos/retorno?token_ws=[TOKEN_OBTENIDO]
```

### 4.3 Simular ACK de Webpay
```http
POST http://localhost:4000/pagos/ack
Content-Type: application/json

{
  "token_ws": "[TOKEN_OBTENIDO]"
}
```

### 4.4 Consultar Estado del Pago
```http
GET http://localhost:4000/pagos/detalle/[TOKEN_OBTENIDO]
```

---

## 🧪 PRUEBAS DE MANEJO DE ERRORES

### 5.1 Token Inexistente
```http
GET http://localhost:4000/pagos/retorno?token_ws=token_falso_123
```

**Respuesta esperada:**
```json
{
  "error": "token_ws_no_encontrado",
  "message": "Pago con token token_falso_123 no encontrado",
  "statusCode": 404
}
```

### 5.2 Token Faltante
```http
GET http://localhost:4000/pagos/retorno
```

**Respuesta esperada:**
```json
{
  "error": "token_ws_faltante_o_invalido",
  "message": "El parámetro token_ws es requerido"
}
```

### 5.3 Token Repetido (Doble Confirmación)
```http
# Ejecutar dos veces la misma llamada
GET http://localhost:4000/pagos/retorno?token_ws=[TOKEN_YA_PROCESADO]
```

**Segunda respuesta esperada:**
```json
{
  "error": "token_ws_ya_procesado",
  "message": "Este token ya fue procesado anteriormente",
  "estado": "autorizado"
}
```

### 5.4 ACK con Token Inexistente
```http
POST http://localhost:4000/pagos/ack
Content-Type: application/json

{
  "token_ws": "token_inexistente_123"
}
```

**Respuesta esperada:**
```json
{
  "ack": "ignored",
  "reason": "token_not_found",
  "message": "Token no encontrado en la base de datos"
}
```

### 5.5 ACK sin Token
```http
POST http://localhost:4000/pagos/ack
Content-Type: application/json

{}
```

**Respuesta esperada:**
```json
{
  "ack": "ignored",
  "reason": "token_not_provided",
  "message": "Token no proporcionado en el ACK"
}
```

---

## 🔍 PRUEBAS DE VALIDACIÓN

### 6.1 Producto con Datos Inválidos
```http
POST http://localhost:4000/productos
Content-Type: application/json

{
  "nombre": "",
  "precio": -100,
  "stock": -5,
  "imagenUrl": "url-invalida"
}
```

### 6.2 Pedido sin Items
```http
POST http://localhost:4000/pedidos
Content-Type: application/json

{
  "nombreCliente": "Test",
  "email": "email-invalido",
  "items": []
}
```

### 6.3 Pago con Monto Inválido
```http
POST http://localhost:4000/pagos/iniciar
Content-Type: application/json

{
  "pedidoId": "id-inexistente",
  "monto": -100
}
```

---

## 📊 VERIFICACIÓN DE RELACIONES

### 7.1 Categoría con Productos
```http
GET http://localhost:4000/categorias/1
```
Debe mostrar la categoría con sus productos relacionados.

### 7.2 Pedido con Items y Productos
```http
GET http://localhost:4000/pedidos/[ID_DEL_PEDIDO]
```
Debe mostrar el pedido con sus items y los productos completos.

### 7.3 Pago con Pedido Relacionado
```http
GET http://localhost:4000/pagos/detalle/[TOKEN]
```
Debe mostrar el pago con el pedido completo relacionado.

---

## ✅ CHECKLIST DE PRUEBAS

### Módulo Categorías
- [ ] ✅ Crear categoría
- [ ] ✅ Listar categorías
- [ ] ✅ Obtener categoría por ID
- [ ] ✅ Actualizar categoría
- [ ] ✅ Eliminar categoría

### Módulo Productos
- [ ] ✅ Crear producto básico
- [ ] ✅ Crear producto con oferta
- [ ] ✅ Listar productos
- [ ] ✅ Obtener producto por ID
- [ ] ✅ Actualizar producto
- [ ] ✅ Validaciones de datos

### Módulo Pedidos
- [ ] ✅ Crear pedido con múltiples items
- [ ] ✅ Cálculo automático de totales
- [ ] ✅ Validación de productos existentes
- [ ] ✅ Transacciones atómicas
- [ ] ✅ Listar pedidos con relaciones

### Módulo Pagos
- [ ] ✅ Iniciar transacción
- [ ] ✅ Procesar retorno exitoso
- [ ] ✅ Manejar tokens repetidos
- [ ] ✅ Manejar tokens inexistentes
- [ ] ✅ ACK servidor-a-servidor
- [ ] ✅ Respuestas siempre HTTP 200 OK

### Manejo de Errores
- [ ] ✅ Validaciones de entrada
- [ ] ✅ Tokens inválidos
- [ ] ✅ Recursos no encontrados
- [ ] ✅ Errores de Webpay
- [ ] ✅ Respuestas estructuradas

---

## 🎯 FLUJO COMPLETO DE PRUEBA

### Escenario: Compra Exitosa Completa

1. **Crear categoría** → `POST /categorias`
2. **Crear productos** → `POST /productos` (2-3 productos)
3. **Crear pedido** → `POST /pedidos` (con múltiples items)
4. **Iniciar pago** → `POST /pagos/iniciar`
5. **Simular pago exitoso** → `GET /pagos/retorno?token_ws=xxx`
6. **Confirmar ACK** → `POST /pagos/ack`
7. **Verificar estados finales** → `GET /pedidos/xxx` y `GET /pagos/detalle/xxx`

### Estados Esperados al Final:
- **Pedido:** `estado: "pagado"`
- **Pago:** `estado: "autorizado"`
- **Relaciones:** Todas las entidades correctamente vinculadas

---

## 🚨 Notas Importantes

1. **Orden de Pruebas:** Sigue el orden sugerido para evitar errores de dependencias
2. **IDs Dinámicos:** Reemplaza los `[ID_DEL_X]` con los IDs reales obtenidos
3. **Tokens:** Los tokens de Webpay son únicos, usa los obtenidos en cada prueba
4. **Estados:** Verifica que los estados cambien correctamente en cada paso
5. **Errores 422:** Son esperados en el entorno de pruebas de Webpay

---

## 🎉 ¡Listo!

Si todas las pruebas pasan correctamente, tu backend está completamente funcional y listo para producción. El sistema maneja:

- ✅ CRUD completo de todas las entidades
- ✅ Relaciones entre entidades
- ✅ Transacciones atómicas
- ✅ Integración completa con Webpay
- ✅ Manejo robusto de errores
- ✅ Validaciones de seguridad
- ✅ Cumplimiento de estándares de certificación

**¡Felicitaciones por tu backend de e-commerce completo!** 🚀