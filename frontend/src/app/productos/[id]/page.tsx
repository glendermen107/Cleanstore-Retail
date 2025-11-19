"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/products/product-card"
import { productosApi, Producto } from "@/lib/api"
import { formatCurrency, calculateDiscount, normalizeImageUrl } from "@/lib/utils"
import { useCartStore } from "@/store/cart"
import {
    ShoppingCart,
    Package,
    Minus,
    Plus,
    ArrowLeft,
    Star,
    Truck,
    Shield
} from "lucide-react"

interface Props {
    params: Promise<{ id: string }>
}

export default function ProductDetailPage({ params }: Props) {
    const [producto, setProducto] = useState<Producto | null>(null)
    const [relatedProducts, setRelatedProducts] = useState<Producto[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [productId, setProductId] = useState<string | null>(null)

    const { addItem, getItemQuantity } = useCartStore()

    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params
            setProductId(resolvedParams.id)
        }
        resolveParams()
    }, [params])

    useEffect(() => {
        if (!productId) return

        const fetchProduct = async () => {
            try {
                const response = await productosApi.getById(productId)
                setProducto(response.data)

                // Fetch related products from same category
                if (response.data.categoriaId) {
                    const relatedResponse = await productosApi.getByCategory(response.data.categoriaId)
                    setRelatedProducts(
                        relatedResponse.data
                            .filter(p => p.id !== response.data.id)
                            .slice(0, 4)
                    )
                }
            } catch (error) {
                console.error("Error fetching product:", error)
                notFound()
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [productId])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="aspect-square bg-muted rounded-lg"></div>
                        <div className="space-y-4">
                            <div className="h-8 bg-muted rounded w-3/4"></div>
                            <div className="h-4 bg-muted rounded w-1/2"></div>
                            <div className="h-6 bg-muted rounded w-1/4"></div>
                            <div className="h-20 bg-muted rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!producto) {
        notFound()
    }

    const precioFinal = producto.ofertaActiva && producto.precioOferta
        ? producto.precioOferta
        : producto.precio

    const descuento = producto.ofertaActiva && producto.precioOferta
        ? calculateDiscount(producto.precio, producto.precioOferta)
        : 0

    const imagenes = producto.imagenes?.sort((a, b) => a.orden - b.orden) || []
    const currentQuantityInCart = getItemQuantity(producto.id)

    const handleAddToCart = () => {
        addItem(producto, quantity)
        setQuantity(1)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="mb-6">
                <Link
                    href="/productos"
                    className="inline-flex items-center text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a productos
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Images */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="relative aspect-square overflow-hidden rounded-lg border">
                        {imagenes.length > 0 ? (
                            <Image
                                src={normalizeImageUrl(imagenes[selectedImageIndex]?.url || imagenes[0].url)}
                                alt={producto.nombre}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center bg-muted">
                                <Package className="h-24 w-24 text-muted-foreground" />
                            </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {producto.esDestacado && (
                                <Badge variant="default">Destacado</Badge>
                            )}
                            {producto.ofertaActiva && descuento > 0 && (
                                <Badge variant="destructive">-{descuento}%</Badge>
                            )}
                        </div>

                        {producto.stock === 0 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Badge variant="destructive" className="text-lg px-4 py-2">
                                    Agotado
                                </Badge>
                            </div>
                        )}
                    </div>

                    {/* Thumbnail Images */}
                    {imagenes.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {imagenes.map((imagen, index) => (
                                <button
                                    key={imagen.id}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`relative aspect-square overflow-hidden rounded border-2 transition-colors ${selectedImageIndex === index
                                        ? "border-primary"
                                        : "border-transparent hover:border-muted-foreground"
                                        }`}
                                >
                                    <Image
                                        src={normalizeImageUrl(imagen.url)}
                                        alt={`${producto.nombre} - ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{producto.nombre}</h1>
                        <p className="text-muted-foreground">
                            Categoría: {producto.categoria?.nombre}
                        </p>
                        {producto.tamano && (
                            <p className="text-muted-foreground">Tamaño: {producto.tamano}</p>
                        )}
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold text-primary">
                                {formatCurrency(precioFinal)}
                            </span>
                            {producto.ofertaActiva && producto.precioOferta && (
                                <span className="text-xl text-muted-foreground line-through">
                                    {formatCurrency(producto.precio)}
                                </span>
                            )}
                        </div>
                        {descuento > 0 && (
                            <p className="text-green-600 font-medium">
                                ¡Ahorras {formatCurrency(producto.precio - precioFinal)}!
                            </p>
                        )}
                    </div>

                    {/* Stock */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Stock disponible:</p>
                        <div className="flex items-center gap-2">
                            {producto.stock > 10 ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    En stock ({producto.stock} disponibles)
                                </Badge>
                            ) : producto.stock > 0 ? (
                                <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                                    Últimas {producto.stock} unidades
                                </Badge>
                            ) : (
                                <Badge variant="destructive">Agotado</Badge>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="font-semibold mb-2">Descripción</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {producto.descripcion}
                        </p>
                    </div>

                    {/* Quantity and Add to Cart */}
                    {producto.stock > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="font-medium">Cantidad:</span>
                                <div className="flex items-center border rounded-md">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="px-4 py-2 min-w-[3rem] text-center">
                                        {quantity}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setQuantity(Math.min(producto.stock, quantity + 1))}
                                        disabled={quantity >= producto.stock}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <Button
                                onClick={handleAddToCart}
                                size="lg"
                                className="w-full"
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Agregar al Carrito
                            </Button>

                            {currentQuantityInCart > 0 && (
                                <p className="text-sm text-muted-foreground text-center">
                                    Ya tienes {currentQuantityInCart} unidad(es) en tu carrito
                                </p>
                            )}
                        </div>
                    )}

                    {/* Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t">
                        <div className="flex items-center gap-3">
                            <Truck className="h-5 w-5 text-primary" />
                            <div>
                                <p className="font-medium text-sm">Envío gratis</p>
                                <p className="text-xs text-muted-foreground">En compras sobre $30.000</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-primary" />
                            <div>
                                <p className="font-medium text-sm">Garantía</p>
                                <p className="text-xs text-muted-foreground">Calidad garantizada</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-6">Productos Relacionados</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((relatedProduct) => (
                            <ProductCard key={relatedProduct.id} producto={relatedProduct} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}