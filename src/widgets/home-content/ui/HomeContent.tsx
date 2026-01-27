"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { HeroSection } from "@/widgets/hero-section";
import { ToolsGrid } from "@/widgets/tools-grid";
import { StatsSection } from "@/widgets/stats-section";
import { DeveloperSection } from "@/widgets/developer-section";
import {
  CATEGORIES,
  CATEGORY_ORDER,
  getToolsByCategory,
  toolIdToTranslationKey,
} from "@/shared/lib/tool-registry";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "available" | "coming-soon";
}

interface Category {
  id: string;
  name: string;
  nameKo: string;
  icon: string;
  gradient: string;
  tools: Tool[];
}

export function HomeContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const t = useTranslations("tools");
  const tCategories = useTranslations("categories");
  const tStats = useTranslations("home.stats");

  // tool-registry.ts를 단일 소스로 사용하여 카테고리와 도구 목록 생성
  const categories: Category[] = useMemo(() => {
    return CATEGORY_ORDER.map((categoryId) => {
      const categoryMeta = CATEGORIES[categoryId];
      const toolsMeta = getToolsByCategory(categoryId);

      return {
        id: categoryId,
        name: tCategories(`${categoryId}.name`),
        nameKo: tCategories(`${categoryId}.nameKo`),
        icon: categoryMeta.icon,
        gradient: categoryMeta.gradient,
        tools: toolsMeta.map((tool) => {
          const translationKey = toolIdToTranslationKey(tool.id);
          return {
            id: tool.id,
            name: t(`${translationKey}.name`),
            description: t(`${translationKey}.description`),
            icon: tool.icon,
            status: "available" as const,
          };
        }),
      };
    });
  }, [t, tCategories]);

  const filteredCategories = selectedCategory
    ? categories.filter((cat) => cat.id === selectedCategory)
    : categories;

  const totalTools = categories.reduce((acc, cat) => acc + cat.tools.length, 0);

  const stats = [
    {
      value: `${totalTools}+`,
      labelKey: "tools",
      gradient: "from-violet-400 to-purple-400",
    },
    {
      value: categories.length.toString(),
      labelKey: "categories",
      gradient: "from-pink-400 to-rose-400",
    },
    {
      value: tStats("free"),
      labelKey: "price",
      gradient: "from-emerald-400 to-teal-400",
    },
    {
      value: tStats("unlimited"),
      labelKey: "usage",
      gradient: "from-amber-400 to-orange-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-500/15 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <HeroSection
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <ToolsGrid categories={filteredCategories} />

        <StatsSection stats={stats} />

        <DeveloperSection />
      </div>
    </div>
  );
}
