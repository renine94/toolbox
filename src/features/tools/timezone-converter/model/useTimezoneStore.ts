import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  ConvertedTime,
  TimeInputMode,
  TimezoneSettings,
  DEFAULT_SETTINGS,
  POPULAR_TIMEZONES,
} from "./types"
import {
  getLocalTimezone,
  convertToMultipleTimezones,
} from "../lib/timezone-utils"

interface TimezoneState {
  // 입력 관련
  inputMode: TimeInputMode
  sourceTimezone: string
  sourceDateTime: Date

  // 변환 대상 시간대 목록
  targetTimezones: string[]

  // 변환 결과
  convertedTimes: ConvertedTime[]

  // 설정
  settings: TimezoneSettings

  // 검색
  searchQuery: string

  // 즐겨찾기
  favoriteTimezones: string[]

  // 액션
  setInputMode: (mode: TimeInputMode) => void
  setSourceTimezone: (timezone: string) => void
  setSourceDateTime: (dateTime: Date) => void
  useCurrentTime: () => void

  addTargetTimezone: (timezone: string) => void
  removeTargetTimezone: (timezone: string) => void
  clearTargetTimezones: () => void

  convert: () => void

  setSettings: (partial: Partial<TimezoneSettings>) => void
  setSearchQuery: (query: string) => void

  addFavorite: (timezone: string) => void
  removeFavorite: (timezone: string) => void
  isFavorite: (timezone: string) => boolean

  reset: () => void
}

export const useTimezoneStore = create<TimezoneState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      inputMode: "current",
      sourceTimezone: getLocalTimezone(),
      sourceDateTime: new Date(),
      targetTimezones: POPULAR_TIMEZONES.slice(0, 4),
      convertedTimes: [],
      settings: DEFAULT_SETTINGS,
      searchQuery: "",
      favoriteTimezones: [],

      setInputMode: (mode) => set({ inputMode: mode }),

      setSourceTimezone: (timezone) => {
        set({ sourceTimezone: timezone })
        get().convert()
      },

      setSourceDateTime: (dateTime) => {
        set({ sourceDateTime: dateTime, inputMode: "custom" })
        get().convert()
      },

      useCurrentTime: () => {
        set({ sourceDateTime: new Date(), inputMode: "current" })
        get().convert()
      },

      addTargetTimezone: (timezone) => {
        const { targetTimezones } = get()
        if (!targetTimezones.includes(timezone)) {
          set({ targetTimezones: [...targetTimezones, timezone] })
          get().convert()
        }
      },

      removeTargetTimezone: (timezone) => {
        set((state) => ({
          targetTimezones: state.targetTimezones.filter((tz) => tz !== timezone),
          convertedTimes: state.convertedTimes.filter(
            (ct) => ct.timezone.id !== timezone
          ),
        }))
      },

      clearTargetTimezones: () => {
        set({ targetTimezones: [], convertedTimes: [] })
      },

      convert: () => {
        const { sourceTimezone, sourceDateTime, targetTimezones, settings } = get()
        const convertedTimes = convertToMultipleTimezones(
          sourceDateTime,
          sourceTimezone,
          targetTimezones,
          settings
        )
        set({ convertedTimes })
      },

      setSettings: (partial) => {
        set((state) => ({
          settings: { ...state.settings, ...partial },
        }))
        get().convert()
      },

      setSearchQuery: (query) => set({ searchQuery: query }),

      addFavorite: (timezone) => {
        set((state) => ({
          favoriteTimezones: state.favoriteTimezones.includes(timezone)
            ? state.favoriteTimezones
            : [...state.favoriteTimezones, timezone],
        }))
      },

      removeFavorite: (timezone) => {
        set((state) => ({
          favoriteTimezones: state.favoriteTimezones.filter((tz) => tz !== timezone),
        }))
      },

      isFavorite: (timezone) => {
        return get().favoriteTimezones.includes(timezone)
      },

      reset: () => {
        set({
          inputMode: "current",
          sourceTimezone: getLocalTimezone(),
          sourceDateTime: new Date(),
          targetTimezones: POPULAR_TIMEZONES.slice(0, 4),
          convertedTimes: [],
          searchQuery: "",
        })
        get().convert()
      },
    }),
    {
      name: "timezone-converter-storage",
      partialize: (state) => ({
        favoriteTimezones: state.favoriteTimezones,
        settings: state.settings,
        targetTimezones: state.targetTimezones,
        sourceTimezone: state.sourceTimezone,
      }),
    }
  )
)
