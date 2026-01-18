"use client";

import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Zap, X, Compass } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useQuickAccessStore } from "../model/useQuickAccessStore";
import { QuickAccessToolItem } from "./QuickAccessToolItem";

export function QuickAccessButton() {
  const t = useTranslations("quickAccess");
  const [mounted, setMounted] = useState(false);
  const { isOpen, open, close, getRecentTools, hasUsageHistory } =
    useQuickAccessStore();

  // Hydration 에러 방지: 클라이언트 마운트 후에만 렌더링
  useEffect(() => {
    setMounted(true);
  }, []);

  const recentTools = getRecentTools(5);
  const showButton = hasUsageHistory();

  // ESC 키로 닫기
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        close();
      }
    },
    [isOpen, close]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // 패널 열릴 때 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // 서버 렌더링 시 또는 사용 기록이 없으면 렌더링하지 않음
  if (!mounted || !showButton) return null;

  return (
    <>
      {/* 플로팅 버튼 */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={open}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center group"
            aria-label={t("title")}
          >
            <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />
            {/* 사용 기록 수 뱃지 */}
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-purple-600 text-xs font-bold flex items-center justify-center shadow-md">
              {recentTools.length}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 오버레이 + 패널 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 배경 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* 패널 */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0, y: 200, x: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0, x: 0 }}
              exit={{ scale: 0.3, opacity: 0, y: 200, x: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl pointer-events-auto overflow-hidden">
                {/* 헤더 */}
                <div className="relative px-6 py-5 bg-gradient-to-br from-violet-500/10 to-purple-600/10 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-foreground">
                          {t("title")}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {t("subtitle")}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={close}
                      className="w-9 h-9 rounded-full bg-background/80 hover:bg-background text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
                      aria-label={t("close") || "Close"}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* 도구 목록 */}
                <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
                  {recentTools.length > 0 ? (
                    recentTools.map((usage, index) => (
                      <QuickAccessToolItem
                        key={usage.toolId}
                        toolId={usage.toolId}
                        rank={index}
                        onSelect={close}
                      />
                    ))
                  ) : (
                    <EmptyState onClose={close} />
                  )}
                </div>

                {/* 푸터 */}
                <div className="px-6 py-3 bg-muted/30 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    {t("footer")}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function EmptyState({ onClose }: { onClose: () => void }) {
  const t = useTranslations("quickAccess.empty");

  return (
    <div className="py-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
        <Compass className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-foreground mb-1">{t("title")}</h3>
      <p className="text-sm text-muted-foreground mb-4">{t("description")}</p>
      <Link
        href="/"
        onClick={onClose}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        {t("cta")}
      </Link>
    </div>
  );
}
