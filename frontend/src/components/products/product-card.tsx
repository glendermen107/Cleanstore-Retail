"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Producto } from "@/lib/api"
import { formatCurrency, calculateDiscount, normalizeImageUrl } from "@/lib/utils"
import { useCartStore } from "@/store/cart"

interface ProductCardProps {
    producto: Producto
}

export function ProductCard({ producto }: ProductCardProps) {
    const { addItem } = useCartStore()

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        addItem(producto)
    }

    const precioFinal = producto.ofertaActiva && producto.precioOferta
        ? producto.precioOferta
        : producto.precio

    const descuento = producto.ofertaActiva && producto.precioOferta
        ? calculateDiscount(producto.precio, producto.precioOferta)
        : 0

    const imagenPrincipal = producto.imagenes && producto.imagenes.length > 0
        ? producto.imagenes.sort((a, b) => a.orden - b.orden)[0]
        : null

    return (
        <Link href={`/productos/${producto.id}`}>
            <Card className="group overflow-hidden transition-all hover:shadow-lg">
                <div className="relative aspect-square overflow-hidden">
                    {imagenPrincipal ? (
                        <Image
                            src={normalizeImageUrl(imagenPrincipal.url)}
                            alt={producto.nombre}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-muted">
                            <Package className="h-12 w-12 text-muted-foreground" />
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {producto.esDestacado && (
                            <Badge variant="default" className="text-xs">
                                Destacado
                            </Badge>
                        )}
                        {producto.ofertaActiva && descuento > 0 && (
                            <Badge variant="destructive" className="text-xs">
                                -{descuento}%
                            </Badge>
                        )}
                    </div>

                    {/* Stock Badge */}
                    {producto.stock <= 5 && producto.stock > 0 && (
                        <div className="absolute top-2 right-2">
                            <Badge variant="outline" className="text-xs bg-background">
                                Últimas {producto.stock}
                            </Badge>
                        </div>
                    )}

                    {producto.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="destructive">Agotado</Badge>
                        </div>
                    )}
                </div>

                <CardContent className="p-4">
                    <div className="space-y-2">
                        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                            {producto.nombre}
                        </h3>

                        {producto.tamano && (
                            <p className="text-sm text-muted-foreground">{producto.tamano}</p>
                        )}

                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary">
                                {formatCurrency(precioFinal)}
                            </span>
                            {producto.ofertaActiva && producto.precioOferta && (
                                <span className="text-sm text-muted-foreground line-through">
                                    {formatCurrency(producto.precio)}
                                </span>
                            )}
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Categoría: {producto.categoria?.nombre}
                        </p>
                    </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                    <Button
                        onClick={handleAddToCart}
                        disabled={producto.stock === 0}
                        className="w-full"
                        size="sm"
                    >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {producto.stock === 0 ? "Agotado" : "Agregar al Carrito"}
                    </Button>
                </CardFooter>
            </Card>
        </Link>
    )
}