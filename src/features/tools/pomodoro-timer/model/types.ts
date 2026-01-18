/**
 * 뽀모도로 타이머 타입 및 상수 정의
 */

// 타이머 단계 타입
export type TimerPhase = "work" | "break" | "longBreak";

// 타이머 상태 타입
export type TimerStatus = "idle" | "running" | "paused";

// 설정 인터페이스
export interface PomodoroSettings {
  workDuration: number; // 작업 시간 (분) - 15-60분
  breakDuration: number; // 휴식 시간 (분) - 3-15분
  longBreakDuration: number; // 긴 휴식 시간 (분) - 10-30분
  sessionsUntilLongBreak: number; // 긴 휴식까지 필요한 세션 수 - 2-6
  autoStartBreak: boolean; // 자동으로 휴식 시작
  autoStartWork: boolean; // 자동으로 작업 시작
  soundEnabled: boolean; // 사운드 활성화
  notificationEnabled: boolean; // 브라우저 알림 활성화
}

// 일일 통계 인터페이스
export interface DailyStats {
  date: string; // YYYY-MM-DD 형식
  completedSessions: number; // 완료한 작업 세션 수
  totalFocusMinutes: number; // 총 집중 시간 (분)
}

// 기본 설정값
export const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  autoStartBreak: false,
  autoStartWork: false,
  soundEnabled: true,
  notificationEnabled: true,
};

// 설정 범위 제한
export const SETTINGS_LIMITS = {
  workDuration: { min: 15, max: 60, step: 5 },
  breakDuration: { min: 3, max: 15, step: 1 },
  longBreakDuration: { min: 10, max: 30, step: 5 },
  sessionsUntilLongBreak: { min: 2, max: 6, step: 1 },
} as const;

// 단계별 색상 테마
export const PHASE_COLORS = {
  work: {
    bg: "bg-red-500",
    bgLight: "bg-red-500/10",
    text: "text-red-500",
    stroke: "#ef4444",
    border: "border-red-500/30",
  },
  break: {
    bg: "bg-green-500",
    bgLight: "bg-green-500/10",
    text: "text-green-500",
    stroke: "#22c55e",
    border: "border-green-500/30",
  },
  longBreak: {
    bg: "bg-blue-500",
    bgLight: "bg-blue-500/10",
    text: "text-blue-500",
    stroke: "#3b82f6",
    border: "border-blue-500/30",
  },
} as const;

// 단계별 아이콘 이모지
export const PHASE_ICONS = {
  work: "🍅",
  break: "☕",
  longBreak: "🌴",
} as const;
