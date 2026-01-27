// Emoji Types
export interface Emoji {
  emoji: string;
  name: string;
  category: EmojiCategory;
  keywords?: string[];
}

export type EmojiCategory =
  | "smileys"
  | "gestures"
  | "animals"
  | "food"
  | "travel"
  | "activities"
  | "objects"
  | "flags";

export const EMOJI_CATEGORY_LABELS: Record<EmojiCategory, string> = {
  smileys: "smileys",
  gestures: "gestures",
  animals: "animals",
  food: "food",
  travel: "travel",
  activities: "activities",
  objects: "objects",
  flags: "flags",
};

// Hashtag Types
export interface Hashtag {
  tag: string;
  category: HashtagCategory;
}

export type HashtagCategory =
  | "marketing"
  | "business"
  | "lifestyle"
  | "travel"
  | "food"
  | "fashion"
  | "fitness"
  | "tech";

export const HASHTAG_CATEGORY_LABELS: Record<HashtagCategory, string> = {
  marketing: "marketing",
  business: "business",
  lifestyle: "lifestyle",
  travel: "travel",
  food: "food",
  fashion: "fashion",
  fitness: "fitness",
  tech: "tech",
};

// Picker Types
export type PickerTab = "emoji" | "hashtag";

export interface PickerState {
  activeTab: PickerTab;
  selectedEmojis: string[];
  selectedHashtags: string[];
  recentEmojis: string[];
  recentHashtags: string[];
  emojiSearch: string;
  hashtagSearch: string;
  emojiCategory: EmojiCategory | "all" | "recent";
  hashtagCategory: HashtagCategory | "all" | "recent";
}

export const DEFAULT_PICKER_STATE: PickerState = {
  activeTab: "emoji",
  selectedEmojis: [],
  selectedHashtags: [],
  recentEmojis: [],
  recentHashtags: [],
  emojiSearch: "",
  hashtagSearch: "",
  emojiCategory: "all",
  hashtagCategory: "all",
};

export const MAX_RECENT_ITEMS = 24;
