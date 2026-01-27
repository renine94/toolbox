"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { useCountdownStore } from "../model/useCountdownStore";
import { calculateCountdown } from "../lib/countdown-utils";
import { CountdownDisplay } from "./CountdownDisplay";
import { CountdownDisplay as CountdownDisplayType, TIME_LABELS } from "../model/types";

export const TIMER_PREVIEW_ID = "countdown-timer-preview";

export function TimerPreview() {
  const locale = useLocale() as keyof typeof TIME_LABELS;
  const { config } = useCountdownStore();
  const [countdown, setCountdown] = useState<CountdownDisplayType>(() =>
    calculateCountdown(config.targetDate)
  );
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 초기 계산
    setCountdown(calculateCountdown(config.targetDate));

    // 1초마다 업데이트
    const interval = setInterval(() => {
      setCountdown(calculateCountdown(config.targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [config.targetDate]);

  return (
    <div className="flex items-center justify-center">
      <div
        id={TIMER_PREVIEW_ID}
        ref={previewRef}
        className="overflow-hidden"
        style={{ borderRadius: config.borderRadius }}
      >
        <CountdownDisplay countdown={countdown} />
      </div>
    </div>
  );
}
