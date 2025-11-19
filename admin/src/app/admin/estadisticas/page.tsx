"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { estadisticasApi, pedidosApi, type VentasDiarias, type EstadisticasPedidos } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from "recharts"

export default function EstadisticasPage() {
    const [ventasDiarias, setVentasDiarias] = useState<VentasDiarias[]>([])
    const [estadisticasPedidos, setEstadisticasPedidos] = useState<EstadisticasPedidos[]>([])
    const [diasSeleccionados, setDiasSeleccionados] = useState("30")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [diasSeleccionados])

    const fetchData = async () => {
        try {
            const [ventasResponse, pedidosResponse] = await Promise.all([
                estadisticasApi.getVentasPorDia(parseInt(diasSeleccionados)),
                pedidosApi.getEstadisticas(),
            ])

            setVentasDiarias(ventasResponse.data)
            setEstadisticasPedidos(pedidosResponse.data)
        } catch (error) {
            console.error("Error fetching statistics:", error)
        } finally {
            setLoading(false)
        }
    }

    const COLORS = [
        "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"
    ]

    const totalVentas = ventasDiarias.reduce((sum, item) => sum + item.totalVentas, 0)
    const totalPedidosStats = ventasDiarias.reduce((sum, item) => sum + item.totalPedidos, 0)

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Estadísticas</h1>
                <p>Cargando estadísticas...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Estadísticas</h1>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Período:</span>
                    <Select value={diasSeleccionados} onValueChange={setDiasSeleccionados}>
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">7 días</SelectItem>
                            <SelectItem value="15">15 días</SelectItem>
                            <SelectItem value="30">30 días</SelectItem>
                            <SelectItem value="60">60 días</SelectItem>
                            <SelectItem value="90">90 días</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalVentas)}</div>
                        <p className="text-xs text-muted-foreground">
                            Últimos {diasSeleccionados} días
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pedidos Totales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPedidosStats}</div>
                        <p className="text-xs text-muted-foreground">
                            Últimos {diasSeleccionados} días
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Promedio por Pedido</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(totalPedidosStats > 0 ? totalVentas / totalPedidosStats : 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Ticket promedio
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ventas por Día</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(ventasDiarias.length > 0 ? totalVentas / ventasDiarias.length : 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Promedio diario
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Ventas por Día */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ventas por Día</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={ventasDiarias}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="fecha"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => {
                                        const date = new Date(value)
                                        return `${date.getDate()}/${date.getMonth() + 1}`
                                    }}
                                />
                                <YAxis
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => formatCurrency(value)}
                                />
                                <Tooltip
                                    formatter={(value: number) => [formatCurrency(value), "Ventas"]}
                                    labelFormatter={(value) => {
                                        const date = new Date(value)
                                        return date.toLocaleDateString('es-CL')
                                    }}
                                    labelStyle={{ color: "hsl(var(--foreground))" }}
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--background))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "6px",
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="totalVentas"
                                    stroke="hsl(var(--primary))"
                                    fill="hsl(var(--primary))"
                                    fillOpacity={0.2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Pedidos por Estado */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pedidos por Estado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={estadisticasPedidos}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ estado, cantidad }) => `${estado}: ${cantidad}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="cantidad"
                                >
                                    {estadisticasPedidos.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number, name) => [value, "Pedidos"]}
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--background))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "6px",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Pedidos por Día */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pedidos por Día</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={ventasDiarias}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="fecha"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => {
                                        const date = new Date(value)
                                        return `${date.getDate()}/${date.getMonth() + 1}`
                                    }}
                                />
                                <YAxis
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    formatter={(value: number) => [value, "Pedidos"]}
                                    labelFormatter={(value) => {
                                        const date = new Date(value)
                                        return date.toLocaleDateString('es-CL')
                                    }}
                                    labelStyle={{ color: "hsl(var(--foreground))" }}
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--background))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "6px",
                                    }}
                                />
                                <Bar
                                    dataKey="totalPedidos"
                                    fill="hsl(var(--primary))"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Ingresos por Estado */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ingresos por Estado de Pedido</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {estadisticasPedidos.map((stat, index) => (
                                <div key={stat.estado} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        />
                                        <div>
                                            <p className="text-sm font-medium capitalize">{stat.estado}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {stat.cantidad} pedidos
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">
                                            {formatCurrency(stat.totalMonto)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}