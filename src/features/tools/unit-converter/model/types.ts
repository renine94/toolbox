export type UnitCategoryId =
  | 'length'
  | 'weight'
  | 'temperature'
  | 'volume'
  | 'area'
  | 'speed'
  | 'data'
  | 'time'

export interface Unit {
  id: string
  name: string
  nameKo: string
  symbol: string
  toBase: number // 기준 단위로 변환하는 비율 (온도는 별도 처리)
}

export interface UnitCategory {
  id: UnitCategoryId
  name: string
  nameKo: string
  icon: string
  baseUnit: string // 기준 단위 ID
  units: Unit[]
}

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    name: 'Length',
    nameKo: '길이',
    icon: '📏',
    baseUnit: 'meter',
    units: [
      { id: 'meter', name: 'Meter', nameKo: '미터', symbol: 'm', toBase: 1 },
      { id: 'kilometer', name: 'Kilometer', nameKo: '킬로미터', symbol: 'km', toBase: 1000 },
      { id: 'centimeter', name: 'Centimeter', nameKo: '센티미터', symbol: 'cm', toBase: 0.01 },
      { id: 'millimeter', name: 'Millimeter', nameKo: '밀리미터', symbol: 'mm', toBase: 0.001 },
      { id: 'inch', name: 'Inch', nameKo: '인치', symbol: 'in', toBase: 0.0254 },
      { id: 'feet', name: 'Feet', nameKo: '피트', symbol: 'ft', toBase: 0.3048 },
      { id: 'yard', name: 'Yard', nameKo: '야드', symbol: 'yd', toBase: 0.9144 },
      { id: 'mile', name: 'Mile', nameKo: '마일', symbol: 'mi', toBase: 1609.344 },
    ],
  },
  {
    id: 'weight',
    name: 'Weight',
    nameKo: '무게',
    icon: '⚖️',
    baseUnit: 'kilogram',
    units: [
      { id: 'kilogram', name: 'Kilogram', nameKo: '킬로그램', symbol: 'kg', toBase: 1 },
      { id: 'gram', name: 'Gram', nameKo: '그램', symbol: 'g', toBase: 0.001 },
      { id: 'milligram', name: 'Milligram', nameKo: '밀리그램', symbol: 'mg', toBase: 0.000001 },
      { id: 'ton', name: 'Metric Ton', nameKo: '톤', symbol: 't', toBase: 1000 },
      { id: 'pound', name: 'Pound', nameKo: '파운드', symbol: 'lb', toBase: 0.45359237 },
      { id: 'ounce', name: 'Ounce', nameKo: '온스', symbol: 'oz', toBase: 0.028349523125 },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    nameKo: '온도',
    icon: '🌡️',
    baseUnit: 'celsius',
    units: [
      { id: 'celsius', name: 'Celsius', nameKo: '섭씨', symbol: '°C', toBase: 1 },
      { id: 'fahrenheit', name: 'Fahrenheit', nameKo: '화씨', symbol: '°F', toBase: 1 },
      { id: 'kelvin', name: 'Kelvin', nameKo: '켈빈', symbol: 'K', toBase: 1 },
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    nameKo: '부피',
    icon: '🧪',
    baseUnit: 'liter',
    units: [
      { id: 'liter', name: 'Liter', nameKo: '리터', symbol: 'L', toBase: 1 },
      { id: 'milliliter', name: 'Milliliter', nameKo: '밀리리터', symbol: 'mL', toBase: 0.001 },
      { id: 'cubic_meter', name: 'Cubic Meter', nameKo: '세제곱미터', symbol: 'm³', toBase: 1000 },
      { id: 'gallon_us', name: 'Gallon (US)', nameKo: '갤런(미)', symbol: 'gal', toBase: 3.785411784 },
      { id: 'quart', name: 'Quart (US)', nameKo: '쿼트', symbol: 'qt', toBase: 0.946352946 },
      { id: 'pint', name: 'Pint (US)', nameKo: '파인트', symbol: 'pt', toBase: 0.473176473 },
      { id: 'cup', name: 'Cup (US)', nameKo: '컵', symbol: 'cup', toBase: 0.2365882365 },
    ],
  },
  {
    id: 'area',
    name: 'Area',
    nameKo: '면적',
    icon: '📐',
    baseUnit: 'square_meter',
    units: [
      { id: 'square_meter', name: 'Square Meter', nameKo: '제곱미터', symbol: 'm²', toBase: 1 },
      { id: 'square_kilometer', name: 'Square Kilometer', nameKo: '제곱킬로미터', symbol: 'km²', toBase: 1000000 },
      { id: 'square_centimeter', name: 'Square Centimeter', nameKo: '제곱센티미터', symbol: 'cm²', toBase: 0.0001 },
      { id: 'hectare', name: 'Hectare', nameKo: '헥타르', symbol: 'ha', toBase: 10000 },
      { id: 'acre', name: 'Acre', nameKo: '에이커', symbol: 'ac', toBase: 4046.8564224 },
      { id: 'square_feet', name: 'Square Feet', nameKo: '제곱피트', symbol: 'ft²', toBase: 0.09290304 },
      { id: 'pyeong', name: 'Pyeong', nameKo: '평', symbol: '평', toBase: 3.305785 },
    ],
  },
  {
    id: 'speed',
    name: 'Speed',
    nameKo: '속도',
    icon: '🚀',
    baseUnit: 'meter_per_second',
    units: [
      { id: 'meter_per_second', name: 'Meter/Second', nameKo: '미터/초', symbol: 'm/s', toBase: 1 },
      { id: 'kilometer_per_hour', name: 'Kilometer/Hour', nameKo: '킬로미터/시', symbol: 'km/h', toBase: 0.277778 },
      { id: 'mile_per_hour', name: 'Mile/Hour', nameKo: '마일/시', symbol: 'mph', toBase: 0.44704 },
      { id: 'knot', name: 'Knot', nameKo: '노트', symbol: 'kn', toBase: 0.514444 },
      { id: 'feet_per_second', name: 'Feet/Second', nameKo: '피트/초', symbol: 'ft/s', toBase: 0.3048 },
    ],
  },
  {
    id: 'data',
    name: 'Data',
    nameKo: '데이터',
    icon: '💾',
    baseUnit: 'byte',
    units: [
      { id: 'byte', name: 'Byte', nameKo: '바이트', symbol: 'B', toBase: 1 },
      { id: 'kilobyte', name: 'Kilobyte', nameKo: '킬로바이트', symbol: 'KB', toBase: 1024 },
      { id: 'megabyte', name: 'Megabyte', nameKo: '메가바이트', symbol: 'MB', toBase: 1048576 },
      { id: 'gigabyte', name: 'Gigabyte', nameKo: '기가바이트', symbol: 'GB', toBase: 1073741824 },
      { id: 'terabyte', name: 'Terabyte', nameKo: '테라바이트', symbol: 'TB', toBase: 1099511627776 },
      { id: 'petabyte', name: 'Petabyte', nameKo: '페타바이트', symbol: 'PB', toBase: 1125899906842624 },
    ],
  },
  {
    id: 'time',
    name: 'Time',
    nameKo: '시간',
    icon: '⏱️',
    baseUnit: 'second',
    units: [
      { id: 'second', name: 'Second', nameKo: '초', symbol: 's', toBase: 1 },
      { id: 'millisecond', name: 'Millisecond', nameKo: '밀리초', symbol: 'ms', toBase: 0.001 },
      { id: 'minute', name: 'Minute', nameKo: '분', symbol: 'min', toBase: 60 },
      { id: 'hour', name: 'Hour', nameKo: '시간', symbol: 'h', toBase: 3600 },
      { id: 'day', name: 'Day', nameKo: '일', symbol: 'd', toBase: 86400 },
      { id: 'week', name: 'Week', nameKo: '주', symbol: 'wk', toBase: 604800 },
      { id: 'month', name: 'Month', nameKo: '월(30일)', symbol: 'mo', toBase: 2592000 },
      { id: 'year', name: 'Year', nameKo: '년', symbol: 'yr', toBase: 31536000 },
    ],
  },
]

export function getCategoryById(id: UnitCategoryId): UnitCategory | undefined {
  return UNIT_CATEGORIES.find((cat) => cat.id === id)
}

export function getUnitById(categoryId: UnitCategoryId, unitId: string): Unit | undefined {
  const category = getCategoryById(categoryId)
  return category?.units.find((unit) => unit.id === unitId)
}
