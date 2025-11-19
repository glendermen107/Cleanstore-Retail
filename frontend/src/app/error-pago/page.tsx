"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, CreditCard, Home, ShoppingCart, RefreshCw } from "lucide-react"

function ErrorPagoContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get("error") || "Error desconocido"

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
                {/* Error Icon */}
                <div className="mb-8">
                    <XCircle className="h-24 w-24 text-red-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-red-600 mb-2">
                        Error en el Pago
                    </h1>
                    <p className="text-muted-foreground">
                        No se pudo procesar tu pago correctamente
                    </p>
                </div>

                {/* Error Details */}
                <Card className="text-left mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <CreditCard className="h-5 w-5" />
                            Detalles del Error
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                            <p className="text-sm">
                                <strong>Motivo:</strong> {error}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Possible Causes */}
                <div className="bg-yellow-50 dark:bg-yellow-950 p-6 rounded-lg mb-8">
                    <h3 className="font-semibold mb-3">Posibles causas del error:</h3>
                    <ul className="text-sm text-left space-y-2">
                        <li>• Fondos insuficientes en tu tarjeta</li>
                        <li>• Datos de la tarjeta incorrectos</li>
                        <li>• Tarjeta bloqueada o vencida</li>
                        <li>• Problemas de conexión durante el pago</li>
                        <li>• Límites de compra excedidos</li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <h3 className="font-semibold">¿Qué puedes hacer?</h3>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/carrito">
                            <Button size="lg" className="w-full sm:w-auto">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Intentar Nuevamente
                            </Button>
                        </Link>
                        <Link href="/productos">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Continuar Comprando
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                <Home className="mr-2 h-4 w-4" />
                                Ir al Inicio
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Help */}
                <div className="mt-8 pt-8 border-t">
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">¿Necesitas ayuda?</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                            Si el problema persiste, no dudes en contactarnos
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                            <Link href="/contacto">
                                <Button variant="outline" size="sm">
                                    Contactar Soporte
                                </Button>
                            </Link>
                            <a href="tel:+56912345678">
                                <Button variant="outline" size="sm">
                                    Llamar: +56 9 1234 5678
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Security Note */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-muted-foreground">
                        🔒 Tus datos están seguros. No se realizó ningún cargo a tu tarjeta.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function ErrorPagoPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <ErrorPagoContent />
        </Suspense>
    )
}