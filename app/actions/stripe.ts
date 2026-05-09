'use server'

import { stripe } from '@/lib/stripe'
import { type CartItemState } from '@/lib/cart-store'

export async function createStripeCheckoutSession(
  items: CartItemState[],
  returnUrl: string
) {
  if (!items.length) {
    throw new Error('Carrinho vazio')
  }

  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'brl',
      product_data: {
        name: item.name,
        description: [item.size, item.color].filter(Boolean).join(' / ') || undefined,
      },
      unit_amount: item.price,
    },
    quantity: item.quantity,
  }))

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    line_items: lineItems,
    mode: 'payment',
    shipping_address_collection: {
      allowed_countries: ['BR'],
    },
    phone_number_collection: {
      enabled: true,
    },
    locale: 'pt-BR',
  })

  return session.client_secret
}

export async function getStripeSessionStatus(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  
  return {
    status: session.status,
    customerEmail: session.customer_details?.email,
    paymentIntent: session.payment_intent as string | null,
  }
}
