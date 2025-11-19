"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCartStore } from "@/store/cart"
import { formatCurrency, normalizeImageUrl } from "@/lib/utils"
import { Minus, Plus, Trash2, Package, ArrowLeft, ShoppingCart } from "lucide-react"

export default function CarritoPage() {
    const {
        items,
        updateQuantity,
        removeItem,
        getTotalPrice,
        getTotalItems,
        clearCart
    } = useCartStore()

    const subtotal = getTotalPrice()
    const shipping = subtotal >= 30000 ? 0 : 3000 // Free shipping over $30,000
    const total = subtotal + shipping

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <Package className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
                    <p className="text-muted-foreground mb-8">
                        Parece que no has agregado ningún producto a tu carrito todavía.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/productos">
                            <Button size="lg">
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Continuar Comprando
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" size="lg">
                                Ir al Inicio
                            </Button>
                        </Link>
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
                    href="/productos"
                    className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continuar comprando
                </Link>
                <h1 className="text-3xl font-bold">Carrito de Compras</h1>
                <p className="text-muted-foreground">
                    {getTotalItems()} {getTotalItems() === 1 ? 'producto' : 'productos'} en tu carrito
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => {
                        const imagenPrincipal = item.producto.imagenes && item.producto.imagenes.length > 0
                            ? item.producto.imagenes.sort((a, b) => a.orden - b.orden)[0]
                            : null

                        return (
                            <Card key={item.id}>
                                <CardContent className="p-6">
                                    <div className="flex gap-4">
                                        {/* Product Image */}
                                        <div className="relative w-24 h-24 flex-shrink-0">
                                            {imagenPrincipal ? (
                                                <Image
                                                    src={normalizeImageUrl(imagenPrincipal.url)}
                                                    alt={item.producto.nombre}
                                                    fill
                                                    className="object-cover rounded-md"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                                                    <Package className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/productos/${item.producto.id}`}
                                                className="font-semibold hover:text-primary transition-colors"
                                            >
                                                {item.producto.nombre}
                                            </Link>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {item.producto.tamano}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Categoría: {item.producto.categoria?.nombre}
                                            </p>

                                            {/* Price */}
                                            <div className="mt-2">
                                                <span className="text-lg font-semibold text-primary">
                                                    {formatCurrency(item.precioUnitario)}
                                                </span>
                                                {item.producto.ofertaActiva && item.producto.precioOferta && (
                                                    <span className="ml-2 text-sm text-muted-foreground line-through">
                                                        {formatCurrency(item.producto.precio)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex flex-col items-end gap-4">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeItem(item.id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                                                    disabled={item.cantidad <= 1}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="w-12 text-center font-medium">
                                                    {item.cantidad}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                                                    disabled={item.cantidad >= item.producto.stock}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    {formatCurrency(item.subtotal)}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Stock: {item.producto.stock}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}

                    {/* Clear Cart */}
                    <div className="flex justify-end">
                        <Button
                            variant="outline"
                            onClick={clearCart}
                            className="text-destructive hover:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Vaciar Carrito
                        </Button>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle>Resumen del Pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span>Subtotal ({getTotalItems()} productos)</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Envío</span>
                                <span>
                                    {shipping === 0 ? (
                                        <span className="text-green-600 font-medium">Gratis</span>
                                    ) : (
                                        formatCurrency(shipping)
                                    )}
                                </span>
                            </div>

                            {shipping > 0 && (
                                <p className="text-sm text-muted-foreground">
                                    Envío gratis en compras sobre {formatCurrency(30000)}
                                </p>
                            )}

                            <div className="border-t pt-4">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>

                            <Link href="/checkout" className="block">
                                <Button size="lg" className="w-full">
                                    Proceder al Checkout
                                </Button>
                            </Link>

                            <Link href="/productos" className="block">
                                <Button variant="outline" className="w-full">
                                    Continuar Comprando
                                </Button>
                            </Link>

                            {/* Security Info */}
                            <div className="text-center pt-4 border-t">
                                <p className="text-xs text-muted-foreground">
                                    Pago seguro con WebPay Plus
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}