/**
 * Countdown Timer Generator Types
 */

// 테마 프리셋 타입
export type ThemePreset =
  | "modern-dark"
  | "clean-white"
  | "gradient"
  | "neon"
  | "minimal"
  | "retro";

// 테마 설정 인터페이스
export interface ThemeConfig {
  id: ThemePreset;
  name: string;
  backgroundColor: string;
  textColor: string;
  labelColor: string;
  boxBackgroundColor: string;
  boxBorderColor: string;
  fontFamily: string;
  hasGlow?: boolean;
  glowColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

// 카운트다운 설정 인터페이스
export interface CountdownConfig {
  targetDate: string; // ISO string
  title: string;
  showLabels: boolean;
  fontSize: number;
  borderRadius: number;
  width: number;
  height: number;
  theme: ThemePreset;
  customTheme?: Partial<ThemeConfig>;
}

// 카운트다운 표시 데이터
export interface CountdownDisplay {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

// 기본 설정 값
export const DEFAULT_COUNTDOWN_CONFIG: CountdownConfig = {
  targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7일 후
  title: "",
  showLabels: true,
  fontSize: 48,
  borderRadius: 12,
  width: 600,
  height: 200,
  theme: "modern-dark",
};

// 테마 프리셋 정의
export const THEME_PRESETS: ThemeConfig[] = [
  {
    id: "modern-dark",
    name: "Modern Dark",
    backgroundColor: "#1a1a2e",
    textColor: "#eaeaea",
    labelColor: "#a0a0a0",
    boxBackgroundColor: "#16213e",
    boxBorderColor: "#0f3460",
    fontFamily: "monospace",
  },
  {
    id: "clean-white",
    name: "Clean White",
    backgroundColor: "#ffffff",
    textColor: "#1a1a1a",
    labelColor: "#666666",
    boxBackgroundColor: "#f5f5f5",
    boxBorderColor: "#e0e0e0",
    fontFamily: "sans-serif",
  },
  {
    id: "gradient",
    name: "Gradient",
    backgroundColor: "#667eea",
    textColor: "#ffffff",
    labelColor: "#e0e0ff",
    boxBackgroundColor: "rgba(255, 255, 255, 0.15)",
    boxBorderColor: "rgba(255, 255, 255, 0.25)",
    fontFamily: "sans-serif",
    gradientFrom: "#667eea",
    gradientTo: "#764ba2",
  },
  {
    id: "neon",
    name: "Neon",
    backgroundColor: "#0a0a0a",
    textColor: "#00ff88",
    labelColor: "#00cc6a",
    boxBackgroundColor: "#111111",
    boxBorderColor: "#00ff88",
    fontFamily: "monospace",
    hasGlow: true,
    glowColor: "#00ff88",
  },
  {
    id: "minimal",
    name: "Minimal",
    backgroundColor: "#fafafa",
    textColor: "#333333",
    labelColor: "#888888",
    boxBackgroundColor: "transparent",
    boxBorderColor: "#dddddd",
    fontFamily: "system-ui",
  },
  {
    id: "retro",
    name: "Retro",
    backgroundColor: "#2d1b00",
    textColor: "#ffcc00",
    labelColor: "#cc9900",
    boxBackgroundColor: "#3d2b10",
    boxBorderColor: "#5d4b30",
    fontFamily: "serif",
  },
];

// 테마 ID로 테마 설정 가져오기
export function getThemeConfig(themeId: ThemePreset): ThemeConfig {
  return (
    THEME_PRESETS.find((t) => t.id === themeId) ??
    THEME_PRESETS[0]
  );
}

// 단위 레이블
export const TIME_LABELS = {
  ko: {
    days: "일",
    hours: "시간",
    minutes: "분",
    seconds: "초",
  },
  en: {
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
  },
  ja: {
    days: "日",
    hours: "時間",
    minutes: "分",
    seconds: "秒",
  },
  zh: {
    days: "天",
    hours: "小时",
    minutes: "分钟",
    seconds: "秒",
  },
} as const;
