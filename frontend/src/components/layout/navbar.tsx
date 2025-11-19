"use client"

import Link from "next/link"
import { useState } from "react"
import { Search, ShoppingCart, Menu, X, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { useCartStore } from "@/store/cart"
import { CartSheet } from "@/components/cart/cart-sheet"

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const { getTotalItems, toggleCart } = useCartStore()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            // TODO: Implement search functionality
            console.log("Searching for:", searchQuery)
        }
    }

    const navigation = [
        { name: "Inicio", href: "/" },
        { name: "Productos", href: "/productos" },
        { name: "Categorías", href: "/categorias" },
        // TODO: Add authentication-based navigation
        // { name: "Mi Cuenta", href: "/cuenta" },
    ]

    return (
        <>
            <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <Store className="h-8 w-8 text-primary" />
                            <span className="text-xl font-bold">Cleanstore</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <div className="hidden md:flex flex-1 max-w-md mx-8">
                            <form onSubmit={handleSearch} className="flex w-full">
                                <Input
                                    type="search"
                                    placeholder="Buscar productos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="rounded-r-none"
                                />
                                <Button type="submit" size="icon" className="rounded-l-none">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                            <ThemeToggle />

                            {/* Cart Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleCart}
                                className="relative"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {getTotalItems() > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                                        {getTotalItems()}
                                    </span>
                                )}
                            </Button>

                            {/* Mobile Menu Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden border-t py-4">
                            {/* Mobile Search */}
                            <form onSubmit={handleSearch} className="flex mb-4">
                                <Input
                                    type="search"
                                    placeholder="Buscar productos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="rounded-r-none"
                                />
                                <Button type="submit" size="icon" className="rounded-l-none">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </form>

                            {/* Mobile Navigation */}
                            <div className="space-y-2">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="block py-2 text-sm font-medium transition-colors hover:text-primary"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <CartSheet />
        </>
    )
}