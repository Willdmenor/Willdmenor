import { notFound } from 'next/navigation'
import { sql, type Product, type ProductVariant } from '@/lib/db'
import { ProductGallery } from '@/components/store/product-gallery'
import { ProductInfo } from '@/components/store/product-info'
import { ProductTabs } from '@/components/store/product-tabs'
import { FeaturedProducts } from '@/components/store/featured-products'

interface Props {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string): Promise<{ product: Product; variants: ProductVariant[] } | null> {
  try {
    const products = await sql`
      SELECT * FROM products WHERE slug = ${slug} AND status = 'active'
    `
    
    if (products.length === 0) return null
    
    const product = products[0] as Product
    
    const variants = await sql`
      SELECT * FROM product_variants WHERE product_id = ${product.id}
      ORDER BY size, color
    `
    
    return { product, variants: variants as ProductVariant[] }
  } catch (error) {
    console.error('[v0] Error fetching product:', error)
    return null
  }
}

async function getRelatedProducts(productId: string): Promise<Product[]> {
  try {
    const products = await sql`
      SELECT * FROM products 
      WHERE id != ${productId} AND status = 'active'
      ORDER BY RANDOM()
      LIMIT 4
    `
    return products as Product[]
  } catch (error) {
    console.error('[v0] Error fetching related products:', error)
    return []
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const data = await getProduct(slug)
  
  if (!data) {
    return { title: 'Produto nao encontrado' }
  }
  
  return {
    title: data.product.name,
    description: data.product.description || `Compre ${data.product.name} na CH Style`,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const data = await getProduct(slug)
  
  if (!data) {
    notFound()
  }
  
  const { product, variants } = data
  const relatedProducts = await getRelatedProducts(product.id)
  
  // Get unique sizes and colors from variants
  const sizes = [...new Set(variants.map(v => v.size).filter(Boolean))] as string[]
  const colors = [...new Set(variants.map(v => JSON.stringify({ color: v.color, hex: v.color_hex })))]
    .map(c => JSON.parse(c))
    .filter(c => c.color) as { color: string; hex: string }[]

  return (
    <div className="pt-20">
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Gallery */}
          <ProductGallery images={product.images} name={product.name} />
          
          {/* Product Info */}
          <ProductInfo 
            product={product} 
            sizes={sizes} 
            colors={colors}
            variants={variants}
          />
        </div>

        {/* Product Details Tabs */}
        <ProductTabs product={product} />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-border">
          <FeaturedProducts products={relatedProducts} />
        </div>
      )}
    </div>
  )
}
