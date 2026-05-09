'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Snowflake, Sun } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'

const sizes = ['PP', 'P', 'M', 'G', 'GG', 'XGG']
const colors = [
  { name: 'Preto', hex: '#000000' },
  { name: 'Branco', hex: '#FFFFFF' },
  { name: 'Cinza', hex: '#6B7280' },
  { name: 'Bege', hex: '#D4C5B9' },
]

const seasons = [
  { id: 'frio', name: 'Peças de Frio', icon: Snowflake, description: 'Moletons, jaquetas e peças quentes' },
  { id: 'verao', name: 'Peças de Verão', icon: Sun, description: 'Camisetas, regatas e peças leves' },
]

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-border pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 text-sm font-medium"
      >
        {title}
        <ChevronDown className={`size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface CollectionFiltersProps {
  showCategoryFilter?: boolean
}

export function CollectionFilters({ showCategoryFilter = true }: CollectionFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Initialize state from URL params
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('categorias')?.split(',').filter(Boolean) || []
  )
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    searchParams.get('tamanhos')?.split(',').filter(Boolean) || []
  )
  const [selectedColors, setSelectedColors] = useState<string[]>(
    searchParams.get('cores')?.split(',').filter(Boolean) || []
  )
  const [selectedSeason, setSelectedSeason] = useState<string | null>(
    searchParams.get('estacao') || null
  )
  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.get('preco_min') || '0'),
    parseInt(searchParams.get('preco_max') || '500')
  ])

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    )
  }

  const toggleSeason = (season: string) => {
    setSelectedSeason(prev => prev === season ? null : season)
  }

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    
    if (selectedCategories.length > 0) {
      params.set('categorias', selectedCategories.join(','))
    }
    if (selectedSizes.length > 0) {
      params.set('tamanhos', selectedSizes.join(','))
    }
    if (selectedColors.length > 0) {
      params.set('cores', selectedColors.join(','))
    }
    if (selectedSeason) {
      params.set('estacao', selectedSeason)
    }
    if (priceRange[0] > 0) {
      params.set('preco_min', priceRange[0].toString())
    }
    if (priceRange[1] < 500) {
      params.set('preco_max', priceRange[1].toString())
    }

    const queryString = params.toString()
    const currentPath = window.location.pathname
    router.push(queryString ? `${currentPath}?${queryString}` : currentPath)
  }, [selectedCategories, selectedSizes, selectedColors, selectedSeason, priceRange, router])

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedSizes([])
    setSelectedColors([])
    setSelectedSeason(null)
    setPriceRange([0, 500])
    router.push(window.location.pathname)
  }

  const hasActiveFilters = 
    selectedCategories.length > 0 || 
    selectedSizes.length > 0 || 
    selectedColors.length > 0 || 
    selectedSeason !== null ||
    priceRange[0] > 0 || 
    priceRange[1] < 500

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Filtros</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="text-xs" onClick={clearFilters}>
            Limpar
          </Button>
        )}
      </div>

      {/* Season Filter - New */}
      <FilterSection title="Estacao">
        <div className="space-y-2">
          {seasons.map((season) => {
            const Icon = season.icon
            const isSelected = selectedSeason === season.id
            return (
              <button
                key={season.id}
                onClick={() => toggleSeason(season.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  isSelected 
                    ? 'border-foreground bg-foreground/5' 
                    : 'border-border hover:border-muted-foreground'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  isSelected 
                    ? season.id === 'frio' ? 'bg-blue-500/20 text-blue-500' : 'bg-orange-500/20 text-orange-500'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon className="size-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{season.name}</p>
                  <p className="text-xs text-muted-foreground">{season.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </FilterSection>

      {/* Category Filter */}
      {showCategoryFilter && (
        <FilterSection title="Categoria">
          <div className="space-y-3">
            {['Camisetas', 'Moletons', 'Calcas', 'Acessorios'].map((category) => (
              <div key={category} className="flex items-center gap-2">
                <Checkbox 
                  id={`cat-${category}`} 
                  checked={selectedCategories.includes(category.toLowerCase())}
                  onCheckedChange={() => toggleCategory(category.toLowerCase())}
                />
                <Label htmlFor={`cat-${category}`} className="text-sm font-normal cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Size Filter */}
      <FilterSection title="Tamanho">
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`min-w-[40px] h-9 px-3 text-sm border rounded transition-colors ${
                selectedSizes.includes(size)
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border hover:border-foreground'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Color Filter */}
      <FilterSection title="Cor">
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleColor(color.name.toLowerCase())}
              className={`group flex items-center gap-2 px-3 py-1.5 border rounded transition-colors ${
                selectedColors.includes(color.name.toLowerCase())
                  ? 'border-foreground bg-foreground/5'
                  : 'border-border hover:border-foreground'
              }`}
              title={color.name}
            >
              <span
                className={`size-4 rounded-full border ${
                  selectedColors.includes(color.name.toLowerCase())
                    ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background'
                    : 'border-border'
                }`}
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-sm">{color.name}</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Filter */}
      <FilterSection title="Preco">
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={500}
            step={10}
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>R$ {priceRange[0]}</span>
            <span>R$ {priceRange[1]}</span>
          </div>
        </div>
      </FilterSection>

      {/* Apply Filter Button */}
      <div className="pt-4 space-y-2">
        <Button 
          className="w-full" 
          size="lg"
          onClick={applyFilters}
        >
          Aplicar Filtros
        </Button>
        {hasActiveFilters && (
          <p className="text-xs text-center text-muted-foreground">
            {[
              selectedCategories.length > 0 && `${selectedCategories.length} categoria(s)`,
              selectedSizes.length > 0 && `${selectedSizes.length} tamanho(s)`,
              selectedColors.length > 0 && `${selectedColors.length} cor(es)`,
              selectedSeason && (selectedSeason === 'frio' ? 'Pecas de Frio' : 'Pecas de Verao'),
            ].filter(Boolean).join(' • ')}
          </p>
        )}
      </div>
    </div>
  )
}
