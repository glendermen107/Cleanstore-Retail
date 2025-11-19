"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductCard } from "@/components/products/product-card"
import { productosApi, categoriasApi, Producto, Categoria } from "@/lib/api"
import { Search, Filter, SlidersHorizontal } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function ProductosPage() {
    const [productos, setProductos] = useState<Producto[]>([])
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [sortBy, setSortBy] = useState<string>("name")
    const [priceRange, setPriceRange] = useState<string>("all")

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null)
                const [productosResponse, categoriasResponse] = await Promise.all([
                    productosApi.getAll(),
                    categoriasApi.getAll(),
                ])
                setProductos(productosResponse.data)
                setCategorias(categoriasResponse.data)
            } catch (error) {
                console.error("Error fetching data:", error)
                setError("No se pudieron cargar los productos. Por favor, verifica que el servidor esté funcionando.")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const filteredAndSortedProducts = productos
        .filter((producto) => {
            // Search filter
            if (searchQuery && !producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false
            }

            // Category filter
            if (selectedCategory !== "all" && producto.categoriaId !== parseInt(selectedCategory)) {
                return false
            }

            // Price range filter
            const precio = producto.ofertaActiva && producto.precioOferta
                ? producto.precioOferta
                : producto.precio

            if (priceRange !== "all") {
                const [min, max] = priceRange.split("-").map(Number)
                if (max) {
                    if (precio < min || precio > max) return false
                } else {
                    if (precio < min) return false
                }
            }

            return true
        })
        .sort((a, b) => {
            const precioA = a.ofertaActiva && a.precioOferta ? a.precioOferta : a.precio
            const precioB = b.ofertaActiva && b.precioOferta ? b.precioOferta : b.precio

            switch (sortBy) {
                case "price-low":
                    return precioA - precioB
                case "price-high":
                    return precioB - precioA
                case "name":
                    return a.nombre.localeCompare(b.nombre)
                case "newest":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                default:
                    return 0
            }
        })

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-8">
                    <div className="h-8 bg-muted rounded w-1/4"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="space-y-4">
                                <div className="aspect-square bg-muted rounded-lg"></div>
                                <div className="h-4 bg-muted rounded"></div>
                                <div className="h-4 bg-muted rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Todos los Productos</h1>
                <p className="text-muted-foreground">
                    Descubre nuestra amplia selección de productos de limpieza
                </p>
            </div>

            {/* Filters */}
            <div className="mb-8 space-y-4">
                {/* Search */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar productos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-4">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las categorías</SelectItem>
                            {categorias.map((categoria) => (
                                <SelectItem key={categoria.id} value={categoria.id.toString()}>
                                    {categoria.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={priceRange} onValueChange={setPriceRange}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Rango de precio" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los precios</SelectItem>
                            <SelectItem value="0-5000">$0 - $5.000</SelectItem>
                            <SelectItem value="5000-10000">$5.000 - $10.000</SelectItem>
                            <SelectItem value="10000-20000">$10.000 - $20.000</SelectItem>
                            <SelectItem value="20000">Más de $20.000</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name">Nombre A-Z</SelectItem>
                            <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                            <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                            <SelectItem value="newest">Más Recientes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
                <p className="text-muted-foreground">
                    Mostrando {filteredAndSortedProducts.length} de {productos.length} productos
                </p>
            </div>

            {/* Error State */}
            {error ? (
                <div className="text-center py-12">
                    <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Error al cargar productos</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <div className="flex gap-4 justify-center">
                        <Button onClick={() => window.location.reload()}>
                            Reintentar
                        </Button>
                        <Button variant="outline" onClick={() => window.open('http://localhost:4000/productos', '_blank')}>
                            Verificar API
                        </Button>
                    </div>
                </div>
            ) : /* Products Grid */
                filteredAndSortedProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
                        <p className="text-muted-foreground mb-4">
                            Intenta ajustar los filtros o términos de búsqueda
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery("")
                                setSelectedCategory("all")
                                setPriceRange("all")
                                setSortBy("name")
                            }}
                        >
                            Limpiar Filtros
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredAndSortedProducts.map((producto) => (
                            <ProductCard key={producto.id} producto={producto} />
                        ))}
                    </div>
                )}
        </div>
    )
}