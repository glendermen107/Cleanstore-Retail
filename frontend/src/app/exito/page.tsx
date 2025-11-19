"use client"

import { Suspense } from "react"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { pedidosApi, Pedido } from "@/lib/api"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import { CheckCircle, Package, Home, ShoppingBag } from "lucide-react"

function ExitoContent() {
    const searchParams = useSearchParams()
    const [pedido, setPedido] = useState<Pedido | null>(null)
    const [loading, setLoading] = useState(true)

    const token = searchParams.get("token_ws")
    const pedidoId = searchParams.get("pedido_id")

    useEffect(() => {
        const fetchPedido = async () => {
            if (pedidoId) {
                try {
                    const response = await pedidosApi.getById(pedidoId)
                    setPedido(response.data)
                } catch (error) {
                    console.error("Error fetching order:", error)
                }
            }
            setLoading(false)
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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
                {/* Success Icon */}
                <div className="mb-8">
                    <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-green-600 mb-2">
                        ¡Pago Exitoso!
                    </h1>
                    <p className="text-muted-foreground">
                        Tu pedido ha sido procesado correctamente
                    </p>
                </div>

                {/* Order Details */}
                {pedido && (
                    <Card className="text-left mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Detalles del Pedido
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium">Número de Pedido</p>
                                    <p className="text-sm text-muted-foreground font-mono">
                                        {pedido.id.slice(0, 8).toUpperCase()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Fecha</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDateTime(pedido.createdAt)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Total Pagado</p>
                                    <p className="text-lg font-bold text-green-600">
                                        {formatCurrency(pedido.total)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Estado</p>
                                    <p className="text-sm text-green-600 font-medium">
                                        Pagado
                                    </p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-sm font-medium mb-2">Dirección de Entrega</p>
                                <p className="text-sm text-muted-foreground">
                                    {pedido.nombreCliente}<br />
                                    {pedido.direccion}<br />
                                    {pedido.comuna}<br />
                                    {pedido.telefono}
                                </p>
                            </div>

                            {pedido.items && (
                                <div className="border-t pt-4">
                                    <p className="text-sm font-medium mb-2">
                                        Productos ({pedido.items.length})
                                    </p>
                                    <div className="space-y-2">
                                        {pedido.items.map((item) => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <span>
                                                    {item.cantidad}x {item.producto.nombre}
                                                </span>
                                                <span>{formatCurrency(item.subtotal)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Next Steps */}
                <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">¿Qué sigue?</h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Recibirás un email de confirmación en breve</li>
                            <li>• Tu pedido será preparado y enviado en 1-2 días hábiles</li>
                            <li>• Te notificaremos cuando tu pedido esté en camino</li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/">
                            <Button size="lg" className="w-full sm:w-auto">
                                <Home className="mr-2 h-4 w-4" />
                                Ir al Inicio
                            </Button>
                        </Link>
                        <Link href="/productos">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                Seguir Comprando
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Support */}
                <div className="mt-8 pt-8 border-t text-center">
                    <p className="text-sm text-muted-foreground">
                        ¿Tienes alguna pregunta sobre tu pedido?{" "}
                        <Link href="/contacto" className="text-primary hover:underline">
                            Contáctanos
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function ExitoPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <ExitoContent />
        </Suspense>
    )
}