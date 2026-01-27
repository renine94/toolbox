import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HeadlineVariation, SavedHeadline, VariationCategory } from "./types";
import { VARIATION_PATTERNS, generateHeadlineFromPattern } from "./variation-patterns";

interface HeadlineState {
  // Input
  topic: string;

  // Generated variations
  variations: HeadlineVariation[];

  // Favorites (saved to localStorage)
  favorites: SavedHeadline[];

  // Filter
  selectedCategory: VariationCategory | "all";

  // Actions
  setTopic: (topic: string) => void;
  generateVariations: () => void;
  toggleFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
  setSelectedCategory: (category: VariationCategory | "all") => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const useHeadlineStore = create<HeadlineState>()(
  persist(
    (set, get) => ({
      // Initial state
      topic: "",
      variations: [],
      favorites: [],
      selectedCategory: "all",

      // Actions
      setTopic: (topic) => set({ topic }),

      generateVariations: () => {
        const { topic } = get();
        if (!topic.trim()) {
          set({ variations: [] });
          return;
        }

        const variations: HeadlineVariation[] = VARIATION_PATTERNS.map((pattern) => ({
          id: generateId(),
          patternName: pattern.name,
          headline: generateHeadlineFromPattern(pattern, topic.trim()),
          category: pattern.category,
          isFavorite: false,
        }));

        set({ variations });
      },

      toggleFavorite: (id) => {
        const { variations, favorites } = get();
        const variation = variations.find((v) => v.id === id);

        if (!variation) return;

        const existingIndex = favorites.findIndex(
          (f) => f.headline === variation.headline
        );

        if (existingIndex !== -1) {
          // Remove from favorites
          set({
            favorites: favorites.filter((_, index) => index !== existingIndex),
            variations: variations.map((v) =>
              v.id === id ? { ...v, isFavorite: false } : v
            ),
          });
        } else {
          // Add to favorites
          const newFavorite: SavedHeadline = {
            id: generateId(),
            headline: variation.headline,
            patternName: variation.patternName,
            category: variation.category,
            createdAt: new Date().toISOString(),
          };

          set({
            favorites: [newFavorite, ...favorites],
            variations: variations.map((v) =>
              v.id === id ? { ...v, isFavorite: true } : v
            ),
          });
        }
      },

      removeFavorite: (id) => {
        const { favorites, variations } = get();
        const favorite = favorites.find((f) => f.id === id);

        set({
          favorites: favorites.filter((f) => f.id !== id),
          variations: variations.map((v) =>
            v.headline === favorite?.headline ? { ...v, isFavorite: false } : v
          ),
        });
      },

      clearFavorites: () => {
        const { variations } = get();
        set({
          favorites: [],
          variations: variations.map((v) => ({ ...v, isFavorite: false })),
        });
      },

      setSelectedCategory: (category) => set({ selectedCategory: category }),
    }),
    {
      name: "headline-generator-storage",
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
);
