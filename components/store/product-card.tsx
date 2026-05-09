'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format'
import { type Product } from '@/lib/types'
import { useCartStore } from '@/lib/cart-store'
import { useFavoritesStore } from '@/lib/favorites-store'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore()
  const { toggleFavorite, isFavorite } = useFavoritesStore()
  const isProductFavorite = isFavorite(product.id)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    addItem({
      productId: product.id,
      variantId: null,
      name: product.name,
      price: product.price,
      size: null,
      color: null,
      image: product.images?.[0] || null,
    })
    
    toast.success('Produto adicionado ao carrinho')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/produto/${product.slug}`}>
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-card rounded-lg overflow-hidden mb-4">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <ShoppingBag className="size-12 text-muted-foreground/30" />
            </div>
          )}

          {/* Sale Badge */}
          {product.compare_price && (
            <span className="absolute top-3 left-3 bg-foreground text-background text-xs font-medium px-2 py-1 rounded">
              -{Math.round((1 - product.price / product.compare_price) * 100)}%
            </span>
          )}

          {/* Quick Actions */}
          <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <Button
              size="sm"
              className="flex-1"
              onClick={handleQuickAdd}
            >
              <ShoppingBag className="size-4 mr-2" />
              Adicionar
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleFavorite(product.id)
                toast.success(isProductFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos')
              }}
            >
              <Heart 
                className={`size-4 transition-colors ${
                  isProductFavorite ? 'fill-red-500 text-red-500' : ''
                }`} 
              />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <h3 className="font-medium text-sm group-hover:text-muted-foreground transition-colors truncate">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {formatPrice(product.price)}
            </span>
            {product.compare_price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
