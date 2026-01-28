"use client";

import { useCallback, useEffect, useState } from "react";

const MIN_COUNT = 127;
const MAX_COUNT = 389;
const UPDATE_INTERVAL = 5000; // 5초마다 업데이트

function getRandomCount(current: number): number {
  // 현재 값에서 ±15 범위 내에서 변동
  const delta = Math.floor(Math.random() * 31) - 15;
  const newCount = current + delta;

  // 범위 내에서 유지
  return Math.min(MAX_COUNT, Math.max(MIN_COUNT, newCount));
}

function getInitialCount(): number {
  return MIN_COUNT + Math.floor(Math.random() * (MAX_COUNT - MIN_COUNT));
}

export function useLiveActivity() {
  const [count, setCount] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const updateCount = useCallback(() => {
    setCount((prev) => {
      if (prev === null) return getInitialCount();
      return getRandomCount(prev);
    });
  }, []);

  useEffect(() => {
    // 초기 값 설정 (클라이언트에서만)
    setCount(getInitialCount());

    // 잠시 후 표시 (부드러운 등장)
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    // 주기적 업데이트
    const interval = setInterval(updateCount, UPDATE_INTERVAL);

    return () => {
      clearTimeout(showTimer);
      clearInterval(interval);
    };
  }, [updateCount]);

  return { count, isVisible };
}
