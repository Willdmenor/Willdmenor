// Types for the e-commerce store

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  parent_id: string | null
  created_at: Date
}

export interface Collection {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  featured: boolean
  created_at: Date
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_price: number | null
  images: string[]
  category_id: string | null
  collection_id: string | null
  featured: boolean
  status: string
  created_at: Date
  updated_at: Date
}

export interface ProductVariant {
  id: string
  product_id: string
  sku: string | null
  size: string | null
  color: string | null
  color_hex: string | null
  stock: number
  price_modifier: number
  created_at: Date
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  variant_id: string | null
  quantity: number
  created_at: Date
  product?: Product
  variant?: ProductVariant
}

export interface Order {
  id: string
  user_id: string | null
  status: string
  subtotal: number
  shipping: number
  discount: number
  total: number
  payment_method: string | null
  payment_id: string | null
  shipping_address: ShippingAddress | null
  created_at: Date
  updated_at: Date
}

export interface ShippingAddress {
  name: string
  email: string
  phone: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}
