/**
 * SQL Formatter Zustand 스토어
 */

import { create } from 'zustand'
import type { SqlFormatterState, SqlFormatOptions } from './types'

const DEFAULT_OPTIONS: SqlFormatOptions = {
  dialect: 'sql',
  indent: '2',
  keywordCase: 'upper',
}

export const useSqlStore = create<SqlFormatterState>((set) => ({
  input: '',
  output: '',
  error: null,
  options: DEFAULT_OPTIONS,

  setInput: (input) => set({ input }),
  setOutput: (output) => set({ output }),
  setError: (error) => set({ error }),

  setOptions: (newOptions) =>
    set((state) => ({
      options: { ...state.options, ...newOptions },
    })),

  clear: () =>
    set({
      input: '',
      output: '',
      error: null,
    }),
}))
