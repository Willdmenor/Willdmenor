'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    name: 'Camisetas',
    slug: 'camisetas',
    description: 'Oversized & Boxy fits',
  },
  {
    name: 'Moletons',
    slug: 'moletons',
    description: 'Heavy & Premium',
  },
  {
    name: 'Calcas',
    slug: 'calcas',
    description: 'Cargo & Wide leg',
  },
  {
    name: 'Acessorios',
    slug: 'acessorios',
    description: 'Bones & Bolsas',
  },
]

export function CategoriesSection() {
  return (
    <section className="py-20 lg:py-32 bg-card/50">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
            Categorias
          </span>
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight mt-2">
            Explore por categoria
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/categoria/${category.slug}`}
                className="group block relative aspect-[4/5] bg-card rounded-lg overflow-hidden border border-border hover:border-muted-foreground/50 transition-colors"
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-medium mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                  <span className="flex items-center gap-2 text-sm group-hover:gap-3 transition-all">
                    Explorar
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
