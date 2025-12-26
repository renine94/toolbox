import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  GradientState,
  GradientConfig,
  GradientType,
  ColorStop,
  PresetGradient,
  SavedGradient,
  DEFAULT_GRADIENT,
} from "./types";

const generateId = () => Math.random().toString(36).substr(2, 9);

const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const useGradientStore = create<GradientState>()(
  persist(
    (set) => ({
      config: DEFAULT_GRADIENT,
      savedGradients: [],

      setType: (type: GradientType) =>
        set((state) => ({
          config: { ...state.config, type },
        })),

      setAngle: (angle: number) =>
        set((state) => ({
          config: { ...state.config, angle },
        })),

      setCenter: (centerX: number, centerY: number) =>
        set((state) => ({
          config: { ...state.config, centerX, centerY },
        })),

      addColorStop: (color: string, position: number) =>
        set((state) => {
          const newStop: ColorStop = {
            id: generateId(),
            color,
            position,
          };
          const colorStops = [...state.config.colorStops, newStop].sort(
            (a, b) => a.position - b.position
          );
          return { config: { ...state.config, colorStops } };
        }),

      updateColorStop: (id: string, color: string, position: number) =>
        set((state) => {
          const colorStops = state.config.colorStops
            .map((stop) =>
              stop.id === id ? { ...stop, color, position } : stop
            )
            .sort((a, b) => a.position - b.position);
          return { config: { ...state.config, colorStops } };
        }),

      removeColorStop: (id: string) =>
        set((state) => {
          if (state.config.colorStops.length <= 2) return state;
          const colorStops = state.config.colorStops.filter(
            (stop) => stop.id !== id
          );
          return { config: { ...state.config, colorStops } };
        }),

      loadPreset: (preset: PresetGradient) =>
        set(() => ({
          config: {
            ...preset.config,
            colorStops: preset.config.colorStops.map((stop) => ({
              ...stop,
              id: generateId(),
            })),
          },
        })),

      loadConfig: (config: GradientConfig) =>
        set(() => ({
          config: {
            ...config,
            colorStops: config.colorStops.map((stop) => ({
              ...stop,
              id: generateId(),
            })),
          },
        })),

      randomize: () =>
        set(() => {
          const types: GradientType[] = ["linear", "radial", "conic"];
          const type = types[Math.floor(Math.random() * types.length)];
          const stopCount = Math.floor(Math.random() * 3) + 2; // 2-4 stops
          const colorStops: ColorStop[] = [];

          for (let i = 0; i < stopCount; i++) {
            colorStops.push({
              id: generateId(),
              color: generateRandomColor(),
              position: Math.round((i / (stopCount - 1)) * 100),
            });
          }

          return {
            config: {
              type,
              angle: Math.floor(Math.random() * 360),
              centerX: 50,
              centerY: 50,
              colorStops,
            },
          };
        }),

      saveGradient: (name: string) =>
        set((state) => {
          const newGradient: SavedGradient = {
            id: generateId(),
            name,
            config: { ...state.config },
            createdAt: Date.now(),
          };
          return {
            savedGradients: [newGradient, ...state.savedGradients],
          };
        }),

      loadSavedGradient: (gradient: SavedGradient) =>
        set(() => ({
          config: {
            ...gradient.config,
            colorStops: gradient.config.colorStops.map((stop) => ({
              ...stop,
              id: generateId(),
            })),
          },
        })),

      deleteSavedGradient: (id: string) =>
        set((state) => ({
          savedGradients: state.savedGradients.filter((g) => g.id !== id),
        })),

      clearSavedGradients: () =>
        set(() => ({
          savedGradients: [],
        })),
    }),
    {
      name: "gradient-generator-storage",
      partialize: (state) => ({
        savedGradients: state.savedGradients,
      }),
    }
  )
);
