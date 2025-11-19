"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCartStore } from "@/store/cart"
import { pedidosApi, pagosApi } from "@/lib/api"
import { formatCurrency, normalizeImageUrl } from "@/lib/utils"
import { ArrowLeft, Package, CreditCard, Loader2 } from "lucide-react"

const checkoutSchema = z.object({
    nombreCliente: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    telefono: z.string().min(8, "Teléfono debe tener al menos 8 dígitos"),
    direccion: z.string().min(10, "La dirección debe tener al menos 10 caracteres"),
    comuna: z.string().min(2, "La comuna es requerida"),
    notas: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
    const router = useRouter()
    const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore()
    const [isProcessing, setIsProcessing] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
    })

    const subtotal = getTotalPrice()
    const shipping = subtotal >= 30000 ? 0 : 3000
    const total = subtotal + shipping

    // Redirect if cart is empty
    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <Package className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">No hay productos en el carrito</h1>
                    <p className="text-muted-foreground mb-8">
                        Agrega algunos productos antes de proceder al checkout.
                    </p>
                    <Link href="/productos">
                        <Button size="lg">
                            Ir a Productos
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    const onSubmit = async (data: CheckoutFormData) => {
        setIsProcessing(true)

        try {
            // Create order
            const orderData = {
                ...data,
                items: items.map(item => ({
                    productoId: item.producto.id,
                    cantidad: item.cantidad,
                    precioUnitario: item.precioUnitario,
                })),
            }

            const orderResponse = await pedidosApi.create(orderData)
            const pedido = orderResponse.data

            // Initiate payment
            const paymentResponse = await pagosApi.initiate(pedido.id)
            const { url } = paymentResponse.data

            // Clear cart
            clearCart()

            // Check if it's a demo URL (internal redirect) or external WebPay URL
            if (url.startsWith('/')) {
                // Internal demo redirect
                router.push(url)
            } else {
                // External WebPay redirect
                window.location.href = url
            }

        } catch (error: any) {
            console.error("Error processing checkout:", error)

            // Navigate to error page with details
            const errorMessage = error.response?.data?.message || error.message || 'Error desconocido'
            router.push(`/checkout/error?error=${encodeURIComponent(errorMessage)}`)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/carrito"
                    className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al carrito
                </Link>
                <h1 className="text-3xl font-bold">Checkout</h1>
                <p className="text-muted-foreground">
                    Completa tu información para finalizar la compra
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Checkout Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Información de Entrega
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nombreCliente">Nombre Completo *</Label>
                                        <Input
                                            id="nombreCliente"
                                            {...register("nombreCliente")}
                                            placeholder="Juan Pérez"
                                        />
                                        {errors.nombreCliente && (
                                            <p className="text-sm text-destructive">
                                                {errors.nombreCliente.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            {...register("email")}
                                            placeholder="juan@ejemplo.com"
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-destructive">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="telefono">Teléfono *</Label>
                                        <Input
                                            id="telefono"
                                            {...register("telefono")}
                                            placeholder="+56 9 1234 5678"
                                        />
                                        {errors.telefono && (
                                            <p className="text-sm text-destructive">
                                                {errors.telefono.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="comuna">Comuna *</Label>
                                        <Input
                                            id="comuna"
                                            {...register("comuna")}
                                            placeholder="Santiago"
                                        />
                                        {errors.comuna && (
                                            <p className="text-sm text-destructive">
                                                {errors.comuna.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="direccion">Dirección Completa *</Label>
                                    <Input
                                        id="direccion"
                                        {...register("direccion")}
                                        placeholder="Av. Providencia 1234, Depto 56"
                                    />
                                    {errors.direccion && (
                                        <p className="text-sm text-destructive">
                                            {errors.direccion.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notas">Notas Adicionales (Opcional)</Label>
                                    <Textarea
                                        id="notas"
                                        {...register("notas")}
                                        placeholder="Instrucciones especiales para la entrega..."
                                        rows={3}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="mr-2 h-4 w-4" />
                                            Pagar con WebPay ({formatCurrency(total)})
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle>Resumen del Pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Items */}
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                {items.map((item) => {
                                    const imagenPrincipal = item.producto.imagenes && item.producto.imagenes.length > 0
                                        ? item.producto.imagenes.sort((a, b) => a.orden - b.orden)[0]
                                        : null

                                    return (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="relative w-12 h-12 flex-shrink-0">
                                                {imagenPrincipal ? (
                                                    <Image
                                                        src={normalizeImageUrl(imagenPrincipal.url)}
                                                        alt={item.producto.nombre}
                                                        fill
                                                        className="object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                                                        <Package className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium line-clamp-2">
                                                    {item.producto.nombre}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {item.cantidad} x {formatCurrency(item.precioUnitario)}
                                                </p>
                                            </div>
                                            <div className="text-sm font-medium">
                                                {formatCurrency(item.subtotal)}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="border-t pt-4 space-y-2">
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

                                <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                                    <span>Total</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>

                            {/* Security Info */}
                            <div className="text-center pt-4 border-t">
                                <p className="text-xs text-muted-foreground">
                                    🔒 Pago 100% seguro con WebPay Plus
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Tus datos están protegidos
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}