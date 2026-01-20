import { z } from 'zod'

// FIGlet 폰트 목록 (15개)
export const FIGLET_FONTS = [
  'Standard',
  'Banner',
  'Big',
  'Block',
  'Bubble',
  'Digital',
  'Ivrit',
  'Lean',
  'Mini',
  'Script',
  'Shadow',
  'Slant',
  'Small',
  'Speed',
  'Star Wars',
] as const

export type FigletFont = (typeof FIGLET_FONTS)[number]

// 이미지 → ASCII 문자 세트
export const ASCII_CHAR_SETS = {
  standard: ' .:-=+*#%@',
  detailed: ' .\'"^,:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
  blocks: ' ░▒▓█',
  simple: ' .oO@',
} as const

export type AsciiCharSetKey = keyof typeof ASCII_CHAR_SETS

// Zod 스키마
export const figletFontSchema = z.enum(FIGLET_FONTS)

export const textToAsciiConfigSchema = z.object({
  text: z.string(),
  font: figletFontSchema,
})

export const imageToAsciiConfigSchema = z.object({
  width: z.number().min(20).max(200).default(80),
  charSet: z.enum(['standard', 'detailed', 'blocks', 'simple']).default('standard'),
  invert: z.boolean().default(false),
})

// 타입 추론
export type TextToAsciiConfig = z.infer<typeof textToAsciiConfigSchema>
export type ImageToAsciiConfig = z.infer<typeof imageToAsciiConfigSchema>

// 탭 타입
export type AsciiTab = 'text' | 'image'

// 스토어 상태 타입
export interface AsciiStoreState {
  // 탭 상태
  activeTab: AsciiTab

  // 텍스트 → ASCII 설정
  textConfig: TextToAsciiConfig

  // 이미지 → ASCII 설정
  imageConfig: ImageToAsciiConfig

  // 결과
  asciiOutput: string
  isLoading: boolean

  // 이미지 데이터
  imageData: string | null
}

export interface AsciiStoreActions {
  setActiveTab: (tab: AsciiTab) => void
  setTextConfig: (config: Partial<TextToAsciiConfig>) => void
  setImageConfig: (config: Partial<ImageToAsciiConfig>) => void
  setAsciiOutput: (output: string) => void
  setIsLoading: (loading: boolean) => void
  setImageData: (data: string | null) => void
  reset: () => void
}

export type AsciiStore = AsciiStoreState & AsciiStoreActions
