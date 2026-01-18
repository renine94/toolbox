"use client";

import { useTranslations } from "next-intl";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { TimerStatus, TimerPhase, PHASE_COLORS } from "../model/types";

interface ControlButtonsProps {
  status: TimerStatus;
  phase: TimerPhase;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export function ControlButtons({
  status,
  phase,
  onStart,
  onPause,
  onReset,
  onSkip,
}: ControlButtonsProps) {
  const t = useTranslations("tools.pomodoroTimer.ui");
  const colors = PHASE_COLORS[phase];

  const isRunning = status === "running";

  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      {/* 리셋 버튼 */}
      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        className="h-12 w-12 rounded-full"
        title={t("reset")}
      >
        <RotateCcw className="h-5 w-5" />
      </Button>

      {/* 시작/일시정지 버튼 */}
      <Button
        size="lg"
        onClick={isRunning ? onPause : onStart}
        className={cn(
          "h-16 w-16 rounded-full shadow-lg transition-transform hover:scale-105",
          colors.bg,
          "hover:opacity-90"
        )}
        title={isRunning ? t("pause") : t("start")}
      >
        {isRunning ? (
          <Pause className="h-7 w-7 text-white" />
        ) : (
          <Play className="h-7 w-7 text-white ml-1" />
        )}
      </Button>

      {/* 스킵 버튼 */}
      <Button
        variant="outline"
        size="icon"
        onClick={onSkip}
        className="h-12 w-12 rounded-full"
        title={t("skip")}
      >
        <SkipForward className="h-5 w-5" />
      </Button>
    </div>
  );
}
