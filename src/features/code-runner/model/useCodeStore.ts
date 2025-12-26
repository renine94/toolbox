import { create } from "zustand";
import { CodeState, DEFAULT_CODE, ExecutionResult, Language } from "./types";

export const useCodeStore = create<CodeState>((set) => ({
  code: DEFAULT_CODE.javascript,
  language: "javascript",
  output: null,
  isRunning: false,
  isPyodideLoading: false,

  setCode: (code: string) => set({ code }),

  setLanguage: (language: Language) =>
    set((state) => ({
      language,
      code: state.code === DEFAULT_CODE[state.language] ? DEFAULT_CODE[language] : state.code,
    })),

  setOutput: (output: ExecutionResult | null) => set({ output }),

  setIsRunning: (isRunning: boolean) => set({ isRunning }),

  setIsPyodideLoading: (isPyodideLoading: boolean) => set({ isPyodideLoading }),

  clear: () =>
    set((state) => ({
      code: DEFAULT_CODE[state.language],
      output: null,
    })),
}));
