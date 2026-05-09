'use client'

import { motion } from 'framer-motion'

interface CollectionHeaderProps {
  title: string
  description?: string
}

export function CollectionHeader({ title, description }: CollectionHeaderProps) {
  return (
    <div className="bg-card/50 border-b border-border">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          <h1 className="text-3xl lg:text-4xl font-light tracking-tight mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground">
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
