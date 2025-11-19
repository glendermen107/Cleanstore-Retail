"use client"

import { TopProducto } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"

interface TopProductosTableProps {
    productos: TopProducto[]
}

export function TopProductosTable({ productos }: TopProductosTableProps) {
    return (
        <div className="space-y-4">
            {productos.slice(0, 5).map((producto, index) => (
                <div key={producto.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                            {index + 1}
                        </div>
                        <div>
                            <p className="text-sm font-medium">{producto.nombre}</p>
                            <p className="text-xs text-muted-foreground">
                                {producto.totalVendido} vendidos
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium">
                            {formatCurrency(producto.ingresoTotal)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {formatCurrency(producto.precio)} c/u
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}