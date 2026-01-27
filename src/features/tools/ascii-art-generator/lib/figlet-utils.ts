import type { FigletFont } from '../model/types'

// figlet 인스턴스 캐싱
let figletInstance: typeof import('figlet') | null = null
const loadedFonts = new Set<string>()

// CDN에서 폰트를 로드하기 위한 경로 (끝에 슬래시 없음 - figlet 내부에서 추가함)
const FONT_PATH = 'https://unpkg.com/figlet@1.8.0/fonts'

/**
 * figlet 라이브러리를 동적으로 로드합니다.
 * 브라우저 환경에서는 CDN에서 폰트를 로드합니다.
 */
async function loadFiglet() {
  if (figletInstance) {
    return figletInstance
  }

  const figlet = await import('figlet')
  figletInstance = figlet

  // 브라우저 환경에서 폰트 경로 설정
  if (typeof window !== 'undefined') {
    figlet.default.defaults({ fontPath: FONT_PATH })
  }

  return figlet
}

/**
 * 특정 폰트를 로드합니다.
 * 이미 로드된 폰트는 캐시에서 반환합니다.
 */
async function loadFont(font: string): Promise<void> {
  // 이미 로드된 폰트는 스킵
  if (loadedFonts.has(font)) {
    return
  }

  const figlet = await loadFiglet()

  return new Promise((resolve) => {
    figlet.default.preloadFonts([font], (err) => {
      if (err) {
        console.warn(`[ASCII Art] ${font} 폰트 로드 실패:`, err)
      } else {
        loadedFonts.add(font)
      }
      resolve()
    })
  })
}

/**
 * 텍스트를 ASCII 아트로 변환합니다.
 */
export async function textToAscii(
  text: string,
  font: FigletFont
): Promise<string> {
  if (!text.trim()) {
    return ''
  }

  try {
    const figletModule = await loadFiglet()

    // 선택한 폰트가 로드되지 않았다면 로드
    await loadFont(font)

    return new Promise((resolve, reject) => {
      figletModule.default.text(
        text,
        { font: font as string },
        (err, result) => {
          if (err) {
            console.error('[ASCII Art] figlet 변환 에러:', err)
            reject(new Error('ASCII 아트 변환에 실패했습니다.'))
            return
          }
          resolve(result || '')
        }
      )
    })
  } catch (error) {
    console.error('[ASCII Art] 예외 발생:', error)
    throw new Error('ASCII 아트 변환 중 오류가 발생했습니다.')
  }
}

/**
 * 사용 가능한 폰트 미리보기를 생성합니다.
 */
export async function getFontPreview(
  font: FigletFont,
  previewText: string = 'Hello'
): Promise<string> {
  try {
    return await textToAscii(previewText, font)
  } catch {
    return `[${font}]`
  }
}
