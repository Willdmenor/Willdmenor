'use client'

import { motion } from 'framer-motion'
import { ProductCard } from './product-card'
import { type Product } from '@/lib/types'

interface ProductsScrollGridProps {
  products: Product[]
}

export function ProductsScrollGrid({ products }: ProductsScrollGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Nenhum produto encontrado com os filtros selecionados.</p>
          <p className="text-sm text-muted-foreground">Tente ajustar os filtros para ver mais resultados.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-280px)] lg:h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/30 pr-2">
      <motion.div 
        className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 pb-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08,
              delayChildren: 0.1
            }
          }
        }}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            variants={{
              hidden: { 
                opacity: 0, 
                y: 40,
                scale: 0.95
              },
              visible: { 
                opacity: 1, 
                y: 0,
                scale: 1,
                transition: {
                  type: 'spring',
                  stiffness: 100,
                  damping: 15,
                  mass: 0.8
                }
              }
            }}
          >
            <ProductCard product={product} index={index} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
