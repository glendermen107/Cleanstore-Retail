"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/products/product-card"
import { productosApi, categoriasApi, Producto, Categoria } from "@/lib/api"
import { ArrowLeft, Filter } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Props {
    params: Promise<{ id: string }>
}

export default function CategoriaPage({ params }: Props) {
    const [productos, setProductos] = useState<Producto[]>([])
    const [categoria, setCategoria] = useState<Categoria | null>(null)
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState<string>("name")
    const [priceRange, setPriceRange] = useState<string>("all")
    const [categoryId, setCategoryId] = useState<string | null>(null)

    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params
            setCategoryId(resolvedParams.id)
        }
        resolveParams()
    }, [params])

    useEffect(() => {
        if (!categoryId) return

        const fetchData = async () => {
            try {
                const categoryIdNum = parseInt(categoryId)

                const [productosResponse, categoriaResponse] = await Promise.all([
                    productosApi.getByCategory(categoryIdNum),
                    categoriasApi.getById(categoryIdNum),
                ])

                setProductos(productosResponse.data)
                setCategoria(categoriaResponse.data)
            } catch (error) {
                console.error("Error fetching data:", error)
                notFound()
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [categoryId])

    const filteredAndSortedProducts = productos
        .filter((producto) => {
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

    if (!categoria) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/productos"
                    className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a productos
                </Link>
                <h1 className="text-3xl font-bold mb-4">{categoria.nombre}</h1>
                <p className="text-muted-foreground">
                    {productos.length} {productos.length === 1 ? 'producto' : 'productos'} en esta categoría
                </p>
            </div>

            {/* Filters */}
            <div className="mb-8 flex flex-wrap gap-4">
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

            {/* Results Count */}
            <div className="mb-6">
                <p className="text-muted-foreground">
                    Mostrando {filteredAndSortedProducts.length} de {productos.length} productos
                </p>
            </div>

            {/* Products Grid */}
            {filteredAndSortedProducts.length === 0 ? (
                <div className="text-center py-12">
                    <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
                    <p className="text-muted-foreground mb-4">
                        No hay productos en esta categoría que coincidan con los filtros seleccionados
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => {
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

            {/* Back to Categories */}
            <div className="mt-12 text-center">
                <Link href="/productos">
                    <Button variant="outline">
                        Ver Todas las Categorías
                    </Button>
                </Link>
            </div>
        </div>
    )
}