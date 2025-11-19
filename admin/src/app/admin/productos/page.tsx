"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
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
import { productosApi, type Producto } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import { Plus, Edit, Trash2, Package } from "lucide-react"

export default function ProductosPage() {
    const [productos, setProductos] = useState<Producto[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await productosApi.getAll()
                setProductos(response.data)
            } catch (error) {
                console.error("Error fetching productos:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProductos()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) {
            return
        }

        try {
            await productosApi.delete(id)
            setProductos(productos.filter(p => p.id !== id))
        } catch (error) {
            console.error("Error deleting producto:", error)
            alert("Error al eliminar el producto. Puede que tenga ventas asociadas.")
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Productos</h1>
                </div>
                <Card>
                    <CardContent className="p-6">
                        <p>Cargando productos...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Productos</h1>
                <Link href="/admin/productos/crear">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Producto
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Productos</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Imagen</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Precio</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Ventas</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {productos.map((producto) => (
                                <TableRow key={producto.id}>
                                    <TableCell>
                                        {producto.imagenes && producto.imagenes.length > 0 ? (
                                            <Image
                                                src={producto.imagenes[0].url}
                                                alt={producto.nombre}
                                                width={40}
                                                height={40}
                                                className="rounded-md object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                                                <Package className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{producto.nombre}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {producto.tamano}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{producto.categoria?.nombre}</TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{formatCurrency(producto.precio)}</p>
                                            {producto.ofertaActiva && producto.precioOferta && (
                                                <p className="text-sm text-green-600">
                                                    Oferta: {formatCurrency(producto.precioOferta)}
                                                </p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${producto.stock > 10
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                : producto.stock > 0
                                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                            }`}>
                                            {producto.stock}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="text-sm">{producto.totalVentas || 0} unidades</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatCurrency(producto.ingresosTotales || 0)}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col space-y-1">
                                            {producto.esDestacado && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                    Destacado
                                                </span>
                                            )}
                                            {producto.ofertaActiva && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                                    En Oferta
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Link href={`/admin/productos/${producto.id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(producto.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
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