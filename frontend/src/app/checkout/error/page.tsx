"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, ArrowLeft, Home, ShoppingBag, RefreshCw } from "lucide-react"

function CheckoutErrorContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error') || 'Error desconocido'
    const pedidoId = searchParams.get('pedido')

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Error Header */}
                <div className="text-center mb-8">
                    <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-red-600 mb-2">
                        Error en el Pago
                    </h1>
                    <p className="text-muted-foreground">
                        Hubo un problema al procesar tu pago
                    </p>
                </div>

                {/* Error Details */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <XCircle className="h-5 w-5" />
                            Detalles del Error
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            {error}
                        </p>
                        {pedidoId && (
                            <p className="text-xs text-muted-foreground">
                                ID de Pedido: {pedidoId}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* What to do next */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>¿Qué puedes hacer?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <RefreshCw className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium">Intentar Nuevamente</p>
                                    <p className="text-muted-foreground">
                                        Puedes volver al carrito e intentar el proceso de pago nuevamente
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <ShoppingBag className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium">Continuar Comprando</p>
                                    <p className="text-muted-foreground">
                                        Explora más productos y agrega items a tu carrito
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/carrito">
                        <Button size="lg" className="w-full sm:w-auto">
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            Volver al Carrito
                        </Button>
                    </Link>
                    <Link href="/productos">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
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

export default function CheckoutErrorPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <CheckoutErrorContent />
        </Suspense>
    )
}