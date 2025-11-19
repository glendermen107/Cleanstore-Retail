'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Producto } from '@/lib/api'

export interface CartItem {
    id: string
    producto: Producto
    cantidad: number
    precioUnitario: number
    subtotal: number
}

interface CartStore {
    items: CartItem[]
    isOpen: boolean

    // Actions
    addItem: (producto: Producto, cantidad?: number) => void
    removeItem: (productId: string) => void
    updateQuantity: (productId: string, cantidad: number) => void
    clearCart: () => void
    toggleCart: () => void

    // Computed
    getTotalItems: () => number
    getTotalPrice: () => number
    getItemQuantity: (productId: string) => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (producto: Producto, cantidad = 1) => {
                const items = get().items
                const existingItem = items.find(item => item.id === producto.id)

                const precio = producto.ofertaActiva && producto.precioOferta
                    ? producto.precioOferta
                    : producto.precio

                if (existingItem) {
                    set({
                        items: items.map(item =>
                            item.id === producto.id
                                ? {
                                    ...item,
                                    cantidad: item.cantidad + cantidad,
                                    subtotal: (item.cantidad + cantidad) * precio
                                }
                                : item
                        )
                    })
                } else {
                    const newItem: CartItem = {
                        id: producto.id,
                        producto,
                        cantidad,
                        precioUnitario: precio,
                        subtotal: cantidad * precio
                    }
                    set({ items: [...items, newItem] })
                }
            },

            removeItem: (productId: string) => {
                set({
                    items: get().items.filter(item => item.id !== productId)
                })
            },

            updateQuantity: (productId: string, cantidad: number) => {
                if (cantidad <= 0) {
                    get().removeItem(productId)
                    return
                }

                set({
                    items: get().items.map(item =>
                        item.id === productId
                            ? {
                                ...item,
                                cantidad,
                                subtotal: cantidad * item.precioUnitario
                            }
                            : item
                    )
                })
            },

            clearCart: () => {
                set({ items: [] })
            },

            toggleCart: () => {
                set({ isOpen: !get().isOpen })
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.cantidad, 0)
            },

            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + item.subtotal, 0)
            },

            getItemQuantity: (productId: string) => {
                const item = get().items.find(item => item.id === productId)
                return item ? item.cantidad : 0
            }
        }),
        {
            name: 'cleanstore-cart',
            partialize: (state) => ({ items: state.items })
        }
    )
)