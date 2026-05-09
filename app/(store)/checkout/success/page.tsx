import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Pedido Confirmado',
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="size-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="size-10 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-light tracking-tight mb-2">
          Pedido Confirmado!
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Obrigado pela sua compra. Voce recebera um e-mail com os detalhes do seu pedido e o codigo de rastreamento assim que for enviado.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/colecao">Continuar Comprando</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Voltar ao Inicio</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
