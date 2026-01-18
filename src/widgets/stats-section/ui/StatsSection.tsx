"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { AnimatedCounter, AnimatedText } from "@/shared/ui/animated-counter";
import { statsContainer, statItem } from "@/shared/lib/animations";

interface StatItem {
  value: string | number;
  labelKey: string;
  gradient: string;
}

interface StatsSectionProps {
  stats?: StatItem[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  const t = useTranslations("home.stats");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const defaultStats: StatItem[] = [
    {
      value: 15,
      labelKey: "tools",
      gradient: "from-violet-400 to-purple-400",
    },
    {
      value: 5,
      labelKey: "categories",
      gradient: "from-pink-400 to-rose-400",
    },
    {
      value: t("free"),
      labelKey: "price",
      gradient: "from-emerald-400 to-teal-400",
    },
    {
      value: t("unlimited"),
      labelKey: "usage",
      gradient: "from-amber-400 to-orange-400",
    },
  ];

  const displayStats = stats || defaultStats;

  // 숫자인지 문자열인지 판단하여 적절한 컴포넌트 반환
  const renderValue = (value: string | number, gradient: string) => {
    if (typeof value === "number") {
      return (
        <AnimatedCounter
          value={value}
          suffix="+"
          className={`text-4xl md:text-5xl font-bold bg-linear-to-r ${gradient} bg-clip-text text-transparent`}
        />
      );
    }
    return (
      <AnimatedText
        text={value}
        className={`text-4xl md:text-5xl font-bold bg-linear-to-r ${gradient} bg-clip-text text-transparent`}
      />
    );
  };

  return (
    <section className="border-t border-white/5 bg-white/2 dark:bg-black/20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          variants={statsContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {displayStats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              variants={statItem}
            >
              <div>
                {renderValue(stat.value, stat.gradient)}
              </div>
              <motion.div
                className="text-muted-foreground mt-2"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
              >
                {t(stat.labelKey)}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
