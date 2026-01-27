import { create } from "zustand";
import type { MetaTags, PreviewTab } from "./types";
import { DEFAULT_META_TAGS } from "./types";

interface MetaState {
  // 현재 URL
  url: string;

  // 메타 태그 데이터
  metaTags: MetaTags;

  // 로딩 상태
  isLoading: boolean;

  // 에러 메시지
  error: string | null;

  // 현재 선택된 미리보기 탭
  activeTab: PreviewTab;

  // Actions
  setUrl: (url: string) => void;
  setMetaTags: (tags: Partial<MetaTags>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveTab: (tab: PreviewTab) => void;
  reset: () => void;
}

export const useMetaStore = create<MetaState>((set) => ({
  // 초기 상태
  url: "",
  metaTags: DEFAULT_META_TAGS,
  isLoading: false,
  error: null,
  activeTab: "google",

  // Actions
  setUrl: (url) => set({ url }),

  setMetaTags: (tags) =>
    set((state) => ({
      metaTags: { ...state.metaTags, ...tags },
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setActiveTab: (activeTab) => set({ activeTab }),

  reset: () =>
    set({
      url: "",
      metaTags: DEFAULT_META_TAGS,
      isLoading: false,
      error: null,
    }),
}));
