"use client";

import { cn } from "@/shared/lib/utils";
import { Emoji } from "../model/types";

interface EmojiGridProps {
  emojis: Emoji[];
  selectedEmojis: string[];
  onEmojiClick: (emoji: string) => void;
}

export function EmojiGrid({ emojis, selectedEmojis, onEmojiClick }: EmojiGridProps) {
  if (emojis.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        No emojis found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 gap-1">
      {emojis.map((emoji, index) => {
        const isSelected = selectedEmojis.includes(emoji.emoji);
        return (
          <button
            key={`${emoji.emoji}-${index}`}
            type="button"
            onClick={() => onEmojiClick(emoji.emoji)}
            title={emoji.name}
            className={cn(
              "relative flex items-center justify-center w-10 h-10 text-2xl rounded-lg transition-all",
              "hover:bg-accent hover:scale-110",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              isSelected && "bg-primary/20 ring-2 ring-primary"
            )}
          >
            <span>{emoji.emoji}</span>
            {isSelected && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <span className="text-[10px] text-primary-foreground font-bold">
                  {selectedEmojis.indexOf(emoji.emoji) + 1}
                </span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
