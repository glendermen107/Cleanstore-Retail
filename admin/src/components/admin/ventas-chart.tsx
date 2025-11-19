"use client"

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"
import { VentasMensuales } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"

interface VentasChartProps {
    data: VentasMensuales[]
}

const monthNames = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
]

export function VentasChart({ data }: VentasChartProps) {
    const chartData = data.map(item => ({
        ...item,
        mesNombre: monthNames[item.mes - 1],
        label: `${monthNames[item.mes - 1]} ${item.año}`,
    }))

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="label"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Ventas"]}
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
    )
}