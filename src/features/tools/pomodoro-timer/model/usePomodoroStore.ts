"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  TimerPhase,
  TimerStatus,
  PomodoroSettings,
  DailyStats,
  DEFAULT_SETTINGS,
} from "./types";
import { minutesToSeconds, getTodayDateString } from "../lib/timer-utils";
import {
  showNotification,
  requestNotificationPermission,
} from "../lib/notification-utils";
import {
  playWorkCompleteSound,
  playBreakCompleteSound,
  playLongBreakCompleteSound,
} from "../lib/sound-utils";

interface PomodoroState {
  // 타이머 상태
  phase: TimerPhase;
  status: TimerStatus;
  timeRemaining: number; // 초 단위
  currentSessionIndex: number; // 현재 세션 (0부터 시작)

  // 설정
  settings: PomodoroSettings;

  // 통계
  todayStats: DailyStats;

  // 액션
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  tick: () => void;
  updateSettings: (newSettings: Partial<PomodoroSettings>) => void;
  enableNotifications: () => Promise<boolean>;

  // 헬퍼
  getTotalDuration: () => number;
}

// 초기 통계 생성
const createInitialStats = (): DailyStats => ({
  date: getTodayDateString(),
  completedSessions: 0,
  totalFocusMinutes: 0,
});

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      phase: "work",
      status: "idle",
      timeRemaining: minutesToSeconds(DEFAULT_SETTINGS.workDuration),
      currentSessionIndex: 0,
      settings: DEFAULT_SETTINGS,
      todayStats: createInitialStats(),

      // 타이머 시작
      start: () => {
        const { status, settings } = get();

        // 알림 권한 요청 (처음 시작 시)
        if (settings.notificationEnabled) {
          requestNotificationPermission();
        }

        if (status === "idle") {
          // 처음 시작 시 오늘 통계 확인 및 초기화
          const today = getTodayDateString();
          const currentStats = get().todayStats;

          if (currentStats.date !== today) {
            set({ todayStats: createInitialStats() });
          }
        }

        set({ status: "running" });
      },

      // 타이머 일시정지
      pause: () => {
        set({ status: "paused" });
      },

      // 타이머 리셋
      reset: () => {
        const { settings, phase } = get();
        let duration: number;

        switch (phase) {
          case "work":
            duration = settings.workDuration;
            break;
          case "break":
            duration = settings.breakDuration;
            break;
          case "longBreak":
            duration = settings.longBreakDuration;
            break;
        }

        set({
          status: "idle",
          timeRemaining: minutesToSeconds(duration),
        });
      },

      // 현재 단계 스킵
      skip: () => {
        const state = get();
        handlePhaseComplete(state, set);
      },

      // 1초 감소 (매 초마다 호출)
      tick: () => {
        const state = get();

        if (state.status !== "running") return;

        const newTime = state.timeRemaining - 1;

        if (newTime <= 0) {
          // 단계 완료
          handlePhaseComplete(state, set);
        } else {
          set({ timeRemaining: newTime });
        }
      },

      // 설정 업데이트
      updateSettings: (newSettings) => {
        const { settings, phase, status } = get();
        const updatedSettings = { ...settings, ...newSettings };

        set({ settings: updatedSettings });

        // 타이머가 idle 상태일 때만 시간 업데이트
        if (status === "idle") {
          let duration: number;
          switch (phase) {
            case "work":
              duration = updatedSettings.workDuration;
              break;
            case "break":
              duration = updatedSettings.breakDuration;
              break;
            case "longBreak":
              duration = updatedSettings.longBreakDuration;
              break;
          }
          set({ timeRemaining: minutesToSeconds(duration) });
        }
      },

      // 알림 활성화
      enableNotifications: async () => {
        const granted = await requestNotificationPermission();
        if (granted) {
          set((state) => ({
            settings: { ...state.settings, notificationEnabled: true },
          }));
        }
        return granted;
      },

      // 현재 단계의 총 시간 반환
      getTotalDuration: () => {
        const { phase, settings } = get();
        switch (phase) {
          case "work":
            return minutesToSeconds(settings.workDuration);
          case "break":
            return minutesToSeconds(settings.breakDuration);
          case "longBreak":
            return minutesToSeconds(settings.longBreakDuration);
        }
      },
    }),
    {
      name: "pomodoro-storage",
      // 설정과 통계만 저장 (타이머 상태는 저장하지 않음)
      partialize: (state) => ({
        settings: state.settings,
        todayStats: state.todayStats,
      }),
    }
  )
);

// 단계 완료 처리 (내부 함수)
function handlePhaseComplete(
  state: PomodoroState,
  set: (partial: Partial<PomodoroState> | ((state: PomodoroState) => Partial<PomodoroState>)) => void
) {
  const { phase, settings, currentSessionIndex, todayStats } = state;
  const today = getTodayDateString();

  // 오늘 날짜가 다르면 통계 초기화
  let stats = todayStats;
  if (stats.date !== today) {
    stats = createInitialStats();
  }

  let nextPhase: TimerPhase;
  let nextDuration: number;
  let nextSessionIndex = currentSessionIndex;
  let newStats = { ...stats };

  if (phase === "work") {
    // 작업 완료
    newStats = {
      ...stats,
      completedSessions: stats.completedSessions + 1,
      totalFocusMinutes: stats.totalFocusMinutes + settings.workDuration,
    };

    // 사운드 및 알림
    if (settings.soundEnabled) {
      playWorkCompleteSound();
    }
    if (settings.notificationEnabled) {
      showNotification(
        "🍅 작업 완료!",
        `${settings.workDuration}분 작업을 완료했습니다. 휴식을 취하세요.`
      );
    }

    // 다음 단계 결정
    nextSessionIndex = currentSessionIndex + 1;
    if (nextSessionIndex >= settings.sessionsUntilLongBreak) {
      nextPhase = "longBreak";
      nextDuration = settings.longBreakDuration;
      nextSessionIndex = 0; // 리셋
    } else {
      nextPhase = "break";
      nextDuration = settings.breakDuration;
    }
  } else {
    // 휴식 완료
    if (settings.soundEnabled) {
      if (phase === "longBreak") {
        playLongBreakCompleteSound();
      } else {
        playBreakCompleteSound();
      }
    }
    if (settings.notificationEnabled) {
      showNotification(
        "☕ 휴식 완료!",
        "다시 집중할 시간입니다. 화이팅!"
      );
    }

    nextPhase = "work";
    nextDuration = settings.workDuration;
  }

  // 자동 시작 여부 결정
  const shouldAutoStart =
    (phase === "work" && settings.autoStartBreak) ||
    (phase !== "work" && settings.autoStartWork);

  set({
    phase: nextPhase,
    timeRemaining: minutesToSeconds(nextDuration),
    currentSessionIndex: nextSessionIndex,
    status: shouldAutoStart ? "running" : "idle",
    todayStats: newStats,
  });
}
