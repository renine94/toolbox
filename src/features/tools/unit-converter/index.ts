// UI
export { UnitConverter } from './ui/UnitConverter'

// Store
export { useUnitConverterStore } from './model/useUnitConverterStore'

// Types
export type { UnitCategoryId, Unit, UnitCategory } from './model/types'
export { UNIT_CATEGORIES, getCategoryById, getUnitById } from './model/types'

// Utils
export { convert, formatResult, getConversionFormula } from './lib/converter-utils'
