"use client";

import { useTranslations } from "next-intl";

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

  const defaultStats: StatItem[] = [
    {
      value: "15+",
      labelKey: "tools",
      gradient: "from-violet-400 to-purple-400",
    },
    {
      value: "5",
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

  return (
    <section className="border-t border-white/5 bg-white/2 dark:bg-black/20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {displayStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div
                className={`text-4xl md:text-5xl font-bold bg-linear-to-r ${stat.gradient} bg-clip-text text-transparent`}
              >
                {stat.value}
              </div>
              <div className="text-muted-foreground mt-2">
                {t(stat.labelKey)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
