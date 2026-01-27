"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Lightbulb } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { VariationCategory } from "../model/types";
import { VARIATION_CATEGORIES } from "../model/types";
import { useHeadlineStore } from "../model/useHeadlineStore";
import { VariationCard } from "./VariationCard";

export function VariationList() {
  const t = useTranslations("tools.headlineGenerator.ui");
  const { variations, selectedCategory, setSelectedCategory } = useHeadlineStore();

  const filteredVariations = useMemo(() => {
    if (selectedCategory === "all") {
      return variations;
    }
    return variations.filter((v) => v.category === selectedCategory);
  }, [variations, selectedCategory]);

  const categories = useMemo(() => {
    const counts: Record<string, number> = { all: variations.length };
    variations.forEach((v) => {
      counts[v.category] = (counts[v.category] || 0) + 1;
    });
    return counts;
  }, [variations]);

  if (variations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Lightbulb className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">{t("emptyState")}</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {t("emptyStateDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
          className="h-8"
        >
          {t("allCategories")}
          <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
            {categories.all}
          </Badge>
        </Button>
        {(Object.keys(VARIATION_CATEGORIES) as VariationCategory[]).map((category) => {
          const count = categories[category] || 0;
          if (count === 0) return null;

          return (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="h-8"
            >
              {VARIATION_CATEGORIES[category].label}
              <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                {count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Variations Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredVariations.map((variation) => (
          <VariationCard key={variation.id} variation={variation} />
        ))}
      </div>

      {/* Count Info */}
      <p className="text-sm text-muted-foreground text-center">
        {t("variationCount", { count: filteredVariations.length })}
      </p>
    </div>
  );
}
