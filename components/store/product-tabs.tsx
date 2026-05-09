'use client'

import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type Product } from '@/lib/types'

interface ProductTabsProps {
  product: Product
}

export function ProductTabs({ product }: ProductTabsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-16 lg:mt-24"
    >
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0">
          <TabsTrigger 
            value="details"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3"
          >
            Detalhes
          </TabsTrigger>
          <TabsTrigger 
            value="sizing"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3"
          >
            Medidas
          </TabsTrigger>
          <TabsTrigger 
            value="care"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3"
          >
            Cuidados
          </TabsTrigger>
          <TabsTrigger 
            value="shipping"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3"
          >
            Envio
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="pt-6">
          <div className="max-w-2xl space-y-4">
            <p className="text-muted-foreground">
              {product.description || 'Produto de alta qualidade desenvolvido com materiais premium e acabamento impecavel.'}
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground" />
                100% Algodao Premium
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground" />
                Gramatura 220g/m2
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground" />
                Corte relaxado oversized
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground" />
                Acabamento premium
              </li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="sizing" className="pt-6">
          <div className="max-w-2xl">
            <p className="text-muted-foreground mb-4">
              Modelo com 1.80m usa tamanho M. Produto possui corte oversized.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 font-medium">Tamanho</th>
                    <th className="text-left py-3 font-medium">Largura (cm)</th>
                    <th className="text-left py-3 font-medium">Comprimento (cm)</th>
                    <th className="text-left py-3 font-medium">Manga (cm)</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="py-3">P</td>
                    <td className="py-3">54</td>
                    <td className="py-3">70</td>
                    <td className="py-3">22</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3">M</td>
                    <td className="py-3">58</td>
                    <td className="py-3">73</td>
                    <td className="py-3">23</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3">G</td>
                    <td className="py-3">62</td>
                    <td className="py-3">76</td>
                    <td className="py-3">24</td>
                  </tr>
                  <tr>
                    <td className="py-3">GG</td>
                    <td className="py-3">66</td>
                    <td className="py-3">79</td>
                    <td className="py-3">25</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="care" className="pt-6">
          <div className="max-w-2xl space-y-4">
            <p className="text-muted-foreground">
              Para manter sua peca em perfeito estado, siga estas instrucoes:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground" />
                Lavar a maquina com agua fria (max 30C)
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground" />
                Nao usar alvejante
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground" />
                Secar a sombra
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground" />
                Passar em temperatura media se necessario
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground" />
                Nao lavar a seco
              </li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="pt-6">
          <div className="max-w-2xl space-y-4">
            <div>
              <h4 className="font-medium mb-2">Prazo de Entrega</h4>
              <p className="text-muted-foreground">
                Apos a confirmacao do pagamento, o prazo de producao e de 3-5 dias uteis. 
                O prazo de entrega depende da sua regiao e sera calculado no checkout.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Frete Gratis</h4>
              <p className="text-muted-foreground">
                Oferecemos frete gratis para compras acima de R$ 299 para todo o Brasil.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Rastreamento</h4>
              <p className="text-muted-foreground">
                Apos o envio, voce recebera o codigo de rastreamento por e-mail para acompanhar sua entrega.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
