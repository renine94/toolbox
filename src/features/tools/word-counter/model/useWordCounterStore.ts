import { create } from 'zustand'
import type { TextStats } from './types'
import { INITIAL_STATS } from './types'
import { analyzeText } from '../lib/counter'

interface WordCounterState {
  text: string
  stats: TextStats
  setText: (text: string) => void
  clear: () => void
}

export const useWordCounterStore = create<WordCounterState>((set) => ({
  text: '',
  stats: INITIAL_STATS,

  setText: (text: string) =>
    set({
      text,
      stats: analyzeText(text),
    }),

  clear: () =>
    set({
      text: '',
      stats: INITIAL_STATS,
    }),
}))
