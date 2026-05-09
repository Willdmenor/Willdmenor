'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart, Truck, RotateCcw, Check } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format'
import { type Product, type ProductVariant } from '@/lib/types'
import { useCartStore } from '@/lib/cart-store'
import { useFavoritesStore } from '@/lib/favorites-store'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ProductInfoProps {
  product: Product
  sizes: string[]
  colors: { color: string; hex: string }[]
  variants: ProductVariant[]
}

export function ProductInfo({ product, sizes, colors, variants }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const { addItem } = useCartStore()
  const { toggleFavorite, isFavorite } = useFavoritesStore()
  const isProductFavorite = isFavorite(product.id)

  const selectedVariant = variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  )

  const isInStock = selectedVariant ? selectedVariant.stock > 0 : true
  const canAddToCart = (!sizes.length || selectedSize) && (!colors.length || selectedColor)

  const handleAddToCart = () => {
    if (!canAddToCart) {
      toast.error('Selecione todas as opcoes')
      return
    }

    addItem({
      productId: product.id,
      variantId: selectedVariant?.id || null,
      name: product.name,
      price: product.price + (selectedVariant?.price_modifier || 0),
      size: selectedSize,
      color: selectedColor,
      image: product.images?.[0] || null,
    })

    toast.success('Adicionado ao carrinho')
  }

  return (
    <div className="lg:sticky lg:top-24 space-y-6">
      {/* Title & Price */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl lg:text-3xl font-light tracking-tight mb-2"
        >
          {product.name}
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <span className="text-xl font-medium">
            {formatPrice(product.price)}
          </span>
          {product.compare_price && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compare_price)}
              </span>
              <span className="text-sm bg-foreground text-background px-2 py-0.5 rounded">
                -{Math.round((1 - product.price / product.compare_price) * 100)}%
              </span>
            </>
          )}
        </motion.div>
        
        <p className="text-sm text-muted-foreground mt-2">
          ou 6x de {formatPrice(Math.ceil(product.price / 6))} sem juros
        </p>
      </div>

      {/* Description */}
      {product.description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground"
        >
          {product.description}
        </motion.p>
      )}

      {/* Color Selection */}
      {colors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-medium mb-3">
            Cor: <span className="font-normal text-muted-foreground">{selectedColor || 'Selecione'}</span>
          </h3>
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color.color}
                onClick={() => setSelectedColor(color.color)}
                className={`relative size-10 rounded-full border-2 transition-all ${
                  selectedColor === color.color
                    ? 'border-foreground scale-110'
                    : 'border-border hover:border-muted-foreground'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.color}
              >
                {selectedColor === color.color && (
                  <Check 
                    className={`absolute inset-0 m-auto size-4 ${
                      color.hex === '#FFFFFF' || color.hex === '#ffffff' 
                        ? 'text-black' 
                        : 'text-white'
                    }`} 
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Size Selection */}
      {sizes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">
              Tamanho: <span className="font-normal text-muted-foreground">{selectedSize || 'Selecione'}</span>
            </h3>
            <button className="text-sm text-muted-foreground underline hover:text-foreground">
              Guia de tamanhos
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const variant = variants.find(
                (v) => v.size === size && (!selectedColor || v.color === selectedColor)
              )
              const inStock = variant ? variant.stock > 0 : true

              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={!inStock}
                  className={`min-w-[48px] h-11 px-4 text-sm border rounded transition-all ${
                    selectedSize === size
                      ? 'border-foreground bg-foreground text-background'
                      : inStock
                      ? 'border-border hover:border-foreground'
                      : 'border-border text-muted-foreground/50 cursor-not-allowed line-through'
                  }`}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Add to Cart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3"
      >
        <Button
          size="lg"
          className="flex-1"
          disabled={!isInStock}
          onClick={handleAddToCart}
        >
          <ShoppingBag className="size-5 mr-2" />
          {isInStock ? 'Adicionar ao Carrinho' : 'Esgotado'}
        </Button>
        <Button 
          size="lg" 
          variant="outline"
          onClick={() => {
            toggleFavorite(product.id)
            toast.success(isProductFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos')
          }}
        >
          <Heart 
            className={`size-5 transition-colors ${
              isProductFavorite ? 'fill-red-500 text-red-500' : ''
            }`} 
          />
        </Button>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 gap-4 pt-4 border-t border-border"
      >
        <div className="flex items-center gap-3">
          <Truck className="size-5 text-muted-foreground" />
          <div className="text-sm">
            <p className="font-medium">Frete Gratis</p>
            <p className="text-muted-foreground">Acima de R$ 299</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RotateCcw className="size-5 text-muted-foreground" />
          <div className="text-sm">
            <p className="font-medium">Trocas Faceis</p>
            <p className="text-muted-foreground">Ate 30 dias</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
