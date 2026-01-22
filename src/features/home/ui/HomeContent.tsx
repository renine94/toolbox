"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { HeroSection } from "@/widgets/hero-section";
import { ToolsGrid } from "@/widgets/tools-grid";
import { StatsSection } from "@/widgets/stats-section";
import { DeveloperSection } from "@/widgets/developer-section";

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

  const categories: Category[] = [
    {
      id: "developer",
      name: tCategories("developer.name"),
      nameKo: tCategories("developer.nameKo"),
      icon: "💻",
      gradient: "from-violet-500 to-purple-600",
      tools: [
        {
          id: "json-formatter",
          name: t("jsonFormatter.name"),
          description: t("jsonFormatter.description"),
          icon: "{ }",
          status: "available",
        },
        {
          id: "base64-encoder",
          name: t("base64Encoder.name"),
          description: t("base64Encoder.description"),
          icon: "🔤",
          status: "available",
        },
        {
          id: "color-picker",
          name: t("colorPicker.name"),
          description: t("colorPicker.description"),
          icon: "🎨",
          status: "available",
        },
        {
          id: "code-runner",
          name: t("codeRunner.name"),
          description: t("codeRunner.description"),
          icon: "▶️",
          status: "available",
        },
        {
          id: "regex-tester",
          name: t("regexTester.name"),
          description: t("regexTester.description"),
          icon: ".*",
          status: "available",
        },
        {
          id: "uuid-generator",
          name: t("uuidGenerator.name"),
          description: t("uuidGenerator.description"),
          icon: "🔑",
          status: "available",
        },
        {
          id: "jwt-decoder",
          name: t("jwtDecoder.name"),
          description: t("jwtDecoder.description"),
          icon: "🎫",
          status: "available",
        },
        {
          id: "diff-checker",
          name: t("diffChecker.name"),
          description: t("diffChecker.description"),
          icon: "⇆",
          status: "available",
        },
        {
          id: "url-encoder",
          name: t("urlEncoder.name"),
          description: t("urlEncoder.description"),
          icon: "🔗",
          status: "available",
        },
        {
          id: "cron-parser",
          name: t("cronParser.name"),
          description: t("cronParser.description"),
          icon: "⏰",
          status: "available",
        },
        {
          id: "json-yaml-converter",
          name: t("jsonYamlConverter.name"),
          description: t("jsonYamlConverter.description"),
          icon: "🔄",
          status: "available",
        },
        {
          id: "json-to-typescript",
          name: t("jsonToTypescript.name"),
          description: t("jsonToTypescript.description"),
          icon: "🔷",
          status: "available",
        },
        {
          id: "unix-timestamp",
          name: t("unixTimestamp.name"),
          description: t("unixTimestamp.description"),
          icon: "🕐",
          status: "available",
        },
        {
          id: "sql-formatter",
          name: t("sqlFormatter.name"),
          description: t("sqlFormatter.description"),
          icon: "🗄️",
          status: "available",
        },
        {
          id: "ascii-art-generator",
          name: t("asciiArtGenerator.name"),
          description: t("asciiArtGenerator.description"),
          icon: "🔡",
          status: "available",
        },
      ],
    },
    {
      id: "designer",
      name: tCategories("designer.name"),
      nameKo: tCategories("designer.nameKo"),
      icon: "🎨",
      gradient: "from-pink-500 to-rose-600",
      tools: [
        {
          id: "color-palette",
          name: t("colorPalette.name"),
          description: t("colorPalette.description"),
          icon: "🌈",
          status: "available",
        },
        {
          id: "image-editor",
          name: t("imageEditor.name"),
          description: t("imageEditor.description"),
          icon: "🖼️",
          status: "available",
        },
        {
          id: "gradient-generator",
          name: t("gradientGenerator.name"),
          description: t("gradientGenerator.description"),
          icon: "🌅",
          status: "available",
        },
        {
          id: "image-upscaler",
          name: t("imageUpscaler.name"),
          description: t("imageUpscaler.description"),
          icon: "⬆️",
          status: "available",
        },
        {
          id: "image-converter",
          name: t("imageConverter.name"),
          description: t("imageConverter.description"),
          icon: "🔄",
          status: "available",
        },
      ],
    },
    {
      id: "marketer",
      name: tCategories("marketer.name"),
      nameKo: tCategories("marketer.nameKo"),
      icon: "📊",
      gradient: "from-emerald-500 to-teal-600",
      tools: [
        {
          id: "qr-generator",
          name: t("qrGenerator.name"),
          description: t("qrGenerator.description"),
          icon: "📱",
          status: "available",
        },
        {
          id: "link-shortener",
          name: t("linkShortener.name"),
          description: t("linkShortener.description"),
          icon: "🔗",
          status: "available",
        },
      ],
    },
    {
      id: "writer",
      name: tCategories("writer.name"),
      nameKo: tCategories("writer.nameKo"),
      icon: "✍️",
      gradient: "from-amber-500 to-orange-600",
      tools: [
        {
          id: "markdown-editor",
          name: t("markdownEditor.name"),
          description: t("markdownEditor.description"),
          icon: "📝",
          status: "available",
        },
        {
          id: "word-counter",
          name: t("wordCounter.name"),
          description: t("wordCounter.description"),
          icon: "🔢",
          status: "available",
        },
        {
          id: "lorem-ipsum",
          name: t("loremIpsum.name"),
          description: t("loremIpsum.description"),
          icon: "📄",
          status: "available",
        },
      ],
    },
    {
      id: "productivity",
      name: tCategories("productivity.name"),
      nameKo: tCategories("productivity.nameKo"),
      icon: "⚡",
      gradient: "from-blue-500 to-cyan-600",
      tools: [
        {
          id: "unit-converter",
          name: t("unitConverter.name"),
          description: t("unitConverter.description"),
          icon: "📐",
          status: "available",
        },
        {
          id: "timezone-converter",
          name: t("timezoneConverter.name"),
          description: t("timezoneConverter.description"),
          icon: "🌍",
          status: "available",
        },
        {
          id: "password-generator",
          name: t("passwordGenerator.name"),
          description: t("passwordGenerator.description"),
          icon: "🔐",
          status: "available",
        },
        {
          id: "pomodoro-timer",
          name: t("pomodoroTimer.name"),
          description: t("pomodoroTimer.description"),
          icon: "🍅",
          status: "available",
        },
      ],
    },
  ];

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
