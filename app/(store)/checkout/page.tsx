'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, CreditCard, QrCode, Loader2 } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { useCartStore, type CartItemState } from '@/lib/cart-store'
import { formatPrice } from '@/lib/utils/format'
import { createStripeCheckoutSession } from '@/app/actions/stripe'
import { createMercadoPagoPreference } from '@/app/actions/mercadopago'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'mercadopago'>('stripe')
  const [mercadoPagoUrl, setMercadoPagoUrl] = useState<string | null>(null)
  const [isLoadingMP, setIsLoadingMP] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const total = mounted ? getTotal() : 0
  const shipping = total >= 29900 ? 0 : 1990
  const finalTotal = total + shipping

  const fetchClientSecret = useCallback(async () => {
    if (!items.length) throw new Error('Carrinho vazio')
    const clientSecret = await createStripeCheckoutSession(
      items,
      typeof window !== 'undefined' ? window.location.origin : ''
    )
    return clientSecret!
  }, [items])

  const handleMercadoPago = async () => {
    if (!items.length) return
    
    setIsLoadingMP(true)
    try {
      const { initPoint } = await createMercadoPagoPreference(
        items,
        typeof window !== 'undefined' ? window.location.origin : ''
      )
      setMercadoPagoUrl(initPoint)
    } catch (error) {
      console.error('[v0] Error creating Mercado Pago preference:', error)
    } finally {
      setIsLoadingMP(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-light">Seu carrinho esta vazio</h1>
        <Button asChild>
          <Link href="/colecao">Continuar Comprando</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="py-8 border-b border-border mb-8">
          <Link 
            href="/colecao" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="size-4" />
            Continuar comprando
          </Link>
          <h1 className="text-3xl font-light tracking-tight">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Payment Section */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Metodo de Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'stripe' | 'mercadopago')}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="stripe" className="gap-2">
                        <CreditCard className="size-4" />
                        Cartao de Credito
                      </TabsTrigger>
                      <TabsTrigger value="mercadopago" className="gap-2" onClick={handleMercadoPago}>
                        <QrCode className="size-4" />
                        PIX / Boleto
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="stripe">
                      <div className="min-h-[400px]">
                        <EmbeddedCheckoutProvider
                          stripe={stripePromise}
                          options={{ fetchClientSecret }}
                        >
                          <EmbeddedCheckout />
                        </EmbeddedCheckoutProvider>
                      </div>
                    </TabsContent>

                    <TabsContent value="mercadopago">
                      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
                        {isLoadingMP ? (
                          <div className="flex flex-col items-center gap-4">
                            <Loader2 className="size-8 animate-spin text-muted-foreground" />
                            <p className="text-muted-foreground">Gerando link de pagamento...</p>
                          </div>
                        ) : mercadoPagoUrl ? (
                          <div className="text-center space-y-4">
                            <div className="size-24 mx-auto bg-muted rounded-xl flex items-center justify-center">
                              <QrCode className="size-12 text-muted-foreground" />
                            </div>
                            <div>
                              <h3 className="font-medium mb-2">Pague com PIX ou Boleto</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                Voce sera redirecionado para o Mercado Pago para finalizar o pagamento.
                              </p>
                            </div>
                            <Button asChild size="lg">
                              <a href={mercadoPagoUrl} target="_blank" rel="noopener noreferrer">
                                Continuar no Mercado Pago
                              </a>
                            </Button>
                            <p className="text-xs text-muted-foreground">
                              Ambiente seguro Mercado Pago
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="text-muted-foreground">Clique na aba para gerar o link de pagamento.</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:sticky lg:top-24"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={`${item.productId}-${item.variantId}`} className="flex justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {[item.size, item.color].filter(Boolean).join(' / ')} x {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frete</span>
                      <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Frete gratis em compras acima de R$ 299
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-lg">{formatPrice(finalTotal)}</span>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    ou 6x de {formatPrice(Math.ceil(finalTotal / 6))} sem juros
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
