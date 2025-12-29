import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  PaletteState,
  HarmonyType,
  PaletteColor,
  SavedPalette,
  DEFAULT_BASE_COLOR,
} from "./types";

const MAX_SAVED_PALETTES = 20;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const usePaletteStore = create<PaletteState>()(
  persist(
    (set, get) => ({
      // Initial state
      baseColor: DEFAULT_BASE_COLOR,
      harmonyType: "analogous" as HarmonyType,
      customColors: [],
      savedPalettes: [],

      // Set base color
      setBaseColor: (color: string) => {
        set({ baseColor: color });
      },

      // Set harmony type
      setHarmonyType: (type: HarmonyType) => {
        set({ harmonyType: type });
      },

      // Add custom color
      addCustomColor: (hex: string) => {
        const { customColors } = get();
        const newColor: PaletteColor = {
          id: generateId(),
          hex,
          name: `Custom ${customColors.length + 1}`,
        };
        set({ customColors: [...customColors, newColor] });
      },

      // Remove custom color
      removeCustomColor: (id: string) => {
        const { customColors } = get();
        set({ customColors: customColors.filter((c) => c.id !== id) });
      },

      // Clear all custom colors
      clearCustomColors: () => {
        set({ customColors: [] });
      },

      // Save current palette
      savePalette: (name: string, colors: PaletteColor[]) => {
        const { baseColor, harmonyType, savedPalettes } = get();

        const newPalette: SavedPalette = {
          id: generateId(),
          name,
          colors: colors.map((c) => ({ ...c, id: generateId() })),
          harmonyType,
          baseColor,
          createdAt: Date.now(),
        };

        // Add to beginning, limit to MAX_SAVED_PALETTES
        const updatedPalettes = [newPalette, ...savedPalettes].slice(
          0,
          MAX_SAVED_PALETTES
        );
        set({ savedPalettes: updatedPalettes });
      },

      // Load a saved palette
      loadPalette: (palette: SavedPalette) => {
        set({
          baseColor: palette.baseColor,
          harmonyType: palette.harmonyType,
          customColors:
            palette.harmonyType === "custom"
              ? palette.colors.map((c) => ({ ...c }))
              : [],
        });
      },

      // Delete a saved palette
      deletePalette: (id: string) => {
        const { savedPalettes } = get();
        set({ savedPalettes: savedPalettes.filter((p) => p.id !== id) });
      },

      // Clear all saved palettes
      clearAllPalettes: () => {
        set({ savedPalettes: [] });
      },
    }),
    {
      name: "color-palette-storage",
      partialize: (state) => ({
        savedPalettes: state.savedPalettes,
      }),
    }
  )
);
