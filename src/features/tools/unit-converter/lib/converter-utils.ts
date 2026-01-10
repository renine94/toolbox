import { UnitCategoryId, getCategoryById, getUnitById } from '../model/types'

/**
 * 온도 변환 함수 (온도는 선형 변환이 아님)
 */
function convertTemperature(value: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return value

  // 먼저 섭씨로 변환
  let celsius: number
  switch (fromUnit) {
    case 'celsius':
      celsius = value
      break
    case 'fahrenheit':
      celsius = (value - 32) * (5 / 9)
      break
    case 'kelvin':
      celsius = value - 273.15
      break
    default:
      celsius = value
  }

  // 섭씨에서 대상 단위로 변환
  switch (toUnit) {
    case 'celsius':
      return celsius
    case 'fahrenheit':
      return celsius * (9 / 5) + 32
    case 'kelvin':
      return celsius + 273.15
    default:
      return celsius
  }
}

/**
 * 일반 단위 변환 함수 (선형 변환)
 */
function convertLinear(
  value: number,
  fromUnit: string,
  toUnit: string,
  categoryId: UnitCategoryId
): number {
  if (fromUnit === toUnit) return value

  const fromUnitData = getUnitById(categoryId, fromUnit)
  const toUnitData = getUnitById(categoryId, toUnit)

  if (!fromUnitData || !toUnitData) {
    throw new Error(`Invalid unit: ${fromUnit} or ${toUnit}`)
  }

  // 기준 단위로 변환 후 대상 단위로 변환
  const baseValue = value * fromUnitData.toBase
  return baseValue / toUnitData.toBase
}

/**
 * 메인 변환 함수
 */
export function convert(
  value: number,
  fromUnit: string,
  toUnit: string,
  categoryId: UnitCategoryId
): number {
  if (isNaN(value)) return 0

  // 온도는 별도 처리
  if (categoryId === 'temperature') {
    return convertTemperature(value, fromUnit, toUnit)
  }

  return convertLinear(value, fromUnit, toUnit, categoryId)
}

/**
 * 결과 포맷팅 함수
 */
export function formatResult(value: number, precision: number = 10): string {
  if (isNaN(value) || !isFinite(value)) return '0'

  // 매우 작거나 큰 수는 지수 표기법 사용
  if (Math.abs(value) < 0.000001 && value !== 0) {
    return value.toExponential(precision)
  }
  if (Math.abs(value) >= 1e12) {
    return value.toExponential(precision)
  }

  // 일반 숫자는 적절한 소수점으로 표시
  const formatted = value.toPrecision(precision)
  // 불필요한 0 제거
  return parseFloat(formatted).toString()
}

/**
 * 변환 공식 문자열 생성
 */
export function getConversionFormula(
  fromUnit: string,
  toUnit: string,
  categoryId: UnitCategoryId
): string {
  const category = getCategoryById(categoryId)
  if (!category) return ''

  const fromUnitData = category.units.find((u) => u.id === fromUnit)
  const toUnitData = category.units.find((u) => u.id === toUnit)

  if (!fromUnitData || !toUnitData) return ''

  const result = convert(1, fromUnit, toUnit, categoryId)
  const formattedResult = formatResult(result, 6)

  return `1 ${fromUnitData.symbol} = ${formattedResult} ${toUnitData.symbol}`
}

/**
 * 클립보드 복사 함수
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
