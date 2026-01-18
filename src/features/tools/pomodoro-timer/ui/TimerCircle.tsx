"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/utils";
import { TimerPhase } from "../model/types";
import { PHASE_COLORS, PHASE_ICONS } from "../model/types";
import {
  formatTime,
  calculateCircumference,
  calculateStrokeDashoffset,
  calculateProgress,
} from "../lib/timer-utils";

interface TimerCircleProps {
  timeRemaining: number;
  totalDuration: number;
  phase: TimerPhase;
  isRunning: boolean;
}

// SVG 설정
const SIZE = 280;
const STROKE_WIDTH = 8;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CENTER = SIZE / 2;

export function TimerCircle({
  timeRemaining,
  totalDuration,
  phase,
  isRunning,
}: TimerCircleProps) {
  const t = useTranslations("tools.pomodoroTimer");

  const circumference = useMemo(() => calculateCircumference(RADIUS), []);

  const progress = useMemo(
    () => calculateProgress(timeRemaining, totalDuration),
    [timeRemaining, totalDuration]
  );

  const strokeDashoffset = useMemo(
    () => calculateStrokeDashoffset(progress, circumference),
    [progress, circumference]
  );

  const colors = PHASE_COLORS[phase];
  const icon = PHASE_ICONS[phase];

  const phaseLabel = useMemo(() => {
    switch (phase) {
      case "work":
        return t("phases.work");
      case "break":
        return t("phases.break");
      case "longBreak":
        return t("phases.longBreak");
    }
  }, [phase, t]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* SVG 원형 프로그레스 */}
      <div className="relative">
        <svg
          width={SIZE}
          height={SIZE}
          className="transform -rotate-90"
          style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))" }}
        >
          {/* 배경 원 */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            className="text-muted-foreground/20"
          />
          {/* 프로그레스 원 */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* 중앙 콘텐츠 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* 단계 아이콘 */}
          <span className="text-3xl mb-2" role="img" aria-label={phaseLabel}>
            {icon}
          </span>

          {/* 시간 표시 */}
          <span
            className={cn(
              "font-mono text-5xl font-bold tabular-nums tracking-tight",
              colors.text
            )}
          >
            {formatTime(timeRemaining)}
          </span>

          {/* 단계 레이블 */}
          <span
            className={cn(
              "mt-2 text-sm font-medium uppercase tracking-wider",
              colors.text
            )}
          >
            {phaseLabel}
          </span>

          {/* 실행 상태 인디케이터 */}
          {isRunning && (
            <div className="mt-3 flex items-center gap-1">
              <span
                className={cn("h-2 w-2 rounded-full animate-pulse", colors.bg)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
