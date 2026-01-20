import { ASCII_CHAR_SETS, type AsciiCharSetKey } from '../model/types'

interface ImageToAsciiOptions {
  width: number
  charSet: AsciiCharSetKey
  invert: boolean
}

/**
 * 이미지를 ASCII 아트로 변환합니다.
 * Canvas API를 사용하여 외부 라이브러리 없이 구현됩니다.
 */
export async function imageToAscii(
  imageSource: string | File,
  options: ImageToAsciiOptions
): Promise<string> {
  const { width, charSet, invert } = options

  // 이미지 로드
  const img = await loadImage(imageSource)

  // 종횡비 유지하면서 크기 계산
  // ASCII 문자는 세로가 더 길기 때문에 높이를 0.5로 조정
  const aspectRatio = img.height / img.width
  const height = Math.round(width * aspectRatio * 0.5)

  // Canvas 생성 및 이미지 그리기
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Canvas 컨텍스트를 가져올 수 없습니다.')
  }

  canvas.width = width
  canvas.height = height
  ctx.drawImage(img, 0, 0, width, height)

  // 픽셀 데이터 추출
  const imageData = ctx.getImageData(0, 0, width, height)
  const pixels = imageData.data

  // 문자 세트 가져오기
  const chars = ASCII_CHAR_SETS[charSet]
  const charArray = invert ? chars.split('').reverse().join('') : chars

  // ASCII 아트 생성
  let ascii = ''

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const r = pixels[idx]
      const g = pixels[idx + 1]
      const b = pixels[idx + 2]

      // 그레이스케일 변환 (Luminance 공식)
      const gray = 0.299 * r + 0.587 * g + 0.114 * b

      // 밝기에 해당하는 문자 선택
      const charIdx = Math.floor((gray / 255) * (charArray.length - 1))
      ascii += charArray[charIdx]
    }
    ascii += '\n'
  }

  return ascii
}

/**
 * 이미지를 로드합니다.
 */
function loadImage(source: string | File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('이미지를 로드할 수 없습니다.'))

    if (source instanceof File) {
      const reader = new FileReader()
      reader.onload = (e) => {
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'))
      reader.readAsDataURL(source)
    } else {
      img.src = source
    }
  })
}

/**
 * 파일을 Base64 데이터 URL로 변환합니다.
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'))
    reader.readAsDataURL(file)
  })
}
