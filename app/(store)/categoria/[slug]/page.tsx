import { sql, type Product } from '@/lib/db'
import { ProductCard } from '@/components/store/product-card'
import { CollectionHeader } from '@/components/store/collection-header'
import { CollectionFilters } from '@/components/store/collection-filters'
import { notFound } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

const categoryInfo: Record<string, { title: string; description: string }> = {
  camisetas: {
    title: 'Camisetas',
    description: 'Camisetas oversized e boxy fit em algodao premium. Design minimalista com qualidade excepcional.'
  },
  moletons: {
    title: 'Moletons',
    description: 'Moletons pesados e premium com capuz duplo. Conforto e estilo em cada peca.'
  },
  calcas: {
    title: 'Calcas',
    description: 'Calcas cargo e wide leg em tecidos premium. O equilibrio perfeito entre estilo e funcionalidade.'
  },
  acessorios: {
    title: 'Acessorios',
    description: 'Bones estruturados, bolsas e acessorios para completar seu visual.'
  }
}

interface SearchParams {
  categorias?: string
  tamanhos?: string
  cores?: string
  estacao?: string
  preco_min?: string
  preco_max?: string
}

async function getProductsByCategorySlug(
  slug: string, 
  filters: SearchParams
): Promise<Product[]> {
  try {
    // Build the query based on filters
    let query = `
      SELECT DISTINCT p.* FROM products p
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      WHERE c.slug = $1 AND p.status = 'active'
    `
    const params: (string | number)[] = [slug]
    let paramIndex = 2

    // Season filter
    if (filters.estacao) {
      query += ` AND p.season = $${paramIndex}`
      params.push(filters.estacao)
      paramIndex++
    }

    // Price filter (convert from reais to cents)
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

    const products = await sql(query, params)
    return products as Product[]
  } catch (error) {
    console.error('[v0] Error fetching products:', error)
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const info = categoryInfo[slug]
  
  return {
    title: info?.title || 'Categoria',
    description: info?.description || 'Explore nossa colecao.',
  }
}

export default async function CategoriaPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}) {
  const { slug } = await params
  const filters = await searchParams
  const info = categoryInfo[slug]
  
  if (!info) {
    notFound()
  }

  const products = await getProductsByCategorySlug(slug, filters)

  // Count active filters
  const activeFilters = [
    filters.estacao,
    filters.tamanhos,
    filters.cores,
    filters.preco_min && parseInt(filters.preco_min) > 0,
    filters.preco_max && parseInt(filters.preco_max) < 500,
  ].filter(Boolean).length

  return (
    <div className="pt-20">
      <CollectionHeader
        title={info.title}
        description={info.description}
      />
      
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <CollectionFilters showCategoryFilter={false} />
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
