"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { pedidosApi, type Pedido } from "@/lib/api"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import { Eye } from "lucide-react"

const estadoColors = {
    pendiente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    procesando: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    enviado: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    entregado: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    cancelado: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    pagado: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
}

export default function PedidosPage() {
    const [pedidos, setPedidos] = useState<Pedido[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await pedidosApi.getAll()
                setPedidos(response.data)
            } catch (error) {
                console.error("Error fetching pedidos:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchPedidos()
    }, [])

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Pedidos</h1>
                </div>
                <Card>
                    <CardContent className="p-6">
                        <p>Cargando pedidos...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Pedidos</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Pedidos</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Teléfono</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pedidos.map((pedido) => (
                                <TableRow key={pedido.id}>
                                    <TableCell className="font-mono text-sm">
                                        {pedido.id.slice(0, 8)}...
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{pedido.nombreCliente}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {pedido.comuna}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{pedido.email}</TableCell>
                                    <TableCell>{pedido.telefono}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                            {pedido.totalItems || 0} items
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {formatCurrency(pedido.total)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={estadoColors[pedido.estado as keyof typeof estadoColors] || "bg-gray-100 text-gray-800"}
                                        >
                                            {pedido.estado}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="text-sm">{formatDateTime(pedido.createdAt)}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/admin/pedidos/${pedido.id}`}>
                                            <Button variant="ghost" size="icon">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}