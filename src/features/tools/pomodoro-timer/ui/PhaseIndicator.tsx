"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/utils";
import { TimerPhase, PomodoroSettings, PHASE_COLORS } from "../model/types";

interface PhaseIndicatorProps {
  currentPhase: TimerPhase;
  currentSessionIndex: number;
  settings: PomodoroSettings;
}

export function PhaseIndicator({
  currentPhase,
  currentSessionIndex,
  settings,
}: PhaseIndicatorProps) {
  const t = useTranslations("tools.pomodoroTimer");
  const totalSessions = settings.sessionsUntilLongBreak;

  // 세션 도트 배열 생성
  const sessionDots = Array.from({ length: totalSessions }, (_, i) => i);

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      {/* 세션 진행 도트 */}
      <div className="flex items-center gap-2">
        {sessionDots.map((index) => {
          const isCompleted = index < currentSessionIndex;
          const isCurrent = index === currentSessionIndex && currentPhase === "work";

          return (
            <div
              key={index}
              className={cn(
                "h-3 w-3 rounded-full transition-all duration-300",
                isCompleted
                  ? PHASE_COLORS.work.bg
                  : isCurrent
                    ? cn(PHASE_COLORS.work.bg, "animate-pulse")
                    : "bg-muted-foreground/30"
              )}
              title={`${t("ui.session")} ${index + 1}`}
            />
          );
        })}
      </div>

      {/* 진행 상태 텍스트 */}
      <p className="text-sm text-muted-foreground">
        {currentPhase === "work" ? (
          <>
            {t("ui.session")} {currentSessionIndex + 1} / {totalSessions}
          </>
        ) : currentPhase === "longBreak" ? (
          t("ui.cycleComplete")
        ) : (
          t("ui.takeBreak")
        )}
      </p>
    </div>
  );
}
