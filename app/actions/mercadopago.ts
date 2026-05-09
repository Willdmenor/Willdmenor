'use server'

import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'
import { type CartItemState } from '@/lib/cart-store'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
})

export async function createMercadoPagoPreference(
  items: CartItemState[],
  returnUrl: string
) {
  if (!items.length) {
    throw new Error('Carrinho vazio')
  }

  const preference = new Preference(client)

  const preferenceItems = items.map((item) => ({
    id: item.productId,
    title: item.name,
    description: [item.size, item.color].filter(Boolean).join(' / ') || undefined,
    quantity: item.quantity,
    unit_price: item.price / 100, // Mercado Pago usa valores em reais, nao centavos
    currency_id: 'BRL',
  }))

  const response = await preference.create({
    body: {
      items: preferenceItems,
      back_urls: {
        success: `${returnUrl}/checkout/success`,
        failure: `${returnUrl}/checkout/failure`,
        pending: `${returnUrl}/checkout/pending`,
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_types: [],
        installments: 6,
      },
      statement_descriptor: 'CH STYLE',
    },
  })

  return {
    preferenceId: response.id!,
    initPoint: response.init_point!,
    sandboxInitPoint: response.sandbox_init_point!,
  }
}

export async function getMercadoPagoPayment(paymentId: string) {
  const payment = new Payment(client)
  const response = await payment.get({ id: paymentId })
  
  return {
    status: response.status,
    statusDetail: response.status_detail,
    payerEmail: response.payer?.email,
  }
}
