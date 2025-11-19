"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CategoryCard } from "@/components/categories/category-card"
import { categoriasApi, Categoria } from "@/lib/api"
import { ArrowLeft, FolderOpen } from "lucide-react"

export default function CategoriasPage() {
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                setError(null)
                const response = await categoriasApi.getAll()
                setCategorias(response.data)
            } catch (error) {
                console.error("Error fetching categorias:", error)
                setError("No se pudieron cargar las categorías. Por favor, intenta más tarde.")
            } finally {
                setLoading(false)
            }
        }

        fetchCategorias()
    }, [])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-8">
                    <div className="h-8 bg-muted rounded w-1/4"></div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-square bg-muted rounded-lg"></div>
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
                    <FolderOpen className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">Todas las Categorías</h1>
                </div>
                <p className="text-muted-foreground">
                    Explora nuestros productos organizados por categorías
                </p>
            </div>

            {/* Error State */}
            {error ? (
                <div className="text-center py-12">
                    <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Error al cargar categorías</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <div className="flex gap-4 justify-center">
                        <Button onClick={() => window.location.reload()}>
                            Reintentar
                        </Button>
                        <Link href="/productos">
                            <Button variant="outline">
                                Ver Todos los Productos
                            </Button>
                        </Link>
                    </div>
                </div>
            ) : /* Categories Grid */
                categorias.length === 0 ? (
                    <div className="text-center py-12">
                        <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No hay categorías disponibles</h3>
                        <p className="text-muted-foreground mb-4">
                            Actualmente no hay categorías configuradas.
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
                                {categorias.length} {categorias.length === 1 ? 'categoría' : 'categorías'} disponibles
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                            {categorias.map((categoria) => (
                                <CategoryCard key={categoria.id} categoria={categoria} />
                            ))}
                        </div>
                    </>
                )}

            {/* Call to Action */}
            <div className="mt-12 text-center">
                <div className="bg-muted/50 rounded-lg p-8">
                    <h3 className="text-xl font-semibold mb-2">¿Prefieres ver todos los productos?</h3>
                    <p className="text-muted-foreground mb-4">
                        Explora nuestra colección completa sin filtros
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