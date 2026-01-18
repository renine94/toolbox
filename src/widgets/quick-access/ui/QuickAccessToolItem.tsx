"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { getToolMetadata, toolIdToTranslationKey } from "../lib/tool-registry";

interface QuickAccessToolItemProps {
  toolId: string;
  rank: number;
  onSelect: () => void;
}

export function QuickAccessToolItem({
  toolId,
  rank,
  onSelect,
}: QuickAccessToolItemProps) {
  const t = useTranslations("tools");
  const tool = getToolMetadata(toolId);

  if (!tool) return null;

  const translationKey = toolIdToTranslationKey(toolId);
  const name = t(`${translationKey}.name`);
  const description = t(`${translationKey}.description`);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
    >
      <Link
        href={`/${toolId}`}
        onClick={onSelect}
        className="group flex items-center gap-4 p-3 rounded-xl bg-background/50 hover:bg-background/80 border border-border/50 hover:border-border transition-all duration-200"
      >
        {/* 순번 뱃지 */}
        <div className="relative flex-shrink-0">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-xl shadow-lg group-hover:scale-105 transition-transform duration-200`}
          >
            <span className="drop-shadow-sm">{tool.icon}</span>
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md">
            {rank + 1}
          </div>
        </div>

        {/* 도구 정보 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {description}
          </p>
        </div>

        {/* 화살표 아이콘 */}
        <div className="flex-shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}
