"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { pedidosApi, type Pedido } from "@/lib/api"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import { ArrowLeft, Package, CreditCard, User, MapPin } from "lucide-react"

interface Props {
    params: { id: string }
}

const estadoColors = {
    pendiente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    procesando: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    enviado: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    entregado: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    cancelado: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    pagado: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
}

const estadosDisponibles = [
    "pendiente",
    "procesando",
    "pagado",
    "enviado",
    "entregado",
    "cancelado",
]

export default function PedidoDetailPage({ params }: Props) {
    const [pedido, setPedido] = useState<Pedido | null>(null)
    const [loading, setLoading] = useState(true)
    const [updatingEstado, setUpdatingEstado] = useState(false)

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                const response = await pedidosApi.getById(params.id)
                setPedido(response.data)
            } catch (error) {
                console.error("Error fetching pedido:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchPedido()
    }, [params.id])

    const handleEstadoChange = async (nuevoEstado: string) => {
        if (!pedido) return

        setUpdatingEstado(true)
        try {
            await pedidosApi.updateEstado(pedido.id, nuevoEstado)
            setPedido({ ...pedido, estado: nuevoEstado })
        } catch (error) {
            console.error("Error updating estado:", error)
            alert("Error al actualizar el estado del pedido")
        } finally {
            setUpdatingEstado(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Cargando...</h1>
            </div>
        )
    }

    if (!pedido) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Pedido no encontrado</h1>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/admin/pedidos">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Pedido #{pedido.id.slice(0, 8)}</h1>
                    <p className="text-muted-foreground">
                        Creado el {formatDateTime(pedido.createdAt)}
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items del Pedido */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Package className="mr-2 h-5 w-5" />
                                Items del Pedido
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead>Categoría</TableHead>
                                        <TableHead>Precio Unit.</TableHead>
                                        <TableHead>Cantidad</TableHead>
                                        <TableHead className="text-right">Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pedido.items?.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{item.producto?.nombre}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        ID: {item.producto?.id.slice(0, 8)}...
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>{item.producto?.categoria?.nombre || "N/A"}</TableCell>
                                            <TableCell>{formatCurrency(item.precioUnitario)}</TableCell>
                                            <TableCell>{item.cantidad}</TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatCurrency(item.subtotal)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <div className="mt-4 flex justify-end">
                                <div className="text-right">
                                    <p className="text-lg font-bold">
                                        Total: {formatCurrency(pedido.total)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Información de Pago */}
                    {pedido.pagos && pedido.pagos.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <CreditCard className="mr-2 h-5 w-5" />
                                    Información de Pago
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {pedido.pagos.map((pago) => (
                                    <div key={pago.id} className="space-y-2">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium">Estado del Pago</p>
                                                <Badge className={estadoColors[pago.estado as keyof typeof estadoColors] || "bg-gray-100 text-gray-800"}>
                                                    {pago.estado}
                                                </Badge>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Monto</p>
                                                <p>{formatCurrency(pago.monto)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Método de Pago</p>
                                                <p>{pago.metodoPago || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Código de Autorización</p>
                                                <p className="font-mono text-sm">{pago.codigoAutorizacion || "N/A"}</p>
                                            </div>
                                            {pago.fechaTransaccion && (
                                                <div>
                                                    <p className="text-sm font-medium">Fecha de Transacción</p>
                                                    <p>{formatDateTime(pago.fechaTransaccion)}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Estado del Pedido */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Estado del Pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium mb-2">Estado Actual</p>
                                <Badge className={estadoColors[pedido.estado as keyof typeof estadoColors] || "bg-gray-100 text-gray-800"}>
                                    {pedido.estado}
                                </Badge>
                            </div>

                            <div>
                                <p className="text-sm font-medium mb-2">Cambiar Estado</p>
                                <Select
                                    value={pedido.estado}
                                    onValueChange={handleEstadoChange}
                                    disabled={updatingEstado}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {estadosDisponibles.map((estado) => (
                                            <SelectItem key={estado} value={estado}>
                                                {estado}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Información del Cliente */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <User className="mr-2 h-5 w-5" />
                                Cliente
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm font-medium">Nombre</p>
                                <p>{pedido.nombreCliente}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Email</p>
                                <p>{pedido.email}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Teléfono</p>
                                <p>{pedido.telefono}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dirección de Entrega */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <MapPin className="mr-2 h-5 w-5" />
                                Dirección de Entrega
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm font-medium">Dirección</p>
                                <p>{pedido.direccion}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Comuna</p>
                                <p>{pedido.comuna}</p>
                            </div>
                            {pedido.notas && (
                                <div>
                                    <p className="text-sm font-medium">Notas</p>
                                    <p className="text-sm text-muted-foreground">{pedido.notas}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}