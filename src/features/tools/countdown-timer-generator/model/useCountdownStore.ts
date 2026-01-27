import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CountdownConfig,
  ThemePreset,
  DEFAULT_COUNTDOWN_CONFIG,
} from "./types";

interface CountdownState {
  config: CountdownConfig;

  // Actions
  setTargetDate: (date: string) => void;
  setTitle: (title: string) => void;
  setShowLabels: (show: boolean) => void;
  setFontSize: (size: number) => void;
  setBorderRadius: (radius: number) => void;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  setTheme: (theme: ThemePreset) => void;
  resetConfig: () => void;
}

export const useCountdownStore = create<CountdownState>()(
  persist(
    (set) => ({
      config: DEFAULT_COUNTDOWN_CONFIG,

      setTargetDate: (date) =>
        set((state) => ({
          config: { ...state.config, targetDate: date },
        })),

      setTitle: (title) =>
        set((state) => ({
          config: { ...state.config, title },
        })),

      setShowLabels: (show) =>
        set((state) => ({
          config: { ...state.config, showLabels: show },
        })),

      setFontSize: (size) =>
        set((state) => ({
          config: { ...state.config, fontSize: size },
        })),

      setBorderRadius: (radius) =>
        set((state) => ({
          config: { ...state.config, borderRadius: radius },
        })),

      setWidth: (width) =>
        set((state) => ({
          config: { ...state.config, width },
        })),

      setHeight: (height) =>
        set((state) => ({
          config: { ...state.config, height },
        })),

      setTheme: (theme) =>
        set((state) => ({
          config: { ...state.config, theme },
        })),

      resetConfig: () =>
        set({
          config: DEFAULT_COUNTDOWN_CONFIG,
        }),
    }),
    {
      name: "countdown-timer-storage",
      partialize: (state) => ({
        config: state.config,
      }),
    }
  )
);
