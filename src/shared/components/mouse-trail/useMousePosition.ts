"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TrailPoint } from "./types";

const TRAIL_LENGTH = 8;
const THROTTLE_MS = 16; // ~60fps

export function useMousePosition() {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const lastUpdateTime = useRef(0);
  const pointIdCounter = useRef(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    if (now - lastUpdateTime.current < THROTTLE_MS) return;
    lastUpdateTime.current = now;

    const newPoint: TrailPoint = {
      id: pointIdCounter.current++,
      x: e.clientX,
      y: e.clientY,
      timestamp: now,
    };

    setTrail((prevTrail) => {
      const updatedTrail = [...prevTrail, newPoint];
      // 최대 길이 유지
      if (updatedTrail.length > TRAIL_LENGTH) {
        return updatedTrail.slice(-TRAIL_LENGTH);
      }
      return updatedTrail;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // 오래된 포인트 정리 (200ms 후 페이드아웃)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTrail((prevTrail) =>
        prevTrail.filter((point) => now - point.timestamp < 200)
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return trail;
}
