"use client";

import { useRef, RefObject } from "react";
import {
  useScroll,
  useTransform,
  useSpring,
  useInView,
  MotionValue,
  UseScrollOptions,
} from "framer-motion";

interface UseScrollAnimationOptions {
  offset?: UseScrollOptions["offset"];
  smooth?: number;
}

interface ScrollAnimationResult {
  ref: RefObject<HTMLElement | null>;
  scrollYProgress: MotionValue<number>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  y: MotionValue<number>;
}

/**
 * 스크롤 기반 애니메이션을 위한 커스텀 훅
 * 요소가 뷰포트에 들어올 때 opacity, scale, y 값을 애니메이션합니다.
 */
export function useScrollAnimation(
  options: UseScrollAnimationOptions = {}
): ScrollAnimationResult {
  const { offset = ["start end", "end start"], smooth = 0.1 } = options;

  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  // 부드러운 스크롤 값
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // 변환 값들
  const opacity = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    smoothProgress,
    [0, 0.3, 0.7, 1],
    [0.8, 1, 1, 0.8]
  );
  const y = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100]);

  return {
    ref,
    scrollYProgress: smoothProgress,
    opacity,
    scale,
    y,
  };
}

interface UseParallaxOptions {
  speed?: number;
  direction?: "up" | "down";
}

/**
 * 패럴랙스 효과를 위한 훅
 */
export function useParallax(options: UseParallaxOptions = {}): {
  ref: RefObject<HTMLElement | null>;
  y: MotionValue<number>;
} {
  const { speed = 0.5, direction = "up" } = options;

  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const multiplier = direction === "up" ? -1 : 1;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 100 * speed * multiplier]
  );

  return { ref, y };
}

interface UseRevealOptions {
  once?: boolean;
  margin?: `${number}px` | `${number}px ${number}px` | `${number}px ${number}px ${number}px ${number}px`;
  amount?: number | "some" | "all";
}

/**
 * 요소가 뷰포트에 들어왔는지 감지하는 훅
 */
export function useReveal(options: UseRevealOptions = {}): {
  ref: RefObject<HTMLElement | null>;
  isInView: boolean;
} {
  const { once = true, margin = "-100px" as const, amount = 0.3 } = options;

  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once, margin, amount });

  return { ref, isInView };
}

interface UseScrollProgressOptions {
  smooth?: boolean;
}

/**
 * 페이지 전체 스크롤 진행도를 반환하는 훅
 */
export function useScrollProgress(options: UseScrollProgressOptions = {}): {
  scrollYProgress: MotionValue<number>;
  scrollY: MotionValue<number>;
} {
  const { smooth = true } = options;

  const { scrollYProgress, scrollY } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return {
    scrollYProgress: smooth ? smoothProgress : scrollYProgress,
    scrollY,
  };
}

/**
 * 접근성을 고려한 애니메이션 활성화 여부 확인
 */
export function usePrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
