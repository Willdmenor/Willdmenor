'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from './product-card'
import { type Product } from '@/lib/types'

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
              Destaques
            </span>
            <h2 className="text-3xl lg:text-4xl font-light tracking-tight mt-2">
              Pecas selecionadas
            </h2>
          </div>
          <Link 
            href="/colecao"
            className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            Ver tudo
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Mobile link */}
        <Link 
          href="/colecao"
          className="flex sm:hidden items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-8"
        >
          Ver toda a colecao
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}
