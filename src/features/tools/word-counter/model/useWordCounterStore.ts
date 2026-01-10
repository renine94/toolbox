import { create } from 'zustand'

interface WordCounterState {
  text: string
  setText: (text: string) => void
  clear: () => void
}

export const useWordCounterStore = create<WordCounterState>((set) => ({
  text: '',

  setText: (text: string) => set({ text }),

  clear: () => set({ text: '' }),
}))
