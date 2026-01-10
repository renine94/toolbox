import type { TextStats } from '../model/types'
import { INITIAL_STATS } from '../model/types'

const READING_WPM = 200
const SPEAKING_WPM = 150

export function countWords(text: string): number {
  if (!text.trim()) return 0
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
}

export function countChars(text: string): number {
  return text.length
}

export function countCharsNoSpace(text: string): number {
  return text.replace(/\s/g, '').length
}

export function countLines(text: string): number {
  if (!text) return 0
  return text.split('\n').length
}

export function countParagraphs(text: string): number {
  if (!text.trim()) return 0
  return text
    .split(/\n\s*\n/)
    .filter((para) => para.trim().length > 0).length
}

export function calcReadingTime(wordCount: number): number {
  return Math.ceil(wordCount / READING_WPM)
}

export function calcSpeakingTime(wordCount: number): number {
  return Math.ceil(wordCount / SPEAKING_WPM)
}

export function analyzeText(text: string): TextStats {
  if (!text) return INITIAL_STATS

  const wordCount = countWords(text)

  return {
    wordCount,
    charCount: countChars(text),
    charNoSpaceCount: countCharsNoSpace(text),
    lineCount: countLines(text),
    paragraphCount: countParagraphs(text),
    readingTime: calcReadingTime(wordCount),
    speakingTime: calcSpeakingTime(wordCount),
  }
}
