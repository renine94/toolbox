"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMousePosition } from "./useMousePosition";

/**
 * 마우스 이동 시 부드러운 트레일 효과를 표시하는 컴포넌트
 * - 데스크탑에서만 활성화 (모바일 비활성화)
 * - prefers-reduced-motion 설정을 존중
 */
export function MouseTrail() {
  const trail = useMousePosition();
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // 모바일 또는 동작 줄이기 설정 시 비활성화
    const checkEnabled = () => {
      const isMobile = window.innerWidth < 768;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      setIsEnabled(!isMobile && !prefersReducedMotion);
    };

    checkEnabled();

    // resize 이벤트와 reduced-motion 변경 감지
    window.addEventListener("resize", checkEnabled);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener("change", checkEnabled);

    return () => {
      window.removeEventListener("resize", checkEnabled);
      mediaQuery.removeEventListener("change", checkEnabled);
    };
  }, []);

  if (!isEnabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
      aria-hidden="true"
    >
      <AnimatePresence>
        {trail.map((point, index) => {
          const opacity = (index + 1) / trail.length;
          const scale = 0.3 + (index / trail.length) * 0.7;

          return (
            <motion.div
              key={point.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: opacity * 0.6, scale }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-violet-400 to-purple-400"
              style={{
                left: point.x,
                top: point.y,
                filter: "blur(1px)",
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
