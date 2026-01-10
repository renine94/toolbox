'use client'

import { Button } from '@/shared/ui/button'
import { UNIT_CATEGORIES, UnitCategoryId } from '../model/types'
import { useUnitConverterStore } from '../model/useUnitConverterStore'
import { cn } from '@/shared/lib/utils'

export function CategorySelector() {
  const { categoryId, setCategory } = useUnitConverterStore()

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {UNIT_CATEGORIES.map((category) => (
        <Button
          key={category.id}
          variant={categoryId === category.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCategory(category.id as UnitCategoryId)}
          className={cn(
            'transition-all',
            categoryId === category.id && 'shadow-md'
          )}
        >
          <span className="mr-1.5">{category.icon}</span>
          <span className="hidden sm:inline">{category.nameKo}</span>
          <span className="sm:hidden">{category.icon}</span>
        </Button>
      ))}
    </div>
  )
}
