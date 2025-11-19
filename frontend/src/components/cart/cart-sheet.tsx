"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet"
import { useCartStore } from "@/store/cart"
import { formatCurrency, normalizeImageUrl } from "@/lib/utils"

export function CartSheet() {
    const {
        items,
        isOpen,
        toggleCart,
        updateQuantity,
        removeItem,
        getTotalPrice,
        getTotalItems
    } = useCartStore()

    return (
        <Sheet open={isOpen} onOpenChange={toggleCart}>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>
                        Carrito de Compras ({getTotalItems()})
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <Package className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Tu carrito está vacío</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={toggleCart}
                            >
                                <Link href="/productos">Continuar Comprando</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => {
                                const imagenPrincipal = item.producto.imagenes && item.producto.imagenes.length > 0
                                    ? item.producto.imagenes.sort((a, b) => a.orden - b.orden)[0]
                                    : null

                                return (
                                    <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                                        <div className="relative w-16 h-16 flex-shrink-0">
                                            {imagenPrincipal ? (
                                                <Image
                                                    src={normalizeImageUrl(imagenPrincipal.url)}
                                                    alt={item.producto.nombre}
                                                    fill
                                                    className="object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                                                    <Package className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm line-clamp-2">
                                                {item.producto.nombre}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                {item.producto.tamano}
                                            </p>
                                            <p className="text-sm font-semibold text-primary">
                                                {formatCurrency(item.precioUnitario)}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>

                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-8 text-center text-sm">
                                                    {item.cantidad}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>

                                            <p className="text-sm font-semibold">
                                                {formatCurrency(item.subtotal)}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <SheetFooter className="flex-col space-y-4">
                        <div className="flex justify-between items-center text-lg font-semibold">
                            <span>Total:</span>
                            <span>{formatCurrency(getTotalPrice())}</span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Link href="/carrito" onClick={toggleCart}>
                                <Button variant="outline" className="w-full">
                                    Ver Carrito Completo
                                </Button>
                            </Link>
                            <Link href="/checkout" onClick={toggleCart}>
                                <Button className="w-full">
                                    Proceder al Checkout
                                </Button>
                            </Link>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    )
}