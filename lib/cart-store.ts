'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItemState {
  productId: string
  variantId: string | null
  name: string
  price: number
  size: string | null
  color: string | null
  quantity: number
  image: string | null
}

interface CartStore {
  items: CartItemState[]
  isOpen: boolean
  
  addItem: (item: Omit<CartItemState, 'quantity'>) => void
  removeItem: (productId: string, variantId: string | null) => void
  updateQuantity: (productId: string, variantId: string | null, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          )
          
          if (existingIndex > -1) {
            const newItems = [...state.items]
            newItems[existingIndex].quantity += 1
            return { items: newItems, isOpen: true }
          }
          
          return { items: [...state.items, { ...item, quantity: 1 }], isOpen: true }
        })
      },
      
      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          )
        }))
      },
      
      updateQuantity: (productId, variantId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId, variantId)
          return
        }
        
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity }
              : i
          )
        }))
      },
      
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      }
    }),
    {
      name: 'ch-style-cart',
      partialize: (state) => ({ items: state.items })
    }
  )
)
