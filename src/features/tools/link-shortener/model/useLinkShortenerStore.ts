import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ShortenedUrl,
  ShortenerProvider,
  ShortenStatus,
} from "./types";
import {
  DEFAULT_PROVIDER,
  STORAGE_KEY,
  MAX_HISTORY_COUNT,
} from "./types";
import { shortenUrl, generateId } from "../lib/link-shortener-utils";

interface LinkShortenerState {
  // 입력 상태
  inputUrl: string;
  provider: ShortenerProvider;

  // 결과 상태
  currentResult: ShortenedUrl | null;
  status: ShortenStatus;
  errorMessage: string | null;

  // 이력
  history: ShortenedUrl[];

  // 입력 액션
  setInputUrl: (url: string) => void;
  setProvider: (provider: ShortenerProvider) => void;

  // 단축 액션
  shorten: () => Promise<void>;
  reset: () => void;

  // 이력 액션
  deleteFromHistory: (id: string) => void;
  clearHistory: () => void;
  loadFromHistory: (id: string) => void;
}

export const useLinkShortenerStore = create<LinkShortenerState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      inputUrl: "",
      provider: DEFAULT_PROVIDER,
      currentResult: null,
      status: "idle",
      errorMessage: null,
      history: [],

      // 입력 액션
      setInputUrl: (url) => set({ inputUrl: url }),

      setProvider: (provider) => set({ provider }),

      // 단축 액션
      shorten: async () => {
        const { inputUrl, provider, history } = get();

        set({ status: "loading", errorMessage: null });

        try {
          const result = await shortenUrl(inputUrl, provider);

          const newEntry: ShortenedUrl = {
            id: generateId(),
            originalUrl: inputUrl,
            shortUrl: result.shorturl!,
            createdAt: new Date().toISOString(),
            provider,
          };

          // 이력에 추가 (최대 개수 제한)
          const updatedHistory = [newEntry, ...history].slice(
            0,
            MAX_HISTORY_COUNT
          );

          set({
            status: "success",
            currentResult: newEntry,
            history: updatedHistory,
          });
        } catch (error) {
          // Fallback: is.gd 실패 시 v.gd로 재시도
          if (provider === "is.gd") {
            try {
              const fallbackResult = await shortenUrl(inputUrl, "v.gd");

              const newEntry: ShortenedUrl = {
                id: generateId(),
                originalUrl: inputUrl,
                shortUrl: fallbackResult.shorturl!,
                createdAt: new Date().toISOString(),
                provider: "v.gd",
              };

              const updatedHistory = [newEntry, ...history].slice(
                0,
                MAX_HISTORY_COUNT
              );

              set({
                status: "success",
                currentResult: newEntry,
                history: updatedHistory,
              });
              return;
            } catch {
              // Fallback도 실패
            }
          }

          set({
            status: "error",
            errorMessage:
              error instanceof Error
                ? error.message
                : "URL 단축에 실패했습니다",
          });
        }
      },

      reset: () =>
        set({
          inputUrl: "",
          currentResult: null,
          status: "idle",
          errorMessage: null,
        }),

      // 이력 액션
      deleteFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),

      clearHistory: () => set({ history: [] }),

      loadFromHistory: (id) => {
        const { history } = get();
        const item = history.find((h) => h.id === id);
        if (item) {
          set({
            inputUrl: item.originalUrl,
            currentResult: item,
            status: "success",
          });
        }
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        history: state.history,
        provider: state.provider,
      }),
    }
  )
);
