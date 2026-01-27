"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { cn } from "@/shared/lib/utils";
import { usePickerStore } from "../model/usePickerStore";
import { EmojiCategory, EMOJI_CATEGORY_LABELS } from "../model/types";
import { getEmojisByCategory, searchEmojis } from "../model/emoji-data";
import { SearchInput } from "./SearchInput";
import { EmojiGrid } from "./EmojiGrid";

const CATEGORY_ICONS: Record<EmojiCategory | "all" | "recent", string> = {
  all: "🔤",
  recent: "🕐",
  smileys: "😀",
  gestures: "👋",
  animals: "🐶",
  food: "🍎",
  travel: "🚗",
  activities: "⚽",
  objects: "💡",
  flags: "🏳️",
};

export function EmojiPicker() {
  const t = useTranslations("tools.emojiHashtagPicker.ui");

  const {
    emojiSearch,
    emojiCategory,
    selectedEmojis,
    recentEmojis,
    setEmojiSearch,
    setEmojiCategory,
    addEmoji,
    removeEmoji,
  } = usePickerStore();

  const filteredEmojis = useMemo(() => {
    if (emojiSearch.trim()) {
      return searchEmojis(emojiSearch);
    }
    return getEmojisByCategory(emojiCategory, recentEmojis);
  }, [emojiSearch, emojiCategory, recentEmojis]);

  const handleEmojiClick = (emoji: string) => {
    if (selectedEmojis.includes(emoji)) {
      removeEmoji(emoji);
    } else {
      addEmoji(emoji);
    }
  };

  const categories: (EmojiCategory | "all" | "recent")[] = [
    "all",
    "recent",
    "smileys",
    "gestures",
    "animals",
    "food",
    "travel",
    "activities",
    "objects",
    "flags",
  ];

  return (
    <div className="space-y-4">
      <SearchInput
        value={emojiSearch}
        onChange={setEmojiSearch}
        placeholder={t("searchEmoji")}
      />

      {/* Category Buttons */}
      <ScrollArea className="w-full">
        <div className="flex gap-1 pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={emojiCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setEmojiCategory(category)}
              className={cn(
                "flex-shrink-0 gap-1.5",
                category === "recent" && recentEmojis.length === 0 && "opacity-50"
              )}
              disabled={category === "recent" && recentEmojis.length === 0}
            >
              <span>{CATEGORY_ICONS[category]}</span>
              <span className="hidden sm:inline">
                {category === "all"
                  ? t("categories.all")
                  : category === "recent"
                  ? t("categories.recent")
                  : t(`categories.${EMOJI_CATEGORY_LABELS[category as EmojiCategory]}`)}
              </span>
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Emoji Grid */}
      <ScrollArea className="h-[300px] rounded-lg border p-3">
        <EmojiGrid
          emojis={filteredEmojis}
          selectedEmojis={selectedEmojis}
          onEmojiClick={handleEmojiClick}
        />
      </ScrollArea>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {t("resultsCount", { count: filteredEmojis.length })}
      </div>
    </div>
  );
}
