"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/products/product-card"
import { CategoryCard } from "@/components/categories/category-card"
import { productosApi, categoriasApi, Producto, Categoria } from "@/lib/api"
import { ArrowRight, Star, Truck, Shield, CreditCard } from "lucide-react"

// Loading components
function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
            ))}
        </div>
    )
}

function CategoryGridSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-muted rounded-lg"></div>
                </div>
            ))}
        </div>
    )
}

// Client components for data fetching
function FeaturedProducts() {
    const [productos, setProductos] = useState<Producto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productosApi.getFeatured()
                setProductos(response.data.slice(0, 4))
            } catch (err) {
                console.error('Error fetching featured products:', err)
                setError('Error al cargar productos destacados')
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    if (loading) return <ProductGridSkeleton />

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">{error}</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productos.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
            ))}
        </div>
    )
}

function SaleProducts() {
    const [productos, setProductos] = useState<Producto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productosApi.getOnSale()
                setProductos(response.data.slice(0, 4))
            } catch (err) {
                console.error('Error fetching sale products:', err)
                setError('Error al cargar productos en oferta')
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    if (loading) return <ProductGridSkeleton />

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">{error}</p>
            </div>
        )
    }

    if (productos.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">No hay productos en oferta actualmente</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productos.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
            ))}
        </div>
    )
}

function Categories() {
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoriasApi.getAll()
                setCategorias(response.data.slice(0, 6))
            } catch (err) {
                console.error('Error fetching categories:', err)
                setError('Error al cargar categorías')
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    if (loading) return <CategoryGridSkeleton />

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">{error}</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categorias.map((categoria) => (
                <CategoryCard key={categoria.id} categoria={categoria} />
            ))}
        </div>
    )
}

export default function HomePage() {
    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Bienvenido a <span className="text-primary">Cleanstore</span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Encuentra los mejores productos de limpieza y cuidado del hogar.
                        Calidad garantizada y envío a domicilio.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/productos">
                            <Button size="lg" className="w-full sm:w-auto">
                                Ver Productos
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/ofertas">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                Ver Ofertas
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Truck className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">Envío Gratis</h3>
                        <p className="text-muted-foreground text-sm">
                            En compras sobre $30.000
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">Calidad Garantizada</h3>
                        <p className="text-muted-foreground text-sm">
                            Productos de las mejores marcas
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCard className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">Pago Seguro</h3>
                        <p className="text-muted-foreground text-sm">
                            Transacciones protegidas con WebPay
                        </p>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Explora por Categorías</h2>
                    <p className="text-muted-foreground">
                        Encuentra exactamente lo que necesitas
                    </p>
                </div>
                <Categories />
                <div className="text-center mt-8">
                    <Link href="/categorias">
                        <Button variant="outline">
                            Ver Todas las Categorías
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Featured Products */}
            <section className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Productos Destacados</h2>
                    <p className="text-muted-foreground">
                        Los productos más populares de nuestra tienda
                    </p>
                </div>
                <FeaturedProducts />
                <div className="text-center mt-8">
                    <Link href="/productos">
                        <Button variant="outline">
                            Ver Todos los Productos
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Sale Products */}
            <section className="bg-muted/50 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
                            <Star className="h-8 w-8 text-yellow-500" />
                            Ofertas Especiales
                        </h2>
                        <p className="text-muted-foreground">
                            Aprovecha estos precios únicos por tiempo limitado
                        </p>
                    </div>
                    <SaleProducts />
                    <div className="text-center mt-8">
                        <Link href="/ofertas">
                            <Button>
                                Ver Todas las Ofertas
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}