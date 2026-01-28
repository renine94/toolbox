"use client";

import { useCallback, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

/**
 * 클릭 시 파티클 효과를 발생시키는 컴포넌트
 * - prefers-reduced-motion 설정을 존중
 * - 100ms 쓰로틀링으로 과도한 발생 방지
 */
export function ClickParticles() {
  const lastClickTime = useRef(0);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    // 동작 줄이기 설정 확인
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mediaQuery.matches;

    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    // 동작 줄이기가 활성화되면 실행하지 않음
    if (prefersReducedMotion.current) return;

    // 인터랙티브 요소 클릭은 무시 (버튼, 링크, 입력 등)
    const target = e.target as HTMLElement;
    if (
      target.tagName === "BUTTON" ||
      target.tagName === "A" ||
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT" ||
      target.closest("button") ||
      target.closest("a") ||
      target.closest("input") ||
      target.closest("[role='button']") ||
      target.closest("[data-no-particles]")
    ) {
      return;
    }

    // 100ms 쓰로틀링
    const now = Date.now();
    if (now - lastClickTime.current < 100) return;
    lastClickTime.current = now;

    // 클릭 위치를 0-1 범위로 정규화
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    // 모바일 여부에 따라 파티클 수 조절
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 15 : 30;

    // 컨페티 발생
    confetti({
      particleCount,
      spread: 60,
      origin: { x, y },
      colors: ["#8b5cf6", "#a855f7", "#c084fc", "#d946ef", "#f472b6"],
      gravity: 0.8,
      drift: 0,
      scalar: 0.8,
      decay: 0.9,
      ticks: 100,
      disableForReducedMotion: true,
    });
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [handleClick]);

  // 이 컴포넌트는 이벤트 리스너만 등록하므로 아무것도 렌더링하지 않음
  return null;
}
