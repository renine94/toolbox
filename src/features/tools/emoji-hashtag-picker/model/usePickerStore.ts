import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  PickerState,
  PickerTab,
  EmojiCategory,
  HashtagCategory,
  MAX_RECENT_ITEMS,
  DEFAULT_PICKER_STATE,
} from "./types";

interface PickerStore extends PickerState {
  // Tab Actions
  setActiveTab: (tab: PickerTab) => void;

  // Emoji Actions
  setEmojiSearch: (search: string) => void;
  setEmojiCategory: (category: EmojiCategory | "all" | "recent") => void;
  addEmoji: (emoji: string) => void;
  removeEmoji: (emoji: string) => void;
  clearSelectedEmojis: () => void;
  addToRecentEmojis: (emoji: string) => void;

  // Hashtag Actions
  setHashtagSearch: (search: string) => void;
  setHashtagCategory: (category: HashtagCategory | "all" | "recent") => void;
  addHashtag: (tag: string) => void;
  removeHashtag: (tag: string) => void;
  clearSelectedHashtags: () => void;
  addToRecentHashtags: (tag: string) => void;

  // Utility Actions
  getSelectedText: () => string;
  clearAll: () => void;
}

export const usePickerStore = create<PickerStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_PICKER_STATE,

      // Tab Actions
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Emoji Actions
      setEmojiSearch: (search) => set({ emojiSearch: search }),
      setEmojiCategory: (category) => set({ emojiCategory: category }),

      addEmoji: (emoji) => {
        const state = get();
        if (!state.selectedEmojis.includes(emoji)) {
          set({ selectedEmojis: [...state.selectedEmojis, emoji] });
        }
        // Add to recent
        get().addToRecentEmojis(emoji);
      },

      removeEmoji: (emoji) => {
        set((state) => ({
          selectedEmojis: state.selectedEmojis.filter((e) => e !== emoji),
        }));
      },

      clearSelectedEmojis: () => set({ selectedEmojis: [] }),

      addToRecentEmojis: (emoji) => {
        set((state) => {
          const filtered = state.recentEmojis.filter((e) => e !== emoji);
          const updated = [emoji, ...filtered].slice(0, MAX_RECENT_ITEMS);
          return { recentEmojis: updated };
        });
      },

      // Hashtag Actions
      setHashtagSearch: (search) => set({ hashtagSearch: search }),
      setHashtagCategory: (category) => set({ hashtagCategory: category }),

      addHashtag: (tag) => {
        const state = get();
        if (!state.selectedHashtags.includes(tag)) {
          set({ selectedHashtags: [...state.selectedHashtags, tag] });
        }
        // Add to recent
        get().addToRecentHashtags(tag);
      },

      removeHashtag: (tag) => {
        set((state) => ({
          selectedHashtags: state.selectedHashtags.filter((t) => t !== tag),
        }));
      },

      clearSelectedHashtags: () => set({ selectedHashtags: [] }),

      addToRecentHashtags: (tag) => {
        set((state) => {
          const filtered = state.recentHashtags.filter((t) => t !== tag);
          const updated = [tag, ...filtered].slice(0, MAX_RECENT_ITEMS);
          return { recentHashtags: updated };
        });
      },

      // Utility Actions
      getSelectedText: () => {
        const state = get();
        const emojis = state.selectedEmojis.join("");
        const hashtags = state.selectedHashtags.join(" ");

        if (emojis && hashtags) {
          return `${emojis} ${hashtags}`;
        }
        return emojis || hashtags;
      },

      clearAll: () => {
        set({
          selectedEmojis: [],
          selectedHashtags: [],
          emojiSearch: "",
          hashtagSearch: "",
        });
      },
    }),
    {
      name: "emoji-hashtag-picker-storage",
      partialize: (state) => ({
        recentEmojis: state.recentEmojis,
        recentHashtags: state.recentHashtags,
      }),
    }
  )
);
