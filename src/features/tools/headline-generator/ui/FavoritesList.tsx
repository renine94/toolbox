"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { Heart, Trash2 } from "lucide-react";
import { useHeadlineStore } from "../model/useHeadlineStore";
import { SavedHeadlineCard } from "./VariationCard";

export function FavoritesList() {
  const t = useTranslations("tools.headlineGenerator.ui");
  const { favorites, removeFavorite, clearFavorites } = useHeadlineStore();

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Heart className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">{t("noFavorites")}</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {t("noFavoritesDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {t("favoriteCount", { count: favorites.length })}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={clearFavorites}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("clearAll")}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((headline) => (
          <SavedHeadlineCard
            key={headline.id}
            headline={headline}
            onRemove={removeFavorite}
          />
        ))}
      </div>
    </div>
  );
}
