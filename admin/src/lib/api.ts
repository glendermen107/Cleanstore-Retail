import axios from 'axios'

const API_BASE_URL = 'http://localhost:4000'

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Types
export interface Producto {
    id: string
    nombre: string
    descripcion: string
    precio: number
    stock: number
    tamano: string
    imagenUrl?: string
    categoriaId: number
    categoria: Categoria
    imagenes: ProductoImagen[]
    ofertaActiva: boolean
    precioOferta?: number
    esDestacado: boolean
    totalVentas?: number
    ingresosTotales?: number
    createdAt: string
    updatedAt: string
}

export interface ProductoImagen {
    id: string
    productoId: string
    url: string
    filename: string
    originalName: string
    mimeType: string
    size: number
    orden: number
    createdAt: string
    updatedAt: string
}

export interface Categoria {
    id: number
    nombre: string
    productos?: Producto[]
    totalProductos?: number
}

export interface Pedido {
    id: string
    nombreCliente: string
    email: string
    telefono: string
    direccion: string
    comuna: string
    notas?: string
    estado: string
    total: number
    items: PedidoItem[]
    pagos?: Pago[]
    totalItems?: number
    createdAt: string
    updatedAt: string
}

export interface PedidoItem {
    id: string
    cantidad: number
    precioUnitario: number
    subtotal: number
    productoId: string
    producto: Producto
    pedidoId: string
}

export interface Pago {
    id: string
    pedidoId: string
    token: string
    monto: number
    estado: string
    codigoAutorizacion?: string
    fechaTransaccion?: string
    metodoPago?: string
    responseData?: any
    createdAt: string
    updatedAt: string
}

export interface DashboardStats {
    totalProductos: number
    totalCategorias: number
    totalPedidos: number
    pedidosHoy: number
    ventasHoy: number
    ventasPorMes: VentasMensuales[]
    topProductos: TopProducto[]
}

export interface VentasMensuales {
    año: number
    mes: number
    totalVentas: number
    totalPedidos: number
}

export interface VentasDiarias {
    fecha: string
    totalVentas: number
    totalPedidos: number
}

export interface TopProducto {
    id: string
    nombre: string
    precio: number
    totalVendido: number
    ingresoTotal: number
}

export interface EstadisticasPedidos {
    estado: string
    cantidad: number
    totalMonto: number
}

// API Functions

// Productos
export const productosApi = {
    getAll: () => api.get<Producto[]>('/admin/productos'),
    getById: (id: string) => api.get<Producto>(`/admin/productos/${id}`),
    create: (data: Omit<Producto, 'id' | 'categoria' | 'imagenes' | 'createdAt' | 'updatedAt'>) =>
        api.post<Producto>('/admin/productos', data),
    update: (id: string, data: Partial<Producto>) =>
        api.put<Producto>(`/admin/productos/${id}`, data),
    delete: (id: string) => api.delete(`/admin/productos/${id}`),
    getTop: (limit: number = 10) => api.get<TopProducto[]>(`/admin/productos/top/${limit}`),
}

// Categorías
export const categoriasApi = {
    getAll: () => api.get<Categoria[]>('/admin/categorias'),
    getById: (id: number) => api.get<Categoria>(`/admin/categorias/${id}`),
    create: (data: { nombre: string }) => api.post<Categoria>('/admin/categorias', data),
    update: (id: number, data: { nombre: string }) =>
        api.put<Categoria>(`/admin/categorias/${id}`, data),
    delete: (id: number) => api.delete(`/admin/categorias/${id}`),
}

// Pedidos
export const pedidosApi = {
    getAll: () => api.get<Pedido[]>('/admin/pedidos'),
    getById: (id: string) => api.get<Pedido>(`/admin/pedidos/${id}`),
    updateEstado: (id: string, estado: string) =>
        api.patch<Pedido>(`/admin/pedidos/${id}/estado`, { estado }),
    getEstadisticas: () => api.get<EstadisticasPedidos[]>('/admin/pedidos/estadisticas'),
}

// Estadísticas
export const estadisticasApi = {
    getResumen: () => api.get<DashboardStats>('/admin/estadisticas/resumen'),
    getVentasPorDia: (dias: number = 30) =>
        api.get<VentasDiarias[]>(`/admin/estadisticas/ventas-por-dia?dias=${dias}`),
}

// Imágenes
export const imagenesApi = {
    upload: (productoId: string, files: File[]) => {
        const formData = new FormData()
        files.forEach(file => formData.append('files', file))
        return api.post<ProductoImagen[]>(`/imagenes/upload/${productoId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    delete: (productoId: string, imagenId: string) =>
        api.delete(`/imagenes/${productoId}/${imagenId}`),
    updateOrden: (productoId: string, imagenId: string, orden: number) =>
        api.patch(`/imagenes/${productoId}/${imagenId}/orden`, { orden }),
}