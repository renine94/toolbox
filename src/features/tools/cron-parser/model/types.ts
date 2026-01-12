// Cron 필드 타입 (5필드 표준 cron)
export type CronFieldType =
  | "minute"
  | "hour"
  | "dayOfMonth"
  | "month"
  | "dayOfWeek";

// 필드 값 타입
export type CronValueType = "any" | "specific" | "range" | "step" | "list";

// 개별 필드 파싱 결과
export interface CronFieldValue {
  type: CronValueType;
  value: string;
  parsed: number[];
  isValid: boolean;
  error?: string;
}

// 전체 Cron 표현식 파싱 결과
export interface ParsedCronExpression {
  minute: CronFieldValue;
  hour: CronFieldValue;
  dayOfMonth: CronFieldValue;
  month: CronFieldValue;
  dayOfWeek: CronFieldValue;
  isValid: boolean;
  errors: string[];
}

// 필드 메타데이터
export interface CronFieldMeta {
  name: CronFieldType;
  label: string;
  min: number;
  max: number;
  allowedSpecial: string[];
}

// 다음 실행 시간
export interface NextExecution {
  date: Date;
  formatted: string;
  relative: string;
}

// 프리셋 카테고리
export type PresetCategory = "common" | "advanced";

// Cron 프리셋
export interface CronPreset {
  expression: string;
  labelKey: string;
  descriptionKey: string;
  category: PresetCategory;
}

// 치트시트 필드
export interface CheatsheetField {
  field: CronFieldType;
  range: string;
}

// 치트시트 특수 문자
export interface CheatsheetSpecialChar {
  char: string;
  meaningKey: string;
}

// Zustand 스토어 상태
export interface CronState {
  // 현재 표현식 상태
  expression: string;
  parsed: ParsedCronExpression | null;
  nextExecutions: NextExecution[];
  executionCount: number;

  // 빌더 필드 상태
  builderFields: {
    minute: string;
    hour: string;
    dayOfMonth: string;
    month: string;
    dayOfWeek: string;
  };

  // 액션
  setExpression: (expression: string) => void;
  setExecutionCount: (count: number) => void;
  setBuilderField: (field: CronFieldType, value: string) => void;
  applyBuilderToExpression: () => void;
  loadPreset: (preset: CronPreset) => void;
  clear: () => void;
}

// 필드 메타데이터 상수
export const CRON_FIELDS: CronFieldMeta[] = [
  {
    name: "minute",
    label: "minute",
    min: 0,
    max: 59,
    allowedSpecial: ["*", "/", "-", ","],
  },
  {
    name: "hour",
    label: "hour",
    min: 0,
    max: 23,
    allowedSpecial: ["*", "/", "-", ","],
  },
  {
    name: "dayOfMonth",
    label: "dayOfMonth",
    min: 1,
    max: 31,
    allowedSpecial: ["*", "/", "-", ","],
  },
  {
    name: "month",
    label: "month",
    min: 1,
    max: 12,
    allowedSpecial: ["*", "/", "-", ","],
  },
  {
    name: "dayOfWeek",
    label: "dayOfWeek",
    min: 0,
    max: 6,
    allowedSpecial: ["*", "/", "-", ","],
  },
];

// 기본 표현식 (평일 오전 9시)
export const DEFAULT_EXPRESSION = "0 9 * * 1-5";

// 기본 빌더 필드
export const DEFAULT_BUILDER_FIELDS = {
  minute: "*",
  hour: "*",
  dayOfMonth: "*",
  month: "*",
  dayOfWeek: "*",
};

// 월 이름 매핑
export const MONTH_NAMES = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

// 요일 이름 매핑
export const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
