"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  heroContainer,
  heroBadge,
  heroTitle,
  heroDescription,
  staggerContainer,
  fadeInUp,
  tapScale,
} from "@/shared/lib/animations";

interface Category {
  id: string;
  nameKo: string;
  icon: string;
}

interface HeroSectionProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export function HeroSection({
  categories,
  selectedCategory,
  onCategoryChange,
}: HeroSectionProps) {
  const t = useTranslations("home.hero");
  const tCommon = useTranslations("common.buttons");

  return (
    <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
      <motion.div
        variants={heroContainer}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Badge */}
        <motion.div
          variants={heroBadge}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border text-sm text-muted-foreground"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          {t("badge")}
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={heroTitle}
          className="text-5xl md:text-7xl font-bold text-foreground leading-tight"
        >
          {t("titleLine1")}
          <br />
          <span className="bg-linear-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t("titleLine2")}
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={heroDescription}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          {t("description")}
        </motion.p>

        {/* Category Buttons */}
        <motion.div
          variants={staggerContainer}
          className="flex flex-wrap justify-center gap-4 pt-6"
        >
          {/* View All Button */}
          <motion.button
            variants={fadeInUp}
            onClick={() => onCategoryChange(null)}
            whileHover={{ scale: 1.03 }}
            whileTap={tapScale}
            className={`relative px-6 py-3 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedCategory === null
                ? "text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent"
            }`}
          >
            {selectedCategory === null && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/25"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tCommon("viewAll")}</span>
          </motion.button>

          {/* Category Buttons */}
          {categories.map((category) => (
            <motion.button
              key={category.id}
              variants={fadeInUp}
              onClick={() =>
                onCategoryChange(
                  selectedCategory === category.id ? null : category.id
                )
              }
              whileHover={{ scale: 1.03 }}
              whileTap={tapScale}
              className={`relative px-6 py-3 rounded-full text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                selectedCategory === category.id
                  ? "text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent"
              }`}
            >
              {selectedCategory === category.id && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/25"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{category.icon}</span>
              <span className="relative z-10">{category.nameKo}</span>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
