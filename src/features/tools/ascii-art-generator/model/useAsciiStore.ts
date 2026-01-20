import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AsciiStore, AsciiStoreState } from './types'

const initialState: AsciiStoreState = {
  activeTab: 'text',
  textConfig: {
    text: '',
    font: 'Standard',
  },
  imageConfig: {
    width: 80,
    charSet: 'standard',
    invert: false,
  },
  asciiOutput: '',
  isLoading: false,
  imageData: null,
}

export const useAsciiStore = create<AsciiStore>()(
  persist(
    (set) => ({
      ...initialState,

      setActiveTab: (tab) =>
        set({
          activeTab: tab,
          asciiOutput: '', // 탭 변경 시 결과 초기화
        }),

      setTextConfig: (config) =>
        set((state) => ({
          textConfig: { ...state.textConfig, ...config },
        })),

      setImageConfig: (config) =>
        set((state) => ({
          imageConfig: { ...state.imageConfig, ...config },
        })),

      setAsciiOutput: (output) => set({ asciiOutput: output }),

      setIsLoading: (loading) => set({ isLoading: loading }),

      setImageData: (data) => set({ imageData: data }),

      reset: () =>
        set({
          ...initialState,
          // persist된 설정은 유지
        }),
    }),
    {
      name: 'ascii-art-generator-storage',
      partialize: (state) => ({
        // 설정만 persist, 결과는 제외
        textConfig: { font: state.textConfig.font },
        imageConfig: state.imageConfig,
      }),
      // 깊은 병합으로 초기 상태의 필드가 유지되도록 함
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<AsciiStoreState>
        return {
          ...currentState,
          textConfig: {
            ...currentState.textConfig,
            ...persisted.textConfig,
          },
          imageConfig: {
            ...currentState.imageConfig,
            ...persisted.imageConfig,
          },
        }
      },
    }
  )
)
