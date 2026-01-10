export interface TextStats {
  wordCount: number
  charCount: number
  charNoSpaceCount: number
  lineCount: number
  paragraphCount: number
  readingTime: number
  speakingTime: number
}

export const INITIAL_STATS: TextStats = {
  wordCount: 0,
  charCount: 0,
  charNoSpaceCount: 0,
  lineCount: 0,
  paragraphCount: 0,
  readingTime: 0,
  speakingTime: 0,
}
