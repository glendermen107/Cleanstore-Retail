import axios from 'axios'

// Use the Next.js proxy instead of direct backend calls
const API_BASE_URL = '/api'

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
})

// Add request interceptor for logging (only in development)
if (process.env.NODE_ENV === 'development') {
    api.interceptors.request.use(
        (config) => {
            const url = config.url || ''
            const isFallbackEndpoint = url.includes('/destacados') || url.includes('/ofertas') || url.includes('/pagos/')

            if (!isFallbackEndpoint) {
                console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
            }
            return config
        },
        (error) => {
            console.error('❌ API Request Error:', error)
            return Promise.reject(error)
        }
    )
}

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => {
        if (process.env.NODE_ENV === 'development') {
            const url = response.config.url || ''
            const isFallbackEndpoint = url.includes('/destacados') || url.includes('/ofertas') || url.includes('/pagos/')

            if (!isFallbackEndpoint) {
                console.log(`✅ API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`)
            }
        }
        return response
    },
    (error) => {
        const url = error.config?.url || ''
        const isKnownFallbackEndpoint = url.includes('/destacados') || url.includes('/ofertas') || url.includes('/pagos/')

        if (process.env.NODE_ENV === 'development') {
            if (isKnownFallbackEndpoint) {
                // Only show a brief fallback message for known endpoints
                console.log(`⚠️ Using fallback for ${error.config?.method?.toUpperCase()} ${url}`)
            } else {
                console.error(`❌ API Error: ${error.response?.status || 'Network'} ${error.config?.method?.toUpperCase()} ${url}`)
                console.error('Error details:', error.message)
            }
        }

        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
            console.error('Backend server is not available')
        }
        return Promise.reject(error)
    }
)

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
}

export interface CreatePedidoDto {
    nombreCliente: string
    email: string
    telefono: string
    direccion: string
    comuna: string
    notas?: string
    items: {
        productoId: string
        cantidad: number
        precioUnitario: number
    }[]
}

export interface PaymentResponse {
    token: string
    url: string
}

// API Functions

// Productos
export const productosApi = {
    getAll: () => api.get<Producto[]>('/productos'),
    getById: (id: string) => api.get<Producto>(`/productos/${id}`),
    getFeatured: async () => {
        try {
            return await api.get<Producto[]>('/productos/destacados')
        } catch (error) {
            console.log('🔄 Fallback: Using client-side filtering for featured products')
            // Fallback: get all products and filter featured ones
            const allProducts = await api.get<Producto[]>('/productos')
            return {
                ...allProducts,
                data: allProducts.data.filter(p => p.esDestacado).slice(0, 8)
            }
        }
    },
    getOnSale: async () => {
        try {
            return await api.get<Producto[]>('/productos/ofertas')
        } catch (error) {
            console.log('🔄 Fallback: Using client-side filtering for sale products')
            // Fallback: get all products and filter sale ones
            const allProducts = await api.get<Producto[]>('/productos')
            return {
                ...allProducts,
                data: allProducts.data.filter(p => p.ofertaActiva && p.precioOferta && p.precioOferta > 0).slice(0, 8)
            }
        }
    },
    getByCategory: (categoryId: number) => api.get<Producto[]>(`/productos/categoria/${categoryId}`),
    search: (query: string) => api.get<Producto[]>(`/productos/buscar?q=${encodeURIComponent(query)}`),
}

// Categorías
export const categoriasApi = {
    getAll: () => api.get<Categoria[]>('/categorias'),
    getById: (id: number) => api.get<Categoria>(`/categorias/${id}`),
}

// Pedidos
export const pedidosApi = {
    create: (data: CreatePedidoDto) => api.post<Pedido>('/pedidos', data),
    getById: (id: string) => api.get<Pedido>(`/pedidos/${id}`),
}

// Pagos
export const pagosApi = {
    initiate: async (pedidoId: string) => {
        try {
            return await api.post<PaymentResponse>(`/pagos/iniciar/${pedidoId}`)
        } catch (error: any) {
            if (error.response?.status === 404) {
                console.log('🔄 Payment Fallback: Simulating payment process for demo purposes')
                // Fallback: simulate payment response for demo
                return {
                    data: {
                        token: `demo_token_${Date.now()}`,
                        url: `/checkout/success?pedido=${pedidoId}&demo=true`
                    },
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config: {} as any,
                    request: {} as any
                }
            }
            throw error
        }
    },
    confirm: async (token: string) => {
        try {
            return await api.post(`/pagos/confirmar/${token}`)
        } catch (error: any) {
            if (error.response?.status === 404) {
                console.log('🔄 Payment Confirmation Fallback: Simulating confirmation for demo')
                // Fallback: simulate confirmation response
                return {
                    data: { success: true, message: 'Payment confirmed (demo mode)' },
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config: {} as any,
                    request: {} as any
                }
            }
            throw error
        }
    },
}