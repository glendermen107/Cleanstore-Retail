"use client"

import { Suspense } from "react"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { pedidosApi, Pedido } from "@/lib/api"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import { CheckCircle, Package, ArrowLeft, Home, ShoppingBag } from "lucide-react"

function CheckoutSuccessContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [pedido, setPedido] = useState<Pedido | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const pedidoId = searchParams.get('pedido')
    const isDemo = searchParams.get('demo') === 'true'

    useEffect(() => {
        const fetchPedido = async () => {
            if (!pedidoId) {
                setError('ID de pedido no encontrado')
                setLoading(false)
                return
            }

            try {
                const response = await pedidosApi.getById(pedidoId)
                setPedido(response.data)
            } catch (err) {
                console.error('Error fetching order:', err)
                setError('Error al cargar los detalles del pedido')
            } finally {
                setLoading(false)
            }
        }

        fetchPedido()
    }, [pedidoId])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-muted rounded w-1/2 mx-auto"></div>
                        <div className="h-64 bg-muted rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !pedido) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <Package className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Error</h1>
                    <p className="text-muted-foreground mb-8">
                        {error || 'No se pudo cargar la información del pedido'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/productos">
                            <Button>
                                <ShoppingBag className="mr-2 h-5 w-5" />
                                Continuar Comprando
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline">
                                <Home className="mr-2 h-5 w-5" />
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
            <div className="max-w-2xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-green-600 mb-2">
                        ¡Pedido Confirmado!
                    </h1>
                    <p className="text-muted-foreground">
                        Tu pedido ha sido procesado exitosamente
                    </p>
                    {isDemo && (
                        <Badge variant="outline" className="mt-2">
                            Modo Demo - Sin pago real
                        </Badge>
                    )}
                </div>

                {/* Order Details */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Detalles del Pedido
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Número de Pedido</p>
                                <p className="font-mono text-sm">{pedido.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Fecha</p>
                                <p className="text-sm">{formatDateTime(pedido.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Estado</p>
                                <Badge variant="secondary">{pedido.estado}</Badge>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-lg font-semibold text-primary">
                                    {formatCurrency(pedido.total)}
                                </p>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2">Información de Entrega</h4>
                            <div className="text-sm space-y-1">
                                <p><strong>Nombre:</strong> {pedido.nombreCliente}</p>
                                <p><strong>Email:</strong> {pedido.email}</p>
                                <p><strong>Teléfono:</strong> {pedido.telefono}</p>
                                <p><strong>Dirección:</strong> {pedido.direccion}</p>
                                <p><strong>Comuna:</strong> {pedido.comuna}</p>
                                {pedido.notas && (
                                    <p><strong>Notas:</strong> {pedido.notas}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Order Items */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Productos Pedidos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {pedido.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                    <div className="flex-1">
                                        <p className="font-medium">{item.producto.nombre}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.cantidad} x {formatCurrency(item.precioUnitario)}
                                        </p>
                                    </div>
                                    <p className="font-semibold">
                                        {formatCurrency(item.subtotal)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Next Steps */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>¿Qué sigue?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                                    1
                                </div>
                                <div>
                                    <p className="font-medium">Confirmación por Email</p>
                                    <p className="text-muted-foreground">
                                        Recibirás un email de confirmación en {pedido.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                                    2
                                </div>
                                <div>
                                    <p className="font-medium">Preparación del Pedido</p>
                                    <p className="text-muted-foreground">
                                        Prepararemos tu pedido en 1-2 días hábiles
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                                    3
                                </div>
                                <div>
                                    <p className="font-medium">Envío a Domicilio</p>
                                    <p className="text-muted-foreground">
                                        Tu pedido será enviado a {pedido.direccion}, {pedido.comuna}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/productos">
                        <Button size="lg" className="w-full sm:w-auto">
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            Continuar Comprando
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                            <Home className="mr-2 h-5 w-5" />
                            Ir al Inicio
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
export
    default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <CheckoutSuccessContent />
        </Suspense>
    )
}