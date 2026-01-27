"use client";

import { cn } from "@/shared/lib/utils";
import { Hashtag } from "../model/types";

interface HashtagListProps {
  hashtags: Hashtag[];
  selectedHashtags: string[];
  onHashtagClick: (tag: string) => void;
}

export function HashtagList({ hashtags, selectedHashtags, onHashtagClick }: HashtagListProps) {
  if (hashtags.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        No hashtags found
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {hashtags.map((hashtag, index) => {
        const isSelected = selectedHashtags.includes(hashtag.tag);
        return (
          <button
            key={`${hashtag.tag}-${index}`}
            type="button"
            onClick={() => onHashtagClick(hashtag.tag)}
            className={cn(
              "px-3 py-1.5 text-sm rounded-full transition-all",
              "border hover:bg-accent",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              isSelected
                ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                : "bg-background border-border"
            )}
          >
            {hashtag.tag}
          </button>
        );
      })}
    </div>
  );
}
