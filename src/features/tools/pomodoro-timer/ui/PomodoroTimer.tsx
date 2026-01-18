"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/shared/ui/card";
import { usePomodoroStore } from "../model/usePomodoroStore";
import { TimerCircle } from "./TimerCircle";
import { ControlButtons } from "./ControlButtons";
import { PhaseIndicator } from "./PhaseIndicator";
import { SettingsPanel } from "./SettingsPanel";
import { SessionStats } from "./SessionStats";

export function PomodoroTimer() {
  const {
    phase,
    status,
    timeRemaining,
    currentSessionIndex,
    settings,
    todayStats,
    start,
    pause,
    reset,
    skip,
    tick,
    updateSettings,
    enableNotifications,
    getTotalDuration,
  } = usePomodoroStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 타이머 인터벌 관리
  useEffect(() => {
    if (status === "running") {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, tick]);

  // 브라우저 탭 타이틀 업데이트
  useEffect(() => {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    const timeStr = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

    const phaseEmoji = phase === "work" ? "🍅" : phase === "break" ? "☕" : "🌴";

    if (status === "running") {
      document.title = `${timeStr} ${phaseEmoji} Pomodoro Timer`;
    } else {
      document.title = "Pomodoro Timer";
    }

    return () => {
      document.title = "Pomodoro Timer";
    };
  }, [timeRemaining, phase, status]);

  const totalDuration = getTotalDuration();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 왼쪽: 타이머 영역 */}
      <Card className="lg:row-span-2">
        <CardContent className="flex flex-col items-center justify-center p-8 min-h-[500px]">
          <TimerCircle
            timeRemaining={timeRemaining}
            totalDuration={totalDuration}
            phase={phase}
            isRunning={status === "running"}
          />

          <ControlButtons
            status={status}
            phase={phase}
            onStart={start}
            onPause={pause}
            onReset={reset}
            onSkip={skip}
          />

          <PhaseIndicator
            currentPhase={phase}
            currentSessionIndex={currentSessionIndex}
            settings={settings}
          />
        </CardContent>
      </Card>

      {/* 오른쪽 상단: 설정 패널 */}
      <SettingsPanel
        settings={settings}
        timerStatus={status}
        onUpdateSettings={updateSettings}
        onEnableNotifications={enableNotifications}
      />

      {/* 오른쪽 하단: 통계 */}
      <SessionStats
        stats={todayStats}
        currentSessionIndex={currentSessionIndex}
        settings={settings}
      />
    </div>
  );
}
