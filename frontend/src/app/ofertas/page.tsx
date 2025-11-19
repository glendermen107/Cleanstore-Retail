"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/products/product-card"
import { productosApi, Producto } from "@/lib/api"
import { ArrowLeft, Star, Percent } from "lucide-react"

export default function OfertasPage() {
    const [productos, setProductos] = useState<Producto[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOfertas = async () => {
            try {
                const response = await productosApi.getOnSale()
                setProductos(response.data)
            } catch (error) {
                console.error("Error fetching ofertas:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchOfertas()
    }, [])

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
                <Link
                    href="/"
                    className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al inicio
                </Link>
                <div className="flex items-center gap-3 mb-4">
                    <Star className="h-8 w-8 text-yellow-500" />
                    <h1 className="text-3xl font-bold">Ofertas Especiales</h1>
                </div>
                <p className="text-muted-foreground">
                    Aprovecha estos precios únicos por tiempo limitado
                </p>
            </div>

            {/* Offer Banner */}
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Percent className="h-6 w-6 text-red-600" />
                    <h2 className="text-xl font-semibold text-red-600">¡Ofertas Limitadas!</h2>
                </div>
                <p className="text-muted-foreground">
                    Descuentos especiales en productos seleccionados. ¡No te pierdas estas oportunidades!
                </p>
            </div>

            {/* Products Grid */}
            {productos.length === 0 ? (
                <div className="text-center py-12">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay ofertas disponibles</h3>
                    <p className="text-muted-foreground mb-4">
                        Actualmente no tenemos productos en oferta, pero pronto habrá nuevas promociones.
                    </p>
                    <Link href="/productos">
                        <Button>
                            Ver Todos los Productos
                        </Button>
                    </Link>
                </div>
            ) : (
                <>
                    <div className="mb-6">
                        <p className="text-muted-foreground">
                            {productos.length} {productos.length === 1 ? 'producto' : 'productos'} en oferta
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {productos.map((producto) => (
                            <ProductCard key={producto.id} producto={producto} />
                        ))}
                    </div>
                </>
            )}

            {/* Call to Action */}
            <div className="mt-12 text-center">
                <div className="bg-muted/50 rounded-lg p-8">
                    <h3 className="text-xl font-semibold mb-2">¿No encontraste lo que buscabas?</h3>
                    <p className="text-muted-foreground mb-4">
                        Explora toda nuestra colección de productos
                    </p>
                    <Link href="/productos">
                        <Button size="lg">
                            Ver Todos los Productos
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}