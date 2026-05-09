import 'server-only'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export { sql }

// Re-export types for server components
export type { 
  Category, 
  Collection, 
  Product, 
  ProductVariant, 
  CartItem, 
  Order, 
  ShippingAddress 
} from './types'

// Re-export formatPrice for server components
export { formatPrice } from './utils/format'
