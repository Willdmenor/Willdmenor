import { sql, type Product } from '@/lib/db'
import { ProductCard } from '@/components/store/product-card'
import { CollectionHeader } from '@/components/store/collection-header'
import { CollectionFilters } from '@/components/store/collection-filters'

interface SearchParams {
  categorias?: string
  tamanhos?: string
  cores?: string
  estacao?: string
  preco_min?: string
  preco_max?: string
}

async function getProducts(filters: SearchParams): Promise<Product[]> {
  try {
    let query = `
      SELECT DISTINCT p.* FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      WHERE p.status = 'active'
    `
    const params: (string | number)[] = []
    let paramIndex = 1

    // Category filter
    if (filters.categorias) {
      const categories = filters.categorias.split(',')
      query += ` AND c.slug = ANY($${paramIndex}::text[])`
      params.push(categories as unknown as string)
      paramIndex++
    }

    // Season filter
    if (filters.estacao) {
      query += ` AND p.season = $${paramIndex}`
      params.push(filters.estacao)
      paramIndex++
    }

    // Price filter
    if (filters.preco_min) {
      query += ` AND p.price >= $${paramIndex}`
      params.push(parseInt(filters.preco_min) * 100)
      paramIndex++
    }
    if (filters.preco_max) {
      query += ` AND p.price <= $${paramIndex}`
      params.push(parseInt(filters.preco_max) * 100)
      paramIndex++
    }

    // Size filter
    if (filters.tamanhos) {
      const sizes = filters.tamanhos.split(',')
      query += ` AND pv.size = ANY($${paramIndex}::text[])`
      params.push(sizes as unknown as string)
      paramIndex++
    }

    // Color filter
    if (filters.cores) {
      const colors = filters.cores.split(',').map(c => 
        c.charAt(0).toUpperCase() + c.slice(1)
      )
      query += ` AND pv.color = ANY($${paramIndex}::text[])`
      params.push(colors as unknown as string)
      paramIndex++
    }

    query += ` ORDER BY p.created_at DESC`

    const products = params.length > 0 
      ? await sql(query, params)
      : await sql`SELECT * FROM products WHERE status = 'active' ORDER BY created_at DESC`
    
    return products as Product[]
  } catch (error) {
    console.error('[v0] Error fetching products:', error)
    return []
  }
}

export const metadata = {
  title: 'Colecao | CH Style',
  description: 'Explore nossa colecao completa de pecas premium.'
}

export default async function ColecaoPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>
}) {
  const filters = await searchParams
  const products = await getProducts(filters)

  const activeFilters = [
    filters.categorias,
    filters.estacao,
    filters.tamanhos,
    filters.cores,
    filters.preco_min && parseInt(filters.preco_min) > 0,
    filters.preco_max && parseInt(filters.preco_max) < 500,
  ].filter(Boolean).length

  return (
    <div className="pt-20">
      <CollectionHeader
        title="Colecao"
        description="Explore nossa colecao completa de pecas premium. Design minimalista, qualidade excepcional."
      />
      
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <CollectionFilters showCategoryFilter={true} />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {products.length} {products.length === 1 ? 'produto' : 'produtos'}
                {activeFilters > 0 && ` (${activeFilters} filtro${activeFilters > 1 ? 's' : ''} ativo${activeFilters > 1 ? 's' : ''})`}
              </p>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">Nenhum produto encontrado com os filtros selecionados.</p>
                <p className="text-sm text-muted-foreground">Tente ajustar os filtros para ver mais resultados.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
