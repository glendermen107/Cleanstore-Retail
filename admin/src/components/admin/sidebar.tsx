"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Package,
    FolderOpen,
    ShoppingCart,
    BarChart3,
    Store,
} from "lucide-react"

const navigation = [
    {
        name: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        name: "Productos",
        href: "/admin/productos",
        icon: Package,
    },
    {
        name: "Categorías",
        href: "/admin/categorias",
        icon: FolderOpen,
    },
    {
        name: "Pedidos",
        href: "/admin/pedidos",
        icon: ShoppingCart,
    },
    {
        name: "Estadísticas",
        href: "/admin/estadisticas",
        icon: BarChart3,
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-full w-64 flex-col bg-card border-r">
            {/* Logo */}
            <div className="flex h-16 items-center px-6 border-b">
                <Store className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold">Cleanstore Admin</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/admin" && pathname.startsWith(item.href))

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0",
                                    isActive ? "text-primary-foreground" : "text-muted-foreground"
                                )}
                            />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t">
                <p className="text-xs text-muted-foreground">
                    Cleanstore Retail v1.0
                </p>
            </div>
        </div>
    )
}