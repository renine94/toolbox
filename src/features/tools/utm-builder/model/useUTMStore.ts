import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UTMParams, UTMPreset, UTMHistoryItem } from "./types";
import { generateId, buildUTMUrl } from "../lib/utm-utils";

interface UTMState {
  // 현재 입력값
  baseUrl: string;
  params: UTMParams;
  generatedUrl: string;

  // 저장된 프리셋
  customPresets: UTMPreset[];

  // 히스토리
  history: UTMHistoryItem[];

  // URL Actions
  setBaseUrl: (url: string) => void;

  // Params Actions
  setParams: (params: Partial<UTMParams>) => void;
  resetParams: () => void;
  applyPreset: (params: UTMParams) => void;

  // Generated URL Actions
  generateUrl: () => string;

  // Preset Actions
  savePreset: (name: string) => void;
  deletePreset: (id: string) => void;
  updatePreset: (id: string, name: string) => void;

  // History Actions
  addToHistory: () => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;
  loadFromHistory: (item: UTMHistoryItem) => void;

  // Reset
  resetAll: () => void;
}

const DEFAULT_PARAMS: UTMParams = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_term: "",
  utm_content: "",
};

export const useUTMStore = create<UTMState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      baseUrl: "",
      params: DEFAULT_PARAMS,
      generatedUrl: "",
      customPresets: [],
      history: [],

      // URL Actions
      setBaseUrl: (url) => {
        set({ baseUrl: url });
        // URL 변경 시 자동으로 generated URL 업데이트
        const { params } = get();
        if (url && params.utm_source && params.utm_medium && params.utm_campaign) {
          const generated = buildUTMUrl(url, params);
          set({ generatedUrl: generated });
        } else {
          set({ generatedUrl: "" });
        }
      },

      // Params Actions
      setParams: (newParams) => {
        set((state) => {
          const updatedParams = { ...state.params, ...newParams };
          // 파라미터 변경 시 자동으로 generated URL 업데이트
          if (
            state.baseUrl &&
            updatedParams.utm_source &&
            updatedParams.utm_medium &&
            updatedParams.utm_campaign
          ) {
            const generated = buildUTMUrl(state.baseUrl, updatedParams);
            return { params: updatedParams, generatedUrl: generated };
          }
          return { params: updatedParams, generatedUrl: "" };
        });
      },

      resetParams: () => {
        set({ params: DEFAULT_PARAMS, generatedUrl: "" });
      },

      applyPreset: (params) => {
        set((state) => {
          if (
            state.baseUrl &&
            params.utm_source &&
            params.utm_medium &&
            params.utm_campaign
          ) {
            const generated = buildUTMUrl(state.baseUrl, params);
            return { params, generatedUrl: generated };
          }
          return { params, generatedUrl: "" };
        });
      },

      // Generated URL Actions
      generateUrl: () => {
        const { baseUrl, params } = get();
        if (!baseUrl) return "";

        const generated = buildUTMUrl(baseUrl, params);
        set({ generatedUrl: generated });
        return generated;
      },

      // Preset Actions
      savePreset: (name) => {
        const { params, customPresets } = get();
        const newPreset: UTMPreset = {
          id: generateId(),
          name,
          params: { ...params },
          createdAt: new Date().toISOString(),
        };

        set({ customPresets: [newPreset, ...customPresets] });
      },

      deletePreset: (id) => {
        set((state) => ({
          customPresets: state.customPresets.filter((preset) => preset.id !== id),
        }));
      },

      updatePreset: (id, name) => {
        set((state) => ({
          customPresets: state.customPresets.map((preset) =>
            preset.id === id ? { ...preset, name } : preset
          ),
        }));
      },

      // History Actions
      addToHistory: () => {
        const { baseUrl, params, generatedUrl, history } = get();
        if (!generatedUrl) return;

        const newItem: UTMHistoryItem = {
          id: generateId(),
          baseUrl,
          params: { ...params },
          generatedUrl,
          createdAt: new Date().toISOString(),
        };

        // 최대 50개까지 저장
        const updatedHistory = [newItem, ...history].slice(0, 50);
        set({ history: updatedHistory });
      },

      deleteHistoryItem: (id) => {
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        }));
      },

      clearHistory: () => {
        set({ history: [] });
      },

      loadFromHistory: (item) => {
        const generated = buildUTMUrl(item.baseUrl, item.params);
        set({
          baseUrl: item.baseUrl,
          params: item.params,
          generatedUrl: generated,
        });
      },

      // Reset
      resetAll: () => {
        set({
          baseUrl: "",
          params: DEFAULT_PARAMS,
          generatedUrl: "",
        });
      },
    }),
    {
      name: "utm-builder-storage",
      partialize: (state) => ({
        customPresets: state.customPresets,
        history: state.history,
      }),
    }
  )
);
