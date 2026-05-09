'use client'

import { motion } from 'framer-motion'
import { Truck, RotateCcw, Shield, CreditCard } from 'lucide-react'

const features = [
  {
    icon: Truck,
    title: 'Frete Gratis',
    description: 'Em compras acima de R$ 299',
  },
  {
    icon: RotateCcw,
    title: 'Trocas Faceis',
    description: '30 dias para troca ou devolucao',
  },
  {
    icon: Shield,
    title: 'Pagamento Seguro',
    description: 'Seus dados protegidos',
  },
  {
    icon: CreditCard,
    title: 'Parcele em 6x',
    description: 'Sem juros no cartao',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 border-y border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center size-12 rounded-full bg-card border border-border mb-4">
                <feature.icon className="size-5 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
