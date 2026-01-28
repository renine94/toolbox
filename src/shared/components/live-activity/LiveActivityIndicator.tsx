"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLiveActivity } from "./useLiveActivity";

/**
 * 실시간 사용 현황을 표시하는 인디케이터
 * - 가짜 데이터를 사용하여 활성 사용자 수 표시
 * - 부드러운 바운스 애니메이션으로 주목도 향상
 */
export function LiveActivityIndicator() {
  const { count, isVisible } = useLiveActivity();
  const t = useTranslations("home.liveActivity");

  return (
    <AnimatePresence>
      {isVisible && count !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: [0, -8, 0],
          }}
          exit={{ opacity: 0, y: -10 }}
          transition={{
            opacity: { duration: 0.4, ease: "easeOut" },
            y: {
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            },
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-600 dark:text-emerald-400 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Users className="h-4 w-4" />
          <motion.span
            key={count}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="font-medium tabular-nums"
          >
            {t("message", { count })}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
