"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { cn } from "@/shared/lib/utils";
import { usePickerStore } from "../model/usePickerStore";
import { HashtagCategory, HASHTAG_CATEGORY_LABELS } from "../model/types";
import { getHashtagsByCategory, searchHashtags } from "../model/hashtag-data";
import { SearchInput } from "./SearchInput";
import { HashtagList } from "./HashtagList";

const CATEGORY_ICONS: Record<HashtagCategory | "all" | "recent", string> = {
  all: "#",
  recent: "🕐",
  marketing: "📢",
  business: "💼",
  lifestyle: "🌟",
  travel: "✈️",
  food: "🍔",
  fashion: "👗",
  fitness: "💪",
  tech: "💻",
};

export function HashtagPicker() {
  const t = useTranslations("tools.emojiHashtagPicker.ui");

  const {
    hashtagSearch,
    hashtagCategory,
    selectedHashtags,
    recentHashtags,
    setHashtagSearch,
    setHashtagCategory,
    addHashtag,
    removeHashtag,
  } = usePickerStore();

  const filteredHashtags = useMemo(() => {
    if (hashtagSearch.trim()) {
      return searchHashtags(hashtagSearch);
    }
    return getHashtagsByCategory(hashtagCategory, recentHashtags);
  }, [hashtagSearch, hashtagCategory, recentHashtags]);

  const handleHashtagClick = (tag: string) => {
    if (selectedHashtags.includes(tag)) {
      removeHashtag(tag);
    } else {
      addHashtag(tag);
    }
  };

  const categories: (HashtagCategory | "all" | "recent")[] = [
    "all",
    "recent",
    "marketing",
    "business",
    "lifestyle",
    "travel",
    "food",
    "fashion",
    "fitness",
    "tech",
  ];

  return (
    <div className="space-y-4">
      <SearchInput
        value={hashtagSearch}
        onChange={setHashtagSearch}
        placeholder={t("searchHashtag")}
      />

      {/* Category Buttons */}
      <ScrollArea className="w-full">
        <div className="flex gap-1 pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={hashtagCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setHashtagCategory(category)}
              className={cn(
                "flex-shrink-0 gap-1.5",
                category === "recent" && recentHashtags.length === 0 && "opacity-50"
              )}
              disabled={category === "recent" && recentHashtags.length === 0}
            >
              <span>{CATEGORY_ICONS[category]}</span>
              <span className="hidden sm:inline">
                {category === "all"
                  ? t("categories.all")
                  : category === "recent"
                  ? t("categories.recent")
                  : t(`categories.${HASHTAG_CATEGORY_LABELS[category as HashtagCategory]}`)}
              </span>
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Hashtag List */}
      <ScrollArea className="h-[300px] rounded-lg border p-3">
        <HashtagList
          hashtags={filteredHashtags}
          selectedHashtags={selectedHashtags}
          onHashtagClick={handleHashtagClick}
        />
      </ScrollArea>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {t("resultsCount", { count: filteredHashtags.length })}
      </div>
    </div>
  );
}
