import { create } from 'zustand'
import { UnitCategoryId, UNIT_CATEGORIES, getCategoryById } from './types'
import { convert, formatResult, getConversionFormula } from '../lib/converter-utils'

interface UnitConverterState {
  // 상태
  categoryId: UnitCategoryId
  fromUnit: string
  toUnit: string
  inputValue: string
  result: string
  formula: string

  // 액션
  setCategory: (categoryId: UnitCategoryId) => void
  setFromUnit: (unitId: string) => void
  setToUnit: (unitId: string) => void
  setInputValue: (value: string) => void
  swap: () => void
  reset: () => void
}

const DEFAULT_CATEGORY = UNIT_CATEGORIES[0]
const DEFAULT_FROM_UNIT = DEFAULT_CATEGORY.units[0].id
const DEFAULT_TO_UNIT = DEFAULT_CATEGORY.units[1].id

export const useUnitConverterStore = create<UnitConverterState>((set, get) => ({
  // 초기 상태
  categoryId: DEFAULT_CATEGORY.id,
  fromUnit: DEFAULT_FROM_UNIT,
  toUnit: DEFAULT_TO_UNIT,
  inputValue: '1',
  result: formatResult(
    convert(1, DEFAULT_FROM_UNIT, DEFAULT_TO_UNIT, DEFAULT_CATEGORY.id)
  ),
  formula: getConversionFormula(DEFAULT_FROM_UNIT, DEFAULT_TO_UNIT, DEFAULT_CATEGORY.id),

  // 카테고리 변경
  setCategory: (categoryId) => {
    const category = getCategoryById(categoryId)
    if (!category) return

    const fromUnit = category.units[0].id
    const toUnit = category.units[1]?.id || category.units[0].id
    const inputValue = get().inputValue || '1'
    const parsed = parseFloat(inputValue)
    const numValue = isNaN(parsed) ? 0 : parsed

    set({
      categoryId,
      fromUnit,
      toUnit,
      result: formatResult(convert(numValue, fromUnit, toUnit, categoryId)),
      formula: getConversionFormula(fromUnit, toUnit, categoryId),
    })
  },

  // From 단위 변경
  setFromUnit: (unitId) => {
    const { categoryId, toUnit, inputValue } = get()
    const parsed = parseFloat(inputValue)
    const numValue = isNaN(parsed) ? 0 : parsed

    set({
      fromUnit: unitId,
      result: formatResult(convert(numValue, unitId, toUnit, categoryId)),
      formula: getConversionFormula(unitId, toUnit, categoryId),
    })
  },

  // To 단위 변경
  setToUnit: (unitId) => {
    const { categoryId, fromUnit, inputValue } = get()
    const parsed = parseFloat(inputValue)
    const numValue = isNaN(parsed) ? 0 : parsed

    set({
      toUnit: unitId,
      result: formatResult(convert(numValue, fromUnit, unitId, categoryId)),
      formula: getConversionFormula(fromUnit, unitId, categoryId),
    })
  },

  // 입력값 변경
  setInputValue: (value) => {
    const { categoryId, fromUnit, toUnit } = get()
    const parsed = parseFloat(value)
    const numValue = isNaN(parsed) ? 0 : parsed

    set({
      inputValue: value,
      result: formatResult(convert(numValue, fromUnit, toUnit, categoryId)),
    })
  },

  // From/To 단위 교환
  swap: () => {
    const { categoryId, fromUnit, toUnit, inputValue } = get()
    const parsed = parseFloat(inputValue)
    const numValue = isNaN(parsed) ? 0 : parsed

    set({
      fromUnit: toUnit,
      toUnit: fromUnit,
      result: formatResult(convert(numValue, toUnit, fromUnit, categoryId)),
      formula: getConversionFormula(toUnit, fromUnit, categoryId),
    })
  },

  // 초기화
  reset: () => {
    set({
      categoryId: DEFAULT_CATEGORY.id,
      fromUnit: DEFAULT_FROM_UNIT,
      toUnit: DEFAULT_TO_UNIT,
      inputValue: '1',
      result: formatResult(
        convert(1, DEFAULT_FROM_UNIT, DEFAULT_TO_UNIT, DEFAULT_CATEGORY.id)
      ),
      formula: getConversionFormula(DEFAULT_FROM_UNIT, DEFAULT_TO_UNIT, DEFAULT_CATEGORY.id),
    })
  },
}))
