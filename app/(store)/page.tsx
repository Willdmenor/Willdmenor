import { sql, type Product } from '@/lib/db'
import { HeroSection } from '@/components/store/hero-section'
import { FeaturedProducts } from '@/components/store/featured-products'
import { CategoriesSection } from '@/components/store/categories-section'
import { FeaturesSection } from '@/components/store/features-section'

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await sql`
      SELECT * FROM products 
      WHERE featured = true AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 8
    `
    return products as Product[]
  } catch (error) {
    console.error('[v0] Error fetching featured products:', error)
    return []
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <>
      <HeroSection />
      <FeaturedProducts products={featuredProducts} />
      <CategoriesSection />
      <FeaturesSection />
    </>
  )
}
