'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesStore {
  favorites: string[] // Array of product IDs
  
  addFavorite: (productId: string) => void
  removeFavorite: (productId: string) => void
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (productId) => {
        set((state) => ({
          favorites: [...state.favorites, productId]
        }))
      },
      
      removeFavorite: (productId) => {
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== productId)
        }))
      },
      
      toggleFavorite: (productId) => {
        const { favorites, addFavorite, removeFavorite } = get()
        if (favorites.includes(productId)) {
          removeFavorite(productId)
        } else {
          addFavorite(productId)
        }
      },
      
      isFavorite: (productId) => {
        return get().favorites.includes(productId)
      }
    }),
    {
      name: 'ch-style-favorites'
    }
  )
)
