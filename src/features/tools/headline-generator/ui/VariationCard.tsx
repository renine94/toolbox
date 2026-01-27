"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Copy, Heart } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { HeadlineVariation, SavedHeadline } from "../model/types";
import { VARIATION_CATEGORIES } from "../model/types";
import { copyToClipboard, getCategoryColor } from "../lib/headline-utils";
import { useHeadlineStore } from "../model/useHeadlineStore";

interface VariationCardProps {
  variation: HeadlineVariation;
}

export function VariationCard({ variation }: VariationCardProps) {
  const tCommon = useTranslations("common.toast");
  const toggleFavorite = useHeadlineStore((state) => state.toggleFavorite);

  const handleCopy = async () => {
    try {
      await copyToClipboard(variation.headline);
      toast.success(tCommon("copied"));
    } catch {
      toast.error(tCommon("copyError"));
    }
  };

  const handleToggleFavorite = () => {
    toggleFavorite(variation.id);
  };

  const categoryInfo = VARIATION_CATEGORIES[variation.category];

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
              getCategoryColor(variation.category)
            )}
          >
            {categoryInfo.label}
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 transition-all",
                variation.isFavorite
                  ? "text-red-500 opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              )}
              onClick={handleToggleFavorite}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  variation.isFavorite && "fill-current"
                )}
              />
            </Button>
          </div>
        </div>
        <p className="text-base font-medium leading-relaxed">{variation.headline}</p>
        <p className="text-xs text-muted-foreground mt-2">{variation.patternName}</p>
      </div>
    </Card>
  );
}

interface SavedHeadlineCardProps {
  headline: SavedHeadline;
  onRemove: (id: string) => void;
}

export function SavedHeadlineCard({ headline, onRemove }: SavedHeadlineCardProps) {
  const tCommon = useTranslations("common.toast");

  const handleCopy = async () => {
    try {
      await copyToClipboard(headline.headline);
      toast.success(tCommon("copied"));
    } catch {
      toast.error(tCommon("copyError"));
    }
  };

  const categoryInfo = VARIATION_CATEGORIES[headline.category];

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
              getCategoryColor(headline.category)
            )}
          >
            {categoryInfo.label}
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemove(headline.id)}
            >
              <Heart className="h-4 w-4 fill-current" />
            </Button>
          </div>
        </div>
        <p className="text-base font-medium leading-relaxed">{headline.headline}</p>
        <p className="text-xs text-muted-foreground mt-2">{headline.patternName}</p>
      </div>
    </Card>
  );
}
